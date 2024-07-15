import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const PokemonDetail = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${id}`
        );
        const speciesResponse = await axios.get(
          `https://pokeapi.co/api/v2/pokemon-species/${id}`
        );
        const koreanName = speciesResponse.data.names.find(
          (name) => name.language.name === "ko"
        );

        const abilities = await Promise.all(
          response.data.abilities.map(async (ability) => {
            const abilityResponse = await axios.get(ability.ability.url);
            const koreanAbilityName = abilityResponse.data.names.find(
              (name) => name.language.name === "ko"
            );
            return koreanAbilityName
              ? koreanAbilityName.name
              : ability.ability.name;
          })
        );

        const moves = await Promise.all(
          response.data.moves.map(async (move) => {
            const moveResponse = await axios.get(move.move.url);
            const koreanMoveName = moveResponse.data.names.find(
              (name) => name.language.name === "ko"
            );
            return koreanMoveName ? koreanMoveName.name : move.move.name;
          })
        );
        const types = await Promise.all(
          response.data.moves.map(async (type) => {
            const typeResponse = await axios.get(type.type.url);
            const koreanMoveName = typeResponse.data.names.find(
              (name) => name.language.name === "ko"
            );
            return koreanMoveName ? koreanMoveName.name : type.type.name;
          })
        );

        setPokemon({
          ...response.data,
          korean_name: koreanName.name,
          korean_ability: koreanName.ability,
          korean_moves: koreanName.moves,
          korean_types: koreanName.types,
        });
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [id]);
  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <h1>
        {pokemon.korean_name} (ID: {pokemon.id})
      </h1>
      <img src={pokemon.sprites.front_default} alt={pokemon.korean_name} />
      <h2>Types</h2>
      <ul>
        {pokemon.types.map((type, index) => (
          <li key={index}>{type}</li>
        ))}
      </ul>
      <h2>Abilities</h2>
      <ul>
        {pokemon.abilities.map((ability, index) => (
          <li key={index}>{ability}</li>
        ))}
      </ul>
      <h2>Moves</h2>
      <ul>
        {pokemon.moves.map((move, index) => (
          <li key={index}>{move}</li>
        ))}
      </ul>
    </div>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default PokemonDetail;
