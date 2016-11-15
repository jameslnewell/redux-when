export const ONCE = '@redux-when/once';
export const WHEN = '@redux-when/when';

export function once(condition, action) {
  return {
    type: ONCE,
    payload: {
      condition,
      action
    }
  };
}

export function when(condition, action) {
  return {
    type: WHEN,
    payload: {
      condition,
      action
    }
  };
}

export default store => {
  const waiting = [];

  return next => action => {
    const {type} = action;

    if (type === ONCE || type === WHEN) {

      //delay the action
      waiting.push(action);

    } else {

      //finish displatching the action
      const result = next(action);

      //get the updated state
      const state = store.getState();

      waiting.forEach((when, index) => {

        //check if the condition is met
        if (when.payload.condition(state, action)) {

          //remove the delayed action
          if (when.type === ONCE) {
            waiting.splice(index, 1);
          }

          //dispatch the delayed action
          store.dispatch(when.payload.action);

        }

      });
      
      return result;
    }

  }
};
