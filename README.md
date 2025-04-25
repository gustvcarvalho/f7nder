# 📦 F7nder - Achados e Perdidos | Avanti Bootcamp 

Este projeto é um sistema completo de Achados e Perdidos desenvolvido como parte do Avanti Bootcamp. O sistema é composto por:

- Uma **API RESTful** (backend) com Node.js, Express e PostgreSQL
- Uma **interface web** (frontend) com React, Vite e TailwindCSS

O objetivo do sistema é gerenciar objetos perdidos e encontrados em ambientes como escolas, empresas ou eventos.

---

## 🧠 Funcionalidades principais

- Cadastro e gerenciamento de usuários
- Registro de itens perdidos ou encontrados
- Consulta e busca de itens por status, categoria ou código de acesso
- Atualização e exclusão de dados
- Interface web intuitiva para facilitar o uso

---

## 🖥️ Tecnologias Utilizadas

### Backend

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- Nodemon (modo dev)
- DBeaver (cliente de banco de dados)

### Frontend

- React
- Vite
- TailwindCSS
- JavaScript (ES6+)
- VS Code

---

## 📁 Clonando o projeto

```bash
git clone https://github.com/davidbrennerm/avanti-bootcamp-dfs.git
cd avanti-bootcamp-dfs
```

---

## 🔧 Backend

### 📦 Instalando as dependências

```bash
npm install
```

### 🔐 Configuração do `.env`

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```
DATABASE_URL="postgresql://<usuario>:<senha>@localhost:5432/perdidos_encontrados_db"
```

Substitua `<usuario>` e `<senha>` pelas suas credenciais do PostgreSQL.

Exemplo:

```
DATABASE_URL="postgresql://postgres:root@localhost:5432/perdidos_encontrados_db"
```

### 🧱 Criando o banco de dados

Certifique-se de que o PostgreSQL está rodando e crie o banco:

```sql
CREATE DATABASE perdidos_encontrados_db;
```

### ⚙️ Rodando as migrações

```bash
npx prisma migrate dev
npx prisma generate
```

### ▶️ Rodando o servidor

```bash
npm run seed
npm run dev
```

Servidor iniciado em: `http://localhost:3000`

---

## 🧪 Exemplos de JSON

### 👤 Usuário

```json
{
  "nome": "Thiago Oliveira",
  "email": "thiago@teste.com.br",
  "telefone": "33991122334",
  "senha": "thiagopass"
}
```

### 📦 Item

```json
{
  "nome_objeto": "Celular Motorola",
  "dataevento": "2025-04-06T15:30:00Z",
  "localizacao": "Bloco A - Corredor 2",
  "status": "perdido",
  "categoria_id": 2,
  "usuario_id": 1
}
```

---

## 🛠 Endpoints principais

### Usuário

- `GET /usuarios` – Lista todos os usuários
- `POST /usuarios` – Cria um novo usuário
- `PUT /usuarios/:id` – Atualiza as informações de um usuário
- `DELETE /usuarios/:id` – Deleta um usuário (e seus itens)

### Item

- `GET /itens` – Lista todos os itens
- `GET /itens/perdidos` – Lista apenas itens com status `0`
- `GET /itens/achados` – Lista apenas itens com status `1`
- `GET /itens/codigo/:codigoacesso` – Busca item por código
- `POST /itens` – Cadastra item (gera código de acesso automaticamente)
- `PUT /itens/:id` – Atualiza item pelo ID
- `PUT /itens/codigo/:codigoacesso` – Atualiza item via código
- `DELETE /itens/:id` – Deleta item pelo ID
- `DELETE /itens/codigo/:codigoacesso` – Deleta item via código

---

## 🎨 Frontend React (Vite + Tailwind)

A aplicação conta também com uma interface web para facilitar o uso do sistema.

### 📁 Estrutura do frontend

O frontend está localizado na pasta `frontend/`.

```
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
├── tailwind.config.js
├── vite.config.js
```

### 📦 Instalando as dependências do frontend

```bash
cd frontend
npm install
```

### ▶️ Rodando o frontend

```bash
npm run dev
```

A aplicação estará disponível em:

```
http://localhost:5173
```

---

## 🌐 Integração com backend

- O backend está configurado para rodar em `http://localhost:3000`
- As requisições da interface consomem os endpoints da API diretamente
- Caso precise configurar CORS ou usar um **proxy** com Vite, edite o arquivo `vite.config.js`

---

## 👤 Desenvolvedores

- David Martins  
- Eduarda Burity Gonçalves  
- Gustavo Ferraz Carvalho  
- Guilherme de Souza França

---

> Este projeto está em constante evolução. Contribuições e sugestões são bem-vindas!
