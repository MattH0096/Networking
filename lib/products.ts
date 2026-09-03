/**
 * Locus and Crucible page content, §9.3 and §9.4.
 *
 * Headers marked [LOCKED] ship verbatim. Nothing here describes a capability the
 * spec does not describe — in particular the Crucible future block is framed as
 * intent, never as something that exists today.
 */

import type { IconName } from "@/components/icons/Icon";

export type FlowStep = {
  key: string;
  title: string;
  body: string;
  icon: IconName;
};

export type Feature = {
  title: string;
  body: string;
  icon: IconName;
};

/** §9.3 [LOCKED header] */
export const LOCUS = {
  slug: "locus",
  title: "Locus: Assured Distribution for the Real World",
  titleLines: ["Locus: Assured Distribution", "for the Real World"] as const,
  lead: "Locus is IST's assured distribution engine. It ensures mission-critical information continues moving through dynamic, intermittently connected networks until delivery is complete.",
  flow: [
    {
      key: "Store",
      title: "Intelligently Store",
      body: "Critical data is stored across the network — never lost, always available for forward delivery.",
      icon: "store",
    },
    {
      key: "Route",
      title: "Find the Best Path",
      body: "Locus continuously evaluates available links and routes information along the optimal available path.",
      icon: "route",
    },
    {
      key: "Adapt",
      title: "Dynamically Adjust",
      body: "As conditions change, Locus adjusts in real time — rerouting, resequencing, and recovering without operator intervention.",
      icon: "adapt",
    },
    {
      key: "Deliver",
      title: "Ensure Every Destination",
      body: "Delivery is not complete until every intended recipient has the complete payload. Not most. All.",
      icon: "deliver",
    },
  ] satisfies FlowStep[],
  /** The sharpest line in the brief — pulled out and given display weight. */
  pull: {
    lead: "Delivery is not complete until every intended recipient has the complete payload.",
    line: "Not most. All.",
  },
  features: [
    {
      title: "Works in disconnected and degraded networks",
      body: "Built for the real world, not ideal conditions.",
      icon: "degraded",
    },
    {
      title: "Efficient bandwidth utilization",
      body: "Uses every opportunity to move data forward — no wasted capacity.",
      icon: "bandwidth",
    },
    {
      title: "End-to-end data integrity",
      body: "Protects information from source to delivery.",
      icon: "integrity",
    },
    {
      title: "Built for mission-critical systems",
      body: "Designed for the highest standards of reliability.",
      icon: "mission",
    },
  ] satisfies Feature[],
  /** Outcome-driven impact — sits between Assured Distribution and Why Choose. */
  impactHeading: "The Impact of Assured Distribution",
  impact: [
    {
      title: "Higher Mission Success Rates",
      body: "When every destination receives its complete payload, missions don't stall on partial or missing data. Locus turns intermittent connectivity from a mission risk into a solved problem.",
      icon: "deliver",
    },
    {
      title: "Reduced Operational Downtime",
      body: "Networks that adapt in real time mean fewer manual interventions, fewer dropped handoffs, and less time spent troubleshooting connectivity instead of executing the mission.",
      icon: "adapt",
    },
    {
      title: "A Measurable Reliability Advantage",
      body: "In environments where competitors' networks fail silently, Locus keeps moving. That reliability becomes a differentiator you can point to — in a bid, an evaluation, or a customer conversation.",
      icon: "integrity",
    },
    {
      title: "Confidence to Operate at the Edge",
      body: "Locus lets teams push into more contested, more remote, and more dynamic environments than conventional networks can support — without betting the mission on connectivity holding.",
      icon: "missionFirst",
    },
  ] satisfies Feature[],
  why: [
    {
      title: "Mission-first",
      body: "Built for intermittent networks from the ground up — not adapted from enterprise software.",
      icon: "missionFirst",
    },
    {
      title: "Platform-agnostic",
      body: "Integrates with existing infrastructure. No ground-side changes required.",
      icon: "platform",
    },
    {
      title: "Single-node insertion",
      body: "Delivers immediate value from day one. Scales linearly as adoption grows.",
      icon: "insertion",
    },
    {
      title: "Simulation before deployment",
      body: "Crucible validates Locus configurations before they go into the field.",
      icon: "simulation",
    },
  ] satisfies Feature[],
} as const;

/** §9.4 [LOCKED header] */
export const CRUCIBLE = {
  slug: "crucible",
  title: "Crucible: Simulate. Validate. Deploy with Confidence.",
  titleLines: ["Crucible: Simulate. Validate.", "Deploy with Confidence."] as const,
  lead: "Before deployment, watch your mission come to life. Build your network. Move your assets. See how terrain, movement, and interference impact connectivity — and how IST keeps information flowing.",
  /** Opens the hero lead, immediately under the title. */
  leadIntro: "Crucible is IST's network digital twin.",
  flow: [
    {
      key: "Build",
      title: "Build Your Environment",
      body: "Create realistic terrain, obstacles, and conditions. Import real-world geography or define custom mission environments.",
      icon: "build",
    },
    {
      key: "Model",
      title: "Model Your Assets",
      body: "Add satellites, drones, ships, robots, ground stations — configure their movement profiles and link parameters.",
      icon: "model",
    },
    {
      key: "Simulate",
      title: "Simulate Real Conditions",
      body: "Test movement, interference, terrain effects, and network dynamics across the full mission timeline.",
      icon: "simulate",
    },
    {
      key: "Validate",
      title: "Validate Performance",
      body: "Measure results, identify failure points, and optimize before you deploy. Know before you go.",
      icon: "validate",
    },
  ] satisfies FlowStep[],
  pull: {
    lead: "Measure results, identify failure points, and optimize before you deploy.",
    line: "Know before you go.",
  },
  /** Critical questions — approved checklist strings. */
  questionsHeading: "Crucible Answers Critical Questions Before You Deploy",
  questions: [
    "Will my network reach every asset?",
    "How does terrain affect connectivity?",
    "What happens if a node is lost?",
    "How do interference and jamming impact performance?",
    "How does movement affect link quality over time?",
    "How much bandwidth do I actually need?",
    "How many optical crosslink terminals (OCTs) do you actually need?",
    "What's the minimum link count to hit your latency target?",
    "Where are you over-provisioning bandwidth — and where are you under-provisioning it?",
  ],
  /**
   * Approved as vision, explicitly not present capability. Set apart visually
   * with a FUTURE tag and standby card treatment so it cannot be read as a
   * marketplace that exists today.
   */
  future: {
    tag: "Future",
    eyebrow: "Designed for Extensibility.",
    heading: "Built to Support a Future Developer Ecosystem.",
    pillars: [
      {
        key: "plugins",
        title: "Custom Plugins",
        body: "Long-term, the simulation core is intended to support modular plugins from operators, researchers, and third-party developers.",
      },
      {
        key: "profiles",
        title: "Mission Profiles",
        body: "A future ecosystem would include mission profiles that capture how assets, links, and objectives behave over time.",
      },
      {
        key: "terrain",
        title: "Terrain Datasets",
        body: "The platform is designed so real-world geography and custom terrain datasets can be brought into the simulation environment.",
      },
      {
        key: "assets",
        title: "Custom Asset Types",
        body: "The vision includes custom platforms and behaviors — satellites, drones, ships, robots, and ground stations.",
      },
      {
        key: "algorithms",
        title: "Distribution Algorithms",
        body: "Over time, advanced routing and distribution logic could plug into the Crucible simulation core.",
      },
    ],
  },
} as const;
