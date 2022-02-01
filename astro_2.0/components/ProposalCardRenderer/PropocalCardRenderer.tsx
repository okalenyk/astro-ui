import React from 'react';
import cn from 'classnames';
import isNumber from 'lodash/isNumber';
import { useTranslation } from 'next-i18next';

import { InfoPanel } from 'astro_2.0/components/ProposalCardRenderer/components/InfoPanel';

import styles from './ProposalCardRenderer.module.scss';

export interface ProposalCardRendererProps {
  proposalId?: number;
  letterHeadNode?: React.ReactNode;
  proposalCardNode: React.ReactNode;
  daoFlagNode?: React.ReactNode;
  infoPanelNode?: React.ReactNode;
  className?: string;
  showInfo?: boolean;
}

export const ProposalCardRenderer: React.FC<ProposalCardRendererProps> = ({
  letterHeadNode,
  daoFlagNode,
  proposalCardNode,
  infoPanelNode,
  className,
  proposalId,
  showInfo,
}) => {
  const { t } = useTranslation();

  function renderFlag() {
    return daoFlagNode ? (
      <div className={styles.daoFlag}>{daoFlagNode}</div>
    ) : null;
  }

  function renderProposalId() {
    if (isNumber(proposalId)) {
      return (
        <div className={styles.proposalIdCell}>
          <span className={styles.proposalIdLabel}>
            {t('proposalCard.proposalID')}
          </span>
          <span className={styles.proposalIdValue}>{proposalId}</span>
        </div>
      );
    }

    return null;
  }

  function renderInfoPanel() {
    if (proposalId === undefined && showInfo) {
      return <InfoPanel />;
    }

    return null;
  }

  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.header}>
        <div>{renderFlag()}</div>
        {renderInfoPanel()}
        {renderProposalId()}
      </div>
      {letterHeadNode && (
        <div className={styles.letterHead}>{letterHeadNode}</div>
      )}
      <div className={styles.proposal}>{proposalCardNode}</div>
      {infoPanelNode && <div className={styles.infoPanel}>{infoPanelNode}</div>}
    </div>
  );
};
