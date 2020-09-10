import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
import LinearProgress from '@material-ui/core/LinearProgress';
import ListItemText from '@material-ui/core/ListItemText';
import Badge from '@material-ui/core/Badge';

const StyledBadge = withStyles((theme) => ({
  badge: {
    padding: '0 4px',
    backgroundColor: '#44b700'
  },
}))(Badge);

const ListWithText = ({ listData, click, data, icon, change, error }) => 
  <>
    <TextField 
      label="Chat Name"
      variant="outlined"
      margin="normal"
      value={data.name}
      onChange={change}
      error={error}
      required
      fullWidth
    />
    <List>
      { listData.userList.isError && <p>Error</p> }
      {listData.userList.isLoading ? (
        <LinearProgress />
      ) : (
        listData.userList.data.map((item, index) => {
          return(
            <ListItem key={index} role={undefined} onClick={click(item)} dense button disableRipple>
              <ListItemAvatar>
                <StyledBadge 
                  invisible={listData.onlineList[item.id] === 'online' ? false : true}
                  overlap="circle"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  variant="dot"
                >
                  <Avatar component={icon} />
                </StyledBadge>
              </ListItemAvatar>
              <ListItemText primary={item.name} secondary={listData.onlineList[item.id] === 'online' ? 'online' : 'offline'} />
              <ListItemSecondaryAction>
                <Checkbox
                  edge="end"
                  onChange={click(item)}
                  checked={data.checked.indexOf(item) !== -1}
                  tabIndex={-1}
                />
              </ListItemSecondaryAction>
            </ListItem>
          );
        })
      )}
    </List>
  </>

export default ListWithText;