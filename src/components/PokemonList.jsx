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
  const DATA_SIZE = 20;

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const decomposeHangul = (str) => {
    return Hangul.disassemble(str).join("");
  };

  const fetchPokemon = async (page) => {
    setLoading(true);
    const newPokemonData = [];
    const startIndex = (page - 1) * DATA_SIZE + 1;
    const endIndex = page * DATA_SIZE;

    for (let i = startIndex; i <= endIndex; i++) {
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${i}`
        );
        const speciesResponse = await axios.get(
          `https://pokeapi.co/api/v2/pokemon-species/${i}`
        );
        const koreanName = speciesResponse.data.names.find(
          (name) => name.language.name === "ko"
        );
        newPokemonData.push({ ...response.data, korean_name: koreanName.name });
      } catch (error) {
        console.error(error);
      }
    }

    setPokemonData((prevData) => [...prevData, ...newPokemonData]);
    setLoading(false);
  };

  useEffect(() => {
    fetchPokemon(page);
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const isBottom = scrollTop + clientHeight >= scrollHeight - 100;
      if (isBottom &&!loading) {
        setPage((prevPage) => prevPage + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const filtering = useCallback(
    debounce(() => {
      const decomposedKeyword = decomposeHangul(keyword);
      const filteredList = pokemonData.filter((pokemon) =>
        decomposeHangul(pokemon.korean_name).includes(decomposedKeyword)
      );
      setFilterPokemon([...filteredList]);
    }, 300),
    [keyword, pokemonData]
  );

  useEffect(() => {
    if (keyword.length === 0) {
      setFilterPokemon([...pokemonData]);
    } else {
      filtering();
    }
  }, [keyword, pokemonData, filtering]);

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
      {loading && <p>Loading...</p>}
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

const LoadMoreButton = styled.button`
  padding: 10px 20px;
  background-color: #0026ff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0018a8;
  }
`;

export default PokemonList;
