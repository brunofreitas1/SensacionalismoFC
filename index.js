const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const path = require('path');

// Servir arquivos estáticos da pasta "views"
app.use(express.static(path.join(__dirname, 'views')));

// Rota raiz renderizando um HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

// Rota de login renderizando um HTML
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});
