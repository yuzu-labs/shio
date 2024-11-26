import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppPage, AuthPage, MeshPage, TestPage } from '../pages';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { NavBar } from '../../components/navigation';
import { Box } from '@mui/joy';
import { globalActions } from '../../store/reducers';
import { ErrorToast } from '../../components/feedback';

type Props = {};

const Default = (props: Props) => {
  const { isLoggedIn, error, errorToastOpen } = useSelector((state: RootState) => state.global);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(globalActions.checkLogin());
  }, [dispatch]);

  return (
    <Box sx={{ height: '100vh' }}>
      <NavBar sx={{ position: 'relative', zIndex: '2' }} />
      <Box sx={{ minHeight: 'calc(100% - 72px)', height: 0 }}>
        <Routes>
          <Route path="/" element={isLoggedIn ? <AppPage /> : <Navigate to="/auth" replace />} />
          <Route path="/auth" element={!isLoggedIn ? <AuthPage /> : <Navigate to="/" replace />} />
          <Route path="/test/" element={<TestPage />} />
          <Route path="/test/mesh" element={<MeshPage />} />
        </Routes>
      </Box>
      <ErrorToast open={errorToastOpen} onClose={() => dispatch(globalActions.closeErrorToast())}>
        {error?.content || 'An error occurred'}
      </ErrorToast>
    </Box>
  );
};

export default Default;
