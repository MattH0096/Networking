import "server-only";

import { unstable_noStore as noStore } from "next/cache";

import { ABOUT, HOW_WE_BUILD } from "@/lib/about";
import { CAREERS, DEFAULT_CAREERS_ROLES } from "@/lib/careers";
import { readOverrides } from "@/lib/cms/store";
import type { RoleType, SiteOverrides, VisionOverrideFields } from "@/lib/cms/types";
import { ROLE_TYPES } from "@/lib/cms/types";
import {
  CONTACT_FORM,
  CONTACT_HELP,
  CONTACT_OFFICE,
  CONTACT_PILLARS,
  CONTACT_SOCIAL,
} from "@/lib/contact";
import { HOME_CTA } from "@/lib/cta";
import {
  APPLICATIONS,
  HOW_IT_WORKS,
  HERO,
  PROBLEM,
  PRODUCTS,
  SOLUTION,
  STACK,
  SUPPORT_LINE,
  VISION,
} from "@/lib/home";
import {
  INSIGHTS_INTRO,
  PAPERS,
} from "@/lib/insights";
import { NEWS_CATEGORIES, DEFAULT_NEWS_POSTS, type NewsCategory } from "@/lib/news";
import { CRUCIBLE, LOCUS } from "@/lib/products";
import {
  HARDWARE_NOTE,
  MISSING_LAYER,
  SOLUTION_COLUMNS,
  SOLUTIONS_FULL_STACK,
  SOLUTIONS_HEADER,
} from "@/lib/solutions";

function pick<T>(override: T | undefined, fallback: T): T {
  return override !== undefined && override !== "" ? override : fallback;
}

function visionFields(o: VisionOverrideFields = {}) {
  return {
    visionLine1: pick(o.visionLine1, VISION.lines[0]),
    visionLine2: pick(o.visionLine2, VISION.lines[1]),
    visionAccent: pick(o.visionAccent, VISION.accentLine),
    visionAfter1: pick(o.visionAfter1, VISION.afterLines[0]),
    visionAfter2: pick(o.visionAfter2, VISION.afterLines[1]),
    visionPrimaryCta: pick(o.visionPrimaryCta, HOME_CTA.primaryCta),
    visionSecondaryCta: pick(o.visionSecondaryCta, HOME_CTA.secondaryCta),
    visionPrimaryHref: HOME_CTA.primaryHref,
    visionSecondaryHref: HOME_CTA.secondaryHref,
  };
}

/** Merged site content for public pages + admin forms. Always fresh (CMS). */
export async function getSiteContent() {
  noStore();
  const o = await readOverrides();
  return buildContent(o);
}

export function buildContent(o: SiteOverrides) {
  const locusProduct = PRODUCTS[0];
  const crucibleProduct = PRODUCTS[1];
  const h = o.home ?? {};

  const problemConditions = PROBLEM.conditions.map((c, i) => ({
    icon: c.icon,
    line: pick(h.problemConditions?.[i], c.line),
  }));

  const howItWorksSteps = HOW_IT_WORKS.map((step, i) => ({
    key: step.key,
    n: step.n,
    label: pick(h.howItWorksSteps?.[i]?.label, step.label),
    image: step.image,
    alt: pick(h.howItWorksSteps?.[i]?.alt, step.alt),
  }));

  const applicationsTiles = APPLICATIONS.tiles.map((tile, i) => ({
    id: tile.id,
    label: pick(h.applicationsTiles?.[i]?.label, tile.label),
    line: pick(h.applicationsTiles?.[i]?.line, tile.line),
    image: tile.image,
    alt: pick(h.applicationsTiles?.[i]?.alt, tile.alt),
  }));

  const stackLayers = STACK.map((layer, i) => ({
    layer: pick(h.stackLayers?.[i]?.layer, layer.layer),
    product:
      h.stackLayers?.[i]?.product !== undefined
        ? h.stackLayers[i].product
        : layer.product,
    status: layer.status,
  }));

  const locusOverrides = o.locus ?? {};
  const defaultIntegrityBody =
    LOCUS.features.find((f) => f.title.startsWith("End-to-end"))?.body ?? "";

  return {
    home: {
      heroLine1: pick(h.heroLine1, HERO.lines[0]),
      heroLine2: pick(h.heroLine2, HERO.lines[1]),
      heroCta: pick(h.heroCta, HERO.cta),
      heroCtaHref: HERO.ctaHref,
      supportLines: (h.supportLines ?? SUPPORT_LINE.lines) as [string, string],
      supportCloser: pick(h.supportCloser, SUPPORT_LINE.closer),
      problemEyebrow: pick(h.problemEyebrow, "The Problem"),
      problemHeading1: pick(h.problemHeading1, PROBLEM.headingLines[0]),
      problemHeading2: pick(h.problemHeading2, PROBLEM.headingLines[1]),
      problemConditions,
      problemCloser: pick(h.problemCloser, PROBLEM.closer),
      solutionEyebrow: pick(h.solutionEyebrow, "The Solution"),
      solutionHeading1: pick(h.solutionHeading1, SOLUTION.headingLines[0]),
      solutionHeading2: pick(h.solutionHeading2, SOLUTION.headingLines[1]),
      solutionBody: pick(h.solutionBody, SOLUTION.body),
      howItWorksTitle: pick(h.howItWorksTitle, "How It Works"),
      howItWorksSteps,
      locusEyebrow: pick(h.locusEyebrow, locusProduct.eyebrow),
      locusTagline: pick(h.locusTagline, locusProduct.tagline),
      locusBody: pick(h.locusBody, locusProduct.body),
      locusPull: pick(h.locusPull, locusProduct.pull),
      locusPullLead: pick(h.locusPullLead, locusProduct.pullLead),
      locusAlt: pick(h.locusAlt, locusProduct.alt),
      crucibleEyebrow: pick(h.crucibleEyebrow, crucibleProduct.eyebrow),
      crucibleTagline: pick(h.crucibleTagline, crucibleProduct.tagline),
      crucibleBody: pick(h.crucibleBody, crucibleProduct.body),
      cruciblePull: pick(h.cruciblePull, crucibleProduct.pull),
      cruciblePullLead: pick(h.cruciblePullLead, crucibleProduct.pullLead),
      crucibleAlt: pick(h.crucibleAlt, crucibleProduct.alt),
      applicationsEyebrow: pick(h.applicationsEyebrow, "Applications"),
      applicationsHeading: pick(h.applicationsHeading, APPLICATIONS.heading),
      applicationsLead: pick(h.applicationsLead, APPLICATIONS.lead),
      applicationsTiles,
      applicationsCloserHeading: pick(
        h.applicationsCloserHeading,
        APPLICATIONS.closer.heading,
      ),
      applicationsCloserBody: pick(h.applicationsCloserBody, APPLICATIONS.closer.body),
      applicationsCloserCta: pick(h.applicationsCloserCta, APPLICATIONS.closer.cta),
      applicationsCloserHref: APPLICATIONS.closer.href,
      stackTitle: pick(h.stackTitle, "Platform Stack"),
      stackLayers,
      ...visionFields(h),
    },
    solutions: (() => {
      const s = o.solutions ?? {};
      return {
        eyebrow: pick(s.eyebrow, "Solutions"),
        titleLine1: pick(s.titleLine1, SOLUTIONS_HEADER.titleLines[0]),
        titleLine2: pick(s.titleLine2, SOLUTIONS_HEADER.titleLines[1]),
        lead: pick(s.lead, SOLUTIONS_HEADER.lead),
        columns: SOLUTION_COLUMNS.map((col, i) => ({
          eyebrow: pick(s.columns?.[i]?.eyebrow, col.eyebrow),
          title: pick(s.columns?.[i]?.title, col.title),
          body: pick(s.columns?.[i]?.body, col.body),
          href: col.href,
          cta:
            col.cta === null
              ? null
              : pick(s.columns?.[i]?.cta ?? undefined, col.cta ?? ""),
          status: col.status,
          image: col.image,
          alt: pick(s.columns?.[i]?.alt, col.alt),
        })),
        hardwareNote: pick(s.hardwareNote, HARDWARE_NOTE),
        missingEyebrow: pick(s.missingEyebrow, MISSING_LAYER.eyebrow),
        missingTitle: pick(s.missingTitle, MISSING_LAYER.title),
        missingLead: pick(s.missingLead, MISSING_LAYER.lead),
        missingGapLabel: pick(s.missingGapLabel, "The gap"),
        missingProblem: pick(s.missingProblem, MISSING_LAYER.problem),
        missingAnswerLabel: pick(s.missingAnswerLabel, "The answer"),
        missingInsight: pick(s.missingInsight, MISSING_LAYER.insight),
        missingStackLabel: pick(s.missingStackLabel, MISSING_LAYER.stackLabel),
        missingStackCaption: pick(s.missingStackCaption, MISSING_LAYER.stackCaption),
        missingStackHighlightNote: pick(
          s.missingStackHighlightNote,
          "The missing layer — IST's core software thesis",
        ),
        missingStackLayers: MISSING_LAYER.stack.map((layer, i) => ({
          id: layer.id,
          label: pick(s.missingStackLayers?.[i]?.label, layer.label),
          highlight: layer.highlight,
          icon: layer.icon,
        })),
        missingImage: MISSING_LAYER.image,
        missingImageAlt: pick(s.missingImageAlt, MISSING_LAYER.imageAlt),
        missingOutcomesLabel: pick(s.missingOutcomesLabel, MISSING_LAYER.outcomesLabel),
        missingFeatures: MISSING_LAYER.features.map((f, i) => ({
          id: f.id,
          title: pick(s.missingFeatures?.[i]?.title, f.title),
          body: pick(s.missingFeatures?.[i]?.body, f.body),
          icon: f.icon,
        })),
        missingBridgeLabel: pick(s.missingBridgeLabel, MISSING_LAYER.bridgeLabel),
        missingBridgeLead: pick(s.missingBridgeLead, MISSING_LAYER.bridgeLead),
        missingFlow: MISSING_LAYER.flow.map((step, i) => ({
          id: step.id,
          label: pick(s.missingFlow?.[i]?.label, step.label),
          detail: pick(s.missingFlow?.[i]?.detail, step.detail),
          href: step.href,
        })),
        missingCta: pick(s.missingCta, MISSING_LAYER.cta),
        missingCtaHref: MISSING_LAYER.ctaHref,
        missingCtaNote: pick(s.missingCtaNote, MISSING_LAYER.ctaNote),
        fullStackEyebrow: pick(s.fullStackEyebrow, "Capability stack"),
        fullStackTitle: pick(s.fullStackTitle, SOLUTIONS_FULL_STACK.title),
        fullStackLead: pick(s.fullStackLead, SOLUTIONS_FULL_STACK.lead),
        fullStackItems: SOLUTIONS_FULL_STACK.items.map((item, i) => ({
          id: item.id,
          title: pick(s.fullStackItems?.[i]?.title, item.title),
          body: pick(s.fullStackItems?.[i]?.body, item.body),
          icon: item.icon,
        })),
        ...visionFields(s),
      };
    })(),
    locus: {
      eyebrow: pick(locusOverrides.eyebrow, "Locus — Current, shipping"),
      titleLine1: pick(locusOverrides.titleLine1, LOCUS.titleLines[0]),
      titleLine2: pick(locusOverrides.titleLine2, LOCUS.titleLines[1]),
      lead: pick(locusOverrides.lead, LOCUS.lead),
      flowHeading: pick(locusOverrides.flowHeading, "How Locus Works"),
      flow: LOCUS.flow.map((step, i) => ({
        key: pick(locusOverrides.flow?.[i]?.key, step.key),
        title: pick(locusOverrides.flow?.[i]?.title, step.title),
        body: pick(locusOverrides.flow?.[i]?.body, step.body),
        icon: step.icon,
      })),
      pullLead: pick(locusOverrides.pullLead, LOCUS.pull.lead),
      pullLine: pick(locusOverrides.pullLine, LOCUS.pull.line),
      distributionHeading: pick(
        locusOverrides.distributionHeading,
        "Assured Distribution in Action",
      ),
      distributionSub: pick(locusOverrides.distributionSub, "Store. Route. Adapt. Deliver."),
      distributionAlt: pick(
        locusOverrides.distributionAlt,
        "Locus assured distribution across satellite, drone, ground vehicle, relay, and ship nodes — connected, intermittent, and absent links with data stores and packets in transit.",
      ),
      impactHeading: pick(locusOverrides.impactHeading, LOCUS.impactHeading),
      impact: LOCUS.impact.map((item, i) => ({
        title: pick(locusOverrides.impact?.[i]?.title, item.title),
        body: pick(locusOverrides.impact?.[i]?.body, item.body),
        icon: item.icon,
      })),
      features: LOCUS.features.map((item, i) => {
        const fromFeatures = locusOverrides.features?.[i]?.body;
        const body = item.title.startsWith("End-to-end")
          ? pick(fromFeatures, pick(locusOverrides.integrityBody, item.body))
          : pick(fromFeatures, item.body);
        return {
          title: pick(locusOverrides.features?.[i]?.title, item.title),
          body,
          icon: item.icon,
        };
      }),
      integrityBody: pick(locusOverrides.integrityBody, defaultIntegrityBody),
      whyHeading: pick(locusOverrides.whyHeading, "Why Customers Choose IST"),
      why: LOCUS.why.map((item, i) => ({
        title: pick(locusOverrides.why?.[i]?.title, item.title),
        body: pick(locusOverrides.why?.[i]?.body, item.body),
        icon: item.icon,
      })),
      ...visionFields(locusOverrides),
    },
    crucible: (() => {
      const c = o.crucible ?? {};
      return {
        eyebrow: pick(c.eyebrow, "Crucible — Current, shipping"),
        titleLine1: pick(c.titleLine1, CRUCIBLE.titleLines[0]),
        titleLine2: pick(c.titleLine2, CRUCIBLE.titleLines[1]),
        leadIntro: pick(c.leadIntro, CRUCIBLE.leadIntro),
        lead: pick(c.lead, CRUCIBLE.lead),
        flowTag: pick(c.flowTag, "How Crucible works"),
        flowHeading: pick(c.flowHeading, "The Crucible Workflow"),
        flow: CRUCIBLE.flow.map((step, i) => ({
          key: pick(c.flow?.[i]?.key, step.key),
          title: pick(c.flow?.[i]?.title, step.title),
          body: pick(c.flow?.[i]?.body, step.body),
          icon: step.icon,
        })),
        pullLead: pick(c.pullLead, CRUCIBLE.pull.lead),
        pullLine: pick(c.pullLine, CRUCIBLE.pull.line),
        questionsHeading: pick(c.questionsHeading, CRUCIBLE.questionsHeading),
        questions:
          c.questions !== undefined ? c.questions : [...CRUCIBLE.questions],
        questionsAlt: pick(
          c.questionsAlt,
          "Simulated terrain with modelled links between distributed assets, showing how geography shapes connectivity.",
        ),
        futureTag: pick(c.futureTag, CRUCIBLE.future.tag),
        futureEyebrow: pick(c.futureEyebrow, CRUCIBLE.future.eyebrow),
        futureHeading: pick(c.futureHeading, CRUCIBLE.future.heading),
        pillars: CRUCIBLE.future.pillars.map((pillar, i) => ({
          key: pillar.key,
          title: pick(c.pillars?.[i]?.title, pillar.title),
          body: pick(c.pillars?.[i]?.body, pillar.body),
        })),
        ...visionFields(c),
      };
    })(),
    about: (() => {
      const a = o.about ?? {};
      return {
        eyebrow: pick(a.eyebrow, "Company"),
        title: pick(a.title, ABOUT.title),
        lead: pick(a.lead, ABOUT.lead),
        statementEyebrow: pick(a.statementEyebrow, ABOUT.statementEyebrow),
        statement: a.statement !== undefined ? a.statement : [...ABOUT.statement],
        cards: ABOUT.cards.map((card, i) => ({
          id: card.id,
          title: pick(a.cards?.[i]?.title, card.title),
          body: pick(a.cards?.[i]?.body, card.body),
          image: card.image,
        })),
        howEyebrow: pick(a.howEyebrow, HOW_WE_BUILD.eyebrow),
        howTitleLine1: pick(a.howTitleLine1, HOW_WE_BUILD.titleLines[0]),
        howTitleLine2: pick(a.howTitleLine2, HOW_WE_BUILD.titleLines[1]),
        howItems: HOW_WE_BUILD.items.map((item, i) => ({
          id: item.id,
          title: pick(a.howItems?.[i]?.title, item.title),
          body: pick(a.howItems?.[i]?.body, item.body),
          icon: item.icon,
        })),
        ...visionFields(a),
      };
    })(),
    contact: (() => {
      const c = o.contact ?? {};
      const titleLine1 = pick(c.titleLine1, "Let's Build the Future of");
      const titleLine2 = pick(
        c.titleLine2,
        "Resilient Communication Together.",
      );
      return {
        eyebrow: pick(c.eyebrow, "Contact"),
        title: pick(c.title, `${titleLine1} ${titleLine2}`),
        titleLine1,
        titleLine2,
        lead: pick(
          c.lead,
          "Whether you're evaluating a mission challenge, exploring an investment, or looking to partner — we'd love to hear from you.",
        ),
        formTitle: pick(c.formTitle, CONTACT_FORM.title),
        formLead: pick(c.formLead, CONTACT_FORM.lead),
        formSecure: pick(c.formSecure, CONTACT_FORM.secure),
        formSubmit: pick(c.formSubmit, CONTACT_FORM.submit),
        placeholders: {
          fullName: pick(c.placeholders?.fullName, CONTACT_FORM.placeholders.fullName),
          workEmail: pick(c.placeholders?.workEmail, CONTACT_FORM.placeholders.workEmail),
          organization: pick(
            c.placeholders?.organization,
            CONTACT_FORM.placeholders.organization,
          ),
          interest: pick(c.placeholders?.interest, CONTACT_FORM.placeholders.interest),
          message: pick(c.placeholders?.message, CONTACT_FORM.placeholders.message),
        },
        officeTitle: pick(c.officeTitle, CONTACT_OFFICE.title),
        officeLocation: pick(c.officeLocation, CONTACT_OFFICE.location),
        officeDescription: pick(c.officeDescription, CONTACT_OFFICE.description),
        mapAlt: pick(c.mapAlt, CONTACT_OFFICE.mapAlt),
        socialTitle: pick(c.socialTitle, CONTACT_SOCIAL.title),
        socialLead: pick(c.socialLead, CONTACT_SOCIAL.lead),
        pillars: CONTACT_PILLARS.map((pillar, i) => ({
          id: pillar.id,
          title: pick(c.pillars?.[i]?.title, pillar.title),
          body: pick(c.pillars?.[i]?.body, pillar.body),
          icon: pillar.icon,
        })),
        helpHeading: pick(c.helpHeading, CONTACT_HELP.heading),
        helpLead: pick(c.helpLead, CONTACT_HELP.lead),
      };
    })(),
    insights: (() => {
      const ins = o.insights ?? {};
      const signalIcons = ["doc", "chart", "review"] as const;

      const defaultPapers = PAPERS.map((p, index) => ({
        id: p.slug,
        slug: p.slug,
        title: p.title,
        series: p.series,
        date: p.date,
        gated: p.gated,
        summary: p.summary,
        tags: [...p.tags],
        signals: p.signals.map((s) => ({ label: s.label, icon: s.icon })),
        coverKey: "insights-cover",
        sort: index,
      }));

      let papers: typeof defaultPapers;
      if (ins.papers !== undefined) {
        papers = ins.papers.map((p, index) => {
          const slug = (p.slug ?? `paper-${index + 1}`).trim() || `paper-${index + 1}`;
          const signals =
            p.signals && p.signals.length > 0
              ? p.signals.map((s, i) => ({
                  label: (s.label ?? "").trim() || `Signal ${i + 1}`,
                  icon: (s.icon ?? signalIcons[i % signalIcons.length]) as
                    | "doc"
                    | "chart"
                    | "review",
                }))
              : [
                  { label: "Technical paper", icon: "doc" as const },
                  { label: "Figures & models", icon: "chart" as const },
                ];
          return {
            id: (p.id ?? slug).trim() || slug,
            slug,
            title: (p.title ?? "").trim() || "Untitled paper",
            series: (p.series ?? "").trim() || "IST Technical Research Series",
            date: (p.date ?? "").trim() || "",
            gated: p.gated !== false,
            summary: (p.summary ?? "").trim(),
            tags: (p.tags ?? []).map((t) => t.trim()).filter(Boolean),
            signals,
            coverKey: (p.coverKey ?? "insights-cover").trim() || "insights-cover",
            sort: index,
          };
        });
      } else if (ins.paper) {
        const base = defaultPapers[0]!;
        papers = [
          {
            ...base,
            title: pick(ins.paper.title, base.title),
            series: pick(ins.paper.series, base.series),
            date: pick(ins.paper.date, base.date),
            summary: pick(ins.paper.summary, base.summary),
            tags: ins.paper.tags !== undefined ? ins.paper.tags : base.tags,
            signals: base.signals.map((signal, i) => ({
              label: pick(ins.paper?.signals?.[i]?.label, signal.label),
              icon: signal.icon,
            })),
          },
        ];
      } else {
        papers = defaultPapers;
      }

      const upcoming =
        ins.upcoming !== undefined
          ? ins.upcoming.map((item, i) => ({
              id: (item.id ?? `upcoming-${i + 1}`).trim() || `upcoming-${i + 1}`,
              title: (item.title ?? "").trim() || "Upcoming publication",
              body: (item.body ?? "").trim(),
              status: (item.status ?? "").trim() || "Coming Soon",
            }))
          : [];

      return {
        eyebrow: pick(ins.eyebrow, "Insights"),
        title: pick(ins.title, "Insights"),
        intro: pick(ins.intro, INSIGHTS_INTRO),
        heroAlt: pick(ins.heroAlt, "Abstract networked research field — IST Insights"),
        featuredLabel: pick(ins.featuredLabel, "Featured Research"),
        papers,
        /** @deprecated use papers[0] — kept for older callers during transition */
        paper: papers[0] ?? {
          id: "",
          slug: "",
          title: "",
          series: "",
          date: "",
          gated: true,
          summary: "",
          tags: [] as string[],
          signals: [] as { label: string; icon: "doc" | "chart" | "review" }[],
          coverKey: "insights-cover",
          sort: 0,
        },
        upcomingHeading: pick(
          ins.upcomingHeading ?? ins.futureHeading,
          "Upcoming Publications",
        ),
        upcoming,
        /** @deprecated */
        futureHeading: pick(ins.upcomingHeading ?? ins.futureHeading, "Upcoming Publications"),
        future: upcoming,
        subscribeHeading: pick(
          ins.subscribeHeading,
          "Advance the future of networked intelligence.",
        ),
        subscribeLead: pick(
          ins.subscribeLead,
          "Stay informed with the latest research, technical papers, and perspectives from the IST team.",
        ),
        subscribeCta: pick(ins.subscribeCta, "Subscribe for Updates"),
        subscribeNote: pick(ins.subscribeNote, "No spam. Unsubscribe anytime."),
        subscribeSuccessTitle: pick(ins.subscribeSuccessTitle, "You're on the list."),
        subscribeSuccessBody: pick(
          ins.subscribeSuccessBody,
          "We'll send research updates — nothing else.",
        ),
        ...visionFields(ins),
      };
    })(),
    news: (() => {
      const n = o.news ?? {};
      // Empty arrays from an older Blob save must not wipe seed posts.
      const source = n.posts?.length ? n.posts : DEFAULT_NEWS_POSTS;
      const posts = source.map((post, i) => {
        const slug = (post.slug ?? `post-${i + 1}`).trim() || `post-${i + 1}`;
        const category = (NEWS_CATEGORIES as readonly string[]).includes(post.category ?? "")
          ? (post.category as NewsCategory)
          : "company";
        return {
          id: (post.id ?? slug).trim() || slug,
          slug,
          title: (post.title ?? "").trim() || "Untitled",
          category,
          date: (post.date ?? "").trim() || new Date().toISOString().slice(0, 10),
          excerpt: (post.excerpt ?? "").trim(),
          body: (post.body ?? "").trim(),
          image: (post.image ?? "").trim() || undefined,
        };
      });

      return {
        eyebrow: pick(n.eyebrow, "News"),
        title: pick(n.title, "Latest News & Updates"),
        lead: pick(
          n.lead,
          "Stay informed on partnerships, milestones, product updates, and company news.",
        ),
        heroAlt: pick(n.heroAlt, "IST news — networked systems and updates"),
        posts,
        ...visionFields(n),
      };
    })(),
    careers: (() => {
      const c = o.careers ?? {};
      // Empty arrays from an older Blob save must not wipe seed roles.
      const source = c.roles?.length ? c.roles : DEFAULT_CAREERS_ROLES;
      const roles = source.map((role, i) => {
        const slug = (role.slug ?? `role-${i + 1}`).trim() || `role-${i + 1}`;
        const type = (ROLE_TYPES as readonly string[]).includes(role.type ?? "")
          ? (role.type as RoleType)
          : "Full-time";
        return {
          id: (role.id ?? slug).trim() || slug,
          slug,
          title: (role.title ?? "").trim() || "Untitled role",
          team: (role.team ?? "").trim(),
          location: (role.location ?? "").trim(),
          type,
          summary: (role.summary ?? "").trim(),
          body: (role.body ?? "").trim(),
        };
      });

      return {
        eyebrow: pick(c.eyebrow, "Careers"),
        title: pick(c.title, CAREERS.title),
        titleLine1: pick(c.titleLine1, CAREERS.titleLines[0]),
        titleLine2: pick(c.titleLine2, CAREERS.titleLines[1]),
        lead: pick(c.lead, CAREERS.lead),
        roles,
      };
    })(),
    images: o.images ?? {},
    updatedAt: o.updatedAt ?? null,
  };
}

export type SiteContent = ReturnType<typeof buildContent>;
