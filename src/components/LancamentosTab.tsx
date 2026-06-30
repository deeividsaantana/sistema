/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
  RdoDiario 
} from '../types';

import { 
  Fuel, 
  Droplets, 
  ClipboardList, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle, 
  Truck, 
  Users 
} from 'lucide-react';

interface LancamentosTabProps {
  empresas: Empresa[];
  obras: ObraLocal[];
  equipamentos: Equipamento[];
  funcionarios: Funcionario[];
  comboios: Comboio[];
  combustiveis: TipoCombustivel[];
  lubrificantes: ProdutoLubrificacao[];
  etapas: EtapaServico[];

  abastecimentos: Abastecimento[];
  lubrificacoes: Lubrificacao[];
  rdos: RdoDiario[];

  onSaveAbastecimento: (item: Abastecimento, isNew: boolean) => void;
  onDeleteAbastecimento: (id: string) => void;
  onSaveLubrificacao: (item: Lubrificacao, isNew: boolean) => void;
  onDeleteLubrificacao: (id: string) => void;
  onSaveRdo: (item: RdoDiario, isNew: boolean) => void;
  onDeleteRdo: (id: string) => void;
}

type Mode = 'abastecimentos' | 'lubrificacoes' | 'rdos';

export default function LancamentosTab({
  empresas,
  obras,
  equipamentos,
  funcionarios,
  comboios,
  combustiveis,
  lubrificantes,
  etapas,
  abastecimentos,
  lubrificacoes,
  rdos,
  onSaveAbastecimento,
  onDeleteAbastecimento,
  onSaveLubrificacao,
  onDeleteLubrificacao,
  onSaveRdo,
  onDeleteRdo
}: LancamentosTabProps) {

  const [mode, setMode] = useState<Mode>('abastecimentos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState('');

  // 1. Form Temporary States
  // Shared
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('08:00');
  const [equipamentoId, setEquipamentoId] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [observacao, setObservacao] = useState('');

  // Fueling logs specific
  const [horimetroInicial, setHorimetroInicial] = useState<number>(0);
  const [kmInicial, setKmInicial] = useState<number>(0);
  const [bombaInicial, setBombaInicial] = useState<number>(0);
  const [quantidadeLitros, setQuantidadeLitros] = useState<number>(100);
  const [tipoCombustivelId, setTipoCombustivelId] = useState('');
  const [comboioId, setComboioId] = useState('');

  // Lubrication specific
  const [lubHorimetro, setLubHorimetro] = useState<number>(0);
  const [produtoLubrificacaoId, setProdutoLubrificacaoId] = useState('');
  const [compartimento, setCompartimento] = useState('Pinos do Braço / Caçamba');
  const [lubQuantidade, setLubQuantidade] = useState<number>(1);

  // RDO Specific
  const [rdoEmpresaId, setRdoEmpresaId] = useState('');
  const [rdoObraId, setRdoObraId] = useState('');
  const [rdoEtapaId, setRdoEtapaId] = useState('');
  const [servicoExecutado, setServicoExecutado] = useState('');
  const [quantidadeEquipe, setQuantidadeEquipe] = useState<number>(1);
  const [selectedEqIds, setSelectedEqIds] = useState<string[]>([]);
  const [statusAtividade, setStatusAtividade] = useState<RdoDiario['statusAtividade']>('Andamento');
  const [pendencias, setPendencias] = useState('');
  const [proximasEtapas, setProximasEtapas] = useState('');

  // Helper to get derived info
  const selectedEquipment = equipamentos.find(e => e.id === equipamentoId);
  const derivedEquipmentDesc = selectedEquipment ? `${selectedEquipment.marca} ${selectedEquipment.modelo}` : '';
  const derivedCompany = selectedEquipment ? empresas.find(em => em.id === selectedEquipment.empresaId)?.nome : '';

  // Encontra a leitura "Bomba Final" mais recente já registrada para um comboio,
  // ordenando do menor para o maior valor de bomba (a maior leitura = a mais recente).
  // Essa leitura vira automaticamente a "Bomba Inicial" do próximo abastecimento daquele comboio.
  const getUltimaBombaFinal = (comboioIdAlvo: string, excluirId: string | null = null): number => {
    const registrosDoComboio = abastecimentos
      .filter(ab => ab.comboioId === comboioIdAlvo && ab.id !== excluirId)
      .sort((a, b) => a.bombaFinal - b.bombaFinal);

    if (registrosDoComboio.length === 0) return 1000; // valor inicial padrão quando o comboio ainda não tem histórico
    return registrosDoComboio[registrosDoComboio.length - 1].bombaFinal;
  };

  // Reset fields helper
  const resetFormFields = () => {
    setEditingId(null);
    setValidationError('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime(new Date().toTimeString().split(' ')[0].substring(0, 5));
    setEquipamentoId('');
    setResponsavel('');
    setObservacao('');

    setHorimetroInicial(0);
    setKmInicial(0);
    const comboioPadrao = comboios[0]?.id || '';
    setBombaInicial(comboioPadrao ? getUltimaBombaFinal(comboioPadrao) : 1000);
    setQuantidadeLitros(100);
    setTipoCombustivelId(combustiveis[0]?.id || '');
    setComboioId(comboioPadrao);

    setLubHorimetro(0);
    setProdutoLubrificacaoId(lubrificantes[0]?.id || '');
    setCompartimento('Pinos do Braço / Caçamba');
    setLubQuantidade(1);

    setRdoEmpresaId(empresas[0]?.id || '');
    setRdoObraId(obras[0]?.id || '');
    setRdoEtapaId(etapas[0]?.id || '');
    setServicoExecutado('');
    setQuantidadeEquipe(1);
    setSelectedEqIds([]);
    setStatusAtividade('Andamento');
    setPendencias('');
    setProximasEtapas('');
  };

  // Open forms
  const handleOpenCreate = () => {
    resetFormFields();
    if (equipamentos.length > 0) setEquipamentoId(equipamentos[0].id);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    resetFormFields();
    setEditingId(item.id);
    setValidationError('');

    if (mode === 'abastecimentos') {
      const x = item as Abastecimento;
      setDate(x.data); setTime(x.hora); setEquipamentoId(x.equipamentoId);
      setHorimetroInicial(x.horimetroInicial); setKmInicial(x.kmInicial);
      setBombaInicial(x.bombaInicial); setQuantidadeLitros(x.quantidadeLitros);
      setTipoCombustivelId(x.tipoCombustivelId); setComboioId(x.comboioId);
      setResponsavel(x.responsavel); setObservacao(x.observacao);

    } else if (mode === 'lubrificacoes') {
      const x = item as Lubrificacao;
      setDate(x.data); setTime(x.hora); setEquipamentoId(x.equipamentoId);
      setLubHorimetro(x.horimetro); setProdutoLubrificacaoId(x.produtoLubrificacaoId);
      setCompartimento(x.compartimento); setLubQuantidade(x.quantidade);
      setResponsavel(x.responsavel); setObservacao(x.observacao);

    } else if (mode === 'rdos') {
      const x = item as RdoDiario;
      setDate(x.data); setRdoEmpresaId(x.empresaId); setRdoObraId(x.obraLocalId);
      setRdoEtapaId(x.etapaServicoId); setServicoExecutado(x.servicoExecutado);
      setQuantidadeEquipe(x.quantidadeEquipe); setSelectedEqIds(x.equipamentosUtilizadosIds || []);
      setStatusAtividade(x.statusAtividade); setObservacao(x.observacao);
      setPendencias(x.pendencias); setProximasEtapas(x.proximasEtapas);
    }
    setIsFormOpen(true);
  };

  // Quando o usuário troca o comboio no formulário, a Bomba Inicial é recalculada
  // automaticamente com base na última Bomba Final registrada para aquele comboio
  // (apenas em novos lançamentos; ao editar um já existente, o valor original é preservado).
  const handleComboioChange = (novoComboioId: string) => {
    setComboioId(novoComboioId);
    if (editingId === null) {
      setBombaInicial(getUltimaBombaFinal(novoComboioId));
    }
  };

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    const isNew = editingId === null;
    const currentId = isNew ? `txn-${Date.now()}` : editingId!;

    if (mode === 'abastecimentos') {
      if (!equipamentoId || !responsavel.trim() || quantidadeLitros <= 0) {
        setValidationError('Preencha todos os campos obrigatórios (Frota, Litros, Responsável)!');
        return;
      }
      onSaveAbastecimento({
        id: currentId,
        data: date,
        hora: time,
        equipamentoId,
        horimetroInicial: Number(horimetroInicial) || 0,
        kmInicial: Number(kmInicial) || 0,
        bombaInicial: Number(bombaInicial) || 0,
        quantidadeLitros: Number(quantidadeLitros),
        bombaFinal: Number(bombaInicial) + Number(quantidadeLitros),
        tipoCombustivelId: tipoCombustivelId || (combustiveis[0] ? combustiveis[0].id : ''),
        comboioId: comboioId || (comboios[0] ? comboios[0].id : ''),
        responsavel: responsavel.trim(),
        observacao: observacao.trim()
      }, isNew);

    } else if (mode === 'lubrificacoes') {
      if (!equipamentoId || !responsavel.trim() || lubQuantidade <= 0) {
        setValidationError('Preencha todos os campos obrigatórios (Frota, Quantidade, Responsável)!');
        return;
      }
      onSaveLubrificacao({
        id: currentId,
        data: date,
        hora: time,
        equipamentoId,
        horimetro: Number(lubHorimetro) || 0,
        produtoLubrificacaoId: produtoLubrificacaoId || (lubrificantes[0] ? lubrificantes[0].id : ''),
        compartimento: compartimento.trim() || 'Motor',
        quantidade: Number(lubQuantidade),
        responsavel: responsavel.trim(),
        observacao: observacao.trim()
      }, isNew);

    } else if (mode === 'rdos') {
      if (!rdoEmpresaId || !rdoObraId || !servicoExecutado.trim()) {
        setValidationError('Empresa, Canteiro de Obra e Serviço Executado são obrigatórios!');
        return;
      }
      onSaveRdo({
        id: currentId,
        data: date,
        empresaId: rdoEmpresaId,
        obraLocalId: rdoObraId,
        etapaServicoId: rdoEtapaId || (etapas[0] ? etapas[0].id : ''),
        servicoExecutado: servicoExecutado.trim(),
        quantidadeEquipe: Number(quantidadeEquipe) || 1,
        equipamentosUtilizadosIds: selectedEqIds,
        statusAtividade,
        observacao: observacao.trim(),
        pendencias: pendencias.trim(),
        proximasEtapas: proximasEtapas.trim()
      }, isNew);
    }

    setIsFormOpen(false);
    resetFormFields();
  };

  // Safe deletion confirmation toggle
  const handleDeleteTrigger = (id: string) => {
    setDeleteConfirmId(id);
  };

  const executeDeletion = (id: string) => {
    if (mode === 'abastecimentos') onDeleteAbastecimento(id);
    else if (mode === 'lubrificacoes') onDeleteLubrificacao(id);
    else if (mode === 'rdos') onDeleteRdo(id);

    setDeleteConfirmId(null);
  };

  // Checkbox multi-select list for used equipments
  const handleToggleEqSelection = (eqId: string) => {
    if (selectedEqIds.includes(eqId)) {
      setSelectedEqIds(selectedEqIds.filter(id => id !== eqId));
    } else {
      setSelectedEqIds([...selectedEqIds, eqId]);
    }
  };

  // Search filter
  const q = searchQuery.toLowerCase().trim();

  const filteredAbastecimentos = abastecimentos.filter(ab => {
    const eq = equipamentos.find(e => e.id === ab.equipamentoId);
    return ab.data.includes(q) || ab.responsavel.toLowerCase().includes(q) || (eq && eq.prefixo.toLowerCase().includes(q));
  }).sort((a,b) => b.data.localeCompare(a.data));

  const filteredLubrificacoes = lubrificacoes.filter(lub => {
    const eq = equipamentos.find(e => e.id === lub.equipamentoId);
    return lub.data.includes(q) || lub.compartimento.toLowerCase().includes(q) || (eq && eq.prefixo.toLowerCase().includes(q));
  }).sort((a,b) => b.data.localeCompare(a.data));

  const filteredRdos = rdos.filter(r => {
    const ob = obras.find(o => o.id === r.obraLocalId);
    return r.data.includes(q) || r.servicoExecutado.toLowerCase().includes(q) || (ob && ob.nome.toLowerCase().includes(q));
  }).sort((a,b) => b.data.localeCompare(a.data));

  return (
    <div className="space-y-6" id="lancamentos-tab">
      
      {/* Tab Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-850 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-emerald-500" />
            Lançamentos de Campo Diários
          </h1>
          <p className="text-xs text-slate-400 mt-1">Insira abastecimentos rápidos, manutenções de lubrificação e o Relatório Diário de Obra (RDO).</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5" />
          {mode === 'abastecimentos' ? 'Novo Abastecimento' : mode === 'lubrificacoes' ? 'Nova Lubrificação' : 'Criar RDO Diário'}
        </button>
      </div>

      {/* Subtab Selectors */}
      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-850 max-w-md" id="lancamentos-selector">
        <button
          onClick={() => { setMode('abastecimentos'); setIsFormOpen(false); setSearchQuery(''); resetFormFields(); }}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${mode === 'abastecimentos' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-100'}`}
        >
          <Fuel className="w-4 h-4" />
          Abastecimentos
        </button>
        <button
          onClick={() => { setMode('lubrificacoes'); setIsFormOpen(false); setSearchQuery(''); resetFormFields(); }}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${mode === 'lubrificacoes' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-100'}`}
        >
          <Droplets className="w-4 h-4" />
          Lubrificação
        </button>
        <button
          onClick={() => { setMode('rdos'); setIsFormOpen(false); setSearchQuery(''); resetFormFields(); }}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${mode === 'rdos' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-100'}`}
        >
          <ClipboardList className="w-4 h-4" />
          RDO Diário
        </button>
      </div>

      {/* Quick Search */}
      <div className="flex items-center gap-3 bg-slate-900 border border-slate-850 p-3 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 w-4.5 h-4.5 text-slate-600" />
          <input 
            type="text"
            placeholder={mode === 'abastecimentos' ? 'Filtrar por data, responsável ou prefixo de frota...' : mode === 'lubrificacoes' ? 'Filtrar por data, compartimento ou prefixo...' : 'Filtrar por data, obra ou serviço executado...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* Log Form Editor Card */}
      {isFormOpen && (
        <div className="bg-slate-900 border border-emerald-500/30 p-6 rounded-2xl shadow-xl relative" id="log-editor-card">
          <button 
            onClick={() => { setIsFormOpen(false); resetFormFields(); }}
            className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-xs uppercase tracking-widest font-black text-emerald-400 font-mono mb-5 flex items-center gap-2">
            {editingId ? '✏️ Editando Lançamento' : '➕ Novo Lançamento'} • {mode === 'abastecimentos' ? 'Abastecimento de Combustível' : mode === 'lubrificacoes' ? 'Manutenção / Lubrificação de Máquina' : 'Relatório Diário de Obra (RDO)'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* 1. ABASTECIMENTO FORM FIELDS */}
            {mode === 'abastecimentos' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-400">Data de Registro *</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-400">Hora *</label>
                    <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-400">Frota / Equipamento *</label>
                    <select value={equipamentoId} onChange={e => setEquipamentoId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer" required>
                      <option value="">Selecione...</option>
                      {equipamentos.map(eq => (
                        <option key={eq.id} value={eq.id} className="bg-slate-900 text-white">{eq.prefixo} — {eq.nome}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-400">Combustível Utilizado *</label>
                    <select value={tipoCombustivelId} onChange={e => setTipoCombustivelId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer" required>
                      <option value="">Selecione...</option>
                      {combustiveis.map(tc => (
                        <option key={tc.id} value={tc.id} className="bg-slate-900 text-white">{tc.nome}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Derived / Readonly Fields row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/40 p-4.5 rounded-xl border border-slate-850/60">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">Descrição Automática da Frota</span>
                    <span className="text-xs font-bold text-slate-300 block">{derivedEquipmentDesc || 'Aguardando seleção de frota...'}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">Empresa Proprietária Automática</span>
                    <span className="text-xs font-bold text-slate-300 block">{derivedCompany || 'Aguardando seleção de frota...'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="space-y-1">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-400">Horímetro Inicial</label>
                    <input type="number" value={horimetroInicial} onChange={e => setHorimetroInicial(Number(e.target.value))} placeholder="0" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-400">KM Inicial</label>
                    <input type="number" value={kmInicial} onChange={e => setKmInicial(Number(e.target.value))} placeholder="0" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-400">Bomba Inicial (Litros) <span className="text-emerald-500 normal-case font-semibold">— auto (última leitura)</span></label>
                    <input type="number" value={bombaInicial} onChange={e => setBombaInicial(Number(e.target.value))} placeholder="1000" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500" />
                    <span className="text-[9px] text-slate-500 font-mono block">Preenchido com a Bomba Final do último abastecimento deste comboio</span>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-400">Quantidade de Litros *</label>
                    <input type="number" value={quantidadeLitros} onChange={e => setQuantidadeLitros(Number(e.target.value))} placeholder="100" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500" required />
                  </div>

                  {/* Calculated bomba final */}
                  <div className="space-y-1 bg-slate-950/20 px-3.5 py-1.5 border border-slate-800 rounded-xl">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block font-mono">Bomba Final Auto</span>
                    <span className="text-sm font-black text-slate-100 font-mono block mt-1">{(Number(bombaInicial) + Number(quantidadeLitros)).toLocaleString('pt-BR')} L</span>
                    <span className="text-[9px] text-slate-500 font-mono block">Soma automática</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-400">Comboio Abastecedor</label>
                    <select value={comboioId} onChange={e => handleComboioChange(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer">
                      <option value="">Selecione...</option>
                      {comboios.map(com => (
                        <option key={com.id} value={com.id} className="bg-slate-900 text-white">{com.nome}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-400">Responsável pelo Lançamento *</label>
                    <input type="text" value={responsavel} onChange={e => setResponsavel(e.target.value)} placeholder="Ex: José da Silva Costa" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500" required />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-400">Observação</label>
                    <input type="text" value={observacao} onChange={e => setObservacao(e.target.value)} placeholder="Ex: Abastecido no canteiro de obras norte" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500" />
                  </div>
                </div>
              </div>
            )}

            {/* 2. LUBRIFICACAO FORM FIELDS */}
            {mode === 'lubrificacoes' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-400">Data *</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-400">Hora *</label>
                    <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-400">Frota / Equipamento *</label>
                    <select value={equipamentoId} onChange={e => setEquipamentoId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer" required>
                      <option value="">Selecione...</option>
                      {equipamentos.map(eq => (
                        <option key={eq.id} value={eq.id} className="bg-slate-900 text-white">{eq.prefixo} — {eq.nome}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-400">Produto Lubrificante *</label>
                    <select value={produtoLubrificacaoId} onChange={e => setProdutoLubrificacaoId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer" required>
                      <option value="">Selecione...</option>
                      {lubrificantes.map(pl => (
                        <option key={pl.id} value={pl.id} className="bg-slate-900 text-white">{pl.nome}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Derived Equipment / Company Info Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/40 p-4.5 rounded-xl border border-slate-850/60">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">Descrição Automática</span>
                    <span className="text-xs font-bold text-slate-300 block">{derivedEquipmentDesc || 'Aguardando seleção de frota...'}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">Empresa Proprietária</span>
                    <span className="text-xs font-bold text-slate-300 block">{derivedCompany || 'Aguardando seleção de frota...'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-400">Horímetro Atual</label>
                    <input type="number" value={lubHorimetro} onChange={e => setLubHorimetro(Number(e.target.value))} placeholder="0" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-400">Compartimento Aplicado *</label>
                    <input type="text" value={compartimento} onChange={e => setCompartimento(e.target.value)} placeholder="Ex: Cárter Motor, Pinos" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-400">Quantidade Aplicada *</label>
                    <input type="number" step="any" value={lubQuantidade} onChange={e => setLubQuantidade(Number(e.target.value))} placeholder="1" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-400">Responsável Técnico *</label>
                    <input type="text" value={responsavel} onChange={e => setResponsavel(e.target.value)} placeholder="Ex: Marcos de Souza" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500" required />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xxs font-bold uppercase tracking-wider text-slate-400">Observações adicionais</label>
                  <input type="text" value={observacao} onChange={e => setObservacao(e.target.value)} placeholder="Ex: Substituído filtro de óleo na mesma intervenção" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
            )}

            {/* 3. RDO FORM FIELDS */}
            {mode === 'rdos' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-400">Data do RDO *</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-400">Empresa Responsável *</label>
                    <select value={rdoEmpresaId} onChange={e => setRdoEmpresaId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer" required>
                      <option value="">Selecione...</option>
                      {empresas.map(emp => (
                        <option key={emp.id} value={emp.id} className="bg-slate-900 text-white">{emp.nome}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-400">Canteiro de Obra / Local *</label>
                    <select value={rdoObraId} onChange={e => setRdoObraId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer" required>
                      <option value="">Selecione...</option>
                      {obras.map(ob => (
                        <option key={ob.id} value={ob.id} className="bg-slate-900 text-white">{ob.nome}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-400">Ramo / Etapa do Serviço</label>
                    <select value={rdoEtapaId} onChange={e => setRdoEtapaId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer">
                      <option value="">Selecione...</option>
                      {etapas.map(et => (
                        <option key={et.id} value={et.id} className="bg-slate-900 text-white">{et.nome}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-3 space-y-1">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-400">Descrição do Serviço Executado *</label>
                    <textarea value={servicoExecutado} onChange={e => setServicoExecutado(e.target.value)} placeholder="Descreva os trabalhos concluídos hoje, trecho, etc..." rows={3} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none" required />
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xxs font-bold uppercase tracking-wider text-slate-400">Quantidade de Equipe (Pessoas) *</label>
                      <input type="number" value={quantidadeEquipe} onChange={e => setQuantidadeEquipe(Number(e.target.value))} placeholder="1" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" required />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xxs font-bold uppercase tracking-wider text-slate-400">Status da Atividade</label>
                      <select value={statusAtividade} onChange={e => setStatusAtividade(e.target.value as any)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer">
                        <option value="Andamento" className="bg-slate-900 text-white">Andamento</option>
                        <option value="Concluído" className="bg-slate-900 text-white">Concluído</option>
                        <option value="Paralisado Chuva" className="bg-slate-900 text-white">Paralisado Chuva</option>
                        <option value="Paralisado Quebrado" className="bg-slate-900 text-white">Paralisado Quebrado</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Equipments utilized multi-select grid */}
                <div className="space-y-1.5">
                  <label className="text-xxs font-bold uppercase tracking-wider text-slate-400 block">Equipamentos Utilizados hoje (Selecione todos os aplicados):</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 p-3.5 bg-slate-950 border border-slate-800 rounded-xl max-h-40 overflow-y-auto">
                    {equipamentos.length === 0 ? (
                      <span className="text-xxs text-slate-500 italic">Cadastre equipamentos primeiro.</span>
                    ) : (
                      equipamentos.map(eq => {
                        const checked = selectedEqIds.includes(eq.id);
                        return (
                          <label key={eq.id} className={`flex items-center gap-2 p-2 rounded-lg border text-xxs cursor-pointer select-none transition-all ${checked ? 'bg-emerald-600/10 border-emerald-500 text-emerald-400 font-bold' : 'bg-slate-900 border-slate-850 text-slate-400'}`}>
                            <input 
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleToggleEqSelection(eq.id)}
                              className="accent-emerald-500 shrink-0 cursor-pointer rounded"
                            />
                            <span className="font-mono truncate">{eq.prefixo}</span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-400">Observações Gerais</label>
                    <input type="text" value={observacao} onChange={e => setObservacao(e.target.value)} placeholder="Clima, eventos, etc..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-400">Pendências encontradas</label>
                    <input type="text" value={pendencias} onChange={e => setPendencias(e.target.value)} placeholder="Peças, frentes de obra embargadas, etc..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-400">Próximas etapas do planejamento</label>
                    <input type="text" value={proximasEtapas} onChange={e => setProximasEtapas(e.target.value)} placeholder="Próximas frentes de serviço..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500" />
                  </div>
                </div>
              </div>
            )}

            {validationError && (
              <div className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-xl">
                ⚠️ {validationError}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex gap-2.5">
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                {editingId ? 'Salvar Lançamento' : 'Registrar na Obra'}
              </button>
              <button
                type="button"
                onClick={() => { setIsFormOpen(false); resetFormFields(); }}
                className="px-5 py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Cancelar
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Lists of saved transactions */}
      <div className="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden" id="transactions-viewport">
        
        {/* ABASTECIMENTOS TABLE */}
        {mode === 'abastecimentos' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-850 text-slate-400 uppercase text-[10px] font-bold bg-slate-950/20 font-mono">
                  <th className="py-3.5 px-5">Data / Hora</th>
                  <th className="py-3.5 px-5">Frota</th>
                  <th className="py-3.5 px-5">Combustível</th>
                  <th className="py-3.5 px-5">Vol. Abastecido</th>
                  <th className="py-3.5 px-5">Bomba Inicial/Final</th>
                  <th className="py-3.5 px-5">Horímetro / KM</th>
                  <th className="py-3.5 px-5">Comboio / Posto</th>
                  <th className="py-3.5 px-5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredAbastecimentos.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-slate-500 italic">Nenhum abastecimento encontrado.</td>
                  </tr>
                ) : (
                  filteredAbastecimentos.map(ab => {
                    const eq = equipamentos.find(e => e.id === ab.equipamentoId);
                    const comb = combustiveis.find(t => t.id === ab.tipoCombustivelId);
                    const combName = comb ? comb.nome : 'Diesel';
                    const combVeic = comboios.find(c => c.id === ab.comboioId);

                    return (
                      <tr key={ab.id} className="hover:bg-slate-950/20 transition-colors">
                        <td className="py-4 px-5">
                          <span className="font-bold text-slate-100 block">{ab.data.split('-').reverse().join('/')}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{ab.hora}</span>
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-emerald-400 font-bold bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-xxs">
                              {eq ? eq.prefixo : 'FROTA'}
                            </span>
                            <span className="font-semibold text-slate-300 max-w-[130px] truncate block">{eq ? eq.nome : 'Equipamento'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-5 font-semibold text-slate-300">{combName}</td>
                        <td className="py-4 px-5 font-mono text-emerald-400 font-black text-sm">
                          {ab.quantidadeLitros.toLocaleString('pt-BR')} L
                        </td>
                        <td className="py-4 px-5 font-mono text-slate-400 text-xxs">
                          Início: {ab.bombaInicial.toLocaleString('pt-BR')} L<br />
                          Final: {ab.bombaFinal.toLocaleString('pt-BR')} L
                        </td>
                        <td className="py-4 px-5 font-mono text-slate-300 text-xxs">
                          {ab.horimetroInicial > 0 && <span>Horím: {ab.horimetroInicial} h<br /></span>}
                          {ab.kmInicial > 0 && <span>Quilom: {ab.kmInicial} km</span>}
                          {ab.horimetroInicial === 0 && ab.kmInicial === 0 && '—'}
                        </td>
                        <td className="py-4 px-5 text-slate-400">
                          {combVeic ? combVeic.nome : 'Posto Fixo'}
                        </td>
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleOpenEdit(ab)} className="p-1.5 bg-slate-800 text-slate-300 hover:text-emerald-400 rounded-lg cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDeleteTrigger(ab.id)} className="p-1.5 bg-slate-800 text-slate-300 hover:text-rose-400 rounded-lg cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* LUBRIFICACOES TABLE */}
        {mode === 'lubrificacoes' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-850 text-slate-400 uppercase text-[10px] font-bold bg-slate-950/20 font-mono">
                  <th className="py-3.5 px-5">Data / Hora</th>
                  <th className="py-3.5 px-5">Frota</th>
                  <th className="py-3.5 px-5">Produto Lubrificante</th>
                  <th className="py-3.5 px-5">Compartimento</th>
                  <th className="py-3.5 px-5">Quantidade</th>
                  <th className="py-3.5 px-5">Horímetro</th>
                  <th className="py-3.5 px-5">Responsável</th>
                  <th className="py-3.5 px-5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredLubrificacoes.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-slate-500 italic">Nenhum registro de lubrificação encontrado.</td>
                  </tr>
                ) : (
                  filteredLubrificacoes.map(lub => {
                    const eq = equipamentos.find(e => e.id === lub.equipamentoId);
                    const prod = lubrificantes.find(p => p.id === lub.produtoLubrificacaoId);

                    return (
                      <tr key={lub.id} className="hover:bg-slate-950/20 transition-colors">
                        <td className="py-4 px-5">
                          <span className="font-bold text-slate-100 block">{lub.data.split('-').reverse().join('/')}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{lub.hora}</span>
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-emerald-400 font-bold bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-xxs">
                              {eq ? eq.prefixo : 'FROTA'}
                            </span>
                            <span className="font-semibold text-slate-300 max-w-[130px] truncate block">{eq ? eq.nome : 'Equipamento'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-5 font-semibold text-slate-300">{prod ? prod.nome : 'Graxa / Óleo'}</td>
                        <td className="py-4 px-5 text-slate-300">{lub.compartimento}</td>
                        <td className="py-4 px-5 font-mono text-emerald-400 font-black text-sm">{lub.quantidade} L/kg</td>
                        <td className="py-4 px-5 font-mono text-slate-300">{lub.horimetro > 0 ? `${lub.horimetro} h` : '—'}</td>
                        <td className="py-4 px-5 text-slate-400">{lub.responsavel}</td>
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleOpenEdit(lub)} className="p-1.5 bg-slate-800 text-slate-300 hover:text-emerald-400 rounded-lg cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDeleteTrigger(lub.id)} className="p-1.5 bg-slate-800 text-slate-300 hover:text-rose-400 rounded-lg cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* RDOS TABLE */}
        {mode === 'rdos' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-850 text-slate-400 uppercase text-[10px] font-bold bg-slate-950/20 font-mono">
                  <th className="py-3.5 px-5">Data RDO</th>
                  <th className="py-3.5 px-5">Canteiro de Obra</th>
                  <th className="py-3.5 px-5">Empresa</th>
                  <th className="py-3.5 px-5">Serviço Diário Executado</th>
                  <th className="py-3.5 px-5 text-center">Efetivo (Pess.)</th>
                  <th className="py-3.5 px-5">Status Trabalho</th>
                  <th className="py-3.5 px-5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredRdos.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-500 italic">Nenhum RDO encontrado.</td>
                  </tr>
                ) : (
                  filteredRdos.map(rdo => {
                    const ob = obras.find(o => o.id === rdo.obraLocalId);
                    const emp = empresas.find(e => e.id === rdo.empresaId);
                    
                    const statusColor = rdo.statusAtividade === 'Concluído' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : rdo.statusAtividade === 'Andamento' 
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20';

                    return (
                      <tr key={rdo.id} className="hover:bg-slate-950/20 transition-colors">
                        <td className="py-4 px-5">
                          <span className="font-mono font-black text-slate-100 bg-slate-950 border border-slate-850 px-2.5 py-1 rounded-md">
                            {rdo.data.split('-').reverse().join('/')}
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <span className="font-bold text-slate-200 block">{ob ? ob.nome : 'Obra Geral'}</span>
                          <span className="text-[10px] text-slate-500 font-mono uppercase">{ob ? ob.endereco : '—'}</span>
                        </td>
                        <td className="py-4 px-5 text-slate-400 truncate max-w-[120px]" title={emp ? emp.nome : ''}>
                          {emp ? emp.nome : '—'}
                        </td>
                        <td className="py-4 px-5">
                          <p className="text-xs text-slate-300 font-semibold max-w-xs line-clamp-2" title={rdo.servicoExecutado}>
                            {rdo.servicoExecutado}
                          </p>
                          {rdo.pendencias && (
                            <span className="text-[9px] font-bold text-rose-400 block mt-1">⚠️ Pendência: {rdo.pendencias}</span>
                          )}
                        </td>
                        <td className="py-4 px-5 text-center font-mono font-bold text-slate-200">
                          {rdo.quantidadeEquipe} colab.
                        </td>
                        <td className="py-4 px-5">
                          <span className={`px-2.5 py-0.5 border text-[9px] font-bold rounded-full ${statusColor}`}>
                            {rdo.statusAtividade}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleOpenEdit(rdo)} className="p-1.5 bg-slate-800 text-slate-300 hover:text-emerald-400 rounded-lg cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDeleteTrigger(rdo.id)} className="p-1.5 bg-slate-800 text-slate-300 hover:text-rose-400 rounded-lg cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Deletion safe prompt confirm */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-sm bg-slate-900 border border-rose-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-2xl w-fit">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-wider font-black text-white font-mono">⚠️ Confirmar Exclusão de Lançamento?</h3>
              <p className="text-xxs text-slate-400 mt-1 leading-relaxed">
                Você tem certeza que deseja excluir esta movimentação? Isso recalculará os saldos operacionais e consumo na mesma hora.
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => executeDeletion(deleteConfirmId)}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Sim, Excluir
              </button>
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Não, Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
