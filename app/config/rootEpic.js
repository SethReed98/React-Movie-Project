import { combineEpics } from 'redux-observable'
import { resourcesEpic } from 'resources/resources'

export const rootEpic = combineEpics(
  resourcesEpic,
);
