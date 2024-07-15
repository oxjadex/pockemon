import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const PokemonList = () => {
  const [pokemonData, setPokemonData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const requests = [];
      for (let i = 1; i <= 30; i++) {
        requests.push(axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`));
        requests.push(
          axios.get(`https://pokeapi.co/api/v2/pokemon-species/${i}`)
        );
      }

      const responses = await Promise.all(requests);
      const allPokemonData = [];

      for (let i = 0; i < responses.length; i += 2) {
        const pokemonResponse = responses[i];
        const speciesResponse = responses[i + 1];
        const koreanName = speciesResponse.data.names.find(
          (name) => name.language.name === "ko"
        );

        allPokemonData.push({
          ...pokemonResponse.data,
          korean_name: koreanName ? koreanName.name : "No name found",
        });
      }
      setPokemonData(allPokemonData);
    };
    fetchData();
  }, []);

  const renderPokemonList = () => {
    return pokemonData.map((pokemon) => (
      <Container>
        <PokemonContainer>
          <div key={pokemon.id}>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            <p>{pokemon.korean_name}</p>
            <p>ID: ({pokemon.id})</p>
          </div>
        </PokemonContainer>
      </Container>
    ));
  };

  return <div>{renderPokemonList()}</div>;
};

export default PokemonList;

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  margin: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
`;

const PokemonContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  margin: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
`;
