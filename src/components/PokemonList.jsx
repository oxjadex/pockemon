import React, { useState, useEffect } from "react";
import axios from "axios";

const PokemonList = () => {
  const [pokemonData, setPokemonData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const allPokemonData = []
            for (let i = 1; i <= 0; i++) {
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`)
                const speciesResult = await axios.get(`https://pokeapi.co/api/v2/species/${i}`)
                const koreanName = speciesResult.data.name.find(
                    (name) => name.language.name === "ko"
                )
                allPokemonData.push({ ...response.data, koreanName: koreanName.name })
            }
            fetchData()
        }, [])
    return ();
      
};

export default PokemonList;
