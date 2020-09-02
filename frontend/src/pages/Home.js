import React, { useEffect, useState, useContext, useReducer } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import io from 'socket.io-client';
import ChatUserList from '../components/ChatUserList';
import MessageList from '../components/MessageList';
import { apiReducerWithState } from '../reducer/apiReducerWithState';
import { ChatInfoContext } from '../context/chatInfo';

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
  const { chatInfo } = useContext(ChatInfoContext);
  const [messages, dispatchMessageList] = useReducer(apiReducerWithState, {
    data: [],
    isLoading: false,
    isError: false
  });
  const [chatList, dispatchChatList] = useReducer(apiReducerWithState, {
    data: [],
    isLoading: false,
    isError: false
  });

  const handleMessageSubmit = (event) => {
    event.preventDefault();
    const message = event.target.message.value;
    if (!message) return;
    const data = { 
      "type": "text",
      "content": message,
      "createdAt": "null",
      "chatId": chatInfo.chatId,
      "User": {
        "name": chatInfo.username
      }
    }
    event.target.message.value = '';
    dispatchMessageList({
      type: "APPEND_TO_STATE",
      payload: data
    });
    socket.emit('message', JSON.stringify(data));
  }

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
  }

  const handleMessageList = async (chatId) => {
    if (!chatId) return;

    dispatchMessageList({ type: "API_FETCH_INIT" });
    const messageResult = await axios.post('/messages/all', {
      "chatId": chatId.toString()
    });

    try {
      dispatchMessageList({
        type: "API_FETCH_SUCCESS",
        payload: messageResult.data
      });
    } catch {
      dispatchMessageList({ type: "API_FETCH_ERROR"});
    }
  }

  // TODO: find better way to intialize socket
  useEffect(() => {
    const currentSocket = io(ENDPOINT);
    setSocket(currentSocket);
    handleUserList();
  }, [])

  useEffect(() => {
    if (!socket) return;

    // message event
    socket.on('message', (data) =>  {
      console.log(data);
      dispatchMessageList({
        type: 'APPEND_TO_STATE',
        payload: data
      });
    });

    // chat joined event
    socket.on('chat joined', (data) => {
      dispatchChatList({
        type: 'APPEND_TO_STATE',
        payload: data
      });
    });

  }, [socket])

  useEffect(() => {
    handleMessageList(chatInfo.chatId);
  }, [chatInfo.chatId]);

  return (
    <Grid container className={classes.root} spacing={0}>
      <Grid container spacing={0}>
        <Grid item xs>
          <ChatUserList list={chatList} />
        </Grid>
        <Grid item xs={9}>
          <MessageList list={messages.data} submit={handleMessageSubmit} />
        </Grid>
      </Grid>
    </Grid>  
  );
}

export default Home;