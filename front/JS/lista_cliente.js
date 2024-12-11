// ./JS/lista_cliente.js

document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'http://localhost:8080/client'; // Base URL da API
    const tableBody = document.getElementById('clientes-table-body');
    const searchInput = document.getElementById('search');
  
    // Função para buscar todos os clientes
    const fetchClientes = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/listClients`);
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
  
    // Função para renderizar a tabela de clientes
    const renderClientes = (clientes) => {
      tableBody.innerHTML = ''; // Limpa a tabela antes de renderizar
  
      clientes.forEach(cliente => {
        const tr = document.createElement('tr');
  
        tr.innerHTML = `
          <td>${cliente.nomeCliente}</td>
          <td>${cliente.cpf}</td>
          <td>${cliente.telefoneCelular}</td>
          <td>${cliente.enderecoCompleto || 'N/A'}</td>
          <td>
            <a href="editar_cliente.html?id=${cliente.id}" class="btn btn-warning btn-sm">Editar</a>
            <button class="btn btn-danger btn-sm" data-id="${cliente.id}">Excluir</button>
          </td>
        `;
  
        tableBody.appendChild(tr);
      });
    };
  
    // Função para filtrar clientes com base na busca
    const filterClientes = (clientes, query) => {
      const lowerQuery = query.toLowerCase();
      return clientes.filter(cliente => 
        cliente.nomeCliente.toLowerCase().includes(lowerQuery) || 
        cliente.cpf.toLowerCase().includes(lowerQuery)
      );
    };
  
    // Função para deletar um cliente
    const deleteCliente = async (id) => {
      if (!confirm('Tem certeza que deseja excluir este cliente?')) {
        return;
      }
  
      try {
        const response = await fetch(`${apiBaseUrl}/deleteClient/${id}`, {
          method: 'DELETE'
        });
  
        if (response.status === 204) {
          alert('Cliente excluído com sucesso.');
          // Recarrega a lista de clientes
          const updatedClientes = await fetchClientes();
          renderClientes(updatedClientes);
        } else if (response.status === 404) {
          alert('Cliente não encontrado.');
        } else {
          const errorText = await response.text();
          throw new Error(`Erro ao excluir cliente: ${errorText}`);
        }
      } catch (error) {
        console.error(error);
        alert('Não foi possível excluir o cliente. Verifique o console para mais detalhes.');
      }
    };
  
    // Inicialização: Buscar e renderizar clientes
    const init = async () => {
      const clientes = await fetchClientes();
      renderClientes(clientes);
  
      // Adicionar event listeners para os botões de excluir
      tableBody.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON' && event.target.classList.contains('btn-danger')) {
          const clienteId = event.target.getAttribute('data-id');
          deleteCliente(clienteId);
        }
      });
    };
  
    // Evento de busca
    searchInput.addEventListener('input', async (event) => {
      const query = event.target.value;
      const allClientes = await fetchClientes();
      const filteredClientes = filterClientes(allClientes, query);
      renderClientes(filteredClientes);
    });
  
    // Chama a função de inicialização
    init();
  });
  