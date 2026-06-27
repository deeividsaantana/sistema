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
  FileSpreadsheet, 
  Printer, 
  Filter, 
  Search, 
  Calendar, 
  Building2, 
  Truck, 
  MapPin, 
  Fuel, 
  Droplets, 
  ClipboardList, 
  CheckCircle, 
  AlertTriangle 
} from 'lucide-react';

interface RelatoriosTabProps {
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
}

type ReportType = 
  | 'consumo_frota' 
  | 'consumo_empresa' 
  | 'consumo_periodo' 
  | 'lubrificacao_frota' 
  | 'rdo_data' 
  | 'equipamentos_mobilizados' 
  | 'equipamentos_manutencao' 
  | 'resumo_obra';

export default function RelatoriosTab({
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
  rdos
}: RelatoriosTabProps) {

  // Selected report type
  const [reportType, setReportType] = useState<ReportType>('consumo_frota');

  // Filters state
  const [dataInicio, setDataInicio] = useState('2026-06-01');
  const [dataFim, setDataFim] = useState('2026-06-30');
  const [filtroEmpresaId, setFiltroEmpresaId] = useState('');
  const [filtroEquipamentoId, setFiltroEquipamentoId] = useState('');
  const [filtroObraId, setFiltroObraId] = useState('');
  const [filtroCombustivelId, setFiltroCombustivelId] = useState('');
  const [filtroResponsavel, setFiltroResponsavel] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroEtapaId, setFiltroEtapaId] = useState('');

  // Run the report filtering logic
  const getFilteredData = () => {
    switch (reportType) {
      
      case 'consumo_frota': {
        // Group fuel by fleet
        const grouped: { [id: string]: { eq: Equipamento; liters: number; count: number; company: string } } = {};
        
        abastecimentos.forEach(ab => {
          // Date filter check
          if (ab.data < dataInicio || ab.data > dataFim) return;

          // Fuel type filter
          if (filtroCombustivelId && ab.tipoCombustivelId !== filtroCombustivelId) return;

          // Operator filter
          if (filtroResponsavel && !ab.responsavel.toLowerCase().includes(filtroResponsavel.toLowerCase())) return;

          const eq = equipamentos.find(e => e.id === ab.equipamentoId);
          if (!eq) return;

          // Company filter
          if (filtroEmpresaId && eq.empresaId !== filtroEmpresaId) return;

          // Specific equipment filter
          if (filtroEquipamentoId && eq.id !== filtroEquipamentoId) return;

          // Site filter
          if (filtroObraId && eq.localAtualId !== filtroObraId) return;

          const companyName = empresas.find(em => em.id === eq.empresaId)?.nome || 'Outra';

          if (!grouped[eq.id]) {
            grouped[eq.id] = { eq, liters: 0, count: 0, company: companyName };
          }
          grouped[eq.id].liters += ab.quantidadeLitros;
          grouped[eq.id].count += 1;
        });

        return Object.values(grouped).sort((a,b) => b.liters - a.liters);
      }

      case 'consumo_empresa': {
        // Group fuel by company
        const grouped: { [name: string]: { companyName: string; liters: number; vehiclesCount: number; countAbas: number } } = {};

        abastecimentos.forEach(ab => {
          if (ab.data < dataInicio || ab.data > dataFim) return;
          if (filtroCombustivelId && ab.tipoCombustivelId !== filtroCombustivelId) return;

          const eq = equipamentos.find(e => e.id === ab.equipamentoId);
          if (!eq) return;

          if (filtroEmpresaId && eq.empresaId !== filtroEmpresaId) return;
          if (filtroEquipamentoId && eq.id !== filtroEquipamentoId) return;

          const company = empresas.find(em => em.id === eq.empresaId);
          const cName = company ? company.nome : 'Terceirizados';

          if (!grouped[cName]) {
            grouped[cName] = { companyName: cName, liters: 0, vehiclesCount: 0, countAbas: 0 };
          }
          grouped[cName].liters += ab.quantidadeLitros;
          grouped[cName].countAbas += 1;
        });

        return Object.values(grouped).sort((a,b) => b.liters - a.liters);
      }

      case 'consumo_periodo': {
        // Timeline of abastecimentos
        return abastecimentos.filter(ab => {
          if (ab.data < dataInicio || ab.data > dataFim) return false;
          
          if (filtroCombustivelId && ab.tipoCombustivelId !== filtroCombustivelId) return false;
          if (filtroResponsavel && !ab.responsavel.toLowerCase().includes(filtroResponsavel.toLowerCase())) return false;

          const eq = equipamentos.find(e => e.id === ab.equipamentoId);
          if (eq) {
            if (filtroEmpresaId && eq.empresaId !== filtroEmpresaId) return false;
            if (filtroEquipamentoId && eq.id !== filtroEquipamentoId) return false;
            if (filtroObraId && eq.localAtualId !== filtroObraId) return false;
          } else {
            if (filtroEmpresaId || filtroEquipamentoId || filtroObraId) return false;
          }
          return true;
        }).sort((a,b) => b.data.localeCompare(a.data));
      }

      case 'lubrificacao_frota': {
        // Filter lubrication logs
        return lubrificacoes.filter(lub => {
          if (lub.data < dataInicio || lub.data > dataFim) return false;
          if (filtroResponsavel && !lub.responsavel.toLowerCase().includes(filtroResponsavel.toLowerCase())) return false;

          const eq = equipamentos.find(e => e.id === lub.equipamentoId);
          if (eq) {
            if (filtroEmpresaId && eq.empresaId !== filtroEmpresaId) return false;
            if (filtroEquipamentoId && eq.id !== filtroEquipamentoId) return false;
            if (filtroObraId && eq.localAtualId !== filtroObraId) return false;
          } else {
            if (filtroEmpresaId || filtroEquipamentoId || filtroObraId) return false;
          }
          return true;
        }).sort((a,b) => b.data.localeCompare(a.data));
      }

      case 'rdo_data': {
        // Daily Report list
        return rdos.filter(r => {
          if (r.data < dataInicio || r.data > dataFim) return false;
          if (filtroEmpresaId && r.empresaId !== filtroEmpresaId) return false;
          if (filtroObraId && r.obraLocalId !== filtroObraId) return false;
          if (filtroEtapaId && r.etapaServicoId !== filtroEtapaId) return false;
          if (filtroStatus && r.statusAtividade !== filtroStatus) return false;
          return true;
        }).sort((a,b) => b.data.localeCompare(a.data));
      }

      case 'equipamentos_mobilizados': {
        // List active/mobilized heavy machinery
        return equipamentos.filter(eq => {
          if (eq.status !== 'Ativo' && eq.status !== 'Mobilizado') return false;
          if (filtroEmpresaId && eq.empresaId !== filtroEmpresaId) return false;
          if (filtroEquipamentoId && eq.id !== filtroEquipamentoId) return false;
          if (filtroObraId && eq.localAtualId !== filtroObraId) return false;
          return true;
        }).sort((a,b) => a.prefixo.localeCompare(b.prefixo));
      }

      case 'equipamentos_manutencao': {
        // List machinery in maintenance
        return equipamentos.filter(eq => {
          if (eq.status !== 'Manutenção') return false;
          if (filtroEmpresaId && eq.empresaId !== filtroEmpresaId) return false;
          if (filtroEquipamentoId && eq.id !== filtroEquipamentoId) return false;
          if (filtroObraId && eq.localAtualId !== filtroObraId) return false;
          return true;
        }).sort((a,b) => a.prefixo.localeCompare(b.prefixo));
      }

      case 'resumo_obra': {
        // RDO summaries by site
        const summary: { [id: string]: { site: ObraLocal; rdoCount: number; averageWorkers: number; doneServices: string[] } } = {};

        rdos.forEach(r => {
          if (r.data < dataInicio || r.data > dataFim) return;
          if (filtroObraId && r.obraLocalId !== filtroObraId) return;

          const site = obras.find(o => o.id === r.obraLocalId);
          if (!site) return;

          if (!summary[site.id]) {
            summary[site.id] = { site, rdoCount: 0, averageWorkers: 0, doneServices: [] };
          }
          summary[site.id].rdoCount += 1;
          summary[site.id].averageWorkers += r.quantidadeEquipe;
          summary[site.id].doneServices.push(`${r.data.split('-').reverse().join('/')}: ${r.servicoExecutado}`);
        });

        // Compute actual average
        Object.keys(summary).forEach(id => {
          const item = summary[id];
          item.averageWorkers = Math.round(item.averageWorkers / item.rdoCount);
        });

        return Object.values(summary);
      }

      default:
        return [];
    }
  };

  const results = getFilteredData();

  // Excel / CSV Export Builder with perfect Portuguese accents support (BOM)
  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: string[][] = [];
    const filename = `Renea_Relatorio_${reportType}_${dataInicio}_a_${dataFim}.csv`;

    if (reportType === 'consumo_frota') {
      headers = ['Prefixo', 'Equipamento', 'Marca', 'Modelo', 'Proprietário', 'Total Abastecimentos', 'Volume Total (Litros)'];
      rows = (results as any[]).map(r => [
        r.eq.prefixo,
        r.eq.nome,
        r.eq.marca,
        r.eq.modelo,
        r.company,
        r.count.toString(),
        r.liters.toString()
      ]);
    } else if (reportType === 'consumo_empresa') {
      headers = ['Empresa Proprietária', 'Volume Abastecido (Litros)', 'Quantidade Lançamentos'];
      rows = (results as any[]).map(r => [
        r.companyName,
        r.liters.toString(),
        r.countAbas.toString()
      ]);
    } else if (reportType === 'consumo_periodo') {
      headers = ['Data', 'Hora', 'Frota', 'Equipamento', 'Proprietário', 'Combustível', 'Volume (L)', 'Bomba Inicial', 'Bomba Final', 'Responsável', 'Obs'];
      rows = (results as any[]).map(r => {
        const eq = equipamentos.find(e => e.id === r.equipamentoId);
        const emp = eq ? empresas.find(em => em.id === eq.empresaId)?.nome : '—';
        const comb = combustiveis.find(t => t.id === r.tipoCombustivelId)?.nome || '—';
        return [
          r.data.split('-').reverse().join('/'),
          r.hora,
          eq ? eq.prefixo : '—',
          eq ? eq.nome : '—',
          emp || '—',
          comb,
          r.quantidadeLitros.toString(),
          r.bombaInicial.toString(),
          r.bombaFinal.toString(),
          r.responsavel,
          r.observacao
        ];
      });
    } else if (reportType === 'lubrificacao_frota') {
      headers = ['Data', 'Hora', 'Frota', 'Equipamento', 'Lubrificante', 'Compartimento', 'Qtd (L/kg)', 'Horímetro', 'Técnico', 'Obs'];
      rows = (results as any[]).map(r => {
        const eq = equipamentos.find(e => e.id === r.equipamentoId);
        const prod = lubrificantes.find(p => p.id === r.produtoLubrificacaoId)?.nome || '—';
        return [
          r.data.split('-').reverse().join('/'),
          r.hora,
          eq ? eq.prefixo : '—',
          eq ? eq.nome : '—',
          prod,
          r.compartimento,
          r.quantidade.toString(),
          r.horimetro.toString(),
          r.responsavel,
          r.observacao
        ];
      });
    } else if (reportType === 'rdo_data') {
      headers = ['Data', 'Canteiro Obra', 'Empresa Executor', 'Etapa Trabalho', 'Serviço Concluído', 'Equipe Headcount', 'Status da Atividade', 'Pendências'];
      rows = (results as any[]).map(r => {
        const ob = obras.find(o => o.id === r.obraLocalId)?.nome || '—';
        const emp = empresas.find(e => e.id === r.empresaId)?.nome || '—';
        const et = etapas.find(e => e.id === r.etapaServicoId)?.nome || '—';
        return [
          r.data.split('-').reverse().join('/'),
          ob,
          emp,
          et,
          r.servicoExecutado,
          r.quantidadeEquipe.toString(),
          r.statusAtividade,
          r.pendencias || 'Nenhuma'
        ];
      });
    } else if (reportType === 'equipamentos_mobilizados' || reportType === 'equipamentos_manutencao') {
      headers = ['Prefixo', 'Equipamento', 'Marca', 'Modelo', 'Número Placa', 'Proprietário', 'Canteiro Alocado', 'Status Atual'];
      rows = (results as any[]).map(eq => {
        const emp = empresas.find(e => e.id === eq.empresaId)?.nome || '—';
        const site = obras.find(o => o.id === eq.localAtualId)?.nome || '—';
        return [
          eq.prefixo,
          eq.nome,
          eq.marca,
          eq.modelo,
          eq.seriePlaca || '—',
          emp,
          site,
          eq.status
        ];
      });
    } else if (reportType === 'resumo_obra') {
      headers = ['Canteiro de Obra', 'Frentes de Trabalho Lançadas', 'Média de Trabalhadores Ativos', 'Localização / Endereço'];
      rows = (results as any[]).map(r => [
        r.site.nome,
        r.rdoCount.toString(),
        r.averageWorkers.toString(),
        r.site.endereco
      ]);
    }

    // Build perfect standard CSV format
    // Use semicolon separator (preferred by European/South American Excel locales)
    const delimiter = ';';
    const csvContent = [
      headers.join(delimiter),
      ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(delimiter))
    ].join('\n');

    // Add \uFEFF Byte Order Mark (BOM) for perfect Excel UTF-8 import!
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Browser print wrapper
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6" id="relatorios-tab">
      
      {/* Tab Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-850 pb-4 print:hidden">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
            Emissão de Relatórios Customizados
          </h1>
          <p className="text-xs text-slate-400 mt-1">Gere resumos, consumo operacional de combustível por frota, empresa, lubrificações e diários RDO.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            disabled={results.length === 0}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Exportar Excel
          </button>
          <button
            onClick={handlePrint}
            disabled={results.length === 0}
            className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 disabled:opacity-40 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Imprimir PDF
          </button>
        </div>
      </div>

      {/* Grid of Report Types (Left selector in Desktop, full row in Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 print:hidden" id="reports-workspace">
        
        {/* Left Column: Report categories list */}
        <div className="space-y-2 bg-slate-900/60 border border-slate-850/80 p-4 rounded-2xl h-fit">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono block mb-3 pl-1">Selecione o Modelo</span>
          
          {[
            { id: 'consumo_frota', label: 'Consumo por Frota', icon: Truck, desc: 'Ranking de consumo de litros por equipamento.' },
            { id: 'consumo_empresa', label: 'Consumo por Empresa', icon: Building2, desc: 'Divisão de litros abastecidos por empresa.' },
            { id: 'consumo_periodo', label: 'Consumo por Período', icon: Fuel, desc: 'Extrato analítico de todos os abastecimentos.' },
            { id: 'lubrificacao_frota', label: 'Lubrificações da Frota', icon: Droplets, desc: 'Relatório de trocas de óleos e graxas.' },
            { id: 'rdo_data', label: 'RDO Diário por Obra', icon: ClipboardList, desc: 'Extrato das atividades físicas diárias.' },
            { id: 'equipamentos_mobilizados', label: 'Equipamentos Ativos', icon: Truck, desc: 'Frota ativa operando nas frentes de obra.' },
            { id: 'equipamentos_manutencao', label: 'Frota em Manutenção', icon: AlertTriangle, desc: 'Inventário sob custódia da oficina.' },
            { id: 'resumo_obra', label: 'Resumo Geral por Obra', icon: MapPin, desc: 'Consolidado de trabalhadores e frentes.' }
          ].map(r => {
            const active = reportType === r.id;
            const Icon = r.icon;
            return (
              <button
                key={r.id}
                onClick={() => setReportType(r.id as ReportType)}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer block space-y-1 ${active ? 'bg-emerald-600/10 border-emerald-500 text-white' : 'bg-slate-905 border-transparent text-slate-400 hover:bg-slate-950/20 hover:text-slate-200'}`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-4.5 h-4.5 ${active ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span className="text-xs font-bold">{r.label}</span>
                </div>
                <p className="text-[10px] text-slate-500 pl-6 line-clamp-1">{r.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Right 3 Columns: Advanced Filters Panel & Data Table */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Automatic Dynamic Filter bar */}
          <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-black text-slate-400 font-mono flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-emerald-400" />
              Painel de Filtros Inteligentes (Automáticos)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              <div className="space-y-1">
                <label className="text-xxs font-bold uppercase tracking-wider text-slate-500">Data Inicial</label>
                <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500" />
              </div>

              <div className="space-y-1">
                <label className="text-xxs font-bold uppercase tracking-wider text-slate-500">Data Final</label>
                <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500" />
              </div>

              {/* Conditional Empresa filter */}
              <div className="space-y-1">
                <label className="text-xxs font-bold uppercase tracking-wider text-slate-500">Empresa Proprietária / Executora</label>
                <select value={filtroEmpresaId} onChange={e => setFiltroEmpresaId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer">
                  <option value="">Todas</option>
                  {empresas.map(em => (
                    <option key={em.id} value={em.id} className="bg-slate-900 text-slate-200">{em.nome}</option>
                  ))}
                </select>
              </div>

              {/* Conditional site/obra filter */}
              <div className="space-y-1">
                <label className="text-xxs font-bold uppercase tracking-wider text-slate-500">Canteiro de Obra</label>
                <select value={filtroObraId} onChange={e => setFiltroObraId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer">
                  <option value="">Todos</option>
                  {obras.map(ob => (
                    <option key={ob.id} value={ob.id} className="bg-slate-900 text-slate-200">{ob.nome}</option>
                  ))}
                </select>
              </div>

              {/* Conditional fuel filter */}
              {['consumo_frota', 'consumo_empresa', 'consumo_periodo'].includes(reportType) && (
                <div className="space-y-1">
                  <label className="text-xxs font-bold uppercase tracking-wider text-slate-500">Insumo Combustível</label>
                  <select value={filtroCombustivelId} onChange={e => setFiltroCombustivelId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer">
                    <option value="">Todos</option>
                    {combustiveis.map(tc => (
                      <option key={tc.id} value={tc.id} className="bg-slate-900 text-slate-200">{tc.nome}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Conditional operator / technical filter */}
              {['consumo_periodo', 'lubrificacao_frota'].includes(reportType) && (
                <div className="space-y-1">
                  <label className="text-xxs font-bold uppercase tracking-wider text-slate-500">Responsável / Operador</label>
                  <input type="text" placeholder="Pesquise por nome..." value={filtroResponsavel} onChange={e => setFiltroResponsavel(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500" />
                </div>
              )}

              {/* Conditional RDO Work phase filter */}
              {reportType === 'rdo_data' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-500">Fase / Ramo do Serviço</label>
                    <select value={filtroEtapaId} onChange={e => setFiltroEtapaId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer">
                      <option value="">Todas</option>
                      {etapas.map(et => (
                        <option key={et.id} value={et.id} className="bg-slate-900 text-slate-200">{et.nome}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xxs font-bold uppercase tracking-wider text-slate-500">Situação do Serviço</label>
                    <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer">
                      <option value="">Todos</option>
                      <option value="Andamento" className="bg-slate-900 text-slate-200">Andamento</option>
                      <option value="Concluído" className="bg-slate-900 text-slate-200">Concluído</option>
                      <option value="Paralisado Chuva" className="bg-slate-900 text-slate-200">Paralisado Chuva</option>
                      <option value="Paralisado Quebrado" className="bg-slate-900 text-slate-200">Paralisado Quebrado</option>
                    </select>
                  </div>
                </>
              )}

            </div>
          </div>

          {/* Results Visual Viewport Card */}
          <div className="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden p-6 space-y-4" id="report-view-canvas">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block font-mono">RENEA INFRAESTRUTURA</span>
                <h2 className="text-base font-extrabold text-white">
                  {reportType === 'consumo_frota' && `Relatório de Consumo por Frota (${dataInicio.split('-').reverse().join('/')} a ${dataFim.split('-').reverse().join('/')})`}
                  {reportType === 'consumo_empresa' && `Volume Segregado por Empresa Proprietária`}
                  {reportType === 'consumo_periodo' && `Extrato Cronológico Geral de Abastecimentos`}
                  {reportType === 'lubrificacao_frota' && `Intervenções de Lubrificação e Óleos aplicados`}
                  {reportType === 'rdo_data' && `Planilha de RDO - Diários de Obra`}
                  {reportType === 'equipamentos_mobilizados' && `Frota Ativa Mobilizada em Canteiros`}
                  {reportType === 'equipamentos_manutencao' && `Equipamentos Parados em Oficina`}
                  {reportType === 'resumo_obra' && `Resolidado Estatístico de Mão de Obra por Canteiro`}
                </h2>
              </div>
              
              <div className="text-right">
                <span className="text-xxs text-slate-500 font-mono block">EMITIDO EM: {new Date().toLocaleDateString('pt-BR')}</span>
                <span className="text-xs font-black text-white font-mono">{results.length} Registros</span>
              </div>
            </div>

            {/* Results Output Rendering */}
            {results.length === 0 ? (
              <div className="py-16 text-center text-slate-500 italic">
                Nenhum resultado correspondente para os filtros selecionados. Altere o período de datas ou termos para buscar.
              </div>
            ) : (
              <div className="overflow-x-auto">
                
                {reportType === 'consumo_frota' && (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                        <th className="pb-3 px-3">Prefixo</th>
                        <th className="pb-3 px-3">Equipamento</th>
                        <th className="pb-3 px-3">Proprietário</th>
                        <th className="pb-3 px-3 text-center">Nº Abast.</th>
                        <th className="pb-3 px-3 text-right">Volume (Litros)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {(results as any[]).map(r => (
                        <tr key={r.eq.id} className="hover:bg-slate-950/20">
                          <td className="py-3 px-3 font-mono font-black text-emerald-400">{r.eq.prefixo}</td>
                          <td className="py-3 px-3 text-slate-200 font-bold">{r.eq.nome}</td>
                          <td className="py-3 px-3 text-slate-400">{r.company}</td>
                          <td className="py-3 px-3 text-center text-slate-300 font-mono">{r.count}</td>
                          <td className="py-3 px-3 text-right text-white font-mono font-black">{r.liters.toLocaleString('pt-BR')} L</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {reportType === 'consumo_empresa' && (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                        <th className="pb-3 px-3">Empresa Vinculada</th>
                        <th className="pb-3 px-3 text-center">Nº Lançamentos</th>
                        <th className="pb-3 px-3 text-right">Volume Abastecido</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {(results as any[]).map(r => (
                        <tr key={r.companyName} className="hover:bg-slate-950/20">
                          <td className="py-3.5 px-3 font-bold text-slate-200">{r.companyName}</td>
                          <td className="py-3.5 px-3 text-center text-slate-400 font-mono">{r.countAbas}</td>
                          <td className="py-3.5 px-3 text-right text-emerald-400 font-mono font-black text-sm">{r.liters.toLocaleString('pt-BR')} L</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {reportType === 'consumo_periodo' && (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                        <th className="pb-3 px-3">Data/Hora</th>
                        <th className="pb-3 px-3">Frota</th>
                        <th className="pb-3 px-3">Combustível</th>
                        <th className="pb-3 px-3">Bomba Inicial/Final</th>
                        <th className="pb-3 px-3 text-center">Litros</th>
                        <th className="pb-3 px-3">Responsável</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {(results as any[]).map(ab => {
                        const eq = equipamentos.find(e => e.id === ab.equipamentoId);
                        const comb = combustiveis.find(t => t.id === ab.tipoCombustivelId)?.nome || 'Diesel';
                        return (
                          <tr key={ab.id} className="hover:bg-slate-950/20">
                            <td className="py-3 px-3 text-slate-300 font-mono">
                              <span className="font-bold text-slate-100">{ab.data.split('-').reverse().join('/')}</span>
                              <span className="text-[10px] text-slate-500 block">{ab.hora}</span>
                            </td>
                            <td className="py-3 px-3">
                              <span className="font-mono font-black text-emerald-400 mr-1.5">{eq ? eq.prefixo : 'FROTA'}</span>
                              <span className="text-slate-400 truncate max-w-[120px] inline-block align-bottom">{eq ? eq.nome : '—'}</span>
                            </td>
                            <td className="py-3 px-3 text-slate-300 font-semibold">{comb}</td>
                            <td className="py-3 px-3 text-slate-400 font-mono text-[10px]">
                              {ab.bombaInicial.toLocaleString('pt-BR')} → {ab.bombaFinal.toLocaleString('pt-BR')} L
                            </td>
                            <td className="py-3 px-3 text-center text-emerald-400 font-black font-mono">{ab.quantidadeLitros.toLocaleString('pt-BR')} L</td>
                            <td className="py-3 px-3 text-slate-400">{ab.responsavel}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}

                {reportType === 'lubrificacao_frota' && (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                        <th className="pb-3 px-3">Data</th>
                        <th className="pb-3 px-3">Frota</th>
                        <th className="pb-3 px-3">Produto Lubrificante</th>
                        <th className="pb-3 px-3">Compartimento</th>
                        <th className="pb-3 px-3 text-center">Quantidade</th>
                        <th className="pb-3 px-3">Técnico</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {(results as any[]).map(lub => {
                        const eq = equipamentos.find(e => e.id === lub.equipamentoId);
                        const prod = lubrificantes.find(p => p.id === lub.produtoLubrificacaoId)?.nome || '—';
                        return (
                          <tr key={lub.id} className="hover:bg-slate-950/20">
                            <td className="py-3.5 px-3 font-mono text-slate-200">{lub.data.split('-').reverse().join('/')}</td>
                            <td className="py-3.5 px-3">
                              <span className="font-mono font-black text-emerald-400 mr-1.5">{eq ? eq.prefixo : 'FROTA'}</span>
                              <span className="text-slate-400 text-xxs">{eq ? eq.nome : '—'}</span>
                            </td>
                            <td className="py-3.5 px-3 font-bold text-slate-300">{prod}</td>
                            <td className="py-3.5 px-3 text-slate-300">{lub.compartimento}</td>
                            <td className="py-3.5 px-3 text-center text-emerald-400 font-mono font-bold">{lub.quantidade} L/kg</td>
                            <td className="py-3.5 px-3 text-slate-400">{lub.responsavel}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}

                {reportType === 'rdo_data' && (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                        <th className="pb-3 px-3">Data RDO</th>
                        <th className="pb-3 px-3">Canteiro de Obra</th>
                        <th className="pb-3 px-3">Executor</th>
                        <th className="pb-3 px-3">Descrição Atividades</th>
                        <th className="pb-3 px-3 text-center">Efetivo</th>
                        <th className="pb-3 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {(results as any[]).map(r => {
                        const ob = obras.find(o => o.id === r.obraLocalId)?.nome || 'Obra';
                        const emp = empresas.find(e => e.id === r.empresaId)?.nome || 'Executor';
                        return (
                          <tr key={r.id} className="hover:bg-slate-950/20">
                            <td className="py-4 px-3 font-mono font-bold text-slate-100">{r.data.split('-').reverse().join('/')}</td>
                            <td className="py-4 px-3 font-semibold text-slate-200">{ob}</td>
                            <td className="py-4 px-3 text-slate-400 text-xxs">{emp}</td>
                            <td className="py-4 px-3">
                              <p className="text-slate-300 line-clamp-2 max-w-sm">{r.servicoExecutado}</p>
                              {r.pendencias && <span className="text-[9px] text-rose-400 font-bold block mt-1">Pendência: {r.pendencias}</span>}
                            </td>
                            <td className="py-4 px-3 text-center font-mono font-bold text-slate-300">{r.quantidadeEquipe} colab.</td>
                            <td className="py-4 px-3 text-right">
                              <span className="text-xxs px-2 py-0.5 border border-slate-800 rounded bg-slate-950 text-slate-300">
                                {r.statusAtividade}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}

                {(reportType === 'equipamentos_mobilizados' || reportType === 'equipamentos_manutencao') && (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                        <th className="pb-3 px-3">Prefixo</th>
                        <th className="pb-3 px-3">Equipamento</th>
                        <th className="pb-3 px-3">Marca/Modelo</th>
                        <th className="pb-3 px-3">Placa/Série</th>
                        <th className="pb-3 px-3">Canteiro Atual</th>
                        <th className="pb-3 px-3">Proprietário</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {(results as any[]).map(eq => {
                        const emp = empresas.find(e => e.id === eq.empresaId)?.nome || 'Terceirizado';
                        const site = obras.find(o => o.id === eq.localAtualId)?.nome || '—';
                        return (
                          <tr key={eq.id} className="hover:bg-slate-950/20">
                            <td className="py-3.5 px-3 font-mono font-black text-emerald-400">{eq.prefixo}</td>
                            <td className="py-3.5 px-3 font-bold text-slate-200">{eq.nome}</td>
                            <td className="py-3.5 px-3 text-slate-300">{eq.marca} • {eq.modelo}</td>
                            <td className="py-3.5 px-3 text-slate-500 font-mono uppercase text-xxs">{eq.seriePlaca || '—'}</td>
                            <td className="py-3.5 px-3 text-slate-300">{site}</td>
                            <td className="py-3.5 px-3 text-slate-400 truncate max-w-[150px]">{emp}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}

                {reportType === 'resumo_obra' && (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                        <th className="pb-3 px-3">Canteiro de Obra / Local</th>
                        <th className="pb-3 px-3">Endereço</th>
                        <th className="pb-3 px-3 text-center">Frentes de Serviço</th>
                        <th className="pb-3 px-3 text-center">Média de Trabalhadores</th>
                        <th className="pb-3 px-3 text-right">Diários Entregues</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {(results as any[]).map(item => (
                        <tr key={item.site.id} className="hover:bg-slate-950/20">
                          <td className="py-4 px-3 font-bold text-slate-100 text-sm">{item.site.nome}</td>
                          <td className="py-4 px-3 text-slate-400">{item.site.endereco}</td>
                          <td className="py-4 px-3 text-center text-slate-300 font-mono font-bold">{item.rdoCount} frentes</td>
                          <td className="py-4 px-3 text-center text-emerald-400 font-mono font-black">{item.averageWorkers} pessoas</td>
                          <td className="py-4 px-3 text-right text-slate-300 font-mono">{item.rdoCount} RDOs</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
