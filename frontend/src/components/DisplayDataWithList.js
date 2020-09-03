import React from 'react';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';

const DisplayDataWithList = ({ listData, icon, click }) => 
  <List>
    <Divider />
    {listData.primaryList.isError && <p>Error</p>}
    {listData.primaryList.isLoading ? (
      <LinearProgress />
    ) : (
      listData.primaryList.data.map((item, index) => {
        return(
          <React.Fragment key={index}>
            <ListItem 
              button 
              onClick={!click ? undefined : click(item)}
            >
              <ListItemAvatar>
                <Avatar component={icon} />
              </ListItemAvatar>
              <ListItemText primary={item.name} secondary={listData.secondaryList[item.chatId]} />
            </ListItem>
            <Divider />
          </React.Fragment>
        );
      })
    )}
  </List>

export default DisplayDataWithList;