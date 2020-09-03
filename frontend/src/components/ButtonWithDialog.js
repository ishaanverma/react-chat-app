import React, { useState, useReducer } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogWithList from './DialogWithList';
import { apiReducer } from '../reducer/apiReducer';

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    padding: '0.5em 1em',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  dialogContainer: {
    padding: '1em'
  }
}));

const ButtonWithDialog = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [userList, dispatchUserList] = useReducer(apiReducer, {
    data: [],
    isLoading: false,
    isError: false
  });

  const handleButton = async () => {
    setOpen(true);
    dispatchUserList({ type: "API_FETCH_INIT" });
    const result = await axios.get('/users/all');

    try {
      dispatchUserList({ 
        type: "API_FETCH_SUCCESS",
        payload: result.data
      });
    } catch(err) {
      dispatchUserList({ type: "API_FETCH_ERROR" });
    }
  }

  const handleClose = () => {
    setOpen(false);
  }

  return(
    <div className={classes.buttonContainer}>
      <Button variant="outlined" onClick={handleButton}>New Chat</Button>
      <DialogWithList open={open} onClose={handleClose} userList={userList}/>
    </div>
  );
}

export default ButtonWithDialog;