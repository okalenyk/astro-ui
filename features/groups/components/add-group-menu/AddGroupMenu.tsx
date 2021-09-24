import React, { FC, useCallback } from 'react';
import { useModal } from 'components/modal';
import { GroupPopup } from 'features/groups';
import { GroupFormType } from 'features/groups/types';
import { Button } from 'components/button/Button';
import { Icon } from 'components/Icon';

import styles from './add-group-menu.module.scss';

export const AddGroupMenu: FC = () => {
  const [showGroupModal] = useModal(GroupPopup, {
    initialValues: {
      groupType: GroupFormType.CREATE_GROUP,
      groups: []
    }
  });

  const handleClick = useCallback(async () => {
    await showGroupModal();
  }, [showGroupModal]);

  return (
    <Button onClick={handleClick} variant="tertiary" className={styles.root}>
      <Icon name="buttonAdd" width={24} />
      Add group
    </Button>
  );
};
