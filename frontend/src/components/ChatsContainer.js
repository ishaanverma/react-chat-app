import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ChatIcon from '@material-ui/icons/Chat';
import AppBarWithTitle from './AppBarWithTitle';
import UserList from './UserList';
import { ChatInfoContext } from '../context/chatInfo';
import ChatList from './ChatList';
import UserMenu from './UserMenu';

import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/tabs';

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
  const { chatInfo, setChatInfo } = useContext(ChatInfoContext);
  const [value, setValue] = useState(0);
  
  const handleListClick = (item) => () => {
    setChatInfo({ 
      ...chatInfo, 
      chatId: item.chatId,
      chatName: item.name
    });
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
          aria-label="disabled tabs example"
          variant="standard"
          centered
        >
          <Tab label="Chats" />
          <Tab label="Users" />
        </Tabs>
      </AppBar>
      <ChatList 
        listData={{primaryList, secondaryList}}
        click={handleListClick}
        icon={ChatIcon}
        value={value}
        index={0}
      />
      <UserList onlineList={onlineList} value={value} index={1}/>
    </Container>
  );
}

export default ChatsContainer;
