import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField } from '@mui/material';
import axios from 'axios';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const ListaCandidatos = () => {
  const [candidatos, setCandidatos] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchCandidatos = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/candidates/');
        setCandidatos(response.data);
      } catch (error) {
        console.error('Erro ao obter os currículos:', error);
      }
    };

    fetchCandidatos();
  }, []);

  const handleOpenResume = async (resumeFileName) => {
    try {
      // Caminho do storage
      const resumeUrl = `http://127.0.0.1:8000/storage/${resumeFileName}`;

      // Abrindo uma nova aba pro pdf
      window.open(resumeUrl, '_blank');
    } catch (error) {
      console.error('Erro ao abrir o currículo:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const filteredCandidatos = candidatos.filter(candidato => candidato.name.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom align="center">
        Lista de Candidatos
      </Typography>
      <TextField
        label="Buscar por nome"
        value={searchText}
        onChange={handleSearchChange}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <List>
        {filteredCandidatos.map(candidato => (
          <ListItem key={candidato.id}>
            <ListItemText 
              primary={candidato.name} 
              secondary={`${candidato.email} | ${candidato.phone} | ${candidato.education} | ${candidato.desired_position}`} 
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="Ver Currículo" onClick={() => handleOpenResume(candidato.resume_file)}>
                <PictureAsPdfIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default ListaCandidatos;
