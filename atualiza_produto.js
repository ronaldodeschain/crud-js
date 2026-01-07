/**
 * Este script é responsável por carregar os detalhes do produto na página de atualização (`atualiza_produto.html`)
 * e permitir que o usuário edite e salve as alterações.
 */
document.addEventListener('DOMContentLoaded', async () => {
    await loadInventory();


    // Get the product ID from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Find the product in the inventory
    const product = inventory.find(p => p.id === productId);

    // If the product is found, populate the form
    if (product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productQuantity').value = product.quantity;
        document.getElementById('productPrice').value = product.price;
    } else {
        alert("Produto não encontrado.");
        window.location.href = 'listar.html';
    }
});

/**
 * Esta função é chamada quando o usuário clica no botão "Atualizar" para salvar as alterações
 * feitas nos detalhes do produto.
 */// Esta função é chamada quando o usuário clica no botão "Atualizar" para salvar as alterações

async function updateProductDetails() {
    const productId = document.getElementById('productId').value;
    const productName = document.getElementById('productName').value;
    const productCategory = document.getElementById('productCategory').value;
    const productQuantity = document.getElementById('productQuantity').value;
    const productPrice = document.getElementById('productPrice').value;

    // Find the product index in the inventory
    const productIndex = inventory.findIndex(p => p.id === productId);

    if (productIndex !== -1) {
        // Update the product details in the inventory
        inventory[productIndex] = {
            id: productId,
            name: productName,
            category: productCategory,
            quantity: parseFloat(productQuantity),
            price: parseFloat(productPrice)
        };

        // Save the updated inventory and redirect to the list page
        await saveInventory();
        window.location.href = 'listar.html';
    } else {
        alert("Produto não encontrado.");
    }
}