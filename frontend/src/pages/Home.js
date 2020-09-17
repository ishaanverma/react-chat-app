import React, { useEffect, useState, useContext, useReducer, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import io from 'socket.io-client';
import ChatsContainer from '../components/ChatsContainer';
import MessagesContainer from '../components/MessagesContainer';
import { messagesReducer } from '../reducer/messagesReducer';
import { apiReducerWithState } from '../reducer/apiReducerWithState';
import { lastMessageReducer } from '../reducer/lastMessageReducer';
import { ChatInfoContext } from '../context/chatInfo';

const ENDPOINT = process.env.WEBSOCKET_ENDPOINT || 'http://localhost:5000';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    height: '100vh'
  },
}));

function Home() {
  const classes = useStyles();
  const socket = useRef();
  const { chatInfo } = useContext(ChatInfoContext);
  const chatIdRef = useRef(chatInfo.chatId);
  const [onlineList, setOnlineList] = useState(new Map());
  const [lastMessageList, dispatchLastMessageList] = useReducer(lastMessageReducer, {
    message: {},
    count: {}
  });
  const [messages, dispatchMessageList] = useReducer(messagesReducer, {
    data: [],
    isLoading: false,
    isError: false,
    offset: 0,
    limit: 10,
    count: 0
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
      "chatId": chatIdRef.current,
    }
    event.target.message.value = '';
    dispatchMessageList({
      type: "APPEND_TO_STATE",
      payload: {
        "data": data,
      }
    });
    // add to last message state
    dispatchLastMessageList({
      type: "ADD_MESSAGE_WITHOUT_COUNT",
      payload: {
        "id": data.chatId,
        "message": data.content
      }
    });
    socket.current.emit('message', JSON.stringify(data));
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
      dispatchChatList({ type: "API_FETCH_ERROR" });
    }
  }

  const handleMessageList = async (chatId, changed=false) => {
    if (!chatId) return;
    let offset = 0;
    if (changed)  {
      dispatchMessageList({ type: "NEW_CHAT" });
    }
    else  {
      dispatchMessageList({ type: "API_FETCH_INIT" });
      offset = messages.offset;
    }

    if (messages.offset <= messages.count) {
      const messageResult = await axios.post('/messages/all', {
        "chatId": chatId.toString(),
        "offset": offset,
        "limit": messages.limit
      });
      try {
        dispatchMessageList({
          type: "API_FETCH_SUCCESS",
          payload: { 
            "data": messageResult.data.rows,
            "offset": offset + messages.limit,
            "count": messageResult.data.count
          }
        });
      } catch {
        dispatchMessageList({ type: "API_FETCH_ERROR" });
      }
    }

    dispatchLastMessageList({
      type: "CLEAR_COUNT",
      payload: {
        "id": chatId
      }
    });
  }

  const updateMessageState = (data, chatId) => {
    if (chatId === data.chatId) {
      dispatchMessageList({
        type: 'APPEND_TO_STATE',
        payload: {
          "data": data
        }
      });

      dispatchLastMessageList({
        type: "ADD_MESSAGE_WITHOUT_COUNT",
        payload: {
          "id": data.chatId,
          "message": data.content
        }
      });
    } else {
      dispatchLastMessageList({
        type: "ADD_MESSAGE",
        payload: {
          "id": data.chatId,
          "message": data.content
        }
      });
    }
  };

  // TODO: find better way to intialize socket
  useEffect(() => {
    socket.current = io(ENDPOINT);
    handleUserList();
  }, [])

  useEffect(() => {
    if (!socket.current) return;
    // message event
    socket.current.on('message', (data) =>  {
      updateMessageState(data, chatIdRef.current);
    });

    // chat joined event
    socket.current.on('chat joined', (data) => {
      dispatchChatList({
        type: 'APPEND_TO_STATE',
        payload: data
      });
    });

    // user online event
    socket.current.on('isOnline', (data) => {
      setOnlineList(prevState => ({
        ...prevState,
        [data.userId]: data.status,
      }));
    });

    // get currently online users
    socket.current.on('currentOnline', (data) => {
      data.userIds.forEach(userId => {
        setOnlineList(prevState => ({
          ...prevState,
          [userId]: 'online',
        }));
      });
    });

  }, []);

  useEffect(() => {
    chatIdRef.current = chatInfo.chatId;
    handleMessageList(chatIdRef.current, true);
  }, [chatInfo.chatId]);

  return (
    <Grid container className={classes.root} spacing={0}>
      <Grid container spacing={0}>
        <Grid item xs>
          <ChatsContainer 
            primaryList={chatList} 
            secondaryList={lastMessageList}
            onlineList={onlineList}
          />
        </Grid>
        <Grid item xs={9}>
          <MessagesContainer 
            list={messages} 
            submit={handleMessageSubmit} 
            socket={socket.current}
            loadMore={handleMessageList} 
          />
        </Grid>
      </Grid>
    </Grid>  
  );
}

export default Home;