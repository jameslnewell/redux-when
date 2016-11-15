import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import configureStore from 'redux-mock-store'
import middleware, {ONCE, once, WHEN, when} from '..';

chai.use(sinonChai);

const ACTION_FOO = {type: 'FOO'};
const ACTION_BAR = {type: 'BAR'};
const ACTION_FOOBAR = {type: 'FOOBAR'};

const createStore = configureStore([middleware]);

describe('redux-when', () => {

  describe('once()', () => {

    it('should create a once() action', () => {

      const condition = () => false;
      const action = {type: 'foobar'};
      const onceAction = once(condition, action);

      expect(onceAction).to.be.deep.equal({
        type: ONCE,
        payload: {
          condition,
          action
        }
      });
    });

  });

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

  describe('middleware()', () => {

    it('should not dispatch delayed action when using once() and the condition evaluates to false', () => {

      const store = createStore();
      const condition = sinon.stub();
      condition.withArgs({}, ACTION_FOO).returns(true);

      store.dispatch(once(condition, ACTION_FOOBAR));
      store.dispatch(ACTION_BAR);
      store.dispatch(ACTION_BAR);

      expect(store.getActions()).to.be.deep.equal([
        ACTION_BAR, ACTION_BAR
      ]);

    });

    it('should dispatch delayed action one time when using once() and the condition evaluates to true more than once', () => {

      const store = createStore();
      const condition = sinon.stub();
      condition.withArgs({}, ACTION_BAR).returns(true);

      store.dispatch(once(condition, ACTION_FOO));
      store.dispatch(ACTION_BAR);
      store.dispatch(ACTION_BAR);

      expect(condition).to.be.calledOnce;
      expect(store.getActions()).to.be.deep.equal([
        ACTION_BAR, ACTION_FOO,
        ACTION_BAR
      ]);

    });

    it('should not dispatch delayed action when using when() and the condition evaluates to false', () => {

      const store = createStore();
      const condition = sinon.stub();
      condition.withArgs({}, ACTION_FOO).returns(true);

      store.dispatch(when(condition, ACTION_FOOBAR));
      store.dispatch(ACTION_BAR);
      store.dispatch(ACTION_BAR);

      expect(store.getActions()).to.be.deep.equal([
        ACTION_BAR, ACTION_BAR
      ]);

    });

    it('should dispatch a delayed action more than once when using when() and the condition evaluates to true more than once', () => {

      const store = createStore();
      const condition = sinon.stub();
      condition.withArgs({}, ACTION_BAR).returns(true);

      store.dispatch(when(condition, ACTION_FOO));
      store.dispatch(ACTION_BAR);
      store.dispatch(ACTION_BAR);

      expect(condition).to.be.called;
      expect(store.getActions()).to.be.deep.equal([
        ACTION_BAR, ACTION_FOO,
        ACTION_BAR, ACTION_FOO
      ]);

    });

  });

});
