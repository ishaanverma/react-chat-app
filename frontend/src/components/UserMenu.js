import React, { useState, useContext } from 'react';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { ChatInfoContext } from '../context/chatInfo';

const UserMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { chatInfo } = useContext(ChatInfoContext);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  }

  return(
    <>
      <IconButton color="inherit" size="medium" onClick={handleMenuClick}>
        <AccountCircleIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem>
          <Avatar>
            <AccountCircleIcon />
          </Avatar>
          <Typography style={{ marginLeft: '1em' }}>{chatInfo.username}</Typography>
        </MenuItem>
        <MenuItem>Profile</MenuItem>
        <MenuItem>Logout</MenuItem>
      </Menu>
    </>
  );
}

export default UserMenu;