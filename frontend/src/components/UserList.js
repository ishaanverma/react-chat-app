import React, { useReducer, useEffect } from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ListWithText from './ListWithText';
import { apiReducer } from '../reducer/apiReducer';

const UserList = (props) => {
  const [error, setError] = React.useState(false);
  const [name, setName] = React.useState("");
  const [checked, setChecked] = React.useState([]);
  const [userList, dispatchUserList] = useReducer(apiReducer, {
    data: [],
    isLoading: false,
    isError: false
  });

  const handleButton = async () => {
    dispatchUserList({ type: "API_FETCH_INIT" });
    const result = await axios.get('/users/all');

    try {
      dispatchUserList({ 
        type: "API_FETCH_SUCCESS",
        payload: result.data
      });
    } catch(err) {
      dispatchUserList({ type: "API_FETCH_ERROR" });
    }
  }

  useEffect(() => {
    handleButton();
  }, [props.value])

  // keep track of selected items
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
  const handleOk = async (event) => {
    event.preventDefault();
    try {
      await axios.post('/chats/create', {
        "name": name,
        "members": checked
      });
    } catch {
      setError(true);
      return;
    }

    setChecked([]);
    setName('');
  };

  return(
    <Container
      hidden={props.value !== props.index}
    >
      <form onSubmit={handleOk} hidden={props.value !== props.index}>
        <ListWithText
          listData={userList}
          click={handleToggle}
          change={handleTextChange}
          data={{checked, name}}
          icon={AccountCircleIcon}
          error={error}
        />
        <Button color="primary" type="submit">
          Ok
        </Button>
      </form>
    </Container>
  );
}

export default UserList;