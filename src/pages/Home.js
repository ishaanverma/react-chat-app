import React from 'react';
import { makeStyles } from '@material-ui/core/styles'
// import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
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
  root: {
    flexGrow: 1,
  },
  messageSend: {
    margin: theme.spacing(1),
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    height: '100',
    width: '90%',
    bottom: '0',
    borderRadius: '50px',
  },
  control: {
    padding: theme.spacing(2),
  },
  list: {
    width: '100%'
  },
  messageInput: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  messages: {
    margin: theme.spacing(1),
    width: '90%',
    height: '100'
  }
}));

function Home() {
  const classes = useStyles();

  return (
    <Grid container className={classes.root} spacing={0}>
      <Grid item xs={12}>
        <Grid container spacing={0}>
          <Grid item xs>
            <List className={classes.list}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <AccountCircleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="User 1" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <AccountCircleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="User 2" />
              </ListItem>
              <Divider />
            </List>
          </Grid>
          <Grid item xs={9}>
            <Paper className={classes.messages} />
            <Paper component="form" className={classes.messageSend} variant="outlined">
              <InputBase
                className={classes.messageInput}
                placeholder="Send a message"
              />
              <IconButton type="submit" className={classes.messageButton}>
                <SendRoundedIcon />
              </IconButton>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>  
  );
}

export default Home;