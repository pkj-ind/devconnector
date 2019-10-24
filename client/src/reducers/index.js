import {combineReducers} from 'redux';
import alert from './alert';
import auth from './auth';

export default combineReducers({alert,auth})
/*
const rootReducer= combineReducers({alert})

export default rootReducer; */