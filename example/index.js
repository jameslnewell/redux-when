import {createStore, applyMiddleware} from 'redux';
import middleware, {once} from '..';

const reducer = (state = {}, action = {}) => {
  const {type} = action;
  switch (type) {

    case 'SAVE':
      return {...state, saved: true};

    case 'NAVIGATE':
      return {...state, navigated: true};

    default:
      return state;

  }
};

//create the store
const store = createStore(reducer, {}, applyMiddleware(middleware));

//dispatch the `NAVIGATE` action ONCE the state has been saved
store.dispatch(once(state => state.saved, {type: 'NAVIGATE'}));

//prints: {}
console.log(store.getState());

//dispatch the `SAVE` action which will update the state and trigger
// the delayed `NAVIGATE` action
store.dispatch({type: 'SAVE'});

//prints: {saved: true, navigated: true}
console.log(store.getState());
