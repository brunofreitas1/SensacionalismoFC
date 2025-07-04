# ⚽ Sensacionalismo FC

Um site divertido e interativo para fãs de futebol acompanharem notícias polêmicas, engraçadas e sensacionalistas sobre os campeonatos brasileiros. Agora com backend Node.js/TypeScript, autenticação JWT, upload de avatar e filtro de notícias por time!

---

## 📌 Objetivo do Projeto

Aplicar conceitos modernos de desenvolvimento web fullstack (Node.js, TypeScript, MVC, REST API, autenticação JWT, SQLite, Bootstrap, responsividade e acessibilidade) em um projeto realista e divertido.

---

## 🧩 Funcionalidades

- Página inicial responsiva e acessível
- Cadastro e login de usuários (JWT)
- Escolha e exibição do time do coração
- Upload e recorte de foto de perfil (avatar)
- Filtro de notícias por time do usuário
- CRUD de notícias (admin)
- CRUD de times (admin)
- Visualização pública de notícias
- Logout seguro
- Banco SQLite (pronto para RDS/MySQL em produção)

---

## 🧠 Tecnologias Utilizadas

- Node.js + Express
- TypeScript
- SQLite3
- Bootstrap 5
- HTML5, CSS3, JavaScript
- Font Awesome
- Cropper.js (recorte de avatar)
- JWT (autenticação)

---

## 🚀 Como Executar Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/sensacionalismo-fc.git
   cd sensacionalismo-fc
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Compile o TypeScript (se necessário):
   ```bash
   npm run build
   ```
4. Rode o servidor:
   ```bash
   npm start
   # ou npm run dev (para desenvolvimento)
   ```
5. Acesse em [http://localhost:3000](http://localhost:3000)

> Recomenda-se usar RDS/MySQL em produção. O SQLite é apenas para testes locais.

---

## 📂 Estrutura do Projeto (resumida)

- `src/` — código-fonte (controllers, models, routes, views)
- `public/` — arquivos estáticos (css, js, imagens)
- `db.sqlite` — banco de dados local
- `server.ts` — servidor principal

---

## 👨‍💻 Créditos

Desenvolvido por Bruno Freitas Brandão e Gabriel Henrique Vieira Timóteo 🚀

---

> *O futebol é levado a sério... mas só até a próxima piada.*
