export const WHEN = '@when';

export function when(condition, action) {
  return {
    type: WHEN,
    payload: {
      condition,
      action
    }
  };
}

export default function(createStore) {
  return (reducer, initialState, enhancer) => {
    const waiting = [];
    const store = createStore(reducer, initialState, enhancer);

    store.subscribe(() => {
      waiting.forEach((when, index) => {
        const {payload: {condition, action}} = when;

        if (condition(store.getState())) {
          waiting.splice(index);
          store.dispatch(action);
        }

      });
    });

    return {
      ...store,
      dispatch: (action) => {
        const {type} = action;
        if (type === WHEN) {
          waiting.push(action);
        } else {
          return store.dispatch(action);
        }
      }
    };

  };
}
