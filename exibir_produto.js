/**
 * Este script é responsável por exibir os detalhes de um produto específico na página `exibirProduto.html`.
 * Ele obtém o ID do produto da URL, busca as informações do produto no inventário e as exibe em uma tabela.
 */
document.addEventListener('DOMContentLoaded', async () => {
    await loadInventory();



    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');

    if (query) {
        displayProductDetails(query);
    }
});

/**
 * Esta função é responsável por buscar as informações do produto no inventário e exibi-las na tabela.
 * @param {string} query O ID ou nome do produto a ser buscado.
 * @returns {void}
 */
async function displayProductDetails(query) {
    const productTable = document.getElementById('productTable');
    const tbody = productTable.querySelector('tbody');

    if (!productTable || !tbody) {
        console.error("Table or tbody not found in exibir_produto.html");
        return;
    }

    const results = inventory.filter(product =>
        product.id === query || product.name.toLowerCase().includes(query.toLowerCase())
    );

    tbody.innerHTML = '';

    if (results.length === 0) {
        alert("Nenhum produto encontrado.");
        window.location.href = 'buscar.html';
    } else {
        results.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.quantity}</td>
                <td>${product.price}</td>
            `;

            tbody.appendChild(row);
        });
    }
}
