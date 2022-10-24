/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react'
import { Helmet } from 'react-helmet' // Header Generator
import { Switch, Route } from 'react-router-dom'

import HomePage from 'containers/HomePage/HomePage'

import '../../styles/styles.scss'


export default function App(props) { 
    return (
      <div className="app-wrapper">
        <Helmet defaultTitle="Everyone's a critic">
          <meta name="description" content="React Movie Reviews" />
        </Helmet>

        <Switch>
          <Route path="/" component={HomePage} exact />
          <Route path="/home" component={HomePage} />
        </Switch>
      </div>
    )
  }
