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
  const waiting = [];
  let lastToken = 0;

  return next => action => {
    const {type, payload} = action;

    if (type === ONCE || type === WHEN) {

      //dispatch the action immediately if the condition is met
      const state = store.getState();
      if (payload.condition(state, action)) {
          next(payload.createAction(action));
          if (type === ONCE) {
            return null;
          }
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

      // dispatch items in order
      let length = waiting.length;
      for (let index=0; index<length; ++index) {
        const when = waiting[index];

        //check if the condition is met
        if (when.payload.condition(state, action)) {
          
          //remove the delayed action
          if (when.type === ONCE) {
            waiting.splice(index, 1);
            // adjust index and length to cater for deleted items
            index = index - 1;
            length = length - 1;
          }

          //dispatch the delayed action
          store.dispatch(when.payload.createAction(action));

        }

      }
      
      return result;
    }

  }
};
