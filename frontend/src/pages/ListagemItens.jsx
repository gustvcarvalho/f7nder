import { useEffect, useState } from 'react';
import axios from 'axios';
import './ListagemItens.css'; 

function ListagemItens() {
  const [itens, setItens] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/itens')
      .then(response => {
        console.log('🧾 Dados recebidos:', response.data);
  
        if (response.data.status === 'sucesso' && Array.isArray(response.data.dados)) {
          setItens(response.data.dados);
        } else {
          setItens([]); 
        }
      })
      .catch(error => {
        console.error('Erro ao buscar itens:', error);
        setItens([]); 
      });
  }, []);
  
  

  return (
    <div className="listagem-container">
      <h2 className="titulo">📦 Itens Perdidos</h2>

      {itens.length === 0 ? (
        <p className="mensagem-vazia">Nenhum item encontrado.</p>
      ) : (
        <div className="cards-container">
          {itens.map((item) => (
            <div className="item-card" key={item.item_ID}>
              <p><strong>Nome:</strong> {item.nome_objeto}</p>
              <p><strong>Local:</strong> {item.localizacao}</p>
              <p><strong>Categoria:</strong> {item.categoria?.nome || 'Desconhecida'}</p>
              <p><strong>Status:</strong> {item.status === 0 ? 'Perdido' : 'Encontrado'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListagemItens;
