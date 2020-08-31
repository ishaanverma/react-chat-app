import React, { useEffect, useReducer } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import ChatIcon from '@material-ui/icons/Chat';
import LinearProgress from '@material-ui/core/LinearProgress';
import ListDialog from './ListDialog';
import { apiReducer } from '../reducer/apiReducer';

const useStyles = makeStyles((theme) => ({
  list: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'auto',
    height: '100%',
    borderRight: 'solid 1px #CCC'
  },
}));

function ChatList() {
  const classes = useStyles();
  const [chatList, dispatchChatList] = useReducer(apiReducer, {
    data: [],
    isLoading: false,
    isError: false
  });
  
  const handleUserList = async () => {
    dispatchChatList({ type: "API_FETCH_INIT" });
    const result = await axios.get('/chats/all');

    try {
      dispatchChatList({
        type: "API_FETCH_SUCCESS",
        payload: result.data
      });
    } catch {
      dispatchChatList({ type: "API_FETCH_ERROR"});
    }
    console.log(result);
  }

  useEffect(() => {
    handleUserList();
  }, []);

  return(
    <>
      <Container className={classes.list} maxWidth={false} disableGutters={true}>
        <AppBar position="static">
          <Toolbar>
            <Typography>
              Chats
            </Typography>
          </Toolbar>
        </AppBar>
        <ListDialog />
      
        <List>
          <Divider />
          {chatList.isError && <p>Error</p>}
          {chatList.isLoading ? (
            <LinearProgress />
          ) : (
            chatList.data.map((item, index) => {
              return(
                <React.Fragment key={index}>
                  <ListItem button>
                    <ListItemAvatar>
                      <Avatar>
                        <ChatIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={item.name} />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              );})
          )}
        </List>
      </Container>
    </>
  );
}

export default ChatList;
