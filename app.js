// Importa os módulos necessários do Node.js
const express = require('express');
const fs = require('fs');
const cors = require('cors');

// Cria uma instância do aplicativo Express
const app = express();
// Define a porta em que o servidor irá rodar
const port = 3000;
// Define o nome do arquivo onde os dados serão armazenados
const DATA_FILE = 'data.json';

// Configura as opções do CORS para permitir requisições de um domínio específico
const corsOptions = {
    origin: 'http://127.0.0.1:5500', // Domínio que tem permissão para acessar a API
    optionsSuccessStatus: 200 // Para navegadores legados (IE11, SmartTVs)
};

// Aplica o middleware do CORS com as opções definidas
app.use(cors(corsOptions));
// Aplica o middleware para analisar corpos de requisição JSON
app.use(express.json());

// Lida com requisições OPTIONS (preflight) para todas as rotas
app.options('*', cors(corsOptions));



// Rota para obter o inventário
app.get('/inventory', (req, res) => {
    // Lê o conteúdo do arquivo de dados
    fs.readFile(DATA_FILE, (err, data) => {
        // Se ocorrer um erro na leitura do arquivo, retorna um erro 500
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading data file');
        }
        // Define o cabeçalho da resposta para indicar que é um JSON
        res.setHeader('Content-Type', 'application/json');
        // Envia os dados como resposta
        res.send(data);
    });
});

// Rota para atualizar o inventário
app.put('/inventory', (req, res) => {
    // Converte o corpo da requisição (que contém os dados do inventário) para uma string JSON formatada
    const inventoryData = JSON.stringify(req.body, null, 2);
    // Escreve os dados no arquivo
    fs.writeFile(DATA_FILE, inventoryData, (err) => {
        // Se ocorrer um erro na escrita do arquivo, retorna um erro 500
        if (err) {
            console.error(err);
            return res.status(500).send('Error updating inventory');
        }
        // Envia uma mensagem de sucesso
        res.send('Inventory updated successfully');
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
    // Garante que o arquivo de dados exista
    if (!fs.existsSync(DATA_FILE)) {
        // Se o arquivo não existir, cria um novo com um array vazio
        fs.writeFileSync(DATA_FILE, '[]');
        console.log(`${DATA_FILE} created`);
    } else {
    console.log('Starting server with Express and CORS...');
    // Se o arquivo já existir, exibe uma mensagem indicando que ele existe
        console.log(`${DATA_FILE} exists`);
    }
});