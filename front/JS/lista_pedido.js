// ./JS/lista_pedido.js

document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'http://localhost:8080'; // Base URL da API
    const tableBody = document.getElementById('pedidos-table-body');
    const searchInput = document.getElementById('search');
  
    // Função para buscar todos os pedidos
    const fetchPedidos = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/order/listOrders`);
        if (!response.ok) {
          throw new Error(`Erro ao buscar pedidos: ${response.statusText}`);
        }
        const pedidos = await response.json();
        return pedidos;
      } catch (error) {
        console.error(error);
        alert('Não foi possível buscar os pedidos. Verifique o console para mais detalhes.');
        return [];
      }
    };
  
    // Função para renderizar a tabela de pedidos
    const renderPedidos = (pedidos) => {
      tableBody.innerHTML = ''; // Limpa a tabela antes de renderar
  
      pedidos.forEach(pedido => {
        const tr = document.createElement('tr');
  
        // Verifica se 'valorPedido' existe e é um número antes de chamar 'toFixed'
        const valorPedido = typeof pedido.valorPedido === 'number' ? pedido.valorPedido.toFixed(2) : 'N/A';
  
        tr.innerHTML = `
          <td>${pedido.descricaoDetalhada}</td>
          <td>R$ ${valorPedido}</td>
          <td>${pedido.statusAtual}</td>
          <td>${pedido.nomeDoCliente}</td>
          <td>
            <a href="editar_pedido.html?id=${pedido.identificador}" class="btn btn-warning btn-sm">Editar</a>
            <button class="btn btn-danger btn-sm" data-id="${pedido.identificador}">Excluir</button>
          </td>
        `;
  
        tableBody.appendChild(tr);
      });
    };
  
    // Função para filtrar pedidos com base na busca
    const filterPedidos = (pedidos, query) => {
      const lowerQuery = query.toLowerCase();
      return pedidos.filter(pedido => 
        pedido.descricaoDetalhada.toLowerCase().includes(lowerQuery) || 
        pedido.statusAtual.toLowerCase().includes(lowerQuery)
      );
    };
  
    // Função para deletar um pedido
    const deletePedido = async (id) => {
      if (!confirm('Tem certeza que deseja excluir este pedido?')) {
        return;
      }
  
      try {
        const response = await fetch(`${apiBaseUrl}/order/deleteOrder/${id}`, {
          method: 'DELETE'
        });
  
        if (response.status === 204) {
          alert('Pedido excluído com sucesso.');
          // Recarrega a lista de pedidos
          const updatedPedidos = await fetchPedidos();
          renderPedidos(updatedPedidos);
        } else if (response.status === 404) {
          alert('Pedido não encontrado.');
        } else {
          const errorText = await response.text();
          throw new Error(`Erro ao excluir pedido: ${errorText}`);
        }
      } catch (error) {
        console.error(error);
        alert('Não foi possível excluir o pedido. Verifique o console para mais detalhes.');
      }
    };
  
    // Inicialização: Buscar e renderizar pedidos
    const init = async () => {
      const pedidos = await fetchPedidos();
      renderPedidos(pedidos);
  
      // Adicionar event listeners para os botões de excluir
      tableBody.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON' && event.target.classList.contains('btn-danger')) {
          const pedidoId = event.target.getAttribute('data-id');
          deletePedido(pedidoId);
        }
      });
    };
  
    // Evento de busca
    searchInput.addEventListener('input', async (event) => {
      const query = event.target.value;
      const allPedidos = await fetchPedidos();
      const filteredPedidos = filterPedidos(allPedidos, query);
      renderPedidos(filteredPedidos);
    });
  
    // Chama a função de inicialização
    init();
  });
  