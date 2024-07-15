import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import styled from "styled-components";
import background from "../assets/dld.jpeg";
import Hangul from "hangul-js";
import debounce from "lodash.debounce";

const PokemonList = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [filterPokemon, setFilterPokemon] = useState([]);
  const [keyword, setKeyword] = useState("");

  const decomposeHangul = (str) => {
    return Hangul.disassemble(str).join("");
  };

  useEffect(() => {
    const fetchData = async () => {
      const requests = [];
      for (let i = 200; i <= 300; i++) {
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
      setFilterPokemon(allPokemonData);
    };

    fetchData();
  }, []);

  const filtering = useCallback(
    debounce(() => {
      const docomposekeyword = decomposeHangul(keyword);
      const filterList = pokemonData.filter(
        (pokemon) =>
          decomposeHangul(pokemon.korean_name).includes(docomposekeyword)
        // const filterList = pokemonData.filter((pokemon) =>
        //   decomposeHangul(pokemon.korean_name).includes(decomposeHangul(keyword))
        // keyword를 한 번만 호출하니 선언해주는 게 더 좋은 코드
      );
      setFilterPokemon([...filterList]);
    }, 300)[(pokemonData, keyword)]
  );
  
  useEffect(() => {
    if (keyword.length === 0) {
      setFilterPokemon([...pokemonData]);
    } else {
      filtering();
    }
  }, [keyword, pokemonData, filtering]);

  // useMemo를 써서 성능 계산
  const renderPokemonList = useMemo(() => {
    return filterPokemon.map((pokemon) => (
      <PokemonContainer key={pokemon.id}>
        <PokemonImg src={pokemon.sprites.front_default} alt={pokemon.name} />
        <PokemonName>{pokemon.korean_name}</PokemonName>
        <PokemonId>ID: {pokemon.id}</PokemonId>
      </PokemonContainer>
    ));
  }, [filterPokemon]);

  return (
    <PokemonBackground>
      <SearchBox>
        <input
          type="text"
          value={keyword}
          className="searchInput"
          placeholder="포켓몬 이름을 입력해주세요"
          onChange={(e) => setKeyword(e.target.value)}
        />
      </SearchBox>
      <PokemonContainerWrapper>{renderPokemonList}</PokemonContainerWrapper>
      {/* useMemo는 useEffect 처럼 홤수자체가 아니라 계산된 값을 넘겨줌 */}
    </PokemonBackground>
  );
};

const PokemonBackground = styled.div`
  background: url(${background}) center center fixed;
  background-size: cover;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 200px;
`;

const SearchBox = styled.div`
  margin-bottom: 20px;
  .searchInput {
    padding: 15px 10px;
    font-size: 16px;
    width: 300px;
    border: 1px solid #0026ff;
    border-radius: 6px;
  }
`;

const PokemonContainerWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 20px;
`;

const PokemonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

const PokemonImg = styled.img`
  width: 150px;
`;

const PokemonName = styled.p`
  font-weight: bold;
  margin: 10px 0;
`;

const PokemonId = styled.p`
  color: #666;
`;

export default PokemonList;
