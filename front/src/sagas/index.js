import { all ,fork } from 'redux-saga/effects';
import axios from 'axios';

import postSaga from './post';
import userSage from './user';

axios.defaults.baseURL = 'http://localhost:4001';
axios.defaults.withCredentials = true;

export default function* rootSaga() {
  yield all([
    fork(postSaga),
    fork(userSage)
  ])
}