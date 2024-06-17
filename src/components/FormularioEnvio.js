import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import InputMask from 'react-input-mask';

const FormularioEnvio = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    desired_position: '',
    education: '',
    observations: '',
    resume_file: null,
    ip: '', 
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [resumeRequiredError, setResumeRequiredError] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        setFormData(prevState => ({
          ...prevState,
          ip: data.ip
        }));
      })
      .catch(error => {
        console.error('Erro ao obter o endereço IP:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resume_file') {
      const file = files[0];
      setFormData(prevState => ({
        ...prevState,
        resume_file: file
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.resume_file) {
      setResumeRequiredError(true);
      return;
    }
    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('desired_position', formData.desired_position);
      formDataToSend.append('education', formData.education);
      formDataToSend.append('observations', formData.observations);
      formDataToSend.append('ip', formData.ip);
      formDataToSend.append('resume_file', formData.resume_file);
  
      const response = await axios.post('http://127.0.0.1:8000/api/resumes/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (response.status === 200) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            phone: '',
            desired_position: '',
            education: '',
            observations: '',
            resume_file: null,
            ip: '',
            resume_preview: null
          });
          setSubmitting(false);
          setSubmitSuccess(false);
        }, 3000);
      } else if (response.status === 422) { // Assuming 409 is the status for conflict (data already exists)
        setSubmitError(true);
        setSubmitting(false);
      } else {
        setSubmitError(true);
        setSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      setSubmitError(true);
      setSubmitSuccess(false);
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom align="center">
        Formulário de Envio
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nome (Obrigatório, máximo 255 caracteres)"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={formData.name === ''}
          helperText={formData.name === '' ? 'Campo obrigatório' : ''}
        />
        <TextField
          label="E-mail (Obrigatório, formato válido)"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={formData.email === '' || !/\S+@\S+\.\S+/.test(formData.email)}
          helperText={
            formData.email === ''
              ? 'Campo obrigatório'
              : !/\S+@\S+\.\S+/.test(formData.email)
              ? 'E-mail inválido'
              : ''
          }
        />
        <InputMask
          mask="(99) 9999-9999"
          placeholder="Telefone (Obrigatório)"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        >
          {(inputProps) => (
            <TextField
              {...inputProps}
              fullWidth
              margin="normal"
              required
              error={formData.phone === ''}
              helperText={formData.phone === '' ? 'Campo obrigatório' : ''}
            />
          )}
        </InputMask>
        <TextField
          label="Cargo Desejado (Obrigatório, máximo 255 caracteres)"
          name="desired_position"
          value={formData.desired_position}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={formData.desired_position === ''}
          helperText={formData.desired_position === '' ? 'Campo obrigatório' : ''}
        />
        <Select
          label="Escolaridade (Obrigatório)"
          name="education"
          value={formData.education}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={formData.education === ''}
          displayEmpty
        >
          <MenuItem value="">Selecione...</MenuItem>
          <MenuItem value="Fundamental - Incompleto">Fundamental - Incompleto</MenuItem>
          <MenuItem value="Fundamental - Completo">Fundamental - Completo</MenuItem>
          <MenuItem value="Médio - Incompleto">Médio - Incompleto</MenuItem>
          <MenuItem value="Médio - Completo">Médio - Completo</MenuItem>
          <MenuItem value="Superior - Incompleto">Superior - Incompleto</MenuItem>
          <MenuItem value="Superior - Completo">Superior - Completo</MenuItem>
          <MenuItem value="Pós-graduação (Lato senso) - Incompleto">Pós-graduação (Lato senso) - Incompleto</MenuItem>
          <MenuItem value="Pós-graduação (Lato senso) - Completo">Pós-graduação (Lato senso) - Completo</MenuItem>
          <MenuItem value="Pós-graduação (Stricto sensu, nível mestrado) - Incompleto">Pós-graduação (Stricto sensu, nível mestrado) - Incompleto</MenuItem>
          <MenuItem value="Pós-graduação (Stricto sensu, nível mestrado) - Completo">Pós-graduação (Stricto sensu, nível mestrado) - Completo</MenuItem>
          <MenuItem value="Pós-graduação (Stricto sensu, nível doutor) - Incompleto">Pós-graduação (Stricto sensu, nível doutor) - Incompleto</MenuItem>
          <MenuItem value="Pós-graduação (Stricto sensu, nível doutor) - Completo">Pós-graduação (Stricto sensu, nível doutor) - Completo</MenuItem>
        </Select>
        <TextField
          label="Observações (Opcional)"
          name="observations"
          value={formData.observations}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <input
          accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          id="resume_file"
          name="resume_file"
          type="file"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        <div style={{ marginBottom: '10px' }}>
          <input
            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            id="resume_file"
            name="resume_file"
            type="file"
            onChange={handleChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="resume_file">
            <Button variant="contained" color="primary" component="span">
              Selecionar Currículo
            </Button>
          </label>
        </div>

        {submitError && (
          <Typography variant="body1" style={{ textAlign: 'center', marginTop: '10px', color: 'Green' }}>
            Já existe um currículo deste usuário inserido nos últimos 6 meses. Não se preocupe seu curriculo está sendo avaliado pelo RH e olhamos contantemente nosso banco de talentos.
          </Typography>
        )}
        
        {submitting && (
          <Typography variant="body1" style={{ textAlign: 'center', marginTop: '20px' }}>
            Enviando...
          </Typography>
        )}
        {submitSuccess && (
          <Typography variant="body1" style={{ textAlign: 'center', marginTop: '20px', color: 'green' }}>
            Enviado com sucesso!
          </Typography>
        )}
        {resumeRequiredError && (
          <Typography variant="body1" style={{ textAlign: 'center', marginTop: '10px', color: 'red' }}>
            Por favor, anexe um currículo.
          </Typography>
        )}
       
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Enviar
        </Button>
      </form>
    </Container>
  );
};

export default FormularioEnvio;
