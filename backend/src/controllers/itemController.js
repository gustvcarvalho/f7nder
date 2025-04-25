const { prisma } = require('../database/prismaClient');
const { v4: uuidv4 } = require('uuid');
const { nanoid } = require('nanoid');

const statusMap = {
    perdido: 0,
    encontrado: 1
};

function formatarStatus(valor) {
    return statusMap[String(valor)?.toLowerCase()];
}

module.exports = {
    async listarItens(req, res) {
        const { status, categoria_id, localizacao } = req.query;

        try {
            const filtros = {};

            if (status !== undefined) {
                const statusFormatado = formatarStatus(status) ?? Number(status);
                if (!isNaN(statusFormatado)) filtros.status = statusFormatado;
            }

            if (categoria_id !== undefined) {
                filtros.categoria_id = Number(categoria_id);
            }

            if (localizacao !== undefined) {
                filtros.localizacao = {
                    contains: localizacao,
                    mode: 'insensitive'
                };
            }

            const listaDeItens = await prisma.item.findMany({
                where: filtros,
                include: {
                    usuarios: { select: { nome: true, email: true } },
                    categoria: { select: { nome_categoria: true } }
                },
                orderBy: { dataevento: 'desc' }
            });

            if (listaDeItens.length === 0) {
                return res.status(200).json({
                    status: 'erro',
                    mensagem: 'Nenhum item encontrado',
                    dados: []
                });
            }

            res.status(200).json({
                status: 'sucesso',
                mensagem: 'Itens encontrados com sucesso!',
                dados: listaDeItens
            });

        } catch (error) {
            console.error('Erro ao buscar itens com filtros:', error);
            res.status(500).json({
                status: 'erro',
                mensagem: 'Erro ao buscar itens',
                detalhes: error.message
            });
        }
    },

    async listarItensPerdidos(req, res) {
        try {
            const itensPerdidos = await prisma.item.findMany({
                where: { status: 0 },
                include: {
                    usuarios: { select: { nome: true, email: true } },
                    categoria: { select: { nome_categoria: true } }
                },
                orderBy: { dataevento: 'desc' }
            });

            if (itensPerdidos.length === 0) {
                return res.status(200).json({
                    status: 'erro',
                    mensagem: 'Nenhum item encontrado',
                    dados: []
                });
            }

            res.json({
                status: 'sucesso',
                mensagem: 'Lista de Itens Perdidos',
                dados: itensPerdidos
            });

        } catch (error) {
            console.error('Erro ao buscar itens perdidos:', error);
            res.status(500).json({
                status: 'erro',
                mensagem: 'Erro interno do servidor',
                detalhes: error.message
            });
        }
    },

    async listarItensAchados(req, res) {
        try {
            const itensAchados = await prisma.item.findMany({
                where: { status: 1 },
                include: {
                    usuarios: { select: { nome: true, email: true } },
                    categoria: { select: { nome_categoria: true } }
                },
                orderBy: { dataevento: 'desc' }
            });

            if (itensAchados.length === 0) {
                return res.status(200).json({
                    status: 'erro',
                    mensagem: 'Nenhum item encontrado',
                    dados: []
                });
            }

            res.json({
                status: 'sucesso',
                mensagem: 'Lista de Itens Achados',
                dados: itensAchados
            });

        } catch (error) {
            console.error('Erro ao buscar itens achados:', error);
            res.status(500).json({
                status: 'erro',
                mensagem: 'Erro interno do servidor',
                detalhes: error.message
            });
        }
    },

    async listarItemPorCodigo(req, res) {
        const { codigoacesso } = req.params;

        try {
            const itemCodigo = await prisma.item.findUnique({
                where: { codigoacesso },
                include: {
                    usuarios: { select: { nome: true, email: true } },
                    categoria: { select: { nome_categoria: true } }
                }
            });

            if (!itemCodigo) {
                return res.status(404).json({
                    status: 'erro',
                    mensagem: 'Item não encontrado com esse código de acesso'
                });
            }

            res.status(200).json({
                status: 'sucesso',
                mensagem: 'Item encontrado!',
                dados: itemCodigo
            });

        } catch (error) {
            console.error('Erro ao buscar item por código de acesso:', error);
            res.status(500).json({
                status: 'erro',
                mensagem: 'Erro interno ao buscar item pelo código de acesso',
                detalhes: error.message
            });
        }
    },

    async cadastrarItem(req, res) {
        const { nome_objeto, dataevento, localizacao, status=1, categoria_id, usuario_id } = req.body;
        console.log('Dados recebidos para cadastro:', req.body);


        if (nome_objeto.length < 3 || localizacao.length < 3) {
            return res.status(400).json({
                status: 'erro',
                mensagem: 'Nome e localização devem ter pelo menos 3 caracteres'
            });
        }

        if (isNaN(Date.parse(dataevento))) {
            return res.status(400).json({
                status: 'erro',
                mensagem: 'Data inválida'
            });
        }

        const statusFormatado = formatarStatus(status);
        if (statusFormatado === null) {
            return res.status(400).json({
                status: 'erro',
                mensagem: 'Status inválido. Use "perdido" ou "encontrado"'
            });
        }

        try {
            const codigo = nanoid(8);
            const novoItem = await prisma.item.create({
                data: {
                    nome_objeto,
                    dataevento: new Date(dataevento),
                    localizacao,
                    status,
                    codigoacesso: codigo,
                    categoria_id: Number(categoria_id),
                    usuario_id: Number(usuario_id)
                }
            });

            res.status(201).json({
                status: 'sucesso',
                mensagem: 'Item cadastrado com sucesso!',
                codigoacesso: codigo,
                dados: novoItem
            });

        } catch (error) {
            console.error('Erro ao cadastrar item:', error);
            res.status(500).json({
                status: 'erro',
                mensagem: 'Erro ao cadastrar item',
                detalhes: error.message
            });
        }
    },

    async atualizarItem(req, res) {
        const { id } = req.params;
        const { nome_objeto, dataevento, localizacao, status } = req.body;

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({
                status: 'erro',
                mensagem: 'ID inválido para atualização'
            });
        }

        const dataAtualizacao = {};

        if (nome_objeto) dataAtualizacao.nome_objeto = nome_objeto;
        if (dataevento && !isNaN(Date.parse(dataevento))) {
            dataAtualizacao.dataevento = new Date(dataevento);
        }
        if (localizacao) dataAtualizacao.localizacao = localizacao;

        if (status !== undefined) {
            const statusFormatado = formatarStatus(status);
            if (statusFormatado === undefined) {
                return res.status(400).json({
                    status: 'erro',
                    mensagem: 'Status inválido. Use "perdido" ou "encontrado"'
                });
            }
            dataAtualizacao.status = statusFormatado;
        }

        if (Object.keys(dataAtualizacao).length === 0) {
            return res.status(400).json({
                status: 'erro',
                mensagem: 'Nenhum campo válido enviado para atualização'
            });
        }

        try {
            const itemAtualizado = await prisma.item.update({
                where: { id: Number(id) },
                data: dataAtualizacao
            });

            res.status(200).json({
                status: 'sucesso',
                mensagem: 'Item atualizado com sucesso',
                dados: itemAtualizado
            });

        } catch (error) {
            console.error('Erro ao atualizar item', error);
            res.status(404).json({
                status: 'erro',
                mensagem: 'Erro ao atualizar item',
                detalhes: error.message
            });
        }
    },

    async atualizarItemPorCodigo(req, res) {
        const { codigoacesso } = req.params;
        const { nome_objeto, dataevento, localizacao, status } = req.body;

        const dataAtualizacao = {};

        if (nome_objeto) dataAtualizacao.nome_objeto = nome_objeto;
        if (dataevento && !isNaN(Date.parse(dataevento))) {
            dataAtualizacao.dataevento = new Date(dataevento);
        }
        if (localizacao) dataAtualizacao.localizacao = localizacao;

        if (status !== undefined) {
            const statusFormatado = formatarStatus(status);
            if (statusFormatado === undefined) {
                return res.status(400).json({
                    status: 'erro',
                    mensagem: 'Status inválido. Use "perdido" ou "encontrado"'
                });
            }
            dataAtualizacao.status = statusFormatado;
        }

        if (Object.keys(dataAtualizacao).length === 0) {
            return res.status(400).json({
                status: 'erro',
                mensagem: 'Nenhum campo válido enviado para atualização'
            });
        }

        try {
            const itemAtualizado = await prisma.item.update({
                where: { codigoacesso },
                data: dataAtualizacao
            });

            res.status(200).json({
                status: 'sucesso',
                mensagem: 'Item atualizado com sucesso!',
                dados: itemAtualizado
            });

        } catch (error) {
            console.error('Erro ao atualizar item via código de acesso', error);
            res.status(404).json({
                status: 'erro',
                mensagem: 'Item não encontrado ou erro ao atualizar',
                detalhes: error.message
            });
        }
    },

    async excluirItem(req, res) {
        const { id } = req.params;

        try {
            const itemExcluido = await prisma.item.delete({
                where: { id: Number(id) }
            });

            return res.status(200).json({
                status: 'sucesso',
                mensagem: 'Item excluído com sucesso!',
                dados: itemExcluido
            });

        } catch (error) {
            console.error('Erro ao excluir item', error);
            return res.status(404).json({
                status: 'erro',
                mensagem: 'Erro ao excluir item',
                detalhes: error.message
            });
        }
    },

    async excluirItemPorCodigo(req, res) {
        const { codigoacesso } = req.params;

        try {
            const item = await prisma.item.findUnique({
                where: { codigoacesso }
            });

            if (!item) {
                return res.status(404).json({
                    status: 'erro',
                    mensagem: 'Item não encontrado com este código de acesso'
                });
            }

            const itemExcluidoCodigo = await prisma.item.delete({
                where: { codigoacesso }
            });

            return res.status(200).json({
                status: 'sucesso',
                mensagem: 'Item excluído via código de acesso',
                dados: itemExcluidoCodigo
            });

        } catch (error) {
            console.error('Erro ao excluir item por código de acesso:', error);
            return res.status(500).json({
                status: 'erro',
                mensagem: 'Erro ao excluir item por código de acesso',
                detalhes: error.message
            });
        }
    }
};