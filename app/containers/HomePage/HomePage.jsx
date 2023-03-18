import React, { useState, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { usePagination } from '@table-library/react-table-library/pagination'
import {
  Table,
  Header,
  HeaderRow,
  HeaderCell,
  Body,
  Row,
  Cell,
} from '@table-library/react-table-library/table'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ReviewDetails from './ReviewDetails'

import hesImg from 'images/hes.png'
import { getMovieReviews } from 'resources/reviews/reviews.actions'

export function HomePage(props) {
  // state for search, filters, startDate, endDate, criticsPick
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState([])
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [criticsPick, setCriticsPick] = useState(false)
  // state for selected review for ReviewDetails
  const [selectedReview, setSelectedReview] = useState(null)

  // state for value, min, max for pagination
  const [value, setValue] = useState(20) // default value is 20
  const min = 1
  const max = 50

  // state for currentPage for pagination
  const [currentPage, setCurrentPage] = useState(1)
  const reviews = props.payload.reviews

  // sort reviews by publication date in descending order
  const sortedReviews = []
    .concat(reviews)
    .sort((a, b) => (a.publication_date < b.publication_date ? 1 : -1))

  // state for data for pagination and table data
  const [data, setData] = useState({
    nodes: [],
  })

  // pagination
  const pagination = usePagination(data, {
    state: {
      page: 0,
      size: value,
    },
  })

  // handle row click for ReviewDetails
  const handleRowClick = (item) => {
    setSelectedReview(item)
  }

  // handle critics page button click
  const handleCriticsPage = () => {
    props.history.push('/critics');
  }

  // filter reviews by search, mpaa filters, startDate, endDate, criticsPick
  const filteredReviews = sortedReviews.filter((item) => {
    const titleMatch = item.display_title
      ?.toLowerCase()
      .includes(search.toLowerCase())
    const noFilters = filters.length === 0
    const ratingMatch =
      (filters.includes('R') && item.mpaa_rating === 'R') ||
      (filters.includes('PG-13') && item.mpaa_rating === 'PG-13') ||
      (filters.includes('PG') && item.mpaa_rating === 'PG') ||
      (filters.includes('G') && item.mpaa_rating === 'G')

    // filter reviews by publication date
    const publicationDateMatch =
      (!startDate || new Date(item.publication_date) >= startDate) &&
      (!endDate || new Date(item.publication_date) <= endDate)

    // filter reviews by critics pick
    const criticsPickMatch = !criticsPick || item.critics_pick

    return (
      titleMatch &&
      publicationDateMatch &&
      criticsPickMatch &&
      (noFilters || ratingMatch)
    )
  })

  // update data for pagination and table data when filters, search, startDate, endDate, criticsPick change
  const updateData = () => {
    const firstPageIndex = (currentPage - 1) * value
    const lastPageIndex = firstPageIndex + value
    const paginatedReviews = filteredReviews.slice(
      firstPageIndex,
      lastPageIndex
    )

    // update data for pagination
    setData({
      nodes: paginatedReviews,
    })
  }
  
  // update data when currentPage, value, filteredReviews change
  useEffect(() => {
    updateData()
  }, [currentPage, value, filteredReviews])

  // update currentPage when pagination changes
  const handleSearch = (event) => {
    setSearch(event.target.value)
  }
  
  // update filters when filter changes
  const handleFilter = (filter) => {
    const isChecked = filters.includes(filter)
    const newFilters = isChecked
      ? filters.filter((value) => value !== filter)
      : filters.concat(filter)
    setFilters(newFilters)

    // update data for pagination
    setTimeout(() => {
      updateData()
    }, 0)
  }
  
  // update value when value changes
  const handleChange = (event) => {
    const newValue = Math.max(min, Math.min(max, Number(event.target.value)))
    setValue(newValue)

    setTimeout(() => {
      updateData()
    }, 0)
  }

  //handle start date change AND end date change AND critics pick change
  const handleStartDateChange = (date) => {
    setStartDate(date)
  }

  const handleEndDateChange = (date) => {
    setEndDate(date)
  }

  const handleCriticsPickChange = (event) => {
    setCriticsPick(event.target.checked)
  }

  // get movie reviews when component mounts
  useEffect(() => {
    props.getMovieReviews()
  }, [])

  return (
    <div>
      <Helmet>
        <meta name="description" content="Home" />
      </Helmet>
      <main>
        <img src={hesImg} />
        <h1>List of the movie reviews</h1>
        <div>
          <label htmlFor="search">
            Search by title:
            <input id="search" type="text" onChange={handleSearch} />
          </label>
          <div>
            <label htmlFor="RateR">
              Rated R:
              <input
                id="RateR"
                type="checkbox"
                checked={filters.includes('R')}
                onChange={() => handleFilter('R')}
              />
            </label>
          </div>
          <div>
            <label htmlFor="RatePG13">
              Rated PG-13:
              <input
                id="RatePG13"
                type="checkbox"
                checked={filters.includes('PG-13')}
                onChange={() => handleFilter('PG-13')}
              />
            </label>
          </div>
          <div>
            <label htmlFor="RatePG">
              Rated PG:
              <input
                id="RatePG"
                type="checkbox"
                checked={filters.includes('PG')}
                onChange={() => handleFilter('PG')}
              />
            </label>
          </div>
          <div>
            <label htmlFor="RateG">
              Rated G:
              <input
                id="RateG"
                type="checkbox"
                checked={filters.includes('G')}
                onChange={() => handleFilter('G')}
              />
            </label>
          </div>
          <div>
            <label htmlFor="startDate">Start Date:</label>
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="yyyy-mm-dd"
            />
          </div>
          <div>
            <label htmlFor="endDate">End Date:</label>
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="yyyy-mm-dd"
            />
          </div>
          <div>
            <label htmlFor="criticsPick">
              Critics Pick:
              <input
                id="criticsPick"
                type="checkbox"
                checked={criticsPick}
                onChange={handleCriticsPickChange}
              />
            </label>
          </div>
          {data.nodes.length > 0 && (
            <Table data={data} pagination={pagination}>
              {(tableList) => (
                <>
                  <Header>
                    <HeaderRow>
                      <HeaderCell>Title</HeaderCell>
                      <HeaderCell>Publication date</HeaderCell>
                      <HeaderCell>MPAA Rating</HeaderCell>
                      <HeaderCell>Critics Pick</HeaderCell>
                    </HeaderRow>
                  </Header>

                  <Body>
                    {tableList
                      .map((item) => (
                        <Row
                          key={item.id}
                          item={item}
                          onClick={() => handleRowClick(item)}
                        >
                          <Cell>{item.display_title}</Cell>
                          <Cell>{item.publication_date}</Cell>
                          <Cell>{item.mpaa_rating}</Cell>
                          <Cell>{item.critics_pick}</Cell>
                        </Row>
                      ))
                      .slice(0, value)}{' '}
                    {/* Display only the first 'value' items */}
                  </Body>
                </>
              )}
            </Table>
          )}
          {selectedReview && (  
            <ReviewDetails
              review={selectedReview}
              onClose={() => setSelectedReview(null)}
            />
          )}
          <div>
            <label htmlFor="resNum">Number of results to display:</label>
            <input
              id="resNum"
              type="number"
              placeholder="20"
              name="resNum"
              min="1"
              max="50"
              value={value}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="page">Page:</label>
            <input
              id="page"
              type="number"
              placeholder="1"
              name="page"
              min="1"
              max={Math.ceil(filteredReviews.length / value)} // 20
              value={currentPage}
              onChange={(event) => {
                const newValue = Math.max(
                  1,
                  Math.min(
                    Math.ceil(filteredReviews.length / value),
                    Number(event.target.value)
                  )
                )
                setCurrentPage(newValue)
              }}
            />

            <button
              type="button"
              onClick={() => {
                setCurrentPage((prev) => Math.max(1, prev - 1))
              }}>
              Previous
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentPage((prev) =>
                  Math.min(Math.ceil(filteredReviews.length / value), prev + 1)
                )
              }}>
              Next
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentPage(1)
              }}>
              First
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentPage(Math.ceil(filteredReviews.length / value))
              }}>
              Last
            </button>
          </div>
        </div>
        <button onClick={handleCriticsPage}>Critics Page</button>
      </main>
    </div>
  )
}

// connect to redux store and get movie reviews
const mapStateToProps = (state, ownProps) => {
  const reviews = state.resources.reviews
  return {
    payload: reviews,
  }
}

// dispatch getMovieReviews action to get movie reviews
const mapDispatchToProps = (dispatch) => ({
  getMovieReviews: () => dispatch(getMovieReviews()),
})

export default compose(connect(mapStateToProps, mapDispatchToProps))(HomePage)
