import type { Messages } from '../types'

export const en: Messages = {
  meta: {
    title: 'Custom software for your business | Barenchi',
    description:
      'Barenchi builds landing pages, custom systems and automation around the way you already work. Tell us what you want to ship.',
  },
  company: {
    tagline: 'Software, design and technology for businesses that want to move forward.',
  },
  nav: {
    solutions: 'Services',
    studio: 'Approach',
    about: 'About',
    contact: 'Contact',
  },
  common: {
    talkToUs: { word: 'Talk', rest: 'to us' },
    startProject: 'Start a project',
    solutions: 'Services',
    questions: 'Questions',
    contact: 'Contact',
    studio: 'Company',
    work: 'Work',
    faq: 'FAQ',
    copyright: 'Custom software.',
    skipToContent: 'Skip to content',
    updated: 'Updated',
  },
  navUi: {
    primary: 'Primary',
    mobile: 'Mobile',
    copyEmail: 'Copy email',
    emailCopied: 'Copied',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
  hero: {
    hidden: 'Custom software for your business.',
    colLeft: ['Custom', 'software'],
    colRight: ['for your', 'business.'],
    capabilitiesIntro: 'Barenchi builds custom software. Capabilities:',
    film: 'Film of Barenchi building custom software for businesses.',
  },
  services: {
    headline: ['Your business.', 'Our technology.'],
    tablistLabel: 'Services',
    home: {
      landing: {
        title: 'Landing pages',
        headline: 'Turn attention into conversations.',
        lead: 'We design and build landing pages that make your business easier to understand, trust and choose.',
        notes: ['Positioning', 'Design', 'Development', 'Performance', 'Analytics'],
      },
      systems: {
        title: 'Custom systems',
        headline: 'Software that fits the way you work.',
        lead: "We build systems around your processes, rules and goals, instead of forcing your business into someone else's software.",
        notes: ['Business logic', 'APIs', 'Dashboards', 'Integrations', 'Data'],
      },
      automation: {
        title: 'Automation',
        headline: 'Less repetition. More movement.',
        lead: 'We connect the repetitive parts of your operation so work moves forward without constant manual intervention.',
        notes: ['Workflows', 'Integrations', 'Triggers', 'Notifications', 'Process automation'],
      },
      ecosystems: {
        title: 'Ecosystems',
        headline: 'The sale does not end at checkout.',
        lead: 'We assemble ecommerce ecosystems: store, stock, payments, CRM and channels, so the operation holds as one piece.',
        notes: ['Storefront', 'Catalog', 'Payments', 'Fulfilment', 'Channels'],
      },
    },
    demo: {
      landing: {
        nav: 'Talk',
        display: ['An argument.', 'Then a door.'],
        aside: 'The page states the offer, earns trust, and makes the next step obvious.',
        cta: 'Begin',
        beats: [
          { label: 'The offer', detail: 'What you sell, in one breath.' },
          { label: 'The proof', detail: 'Why it holds.' },
          { label: 'The ask', detail: 'What happens next.' },
        ],
      },
      systems: {
        hub: 'System',
        nodes: ['Finance', 'Sales', 'Operations', 'Rules', 'API', 'Data'],
        foot: 'One system. The rest is surface.',
      },
      automation: {
        steps: [
          { name: 'New lead', kind: 'Trigger' },
          { name: 'Qualify', kind: 'Process' },
          { name: 'CRM', kind: 'Decision' },
          { name: 'WhatsApp', kind: 'Action' },
          { name: 'Follow-up', kind: 'Process' },
          { name: 'Convert', kind: 'Result' },
        ],
        events: [
          'Lead captured from the form.',
          'Score passed. Routed to sales.',
          'Record opened in the CRM.',
          'First message sent on WhatsApp.',
          'Follow-up queued for tomorrow.',
          'Deal marked as won.',
        ],
        foot: 'Work moves without being asked.',
      },
      ecosystems: {
        shop: 'The shop',
        bag: '1 item',
        garment: 'Linen shirt',
        buy: 'Add to bag',
        rooms: ['Storefront', 'Payment', 'Stock', 'After-sale'],
        floors: [
          'The customer picked it from the storefront.',
          'Payment went through.',
          'The order is packed and ready to ship.',
          'The conversation with the customer stays open.',
        ],
        checkout: [
          { label: 'Item', value: 'Shirt · M' },
          { label: 'Payment', value: 'Card · Pix' },
          { label: 'Status', value: 'Paid' },
        ],
        stock: [
          { label: 'Shirt', fill: 'a' },
          { label: 'Belt', fill: 'b' },
          { label: 'Bag', fill: 'c' },
        ],
        stockNote: 'Ready to ship.',
        afterSale: [
          { who: 'Shop', text: 'Left today.' },
          { who: 'Buyer', text: 'Pickup at 2pm.' },
        ],
        foot: 'The conversation with the customer stays open.',
      },
    },
  },
  studio: {
    kicker: 'The approach',
    headline: ["We don't sell", 'a mold.'],
    intro: 'You already have a way of working. We build the software that can hold it.',
    beliefs: [
      {
        title: 'Your way of working comes first.',
        description:
          "If it lives in someone's head, a spreadsheet, or a WhatsApp thread, that's already how the business runs. We start there.",
        tag: 'Head · Spreadsheet · WhatsApp',
      },
      {
        title: 'Essentials first, then the rest.',
        description:
          'We ship something your team can use day to day. Only then do we expand what actually makes sense.',
        tag: 'Essentials first',
      },
      {
        title: 'The system stays yours.',
        description:
          'Your information, rules, and control stay with you. No rented platform fees, no forcing the business into a mold.',
        tag: 'Your data · Your rules',
      },
    ],
  },
  process: {
    kicker: 'The process',
    headline: ['From conversation', 'to a product in the world.'],
    lead: 'Four phases: one continuous thread from the first call to a live product you never have to host yourself.',
    steps: [
      {
        title: 'Understand',
        copy: 'We start by understanding the real problem: what is broken, who is waiting, and what outcome actually matters.',
      },
      {
        title: 'Shape together',
        copy: 'We talk through the best path forward and shape the solution around what you want, not a generic product mold.',
      },
      {
        title: 'Build',
        copy: 'We build it in focused slices: a working core first, then the parts the business is ready to absorb.',
      },
      {
        title: 'Launch & run',
        copy: 'Everything goes live already hosted and maintained by us. You do not manage servers, updates, or uptime. We do.',
      },
    ],
  },
  about: {
    headline: ['Software built around', 'the way you already work.'],
    showcase: [
      {
        title: 'Hosted & maintained',
        description: 'Live on our infrastructure. Updates, uptime and backups: you never touch a server.',
      },
      {
        title: 'Fully yours',
        description: 'The code, the data and the rules belong to the operation, not a rented seat.',
      },
      {
        title: 'Your stack, connected',
        description: 'CRM, payments, inventory: wired into one flow instead of copy-paste between tabs.',
      },
      {
        title: 'The same team',
        description: 'From the first conversation through launch, and every month after — no switching teams.',
      },
    ],
    status: ['Live', 'Maintained', 'Backed up'],
  },
  faq: {
    kicker: 'FAQ',
    headline: ['Questions', 'worth answering.'],
    fallback: "Can't find it here?",
    talkLink: 'Talk to us.',
    items: [
      {
        question: 'What does Barenchi build?',
        answer:
          'Landing pages, custom systems, ecommerce ecosystems, integrations and automation, shaped to the way a business already works, not to a generic mold.',
      },
      {
        question: 'Who is Barenchi for?',
        answer:
          'Founders and operators who have outgrown off-the-shelf tools, or who need software that follows a real workflow instead of a template.',
      },
      {
        question: 'Can the work follow our brand and process?',
        answer:
          'Yes. Design, architecture and implementation stay close to the operation. Roles, data and the way people actually work are part of the brief.',
      },
      {
        question: 'Do you connect to tools we already use?',
        answer:
          'Yes. Integrations and automation are part of the practice. The tools you already pay for can sit in one flow instead of being retyped between them.',
      },
      {
        question: 'How do we start?',
        answer:
          'Write for us with what you are trying to solve. We turn that into scope, design and a technical path, without asking you to buy a platform first.',
      },
    ],
  },
  contact: {
    kicker: 'Start a project',
    headline: "Have an idea? Let's build it.",
    intro:
      'Tell us what you are trying to solve. We will turn it into a digital product, and the message goes straight to WhatsApp.',
    whatsappHint: 'Write now, no form required.',
    emailHint: 'If you prefer mail instead of chat.',
    instagramHint: 'Follow Barenchi on Instagram.',
    fields: {
      name: {
        label: 'Your name',
        hint: 'Your first name is enough.',
        error: 'Tell us who is writing.',
      },
      email: {
        label: 'Work email',
        hint: 'We reply here if WhatsApp is not available.',
        errorRequired: 'We need an email to continue the conversation.',
        errorInvalid: 'That email does not look complete.',
      },
      message: {
        label: 'What do you want to build?',
        hint: 'A short brief is enough to start.',
        error: 'A few lines on what you want to build.',
      },
    },
    submit: 'Send on WhatsApp',
    submitting: 'Opening WhatsApp…',
    noteIdle: 'Opens WhatsApp with name, email and your note already filled in.',
    noteSent: 'WhatsApp should open with your message ready to send.',
    whatsapp: {
      morning: 'Good morning',
      afternoon: 'Good afternoon',
      evening: 'Good evening',
      called: 'my name is',
      email: 'My email is',
      intent: 'I want to build',
    },
  },
  pages: {
    home: {
      crumb: 'Home',
    },
    about: {
      title: 'Software built around how you already work | Barenchi',
      description:
        'Barenchi hosts and maintains software built around your workflow. The code, data and rules stay yours — from the first call through every month after launch.',
      heading: 'Software built around how you already work.',
      lead: 'We design, host and run systems that follow the operation you already have, instead of asking you to rent a mold.',
      crumb: 'About',
    },
    services: {
      title: 'Landing pages, systems, ecosystems and automation | Barenchi',
      description:
        'High-performance landing pages, custom systems, ecommerce ecosystems and automation, shaped to the way your team already works. See what Barenchi ships.',
      heading: 'Landing pages, systems, ecosystems and automation, built to order.',
      lead: 'We ship high-performance websites, ERP and CRM layers, ecommerce ecosystems, internal tools, and the integrations that keep teams from repeating the same work every week.',
      crumb: 'Services',
      outlineLabel: 'What Barenchi ships',
    },
    contact: {
      title: "Have an idea? Let's build it. | Barenchi",
      description:
        'Tell Barenchi what you want to build. We turn the brief into a digital product and open WhatsApp with your message ready to send. Write today.',
      crumb: 'Contact',
    },
    notfound: {
      title: 'Page not found | Barenchi',
      description: 'This page is not on Barenchi. Go back to the home page to see services and start a project.',
      heading: 'This page is not here.',
      lead: 'The address may have changed. The home page still has the work, the approach, and a way to write to us.',
      crumb: 'Not found',
      back: 'Back to Barenchi',
    },
  },
}
