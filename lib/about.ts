/**
 * §9.6 About page.
 *
 * The statement is [LOCKED] approved copy. It is stored as sentences grouped
 * into paragraphs purely for readability — no word is added, removed or
 * reordered. Verify against the spec before editing.
 *
 * Forbidden here and deliberately absent: founder name, biography, employer
 * history, headshot, and every kind of counted metric.
 */

export const ABOUT = {
  title: "The Engineering Behind IST",
  /** Display title lines for the statement plate. */
  titleLines: ["The Engineering", "Behind IST"] as const,
  lead: "IST was founded on deep engineering experience building the systems that power defense, space, and critical infrastructure.",
  statementEyebrow: "About IST",
  statement: [
    "Connected systems are reshaping every critical domain — defense, space, logistics, infrastructure. That transformation demands more performance from the underlying technology than it was ever designed to deliver. IST was founded to change that.",
    "We are an advanced technology company focused on the intersection of intelligent systems, distributed computing, and next-generation hardware. Our work is grounded in deep engineering discipline and driven by a belief that the most critical infrastructure in the world deserves better than the solutions it currently has.",
    "We build for the long term — starting with today's hardest problems and engineering toward a future where connected systems are smarter, more resilient, and more capable than anyone thought possible.",
  ],
  /** Label and statement exactly as approved. */
  cards: [
    {
      id: "mission",
      title: "Our Mission",
      body: "To make resilient communication possible anywhere, for any mission, at any time.",
      image: "about-mission" as const,
    },
    {
      id: "vision",
      title: "Our Vision",
      body: "A world where every device, on any network, communicates intelligently — regardless of topology, protocol, or environment.",
      image: "about-vision" as const,
    },
  ],
} as const;

/**
 * How We Build — presentation principles (soft team language; no product claims
 * beyond themes already in the locked statement).
 */
export const HOW_WE_BUILD = {
  eyebrow: "How We Build",
  titleLines: ["Built for the long term.", "Focused on what matters."] as const,
  items: [
    {
      id: "mission",
      title: "Mission First",
      body: "We build for real missions in real environments. Reliability is the baseline.",
      icon: "shield" as const,
    },
    {
      id: "reality",
      title: "Engineered for Reality",
      body: "We design for disruption, constraint, and change—not ideal conditions.",
      icon: "network" as const,
    },
    {
      id: "systems",
      title: "Systems Thinking",
      body: "Software, hardware, and networks—designed to work as one.",
      icon: "stack" as const,
    },
    {
      id: "resilient",
      title: "Resilient by Design",
      body: "Adapt, recover, and continue operating when others cannot.",
      icon: "lock" as const,
    },
    {
      id: "longterm",
      title: "Long-Term Focus",
      body: "We build foundational technology that endures and evolves.",
      icon: "chart" as const,
    },
  ],
} as const;
