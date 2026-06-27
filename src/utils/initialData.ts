/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Empresa, 
  ObraLocal, 
  Equipamento, 
  Funcionario, 
  Comboio, 
  TipoCombustivel, 
  ProdutoLubrificacao, 
  EtapaServico, 
  Abastecimento, 
  Lubrificacao, 
  RdoDiario,
  HistoryLog,
  ListaPresenca
} from '../types';

export const INITIAL_EMPRESAS: Empresa[] = [
  { id: 'emp-1', nome: 'RENEA INFRAESTRUTURA S.A.', cnpj: '12.345.678/0001-90', telefone: '(11) 3214-9900', responsavel: 'Eng. Ricardo Renea' },
  { id: 'emp-2', nome: 'CONSTRUTORA SUL-AMERICANA S/A', cnpj: '98.765.432/0001-10', telefone: '(21) 2500-1122', responsavel: 'Dr. Roberto Souza' },
  { id: 'emp-3', nome: 'GT Transportes', cnpj: '45.888.222/0001-30', telefone: '(19) 3876-5432', responsavel: 'Sandro Santos' },
  { id: 'emp-4', nome: 'Sondasolo', cnpj: '33.444.555/0001-22', telefone: '(11) 4004-1234', responsavel: 'Lucas Sonda' },
  { id: 'emp-5', nome: 'Escala Rental', cnpj: '22.111.000/0001-44', telefone: '(11) 3322-1100', responsavel: 'Fabio Escala' },
  { id: 'emp-6', nome: 'Gerasuper', cnpj: '55.666.777/0001-88', telefone: '(11) 5544-3322', responsavel: 'Carlos Gera' },
  { id: 'emp-7', nome: 'Vallocar', cnpj: '77.888.999/0001-11', telefone: '(11) 9988-7766', responsavel: 'Andre Vallo' },
  { id: 'emp-8', nome: 'JC Rental', cnpj: '11.222.333/0001-55', telefone: '(11) 7766-5544', responsavel: 'Julio Cesar' },
  { id: 'emp-9', nome: 'Tecnogeo', cnpj: '88.999.000/0001-33', telefone: '(11) 8877-6655', responsavel: 'Roberto Geo' },
  { id: 'emp-10', nome: 'Locado', cnpj: '44.555.666/0001-77', telefone: '(11) 2233-4455', responsavel: 'Mário Loca' },
  { id: 'emp-11', nome: 'Tecnogeo/Roda Muk', cnpj: '66.777.888/0001-99', telefone: '(11) 6655-4433', responsavel: 'Renato Muk' },
  { id: 'emp-12', nome: 'Locaguinchos', cnpj: '99.000.111/0001-22', telefone: '(11) 1122-3344', responsavel: 'Geraldo Guincho' },
  { id: 'emp-13', nome: 'Megapeso Transportes', cnpj: '12.233.344/0001-55', telefone: '(11) 2233-4455', responsavel: 'Marcos Peso' },
  { id: 'emp-14', nome: 'Camacon', cnpj: '34.455.566/0001-77', telefone: '(11) 4455-6677', responsavel: 'Eduardo Cama' },
  { id: 'emp-15', nome: 'MGM Rental', cnpj: '56.677.788/0001-99', telefone: '(11) 8899-0011', responsavel: 'Marcelo MGM' },
  { id: 'emp-16', nome: 'Zetaloc.com.br', cnpj: '78.899.900/0001-11', telefone: '(11) 1122-3344', responsavel: 'Zeca Loc' },
  { id: 'emp-17', nome: 'Lagon', cnpj: '90.011.122/0001-33', telefone: '(11) 3344-5566', responsavel: 'Leonardo Lagon' },
  { id: 'emp-18', nome: 'Formeq Rental', cnpj: '12.345.678/0002-12', telefone: '(11) 5566-7788', responsavel: 'Felipe Formeq' },
  { id: 'emp-19', nome: 'Sollo', cnpj: '34.567.890/0002-34', telefone: '(11) 7788-9900', responsavel: 'Silvio Sollo' }
];

export const INITIAL_OBRAS: ObraLocal[] = [
  { id: 'obr-1', nome: 'Mão de Obra Geral - RENEA', endereco: 'Frente de Trabalho Renea', responsavel: 'Eng. Ricardo Renea', status: 'Ativa' },
  { id: 'obr-2', nome: 'Duplicação BR-101 KM 230', endereco: 'Palhoça - SC', responsavel: 'Eng. Gabriel Neves', status: 'Ativa' },
  { id: 'obr-3', nome: 'Anel Viário Metropolitano', endereco: 'Campinas - SP', responsavel: 'Eng. Aline Lima', status: 'Ativa' },
  { id: 'obr-4', nome: 'Pavimentação Parque Industrial', endereco: 'Joinville - SC', responsavel: 'Mestre Carlos Abreu', status: 'Planejada' }
];

export const INITIAL_EQUIPAMENTOS: Equipamento[] = [
  // Basculantes mentioned in Abastecimentos
  { id: 'eq-cb765', prefixo: 'CB765', nome: 'Caminhão Basculante Renea', tipo: 'Caminhão Basculante', marca: 'Mercedes-Benz', modelo: 'Axor 3131', seriePlaca: 'RE-765-BA', empresaId: 'emp-1', status: 'Ativo', localAtualId: 'obr-1', observacao: 'Frota ativa de basculantes.' },
  { id: 'eq-cb754', prefixo: 'CB754', nome: 'Caminhão Basculante Renea', tipo: 'Caminhão Basculante', marca: 'Mercedes-Benz', modelo: 'Axor 3131', seriePlaca: 'RE-754-BA', empresaId: 'emp-1', status: 'Ativo', localAtualId: 'obr-1', observacao: 'Frota ativa de basculantes.' },
  { id: 'eq-cb789', prefixo: 'CB789', nome: 'Caminhão Basculante Renea', tipo: 'Caminhão Basculante', marca: 'Volvo', modelo: 'VM 330', seriePlaca: 'RE-789-BA', empresaId: 'emp-1', status: 'Ativo', localAtualId: 'obr-1', observacao: 'Frota ativa de basculantes.' },
  { id: 'eq-cb775', prefixo: 'CB775', nome: 'Caminhão Basculante Renea', tipo: 'Caminhão Basculante', marca: 'Volvo', modelo: 'VM 330', seriePlaca: 'RE-775-BA', empresaId: 'emp-1', status: 'Ativo', localAtualId: 'obr-1', observacao: 'Frota ativa de basculantes.' },
  { id: 'eq-cb786', prefixo: 'CB786', nome: 'Caminhão Basculante Renea', tipo: 'Caminhão Basculante', marca: 'Mercedes-Benz', modelo: 'Axor 3131', seriePlaca: 'RE-786-BA', empresaId: 'emp-1', status: 'Ativo', localAtualId: 'obr-1', observacao: 'Frota ativa de basculantes.' },
  { id: 'eq-cb755', prefixo: 'CB755', nome: 'Caminhão Basculante Renea', tipo: 'Caminhão Basculante', marca: 'Mercedes-Benz', modelo: 'Axor 3131', seriePlaca: 'RE-755-BA', empresaId: 'emp-1', status: 'Ativo', localAtualId: 'obr-1', observacao: 'Frota ativa de basculantes.' },
  { id: 'eq-cb770', prefixo: 'CB770', nome: 'Caminhão Basculante Renea', tipo: 'Caminhão Basculante', marca: 'Volvo', modelo: 'VM 330', seriePlaca: 'RE-770-BA', empresaId: 'emp-1', status: 'Ativo', localAtualId: 'obr-1', observacao: 'Frota ativa de basculantes.' },
  { id: 'eq-cb730', prefixo: 'CB730', nome: 'Caminhão Basculante Renea', tipo: 'Caminhão Basculante', marca: 'Mercedes-Benz', modelo: 'Axor 3131', seriePlaca: 'RE-730-BA', empresaId: 'emp-1', status: 'Ativo', localAtualId: 'obr-1', observacao: 'Frota ativa de basculantes.' },
  { id: 'eq-cb804', prefixo: 'CB804', nome: 'Caminhão Basculante Renea', tipo: 'Caminhão Basculante', marca: 'Volkswagen', modelo: 'Constellation', seriePlaca: 'RE-804-BA', empresaId: 'emp-1', status: 'Ativo', localAtualId: 'obr-1', observacao: 'Frota ativa de basculantes.' },
  { id: 'eq-cb776', prefixo: 'CB776', nome: 'Caminhão Basculante Renea', tipo: 'Caminhão Basculante', marca: 'Volvo', modelo: 'VM 330', seriePlaca: 'RE-776-BA', empresaId: 'emp-1', status: 'Ativo', localAtualId: 'obr-1', observacao: 'Frota ativa de basculantes.' },
  { id: 'eq-cb794', prefixo: 'CB794', nome: 'Caminhão Basculante Renea', tipo: 'Caminhão Basculante', marca: 'Mercedes-Benz', modelo: 'Axor 3131', seriePlaca: 'RE-794-BA', empresaId: 'emp-1', status: 'Ativo', localAtualId: 'obr-1', observacao: 'Frota ativa de basculantes.' },
  { id: 'eq-cb767', prefixo: 'CB767', nome: 'Caminhão Basculante Renea', tipo: 'Caminhão Basculante', marca: 'Mercedes-Benz', modelo: 'Axor 3131', seriePlaca: 'RE-767-BA', empresaId: 'emp-1', status: 'Ativo', localAtualId: 'obr-1', observacao: 'Frota ativa de basculantes.' },
  { id: 'eq-cb735', prefixo: 'CB735', nome: 'Caminhão Basculante Renea', tipo: 'Caminhão Basculante', marca: 'Volvo', modelo: 'VM 330', seriePlaca: 'RE-735-BA', empresaId: 'emp-1', status: 'Ativo', localAtualId: 'obr-1', observacao: 'Frota ativa de basculantes.' },
  { id: 'eq-cb790', prefixo: 'CB790', nome: 'Caminhão Basculante Renea', tipo: 'Caminhão Basculante', marca: 'Mercedes-Benz', modelo: 'Axor 3131', seriePlaca: 'RE-790-BA', empresaId: 'emp-1', status: 'Ativo', localAtualId: 'obr-1', observacao: 'Frota ativa.' },
  { id: 'eq-cb748', prefixo: 'CB748', nome: 'Caminhão Basculante Renea', tipo: 'Caminhão Basculante', marca: 'Volvo', modelo: 'VM 330', seriePlaca: 'RE-748-BA', empresaId: 'emp-1', status: 'Ativo', localAtualId: 'obr-1', observacao: 'Frota ativa de basculantes.' },

  // Equipment from Image 2
  { id: 'eq-gp004', prefixo: 'GP004', nome: 'Grua de Esteiras Sany SCC1800', tipo: 'Guindaste', marca: 'Sany', modelo: 'SCC1800', seriePlaca: 'SNY-1800', empresaId: 'emp-1', status: 'Ativo', localAtualId: 'obr-2', observacao: 'Grua de esteiras de alta capacidade.' },
  { id: 'eq-gp005', prefixo: 'GP005', nome: 'Grua de Esteiras Sany SCC2500C', tipo: 'Guindaste', marca: 'Sany', modelo: 'SCC2500C', seriePlaca: 'SNY-2500', empresaId: 'emp-1', status: 'Ativo', localAtualId: 'obr-2', observacao: 'Equipamento pesado.' },
  { id: 'eq-te007', prefixo: 'TE007', nome: 'Trator De Esteiras D61 EX', tipo: 'Trator de Esteira', marca: 'Komatsu', modelo: 'D61 EX', seriePlaca: 'KM-007-TE', empresaId: 'emp-1', status: 'Ativo', localAtualId: 'obr-2', observacao: 'Trator de esteira potente.' },
  { id: 'eq-gp008', prefixo: 'GP008', nome: 'Guindaste Sany STC800', tipo: 'Guindaste', marca: 'Sany', modelo: 'STC800', seriePlaca: 'SNY-800', empresaId: 'emp-1', status: 'Ativo', localAtualId: 'obr-2', observacao: 'Guindaste rodoviário.' },
  { id: 'eq-ec012', prefixo: 'EC012', nome: 'Escavadeira Hidráulica 210', tipo: 'Escavadeira', marca: 'Caterpillar', modelo: '320D', seriePlaca: 'CAT-210', empresaId: 'emp-1', status: 'Ativo', localAtualId: 'obr-2', observacao: 'Escavadeira hidráulica robusta.' },
  { id: 'eq-rt017', prefixo: 'RT017', nome: 'Retroescavadeira 416E', tipo: 'Retroescavadeira', marca: 'Caterpillar', modelo: '416E', seriePlaca: 'CAT-416', empresaId: 'emp-1', status: 'Ativo', localAtualId: 'obr-2', observacao: 'Retroescavadeira versátil.' },
  { id: 'eq-ca019', prefixo: 'CA019', nome: 'Comboio de Abastecimento', tipo: 'Caminhão Comboio', marca: 'Mercedes-Benz', modelo: 'Atego 1719', seriePlaca: 'CMB-019', empresaId: 'emp-1', status: 'Ativo', localAtualId: 'obr-2', observacao: 'Comboio com tanque de combustível integrado.' },
  { id: 'eq-te030', prefixo: 'TE030', nome: 'Trator De Esteiras D6N XL', tipo: 'Trator de Esteira', marca: 'Caterpillar', modelo: 'D6N XL', seriePlaca: 'CAT-030-TE', empresaId: 'emp-1', status: 'Ativo', localAtualId: 'obr-2', observacao: 'Trator de esteiras Caterpillar.' },
  { id: 'eq-bt031', prefixo: 'BT031', nome: 'Caminhão Betoneira', tipo: 'Caminhão Betoneira', marca: 'Volkswagen', modelo: 'Constellation', seriePlaca: 'VW-031-BT', empresaId: 'emp-1', status: 'Ativo', localAtualId: 'obr-2', observacao: 'Betoneira de concreto.' },
  { id: 'eq-cv035', prefixo: 'CV035', nome: 'Cavalo Mecânico', tipo: 'Cavalo Mecânico', marca: 'Scania', modelo: 'R440', seriePlaca: 'SC-035-CV', empresaId: 'emp-1', status: 'Ativo', localAtualId: 'obr-2', observacao: 'Transporte de carretas.' },
  { id: 'eq-rc041', prefixo: 'RC041', nome: 'Rolo Chapa CA250', tipo: 'Rolo Compactador', marca: 'Dynapac', modelo: 'CA250', seriePlaca: 'DY-041-RC', empresaId: 'emp-1', status: 'Ativo', localAtualId: 'obr-2', observacao: 'Rolo liso para asfalto.' },
  { id: 'eq-ec063', prefixo: 'EC063', nome: 'Escavadeira Hidráulica 210 BLC', tipo: 'Escavadeira', marca: 'Sany', modelo: 'SY215', seriePlaca: 'SNY-210-BLC', empresaId: 'emp-1', status: 'Ativo', localAtualId: 'obr-2', observacao: 'Escavadeira de esteiras.' },

  // Rent/Partners equipment
  { id: 'eq-lo145', prefixo: 'LO145', nome: 'Caminhão Carroceria GT', tipo: 'Caminhão', marca: 'Ford', modelo: 'Cargo', seriePlaca: 'GT-145', empresaId: 'emp-3', status: 'Ativo', localAtualId: 'obr-3', observacao: 'Locado da GT Transportes.' },
  { id: 'eq-lo155', prefixo: 'LO155', nome: 'Perfuratriz Sondasolo', tipo: 'Perfuratriz', marca: 'Sondasolo', modelo: 'PS-155', seriePlaca: 'SS-155', empresaId: 'emp-4', status: 'Ativo', localAtualId: 'obr-3', observacao: 'Locado da Sondasolo.' },
  { id: 'eq-lo156', prefixo: 'LO156', nome: 'Gerador 170KVA - 170-004', tipo: 'Gerador', marca: 'Cummins', modelo: '170KVA', seriePlaca: 'ER-156', empresaId: 'emp-5', status: 'Ativo', localAtualId: 'obr-3', observacao: 'Locado da Escala Rental.' },
  { id: 'eq-lo157', prefixo: 'LO157', nome: 'Compressor - 4999002', tipo: 'Compressor', marca: 'Atlas Copco', modelo: '4999002', seriePlaca: 'GS-157', empresaId: 'emp-6', status: 'Ativo', localAtualId: 'obr-3', observacao: 'Locado da Gerasuper.' },
  { id: 'eq-lo231', prefixo: 'LO231', nome: 'Gerador JC6063', tipo: 'Gerador', marca: 'MWM', modelo: 'JC6063', seriePlaca: 'JC-231', empresaId: 'emp-8', status: 'Ativo', localAtualId: 'obr-3', observacao: 'Locado da JC Rental.' },
  { id: 'eq-lo237', prefixo: 'LO237', nome: 'Bate estaca (PE 3301) 7757', tipo: 'Bate Estaca', marca: 'Tecnogeo', modelo: 'PE3301', seriePlaca: 'TG-237', empresaId: 'emp-9', status: 'Ativo', localAtualId: 'obr-3', observacao: 'Locado da Tecnogeo.' },
  { id: 'eq-lo249', prefixo: 'LO249', nome: 'Caminhão Munck Roda Muk', tipo: 'Caminhão Munck', marca: 'Mercedes-Benz', modelo: 'Atego', seriePlaca: 'RM-249', empresaId: 'emp-11', status: 'Ativo', localAtualId: 'obr-3', observacao: 'Locado de Tecnogeo/Roda Muk.' },
  { id: 'eq-lo256', prefixo: 'LO256', nome: 'Caminhão Munck MB Atego 2730', tipo: 'Caminhão Munck', marca: 'Mercedes-Benz', modelo: 'Atego 2730', seriePlaca: 'LG-256', empresaId: 'emp-12', status: 'Ativo', localAtualId: 'obr-3', observacao: 'Locado de Locaguinchos.' },
  { id: 'eq-lo278', prefixo: 'LO278', nome: 'Retroescavadeira JCB 3CX', tipo: 'Retroescavadeira', marca: 'JCB', modelo: '3CX', seriePlaca: 'CC-278', empresaId: 'emp-14', status: 'Ativo', localAtualId: 'obr-3', observacao: 'Locado de Camacon.' },
  { id: 'eq-lo279', prefixo: 'LO279', nome: 'Escavadeira Hidráulica Cat 320 GC', tipo: 'Escavadeira', marca: 'Caterpillar', modelo: '320 GC', seriePlaca: 'MGM-279', empresaId: 'emp-15', status: 'Ativo', localAtualId: 'obr-3', observacao: 'Locado de MGM Rental.' },
  { id: 'eq-lo321', prefixo: 'LO321', nome: 'Mini Escavadeira Bob Cat', tipo: 'Mini Escavadeira', marca: 'Bobcat', modelo: 'E27', seriePlaca: 'ZL-321', empresaId: 'emp-16', status: 'Ativo', localAtualId: 'obr-3', observacao: 'Locado de Zetaloc.' },
  { id: 'eq-lo331', prefixo: 'LO331', nome: 'Caminhão Auto Bomba de Concreto', tipo: 'Caminhão Bomba', marca: 'Volkswagen', modelo: 'Constellation', seriePlaca: 'LA-331', empresaId: 'emp-17', status: 'Ativo', localAtualId: 'obr-3', observacao: 'Locado de Lagon.' },
  { id: 'eq-lo337', prefixo: 'LO337', nome: 'Bomba Diesel Wacker PT6 6" W12', tipo: 'Bomba de Água', marca: 'Wacker Neuson', modelo: 'PT6', seriePlaca: 'FQ-337', empresaId: 'emp-18', status: 'Ativo', localAtualId: 'obr-3', observacao: 'Locado de Formeq Rental.' },
  { id: 'eq-lo341', prefixo: 'LO341', nome: 'PTA JLG LIFT 600AJ', tipo: 'PTA', marca: 'JLG', modelo: '600AJ', seriePlaca: 'SL-341', empresaId: 'emp-19', status: 'Ativo', localAtualId: 'obr-3', observacao: 'Locado de Sollo.' }
];

export const INITIAL_FUNCIONARIOS: Funcionario[] = [
  { id: 'fun-1', nome: 'ADEMAR FERREIRA DA CRUZ', cargo: 'GREDISTA', telefone: '(11) 99111-0001', empresaId: 'emp-1', ativo: true },
  { id: 'fun-2', nome: 'ADRIANO M. DA SILVA', cargo: 'OPERADOR DE RETROESCAVADEIRA', telefone: '(11) 99111-0002', empresaId: 'emp-1', ativo: true },
  { id: 'fun-3', nome: 'ALEXANDRE DOS SANTOS RODRIGUES', cargo: 'OPERADOR DE CAMINHAO BASCULANTE', telefone: '(11) 99111-0003', empresaId: 'emp-1', ativo: true },
  { id: 'fun-4', nome: 'ALEXANDRE PASSOS BERNARDES', cargo: 'OPERADOR DE RETROESCAVADEIRA', telefone: '(11) 99111-0004', empresaId: 'emp-1', ativo: true },
  { id: 'fun-5', nome: 'ALVARO ALVES VILELA', cargo: 'ENGENHEIRO DE TERRAPLANAGEM E PAVIMENTAÇÃO', telefone: '(11) 99111-0005', empresaId: 'emp-1', ativo: true },
  { id: 'fun-6', nome: 'ANDERSON PEIXOTO DA SILVA', cargo: 'OPERADOR DE CAMINHAO BASCULANTE', telefone: '(11) 99111-0006', empresaId: 'emp-1', ativo: true },
  { id: 'fun-7', nome: 'ANTONIO FILHO DOS SANTOS', cargo: 'OPERADOR DE TRATOR DE ESTEIRA', telefone: '(11) 99111-0007', empresaId: 'emp-1', ativo: true },
  { id: 'fun-8', nome: 'ANTONIO PEREIRA SOBRINHO', cargo: 'OPERADOR DE ESCAVADEIRA', telefone: '(11) 99111-0008', empresaId: 'emp-1', ativo: true },
  { id: 'fun-9', nome: 'ARENILSON TEIXEIRA DOS SANTOS', cargo: 'OPERADOR DE CAMINHAO BASCULANTE', telefone: '(11) 99111-0009', empresaId: 'emp-1', ativo: true },
  { id: 'fun-10', nome: 'CARLOS EDUARDO DE ARAUJO', cargo: 'OPERADOR DE ESCAVADEIRA', telefone: '(11) 99111-0010', empresaId: 'emp-1', ativo: true },
  { id: 'fun-11', nome: 'CELSON SIQUEIRA SILVA', cargo: 'OPERADOR DE CAMINHAO BASCULANTE', telefone: '(11) 99111-0011', empresaId: 'emp-1', ativo: true },
  { id: 'fun-12', nome: 'DILSON DOS SANTOS MACHADO', cargo: 'LIDER DE EQUIPE', telefone: '(11) 99111-0012', empresaId: 'emp-1', ativo: true },
  { id: 'fun-13', nome: 'DOUGLAS GONCALVES SOARES', cargo: 'OPERADOR DE TRATOR DE ESTEIRAS', telefone: '(11) 99111-0013', empresaId: 'emp-1', ativo: true },
  { id: 'fun-14', nome: 'EDMILSON ALVES DA SILVA', cargo: 'OPERADOR DE CAMINHAO BASCULANTE', telefone: '(11) 99111-0014', empresaId: 'emp-1', ativo: true },
  { id: 'fun-15', nome: 'EDSON FERREIRA DA COSTA', cargo: 'OPERADOR DE PA CARREGADEIRA', telefone: '(11) 99111-0015', empresaId: 'emp-1', ativo: true },
  { id: 'fun-16', nome: 'EDUARDO SOARES DE OLIVEIRA', cargo: 'OPERADOR DE CAMINHAO BASCULANTE', telefone: '(11) 99111-0016', empresaId: 'emp-1', ativo: true },
  { id: 'fun-17', nome: 'ERISMARCO DE OLIVEIRA SILVA', cargo: 'OPERADOR DE ROLO COMPACTADOR', telefone: '(11) 99111-0017', empresaId: 'emp-1', ativo: true },
  { id: 'fun-18', nome: 'ERNANDE DUARTE DA SILVA', cargo: 'OPERADOR DE ESCAVADEIRA', telefone: '(11) 99111-0018', empresaId: 'emp-1', ativo: true },
  { id: 'fun-19', nome: 'ESPEDITO BENTO DA SILVA', cargo: 'APONTADOR II', telefone: '(11) 99111-0019', empresaId: 'emp-1', ativo: true },
  { id: 'fun-20', nome: 'EUDES DOS SANTOS MATHEUS', cargo: 'OPERADOR DE CAMINHAO BASCULANTE', telefone: '(11) 99111-0020', empresaId: 'emp-1', ativo: true },
  { id: 'fun-21', nome: 'EZEQUIEL DE SOUZA VIEIRA', cargo: 'OPERADOR DE CAMINHAO BASCULANTE', telefone: '(11) 99111-0021', empresaId: 'emp-1', ativo: true },
  { id: 'fun-22', nome: 'FABIANO ALVES NUNES', cargo: 'OPERADOR DE CAMINHAO BASCULANTE', telefone: '(11) 99111-0022', empresaId: 'emp-1', ativo: true },
  { id: 'fun-23', nome: 'FRANCISCO DAS CHAGAS FERREIRA AZEVEDO', cargo: 'OPERADOR DE ESCAVADEIRA', telefone: '(11) 99111-0023', empresaId: 'emp-1', ativo: true },
  { id: 'fun-24', nome: 'FRANCISCO FERREIRA DE LIMA', cargo: 'OPERADOR DE ESCAVADEIRA', telefone: '(11) 99111-0024', empresaId: 'emp-1', ativo: true },
  { id: 'fun-25', nome: 'FRANCISCO GOMES FILHO', cargo: 'OPERADOR DE MAQUINAS E EQUIPAMENTOS', telefone: '(11) 99111-0025', empresaId: 'emp-1', ativo: true },
  { id: 'fun-26', nome: 'GENIVALDO MANOEL DOS SANTOS', cargo: 'OPERADOR DE CAMINHAO BASCULANTE', telefone: '(11) 99111-0026', empresaId: 'emp-1', ativo: true },
  { id: 'fun-27', nome: 'GLEISSON SANTOS DE JESUS', cargo: 'OPERADOR DE CAMINHAO BASCULANTE', telefone: '(11) 99111-0027', empresaId: 'emp-1', ativo: true },
  { id: 'fun-28', nome: 'GUILHERME FERNANDES SANTOS SILVA', cargo: 'AUX GERAL', telefone: '(11) 99111-0028', empresaId: 'emp-1', ativo: true },
  { id: 'fun-29', nome: 'IVAN FRANCISCO SANTOS', cargo: 'OPERADOR DE MAQUINAS E EQUIPAMENTOS', telefone: '(11) 99111-0029', empresaId: 'emp-1', ativo: true },
  { id: 'fun-30', nome: 'JOCELIO BRAZ DE OLIVEIRA DA SILVA', cargo: 'OPERADOR DE ESCAVADEIRA', telefone: '(11) 99111-0030', empresaId: 'emp-1', ativo: true },
  { id: 'fun-31', nome: 'JONATHAN SAEGUSA MENDES', cargo: 'APONTADOR II', telefone: '(11) 99111-0031', empresaId: 'emp-1', ativo: true },
  { id: 'fun-32', nome: 'JOSE ALAN CARDEQUE', cargo: 'OPERADOR DE ESCAVADEIRA', telefone: '(11) 99111-0032', empresaId: 'emp-1', ativo: true },
  { id: 'fun-33', nome: 'JOSE APARECIDO FIRMINO', cargo: 'OPERADOR DE CAMINHAO BASCULANTE', telefone: '(11) 99111-0033', empresaId: 'emp-1', ativo: true },
  { id: 'fun-34', nome: 'JOSE AUGUSTO CHAGAS ARAUJO', cargo: 'ENGENHEIRO CIVIL', telefone: '(11) 99111-0034', empresaId: 'emp-1', ativo: true },
  { id: 'fun-35', nome: 'JOSE CLAUDIO HONORATO', cargo: 'OPERADOR DE CAMINHAO BASCULANTE', telefone: '(11) 99111-0035', empresaId: 'emp-1', ativo: true },
  { id: 'fun-36', nome: 'JOSE DA SILVA', cargo: 'OPERADOR DE TRATOR ESTEIRA', telefone: '(11) 99111-0036', empresaId: 'emp-1', ativo: true },
  { id: 'fun-37', nome: 'JOSE DA SILVA (2)', cargo: 'OPERADOR DE ESCAVADEIRA', telefone: '(11) 99111-0037', empresaId: 'emp-1', ativo: true },
  { id: 'fun-38', nome: 'JOSE EDUARDO PARO RIBEIRO', cargo: 'GERENTE DE ENGENHARIA', telefone: '(11) 99111-0038', empresaId: 'emp-1', ativo: true },
  { id: 'fun-39', nome: 'JOSE EZIO DOS SANTOS SILVA', cargo: 'OPERADOR DE TRATOR DE ESTEIRAS', telefone: '(11) 99111-0039', empresaId: 'emp-1', ativo: true },
  { id: 'fun-40', nome: 'JOSE FABRICIO DOS SANTOS', cargo: 'OPERADOR DE ESCAVADEIRA', telefone: '(11) 99111-0040', empresaId: 'emp-1', ativo: true },
  { id: 'fun-41', nome: 'JOSE HELDER RODRIGUES RAMOS', cargo: 'OPERADOR DE ESCAVADEIRA', telefone: '(11) 99111-0041', empresaId: 'emp-1', ativo: true },
  { id: 'fun-42', nome: 'JOSE VALTER DA CRUZ SILVA', cargo: 'LIDER DE EQUIPE', telefone: '(11) 99111-0042', empresaId: 'emp-1', ativo: true },
  { id: 'fun-43', nome: 'JOSIVALDO FERREIRA', cargo: 'OPERADOR DE ESCAVADEIRA', telefone: '(11) 99111-0043', empresaId: 'emp-1', ativo: true },
  { id: 'fun-44', nome: 'JULIO CESAR DE ASSIS LUZ', cargo: 'OPERADOR ESCAVADEIRA', telefone: '(11) 99111-0044', empresaId: 'emp-1', ativo: true },
  { id: 'fun-45', nome: 'JULIO CESAR PEREIRA DOS SANTOS SOUZA', cargo: 'OPERADOR DE MAQUINAS E EQUIPAMENTOS', telefone: '(11) 99111-0045', empresaId: 'emp-1', ativo: true },
  { id: 'fun-46', nome: 'LUAN GUILHERME MUNIZ NOGUEIRA', cargo: 'OPERADOR DE RETROESCAVADEIRA', telefone: '(11) 99111-0046', empresaId: 'emp-1', ativo: true },
  { id: 'fun-47', nome: 'MACEDONIO VICENTE DA SILVA', cargo: 'OPERADOR MOTONIVELADORA', telefone: '(11) 99111-0047', empresaId: 'emp-1', ativo: true },
  { id: 'fun-48', nome: 'MANOEL MENDES COUTINHO', cargo: 'OPERADOR DE CAMINHAO BASCULANTE', telefone: '(11) 99111-0048', empresaId: 'emp-1', ativo: true },
  { id: 'fun-49', nome: 'NELSON TADEU DOS SANTOS', cargo: 'OPERADOR DE CAMINHAO BASCULANTE', telefone: '(11) 99111-0049', empresaId: 'emp-1', ativo: true },
  { id: 'fun-50', nome: 'PABLO AUGUSTO NASCIMENTO DE JESUS', cargo: 'APONTADOR', telefone: '(11) 99111-0050', empresaId: 'emp-1', ativo: true },
  { id: 'fun-51', nome: 'PAULO DE TARSO ESTEVES FREIRES', cargo: 'ENCARREGADO DE OBRAS', telefone: '(11) 99111-0051', empresaId: 'emp-1', ativo: true },
  { id: 'fun-52', nome: 'RAFAEL DA CRUZ', cargo: 'OPERADOR DE ROLO COMPACTADOR', telefone: '(11) 99111-0052', empresaId: 'emp-1', ativo: true },
  { id: 'fun-53', nome: 'REGINALDO MARQUES DE AMORIM', cargo: 'OPERADOR DE CAMINHAO BASCULANTE', telefone: '(11) 99111-0053', empresaId: 'emp-1', ativo: true },
  { id: 'fun-54', nome: 'REINALDO DOS SANTOS', cargo: 'OPERADOR DE RETROESCAVADEIRA', telefone: '(11) 99111-0054', empresaId: 'emp-1', ativo: true },
  { id: 'fun-55', nome: 'RENILSON DOS SANTOS', cargo: 'ENCARREGADO GERAL II', telefone: '(11) 99111-0055', empresaId: 'emp-1', ativo: true },
  { id: 'fun-56', nome: 'RICARDO DE BARROS', cargo: 'OPERADOR DE CAMINHAO BASCULANTE', telefone: '(11) 99111-0056', empresaId: 'emp-1', ativo: true },
  { id: 'fun-57', nome: 'ROBERTO ARAUJO AZEVEDO', cargo: 'OPERADOR DE CAMINHAO BASCULANTE', telefone: '(11) 99111-0057', empresaId: 'emp-1', ativo: true },
  { id: 'fun-58', nome: 'RODRIGO BEZERRA DE ARAUJO', cargo: 'APONTADOR', telefone: '(11) 99111-0058', empresaId: 'emp-1', ativo: true },
  { id: 'fun-59', nome: 'RONALDO SOARES DE OLIVEIRA', cargo: 'OPERADOR DE CAMINHAO BASCULANTE', telefone: '(11) 99111-0059', empresaId: 'emp-1', ativo: true },
  { id: 'fun-60', nome: 'SAMUEL PEREIRA DOS SANTOS', cargo: 'OPERADOR DE CAMINHAO BASCULANTE', telefone: '(11) 99111-0060', empresaId: 'emp-1', ativo: true },
  { id: 'fun-61', nome: 'SAMUEL RODRIGUES DE SOUSA', cargo: 'OPERADOR DE RETROESCAVADEIRA', telefone: '(11) 99111-0061', empresaId: 'emp-1', ativo: true },
  { id: 'fun-62', nome: 'TADEU BELLO PEREIRA', cargo: 'APONTADOR', telefone: '(11) 99111-0062', empresaId: 'emp-1', ativo: true },
  { id: 'fun-63', nome: 'THIAGO HENRIQUE OLIVEIRA DE CIQUEIRA', cargo: 'OPERADOR DE RETROESCAVADEIRA', telefone: '(11) 99111-0063', empresaId: 'emp-1', ativo: true },
  { id: 'fun-64', nome: 'VITOR LUIZ MENDES DA SILVA ARAUJO', cargo: 'GREIDISTA', telefone: '(11) 99111-0064', empresaId: 'emp-1', ativo: true },
  { id: 'fun-65', nome: 'WEDLEY PEREIRA DOS SANTOS', cargo: 'OPERADOR DE CAMINHAO BASCULANTE', telefone: '(11) 99111-0065', empresaId: 'emp-1', ativo: true },
  { id: 'fun-66', nome: 'WELINGTON DA SILVA RODRIGUES', cargo: 'OPERADOR DE CAMINHAO BASCULANTE', telefone: '(11) 99111-0066', empresaId: 'emp-1', ativo: true },
  { id: 'fun-67', nome: 'WILLIAN FRANCISCO MARIANO', cargo: 'OPERADOR DE MAQUINAS E EQUIPAMENTOS PESAD', telefone: '(11) 99111-0067', empresaId: 'emp-1', ativo: true }
];

export const INITIAL_COMBOIOS: Comboio[] = [
  { id: 'com-1', nome: 'Comboio TQC022', placa: 'BRA-2200', capacidadeLitros: 10000, responsavel: 'Espedito Bento da Silva' },
  { id: 'com-2', nome: 'Comboio 01 - Renea', placa: 'BRA-9A12', capacidadeLitros: 4000, responsavel: 'José da Silva' },
  { id: 'com-3', nome: 'Comboio 02 - Renea', placa: 'REO-4B90', capacidadeLitros: 6000, responsavel: 'Marcos de Souza' }
];

export const INITIAL_TIPOS_COMBUSTIVEL: TipoCombustivel[] = [
  { id: 'tc-1', nome: 'Óleo Diesel S 10 Comum' },
  { id: 'tc-2', nome: 'Óleo Diesel S 500' },
  { id: 'tc-3', nome: 'Gasolina Comum' },
  { id: 'tc-4', nome: 'Arla 32' },
  { id: 'tc-5', nome: 'Óleo Lubrificante 15W40' }
];

export const INITIAL_PRODUTOS_LUBRIFICACAO: ProdutoLubrificacao[] = [
  { id: 'pl-1', nome: 'Graxa de Lítio NLGI 2' },
  { id: 'pl-2', nome: 'Óleo Hidráulico 68T' },
  { id: 'pl-3', nome: 'Óleo Motor 15W40' },
  { id: 'pl-4', nome: 'Óleo de Transmissão SAE 90W' }
];

export const INITIAL_ETAPAS_SERVICO: EtapaServico[] = [
  { id: 'et-1', nome: 'Terraplenagem / Escavação' },
  { id: 'et-2', nome: 'Drenagem Pluvial profunda' },
  { id: 'et-3', nome: 'Sub-base e Base de bica corrida' },
  { id: 'et-4', nome: 'Pavimentação Asfáltica (CBUQ)' },
  { id: 'et-5', nome: 'Sinalização e Obras de Arte Correntes' }
];

export const INITIAL_ABASTECIMENTOS: Abastecimento[] = [
  // 21/06/2026 logs from the user's spreadsheet image
  { id: 'ab-1', data: '2026-06-21', hora: '07:00', equipamentoId: 'eq-cb765', horimetroInicial: 705, kmInicial: 174980, bombaInicial: 87331, quantidadeLitros: 200, bombaFinal: 87531, tipoCombustivelId: 'tc-1', comboioId: 'com-1', responsavel: 'Espedito Bento da Silva', observacao: 'Conferência OK' },
  { id: 'ab-2', data: '2026-06-21', hora: '07:20', equipamentoId: 'eq-cb754', horimetroInicial: 14811, kmInicial: 737545, bombaInicial: 87531, quantidadeLitros: 98, bombaFinal: 87629, tipoCombustivelId: 'tc-1', comboioId: 'com-1', responsavel: 'Espedito Bento da Silva', observacao: 'Conferência OK' },
  { id: 'ab-3', data: '2026-06-21', hora: '07:30', equipamentoId: 'eq-cb789', horimetroInicial: 12824, kmInicial: 165714, bombaInicial: 87629, quantidadeLitros: 70, bombaFinal: 87699, tipoCombustivelId: 'tc-1', comboioId: 'com-1', responsavel: 'Espedito Bento da Silva', observacao: 'Conferência OK' },
  { id: 'ab-4', data: '2026-06-21', hora: '07:40', equipamentoId: 'eq-cb775', horimetroInicial: 12443, kmInicial: 180568, bombaInicial: 87699, quantidadeLitros: 170, bombaFinal: 87869, tipoCombustivelId: 'tc-1', comboioId: 'com-1', responsavel: 'Espedito Bento da Silva', observacao: 'Conferência OK' },
  { id: 'ab-5', data: '2026-06-21', hora: '07:50', equipamentoId: 'eq-cb786', horimetroInicial: 13559, kmInicial: 195678, bombaInicial: 87869, quantidadeLitros: 43, bombaFinal: 87912, tipoCombustivelId: 'tc-1', comboioId: 'com-1', responsavel: 'Espedito Bento da Silva', observacao: 'Conferência OK' },
  { id: 'ab-6', data: '2026-06-21', hora: '08:00', equipamentoId: 'eq-cb755', horimetroInicial: 10296, kmInicial: 160626, bombaInicial: 87912, quantidadeLitros: 70, bombaFinal: 87982, tipoCombustivelId: 'tc-1', comboioId: 'com-1', responsavel: 'Espedito Bento da Silva', observacao: 'Conferência OK' },
  { id: 'ab-7', data: '2026-06-21', hora: '08:20', equipamentoId: 'eq-cb770', horimetroInicial: 1431, kmInicial: 22033, bombaInicial: 87982, quantidadeLitros: 40, bombaFinal: 88022, tipoCombustivelId: 'tc-1', comboioId: 'com-1', responsavel: 'Espedito Bento da Silva', observacao: 'Conferência OK' },
  { id: 'ab-8', data: '2026-06-21', hora: '08:30', equipamentoId: 'eq-cb730', horimetroInicial: 915, kmInicial: 224841, bombaInicial: 88022, quantidadeLitros: 75, bombaFinal: 88097, tipoCombustivelId: 'tc-1', comboioId: 'com-1', responsavel: 'Espedito Bento da Silva', observacao: 'Conferência OK' },
  { id: 'ab-9', data: '2026-06-21', hora: '08:40', equipamentoId: 'eq-cb804', horimetroInicial: 913, kmInicial: 133860, bombaInicial: 88097, quantidadeLitros: 123, bombaFinal: 88220, tipoCombustivelId: 'tc-1', comboioId: 'com-1', responsavel: 'Espedito Bento da Silva', observacao: 'Conferência OK' },
  { id: 'ab-10', data: '2026-06-21', hora: '08:50', equipamentoId: 'eq-cb776', horimetroInicial: 4844, kmInicial: 265192, bombaInicial: 88220, quantidadeLitros: 50, bombaFinal: 88270, tipoCombustivelId: 'tc-1', comboioId: 'com-1', responsavel: 'Espedito Bento da Silva', observacao: 'Conferência OK' },
  { id: 'ab-11', data: '2026-06-21', hora: '09:00', equipamentoId: 'eq-cb794', horimetroInicial: 1806, kmInicial: 223359, bombaInicial: 88270, quantidadeLitros: 93, bombaFinal: 88363, tipoCombustivelId: 'tc-1', comboioId: 'com-1', responsavel: 'Espedito Bento da Silva', observacao: 'Conferência OK' },
  { id: 'ab-12', data: '2026-06-21', hora: '09:20', equipamentoId: 'eq-cb767', horimetroInicial: 10047, kmInicial: 183636, bombaInicial: 88363, quantidadeLitros: 75, bombaFinal: 88438, tipoCombustivelId: 'tc-1', comboioId: 'com-1', responsavel: 'Espedito Bento da Silva', observacao: 'Conferência OK' },
  { id: 'ab-13', data: '2026-06-21', hora: '09:40', equipamentoId: 'eq-cb735', horimetroInicial: 1613, kmInicial: 201470, bombaInicial: 88438, quantidadeLitros: 82, bombaFinal: 88520, tipoCombustivelId: 'tc-1', comboioId: 'com-1', responsavel: 'Espedito Bento da Silva', observacao: 'Conferência OK' },
  { id: 'ab-14', data: '2026-06-21', hora: '10:00', equipamentoId: 'eq-cb790', horimetroInicial: 11672, kmInicial: 226948, bombaInicial: 88520, quantidadeLitros: 39, bombaFinal: 88559, tipoCombustivelId: 'tc-1', comboioId: 'com-1', responsavel: 'Espedito Bento da Silva', observacao: 'Conferência OK' },

  // 22/06/2026 logs
  { id: 'ab-15', data: '2026-06-22', hora: '06:00', equipamentoId: 'eq-cb748', horimetroInicial: 9650, kmInicial: 130905, bombaInicial: 88559, quantidadeLitros: 81, bombaFinal: 88640, tipoCombustivelId: 'tc-1', comboioId: 'com-1', responsavel: 'Espedito Bento da Silva', observacao: 'Conferência OK' },
  { id: 'ab-16', data: '2026-06-22', hora: '06:10', equipamentoId: 'eq-lo145', horimetroInicial: 1073, kmInicial: 27284, bombaInicial: 88640, quantidadeLitros: 92, bombaFinal: 88732, tipoCombustivelId: 'tc-1', comboioId: 'com-1', responsavel: 'Espedito Bento da Silva', observacao: 'Conferência OK' }
];

export const INITIAL_LUBRIFICACOES: Lubrificacao[] = [
  { id: 'lub-1', data: '2026-06-21', hora: '08:00', equipamentoId: 'eq-ec012', horimetro: 1250, produtoLubrificacaoId: 'pl-1', compartimento: 'Pinos da Lança e Caçamba', quantidade: 2.5, responsavel: 'Espedito Bento da Silva', observacao: 'Engraxamento completo do braço' },
  { id: 'lub-2', data: '2026-06-22', hora: '10:30', equipamentoId: 'eq-cb765', horimetro: 710, produtoLubrificacaoId: 'pl-3', compartimento: 'Cárter do Motor', quantidade: 18, responsavel: 'Espedito Bento da Silva', observacao: 'Troca completa de óleo de motor' }
];

export const INITIAL_RDOS: RdoDiario[] = [
  { 
    id: 'rdo-1', 
    data: '2026-06-21', 
    empresaId: 'emp-1', 
    obraLocalId: 'obr-1', 
    etapaServicoId: 'et-1', 
    servicoExecutado: 'Escavação mecânica em terra firme e transporte de material de bota-fora.', 
    quantidadeEquipe: 35, 
    equipamentosUtilizadosIds: ['eq-cb765', 'eq-cb754', 'eq-cb789'], 
    statusAtividade: 'Andamento', 
    observacao: 'Trabalho rendeu bem. Clima seco favoreceu o andamento da terraplenagem.', 
    pendencias: 'Nenhuma pendência crítica hoje.', 
    proximasEtapas: 'Continuar escavação e iniciar compactação de subleito no trecho norte.' 
  }
];

export const INITIAL_HISTORY_LOGS: HistoryLog[] = [
  { id: 'log-1', timestamp: '2026-06-21 08:30:00', usuario: 'admin', acao: 'Criou', tela: 'Empresas', descricao: 'Cadastrou RENEA INFRAESTRUTURA S.A. como empresa principal.' },
  { id: 'log-2', timestamp: '2026-06-21 09:15:00', usuario: 'admin', acao: 'Criou', tela: 'Equipamentos', descricao: 'Importação inicial da frota de equipamentos ativos Renea.' },
  { id: 'log-3', timestamp: '2026-06-21 18:00:00', usuario: 'admin', acao: 'Criou', tela: 'Funcionários', descricao: 'Importação inicial dos 67 funcionários cadastrados.' }
];

export const INITIAL_PRESENCAS: ListaPresenca[] = [
  {
    id: 'pre-1',
    data: '2026-06-21',
    obraId: 'obr-1',
    responsavel: 'Espedito Bento da Silva',
    funcionarios: [
      { funcionarioId: 'fun-1', presente: true },
      { funcionarioId: 'fun-2', presente: true },
      { funcionarioId: 'fun-3', presente: false, observacao: 'Falta médica' },
      { funcionarioId: 'fun-4', presente: true }
    ],
    observacoes: 'Início dos trabalhos da equipe de pavimentação.'
  },
  {
    id: 'pre-2',
    data: '2026-06-22',
    obraId: 'obr-1',
    responsavel: 'Espedito Bento da Silva',
    funcionarios: [
      { funcionarioId: 'fun-1', presente: true },
      { funcionarioId: 'fun-2', presente: true },
      { funcionarioId: 'fun-3', presente: true },
      { funcionarioId: 'fun-4', presente: true }
    ],
    observacoes: 'Toda a equipe presente no canteiro.'
  }
];

