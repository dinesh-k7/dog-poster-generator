import React, { ReactElement, Suspense, lazy } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';

import HeaderComponent from '../common/header/header.component';
import { appTheme } from '../../themes/theme';
import { LoaderComponent } from '../common/loader/loader.component';

const HomePage = lazy(() => import('../../pages/home/home-page'));

const App = (): ReactElement => {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline enableColorScheme />
      <BrowserRouter>
        <HeaderComponent />
        <Suspense fallback={<LoaderComponent />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
