import {createStore} from 'redux';
import enhancer, {when} from '..';

const reducer = (state = {}, action = {}) => {
  const {type} = action;
  switch (type) {

    case 'save':
      return {...state, saved: true};

    case 'navigate':
      return {...state, navigated: true};

    default:
      return state;

  }
};

//create the store
const store = createStore(reducer, {}, enhancer);

//dispatch the `navigate` action when the state has been saved
store.dispatch(when(state => state.saved, {type: 'navigate'}));

console.log(store.getState()); //prints: {}

//dispatch the `save` action which will update the sate and trigger the `navigate` action
store.dispatch({type: 'save'});

console.log(store.getState()); //prints: {saved: true, navigated: true}
