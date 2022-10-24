/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import '@babel/polyfill'

// Import all the third party stuff
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { Router, Redirect, Route } from 'react-router-dom'
import FontFaceObserver from 'fontfaceobserver'
import history from 'utils/history'
import 'sanitize.css/sanitize.css'

// Import root app
import App from 'containers/App'

// Load the favicon and the .htaccess file
import '!file-loader?name=[name].[ext]!./images/favicon.ico'
import 'file-loader?name=.htaccess!./.htaccess' // eslint-disable-line import/extensions

import configureStore from './config/configureStore'

// Observe loading of Open Sans (to remove open sans, remove the <link> tag in
// the index.html file and this observer)
const openSansObserver = new FontFaceObserver('Open Sans', {})

// When Open Sans is loaded, add a font-family using Open Sans to the body
openSansObserver.load().then(() => {
  document.body.classList.add('fontLoaded')
})

// Create redux store with history
const initialState = {}
const store = configureStore(initialState, history)
const MOUNT_NODE = document.getElementById('app')

// Handling our subdomains
const parsedData = window.location.host.split('.')

const render = messages => {
  if (
    /localhost/.test(parsedData[0]) ||
    (parsedData.length >= 3 && parsedData[0] !== 'www')
  ) {
    const subDomain = parsedData[0]
    ReactDOM.render(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <App history={history} />
        </ConnectedRouter>
      </Provider>,
      MOUNT_NODE
    )

  } else {
    console.log('HIT')
  }
}

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['containers/App'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE)
    render()
  })
}

render()
