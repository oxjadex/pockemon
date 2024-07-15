import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import background from "../assets/dd.jpeg";

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
      <PokemonContainer key={pokemon.id}>
        <PokemonImg src={pokemon.sprites.front_default} alt={pokemon.name} />
        <p>{pokemon.korean_name}</p>
        <p>ID: ({pokemon.id})</p>
      </PokemonContainer>
    ));
  };

  return <Pokemon>{renderPokemonList()}</Pokemon>;
};

const Pokemon = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  background: url(${background}) center center;
  background-size: cover;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const PokemonContainer = styled.div`
  flex: 0 0 calc(25% - 20px);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
  background: rgba(255, 255, 255, 0.8);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
`;

const PokemonImg = styled.img`
  width: 150px;
`;

export default PokemonList;
