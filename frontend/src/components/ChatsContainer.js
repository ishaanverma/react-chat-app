import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ChatIcon from '@material-ui/icons/Chat';
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
}));

function ChatsContainer({ list }) {
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
        <AppBarWithTitle title="Chats" />
        <ButtonWithDialog />
        <DisplayDataWithList 
          listData={list}
          click={handleListClick}
          icon={ChatIcon}
        />
      </Container>
    </>
  );
}

export default ChatsContainer;
