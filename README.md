# redux-when

Redux middleware for delaying dispatch of an action until a condition evaluates to true.

> If you're upgrading from `v0.1.x` make sure you read about the  [changes](./CHANGELOG.md) introduced in `v1.0.0`.

##### Why

Usually, you use promises to chain asynchronous actions:

```js
/*
 Save the form and navigate somewhere
 */
const handleFormSubmit = () => {
  Promise.resolve()
    .then(() => store.dispatch(save(data)))
    .then(() => store.dispatch(navigate()))
  ;
}
```

But sometimes asynchronous actions have already been dispatched and you don't have a promise to chain on. `redux-when` was created to solve this problem:

```js

/*
 Save the form
 */
const handleFieldBlur = () => {
  store.dispatch(save(data))
};

/*
 Wait for any save actions to finish and then navigate somewhere
 */
const handleFormSubmit = () => {
  store.dispatch(once(state => state.saved, navigate()));
}

```

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

Returns a dispatchable Redux action that will be handled by the `redux-when` middleware. When dispatched, a `cancel` token will be returned.

> Note: You MUST dispatch the action created by `once()` otherwise nothing will happen.
  ```js
  store.dispatch(once(() => true, () => {type: 'XYZ'}));
  ```

### when(condition, createAction)

Creates an action that will execute EVERY time the `condition` evaluates to true.

**Parameters:**

- `condition : (state : object, action : object) => boolean` &mdash; Required. The condition that determines when the action is dispatched.

- `createAction : (action : object) => *` &mdash; Required. A function creating the action that will be dispatched when the `condition` evaluates to `true`. Can return any value dispatchable by your store including thunks, promises etc as long as your store is configured with the necessary middleware.

**Returns:**

Returns a dispatchable Redux action that will be handled by the `redux-when` middleware. When dispatched, a `cancel` token will be returned.

> Note: You MUST dispatch the action created by `when()` otherwise nothing will happen.
  ```js
  store.dispatch(when(() => true, () => {type: 'XYZ'}));
  ```

### cancel(token)

Cancels a delayed action created by `once()` or `when()`.

**Parameters:**

- `token : *` &mdash; Required. A token returned by `once()` or `when()`.

**Returns:**

Returns a dispatchable Redux action that will be handled by the `redux-when` middleware. When dispatched, `null` will be returned.

> Note: You MUST dispatch the action created by `cancel()` otherwise nothing will happen.

```js
import React from 'react';
import {connect} from 'react-redux';

class Example extends React.Component {

  componentWillMount() {
    this.token = this.props.dispatch(when(() => true, () => {type: 'XYZ'));
  }

  componentWillUnmount() {
    this.token = this.props.dispatch(cancel(this.token));
  }

}

export default connect()(Example);
```

# Change log

[Change log](https://github.com/jameslnewell/redux-when/blob/master/README.md).