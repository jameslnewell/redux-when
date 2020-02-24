
# Change log

## 2.1.3

- fix: ensure all delayed actions which match the condition are dispatched (https://github.com/jameslnewell/redux-when/issues/7)

## 2.1.1

- fix: moved change log to change log

## 2.1.0

- added Typescript types

## 1.0.1-2

- fix: updated documentation

## 1.0.0

- break: switched to using the redux middleware pattern instead of the redux enhancer pattern to simplify setup
- break: switched to using an action creator instead of an action 
- break: renamed the `when` action creator to `once` and added a new action creator named `when` which dispatches the action *every* time the condition evaluates to true
- break: changed the action name from `@when` to `@redux-when/once`
- break: no longer checking if the `when` condition is met in `store.subscribe()` but when the action is dispatched using a middleware
- break: added the `action` that caused the state to be updated as the second parameter of the condition
- add: ability to `cancel()` delayed actions

## 0.1.2

- fix: [#2](https://github.com/jameslnewell/redux-when/issues/2)
