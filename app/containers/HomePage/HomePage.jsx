import React, { useState, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet' // Header Generator
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Switch, Route, useHistory } from 'react-router-dom'
import {
  Table,
  Header,
  HeaderRow,
  HeaderCell,
  Body,
  Row,
  Cell,
} from '@table-library/react-table-library/table';


import hesImg from 'images/hes.png'
import { getMovieReviews } from 'resources/reviews/reviews.actions'

export function HomePage(props) {
  const history = useHistory()

  const [search, setSearch] = React.useState('');
  const [filters, setFilters] = React.useState(['SETUP', 'LEARN']);

  const [value, setValue] = useState(1);
  const [checked, setChecked] = React.useState(true);
  
  let [PageSize, setPageSize] = useState(20);
  const min = 20;
  const max = 50;

  const [currentPage, setCurrentPage] = useState(1);
  const reviews = props.payload.reviews
  // Sort Array
  const sortedReviews = [].concat(reviews)
  .sort((a, b) => a.publication_date < b.publication_date ? 1 : -1)

  // Build table logic
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return sortedReviews.slice(firstPageIndex, lastPageIndex);
  }, [currentPage]);

  const data = {
    nodes: sortedReviews.filter((item) => 
        item.display_title.toLowerCase().includes(search.toLowerCase())
    ),
    nodes: sortedReviews.filter((item) => 
        (filters.includes('R') && item.mpaa_rating === 'R') ||
        (filters.includes('PG-13') && item.mpaa_rating === 'PG-13') ||
        (filters.includes('PG') && item.mpaa_rating === 'PG') ||
        (filters.includes('G') && item.mpaa_rating === 'G')
    ),
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    console.log(event.target.value);
  };

  const handleFilter = (filter) => {
    filters.includes(filter)
      ? setFilters(filters.filter((value) => value !== filter))
      : setFilters(filters.concat(filter));
  };
  
  const handleChange = event => {
    const value = Math.max(min, Math.min(max, Number(event.target.value)));
    setValue(value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    console.log("value given: ", event.target.resNum.value);
    let value = event.target.resNum.value;
    
    setPageSize(value);
    currentTableData
    
    // Clear all input values in the form
    event.target.reset();
  };

 const createCurrentTableData = () => currentTableData.map(reviews => {
    return (
      <tr>
        <td>{reviews.display_title}</td>
        <td>{reviews.publication_date}</td>
        <td>{reviews.mpaa_rating}</td>
        <td>{reviews.critics_pick}</td>
      </tr>
    );
  })

  useEffect(() => {
    props.getMovieReviews()
    handleSubmit
    createCurrentTableData()
    setPageSize
    setSearch
  },[])

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
            defaultChecked={checked}
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
            id="RateR"
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
            id="RateR"
            type="checkbox"
            checked={filters.includes('G')}
            onChange={() => handleFilter('G')}
          />
        </label>
      </div>
        <Table data={data}>
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
            {tableList.map((item) => (
              <Row key={item.id} item={item}>
                <Cell>{item.display_title}</Cell>
                <Cell>{item.publication_date}</Cell>
                <Cell>{item.mpaa_rating}</Cell>
                <Cell>{item.critics_pick}</Cell>
              </Row>
            ))}
          </Body>
        </>
      )}
    </Table>
      <form onSubmit={handleSubmit}>
      <label>Number of results to display: 
      <input
        type="number"
        placeholder="20"
        name="resNum"
        value={value}
        onChange={handleChange}
      />
      </label>
      <input type="submit" value="Submit" />
      </form>
        </div>
      </main>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  const reviews = state.resources.reviews
  return {
    payload: reviews
  }
}

const mapDispatchToProps = dispatch => ({
  getMovieReviews: () => dispatch(getMovieReviews()),
})

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(HomePage)
