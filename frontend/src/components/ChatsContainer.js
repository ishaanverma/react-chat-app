import React, { useContext, useState, useReducer } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ChatIcon from '@material-ui/icons/Chat';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/tabs';
import AppBarWithTitle from './AppBarWithTitle';
import UserList from './UserList';
import { ChatInfoContext } from '../context/chatInfo';
import { apiReducer } from '../reducer/apiReducer';
import ChatList from './ChatList';
import UserMenu from './UserMenu';


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
  colorPrimary: "#44b700"
}));

function ChatsContainer({ primaryList, secondaryList, onlineList }) {
  const classes = useStyles();
  const { setChatInfo } = useContext(ChatInfoContext);
  const [value, setValue] = useState(0);
  const [userList, dispatchUserList] = useReducer(apiReducer, {
    data: [],
    isLoading: false,
    isError: false
  });
  
  const handleListClick = (item) => () => {
    setChatInfo(prevState => ({
      ...prevState, 
      "chatId": item.chatId,
      "chatName": item.name
    }));
  }

  const handleUserList = async () => {
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

  return(
    <Container className={classes.list} maxWidth={false} disableGutters>
      <AppBarWithTitle title="Chats">
        <UserMenu />
      </AppBarWithTitle>
      <AppBar 
        square 
        style={{ width: '100%' }} 
        position="static"
        color="inherit"
      >
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={(event, newValue) => setValue(newValue)}
          variant="standard"
          centered
        >
          <Tab label="Chats" />
          <Tab label="Users" onClick={() => handleUserList()}/>
        </Tabs>
      </AppBar>
      <ChatList 
        listData={{primaryList, secondaryList}}
        click={handleListClick}
        icon={ChatIcon}
        value={value}
        index={0}
      />
      <UserList
        userList={userList}
        onlineList={onlineList} 
        value={value} 
        index={1}
      />
    </Container>
  );
}

export default ChatsContainer;
