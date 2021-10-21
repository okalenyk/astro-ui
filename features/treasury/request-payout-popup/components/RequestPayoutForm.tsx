import React from 'react';
import * as yup from 'yup';
import cn from 'classnames';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Input } from 'components/inputs/input/Input';
import { Select } from 'components/inputs/select/Select';
import { TextArea } from 'components/inputs/textarea/TextArea';
import { Button } from 'components/button/Button';
import { VoteDetails } from 'components/vote-details';
import { InputFormWrapper } from 'components/inputs/input-form-wrapper/InputFormWrapper';

import { FUNGIBLE_TOKEN, Token } from 'features/types';
import { ExpandableDetails } from 'features/bounty/dialogs/expandable-details';
import { CreatePayoutInput } from 'features/treasury/request-payout-popup/types';
import { tokenOptions } from 'features/bounty/dialogs/create-bounty-dialog/components/create-bounty-form/helpers';

import { useDeviceType } from 'helpers/media';

import { SputnikService } from 'services/SputnikService';

import styles from './request-payout-form.module.scss';

const schema = yup.object().shape({
  token: yup.string().required(),
  amount: yup
    .number()
    .typeError('Must be a valid number.')
    .positive()
    .required()
    .test(
      'onlyOneDecimal',
      'Only numbers with one optional decimal place please',
      value => /^\d*(?:\.\d)?$/.test(`${value}`)
    ),
  tokenAddress: yup.string().when('token', (token, yupSchema) => {
    if (token === FUNGIBLE_TOKEN) {
      return yupSchema.test(
        'notValidNearAccount',
        'Only valid near accounts are allowed',
        (value?: string | null) => SputnikService.nearAccountExist(value || '')
      );
    }

    return yupSchema.test('', '', () => true);
  }),
  recipient: yup
    .string()
    .test(
      'notValidNearAccount',
      'Only valid near accounts are allowed',
      value => SputnikService.nearAccountExist(value || '')
    ),
  detail: yup.string().required(),
  externalUrl: yup.string()
});

export interface IRequestPayoutForm {
  token: Token;
  tokenAddress?: string;
  amount: number;
  recipient: string;
  detail: string;
  externalUrl: string;
}

interface RequestPayoutFormProps {
  initialValues: CreatePayoutInput;
  onSubmit: (data: IRequestPayoutForm) => void;
  onCancel: () => void;
}

export const RequestPayoutForm: React.FC<RequestPayoutFormProps> = ({
  initialValues,
  onSubmit,
  onCancel
}) => {
  const { isMobile } = useDeviceType();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, touchedFields }
  } = useForm<IRequestPayoutForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      ...initialValues,
      amount: 0
    }
  });

  const selectedToken = watch('token');

  function isFieldValid(name: keyof IRequestPayoutForm) {
    return touchedFields[name] && !errors[name]?.message;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.root} noValidate>
      <InputFormWrapper
        errors={errors}
        className={styles.token}
        component={
          <Select
            defaultValue={initialValues?.token}
            placeholder=""
            size="block"
            label="Token"
            options={tokenOptions}
            {...register('token')}
            onChange={v =>
              setValue('token', (v || 'NEAR') as Token, {
                shouldDirty: true
              })
            }
          />
        }
      />
      <InputFormWrapper
        errors={errors}
        className={styles.amount}
        component={
          <Input
            isValid={isFieldValid('amount')}
            defaultValue={initialValues?.amount}
            size="block"
            textAlign="left"
            type="number"
            lang="en-US"
            step="0.1"
            min="0.1"
            {...register('amount')}
            label="Amount"
            className={cn(styles.input, styles.amount)}
          />
        }
      />
      {selectedToken === FUNGIBLE_TOKEN && (
        <InputFormWrapper
          errors={errors}
          className={styles.tokenAddress}
          component={
            <Input
              size="block"
              isValid={isFieldValid('tokenAddress')}
              textAlign="left"
              {...register('tokenAddress')}
              label="Token address"
              className={styles.input}
            />
          }
        />
      )}
      <InputFormWrapper
        errors={errors}
        className={styles.recipient}
        component={
          <Input
            defaultValue={initialValues?.recipient}
            isValid={isFieldValid('recipient')}
            size="block"
            textAlign="left"
            {...register('recipient')}
            placeholder="NEAR account name"
            label="Send to"
            className={cn(styles.input)}
          />
        }
      />

      <InputFormWrapper
        errors={errors}
        className={styles.detail}
        component={
          <TextArea
            isValid={isFieldValid('detail')}
            size="block"
            defaultValue={initialValues?.payoutDetail}
            textAlign="left"
            resize="none"
            placeholder="Sample text"
            className={styles.textArea}
            label="detail"
            {...register('detail')}
          />
        }
      />

      <Input
        size="block"
        defaultValue={initialValues?.externalUrl}
        isValid={isFieldValid('externalUrl')}
        textAlign="left"
        {...register('externalUrl')}
        label="External URL"
        placeholder="Add link"
        className={cn(styles.input, styles.url)}
      />
      <div className={styles.vote}>
        <ExpandableDetails label="Vote details" className={styles.voteDetails}>
          <VoteDetails scope="transfer" />
        </ExpandableDetails>
      </div>
      <div className={styles.footer}>
        <Button
          variant="secondary"
          onClick={onCancel}
          size={isMobile ? 'block' : 'small'}
          className={styles.mr8}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          size={isMobile ? 'block' : 'small'}
          className={styles.ml8}
        >
          Propose
        </Button>
      </div>
    </form>
  );
};
