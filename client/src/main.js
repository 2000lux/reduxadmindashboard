import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import Login from './Session/hoc'
import AppContainer from './Layout/AppContainer'
import store from './config/store'
import axios from 'axios'

const session = store.getState().session;

const logged = typeof session !== 'undefined' 
    && typeof session.access_token !== 'undefined' 

if(logged) {
  // API authorization
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + session.access_token;
}

ReactDOM.render(
  <Provider store={store}>
    <Router>   
      <div>      
      { !logged && <Route exact path="/login" component={Login} /> }

      { !logged && <Redirect to="/login" /> }

      {  logged && <AppContainer /> }
      </div>
    </Router>
  </Provider>,
  document.getElementById('root')
)
