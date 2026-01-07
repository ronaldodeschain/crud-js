/**
 * @file script.js
 * @description Este arquivo contém as funções JavaScript para o aplicativo CRUD de inventário.
 */
const API_ENDPOINT = 'http://localhost:3000/inventory'; // Define o endpoint da API para o inventário
let inventory = []; // Inicializa o inventário como um array vazio

/**
 * Função auto-invocada para carregar o inventário assim que a página é carregada.
 * @async
 * @function
 */
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

/**
 * Função assíncrona para salvar o inventário no servidor.
 * @async
 */
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


/**
 * Função para adicionar um novo produto ao array de inventário.
 * @param {string} name O nome do produto.
 * @param {string} category A categoria do produto.
 * @param {number} quantity A quantidade do produto.
 * @param {number} price O preço do produto.
 */
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
/**
 * Gera um ID único aleatório.
 * @returns {string} O ID único gerado.
 */
function generateId() {
    return Math.random().toString(36).substring(2, 15); // Gera um ID aleatório
}

/**
 * Função para adicionar um novo produto ao inventário através do formulário.
 * Obtém os valores dos campos de entrada, valida-os e adiciona o produto ao inventário.
 * @async
 * @function
 * @returns {void}
 */
function addNewProduct() {
    const name = document.getElementById('addName').value;
    const category = document.getElementById('addCategory').value;
    const quantity = document.getElementById('addQuantity').value;
    const price = parseFloat(document.getElementById('addPrice').value);

    // Verifica se quantidade é um inteiro
    if (!/^\d+$/.test(quantity)) {
        alert("Por favor, insira um número inteiro para a quantidade.");
        return;
    }
    // Verifica se os campos estão preenchidos e se os valores numéricos são válidos
    const quantityNum = Number(quantity)

    if (quantityNum <= 0) {
        alert("Por favor, insira uma quantidade maior que zero.");

        return;
    }
    if (price <= 0) {
        alert("Por favor, insira um valor maior que zero");
        return;
    }
    if (name && category && !isNaN(quantity) && !isNaN(price)) {
        addProduct(name, category, quantity, price);
        document.getElementById('addName').value = '';
        document.getElementById('addCategory').value = '';
        document.getElementById('addQuantity').value = '';

        // Limpa os campos de entrada
        document.getElementById('addPrice').value = '';

        window.location.href = "index.html";
        alert("Produto adicionado com sucesso!");
    } else {
        alert("Por favor, insira dados válidos para o produto.");
    }
}

/**
 * Função para listar os produtos na tabela.
 * Obtém o elemento tbody da tabela, limpa-o e adiciona os produtos do inventário.
 */
function listProducts() {

    let inventoryTable = document.getElementById('inventoryTable');

    const tableBody = inventoryTable ? inventoryTable.querySelector('tbody') : null;
    if (!tableBody) {
        return;
    }
    if (inventory.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Nenhum produto Cadastrado ainda.Vá em <a href="adicionar_produto.html">Adicionar Produto</a> para começar</td></tr>';
        return;
    }
    tableBody.innerHTML = '';

    inventory.forEach((product) => {

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.quantity}</td>
            <td>${product.price.toLocaleString(
            "pt-BR",
            { style: "currency", currency: "BRL" },
        )}
            </td>
            <td><button onclick="location.href = 'atualiza-produto.html?id=' + this.parentNode.parentNode.cells[0].innerText">Atualizar</button>
            <td><button onclick="deleteProductFromList('${product.id}')">Remover</button></td>
        `;

        tableBody.appendChild(row);
    });
}

/**
 * Função para limpar a tabela de inventário.
 * Obtém o elemento da tabela e limpa o seu conteúdo.
 */
function clearTable() {
    let table = document.getElementById('inventoryTable');
    if (table) {
        // Obtém o elemento tbody da tabela
        let tbody = table.querySelector('tbody');
        if (tbody)
            tbody.innerHTML = '';
    }
}

/**
 * Função para remover um produto da lista.
 * Encontra o índice do produto no array de inventário, remove-o, salva o inventário atualizado e renderiza a tabela.
 * @param {string} productId O ID do produto a ser removido.
 * @returns {void}
 */
function deleteProductFromList(productId) {
    const productIndex = inventory.findIndex((product) => product.id === productId);
    // Se o produto não for encontrado, exibe um alerta
    if (productIndex === -1) {
        alert("Produto não encontrado.");
        return;
    }
    // Remove o produto do array de inventário
    inventory.splice(productIndex, 1);
    saveInventory();
    renderTable();
}

/**
 * Função para renderizar a tabela.
 * Obtém o elemento da tabela e chama a função para listar os produtos.
 * @returns {void}
 */
function renderTable() {
    clearTable()
    let table = document.querySelector('table');
    listProducts()
}
/**
     * Função para atualizar um produto existente no inventário.
     * Obtém os valores dos campos de entrada do formulário, encontra o produto no inventário, atualiza os seus dados,
     * salva o inventário atualizado e renderiza a tabela.
     * @returns {void}
     */
function updateProduct() {
    const id = document.getElementById('updateId').value;
    const name = document.getElementById('updateName').value;
    const category = document.getElementById('updateCategory').value;
    const quantity = document.getElementById('updateQuantity').value;
    const price = document.getElementById('updatePrice').value;
    const productIndex = inventory.findIndex((product) => product.id === id);

    // Se o produto não for encontrado, exibe um alerta
    if (productIndex === -1) {
        alert("Produto não encontrado.");
        return;
    }

    // Atualiza o produto apenas se os campos estiverem preenchidos
    if (name) inventory[productIndex].name = name;
    if (category) inventory[productIndex].category = category;
    if (quantity) inventory[productIndex].quantity = parseInt(quantity);
    if (price) inventory[productIndex].price = parseFloat(price);

    // Salva o inventário atualizado e renderiza a tabela
    saveInventory();
    renderTable();
    alert("Produto atualizado com sucesso!");
}
/**
 * Função para remover um produto.
 * Obtém o ID do produto a ser removido, encontra o produto no inventário, remove-o, salva o inventário atualizado e redireciona para a página de listagem.
 * @async
 */
async function removeProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');

    if (query) {
        const productIndex = inventory.findIndex(product => product.id === query || product.name.toLowerCase().includes(query.toLowerCase()));

        if (productIndex !== -1) {
            inventory.splice(productIndex, 1);
            await saveInventory();
            window.location.href = 'index.html';
        } else {
            alert("Produto não encontrado no inventário.");
        }
    } else {
        alert("ID do produto não encontrado.");
    }
}

/**
 * Função para realizar a busca do produto e redirecionar para a página de exibição.
 * @async
 */
async function searchProduct() {
    const query = document.getElementById('findQuery').value;
    if (query) {
        // Verifica se o produto existe
        const results = inventory.filter(product =>
            product.id === query || product.name.toLowerCase().includes(query.toLowerCase())
        );

        if (results.length > 0) {
            window.location.href = `exibir-produto.html?query=${query}`;
        } else {
            alert("Produto inexistente");
        }
    } else {
        alert("Por favor, insira um ID ou nome para buscar.");
    }
}
