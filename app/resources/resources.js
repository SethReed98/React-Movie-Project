import { combineReducers } from 'redux'
import { combineEpics } from 'redux-observable'

import reviewsReducer from './reviews/reviews.reducer'
import reviewsEpic from './reviews/reviews.epics'

//Step 1: Add epic
export const resourcesEpic = combineEpics(reviewsEpic)

//Step 2: Add reducer for each module
export const resourcesReducer = combineReducers({
  reviews: reviewsReducer,
})
