/**
 * Este script é responsável por carregar os detalhes do produto na página de
 * atualização (`atualiza-produto.html`)
 * e permitir que o usuário edite e salve as alterações.
 */
document.addEventListener('DOMContentLoaded', async () => {
    await loadInventory();

    // Pega o id do produto dos paramentros da URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Acha o produto no inventário
    const product = inventory.find(p => p.id === productId);
    // Se o produto é encontrado, popula o formulário
    if (product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productQuantity').value = product.quantity;
        document.getElementById('productPrice').value = product.price;
    } else {
        alert("Produto não encontrado.");
        window.location.href = 'index.html';
    }
});

/**
 * Esta função é chamada quando o usuário clica no botão "Atualizar" para salvar
 * as alterações feitas nos detalhes do produto.
 */
async function updateProductDetails() {
    const productId = document.getElementById('productId').value;
    const productName = document.getElementById('productName').value;
    const productCategory = document.getElementById('productCategory').value;
    const productQuantity = document.getElementById('productQuantity').value;
    const productPrice = document.getElementById('productPrice').value;

    if (!Number.isInteger(Number(productQuantity))) {
        alert("Por favor, insira um número inteiro para a quantidade.");
        return;
    }
    if (Number(productQuantity) <= 0) {
        alert("Por favor, insira uma quantidade maior que zero.");
        return;
    }
    if (Number(productPrice) <= 0) {
        alert("Por favor, insira um preço maior que zero");
        return;
    }
    // Encontra o indice do produto no inventário
    const productIndex = inventory.findIndex(p => p.id === productId);

    if (productIndex !== -1) {
        // Atualiza os detalhes de um produto no inventário
        inventory[productIndex] = {
            id: productId,
            name: productName,
            category: productCategory,
            quantity: parseInt(productQuantity),
            price: parseFloat(productPrice)
        };
        // Salva o inventário atualizado e redireciona para o index
        await saveInventory();
        window.location.href = 'index.html';
    } else {
        alert("Produto não encontrado.");
    }
}