/**
 * A link to a certain page, an anchor tag
 */

import styled from 'styled-components';

const A = styled.a`
  color: inherit;
  text-decoration: none;
  font-size: var(--font-size-small);

  &:hover {
    color: inherit;
    text-decoration: inherit;
  }
`;

export default A;
