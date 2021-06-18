import styled from 'styled-components'

const Button = styled.button`
  background: ${props => props.primary ? "orange" : "white"};
  color: ${props => props.primary ? "white" : "orange"};

  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid orange;
  border-radius: 3px;
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    background: ${props => props.primary ? "dark-orange" : "orange"};
    color: white;
  }
`;

export default Button;

// render(
//   <div>
//     <Button>Normal</Button>
//     <Button primary>Primary</Button>
//   </div>
// );