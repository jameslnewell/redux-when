
# Change log

## 1.0.0

- break: renamed the `when` action creator to `once` and added a new action creator named `when` which dispatches the action every time the condition evaluates to true
- break: changed the action name from `@when` to `@redux-when/once`
- break: no longer checking if the condition is met `store.subscribe()`
- break: added the `action` that caused the state to be updated as the second parameter
- break: switched to using the redux middleware pattern instead of the redux enhancer pattern to simplify setup
