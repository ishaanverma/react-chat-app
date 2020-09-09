import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ChatIcon from '@material-ui/icons/Chat';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import AppBarWithTitle from './AppBarWithTitle';
import ButtonWithDialog from './ButtonWithDialog';
import { ChatInfoContext } from '../context/chatInfo';
import DisplayDataWithList from './DisplayDataWithList';

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

function ChatsContainer({ primaryList, secondaryList }) {
  const classes = useStyles();
  const { chatInfo, setChatInfo } = useContext(ChatInfoContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState(0);
  
  const handleListClick = (item) => () => {
    setChatInfo({ 
      ...chatInfo, 
      chatId: item.chatId,
      chatName: item.name
    });
  }

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  }

  return(
    <>
      <Container className={classes.list} maxWidth={false} disableGutters={true}>
        <AppBarWithTitle title="Chats">
          <>
            <IconButton color="inherit" size="medium" onClick={handleMenuClick}>
              <AccountCircleIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              transformOrigin={{ vertical: 'center top', horizontal: 'right' }}
            >
              <MenuItem>
                <Avatar>
                  <AccountCircleIcon />
                </Avatar>
                <Typography style={{ marginLeft: '1em' }}>{chatInfo.username}</Typography>
              </MenuItem>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Logout</MenuItem>
            </Menu>
          </>
        </AppBarWithTitle>
        <div>
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
              variant="fullWidth"
              centered
            >
              <Tab label="Chats" />
              <Tab label="Users" />
            </Tabs>
          </AppBar>
        </div>
        <ButtonWithDialog value={value} index={1}/>
        <DisplayDataWithList 
          listData={{primaryList, secondaryList}}
          click={handleListClick}
          icon={ChatIcon}
          style={{ display: 'flex' }}
          value={value}
          index={0}
        />
      </Container>
    </>
  );
}

export default ChatsContainer;
