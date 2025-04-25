const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', usuarioController.listarUsuarios);
router.post('/', usuarioController.cadastrarUsuario);
router.put('/:id', usuarioController.atualizarUsuario);
router.delete('/:id', usuarioController.excluirUsuario);

// 🚀 Nova rota de login
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    console.log('📩 Requisição recebida com:', { email, senha });

    try {
        const usuario = await prisma.usuarios.findUnique({
            where: { email },
        });

        console.log('👤 Usuário encontrado:', usuario);

        if (!usuario || usuario.senha !== senha) {
            return res.status(401).json({ message: 'Email ou senha inválidos' });
        }

        res.json({ id: usuario.id, nome: usuario.nome });
    } catch (error) {
        console.error('❌ Erro no login:', error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});


module.exports = router;
