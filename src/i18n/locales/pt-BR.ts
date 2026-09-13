import type { Messages } from '../types'

export const ptBR: Messages = {
  meta: {
    title: 'Software sob medida para o seu negócio | Barenchi',
    description:
      'A Barenchi constrói landing pages, sistemas sob medida e automação em torno de como o seu negócio já opera. Fale conosco e comece um projeto hoje.',
  },
  company: {
    tagline: 'Software, design e tecnologia para negócios que querem ir além.',
  },
  nav: {
    solutions: 'Serviços',
    studio: 'Abordagem',
    about: 'Sobre',
    contact: 'Contato',
  },
  common: {
    talkToUs: { word: 'Fale', rest: 'conosco' },
    startProject: 'Iniciar um projeto',
    solutions: 'Serviços',
    questions: 'Perguntas',
    contact: 'Contato',
    studio: 'Empresa',
    work: 'Trabalho',
    faq: 'FAQ',
    copyright: 'Software sob medida.',
    skipToContent: 'Ir para o conteúdo',
    updated: 'Atualizado em',
  },
  navUi: {
    primary: 'Principal',
    mobile: 'Mobile',
    copyEmail: 'Copiar e-mail',
    emailCopied: 'Copiado',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
  },
  hero: {
    hidden: 'O software feito para o seu negócio.',
    colLeft: ['Software', 'feito'],
    colRight: ['para o seu', 'negócio.'],
    capabilitiesIntro: 'A Barenchi constrói software sob medida. Capacidades:',
    film: 'Filme da Barenchi construindo software sob medida para negócios.',
  },
  services: {
    headline: ['Seu negócio.', 'Nossa tecnologia.'],
    tablistLabel: 'Serviços',
    home: {
      landing: {
        title: 'Landing pages',
        headline: 'Transforme atenção em conversa.',
        lead: 'Criamos landing pages que deixam seu negócio mais fácil de entender, confiar e escolher.',
        notes: ['Posicionamento', 'Design', 'Desenvolvimento', 'Performance', 'Analytics'],
      },
      systems: {
        title: 'Sistemas sob medida',
        headline: 'Software que encaixa no seu fluxo.',
        lead: 'Construímos sistemas em torno dos seus processos, regras e metas, sem encaixar seu negócio no software de outra pessoa.',
        notes: ['Lógica de negócio', 'APIs', 'Dashboards', 'Integrações', 'Dados'],
      },
      automation: {
        title: 'Automação',
        headline: 'Menos repetição. Mais avanço.',
        lead: 'Conectamos as partes repetitivas da operação para o trabalho fluir sem intervenção manual o tempo todo.',
        notes: ['Fluxos', 'Integrações', 'Gatilhos', 'Notificações', 'Automação de processos'],
      },
      ecosystems: {
        title: 'Ecossistemas',
        headline: 'A venda não termina no checkout.',
        lead: 'Montamos ecossistemas de ecommerce: loja, estoque, pagamentos, CRM e canais, para a operação funcionar como uma peça só.',
        notes: ['Vitrine', 'Catálogo', 'Pagamentos', 'Fulfillment', 'Canais'],
      },
    },
    demo: {
      landing: {
        nav: 'Fale conosco',
        display: ['Um argumento.', 'Depois, a ação.'],
        aside: 'Apresenta a oferta, gera confiança e torna o próximo passo óbvio.',
        cta: 'Começar',
        beats: [
          { label: 'A oferta', detail: 'O que você vende, em uma frase.' },
          { label: 'A prova', detail: 'Por que isso se sustenta.' },
          { label: 'O pedido', detail: 'O que acontece em seguida.' },
        ],
      },
      systems: {
        hub: 'Sistema',
        nodes: ['Finanças', 'Vendas', 'Operação', 'Regras', 'API', 'Dados'],
        foot: 'Um sistema. O resto é superfície.',
      },
      automation: {
        steps: [
          { name: 'Novo lead', kind: 'Gatilho' },
          { name: 'Qualificar', kind: 'Processo' },
          { name: 'CRM', kind: 'Decisão' },
          { name: 'WhatsApp', kind: 'Ação' },
          { name: 'Follow-up', kind: 'Processo' },
          { name: 'Converter', kind: 'Resultado' },
        ],
        events: [
          'Lead capturado pelo formulário.',
          'Score aprovado. Encaminhado para vendas.',
          'Registro aberto no CRM.',
          'Primeira mensagem enviada no WhatsApp.',
          'Follow-up agendado para amanhã.',
          'Negócio marcado como ganho.',
        ],
        foot: 'O trabalho avança sem precisar pedir.',
      },
      ecosystems: {
        shop: 'A loja',
        bag: '1 item',
        garment: 'Camisa de linho',
        buy: 'Adicionar à sacola',
        rooms: ['Vitrine', 'Pagamento', 'Estoque', 'Pós-venda'],
        floors: [
          'O cliente escolheu na vitrine.',
          'O pagamento foi aprovado.',
          'O pedido já está separado para envio.',
          'A conversa com o cliente continua aberta.',
        ],
        checkout: [
          { label: 'Produto', value: 'Camisa · M' },
          { label: 'Pagamento', value: 'Cartão · Pix' },
          { label: 'Status', value: 'Pago' },
        ],
        stock: [
          { label: 'Camisa', fill: 'a' },
          { label: 'Cinto', fill: 'b' },
          { label: 'Bolsa', fill: 'c' },
        ],
        stockNote: 'Pronto para enviar.',
        afterSale: [
          { who: 'Loja', text: 'Saiu hoje.' },
          { who: 'Cliente', text: 'Retira às 14h.' },
        ],
        foot: 'A conversa com o cliente continua aberta.',
      },
    },
  },
  studio: {
    kicker: 'A abordagem',
    headline: ['A gente não vende', 'molde pronto.'],
    intro: 'Você já tem um jeito de operar. Construímos o software que aguenta isso.',
    beliefs: [
      {
        title: 'Seu jeito de operar vem primeiro.',
        description:
          'Na cabeça, na planilha ou no WhatsApp, isso já mostra como o negócio funciona. É daí que começamos.',
        tag: 'Cabeça · Planilha · WhatsApp',
      },
      {
        title: 'Primeiro o essencial, depois o resto.',
        description:
          'Entregamos algo que a equipe já usa no dia a dia. Só depois ampliamos o que fizer sentido.',
        tag: 'O essencial primeiro',
      },
      {
        title: 'O sistema é seu.',
        description:
          'Informação, regras e controle ficam com você. A mensalidade é de manutenção do seu sistema — não o aluguel de um molde.',
        tag: 'Seus dados · Suas regras',
      },
    ],
  },
  process: {
    kicker: 'O processo',
    headline: ['Da conversa', 'ao produto no ar.'],
    lead: 'Quatro fases: um fio contínuo da primeira call ao produto no ar, sem você precisar hospedar nada.',
    steps: [
      {
        title: 'Entender',
        copy: 'Começamos entendendo o problema real: o que está quebrado, quem está esperando e qual resultado de fato importa.',
      },
      {
        title: 'Desenhar juntos',
        copy: 'Conversamos sobre o melhor caminho e moldamos a solução em torno do que você quer, não de um produto genérico.',
      },
      {
        title: 'Construir',
        copy: 'Construímos em fatias focadas: um núcleo funcional primeiro, depois as partes que o negócio está pronto para absorver.',
      },
      {
        title: 'Lançar e manter',
        copy: 'Tudo vai ao ar já hospedado e mantido por nós. Você não gerencia servidor, atualização ou uptime. A gente gerencia.',
      },
    ],
  },
  about: {
    headline: ['Software em torno', 'de como você já opera.'],
    showcase: [
      {
        title: 'Hospedado e mantido',
        description: 'No ar na nossa infraestrutura. Atualizações, uptime e backups: você nunca encosta em um servidor.',
      },
      {
        title: 'Totalmente seu',
        description: 'O código, os dados e as regras pertencem à operação, não a uma licença alugada.',
      },
      {
        title: 'Suas ferramentas, conectadas',
        description: 'CRM, pagamentos, estoque: tudo num fluxo só, em vez de copiar e colar entre abas.',
      },
      {
        title: 'O mesmo time',
        description: 'Da primeira conversa ao lançamento, e todo mês depois, sem trocar de equipe.',
      },
    ],
    status: ['No ar', 'Mantido', 'Com backup'],
  },
  faq: {
    kicker: 'FAQ',
    headline: ['Perguntas', 'que valem resposta.'],
    fallback: 'Não encontrou aqui?',
    talkLink: 'Fale conosco.',
    items: [
      {
        question: 'O que a Barenchi constrói?',
        answer:
          'Landing pages, sistemas sob medida, ecossistemas de ecommerce, integrações e automação, moldados ao jeito de operar de cada negócio, não a um pacote genérico.',
      },
      {
        question: 'Para quem são esses serviços?',
        answer:
          'Fundadores e operadores que já superaram ferramentas prontas, ou que precisam de software que siga um fluxo real, não um template.',
      },
      {
        question: 'Por que uma solução sob medida?',
        answer:
          'Porque cada negócio funciona de um jeito. A Barenchi cria soluções que se adaptam à sua operação, em vez de exigir que você se adapte à tecnologia.',
      },
      {
        question: 'Vocês conectam às ferramentas que já usamos?',
        answer:
          'Sim. Integrações e automação fazem parte do trabalho. As ferramentas que você já paga podem viver num fluxo só, em vez de serem redigitadas entre si.',
      },
      {
        question: 'Como começamos?',
        answer:
          'Escreva para nós o que você quer resolver. A gente transforma isso em escopo, design e caminho técnico, sem pedir para comprar uma plataforma antes.',
      },
    ],
  },
  contact: {
    kicker: 'Fale conosco',
    headline: 'Tem uma ideia? Vamos construir.',
    intro:
      'Conte o que você quer resolver. A gente transforma em produto digital, e a mensagem vai direto pro WhatsApp.',
    whatsappHint: 'Escreva agora, sem precisar do formulário.',
    emailHint: 'Se preferir e-mail em vez de chat.',
    instagramHint: 'Acompanhe a Barenchi no Instagram.',
    fields: {
      name: {
        label: 'Seu nome',
        hint: 'Só o primeiro nome já basta.',
        error: 'Diga quem está escrevendo.',
      },
      email: {
        label: 'E-mail profissional',
        hint: 'Respondemos aqui se o WhatsApp não estiver disponível.',
        errorRequired: 'Precisamos de um e-mail para continuar a conversa.',
        errorInvalid: 'Esse e-mail não parece completo.',
      },
      message: {
        label: 'O que você quer construir?',
        hint: 'Um briefing curto já basta para começar.',
        error: 'Algumas linhas sobre o que você quer construir.',
      },
    },
    submit: 'Enviar no WhatsApp',
    submitting: 'Abrindo WhatsApp…',
    noteIdle: 'Abre o WhatsApp com nome, e-mail e sua mensagem já preenchidos.',
    noteSent: 'O WhatsApp deve abrir com sua mensagem pronta para enviar.',
    whatsapp: {
      morning: 'Bom dia',
      afternoon: 'Boa tarde',
      evening: 'Boa noite',
      called: 'me chamo',
      email: 'Meu e-mail é',
      intent: 'Quero construir',
    },
  },
  pages: {
    home: {
      crumb: 'Início',
    },
    about: {
      title: 'Software em torno de como você já opera | Barenchi',
      description:
        'A Barenchi hospeda e mantém software construído em torno do seu fluxo. Código, dados e regras ficam com você — da primeira call a todo mês depois do lançamento.',
      heading: 'Software em torno de como você já opera.',
      lead: 'A gente desenha, hospeda e opera sistemas que seguem a operação que você já tem, em vez de pedir para alugar um molde.',
      crumb: 'Sobre',
    },
    services: {
      title: 'Landing pages, sistemas, ecossistemas e automação | Barenchi',
      description:
        'Landing pages de alta performance, sistemas sob medida, ecossistemas de ecommerce e automação, moldados ao jeito que o time já trabalha. Veja o que a Barenchi entrega.',
      heading: 'Landing pages, sistemas, ecossistemas e automação, feitos sob medida.',
      lead: 'Entregamos sites de alta performance, camadas de ERP e CRM, ecossistemas de ecommerce, ferramentas internas e as integrações que impedem o time de repetir o mesmo trabalho toda semana.',
      crumb: 'Serviços',
      outlineLabel: 'O que a Barenchi entrega',
    },
    contact: {
      title: 'Tem uma ideia? Vamos construir. | Barenchi',
      description:
        'Conte à Barenchi o que você quer construir. Transformamos o briefing em produto digital e abrimos o WhatsApp com a mensagem pronta. Escreva hoje.',
      crumb: 'Contato',
    },
    notfound: {
      title: 'Página não encontrada | Barenchi',
      description:
        'Esta página não está no site da Barenchi. Volte ao início para ver os serviços e começar um projeto.',
      heading: 'Esta página não está aqui.',
      lead: 'O endereço pode ter mudado. O início ainda tem o trabalho, a abordagem e um jeito de escrever para a gente.',
      crumb: 'Não encontrada',
      back: 'Voltar para a Barenchi',
    },
  },
}
