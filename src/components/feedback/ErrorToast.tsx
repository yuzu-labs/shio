import { ErrorOutlineRounded } from '@mui/icons-material';
import { Button, Snackbar } from '@mui/joy';
import React from 'react';

type Props = {
  open: boolean;
  children: string;
  onClose: () => void;
};

const ErrorToast = (props: Props) => {
  return (
    <Snackbar
      open={props.open}
      autoHideDuration={5000}
      onClose={(_, reason) => {
        // disable dismiss on clickaway
        if (reason === 'clickaway') return;
        props.onClose();
      }}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      variant="soft"
      color="danger"
      startDecorator={<ErrorOutlineRounded />}
      endDecorator={
        <Button onClick={props.onClose} size="sm" variant="soft" color="danger">
          Dismiss
        </Button>
      }>
      {props.children}
    </Snackbar>
  );
};

export default ErrorToast;
