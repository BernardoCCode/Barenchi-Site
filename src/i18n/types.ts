import type { ServiceId } from '@/shared/constants'

export type Locale = 'en' | 'pt-BR'

export type HomeSolutionId = 'landing' | 'systems' | 'automation' | 'ecosystems'

export type Messages = {
  meta: {
    title: string
    description: string
  }
  company: {
    tagline: string
  }
  nav: {
    solutions: string
    studio: string
    about: string
    contact: string
  }
  common: {
    talkToUs: { word: string; rest: string }
    startProject: string
    solutions: string
    questions: string
    contact: string
    studio: string
    work: string
    faq: string
    copyright: string
    skipToContent: string
    updated: string
  }
  navUi: {
    primary: string
    mobile: string
    copyEmail: string
    emailCopied: string
    openMenu: string
    closeMenu: string
  }
  hero: {
    hidden: string
    colLeft: [string, string]
    colRight: [string, string]
    capabilitiesIntro: string
    film: string
  }
  services: {
    headline: [string, string]
    tablistLabel: string
    home: Record<
      HomeSolutionId,
      {
        title: string
        headline: string
        lead: string
        notes: string[]
      }
    >
    demo: {
      landing: {
        nav: string
        display: [string, string]
        aside: string
        cta: string
        beats: Array<{ label: string; detail: string }>
      }
      systems: {
        hub: string
        nodes: string[]
        foot: string
      }
      automation: {
        steps: Array<{ name: string; kind: string }>
        events: string[]
        foot: string
      }
      ecosystems: {
        shop: string
        bag: string
        garment: string
        buy: string
        rooms: string[]
        floors: string[]
        checkout: Array<{ label: string; value: string }>
        stock: Array<{ label: string; fill: 'a' | 'b' | 'c' }>
        stockNote: string
        afterSale: Array<{ who: string; text: string }>
        foot: string
      }
    }
  }
  studio: {
    kicker: string
    headline: [string, string]
    intro: string
    beliefs: Array<{
      title: string
      description: string
      tag: string
    }>
  }
  process: {
    kicker: string
    headline: [string, string]
    lead: string
    steps: Array<{
      title: string
      copy: string
    }>
  }
  about: {
    headline: [string, string]
    showcase: Array<{
      title: string
      description: string
    }>
    status: [string, string, string]
  }
  faq: {
    kicker: string
    headline: [string, string]
    fallback: string
    talkLink: string
    items: Array<{
      question: string
      answer: string
    }>
  }
  contact: {
    kicker: string
    headline: string
    intro: string
    whatsappHint: string
    emailHint: string
    instagramHint: string
    fields: {
      name: { label: string; hint: string; error: string }
      email: { label: string; hint: string; errorRequired: string; errorInvalid: string }
      message: { label: string; hint: string; error: string }
    }
    submit: string
    submitting: string
    noteIdle: string
    noteSent: string
    whatsapp: {
      morning: string
      afternoon: string
      evening: string
      called: string
      email: string
      intent: string
    }
  }
  pages: {
    home: {
      crumb: string
    }
    about: {
      title: string
      description: string
      heading: string
      lead: string
      crumb: string
    }
    services: {
      title: string
      description: string
      heading: string
      lead: string
      crumb: string
      outlineLabel: string
    }
    contact: {
      title: string
      description: string
      crumb: string
    }
    notfound: {
      title: string
      description: string
      heading: string
      lead: string
      crumb: string
      back: string
    }
  }
}

export type LocalizedService = {
  id: ServiceId
  number: string
  title: string
}
