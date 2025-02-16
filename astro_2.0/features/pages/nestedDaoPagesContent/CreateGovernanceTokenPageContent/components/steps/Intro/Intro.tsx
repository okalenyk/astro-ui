import React, { FC } from 'react';
import { useTranslation } from 'next-i18next';

import { CreateGovernanceTokenSteps } from 'types/settings';

import { Button } from 'components/button/Button';
import { Accordion } from 'astro_2.0/components/Accordion';
import { SubHeader } from 'astro_2.0/features/pages/nestedDaoPagesContent/CreateGovernanceTokenPageContent/components/SubHeader';
import { AdvantageDescription } from './components/AdvantageDescription';

import styles from './Intro.module.scss';

interface Props {
  disabled: boolean;
  onUpdate: ({
    step,
    proposalId,
  }: {
    step: CreateGovernanceTokenSteps | null;
    proposalId: number | null;
  }) => Promise<void>;
}

export const Intro: FC<Props> = ({ onUpdate, disabled }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <div className={styles.description}>
        {t('createGovernanceTokenPage.intro.description')}
      </div>
      <div className={styles.advantageContainer}>
        <AdvantageDescription className={styles.advantage} icon="treasuryOne">
          {t('createGovernanceTokenPage.intro.advOne')}
        </AdvantageDescription>
        <AdvantageDescription className={styles.advantage} icon="treasuryTwo">
          {t('createGovernanceTokenPage.intro.advTwo')}
        </AdvantageDescription>
        <AdvantageDescription className={styles.advantage} icon="treasuryThree">
          {t('createGovernanceTokenPage.intro.advThree')}
        </AdvantageDescription>
      </div>
      <Button
        capitalize
        disabled={disabled}
        variant="green"
        className={styles.startToCreate}
        onClick={async () => {
          await onUpdate({
            step: CreateGovernanceTokenSteps.ChooseFlow,
            proposalId: null,
          });
        }}
      >
        {t('createGovernanceTokenPage.intro.startToCreate')}
      </Button>

      <SubHeader className={styles.faq}>
        {t('createGovernanceTokenPage.intro.faq')}
      </SubHeader>
      <Accordion
        className={styles.accordion}
        title={t('createGovernanceTokenPage.intro.accordions.first.title')}
      >
        {t('createGovernanceTokenPage.intro.accordions.first.description')}
      </Accordion>
      <Accordion
        className={styles.accordion}
        title={t('createGovernanceTokenPage.intro.accordions.second.title')}
      >
        {t('createGovernanceTokenPage.intro.accordions.second.description')}
      </Accordion>
      <Accordion
        className={styles.accordion}
        title={t('createGovernanceTokenPage.intro.accordions.third.title')}
      >
        {t('createGovernanceTokenPage.intro.accordions.third.description')}
      </Accordion>
    </div>
  );
};
