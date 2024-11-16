import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppPage, AuthPage, MeshPage, TestPage } from '../pages';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { NavBar } from '../../components/navigation';
import { Box } from '@mui/joy';

type Props = {};

const Default = (props: Props) => {
  const isLoggedIn = useSelector((state: RootState) => state.global.isLoggedIn);

  return (
    <Box sx={{ height: '100vh' }}>
      <NavBar />
      <Box sx={{ minHeight: 'calc(100% - 72px)', height: 0 }}>
        <Routes>
          <Route path="/" element={isLoggedIn ? <AppPage /> : <Navigate to="/auth" replace />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/test/" element={<TestPage />} />
          <Route path="/test/mesh" element={<MeshPage />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default Default;
