/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Empresa {
  id: string;
  nome: string;
  cnpj: string;
  telefone: string;
  responsavel: string;
}

export interface ObraLocal {
  id: string;
  nome: string;
  endereco: string;
  responsavel: string;
  status: 'Ativa' | 'Concluída' | 'Planejada';
}

export interface Equipamento {
  id: string;
  prefixo: string; // Prefixo da frota
  nome: string; // Nome/descrição
  tipo: string; // Tipo do equipamento (ex: Escavadeira, Caminhão, etc.)
  marca: string;
  modelo: string;
  seriePlaca: string;
  empresaId: string; // Empresa do equipamento
  status: 'Ativo' | 'Parado' | 'Manutenção' | 'Mobilizado' | 'Desmobilizado' | 'Esperando motorista';
  localAtualId: string; // Obra/local atual
  observacao: string;
  foto?: string; // Imagem do equipamento em base64 (data URL)
  horasDisponiveis?: number; // Horas que o equipamento ficou disponível para operar no período
  horasIndisponiveis?: number; // Horas que o equipamento ficou indisponível (quebrado/manutenção) no período
}

export interface Funcionario {
  id: string;
  nome: string;
  cargo: string;
  telefone: string;
  empresaId: string;
  ativo: boolean;
}

export interface Comboio {
  id: string;
  nome: string; // Nome/Identificação do comboio
  placa: string;
  capacidadeLitros: number;
  responsavel: string;
}

export interface TipoCombustivel {
  id: string;
  nome: string; // ex: Diesel S10, Diesel S500, Gasolina, etc.
}

export interface ProdutoLubrificacao {
  id: string;
  nome: string; // ex: Graxa, 68T, 15W40, etc.
}

export interface EtapaServico {
  id: string;
  nome: string; // ex: Terraplenagem, Drenagem, Pavimentação, etc.
}

export interface Abastecimento {
  id: string;
  data: string; // YYYY-MM-DD
  hora: string; // HH:MM
  equipamentoId: string; // Frota (Equipamento)
  horimetroInicial: number;
  kmInicial: number;
  bombaInicial: number;
  quantidadeLitros: number;
  bombaFinal: number; // Auto: bombaInicial + quantidadeLitros
  tipoCombustivelId: string;
  comboioId: string;
  responsavel: string;
  observacao: string;
}

export interface Lubrificacao {
  id: string;
  data: string; // YYYY-MM-DD
  hora: string; // HH:MM
  equipamentoId: string; // Frota (Equipamento)
  horimetro: number;
  produtoLubrificacaoId: string; // Graxa, 68T, 15W40 ou outro
  compartimento: string; // ex: Motor, Hidráulico, Transmissão
  quantidade: number; // Litros ou kg
  responsavel: string;
  observacao: string;
}

export interface RdoDiario {
  id: string;
  data: string; // YYYY-MM-DD
  empresaId: string;
  obraLocalId: string;
  etapaServicoId: string;
  servicoExecutado: string;
  quantidadeEquipe: number; // Quantidade de equipe (pessoas)
  equipamentosUtilizadosIds: string[]; // Lista de IDs de equipamentos
  statusAtividade: 'Andamento' | 'Concluído' | 'Paralisado Chuva' | 'Paralisado Quebrado';
  observacao: string;
  pendencias: string;
  proximasEtapas: string;
}

export interface HistoryLog {
  id: string;
  timestamp: string; // Data e hora da alteração
  usuario: string; // admin
  acao: 'Criou' | 'Editou' | 'Excluiu';
  tela: string; // ex: Empresas, Abastecimentos, etc.
  descricao: string; // Detalhes legíveis por humanos
}

export interface PresencaItem {
  funcionarioId: string;
  presente: boolean;
  observacao?: string;
}

export interface ListaPresenca {
  id: string;
  data: string; // YYYY-MM-DD
  obraId: string;
  responsavel: string;
  funcionarios: PresencaItem[];
  observacoes?: string;
}

export interface OrdemServico {
  id: string;
  numero: string; // ex: OS-0001 (gerado automaticamente)
  equipamentoId: string;
  tipo: 'Preventiva' | 'Corretiva' | 'Preditiva' | 'Revisão';
  prioridade: 'Baixa' | 'Média' | 'Alta' | 'Urgente';
  descricao: string;
  status: 'Aberta' | 'Em Andamento' | 'Aguardando Peça' | 'Concluída' | 'Cancelada';
  dataAbertura: string; // YYYY-MM-DD
  dataConclusao?: string; // YYYY-MM-DD
  responsavel: string;
  custoEstimado?: number;
  custoFinal?: number;
  observacao: string;
}

export interface AppNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string; // HH:MM
  read: boolean;
  source: 'Netlify App' | 'Sistema Local' | 'Firebase Cloud';
}
