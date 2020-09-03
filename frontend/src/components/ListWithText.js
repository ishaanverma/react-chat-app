import React from 'react';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
import LinearProgress from '@material-ui/core/LinearProgress';
import ListItemText from '@material-ui/core/ListItemText';

const ListWithText = ({ listData, click, data, icon, change, error }) => 
  <>
    <TextField 
      label="Chat Name"
      variant="outlined"
      margin="normal"
      onChange={change}
      error={error}
      required
      fullWidth
    />
    <List>
      { listData.isError && <p>Error</p> }
      {listData.isLoading ? (
        <LinearProgress />
      ) : (
        listData.data.map((item, index) => {
          return(
            <ListItem key={index} role={undefined} onClick={click(item)} dense button disableRipple>
              <ListItemAvatar>
                <Avatar component={icon} />
              </ListItemAvatar>
              <ListItemText primary={item.name} />
              <ListItemSecondaryAction>
                <Checkbox
                  edge="end"
                  onChange={click(item)}
                  checked={data.indexOf(item) !== -1}
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