import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
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

const useStyles = makeStyles((theme) => ({
  sendBarContainer: {
    margin: 0,
    padding: 0,
    width: '100%',
    position: 'relative',
    top: 'auto',
    bottom: 0,
  },
  sendBar: {
    margin: theme.spacing(1),
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    height: '100',
    width: '90%',
    bottom: 0,
    borderRadius: '50px',
  },
  sendInput: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  list: {
    width: '100%',
    position: 'relative',
    overflow: 'auto',
    height: '85%'
  },
  messagesContainer: {
    margin: 0,
    padding: 0,
    width: '100%',
    height: '88vh',
    border: 'solid 1px black',
    position: 'relative'
  },
}));

function MessageList({ list, submit })  {
  const classes = useStyles();

  return(
    <>
      <Container className={classes.messagesContainer}>
        <AppBar position="static">
          <Toolbar>
            <Typography>
              User 1
            </Typography>
          </Toolbar>
        </AppBar>
      
        <List className={classes.list}>
          {list.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <AccountCircleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={item.message} />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Container>
      <Container className={classes.sendBarContainer}>
        <Paper 
          component="form" 
          className={classes.sendBar} 
          variant="outlined"
          onSubmit={submit}
        >
          <InputBase
            id="message"
            className={classes.sendInput}
            placeholder="Send a message"
          />
          <IconButton type="submit">
            <SendRoundedIcon />
          </IconButton>
        </Paper>
      </Container>
    </>
  );
}

export default MessageList;