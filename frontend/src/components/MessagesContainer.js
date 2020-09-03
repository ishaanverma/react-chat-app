import React, { useContext } from 'react';
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
import { ChatInfoContext } from '../context/chatInfo';
import AppBarWithTitle from './AppBarWithTitle';


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

function MessageList({ list, submit })  {
  const classes = useStyles();
  const { chatInfo } = useContext(ChatInfoContext);

  return(
    <Grid container direction="column" className={classes.root}>
      <Grid item className={classes.messageBarContainer}>
        <AppBarWithTitle title={chatInfo.chatName} />
      </Grid>
      
      <Grid item className={classes.messagesGridItem}>
        <Container maxWidth={false} disableGutters className={classes.messagesContainer}>
          <List className={classes.list}>
            {list.isError && <p>Error</p>}
            {list.isLoading ? (
              <LinearProgress />
            ) : (
              list.data.map((item, index) => 
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <AccountCircleIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={item.content} secondary={item.User.name} />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              )
            )}
          </List>
        </Container>
      </Grid>
      
      <Grid item className={classes.sendBarContainer}>
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