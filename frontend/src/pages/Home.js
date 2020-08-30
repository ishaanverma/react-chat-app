import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import io from 'socket.io-client';
import messageData from '../data2.json';
import ChatList from '../components/ChatList';
import MessageList from '../components/MessageList';

const ENDPOINT = process.env.WEBSOCKET_ENDPOINT || 'http://localhost:5000';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: '100vh'
  },
}));

function Home() {
  const classes = useStyles();
  const [socket, setSocket] = useState();
  const [messages, setMessages] = useState(messageData);

  const handleMessageSubmit = (event) => {
    event.preventDefault();
    const message = event.target.message.value;
    const data = { "chatId": null, "message": message }
    event.target.message.value = '';
    setMessages(messages => [...messages, data]);
    socket.emit('message', JSON.stringify(data));
  }

  // TODO: find better way to intialize socket
  useEffect(() => {
    const currentSocket = io(ENDPOINT);
    setSocket(currentSocket);
  }, [])

  useEffect(() => {
    if (!socket) return;

    socket.on('message', (data) =>  {
      data = JSON.parse(data);
      console.log(data);
      setMessages(messages => [...messages, data]);
    });

  }, [socket])

  return (
    <Grid container className={classes.root} spacing={0}>
      <Grid container spacing={0}>
        <Grid item xs>
          <ChatList />
        </Grid>
        <Grid item xs={9}>
          <MessageList list={messages} submit={handleMessageSubmit} />
        </Grid>
      </Grid>
    </Grid>  
  );
}

export default Home;