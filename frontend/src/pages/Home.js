import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
// import WebSocket from 'websocket';

import messageData from '../data2.json';
import ChatList from '../components/ChatList';
import MessageList from '../components/MessageList';

const ENDPOINT = process.env.WEBSOCKET_ENDPOINT || 'ws://localhost:5000';
const socket = new WebSocket(ENDPOINT);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: '100vh'
  },
}));

function Home() {
  const classes = useStyles();
  const [messages, setMessages] = useState(messageData);

  const handleMessageSubmit = (event) => {
    event.preventDefault();
    const message = event.target.message.value;
    const data = { "type": "message", "message": message}
    event.target.message.value = '';
    setMessages(messages => [...messages, data]);
    socket.send(JSON.stringify(data));
  }

  useEffect(() => {
    socket.onmessage = (event) =>  {
      const data = JSON.parse(event.data);
      console.log(data);
      switch(event.type) {
        case "message":
          setMessages(messages => [...messages, data]);
          break;
        default:
          console.log("msg type not identified");
      }
    };

    return () => socket.close();
  }, [])

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