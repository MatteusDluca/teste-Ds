// src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sendConfirmation } from './mailer.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rota para enviar o e-mail de confirmação
app.post('/send-confirm', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'E-mail é obrigatório.' });
  }
  try {
    await sendConfirmation(email);
    res.status(200).json({ message: 'E-mail enviado.' });
  } catch (err) {
    console.error('Erro ao enviar e-mail:', err);
    res.status(500).json({ error: 'Falha interna no servidor.' });
  }
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
