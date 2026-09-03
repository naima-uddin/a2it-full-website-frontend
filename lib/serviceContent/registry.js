/**
 * Central registry of editable service-page sections.
 *
 * Each entry defines:
 *  - page/label/route : grouping + display for the dashboard
 *  - defaults         : the ORIGINAL hardcoded values (fallback + seed)
 *  - fields           : how the dashboard renders the editor form
 *
 * Field types: "text" | "textarea" | "image" | "list"
 * A "list" field has { itemLabel, fields: [ ...sub-fields ] }.
 *
 * To make another page editable: add an entry here, then swap its component's
 * hardcoded strings for useSectionContent(key, defaults). Nothing else changes.
 */

export const SECTION_SCHEMAS = {
  "amazon-marketing": {
    page: "Amazon",
    label: "Amazon — Marketing Services",
    route: "/services/amazon",
    defaults: {
      heroTitle: "Amazon Marketing Services",
      heroDesc:
        "At A2IT, we specialize in providing comprehensive Amazon Marketing Services (AMS) that empower brands to enhance visibility, optimize product listings, and drive conversions.",
      amsHeading: "Understanding Amazon Marketing Services (AMS)",
      amsDesc:
        "Amazon Marketing Services, now integrated into the broader Amazon Ads ecosystem, is a suite of advertising tools designed to help sellers and vendors promote their products on Amazon.",
      coreHeading: "Core Components of A2IT's Amazon Marketing Services",
      cards: [
        {
          title: "Amazon Sponsored Products",
          desc: "Sponsored Products are cost-per-click (CPC) ads that promote individual product listings.",
        },
        {
          title: "Amazon Sponsored Brands",
          desc: "We use audience insights and behavioral data to create personalized ad experiences that drive engagement and conversions.",
        },
      ],
      processHeading: "Our Process",
      steps: [
        {
          title: "Initial Consultation",
          desc: "Share your business objectives and challenges with our team.",
        },
        {
          title: "Account Audit",
          desc: "We conduct a comprehensive review of your Amazon account.",
        },
        {
          title: "Strategy Development",
          desc: "Based on the audit, we craft a tailored marketing strategy.",
        },
      ],
      storiesHeading: "Success Stories",
      stories: [
        {
          title: "MOJO Outdoors",
          desc: "We helped MOJO Outdoors achieve record-setting sales, including a shipped COGS of $606,793.22 in December — a 41.9% increase.",
        },
        {
          title: "Tech Gadgets Inc.",
          desc: "Through optimized Sponsored Products campaigns and A+ Content, we increased visibility and delivered a 30% sales boost.",
        },
      ],
      ctaTitle: "Win More Business With Amazon Marketing Services",
      ctaDesc:
        "At A2IT, we provide comprehensive Amazon Marketing Services that help brands enhance visibility, drive traffic, and increase sales.",
      ctaButton: "Get Started Today",
    },
    fields: [
      { key: "heroTitle", label: "Hero Title", type: "text" },
      { key: "heroDesc", label: "Hero Description", type: "textarea" },
      { key: "amsHeading", label: "AMS Section Heading", type: "text" },
      { key: "amsDesc", label: "AMS Section Text", type: "textarea" },
      { key: "coreHeading", label: "Core Components Heading", type: "text" },
      {
        key: "cards",
        label: "Core Component Cards",
        type: "list",
        itemLabel: "Card",
        fields: [
          { key: "title", label: "Title", type: "text" },
          { key: "desc", label: "Description", type: "textarea" },
        ],
      },
      { key: "processHeading", label: "Process Heading", type: "text" },
      {
        key: "steps",
        label: "Process Steps",
        type: "list",
        itemLabel: "Step",
        fields: [
          { key: "title", label: "Title", type: "text" },
          { key: "desc", label: "Description", type: "textarea" },
        ],
      },
      { key: "storiesHeading", label: "Success Stories Heading", type: "text" },
      {
        key: "stories",
        label: "Success Stories",
        type: "list",
        itemLabel: "Story",
        fields: [
          { key: "title", label: "Title", type: "text" },
          { key: "desc", label: "Description", type: "textarea" },
        ],
      },
      { key: "ctaTitle", label: "CTA Title", type: "text" },
      { key: "ctaDesc", label: "CTA Description", type: "textarea" },
      { key: "ctaButton", label: "CTA Button Label", type: "text" },
    ],
  },
};

export const getSectionSchema = (key) => SECTION_SCHEMAS[key] || null;

// Grouped by page, for the dashboard overview list.
export const getSectionsByPage = () => {
  const groups = {};
  for (const [key, schema] of Object.entries(SECTION_SCHEMAS)) {
    const page = schema.page || "Other";
    if (!groups[page]) groups[page] = [];
    groups[page].push({ key, ...schema });
  }
  return groups;
};
