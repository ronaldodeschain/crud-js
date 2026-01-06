
const API_ENDPOINT = 'http://localhost:3000/inventory'; // Define o endpoint da API para o inventário
let inventory = []; // Inicializa o inventário como um array vazio

// Função auto-invocada para carregar o inventário assim que a página é carregada
(async () => {
    await loadInventory();
})();

// Função assíncrona para carregar o inventário do servidor
async function loadInventory() {
    try {
        const response = await fetch(API_ENDPOINT); // Faz a requisição para a API
        inventory = await response.json(); // Converte a resposta para JSON
        renderTable(); // Renderiza a tabela com os dados do inventário
    } catch (error) {
        console.error("Falha ao carregar o inventário do servidor:", error);
        inventory = []; // Garante que o inventário seja inicializado em caso de erro
    }
}

// Função assíncrona para salvar o inventário no servidor
async function saveInventory() {
    try {
        await fetch(API_ENDPOINT, {
            method: 'PUT', // Usa o método PUT para atualizar o inventário
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inventory), // Converte o inventário para JSON e envia no corpo da requisição
        });
    } catch (error) {
        console.error("Falha ao salvar o inventário no servidor:", error);
    }
}


// Função para adicionar um novo produto ao array de inventário
function addProduct(name, category, quantity, price) {

    const id = generateId(); // Gera um ID único para o produto
    const product = {
        id: id,
        name: name,
        category: category,
        quantity: quantity,
        price: price,
    };    

    // Adiciona o produto ao array de inventário
    inventory.push(product);

    // Atualiza a tabela e salva no servidor
    renderTable();
    saveInventory();
    
}

function generateId() {
  return Math.random().toString(36).substring(2, 15); // Gera um ID aleatório
}

// Função para adicionar um novo produto ao inventário através do formulário
function addNewProduct() {

    // Obtém os valores dos campos de entrada do formulário
    const name = document.getElementById('addName').value;
    const category = document.getElementById('addCategory').value;
    const quantity = parseFloat(document.getElementById('addQuantity').value);
    const price = parseFloat(document.getElementById('addPrice').value);

    // Verifica se os campos estão preenchidos e se os valores numéricos são válidos
    if (name && category && !isNaN(quantity) && !isNaN(price)) {
        addProduct(name, category, quantity, price); // Adiciona o produto ao inventário

        document.getElementById('addName').value = '';
        document.getElementById('addCategory').value = '';
        document.getElementById('addQuantity').value = '';
        // Limpa os campos de entrada
        document.getElementById('addPrice').value = '';

        alert("Produto adicionado com sucesso!");
    } else {
        alert("Por favor, insira dados válidos para o produto.");
    }
}

// Função para listar os produtos na tabela
function listProducts() {

    // Obtém o elemento tbody da tabela
    const tableBody = document.querySelector("#inventoryTable tbody");
    if (!tableBody) {
        console.error("Corpo da tabela não encontrado!");
            return;
        }
    
    inventory.forEach((product) => {    

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.quantity}</td>
            <td>${product.price}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Função para limpar a tabela de inventário
function clearTable() {
    // Obtém o elemento da tabela
    let table = document.getElementById('inventoryTable');
    if (table) {
        // Obtém o elemento tbody da tabela
        let tbody = table.querySelector('tbody');
        if (tbody)
            tbody.innerHTML = '';
    }
}

function renderTable() {
    // Obtém o elemento da tabela
    let table = document.querySelector('table');
    listProducts()
}

// Função para atualizar um produto existente no inventário
function updateProduct() {    
    // Obtém os valores dos campos de entrada do formulário
    const id = document.getElementById('updateId').value;    
    const name = document.getElementById('updateName').value;
    const category = document.getElementById('updateCategory').value;
    const quantity = document.getElementById('updateQuantity').value;    
    const price = document.getElementById('updatePrice').value;

    // Encontra o índice do produto no array de inventário
    const productIndex = inventory.findIndex((product) => product.id === id);

    // Se o produto não for encontrado, exibe um alerta
    if (productIndex === -1) {
        alert("Produto não encontrado.");
        return;
    }

    // Atualiza o produto apenas se os campos estiverem preenchidos
    if (name) inventory[productIndex].name = name;
    if (category) inventory[productIndex].category = category;    
    if (quantity) inventory[productIndex].quantity = parseFloat(quantity);    
    if (price) inventory[productIndex].price = parseFloat(price);
    
    // Salva o inventário atualizado e renderiza a tabela
    saveInventory();
    renderTable();
    alert("Produto atualizado com sucesso!");
}

// Função para deletar um produto do inventário
function deleteProduct() {

    // Obtém o ID do produto a ser deletado
    const id = document.getElementById('deleteId').value;    

    // Encontra o índice do produto no array de inventário
    const productIndex = inventory.findIndex((product) => product.id === id);    

    // Se o produto não for encontrado, exibe um alerta
    if (productIndex === -1) {        
        alert("Produto não encontrado.");
        return;
    }
    // Remove o produto do array de inventário
    inventory.splice(productIndex, 1);    

    // Salva o inventário atualizado e renderiza a tabela
    saveInventory();
    renderTable();    

}

// Função para encontrar produtos no inventário
function findProduct(query) {
    // Filtra o inventário com base na query
    const results = inventory.filter(
        (product) =>
        product.id === query || product.name.toLowerCase().includes(query.toLowerCase())
    );

    // Exibe os resultados no console
    if (results.length === 0) {
        console.log("Nenhum produto encontrado.");
    } else {
        results.forEach((product) => console.log("Produto encontrado:", product));
    }
}
