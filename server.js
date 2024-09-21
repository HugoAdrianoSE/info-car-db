const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const filePath = path.join(__dirname, 'veiculos.json');

const veiculosExemplos = [
  { id: 1, placa: 'ABC-1234', chassi: 'XPT12345', renavam: '987654321', modelo: 'Civic', marca: 'Honda', ano: 2019 },
  { id: 2, placa: 'DEF-5678', chassi: 'ZXT98765', renavam: '123456789', modelo: 'Fusca', marca: 'Volkswagen', ano: 1974 },
  { id: 3, placa: 'GHI-9012', chassi: 'ABC98765', renavam: '456789123', modelo: 'Civic', marca: 'Honda', ano: 2020 }
];

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify(veiculosExemplos, null, 2));
}

const readVeiculosFromFile = () => {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

const writeVeiculosToFile = (veiculos) => {
  fs.writeFileSync(filePath, JSON.stringify(veiculos, null, 2));
};

app.get('/veiculos', (req, res) => {
  const veiculos = readVeiculosFromFile();
  res.status(200).json({
    message: 'Veículos listados com sucesso',
    veiculos: veiculos
  });
});

app.post('/veiculos', (req, res) => {
  const veiculos = readVeiculosFromFile();
  const novoVeiculo = { id: veiculos.length ? veiculos[veiculos.length - 1].id + 1 : 1, ...req.body };
  veiculos.push(novoVeiculo);
  writeVeiculosToFile(veiculos);
  res.status(201).json({
    message: 'Veículo cadastrado com sucesso',
    veiculoRecebido: novoVeiculo
  });
});

app.put('/veiculos/:id', (req, res) => {
  const { id } = req.params;
  const veiculos = readVeiculosFromFile();
  const index = veiculos.findIndex(v => v.id == id);

  if (index !== -1) {
    veiculos[index] = { id: Number(id), ...req.body };
    writeVeiculosToFile(veiculos);
    res.status(200).json({
      message: 'Veículo atualizado com sucesso',
      veiculoAtualizado: veiculos[index]
    });
  } else {
    res.status(404).json({
      message: 'Veículo não encontrado'
    });
  }
});

app.delete('/veiculos/:id', (req, res) => {
  const { id } = req.params;
  let veiculos = readVeiculosFromFile();
  const veiculoIndex = veiculos.findIndex(v => v.id == id);

  if (veiculoIndex !== -1) {
    veiculos.splice(veiculoIndex, 1);
    writeVeiculosToFile(veiculos);
    res.status(200).json({
      message: 'Veículo deletado com sucesso',
      veiculos
    });
  } else {
    res.status(404).json({
      message: 'Veículo não encontrado'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
