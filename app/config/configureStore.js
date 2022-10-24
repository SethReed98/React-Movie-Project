/**
 * Create the store with dynamic reducers
 */

import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import axios  from 'axios'
import { createEpicMiddleware } from 'redux-observable'
import createReducer from './rootReducer'
import { rootEpic } from './rootEpic'

export default function configureStore(initialState = {}, history) {
  let composeEnhancers = compose

  // If Redux Dev Tools Extensions are installed, enable them
  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'production' && typeof window === 'object') {
    /* eslint-disable no-underscore-dangle */
    if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
  }

  // Create the store with middlewares
  const epicMiddleware = createEpicMiddleware({
    dependencies: {
      get: axios.get,
      post: axios.post,
      put: axios.put,
      annihilate: axios.delete,
    },
  })

  const middlewares = [epicMiddleware, routerMiddleware(history)]

  const enhancers = [applyMiddleware(...middlewares)]

  const store = createStore(
    createReducer(),
    initialState,
    composeEnhancers(...enhancers)
  )

  epicMiddleware.run(rootEpic)

  // Extensions
  store.injectedReducers = {} // Reducer registry

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      store.replaceReducer(createReducer(store.injectedReducers))
    })
  }

  return store
}
