// ./JS/cadastro_pedido.js

document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'http://localhost:8080'; // Base URL da API
    const form = document.getElementById('cadastro-pedido-form');
    const clienteSelect = document.getElementById('cliente');
  
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
    const populateClienteSelect = (clientes) => {
      clientes.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.id; // Usando o UUID do cliente
        option.textContent = cliente.nomeCliente;
        clienteSelect.appendChild(option);
      });
    };
  
    // Função para criar um novo pedido
    const criarPedido = async (pedidoData) => {
      try {
        const response = await fetch(`${apiBaseUrl}/order/createOrder`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(pedidoData)
        });
  
        if (response.ok) {
          alert('Pedido criado com sucesso.');
          window.location.href = 'lista_pedido.html';
        } else {
          const errorText = await response.text();
          throw new Error(`Erro ao criar pedido: ${errorText}`);
        }
      } catch (error) {
        console.error(error);
        alert('Não foi possível criar o pedido. Verifique o console para mais detalhes.');
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
  
      // Envia a requisição para criar o pedido
      await criarPedido(pedidoData);
    });
  
    // Inicialização: Buscar e popular clientes
    const init = async () => {
      const clientes = await fetchClientes();
      populateClienteSelect(clientes);
    };
  
    // Chama a função de inicialização
    init();
  });
  