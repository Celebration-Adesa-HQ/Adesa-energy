import "server-only";

import { siteConfig } from "@/config/site";

const rubrics = {
  "software-engineer": {
    threshold: 70,
    criteria: [
      {
        id: "software-development",
        label: "Software development",
        mandatory: true,
        weight: 30,
        phrases: [
          "software development",
          "software engineer",
          "web application",
          "application development",
          "frontend development",
          "backend development",
          "full stack",
          "full-stack",
        ],
      },
      {
        id: "delivery-maintenance",
        label: "Building or maintaining production software",
        mandatory: true,
        weight: 25,
        phrases: [
          "maintained",
          "implemented",
          "developed",
          "deployed",
          "production system",
          "debugging",
          "testing",
          "version control",
          "git",
        ],
      },
      {
        id: "technical-tools",
        label: "Relevant programming tools",
        mandatory: false,
        weight: 25,
        phrases: [
          "javascript",
          "typescript",
          "python",
          "react",
          "next.js",
          "nextjs",
          "node.js",
          "nodejs",
          "sql",
          "api",
        ],
      },
      {
        id: "operations-data",
        label: "Operational, energy, or data systems exposure",
        mandatory: false,
        weight: 20,
        phrases: [
          "energy management",
          "energy software",
          "fleet management",
          "operations platform",
          "data pipeline",
          "dashboard",
          "analytics",
          "monitoring",
        ],
      },
    ],
  },
  "sustainability-analyst": {
    threshold: 70,
    criteria: [
      {
        id: "sustainability-analysis",
        label: "Sustainability or environmental analysis",
        mandatory: true,
        weight: 35,
        phrases: [
          "sustainability analysis",
          "sustainability analyst",
          "environmental analysis",
          "environmental impact",
          "climate analysis",
          "sustainable development",
          "esg",
        ],
      },
      {
        id: "carbon-work",
        label: "Carbon reduction or emissions work",
        mandatory: true,
        weight: 30,
        phrases: [
          "carbon reduction",
          "carbon emissions",
          "emissions reduction",
          "greenhouse gas",
          "ghg",
          "carbon accounting",
          "carbon footprint",
          "decarbonisation",
          "decarbonization",
        ],
      },
      {
        id: "data-reporting",
        label: "Data analysis and reporting",
        mandatory: false,
        weight: 20,
        phrases: [
          "data analysis",
          "data analytics",
          "reporting",
          "excel",
          "power bi",
          "tableau",
          "research",
          "metrics",
        ],
      },
      {
        id: "optimisation",
        label: "Initiative measurement or optimisation",
        mandatory: false,
        weight: 15,
        phrases: [
          "optimize",
          "optimise",
          "optimization",
          "optimisation",
          "impact measurement",
          "performance indicator",
          "initiative evaluation",
        ],
      },
    ],
  },
  "product-designer": {
    threshold: 70,
    criteria: [
      {
        id: "product-design",
        label: "Product or user-experience design",
        mandatory: true,
        weight: 35,
        phrases: [
          "product design",
          "product designer",
          "user experience",
          "ux design",
          "ui/ux",
          "interaction design",
          "user-centered design",
          "user centred design",
        ],
      },
      {
        id: "interface-prototyping",
        label: "Interface design and prototyping",
        mandatory: true,
        weight: 30,
        phrases: [
          "interface design",
          "user interface",
          "wireframe",
          "wireframing",
          "prototype",
          "prototyping",
          "figma",
          "design system",
        ],
      },
      {
        id: "research-usability",
        label: "User research or usability evaluation",
        mandatory: false,
        weight: 20,
        phrases: [
          "user research",
          "usability testing",
          "customer research",
          "user interview",
          "journey mapping",
          "persona",
          "accessibility",
        ],
      },
      {
        id: "product-collaboration",
        label: "Cross-functional product delivery",
        mandatory: false,
        weight: 15,
        phrases: [
          "cross-functional",
          "product manager",
          "engineering team",
          "developer handoff",
          "design review",
          "stakeholder",
          "product strategy",
        ],
      },
    ],
  },
};

export function getCareerRole(slug) {
  const role = siteConfig.careers.jobs.jobListings.find((job) => job.slug === slug);
  if (role && rubrics[slug]) {
    return { ...role, screeningMode: "rubric", rubric: rubrics[slug] };
  }

  if (slug === siteConfig.careers.generalApplication.slug) {
    return {
      ...siteConfig.careers.generalApplication,
      screeningMode: "manual",
      rubric: null,
    };
  }

  return null;
}

export function getPublicCareerRole(slug) {
  const role = getCareerRole(slug);
  if (!role) return null;
  const { rubric: _rubric, ...publicRole } = role;
  return publicRole;
}

export function getCareerSlugs() {
  return [...Object.keys(rubrics), siteConfig.careers.generalApplication.slug];
}
