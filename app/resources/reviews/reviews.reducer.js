const initialState = {
  data: []
}

export default (state = { reviews: {} }, action) => {
  switch (action.type) {
    case 'REVIEWS_FETCH_SUCCESS':
      const reviews = action.payload;
      state = Object.assign({}, state, { reviews });
      return state;
    default:
      return state;
  }
}
