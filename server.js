const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Caminho para o arquivo JSON
const filePath = path.join(__dirname, 'veiculos.json');

// Criar o arquivo com exemplos, se não existir
const veiculosExemplos = [
    { id: 1, placa: 'ABC-1234', chassi: 'XPT12345', renavam: '987654321', modelo: 'Civic', marca: 'Honda', ano: 2019 },
    { id: 2, placa: 'DEF-5678', chassi: 'ZXT98765', renavam: '123456789', modelo: 'Fusca', marca: 'Volkswagen', ano: 1974 },
    { id: 3, placa: 'GHI-9012', chassi: 'ABC98765', renavam: '456789123', modelo: 'Civic', marca: 'Honda', ano: 2020 }
];

// Criar o arquivo JSON com os exemplos
fs.writeFileSync(filePath, JSON.stringify(veiculosExemplos, null, 2));

// Função para ler o arquivo JSON
const readVeiculosFromFile = () => {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

// Função para escrever no arquivo JSON
const writeVeiculosToFile = (veiculos) => {
    fs.writeFileSync(filePath, JSON.stringify(veiculos, null, 2));
};

// Rota para obter todos os veículos
app.get('/veiculos', (req, res) => {
    const veiculos = readVeiculosFromFile();
    res.json(veiculos);
});

// Rota para adicionar um novo veículo
app.post('/veiculos', (req, res) => {
    const veiculos = readVeiculosFromFile();
    const novoVeiculo = { id: veiculos.length + 1, ...req.body };
    veiculos.push(novoVeiculo);
    writeVeiculosToFile(veiculos);
    res.status(201).json(novoVeiculo);
});

// Rota para atualizar um veículo existente
app.put('/veiculos/:id', (req, res) => {
    const { id } = req.params;
    const veiculos = readVeiculosFromFile();
    const index = veiculos.findIndex(v => v.id == id);

    if (index !== -1) {
        veiculos[index] = { id: Number(id), ...req.body };
        writeVeiculosToFile(veiculos);
        res.json(veiculos[index]);
    } else {
        res.status(404).send('Veículo não encontrado');
    }
});

// Rota para deletar um veículo
app.delete('/veiculos/:id', (req, res) => {
    const { id } = req.params;
    let veiculos = readVeiculosFromFile();
    veiculos = veiculos.filter(v => v.id != id);
    writeVeiculosToFile(veiculos);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
