# redux-when

Redux middleware for delaying dispatch of an action until a condition evaluates to true.

> If you're upgrading from `v0.1.0` make sure you read about the  [changes](./CHANGELOG.md) introduced in `v1.0.0`.

## Installation

    npm install --save redux-when

## Usage

```javascript
import {createStore, applyMiddleware} from 'redux';
import middleware, {once} from 'redux-when';

const reducer = (state = {}, action = {}) => {
  switch (action.type) {

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
store.dispatch(once(state => state.saved, () => ({type: 'NAVIGATE'})));

//prints: {}
console.log(store.getState());

//dispatch the `SAVE` action which will update the state and trigger
// the delayed `NAVIGATE` action
store.dispatch({type: 'SAVE'});

//prints: {saved: true, navigated: true}
console.log(store.getState());

```

## API

### middleware

The Redux middleware.

### once(condition, createAction)

Creates an action that will execute ONCE when the `condition` evaluates to true.

**Parameters:**

- `condition : (state : object, action : object) => boolean` &mdash; Required. The condition that determines when the action is dispatched.

- `createAction : (action : object) => *` &mdash; Required. A function creating the action that will be dispatched when the `condition` evaluates to `true`. Can return any value dispatchable by your store including thunks, promises etc as long as your store is configured with the necessary middleware.

**Returns:**

Returns a dispatchable Redux action that will be handled by the `redux-when` middleware.

> Note: You MUST dispatch the created action.
  ```js
  store.dispatch(once(() => true, () => {type: 'xyz'}));
  ```

### when(condition, createAction)

Creates an action that will execute EVERY time the `condition` evaluates to true.

**Parameters:**

- `condition : (state : object, action : object) => boolean` &mdash; Required. The condition that determines when the action is dispatched.

- `createAction : (action : object) => *` &mdash; Required. A function creating the action that will be dispatched when the `condition` evaluates to `true`. Can return any value dispatchable by your store including thunks, promises etc as long as your store is configured with the necessary middleware.

**Returns:**

Returns a dispatchable Redux action that will be handled by the `redux-when` middleware.

> Note: You MUST dispatch the created action.
  ```js
  store.dispatch(when(() => true, () => {type: 'xyz'}));
  ```
