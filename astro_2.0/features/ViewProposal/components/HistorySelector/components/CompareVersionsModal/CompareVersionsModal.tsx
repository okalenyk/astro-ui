import React, { FC, useEffect, useRef, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import HtmlDiff from 'htmldiff-js';
import cn from 'classnames';

import { Modal } from 'components/modal';
import { CompareProposal } from 'astro_2.0/features/ViewProposal/components/HistorySelector/components/CompareProposal';
import { IconButton } from 'components/button/IconButton';

import { ProposalFeedItem } from 'types/proposal';
import { Token } from 'types/token';

import styles from './CompareVersionsModal.module.scss';

export interface Props {
  isOpen: boolean;
  onClose: (val?: boolean) => void;
  index: number;
  tokens: Record<string, Token>;
  data: ProposalFeedItem[];
}

export const CompareVersionsModal: FC<Props> = ({
  isOpen,
  onClose,
  tokens,
  data,
  index,
}) => {
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);
  const [selection, setSelection] = useState({
    prevVersionInd: index,
    currentVersionInd: index + 1,
  });
  const prevVersion = data[selection.prevVersionInd];
  const currentVersion = data[selection.currentVersionInd];

  const [content, setContent] = useState<{
    left: string | null;
    right: string | null;
  }>({
    left: null,
    right: null,
  });

  useEffect(() => {
    setTimeout(() => {
      if (
        leftRef.current &&
        rightRef.current &&
        prevVersion &&
        currentVersion
      ) {
        const leftRes = HtmlDiff.execute(
          leftRef.current?.innerHTML,
          rightRef.current?.innerHTML
        );

        const rightRes = HtmlDiff.execute(
          rightRef.current.innerHTML,
          leftRef.current.innerHTML
        );

        setContent({ left: leftRes, right: rightRes });
      }
    }, 0);
  }, [prevVersion, currentVersion]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xxxl">
      <div className={styles.root}>
        <div className={styles.title}>Draft history</div>
        <div className={styles.body}>
          {content.left && (
            <div className={cn(styles.column, styles.left)}>
              <CompareProposal
                current={prevVersion}
                tokens={tokens}
                view="prev"
                content={content.left}
              />
            </div>
          )}
          {content.right && (
            <div className={cn(styles.column, styles.right)}>
              <CompareProposal
                current={currentVersion}
                tokens={tokens}
                view="current"
                content={content.right}
              />
            </div>
          )}
        </div>
        <div className={styles.prerenderContainer}>
          <div className={styles.hidden}>
            <CompareProposal
              current={prevVersion}
              tokens={tokens}
              view="prev"
              ref={leftRef}
            />
          </div>
          <div className={styles.hidden}>
            <CompareProposal
              current={currentVersion}
              tokens={tokens}
              view="current"
              ref={rightRef}
            />
          </div>
        </div>
        <div className={styles.footer}>
          <IconButton
            icon="buttonArrowLeft"
            className={styles.arrow}
            disabled={selection.prevVersionInd === 0}
            onClick={() =>
              setSelection(prev => ({
                prevVersionInd: prev.prevVersionInd - 1,
                currentVersionInd: prev.currentVersionInd - 1,
              }))
            }
          />
          <span>{selection.prevVersionInd + 1}</span>
          <span>&nbsp;-&nbsp;</span>
          <span>{selection.currentVersionInd + 1}</span>
          <span className={styles.secondary}>/</span>
          <span className={styles.secondary}>{data.length}</span>
          <IconButton
            icon="buttonArrowRight"
            className={styles.arrow}
            disabled={selection.currentVersionInd === data.length - 1}
            onClick={() =>
              setSelection(prev => ({
                prevVersionInd: prev.prevVersionInd + 1,
                currentVersionInd: prev.currentVersionInd + 1,
              }))
            }
          />
        </div>
      </div>
    </Modal>
  );
};
