/**
 * =====================================================================
 * THE CITADEL SCROLL OF CONFIGURATION (REALM CONFIG)
 * =====================================================================
 * You can customize all your personal information, projects, skills, 
 * and house allegiances directly in this file or through the in-app
 * "Citadel Scribe" editor!
 */

window.REALM_CONFIG = {
  // Lord / Developer Identity
  lord: {
    name: "SHAHED ALAM",
    house: "House Full-Stack",
    title: "Warden of the Full Stack & Architect of the Digital Realm",
    motto: "Code is Fire, Architecture is Steel",
    bio: "Forging modern, high-resilience web kingdoms across the digital realms. Master of distributed backends, modern frontend fortresses, and high-performance WebGL experiences.",
    location: "Citadel of Code • Earth",
    availableForHire: true,
    avatar: "assets/sigil-avatar.svg", // Fallback generated sigil
    stats: [
      { label: "Years in the Realm", value: "4+" },
      { label: "Sieges Won (Projects)", value: "35+" },
      { label: "Lines of Valyrian Code", value: "250K+" },
      { label: "Coffee Goblets Drained", value: "1,200+" }
    ],
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      email: "shahed.alam@citadel.realm"
    }
  },

  // Active House Theme (Options: 'targaryen', 'stark', 'lannister', 'nightswatch')
  defaultHouse: "targaryen",

  // The Four Great Houses of Technology
  housesOfTech: [
    {
      id: "frontend",
      houseName: "House of the Iron Interface",
      motto: "Pixel by Pixel, Resilient & Swift",
      sigilIcon: "crown",
      color: "#e6c35c",
      description: "Masters of modern visual craft, responsive kingdoms, and ultra-fluid user interactions.",
      skills: [
        { name: "React 19 & Next.js 15", mastery: 95, rune: "⚛️", role: "Grand Bastion of UI" },
        { name: "TypeScript", mastery: 92, rune: "🛡️", role: "Valyrian Type Safety" },
        { name: "Tailwind CSS & Modern CSS", mastery: 96, rune: "🎨", role: "Aesthetic Armor" },
        { name: "Three.js & WebGL", mastery: 85, rune: "🔮", role: "3D Realm Enchantment" },
        { name: "Redux Toolkit & Zustand", mastery: 90, rune: "⚡", role: "State Treasury" },
        { name: "HTML5 / Semantic Mastery", mastery: 98, rune: "🏛️", role: "Ancient Foundation" }
      ]
    },
    {
      id: "backend",
      houseName: "House of the Iron Citadel",
      motto: "The Server Never Sleeps",
      sigilIcon: "sword",
      color: "#e2583e",
      description: "Forging bulletproof backends, distributed microservices, and impenetrable API fortresses.",
      skills: [
        { name: "Node.js & Express", mastery: 94, rune: "🟢", role: "Engine of the Citadel" },
        { name: "Python & FastAPI / Django", mastery: 88, rune: "🐍", role: "High Maester's Logic" },
        { name: "RESTful & GraphQL APIs", mastery: 92, rune: "📜", role: "Royal Decrees & Protocols" },
        { name: "NestJS & Clean Architecture", mastery: 86, rune: "🏰", role: "Citadel Foundations" },
        { name: "WebSockets & Socket.io", mastery: 90, rune: "🦅", role: "Swift Raven Messenger" },
        { name: "Auth (JWT, OAuth, Session)", mastery: 93, rune: "🗝️", role: "Master of the Keys" }
      ]
    },
    {
      id: "database",
      houseName: "House of the Grand Vaults",
      motto: "No Query Left Unanswered",
      sigilIcon: "scroll",
      color: "#4aa3df",
      description: "Archiving petabytes of lore, ensuring sub-millisecond lookups, and relational integrity.",
      skills: [
        { name: "PostgreSQL & SQL", mastery: 91, rune: "🐘", role: "Imperial Archives" },
        { name: "MongoDB & Mongoose", mastery: 93, rune: "🍃", role: "Document Catacombs" },
        { name: "Redis Caching", mastery: 88, rune: "⚡", role: "Flash Memory Maester" },
        { name: "Prisma & Drizzle ORM", mastery: 90, rune: "💎", role: "Relational Forgemasters" },
        { name: "Database Indexing & Sharding", mastery: 84, rune: "⚖️", role: "Query Optimization" }
      ]
    },
    {
      id: "devops",
      houseName: "House of the High Watchtower",
      motto: "Shield Against System Failure",
      sigilIcon: "shield",
      color: "#9b59b6",
      description: "Guarding deployment pipelines, container fleets, and cloud frontiers against downtime.",
      skills: [
        { name: "Docker & Containerization", mastery: 90, rune: "🐋", role: "Naval Fleet of Ships" },
        { name: "AWS Cloud (S3, EC2, Lambda)", mastery: 85, rune: "☁️", role: "Castles in the Cloud" },
        { name: "Git & GitHub CI/CD Actions", mastery: 95, rune: "⚔️", role: "Battle-Tested Pipelines" },
        { name: "Linux & Bash Alchemy", mastery: 88, rune: "🐧", role: "Ancient Terminal Runes" },
        { name: "Nginx & Reverse Proxies", mastery: 86, rune: "🛡️", role: "The Outer City Gates" }
      ]
    }
  ],

  // Chronicles of Conquest (Projects)
  campaigns: [
    {
      id: "iron-citadel",
      title: "The Iron Citadel E-Commerce Realm",
      house: "House Targaryen",
      sigil: "🐉",
      summary: "A colossal enterprise commerce platform handling millions in digital currency with real-time stock sync.",
      techStack: ["Next.js 15", "TypeScript", "Stripe", "PostgreSQL", "Redis", "Tailwind CSS"],
      image: "assets/project-citadel.svg",
      liveUrl: "https://example.com/citadel",
      githubUrl: "https://github.com/example/iron-citadel",
      battleReport: "Engineered high-throughput checkout processing, sub-50ms product search using Redis caching, and automated inventory sync with PostgreSQL transactions.",
      stats: { "Speed Score": "99/100", "Concurrent Users": "15,000+", "Uptime": "99.99%" }
    },
    {
      id: "raven-whisper",
      title: "The Raven's Whisper: Encrypted Realtime Network",
      house: "House Stark",
      sigil: "🐺",
      summary: "End-to-end encrypted messaging citadel with low-latency audio/video chambers and persistent raven alerts.",
      techStack: ["React 19", "Node.js", "Socket.io", "WebRTC", "MongoDB", "Web Crypto API"],
      image: "assets/project-raven.svg",
      liveUrl: "https://example.com/raven",
      githubUrl: "https://github.com/example/raven-whisper",
      battleReport: "Deployed custom WebSockets architecture supporting instantaneous message broadcasting, peer-to-peer WebRTC video channels, and military-grade encryption.",
      stats: { "Latency": "< 20ms", "Active Ravens": "50,000/day", "Encryption": "AES-GCM 256" }
    },
    {
      id: "maester-tome",
      title: "Maester's Tome: AI Lore & Code Engine",
      house: "House Lannister",
      sigil: "🦁",
      summary: "Autonomous intelligence assistant parsing thousands of ancient scrolls, code repositories, and architectural blueprints.",
      techStack: ["Python", "FastAPI", "OpenAI / Claude API", "Vector DB (Pinecone)", "React", "Tailwind"],
      image: "assets/project-tome.svg",
      liveUrl: "https://example.com/maester",
      githubUrl: "https://github.com/example/maester-tome",
      battleReport: "Designed multi-agent RAG pipeline indexing codebases and technical documentation, providing context-aware code generation and automated test suite creation.",
      stats: { "Query Time": "350ms", "Indexed Scrolls": "1,000,000+", "Accuracy": "98.4%" }
    },
    {
      id: "valyrian-ledger",
      title: "The Valyrian Ledger: Web3 Asset Vault",
      house: "The Night's Watch",
      sigil: "⚔️",
      summary: "Decentralized treasury platform protecting cryptographic vaults, token swaps, and multi-signature royal councils.",
      techStack: ["Solidity", "Ethers.js", "Wagmi", "Next.js", "The Graph", "Foundry"],
      image: "assets/project-vault.svg",
      liveUrl: "https://example.com/valyrian",
      githubUrl: "https://github.com/example/valyrian-ledger",
      battleReport: "Audited smart contracts with reentrancy guards, built real-time event listeners with The Graph, and crafted an intuitive glassmorphic dashboard.",
      stats: { "Secured Assets": "$12M+ TVL", "Gas Optimized": "-38%", "Audit Rating": "Grade A" }
    }
  ],

  // Annals of the Citadel (Timeline / Milestones)
  annals: [
    {
      era: "Season IV • 2024 - Present",
      role: "High Maester & Lead Full Stack Architect",
      citadel: "Kingdom of Tech Enterprises",
      description: "Leading architectural design of multi-region web applications, managing developer cohorts, and orchestrating microservices."
    },
    {
      era: "Season III • 2022 - 2024",
      role: "Warden of Frontend & Full Stack Engineer",
      citadel: "Digital Vanguard Studios",
      description: "Spearheaded migration to Next.js and TypeScript, slashing bundle sizes by 45% and elevating client conversion rates across the realm."
    },
    {
      era: "Season II • 2021 - 2022",
      role: "Sworn Brother (Backend & API Developer)",
      citadel: "The Iron Watch Networks",
      description: "Engineered scalable REST APIs, optimized PostgreSQL relational schemas, and integrated resilient authentication gateways."
    },
    {
      era: "Season I • 2020 - 2021",
      role: "Novice of the Citadel (Self-Taught & Foundations)",
      citadel: "The High Tower of Knowledge",
      description: "Mastered the arcane arts of JavaScript, HTML5, CSS Grid, and Git version control through relentless study and side quests."
    }
  ],

  // Testimonials of the Lords (Endorsements)
  endorsements: [
    {
      lord: "Lord Brandon Vance",
      title: "Chief Technical Officer, Valyrian Tech",
      sigil: "🦅",
      quote: "Shahed possesses rare dual-mastery: the architectural discipline of an ancient stonemason and the blazing speed of dragon fire. The Iron Citadel was delivered weeks ahead of siege."
    },
    {
      lord: "Lady Alysanne Dustin",
      title: "Head of Product, Northwind Digital",
      sigil: "🐺",
      quote: "His code is clean, battle-tested, and immune to downtime. If your kingdom needs a system that withstands millions of queries, call upon this warden."
    },
    {
      lord: "Maester Corlys",
      title: "Principal Architect, Iron Bank Solutions",
      sigil: "💰",
      quote: "A true master of the craft. His deep understanding of both high-performance frontend interfaces and secure backend vaults is unmatched across the realms."
    }
  ]
};
