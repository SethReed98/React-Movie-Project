import React from 'react'

const ReviewDetails = ({ review }) => {
  return (
    <div>
      <h2>{review.display_title}</h2>
      <img src={review.multimedia.src} alt={review.display_title} />
      <p>MPAA Rating: {review.mpaa_rating}</p>
      <p>Critic's Pick: {review.critics_pick ? 'Yes' : 'No'}</p>
      <p>Headline: {review.headline}</p>
      <p>Summary: {review.summary_short}</p>
      <p>Byline: {review.byline}</p>
      <a href={review.link.url} target="_blank" rel="noopener noreferrer">
        Read the full review
      </a>
    </div>
  )
}

export default ReviewDetails