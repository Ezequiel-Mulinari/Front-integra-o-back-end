document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
  
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const nomeCliente = document.getElementById('nomeCliente').value;
      const cpf = document.getElementById('cpf').value;
      const telefoneCelular = document.getElementById('telefoneCelular').value;
      const enderecoCompleto = document.getElementById('enderecoCompleto').value;
  
      const clienteData = {
        nomeCliente: nomeCliente,
        cpf: cpf,
        telefoneCelular: telefoneCelular,
        enderecoCompleto: enderecoCompleto
      };
  
      try {
        const response = await fetch('http://localhost:8080/client/createClient', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(clienteData)
        });
  
        if (response.ok) {
          // Redireciona para a lista de clientes após sucesso
          window.location.href = 'lista_cliente.html';
        } else {
          const errorText = await response.text();
          alert(`Erro ao criar cliente: ${errorText}`);
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Não foi possível criar o cliente. Verifique a conexão com o servidor.');
      }
    });
  });
  