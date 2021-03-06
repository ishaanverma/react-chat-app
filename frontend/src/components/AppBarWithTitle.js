import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const AppBarWithTitle = ({ title, children }) => 
  <AppBar position="static">
    <Toolbar>
      <Typography style={{ flexGrow: 1 }}>
        { title }
      </Typography>
      {children}
    </Toolbar>
  </AppBar>

export default AppBarWithTitle;