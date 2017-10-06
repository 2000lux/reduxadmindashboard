import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import reducers from './reducers'
import persistState from 'redux-localstorage'
import { composeWithDevTools } from 'redux-devtools-extension'

const enhancer = composeWithDevTools(
  applyMiddleware(thunk),
  persistState('session', 'countries', 'families', 'groups', 'contacts.states', 'currencies')
)

const store = createStore ( 
  reducers, 
  enhancer
);

export default store