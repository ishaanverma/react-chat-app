import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { useAuth } from '../context/auth';
import { Redirect } from 'react-router-dom';

const ENDPOINT = '/auth/login';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',  
  },
  container: {
    margin: '0 auto',
    position: 'relative',
    top: '30%',
    width: '420px',
    padding: theme.spacing(5),
    '& .MuiTextField-root': {
      marginTop: theme.spacing(2),
      width: '100%'
    },
    '& .MuiButton-root': {
      display: 'block',
      marginTop: theme.spacing(2),
      marginLeft: 'auto'
    }
  }
}));

function Login() {
  const classes = useStyles();
  const [isLoggedIn, setLoggedIn] = useState(false);
  const { setAuthenticated } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    let result;

    try {
      result = await axios.post(ENDPOINT, {
        "email": event.target.email.value,
        "password": event.target.password.value
      });
    } catch(err)  {
      console.log(err);
    }

    if (result.status === 200)  {
      setAuthenticated(true);
      setLoggedIn(true);
    } else {
      console.log(result.status);
    }
  }

  if (isLoggedIn)  {
    return (<Redirect to={'/'} />);
  }

  return(
    <div className={classes.root}>
      <Paper variant="outlined" className={classes.container}>
        <Typography variant="h3">Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField name="email" label="Email" variant="outlined" />
          <TextField name="password" label="Password" variant="outlined" type="password"/>
          <div style={{ width: '100%' }}>
            <Button 
              variant="contained" 
              color="primary"
              type="submit"
              value="Submit"
            >
              Sign in
            </Button>
          </div>
        </form> 
      </Paper>
    </div>
  );
}

export default Login;