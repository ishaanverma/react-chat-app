import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

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

function UserList() {
  const classes = useStyles();

  return(
    <>
      <Container className={classes.list} maxWidth={false} disableGutters={true}>
        <AppBar position="static">
          <Toolbar>
            <Typography>
              User List
            </Typography>
          </Toolbar>
        </AppBar>
      
        <List>
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
      </Container>
    </>
  );
}

export default UserList;
