import React from 'react';
import { OverridableStringUnion } from '@mui/types';
import {
  Button,
  ColorPaletteProp,
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
  ModalDialog,
  ModalDialogPropsColorOverrides,
} from '@mui/joy';

type Props = {
  open: boolean;
  title: string;
  content: string;
  color?: OverridableStringUnion<ColorPaletteProp, ModalDialogPropsColorOverrides>;
  cancellable?: boolean;
  confirmText: string;
  cancelText?: string;
  onClose?: (event: {}, reason: 'backdropClick' | 'escapeKeyDown' | 'closeClick') => void;
  onConfirmAction: () => void;
  onCancelAction?: () => void;
};

const GeneralModal = (props: Props) => {
  const {
    open,
    title,
    content,
    color,
    cancellable,
    confirmText,
    cancelText,
    onClose,
    onConfirmAction,
    onCancelAction,
  } = props;

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog variant="plain" color={color ?? 'primary'} role="alertdialog" sx={{ maxWidth: '496px' }}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{content}</DialogContent>
        <DialogActions>
          <Button variant="solid" color={color ?? 'primary'} onClick={onConfirmAction}>
            {confirmText}
          </Button>
          <Button
            variant="plain"
            color="neutral"
            sx={{ display: cancellable ? undefined : 'none' }}
            onClick={onCancelAction}>
            {cancelText ?? 'Cancel'}
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};

export default GeneralModal;
