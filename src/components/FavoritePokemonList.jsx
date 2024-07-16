// src/components/PokemonDetail.js

import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { favoritePokemonState } from "../recoil/atom";
import styled, { keyframes } from "styled-components";
import background from "../assets/background.jpeg";
import pokemonBall from "../assets/pokemonball.png";
import ChatModal from "./ChatModal";
import FavoritePokemonList from "./FavoritePokemonList";
import "../fonts/fonts.css";

const PokemonDetail = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [showText, setShowText] = useState(false);
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [currentEvolutionIndex, setCurrentEvolutionIndex] = useState(0);
  const [evolving, setEvolving] = useState(false);

  const [favorites, setFavorites] = useRecoilState(favoritePokemonState);
  const navigate = useNavigate();

  const handleImageClick = () => {
    if (showText) {
      if (currentEvolutionIndex < evolutionChain.length - 1) {
        setEvolving(true);
        setTimeout(() => {
          const nextEvolutionId = evolutionChain[currentEvolutionIndex + 1];
          navigate(`/pokemon/${nextEvolutionId}`);
        }, 500); // 0.5초 동안 애니메이션 재생 후 이동
        setCurrentEvolutionIndex(currentEvolutionIndex + 1);
      } else {
        alert("이 포켓몬은 최종 진화 형태입니다!");
        setShowText(false);
      }
    } else {
      setShowText(true);
    }
  };

  const handleFavoriteClick = (pokemon) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.some((fav) => fav.id === pokemon.id)) {
        return prevFavorites.filter((fav) => fav.id !== pokemon.id);
      } else {
        return [...prevFavorites, pokemon];
      }
    });
  };

  const handleGoBackButtonClick = () => {
    navigate(`/`);
  };

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${id}`
        );
        const speciesResponse = await axios.get(
          `https://pokeapi.co/api/v2/pokemon-species/${id}`
        );
        const evolutionChainResponse = await axios.get(
          speciesResponse.data.evolution_chain.url
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
          response.data.types.map(async (type) => {
            const typeResponse = await axios.get(type.type.url);
            const koreanTypeName = typeResponse.data.names.find(
              (name) => name.language.name === "ko"
            );
            return koreanTypeName ? koreanTypeName.name : type.type.name;
          })
        );

        const parsedEvolutionChain = parseEvolutionChain(
          evolutionChainResponse.data.chain
        );

        setPokemon({
          ...response.data,
          korean_name: koreanName ? koreanName.name : response.data.name,
          korean_abilities: abilities,
          korean_moves: moves,
          korean_types: types,
          evolution_chain: parsedEvolutionChain,
        });

        setEvolutionChain(parsedEvolutionChain);
        setCurrentEvolutionIndex(parsedEvolutionChain.indexOf(id));
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [id]);

  const showChatModal = () => {
    setVisible(true);
  };

  const closeChatModal = () => {
    setVisible(false);
  };

  const parseEvolutionChain = (chain) => {
    const evolutionChain = [];
    let currentChain = chain;

    while (currentChain) {
      const pokemonId = currentChain.species.url.split("/").slice(-2, -1)[0];
      evolutionChain.push(pokemonId);
      currentChain = currentChain.evolves_to[0];
    }

    return evolutionChain;
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!pokemon) {
    return <p>Pokemon not found</p>;
  }

  return (
    <Container>
      <SystemContainer>
        <GoBackButton onClick={handleGoBackButtonClick}>뒤로가기</GoBackButton>
        <Link to="/favorites">내가 찜한 포켓몬</Link>
      </SystemContainer>
      <PokemonContent>
        <LikeButton onClick={() => handleFavoriteClick(pokemon)}>
          {favorites.some((fav) => fav.id === pokemon.id) ? "★" : "☆"}
        </LikeButton>
        {visible && (
          <ChatModal
            pokemonName={pokemon.korean_name}
            handleClose={closeChatModal}
          />
        )}
        <PokemonName>
          No.{pokemon.id} {pokemon.korean_name}
        </PokemonName>
        <PokemonImg
          src={pokemon.sprites.front_default}
          alt={pokemon.korean_name}
          onClick={handleImageClick}
          className={evolving ? "evolution-effect" : ""}
        />
        {showText && (
          <HiddenText>
            <span>......오잉!?</span>
            <br />
            <span>{pokemon.korean_name}의 상태가......?</span>
            <br />
          </HiddenText>
        )}
        <TextContainer className={evolving ? "fade-in" : ""}>
          <span>키: {pokemon.height}</span>
          <span>몸무게: {pokemon.weight}</span>
          <PokemonListTitle>Types: </PokemonListTitle>
          <PokemonListValue>
            {pokemon.korean_types.map((type, index) => (
              <span key={index}>{type} </span>
            ))}
          </PokemonListValue>
          <PokemonListTitle>Abilities</PokemonListTitle>
          <PokemonListValue>
            {pokemon.korean_abilities.map((ability, index) => (
              <span key={index}>{ability} </span>
            ))}
          </PokemonListValue>
          <PokemonListTitle>Moves</PokemonListTitle>
          <PokemonListValue>
            {pokemon.korean_moves.map((move, index) => (
              <span key={index}>{move} </span>
            ))}
          </PokemonListValue>
        </TextContainer>
        <PokemonBall onClick={showChatModal} src={pokemonBall} />
      </PokemonContent>
    </Container>
  );
};

const Container = styled.div`
  background: url(${background}) center center fixed;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  font-family: "DOSIyagiBoldface", sans-serif;
`;

const SystemContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const PokemonContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  background: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const GoBackButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: "DOSIyagiBoldface", sans-serif;
  color: white;
`;

const LikeButton = styled.div`
  cursor: pointer;
  margin-bottom: 20px;
`;

const PokemonName = styled.div`
  font-size: 30px;
  margin-bottom: 10px;
`;

const PokemonImg = styled.img`
  width: 300px;
  cursor: pointer;
`;

const HiddenText = styled.div`
  margin-bottom: 20px;
`;

const TextContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PokemonListTitle = styled.span`
  font-weight: bold;
`;

const PokemonListValue = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const PokemonBall = styled.img`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 100px;
  cursor: pointer;
`;

export default PokemonDetail;
