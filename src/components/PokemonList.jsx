import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRecoilState } from "recoil";
import { favoritePokemonState } from "../recoil/atom";
import axios from "axios";
import styled from "styled-components";
import background from "../assets/background.jpeg";
import Hangul from "hangul-js";
import debounce from "lodash.debounce";
import { useNavigate } from "react-router-dom";

const PokemonList = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [filterPokemon, setFilterPokemon] = useState([]);
  const [keyword, setKeyword] = useState("");
  const DATA_SIZE = 20;

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [favorites, setFavorites] = useRecoilState(favoritePokemonState);

  const navigate = useNavigate();

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
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const isBottom = scrollTop + clientHeight >= scrollHeight - 100;
      if (isBottom && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading]);

  const filtering = useCallback(
    () =>
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
    const handleFavoriteClick = (e, pokemon) => {
      e.stopPropagation();
      setFavorites((prevFavorites) => {
        if (prevFavorites.some((fav) => fav.id === pokemon.id)) {
          return prevFavorites.filter((fav) => fav.id !== pokemon.id);
        } else {
          return [...prevFavorites, pokemon];
        }
      });
    };

    const handlePokemonClick = (id) => {
      navigate(`/pokemon/${id}`);
    };
    return filterPokemon.map((pokemon) => (
      <PokemonContainer
        key={pokemon.id}
        onClick={() => handlePokemonClick(pokemon.id)}
      >
        <PokemonImg src={pokemon.sprites.front_default} alt={pokemon.name} />
        <PokemonName>{pokemon.korean_name}</PokemonName>
        <PokemonId>ID: {pokemon.id}</PokemonId>
        <LikeButton onClick={(e) => handleFavoriteClick(e, pokemon)}>
          {favorites.some((fav) => fav.id === pokemon.id) ? "★" : "☆"}
        </LikeButton>
      </PokemonContainer>
    ));
  }, [filterPokemon, favorites, setFavorites, navigate]);

  return (
    <PokemonBackground>
      <Title>포켓몬 도감!</Title>
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
  padding: 120px 200px;
  font-family: "DOSIyagiBoldface", sans-serif;
`;

const Title = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  font-size: 50px;
  margin-bottom: 30px;
`;
const SearchBox = styled.div`
  margin-bottom: 20px;
  .searchInput {
    padding: 15px 20px;
    font-size: 16px;
    width: 300px;
    border: 1px solid #0026ff;
    border-radius: 6px;
    font-family: "DOSIyagiBoldface", sans-serif;
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
  border-radius: 8px;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.2);
  }
`;
const LikeButton = styled.div`
  cursor: pointer;
`;
const PokemonImg = styled.img`
  width: 150px;
`;

const PokemonName = styled.p`
  font-weight: bold;
  margin: 10px 0;
`;

const PokemonId = styled.p`
  color: white;
`;

export default PokemonList;
