import React from "react";
import { useRecoilValue } from "recoil";
import { favoritePokemonState } from "../recoil/atom";
import styled from "styled-components";
import background from "../assets/background.jpeg";

const FavoritePokemonList = () => {
  const favoritePokemon = useRecoilValue(favoritePokemonState);

  return (
    <FavoritePokemonBackground>
      <Title>내가 좋아하는 포켓몬 리스트</Title>
      <PokemonListWrapper>
        {favoritePokemon.length > 0 ? (
          favoritePokemon.map((pokemon) => (
            <PokemonContainer key={pokemon.id}>
              <PokemonImg
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
              />
              <PokemonName>{pokemon.korean_name}</PokemonName>
              <PokemonId>ID: {pokemon.id}</PokemonId>
            </PokemonContainer>
          ))
        ) : (
          <NoFavoritePokemons>즐겨찾기한 포켓몬이 없습니다.</NoFavoritePokemons>
        )}
      </PokemonListWrapper>
    </FavoritePokemonBackground>
  );
};

const FavoritePokemonBackground = styled.div`
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
  font-size: 50px;
  margin-bottom: 30px;
`;

const PokemonListWrapper = styled.div`
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
  color: white;
`;

const NoFavoritePokemons = styled.p`
  font-style: italic;
  color: #999;
`;

export default FavoritePokemonList;
