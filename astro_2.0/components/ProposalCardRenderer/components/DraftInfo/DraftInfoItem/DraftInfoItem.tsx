import React, { FC } from 'react';
import cn from 'classnames';

import { Icon, IconName } from 'components/Icon';
import { Tooltip } from 'astro_2.0/components/Tooltip';

import styles from './DraftInfoItem.module.scss';

interface DraftInfoItemProps {
  className?: string;
  count: number;
  iconName: IconName;
  onClick?: () => void;
  disabled?: boolean;
  tooltipText?: string;
}

export const DraftInfoItem: FC<DraftInfoItemProps> = ({
  className,
  count,
  iconName,
  onClick,
  disabled,
  tooltipText,
}) => {
  const infoItem = (
    <>
      <div className={styles.count}>{count}</div>
      {tooltipText ? (
        <Tooltip placement="top" overlay={<span>Save Draft</span>}>
          <Icon name={iconName} className={styles.icon} />
        </Tooltip>
      ) : (
        <Icon name={iconName} className={styles.icon} />
      )}
    </>
  );

  const renderInfo = () => {
    if (onClick) {
      return (
        <button
          disabled={disabled}
          className={cn(styles.button, className)}
          type="button"
          onClick={onClick}
        >
          {infoItem}
        </button>
      );
    }

    return (
      <div
        className={cn(
          styles.draftInfoItem,
          { [styles.disabled]: disabled },
          className
        )}
      >
        {infoItem}
      </div>
    );
  };

  return renderInfo();
};
