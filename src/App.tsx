/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
} from './types';

import { 
  INITIAL_EMPRESAS, 
  INITIAL_OBRAS, 
  INITIAL_EQUIPAMENTOS, 
  INITIAL_FUNCIONARIOS, 
  INITIAL_COMBOIOS, 
  INITIAL_TIPOS_COMBUSTIVEL, 
  INITIAL_PRODUTOS_LUBRIFICACAO, 
  INITIAL_ETAPAS_SERVICO, 
  INITIAL_ABASTECIMENTOS, 
  INITIAL_LUBRIFICACOES, 
  INITIAL_RDOS,
  INITIAL_HISTORY_LOGS,
  INITIAL_PRESENCAS
} from './utils/initialData';

// Subcomponents Imports
import Dashboard from './components/Dashboard';
import CadastrosTab from './components/CadastrosTab';
import LancamentosTab from './components/LancamentosTab';
import RelatoriosTab from './components/RelatoriosTab';
import ConfiguracoesTab from './components/ConfiguracoesTab';
import ManutencaoTab from './components/ManutencaoTab';

// Motion and Logo Import
import { motion } from 'motion/react';
import reneaLogo from './assets/images/renea_eagle_logo_1782558342785.jpg';

// Firebase Imports
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

// Icons Import
import { 
  LayoutDashboard, 
  ClipboardList, 
  FileText, 
  Settings, 
  HardHat, 
  Database, 
  Menu, 
  X,
  LogIn,
  LogOut,
  FolderPlus,
  ShieldCheck,
  Calendar,
  Users
} from 'lucide-react';

export default function App() {
  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Firebase Sync States
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);
  const [isAutoSyncEnabled, setIsAutoSyncEnabled] = useState<boolean>(false);
  const [lastCloudSync, setLastCloudSync] = useState<string>('');

  // Database States
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [obras, setObras] = useState<ObraLocal[]>([]);
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [comboios, setComboios] = useState<Comboio[]>([]);
  const [combustiveis, setCombustiveis] = useState<TipoCombustivel[]>([]);
  const [lubrificantes, setLubrificantes] = useState<ProdutoLubrificacao[]>([]);
  const [etapas, setEtapas] = useState<EtapaServico[]>([]);
  const [abastecimentos, setAbastecimentos] = useState<Abastecimento[]>([]);
  const [lubrificacoes, setLubrificacoes] = useState<Lubrificacao[]>([]);
  const [rdos, setRdos] = useState<RdoDiario[]>([]);
  const [listasPresenca, setListasPresenca] = useState<ListaPresenca[]>([]);
  const [historyLogs, setHistoryLogs] = useState<HistoryLog[]>([]);

  // Hydrate states from localstorage on mount
  useEffect(() => {
    // Auth persistency check
    const authSaved = localStorage.getItem('renea_is_logged_in');
    if (authSaved === 'true') {
      setIsLoggedIn(true);
    }

    const isDataLoadedV2 = localStorage.getItem('renea_data_loaded_v2') === 'true';

    if (!isDataLoadedV2) {
      localStorage.setItem('renea_empresas', JSON.stringify(INITIAL_EMPRESAS));
      localStorage.setItem('renea_obras', JSON.stringify(INITIAL_OBRAS));
      localStorage.setItem('renea_equipamentos', JSON.stringify(INITIAL_EQUIPAMENTOS));
      localStorage.setItem('renea_funcionarios', JSON.stringify(INITIAL_FUNCIONARIOS));
      localStorage.setItem('renea_comboios', JSON.stringify(INITIAL_COMBOIOS));
      localStorage.setItem('renea_combustiveis', JSON.stringify(INITIAL_TIPOS_COMBUSTIVEL));
      localStorage.setItem('renea_lubrificantes', JSON.stringify(INITIAL_PRODUTOS_LUBRIFICACAO));
      localStorage.setItem('renea_etapas', JSON.stringify(INITIAL_ETAPAS_SERVICO));
      localStorage.setItem('renea_abastecimentos', JSON.stringify(INITIAL_ABASTECIMENTOS));
      localStorage.setItem('renea_lubrificacoes', JSON.stringify(INITIAL_LUBRIFICACOES));
      localStorage.setItem('renea_rdos', JSON.stringify(INITIAL_RDOS));
      localStorage.setItem('renea_listas_presenca', JSON.stringify(INITIAL_PRESENCAS));
      localStorage.setItem('renea_history_logs', JSON.stringify(INITIAL_HISTORY_LOGS));
      localStorage.setItem('renea_data_loaded_v2', 'true');

      setEmpresas(INITIAL_EMPRESAS);
      setObras(INITIAL_OBRAS);
      setEquipamentos(INITIAL_EQUIPAMENTOS);
      setFuncionarios(INITIAL_FUNCIONARIOS);
      setComboios(INITIAL_COMBOIOS);
      setCombustiveis(INITIAL_TIPOS_COMBUSTIVEL);
      setLubrificantes(INITIAL_PRODUTOS_LUBRIFICACAO);
      setEtapas(INITIAL_ETAPAS_SERVICO);
      setAbastecimentos(INITIAL_ABASTECIMENTOS);
      setLubrificacoes(INITIAL_LUBRIFICACOES);
      setRdos(INITIAL_RDOS);
      setListasPresenca(INITIAL_PRESENCAS);
      setHistoryLogs(INITIAL_HISTORY_LOGS);
    } else {
      const savedEmpresas = localStorage.getItem('renea_empresas');
      const savedObras = localStorage.getItem('renea_obras');
      const savedEquipamentos = localStorage.getItem('renea_equipamentos');
      const savedFuncionarios = localStorage.getItem('renea_funcionarios');
      const savedComboios = localStorage.getItem('renea_comboios');
      const savedCombustiveis = localStorage.getItem('renea_combustiveis');
      const savedLubrificantes = localStorage.getItem('renea_lubrificantes');
      const savedEtapas = localStorage.getItem('renea_etapas');
      const savedAbastecimentos = localStorage.getItem('renea_abastecimentos');
      const savedLubrificacoes = localStorage.getItem('renea_lubrificacoes');
      const savedRdos = localStorage.getItem('renea_rdos');
      const savedListasPresenca = localStorage.getItem('renea_listas_presenca');
      const savedHistory = localStorage.getItem('renea_history_logs');

      setEmpresas(savedEmpresas ? JSON.parse(savedEmpresas) : INITIAL_EMPRESAS);
      setObras(savedObras ? JSON.parse(savedObras) : INITIAL_OBRAS);
      setEquipamentos(savedEquipamentos ? JSON.parse(savedEquipamentos) : INITIAL_EQUIPAMENTOS);
      setFuncionarios(savedFuncionarios ? JSON.parse(savedFuncionarios) : INITIAL_FUNCIONARIOS);
      setComboios(savedComboios ? JSON.parse(savedComboios) : INITIAL_COMBOIOS);
      setCombustiveis(savedCombustiveis ? JSON.parse(savedCombustiveis) : INITIAL_TIPOS_COMBUSTIVEL);
      setLubrificantes(savedLubrificantes ? JSON.parse(savedLubrificantes) : INITIAL_PRODUTOS_LUBRIFICACAO);
      setEtapas(savedEtapas ? JSON.parse(savedEtapas) : INITIAL_ETAPAS_SERVICO);
      setAbastecimentos(savedAbastecimentos ? JSON.parse(savedAbastecimentos) : INITIAL_ABASTECIMENTOS);
      setLubrificacoes(savedLubrificacoes ? JSON.parse(savedLubrificacoes) : INITIAL_LUBRIFICACOES);
      setRdos(savedRdos ? JSON.parse(savedRdos) : INITIAL_RDOS);
      setListasPresenca(savedListasPresenca ? JSON.parse(savedListasPresenca) : INITIAL_PRESENCAS);
      setHistoryLogs(savedHistory ? JSON.parse(savedHistory) : INITIAL_HISTORY_LOGS);
    }
  }, []);


  // Check Firebase connection and load sync preferences on mount
  useEffect(() => {
    const autoSyncSaved = localStorage.getItem('renea_auto_sync') === 'true';
    setIsAutoSyncEnabled(autoSyncSaved);
    
    const savedLastSync = localStorage.getItem('renea_last_cloud_sync') || '';
    setLastCloudSync(savedLastSync);

    const checkConnection = async () => {
      try {
        const docRef = doc(db, 'sistemarenea_cloud', 'connection_test');
        await getDoc(docRef);
        setIsFirebaseConnected(true);
      } catch (error) {
        console.warn("Firebase check completed (offline or waiting configuration):", error);
        // If it was just a warning or standard check, try to resolve status
        setIsFirebaseConnected(false);
      }
    };
    checkConnection();
  }, []);

  // Firebase Upload Cloud Sync
  const handleUploadToFirebase = async (
    customEmpresas = empresas,
    customObras = obras,
    customEquipamentos = equipamentos,
    customFuncionarios = funcionarios,
    customComboios = comboios,
    customCombustiveis = combustiveis,
    customLubrificantes = lubrificantes,
    customEtapas = etapas,
    customAbastecimentos = abastecimentos,
    customLubrificacoes = lubrificacoes,
    customRdos = rdos,
    customHistory = historyLogs
  ): Promise<{ success: boolean; message: string }> => {
    const path = 'sistemarenea_cloud/main_data';
    try {
      const data = {
        empresas: customEmpresas,
        obras: customObras,
        equipamentos: customEquipamentos,
        funcionarios: customFuncionarios,
        comboios: customComboios,
        combustiveis: customCombustiveis,
        lubrificantes: customLubrificantes,
        etapas: customEtapas,
        abastecimentos: customAbastecimentos,
        lubrificacoes: customLubrificacoes,
        rdos: customRdos,
        historyLogs: customHistory,
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'sistemarenea_cloud', 'main_data'), data);
      
      const nowStr = new Date().toLocaleString('pt-BR');
      setLastCloudSync(nowStr);
      localStorage.setItem('renea_last_cloud_sync', nowStr);
      setIsFirebaseConnected(true);
      return { success: true, message: 'Os dados foram sincronizados na nuvem Firebase com sucesso!' };
    } catch (error: any) {
      if (error?.message?.includes('permission') || error?.message?.includes('Permission')) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
      return { success: false, message: `Falha ao sincronizar com Firebase: ${error.message || error}` };
    }
  };

  // Firebase Download Cloud Sync
  const handleDownloadFromFirebase = async (): Promise<{ success: boolean; data?: string; message: string }> => {
    const path = 'sistemarenea_cloud/main_data';
    try {
      const docSnap = await getDoc(doc(db, 'sistemarenea_cloud', 'main_data'));
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Update all local states and persist to localStorage
        if (data.empresas) {
          setEmpresas(data.empresas);
          localStorage.setItem('renea_empresas', JSON.stringify(data.empresas));
        }
        if (data.obras) {
          setObras(data.obras);
          localStorage.setItem('renea_obras', JSON.stringify(data.obras));
        }
        if (data.equipamentos) {
          setEquipamentos(data.equipamentos);
          localStorage.setItem('renea_equipamentos', JSON.stringify(data.equipamentos));
        }
        if (data.funcionarios) {
          setFuncionarios(data.funcionarios);
          localStorage.setItem('renea_funcionarios', JSON.stringify(data.funcionarios));
        }
        if (data.comboios) {
          setComboios(data.comboios);
          localStorage.setItem('renea_comboios', JSON.stringify(data.comboios));
        }
        if (data.combustiveis) {
          setCombustiveis(data.combustiveis);
          localStorage.setItem('renea_combustiveis', JSON.stringify(data.combustiveis));
        }
        if (data.lubrificantes) {
          setLubrificantes(data.lubrificantes);
          localStorage.setItem('renea_lubrificantes', JSON.stringify(data.lubrificantes));
        }
        if (data.etapas) {
          setEtapas(data.etapas);
          localStorage.setItem('renea_etapas', JSON.stringify(data.etapas));
        }
        if (data.abastecimentos) {
          setAbastecimentos(data.abastecimentos);
          localStorage.setItem('renea_abastecimentos', JSON.stringify(data.abastecimentos));
        }
        if (data.lubrificacoes) {
          setLubrificacoes(data.lubrificacoes);
          localStorage.setItem('renea_lubrificacoes', JSON.stringify(data.lubrificacoes));
        }
        if (data.rdos) {
          setRdos(data.rdos);
          localStorage.setItem('renea_rdos', JSON.stringify(data.rdos));
        }
        if (data.historyLogs) {
          setHistoryLogs(data.historyLogs);
          localStorage.setItem('renea_history_logs', JSON.stringify(data.historyLogs));
        }
        
        const nowStr = new Date().toLocaleString('pt-BR');
        setLastCloudSync(nowStr);
        localStorage.setItem('renea_last_cloud_sync', nowStr);
        setIsFirebaseConnected(true);
        return { success: true, message: 'Dados restaurados do Firebase com sucesso!' };
      } else {
        return { success: false, message: 'Nenhum backup encontrado no Firestore.' };
      }
    } catch (error: any) {
      if (error?.message?.includes('permission') || error?.message?.includes('Permission')) {
        handleFirestoreError(error, OperationType.GET, path);
      }
      return { success: false, message: `Falha ao importar do Firebase: ${error.message || error}` };
    }
  };

  // Helper to save data and append to changes history
  const saveAndLog = (
    tableName: string,
    action: 'Criou' | 'Editou' | 'Excluiu',
    description: string,
    newHistoryList: HistoryLog[],
    stateUpdateFn: () => void
  ) => {
    stateUpdateFn();
    const newLog: HistoryLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleString('pt-BR'),
      usuario: 'admin',
      acao: action,
      tela: tableName,
      descricao: description
    };
    const updatedHistory = [newLog, ...newHistoryList];
    setHistoryLogs(updatedHistory);
    localStorage.setItem('renea_history_logs', JSON.stringify(updatedHistory));

    // Handle background cloud sync if Auto Sync is active
    if (localStorage.getItem('renea_auto_sync') === 'true') {
      setTimeout(() => {
        const getLS = (key: string, def: any) => {
          const val = localStorage.getItem(key);
          return val ? JSON.parse(val) : def;
        };
        handleUploadToFirebase(
          getLS('renea_empresas', INITIAL_EMPRESAS),
          getLS('renea_obras', INITIAL_OBRAS),
          getLS('renea_equipamentos', INITIAL_EQUIPAMENTOS),
          getLS('renea_funcionarios', INITIAL_FUNCIONARIOS),
          getLS('renea_comboios', INITIAL_COMBOIOS),
          getLS('renea_combustiveis', INITIAL_TIPOS_COMBUSTIVEL),
          getLS('renea_lubrificantes', INITIAL_PRODUTOS_LUBRIFICACAO),
          getLS('renea_etapas', INITIAL_ETAPAS_SERVICO),
          getLS('renea_abastecimentos', INITIAL_ABASTECIMENTOS),
          getLS('renea_lubrificacoes', INITIAL_LUBRIFICACOES),
          getLS('renea_rdos', INITIAL_RDOS),
          updatedHistory
        ).then(res => {
          if (res.success) {
            console.log("Auto-sync completed successfully.");
          }
        });
      }, 100);
    }
  };

  // Auth Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password === 'renea123') {
      setIsLoggedIn(true);
      setLoginError('');
      localStorage.setItem('renea_is_logged_in', 'true');
    } else {
      setLoginError('Usuário ou senha incorretos! Use admin / renea123.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    localStorage.removeItem('renea_is_logged_in');
  };

  // CRUD State Handlers
  const handleSaveEmpresa = (item: Empresa, isNew: boolean) => {
    let updated;
    if (isNew) {
      updated = [...empresas, item];
    } else {
      updated = empresas.map(x => x.id === item.id ? item : x);
    }
    saveAndLog(
      'Empresas', 
      isNew ? 'Criou' : 'Editou', 
      `${isNew ? 'Cadastrou' : 'Editou'} a empresa "${item.nome}" com CNPJ ${item.cnpj}.`,
      historyLogs,
      () => {
        setEmpresas(updated);
        localStorage.setItem('renea_empresas', JSON.stringify(updated));
      }
    );
  };

  const handleDeleteEmpresa = (id: string) => {
    const item = empresas.find(x => x.id === id);
    if (!item) return;
    const updated = empresas.filter(x => x.id !== id);
    saveAndLog(
      'Empresas', 
      'Excluiu', 
      `Excluiu a empresa "${item.nome}".`,
      historyLogs,
      () => {
        setEmpresas(updated);
        localStorage.setItem('renea_empresas', JSON.stringify(updated));
      }
    );
  };

  const handleSaveObra = (item: ObraLocal, isNew: boolean) => {
    let updated;
    if (isNew) {
      updated = [...obras, item];
    } else {
      updated = obras.map(x => x.id === item.id ? item : x);
    }
    saveAndLog(
      'Obras/Locais', 
      isNew ? 'Criou' : 'Editou', 
      `${isNew ? 'Cadastrou' : 'Editou'} a obra "${item.nome}" em ${item.endereco}.`,
      historyLogs,
      () => {
        setObras(updated);
        localStorage.setItem('renea_obras', JSON.stringify(updated));
      }
    );
  };

  const handleDeleteObra = (id: string) => {
    const item = obras.find(x => x.id === id);
    if (!item) return;
    const updated = obras.filter(x => x.id !== id);
    saveAndLog(
      'Obras/Locais', 
      'Excluiu', 
      `Excluiu a obra/local "${item.nome}".`,
      historyLogs,
      () => {
        setObras(updated);
        localStorage.setItem('renea_obras', JSON.stringify(updated));
      }
    );
  };

  const handleSaveEquipamento = (item: Equipamento, isNew: boolean) => {
    let updated;
    if (isNew) {
      updated = [...equipamentos, item];
    } else {
      updated = equipamentos.map(x => x.id === item.id ? item : x);
    }
    saveAndLog(
      'Equipamentos', 
      isNew ? 'Criou' : 'Editou', 
      `${isNew ? 'Cadastrou' : 'Editou'} o equipamento "${item.prefixo} - ${item.nome}" com status "${item.status}".`,
      historyLogs,
      () => {
        setEquipamentos(updated);
        localStorage.setItem('renea_equipamentos', JSON.stringify(updated));
      }
    );
  };

  const handleDeleteEquipamento = (id: string) => {
    const item = equipamentos.find(x => x.id === id);
    if (!item) return;
    const updated = equipamentos.filter(x => x.id !== id);
    saveAndLog(
      'Equipamentos', 
      'Excluiu', 
      `Excluiu o equipamento "${item.prefixo} - ${item.nome}".`,
      historyLogs,
      () => {
        setEquipamentos(updated);
        localStorage.setItem('renea_equipamentos', JSON.stringify(updated));
      }
    );
  };

  const handleSaveFuncionario = (item: Funcionario, isNew: boolean) => {
    let updated;
    if (isNew) {
      updated = [...funcionarios, item];
    } else {
      updated = funcionarios.map(x => x.id === item.id ? item : x);
    }
    saveAndLog(
      'Funcionários', 
      isNew ? 'Criou' : 'Editou', 
      `${isNew ? 'Cadastrou' : 'Editou'} o funcionário "${item.nome}" (${item.cargo}).`,
      historyLogs,
      () => {
        setFuncionarios(updated);
        localStorage.setItem('renea_funcionarios', JSON.stringify(updated));
      }
    );
  };

  const handleDeleteFuncionario = (id: string) => {
    const item = funcionarios.find(x => x.id === id);
    if (!item) return;
    const updated = funcionarios.filter(x => x.id !== id);
    saveAndLog(
      'Funcionários', 
      'Excluiu', 
      `Excluiu o funcionário "${item.nome}".`,
      historyLogs,
      () => {
        setFuncionarios(updated);
        localStorage.setItem('renea_funcionarios', JSON.stringify(updated));
      }
    );
  };

  const handleSaveComboio = (item: Comboio, isNew: boolean) => {
    let updated;
    if (isNew) {
      updated = [...comboios, item];
    } else {
      updated = comboios.map(x => x.id === item.id ? item : x);
    }
    saveAndLog(
      'Comboios', 
      isNew ? 'Criou' : 'Editou', 
      `${isNew ? 'Cadastrou' : 'Editou'} o comboio "${item.nome}" com placa ${item.placa}.`,
      historyLogs,
      () => {
        setComboios(updated);
        localStorage.setItem('renea_comboios', JSON.stringify(updated));
      }
    );
  };

  const handleDeleteComboio = (id: string) => {
    const item = comboios.find(x => x.id === id);
    if (!item) return;
    const updated = comboios.filter(x => x.id !== id);
    saveAndLog(
      'Comboios', 
      'Excluiu', 
      `Excluiu o comboio "${item.nome}".`,
      historyLogs,
      () => {
        setComboios(updated);
        localStorage.setItem('renea_comboios', JSON.stringify(updated));
      }
    );
  };

  const handleSaveTipoCombustivel = (item: TipoCombustivel, isNew: boolean) => {
    let updated;
    if (isNew) {
      updated = [...combustiveis, item];
    } else {
      updated = combustiveis.map(x => x.id === item.id ? item : x);
    }
    saveAndLog(
      'Combustíveis', 
      isNew ? 'Criou' : 'Editou', 
      `${isNew ? 'Cadastrou' : 'Editou'} o tipo de combustível "${item.nome}".`,
      historyLogs,
      () => {
        setCombustiveis(updated);
        localStorage.setItem('renea_combustiveis', JSON.stringify(updated));
      }
    );
  };

  const handleDeleteTipoCombustivel = (id: string) => {
    const item = combustiveis.find(x => x.id === id);
    if (!item) return;
    const updated = combustiveis.filter(x => x.id !== id);
    saveAndLog(
      'Combustíveis', 
      'Excluiu', 
      `Excluiu o tipo de combustível "${item.nome}".`,
      historyLogs,
      () => {
        setCombustiveis(updated);
        localStorage.setItem('renea_combustiveis', JSON.stringify(updated));
      }
    );
  };

  const handleSaveProdutoLubrificacao = (item: ProdutoLubrificacao, isNew: boolean) => {
    let updated;
    if (isNew) {
      updated = [...lubrificantes, item];
    } else {
      updated = lubrificantes.map(x => x.id === item.id ? item : x);
    }
    saveAndLog(
      'Produtos Lubrificação', 
      isNew ? 'Criou' : 'Editou', 
      `${isNew ? 'Cadastrou' : 'Editou'} o lubrificante "${item.nome}".`,
      historyLogs,
      () => {
        setLubrificantes(updated);
        localStorage.setItem('renea_lubrificantes', JSON.stringify(updated));
      }
    );
  };

  const handleDeleteProdutoLubrificacao = (id: string) => {
    const item = lubrificantes.find(x => x.id === id);
    if (!item) return;
    const updated = lubrificantes.filter(x => x.id !== id);
    saveAndLog(
      'Produtos Lubrificação', 
      'Excluiu', 
      `Excluiu o lubrificante "${item.nome}".`,
      historyLogs,
      () => {
        setLubrificantes(updated);
        localStorage.setItem('renea_lubrificantes', JSON.stringify(updated));
      }
    );
  };

  const handleSaveEtapaServico = (item: EtapaServico, isNew: boolean) => {
    let updated;
    if (isNew) {
      updated = [...etapas, item];
    } else {
      updated = etapas.map(x => x.id === item.id ? item : x);
    }
    saveAndLog(
      'Etapas de Serviço', 
      isNew ? 'Criou' : 'Editou', 
      `${isNew ? 'Cadastrou' : 'Editou'} a etapa/ramo "${item.nome}".`,
      historyLogs,
      () => {
        setEtapas(updated);
        localStorage.setItem('renea_etapas', JSON.stringify(updated));
      }
    );
  };

  const handleDeleteEtapaServico = (id: string) => {
    const item = etapas.find(x => x.id === id);
    if (!item) return;
    const updated = etapas.filter(x => x.id !== id);
    saveAndLog(
      'Etapas de Serviço', 
      'Excluiu', 
      `Excluiu a etapa/ramo "${item.nome}".`,
      historyLogs,
      () => {
        setEtapas(updated);
        localStorage.setItem('renea_etapas', JSON.stringify(updated));
      }
    );
  };

  // Transaction Handlers
  const handleSaveAbastecimento = (item: Abastecimento, isNew: boolean) => {
    let updated;
    if (isNew) {
      updated = [...abastecimentos, item];
    } else {
      updated = abastecimentos.map(x => x.id === item.id ? item : x);
    }
    const eq = equipamentos.find(e => e.id === item.equipamentoId);
    saveAndLog(
      'Abastecimentos', 
      isNew ? 'Criou' : 'Editou', 
      `${isNew ? 'Lançou' : 'Editou'} abastecimento de ${item.quantidadeLitros}L para ${eq ? eq.prefixo : 'Frota'}.`,
      historyLogs,
      () => {
        setAbastecimentos(updated);
        localStorage.setItem('renea_abastecimentos', JSON.stringify(updated));
      }
    );
  };

  const handleDeleteAbastecimento = (id: string) => {
    const item = abastecimentos.find(x => x.id === id);
    if (!item) return;
    const updated = abastecimentos.filter(x => x.id !== id);
    saveAndLog(
      'Abastecimentos', 
      'Excluiu', 
      `Excluiu lançamento de abastecimento ID ${id.substring(0, 8)}.`,
      historyLogs,
      () => {
        setAbastecimentos(updated);
        localStorage.setItem('renea_abastecimentos', JSON.stringify(updated));
      }
    );
  };

  const handleSaveLubrificacao = (item: Lubrificacao, isNew: boolean) => {
    let updated;
    if (isNew) {
      updated = [...lubrificacoes, item];
    } else {
      updated = lubrificacoes.map(x => x.id === item.id ? item : x);
    }
    const eq = equipamentos.find(e => e.id === item.equipamentoId);
    saveAndLog(
      'Lubrificações', 
      isNew ? 'Criou' : 'Editou', 
      `${isNew ? 'Lançou' : 'Editou'} lubrificação no compartimento "${item.compartimento}" para ${eq ? eq.prefixo : 'Frota'}.`,
      historyLogs,
      () => {
        setLubrificacoes(updated);
        localStorage.setItem('renea_lubrificacoes', JSON.stringify(updated));
      }
    );
  };

  const handleDeleteLubrificacao = (id: string) => {
    const item = lubrificacoes.find(x => x.id === id);
    if (!item) return;
    const updated = lubrificacoes.filter(x => x.id !== id);
    saveAndLog(
      'Lubrificações', 
      'Excluiu', 
      `Excluiu lançamento de lubrificação ID ${id.substring(0, 8)}.`,
      historyLogs,
      () => {
        setLubrificacoes(updated);
        localStorage.setItem('renea_lubrificacoes', JSON.stringify(updated));
      }
    );
  };

  const handleSaveRdo = (item: RdoDiario, isNew: boolean) => {
    let updated;
    if (isNew) {
      updated = [...rdos, item];
    } else {
      updated = rdos.map(x => x.id === item.id ? item : x);
    }
    const ob = obras.find(o => o.id === item.obraLocalId);
    saveAndLog(
      'RDO Diário', 
      isNew ? 'Criou' : 'Editou', 
      `${isNew ? 'Registrou' : 'Editou'} RDO Diário para obra "${ob ? ob.nome : 'Geral'}" no dia ${item.data}.`,
      historyLogs,
      () => {
        setRdos(updated);
        localStorage.setItem('renea_rdos', JSON.stringify(updated));
      }
    );
  };

  const handleDeleteRdo = (id: string) => {
    const item = rdos.find(x => x.id === id);
    if (!item) return;
    const updated = rdos.filter(x => x.id !== id);
    saveAndLog(
      'RDO Diário', 
      'Excluiu', 
      `Excluiu RDO Diário do dia ${item.data}.`,
      historyLogs,
      () => {
        setRdos(updated);
        localStorage.setItem('renea_rdos', JSON.stringify(updated));
      }
    );
  };

  const handleSaveListaPresenca = (item: ListaPresenca, isNew: boolean) => {
    let updated;
    if (isNew) {
      updated = [...listasPresenca, item];
    } else {
      updated = listasPresenca.map(x => x.id === item.id ? item : x);
    }
    const ob = obras.find(o => o.id === item.obraId);
    saveAndLog(
      'Manutenção', 
      isNew ? 'Criou' : 'Editou', 
      `${isNew ? 'Registrou' : 'Editou'} Lista de Presença para obra "${ob ? ob.nome : 'Geral'}" no dia ${item.data}.`,
      historyLogs,
      () => {
        setListasPresenca(updated);
        localStorage.setItem('renea_listas_presenca', JSON.stringify(updated));
      }
    );
  };

  const handleDeleteListaPresenca = (id: string) => {
    const item = listasPresenca.find(x => x.id === id);
    if (!item) return;
    const updated = listasPresenca.filter(x => x.id !== id);
    saveAndLog(
      'Manutenção', 
      'Excluiu', 
      `Excluiu Lista de Presença do dia ${item.data}.`,
      historyLogs,
      () => {
        setListasPresenca(updated);
        localStorage.setItem('renea_listas_presenca', JSON.stringify(updated));
      }
    );
  };


  // Administration helpers
  const handleImportData = (imported: {
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
    listasPresenca?: ListaPresenca[];
    historyLogs?: HistoryLog[];
  }) => {
    setEmpresas(imported.empresas || []);
    setObras(imported.obras || []);
    setEquipamentos(imported.equipamentos || []);
    setFuncionarios(imported.funcionarios || []);
    setComboios(imported.comboios || []);
    setCombustiveis(imported.combustiveis || []);
    setLubrificantes(imported.lubrificantes || []);
    setEtapas(imported.etapas || []);
    setAbastecimentos(imported.abastecimentos || []);
    setLubrificacoes(imported.lubrificacoes || []);
    setRdos(imported.rdos || []);
    setListasPresenca(imported.listasPresenca || []);
    
    const logs = imported.historyLogs || [{
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString('pt-BR'),
      usuario: 'admin',
      acao: 'Editou',
      tela: 'Banco de Dados',
      descricao: 'Restaurou backup completo do sistema com sucesso.'
    }];
    setHistoryLogs(logs);

    localStorage.setItem('renea_empresas', JSON.stringify(imported.empresas || []));
    localStorage.setItem('renea_obras', JSON.stringify(imported.obras || []));
    localStorage.setItem('renea_equipamentos', JSON.stringify(imported.equipamentos || []));
    localStorage.setItem('renea_funcionarios', JSON.stringify(imported.funcionarios || []));
    localStorage.setItem('renea_comboios', JSON.stringify(imported.comboios || []));
    localStorage.setItem('renea_combustiveis', JSON.stringify(imported.combustiveis || []));
    localStorage.setItem('renea_lubrificantes', JSON.stringify(imported.lubrificantes || []));
    localStorage.setItem('renea_etapas', JSON.stringify(imported.etapas || []));
    localStorage.setItem('renea_abastecimentos', JSON.stringify(imported.abastecimentos || []));
    localStorage.setItem('renea_lubrificacoes', JSON.stringify(imported.lubrificacoes || []));
    localStorage.setItem('renea_rdos', JSON.stringify(imported.rdos || []));
    localStorage.setItem('renea_listas_presenca', JSON.stringify(imported.listasPresenca || []));
    localStorage.setItem('renea_history_logs', JSON.stringify(logs));
  };

  const handleResetData = () => {
    setEmpresas(INITIAL_EMPRESAS);
    setObras(INITIAL_OBRAS);
    setEquipamentos(INITIAL_EQUIPAMENTOS);
    setFuncionarios(INITIAL_FUNCIONARIOS);
    setComboios(INITIAL_COMBOIOS);
    setCombustiveis(INITIAL_TIPOS_COMBUSTIVEL);
    setLubrificantes(INITIAL_PRODUTOS_LUBRIFICACAO);
    setEtapas(INITIAL_ETAPAS_SERVICO);
    setAbastecimentos(INITIAL_ABASTECIMENTOS);
    setLubrificacoes(INITIAL_LUBRIFICACOES);
    setRdos(INITIAL_RDOS);
    setListasPresenca(INITIAL_PRESENCAS);
    setHistoryLogs(INITIAL_HISTORY_LOGS);

    localStorage.setItem('renea_empresas', JSON.stringify(INITIAL_EMPRESAS));
    localStorage.setItem('renea_obras', JSON.stringify(INITIAL_OBRAS));
    localStorage.setItem('renea_equipamentos', JSON.stringify(INITIAL_EQUIPAMENTOS));
    localStorage.setItem('renea_funcionarios', JSON.stringify(INITIAL_FUNCIONARIOS));
    localStorage.setItem('renea_comboios', JSON.stringify(INITIAL_COMBOIOS));
    localStorage.setItem('renea_combustiveis', JSON.stringify(INITIAL_TIPOS_COMBUSTIVEL));
    localStorage.setItem('renea_lubrificantes', JSON.stringify(INITIAL_PRODUTOS_LUBRIFICACAO));
    localStorage.setItem('renea_etapas', JSON.stringify(INITIAL_ETAPAS_SERVICO));
    localStorage.setItem('renea_abastecimentos', JSON.stringify(INITIAL_ABASTECIMENTOS));
    localStorage.setItem('renea_lubrificacoes', JSON.stringify(INITIAL_LUBRIFICACOES));
    localStorage.setItem('renea_rdos', JSON.stringify(INITIAL_RDOS));
    localStorage.setItem('renea_listas_presenca', JSON.stringify(INITIAL_PRESENCAS));
    localStorage.setItem('renea_history_logs', JSON.stringify(INITIAL_HISTORY_LOGS));
  };

  const handleClearData = () => {
    setEmpresas([]);
    setObras([]);
    setEquipamentos([]);
    setFuncionarios([]);
    setComboios([]);
    setCombustiveis([]);
    setLubrificantes([]);
    setEtapas([]);
    setAbastecimentos([]);
    setLubrificacoes([]);
    setRdos([]);
    setListasPresenca([]);
    setHistoryLogs([{
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString('pt-BR'),
      usuario: 'admin',
      acao: 'Excluiu',
      tela: 'Banco de Dados',
      descricao: 'Limpou completamente todas as tabelas de dados do sistema.'
    }]);

    localStorage.setItem('renea_empresas', JSON.stringify([]));
    localStorage.setItem('renea_obras', JSON.stringify([]));
    localStorage.setItem('renea_equipamentos', JSON.stringify([]));
    localStorage.setItem('renea_funcionarios', JSON.stringify([]));
    localStorage.setItem('renea_comboios', JSON.stringify([]));
    localStorage.setItem('renea_combustiveis', JSON.stringify([]));
    localStorage.setItem('renea_lubrificantes', JSON.stringify([]));
    localStorage.setItem('renea_etapas', JSON.stringify([]));
    localStorage.setItem('renea_abastecimentos', JSON.stringify([]));
    localStorage.setItem('renea_lubrificacoes', JSON.stringify([]));
    localStorage.setItem('renea_rdos', JSON.stringify([]));
    localStorage.setItem('renea_listas_presenca', JSON.stringify([]));
    localStorage.setItem('renea_history_logs', JSON.stringify([]));
  };

  const handleExportFullData = (): string => {
    return JSON.stringify({
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
      listasPresenca,
      historyLogs
    }, null, 2);
  };


  const handleImportFullData = (importedJson: string): boolean => {
    try {
      const parsed = JSON.parse(importedJson);
      // Basic sanity checks
      if (!parsed || typeof parsed !== 'object') return false;
      if (!Array.isArray(parsed.empresas) || !Array.isArray(parsed.equipamentos) || !Array.isArray(parsed.abastecimentos)) {
        return false;
      }
      handleImportData(parsed);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Login Screen Render
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-slate-100 antialiased font-sans" id="login-viewport">
        <div className="w-full max-w-md bg-slate-900 border border-emerald-500/35 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Decorative glowing green background circles */}
          <div className="absolute -top-16 -left-16 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl"></div>

          {/* Branded Logo and Header */}
          <div className="text-center mb-8 relative">
            <div className="mx-auto w-16 h-16 border border-emerald-400 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg mb-3 bg-slate-950">
              <img 
                src={reneaLogo} 
                alt="RENEA Logo" 
                className="w-full h-full object-cover animate-pulse"
                referrerPolicy="no-referrer"
              />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white uppercase">RENEA</h1>
            <p className="text-xs font-bold text-emerald-400 tracking-wider uppercase">INFRAESTRUTURA</p>
            <p className="text-xs text-slate-400 mt-2">Sistema Integrado de Gestão Operacional</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 relative">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Usuário Padrão</label>
              <input 
                type="text"
                placeholder="ex: admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Senha de Acesso</label>
              <input 
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>

            {loginError && (
              <div className="text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3.5 py-2">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Entrar no Sistema
            </button>
          </form>

          {/* Floating Instructions box for testing */}
          <div className="mt-8 pt-4 border-t border-slate-800/80 text-center">
            <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-950/55 px-3 py-1.5 rounded-full border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dica de Teste: <strong>admin</strong> / <strong>renea123</strong></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in Core App Layout (Responsive Green Theme)
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row text-slate-100 antialiased font-sans" id="app-root">
      
      {/* 1. SIDEBAR NAVIGATION - DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 shrink-0 select-none print:hidden" id="desktop-sidebar">
        {/* Branded Header */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800 bg-slate-950/20">
          <div className="w-9 h-9 border border-emerald-500/30 rounded-xl overflow-hidden flex items-center justify-center bg-slate-950">
            <img 
              src={reneaLogo} 
              alt="RENEA Logo" 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer" 
            />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-white leading-none">RENEA</h1>
            <span className="text-[10px] text-emerald-400 font-extrabold tracking-widest uppercase mt-1 block">INFRAESTRUTURA</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'dashboard' ? 'bg-emerald-600/15 text-emerald-400 border-l-4 border-emerald-500 pl-3' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'}`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            Painel de Controle
          </button>

          <button 
            onClick={() => setActiveTab('cadastros')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'cadastros' ? 'bg-emerald-600/15 text-emerald-400 border-l-4 border-emerald-500 pl-3' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'}`}
          >
            <FolderPlus className="w-4 h-4 shrink-0" />
            Cadastros Auxiliares
          </button>

          <button 
            onClick={() => setActiveTab('lancamentos')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'lancamentos' ? 'bg-emerald-600/15 text-emerald-400 border-l-4 border-emerald-500 pl-3' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'}`}
          >
            <ClipboardList className="w-4 h-4 shrink-0" />
            Lançamentos Diários
          </button>

          <button 
            onClick={() => setActiveTab('manutencao')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'manutencao' ? 'bg-emerald-600/15 text-emerald-400 border-l-4 border-emerald-500 pl-3' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'}`}
          >
            <Users className="w-4 h-4 shrink-0" />
            Manutenção & Presença
          </button>

          <button 
            onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'reports' ? 'bg-emerald-600/15 text-emerald-400 border-l-4 border-emerald-500 pl-3' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'}`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            Relatórios Gerais
          </button>

          <button 
            onClick={() => setActiveTab('configuracoes')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'configuracoes' ? 'bg-emerald-600/15 text-emerald-400 border-l-4 border-emerald-500 pl-3' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'}`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            Apoio & Configuração
          </button>
        </nav>

        {/* Database Status Info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-2 text-[10px] text-slate-500 font-mono">
          <div className="flex items-center justify-between gap-1.5 font-bold mb-1">
            <div className="flex items-center gap-1.5 text-emerald-500">
              <Database className="w-3.5 h-3.5" />
              <span>Banco de Dados Local</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isFirebaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <span className={isFirebaseConnected ? 'text-emerald-400' : 'text-rose-500'}>Firebase</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-y-1 text-slate-400">
            <span>Frota: {equipamentos.length}</span>
            <span>RDOs: {rdos.length}</span>
            <span>Empresas: {empresas.length}</span>
            <span>Obras: {obras.length}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full mt-2 py-1.5 bg-slate-800 hover:bg-rose-950 hover:text-rose-400 border border-slate-700/60 hover:border-rose-900/60 text-slate-400 rounded-lg font-bold text-[9px] flex items-center justify-center gap-1 transition-all cursor-pointer"
          >
            <LogOut className="w-3 h-3" />
            Desconectar Admin
          </button>
        </div>
      </aside>

      {/* 2. MOBILE NAVIGATION HEADER */}
      <header className="md:hidden flex items-center justify-between h-16 bg-slate-900 border-b border-slate-800 px-4 text-white print:hidden shrink-0" id="mobile-header">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 border border-emerald-500/30 rounded-lg overflow-hidden flex items-center justify-center bg-slate-950">
            <img 
              src={reneaLogo} 
              alt="RENEA Logo" 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer" 
            />
          </div>
          <div>
            <h1 className="text-xs font-extrabold text-white">RENEA INFRA</h1>
            <span className="text-[9px] text-emerald-400 font-extrabold block tracking-wider leading-none">GESTOR DE OBRAS</span>
          </div>
        </div>

        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white cursor-pointer"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Drawer Menu overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/85 flex justify-end print:hidden" id="mobile-drawer">
          <div className="w-64 bg-slate-900 border-l border-slate-800 p-5 flex flex-col space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-400 tracking-wider">NAVEGAÇÃO</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 flex flex-col gap-1">
              <button 
                onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'dashboard' ? 'bg-emerald-600/15 text-emerald-400' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <LayoutDashboard className="w-4.5 h-4.5" /> Painel Geral
              </button>

              <button 
                onClick={() => { setActiveTab('cadastros'); setIsMobileMenuOpen(false); }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'cadastros' ? 'bg-emerald-600/15 text-emerald-400' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <FolderPlus className="w-4.5 h-4.5" /> Cadastros Auxiliares
              </button>

              <button 
                onClick={() => { setActiveTab('lancamentos'); setIsMobileMenuOpen(false); }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'lancamentos' ? 'bg-emerald-600/15 text-emerald-400' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <ClipboardList className="w-4.5 h-4.5" /> Lançamentos Diários
              </button>

              <button 
                onClick={() => { setActiveTab('manutencao'); setIsMobileMenuOpen(false); }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'manutencao' ? 'bg-emerald-600/15 text-emerald-400' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <Users className="w-4.5 h-4.5" /> Manutenção & Presença
              </button>

              <button 
                onClick={() => { setActiveTab('reports'); setIsMobileMenuOpen(false); }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'reports' ? 'bg-emerald-600/15 text-emerald-400' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <FileText className="w-4.5 h-4.5" /> Relatórios Gerais
              </button>

              <button 
                onClick={() => { setActiveTab('configuracoes'); setIsMobileMenuOpen(false); }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'configuracoes' ? 'bg-emerald-600/15 text-emerald-400' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <Settings className="w-4.5 h-4.5" /> Apoio & Configurações
              </button>

              <div className="pt-6 mt-4 border-t border-slate-800 flex flex-col gap-2">
                <button
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="w-full py-2 bg-rose-650/10 text-rose-400 hover:bg-rose-650/20 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Desconectar Admin
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* 3. MAIN WORKSPACE CONTAINER */}
      <main className="flex-1 flex flex-col overflow-y-auto" id="main-workspace">
        {/* Subtle upper banner only visible on desktop (hidden when printing) */}
        <div className="hidden md:flex items-center justify-between h-16 bg-slate-950 border-b border-slate-900 px-8 shrink-0 print:hidden select-none">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Renea Operacional • Canteiro de Obras Ativo
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest font-mono">Data do Sistema</p>
              <p className="text-xs font-semibold text-slate-300">
                {new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="h-9 px-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs font-bold text-slate-200">
              <div className="w-5 h-5 bg-emerald-600 rounded-md flex items-center justify-center font-bold text-white text-[10px]">AD</div>
              <span>Administrador</span>
            </div>
          </div>
        </div>

        {/* Dynamic Inner Tab Viewport */}
        <div className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto print:p-0 print:m-0">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full h-full"
          >
            {activeTab === 'dashboard' && (
              <Dashboard 
                empresas={empresas}
                obras={obras}
                equipamentos={equipamentos}
                funcionarios={funcionarios}
                comboios={comboios}
                combustiveis={combustiveis}
                lubrificantes={lubrificantes}
                etapas={etapas}
                abastecimentos={abastecimentos}
                lubrificacoes={lubrificacoes}
                rdos={rdos}
                historyLogs={historyLogs}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'cadastros' && (
              <CadastrosTab 
                empresas={empresas}
                obras={obras}
                equipamentos={equipamentos}
                funcionarios={funcionarios}
                comboios={comboios}
                combustiveis={combustiveis}
                lubrificantes={lubrificantes}
                etapas={etapas}
                onSaveEmpresa={handleSaveEmpresa}
                onDeleteEmpresa={handleDeleteEmpresa}
                onSaveObra={handleSaveObra}
                onDeleteObra={handleDeleteObra}
                onSaveEquipamento={handleSaveEquipamento}
                onDeleteEquipamento={handleDeleteEquipamento}
                onSaveFuncionario={handleSaveFuncionario}
                onDeleteFuncionario={handleDeleteFuncionario}
                onSaveComboio={handleSaveComboio}
                onDeleteComboio={handleDeleteComboio}
                onSaveTipoCombustivel={handleSaveTipoCombustivel}
                onDeleteTipoCombustivel={handleDeleteTipoCombustivel}
                onSaveProdutoLubrificacao={handleSaveProdutoLubrificacao}
                onDeleteProdutoLubrificacao={handleDeleteProdutoLubrificacao}
                onSaveEtapaServico={handleSaveEtapaServico}
                onDeleteEtapaServico={handleDeleteEtapaServico}
              />
            )}

            {activeTab === 'lancamentos' && (
              <LancamentosTab 
                empresas={empresas}
                obras={obras}
                equipamentos={equipamentos}
                funcionarios={funcionarios}
                comboios={comboios}
                combustiveis={combustiveis}
                lubrificantes={lubrificantes}
                etapas={etapas}
                abastecimentos={abastecimentos}
                lubrificacoes={lubrificacoes}
                rdos={rdos}
                onSaveAbastecimento={handleSaveAbastecimento}
                onDeleteAbastecimento={handleDeleteAbastecimento}
                onSaveLubrificacao={handleSaveLubrificacao}
                onDeleteLubrificacao={handleDeleteLubrificacao}
                onSaveRdo={handleSaveRdo}
                onDeleteRdo={handleDeleteRdo}
              />
            )}

            {activeTab === 'manutencao' && (
              <ManutencaoTab 
                funcionarios={funcionarios}
                obras={obras}
                listasPresenca={listasPresenca}
                onSaveListaPresenca={handleSaveListaPresenca}
                onDeleteListaPresenca={handleDeleteListaPresenca}
              />
            )}

            {activeTab === 'reports' && (
              <RelatoriosTab 
                empresas={empresas}
                obras={obras}
                equipamentos={equipamentos}
                funcionarios={funcionarios}
                comboios={comboios}
                combustiveis={combustiveis}
                lubrificantes={lubrificantes}
                etapas={etapas}
                abastecimentos={abastecimentos}
                lubrificacoes={lubrificacoes}
                rdos={rdos}
              />
            )}

            {activeTab === 'configuracoes' && (
              <ConfiguracoesTab 
                historyLogs={historyLogs}
                onResetToDefault={handleResetData}
                onClearAllData={handleClearData}
                onImportFullData={handleImportFullData}
                onExportFullData={handleExportFullData}
                isFirebaseConnected={isFirebaseConnected}
                isAutoSyncEnabled={isAutoSyncEnabled}
                lastCloudSync={lastCloudSync}
                onToggleAutoSync={(val) => {
                  setIsAutoSyncEnabled(val);
                  localStorage.setItem('renea_auto_sync', val ? 'true' : 'false');
                  if (val) {
                    handleUploadToFirebase();
                  }
                }}
                onUploadToFirebase={handleUploadToFirebase}
                onDownloadFromFirebase={handleDownloadFromFirebase}
              />
            )}
          </motion.div>
        </div>
      </main>

    </div>
  );
}
