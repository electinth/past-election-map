import styled from 'styled-components';

const Article = styled.article`
  z-index: 100;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 5rem;
  height: calc(100vh - 5rem);
  padding: 5rem 2rem 1rem 2rem;
  pointer-events: none;
`;

export default Article;
