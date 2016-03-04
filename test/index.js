import sinon from 'sinon';
import {expect} from 'chai';
import enhancer, {WHEN, when} from '..';

const noop = () => {/* do nothing */};

describe('redux-when', () => {

  describe('when()', () => {

    it('should create a when() action', () => {

      const condition = () => false;
      const action = {type: 'foobar'};
      const whenAction = when(condition, action);

      expect(whenAction).to.be.deep.equal({
        type: WHEN,
        payload: {
          condition,
          action
        }
      });
    });

  });

  it('should return a function for creating an enhanced store', () => {
    const createStore = sinon.stub().returns({});
    expect(enhancer(createStore)).to.be.a('function');
  });

  it('should call the original function when creating an enhanced store', () => {
    const createStore = sinon.stub().returns({subscribe: sinon.spy()});

    enhancer(createStore)();

    expect(createStore.calledOnce).to.be.true;
  });

  it('should subscribe() to the original store when creating an enhanced store', () => {
    const subscribe = sinon.spy();
    const createStore = sinon.stub().returns({subscribe});

    enhancer(createStore)();

    expect(subscribe.calledOnce).to.be.true;
  });

  it('should call dispatch() on the original store for actions which are not intended to be delayed', () => {
    const subscribe = sinon.spy();
    const dispatch = sinon.spy();
    const createStore = sinon.stub().returns({subscribe, dispatch});
    const enhancedStore = enhancer(createStore)();

    enhancedStore.dispatch({type: 'foobar'});

    expect(dispatch.calledOnce).to.be.true;
    expect(dispatch.calledWith({type: 'foobar'})).to.be.true;
  });

  it('should not call dispatch() on the original store for actions which are intended to be delayed', () => {
    const subscribe = sinon.spy();
    const dispatch = sinon.spy();
    const createStore = sinon.stub().returns({subscribe, dispatch});
    const enhancedStore = enhancer(createStore)();

    enhancedStore.dispatch(when(null, null));

    expect(dispatch.calledOnce).to.be.false;
  });

  it('should call dispatch() once, with the action when the state changes and the condition() is true', () => {
    const subscribe = sinon.spy();
    const dispatch = sinon.spy();
    const getState = sinon.stub().returns({});
    const createStore = sinon.stub().returns({subscribe, dispatch, getState});
    const enhancedStore = enhancer(createStore)();

    enhancedStore.dispatch(when(() => true, {type: 'foobar'}));
    subscribe.args[0][0]();
    subscribe.args[0][0]();

    expect(dispatch.calledOnce).to.be.true;
    expect(dispatch.calledWith({type: 'foobar'})).to.be.true;
  });

  it('should not call dispatch() when the state changes and the condition() is false', () => {
    const subscribe = sinon.spy();
    const dispatch = sinon.spy();
    const getState = sinon.stub().returns({});
    const createStore = sinon.stub().returns({subscribe, dispatch, getState});
    const enhancedStore = enhancer(createStore)();

    enhancedStore.dispatch(when(() => false, {type: 'foobar'}));
    subscribe.args[0][0]();
    subscribe.args[0][0]();

    expect(dispatch.notCalled).to.be.true;
  });

});
