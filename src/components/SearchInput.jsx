import React, { useState } from "react";

const SearchInput = ({ renderPokemonList }) => {
  const [filterPokemon, setFilterPokemon] = useState([]);
  const [keyword, setKeyword] = useState("");

  const filtering = () => {
    const filterList = pokemonData.filter((pokemon) =>
      pokemon.korean_name.includes(keyword)
    );
    setFilterPokemon([...filterList]);
  };

  useEffect(() => {
    if (keyword?.length === 0) {
      setFilterPokemon([...pokemonData]);
    } else {
      filtering();
    }
    filtering();
  }, [keyword, pokemonData]);

  return (
    <div>
      <input
        type="text"
        value={keyword}
        className="searchBox"
        placeholder="포켓몬 이름을 입력해주세요"
        onChange={(e) => setKeyword(e.target.value)}
      />
      <div className="container">{renderPokemonList()}</div>
    </div>
  );
};

export default SearchInput;
