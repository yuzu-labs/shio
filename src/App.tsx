import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { DefaultLayout } from './views/layouts';
import { Provider } from 'react-redux';
import store from './store';
import { CssBaseline, CssVarsProvider } from '@mui/joy';
import YuzuTheme from './assets/themes/Yuzu';
import './assets/stylesheets/index.scss';

const App = () => {
  return (
    <Provider store={store}>
      <CssVarsProvider theme={YuzuTheme}>
        <CssBaseline />
        <HashRouter>
          <Routes>
            <Route path="/*" element={<DefaultLayout />} />
          </Routes>
        </HashRouter>
      </CssVarsProvider>
    </Provider>
  );
};

export default App;
