import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const AppBarWithTitle = ({ title }) => 
  <AppBar position="static">
    <Toolbar>
      <Typography>
        { title }
      </Typography>
    </Toolbar>
  </AppBar>

export default AppBarWithTitle;