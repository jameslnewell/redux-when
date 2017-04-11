export const ONCE = '@redux-when/once';
export const WHEN = '@redux-when/when';
export const CANCEL = '@redux-when/cancel';

export function once(condition, createAction) {
  return {
    type: ONCE,
    payload: {
      condition,
      createAction
    }
  };
}

export function when(condition, createAction) {
  return {
    type: WHEN,
    payload: {
      condition,
      createAction
    }
  };
}

export function cancel(token) {
  return {
    type: CANCEL,
    payload: token
  };
}

export default store => {
  let waiting = [];
  let lastToken = 0;

  return next => action => {
    const {type, payload} = action;

    if (type === ONCE || type === WHEN) {
      const state = store.getState();
      if (payload.condition(state, action)) {
          next(payload.createAction(action));
          if(type === ONCE) return;
      }

      const token = ++lastToken;

      //attach the token
      action.meta = {token};

      //delay the action
      waiting.push(action);

      return token;
    } else if (type === CANCEL) {

      //if we can find the token, remove it
      const index = waiting.findIndex(when => when.meta.token === action.payload);
      if (index !== -1) {
        waiting.splice(index, 1);
      }

      return null;

    } else {

      //finish dispatching the action
      const result = next(action);

      //get the updated state
      const state = store.getState();

      const readyToBeDispatched = waiting
          .filter(when => when.payload.condition(state, action));

      readyToBeDispatched
          .forEach(when => next(when.payload.createAction(action)));

      waiting = waiting
          .filter(when => when.payload.condition(state, action) && when.type !== ONCE);

      return result;
    }

  }
};
