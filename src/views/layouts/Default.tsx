import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppPage, AuthPage, MeshPage, TestPage } from '../pages';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { NavBar } from '../../components/navigation';
import { Box } from '@mui/joy';
import { globalActions } from '../../store/reducers';
import { ErrorToast } from '../../components/feedback';
import Loading from '../pages/Loading';
import { getErrorToastContent } from '../../utils';

type Props = {};

const Default = (props: Props) => {
  const [errorToastContent, setErrorToastContent] = useState('');
  const { isLoggedIn, checkingLogin, error, errorToastOpen } = useSelector((state: RootState) => state.global);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(globalActions.checkLogin());
  }, [dispatch]);

  useEffect(() => {
    if (!error) return;

    const content = getErrorToastContent(error.code);
    setErrorToastContent(content);
  }, [error]);

  return (
    <Box sx={{ height: '100vh' }}>
      <NavBar sx={{ position: 'relative', zIndex: '2' }} />
      <Box sx={{ minHeight: 'calc(100% - 72px)', height: 0 }}>
        {!checkingLogin && (
          <Routes>
            <Route path="/" element={isLoggedIn ? <AppPage /> : <Navigate to="/auth" replace />} />
            <Route path="/auth" element={!isLoggedIn ? <AuthPage /> : <Navigate to="/" replace />} />
            <Route path="/test/" element={<TestPage />} />
            <Route path="/test/mesh" element={<MeshPage />} />
          </Routes>
        )}
        {checkingLogin && <Loading />}
      </Box>
      <ErrorToast open={errorToastOpen} onClose={() => dispatch(globalActions.closeErrorToast())}>
        {errorToastContent}
      </ErrorToast>
    </Box>
  );
};

export default Default;
