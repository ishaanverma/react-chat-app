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
        <ButtonWithDialog />
        <DisplayDataWithList 
          listData={{primaryList, secondaryList}}
          click={handleListClick}
          icon={ChatIcon}
        />
      </Container>
    </>
  );
}

export default ChatsContainer;
