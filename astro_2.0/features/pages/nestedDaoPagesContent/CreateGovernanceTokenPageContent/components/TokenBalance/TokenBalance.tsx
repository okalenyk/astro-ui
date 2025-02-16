import React, { FC } from 'react';

import { Icon } from 'components/Icon';
import { Tooltip } from 'astro_2.0/components/Tooltip';
import { FormattedNumericValue } from 'components/cards/TokenCard/components/FormattedNumericValue';

import { kFormatter } from 'utils/format';

import styles from './TokenBalance.module.scss';

interface TokenBalanceProps {
  value: number;
  suffix: string;
}

export const TokenBalance: FC<TokenBalanceProps> = ({ value, suffix }) => {
  return (
    <div className={styles.root}>
      <Icon name="chartTrend" className={styles.icon} />
      <Tooltip
        overlay={<FormattedNumericValue value={value} suffix={suffix} />}
      >
        <FormattedNumericValue
          value={kFormatter(value)}
          suffix={suffix}
          valueClassName={styles.value}
          suffixClassName={styles.value}
        />
      </Tooltip>
    </div>
  );
};
