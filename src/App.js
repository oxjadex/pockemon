import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PokemonList from "./components/PokemonList";
import PokemonDetail from "./components/PokemonDetail";
import FavoritePokemonList from "./components/FavoritePokemonList";

import "./fonts/fonts.css";
import { RecoilRoot } from "recoil";

const App = () => {
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          <Route path="/" element={<PokemonList />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
          <Route
            path="/favoritePokemonList"
            element={<FavoritePokemonList />}
          />
        </Routes>
      </Router>
    </RecoilRoot>
  );
};

export default App;
