require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Rota principal
app.get('/', (req, res) => {
  res.send('Weather API Wrapper is running');
});

// Rota de clima
app.get('/weather', async (req, res) => {
  const cidade = req.query.cidade;

  if (!cidade) {
    return res.status(400).json({ erro: 'Informe a cidade na query string (ex: ?cidade=Aracaju)'});
  }

  try {
    const apiKey = process.env.API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`;

    const resposta = await axios.get(url);
    const dados = resposta.data;

    res.json({
      cidade: dados.name,
      temperatura: dados.main.temp,
      condicao: dados.weather[0].description
    });

  } catch (erro) {
    console.error('ERRO NA REQUISIÇÃO:', erro.response?.data || erro.message);
    res.status(500).json({ erro: 'Erro ao buscar clima. Verifique o nome da cidade ou a chave da API.' });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
