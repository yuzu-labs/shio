import React from 'react';
import { Button, DialogActions, DialogContent, DialogTitle, Modal, ModalDialog } from '@mui/joy';

type Props = {
  open: boolean;
  title: string;
  content: string;
  cancellable?: boolean;
  confirmText: string;
  cancelText?: string;
  onClose?: (event: {}, reason: 'backdropClick' | 'escapeKeyDown' | 'closeClick') => void;
  onConfirmAction: () => void;
  onCancelAction?: () => void;
};

const GeneralModal = (props: Props) => {
  const { open, title, content, cancellable, confirmText, cancelText, onClose, onConfirmAction, onCancelAction } =
    props;

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog variant="plain" color="primary" role="alertdialog" sx={{ maxWidth: '496px' }}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{content}</DialogContent>
        <DialogActions>
          <Button variant="solid" onClick={onConfirmAction}>
            {confirmText}
          </Button>
          <Button
            variant="plain"
            color="neutral"
            sx={{ display: cancellable ? undefined : 'none' }}
            onClick={onCancelAction}>
            {cancelText}
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};

export default GeneralModal;
