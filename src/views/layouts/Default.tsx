import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppPage, MeshPage, TestPage } from '../pages';

type Props = {};

const Default = (props: Props) => {
  return (
    <Routes>
      <Route path="/" element={<AppPage />} />
      <Route path="/test/" element={<TestPage />} />
      <Route path="/test/mesh" element={<MeshPage />} />
    </Routes>
  );
};

export default Default;
