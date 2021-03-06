import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from '@material-ui/core/Snackbar';
import ChatMemberDrawer from './ChatMemberDrawer';
import { ChatInfoContext } from '../context/chatInfo';
import AppBarWithTitle from './AppBarWithTitle';
import { ReactComponent as HomeSvg } from '../images/home.svg';

const WAIT_INTERVAL = 1000;

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    maxHeight: '100%'
  },
  sendBarContainer: {
    width: '100%',
    flex: 'auto 0 auto',
    marginTop: '1em',
    borderTop: '1px solid #CCC'
  },
  sendBar: {
    margin: '1em auto',
    padding: '2px 4px',
    display: 'flex',
    width: '90%',
    borderRadius: '50px',
  },
  sendInput: {
    marginLeft: theme.spacing(1),
    flexGrow: 1
  },
  messagesGridItem: {
    margin: 0,
    padding: 0,
    width: '100%',
    maxHeight: '75vh',
    flex: '1 1 auto'
  },
  messagesContainer: {
    position: 'relative',
    height: '100%',
    maxHeight: '100%',
  },
  list: {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'auto',
  },
  messageBarContainer: {
    flex: 'auto 1 auto',
    padding: 0,
  }
}));

function MessageList({ list, submit, socket, loadMore })  {
  const classes = useStyles();
  const typingTimeout = useRef();
  const messageEndRef = useRef();
  const [typingFlag, setTypingFlag] = useState(false);
  const [typing, setTyping] = useState({});
  const { chatInfo } = useContext(ChatInfoContext);
  const chatId = useRef(chatInfo.chatId);
  const scrollObserver = useRef();

  // observe if the last message comes on screen
  const lastMessageRef = useCallback((node) => {
    if (list.isLoading || list.isError) return;
    if (scrollObserver.current) scrollObserver.current.disconnect();
    scrollObserver.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting)  {
        loadMore(chatId.current);
        console.log("visible");
      }
    });
    if (node) scrollObserver.current.observe(node);
  }, [list.isLoading, list.isError, loadMore]);

  // observe key presses for typing event
  const handleKeyPress = (event) => {
    if (event.keyCode !== 13) {
      clearTimeout(typingTimeout.current);

      if (typingFlag === false) {
        socket.emit('start typing', {
          'chatId': chatInfo.chatId,
        });
        setTypingFlag(true);
      }

      typingTimeout.current = setTimeout(() => {
        socket.emit('stop typing', {
          'chatId': chatInfo.chatId,
        });
        setTypingFlag(false);
      }, WAIT_INTERVAL);
    }    
  }

  // new chat message scrolls to the bottom
  const scrollToBottom = () => {
    if (messageEndRef.current)
      messageEndRef.current.scrollIntoView({ behavior: "auto" });
  }

  useEffect(scrollToBottom, [list.data]);

  useEffect(() => {
    if (!socket) return;

    // typing events
    socket.on('start typing', (data) => {
      if (chatId.current === data.chatId)
        setTyping(prevState => ({
          ...prevState,
          'start': true,
          'name': data.name
        }));
    });

    socket.on('stop typing', (data) => {
      setTyping(prevState => ({
        ...prevState,
        'start': false,
      }));
    });

  }, [socket])

  useEffect(() => {
    chatId.current = chatInfo.chatId;
  }, [chatInfo.chatId])

  return(
    <Grid container direction="column" className={classes.root}>
      <Grid item className={classes.messageBarContainer}>
        <AppBarWithTitle title={chatInfo.chatName}>
          <ChatMemberDrawer />
        </AppBarWithTitle>
      </Grid>
      
      <Grid item className={classes.messagesGridItem}>
        {!chatInfo.chatId && 
          <Container maxWidth={false} disableGutters style={{ 
            margin: '1em auto'
          }}>
            <HomeSvg height="60vh" />
          </Container>
        }
        {chatInfo.chatId && 
        <Container maxWidth={false} disableGutters className={classes.messagesContainer}>
          {/* <Button onClick={() => loadMore(chatInfo.chatId)}>Load More</Button> */}
          <List className={classes.list}>
            {list.isError && <p>Error</p>}
            {list.isLoading && <LinearProgress />}
            {
              list.data.map((item, index) => {
                if (index === 0)  {
                  return (
                    <React.Fragment key={index}>
                      <ListItem ref={lastMessageRef}>
                        <ListItemAvatar>
                          <Avatar>
                            <AccountCircleIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={item.content} secondary={item.User ? item.User.name : chatInfo.username} />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  );
                } else {
                  return (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <AccountCircleIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={item.content} secondary={item.User ? item.User.name : chatInfo.username} />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  );
                }
              })
            }
            <div ref={messageEndRef} />
          </List>
        </Container>
        }
      </Grid>
      <Snackbar open={typing.start} message={`${typing.name} is typing...`} style={{ bottom: '20%' }}/>
      <Grid item className={classes.sendBarContainer} hidden={chatInfo.chatId ? false : true}>
        <Paper 
          component="form" 
          className={classes.sendBar} 
          variant="outlined"
          onSubmit={submit}
          autoComplete="off"
        >
          <InputBase
            id="message"
            className={classes.sendInput}
            placeholder="Send a message"
            disabled={chatInfo.chatId ? false : true}
            onKeyPress={handleKeyPress}
          />
          <IconButton 
            type="submit"
            disabled={chatInfo.chatId ? false : true}
          >
            <SendRoundedIcon />
          </IconButton>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default MessageList;