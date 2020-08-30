import React, { useState, useReducer } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import LinearProgress from '@material-ui/core/LinearProgress';
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

const ListDialog = () => {
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
      <UserDialog open={open} onClose={handleClose} userList={userList}/>
    </div>
  );
}

const UserDialog = ({ open, onClose, userList }) => {
  const [checked, setChecked] = React.useState([]);
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <Dialog
      fullWidth={true}
      maxWidth="sm"
      open={open}
    >
      <DialogTitle>Create New Chat</DialogTitle>
      <DialogContent dividers>
        <TextField label="Chat Name" variant="outlined" required margin="normal" fullWidth/>
        <List>
          { userList.isError && <p>Error</p> }
          {userList.isLoading ? (
            <LinearProgress />
          ) : (
            userList.data.map((item, index) => {
              return(
                <ListItem key={index} role={undefined} dense button onClick={handleToggle(item)}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.indexOf(item) !== -1}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="comments">
                      <CommentIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ListDialog;