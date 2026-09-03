/**
 * §9.9 Careers.
 *
 * Locked strings ship verbatim. Culture / “why build” / “how we work” bands
 * are presentation structure for the careers page — soft team language only,
 * no product claims beyond what the hero + hiring line already say.
 *
 * Open roles: `DEFAULT_CAREERS_ROLES` seeds the site until CMS saves
 * `careers.roles` via `/admin/careers`.
 */

export const CAREERS = {
  title: "Build Something That Matters.",
  titleLines: ["Build Something", "That Matters."] as const,
  lead: "IST is building technology that does not exist yet — and we are looking for the engineers who want to build it with us. We are a small, focused team operating at the frontier of networked systems, and every person we hire has an outsized impact on what we build and how we build it.",
  /** [LOCKED] — verbatim. */
  hiringLine:
    "The technology of tomorrow needs the brightest minds of today. If you thrive on hard challenges, love the pace of real innovation, and want high autonomy with the responsibility to match — come help build something that matters. Get in on the ground floor.",
} as const;

/** Split of the locked hiring line for the featured band accent. */
export const HIRING_BAND = {
  before: "The technology of tomorrow needs",
  accent: "the brightest minds of today.",
  /** Rest of the locked line — kept available if a longer treatment is needed. */
  after:
    "If you thrive on hard challenges, love the pace of real innovation, and want high autonomy with the responsibility to match — come help build something that matters. Get in on the ground floor.",
  /** Traits drawn from the locked hiring line (autonomy / responsibility / impact). */
  traits: [
    {
      id: "autonomy",
      title: "High autonomy.",
      body: "Own problems end to end.",
      icon: "person" as const,
    },
    {
      id: "responsibility",
      title: "High responsibility.",
      body: "Trusted to deliver where it matters.",
      icon: "shield" as const,
    },
    {
      id: "impact",
      title: "High impact.",
      body: "Your work changes what's possible.",
      icon: "star" as const,
    },
  ],
} as const;

/**
 * Why-build pillars — themes already present in the approved hero lead
 * (hard challenges, outsized impact, small team, frontier networked systems).
 */
export const WHY_BUILD = {
  title: "Why Build at IST",
  items: [
    {
      id: "hardest",
      title: "Work on the Hardest Problems",
      body: "Tackle complex, unsolved challenges in networking, autonomy, and distributed systems.",
      icon: "atom" as const,
    },
    {
      id: "impact",
      title: "End-to-End Impact",
      body: "From research to real-world deployment—see your work in action.",
      icon: "nodes" as const,
    },
    {
      id: "team",
      title: "Small Team. Big Impact.",
      body: "Work directly with experts. Ship fast. Make decisions. See results.",
      icon: "people" as const,
    },
    {
      id: "frontier",
      title: "Frontier Technology",
      body: "Build the next generation of intelligent networking in environments that are unpredictable and dynamic.",
      icon: "compass" as const,
    },
    {
      id: "mission",
      title: "Real-World Mission",
      body: "Help build systems meant to keep people, infrastructure, and operations connected.",
      icon: "globe" as const,
    },
  ],
} as const;

export const OPEN_ROLES = {
  title: "Open Roles",
  emptyTitle: "No open roles right now.",
  emptyBody:
    "Check back soon, or reach out if you want to be considered as the team grows.",
  viewAll: "View All Open Roles",
  apply: "Apply",
  applyHeading: "Apply",
  applyLead: "Tell us about yourself. Attach a resume if you have one.",
  learnMore: "View role",
} as const;

/** @deprecated Blank cards removed — public page shows empty state instead. */
export const OPEN_ROLE_PLACEHOLDERS = 0;

export const HOW_WE_WORK = {
  title: "How We Work",
  footer: "Flexible work that supports deep focus and real-life balance.",
  items: [
    {
      id: "mission",
      title: "Mission First",
      body: "We focus on impact. Everything else follows.",
      icon: "flag" as const,
    },
    {
      id: "ownership",
      title: "Radical Ownership",
      body: "We take ownership—no silos, no accountability gaps, follow through.",
      icon: "target" as const,
    },
    {
      id: "direct",
      title: "Open & Direct",
      body: "We communicate clearly, challenge ideas, and make better decisions.",
      icon: "chat" as const,
    },
    {
      id: "action",
      title: "Bias for Action",
      body: "We move fast, learn quickly, and iterate relentlessly.",
      icon: "bolt" as const,
    },
    {
      id: "improve",
      title: "Continuous Improvement",
      body: "We build, measure, and get better every day.",
      icon: "chart" as const,
    },
    {
      id: "people",
      title: "People First",
      body: "We support each other and invest in long-term relationships.",
      icon: "people" as const,
    },
  ],
} as const;

/** Closing careers CTA — left uses locked hiring line; sidebar is soft outreach. */
export const CAREERS_CTA = {
  viewRoles: "View Open Roles",
  asideTitle: "Not seeing the right role?",
  asideBody:
    "We're always looking for exceptional talent. Reach out and tell us how you'd like to contribute.",
  asideLink: "Get in touch",
} as const;

export type Role = {
  id?: string;
  slug: string;
  title: string;
  team: string;
  /** e.g. "Denver, Colorado" or "Remote". */
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  summary: string;
  /** Full job description; paragraphs separated by blank lines. */
  body?: string;
  /** Where an application goes. Use the contact form unless a board is set up. */
  applyHref?: string;
};

/** Seed roles when CMS has no `careers.roles` yet. */
export const DEFAULT_CAREERS_ROLES: Role[] = [
  {
    id: "role-networking-software-developer",
    slug: "networking-software-developer",
    title: "Networking Software Developer",
    team: "Engineering",
    location: "United States",
    type: "Part-time",
    summary:
      "Core contributor to IST's mesh state synchronization software — systems-level Python at the protocol layer for contested, dynamic networks.",
    body: [
      "At IST we're building intelligent networking infrastructure for environments where failure isn't an option. We're small, we move fast, and we care deeply about the technical depth of our work. If you want to own problems end to end and build something that matters, read on.",
      "We're an early-stage startup building mesh networking infrastructure for contested, dynamic environments — satellites, drones, tactical communications. We don't build things that have been built before.",
      "This is not a maintenance role. It's an opportunity for engineers who want to own hard problems end to end and have direct influence on product direction. If you're adaptable, collaborative, and energized by the challenge of building something from the ground up alongside a small, highly motivated team, we want to hear from you.",
      "About the Role",
      "You'll be a core contributor to IST's mesh state synchronization software — a distributed bundle propagation system designed to operate in dynamic, contested network environments including satellite constellations, drone swarms, and tactical radio networks. This is systems-level Python work at the protocol layer, not application development.",
      "Qualifications",
      "Required:",
      "• Python (strong, systems-level — not web/scripting)",
      "• Distributed systems design and implementation",
      "• Network socket programming (TCP/UDP, raw sockets)",
      "• Concurrent and async programming (asyncio, threading, multiprocessing)",
      "• Message passing and inter-process communication",
      "• Protocol design and implementation experience",
      "• Data serialization (Protocol Buffers, MessagePack, or similar)",
      "• Version control (Git)",
      "• 10+ years software development experience",
      "Desired:",
      "• Delay-tolerant networking (DTN) — ideally Bundle Protocol (RFC 5050/9171)",
      "• P2P network architecture (BitTorrent, Kademlia, or similar)",
      "• MANET or mesh network protocol experience",
      "• Software-defined networking concepts",
      "• Link-state or distance-vector routing protocol internals",
      "• Experience with challenged/contested network environments",
      "• Rust or C++ (relevant for Phase II production implementation)",
      "• Linux systems programming",
      "• Prior DoD, aerospace, or defense software experience",
      "• Familiarity with government software development practices",
      "Compensation and Details",
      "This is a temporary, part-time exempt position based on approximately 25 hours per week. Starting salary range is $2000-$3500 per week dependent upon qualifications and experience, paid on a regular payroll cycle. Workload will naturally ebb and flow with sprint cycles.",
      "IST anticipates hiring for this position upon contract award, expected September 2026. Offers are contingent upon funding authorization.",
      "This position requires U.S. citizenship. Candidates must be currently residing in the United States. Employment is contingent upon successful completion of a background check.",
    ].join("\n\n"),
  },
  {
    id: "role-networking-simulation-software-developer",
    slug: "networking-simulation-software-developer",
    title: "Networking Simulation Software Developer",
    team: "Engineering",
    location: "United States",
    type: "Part-time",
    summary:
      "Core contributor to IST's Mesh Network Simulator — scientific Python for modeling dynamic, contested network topologies.",
    body: [
      "At IST we're building intelligent networking infrastructure for environments where failure isn't an option. We're small, we move fast, and we care deeply about the technical depth of our work. If you want to own problems end to end and build something that matters, read on.",
      "We're an early-stage startup building mesh networking infrastructure for contested, dynamic environments — satellites, drones, tactical communications. We don't build things that have been built before.",
      "This is not a maintenance role. It's an opportunity for engineers who want to own hard problems end to end and have direct influence on product direction. If you're adaptable, collaborative, and energized by the challenge of building something from the ground up alongside a small, highly motivated team, we want to hear from you.",
      "About the Role",
      "You'll be a core contributor to IST's Mesh Network Simulator — a discrete-event simulation environment designed to model dynamic, contested network topologies including satellite constellations, drone swarms, and tactical radio networks. This is scientific Python work at the systems level, not scripting or web development. You'll be building the simulation engine that validates IST's mesh state synchronization software by modeling real-world network conditions including link quality variation, node mobility, propagation delay, and topology change.",
      "Qualifications",
      "Required:",
      "• Python (strong, scientific/engineering computing)",
      "• Network simulation or emulation experience",
      "• Graph modeling and dynamic topology representation (NetworkX or similar)",
      "• Statistical modeling of link quality, latency, and packet loss",
      "• Simulation event loop design (discrete event simulation)",
      "• Data collection, metrics instrumentation, and results analysis",
      "• Scientific Python stack (NumPy, SciPy, Pandas, Matplotlib)",
      "• Version control (Git)",
      "• 10+ years software development experience",
      "Desired:",
      "• ns-3, OMNeT++, or OPNET/Riverbed Modeler experience",
      "• Satellite constellation modeling or orbital mechanics familiarity",
      "• LEO/pLEO network simulation (Starlink-style dynamic topologies)",
      "• RF propagation modeling and link budget concepts",
      "• Mobility modeling for aerial or maritime platforms",
      "• Visualization of dynamic network state (real-time or replay)",
      "• Prior DoD, aerospace, or defense software experience",
      "• Familiarity with STK or GMAT",
      "• Docker or containerization for reproducible simulation environments",
      "Compensation and Details",
      "This is a temporary, part-time exempt position based on approximately 25 hours per week. Starting salary range is $2000-$3500 per week dependent upon qualifications and experience, paid on a regular payroll cycle. Workload will naturally ebb and flow with sprint cycles.",
      "IST anticipates hiring for this position upon contract award, expected September 2026. Offers are contingent upon funding authorization.",
      "This position requires U.S. citizenship. Candidates must be currently residing in the United States. Employment is contingent upon successful completion of a background check.",
    ].join("\n\n"),
  },
];

/** Empty when CMS overrides provide the live list — defaults live in DEFAULT_CAREERS_ROLES. */
export const ROLES: Role[] = DEFAULT_CAREERS_ROLES;

const ROLE_SECTION_HEADINGS = new Set([
  "About the Role",
  "Qualifications",
  "Compensation and Details",
]);

const ROLE_SUBHEADINGS = new Set(["Required:", "Desired:"]);

/** Parse JD body into renderable blocks. */
export function parseRoleBody(body: string): Array<
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
> {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const blocks: Array<
    | { type: "heading"; text: string }
    | { type: "subheading"; text: string }
    | { type: "paragraph"; text: string }
    | { type: "list"; items: string[] }
  > = [];
  let para: string[] = [];
  let list: string[] = [];

  function flushPara() {
    const text = para.join(" ").trim();
    if (text) blocks.push({ type: "paragraph", text });
    para = [];
  }

  function flushList() {
    if (list.length) blocks.push({ type: "list", items: list });
    list = [];
  }

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushList();
      flushPara();
      continue;
    }
    if (ROLE_SECTION_HEADINGS.has(line)) {
      flushList();
      flushPara();
      blocks.push({ type: "heading", text: line });
      continue;
    }
    if (ROLE_SUBHEADINGS.has(line)) {
      flushList();
      flushPara();
      blocks.push({ type: "subheading", text: line.replace(/:$/, "") });
      continue;
    }
    if (line.startsWith("•") || line.startsWith("-") || line.startsWith("*")) {
      flushPara();
      list.push(line.replace(/^[•\-*]\s*/, "").trim());
      continue;
    }
    flushList();
    para.push(line);
  }
  flushList();
  flushPara();
  return blocks;
}