import "./App.css";
import PokemonList from "./components/PokemonList";
import styled from "styled-components";
import background from "./assets/background.gif";

const App = () => {
  return (
    <Container>
      <PokemonList />
    </Container>
  );
};

const Container = styled.div`
  background: url(${background}) no-repeat center center fixed;
`;

export default App;
