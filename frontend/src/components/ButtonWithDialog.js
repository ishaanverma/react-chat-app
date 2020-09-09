import React, { useReducer, useEffect } from 'react';
import axios from 'axios';
import DialogWithList from './DialogWithList';
import { apiReducer } from '../reducer/apiReducer';

const ButtonWithDialog = (props) => {
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

  return(
    <DialogWithList value={props.value} index={props.index} userList={userList}/>
  );
}

export default ButtonWithDialog;