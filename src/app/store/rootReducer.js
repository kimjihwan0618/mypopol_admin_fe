import { combineReducers } from '@reduxjs/toolkit';
import fuse from './fuse';
import user from './userSlice';
import dashboard from './dashboardSlice';
import pageTemplates from './pageTemplatesSlice';
import common from './common';

const createReducer = (asyncReducers) => (state, action) => {
  const combinedReducer = combineReducers({
    fuse,
    user,
    common,
    dashboard,
    pageTemplates,
    ...asyncReducers,
  });

  /*
  Reset the redux store when user logged out
   */
  if (action.type === 'user/userLoggedOut') {
    // state = undefined;
  }

  return combinedReducer(state, action);
};

export default createReducer;
