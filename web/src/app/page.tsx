"use client";

import { useMemo, useState } from "react";

type AgentStatus = "pendente" | "executando" | "concluído";

type AgentStep = {
  id: string;
  título: string;
  descrição: string;
  status: AgentStatus;
  saída?: string;
};

type WorkflowResult = {
  roteiro: VideoScript;
  narrativa: NarrationPlan;
  cenas: ScenePlan[];
  broll: string[];
  tarefas: string[];
  checklist: string[];
};

type VideoScript = {
  gancho: string;
  introdução: string;
  tópicos: { título: string; conteúdo: string }[];
  conclusão: string;
};

type NarrationPlan = {
  tom: string;
  ritmo: string;
  pausas: string[];
  frasesDeÊnfase: string[];
};

type ScenePlan = {
  marcadorTempo: string;
  objetivo: string;
  descrição: string;
  sugestãoVisual: string;
};

const defaultSteps: AgentStep[] = [
  {
    id: "briefing",
    título: "Agente de Briefing",
    descrição:
      "Interpreta o briefing do canal e define o posicionamento estratégico do vídeo.",
    status: "pendente",
  },
  {
    id: "roteiro",
    título: "Agente de Roteiro",
    descrição:
      "Constrói narrativa completa com gancho, estrutura lógica e CTA forte.",
    status: "pendente",
  },
  {
    id: "narracao",
    título: "Agente de Narração",
    descrição:
      "Define tom de voz, ritmo e orientações para captação de áudio natural.",
    status: "pendente",
  },
  {
    id: "storyboard",
    título: "Agente de Storyboard",
    descrição:
      "Transforma o roteiro em cenas com sugestões de takes e movimento.",
    status: "pendente",
  },
  {
    id: "posproducao",
    título: "Agente de Pós",
    descrição:
      "Lista assets visuais, trilha, B-roll, legendas e tarefas finais.",
    status: "pendente",
  },
];

const tones = [
  "Motivacional",
  "Educativo",
  "Humor inteligente",
  "Documental",
  "Storytelling pessoal",
  "Review técnico",
];

const durations = [
  { label: "Curto (3-5 min)", value: "curto" },
  { label: "Médio (6-10 min)", value: "médio" },
  { label: "Longo (11-15 min)", value: "longo" },
];

const formats = [
  "Guia passo a passo",
  "Lista de insights",
  "Estudo de caso",
  "Notícia comentada",
  "Análise de tendências",
  "Narrativa cinematográfica",
];

const timeMarkers = {
  curto: ["00:00", "00:45", "01:30", "02:15", "03:00"],
  médio: ["00:00", "01:00", "02:30", "04:00", "06:30", "09:00"],
  longo: ["00:00", "01:30", "03:30", "06:00", "09:30", "12:00", "14:30"],
};

export default function Home() {
  const [nicho, setNicho] = useState("");
  const [tema, setTema] = useState("");
  const [audiência, setAudiência] = useState("");
  const [tom, setTom] = useState(tones[0]);
  const [duração, setDuração] = useState(durations[1].value);
  const [formato, setFormato] = useState(formats[0]);
  const [cta, setCta] = useState("Inscreva-se e baixe o material extra na descrição.");
  const [palavraChave, setPalavraChave] = useState("");
  const [benefícioPrincipal, setBenefícioPrincipal] = useState("");
  const [passos, setPassos] = useState<AgentStep[]>(defaultSteps);
  const [resultado, setResultado] = useState<WorkflowResult | null>(null);
  const [executando, setExecutando] = useState(false);

  const prontoParaExecutar = useMemo(() => {
    return (
      nicho.trim().length > 3 &&
      tema.trim().length > 3 &&
      audiência.trim().length > 3 &&
      palavraChave.trim().length > 2 &&
      benefícioPrincipal.trim().length > 5
    );
  }, [audiência, benefícioPrincipal, nicho, palavraChave, tema]);

  const resetarWorkflow = () => {
    setPassos(defaultSteps);
    setResultado(null);
    setExecutando(false);
  };

  const simularExecução = async () => {
    if (!prontoParaExecutar) {
      return;
    }

    setExecutando(true);
    setPassos(defaultSteps.map((step) => ({ ...step, status: "pendente", saída: "" })));
    setResultado(null);

    const novoResultado: WorkflowResult = {
      roteiro: gerarRoteiro(),
      narrativa: gerarNarrativa(),
      cenas: gerarCenas(),
      broll: gerarBroll(),
      tarefas: gerarTarefas(),
      checklist: gerarChecklist(),
    };

    for (const step of defaultSteps) {
      setPassos((prev) =>
        prev.map((item) =>
          item.id === step.id
            ? { ...item, status: "executando", saída: undefined }
            : item,
        ),
      );

      await esperar(650);

      const saída = extrairSaída(step.id, novoResultado);

      setPassos((prev) =>
        prev.map((item) =>
          item.id === step.id
            ? { ...item, status: "concluído", saída }
            : item,
        ),
      );

      await esperar(250);
    }

    setResultado(novoResultado);
    setExecutando(false);
  };

  const extrairSaída = (id: string, dados: WorkflowResult) => {
    switch (id) {
      case "briefing":
        return [
          `Público: ${audiência}`,
          `Posicionamento: ${nicho}`,
          `Promessa central: ${benefícioPrincipal}`,
        ].join("\n");
      case "roteiro":
        return [
          `Gancho: ${dados.roteiro.gancho}`,
          `Tópicos: ${dados.roteiro.tópicos.length}`,
          `CTA: ${cta}`,
        ].join("\n");
      case "narracao":
        return [
          `Tom: ${dados.narrativa.tom}`,
          `Ritmo: ${dados.narrativa.ritmo}`,
          `Ênfases: ${dados.narrativa.frasesDeÊnfase.length}`,
        ].join("\n");
      case "storyboard":
        return `Cenas geradas: ${dados.cenas.length}`;
      case "posproducao":
        return `B-roll sugerido: ${dados.broll.length} clipes\nTarefas finais: ${dados.tarefas.length}`;
      default:
        return "";
    }
  };

  const gerarRoteiro = (): VideoScript => {
    const clima = tom.toLowerCase();
    const foco = benefícioPrincipal || tema;

    const tópicos = [
      {
        título: "Contexto e oportunidade",
        conteúdo: `Por que o tema "${tema}" é crítico para ${audiência}. Mostre dados ou números que validem a urgência e conecte com o formato ${formato.toLowerCase()}.`,
      },
      {
        título: "Plano passo a passo",
        conteúdo: `Apresente de 3 a 5 passos claros que geram o resultado prometido. Use linguagem direta, exemplos do nicho ${nicho} e reforce a palavra-chave "${palavraChave}".`,
      },
      {
        título: "Virada emocional",
        conteúdo: `Relato pessoal ou case curto que mostre transformação real. Construa tensão e alivie com a solução proposta mantendo o tom ${clima}.`,
      },
    ];

    const gancho = `Você está ignorando ${palavraChave}? Em menos de ${
      duração === "curto" ? "5" : duração === "médio" ? "10" : "15"
    } minutos eu te mostro como ${foco.toLowerCase()}.`;

    const introdução = `Este vídeo é para ${audiência}. Vamos mergulhar em ${tema} com um olhar ${clima}, trazendo estratégias comprovadas no universo ${nicho}.`;

    const conclusão = `Recapitulando: ${tópicos
      .map((top) => top.título.toLowerCase())
      .join(", ")}. ${cta}`;

    return { gancho, introdução, tópicos, conclusão };
  };

  const gerarNarrativa = (): NarrationPlan => {
    const ritmo =
      duração === "curto"
        ? "Dinâmico, frases curtas, pouca pausa"
        : duração === "médio"
        ? "Ritmo equilibrado com respiros estratégicos"
        : "Ritmo cadenciado, ênfase em storytelling";

    const pausas = [
      "Após o gancho inicial para deixar a mensagem assentar",
      "No final de cada passo importante para reforçar memorização",
      "Antes da CTA final para gerar atenção",
    ];

    const frasesDeÊnfase = [
      benefícioPrincipal,
      `O maior erro em ${tema}`,
      `Transformação real para ${audiência}`,
    ].filter((item) => item.trim().length > 0);

    return {
      tom,
      ritmo,
      pausas,
      frasesDeÊnfase,
    };
  };

  const gerarCenas = (): ScenePlan[] => {
    const marcadores = timeMarkers[duração as keyof typeof timeMarkers];
    const base: ScenePlan[] = [
      {
        marcadorTempo: marcadores[0] ?? "00:00",
        objetivo: "Capturar atenção imediata",
        descrição:
          "Host em close-up com energia e pergunta provocativa sobre o problema do público.",
        sugestãoVisual:
          "Close dinâmico + texto animado ressaltando a dor principal com a palavra-chave.",
      },
      {
        marcadorTempo: marcadores[1] ?? "00:45",
        objetivo: "Contextualizar o problema",
        descrição:
          "Cortes rápidos do universo do nicho mostrando o cenário atual e números-chave.",
        sugestãoVisual:
          "Motion graphics com estatísticas, tela dividida com múltiplos exemplos.",
      },
      {
        marcadorTempo: marcadores[2] ?? "01:30",
        objetivo: "Entregar framework",
        descrição:
          "Apresentação passo a passo com quadros, post-its ou tela compartilhada.",
        sugestãoVisual:
          "B-roll com mão escrevendo, animação com setas guiando o passo a passo.",
      },
      {
        marcadorTempo: marcadores[3] ?? "02:15",
        objetivo: "Storytelling",
        descrição:
          "Cena com luz mais baixa ou cenário alternativo para relato pessoal/cliente.",
        sugestãoVisual:
          "Overlays com fotos reais, texto com momentos-chave da transformação.",
      },
      {
        marcadorTempo: marcadores[4] ?? "03:00",
        objetivo: "Chamada para ação",
        descrição:
          "Retorno ao cenário principal, olhar direto para câmera reforçando CTA.",
        sugestãoVisual:
          "Texto animado com CTA, ícones do YouTube e link para material extra.",
      },
    ];

    return base;
  };

  const gerarBroll = () => {
    return [
      `Cenas de contexto do nicho ${nicho}`,
      `Planos detalhe ilustrando "${palavraChave}"`,
      "Footage de resultados ou antes/depois",
      "Gráficos animados com percentuais relevantes",
      "Clipes da persona enfrentando o problema citado",
    ];
  };

  const gerarTarefas = () => {
    return [
      "Escrever descrição otimizada com palavra-chave nas 120 primeiras letras.",
      "Criar thumbnail com duas versões A/B e headline com contraste alto.",
      "Preparar pacote de legendas automáticas e revisar termos técnicos.",
      "Selecionar trilha sem direitos autorais com três camadas de intensidade.",
      "Configurar cartões finais e telas finais com playlists relacionadas.",
    ];
  };

  const gerarChecklist = () => {
    return [
      "Hook gravado com três variações de entonação.",
      "Assets visuais organizados em pastas: roteiro, B-roll, gráficos.",
      "Roteiro convertido em teleprompter com marcações de pausa.",
      "Checklist de SEO: título, tags, descrição, capítulos.",
      "Fluxo de automação: upload, legendas, thumbnail, publicação.",
    ];
  };

  const esperar = (tempo: number) =>
    new Promise((resolve) => setTimeout(resolve, tempo));

  return (
    <div className="min-h-screen bg-zinc-100 pb-24 text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">
              Estúdio Agentic para YouTube
            </h1>
            <p className="text-sm text-zinc-600">
              Um agente inteligente que gera roteiro, storyboard e plano de produção completo para o seu próximo vídeo.
            </p>
          </div>
          <button
            onClick={resetarWorkflow}
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900"
            disabled={executando}
          >
            Resetar projeto
          </button>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl gap-6 px-6 pt-10 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.1fr)]">
        <section className="flex flex-col gap-6">
          <article className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Briefing do Vídeo</h2>
                <p className="text-sm text-zinc-500">
                  Quanto mais detalhe, mais preciso será o plano do agente.
                </p>
              </div>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">
                Input Criativo
              </span>
            </div>

            <form
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault();
                void simularExecução();
              }}
            >
              <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700 md:col-span-2">
                Nicho do canal
                <input
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2 text-base text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200"
                  placeholder="Ex: Marketing digital para pequenos negócios"
                  value={nicho}
                  onChange={(event) => setNicho(event.target.value)}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700 md:col-span-2">
                Tema do vídeo
                <input
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2 text-base text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200"
                  placeholder="Ex: Como captar clientes usando Instagram Reels"
                  value={tema}
                  onChange={(event) => setTema(event.target.value)}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
                Persona alvo
                <input
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2 text-base text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200"
                  placeholder="Ex: Donos de pequenas clínicas de estética"
                  value={audiência}
                  onChange={(event) => setAudiência(event.target.value)}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
                Palavra-chave principal
                <input
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2 text-base text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200"
                  placeholder="Ex: Instagram para negócios locais"
                  value={palavraChave}
                  onChange={(event) => setPalavraChave(event.target.value)}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
                Benefício principal
                <input
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2 text-base text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200"
                  placeholder="Ex: Criar uma máquina previsível de geração de leads"
                  value={benefícioPrincipal}
                  onChange={(event) => setBenefícioPrincipal(event.target.value)}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
                Tom/Timbre desejado
                <div className="flex flex-wrap gap-2">
                  {tones.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setTom(item)}
                      className={`rounded-full border px-3 py-1 text-sm transition ${
                        tom === item
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
                Duração alvo
                <div className="flex flex-wrap gap-2">
                  {durations.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setDuração(item.value)}
                      className={`rounded-full border px-3 py-1 text-sm transition ${
                        duração === item.value
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700 md:col-span-2">
                Formato narrativo
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {formats.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setFormato(item)}
                      className={`rounded-xl border px-3 py-2 text-sm transition text-left ${
                        formato === item
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700 md:col-span-2">
                Call to action
                <input
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2 text-base text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200"
                  placeholder="Ex: Baixe o checklist gratuito na descrição"
                  value={cta}
                  onChange={(event) => setCta(event.target.value)}
                />
              </label>

              <button
                type="submit"
                className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
                disabled={!prontoParaExecutar || executando}
              >
                {executando ? "Gerando…" : "Rodar agente e gerar vídeo"}
              </button>
            </form>
          </article>

          <article className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Execução em tempo real</h2>
                <p className="text-sm text-zinc-500">
                  Acompanhe cada agente trabalhando no plano do vídeo.
                </p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Orquestração
              </span>
            </div>
            <ul className="flex flex-col gap-4">
              {passos.map((passo) => (
                <li
                  key={passo.id}
                  className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-zinc-900">
                        {passo.título}
                      </h3>
                      <p className="text-sm text-zinc-500">{passo.descrição}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        passo.status === "concluído"
                          ? "bg-emerald-100 text-emerald-700"
                          : passo.status === "executando"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-zinc-200 text-zinc-600"
                      }`}
                    >
                      {passo.status.toUpperCase()}
                    </span>
                  </div>
                  {passo.saída && (
                    <pre className="mt-3 overflow-x-auto rounded-xl bg-white p-3 text-xs text-zinc-700">
                      {passo.saída}
                    </pre>
                  )}
                </li>
              ))}
            </ul>
          </article>
        </section>

        <aside className="flex flex-col gap-6">
          <article className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Blueprint do vídeo</h2>
              <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                Output
              </span>
            </div>
            {resultado ? (
              <div className="mt-4 space-y-4 text-sm text-zinc-700">
                <section>
                  <h3 className="font-semibold text-zinc-900">Gancho</h3>
                  <p>{resultado.roteiro.gancho}</p>
                </section>
                <section>
                  <h3 className="font-semibold text-zinc-900">Introdução</h3>
                  <p>{resultado.roteiro.introdução}</p>
                </section>
                <section>
                  <h3 className="font-semibold text-zinc-900">Seções principais</h3>
                  <ul className="mt-2 space-y-2">
                    {resultado.roteiro.tópicos.map((topico) => (
                      <li
                        key={topico.título}
                        className="rounded-xl border border-zinc-200 bg-white p-3"
                      >
                        <p className="text-xs uppercase tracking-wide text-zinc-500">
                          {topico.título}
                        </p>
                        <p>{topico.conteúdo}</p>
                      </li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3 className="font-semibold text-zinc-900">Conclusão & CTA</h3>
                  <p>{resultado.roteiro.conclusão}</p>
                </section>
                <section>
                  <h3 className="font-semibold text-zinc-900">
                    Direção de narração
                  </h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>
                      <strong>Tom:</strong> {resultado.narrativa.tom}
                    </li>
                    <li>
                      <strong>Ritmo:</strong> {resultado.narrativa.ritmo}
                    </li>
                    <li>
                      <strong>Pausas estratégicas:</strong>{" "}
                      {resultado.narrativa.pausas.join(" • ")}
                    </li>
                    <li>
                      <strong>Frases para ênfase:</strong>{" "}
                      {resultado.narrativa.frasesDeÊnfase.join(" • ")}
                    </li>
                  </ul>
                </section>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-zinc-200 p-6 text-sm text-zinc-500">
                Preencha o briefing e rode o agente para gerar o material completo do vídeo.
              </div>
            )}
          </article>

          <article className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Storyboard em cenas</h2>
            {resultado ? (
              <ul className="mt-4 space-y-3 text-sm text-zinc-700">
                {resultado.cenas.map((cena) => (
                  <li
                    key={cena.marcadorTempo}
                    className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      <span>{cena.marcadorTempo}</span>
                      <span>{cena.objetivo}</span>
                    </div>
                    <p className="mt-2 font-medium text-zinc-900">
                      {cena.descrição}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {cena.sugestãoVisual}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-zinc-200 p-6 text-sm text-zinc-500">
                O storyboard será liberado após a conclusão do fluxo dos agentes.
              </div>
            )}
          </article>

          <article className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Pacote de produção</h2>
            {resultado ? (
              <div className="mt-4 space-y-4 text-sm text-zinc-700">
                <section>
                  <h3 className="font-semibold text-zinc-900">Sugestões de B-roll</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {resultado.broll.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3 className="font-semibold text-zinc-900">Tarefas operacionais</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {resultado.tarefas.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3 className="font-semibold text-zinc-900">
                    Checklist pronto antes de publicar
                  </h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {resultado.checklist.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-zinc-200 p-6 text-sm text-zinc-500">
                O pacote de produção será liberado ao final do fluxo agentic.
              </div>
            )}
          </article>
        </aside>
      </main>
    </div>
  );
}

