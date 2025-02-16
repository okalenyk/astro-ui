// TODO Requires localisation

import React, { FC, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import { useFormContext } from 'react-hook-form';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { GroupedSelect } from 'astro_2.0/features/CreateProposal/components/GroupedSelect';

import { getFormInitialValues } from 'astro_2.0/features/CreateProposal/helpers/initialValues';

import { useWalletContext } from 'context/WalletContext';

import { ProposalVariant } from 'types/proposal';
import { FunctionCallType } from 'astro_2.0/features/CreateProposal/components/CustomFunctionCallContent/types';

import { useDaoSettings } from 'astro_2.0/features/DaoDashboardHeader/components/CloneDaoWarning/hooks';
import { useProposalTemplates } from 'astro_2.0/features/pages/nestedDaoPagesContent/CustomFunctionCallTemplatesPageContent/hooks';
import {
  DEFAULT_PROPOSAL_GAS,
  DEFAULT_UPGRADE_DAO_PROPOSALS_GAS,
} from 'services/sputnik/constants';
import { formatYoktoValue } from 'utils/format';
import { useCustomTokensContext } from 'astro_2.0/features/CustomTokens/CustomTokensContext';

import styles from './FunctionCallTypeSelector.module.scss';

interface Props {
  daoId: string;
}

type Option = {
  title: string;
  disabled: boolean;
  options: {
    label: string;
    value: FunctionCallType | string;
    group: string;
  }[];
};

export const FunctionCallTypeSelector: FC<Props> = ({ daoId }) => {
  const { t } = useTranslation();

  const { register, reset } = useFormContext();
  const { accountId } = useWalletContext();
  const { templates } = useProposalTemplates(daoId);
  const { tokens } = useCustomTokensContext();
  const { settings } = useDaoSettings(daoId);

  const { voteInOtherDao } = useFlags();

  const options = useMemo(() => {
    const templateOptions = [
      {
        label: 'Buy NFT from Mintbase',
        value: FunctionCallType.BuyNFTfromMintbase,
        group: 'Templates',
      },
      {
        label: 'Transfer NFT from DAO',
        value: FunctionCallType.TransferNFTfromMintbase,
        group: 'Templates',
      },
      {
        label: 'Buy NFT from Paras',
        value: FunctionCallType.BuyNFTfromParas,
        group: 'Templates',
      },
      // Temp disable - we want to implement integration with SC to fetch required data
      // {
      //   label: 'Swaps on Ref',
      //   value: FunctionCallType.SwapsOnRef,
      //   group: 'Templates',
      // },
    ];

    if (settings?.daoUpgrade?.versionHash) {
      templateOptions.push({
        label: 'Remove upgrade code',
        value: FunctionCallType.RemoveUpgradeCode,
        group: 'Templates',
      });
    }

    if (voteInOtherDao) {
      templateOptions.push({
        label: 'Vote in Another DAO',
        value: FunctionCallType.VoteInAnotherDao,
        group: 'Templates',
      });
    }

    const result: Option[] = [
      {
        title: '',
        disabled: false,
        options: [
          {
            label: 'Custom',
            value: FunctionCallType.Custom,
            group: '',
          },
        ],
      },
      {
        title: 'Templates',
        disabled: false,
        options: templateOptions,
      },
    ];

    if (templates) {
      const filteredTemplates = templates.filter(item => item.isEnabled);

      if (filteredTemplates.length) {
        result.push({
          title: 'Custom Templates',
          disabled: false,
          options: filteredTemplates.map(item => ({
            label: item.name,
            value: item.id ?? '',
            group: 'Custom Templates',
          })),
        });
      }
    }

    return result;
  }, [settings?.daoUpgrade?.versionHash, templates, voteInOtherDao]);

  return (
    <div className={styles.root}>
      <GroupedSelect
        caption="Type"
        inputStyles={{ fontSize: 16 }}
        defaultValue={FunctionCallType.Custom}
        options={options}
        {...register('functionCallType')}
        onChange={async v => {
          let initialValues = {};
          const predefinedTypes = Object.values(FunctionCallType) as string[];

          if (v && !predefinedTypes.includes(v)) {
            const template = templates.find(item => item.id === v);

            if (template) {
              const { config } = template;

              const parsedJson = config.json
                ? decodeURIComponent(config.json as string)
                    .trim()
                    .replace(/\\/g, '')
                : '';

              const tokenData = config.token
                ? tokens[config.token]
                : tokens.NEAR;

              initialValues = {
                smartContractAddress: config.smartContractAddress,
                methodName: config.methodName,
                actionsGas: config.actionsGas
                  ? Number(config.actionsGas) / 10 ** 12
                  : DEFAULT_PROPOSAL_GAS,
                deposit: tokenData
                  ? formatYoktoValue(config.deposit, tokenData.decimals)
                  : config.deposit,
                token: config.token ?? 'NEAR',
                json: parsedJson,
                isActive: template.isEnabled,
                name: template.name,
              };
            }
          }

          if (v === FunctionCallType.RemoveUpgradeCode) {
            const hash = settings?.daoUpgrade?.versionHash;

            if (hash) {
              initialValues = {
                details: `This proposal is to delete the upgrade code which you retrieved from the factory. Deleting that code saves NEAR for your DAO. It's safe to delete that code because smart contracts always store a copy of the code they're running.`,
                externalUrl: '',
                gas: DEFAULT_UPGRADE_DAO_PROPOSALS_GAS,
                versionHash: hash,
              };
            }
          }

          const defaults = getFormInitialValues(
            t,
            ProposalVariant.ProposeCustomFunctionCall,
            accountId,
            initialValues
          );

          reset({ ...defaults, functionCallType: v });
        }}
      />
    </div>
  );
};
