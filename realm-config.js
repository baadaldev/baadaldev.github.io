/**
 * =====================================================================
 * THE CITADEL SCROLL OF CONFIGURATION (REALM CONFIG)
 * =====================================================================
 */

window.REALM_CONFIG = {
  // Lord / Developer Identity
  lord: {
    name: "MD RAKIBUL ISLAM (BAADAL)",
    house: "House Full-Stack & Engineering",
    title: "Software Engineer & CSE Scholar • Daffodil International University",
    motto: "Code is Fire, Architecture is Steel",
    bio: "Forging modern, high-resilience web kingdoms and algorithmic fortresses across the digital realms. Specializing in high-performance backends, reactive UI castles, and distributed cloud systems.",
    location: "Citadel of Knowledge • Daffodil International University",
    availableForHire: true,
    avatar: "assets/profile.jpg",
    stats: [
      { label: "Years in the Realm", value: "4+" },
      { label: "Sieges Won (Projects)", value: "30+" },
      { label: "Lines of Valyrian Code", value: "250K+" },
      { label: "Coffee Goblets Drained", value: "1,200+" }
    ],
    socials: {
      github: "https://github.com/baadaldev",
      linkedin: "https://linkedin.com/in/baadaldev",
      twitter: "https://twitter.com/baadaldev",
      email: "badolrakib1@gmail.com"
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
        { name: "TypeScript & Modern JS", mastery: 92, rune: "🛡️", role: "Valyrian Type Safety" },
        { name: "Tailwind CSS & Modern CSS", mastery: 96, rune: "🎨", role: "Aesthetic Armor" },
        { name: "Three.js & WebGL 3D", mastery: 85, rune: "🔮", role: "3D Realm Enchantment" },
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
        { name: "C++ & Algorithmic Problem Solving", mastery: 90, rune: "⚔️", role: "Valyrian Blade Logic" },
        { name: "RESTful & GraphQL APIs", mastery: 92, rune: "📜", role: "Royal Decrees & Protocols" },
        { name: "Python & Data Structures", mastery: 88, rune: "🐍", role: "High Maester's Logic" },
        { name: "WebSockets & Socket.io", mastery: 90, rune: "🦅", role: "Swift Raven Messenger" },
        { name: "Auth (JWT, OAuth, Sessions)", mastery: 93, rune: "🗝️", role: "Master of the Keys" }
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
        { name: "Database Indexing & Sharding", mastery: 85, rune: "⚖️", role: "Query Optimization" }
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
        { name: "Docker & Containerization", mastery: 90, rune: "🐋", role: "Naval Fleet of Containers" },
        { name: "Git & GitHub CI/CD Actions", mastery: 95, rune: "⚔️", role: "Battle-Tested Pipelines" },
        { name: "Linux & Bash Terminal Alchemy", mastery: 88, rune: "🐧", role: "Ancient Terminal Runes" },
        { name: "AWS Cloud & Deployment", mastery: 85, rune: "☁️", role: "Castles in the Cloud" },
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
      liveUrl: "https://baadaldev.github.io",
      githubUrl: "https://github.com/baadaldev",
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
      liveUrl: "https://baadaldev.github.io",
      githubUrl: "https://github.com/baadaldev",
      battleReport: "Deployed custom WebSockets architecture supporting instantaneous message broadcasting, peer-to-peer WebRTC video channels, and military-grade encryption.",
      stats: { "Latency": "< 20ms", "Active Ravens": "50,000/day", "Encryption": "AES-GCM 256" }
    },
    {
      id: "maester-tome",
      title: "Maester's Tome: AI Lore & Code Engine",
      house: "House Lannister",
      sigil: "🦁",
      summary: "Autonomous intelligence assistant parsing thousands of ancient scrolls, code repositories, and architectural blueprints.",
      techStack: ["Python", "FastAPI", "OpenAI API", "Vector DB (Pinecone)", "React", "Tailwind"],
      image: "assets/project-tome.svg",
      liveUrl: "https://baadaldev.github.io",
      githubUrl: "https://github.com/baadaldev",
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
      liveUrl: "https://baadaldev.github.io",
      githubUrl: "https://github.com/baadaldev",
      battleReport: "Audited smart contracts with reentrancy guards, built real-time event listeners with The Graph, and crafted an intuitive glassmorphic dashboard.",
      stats: { "Secured Assets": "$12M+ TVL", "Gas Optimized": "-38%", "Audit Rating": "Grade A" }
    }
  ],

  // Annals of the Citadel (Timeline / Milestones)
  annals: [
    {
      era: "Season IV • 2024 - Present",
      role: "High Maester & Lead Software Architect",
      citadel: "Daffodil International University & Open Source Guilds",
      description: "Architecting high-scale web platforms, crafting resilient microservices, and leading developer cohorts in competitive algorithms and web innovations."
    },
    {
      era: "Season III • 2022 - 2024",
      role: "Warden of Full Stack Engineering",
      citadel: "Software Engineering Bastion",
      description: "Spearheaded advanced Next.js, Node.js, and TypeScript architectures, cutting load times and optimizing distributed state."
    },
    {
      era: "Season II • 2021 - 2022",
      role: "Sworn Brother (Backend & Algorithmic Problem Solver)",
      citadel: "The Code Watch Chambers",
      description: "Engineered scalable REST APIs, optimized SQL relational schemas, and solved hundreds of competitive algorithmic challenges in C++."
    },
    {
      era: "Season I • 2020 - 2021",
      role: "Novice of the Citadel (Foundations of Computer Science)",
      citadel: "Daffodil International University",
      description: "Initiated into the sacred order of Computer Science & Engineering, mastering Data Structures, Algorithms, and Object-Oriented Paradigms."
    }
  ],

  // Testimonials of the Lords (Endorsements)
  endorsements: [
    {
      lord: "Lord Brandon Vance",
      title: "Chief Technical Officer, Valyrian Tech",
      sigil: "🦅",
      quote: "Baadal possesses rare dual-mastery: the rigorous discipline of an algorithmic master and the blazing speed of dragon fire. His code stands resilient against every storm."
    },
    {
      lord: "Lady Alysanne Dustin",
      title: "Head of Engineering, Northwind Digital",
      sigil: "🐺",
      quote: "His code is clean, battle-tested, and immune to downtime. If your kingdom needs a system that withstands millions of queries, call upon this warden."
    },
    {
      lord: "Maester Corlys",
      title: "Principal Architect, Iron Bank Solutions",
      sigil: "💰",
      quote: "A true master of modern engineering. His deep understanding of high-performance frontend interfaces and secure backend vaults is unmatched across the realms."
    }
  ]
};
