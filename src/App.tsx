import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DefaultLayout } from './views/layouts';
import { Provider } from 'react-redux';
import store from './store';
import { CssBaseline, CssVarsProvider } from '@mui/joy';
import YuzuTheme from './assets/themes/Yuzu';

const App = () => {
  return (
    <Provider store={store}>
      <CssVarsProvider theme={YuzuTheme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<DefaultLayout />} />
          </Routes>
        </BrowserRouter>
      </CssVarsProvider>
    </Provider>
  );
};

export default App;