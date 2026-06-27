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
  HistoryLog
} from '../types';

export const INITIAL_EMPRESAS: Empresa[] = [
  { id: 'emp-1', nome: 'RENEA INFRAESTRUTURA LTDA', cnpj: '12.345.678/0001-90', telefone: '(11) 3214-9900', responsavel: 'Eng. Ricardo Renea' },
  { id: 'emp-2', nome: 'CONSTRUTORA SUL-AMERICANA S/A', cnpj: '98.765.432/0001-10', telefone: '(21) 2500-1122', responsavel: 'Dr. Roberto Souza' },
  { id: 'emp-3', nome: 'TERRA FORTE TERRAPLENAGEM', cnpj: '45.888.222/0001-30', telefone: '(19) 3876-5432', responsavel: 'Sandro Santos' }
];

export const INITIAL_OBRAS: ObraLocal[] = [
  { id: 'obr-1', nome: 'Duplicação BR-101 KM 230', endereco: 'Palhoça - SC', responsavel: 'Eng. Gabriel Neves', status: 'Ativa' },
  { id: 'obr-2', nome: 'Anel Viário Metropolitano', endereco: 'Campinas - SP', responsavel: 'Eng. Aline Lima', status: 'Ativa' },
  { id: 'obr-3', nome: 'Pavimentação Parque Industrial', endereco: 'Joinville - SC', responsavel: 'Mestre Carlos Abreu', status: 'Planejada' },
  { id: 'obr-4', nome: 'Contorno Rodoviário Norte', endereco: 'Curitiba - PR', responsavel: 'Eng. Juliana Ramos', status: 'Concluída' }
];

export const INITIAL_EQUIPAMENTOS: Equipamento[] = [
  { id: 'eq-1', prefixo: 'ESC-01', nome: 'Escavadeira Caterpillar 320D', tipo: 'Escavadeira', marca: 'Caterpillar', modelo: '320D L', seriePlaca: 'CAT320D987', empresaId: 'emp-1', status: 'Ativo', localAtualId: 'obr-1', observacao: 'Em perfeito estado. Operador fixo: Roberto' },
  { id: 'eq-2', prefixo: 'CAM-05', nome: 'Caminhão Caçamba Volvo FMX', tipo: 'Caminhão Caçamba', marca: 'Volvo', modelo: 'FMX 380 6x4', seriePlaca: 'BRA-3E45', empresaId: 'emp-1', status: 'Ativo', localAtualId: 'obr-1', observacao: 'Manutenção preventiva realizada em Maio.' },
  { id: 'eq-3', prefixo: 'TRT-02', nome: 'Trator de Esteira Komatsu D51', tipo: 'Trator de Esteira', marca: 'Komatsu', modelo: 'D51EX-22', seriePlaca: 'KMT51EX102', empresaId: 'emp-2', status: 'Manutenção', localAtualId: 'obr-2', observacao: 'Vazamento no cilindro hidráulico da lâmina.' },
  { id: 'eq-4', prefixo: 'ROD-03', nome: 'Rolo Compactador Dynapac CA250', tipo: 'Rolo Compactador', marca: 'Dynapac', modelo: 'CA250D', seriePlaca: 'DYN250-99', empresaId: 'emp-1', status: 'Parado', localAtualId: 'obr-1', observacao: 'Aguardando frente de serviço liberada.' },
  { id: 'eq-5', prefixo: 'MOT-01', nome: 'Motoniveladora Caterpillar 140K', tipo: 'Motoniveladora', marca: 'Caterpillar', modelo: '140K', seriePlaca: 'CAT140K-029', empresaId: 'emp-1', status: 'Esperando motorista', localAtualId: 'obr-2', observacao: 'Operador de férias até início de Julho.' },
  { id: 'eq-6', prefixo: 'CAM-08', nome: 'Caminhão Caçamba Mercedes Axor', tipo: 'Caminhão Caçamba', marca: 'Mercedes-Benz', modelo: 'Axor 3131 6x4', seriePlaca: 'FLW-5D12', empresaId: 'emp-3', status: 'Mobilizado', localAtualId: 'obr-1', observacao: 'Alugado de subempreiteira.' }
];

export const INITIAL_FUNCIONARIOS: Funcionario[] = [
  { id: 'fun-1', nome: 'Carlos Alberto Silva', cargo: 'Operador de Escavadeira', telefone: '(48) 99123-4567', empresaId: 'emp-1', ativo: true },
  { id: 'fun-2', nome: 'Roberto Ferreira Costa', cargo: 'Motorista de Caçamba', telefone: '(48) 98877-6655', empresaId: 'emp-1', ativo: true },
  { id: 'fun-3', nome: 'Sandro Santos Ramos', cargo: 'Operador de Trator', telefone: '(19) 99201-1029', empresaId: 'emp-2', ativo: true },
  { id: 'fun-4', nome: 'Aline de Oliveira Lima', cargo: 'Encarregada de Obra', telefone: '(19) 98144-5566', empresaId: 'emp-1', ativo: true },
  { id: 'fun-5', nome: 'Marcos de Souza Pontes', cargo: 'Operador de Rolo', telefone: '(48) 99311-2233', empresaId: 'emp-1', ativo: true },
  { id: 'fun-6', nome: 'José da Silva Costa', cargo: 'Motorista de Comboio', telefone: '(11) 98512-3401', empresaId: 'emp-1', ativo: true }
];

export const INITIAL_COMBOIOS: Comboio[] = [
  { id: 'com-1', nome: 'Comboio 01 - Mercedes Benz', placa: 'BRA-9A12', capacidadeLitros: 4000, responsavel: 'José da Silva' },
  { id: 'com-2', nome: 'Comboio 02 - Volkswagen Constellation', placa: 'REO-4B90', capacidadeLitros: 6000, responsavel: 'Marcos de Souza' }
];

export const INITIAL_TIPOS_COMBUSTIVEL: TipoCombustivel[] = [
  { id: 'tc-1', nome: 'Diesel S10' },
  { id: 'tc-2', nome: 'Diesel S500' },
  { id: 'tc-3', nome: 'Gasolina Comum' },
  { id: 'tc-4', nome: 'Arla 32' }
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
  { id: 'ab-1', data: '2026-06-22', hora: '07:30', equipamentoId: 'eq-1', horimetroInicial: 1250, kmInicial: 0, bombaInicial: 10500, quantidadeLitros: 150, bombaFinal: 10650, tipoCombustivelId: 'tc-1', comboioId: 'com-1', responsavel: 'José da Silva', observacao: 'Abastecimento diário início do turno' },
  { id: 'ab-2', data: '2026-06-22', hora: '12:15', equipamentoId: 'eq-2', horimetroInicial: 0, kmInicial: 45200, bombaInicial: 10650, quantidadeLitros: 180, bombaFinal: 10830, tipoCombustivelId: 'tc-1', comboioId: 'com-1', responsavel: 'José da Silva', observacao: 'Preenchido tanque completo.' },
  { id: 'ab-3', data: '2026-06-23', hora: '07:45', equipamentoId: 'eq-1', horimetroInicial: 1258, kmInicial: 0, bombaInicial: 15400, quantidadeLitros: 130, bombaFinal: 15530, tipoCombustivelId: 'tc-1', comboioId: 'com-2', responsavel: 'Marcos de Souza', observacao: 'Abastecido na frente de serviço' },
  { id: 'ab-4', data: '2026-06-24', hora: '08:00', equipamentoId: 'eq-4', horimetroInicial: 540, kmInicial: 0, bombaInicial: 10830, quantidadeLitros: 90, bombaFinal: 10920, tipoCombustivelId: 'tc-2', comboioId: 'com-1', responsavel: 'José da Silva', observacao: 'Rolo compactador Dynapac' },
  { id: 'ab-5', data: '2026-06-25', hora: '17:30', equipamentoId: 'eq-6', horimetroInicial: 0, kmInicial: 12450, bombaInicial: 15530, quantidadeLitros: 210, bombaFinal: 15740, tipoCombustivelId: 'tc-1', comboioId: 'com-2', responsavel: 'Marcos de Souza', observacao: 'Subempreiteiro Terra Forte' },
  { id: 'ab-6', data: '2026-06-26', hora: '07:15', equipamentoId: 'eq-1', horimetroInicial: 1272, kmInicial: 0, bombaInicial: 11200, quantidadeLitros: 160, bombaFinal: 11360, tipoCombustivelId: 'tc-1', comboioId: 'com-1', responsavel: 'José da Silva', observacao: 'Início de frentes BR-101' }
];

export const INITIAL_LUBRIFICACOES: Lubrificacao[] = [
  { id: 'lub-1', data: '2026-06-22', hora: '08:00', equipamentoId: 'eq-1', horimetro: 1250, produtoLubrificacaoId: 'pl-1', compartimento: 'Pinos da Lança e Caçamba', quantidade: 2.5, responsavel: 'José da Silva', observacao: 'Engraxamento completo do braço' },
  { id: 'lub-2', data: '2026-06-23', hora: '10:30', equipamentoId: 'eq-2', horimetro: 0, produtoLubrificacaoId: 'pl-3', compartimento: 'Cárter do Motor', quantidade: 18, responsavel: 'Marcos de Souza', observacao: 'Troca completa de óleo de motor' },
  { id: 'lub-3', data: '2026-06-24', hora: '14:20', equipamentoId: 'eq-3', horimetro: 3200, produtoLubrificacaoId: 'pl-2', compartimento: 'Reservatório Hidráulico', quantidade: 5, responsavel: 'José da Silva', observacao: 'Completado nível baixo' }
];

export const INITIAL_RDOS: RdoDiario[] = [
  { 
    id: 'rdo-1', 
    data: '2026-06-22', 
    empresaId: 'emp-1', 
    obraLocalId: 'obr-1', 
    etapaServicoId: 'et-1', 
    servicoExecutado: 'Escavação mecânica em terra firme e transporte de material de bota-fora na BR-101 KM 230.', 
    quantidadeEquipe: 8, 
    equipamentosUtilizadosIds: ['eq-1', 'eq-2', 'eq-6'], 
    statusAtividade: 'Andamento', 
    observacao: 'Trabalho rendeu bem. Clima seco favoreceu o andamento da terraplenagem.', 
    pendencias: 'Nenhuma pendência crítica hoje.', 
    proximasEtapas: 'Continuar escavação e iniciar compactação de subleito no trecho norte.' 
  },
  { 
    id: 'rdo-2', 
    data: '2026-06-23', 
    empresaId: 'emp-1', 
    obraLocalId: 'obr-1', 
    etapaServicoId: 'et-1', 
    servicoExecutado: 'Escavação e nivelamento de subleito com motoniveladora e caçambas.', 
    quantidadeEquipe: 6, 
    equipamentosUtilizadosIds: ['eq-1', 'eq-2'], 
    statusAtividade: 'Andamento', 
    observacao: 'Produtividade normal. Equipamento TRT-02 Komatsu deu entrada na oficina de tarde por vazamento hidráulico.', 
    pendencias: 'Conserto do Trator de Esteiras Komatsu.', 
    proximasEtapas: 'Liberação de topografia para início do trecho de drenagem pluvial.' 
  },
  { 
    id: 'rdo-3', 
    data: '2026-06-24', 
    empresaId: 'emp-1', 
    obraLocalId: 'obr-1', 
    etapaServicoId: 'et-2', 
    servicoExecutado: 'Assentamento de aduelas de concreto de 1.00m para drenagem transversal no KM 231.', 
    quantidadeEquipe: 12, 
    equipamentosUtilizadosIds: ['eq-1', 'eq-4'], 
    statusAtividade: 'Andamento', 
    observacao: 'Forte chuva à tarde impediu o término da concretagem das cabeças de bueiro.', 
    pendencias: 'Remover lama acumulada na vala.', 
    proximasEtapas: 'Recomposição do pavimento lateral e reaterro das tubulações.' 
  },
  { 
    id: 'rdo-4', 
    data: '2026-06-25', 
    empresaId: 'emp-1', 
    obraLocalId: 'obr-1', 
    etapaServicoId: 'et-2', 
    servicoExecutado: 'Reaterro compactado de bueiro transversal e desobstrução de valetas de escoamento.', 
    quantidadeEquipe: 9, 
    equipamentosUtilizadosIds: ['eq-1', 'eq-2', 'eq-4'], 
    statusAtividade: 'Concluído', 
    observacao: 'Drenagem concluída com sucesso. Teste de fluxo de água ok.', 
    pendencias: 'Retirar fôrmas de madeira das cabeiras.', 
    proximasEtapas: 'Iniciar base de bica corrida para recomposição asfáltica.' 
  }
];

export const INITIAL_HISTORY_LOGS: HistoryLog[] = [
  { id: 'log-1', timestamp: '2026-06-22 08:30:00', usuario: 'admin', acao: 'Criou', tela: 'Empresas', descricao: 'Cadastrou RENEA INFRAESTRUTURA LTDA como empresa principal.' },
  { id: 'log-2', timestamp: '2026-06-22 09:15:00', usuario: 'admin', acao: 'Criou', tela: 'Equipamentos', descricao: 'Cadastrou Escavadeira Caterpillar 320D com prefixo ESC-01.' },
  { id: 'log-3', timestamp: '2026-06-22 18:00:00', usuario: 'admin', acao: 'Criou', tela: 'RDO Diário', descricao: 'Registrou RDO Diário da obra BR-101 para a data 22/06/2026.' }
];
