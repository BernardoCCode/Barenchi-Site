export type ServiceId =
  | 'landing'
  | 'systems'
  | 'automation'
  | 'ecosystems'
  | 'integrations'
  | 'design'
  | 'architecture'

export type Service = {
  id: ServiceId
  number: string
  label: string
  title: string
  description: string
  sectionTitle: string
  sectionLead: string
  deliverables: string[]
}

export const SERVICES: Service[] = [
  {
    id: 'design',
    number: '06',
    label: 'DESIGN',
    title: 'Design',
    description: 'Complex products made simple to operate.',
    sectionTitle: 'Interfaces that make complex products feel simple.',
    sectionLead:
      'Design here is not decoration. It is the layer that decides whether people can actually operate the thing you built.',
    deliverables: ['Product design', 'Design systems', 'Prototyping', 'Brand and identity'],
  },
  {
    id: 'ecosystems',
    number: '04',
    label: 'ECOSYSTEMS',
    title: 'Ecosystems',
    description: 'Commerce, channels and ops as one piece.',
    sectionTitle: 'The store, the tools, and what happens after the sale.',
    sectionLead:
      'Ecommerce does not live in a single checkout. We connect storefront, stock, payments, messaging and the rest so the sale continues after the click.',
    deliverables: ['Storefront and catalog', 'Checkout and payments', 'Stock and fulfilment', 'Channels and after-sale'],
  },
  {
    id: 'integrations',
    number: '05',
    label: 'INTEGRATIONS',
    title: 'Integrations',
    description: 'Systems that finally agree with each other.',
    sectionTitle: 'Your tools stop disagreeing with each other.',
    sectionLead:
      'One record, one source of truth. We connect the software you already pay for so data moves on its own.',
    deliverables: ['API integrations', 'Data synchronisation', 'Webhooks and queues', 'Migrations'],
  },
  {
    id: 'automation',
    number: '03',
    label: 'AUTOMATION',
    title: 'Automation',
    description: 'Repeatable work, handled quietly.',
    sectionTitle: 'Repeatable work becomes a quiet layer.',
    sectionLead:
      'The work that eats the week (rekeying, chasing, checking) turns into something the system does without being asked.',
    deliverables: ['Process mapping', 'Workflow automation', 'Scheduled jobs', 'Alerting'],
  },
  {
    id: 'systems',
    number: '02',
    label: 'CUSTOM SYSTEMS',
    title: 'Custom systems',
    description: 'Software shaped to your actual workflow.',
    sectionTitle: 'Software designed around the way your business actually works.',
    sectionLead:
      'ERP, CRM and internal tools modelled on your real operation instead of forcing the operation into someone else’s product.',
    deliverables: ['ERP and CRM layers', 'Internal tools', 'Roles and permissions', 'Reporting'],
  },
  {
    id: 'landing',
    number: '01',
    label: 'LANDING PAGES',
    title: 'Landing pages',
    description: 'Attention turned into conversations.',
    sectionTitle: 'Pages that turn attention into conversations.',
    sectionLead:
      'A landing page is an argument made visible. We build the narrative, the interface and the measurement together.',
    deliverables: ['Positioning and narrative', 'Design and build', 'Performance budget', 'Analytics'],
  },
  {
    id: 'architecture',
    number: '07',
    label: 'ARCHITECTURE',
    title: 'Architecture',
    description: 'Foundations that hold as you grow.',
    sectionTitle: 'Foundations that hold when the business grows.',
    sectionLead:
      'How modules connect, how data moves, what happens at ten times the volume. Decided on purpose, not discovered later.',
    deliverables: ['System architecture', 'Data modelling', 'Infrastructure', 'Observability'],
  },
]

export const SERVICES_IN_ORDER = [...SERVICES].sort((a, b) => a.number.localeCompare(b.number))

export const HOME_SOLUTION_IDS = [
  'landing',
  'systems',
  'automation',
  'ecosystems',
] as const satisfies readonly ServiceId[]

export const SOLUTION_SPECIMENS: Record<(typeof HOME_SOLUTION_IDS)[number], string> = {
  landing: '/solutions/landing.png',
  systems: '/solutions/systems.png',
  automation: '/solutions/automation.png',
  ecosystems: '/solutions/ecosystems.png',
}

export const HOME_SOLUTIONS = HOME_SOLUTION_IDS.map((id) => {
  const service = SERVICES_IN_ORDER.find((entry) => entry.id === id)
  if (!service) throw new Error(`Missing home solution: ${id}`)
  return service
})

export const sectionId = (id: ServiceId) => `service-${id}`
