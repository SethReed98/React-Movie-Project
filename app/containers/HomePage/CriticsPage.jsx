import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getCritics } from 'resources/reviews/reviews.actions';

export function CriticsPage(props) {
  const { critics } = props.payload;
  console.log(props.payload);

  return (
    <div>
      <h1>Critics Page</h1>
      {critics.map((critic) => (
        <div key={critic.display_name}>
          <h2>{critic.display_name}</h2>
          <img src={critic.multimedia?.src} alt={critic.display_name} />
          <p>Bio: {critic.bio}</p>
          <p>Number of Reviews: {critic.num_results}</p>
          <p>Number of Critics Pick: {critic.num_critics_pick}</p>
        </div>
      ))}
    </div>
  );
}

const mapStateToProps = (state) => {
  const { critics } = state.resources;
  return {
    payload: critics,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getCritics: () => dispatch(getCritics()),
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(CriticsPage);