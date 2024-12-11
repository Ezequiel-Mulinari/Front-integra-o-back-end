// ./JS/editar_cliente.js

document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'http://localhost:8080/client'; // Base URL da API
    const form = document.getElementById('editar-cliente-form');
  
    // Função para obter parâmetros da URL
    const getQueryParam = (param) => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    };
  
    const clienteId = getQueryParam('id');
  
    if (!clienteId) {
      alert('ID do cliente não fornecido.');
      window.location.href = 'lista_cliente.html';
      return;
    }
  
    // Função para buscar dados do cliente
    const fetchCliente = async (id) => {
      try {
        const response = await fetch(`${apiBaseUrl}/client/${id}`);
        if (!response.ok) {
          throw new Error(`Erro ao buscar cliente: ${response.statusText}`);
        }
        const cliente = await response.json();
        return cliente;
      } catch (error) {
        console.error(error);
        alert('Não foi possível buscar os dados do cliente. Verifique o console para mais detalhes.');
        return null;
      }
    };
  
    // Função para preencher o formulário com os dados do cliente
    const preencherFormulario = (cliente) => {
      document.getElementById('nomeCliente').value = cliente.nomeCliente;
      document.getElementById('cpf').value = cliente.cpf;
      document.getElementById('telefoneCelular').value = cliente.telefoneCelular;
      document.getElementById('enderecoCompleto').value = cliente.enderecoCompleto || '';
    };
  
    // Função para atualizar o cliente
    const atualizarCliente = async (clienteData) => {
      try {
        const response = await fetch(`${apiBaseUrl}/updateClient/${clienteId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(clienteData)
        });
  
        if (response.ok) {
          alert('Cliente atualizado com sucesso.');
          window.location.href = 'lista_cliente.html';
        } else {
          const errorText = await response.text();
          throw new Error(`Erro ao atualizar cliente: ${errorText}`);
        }
      } catch (error) {
        console.error(error);
        alert('Não foi possível atualizar o cliente. Verifique o console para mais detalhes.');
      }
    };
  
    // Inicialização: Buscar e preencher dados do cliente
    const init = async () => {
      const cliente = await fetchCliente(clienteId);
      if (cliente) {
        preencherFormulario(cliente);
      } else {
        window.location.href = 'lista_cliente.html';
      }
    };
  
    // Evento de submissão do formulário
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const nomeCliente = document.getElementById('nomeCliente').value.trim();
      const cpf = document.getElementById('cpf').value.trim();
      const telefoneCelular = document.getElementById('telefoneCelular').value.trim();
      const enderecoCompleto = document.getElementById('enderecoCompleto').value.trim();
  
      // Validação básica
      if (!nomeCliente || !cpf || !telefoneCelular) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
  
      const clienteData = {
        nomeCliente,
        cpf,
        telefoneCelular,
        enderecoCompleto
      };
  
      await atualizarCliente(clienteData);
    });
  
    // Chama a função de inicialização
    init();
  });
  