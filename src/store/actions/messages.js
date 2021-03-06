import { apiCall } from "../../services/api";
import { addError } from "./error";
import {
  LOAD_MESSAGES,
  LOAD_MESSAGE,
  REMOVE_MESSAGE,
  LIKE_MESSAGE,
  UNLIKE_MESSAGE,
  POST_MESSAGE,
  LOADING_DATA,
  POST_COMMENT
} from "../actionTypes";

export const loadMessages = messages => ({
  type: LOAD_MESSAGES,
  messages
});

const loadMessage = message => ({
  type: LOAD_MESSAGE,
  message
})

const postMessage = message => ({
  type: POST_MESSAGE,
  message
});

const remove = id => ({
  type: REMOVE_MESSAGE,
  id
});

const like = message => ({
  type: LIKE_MESSAGE,
  message
});

const unlike = message => ({
  type: UNLIKE_MESSAGE,
  message
});

const comment = data => ({
  type: POST_COMMENT,
  data
})

export const fetchMessages = () => {
  return dispatch => {
    dispatch({ type: LOADING_DATA });
    return apiCall("get", "/api/messages")
      .then(data => {
        dispatch(loadMessages(data));
      })
      .catch(err => {
        dispatch(addError(err.message));
      });
  };
};

export const fetchMessage = (user_id, message_id) => (dispatch) => {
   return apiCall("get", `/api/user/${user_id}/messages/${message_id}`)
     .then(message => dispatch(loadMessage(message)))
     .catch(err => dispatch(addError(err.message)));
}

export const postNewMessage = text => (dispatch, getState) => {
  let { currentUser } = getState();
  const id = currentUser.user._id;
  return apiCall("post", `/api/users/${id}/messages`, { text })
    .then(message => dispatch(postMessage(message)))
    .catch(err => dispatch(addError(err.message)));
};

export const removeMessage = (user_id, message_id) => {
  return dispatch => {
    return apiCall("delete", `/api/users/${user_id}/messages/${message_id}`)
      .then(() => dispatch(remove(message_id)))
      .catch(err => dispatch(addError(err.message)));
  };
};

export const likeMessage = message_id => (dispatch, getState) => {
  let { currentUser } = getState();
  const id = currentUser.user._id;
  return apiCall("get", `/api/users/${id}/messages/${message_id}/like`)
    .then(message => dispatch(like(message)))
    .catch(err => dispatch(addError(err.message)));
};

export const unlikeMessage = message_id => (dispatch, getState) => {
  let { currentUser } = getState();
  const id = currentUser.user._id;
  return apiCall("get", `/api/users/${id}/messages/${message_id}/unlike`)
    .then(message => dispatch(unlike(message)))
    .catch(err => dispatch(addError(err.message)));
};

export const postComment = (message_id, text) => (dispatch, getState) => {
  let { currentUser } = getState();
  const id = currentUser.user._id;
  return apiCall("post", `/api/users/${id}/messages/${message_id}/comment`, text)
    .then(data => dispatch(comment(data)))
    .catch(err => dispatch(addError(err.message)));
}