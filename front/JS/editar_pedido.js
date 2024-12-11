// ./JS/editar_pedido.js

document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'http://localhost:8080'; // Base URL da API
    const form = document.getElementById('editar-pedido-form');
    const clienteSelect = document.getElementById('cliente');
  
    // Função para obter parâmetros da URL
    const getQueryParam = (param) => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    };
  
    const pedidoId = getQueryParam('id');
  
    if (!pedidoId) {
      alert('ID do pedido não fornecido.');
      window.location.href = 'lista_pedido.html';
      return;
    }
  
    // Função para buscar todos os clientes
    const fetchClientes = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/client/listClients`);
        if (!response.ok) {
          throw new Error(`Erro ao buscar clientes: ${response.statusText}`);
        }
        const clientes = await response.json();
        return clientes;
      } catch (error) {
        console.error(error);
        alert('Não foi possível buscar os clientes. Verifique o console para mais detalhes.');
        return [];
      }
    };
  
    // Função para popular o select de clientes
    const populateClienteSelect = (clientes, clienteIdSelecionado) => {
      clientes.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.id; // Usando 'id' conforme padronizado
        option.textContent = cliente.nomeCliente;
        if (cliente.id === clienteIdSelecionado) {
          option.selected = true;
        }
        clienteSelect.appendChild(option);
      });
    };
  
    // Função para buscar dados do pedido
    const fetchPedido = async (id) => {
      try {
        const response = await fetch(`${apiBaseUrl}/order/getOrder/${id}`);
        if (!response.ok) {
          throw new Error(`Erro ao buscar pedido: ${response.statusText}`);
        }
        const pedido = await response.json();
        return pedido;
      } catch (error) {
        console.error(error);
        alert('Não foi possível buscar os dados do pedido. Verifique o console para mais detalhes.');
        return null;
      }
    };
  
    // Função para preencher o formulário com os dados do pedido
    const preencherFormulario = (pedido) => {
      document.getElementById('descricaoPedido').value = pedido.descricaoPedido;
      document.getElementById('valorTotal').value = pedido.valorTotal;
      document.getElementById('status').value = pedido.status;
    };
  
    // Função para atualizar o pedido
    const atualizarPedido = async (pedidoData) => {
      try {
        const response = await fetch(`${apiBaseUrl}/order/updateOrder/${pedidoId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(pedidoData)
        });
  
        if (response.ok) {
          alert('Pedido atualizado com sucesso.');
          window.location.href = 'lista_pedido.html';
        } else {
          const errorText = await response.text();
          throw new Error(`Erro ao atualizar pedido: ${errorText}`);
        }
      } catch (error) {
        console.error(error);
        alert('Não foi possível atualizar o pedido. Verifique o console para mais detalhes.');
      }
    };
  
    // Inicialização: Buscar clientes e dados do pedido
    const init = async () => {
      const [clientes, pedido] = await Promise.all([
        fetchClientes(),
        fetchPedido(pedidoId)
      ]);
  
      if (pedido) {
        preencherFormulario(pedido);
        populateClienteSelect(clientes, pedido.idDoCliente); // Usando 'idDoCliente' conforme retorno do backend
      }
    };
  
    // Evento de submissão do formulário
    form.addEventListener('submit', async (event) => {
      event.preventDefault(); // Impede o reload da página
  
      // Captura os valores dos campos
      const clienteId = clienteSelect.value;
      const descricaoPedido = document.getElementById('descricaoPedido').value.trim();
      const valorTotal = parseFloat(document.getElementById('valorTotal').value);
      const status = document.getElementById('status').value;
  
      // Validação básica
      if (!clienteId) {
        alert('Por favor, selecione um cliente.');
        return;
      }
      if (!descricaoPedido || isNaN(valorTotal) || !status) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
  
      // Monta o objeto do pedido a ser enviado
      const pedidoData = {
        descricaoPedido: descricaoPedido,
        valorTotal: valorTotal,
        status: status,
        cliente: {
          id: clienteId
        }
      };
  
      // Envia a requisição para atualizar o pedido
      await atualizarPedido(pedidoData);
    });
  
    // Chama a função de inicialização
    init();
  });
  