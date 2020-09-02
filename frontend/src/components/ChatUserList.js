import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
import ButtonDialog from './ButtonDialog';
import { ChatInfoContext } from '../context/chatInfo';

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

function ChatUserList({ list }) {
  const classes = useStyles();
  const { chatInfo, setChatInfo } = useContext(ChatInfoContext);
  
  const handleListClick = (item) => () => {
    setChatInfo({ 
      ...chatInfo, 
      chatId: item.chatId,
      chatName: item.name
    });
  }

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
        <ButtonDialog />
      
        <List>
          <Divider />
          {list.isError && <p>Error</p>}
          {list.isLoading ? (
            <LinearProgress />
          ) : (
            list.data.map((item, index) => {
              return(
                <React.Fragment key={index}>
                  <ListItem button onClick={handleListClick(item)}>
                    <ListItemAvatar>
                      <Avatar>
                        <ChatIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={item.name} />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              );
            })
          )}
        </List>
      </Container>
    </>
  );
}

export default ChatUserList;
