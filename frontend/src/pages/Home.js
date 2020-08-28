import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import io from 'socket.io-client';

import messageData from '../data2.json';
import UserList from '../components/UserList';
import MessageList from '../components/MessageList';

const ENDPOINT = 'http://localhost:5000';
const socket = io(ENDPOINT);

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
    let message = event.target.message.value;
    let data = { "username": socket.id, "message": message}
    event.target.message.value = '';
    event.preventDefault();
    setMessages(messages => [...messages, data]);
    socket.emit("message", data);
  }

  useEffect(() => {
    socket.on("message", data =>  {
      console.log(data);
      setMessages(messages => [...messages, data]);
    });

    return () => socket.disconnect();
  }, [])

  return (
    <Grid container className={classes.root} spacing={0}>
      <Grid container spacing={0}>
        <Grid item xs>
          <UserList />
        </Grid>
        <Grid item xs={9}>
          <MessageList list={messages} submit={handleMessageSubmit} />
        </Grid>
      </Grid>
    </Grid>  
  );
}

export default Home;