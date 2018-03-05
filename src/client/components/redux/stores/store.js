import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootSaga from '../sagas'
import reducers from '../reducers'
import setupSocket from './setupSocket'
import Cookies from 'js-cookie'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'],
}

const sagaMiddleware = createSagaMiddleware()

const persistedReducer = persistReducer(persistConfig, reducers)

const store = createStore(
  persistedReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(sagaMiddleware)
)

const parseSessionId = authCookie => authCookie.split(':')[1].split('.')[0]

const socket = setupSocket(
  store.dispatch,
  parseSessionId(Cookies.get('express.sid'))
)

sagaMiddleware.run(rootSaga)

const persistor = persistStore(store)

export { store, persistor }
