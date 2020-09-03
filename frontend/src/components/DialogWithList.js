import React from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ListWithText from './ListWithText';

const DialogWithList = ({ open, onClose, userList }) => {
  const [error, setError] = React.useState(false);
  const [name, setName] = React.useState("");
  const [checked, setChecked] = React.useState([]);

  // keep track of selected items in Dialog
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  // keep track of chat name
  const handleTextChange = (event) => {
    setName(event.target.value);
  };

  // send name and checked when clicked
  const handleOk = async () => {
    if (!name) {
      setError(true);
      return;
    }
    // TODO: handle errors
    const result = await axios.post('/chats/create', {
      "name": name,
      "members": checked
    });
    setChecked([]);
    setName('');
    onClose();
  };
  // TODO: make a form with validation
  return (
    <Dialog
      fullWidth={true}
      maxWidth="sm"
      open={open}
    >
      <DialogTitle>Create New Chat</DialogTitle>
      <DialogContent dividers>
        <ListWithText
          listData={userList}
          click={handleToggle}
          change={handleTextChange}
          data={checked}
          icon={AccountCircleIcon}
          error={error}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button color="primary" onClick={handleOk}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogWithList;