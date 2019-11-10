import {combineReducers} from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';

export default combineReducers({alert,auth,profile})
/*
const rootReducer= combineReducers({alert})

export default rootReducer; */