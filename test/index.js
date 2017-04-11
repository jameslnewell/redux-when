import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import configureStore from 'redux-mock-store'
import middleware, {ONCE, once, WHEN, when, CANCEL, cancel} from '../index';

chai.use(sinonChai);

const ACTION_FOO = {type: 'FOO'};
const ACTION_BAR = {type: 'BAR'};
const ACTION_FOOBAR = {type: 'FOOBAR'};

const createStore = configureStore([middleware]);

describe('redux-when', () => {

  describe('once()', () => {

    it('should create a once() action', () => {

      const condition = () => false;
      const createAction = () => {type: 'foobar'};
      const onceAction = once(condition, createAction);

      expect(onceAction).to.be.deep.equal({
        type: ONCE,
        payload: {
          condition,
          createAction
        }
      });
    });

  });

  describe('when()', () => {

    it('should create a when() action', () => {

      const condition = () => false;
      const createAction = () => {type: 'foobar'};
      const whenAction = when(condition, createAction);

      expect(whenAction).to.be.deep.equal({
        type: WHEN,
        payload: {
          condition,
          createAction
        }
      });
    });

  });

  describe('middleware()', () => {

    describe('ONCE', () => {

      it('should immediately evaluate and dispatch action ONCE when evaluated as true', () => {
          const store = createStore();
          const condition = sinon.stub();
          condition.returns(true);
          const actionCreator = sinon.stub().returns(ACTION_FOO);

          store.dispatch(once(condition, actionCreator));

          expect(actionCreator).to.be.calledOnce;
          expect(store.getActions()).to.be.deep.equal([
              ACTION_FOO
          ]);
      });

      it('should not dispatch delayed action when the condition evaluates to false', () => {

        const store = createStore();
        const condition = sinon.stub();
        condition.withArgs({}, ACTION_FOO).returns(true);

        store.dispatch(once(condition, () => ACTION_FOOBAR));
        store.dispatch(ACTION_BAR);
        store.dispatch(ACTION_BAR);

        expect(store.getActions()).to.be.deep.equal([
          ACTION_BAR, ACTION_BAR
        ]);

      });

      it('should dispatch delayed action ONCE when the condition evaluates to true more than once', () => {

        const store = createStore();
        const condition = sinon.stub();
        condition.withArgs({}, ACTION_BAR).returns(true);
        const actionCreator = sinon.stub().returns(ACTION_FOO);

        store.dispatch(once(condition, actionCreator));
        store.dispatch(ACTION_BAR);
        store.dispatch(ACTION_BAR);

        expect(actionCreator).to.be.calledOnce;
        expect(store.getActions()).to.be.deep.equal([
          ACTION_BAR, ACTION_FOO,
          ACTION_BAR
        ]);

      });

    });

    describe('WHEN', () => {

      it('should not dispatch delayed action when the condition evaluates to false', () => {

        const store = createStore();
        const condition = sinon.stub();
        condition.withArgs({}, ACTION_FOO).returns(true);

        store.dispatch(when(condition, () => ACTION_FOOBAR));
        store.dispatch(ACTION_BAR);
        store.dispatch(ACTION_BAR);

        expect(store.getActions()).to.be.deep.equal([
          ACTION_BAR, ACTION_BAR
        ]);

      });

      it('should dispatch a delayed action more than once when the condition evaluates to true more than once', () => {

        const store = createStore();
        const condition = sinon.stub();
        condition.withArgs({}, ACTION_BAR).returns(true);

        store.dispatch(when(condition, () => ACTION_FOO));
        store.dispatch(ACTION_BAR);
        store.dispatch(ACTION_BAR);

        expect(condition).to.be.called;
        expect(store.getActions()).to.be.deep.equal([
          ACTION_BAR, ACTION_FOO,
          ACTION_BAR, ACTION_FOO
        ]);

      });

      it('should dispatch a delayed action with a modified action name when using the createAction(action) parameter', () => {

        const store = createStore();
        const condition = sinon.stub();
        condition.withArgs({}, ACTION_BAR).returns(true);

        store.dispatch(when(condition, action => ({type: `__${action.type}__`})));
        store.dispatch(ACTION_BAR);

        expect(condition).to.be.called;
        expect(store.getActions()).to.be.deep.equal([
          ACTION_BAR, {type: '__BAR__'}
        ]);

      });

    });

    describe('CANCEL', () => {

      it('should not dispatch a delayed action when it has been cancelled', () => {

        const store = createStore();
        const condition = sinon.stub();
        condition.withArgs({}, ACTION_BAR).returns(true);
        const actionCreator = sinon.stub().returns(ACTION_FOO);

        const token = store.dispatch(when(condition, actionCreator));
        store.dispatch(cancel(token));
        store.dispatch(ACTION_BAR);

        expect(actionCreator).to.not.be.called;
        expect(store.getActions()).to.be.deep.equal([
          ACTION_BAR
        ]);

      });

    });

  });

});
