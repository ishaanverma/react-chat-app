import React, { useState, useContext, useReducer } from 'react';
import axios from 'axios';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import LinearProgress from '@material-ui/core/LinearProgress';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import { apiReducerWithState } from '../reducer/apiReducerWithState';
import { ChatInfoContext } from '../context/chatInfo';
import { Divider } from '@material-ui/core';

const UserDrawer = () => {
  const [open, setOpen] = useState(false);
  const { chatInfo } = useContext(ChatInfoContext);
  const [users, dispatchUserList] = useReducer(apiReducerWithState, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const handleUserList = async () => {
    setOpen(true);
    dispatchUserList({ type: "API_FETCH_INIT" });
    const result = await axios.get(`chats/members/${chatInfo.chatId}`);

    try {
      dispatchUserList({
        type: "API_FETCH_SUCCESS",
        payload: result.data
      });
    } catch {
      dispatchUserList({ type: "API_FECTH_ERROR" });
    }
  }

  return(
    <>
      {chatInfo.chatId ? (
        <IconButton size="medium" color="inherit" onClick={handleUserList}>
          <MenuIcon fontSize="inherit" />
        </IconButton>
      ) : (
        <></>
      )}
      <Drawer open={open} anchor="right" onClose={() => setOpen(false)}>
        <Toolbar>
          <Typography>Chat Members</Typography>
        </Toolbar>
        
        <div style={{ width: 250 }}>
          <List>
            <Divider />
            {users.isError && <p>Error</p>}
            {users.isLoading ? (
              <LinearProgress />
            ) : (
              users.data.map((item, index) =>
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemIcon>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItem>
                <Divider />
              </React.Fragment>
              )
            )}
          </List>
        </div>
      </Drawer>
    </>
  );
}

export default UserDrawer;