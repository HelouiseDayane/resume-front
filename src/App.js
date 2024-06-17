import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FormularioEnvio from './components/FormularioEnvio'; 
import ListaCurriculos from './components/ListaCandidatos'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormularioEnvio />} />
        <Route path="/lista-candidatos" element={<ListaCurriculos />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
