import React, { useState, useEffect, useRef } from "react";
import { 
  Phone, 
  MessageCircle, 
  CheckCircle, 
  Check, 
  AlertCircle, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  UserPlus, 
  FileText, 
  XCircle, 
  Settings, 
  Trash2, 
  HelpCircle, 
  Send, 
  Info, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  Calculator, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Menu, 
  X,
  MapPin,
  Building,
  User,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Structure representing the 8 major MEI services from the flyer
interface MEIService {
  id: string;
  title: string;
  shortDesc: string;
  detailedDesc: string;
  icon: React.ReactNode;
  whatsappMessage: string;
  documents: string[];
  timeline: string;
  importance: string;
}

export default function App() {
  const [selectedService, setSelectedService] = useState<MEIService | null>(null);
  const [activeTab, setActiveTab] = useState<"simulator" | "limit" | "calendar">("simulator");
  const [menuOpen, setMenuOpen] = useState(false);
  
  // DAS Simulator State
  const [activitySector, setActivitySector] = useState<"comercio" | "servicos" | "misto" | "caminhoneiro">("servicos");
  const [monthsLate, setMonthsLate] = useState<number>(0);
  
  // MEI Limit State
  const [grossIncome, setGrossIncome] = useState<string>("45000");
  
  // AI Chat Assistant State
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "model" | "system"; text: string }>>([
    {
      role: "model",
      text: "Olá! Sou o **Assistente de MEI** da Milene Torres. 🌸\n\nComo posso ajudar você hoje? Você pode tirar dúvidas sobre abertura de MEI, guias DAS atrasadas, imposto de renda, emissão de nota fiscal ou qualquer outro assunto contábil! Se preferir falar diretamente com ela, é só clicar nos botões de WhatsApp pela página."
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Floating Chat Widget and Notification State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatNotificationBadge, setChatNotificationBadge] = useState(true);
  const floatChatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest chat messages across both chat viewports (page & float)
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    floatChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping, isChatOpen]);

  const toggleChatOpen = () => {
    if (!isChatOpen) {
      setChatNotificationBadge(false);
    }
    setIsChatOpen(!isChatOpen);
  };

  const CONTACT_PHONE = "71982807972";
  const CONTACT_FORMATTED = "(71) 98280-7972";
  const WHATSAPP_BASE_URL = `https://wa.me/55${CONTACT_PHONE}`;

  // Helper to open prefilled WhatsApp messages
  const openWhatsApp = (customMessage?: string) => {
    const textComponent = customMessage ? encodeURIComponent(customMessage) : encodeURIComponent("Olá Milene, acessei seu portal e gostaria de suporte especializado para meu MEI.");
    window.open(`${WHATSAPP_BASE_URL}?text=${textComponent}`, "_blank");
  };

  // AI Chat prompt submission hander
  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    if (!textToSend) {
      setInputValue("");
    }

    // Add user message
    const updatedMessages = [...chatMessages, { role: "user" as const, text: query }];
    setChatMessages(updatedMessages);
    setIsTyping(true);

    try {
      // Proxy chat request to our server-side secure Gemini Route
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: updatedMessages.slice(1, -1) // Exclude initial welcome message and current user prompt to save tokens, or include history
        })
      });

      if (!response.ok) {
        throw new Error("Erro na requisição ao assistente.");
      }

      const data = await response.json();
      setChatMessages(prev => [...prev, { role: "model" as const, text: data.text }]);
    } catch (error) {
      console.error(error);
      setChatMessages(prev => [
        ...prev, 
        { 
          role: "model" as const, 
          text: "Desculpe, ocorreu um pequeno problema de conexão. Mas você pode falar diretamente com a contadora Milene Torres pelo WhatsApp agora mesmo clicando no link disponível!" 
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const servicesData: MEIService[] = [
    {
      id: "abertura",
      title: "Abertura de MEI",
      shortDesc: "Abra seu CNPJ com as atividades (CNAEs) corretas e licenciamento configurado.",
      detailedDesc: "Iniciar sua jornada como MEI exige escolher o regime de atividades correto e obter o alvará de funcionamento nos órgãos municipais. Configuramos seu cadastro completo para você já começar de forma 100% legalizada.",
      icon: <UserPlus className="w-6 h-6" />,
      whatsappMessage: "Olá Milene, preciso de suporte para fazer a abertura do meu MEI com segurança.",
      documents: ["RG/CNH digitalizada", "Comprovante de residência", "Título de Eleitor (ou recibo da Declaração de IRPF)", "Acesso à conta Gov.br (Prata ou Ouro)"],
      timeline: "Até 24h úteis",
      importance: "Evita enquadramentos fiscais errados, impostos desnecessários ou recusas de licenciamento no município."
    },
    {
      id: "regularizacao",
      title: "Regularização de Pendências",
      shortDesc: "Evite multas pesadas e dores de cabeça regularizando seu CNPJ MEI.",
      detailedDesc: "Se você possui DAS mensais pendentes ou deixou de entregar declarações anuais anteriores, seu CNPJ pode ser suspenso ou cancelado, e as dívidas transferidas para seu CPF pessoal. Realizo um diagnóstico profundo, emitimos guias consolidadas ou configuramos um parcelamento amigável das suas dívidas.",
      icon: <ShieldCheck className="w-6 h-6" />,
      whatsappMessage: "Olá Milene, meu MEI possui algumas pendências e débitos antigos que preciso regularizar.",
      documents: ["Número do CNPJ", "Código de Acesso do Simples Nacional ou login Gov.br"],
      timeline: "Em até 48h dependendo do volume de guias",
      importance: "Reativa e regulariza seu CNPJ na Receita Federal, limpa o nome no CADIN e garante manutenção dos benefícios."
    },
    {
      id: "emissao_das",
      title: "Emissão de DAS Mensal",
      shortDesc: "Organização e controle para manter as suas contribuições previdenciárias em dia.",
      detailedDesc: "O DAS é a contribuição obrigatória do MEI. Mantê-la em dia garante seus benefícios previdenciários (como aposentadoria, auxílio-doença, salário-maternidade). Suporte para programar, gerar ou recolher guias pendentes do ano corrente.",
      icon: <DollarSign className="w-6 h-6" />,
      whatsappMessage: "Olá Milene, gostaria de sua ajuda para emitir ou programar o pagamento mensal das guias DAS.",
      documents: ["Número do CNPJ"],
      timeline: "Imediato",
      importance: "A falta de pagamento por mais de 12 meses provoca perda iminente da qualidade de segurado do INSS."
    },
    {
      id: "declaracao_anual",
      title: "Declaração Anual (DASN-SIMEI)",
      shortDesc: "Declaração obrigatória exigida por lei. Evite multas de atraso e bloqueios.",
      detailedDesc: "A Declaração de Faturamento (DASN-SIMEI) é uma obrigação anual. É necessário declarar o faturamento acumulado do ano anterior detalhadamente. Caso o faturamento tenha sido R$ 0,00, a entrega continua sendo obrigatória para não inativar o CNPJ.",
      icon: <Calendar className="w-6 h-6" />,
      whatsappMessage: "Olá Milene, preciso de ajuda profissional para preencher e enviar minha Declaração Anual DASN-SIMEI.",
      documents: ["Extrato completo de vendas/faturamento do ano anterior", "CNPJ"],
      timeline: "Em até 24h úteis",
      importance: "A não entrega gera bloqueio de emissão de NF, multa por atraso e até cancelamento do CNPJ."
    },
    {
      id: "nota_fiscal",
      title: "Emissão de Notas Fiscais",
      shortDesc: "Deixe o faturamento profissional. Suporte para credenciamento e emissão.",
      detailedDesc: "Credenciamos sua empresa no novo Portal Nacional de NFS-e ou sistemas estaduais e fornecemos assessoria e treinamento operacional completo para emissão de notas fiscais de serviço e de comércio sem complicação.",
      icon: <FileText className="w-6 h-6" />,
      whatsappMessage: "Olá Milene, preciso de suporte para credenciar meu MEI e emitir Notas Fiscais sem erros.",
      documents: ["Inscrição Municipal ou Estadual", "Senha Gov.br Ouro/Prata"],
      timeline: "24h a 72h (depende da liberação de cada município)",
      importance: "Exigido para fechar contratos com empresas médias/grandes e órgãos públicos, além de passar credibilidade."
    },
    {
      id: "alteracao_dados",
      title: "Alteração de Dados Cadastrais",
      shortDesc: "Mude de endereço, de atividades ou capital social de forma segura.",
      detailedDesc: "Seu negócio cresceu ou mudou de foco? Alteramos seu endereço comercial, Razão Social, Telefone de Contato, Capital Social ou adicionamos CNAEs secundários respeitando as regras federais de zoneamento comercial.",
      icon: <Settings className="w-6 h-6" />,
      whatsappMessage: "Olá Milene, preciso atualizar dados cadastrais ou atividades (CNAEs) do meu MEI.",
      documents: ["Novo endereço (se houver)", "Lista de novas atividades pretendidas", "Gov.br Ouro/Prata"],
      timeline: "Em até 48h úteis",
      importance: "Mantém seu alvará e CNPJ em conformidade com as regras municipais do novo endereço da atividade."
    },
    {
      id: "baixa_mei",
      title: "Baixa definitiva de MEI",
      shortDesc: "Extinga seu MEI corretamente sem deixar resíduos fiscais.",
      detailedDesc: "Muitos acham que basta esquecer o CNPJ ou inativar o Gov.br. Para fechar um MEI corretamente, é preciso solicitar a baixa na Receita Federal, entregar a Declaração de Extinção do faturamento e quitar as pendências remanescentes para evitar dívidas no seu CPF.",
      icon: <Trash2 className="w-6 h-6" />,
      whatsappMessage: "Olá Milene, decidi encerrar meu MEI e preciso que a baixa seja feita de forma limpa e segura.",
      documents: ["CNPJ", "Gov.br Ouro/Prata", "Último faturamento de vendas"],
      timeline: "Aprovação imediata na Junta Federal",
      importance: "Evita que taxas, juros e as mensalidades DAS continuem acumulando infinitamente no seu CPF."
    },
    {
      id: "orientacao_contabil",
      title: "Consultoria e Orientação",
      shortDesc: "Planejamento focado em crescimento, faturamento e migração para ME.",
      detailedDesc: "Resolução de dúvidas complexas sobre limites de faturamento (estouro de limite de faturamento anual), contratação de funcionário registrado (conforme regras CLT do MEI) e estruturação do carnê-leão/livro caixa para isentar seu imposto de renda pessoa física.",
      icon: <TrendingUp className="w-6 h-6" />,
      whatsappMessage: "Olá Milene, gostaria de uma orientação ou diagnóstico sobre o faturamento do meu MEI e plano de migração.",
      documents: ["Dados de faturamento e fluxo financeiro geral"],
      timeline: "Sessão agendada via videoconferência ou presencial",
      importance: "O estouro de limite sem planejamento pode desenquadrar retroativamente o MEI, gerando multas pesadas."
    }
  ];

  // DAS-MEI tax calculations configuration
  const dasBaseValues = {
    comercio: 78.20,
    servicos: 82.20,
    misto: 83.20,
    caminhoneiro: 133.20
  };

  const getDASSectorLabel = () => {
    switch (activitySector) {
      case "comercio": return "Comércio & Indústria (INSS + ICMS)";
      case "servicos": return "Prestação de Serviços (INSS + ISS)";
      case "misto": return "Atividade Mista (Serviços + Comércio)";
      case "caminhoneiro": return "MEI Caminhoneiro (INSS Especial)";
    }
  };

  // Simulated DAS late penalties base
  const calculateDASSimulation = () => {
    const base = dasBaseValues[activitySector];
    if (monthsLate === 0) {
      return {
        baseValue: base,
        penalties: 0,
        interest: 0,
        total: base
      };
    }
    
    // Simulating normal brazilian MEI interest rules (2% fine fixed + 1% interest per late month + SELIC)
    const baseTotalLate = base * monthsLate;
    const penaltyValue = baseTotalLate * 0.02; // 2% multa
    const interestValue = baseTotalLate * (0.01 * monthsLate); // ~1% ao mês
    const totalWithFines = baseTotalLate + penaltyValue + interestValue;
    
    return {
      baseValue: baseTotalLate,
      penalties: penaltyValue,
      interest: interestValue,
      total: totalWithFines
    };
  };

  const simulatedDAS = calculateDASSimulation();

  // MEI Limit Calculations
  const absoluteLimit = 81000;
  const parsedGross = parseFloat(grossIncome) || 0;
  const percentageUsed = Math.min(((parsedGross / absoluteLimit) * 100), 125);
  
  const getLmitDiagnosis = () => {
    if (parsedGross <= 0) return { title: "Valor Inválido", color: "text-zinc-500", desc: "Digite um valor de faturamento anual estimado." };
    if (parsedGross <= 64800) {
      return {
        title: "Situação Saudável 🟢",
        color: "text-emerald-600",
        desc: "Sua receita está em conformidade confortável com os limites do MEI. Continue emitindo notas normalmente e mantendo o Livro Caixa sob controle."
      };
    } else if (parsedGross <= 81000) {
      return {
        title: "Zona de Atenção 🟡",
        color: "text-amber-500",
        desc: "Você está muito perto do limite de R$ 81.000,00! É ideal realizar um diagnóstico contábil agora para saber se seu teto de faturamento comportará as próximas vendas ou se já devemos preparar a migração sem sobressaltos fiscais."
      };
    } else if (parsedGross <= 97200) {
      return {
        title: "Excedente de até 20% 🟠",
        color: "text-orange-500",
        desc: "Seu faturamento excedeu o teto oficial, mas ficou abaixo do limite de tolerância (R$ 97.200,00). Você será desenquadrado do MEI. É obrigatório emitir uma declaração de excesso e recolher o imposto complementar para migração regular como Microempresa."
      };
    } else {
      return {
        title: "Estouro de Limite Crítico 🔴",
        color: "text-red-500",
        desc: "Seu faturamento superou o limite de tolerância de 20%! A migração será retroativa ao início do ano corrente ou à data de abertura, sujeitando sua empresa a impostos acumulados com juros. Fale com a Milene Torres urgente para fazer o ajuste fiscal ideal o quanto antes!"
      };
    }
  };

  const limitDiagnosis = getLmitDiagnosis();

  // Preset chatbot quick query helpers
  const quickQueries = [
    { title: "Qual o faturamento máximo em 2026?", query: "Quais as regras do limite de faturamento anual do MEI em 2026? Comente sobre os planos de aumento de teto do MEI e o que acontece se eu ultrapassar hoje." },
    { title: "Como parcelar as parcelas vencidas do DAS?", query: "Gostaria de saber como funciona o parcelamento de guias DAS vencidas e em atraso do MEI. É possível parcelar na Receita Federal?" },
    { title: "Sou obrigado a emitir Nota Fiscal?", query: "O MEI é obrigado a emitir Nota Fiscal eletrônica (NFS-e) para pessoas físicas ou somente para pessoas jurídicas?" },
    { title: "Quais os benefícios previdenciários de pagar DAS?", query: "Quais benefícios previdenciários e direitos do INSS eu tenho direito pagando a guia do MEI em dia? (salário-maternidade, aposentadoria, auxílio-doença)" }
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#13253e] selection:bg-[#c5a68e] selection:text-[#FAF8F5]">
      
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Elegant Branding Logo */}
            <div className="flex flex-col cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <span className="font-display text-2xl tracking-widest text-[#13253e] font-semibold flex items-center gap-1.5 uppercase">
                Milene Torres
              </span>
              <div className="flex items-center gap-1">
                <span className="h-[1px] w-8 bg-[#c5a68e]"></span>
                <span className="font-sans text-[9px] tracking-[0.25em] text-[#c5a68e] uppercase font-bold">
                  Contadora Especialista em MEI
                </span>
                <span className="h-[1px] w-8 bg-[#c5a68e]"></span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#servicos" className="text-sm font-medium hover:text-[#c5a68e] transition-colors">Serviços</a>
              <a href="#ferramentas" className="text-sm font-medium hover:text-[#c5a68e] transition-colors">Ferramentas MEI</a>
              <button onClick={() => setIsChatOpen(true)} className="text-sm font-medium hover:text-[#c5a68e] transition-colors cursor-pointer text-left bg-transparent border-none p-0">Assistente Virtual AI</button>
              <a href="#beneficios" className="text-sm font-medium hover:text-[#c5a68e] transition-colors">Diferenciais</a>
              <button 
                onClick={() => openWhatsApp()}
                className="inline-flex items-center gap-2 bg-[#13253e] hover:bg-[#1c3659] text-white text-xs font-bold tracking-wider px-5 py-3 rounded-full uppercase transition-all shadow-md active:scale-95"
              >
                <Phone className="w-3.5 h-3.5 text-[#c5a68e]" />
                Falar com Milene
              </button>
            </nav>

            {/* Mobile Hamburger trigger */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-[#13253e] hover:text-[#c5a68e] transition-colors p-2"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-3 flex flex-col">
                <a 
                  href="#servicos" 
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium hover:bg-gray-50 rounded-lg"
                >
                  Serviços
                </a>
                <a 
                  href="#ferramentas" 
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium hover:bg-gray-50 rounded-lg"
                >
                  Ferramentas MEI
                </a>
                <button 
                  onClick={() => {
                    setMenuOpen(false);
                    setIsChatOpen(true);
                  }}
                  className="px-3 py-2 text-base text-left font-medium hover:bg-gray-50 rounded-lg cursor-pointer bg-transparent border-none"
                >
                  Assistente Virtual AI
                </button>
                <a 
                  href="#beneficios" 
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium hover:bg-gray-50 rounded-lg"
                >
                  Diferenciais
                </a>
                <button 
                  onClick={() => {
                    setMenuOpen(false);
                    openWhatsApp();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-[#13253e] hover:bg-[#1c3659] text-white font-bold p-3.5 rounded-lg text-sm tracking-wider uppercase transition-all"
                >
                  <Phone className="w-4 h-4 text-[#c5a68e]" />
                  Suporte pelo WhatsApp
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Top Rose Gold Accent Bar */}
      <div className="bg-gradient-to-r from-[#c5a68e] via-[#FAF8F5] to-[#c5a68e] h-1.5 w-full"></div>

      {/* Hero Core Section with Premium Elements */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-24 bg-gradient-to-b from-white to-[#FAF8F5]">
        
        {/* Decorative Vector Elements similar to the flyer's curves */}
        <div className="absolute right-0 bottom-0 pointer-events-none opacity-20 translate-x-12 translate-y-12">
          <div className="w-[450px] h-[450px] rounded-full bg-[#c5a68e]/10 border border-[#c5a68e]/20"></div>
        </div>
        <div className="absolute left-0 top-1/4 pointer-events-none opacity-10 -translate-x-20">
          <div className="w-[300px] h-[300px] rounded-full bg-[#13253e]/10 border border-[#13253e]/20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Hero Left Content Column */}
            <div className="lg:col-span-7 flex flex-col space-y-6 text-center lg:text-left">
              
              <div className="inline-flex self-center lg:self-start items-center gap-2 bg-[#FAF8F5] border border-[#c5a68e]/50 py-1.5 px-3.5 rounded-full">
                <Sparkles className="w-4 h-4 text-[#c5a68e]" />
                <span className="text-[11px] font-bold tracking-wider text-[#13253e] uppercase">
                  Atendimento 100% Personalizado e Humanizado
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#13253e] font-bold tracking-tight leading-[1.08] flex flex-col">
                <span className="text-sm font-sans tracking-[0.4em] text-[#c5a68e] font-semibold uppercase mb-1.5">
                  Contadora Especialista em
                </span>
                <span className="text-6xl sm:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-[#13253e] via-[#1c3659] to-[#c5a68e] tracking-tight py-2">
                  MEI
                </span>
                <span className="font-medium text-xl sm:text-2xl mt-4 max-w-xl text-[#c5a68e] italic font-display">
                  Menos burocracia, mais tempo para você crescer!
                </span>
              </h1>

              <p className="text-gray-600 text-base md:text-lg max-w-2xl leading-relaxed font-sans mx-auto lg:mx-0">
                Você trabalha duro pelo seu negócio. Por que perder noites de sono com a Receita Federal? 
                Garantimos que seu CNPJ fique regularizado, sem multas surpresas, auxiliando na emissão de guias, 
                declaração anual DASN e emissão rápida de notas fiscais.
              </p>

              {/* Special Floating Badge - Matching Circle of the Flyer */}
              <div className="p-4 bg-gradient-to-br from-[#13253e] to-[#0b1523] text-white rounded-2xl shadow-xl flex items-center md:items-start md:text-left gap-4 max-w-lg mx-auto lg:mx-0 border border-[#c5a68e]/35">
                <div className="bg-[#FAF8F5]/10 p-3 rounded-full flex-shrink-0 border border-[#FAF8F5]/10">
                  <Calculator className="w-6 h-6 text-[#c5a68e]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold tracking-wide text-[#c5a68e] uppercase font-display">
                    Diferencial Único
                  </h4>
                  <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                    "Eu cuido de toda a burocracia fiscal e das declarações junto aos órgãos reguladores para você focar no que realmente importa: vender e expandir suas fronteiras!"
                  </p>
                </div>
              </div>

              {/* Action row with buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <button
                  onClick={() => openWhatsApp("Olá Milene, necessito de um diagnóstico personalizado para regularizar meu MEI.")}
                  className="inline-flex items-center justify-center gap-3 bg-[#c5a68e] hover:bg-[#a9876d] text-white font-bold text-sm tracking-wider px-8 py-4.5 rounded-full uppercase transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                  <MessageCircle className="w-5 h-5" />
                  Quero falar com a Contadora
                </button>
                <a
                  href="#ferramentas"
                  className="inline-flex items-center justify-center gap-2 border border-[#13253e] hover:bg-[#13253e]/5 text-[#13253e] font-bold text-sm tracking-wider px-8 py-4.5 rounded-full uppercase transition-all"
                >
                  <Calculator className="w-4 h-4 text-[#c5a68e]" />
                  Simular Guia/Atraso
                </a>
              </div>

              <div className="flex justify-center lg:justify-start items-center gap-6 pt-4 text-xs text-gray-500 font-mono">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#c5a68e]" /> Sem taxas de adesão
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#c5a68e]" /> BA | Suporte Nacional
                </span>
              </div>

            </div>

            {/* Hero Right Column - Decorative Notepad matching the flyer visually */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md bg-white border border-[#c5a68e]/30 rounded-3xl p-6 shadow-2xl overflow-hidden">
                
                {/* Spiral notebook bar on top */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-[#13253e] to-[#1c3659] flex justify-around px-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-2.5 h-6 bg-stone-300 rounded-full -translate-y-2 border border-stone-400"></div>
                  ))}
                </div>

                <div className="pt-6 relative">
                  
                  {/* Floating Contact Block - styled like the right block of the flyer */}
                  <div className="bg-[#FAF8F5] border border-[#c5a68e]/50 rounded-2xl p-5 mb-5 text-center relative overflow-hidden shadow-md">
                    <div className="absolute -right-4 -top-4 w-12 h-12 bg-[#c5a68e]/10 rounded-full"></div>
                    
                    <span className="font-script text-3xl text-[#c5a68e] block">Milene Torres</span>
                    <span className="font-sans text-[11px] font-bold tracking-[0.3em] text-[#13253e] uppercase">
                      CONTADORA
                    </span>
                    
                    <div className="w-6 h-[1.5px] bg-[#c5a68e] mx-auto my-3"></div>
                    
                    {/* Link directly configured with WhatsApp and styling resembling flyer phone block */}
                    <button 
                      onClick={() => openWhatsApp()}
                      className="mt-1 w-full bg-[#13253e] hover:bg-[#1c3659] hover:scale-102 hover:shadow-md text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Phone className="w-4 h-4 text-[#c5a68e]" />
                      <span className="font-mono text-sm tracking-widest font-semibold">{CONTACT_FORMATTED}</span>
                    </button>

                    <p className="text-[10px] text-gray-500 mt-3 italic">
                      Atendimento personalizado, rápido e sem complicação! <br />🚀 Salvador e todo o Brasil.
                    </p>
                  </div>

                  {/* Bullet points on the notebook paper visual */}
                  <h3 className="font-display font-bold text-lg text-[#13253e] tracking-tight">
                    Minha Prancheta de Compromisso:
                  </h3>
                  
                  <div className="mt-4 space-y-3.5">
                    
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border border-[#c5a68e] flex items-center justify-center text-[#c5a68e] flex-shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-sm text-gray-700">
                        <strong className="text-[#13253e]">Organização:</strong> Controle inteligente de todas as datas, faturamentos corporativos e históricos.
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border border-[#c5a68e] flex items-center justify-center text-[#c5a68e] flex-shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-sm text-gray-700">
                        <strong className="text-[#13253e]">Segurança:</strong> Declarações feitas nos prazos corretos, sem erro fiscal ou exposição a fiscalizações.
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border border-[#c5a68e] flex items-center justify-center text-[#c5a68e] flex-shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-sm text-gray-700">
                        <strong className="text-[#13253e]">Tranquilidade:</strong> Resgatar seu direito à aposentadoria por idade, auxílio previdenciário e crédito bancário facilitado.
                      </p>
                    </div>

                  </div>

                  {/* Bottom banner matching bottom of flyer */}
                  <div className="mt-6 p-3 bg-[#FAF8F5] text-stone-600 rounded-xl border-l-4 border-[#c5a68e] text-xs">
                    <p className="italic">
                      "Seu MEI em dia para você se preocupar apenas com o seu faturamento!"
                    </p>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>

      </section>

      {/* Trust Quote Ticker */}
      <div className="bg-[#13253e] py-4 border-y border-[#c5a68e]/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[12px] md:text-sm tracking-[0.2em] uppercase font-semibold text-white">
            ⭐ SEU MEI EM DIA PARA VOCÊ FOCAR NO QUE REALMENTE IMPORTA: <span className="text-[#c5a68e]">O SEU NEGÓCIO!</span> ⭐
          </p>
        </div>
      </div>

      {/* Services Grid Section */}
      <section id="servicos" className="py-20 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-sans text-[11px] tracking-[0.3em] text-[#c5a68e] uppercase font-bold">
              Soluções Especializadas
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#13253e] mt-2 tracking-tight">
              Como posso te ajudar no dia a dia?
            </h2>
            <div className="w-12 h-1 bg-[#c5a68e] mx-auto mt-4 mb-6"></div>
            <p className="text-gray-600 text-[15px] sm:text-base">
              A contabilidade do MEI parece simples no papel, mas esconder pendências ou preencher notas e declarações de faturamento com erro pode travar seu CNPJ. Conheça as minhas soluções completas para manter sua empresa protegida.
            </p>
          </div>

          {/* Interactive Responsive Grid of standard services listed on flyer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicesData.map((service, index) => (
              <motion.div
                key={service.id}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
                onClick={() => setSelectedService(service)}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#c5a68e]/30 flex items-center justify-center text-[#c5a68e] mb-4 shadow-inner">
                    {service.icon}
                  </div>
                  <h3 className="font-display font-bold text-lg text-[#13253e] tracking-tight leading-tight mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-xs leading-relaxed mb-4">
                    {service.shortDesc}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#c5a68e] mt-2 group">
                  <span>Ver Detalhes</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Dialog Overlay for selected Service Details */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-[#c5a68e]/40 relative max-h-[90vh] flex flex-col"
            >
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-stone-100"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title Section header */}
              <div className="p-6 md:p-8 bg-gradient-to-r from-[#13253e] to-[#1c3659] text-white flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-[#c5a68e] border border-white/10">
                  {selectedService.icon}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#c5a68e]">Serviço Contábil Oficial</span>
                  <h3 className="font-display font-medium text-2xl md:text-3xl tracking-tight mt-0.5">
                    {selectedService.title}
                  </h3>
                </div>
              </div>

              {/* Main Content Scroll container */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 text-sm leading-relaxed text-gray-700">
                
                <div>
                  <h4 className="font-display font-bold text-base text-[#13253e] mb-1.5">Descrição do Serviço:</h4>
                  <p>{selectedService.detailedDesc}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#FAF8F5] p-4 rounded-xl border border-gray-150">
                    <span className="font-display font-bold text-xs tracking-wider uppercase text-[#c5a68e] block mb-2">
                      ⏱ Prazo Estimativo:
                    </span>
                    <span className="text-gray-800 font-medium text-sm flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-gray-500" /> {selectedService.timeline}
                    </span>
                  </div>

                  <div className="bg-[#FAF8F5] p-4 rounded-xl border border-gray-150">
                    <span className="font-display font-bold text-xs tracking-wider uppercase text-[#c5a68e] block mb-2">
                      ⚠ Riscos de negligenciar:
                    </span>
                    <span className="text-gray-800 text-xs flex items-center gap-1.5 leading-tight">
                      <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" /> {selectedService.importance}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-display font-bold text-base text-[#13253e] mb-2">Documentos Necessários:</h4>
                  <ul className="space-y-1.5">
                    {selectedService.documents.map((doc, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs">
                        <Check className="w-4 h-4 text-[#c5a68e] mt-0.5 flex-shrink-0" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Sticky bottom CTA actions */}
              <div className="p-6 bg-[#FAF8F5] border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-[10px] uppercase font-semibold text-gray-500">Atendimento Privado</span>
                  <p className="text-xs text-gray-700 font-medium">Contratar {selectedService.title}</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedService(null)}
                    className="flex-1 sm:flex-initial text-center text-xs font-semibold px-4 py-3 border border-stone-300 hover:bg-stone-50 rounded-xl"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={() => {
                      setSelectedService(null);
                      openWhatsApp(selectedService.whatsappMessage);
                    }}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#13253e] hover:bg-[#1c3659] text-white font-bold text-xs tracking-wider px-5 py-3 rounded-xl uppercase transition-all shadow-md"
                  >
                    <MessageCircle className="w-4 h-4 text-[#c5a68e]" />
                    Solicitar via WhatsApp
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Tools & Calculators Hub */}
      <section id="ferramentas" className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="font-sans text-[11px] tracking-[0.3em] text-[#c5a68e] uppercase font-bold">
              Hub Interativo para MEI
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#13253e] mt-2 tracking-tight">
              Simuladores e Ferramentas Gratuitas
            </h2>
            <div className="w-12 h-1 bg-[#c5a68e] mx-auto mt-4 mb-5"></div>
            <p className="text-gray-600 text-sm">
              Use nossos assistentes rápidos de cálculo de guias em atraso, controle do faturamento anual regulamentar do MEI e o calendário de vencimentos.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Tool selectors (Tabs) - Left Column */}
            <div className="lg:col-span-4 flex flex-col space-y-3">
              <button
                onClick={() => setActiveTab("simulator")}
                className={`text-left p-4.5 rounded-2xl border transition-all flex items-start gap-3.5 group cursor-pointer ${
                  activeTab === "simulator" 
                    ? "bg-[#13253e] border-[#13253e] text-white shadow-md" 
                    : "bg-white border-gray-150 hover:bg-gray-50 text-[#13253e]"
                }`}
              >
                <div className={`p-2.5 rounded-xl flex-shrink-0 border ${
                  activeTab === "simulator" 
                    ? "bg-white/10 border-white/10 text-[#c5a68e]" 
                    : "bg-[#FAF8F5] border-[#c5a68e]/30 text-[#c5a68e]"
                }`}>
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm tracking-tight">Calculadora de DAS & Atrasos</h4>
                  <p className={`text-xs mt-0.5 leading-relaxed ${activeTab === "simulator" ? "text-stone-300" : "text-gray-500"}`}>
                    Selecione suas atividades e calcule o DAS atualizado com multas e juros estimado.
                  </p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("limit")}
                className={`text-left p-4.5 rounded-2xl border transition-all flex items-start gap-3.5 group cursor-pointer ${
                  activeTab === "limit" 
                    ? "bg-[#13253e] border-[#13253e] text-white shadow-md" 
                    : "bg-white border-gray-150 hover:bg-gray-50 text-[#13253e]"
                }`}
              >
                <div className={`p-2.5 rounded-xl flex-shrink-0 border ${
                  activeTab === "limit" 
                    ? "bg-white/10 border-white/10 text-[#c5a68e]" 
                    : "bg-[#FAF8F5] border-[#c5a68e]/30 text-[#c5a68e]"
                }`}>
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm tracking-tight">Termômetro de Limite MEI</h4>
                  <p className={`text-xs mt-0.5 leading-relaxed ${activeTab === "limit" ? "text-stone-300" : "text-gray-500"}`}>
                    Consulte se o faturamento aproximado está perto de desenquadrar ou em zona de risco fiscal.
                  </p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("calendar")}
                className={`text-left p-4.5 rounded-2xl border transition-all flex items-start gap-3.5 group cursor-pointer ${
                  activeTab === "calendar" 
                    ? "bg-[#13253e] border-[#13253e] text-white shadow-md" 
                    : "bg-white border-gray-150 hover:bg-gray-50 text-[#13253e]"
                }`}
              >
                <div className={`p-2.5 rounded-xl flex-shrink-0 border ${
                  activeTab === "calendar" 
                    ? "bg-white/10 border-white/10 text-[#c5a68e]" 
                    : "bg-[#FAF8F5] border-[#c5a68e]/30 text-[#c5a68e]"
                }`}>
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm tracking-tight">Calendário e Obrigações 2026</h4>
                  <p className={`text-xs mt-0.5 leading-relaxed ${activeTab === "calendar" ? "text-stone-300" : "text-gray-500"}`}>
                    Verifique os prazos e datas-limite das taxas obrigatórias mensais e das declarações anuais.
                  </p>
                </div>
              </button>
            </div>

            {/* Display container of tools - Right Column */}
            <div className="lg:col-span-8 bg-[#FAF8F5] border border-gray-150 rounded-3xl p-6 md:p-8">
              
              {/* Tab 1: DAS Calculator */}
              {activeTab === "simulator" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-xl text-[#13253e]">
                      Simulador de DAS com Taxa de Atraso
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      As parcelas do DAS vencem todo dia 20. Selecione seu setor para ver os valores oficiais vigentes para 2026.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Activity configuration */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-[#13253e] uppercase mb-1.5">
                          Setor Principal do seu MEI
                        </label>
                        <select
                          value={activitySector}
                          onChange={(e) => setActivitySector(e.target.value as any)}
                          className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:border-[#c5a68e] focus:outline-none"
                        >
                          <option value="comercio">Comércio e Indústria (ICMS)</option>
                          <option value="servicos">Prestadores de Serviços (ISS)</option>
                          <option value="misto">Atividade Mista (Serviço + Comércio)</option>
                          <option value="caminhoneiro">MEI Caminhoneiro (Transporte cargas)</option>
                        </select>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-xs font-bold text-[#13253e] uppercase">
                            Meses de DAS em atraso
                          </label>
                          <span className="text-sm font-bold font-mono text-[#c5a68e] bg-white border border-gray-200 px-2.5 py-0.5 rounded-lg">
                            {monthsLate === 0 ? "Em dia" : `${monthsLate} meses`}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="12"
                          value={monthsLate}
                          onChange={(e) => setMonthsLate(parseInt(e.target.value))}
                          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#c5a68e] mt-2"
                        />
                        <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
                          <span>Sem atraso</span>
                          <span>6 meses</span>
                          <span>12 meses</span>
                        </div>
                      </div>
                    </div>

                    {/* Simulation Result panel */}
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-5 flex flex-col justify-between">
                      <div className="space-y-3.5">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                          Valores Calculados Estimados
                        </span>
                        
                        <div className="flex justify-between items-center text-xs text-gray-600 border-b border-gray-100 pb-1.5">
                          <span>Imposto Base ({monthsLate > 0 ? `${monthsLate}x` : "Mensal"}):</span>
                          <span className="font-mono text-gray-800 font-semibold">
                            R$ {simulatedDAS.baseValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </span>
                        </div>

                        {monthsLate > 0 && (
                          <>
                            <div className="flex justify-between items-center text-xs text-gray-600 border-b border-gray-100 pb-1.5">
                              <span>Multa por Atraso (2%):</span>
                              <span className="font-mono text-amber-600 font-medium">
                                R$ {simulatedDAS.penalties.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-600 border-b border-gray-100 pb-1.5">
                              <span>Juros calculados (~1% /mês):</span>
                              <span className="font-mono text-amber-600 font-medium">
                                R$ {simulatedDAS.interest.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          </>
                        )}

                        <div className="flex justify-between items-center pt-2">
                          <span className="text-sm font-bold text-[#13253e]">Total Estimado:</span>
                          <span className="font-mono text-xl font-bold text-[#13253e]">
                            R$ {simulatedDAS.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>

                      <div className="mt-5">
                        <button
                          onClick={() => openWhatsApp(`Olá Milene, acionei o simulador de DAS e notei que tenho cerca de ${monthsLate} meses atrasados. Preciso de suporte para consolidação de débito ou parcelamento.`)}
                          className="w-full inline-flex items-center justify-center gap-2 bg-[#13253e] hover:bg-[#1c3659] text-white text-xs font-bold px-4 py-3 rounded-xl uppercase transition-all shadow-sm"
                        >
                          <MessageCircle className="w-4 h-4 text-[#c5a68e]" />
                          Parcelar Débitos com Suporte
                        </button>
                      </div>
                    </div>

                  </div>

                  <div className="p-3 bg-white/70 border border-gray-200 text-[11px] text-gray-500 rounded-xl leading-relaxed flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Nota Legal:</strong> Esta é uma estimativa educacional com base nos valores previdenciários de 2026. A multa consolidada oficial depende de taxas atreladas à SELIC. A acumulação de atrasos causa a inscrição da dívida ativa do proprietário na Procuradoria-Geral da Fazenda Nacional.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: Limit Thermometer */}
              {activeTab === "limit" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-xl text-[#13253e]">
                      Termômetro de Limite de Faturamento MEI
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      O limite oficial anual do MEI atualmente é de <strong>R$ 81.000,00</strong> (proporcional a R$ 6.750,00/mês). Digite seu faturamento estimado e entenda seu status fiscal.
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-[#13253e] uppercase mb-1.5 flex justify-between">
                        <span>Seu Faturamento Bruto Anual Estimado (R$)</span>
                        <span className="text-[10px] text-gray-400 normal-case">(Acumulado no ano corrente)</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-3 text-sm font-semibold text-gray-400">R$</span>
                        <input
                          type="number"
                          value={grossIncome}
                          onChange={(e) => setGrossIncome(e.target.value)}
                          placeholder="Digite o valor total de vendas"
                          className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm font-mono font-bold focus:border-[#c5a68e] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Progress representation */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-semibold text-gray-600">
                        <span>Progresso do Teto: R$ {parsedGross.toLocaleString("pt-BR")}</span>
                        <span>Limite: R$ 81.000</span>
                      </div>
                      <div className="w-full h-3.5 bg-gray-200 rounded-full overflow-hidden flex">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            percentageUsed <= 80 
                              ? "bg-emerald-500" 
                              : percentageUsed <= 100 
                                ? "bg-amber-400" 
                                : "bg-red-500"
                          }`}
                          style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                        ></div>
                        {percentageUsed > 100 && (
                          <div className="bg-red-700 h-full flex-grow text-[9px] text-white flex items-center justify-center font-bold px-1 animate-pulse">
                            +{(percentageUsed - 100).toFixed(0)}% EXCESSÃO
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between text-[9px] text-gray-400 font-mono">
                        <span>0%</span>
                        <span>80% (R$ 64.800)</span>
                        <span>100% (R$ 81.000)</span>
                      </div>
                    </div>

                    {/* Diagnosis card */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Diagnóstico Fiscal:</span>
                        <span className={`text-sm font-bold ${limitDiagnosis.color}`}>{limitDiagnosis.title}</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {limitDiagnosis.desc}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                          onClick={() => openWhatsApp(`Olá Milene, preenchi meu faturamento no Termômetro de Limite MEI (estimativa de R$ ${parsedGross.toLocaleString()}) e meu status é ${limitDiagnosis.title}. Gostaria de entender o plano de transição para meu CNPJ.`)}
                          className="inline-flex items-center justify-center gap-2 bg-[#13253e] hover:bg-[#1c3659] text-white text-xs font-bold px-4 py-3 rounded-xl uppercase transition-all shadow-sm"
                        >
                          <MessageCircle className="w-4 h-4 text-[#c5a68e]" />
                          Planejar Migração ME com Milene
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Tab 3: Calendar & Obligations */}
              {activeTab === "calendar" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-xl text-[#13253e]">
                      Calendário de Obrigações Fiscais MEI 2026
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Manter os olhos atados aos prazos legislativos impede as temidas multas administrativas.
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    
                    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-3.5">
                      <div className="p-2 bg-[#FAF8F5] border border-[#c5a68e] text-[#c5a68e] rounded-lg mt-0.5">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="flex-grow space-y-1">
                        <div className="flex justify-between items-center">
                          <h4 className="font-display font-bold text-sm text-[#13253e]">Vencimento do DAS-MEI (Mensal)</h4>
                          <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">Recorrente</span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          Todo **dia 20** de cada mês (ou dia útil subsequente). Contribuição previdenciária unificada em guia única.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-3.5">
                      <div className="p-2 bg-[#FAF8F5] border border-[#c5a68e] text-[#c5a68e] rounded-lg mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex-grow space-y-1">
                        <div className="flex justify-between items-center">
                          <h4 className="font-display font-bold text-sm text-[#13253e]">Declaração Anual DASN-SIMEI</h4>
                          <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-100">Até 31/Maio</span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          Relatório socioeconômico sobre o faturamento total acumulado do ano fiscal anterior. Sem renegociações em caso de descumprimento imprevisto.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-3.5">
                      <div className="p-2 bg-[#FAF8F5] border border-[#c5a68e] text-[#c5a68e] rounded-lg mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="flex-grow space-y-1">
                        <div className="flex justify-between items-center">
                          <h4 className="font-display font-bold text-sm text-[#13253e]">Relatório Mensal de Receitas (Interno)</h4>
                          <span className="bg-sky-50 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-sky-100">Até dia 20</span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          Preencher mensalmente o relatório anexando notas fiscais. É um controle interno obrigatório por lei para justificar a DASN no final de cada período fiscal.
                        </p>
                      </div>
                    </div>

                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => openWhatsApp("Olá Milene, pretendo delegar o controle e agendamento das minhas obrigações e DASN para suporte seguro.")}
                      className="inline-flex items-center gap-2 bg-[#13253e] hover:bg-[#1c3659] text-white text-xs font-bold px-5 py-3 rounded-xl uppercase transition-all shadow-md"
                    >
                      <MessageCircle className="w-4 h-4 text-[#c5a68e]" />
                      Delegar Gestão Fiscal Completa
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </section>



      {/* Trust benefits / Value Propositions Cards Section (Why hire an accountant) */}
      <section id="beneficios" className="py-20 bg-gradient-to-br from-[#13253e] to-[#0b1523] text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-sans text-[11px] tracking-[0.3em] text-[#c5a68e] uppercase font-bold">
              Profissionalismo Garantido
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-1 tracking-tight">
              Por que contar com uma especialista?
            </h2>
            <div className="w-12 h-1 bg-[#c5a68e] mx-auto mt-4 mb-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6.5 space-y-4">
              <div className="w-11 h-11 rounded-xl bg-[#c5a68e]/10 border border-[#c5a68e]/20 flex items-center justify-center text-[#c5a68e]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg tracking-tight text-[#c5a68e]">
                Evite multas e dor de cabeça
              </h3>
              <p className="text-stone-300 text-xs leading-relaxed">
                Esqueceu a data? Teve inconsistência nas declarações? Evitamos multas acumulativas desnecessárias da Receita Federal e agilizamos todos os trâmites legais do Simples Nacional.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6.5 space-y-4">
              <div className="w-11 h-11 rounded-xl bg-[#c5a68e]/10 border border-[#c5a68e]/20 flex items-center justify-center text-[#c5a68e]">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg tracking-tight text-[#c5a68e]">
                Retenha seus Direitos Previdenciários
              </h3>
              <p className="text-stone-300 text-xs leading-relaxed">
                Contribuições com o CNAE correto ou parcelamentos organizados garantem de verdade coberturas do INSS como aposentadoria regular por idade, licença-maternidade ou licença por acidente.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6.5 space-y-4">
              <div className="w-11 h-11 rounded-xl bg-[#c5a68e]/10 border border-[#c5a68e]/20 flex items-center justify-center text-[#c5a68e]">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg tracking-tight text-[#c5a68e]">
                Atendimento rápido e humanizado
              </h3>
              <p className="text-stone-300 text-xs leading-relaxed">
                Nada de robôs estáticos te mandando para tutoriais longos do governo. Você é atendido diretamente por uma contadora especialista interessada no seu crescimento comercial.
              </p>
            </div>

          </div>

          {/* Testimonials block showing reliability */}
          <div className="mt-16 bg-[#FAF8F5]/5 border border-[#FAF8F5]/10 rounded-3xl p-6 md:p-8 max-w-4xl mx-auto">
            <h4 className="font-display font-bold text-center text-lg text-[#c5a68e] tracking-tight mb-8">
              O que dizem os clientes MEI que regularizaram
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 border-b md:border-b-0 md:border-r border-[#FAF8F5]/10 pb-6 md:pb-0 md:pr-6 text-xs">
                <p className="leading-relaxed text-stone-200 italic">
                  "Eu tinha 3 anos de DAS em atraso e achei que teria meu CPF bloqueado. A Milene Torres consolidou minhas pendências em parcelas de R$ 50 mensais e tirou meu CNPJ do sufoco em 2 dias. Atendimento incrível!"
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <span className="font-bold text-[#c5a68e]">Renato Souza</span>
                  <span className="text-stone-400 font-mono text-[9px]">— Eletricista Autônomo, Lauro de Freitas</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <p className="leading-relaxed text-stone-200 italic">
                  "Queria emitir nota de serviços para uma grande rede varejista e não sabia os trâmites com Gov.br e SENHA municipal. A Milene configurou meu cadastro e emitiu minha primeira nota em minutos. Recomendo de olhos fechados."
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <span className="font-bold text-[#c5a68e]">Juliana Martins</span>
                  <span className="text-stone-400 font-mono text-[9px]">— Designer de Moda MEI, Salvador</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Large Call to Action Panel */}
      <section className="py-20 bg-[#FAF8F5] relative overflow-hidden">
        
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6 relative z-10">
          <span className="font-sans text-[11px] tracking-[0.3em] text-[#c5a68e] uppercase font-bold">
            Fale Comigo Agora Mesmo
          </span>
          
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#13253e] tracking-tight max-w-3xl mx-auto leading-tight">
            Chega de sofrer com burocracias fiscais e planilhas atrasadas.
          </h2>
          
          <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Consulte agora mesmo sua situação cadastral com atendimento rápido e dores de cabeça eliminadas de vez.
          </p>

          <div className="pt-4 flex flex-col md:flex-row justify-center items-center gap-4 max-w-md mx-auto">
            <button
              onClick={() => openWhatsApp()}
              className="w-full inline-flex items-center justify-center gap-3 bg-[#c5a68e] hover:bg-[#a9876d] text-white font-bold text-sm tracking-wider px-8 py-4.5 rounded-full uppercase transition-all shadow-lg active:scale-95"
            >
              <MessageCircle className="w-5 h-5" />
              QUERO ATENDIMENTO PERSONALIZADO
            </button>
          </div>

          <div className="pt-2">
            <span className="font-mono text-xs font-semibold text-[#13253e] tracking-wider">
              WhatsApp Direto: <span className="text-[#c5a68e] font-bold">{CONTACT_FORMATTED}</span>
            </span>
          </div>

        </div>

        {/* Dynamic Vector Curves */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-3/4 h-[3px] bg-gradient-to-r from-transparent via-[#c5a68e]/40 to-transparent"></div>
      </section>

      {/* Footer Design */}
      <footer className="bg-[#0b1523] text-stone-300 py-12 text-xs border-t border-[#c5a68e]/35">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-b border-white/5 pb-8">
            
            {/* Stamp logo */}
            <div className="flex flex-col text-center md:text-left">
              <span className="font-display text-xl tracking-widest text-white font-bold uppercase">
                Milene Torres
              </span>
              <span className="font-sans text-[8px] tracking-[0.25em] text-[#c5a68e] uppercase font-bold mt-0.5">
                Contadora Especialista em MEI
              </span>
            </div>

            <div className="text-center text-stone-400">
              <p>Segunda à Sexta, das 08:00 às 18:00</p>
              <span className="text-[#c5a68e] font-semibold mt-1 block">Atendimento focado, rápido e humanizado</span>
            </div>

            <div className="flex justify-center md:justify-end gap-3.5">
              <button 
                onClick={() => openWhatsApp()}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#c5a68e]/20 border border-white/10 flex items-center justify-center text-white transition-colors cursor-pointer"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-[#c5a68e]" />
              </button>
            </div>

          </div>

          <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-stone-500 gap-4">
            <div>
              <p>© 2026 Milene Torres. Todos os direitos reservados.</p>
              <p className="mt-0.5 text-stone-600 font-mono">CNPJ Contabilidade Credenciada em conformidade.</p>
            </div>
            
            <div className="flex gap-4">
              <span>Termos Legais</span>
              <span>Política de Privacidade</span>
              <span>Receita Federal</span>
            </div>
          </div>

        </div>
      </footer>

      {/* GLOBAL FLOATING PORTAL (AI ASSISTANT & DIRECT WHATSAPP) */}
      <div id="floating-chat-portal" className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none select-none">
        
        {/* Floating Chat Window with AnimatePresence */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.93 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.93 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-[360px] md:w-[400px] max-w-[calc(100vw-32px)] h-[520px] max-h-[calc(100vh-140px)] bg-white border border-[#E6DFD6] rounded-3xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto text-[#2D2926] font-sans"
            >
              {/* Header inside floating chat */}
              <div className="bg-[#2D2926] text-white p-4 flex flex-col border-b border-[#5A5A40]/30 relative">
                
                {/* Upper row: brand name + close */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#5A5A40] flex items-center justify-center text-white relative shadow-inner">
                      <Sparkles className="w-4 h-4 text-white" />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#2D2926] animate-pulse"></span>
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm tracking-wide text-white">
                        Milene Torres
                      </h4>
                      <p className="text-[10px] text-gray-300 font-sans tracking-wide flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                        Assessoria de MEI Unificada
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 cursor-pointer"
                    aria-label="Minimizar chat"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Sub-header: direct high-priority calling to human help (WhatsApp) */}
                <div className="mt-3.5 bg-[#5A5A40] text-white py-2 px-3 rounded-xl flex items-center justify-between text-xs font-semibold shadow-inner">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Deseja falar com a contadora?</span>
                  </div>
                  <button
                    onClick={() => openWhatsApp("Olá Milene, preciso de suporte para o meu MEI de forma imediata pelo WhatsApp.")}
                    className="bg-emerald-500 hover:bg-emerald-600 font-bold px-2.5 py-1 text-[10px] uppercase rounded-lg tracking-wider text-white transition-all flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                  >
                    <Phone className="w-3 h-3 text-white" /> Chamar
                  </button>
                </div>

              </div>

              {/* Chat Viewport scroll container */}
              <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-[#F7F3F0]/60 flex flex-col">
                
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-3 text-xs leading-relaxed shadow-sm ${
                        msg.role === "user"
                          ? "bg-[#2D2926] text-white rounded-br-none"
                          : "bg-white border border-[#E6DFD6] text-[#2D2926] rounded-bl-none"
                      }`}
                    >
                      {/* Formatted Text rendering simulating paragraphs */}
                      <div className="whitespace-pre-line text-xs">
                        {msg.text.split("\n").map((part, i) => {
                          const boldParts = part.split("**");
                          if (boldParts.length > 1) {
                            return (
                              <p key={i} className="mb-1">
                                {boldParts.map((subPart, j) => 
                                  j % 2 === 1 ? <strong key={j} className="font-semibold text-[#A65D46]">{subPart}</strong> : subPart
                                )}
                              </p>
                            );
                          }
                          return <p key={i} className="mb-1">{part}</p>;
                        })}
                      </div>

                      {/* Redirect message to WhatsApp trigger underneath model messages */}
                      {msg.role === "model" && index > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-100 flex justify-end">
                          <button
                            onClick={() => openWhatsApp(`Olá Milene, estava conversando com o seu assistente AI e gostaria de tirar uma dúvida operacional com você.\n\nResposta do Assistente: ${msg.text.substring(0, 100)}...`)}
                            className="inline-flex items-center gap-1 text-[9px] font-bold text-[#5A5A40] hover:text-[#A65D46] transition-colors cursor-pointer"
                          >
                            <MessageCircle className="w-3 h-3 text-emerald-500" />
                            <span>Enviar esta dúvida para o WhatsApp</span>
                          </button>
                        </div>
                      )}

                    </div>
                  </div>
                ))}

                {/* Animated Typing logic indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-[#E6DFD6] rounded-2xl rounded-bl-none px-3.5 py-3 shadow-sm">
                      <div className="flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 bg-[#5A5A40] rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-[#5A5A40] rounded-full animate-bounce delay-100"></span>
                        <span className="w-1.5 h-1.5 bg-[#5A5A40] rounded-full animate-bounce delay-200"></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={floatChatEndRef} />
              </div>

              {/* Floating Chat Predefined Trigger Shortcut Rules to redirect to WhatsApp immediately */}
              <div className="px-3 py-2 bg-white border-t border-gray-100 flex gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap">
                <button
                  onClick={() => openWhatsApp("Olá Milene, acessei o chat e preciso de suporte com a Abertura do meu MEI.")}
                  className="bg-[#F7F3F0] hover:bg-[#E6DFD6] text-[#2D2926] border border-[#E6DFD6] text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                >
                  <UserPlus className="w-3 h-3 text-[#5A5A40]" />
                  <span>Abra meu MEI 🚀</span>
                </button>
                <button
                  onClick={() => openWhatsApp("Olá Milene, consultei o terminal e tenho pendências acumuladas na Receita que preciso parcelar e regularizar.")}
                  className="bg-[#F7F3F0] hover:bg-[#E6DFD6] text-[#2D2926] border border-[#E6DFD6] text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                >
                  <ShieldCheck className="w-3 h-3 text-[#A65D46]" />
                  <span>Regularizar Pendências ⚠️</span>
                </button>
                <button
                  onClick={() => openWhatsApp("Olá Milene, preciso de orientação contábil sobre faturamento e limite de faturamento anual.")}
                  className="bg-[#F7F3F0] hover:bg-[#E6DFD6] text-[#2D2926] border border-[#E6DFD6] text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                >
                  <TrendingUp className="w-3 h-3 text-[#5A5A40]" />
                  <span>Estouro de Limite? 📈</span>
                </button>
              </div>

              {/* Floating Input Area */}
              <div className="p-3 bg-white border-t border-gray-100 flex flex-col gap-1.5">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex gap-1.5 items-center"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Escreva sua dúvida aqui..."
                    className="flex-grow bg-[#F7F3F0] border border-[#E6DFD6] rounded-xl px-3 py-2 text-xs focus:border-[#5A5A40] focus:outline-none text-[#2D2926]"
                  />
                  
                  {/* Option 1: SEND TO GEMINI AI ASSISTANT */}
                  <button
                    type="submit"
                    disabled={isTyping}
                    title="Perguntar para Assistente AI"
                    className="bg-[#2D2926] hover:bg-[#5A5A40] text-white p-2 text-xs rounded-xl transition-all shadow-md active:scale-95 flex-shrink-0 disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-[#E6DFD6]" />
                  </button>

                  {/* Option 2: DIRECT WHATSAPP ACTION */}
                  <button
                    type="button"
                    onClick={() => {
                      if (inputValue.trim()) {
                        openWhatsApp(`Olá Milene, estou com uma dúvida no portal de suporte e gostaria de seu apoio especializado.\n\nMinha dúvida/situação: ${inputValue}`);
                      } else {
                        openWhatsApp();
                      }
                    }}
                    title="Perguntar direto pelo WhatsApp"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 text-xs rounded-xl transition-all shadow-md active:scale-95 flex-shrink-0 cursor-pointer flex items-center justify-center"
                  >
                    <Phone className="w-3.5 h-3.5 text-white" />
                  </button>
                </form>

                <div className="flex justify-between items-center text-[9px] text-gray-400 px-1">
                  <span>Modos de contato:</span>
                  <div className="flex gap-2">
                    <span className="flex items-center gap-0.5"><Send className="w-2.5 h-2.5 text-stone-400" /> Perguntar à IA</span>
                    <span className="flex items-center gap-0.5 font-bold text-emerald-500"><Phone className="w-2.5 h-2.5" /> Enviar p/ WhatsApp</span>
                  </div>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Master Trigger Controller Round Button */}
        <div className="pointer-events-auto flex items-center gap-2">
          
          {/* Quick interactive note banner that disappears on click */}
          {chatNotificationBadge && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={toggleChatOpen}
              className="bg-[#2D2926] text-white py-2 px-3.5 rounded-2xl border border-[#5A5A40] shadow-xl text-[11px] font-semibold flex items-center gap-2 cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Dúvida de MEI? Pergunte agora!</span>
            </motion.div>
          )}

          <button
            onClick={toggleChatOpen}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl relative transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer bg-gradient-to-tr ${
              isChatOpen 
                ? "from-[#2D2926] to-[#5A5A40] rotate-90" 
                : "from-[#5A5A40] to-[#A65D46]"
            } text-white`}
            aria-label="Assistente Virtual de Contabilidade"
          >
            {isChatOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <div className="relative">
                <MessageCircle className="w-6 h-6 text-white" />
                {chatNotificationBadge && (
                  <span className="absolute -top-2.5 -right-2.5 bg-[#A65D46] text-white text-[9px] font-bold h-5 w-5 rounded-full border-2 border-white flex items-center justify-center shadow">
                    1
                  </span>
                )}
              </div>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
