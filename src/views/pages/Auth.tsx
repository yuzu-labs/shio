import { Box, Button, FormControl, FormHelperText, Input, Stack, Typography } from '@mui/joy';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { globalActions } from '../../store/reducers';
import { RootState } from '../../store';

type Props = {};

const Auth = (props: Props) => {
  const [validated, setValidated] = useState(false);
  const [pwdValid, setPwdValid] = useState(false);
  const [pwdErrorString, setPwdErrorString] = useState('Please enter the password.');

  const { loading, error } = useSelector((state: RootState) => state.global);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!error || error.relatedAction !== globalActions.login.type) return;

    setPwdValid(false);
    setPwdErrorString(error.content);
  }, [error]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    const form = event.currentTarget;

    // prevent default form submit effect
    event.preventDefault();
    event.stopPropagation();

    setValidated(true);

    const fd = new FormData(form);
    const pwd = fd.get('pwd');

    if (!pwd) {
      setPwdValid(false);
      setPwdErrorString('Please enter the password.');
      return;
    }

    setPwdValid(true);

    dispatch(globalActions.login({ loginPlainText: pwd.toString() }));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        pt: '32vh',
      }}>
      <Stack gap={7} sx={{ width: '50%', maxWidth: '768px' }}>
        <Stack spacing={4} sx={{ textAlign: 'center' }}>
          <Typography level="h1">Welcome</Typography>
          <Typography level="body-md">Enter the password provided by the development team.</Typography>
        </Stack>
        <form onSubmit={handleSubmit}>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
            <FormControl error={validated && !pwdValid} sx={{ flexGrow: 1 }}>
              <Input name="pwd" placeholder="Password" variant="outlined" type="password" />
              {validated && !pwdValid && (
                <FormHelperText sx={{ position: 'absolute', top: '36px' }}>{pwdErrorString}</FormHelperText>
              )}
            </FormControl>
            <Button loading={loading} variant="soft" type="submit">
              Submit
            </Button>
          </Stack>
        </form>
      </Stack>
    </Box>
  );
};

export default Auth;
