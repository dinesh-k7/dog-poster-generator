/* eslint-disable @typescript-eslint/no-var-requires */
import React, { ReactElement } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import './header.component.scss';

const HeaderComponent: React.FC = (): ReactElement => {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <header className="nav-container">
            <div className="logo">
              <img
                src={require('../../../assets/images/header-logo.png')}
                className="header-logo"
                alt="Dog Poster Logo"
                width={48}
              />
            </div>
            <MenuItem>
              <Typography textAlign="center" color={'#FFFFFF'}>
                Home
              </Typography>
            </MenuItem>
          </header>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default HeaderComponent;
