import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';

import {
  FieldValue,
  FieldWrapper,
} from 'astro_2.0/features/ViewProposal/components/FieldWrapper';
import { Icon } from 'components/Icon';

import { useCustomTokensContext } from 'astro_2.0/features/CustomTokens/CustomTokensContext';

import { formatYoktoValue } from 'utils/format';

import { CommonContent } from './components/CommonContent';

import styles from './CustomFunctionCallContent.module.scss';

interface CustomFunctionCallContentProps {
  token: string;
  smartContractAddress: string;
  methodName: string;
  json: string;
  deposit: string;
}

export const CustomFunctionCallContent: FC<CustomFunctionCallContentProps> = ({
  token,
  smartContractAddress,
  methodName,
  json,
  deposit,
}) => {
  const { tokens } = useCustomTokensContext();
  const { t } = useTranslation();

  const tokenData = token ? tokens[token] : tokens.NEAR;

  function renderDeposit() {
    return tokenData ? formatYoktoValue(deposit, tokenData.decimals) : deposit;
  }

  return (
    <div className={styles.root}>
      <CommonContent
        json={json}
        methodName={methodName}
        smartContractAddress={smartContractAddress}
      />

      <div className={styles.deposit}>
        <div className={styles.row}>
          <FieldWrapper label={t('proposalCard.deposit')}>
            <FieldValue value={renderDeposit()} />
          </FieldWrapper>
          {tokenData && (
            <FieldWrapper label="">
              <div className={styles.row}>
                <div className={styles.iconWrapper}>
                  {tokenData.symbol === 'NEAR' ? (
                    <Icon name="tokenNearBig" />
                  ) : (
                    <div
                      style={{
                        background: 'black',
                        backgroundImage: `url(${tokenData.icon})`,
                      }}
                      className={styles.icon}
                    />
                  )}
                </div>
                <div className={styles.symbol}>{tokenData.symbol}</div>
              </div>
            </FieldWrapper>
          )}
        </div>
      </div>
    </div>
  );
};
