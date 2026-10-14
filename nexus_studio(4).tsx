import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  Monitor, Tablet, Smartphone, Undo2, Redo2, Download, Play, Save, 
  MousePointer2, Layout, Type, Image as ImageIcon, Square, Plus, 
  Layers, Settings, ChevronRight, ChevronDown, AlignLeft, AlignCenter, 
  AlignRight, Trash2, Copy, AlertCircle, FileText, FileCode2,
  Columns, ArrowUp, ArrowDown, Eye, EyeOff, FolderDown, Link, Edit2, Upload,
  GripVertical, Clipboard, Package, Palette, Sparkles, Box, Database,
  ShoppingBag, FolderKanban, CheckCircle2, Globe, Search, PlusCircle, X
} from 'lucide-react';

const BREAKPOINTS = {
  desktop: { id: 'desktop', width: '100%', icon: Monitor, label: 'Desktop (Base)' },
  tablet: { id: 'tablet', width: '768px', icon: Tablet, label: 'Tablet (< 768px)' },
  mobile: { id: 'mobile', width: '375px', icon: Smartphone, label: 'Mobile (< 480px)' }
};

const ELEMENT_TYPES = {
  PAGE: 'page', SECTION: 'section', CONTAINER: 'container', GRID: 'grid',
  TEXT: 'text', BUTTON: 'button', IMAGE: 'image', NAV: 'nav',
  FORM: 'form', PRODUCT_GRID: 'product_grid', PRODUCT_DETAIL: 'product_detail',
  CART_BLOCK: 'cart_block', CMS_LIST: 'cms_list'
};

const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', label: 'US Dollar ($)' },
  NGN: { code: 'NGN', symbol: '₦', label: 'Nigerian Naira (₦)' },
  EUR: { code: 'EUR', symbol: '€', label: 'Euro (€)' },
  GBP: { code: 'GBP', symbol: '£', label: 'British Pound (£)' }
};

const DEFAULT_DESIGN_TOKENS = {
  name: 'Clean Light Default',
  primaryColor: '#2563eb',
  accentColor: '#3b82f6',
  backgroundColor: '#ffffff',
  surfaceColor: '#f8fafc',
  textColor: '#0f172a',
  mutedColor: '#475569',
  borderColor: '#e2e8f0',
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  headingFont: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  baseFontSize: '16px',
  borderRadius: '0.5rem',
  buttonRadius: '0.375rem',
  containerWidth: '1200px',
  sectionPadding: '4rem 2rem'
};

const GLOBAL_TOKEN_PRESETS = [
  {
    id: 'preset_light',
    name: 'Clean Modern Light',
    tokens: { ...DEFAULT_DESIGN_TOKENS }
  },
  {
    id: 'preset_dark',
    name: 'Midnight Dark Slate',
    tokens: {
      ...DEFAULT_DESIGN_TOKENS,
      name: 'Midnight Dark Slate',
      primaryColor: '#3b82f6',
      accentColor: '#60a5fa',
      backgroundColor: '#0f172a',
      surfaceColor: '#1e293b',
      textColor: '#f8fafc',
      mutedColor: '#94a3b8',
      borderColor: '#334155'
    }
  },
  {
    id: 'preset_warm',
    name: 'Warm Editorial Serif',
    tokens: {
      ...DEFAULT_DESIGN_TOKENS,
      name: 'Warm Editorial Serif',
      primaryColor: '#d97706',
      accentColor: '#f59e0b',
      backgroundColor: '#fffbeb',
      surfaceColor: '#fef3c7',
      textColor: '#451a03',
      mutedColor: '#78350f',
      borderColor: '#fde68a',
      headingFont: 'Georgia, Cambria, serif',
      borderRadius: '0.25rem'
    }
  },
  {
    id: 'preset_emerald',
    name: 'Emerald Craft Studio',
    tokens: {
      ...DEFAULT_DESIGN_TOKENS,
      name: 'Emerald Craft Studio',
      primaryColor: '#059669',
      accentColor: '#10b981',
      backgroundColor: '#ffffff',
      surfaceColor: '#ecfdf5',
      textColor: '#064e3b',
      mutedColor: '#047857',
      borderColor: '#a7f3d0',
      borderRadius: '0.75rem'
    }
  }
];

const DEFAULT_ASSETS = [
  {
    id: 'ast_workspace',
    name: 'Studio Workspace',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop',
    alt: 'Modern developer workspace with laptop',
    folder: 'Hero & Brand',
    mimeType: 'image/jpeg',
    sizeBytes: 142000,
    createdAt: '2026-10-01T10:00:00Z'
  },
  {
    id: 'ast_product',
    name: 'Minimalist Product Shot',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
    alt: 'Studio wireless headphones on clean background',
    folder: 'Commerce',
    mimeType: 'image/jpeg',
    sizeBytes: 118000,
    createdAt: '2026-10-02T10:00:00Z'
  },
  {
    id: 'ast_analytics',
    name: 'Analytics Dashboard UI',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    alt: 'Data visualization analytics screen',
    folder: 'SaaS & Tech',
    mimeType: 'image/jpeg',
    sizeBytes: 164000,
    createdAt: '2026-10-03T10:00:00Z'
  }
];

const ROLE_PERMISSIONS = {
  Owner: {
    label: 'Owner (Full Control)',
    canEditCanvas: true,
    canManagePages: true,
    canManageAssets: true,
    canManageCms: true,
    canManageCommerce: true,
    canPublish: true,
    canManageTeam: true,
    canDeleteProject: true
  },
  Administrator: {
    label: 'Administrator',
    canEditCanvas: true,
    canManagePages: true,
    canManageAssets: true,
    canManageCms: true,
    canManageCommerce: true,
    canPublish: true,
    canManageTeam: true,
    canDeleteProject: false
  },
  Designer: {
    label: 'Designer (Canvas, Tokens & Assets)',
    canEditCanvas: true,
    canManagePages: true,
    canManageAssets: true,
    canManageCms: false,
    canManageCommerce: false,
    canPublish: false,
    canManageTeam: false,
    canDeleteProject: false
  },
  Editor: {
    label: 'Content Editor (CMS, Copy & Store)',
    canEditCanvas: true,
    canManagePages: false,
    canManageAssets: true,
    canManageCms: true,
    canManageCommerce: true,
    canPublish: false,
    canManageTeam: false,
    canDeleteProject: false
  },
  Viewer: {
    label: 'Viewer (Read & Preview Only)',
    canEditCanvas: false,
    canManagePages: false,
    canManageAssets: false,
    canManageCms: false,
    canManageCommerce: false,
    canPublish: false,
    canManageTeam: false,
    canDeleteProject: false
  }
};

const ONBOARDING_STEPS = [
  { id: 'step_project', label: '1. Create or open a website project', actionModal: 'dashboard' },
  { id: 'step_template', label: '2. Choose a starter template or AI brief', actionModal: 'ai' },
  { id: 'step_theme', label: '3. Customize Global Design System tokens', actionModal: 'design_system' },
  { id: 'step_page', label: '4. Add or configure a page & navigation', actionTab: 'pages' },
  { id: 'step_section', label: '5. Insert a reusable section or symbol', actionTab: 'templates' },
  { id: 'step_responsive', label: '6. Test Desktop, Tablet & Mobile breakpoints', actionDevice: 'mobile' },
  { id: 'step_preview', label: '7. Preview the interactive website', actionPreview: true },
  { id: 'step_validate', label: '8. Run Pre-Publish Validation & Export ZIP', actionModal: 'publishing' },
  { id: 'step_hosting', label: '9. Configure Hosting Provider & Custom Domain', actionModal: 'publishing' }
];

const formatMoney = (amount, currencyCode = 'USD') => {
  const cur = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const num = Number(amount) || 0;
  return `${cur.symbol}${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const HOSTING_PROVIDERS = {
  netlify: {
    id: 'netlify',
    name: 'Netlify Static & Edge Hosting',
    docsUrl: 'https://docs.netlify.com/api/get-started/',
    supportsPreview: true,
    supportsRollback: true,
    requiredEnvVars: ['NETLIFY_AUTH_TOKEN', 'NETLIFY_SITE_ID'],
    defaultOutputDir: 'dist',
    defaultBuildCommand: 'npm run build'
  },
  vercel: {
    id: 'vercel',
    name: 'Vercel Cloud Platform',
    docsUrl: 'https://vercel.com/docs/rest-api',
    supportsPreview: true,
    supportsRollback: true,
    requiredEnvVars: ['VERCEL_TOKEN', 'VERCEL_PROJECT_ID', 'VERCEL_ORG_ID'],
    defaultOutputDir: 'out',
    defaultBuildCommand: 'next build'
  },
  cloudflare: {
    id: 'cloudflare',
    name: 'Cloudflare Pages',
    docsUrl: 'https://developers.cloudflare.com/pages/',
    supportsPreview: true,
    supportsRollback: true,
    requiredEnvVars: ['CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ACCOUNT_ID'],
    defaultOutputDir: 'public',
    defaultBuildCommand: 'none (pre-built static HTML)'
  }
};

const DEFAULT_SITE_SETTINGS = {
  siteName: 'New Nexus Website',
  siteDescription: 'Built visually with NEXUS STUDIO.',
  defaultSeoTitle: 'New Nexus Website',
  defaultSeoDesc: 'Modern responsive website created in NEXUS STUDIO.',
  canonicalBaseUrl: 'https://example.com',
  faviconUrl: '',
  ogImageUrl: '',
  language: 'en',
  robotsTxtEnabled: true,
  allowIndexing: true,
  sitemapEnabled: true,
  customHeadComment: ''
};

const DEFAULT_PUBLISHING_STATE = {
  status: 'draft', // 'draft' | 'ready_to_publish' | 'building' | 'deploying' | 'published' | 'failed' | 'changes_unpublished'
  lastSavedAt: null,
  lastBuildAt: null,
  lastPublishedAt: null,
  publishedUrl: null,
  previewUrl: null,
  activeEnvironment: 'production', // 'preview' | 'production'
  providerId: 'netlify',
  providerConnected: false, // False in browser-only sandbox unless backend proxy is present
  siteIdentifier: '',
  productionBranch: 'main',
  outputDirectory: 'dist',
  envVarNames: ['NETLIFY_AUTH_TOKEN', 'NETLIFY_SITE_ID'],
  customDomains: [],
  deploymentHistory: [],
  lastBuildArtifacts: null
};

const DEFAULT_COMMERCE_SETTINGS = {
  currency: 'USD',
  taxRatePercent: 7.5,
  flatShippingRate: 12.00,
  freeShippingThreshold: 150.00,
  paymentGateway: 'paystack', // 'paystack' | 'stripe'
  livePaymentsConfigured: false,
  discountCodes: [
    { code: 'WELCOME10', type: 'percent', value: 10, active: true },
    { code: 'STUDIO25', type: 'fixed', value: 25, active: true }
  ]
};

const DEFAULT_STYLES = {
  section: { padding: '4rem 2rem', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', boxSizing: 'border-box' },
  container: { maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', boxSizing: 'border-box' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', width: '100%', boxSizing: 'border-box' },
  text: { fontSize: '1rem', color: '#333333', lineHeight: '1.5', margin: '0', whiteSpace: 'pre-wrap', wordBreak: 'break-word' },
  heading: { fontSize: '2.5rem', fontWeight: 'bold', color: '#111111', margin: '0', lineHeight: '1.2', whiteSpace: 'pre-wrap', wordBreak: 'break-word' },
  button: { padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontWeight: '500', display: 'inline-block', textAlign: 'center', textDecoration: 'none' },
  image: { width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '0.375rem', display: 'block' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', width: '100%', boxSizing: 'border-box' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0', width: '100%', maxWidth: '500px', boxSizing: 'border-box' }
};

const DESIGN_PRESETS = {
  typography: [
    { name: 'Display Hero', styles: { fontSize: '3.25rem', fontWeight: '800', lineHeight: '1.1', color: '#0f172a' } },
    { name: 'Section Title', styles: { fontSize: '2.25rem', fontWeight: '700', lineHeight: '1.2', color: '#1e293b' } },
    { name: 'Body Lead', styles: { fontSize: '1.125rem', fontWeight: '400', lineHeight: '1.6', color: '#475569' } },
    { name: 'Small Label', styles: { fontSize: '0.875rem', fontWeight: '600', lineHeight: '1.4', color: '#64748b' } }
  ],
  buttons: [
    { name: 'Primary Pill', styles: { backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '9999px', padding: '0.75rem 2rem', fontWeight: '600', border: 'none' } },
    { name: 'Dark Minimal', styles: { backgroundColor: '#09090b', color: '#fafafa', borderRadius: '0.5rem', padding: '0.75rem 1.5rem', fontWeight: '500', border: 'none' } },
    { name: 'Outline Ghost', styles: { backgroundColor: 'transparent', color: '#2563eb', borderWidth: '2px', borderStyle: 'solid', borderColor: '#2563eb', borderRadius: '0.375rem', padding: '0.625rem 1.25rem', fontWeight: '600' } }
  ],
  palettes: [
    { name: 'Modern Slate', bg: '#0f172a', text: '#f8fafc', accent: '#3b82f6' },
    { name: 'Clean Light', bg: '#ffffff', text: '#09090b', accent: '#2563eb' },
    { name: 'Warm Sunset', bg: '#fffbeb', text: '#78350f', accent: '#d97706' },
    { name: 'Emerald Tech', bg: '#064e3b', text: '#ecfdf5', accent: '#10b981' }
  ]
};

const generateId = () => 'el_' + Math.random().toString(36).substr(2, 9);
const clone = (obj) => JSON.parse(JSON.stringify(obj));
const escapeHtml = (unsafe) => {
  return (unsafe || '').toString()
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
};

const refreshIds = (node) => {
  node.id = generateId();
  if (node.children && Array.isArray(node.children)) {
    node.children.forEach(refreshIds);
  }
  return node;
};

const SECTION_TEMPLATES = {
  navbar: (brandName = 'NEXUS BRAND', links = [{ label: 'Home', href: '#' }, { label: 'Get Started', href: '#', isCta: true }], palette = null) => refreshIds({
    id: 'temp', type: ELEMENT_TYPES.NAV, name: 'Navigation Bar',
    styles: { base: { ...DEFAULT_STYLES.nav, backgroundColor: palette?.bg || '#ffffff', borderBottom: `1px solid ${palette?.border || '#e2e8f0'}` } },
    children: [
      { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Brand Logo', props: { content: brandName, tag: 'h3' }, styles: { base: { fontSize: '1.25rem', fontWeight: '800', color: palette?.text || '#0f172a', margin: '0' } }, children: [] },
      { id: 'temp', type: ELEMENT_TYPES.CONTAINER, name: 'Nav Links', styles: { base: { display: 'flex', flexDirection: 'row', gap: '1.25rem', alignItems: 'center', width: 'auto', margin: '0' }, mobile: { flexDirection: 'column', gap: '0.5rem' } }, children: links.map((lnk, idx) => (
        lnk.isCta ? {
          id: 'temp', type: ELEMENT_TYPES.BUTTON, name: `CTA ${lnk.label}`, props: { content: lnk.label, href: lnk.href || '#' },
          styles: { base: { ...DEFAULT_STYLES.button, backgroundColor: palette?.accent || '#2563eb', color: '#ffffff', padding: '0.5rem 1rem', fontSize: '0.875rem' } }, children: []
        } : {
          id: 'temp', type: ELEMENT_TYPES.BUTTON, name: `Nav ${lnk.label}`, props: { content: lnk.label, href: lnk.href || '#' },
          styles: { base: { backgroundColor: 'transparent', color: palette?.muted || '#475569', padding: '0.25rem 0.5rem', fontWeight: '500', fontSize: '0.9rem' } }, children: []
        }
      ))}
    ]
  }),
  hero: (title = 'Build Something Amazing', subtitle = 'The fastest way to design, build, and ship professional websites visually.', ctaText = 'Explore Now', palette = null) => refreshIds({
    id: 'temp', type: ELEMENT_TYPES.SECTION, name: 'Hero Section',
    styles: { base: { ...DEFAULT_STYLES.section, backgroundColor: palette?.surface || '#f8fafc', alignItems: 'center', textAlign: 'center', padding: '6rem 2rem' }, mobile: { padding: '3.5rem 1.25rem' } },
    children: [
      { id: 'temp', type: ELEMENT_TYPES.CONTAINER, name: 'Hero Content', styles: { base: { ...DEFAULT_STYLES.container, alignItems: 'center', maxWidth: '820px' } }, children: [
        { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Hero Heading', props: { content: title, tag: 'h1' }, styles: { base: { ...DEFAULT_STYLES.heading, fontSize: '3.5rem', marginBottom: '1rem', color: palette?.text || '#0f172a' }, tablet: { fontSize: '2.75rem' }, mobile: { fontSize: '2.15rem' } }, children: [] },
        { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Hero Subtitle', props: { content: subtitle, tag: 'p' }, styles: { base: { ...DEFAULT_STYLES.text, fontSize: '1.25rem', color: palette?.muted || '#64748b', marginBottom: '2rem' }, mobile: { fontSize: '1rem' } }, children: [] },
        { id: 'temp', type: ELEMENT_TYPES.BUTTON, name: 'CTA Button', props: { content: ctaText, href: '#' }, styles: { base: { ...DEFAULT_STYLES.button, backgroundColor: palette?.accent || '#2563eb', padding: '0.875rem 2rem', fontSize: '1rem' } }, children: [] }
      ]}
    ]
  }),
  features: (heading = 'Core Capabilities', items = null, palette = null) => {
    const list = items || [
      { title: 'Fast Performance', desc: 'Optimized clean semantic output for instant page loads and high SEO rankings.' },
      { title: 'True Responsiveness', desc: 'Cascade styles effortlessly across desktop, tablet, and mobile breakpoints.' },
      { title: 'Visual Customization', desc: 'Edit every pixel, layout property, and dynamic collection visually in real time.' }
    ];
    return refreshIds({
      id: 'temp', type: ELEMENT_TYPES.SECTION, name: 'Feature Grid', styles: { base: { ...DEFAULT_STYLES.section, backgroundColor: palette?.bg || '#ffffff' } }, children: [
        { id: 'temp', type: ELEMENT_TYPES.CONTAINER, name: 'Container', styles: { base: { ...DEFAULT_STYLES.container } }, children: [
          { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Section Heading', props: { content: heading, tag: 'h2' }, styles: { base: { ...DEFAULT_STYLES.heading, fontSize: '2rem', textAlign: 'center', marginBottom: '2rem', color: palette?.text || '#0f172a' } }, children: [] },
          { id: 'temp', type: ELEMENT_TYPES.GRID, name: 'Features Grid', styles: { base: { ...DEFAULT_STYLES.grid, gridTemplateColumns: 'repeat(3, 1fr)' }, tablet: { gridTemplateColumns: 'repeat(2, 1fr)' }, mobile: { gridTemplateColumns: '1fr' } }, children: list.map((feat, i) => ({
            id: 'temp', type: ELEMENT_TYPES.CONTAINER, name: `Feature ${i + 1}`, styles: { base: { padding: '2rem', backgroundColor: palette?.surface || '#f8fafc', borderRadius: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', border: '1px solid #e2e8f0' } }, children: [
              { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Title', props: { content: feat.title, tag: 'h3' }, styles: { base: { ...DEFAULT_STYLES.heading, fontSize: '1.25rem', color: palette?.text || '#0f172a' } }, children: [] },
              { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Desc', props: { content: feat.desc, tag: 'p' }, styles: { base: { ...DEFAULT_STYLES.text, color: palette?.muted || '#64748b' } }, children: [] }
            ]
          }))}
        ]}
      ]
    });
  },
  services: (heading = 'Professional Services', servicesList = null) => {
    const items = servicesList || [
      { title: 'Signature Service Package', price: '$85', desc: 'Tailored consultation and full execution by senior specialists.' },
      { title: 'Express Session', price: '$45', desc: 'Focused 45-minute session designed for immediate results.' },
      { title: 'Executive Membership', price: '$190/mo', desc: 'Priority scheduling, unlimited touch-ups, and dedicated support.' }
    ];
    return refreshIds({
      id: 'temp', type: ELEMENT_TYPES.SECTION, name: 'Service Cards', styles: { base: { ...DEFAULT_STYLES.section, backgroundColor: '#ffffff' } }, children: [
        { id: 'temp', type: ELEMENT_TYPES.CONTAINER, name: 'Services Container', styles: { base: { ...DEFAULT_STYLES.container } }, children: [
          { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Services Heading', props: { content: heading, tag: 'h2' }, styles: { base: { ...DEFAULT_STYLES.heading, fontSize: '2.25rem', textAlign: 'center', marginBottom: '2rem' } }, children: [] },
          { id: 'temp', type: ELEMENT_TYPES.GRID, name: 'Services Grid', styles: { base: { ...DEFAULT_STYLES.grid, gridTemplateColumns: 'repeat(3, 1fr)' }, tablet: { gridTemplateColumns: 'repeat(2, 1fr)' }, mobile: { gridTemplateColumns: '1fr' } }, children: items.map((srv, idx) => ({
            id: 'temp', type: ELEMENT_TYPES.CONTAINER, name: `Service Card ${idx + 1}`, styles: { base: { padding: '2rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.75rem' } }, children: [
              { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Service Price', props: { content: srv.price, tag: 'span' }, styles: { base: { fontSize: '0.875rem', fontWeight: '700', color: '#2563eb' } }, children: [] },
              { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Service Name', props: { content: srv.title, tag: 'h3' }, styles: { base: { fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' } }, children: [] },
              { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Service Description', props: { content: srv.desc, tag: 'p' }, styles: { base: { fontSize: '0.95rem', color: '#64748b' } }, children: [] }
            ]
          }))}
        ]}
      ]
    });
  },
  gallery: (heading = 'Selected Works & Showcase') => refreshIds({
    id: 'temp', type: ELEMENT_TYPES.SECTION, name: 'Portfolio Gallery', styles: { base: { ...DEFAULT_STYLES.section, backgroundColor: '#ffffff' } }, children: [
      { id: 'temp', type: ELEMENT_TYPES.CONTAINER, name: 'Gallery Container', styles: { base: { ...DEFAULT_STYLES.container } }, children: [
        { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Gallery Heading', props: { content: heading, tag: 'h2' }, styles: { base: { ...DEFAULT_STYLES.heading, fontSize: '2.25rem', marginBottom: '2rem', textAlign: 'center' } }, children: [] },
        { id: 'temp', type: ELEMENT_TYPES.GRID, name: 'Gallery Grid', styles: { base: { ...DEFAULT_STYLES.grid, gridTemplateColumns: 'repeat(3, 1fr)' }, tablet: { gridTemplateColumns: 'repeat(2, 1fr)' }, mobile: { gridTemplateColumns: '1fr' } }, children: [
          { id: 'temp', type: ELEMENT_TYPES.CONTAINER, name: 'Gallery Item 1', styles: { base: { display: 'flex', flexDirection: 'column', gap: '0.75rem' } }, children: [
            { id: 'temp', type: ELEMENT_TYPES.IMAGE, name: 'Project Image 1', props: { src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop', alt: 'Modern web design workspace' }, styles: { base: { ...DEFAULT_STYLES.image, height: '240px' } }, children: [] },
            { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Caption 1', props: { content: '01 / Digital Brand Identity', tag: 'h3' }, styles: { base: { fontSize: '1.1rem', fontWeight: '700' } }, children: [] }
          ]},
          { id: 'temp', type: ELEMENT_TYPES.CONTAINER, name: 'Gallery Item 2', styles: { base: { display: 'flex', flexDirection: 'column', gap: '0.75rem' } }, children: [
            { id: 'temp', type: ELEMENT_TYPES.IMAGE, name: 'Project Image 2', props: { src: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop', alt: 'Minimalist studio product photography' }, styles: { base: { ...DEFAULT_STYLES.image, height: '240px' } }, children: [] },
            { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Caption 2', props: { content: '02 / Spatial Experience & Architecture', tag: 'h3' }, styles: { base: { fontSize: '1.1rem', fontWeight: '700' } }, children: [] }
          ]},
          { id: 'temp', type: ELEMENT_TYPES.CONTAINER, name: 'Gallery Item 3', styles: { base: { display: 'flex', flexDirection: 'column', gap: '0.75rem' } }, children: [
            { id: 'temp', type: ELEMENT_TYPES.IMAGE, name: 'Project Image 3', props: { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop', alt: 'Interactive analytics platform' }, styles: { base: { ...DEFAULT_STYLES.image, height: '240px' } }, children: [] },
            { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Caption 3', props: { content: '03 / Next-Gen Commerce System', tag: 'h3' }, styles: { base: { fontSize: '1.1rem', fontWeight: '700' } }, children: [] }
          ]}
        ]}
      ]}
    ]
  }),
  testimonials: (heading = 'What Clients & Community Say') => refreshIds({
    id: 'temp', type: ELEMENT_TYPES.SECTION, name: 'Testimonials Section', styles: { base: { ...DEFAULT_STYLES.section, backgroundColor: '#f8fafc' } }, children: [
      { id: 'temp', type: ELEMENT_TYPES.CONTAINER, name: 'Testimonials Container', styles: { base: { ...DEFAULT_STYLES.container } }, children: [
        { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Testimonials Heading', props: { content: heading, tag: 'h2' }, styles: { base: { ...DEFAULT_STYLES.heading, fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' } }, children: [] },
        { id: 'temp', type: ELEMENT_TYPES.GRID, name: 'Testimonials Grid', styles: { base: { ...DEFAULT_STYLES.grid, gridTemplateColumns: 'repeat(2, 1fr)' }, mobile: { gridTemplateColumns: '1fr' } }, children: [
          { id: 'temp', type: ELEMENT_TYPES.CONTAINER, name: 'Quote Card 1', styles: { base: { padding: '2rem', backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' } }, children: [
            { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Quote Text', props: { content: '“The clarity of structure and attention to responsive detail completely transformed how we present our services online.”', tag: 'p' }, styles: { base: { fontSize: '1.05rem', color: '#334155', lineHeight: '1.6' } }, children: [] },
            { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Quote Author', props: { content: '— Client Feedback Placeholder (Editable)', tag: 'span' }, styles: { base: { fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' } }, children: [] }
          ]},
          { id: 'temp', type: ELEMENT_TYPES.CONTAINER, name: 'Quote Card 2', styles: { base: { padding: '2rem', backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' } }, children: [
            { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Quote Text', props: { content: '“Fast, intuitive, and easy for our visitors to navigate on both mobile phones and desktop monitors.”', tag: 'p' }, styles: { base: { fontSize: '1.05rem', color: '#334155', lineHeight: '1.6' } }, children: [] },
            { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Quote Author', props: { content: '— Partner Review Placeholder (Editable)', tag: 'span' }, styles: { base: { fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' } }, children: [] }
          ]}
        ]}
      ]}
    ]
  }),
  pricing: () => refreshIds({
    id: 'temp', type: ELEMENT_TYPES.SECTION, name: 'Pricing Section', styles: { base: { ...DEFAULT_STYLES.section, backgroundColor: '#f8fafc' } }, children: [
      { id: 'temp', type: ELEMENT_TYPES.CONTAINER, name: 'Pricing Container', styles: { base: { ...DEFAULT_STYLES.container, alignItems: 'center' } }, children: [
        { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Pricing Title', props: { content: 'Transparent Pricing', tag: 'h2' }, styles: { base: { ...DEFAULT_STYLES.heading, fontSize: '2.25rem', marginBottom: '2rem' } }, children: [] },
        { id: 'temp', type: ELEMENT_TYPES.GRID, name: 'Pricing Grid', styles: { base: { ...DEFAULT_STYLES.grid, gridTemplateColumns: 'repeat(3, 1fr)' }, tablet: { gridTemplateColumns: 'repeat(2, 1fr)' }, mobile: { gridTemplateColumns: '1fr' } }, children: [
          { id: 'temp', type: ELEMENT_TYPES.CONTAINER, name: 'Starter Plan', styles: { base: { padding: '2rem', backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' } }, children: [
            { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Tier', props: { content: 'Starter', tag: 'h3' }, styles: { base: { fontSize: '1.25rem', fontWeight: '700' } }, children: [] },
            { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Price', props: { content: '$19/mo', tag: 'h4' }, styles: { base: { fontSize: '2rem', fontWeight: '800', color: '#2563eb' } }, children: [] },
            { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Details', props: { content: 'Ideal for personal portfolios and landing pages.', tag: 'p' }, styles: { base: { color: '#64748b', fontSize: '0.875rem' } }, children: [] },
            { id: 'temp', type: ELEMENT_TYPES.BUTTON, name: 'Select Starter', props: { content: 'Choose Starter', href: '#' }, styles: { base: { ...DEFAULT_STYLES.button, width: '100%' } }, children: [] }
          ]},
          { id: 'temp', type: ELEMENT_TYPES.CONTAINER, name: 'Pro Plan', styles: { base: { padding: '2rem', backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '0.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' } }, children: [
            { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Tier', props: { content: 'Professional', tag: 'h3' }, styles: { base: { fontSize: '1.25rem', fontWeight: '700', color: '#ffffff' } }, children: [] },
            { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Price', props: { content: '$49/mo', tag: 'h4' }, styles: { base: { fontSize: '2rem', fontWeight: '800', color: '#60a5fa' } }, children: [] },
            { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Details', props: { content: 'Complete CMS, custom pages, and priority performance.', tag: 'p' }, styles: { base: { color: '#94a3b8', fontSize: '0.875rem' } }, children: [] },
            { id: 'temp', type: ELEMENT_TYPES.BUTTON, name: 'Select Pro', props: { content: 'Choose Pro', href: '#' }, styles: { base: { ...DEFAULT_STYLES.button, backgroundColor: '#3b82f6', width: '100%' } }, children: [] }
          ]},
          { id: 'temp', type: ELEMENT_TYPES.CONTAINER, name: 'Enterprise Plan', styles: { base: { padding: '2rem', backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' } }, children: [
            { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Tier', props: { content: 'Agency', tag: 'h3' }, styles: { base: { fontSize: '1.25rem', fontWeight: '700' } }, children: [] },
            { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Price', props: { content: '$99/mo', tag: 'h4' }, styles: { base: { fontSize: '2rem', fontWeight: '800', color: '#2563eb' } }, children: [] },
            { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Details', props: { content: 'Unlimited sites, e-commerce, and full white-label export.', tag: 'p' }, styles: { base: { color: '#64748b', fontSize: '0.875rem' } }, children: [] },
            { id: 'temp', type: ELEMENT_TYPES.BUTTON, name: 'Select Agency', props: { content: 'Contact Sales', href: '#' }, styles: { base: { ...DEFAULT_STYLES.button, width: '100%' } }, children: [] }
          ]}
        ]}
      ]}
    ]
  }),
  faq: (heading = 'Frequently Asked Questions') => refreshIds({
    id: 'temp', type: ELEMENT_TYPES.SECTION, name: 'FAQ Section', styles: { base: { ...DEFAULT_STYLES.section, backgroundColor: '#ffffff' } }, children: [
      { id: 'temp', type: ELEMENT_TYPES.CONTAINER, name: 'FAQ Container', styles: { base: { ...DEFAULT_STYLES.container, maxWidth: '800px' } }, children: [
        { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'FAQ Heading', props: { content: heading, tag: 'h2' }, styles: { base: { ...DEFAULT_STYLES.heading, fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' } }, children: [] },
        { id: 'temp', type: ELEMENT_TYPES.CONTAINER, name: 'FAQ Item 1', styles: { base: { padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.5rem' } }, children: [
          { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Question 1', props: { content: 'How quickly can we get started?', tag: 'h3' }, styles: { base: { fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' } }, children: [] },
          { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Answer 1', props: { content: 'You can customize every section immediately and launch your exported site on any static or cloud hosting provider.', tag: 'p' }, styles: { base: { fontSize: '0.95rem', color: '#475569' } }, children: [] }
        ]},
        { id: 'temp', type: ELEMENT_TYPES.CONTAINER, name: 'FAQ Item 2', styles: { base: { padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.5rem' } }, children: [
          { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Question 2', props: { content: 'Can we customize styles for mobile devices?', tag: 'h3' }, styles: { base: { fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' } }, children: [] },
          { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Answer 2', props: { content: 'Yes. Switch between Desktop, Tablet, and Mobile modes in the top bar to apply breakpoint-specific overrides.', tag: 'p' }, styles: { base: { fontSize: '0.95rem', color: '#475569' } }, children: [] }
        ]}
      ]}
    ]
  }),
  bookingCta: (title = 'Reserve Your Appointment Today', subtitle = 'Select a convenient time slot or request a private consultation with our team.', btnText = 'Book Appointment') => refreshIds({
    id: 'temp', type: ELEMENT_TYPES.SECTION, name: 'Booking Call to Action', styles: { base: { ...DEFAULT_STYLES.section, backgroundColor: '#0f172a', color: '#ffffff', padding: '4.5rem 2rem' } }, children: [
      { id: 'temp', type: ELEMENT_TYPES.CONTAINER, name: 'Booking Container', styles: { base: { ...DEFAULT_STYLES.container, alignItems: 'center', textAlign: 'center', maxWidth: '760px' } }, children: [
        { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Booking Title', props: { content: title, tag: 'h2' }, styles: { base: { ...DEFAULT_STYLES.heading, fontSize: '2.25rem', color: '#ffffff' } }, children: [] },
        { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Booking Subtitle', props: { content: subtitle, tag: 'p' }, styles: { base: { ...DEFAULT_STYLES.text, color: '#cbd5e1', fontSize: '1.1rem', marginBottom: '1rem' } }, children: [] },
        { id: 'temp', type: ELEMENT_TYPES.BUTTON, name: 'Booking Button', props: { content: btnText, href: '#' }, styles: { base: { ...DEFAULT_STYLES.button, backgroundColor: '#3b82f6', padding: '0.875rem 2.25rem', fontSize: '1rem', fontWeight: '600' } }, children: [] }
      ]}
    ]
  }),
  newsletter: (title = 'Subscribe to Our Newsletter', subtitle = 'Receive curated insights, product updates, and announcements directly in your inbox.') => refreshIds({
    id: 'temp', type: ELEMENT_TYPES.SECTION, name: 'Newsletter Section', styles: { base: { ...DEFAULT_STYLES.section, backgroundColor: '#eff6ff', padding: '4rem 2rem' } }, children: [
      { id: 'temp', type: ELEMENT_TYPES.CONTAINER, name: 'Newsletter Container', styles: { base: { ...DEFAULT_STYLES.container, alignItems: 'center', textAlign: 'center', maxWidth: '680px' } }, children: [
        { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Newsletter Heading', props: { content: title, tag: 'h2' }, styles: { base: { ...DEFAULT_STYLES.heading, fontSize: '1.85rem', color: '#1e3a8a' } }, children: [] },
        { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Newsletter Copy', props: { content: subtitle, tag: 'p' }, styles: { base: { ...DEFAULT_STYLES.text, color: '#3b82f6', marginBottom: '1rem' } }, children: [] },
        { id: 'temp', type: ELEMENT_TYPES.FORM, name: 'Newsletter Signup Form', props: { submitLabel: 'Subscribe Now', formTitle: 'Join the Mailing List' }, styles: { base: { ...DEFAULT_STYLES.form, backgroundColor: '#ffffff' } }, children: [] }
      ]}
    ]
  }),
  ecommerceGrid: (heading = 'Featured Products') => refreshIds({
    id: 'temp', type: ELEMENT_TYPES.SECTION, name: 'Storefront Section', styles: { base: { ...DEFAULT_STYLES.section } }, children: [
      { id: 'temp', type: ELEMENT_TYPES.CONTAINER, name: 'Store Container', styles: { base: { ...DEFAULT_STYLES.container } }, children: [
        { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Store Heading', props: { content: heading, tag: 'h2' }, styles: { base: { ...DEFAULT_STYLES.heading, fontSize: '2rem', marginBottom: '1rem' } }, children: [] },
        { id: 'temp', type: ELEMENT_TYPES.PRODUCT_GRID, name: 'Live Product Grid', props: { columns: 3 }, styles: { base: { width: '100%' } }, children: [] }
      ]}
    ]
  }),
  cmsBlock: (heading = 'Latest Articles & Updates') => refreshIds({
    id: 'temp', type: ELEMENT_TYPES.SECTION, name: 'CMS Dynamic List', styles: { base: { ...DEFAULT_STYLES.section } }, children: [
      { id: 'temp', type: ELEMENT_TYPES.CONTAINER, name: 'CMS Container', styles: { base: { ...DEFAULT_STYLES.container } }, children: [
        { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'CMS Heading', props: { content: heading, tag: 'h2' }, styles: { base: { ...DEFAULT_STYLES.heading, fontSize: '2rem', marginBottom: '1rem' } }, children: [] },
        { id: 'temp', type: ELEMENT_TYPES.CMS_LIST, name: 'Dynamic Collection Feed', props: { collectionId: 'col_blog' }, styles: { base: { width: '100%' } }, children: [] }
      ]}
    ]
  }),
  contactForm: (heading = 'Get In Touch') => refreshIds({
    id: 'temp', type: ELEMENT_TYPES.SECTION, name: 'Contact Section', styles: { base: { ...DEFAULT_STYLES.section, alignItems: 'center', backgroundColor: '#f8fafc' } }, children: [
      { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Contact Heading', props: { content: heading, tag: 'h2' }, styles: { base: { ...DEFAULT_STYLES.heading, fontSize: '2rem', marginBottom: '1rem' } }, children: [] },
      { id: 'temp', type: ELEMENT_TYPES.FORM, name: 'Contact Form', props: { submitLabel: 'Send Message', formTitle: 'Send us a message' }, styles: { base: { ...DEFAULT_STYLES.form, backgroundColor: '#ffffff' } }, children: [] }
    ]
  }),
  footer: (brandName = 'NEXUS STUDIO') => refreshIds({
    id: 'temp', type: ELEMENT_TYPES.SECTION, name: 'Footer', styles: { base: { padding: '3rem 2rem', backgroundColor: '#0f172a', color: '#94a3b8', width: '100%' } }, children: [
      { id: 'temp', type: ELEMENT_TYPES.CONTAINER, name: 'Footer Inner', styles: { base: { ...DEFAULT_STYLES.container, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, mobile: { flexDirection: 'column', gap: '1rem' } }, children: [
        { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Copyright', props: { content: `© 2026 ${brandName}. All rights reserved.`, tag: 'p' }, styles: { base: { color: '#94a3b8', fontSize: '0.875rem' } }, children: [] },
        { id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Footer Tagline', props: { content: 'Built visually with NEXUS STUDIO.', tag: 'p' }, styles: { base: { color: '#64748b', fontSize: '0.875rem' } }, children: [] }
      ]}
    ]
  })
};

const COMPONENTS = [
  { id: 'navbar', name: 'Navigation Bar', category: 'Headers & Nav', icon: Globe, create: () => SECTION_TEMPLATES.navbar() },
  { id: 'hero', name: 'Hero Section', category: 'Hero', icon: Sparkles, create: () => SECTION_TEMPLATES.hero() },
  { id: 'features', name: 'Feature Grid', category: 'Features', icon: Columns, create: () => SECTION_TEMPLATES.features() },
  { id: 'services', name: 'Service Cards', category: 'Services', icon: Box, create: () => SECTION_TEMPLATES.services() },
  { id: 'gallery', name: 'Portfolio Gallery', category: 'Gallery', icon: ImageIcon, create: () => SECTION_TEMPLATES.gallery() },
  { id: 'testimonials', name: 'Testimonials', category: 'Social Proof', icon: CheckCircle2, create: () => SECTION_TEMPLATES.testimonials() },
  { id: 'pricing', name: 'Pricing Tables', category: 'Pricing', icon: Package, create: () => SECTION_TEMPLATES.pricing() },
  { id: 'faq', name: 'FAQ Accordion List', category: 'FAQ', icon: AlertCircle, create: () => SECTION_TEMPLATES.faq() },
  { id: 'bookingCta', name: 'Booking Call to Action', category: 'Booking', icon: MousePointer2, create: () => SECTION_TEMPLATES.bookingCta() },
  { id: 'newsletter', name: 'Newsletter Section', category: 'Marketing', icon: FileCode2, create: () => SECTION_TEMPLATES.newsletter() },
  { id: 'ecommerceGrid', name: 'Dynamic Storefront', category: 'Commerce', icon: ShoppingBag, create: () => SECTION_TEMPLATES.ecommerceGrid() },
  { id: 'cmsBlock', name: 'Dynamic CMS Feed', category: 'CMS', icon: Database, create: () => SECTION_TEMPLATES.cmsBlock() },
  { id: 'contactForm', name: 'Contact Section', category: 'Forms', icon: FileText, create: () => SECTION_TEMPLATES.contactForm() },
  { id: 'footer', name: 'Site Footer', category: 'Footers', icon: Square, create: () => SECTION_TEMPLATES.footer() }
];

const ELEMENT_CATALOG = [
  {
    category: 'Layout',
    items: [
      { type: ELEMENT_TYPES.SECTION, name: 'Section', icon: Square, create: () => ({ id: generateId(), type: ELEMENT_TYPES.SECTION, name: 'Section', styles: { base: { ...DEFAULT_STYLES.section } }, children: [] }) },
      { type: ELEMENT_TYPES.CONTAINER, name: 'Container', icon: Layout, create: () => ({ id: generateId(), type: ELEMENT_TYPES.CONTAINER, name: 'Container', styles: { base: { ...DEFAULT_STYLES.container } }, children: [] }) },
      { type: ELEMENT_TYPES.GRID, name: 'Grid', icon: Columns, create: () => ({ id: generateId(), type: ELEMENT_TYPES.GRID, name: 'Grid', styles: { base: { ...DEFAULT_STYLES.grid }, tablet: { gridTemplateColumns: 'repeat(2, 1fr)' }, mobile: { gridTemplateColumns: '1fr' } }, children: [] }) },
      { type: ELEMENT_TYPES.NAV, name: 'Navbar', icon: Globe, create: SECTION_TEMPLATES.navbar }
    ]
  },
  {
    category: 'Basic & Media',
    items: [
      { type: ELEMENT_TYPES.TEXT, name: 'Heading', icon: Type, create: () => ({ id: generateId(), type: ELEMENT_TYPES.TEXT, name: 'Heading', props: { content: 'Heading Text', tag: 'h2' }, styles: { base: { ...DEFAULT_STYLES.heading } }, children: [] }) },
      { type: ELEMENT_TYPES.TEXT, name: 'Paragraph', icon: FileText, create: () => ({ id: generateId(), type: ELEMENT_TYPES.TEXT, name: 'Paragraph', props: { content: 'Add your custom text here.', tag: 'p' }, styles: { base: { ...DEFAULT_STYLES.text } }, children: [] }) },
      { type: ELEMENT_TYPES.BUTTON, name: 'Button', icon: MousePointer2, create: () => ({ id: generateId(), type: ELEMENT_TYPES.BUTTON, name: 'Button', props: { content: 'Click Me', href: '#' }, styles: { base: { ...DEFAULT_STYLES.button } }, children: [] }) },
      { type: ELEMENT_TYPES.IMAGE, name: 'Image', icon: ImageIcon, create: () => ({ id: generateId(), type: ELEMENT_TYPES.IMAGE, name: 'Image', props: { src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop', alt: 'Descriptive image' }, styles: { base: { ...DEFAULT_STYLES.image } }, children: [] }) }
    ]
  },
  {
    category: 'Dynamic, Store & Forms',
    items: [
      { type: ELEMENT_TYPES.FORM, name: 'Lead Form', icon: FileCode2, create: () => ({ id: generateId(), type: ELEMENT_TYPES.FORM, name: 'Contact Form', props: { submitLabel: 'Submit Inquiry' }, styles: { base: { ...DEFAULT_STYLES.form } }, children: [] }) },
      { type: ELEMENT_TYPES.PRODUCT_GRID, name: 'Product Grid', icon: ShoppingBag, create: () => ({ id: generateId(), type: ELEMENT_TYPES.PRODUCT_GRID, name: 'Storefront Grid', props: { columns: 3, showSearch: true, showCategories: true }, styles: { base: { width: '100%', padding: '1rem 0' } }, children: [] }) },
      { type: ELEMENT_TYPES.PRODUCT_DETAIL, name: 'Product Detail', icon: Package, create: () => ({ id: generateId(), type: ELEMENT_TYPES.PRODUCT_DETAIL, name: 'Product Detail Block', props: { productId: 'context' }, styles: { base: { width: '100%', padding: '1.5rem 0' } }, children: [] }) },
      { type: ELEMENT_TYPES.CART_BLOCK, name: 'Cart Summary', icon: ShoppingBag, create: () => ({ id: generateId(), type: ELEMENT_TYPES.CART_BLOCK, name: 'Shopping Cart Block', props: {}, styles: { base: { width: '100%', padding: '1rem 0' } }, children: [] }) },
      { type: ELEMENT_TYPES.CMS_LIST, name: 'CMS Feed', icon: Database, create: () => ({ id: generateId(), type: ELEMENT_TYPES.CMS_LIST, name: 'CMS Collection List', props: { collectionId: 'col_blog' }, styles: { base: { width: '100%', padding: '1rem 0' } }, children: [] }) }
    ]
  }
];

const CMS_FIELD_TYPES = [
  { id: 'text', label: 'Plain Text' },
  { id: 'multiline', label: 'Rich / Multiline Text' },
  { id: 'number', label: 'Number' },
  { id: 'boolean', label: 'Boolean (Switch)' },
  { id: 'image', label: 'Image URL' },
  { id: 'url', label: 'External / Internal URL' },
  { id: 'date', label: 'Date' },
  { id: 'select', label: 'Single Selection' },
  { id: 'multiselect', label: 'Multiple Selection (Comma-separated)' },
  { id: 'reference', label: 'Record Reference' }
];

const toSlug = (str) => (str || '').toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item-' + Math.random().toString(36).substr(2, 4);

const STARTER_COLLECTION_PRESETS = {
  blog: {
    name: 'Blog Posts', slug: 'blog',
    fields: [
      { id: 'f_title', key: 'title', name: 'Title', type: 'text', required: true },
      { id: 'f_summary', key: 'summary', name: 'Excerpt', type: 'multiline', required: true },
      { id: 'f_body', key: 'body', name: 'Article Body', type: 'multiline', required: false },
      { id: 'f_image', key: 'image', name: 'Cover Image', type: 'image', required: false },
      { id: 'f_category', key: 'category', name: 'Category', type: 'select', options: ['Product', 'Design', 'Engineering', 'Culture'], required: false },
      { id: 'f_date', key: 'date', name: 'Publish Date', type: 'date', required: false },
      { id: 'f_author', key: 'authorRef', name: 'Author Reference', type: 'reference', refCollectionId: 'col_authors', required: false }
    ]
  },
  authors: {
    name: 'Authors', slug: 'authors',
    fields: [
      { id: 'f_title', key: 'title', name: 'Full Name', type: 'text', required: true },
      { id: 'f_role', key: 'category', name: 'Role / Title', type: 'text', required: false },
      { id: 'f_bio', key: 'summary', name: 'Biography', type: 'multiline', required: false },
      { id: 'f_avatar', key: 'image', name: 'Avatar Image', type: 'image', required: false }
    ]
  },
  categories: {
    name: 'Categories', slug: 'categories',
    fields: [
      { id: 'f_title', key: 'title', name: 'Category Name', type: 'text', required: true },
      { id: 'f_desc', key: 'summary', name: 'Description', type: 'multiline', required: false }
    ]
  },
  portfolio: {
    name: 'Portfolio Projects', slug: 'projects',
    fields: [
      { id: 'f_title', key: 'title', name: 'Project Title', type: 'text', required: true },
      { id: 'f_summary', key: 'summary', name: 'Case Study Summary', type: 'multiline', required: true },
      { id: 'f_body', key: 'body', name: 'Full Case Study', type: 'multiline', required: false },
      { id: 'f_image', key: 'image', name: 'Showcase Image', type: 'image', required: false },
      { id: 'f_category', key: 'category', name: 'Discipline', type: 'select', options: ['UI/UX', 'SaaS', 'Branding', 'Architecture'], required: false },
      { id: 'f_client', key: 'client', name: 'Client Name', type: 'text', required: false },
      { id: 'f_url', key: 'liveUrl', name: 'Live Project URL', type: 'url', required: false },
      { id: 'f_date', key: 'date', name: 'Completion Date', type: 'date', required: false }
    ]
  },
  services: {
    name: 'Services', slug: 'services',
    fields: [
      { id: 'f_title', key: 'title', name: 'Service Name', type: 'text', required: true },
      { id: 'f_summary', key: 'summary', name: 'Service Description', type: 'multiline', required: true },
      { id: 'f_price', key: 'priceLabel', name: 'Starting Price', type: 'text', required: false },
      { id: 'f_duration', key: 'category', name: 'Duration / Tier', type: 'text', required: false },
      { id: 'f_image', key: 'image', name: 'Service Image', type: 'image', required: false }
    ]
  },
  team: {
    name: 'Team Members', slug: 'team',
    fields: [
      { id: 'f_title', key: 'title', name: 'Member Name', type: 'text', required: true },
      { id: 'f_role', key: 'category', name: 'Position', type: 'text', required: true },
      { id: 'f_bio', key: 'summary', name: 'Short Bio', type: 'multiline', required: false },
      { id: 'f_image', key: 'image', name: 'Portrait URL', type: 'image', required: false }
    ]
  },
  faqs: {
    name: 'FAQs', slug: 'faqs',
    fields: [
      { id: 'f_title', key: 'title', name: 'Question', type: 'text', required: true },
      { id: 'f_summary', key: 'summary', name: 'Answer', type: 'multiline', required: true },
      { id: 'f_category', key: 'category', name: 'Topic', type: 'select', options: ['General', 'Billing', 'Technical', 'Shipping'], required: false }
    ]
  },
  testimonials: {
    name: 'Testimonials', slug: 'testimonials',
    fields: [
      { id: 'f_title', key: 'title', name: 'Client Name & Company', type: 'text', required: true },
      { id: 'f_summary', key: 'summary', name: 'Quote', type: 'multiline', required: true },
      { id: 'f_rating', key: 'rating', name: 'Rating (1-5)', type: 'number', required: false }
    ]
  },
  cms_products: {
    name: 'CMS Products Catalog', slug: 'catalog',
    fields: [
      { id: 'f_title', key: 'title', name: 'Product Name', type: 'text', required: true },
      { id: 'f_summary', key: 'summary', name: 'Description', type: 'multiline', required: true },
      { id: 'f_price', key: 'price', name: 'Price ($)', type: 'number', required: true },
      { id: 'f_image', key: 'image', name: 'Product Photo', type: 'image', required: false },
      { id: 'f_category', key: 'category', name: 'Collection Tag', type: 'text', required: false }
    ]
  }
};

const DEFAULT_COLLECTIONS = [
  {
    id: 'col_blog',
    name: 'Blog Posts',
    slug: 'blog',
    fields: STARTER_COLLECTION_PRESETS.blog.fields,
    items: [
      {
        id: 'item_1',
        slug: 'launching-our-next-gen-platform',
        status: 'published',
        createdAt: '2026-10-01T10:00:00Z',
        updatedAt: '2026-10-01T10:00:00Z',
        title: 'Launching Our Next-Gen Platform',
        summary: 'How visual development accelerates modern engineering teams.',
        body: 'Modern software teams need both design freedom and clean semantic code output. In this article we explore how visual DOM trees bridge the gap between rapid prototyping and production deployment.',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop',
        category: 'Product',
        date: '2026-10-01',
        authorRef: 'auth_1'
      },
      {
        id: 'item_2',
        slug: 'designing-for-responsive-web',
        status: 'published',
        createdAt: '2026-10-08T10:00:00Z',
        updatedAt: '2026-10-08T10:00:00Z',
        title: 'Designing for Responsive Web',
        summary: 'Best practices for fluid grids and mobile-first typography.',
        body: 'Cascading breakpoint overrides let designers tailor padding, grid columns, and typography for desktop, tablet, and mobile viewports without duplicating markup.',
        image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop',
        category: 'Design',
        date: '2026-10-08',
        authorRef: 'auth_1'
      },
      {
        id: 'item_3',
        slug: 'scaling-ecommerce-architecture',
        status: 'published',
        createdAt: '2026-10-12T10:00:00Z',
        updatedAt: '2026-10-12T10:00:00Z',
        title: 'Scaling E-Commerce Architecture',
        summary: 'Decoupling frontend presentation from inventory logic.',
        body: 'By separating visual product grids from backend payment and inventory APIs, brands can iterate on storefront experiences rapidly while keeping transactions secure.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
        category: 'Engineering',
        date: '2026-10-12',
        authorRef: 'auth_1'
      }
    ]
  },
  {
    id: 'col_authors',
    name: 'Authors',
    slug: 'authors',
    fields: STARTER_COLLECTION_PRESETS.authors.fields,
    items: [
      {
        id: 'auth_1',
        slug: 'elena-vance',
        status: 'published',
        createdAt: '2026-09-01T10:00:00Z',
        updatedAt: '2026-09-01T10:00:00Z',
        title: 'Elena Vance',
        category: 'Principal Systems Architect',
        summary: 'Lead engineer focused on design systems, compilers, and visual development tools.',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop'
      }
    ]
  },
  {
    id: 'col_portfolio',
    name: 'Portfolio Projects',
    slug: 'projects',
    fields: STARTER_COLLECTION_PRESETS.portfolio.fields,
    items: [
      {
        id: 'proj_1',
        slug: 'fintech-mobile-app-rebrand',
        status: 'published',
        createdAt: '2026-09-15T10:00:00Z',
        updatedAt: '2026-09-15T10:00:00Z',
        title: 'Fintech Mobile App Rebrand',
        summary: 'Complete design system and interactive web presence.',
        body: 'Delivered a unified token architecture and responsive marketing site for a Series B financial platform.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
        category: 'UI/UX',
        client: 'NovaPay',
        liveUrl: 'https://example.com',
        date: '2026-09-15'
      },
      {
        id: 'proj_2',
        slug: 'ai-analytics-dashboard',
        status: 'published',
        createdAt: '2026-09-28T10:00:00Z',
        updatedAt: '2026-09-28T10:00:00Z',
        title: 'AI Analytics Dashboard',
        summary: 'High-density data visualization for enterprise teams.',
        body: 'Architected real-time telemetry views and modular dark-mode components.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
        category: 'SaaS',
        client: 'Vortex Cloud',
        liveUrl: 'https://example.com',
        date: '2026-09-28'
      }
    ]
  }
];

const normalizeCollection = (col) => {
  const safeCol = clone(col || {});
  safeCol.id = safeCol.id || 'col_' + Math.random().toString(36).substr(2, 7);
  safeCol.name = safeCol.name || 'Untitled Collection';
  safeCol.slug = toSlug(safeCol.slug || safeCol.name);
  if (!Array.isArray(safeCol.fields) || safeCol.fields.length === 0) {
    safeCol.fields = clone(STARTER_COLLECTION_PRESETS.blog.fields);
  }
  const seenSlugs = new Set();
  safeCol.items = (Array.isArray(safeCol.items) ? safeCol.items : []).map((item, idx) => {
    const rawSlug = toSlug(item.slug || item.title || `item-${idx + 1}`);
    const uniqueSlug = seenSlugs.has(rawSlug) ? `${rawSlug}-${idx + 1}` : rawSlug;
    seenSlugs.add(uniqueSlug);
    return {
      id: item.id || 'rec_' + Math.random().toString(36).substr(2, 8),
      slug: uniqueSlug,
      status: item.status === 'draft' ? 'draft' : 'published',
      createdAt: item.createdAt || '2026-10-01T10:00:00Z',
      updatedAt: item.updatedAt || '2026-10-01T10:00:00Z',
      ...item
    };
  });
  return safeCol;
};

const createCmsDetailTemplateNodes = (collection) => {
  const colId = collection.id;
  return [
    SECTION_TEMPLATES.navbar(),
    refreshIds({
      id: 'temp', type: ELEMENT_TYPES.SECTION, name: `${collection.name} Detail Header`,
      styles: { base: { ...DEFAULT_STYLES.section, backgroundColor: '#f8fafc', padding: '4rem 2rem' } },
      children: [
        {
          id: 'temp', type: ELEMENT_TYPES.CONTAINER, name: 'Detail Container',
          styles: { base: { ...DEFAULT_STYLES.container, maxWidth: '840px' } },
          children: [
            {
              id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Bound Category / Meta',
              props: { content: 'Category', tag: 'span', cmsBinding: { collectionId: colId, fieldKey: 'category', recordId: 'context' } },
              styles: { base: { fontSize: '0.85rem', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase' } },
              children: []
            },
            {
              id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Bound Record Title',
              props: { content: 'Dynamic Record Title', tag: 'h1', cmsBinding: { collectionId: colId, fieldKey: 'title', recordId: 'context' } },
              styles: { base: { ...DEFAULT_STYLES.heading, fontSize: '2.75rem', color: '#0f172a' }, mobile: { fontSize: '2rem' } },
              children: []
            },
            {
              id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Bound Publish Date',
              props: { content: '2026-10-13', tag: 'span', cmsBinding: { collectionId: colId, fieldKey: 'date', recordId: 'context' } },
              styles: { base: { fontSize: '0.875rem', color: '#64748b' } },
              children: []
            },
            {
              id: 'temp', type: ELEMENT_TYPES.IMAGE, name: 'Bound Cover Image',
              props: {
                src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop',
                alt: 'Record cover image',
                cmsBinding: { collectionId: colId, fieldKey: 'image', recordId: 'context' }
              },
              styles: { base: { ...DEFAULT_STYLES.image, height: '380px', marginTop: '1rem', marginBottom: '1rem', borderRadius: '0.75rem' } },
              children: []
            },
            {
              id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Bound Summary / Lead',
              props: { content: 'Summary excerpt goes here.', tag: 'p', cmsBinding: { collectionId: colId, fieldKey: 'summary', recordId: 'context' } },
              styles: { base: { fontSize: '1.2rem', fontWeight: '500', color: '#1e293b', lineHeight: '1.6' } },
              children: []
            },
            {
              id: 'temp', type: ELEMENT_TYPES.TEXT, name: 'Bound Full Body',
              props: { content: 'Full dynamic record body content renders here.', tag: 'p', cmsBinding: { collectionId: colId, fieldKey: 'body', recordId: 'context' } },
              styles: { base: { ...DEFAULT_STYLES.text, fontSize: '1.05rem', color: '#334155', lineHeight: '1.8', marginTop: '0.5rem' } },
              children: []
            }
          ]
        }
      ]
    }),
    SECTION_TEMPLATES.footer()
  ];
};

const resolveCmsBindingValue = (node, project, activePage, previewRecordId) => {
  const binding = node?.props?.cmsBinding;
  if (!binding || !binding.collectionId || !binding.fieldKey) return null;
  const col = (project.collections || []).find(c => c.id === binding.collectionId);
  if (!col || !Array.isArray(col.items) || col.items.length === 0) return null;

  let record = null;
  if (binding.recordId === 'context' || !binding.recordId) {
    const targetRecId = (activePage?.cmsCollectionId === col.id && previewRecordId) ? previewRecordId : col.items[0]?.id;
    record = col.items.find(i => i.id === targetRecId) || col.items[0];
  } else {
    record = col.items.find(i => i.id === binding.recordId) || col.items[0];
  }
  if (!record) return null;

  const rawVal = record[binding.fieldKey];
  if (rawVal === undefined || rawVal === null || rawVal === '') return null;

  const fieldDef = (col.fields || []).find(f => f.key === binding.fieldKey);
  if (fieldDef?.type === 'reference' && fieldDef.refCollectionId) {
    const refCol = (project.collections || []).find(c => c.id === fieldDef.refCollectionId);
    const refRec = (refCol?.items || []).find(r => r.id === rawVal);
    if (refRec) return refRec.title || refRec.name || String(rawVal);
  }
  if (typeof rawVal === 'boolean') return rawVal ? 'Yes' : 'No';
  return String(rawVal);
};

const queryCollectionRecords = (collection, queryProps = {}, isExportOrPreview = false) => {
  if (!collection || !Array.isArray(collection.items)) return [];
  let list = [...collection.items];

  const statusFilter = queryProps.statusFilter || (isExportOrPreview ? 'published' : 'all');
  if (statusFilter === 'published') {
    list = list.filter(item => item.status !== 'draft');
  } else if (statusFilter === 'draft') {
    list = list.filter(item => item.status === 'draft');
  }

  if (queryProps.filterField && queryProps.filterValue && queryProps.filterValue.trim() !== '') {
    const needle = queryProps.filterValue.trim().toLowerCase();
    list = list.filter(item => String(item[queryProps.filterField] || '').toLowerCase().includes(needle));
  }

  if (queryProps.searchQuery && queryProps.searchQuery.trim() !== '') {
    const q = queryProps.searchQuery.trim().toLowerCase();
    list = list.filter(item =>
      String(item.title || '').toLowerCase().includes(q) ||
      String(item.summary || '').toLowerCase().includes(q) ||
      String(item.category || '').toLowerCase().includes(q)
    );
  }

  const sortBy = queryProps.sortBy || 'date_desc';
  list.sort((a, b) => {
    if (sortBy === 'title_asc') return String(a.title || '').localeCompare(String(b.title || ''));
    if (sortBy === 'title_desc') return String(b.title || '').localeCompare(String(a.title || ''));
    if (sortBy === 'date_asc') return String(a.date || a.createdAt || '').localeCompare(String(b.date || b.createdAt || ''));
    return String(b.date || b.createdAt || '').localeCompare(String(a.date || a.createdAt || ''));
  });

  const limit = parseInt(queryProps.limit, 10);
  if (!isNaN(limit) && limit > 0) {
    list = list.slice(0, limit);
  }
  return list;
};

const DEFAULT_PRODUCTS = [
  {
    id: 'prod_1',
    name: 'Studio Wireless Headphones',
    slug: 'studio-wireless-headphones',
    shortDescription: 'Active noise cancellation with 40-hour battery life.',
    description: 'Engineered for mastering engineers and everyday audiophiles. Features custom 45mm beryllium drivers, spatial head-tracking, and plush memory-foam earcups.',
    price: 249.00,
    compareAtPrice: 299.00,
    currency: 'USD',
    sku: 'AUD-01',
    barcode: '890102938471',
    productType: 'physical',
    status: 'published',
    trackInventory: true,
    stock: 18,
    lowStockThreshold: 5,
    featured: true,
    category: 'Hardware',
    brand: 'Aether Audio',
    tags: ['wireless', 'audio', 'studio'],
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=800&auto=format&fit=crop'
    ],
    seoTitle: 'Studio Wireless Headphones — Aether Audio',
    seoDesc: 'Shop Studio Wireless Headphones with 40-hour battery life and active noise cancellation.',
    variants: [
      { id: 'var_aud_blk', title: 'Matte Black / Standard', sku: 'AUD-01-BLK', price: 249.00, stock: 12 },
      { id: 'var_aud_slv', title: 'Brushed Silver / Studio Case', sku: 'AUD-01-SLV', price: 269.00, stock: 6 }
    ],
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-10-01T10:00:00Z'
  },
  {
    id: 'prod_2',
    name: 'Minimalist Mechanical Keyboard',
    slug: 'minimalist-mechanical-keyboard',
    shortDescription: 'Machined aluminum frame with hot-swappable tactile switches.',
    description: 'CNC-milled 6063 aluminum chassis with gasket mount construction, PBT keycaps, and tri-mode wireless connectivity.',
    price: 169.00,
    compareAtPrice: 195.00,
    currency: 'USD',
    sku: 'KEY-02',
    barcode: '890102938472',
    productType: 'physical',
    status: 'published',
    trackInventory: true,
    stock: 42,
    lowStockThreshold: 8,
    featured: true,
    category: 'Accessories',
    brand: 'Aether Works',
    tags: ['keyboard', 'workspace'],
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop'
    ],
    seoTitle: 'Minimalist Mechanical Keyboard',
    seoDesc: 'Machined aluminum mechanical keyboard for creators and engineers.',
    variants: [
      { id: 'var_key_tac', title: 'Tactile Brown Switches / Space Grey', sku: 'KEY-02-TAC', price: 169.00, stock: 28 },
      { id: 'var_key_lin', title: 'Linear Red Switches / Lunar White', sku: 'KEY-02-LIN', price: 179.00, stock: 14 }
    ],
    createdAt: '2026-10-03T10:00:00Z',
    updatedAt: '2026-10-03T10:00:00Z'
  },
  {
    id: 'prod_3',
    name: 'Ergonomic Desk Lamp',
    slug: 'ergonomic-desk-lamp',
    shortDescription: 'Adjustable color temperature with wireless charging base.',
    description: 'High-CRI LED task lighting with stepless dimming, ambient bias backlight, and integrated 15W Qi magnetic charging pad.',
    price: 89.00,
    compareAtPrice: null,
    currency: 'USD',
    sku: 'LMP-03',
    barcode: '890102938473',
    productType: 'physical',
    status: 'published',
    trackInventory: true,
    stock: 12,
    lowStockThreshold: 4,
    featured: false,
    category: 'Workspace',
    brand: 'Aether Works',
    tags: ['lighting', 'desk'],
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop'
    ],
    seoTitle: 'Ergonomic Desk Lamp',
    seoDesc: 'High-CRI desk lamp with wireless charging base.',
    variants: [],
    createdAt: '2026-10-05T10:00:00Z',
    updatedAt: '2026-10-05T10:00:00Z'
  }
];

const normalizeProduct = (prod, idx = 0) => {
  const safe = clone(prod || {});
  safe.id = safe.id || 'prod_' + Math.random().toString(36).substr(2, 8);
  safe.name = (safe.name || `Product ${idx + 1}`).trim();
  safe.slug = toSlug(safe.slug || safe.name);
  safe.shortDescription = safe.shortDescription || safe.description || 'Quality product ready for immediate order.';
  safe.description = safe.description || safe.shortDescription;
  safe.price = Math.max(0, Number(safe.price) || 0);
  safe.compareAtPrice = safe.compareAtPrice ? Math.max(0, Number(safe.compareAtPrice)) : null;
  safe.currency = safe.currency || 'USD';
  safe.sku = safe.sku || `SKU-${idx + 101}`;
  safe.barcode = safe.barcode || '';
  safe.productType = safe.productType === 'digital' ? 'digital' : 'physical';
  safe.status = safe.status === 'draft' ? 'draft' : 'published';
  safe.trackInventory = safe.trackInventory !== undefined ? Boolean(safe.trackInventory) : true;
  safe.stock = Math.max(0, parseInt(safe.stock ?? 15, 10) || 0);
  safe.lowStockThreshold = Math.max(1, parseInt(safe.lowStockThreshold ?? 5, 10) || 5);
  safe.featured = Boolean(safe.featured);
  safe.category = safe.category || 'General';
  safe.brand = safe.brand || 'Studio Brand';
  safe.tags = Array.isArray(safe.tags) ? safe.tags : [];
  safe.image = safe.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop';
  safe.gallery = Array.isArray(safe.gallery) && safe.gallery.length > 0 ? safe.gallery : [safe.image];
  safe.seoTitle = safe.seoTitle || safe.name;
  safe.seoDesc = safe.seoDesc || safe.shortDescription;
  const seenVarIds = new Set();
  safe.variants = (Array.isArray(safe.variants) ? safe.variants : []).map((v, vIdx) => {
    let vId = v.id || `var_${safe.id}_${vIdx + 1}`;
    if (seenVarIds.has(vId)) vId = `${vId}_${vIdx + 1}`;
    seenVarIds.add(vId);
    return {
      id: vId,
      title: (v.title || `Option ${vIdx + 1}`).trim(),
      sku: v.sku || `${safe.sku}-V${vIdx + 1}`,
      price: v.price !== undefined && v.price !== '' ? Math.max(0, Number(v.price)) : safe.price,
      stock: Math.max(0, parseInt(v.stock ?? safe.stock, 10) || 0)
    };
  });
  safe.createdAt = safe.createdAt || '2026-10-01T10:00:00Z';
  safe.updatedAt = safe.updatedAt || '2026-10-01T10:00:00Z';
  return safe;
};

const queryProducts = (products = [], queryProps = {}, isPublicView = false) => {
  let list = (Array.isArray(products) ? products : []).map(normalizeProduct);
  if (isPublicView || queryProps.statusFilter === 'published') {
    list = list.filter(p => p.status === 'published');
  } else if (queryProps.statusFilter === 'draft') {
    list = list.filter(p => p.status === 'draft');
  }
  if (queryProps.featuredOnly) {
    list = list.filter(p => p.featured);
  }
  if (queryProps.category && queryProps.category !== 'all') {
    list = list.filter(p => p.category.toLowerCase() === queryProps.category.toLowerCase());
  }
  if (queryProps.search && queryProps.search.trim() !== '') {
    const q = queryProps.search.trim().toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    );
  }
  const sortBy = queryProps.sortBy || 'newest';
  list.sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
    return String(b.createdAt).localeCompare(String(a.createdAt));
  });
  const limit = parseInt(queryProps.limit, 10);
  if (!isNaN(limit) && limit > 0) list = list.slice(0, limit);
  return list;
};

const createProductDetailTemplateNodes = () => [
  SECTION_TEMPLATES.navbar(),
  refreshIds({
    id: 'temp',
    type: ELEMENT_TYPES.SECTION,
    name: 'Product Detail Section',
    styles: { base: { ...DEFAULT_STYLES.section, backgroundColor: '#ffffff', padding: '4rem 2rem' } },
    children: [
      {
        id: 'temp',
        type: ELEMENT_TYPES.CONTAINER,
        name: 'Product Detail Container',
        styles: { base: { ...DEFAULT_STYLES.container } },
        children: [
          {
            id: 'temp',
            type: ELEMENT_TYPES.PRODUCT_DETAIL,
            name: 'Dynamic Product View',
            props: { productId: 'context', showRelated: true },
            styles: { base: { width: '100%' } },
            children: []
          }
        ]
      }
    ]
  }),
  SECTION_TEMPLATES.footer()
];

const runPrePublishValidation = (project) => {
  const errors = [];
  const warnings = [];
  const suggestions = [];
  const seenSlugs = new Set();
  const validPageIds = new Set((project.pages || []).map(p => p.id));
  const validColIds = new Set((project.collections || []).map(c => c.id));
  const products = project.products || [];

  const baseUrl = project.siteSettings?.canonicalBaseUrl || '';
  if (!baseUrl || !/^https?:\/\/[a-z0-9.-]+\.[a-z]{2,}/i.test(baseUrl)) {
    warnings.push({
      id: 'val_baseurl',
      severity: 'warning',
      pageId: project.pages?.[0]?.id,
      nodeId: null,
      location: 'Site Settings',
      message: 'Canonical Base URL is not set to a valid https:// domain. Sitemap.xml will use https://example.com fallback.'
    });
  }

  (project.pages || []).forEach(page => {
    const cleanSlug = (page.slug || '').trim();
    if (!cleanSlug) {
      errors.push({
        id: `err_slug_${page.id}`,
        severity: 'error',
        pageId: page.id,
        nodeId: page.rootNode?.id,
        location: `Page: ${page.name}`,
        message: `Page "${page.name}" is missing a valid filename slug.`
      });
    } else if (seenSlugs.has(cleanSlug.toLowerCase())) {
      errors.push({
        id: `err_dupslug_${page.id}`,
        severity: 'error',
        pageId: page.id,
        nodeId: page.rootNode?.id,
        location: `Page: ${page.name}`,
        message: `Duplicate page slug "${cleanSlug}.html" detected. Every page must have a unique slug.`
      });
    } else {
      seenSlugs.add(cleanSlug.toLowerCase());
    }

    if (!page.seoTitle || page.seoTitle.trim().length < 3) {
      warnings.push({
        id: `warn_title_${page.id}`,
        severity: 'warning',
        pageId: page.id,
        nodeId: page.rootNode?.id,
        location: `Page: ${page.name}`,
        message: `Page "${page.name}" is missing a descriptive SEO Title.`
      });
    }
    if (!page.seoDesc || page.seoDesc.trim().length < 10) {
      suggestions.push({
        id: `sug_desc_${page.id}`,
        severity: 'suggestion',
        pageId: page.id,
        nodeId: page.rootNode?.id,
        location: `Page: ${page.name}`,
        message: `Add a meta description (50–160 characters) to "${page.name}" for better search engine snippets.`
      });
    }

    if (page.isCmsTemplate) {
      if (!page.cmsCollectionId || !validColIds.has(page.cmsCollectionId)) {
        errors.push({
          id: `err_cmstpl_${page.id}`,
          severity: 'error',
          pageId: page.id,
          nodeId: page.rootNode?.id,
          location: `Page: ${page.name}`,
          message: `Dynamic CMS Template "${page.name}" references a deleted or invalid CMS collection.`
        });
      } else {
        const col = project.collections.find(c => c.id === page.cmsCollectionId);
        const pubCount = (col?.items || []).filter(i => i.status !== 'draft').length;
        if (pubCount === 0) {
          warnings.push({
            id: `warn_cmsempty_${page.id}`,
            severity: 'warning',
            pageId: page.id,
            nodeId: page.rootNode?.id,
            location: `Page: ${page.name}`,
            message: `CMS Collection "${col?.name}" has 0 published records. No detail HTML pages will be generated for this template.`
          });
        }
      }
    }

    if (page.isProductTemplate) {
      const pubProds = products.filter(p => p.status === 'published').length;
      if (pubProds === 0) {
        warnings.push({
          id: `warn_prodempty_${page.id}`,
          severity: 'warning',
          pageId: page.id,
          nodeId: page.rootNode?.id,
          location: `Page: ${page.name}`,
          message: `Product Detail Template "${page.name}" has 0 published products to generate.`
        });
      }
    }

    let h1Count = 0;
    const walk = (node) => {
      if (!node) return;
      const props = node.props || {};
      if (node.type === ELEMENT_TYPES.TEXT && props.tag === 'h1') h1Count++;

      if (node.type === ELEMENT_TYPES.TEXT && (!props.content || !String(props.content).trim()) && !props.cmsBinding) {
        warnings.push({
          id: `warn_emptytext_${node.id}`,
          severity: 'warning',
          pageId: page.id,
          nodeId: node.id,
          location: `${page.name} → ${node.name}`,
          message: `Text element "${node.name}" has empty content.`
        });
      }

      if (node.type === ELEMENT_TYPES.IMAGE) {
        if (!props.src && !props.cmsBinding) {
          errors.push({
            id: `err_imgsrc_${node.id}`,
            severity: 'error',
            pageId: page.id,
            nodeId: node.id,
            location: `${page.name} → ${node.name}`,
            message: `Image "${node.name}" is missing an image source URL.`
          });
        }
        if (!props.alt || !String(props.alt).trim()) {
          warnings.push({
            id: `warn_imgalt_${node.id}`,
            severity: 'warning',
            pageId: page.id,
            nodeId: node.id,
            location: `${page.name} → ${node.name}`,
            message: `Accessibility check: Image "${node.name}" is missing alternative (alt) text.`
          });
        }
        if (props.src && props.src.startsWith('data:') && props.src.length > 500000) {
          warnings.push({
            id: `warn_imgsize_${node.id}`,
            severity: 'warning',
            pageId: page.id,
            nodeId: node.id,
            location: `${page.name} → ${node.name}`,
            message: `Performance check: Image "${node.name}" uses a large inline Data URI (>500KB).`
          });
        }
      }

      if (node.type === ELEMENT_TYPES.BUTTON) {
        const href = props.href || '';
        if (href.startsWith('page:')) {
          const targetId = href.split(':')[1];
          if (!validPageIds.has(targetId)) {
            errors.push({
              id: `err_link_${node.id}`,
              severity: 'error',
              pageId: page.id,
              nodeId: node.id,
              location: `${page.name} → ${node.name}`,
              message: `Broken internal page link on button "${node.name}": target page no longer exists.`
            });
          }
        } else if (!href || href === '#') {
          suggestions.push({
            id: `sug_link_${node.id}`,
            severity: 'suggestion',
            pageId: page.id,
            nodeId: node.id,
            location: `${page.name} → ${node.name}`,
            message: `Button "${node.name}" points to placeholder "#" link.`
          });
        }
      }

      if (props.cmsBinding?.collectionId) {
        const col = (project.collections || []).find(c => c.id === props.cmsBinding.collectionId);
        if (!col) {
          errors.push({
            id: `err_bindcol_${node.id}`,
            severity: 'error',
            pageId: page.id,
            nodeId: node.id,
            location: `${page.name} → ${node.name}`,
            message: `Element "${node.name}" is bound to a missing CMS collection.`
          });
        } else if (props.cmsBinding.recordId && props.cmsBinding.recordId !== 'context') {
          const rec = (col.items || []).find(r => r.id === props.cmsBinding.recordId);
          if (!rec) {
            warnings.push({
              id: `warn_bindrec_${node.id}`,
              severity: 'warning',
              pageId: page.id,
              nodeId: node.id,
              location: `${page.name} → ${node.name}`,
              message: `Element "${node.name}" references a deleted CMS record.`
            });
          } else if (rec.status === 'draft') {
            warnings.push({
              id: `warn_binddraft_${node.id}`,
              severity: 'warning',
              pageId: page.id,
              nodeId: node.id,
              location: `${page.name} → ${node.name}`,
              message: `Element "${node.name}" is explicitly bound to draft record "${rec.title}".`
            });
          }
        }
      }

      if (node.type === ELEMENT_TYPES.PRODUCT_DETAIL && props.productId && props.productId !== 'context') {
        const prod = products.find(p => p.id === props.productId);
        if (!prod) {
          errors.push({
            id: `err_prodref_${node.id}`,
            severity: 'error',
            pageId: page.id,
            nodeId: node.id,
            location: `${page.name} → ${node.name}`,
            message: `Product Detail component "${node.name}" references a deleted product.`
          });
        } else if (prod.status === 'draft') {
          warnings.push({
            id: `warn_proddraft_${node.id}`,
            severity: 'warning',
            pageId: page.id,
            nodeId: node.id,
            location: `${page.name} → ${node.name}`,
            message: `Product Detail component "${node.name}" references unpublished draft product "${prod.name}".`
          });
        }
      }

      if (Array.isArray(node.children)) node.children.forEach(walk);
    };

    walk(page.rootNode);
    if (h1Count === 0) {
      warnings.push({
        id: `warn_h1_${page.id}`,
        severity: 'warning',
        pageId: page.id,
        nodeId: page.rootNode?.id,
        location: `Page: ${page.name}`,
        message: `SEO & Accessibility check: Page "${page.name}" does not contain an H1 heading.`
      });
    } else if (h1Count > 1) {
      suggestions.push({
        id: `sug_multih1_${page.id}`,
        severity: 'suggestion',
        pageId: page.id,
        nodeId: page.rootNode?.id,
        location: `Page: ${page.name}`,
        message: `Page "${page.name}" has ${h1Count} H1 headings. Consider using a single primary H1.`
      });
    }
  });

  return {
    valid: errors.length === 0,
    canBuild: errors.length === 0,
    timestamp: new Date().toISOString(),
    errors,
    warnings,
    suggestions
  };
};

const makePage = (id, name, slug, seoTitle, seoDesc, children) => ({
  id, name, slug, seoTitle, seoDesc,
  rootNode: {
    id: generateId(), type: ELEMENT_TYPES.PAGE, name: 'Body',
    styles: { base: { minHeight: '100vh', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column' } },
    props: {}, children
  }
});

const WEBSITE_TEMPLATES = {
  blank: {
    label: 'Blank Canvas',
    category: 'Custom',
    desc: 'Start with a clean slate and build from scratch.',
    buildPages: () => [
      makePage('page_home', 'Home', 'index', 'Home', 'Welcome to our website.', [])
    ]
  },
  barber_salon: {
    label: '1. Premium Barber & Salon',
    category: 'Booking',
    desc: 'Grooming lounge & styling studio with service menu, gallery, and appointment booking.',
    buildPages: () => [
      makePage('page_home', 'Home', 'index', 'Crown & Blade Grooming Studio', 'Bespoke haircuts, classic shaves, and modern styling.', [
        SECTION_TEMPLATES.navbar('CROWN & BLADE', [{ label: 'Home', href: 'page:page_home' }, { label: 'Services & Booking', href: 'page:page_services', isCta: true }]),
        SECTION_TEMPLATES.hero('Precision Craft & Modern Grooming', 'Experience traditional barbering elevated for the modern individual in a relaxed studio atmosphere.', 'View Service Menu'),
        SECTION_TEMPLATES.services('Signature Grooming Menu', [
          { title: 'Executive Cut & Style', price: '$65', desc: 'Consultation, precision scissor & clipper work, hot towel finish, and styling.' },
          { title: 'Traditional Hot Towel Shave', price: '$55', desc: 'Three-stage lather, straight-razor shave, soothing balm, and facial massage.' },
          { title: 'Complete Restyle & Beard Sculpt', price: '$95', desc: 'Full haircut transformation paired with razor-lined beard conditioning.' }
        ]),
        SECTION_TEMPLATES.gallery('Inside the Studio'),
        SECTION_TEMPLATES.bookingCta('Ready for Your Next Visit?', 'Reserve your chair online in seconds or contact our front desk for group bookings.', 'Book Chair Now'),
        SECTION_TEMPLATES.footer('CROWN & BLADE STUDIO')
      ]),
      makePage('page_services', 'Services & Booking', 'services', 'Services & Appointments', 'Book your next grooming session.', [
        SECTION_TEMPLATES.navbar('CROWN & BLADE', [{ label: 'Home', href: 'page:page_home' }, { label: 'Services & Booking', href: 'page:page_services', isCta: true }]),
        SECTION_TEMPLATES.services('Full Treatment Menu'),
        SECTION_TEMPLATES.contactForm('Request an Appointment Slot'),
        SECTION_TEMPLATES.footer('CROWN & BLADE STUDIO')
      ])
    ]
  },
  portfolio: {
    label: '2. Creative Portfolio',
    category: 'Portfolio',
    desc: 'Visual showcase for designers, architects, photographers, and independent creators.',
    buildPages: () => [
      makePage('page_home', 'Work', 'index', 'Alex Rivera — Multidisciplinary Designer', 'Selected works in digital product design, art direction, and brand systems.', [
        SECTION_TEMPLATES.navbar('ALEX RIVERA', [{ label: 'Work', href: 'page:page_home' }, { label: 'About & Contact', href: 'page:page_about', isCta: true }]),
        SECTION_TEMPLATES.hero('Designing Digital Products with Clarity & Purpose', 'Independent product designer partnering with ambitious startups and cultural institutions.', 'Explore Selected Works'),
        SECTION_TEMPLATES.gallery('Selected Case Studies (2024–2026)'),
        SECTION_TEMPLATES.testimonials('Collaborator Notes'),
        SECTION_TEMPLATES.footer('ALEX RIVERA STUDIO')
      ]),
      makePage('page_about', 'About & Contact', 'about', 'About & Inquiry — Alex Rivera', 'Background, capabilities, and project inquiries.', [
        SECTION_TEMPLATES.navbar('ALEX RIVERA', [{ label: 'Work', href: 'page:page_home' }, { label: 'About & Contact', href: 'page:page_about', isCta: true }]),
        SECTION_TEMPLATES.features('Capabilities & Focus', [
          { title: 'Design Systems', desc: 'Tokenized component libraries that bridge Figma and production React.' },
          { title: 'Brand Direction', desc: 'Visual identity, typography systems, and interactive web presence.' },
          { title: 'Product Strategy', desc: 'User research, rapid prototyping, and high-conversion flows.' }
        ]),
        SECTION_TEMPLATES.contactForm('Start a Conversation'),
        SECTION_TEMPLATES.footer('ALEX RIVERA STUDIO')
      ])
    ]
  },
  corporate: {
    label: '3. Multi-Page Corporate Business',
    category: 'Business',
    desc: 'Three-page enterprise website with Home, About/Services, and Contact pages.',
    buildPages: () => [
      makePage('page_home', 'Home', 'index', 'Vanguard Advisory Group — Home', 'Strategic consulting and operational excellence for global enterprises.', [
        SECTION_TEMPLATES.navbar('VANGUARD', [{ label: 'Home', href: 'page:page_home' }, { label: 'Solutions', href: 'page:page_solutions' }, { label: 'Contact', href: 'page:page_contact', isCta: true }]),
        SECTION_TEMPLATES.hero('Navigating Complexity with Strategic Precision', 'We help mid-market and enterprise organizations modernize operations, manage risk, and unlock sustainable growth.', 'Schedule Briefing'),
        SECTION_TEMPLATES.features('Core Practice Areas', [
          { title: 'Operational Transformation', desc: 'End-to-end process optimization and supply-chain resilience.' },
          { title: 'Digital Modernization', desc: 'Cloud architecture, enterprise data governance, and automation.' },
          { title: 'Financial Advisory', desc: 'Capital allocation, merger integration, and performance analytics.' }
        ]),
        SECTION_TEMPLATES.testimonials('Executive Perspectives'),
        SECTION_TEMPLATES.footer('VANGUARD ADVISORY GROUP')
      ]),
      makePage('page_solutions', 'Solutions', 'solutions', 'Enterprise Solutions — Vanguard', 'Detailed overview of our consulting services and methodology.', [
        SECTION_TEMPLATES.navbar('VANGUARD', [{ label: 'Home', href: 'page:page_home' }, { label: 'Solutions', href: 'page:page_solutions' }, { label: 'Contact', href: 'page:page_contact', isCta: true }]),
        SECTION_TEMPLATES.services('Engagement Models'),
        SECTION_TEMPLATES.faq('Engagement FAQs'),
        SECTION_TEMPLATES.footer('VANGUARD ADVISORY GROUP')
      ]),
      makePage('page_contact', 'Contact', 'contact', 'Contact Vanguard Advisory', 'Connect with our regional offices.', [
        SECTION_TEMPLATES.navbar('VANGUARD', [{ label: 'Home', href: 'page:page_home' }, { label: 'Solutions', href: 'page:page_solutions' }, { label: 'Contact', href: 'page:page_contact', isCta: true }]),
        SECTION_TEMPLATES.contactForm('Connect With an Advisor'),
        SECTION_TEMPLATES.footer('VANGUARD ADVISORY GROUP')
      ])
    ]
  },
  store: {
    label: '4. Modern Online Store',
    category: 'E-Commerce',
    desc: 'Online retail storefront with live product catalog, demonstration cart, and FAQ.',
    buildPages: () => [
      makePage('page_home', 'Storefront', 'index', 'Aether Goods — Online Store', 'Shop our curated collection of precision workspace hardware.', [
        SECTION_TEMPLATES.navbar('AETHER STORE', [{ label: 'Shop', href: 'page:page_home' }, { label: 'Support & FAQ', href: 'page:page_faq', isCta: true }]),
        SECTION_TEMPLATES.hero('Curated Workspace Essentials', 'Precision-engineered tools designed for modern creators, engineers, and remote teams.', 'Browse Collection'),
        SECTION_TEMPLATES.ecommerceGrid('New Arrivals & Best Sellers'),
        SECTION_TEMPLATES.features('Why Shop With Us', [
          { title: 'Express Worldwide Shipping', desc: 'Tracked courier delivery with protective eco-friendly packaging.' },
          { title: '2-Year Hardware Warranty', desc: 'Comprehensive coverage and hassle-free replacements.' },
          { title: '30-Day Studio Trial', desc: 'Test our gear in your own workspace with easy returns.' }
        ]),
        SECTION_TEMPLATES.newsletter('Get Early Access to Limited Drops'),
        SECTION_TEMPLATES.footer('AETHER GOODS INC.')
      ]),
      makePage('page_faq', 'Support & FAQ', 'support', 'Customer Support & Shipping FAQ', 'Answers to common order and warranty questions.', [
        SECTION_TEMPLATES.navbar('AETHER STORE', [{ label: 'Shop', href: 'page:page_home' }, { label: 'Support & FAQ', href: 'page:page_faq', isCta: true }]),
        SECTION_TEMPLATES.faq('Shipping, Returns & Warranty FAQ'),
        SECTION_TEMPLATES.contactForm('Customer Support Inquiry'),
        SECTION_TEMPLATES.footer('AETHER GOODS INC.')
      ])
    ]
  },
  saas: {
    label: '5. SaaS Product & Startup',
    category: 'SaaS',
    desc: 'Complete software landing page with hero, features, pricing tiers, and lead capture.',
    buildPages: () => [
      makePage('page_home', 'Home', 'index', 'PulseFlow Cloud — Workflow Automation', 'Modern software platform for high-performing engineering and product teams.', [
        SECTION_TEMPLATES.navbar('PULSEFLOW', [{ label: 'Product', href: 'page:page_home' }, { label: 'Contact Sales', href: 'page:page_contact', isCta: true }]),
        SECTION_TEMPLATES.hero('Next-Gen Workflow Automation', 'Ship faster, collaborate seamlessly, and scale your cloud infrastructure with zero configuration friction.', 'Start Free Trial'),
        SECTION_TEMPLATES.features('Built for Modern Velocity'),
        SECTION_TEMPLATES.pricing(),
        SECTION_TEMPLATES.faq('Platform & Security FAQs'),
        SECTION_TEMPLATES.footer('PULSEFLOW CLOUD')
      ]),
      makePage('page_contact', 'Contact', 'contact', 'Contact Us — PulseFlow', 'Get in touch with our solutions engineering team.', [
        SECTION_TEMPLATES.navbar('PULSEFLOW', [{ label: 'Product', href: 'page:page_home' }, { label: 'Contact Sales', href: 'page:page_contact', isCta: true }]),
        SECTION_TEMPLATES.contactForm('Talk to Solutions Engineering'),
        SECTION_TEMPLATES.footer('PULSEFLOW CLOUD')
      ])
    ]
  },
  restaurant: {
    label: '6. Restaurant & Hospitality',
    category: 'Restaurant',
    desc: 'Culinary destination featuring seasonal tasting menus, chef philosophy, and table reservations.',
    buildPages: () => [
      makePage('page_home', 'Dining', 'index', 'Osteria Verde — Seasonal Kitchen & Wine Bar', 'Wood-fired coastal cuisine and natural wines in an intimate setting.', [
        SECTION_TEMPLATES.navbar('OSTERIA VERDE', [{ label: 'Menu & Story', href: 'page:page_home' }, { label: 'Reserve Table', href: 'page:page_reserve', isCta: true }]),
        SECTION_TEMPLATES.hero('Seasonal Wood-Fired Kitchen & Wine Bar', 'Locally harvested ingredients, handmade pasta, and thoughtfully curated cellar selections served nightly.', 'View Evening Menu'),
        SECTION_TEMPLATES.services('Seasonal Tasting Highlights', [
          { title: 'Antipasti & Crudo', price: '$18 – $26', desc: 'Charred octopus, heirloom burrata, citrus-cured sea bream, and sourdough focaccia.' },
          { title: 'Handmade Primi', price: '$28 – $34', desc: 'Saffron tagliolini, wild mushroom agnolotti, and slow-braised short rib pappardelle.' },
          { title: 'Hearth Secondi', price: '$38 – $54', desc: ' Dry-aged ribeye, herb-roasted branzino, and wood-fired cauliflower steak.' }
        ]),
        SECTION_TEMPLATES.gallery('From Our Kitchen & Dining Room'),
        SECTION_TEMPLATES.bookingCta('Join Us This Evening', 'We accept online reservations up to 30 days in advance and hold a portion of our bar for walk-in guests.', 'Reserve a Table'),
        SECTION_TEMPLATES.footer('OSTERIA VERDE')
      ]),
      makePage('page_reserve', 'Reservations', 'reservations', 'Table Reservations & Private Dining', 'Book a table or inquire about private events.', [
        SECTION_TEMPLATES.navbar('OSTERIA VERDE', [{ label: 'Menu & Story', href: 'page:page_home' }, { label: 'Reserve Table', href: 'page:page_reserve', isCta: true }]),
        SECTION_TEMPLATES.contactForm('Request a Reservation or Private Dining Event'),
        SECTION_TEMPLATES.footer('OSTERIA VERDE')
      ])
    ]
  },
  agency: {
    label: '7. Creative Agency',
    category: 'Agency',
    desc: 'Digital studio template with case studies, service retainers, and client inquiry flow.',
    buildPages: () => [
      makePage('page_home', 'Studio', 'index', 'Kinetix Digital Agency', 'Brand strategy, web engineering, and interactive campaigns.', [
        SECTION_TEMPLATES.navbar('KINETIX STUDIO', [{ label: 'Studio', href: 'page:page_home' }, { label: 'Start a Project', href: 'page:page_contact', isCta: true }]),
        SECTION_TEMPLATES.hero('We Build Category-Defining Digital Brands', 'A multidisciplinary team of strategists, designers, and engineers crafting high-impact web experiences.', 'View Our Work'),
        SECTION_TEMPLATES.gallery('Featured Client Launches'),
        SECTION_TEMPLATES.features('Our Studio Disciplines'),
        SECTION_TEMPLATES.pricing(),
        SECTION_TEMPLATES.footer('KINETIX DIGITAL AGENCY')
      ]),
      makePage('page_contact', 'Brief Us', 'contact', 'New Business Inquiry — Kinetix', 'Tell us about your upcoming launch or redesign.', [
        SECTION_TEMPLATES.navbar('KINETIX STUDIO', [{ label: 'Studio', href: 'page:page_home' }, { label: 'Start a Project', href: 'page:page_contact', isCta: true }]),
        SECTION_TEMPLATES.contactForm('Submit a Project Brief'),
        SECTION_TEMPLATES.footer('KINETIX DIGITAL AGENCY')
      ])
    ]
  },
  blog: {
    label: '8. Blog & Digital Magazine',
    category: 'Blog',
    desc: 'Content-driven publication powered by dynamic CMS collections and newsletter signup.',
    buildPages: () => [
      makePage('page_home', 'Publication', 'index', 'The Architecture Journal', 'Insights on software engineering, design systems, and digital culture.', [
        SECTION_TEMPLATES.navbar('ARCH JOURNAL', [{ label: 'Articles', href: 'page:page_home' }, { label: 'Subscribe', href: '#newsletter', isCta: true }]),
        SECTION_TEMPLATES.hero('The Architecture & Systems Journal', 'Deep dives into software engineering, visual design systems, and modern digital products.', 'Read Latest Issue'),
        SECTION_TEMPLATES.cmsBlock('Featured Editorial Dispatches'),
        SECTION_TEMPLATES.newsletter('Get the Weekly Digest'),
        SECTION_TEMPLATES.footer('THE ARCHITECTURE JOURNAL')
      ])
    ]
  },
  education: {
    label: '9. Online Course & Academy',
    category: 'Education',
    desc: 'Cohort course and learning platform with syllabus modules, tuition tiers, and student FAQ.',
    buildPages: () => [
      makePage('page_home', 'Academy', 'index', 'Foundry Design & Code Academy', 'Master full-stack product engineering and visual systems.', [
        SECTION_TEMPLATES.navbar('FOUNDRY ACADEMY', [{ label: 'Curriculum', href: 'page:page_home' }, { label: 'Admissions', href: 'page:page_admissions', isCta: true }]),
        SECTION_TEMPLATES.hero('Master Modern UI Engineering in 8 Weeks', 'An intensive, project-based online curriculum with live mentor feedback, code reviews, and career support.', 'Explore Syllabus'),
        SECTION_TEMPLATES.features('Course Curriculum Modules', [
          { title: 'Module 1: Design Systems & Tokens', desc: 'Typography scales, accessible color contrast, and responsive grid architecture.' },
          { title: 'Module 2: Interactive React State', desc: 'Complex state trees, undo/redo history, and high-performance rendering.' },
          { title: 'Module 3: Production Architecture', desc: 'Static compilation, SEO optimization, and automated deployment pipelines.' }
        ]),
        SECTION_TEMPLATES.pricing(),
        SECTION_TEMPLATES.faq('Admissions & Tuition FAQ'),
        SECTION_TEMPLATES.footer('FOUNDRY ACADEMY')
      ]),
      makePage('page_admissions', 'Admissions', 'admissions', 'Apply to Next Cohort — Foundry Academy', 'Submit your student inquiry or scholarship question.', [
        SECTION_TEMPLATES.navbar('FOUNDRY ACADEMY', [{ label: 'Curriculum', href: 'page:page_home' }, { label: 'Admissions', href: 'page:page_admissions', isCta: true }]),
        SECTION_TEMPLATES.bookingCta('Next Cohort Begins Next Month', 'Seats are limited to 30 students to ensure personalized mentorship.', 'Apply Now'),
        SECTION_TEMPLATES.contactForm('Questions for Admissions'),
        SECTION_TEMPLATES.footer('FOUNDRY ACADEMY')
      ])
    ]
  },
  booking: {
    label: '10. Booking & Appointment Clinic',
    category: 'Booking',
    desc: 'Consultation & clinic scheduling website with specialist services, FAQ, and intake form.',
    buildPages: () => [
      makePage('page_home', 'Clinic', 'index', 'Solace Wellness & Physiotherapy', 'Evidence-based recovery, movement therapy, and personalized consultations.', [
        SECTION_TEMPLATES.navbar('SOLACE CLINIC', [{ label: 'Overview', href: 'page:page_home' }, { label: 'Book Session', href: 'page:page_book', isCta: true }]),
        SECTION_TEMPLATES.hero('Personalized Movement & Recovery Care', 'One-on-one consultations with licensed specialists dedicated to restoring strength and mobility.', 'Schedule Evaluation'),
        SECTION_TEMPLATES.services('Consultation & Therapy Sessions', [
          { title: 'Initial Comprehensive Assessment', price: '$120 (60 min)', desc: 'Full biomechanical screening, movement diagnosis, and tailored recovery roadmap.' },
          { title: 'Follow-Up Rehabilitation Session', price: '$90 (45 min)', desc: 'Hands-on manual therapy, guided corrective exercise, and progress tracking.' },
          { title: 'Athletic Performance Screening', price: '$150 (75 min)', desc: 'Preventative mobility analysis and strength conditioning for active athletes.' }
        ]),
        SECTION_TEMPLATES.faq('First Visit & Insurance FAQ'),
        SECTION_TEMPLATES.bookingCta('Book Your Consultation Online', 'Flexible morning and evening appointments available Monday through Saturday.', 'Request Time Slot'),
        SECTION_TEMPLATES.footer('SOLACE WELLNESS CLINIC')
      ]),
      makePage('page_book', 'Book Session', 'book', 'Schedule an Appointment — Solace Clinic', 'Request your preferred appointment date and specialist.', [
        SECTION_TEMPLATES.navbar('SOLACE CLINIC', [{ label: 'Overview', href: 'page:page_home' }, { label: 'Book Session', href: 'page:page_book', isCta: true }]),
        SECTION_TEMPLATES.contactForm('Appointment Request Form'),
        SECTION_TEMPLATES.footer('SOLACE WELLNESS CLINIC')
      ])
    ]
  }
};

const AI_CATEGORIES = [
  { id: 'Business', label: 'Business' },
  { id: 'Portfolio', label: 'Portfolio' },
  { id: 'E-commerce', label: 'E-commerce' },
  { id: 'Blog or magazine', label: 'Blog or magazine' },
  { id: 'SaaS', label: 'SaaS' },
  { id: 'Agency', label: 'Agency' },
  { id: 'Restaurant', label: 'Restaurant' },
  { id: 'Booking', label: 'Booking' },
  { id: 'Education', label: 'Education' },
  { id: 'Community', label: 'Community' },
  { id: 'Landing page', label: 'Landing page' },
  { id: 'Other', label: 'Other' }
];

const AI_STYLE_THEMES = {
  modern_light: { id: 'modern_light', name: 'Clean Modern Light', bg: '#ffffff', surface: '#f8fafc', text: '#0f172a', muted: '#475569', accent: '#2563eb', border: '#e2e8f0', fontHeading: 'Inter, system-ui, sans-serif' },
  midnight_slate: { id: 'midnight_slate', name: 'Midnight Dark Slate', bg: '#0f172a', surface: '#1e293b', text: '#f8fafc', muted: '#94a3b8', accent: '#3b82f6', border: '#334155', fontHeading: 'Inter, system-ui, sans-serif' },
  warm_editorial: { id: 'warm_editorial', name: 'Warm Editorial Serif', bg: '#fffbeb', surface: '#fef3c7', text: '#451a03', muted: '#78350f', accent: '#d97706', border: '#fde68a', fontHeading: 'Georgia, serif' },
  emerald_craft: { id: 'emerald_craft', name: 'Emerald Studio', bg: '#ffffff', surface: '#ecfdf5', text: '#064e3b', muted: '#047857', accent: '#059669', border: '#a7f3d0', fontHeading: 'system-ui, sans-serif' }
};

const EXAMPLE_AI_BRIEFS = [
  {
    name: 'Lumina Skin & Barber Lounge',
    category: 'Booking',
    description: 'A modern grooming and skincare studio offering bespoke haircuts, facials, and online appointment scheduling.',
    audience: 'Urban professionals seeking relaxing, high-craft grooming services',
    style: 'warm_editorial',
    primaryColor: '#d97706',
    pages: ['Home', 'Services', 'Booking', 'Contact'],
    features: ['services', 'gallery', 'bookingCta', 'faq', 'contactForm']
  },
  {
    name: 'Vertex Cloud Analytics',
    category: 'SaaS',
    description: 'Real-time financial forecasting and automated cashflow telemetry for modern multi-currency startups.',
    audience: 'Founders, CFOs, and finance teams at high-growth tech companies',
    style: 'modern_light',
    primaryColor: '#2563eb',
    pages: ['Home', 'Pricing', 'About', 'Contact'],
    features: ['features', 'pricing', 'testimonials', 'faq', 'newsletter']
  },
  {
    name: 'Kova Minimalist Goods',
    category: 'E-commerce',
    description: 'Direct-to-consumer store selling sustainably crafted everyday backpacks, laptop sleeves, and travel organizers.',
    audience: 'Remote workers, digital nomads, and minimalist design enthusiasts',
    style: 'emerald_craft',
    primaryColor: '#059669',
    pages: ['Home', 'Shop', 'FAQ', 'Contact'],
    features: ['ecommerceGrid', 'features', 'testimonials', 'faq', 'newsletter']
  }
];

// AI Provider Boundary: Explicitly identifies local deterministic engine vs remote LLM API
const AI_PROVIDER_STATUS = {
  isConnected: false,
  providerName: 'Deterministic Rule-Based Template & Content Engine (Local)',
  notice: 'No external LLM API key is exposed in browser code. Generation runs deterministically in-browser using structured domain heuristics and editable section builders.'
};

const generateStructuredWebsitePlan = (brief) => {
  const siteName = (brief.name || 'Untitled Website').trim();
  const category = brief.category || 'Business';
  const desc = (brief.description || `Welcome to ${siteName}, delivering dedicated value for ${brief.audience || 'our clients'}.`).trim();
  const audience = (brief.audience || 'modern customers and clients').trim();
  const baseTheme = AI_STYLE_THEMES[brief.style] || AI_STYLE_THEMES.modern_light;
  const accentColor = brief.primaryColor || baseTheme.accent;

  const palette = { ...baseTheme, accent: accentColor };
  const requestedPages = Array.isArray(brief.pages) && brief.pages.length > 0 ? brief.pages : ['Home', 'About', 'Contact'];
  const requestedFeatures = Array.isArray(brief.features) ? brief.features : ['features', 'contactForm'];

  const sitemap = requestedPages.map((rawPageName, idx) => {
    const cleanName = rawPageName.trim() || `Page ${idx + 1}`;
    const isHome = idx === 0 || cleanName.toLowerCase() === 'home';
    const slug = isHome ? 'index' : cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `page-${idx + 1}`;
    const pageId = `page_${slug}_${idx}`;

    const sections = ['navbar'];
    const lower = cleanName.toLowerCase();

    if (isHome) {
      sections.push('hero');
      if (category === 'E-commerce' || requestedFeatures.includes('ecommerceGrid')) sections.push('ecommerceGrid');
      if (category === 'Blog or magazine' || requestedFeatures.includes('cmsBlock')) sections.push('cmsBlock');
      if (['Booking', 'Restaurant'].includes(category) || requestedFeatures.includes('services')) sections.push('services');
      if (['Portfolio', 'Agency'].includes(category) || requestedFeatures.includes('gallery')) sections.push('gallery');
      if (requestedFeatures.includes('features') || sections.length <= 2) sections.push('features');
      if (requestedFeatures.includes('testimonials')) sections.push('testimonials');
      if (requestedFeatures.includes('pricing') && ['SaaS', 'Education', 'Agency'].includes(category)) sections.push('pricing');
      if (requestedFeatures.includes('bookingCta') || category === 'Booking') sections.push('bookingCta');
      if (requestedFeatures.includes('newsletter')) sections.push('newsletter');
    } else if (lower.includes('shop') || lower.includes('store') || lower.includes('product')) {
      sections.push('ecommerceGrid', 'faq');
    } else if (lower.includes('service') || lower.includes('menu')) {
      sections.push('services', 'bookingCta', 'faq');
    } else if (lower.includes('price') || lower.includes('pricing') || lower.includes('plan')) {
      sections.push('pricing', 'faq');
    } else if (lower.includes('work') || lower.includes('portfolio') || lower.includes('gallery')) {
      sections.push('gallery', 'testimonials');
    } else if (lower.includes('blog') || lower.includes('news') || lower.includes('article')) {
      sections.push('cmsBlock', 'newsletter');
    } else if (lower.includes('book') || lower.includes('reserve') || lower.includes('appointment')) {
      sections.push('bookingCta', 'contactForm', 'faq');
    } else if (lower.includes('contact')) {
      sections.push('contactForm', 'faq');
    } else {
      sections.push('hero', 'features', 'testimonials');
    }

    sections.push('footer');
    // Deduplicate consecutive identical sections
    const uniqueSections = sections.filter((s, i) => sections.indexOf(s) === i);

    return {
      id: pageId,
      name: cleanName,
      slug,
      seoTitle: `${siteName} — ${cleanName}`,
      seoDesc: `${desc.slice(0, 140)}`,
      sections: uniqueSections
    };
  });

  return {
    planId: 'plan_' + generateId(),
    createdAt: new Date().toISOString(),
    siteSettings: {
      name: siteName,
      category,
      description: desc,
      audience,
      language: brief.language || 'English',
      layoutPriority: brief.layoutPriority || 'desktop-first'
    },
    designTokens: palette,
    sitemap,
    requiredIntegrations: [
      ...(requestedFeatures.includes('ecommerceGrid') || category === 'E-commerce' ? ['Local Demo Cart (Production requires Stripe/Shopify backend)'] : []),
      ...(requestedFeatures.includes('bookingCta') || category === 'Booking' ? ['Appointment Request Form (Production requires Calendar API)'] : []),
      ...(requestedFeatures.includes('cmsBlock') || category === 'Blog or magazine' ? ['Dynamic CMS Collections'] : [])
    ]
  };
};

const validateWebsitePlan = (plan) => {
  const errors = [];
  if (!plan || typeof plan !== 'object') return { valid: false, errors: ['Plan object is missing or malformed.'] };
  if (!plan.siteSettings?.name) errors.push('Website name is required.');
  if (!Array.isArray(plan.sitemap) || plan.sitemap.length === 0) errors.push('Sitemap must contain at least one page.');

  const validSectionKeys = Object.keys(SECTION_TEMPLATES);
  const seenSlugs = new Set();

  (plan.sitemap || []).forEach((page, idx) => {
    if (!page.name || !page.slug) errors.push(`Page ${idx + 1} is missing a name or URL slug.`);
    if (seenSlugs.has(page.slug)) errors.push(`Duplicate page slug "${page.slug}" detected.`);
    seenSlugs.add(page.slug);
    if (!Array.isArray(page.sections) || page.sections.length === 0) {
      errors.push(`Page "${page.name}" has no sections.`);
    } else {
      page.sections.forEach(secKey => {
        if (!validSectionKeys.includes(secKey)) errors.push(`Unsupported section type "${secKey}" on page "${page.name}".`);
      });
    }
  });

  return { valid: errors.length === 0, errors };
};

const compilePlanToProject = (plan) => {
  const validation = validateWebsitePlan(plan);
  if (!validation.valid) {
    throw new Error('Cannot compile invalid website plan: ' + validation.errors.join(' '));
  }

  const { siteSettings, designTokens, sitemap } = plan;
  const navLinks = sitemap.map((p, idx) => ({
    label: p.name,
    href: `page:${p.id}`,
    isCta: idx === sitemap.length - 1 && sitemap.length > 1
  }));

  const pages = sitemap.map((pagePlan, pageIdx) => {
    const children = pagePlan.sections.map(secKey => {
      switch (secKey) {
        case 'navbar':
          return SECTION_TEMPLATES.navbar(siteSettings.name.toUpperCase(), navLinks, designTokens);
        case 'hero':
          return SECTION_TEMPLATES.hero(
            pageIdx === 0 ? `${siteSettings.name}: Built for ${siteSettings.audience}` : `${pagePlan.name} — ${siteSettings.name}`,
            siteSettings.description,
            pageIdx === 0 ? 'Get Started' : 'Learn More',
            designTokens
          );
        case 'features':
          return SECTION_TEMPLATES.features(`Why ${siteSettings.name} Stands Out`, [
            { title: `Tailored for ${siteSettings.audience}`, desc: siteSettings.description },
            { title: 'Quality & Reliability', desc: `Structured around the core needs of modern ${siteSettings.category.toLowerCase()} workflows.` },
            { title: 'Responsive Experience', desc: `Designed with ${siteSettings.layoutPriority} ergonomics and accessible typography.` }
          ], designTokens);
        case 'services':
          return SECTION_TEMPLATES.services(`${siteSettings.name} Offerings & Packages`);
        case 'gallery':
          return SECTION_TEMPLATES.gallery(`${siteSettings.name} Visual Showcase`);
        case 'testimonials':
          return SECTION_TEMPLATES.testimonials(`Feedback from ${siteSettings.audience}`);
        case 'pricing':
          return SECTION_TEMPLATES.pricing();
        case 'faq':
          return SECTION_TEMPLATES.faq(`Common Questions About ${siteSettings.name}`);
        case 'bookingCta':
          return SECTION_TEMPLATES.bookingCta(`Ready to Experience ${siteSettings.name}?`, `Schedule your session or connect with our team serving ${siteSettings.audience}.`, 'Book Now');
        case 'newsletter':
          return SECTION_TEMPLATES.newsletter(`Stay Connected with ${siteSettings.name}`, `Get updates curated for ${siteSettings.audience}.`);
        case 'ecommerceGrid':
          return SECTION_TEMPLATES.ecommerceGrid(`${siteSettings.name} Featured Catalog`);
        case 'cmsBlock':
          return SECTION_TEMPLATES.cmsBlock(`Latest from ${siteSettings.name}`);
        case 'contactForm':
          return SECTION_TEMPLATES.contactForm(`Contact ${siteSettings.name}`);
        case 'footer':
          return SECTION_TEMPLATES.footer(siteSettings.name.toUpperCase());
        default:
          return SECTION_TEMPLATES.features();
      }
    });

    return {
      id: pagePlan.id,
      name: pagePlan.name,
      slug: pagePlan.slug,
      seoTitle: pagePlan.seoTitle,
      seoDesc: pagePlan.seoDesc,
      rootNode: {
        id: generateId(),
        type: ELEMENT_TYPES.PAGE,
        name: 'Body',
        styles: {
          base: {
            minHeight: '100vh',
            backgroundColor: designTokens.bg || '#ffffff',
            color: designTokens.text || '#0f172a',
            fontFamily: designTokens.fontHeading || 'system-ui, sans-serif',
            display: 'flex',
            flexDirection: 'column'
          }
        },
        props: {},
        children
      }
    };
  });

  return {
    id: 'proj_' + Math.random().toString(36).substr(2, 9),
    version: 6,
    name: siteSettings.name,
    category: siteSettings.category,
    designTokens,
    savedComponents: [],
    collections: clone(DEFAULT_COLLECTIONS),
    products: clone(DEFAULT_PRODUCTS),
    pages
  };
};

const createInitialProject = (name = 'New Nexus Website', templateKey = 'saas') => {
  const tpl = WEBSITE_TEMPLATES[templateKey] || WEBSITE_TEMPLATES.blank;
  const now = new Date().toISOString();
  return {
    id: 'proj_' + Math.random().toString(36).substr(2, 9),
    version: 10,
    name,
    category: tpl.category,
    templateKey,
    archived: false,
    createdAt: now,
    updatedAt: now,
    lastModifiedBy: 'Local Studio Owner',
    activeRole: 'Owner',
    collaborators: [
      { id: 'usr_owner', name: 'Local Studio Owner', email: 'owner@local.studio', role: 'Owner', status: 'active_local' }
    ],
    designTokens: clone(DEFAULT_DESIGN_TOKENS),
    customTokenPresets: [],
    assets: clone(DEFAULT_ASSETS),
    savedComponents: [],
    versionSnapshots: [],
    activityLog: [
      { id: 'act_' + generateId(), timestamp: now, type: 'project', message: `Project "${name}" created from template "${tpl.label}".` }
    ],
    onboarding: {
      dismissed: false,
      completedSteps: ['step_project']
    },
    collections: clone(DEFAULT_COLLECTIONS),
    products: clone(DEFAULT_PRODUCTS).map(normalizeProduct),
    orders: [],
    commerceSettings: clone(DEFAULT_COMMERCE_SETTINGS),
    siteSettings: { ...clone(DEFAULT_SITE_SETTINGS), siteName: name, defaultSeoTitle: name },
    publishing: clone(DEFAULT_PUBLISHING_STATE),
    pages: tpl.buildPages()
  };
};

const sanitizeProject = (proj) => {
  if (!proj || typeof proj !== 'object') return createInitialProject();
  const safe = clone(proj);
  safe.id = safe.id || generateId();
  safe.name = safe.name || 'Untitled Project';
  safe.version = 10;
  safe.archived = Boolean(safe.archived);
  safe.createdAt = safe.createdAt || '2026-10-01T10:00:00Z';
  safe.updatedAt = safe.updatedAt || new Date().toISOString();
  safe.lastModifiedBy = safe.lastModifiedBy || 'Local Studio Owner';
  safe.activeRole = ROLE_PERMISSIONS[safe.activeRole] ? safe.activeRole : 'Owner';
  safe.collaborators = Array.isArray(safe.collaborators) && safe.collaborators.length > 0
    ? safe.collaborators
    : [{ id: 'usr_owner', name: 'Local Studio Owner', email: 'owner@local.studio', role: 'Owner', status: 'active_local' }];
  safe.designTokens = { ...clone(DEFAULT_DESIGN_TOKENS), ...(safe.designTokens || {}) };
  safe.customTokenPresets = Array.isArray(safe.customTokenPresets) ? safe.customTokenPresets : [];
  safe.assets = Array.isArray(safe.assets) && safe.assets.length > 0 ? safe.assets : clone(DEFAULT_ASSETS);
  safe.savedComponents = Array.isArray(safe.savedComponents) ? safe.savedComponents : [];
  safe.versionSnapshots = Array.isArray(safe.versionSnapshots) ? safe.versionSnapshots : [];
  safe.activityLog = Array.isArray(safe.activityLog) ? safe.activityLog.slice(0, 60) : [];
  safe.onboarding = {
    dismissed: Boolean(safe.onboarding?.dismissed),
    completedSteps: Array.isArray(safe.onboarding?.completedSteps) ? safe.onboarding.completedSteps : ['step_project']
  };
  safe.collections = Array.isArray(safe.collections) && safe.collections.length > 0
    ? safe.collections.map(normalizeCollection)
    : clone(DEFAULT_COLLECTIONS).map(normalizeCollection);
  safe.products = Array.isArray(safe.products) && safe.products.length > 0
    ? safe.products.map(normalizeProduct)
    : clone(DEFAULT_PRODUCTS).map(normalizeProduct);
  safe.orders = Array.isArray(safe.orders) ? safe.orders : [];
  safe.commerceSettings = { ...clone(DEFAULT_COMMERCE_SETTINGS), ...(safe.commerceSettings || {}) };
  safe.siteSettings = { ...clone(DEFAULT_SITE_SETTINGS), siteName: safe.name, ...(safe.siteSettings || {}) };
  safe.publishing = { ...clone(DEFAULT_PUBLISHING_STATE), ...(safe.publishing || {}) };
  safe.publishing.customDomains = Array.isArray(safe.publishing.customDomains) ? safe.publishing.customDomains : [];
  safe.publishing.deploymentHistory = Array.isArray(safe.publishing.deploymentHistory) ? safe.publishing.deploymentHistory : [];
  if (!Array.isArray(safe.pages) || safe.pages.length === 0) {
    safe.pages = WEBSITE_TEMPLATES.blank.buildPages();
  }
  return safe;
};

const countAssetReferences = (project, assetUrl) => {
  if (!assetUrl) return 0;
  let count = 0;
  const walk = (node) => {
    if (!node) return;
    if (node.type === ELEMENT_TYPES.IMAGE && node.props?.src === assetUrl) count++;
    if (node.styles?.base?.backgroundImage && node.styles.base.backgroundImage.includes(assetUrl)) count++;
    if (Array.isArray(node.children)) node.children.forEach(walk);
  };
  (project.pages || []).forEach(p => walk(p.rootNode));
  return count;
};

const applyGlobalTokensToTree = (project, tokens) => {
  const nextProj = clone(project);
  nextProj.designTokens = { ...nextProj.designTokens, ...tokens };
  (nextProj.pages || []).forEach(page => {
    if (page.rootNode?.styles?.base) {
      page.rootNode.styles.base.backgroundColor = tokens.backgroundColor;
      page.rootNode.styles.base.color = tokens.textColor;
      page.rootNode.styles.base.fontFamily = tokens.fontFamily;
    }
    const walk = (node) => {
      if (!node) return;
      const base = node.styles?.base || {};
      if (node.type === ELEMENT_TYPES.SECTION) {
        if (base.backgroundColor === '#ffffff' || base.backgroundColor === project.designTokens?.backgroundColor) {
          base.backgroundColor = tokens.backgroundColor;
        } else if (base.backgroundColor === '#f8fafc' || base.backgroundColor === project.designTokens?.surfaceColor) {
          base.backgroundColor = tokens.surfaceColor;
        }
      }
      if (node.type === ELEMENT_TYPES.CONTAINER && base.maxWidth) {
        base.maxWidth = tokens.containerWidth || '1200px';
      }
      if (node.type === ELEMENT_TYPES.TEXT) {
        const tag = node.props?.tag || 'p';
        if (['h1', 'h2', 'h3', 'h4'].includes(tag)) {
          base.fontFamily = tokens.headingFont;
          if (base.color === '#111111' || base.color === '#0f172a' || base.color === project.designTokens?.textColor) {
            base.color = tokens.textColor;
          }
        } else if (base.color === '#333333' || base.color === '#64748b' || base.color === '#475569' || base.color === project.designTokens?.mutedColor) {
          base.color = tokens.mutedColor;
        }
      }
      if (node.type === ELEMENT_TYPES.BUTTON) {
        if (base.backgroundColor && base.backgroundColor !== 'transparent') {
          base.backgroundColor = tokens.primaryColor;
        }
        base.borderRadius = tokens.buttonRadius || tokens.borderRadius;
      }
      node.styles = { ...(node.styles || {}), base };
      if (Array.isArray(node.children)) node.children.forEach(walk);
    };
    walk(page.rootNode);
  });
  return nextProj;
};

function useBuilderState() {
  const [projectState, setProjectState] = useState(() => {
    try {
      const saved = localStorage.getItem('nexus_studio_project');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.pages && parsed.pages.length > 0) return sanitizeProject(parsed);
      }
    } catch (e) { console.error(e); }
    return createInitialProject('New Nexus Website', 'saas');
  });

  const [projectsList, setProjectsList] = useState(() => {
    try {
      const list = localStorage.getItem('nexus_studio_projects_list');
      return list ? JSON.parse(list).map(sanitizeProject) : [];
    } catch (e) { return []; }
  });

  const projectRef = useRef(projectState);
  projectRef.current = projectState;

  const setProject = useCallback((nextProj) => {
    const validProj = sanitizeProject(nextProj);
    projectRef.current = validProj;
    setProjectState(validProj);
  }, []);

  const [activePageId, setActivePageId] = useState(() => projectState.pages?.[0]?.id || 'page_home');
  const [selectedId, setSelectedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [deviceMode, setDeviceMode] = useState('desktop');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [smartGuides, setSmartGuides] = useState([]);
  const [clipboard, setClipboard] = useState(null);
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [demoCart, setDemoCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'dashboard' | 'ai' | 'cms' | 'commerce' | 'publishing' | 'audit' | 'design_system' | 'history' | 'team' | null
  const [permissionNotice, setPermissionNotice] = useState('');
  const [previewRecordByPage, setPreviewRecordByPage] = useState({});
  const [previewProductByPage, setPreviewProductByPage] = useState({});

  const [history, setHistory] = useState({ past: [], future: [] });
  const transactionSnapshot = useRef(null);

  const currentPermissions = useMemo(() => {
    const role = projectState.activeRole || 'Owner';
    return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.Owner;
  }, [projectState.activeRole]);

  const requirePermission = useCallback((permKey, actionLabel = 'perform this action') => {
    const role = projectRef.current.activeRole || 'Owner';
    const perms = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.Owner;
    if (!perms[permKey]) {
      setPermissionNotice(`Role "${role}" does not have permission to ${actionLabel}. Switch role to Owner or Administrator in Team & Permissions.`);
      return false;
    }
    return true;
  }, []);

  const appendActivity = useCallback((proj, type, message) => {
    if (!proj) return proj;
    const entry = {
      id: 'act_' + Math.random().toString(36).substr(2, 8),
      timestamp: new Date().toISOString(),
      actor: proj.lastModifiedBy || 'Local Studio Owner',
      role: proj.activeRole || 'Owner',
      type,
      message
    };
    proj.activityLog = [entry, ...(proj.activityLog || [])].slice(0, 60);
    proj.updatedAt = entry.timestamp;
    return proj;
  }, []);

  const markOnboardingStep = useCallback((stepId) => {
    const cur = projectRef.current;
    if (!cur?.onboarding || cur.onboarding.completedSteps?.includes(stepId)) return;
    const nextProj = clone(cur);
    nextProj.onboarding.completedSteps = [...(nextProj.onboarding.completedSteps || []), stepId];
    setProject(nextProj);
  }, [setProject]);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(`nexus_studio_cart_${projectState.id}`);
      setDemoCart(savedCart ? JSON.parse(savedCart) : []);
    } catch (e) { setDemoCart([]); }
  }, [projectState.id]);

  useEffect(() => {
    try {
      localStorage.setItem(`nexus_studio_cart_${projectState.id}`, JSON.stringify(demoCart));
    } catch (e) { console.error(e); }
  }, [demoCart, projectState.id]);

  useEffect(() => {
    setSaveStatus('Saving...');
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem('nexus_studio_project', JSON.stringify(projectState));
        setProjectsList(prev => {
          const exists = prev.some(p => p.id === projectState.id);
          const updated = exists ? prev.map(p => p.id === projectState.id ? projectState : p) : [...prev, projectState];
          localStorage.setItem('nexus_studio_projects_list', JSON.stringify(updated));
          return updated;
        });
        setSaveStatus('Saved');
      } catch (e) { setSaveStatus('Save Failed'); }
    }, 450);
    return () => clearTimeout(timeoutId);
  }, [projectState]);

  const findNodeAndParent = useCallback((nodes, id, parent = null) => {
    if (!Array.isArray(nodes)) return null;
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === id) return { node: nodes[i], parent, index: i };
      if (nodes[i].children) {
        const result = findNodeAndParent(nodes[i].children, id, nodes[i]);
        if (result) return result;
      }
    }
    return null;
  }, []);

  const checkIsDescendant = useCallback((parentNode, targetId) => {
    if (!parentNode || !parentNode.children) return false;
    for (const child of parentNode.children) {
      if (child.id === targetId) return true;
      if (checkIsDescendant(child, targetId)) return true;
    }
    return false;
  }, []);

  const saveToHistory = useCallback((newProject, mode = 'instant') => {
    const currentProject = projectRef.current;

    const markUnpublishedIfNeeded = (proj) => {
      if (!proj) return proj;
      if (proj.publishing && proj.publishing.status === 'published') {
        proj.publishing = { ...proj.publishing, status: 'changes_unpublished', lastSavedAt: new Date().toISOString() };
      } else if (proj.publishing) {
        proj.publishing = { ...proj.publishing, lastSavedAt: new Date().toISOString() };
      }
      return proj;
    };

    if (mode === 'start') {
      if (!transactionSnapshot.current) transactionSnapshot.current = clone(currentProject);
    } else if (mode === 'update') {
      if (newProject) setProject(markUnpublishedIfNeeded(newProject));
    } else if (mode === 'cancel') {
      if (transactionSnapshot.current) {
        setProject(transactionSnapshot.current);
      }
      transactionSnapshot.current = null;
    } else if (mode === 'commit') {
      const previous = transactionSnapshot.current || currentProject;
      const next = markUnpublishedIfNeeded(newProject || currentProject);
      if (JSON.stringify(previous) !== JSON.stringify(next)) {
        setHistory(prev => ({ past: [...prev.past, previous].slice(-30), future: [] }));
        setProject(next);
      }
      transactionSnapshot.current = null;
    } else if (mode === 'instant') {
      const next = markUnpublishedIfNeeded(newProject || currentProject);
      if (JSON.stringify(currentProject) !== JSON.stringify(next)) {
        setHistory(prev => ({ past: [...prev.past, currentProject].slice(-30), future: [] }));
        setProject(next);
      }
      transactionSnapshot.current = null;
    }
  }, [setProject]);

  const undo = useCallback(() => {
    if (history.past.length === 0) return;
    transactionSnapshot.current = null;
    const previous = history.past[history.past.length - 1];
    setHistory(prev => ({ past: prev.past.slice(0, -1), future: [projectRef.current, ...prev.future] }));
    setProject(previous);
    setSelectedId(null); setHoveredId(null);
  }, [history, setProject]);

  const redo = useCallback(() => {
    if (history.future.length === 0) return;
    transactionSnapshot.current = null;
    const next = history.future[0];
    setHistory(prev => ({ past: [...prev.past, projectRef.current], future: prev.future.slice(1) }));
    setProject(next);
    setSelectedId(null); setHoveredId(null);
  }, [history, setProject]);

  const activePage = useMemo(() => {
    return projectState.pages.find(p => p.id === activePageId) || projectState.pages[0];
  }, [projectState, activePageId]);

  const updateNode = useCallback((nodeId, updates, historyMode = 'instant') => {
    if (!requirePermission('canEditCanvas', 'edit canvas elements')) return;
    const mode = historyMode === true ? 'update' : (historyMode === false ? 'instant' : historyMode);
    const newProject = clone(projectRef.current);
    const page = newProject.pages.find(p => p.id === activePageId) || newProject.pages[0];

    if (page.rootNode.id === nodeId) {
      if (updates.styles) {
        const targetMode = deviceMode === 'desktop' ? 'base' : deviceMode;
        page.rootNode.styles[targetMode] = { ...(page.rootNode.styles[targetMode] || {}), ...updates.styles[targetMode] };
      } else { page.rootNode = { ...page.rootNode, ...updates }; }
    } else {
      const result = findNodeAndParent(page.rootNode.children, nodeId, page.rootNode);
      if (result) {
        if (updates.styles) {
          const targetMode = deviceMode === 'desktop' ? 'base' : deviceMode;
          result.node.styles[targetMode] = { ...(result.node.styles[targetMode] || {}), ...updates.styles[targetMode] };
        }
        if (updates.props) result.node.props = { ...(result.node.props || {}), ...updates.props };
        if (updates.name !== undefined) result.node.name = updates.name;
      }
    }
    if (mode === 'update') setProject(newProject);
    else saveToHistory(newProject, mode);
  }, [activePageId, deviceMode, findNodeAndParent, saveToHistory, setProject, requirePermission]);

  const addElement = useCallback((elementCreator, targetId = null, position = 'inside') => {
    if (!requirePermission('canEditCanvas', 'add elements to the canvas')) return;
    const newProject = clone(projectRef.current);
    const page = newProject.pages.find(p => p.id === activePageId) || newProject.pages[0];
    let newElement = typeof elementCreator === 'function' ? elementCreator() : refreshIds(clone(elementCreator));

    if (targetId === page.rootNode.id && position !== 'inside') position = 'inside';

    if (!targetId || targetId === page.rootNode.id) {
      page.rootNode.children.push(newElement);
    } else {
      const result = findNodeAndParent(page.rootNode.children, targetId, page.rootNode);
      if (result) {
        const { node, parent, index } = result;
        const isContainer = [ELEMENT_TYPES.SECTION, ELEMENT_TYPES.CONTAINER, ELEMENT_TYPES.GRID, ELEMENT_TYPES.NAV].includes(node.type);
        if (position === 'inside' && isContainer) {
          node.children = node.children || [];
          node.children.push(newElement);
        } else {
          parent.children.splice(position === 'after' ? index + 1 : index, 0, newElement);
        }
      } else {
        page.rootNode.children.push(newElement);
      }
    }
    if (!newProject.onboarding?.completedSteps?.includes('step_section')) {
      newProject.onboarding = { ...(newProject.onboarding || {}), completedSteps: [...(newProject.onboarding?.completedSteps || []), 'step_section'] };
    }
    appendActivity(newProject, 'canvas', `Added "${newElement.name}" to page "${page.name}".`);
    saveToHistory(newProject, 'instant');
    setSelectedId(newElement.id);
  }, [activePageId, findNodeAndParent, saveToHistory, requirePermission, appendActivity]);

  const removeElement = useCallback((nodeId) => {
    if (!nodeId) return;
    if (!requirePermission('canEditCanvas', 'delete canvas elements')) return;
    const newProject = clone(projectRef.current);
    const page = newProject.pages.find(p => p.id === activePageId) || newProject.pages[0];
    if (page.rootNode.id === nodeId) return;

    const result = findNodeAndParent(page.rootNode.children, nodeId, page.rootNode);
    if (result) {
      if (result.node.props?.editorLocked) {
        setPermissionNotice(`Element "${result.node.name}" is locked in the editor. Unlock it in the Layers panel before deleting.`);
        return;
      }
      const removedName = result.node.name;
      result.parent.children.splice(result.index, 1);
      appendActivity(newProject, 'canvas', `Deleted element "${removedName}" from "${page.name}".`);
      saveToHistory(newProject, 'instant');
      setSelectedId(null); setSelectedIds([]); setHoveredId(null);
    }
  }, [activePageId, findNodeAndParent, saveToHistory, requirePermission, appendActivity]);

  const selectParentElement = useCallback((nodeId) => {
    const target = nodeId || selectedId;
    if (!target) return;
    const page = projectRef.current.pages.find(p => p.id === activePageId) || projectRef.current.pages[0];
    if (target === page.rootNode.id) return;
    const res = findNodeAndParent(page.rootNode.children, target, page.rootNode);
    if (res && res.parent) {
      setSelectedId(res.parent.id);
      setSelectedIds([res.parent.id]);
    }
  }, [selectedId, activePageId, findNodeAndParent]);

  const reorderSiblingElement = useCallback((nodeId, direction) => {
    if (!requirePermission('canEditCanvas', 'reorder elements')) return;
    const newProject = clone(projectRef.current);
    const page = newProject.pages.find(p => p.id === activePageId) || newProject.pages[0];
    if (page.rootNode.id === nodeId) return;
    const res = findNodeAndParent(page.rootNode.children, nodeId, page.rootNode);
    if (!res || !res.parent) return;
    const targetIdx = direction === 'up' ? res.index - 1 : res.index + 1;
    if (targetIdx < 0 || targetIdx >= res.parent.children.length) return;
    const temp = res.parent.children[res.index];
    res.parent.children[res.index] = res.parent.children[targetIdx];
    res.parent.children[targetIdx] = temp;
    saveToHistory(newProject, 'instant');
  }, [activePageId, findNodeAndParent, saveToHistory, requirePermission]);

  const resetStyleProperty = useCallback((nodeId, styleKey) => {
    if (!requirePermission('canEditCanvas', 'reset style overrides')) return;
    const newProject = clone(projectRef.current);
    const page = newProject.pages.find(p => p.id === activePageId) || newProject.pages[0];
    const targetMode = deviceMode === 'desktop' ? 'base' : deviceMode;
    const targetNode = page.rootNode.id === nodeId ? page.rootNode : findNodeAndParent(page.rootNode.children, nodeId, page.rootNode)?.node;
    if (targetNode && targetNode.styles && targetNode.styles[targetMode]) {
      delete targetNode.styles[targetMode][styleKey];
      saveToHistory(newProject, 'instant');
    }
  }, [activePageId, deviceMode, findNodeAndParent, saveToHistory, requirePermission]);

  const alignSelectedElements = useCallback((operation) => {
    if (!requirePermission('canEditCanvas', 'align elements')) return;
    const newProject = clone(projectRef.current);
    const page = newProject.pages.find(p => p.id === activePageId) || newProject.pages[0];
    const targetMode = deviceMode === 'desktop' ? 'base' : deviceMode;
    const idsToUpdate = selectedIds.length > 1 ? selectedIds : (selectedId ? [selectedId] : []);
    if (idsToUpdate.length === 0) return;

    const nodes = idsToUpdate
      .map(id => id === page.rootNode.id ? page.rootNode : findNodeAndParent(page.rootNode.children, id, page.rootNode)?.node)
      .filter(Boolean);

    if (nodes.length === 1) {
      const n = nodes[0];
      n.styles[targetMode] = n.styles[targetMode] || {};
      if (operation === 'left') { n.styles[targetMode].textAlign = 'left'; n.styles[targetMode].alignItems = 'flex-start'; }
      if (operation === 'center') { n.styles[targetMode].textAlign = 'center'; n.styles[targetMode].alignItems = 'center'; n.styles[targetMode].marginLeft = 'auto'; n.styles[targetMode].marginRight = 'auto'; }
      if (operation === 'right') { n.styles[targetMode].textAlign = 'right'; n.styles[targetMode].alignItems = 'flex-end'; }
      if (operation === 'top') { n.styles[targetMode].justifyContent = 'flex-start'; }
      if (operation === 'middle') { n.styles[targetMode].justifyContent = 'center'; }
      if (operation === 'bottom') { n.styles[targetMode].justifyContent = 'flex-end'; }
      if (operation === 'distribute-h') { n.styles[targetMode].display = 'flex'; n.styles[targetMode].flexDirection = 'row'; n.styles[targetMode].justifyContent = 'space-between'; }
      if (operation === 'distribute-v') { n.styles[targetMode].display = 'flex'; n.styles[targetMode].flexDirection = 'column'; n.styles[targetMode].justifyContent = 'space-between'; }
    } else if (nodes.length > 1) {
      const firstStyles = nodes[0].styles?.[targetMode] || nodes[0].styles?.base || {};
      nodes.forEach(n => {
        n.styles[targetMode] = n.styles[targetMode] || {};
        if (operation === 'left') n.styles[targetMode].alignSelf = 'flex-start';
        if (operation === 'center') n.styles[targetMode].alignSelf = 'center';
        if (operation === 'right') n.styles[targetMode].alignSelf = 'flex-end';
        if (operation === 'match-width' && firstStyles.width) n.styles[targetMode].width = firstStyles.width;
        if (operation === 'match-height' && firstStyles.height) n.styles[targetMode].height = firstStyles.height;
        if (operation === 'equal-gap') n.styles[targetMode].margin = '0.5rem';
      });
    }
    saveToHistory(newProject, 'instant');
  }, [activePageId, deviceMode, selectedId, selectedIds, findNodeAndParent, saveToHistory, requirePermission]);

  const moveElementPosition = useCallback((draggedId, targetId, position) => {
    if (draggedId === targetId) return;
    if (!requirePermission('canEditCanvas', 'reorder elements')) return;
    const newProject = clone(projectRef.current);
    const page = newProject.pages.find(p => p.id === activePageId) || newProject.pages[0];
    if (page.rootNode.id === draggedId) return;

    const draggedRes = findNodeAndParent(page.rootNode.children, draggedId, page.rootNode);
    if (!draggedRes) return;
    if (checkIsDescendant(draggedRes.node, targetId)) return;

    draggedRes.parent.children.splice(draggedRes.index, 1);

    if (targetId === page.rootNode.id) {
      page.rootNode.children.push(draggedRes.node);
    } else {
      const targetRes = findNodeAndParent(page.rootNode.children, targetId, page.rootNode);
      if (targetRes) {
        const isContainer = [ELEMENT_TYPES.SECTION, ELEMENT_TYPES.CONTAINER, ELEMENT_TYPES.GRID, ELEMENT_TYPES.NAV].includes(targetRes.node.type);
        if (position === 'inside' && isContainer) {
          targetRes.node.children = targetRes.node.children || [];
          targetRes.node.children.push(draggedRes.node);
        } else {
          targetRes.parent.children.splice(position === 'after' ? targetRes.index + 1 : targetRes.index, 0, draggedRes.node);
        }
      } else {
        page.rootNode.children.push(draggedRes.node);
      }
    }
    saveToHistory(newProject, 'instant');
  }, [activePageId, findNodeAndParent, checkIsDescendant, saveToHistory, requirePermission]);

  const copyElement = useCallback(() => {
    const page = projectRef.current.pages.find(p => p.id === activePageId) || projectRef.current.pages[0];
    if (!selectedId || selectedId === page.rootNode.id) return;
    const result = findNodeAndParent(page.rootNode.children, selectedId, page.rootNode);
    if (result) setClipboard(clone(result.node));
  }, [selectedId, activePageId, findNodeAndParent]);

  const pasteElement = useCallback(() => {
    if (!clipboard) return;
    if (!requirePermission('canEditCanvas', 'paste elements')) return;
    const newProject = clone(projectRef.current);
    const page = newProject.pages.find(p => p.id === activePageId) || newProject.pages[0];
    const clonedNode = refreshIds(clone(clipboard));

    if (!selectedId || selectedId === page.rootNode.id) {
      page.rootNode.children.push(clonedNode);
    } else {
      const result = findNodeAndParent(page.rootNode.children, selectedId, page.rootNode);
      if (result) {
        result.parent.children.splice(result.index + 1, 0, clonedNode);
      } else {
        page.rootNode.children.push(clonedNode);
      }
    }
    saveToHistory(newProject, 'instant');
    setSelectedId(clonedNode.id);
  }, [clipboard, selectedId, activePageId, findNodeAndParent, saveToHistory, requirePermission]);

  const duplicateElement = useCallback(() => {
    if (!requirePermission('canEditCanvas', 'duplicate elements')) return;
    const newProject = clone(projectRef.current);
    const page = newProject.pages.find(p => p.id === activePageId) || newProject.pages[0];
    if (!selectedId || selectedId === page.rootNode.id) return;
    const result = findNodeAndParent(page.rootNode.children, selectedId, page.rootNode);
    if (result) {
      const dup = refreshIds(clone(result.node));
      dup.name = `${dup.name} Copy`;
      result.parent.children.splice(result.index + 1, 0, dup);
      saveToHistory(newProject, 'instant');
      setSelectedId(dup.id);
    }
  }, [selectedId, activePageId, findNodeAndParent, saveToHistory, requirePermission]);

  const saveAsComponent = useCallback((name, category = 'Custom') => {
    if (!requirePermission('canEditCanvas', 'save reusable symbols')) return;
    const page = projectRef.current.pages.find(p => p.id === activePageId) || projectRef.current.pages[0];
    if (!selectedId || selectedId === page.rootNode.id) return;
    const result = findNodeAndParent(page.rootNode.children, selectedId, page.rootNode);
    if (!result) return;

    const newProject = clone(projectRef.current);
    newProject.savedComponents = newProject.savedComponents || [];
    const compId = 'sym_' + generateId();
    const cleanName = (name || result.node.name || 'Reusable Symbol').trim();
    const masterNode = clone(result.node);
    masterNode.props = { ...(masterNode.props || {}), symbolId: compId, symbolName: cleanName };
    result.node.props = { ...(result.node.props || {}), symbolId: compId, symbolName: cleanName };

    newProject.savedComponents.push({
      id: compId,
      name: cleanName,
      category,
      updatedAt: new Date().toISOString(),
      node: masterNode
    });
    appendActivity(newProject, 'component', `Created reusable symbol "${cleanName}".`);
    saveToHistory(newProject, 'instant');
  }, [selectedId, activePageId, findNodeAndParent, saveToHistory, requirePermission, appendActivity]);

  const insertSavedComponent = useCallback((compId, asLinked = true) => {
    if (!requirePermission('canEditCanvas', 'insert symbols')) return;
    const comp = (projectRef.current.savedComponents || []).find(c => c.id === compId);
    if (!comp) return;
    const instance = refreshIds(clone(comp.node));
    if (asLinked) {
      instance.props = { ...(instance.props || {}), symbolId: comp.id, symbolName: comp.name };
    } else if (instance.props) {
      delete instance.props.symbolId;
      delete instance.props.symbolName;
    }
    addElement(instance, selectedId || activePage.rootNode.id, 'inside');
  }, [requirePermission, addElement, selectedId, activePage]);

  const syncLinkedSymbolInstances = useCallback((compId) => {
    if (!requirePermission('canEditCanvas', 'synchronize linked symbols')) return;
    const newProject = clone(projectRef.current);
    const page = newProject.pages.find(p => p.id === activePageId) || newProject.pages[0];
    const selectedRes = selectedId ? findNodeAndParent(page.rootNode.children, selectedId, page.rootNode) : null;
    const compIdx = (newProject.savedComponents || []).findIndex(c => c.id === compId);
    if (compIdx === -1) return;

    if (selectedRes && selectedRes.node.props?.symbolId === compId) {
      newProject.savedComponents[compIdx].node = clone(selectedRes.node);
      newProject.savedComponents[compIdx].updatedAt = new Date().toISOString();
    }
    const master = newProject.savedComponents[compIdx].node;
    let updatedCount = 0;

    (newProject.pages || []).forEach(pg => {
      const walkUpdate = (children) => {
        if (!Array.isArray(children)) return;
        for (let i = 0; i < children.length; i++) {
          if (children[i].props?.symbolId === compId) {
            const keepId = children[i].id;
            const synced = refreshIds(clone(master));
            synced.id = keepId;
            synced.props = { ...(synced.props || {}), symbolId: compId, symbolName: newProject.savedComponents[compIdx].name };
            children[i] = synced;
            updatedCount++;
          } else if (children[i].children) {
            walkUpdate(children[i].children);
          }
        }
      };
      walkUpdate(pg.rootNode.children);
    });

    appendActivity(newProject, 'component', `Synced symbol "${newProject.savedComponents[compIdx].name}" across ${updatedCount} linked instance(s).`);
    saveToHistory(newProject, 'instant');
  }, [activePageId, selectedId, findNodeAndParent, saveToHistory, requirePermission, appendActivity]);

  const deleteSavedComponent = useCallback((compId) => {
    if (!requirePermission('canEditCanvas', 'delete symbols')) return;
    const newProject = clone(projectRef.current);
    newProject.savedComponents = (newProject.savedComponents || []).filter(c => c.id !== compId);
    saveToHistory(newProject, 'instant');
  }, [saveToHistory, requirePermission]);

  const addPage = useCallback((customName, group = 'Main') => {
    if (!requirePermission('canManagePages', 'create pages')) return;
    const newProject = clone(projectRef.current);
    const newPageId = 'page_' + Math.random().toString(36).substr(2, 7);
    const count = newProject.pages.length + 1;
    const name = customName || `Page ${count}`;
    let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `page-${count}`;
    if (newProject.pages.some(p => p.slug === slug)) slug = `${slug}-${count}`;
    newProject.pages.push({
      id: newPageId, name, slug, group, visibility: 'public', seoTitle: `${name} — ${newProject.name}`, seoDesc: '',
      rootNode: {
        id: generateId(), type: ELEMENT_TYPES.PAGE, name: 'Body',
        styles: { base: { minHeight: '100vh', backgroundColor: newProject.designTokens?.backgroundColor || '#ffffff', display: 'flex', flexDirection: 'column' } },
        props: {}, children: [SECTION_TEMPLATES.navbar(newProject.name.toUpperCase()), SECTION_TEMPLATES.footer(newProject.name.toUpperCase())]
      }
    });
    if (!newProject.onboarding?.completedSteps?.includes('step_page')) {
      newProject.onboarding = { ...(newProject.onboarding || {}), completedSteps: [...(newProject.onboarding?.completedSteps || []), 'step_page'] };
    }
    appendActivity(newProject, 'page', `Created page "${name}" (${slug}.html).`);
    saveToHistory(newProject, 'instant');
    setActivePageId(newPageId); setSelectedId(null); setHoveredId(null);
  }, [saveToHistory, requirePermission, appendActivity]);

  const reorderPage = useCallback((pageId, direction) => {
    if (!requirePermission('canManagePages', 'reorder pages')) return;
    const newProject = clone(projectRef.current);
    const idx = newProject.pages.findIndex(p => p.id === pageId);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= newProject.pages.length) return;
    const temp = newProject.pages[idx];
    newProject.pages[idx] = newProject.pages[targetIdx];
    newProject.pages[targetIdx] = temp;
    saveToHistory(newProject, 'instant');
  }, [saveToHistory, requirePermission]);

  const duplicatePage = useCallback((pageId) => {
    if (!requirePermission('canManagePages', 'duplicate pages')) return;
    const newProject = clone(projectRef.current);
    const source = newProject.pages.find(p => p.id === pageId);
    if (!source) return;
    const copy = clone(source);
    copy.id = 'page_' + Math.random().toString(36).substr(2, 7);
    copy.name = `${source.name} Copy`;
    copy.slug = `${source.slug}-copy`;
    copy.rootNode = refreshIds(copy.rootNode);
    newProject.pages.push(copy);
    appendActivity(newProject, 'page', `Duplicated page "${source.name}".`);
    saveToHistory(newProject, 'instant');
    setActivePageId(copy.id);
  }, [saveToHistory, requirePermission, appendActivity]);

  const deletePage = useCallback((pageId) => {
    if (!requirePermission('canManagePages', 'delete pages')) return;
    if (projectRef.current.pages.length <= 1) return;
    const newProject = clone(projectRef.current);
    const target = newProject.pages.find(p => p.id === pageId);
    newProject.pages = newProject.pages.filter(p => p.id !== pageId);
    if (activePageId === pageId) {
      setActivePageId(newProject.pages[0].id);
      setSelectedId(null); setHoveredId(null);
    }
    appendActivity(newProject, 'page', `Deleted page "${target?.name || pageId}".`);
    saveToHistory(newProject, 'instant');
  }, [activePageId, saveToHistory, requirePermission, appendActivity]);

  const createNewSiteProject = useCallback((name, templateKey) => {
    const fresh = createInitialProject(name, templateKey);
    setHistory({ past: [], future: [] });
    setProject(fresh);
    setActivePageId(fresh.pages[0].id);
    setSelectedId(null);
    setActiveModal(null);
  }, [setProject]);

  const applyGeneratedPlan = useCallback((plan, mode = 'new') => {
    const compiledProject = compilePlanToProject(plan);
    if (mode === 'replace') {
      const updated = {
        ...compiledProject,
        id: projectRef.current.id,
        savedComponents: projectRef.current.savedComponents || []
      };
      saveToHistory(updated, 'instant');
      setActivePageId(updated.pages[0].id);
    } else {
      setHistory({ past: [], future: [] });
      setProject(compiledProject);
      setActivePageId(compiledProject.pages[0].id);
    }
    setSelectedId(null);
    setHoveredId(null);
    setActiveModal(null);
  }, [saveToHistory, setProject]);

  const switchSiteProject = useCallback((targetProj) => {
    const valid = sanitizeProject(targetProj);
    setHistory({ past: [], future: [] });
    setProject(valid);
    setActivePageId(valid.pages[0].id);
    setSelectedId(null);
    setActiveModal(null);
  }, [setProject]);

  useEffect(() => {
    if (isPreviewMode || activeModal) return;
    const handleKeyDown = (e) => {
      const activeElement = document.activeElement;
      const isInputFocused = ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeElement?.tagName?.toUpperCase()) || activeElement?.isContentEditable;
      if (isInputFocused) return;

      if (e.key === 'Escape') {
        setSelectedId(null);
        setSelectedIds([]);
        setSmartGuides([]);
        return;
      }

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && selectedId) {
        const page = projectRef.current.pages.find(p => p.id === activePageId) || projectRef.current.pages[0];
        if (selectedId === page.rootNode.id) return;
        const res = findNodeAndParent(page.rootNode.children, selectedId, page.rootNode);
        if (!res || res.node.props?.editorLocked) return;
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const targetMode = deviceMode === 'desktop' ? 'base' : deviceMode;
        const curStyles = { ...(res.node.styles?.base || {}), ...(res.node.styles?.[targetMode] || {}) };
        const pos = curStyles.position && curStyles.position !== 'static' ? curStyles.position : 'relative';
        const curLeft = parseFloat(curStyles.left) || 0;
        const curTop = parseFloat(curStyles.top) || 0;
        const nextLeft = e.key === 'ArrowLeft' ? curLeft - step : e.key === 'ArrowRight' ? curLeft + step : curLeft;
        const nextTop = e.key === 'ArrowUp' ? curTop - step : e.key === 'ArrowDown' ? curTop + step : curTop;
        updateNode(selectedId, {
          styles: { [targetMode]: { position: pos, left: `${nextLeft}px`, top: `${nextTop}px` } }
        }, 'instant');
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        removeElement(selectedId);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        e.preventDefault(); copyElement();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        e.preventDefault(); pasteElement();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault(); duplicateElement();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault(); if (e.shiftKey) redo(); else undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault(); redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, activePageId, deviceMode, findNodeAndParent, updateNode, removeElement, copyElement, pasteElement, duplicateElement, undo, redo, isPreviewMode, activeModal]);

  const getComputedStyles = useCallback((node, mode) => {
    if (!node || !node.styles) return {};
    let computed = { ...(node.styles.base || {}) };
    if (mode === 'tablet' || mode === 'mobile') computed = { ...computed, ...(node.styles.tablet || {}) };
    if (mode === 'mobile') computed = { ...computed, ...(node.styles.mobile || {}) };
    return computed;
  }, []);

  return {
    project: projectState, setProject, projectsList, activePage, activePageId, setActivePageId,
    selectedId, setSelectedId, selectedIds, setSelectedIds, hoveredId, setHoveredId,
    deviceMode, setDeviceMode, isPreviewMode, setIsPreviewMode,
    snapEnabled, setSnapEnabled, smartGuides, setSmartGuides,
    history, clipboard, saveStatus,
    demoCart, setDemoCart, isCartOpen, setIsCartOpen, activeModal, setActiveModal,
    permissionNotice, setPermissionNotice, currentPermissions,
    previewRecordByPage, setPreviewRecordByPage,
    previewProductByPage, setPreviewProductByPage,
    actions: {
      addElement, updateNode, removeElement, selectParentElement, reorderSiblingElement,
      resetStyleProperty, alignSelectedElements,
      moveElementPosition, copyElement, pasteElement,
      duplicateElement, saveAsComponent, insertSavedComponent, syncLinkedSymbolInstances, deleteSavedComponent,
      markOnboardingStep,
      updatePage: (id, u) => {
        if (!requirePermission('canManagePages', 'update page settings')) return;
        const newProj = clone(projectRef.current);
        const idx = newProj.pages.findIndex(p => p.id === id);
        if (idx !== -1) { newProj.pages[idx] = { ...newProj.pages[idx], ...u }; saveToHistory(newProj, 'instant'); }
      },
      addPage, reorderPage, duplicatePage, deletePage, undo, redo, getComputedStyles, saveToHistory,
      createNewSiteProject, switchSiteProject, applyGeneratedPlan,
      renameProject: (projId, newName) => {
        const clean = (newName || '').trim();
        if (!clean) return;
        if (projId === projectRef.current.id) {
          const next = clone(projectRef.current);
          next.name = clean;
          next.siteSettings = { ...(next.siteSettings || {}), siteName: clean };
          appendActivity(next, 'project', `Renamed project to "${clean}".`);
          saveToHistory(next, 'instant');
        } else {
          setProjectsList(prev => {
            const updated = prev.map(p => p.id === projId ? { ...p, name: clean, updatedAt: new Date().toISOString() } : p);
            localStorage.setItem('nexus_studio_projects_list', JSON.stringify(updated));
            return updated;
          });
        }
      },
      duplicateSiteProject: (projId) => {
        const source = projId === projectRef.current.id ? projectRef.current : projectsList.find(p => p.id === projId);
        if (!source) return;
        const copy = sanitizeProject(clone(source));
        copy.id = 'proj_' + Math.random().toString(36).substr(2, 9);
        copy.name = `${source.name} (Copy)`;
        copy.createdAt = new Date().toISOString();
        copy.updatedAt = copy.createdAt;
        copy.publishing = clone(DEFAULT_PUBLISHING_STATE);
        appendActivity(copy, 'project', `Duplicated from project "${source.name}".`);
        setProjectsList(prev => {
          const updated = [copy, ...prev];
          localStorage.setItem('nexus_studio_projects_list', JSON.stringify(updated));
          return updated;
        });
      },
      toggleArchiveProject: (projId) => {
        setProjectsList(prev => {
          const updated = prev.map(p => p.id === projId ? { ...p, archived: !p.archived, updatedAt: new Date().toISOString() } : p);
          localStorage.setItem('nexus_studio_projects_list', JSON.stringify(updated));
          return updated;
        });
        if (projId === projectRef.current.id) {
          const next = clone(projectRef.current);
          next.archived = !next.archived;
          setProject(next);
        }
      },
      deleteSiteProject: (projId) => {
        if (!requirePermission('canDeleteProject', 'delete projects')) return;
        const remaining = projectsList.filter(p => p.id !== projId);
        localStorage.setItem('nexus_studio_projects_list', JSON.stringify(remaining));
        setProjectsList(remaining);
        if (projId === projectRef.current.id) {
          const nextActive = remaining[0] || createInitialProject('New Nexus Website', 'saas');
          setHistory({ past: [], future: [] });
          setProject(nextActive);
          setActivePageId(nextActive.pages[0].id);
        }
      },
      importProjectBackup: (rawJsonData, mode = 'new') => {
        const sanitized = sanitizeProject(rawJsonData);
        if (mode === 'replace') {
          sanitized.id = projectRef.current.id;
          appendActivity(sanitized, 'backup', `Restored project backup "${rawJsonData.name || 'Imported'}" into current project.`);
          saveToHistory(sanitized, 'instant');
          setActivePageId(sanitized.pages[0].id);
        } else {
          sanitized.id = 'proj_' + Math.random().toString(36).substr(2, 9);
          sanitized.name = `${sanitized.name} (Imported)`;
          appendActivity(sanitized, 'backup', `Imported project backup as new isolated project.`);
          setHistory({ past: [], future: [] });
          setProject(sanitized);
          setActivePageId(sanitized.pages[0].id);
        }
        setSelectedId(null);
        setActiveModal(null);
      },
      applyDesignTokens: (tokens, propagateToElements = true) => {
        if (!requirePermission('canEditCanvas', 'update design system tokens')) return;
        let nextProj = clone(projectRef.current);
        if (propagateToElements) {
          nextProj = applyGlobalTokensToTree(nextProj, tokens);
        } else {
          nextProj.designTokens = { ...(nextProj.designTokens || DEFAULT_DESIGN_TOKENS), ...tokens };
        }
        if (!nextProj.onboarding?.completedSteps?.includes('step_theme')) {
          nextProj.onboarding = { ...(nextProj.onboarding || {}), completedSteps: [...(nextProj.onboarding?.completedSteps || []), 'step_theme'] };
        }
        appendActivity(nextProj, 'design', `Applied design tokens "${tokens.name || 'Custom Tokens'}".`);
        saveToHistory(nextProj, 'instant');
      },
      saveCustomTokenPreset: (presetName) => {
        const nextProj = clone(projectRef.current);
        nextProj.customTokenPresets = nextProj.customTokenPresets || [];
        nextProj.customTokenPresets.push({
          id: 'tok_' + generateId(),
          name: (presetName || 'Custom Theme').trim(),
          tokens: clone(nextProj.designTokens || DEFAULT_DESIGN_TOKENS)
        });
        saveToHistory(nextProj, 'instant');
      },
      addAsset: (assetObj) => {
        if (!requirePermission('canManageAssets', 'upload or add assets')) return;
        const nextProj = clone(projectRef.current);
        nextProj.assets = nextProj.assets || [];
        const newAsset = {
          id: 'ast_' + Math.random().toString(36).substr(2, 8),
          name: (assetObj.name || 'New Image Asset').trim(),
          url: assetObj.url,
          alt: (assetObj.alt || assetObj.name || 'Website image').trim(),
          folder: assetObj.folder || 'General',
          mimeType: assetObj.mimeType || 'image/jpeg',
          sizeBytes: assetObj.sizeBytes || 0,
          createdAt: new Date().toISOString()
        };
        nextProj.assets.unshift(newAsset);
        appendActivity(nextProj, 'asset', `Added media asset "${newAsset.name}".`);
        saveToHistory(nextProj, 'instant');
        return newAsset;
      },
      updateAsset: (assetId, updates) => {
        if (!requirePermission('canManageAssets', 'update assets')) return;
        const nextProj = clone(projectRef.current);
        nextProj.assets = (nextProj.assets || []).map(a => a.id === assetId ? { ...a, ...updates } : a);
        saveToHistory(nextProj, 'instant');
      },
      deleteAsset: (assetId) => {
        if (!requirePermission('canManageAssets', 'delete assets')) return;
        const nextProj = clone(projectRef.current);
        const target = (nextProj.assets || []).find(a => a.id === assetId);
        nextProj.assets = (nextProj.assets || []).filter(a => a.id !== assetId);
        appendActivity(nextProj, 'asset', `Removed asset "${target?.name || assetId}".`);
        saveToHistory(nextProj, 'instant');
      },
      createVersionSnapshot: (label, description = '') => {
        const nextProj = clone(projectRef.current);
        const snap = {
          id: 'ver_' + Math.random().toString(36).substr(2, 8),
          label: (label || `Snapshot #${(nextProj.versionSnapshots?.length || 0) + 1}`).trim(),
          description: description.trim(),
          timestamp: new Date().toISOString(),
          actor: nextProj.lastModifiedBy || 'Local Studio Owner',
          pages: clone(nextProj.pages),
          designTokens: clone(nextProj.designTokens),
          collections: clone(nextProj.collections),
          products: clone(nextProj.products),
          savedComponents: clone(nextProj.savedComponents)
        };
        nextProj.versionSnapshots = [snap, ...(nextProj.versionSnapshots || [])].slice(0, 20);
        appendActivity(nextProj, 'version', `Saved version snapshot "${snap.label}".`);
        setProject(nextProj);
      },
      restoreVersionSnapshot: (snapId) => {
        if (!requirePermission('canEditCanvas', 'restore version snapshots')) return;
        const cur = clone(projectRef.current);
        const snap = (cur.versionSnapshots || []).find(s => s.id === snapId);
        if (!snap) return;
        const autoBackup = {
          id: 'ver_auto_' + Math.random().toString(36).substr(2, 6),
          label: `Pre-Restore Auto-Backup (${new Date().toLocaleTimeString()})`,
          description: `Automatic safety point created before restoring "${snap.label}".`,
          timestamp: new Date().toISOString(),
          actor: cur.lastModifiedBy || 'System',
          pages: clone(cur.pages),
          designTokens: clone(cur.designTokens),
          collections: clone(cur.collections),
          products: clone(cur.products),
          savedComponents: clone(cur.savedComponents)
        };
        cur.pages = clone(snap.pages);
        cur.designTokens = clone(snap.designTokens || DEFAULT_DESIGN_TOKENS);
        cur.collections = clone(snap.collections || DEFAULT_COLLECTIONS);
        cur.products = clone(snap.products || DEFAULT_PRODUCTS);
        cur.savedComponents = clone(snap.savedComponents || []);
        cur.versionSnapshots = [autoBackup, ...(cur.versionSnapshots || [])].slice(0, 20);
        appendActivity(cur, 'version', `Restored project to snapshot "${snap.label}".`);
        saveToHistory(cur, 'instant');
        setActivePageId(cur.pages[0]?.id || 'page_home');
        setSelectedId(null);
      },
      setActiveRole: (roleName) => {
        if (!ROLE_PERMISSIONS[roleName]) return;
        const nextProj = clone(projectRef.current);
        nextProj.activeRole = roleName;
        setPermissionNotice('');
        appendActivity(nextProj, 'team', `Switched active local prototype role to "${roleName}".`);
        setProject(nextProj);
      },
      addCollaborator: (name, email, role) => {
        if (!requirePermission('canManageTeam', 'invite collaborators')) return;
        const nextProj = clone(projectRef.current);
        nextProj.collaborators = nextProj.collaborators || [];
        nextProj.collaborators.push({
          id: 'usr_' + Math.random().toString(36).substr(2, 7),
          name: name.trim(),
          email: email.trim(),
          role: ROLE_PERMISSIONS[role] ? role : 'Editor',
          status: 'invited_local_prototype'
        });
        appendActivity(nextProj, 'team', `Added collaborator "${name}" as ${role} (Local Prototype).`);
        saveToHistory(nextProj, 'instant');
      },
      removeCollaborator: (usrId) => {
        if (!requirePermission('canManageTeam', 'remove collaborators')) return;
        const nextProj = clone(projectRef.current);
        nextProj.collaborators = (nextProj.collaborators || []).filter(u => u.id !== usrId || u.role === 'Owner');
        saveToHistory(nextProj, 'instant');
      },
      toggleOnboardingDismissed: (dismissed) => {
        const nextProj = clone(projectRef.current);
        nextProj.onboarding = { ...(nextProj.onboarding || {}), dismissed: Boolean(dismissed) };
        setProject(nextProj);
      },
      createCollection: (name, presetKey = 'blog') => {
        const newProj = clone(projectRef.current);
        const preset = STARTER_COLLECTION_PRESETS[presetKey] || STARTER_COLLECTION_PRESETS.blog;
        const cleanName = (name || preset.name || 'Custom Collection').trim();
        let baseSlug = toSlug(cleanName);
        if (newProj.collections.some(c => c.slug === baseSlug)) {
          baseSlug = `${baseSlug}-${newProj.collections.length + 1}`;
        }
        const newCol = normalizeCollection({
          id: 'col_' + Math.random().toString(36).substr(2, 7),
          name: cleanName,
          slug: baseSlug,
          fields: clone(preset.fields),
          items: [
            {
              id: generateId(),
              slug: `sample-${baseSlug}-1`,
              status: 'published',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              title: `Sample ${cleanName} Entry`,
              summary: `Initial record in ${cleanName}. Customize fields and status in the CMS Studio.`,
              body: `Detailed content for ${cleanName}. Bound elements on dynamic detail pages will automatically render this text.`,
              category: 'Featured',
              date: '2026-10-13',
              image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop'
            }
          ]
        });
        newProj.collections.push(newCol);
        saveToHistory(newProj, 'instant');
        return newCol.id;
      },
      updateCollection: (colId, updates) => {
        const newProj = clone(projectRef.current);
        const idx = newProj.collections.findIndex(c => c.id === colId);
        if (idx !== -1) {
          newProj.collections[idx] = normalizeCollection({ ...newProj.collections[idx], ...updates });
          saveToHistory(newProj, 'instant');
        }
      },
      deleteCollection: (colId) => {
        if ((projectRef.current.collections || []).length <= 1) return;
        const newProj = clone(projectRef.current);
        newProj.collections = newProj.collections.filter(c => c.id !== colId);
        saveToHistory(newProj, 'instant');
      },
      addCollectionField: (colId, fieldDef) => {
        const newProj = clone(projectRef.current);
        const col = newProj.collections.find(c => c.id === colId);
        if (!col) return;
        const cleanKey = (fieldDef.key || fieldDef.name || 'field').toLowerCase().replace(/[^a-z0-9_]/g, '') || ('field_' + col.fields.length);
        if (col.fields.some(f => f.key === cleanKey)) return;
        col.fields.push({
          id: 'f_' + Math.random().toString(36).substr(2, 6),
          key: cleanKey,
          name: fieldDef.name || cleanKey,
          type: fieldDef.type || 'text',
          required: Boolean(fieldDef.required),
          options: fieldDef.options || [],
          refCollectionId: fieldDef.refCollectionId || ''
        });
        saveToHistory(newProj, 'instant');
      },
      deleteCollectionField: (colId, fieldKey) => {
        if (['title', 'summary'].includes(fieldKey)) return;
        const newProj = clone(projectRef.current);
        const col = newProj.collections.find(c => c.id === colId);
        if (!col) return;
        col.fields = col.fields.filter(f => f.key !== fieldKey);
        saveToHistory(newProj, 'instant');
      },
      addCmsItem: (colId, item) => {
        const newProj = clone(projectRef.current);
        const col = newProj.collections.find(c => c.id === colId);
        if (col) {
          let baseSlug = toSlug(item.slug || item.title || 'entry');
          if (col.items.some(i => i.slug === baseSlug)) {
            baseSlug = `${baseSlug}-${col.items.length + 1}`;
          }
          const now = new Date().toISOString();
          col.items.push({
            id: generateId(),
            status: item.status || 'published',
            createdAt: now,
            updatedAt: now,
            ...item,
            slug: baseSlug
          });
          saveToHistory(newProj, 'instant');
        }
      },
      updateCmsItem: (colId, itemId, updates) => {
        const newProj = clone(projectRef.current);
        const col = newProj.collections.find(c => c.id === colId);
        if (!col) return;
        const idx = col.items.findIndex(i => i.id === itemId);
        if (idx !== -1) {
          let nextSlug = updates.slug !== undefined ? toSlug(updates.slug) : col.items[idx].slug;
          if (col.items.some((it, i) => i !== idx && it.slug === nextSlug)) {
            nextSlug = `${nextSlug}-${idx + 1}`;
          }
          col.items[idx] = {
            ...col.items[idx],
            ...updates,
            slug: nextSlug,
            updatedAt: new Date().toISOString()
          };
          saveToHistory(newProj, 'instant');
        }
      },
      duplicateCmsItem: (colId, itemId) => {
        const newProj = clone(projectRef.current);
        const col = newProj.collections.find(c => c.id === colId);
        if (!col) return;
        const source = col.items.find(i => i.id === itemId);
        if (!source) return;
        const now = new Date().toISOString();
        col.items.push({
          ...clone(source),
          id: generateId(),
          title: `${source.title || 'Record'} (Copy)`,
          slug: `${source.slug || 'record'}-copy-${col.items.length + 1}`,
          createdAt: now,
          updatedAt: now
        });
        saveToHistory(newProj, 'instant');
      },
      deleteCmsItem: (colId, itemId) => {
        const newProj = clone(projectRef.current);
        const col = newProj.collections.find(c => c.id === colId);
        if (col) {
          col.items = col.items.filter(i => i.id !== itemId);
          saveToHistory(newProj, 'instant');
        }
      },
      createCmsDetailPage: (colId) => {
        const newProj = clone(projectRef.current);
        const col = newProj.collections.find(c => c.id === colId);
        if (!col) return;
        const existing = newProj.pages.find(p => p.isCmsTemplate && p.cmsCollectionId === colId);
        if (existing) {
          setActivePageId(existing.id);
          setActiveModal(null);
          return;
        }
        const newPageId = 'page_tpl_' + col.slug;
        const newPage = {
          id: newPageId,
          name: `${col.name} Detail Template`,
          slug: `${col.slug}-detail`,
          seoTitle: `{{title}} — ${newProj.name}`,
          seoDesc: `{{summary}}`,
          isCmsTemplate: true,
          cmsCollectionId: col.id,
          rootNode: {
            id: generateId(),
            type: ELEMENT_TYPES.PAGE,
            name: 'Body',
            styles: { base: { minHeight: '100vh', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column' } },
            props: {},
            children: createCmsDetailTemplateNodes(col)
          }
        };
        newProj.pages.push(newPage);
        saveToHistory(newProj, 'instant');
        if (col.items[0]) {
          setPreviewRecordByPage(prev => ({ ...prev, [newPageId]: col.items[0].id }));
        }
        setActivePageId(newPageId);
        setSelectedId(null);
        setActiveModal(null);
      },
      addProduct: (prod) => {
        const newProj = clone(projectRef.current);
        const normalized = normalizeProduct({ id: generateId(), ...prod, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, newProj.products.length);
        if (newProj.products.some(p => p.slug === normalized.slug)) {
          normalized.slug = `${normalized.slug}-${newProj.products.length + 1}`;
        }
        newProj.products.push(normalized);
        saveToHistory(newProj, 'instant');
        return normalized.id;
      },
      updateProduct: (prodId, updates) => {
        const newProj = clone(projectRef.current);
        const idx = newProj.products.findIndex(p => p.id === prodId);
        if (idx !== -1) {
          const merged = normalizeProduct({ ...newProj.products[idx], ...updates, updatedAt: new Date().toISOString() }, idx);
          if (newProj.products.some((p, i) => i !== idx && p.slug === merged.slug)) {
            merged.slug = `${merged.slug}-${idx + 1}`;
          }
          newProj.products[idx] = merged;
          saveToHistory(newProj, 'instant');
        }
      },
      duplicateProduct: (prodId) => {
        const newProj = clone(projectRef.current);
        const source = newProj.products.find(p => p.id === prodId);
        if (!source) return;
        const copy = normalizeProduct({
          ...clone(source),
          id: generateId(),
          name: `${source.name} (Copy)`,
          slug: `${source.slug}-copy-${newProj.products.length + 1}`,
          variants: (source.variants || []).map(v => ({ ...v, id: 'var_' + Math.random().toString(36).substr(2, 7) })),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }, newProj.products.length);
        newProj.products.push(copy);
        saveToHistory(newProj, 'instant');
      },
      deleteProduct: (prodId) => {
        const newProj = clone(projectRef.current);
        newProj.products = newProj.products.filter(p => p.id !== prodId);
        saveToHistory(newProj, 'instant');
      },
      bulkUpdateProducts: (ids = [], action = 'publish') => {
        const newProj = clone(projectRef.current);
        const idSet = new Set(ids);
        if (action === 'delete') {
          newProj.products = newProj.products.filter(p => !idSet.has(p.id));
        } else {
          newProj.products = newProj.products.map(p =>
            idSet.has(p.id) ? { ...p, status: action === 'publish' ? 'published' : 'draft', updatedAt: new Date().toISOString() } : p
          );
        }
        saveToHistory(newProj, 'instant');
      },
      loadDemoProducts: () => {
        const newProj = clone(projectRef.current);
        newProj.products = clone(DEFAULT_PRODUCTS).map(normalizeProduct);
        saveToHistory(newProj, 'instant');
      },
      createProductDetailPage: () => {
        const newProj = clone(projectRef.current);
        const existing = newProj.pages.find(p => p.isProductTemplate);
        if (existing) {
          setActivePageId(existing.id);
          setActiveModal(null);
          return;
        }
        const newPageId = 'page_product_detail';
        const newPage = {
          id: newPageId,
          name: 'Product Detail Template',
          slug: 'product-detail',
          seoTitle: `{{name}} — ${newProj.name}`,
          seoDesc: `{{shortDescription}}`,
          isProductTemplate: true,
          rootNode: {
            id: generateId(),
            type: ELEMENT_TYPES.PAGE,
            name: 'Body',
            styles: { base: { minHeight: '100vh', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column' } },
            props: {},
            children: createProductDetailTemplateNodes()
          }
        };
        newProj.pages.push(newPage);
        saveToHistory(newProj, 'instant');
        if (newProj.products[0]) {
          setPreviewProductByPage(prev => ({ ...prev, [newPageId]: newProj.products[0].id }));
        }
        setActivePageId(newPageId);
        setSelectedId(null);
        setActiveModal(null);
      },
      addToCart: (product, variant = null, qty = 1) => {
        if (!product || product.status === 'draft') return { ok: false, error: 'Product is unavailable.' };
        const chosenVariant = variant || (product.variants && product.variants.length > 0 ? product.variants[0] : null);
        const maxStock = product.trackInventory
          ? (chosenVariant ? chosenVariant.stock : product.stock)
          : 999;
        if (product.trackInventory && maxStock <= 0) {
          return { ok: false, error: 'Out of stock.' };
        }
        const cartItemId = chosenVariant ? `${product.id}__${chosenVariant.id}` : `${product.id}__base`;
        const unitPrice = chosenVariant ? Number(chosenVariant.price) : Number(product.price);

        setDemoCart(prev => {
          const existingIdx = prev.findIndex(item => item.cartItemId === cartItemId);
          if (existingIdx !== -1) {
            const nextQty = Math.min(maxStock, prev[existingIdx].quantity + qty);
            return prev.map((it, i) => i === existingIdx ? { ...it, quantity: nextQty, unitPrice } : it);
          }
          return [
            ...prev,
            {
              cartItemId,
              productId: product.id,
              variantId: chosenVariant ? chosenVariant.id : null,
              name: product.name,
              variantTitle: chosenVariant ? chosenVariant.title : null,
              sku: chosenVariant ? chosenVariant.sku : product.sku,
              image: product.image,
              unitPrice,
              quantity: Math.min(maxStock, Math.max(1, qty))
            }
          ];
        });
        return { ok: true };
      },
      updateCartQuantity: (cartItemId, nextQty) => {
        if (nextQty <= 0) {
          setDemoCart(prev => prev.filter(it => it.cartItemId !== cartItemId));
          return;
        }
        const prods = projectRef.current.products || [];
        setDemoCart(prev => prev.map(it => {
          if (it.cartItemId !== cartItemId) return it;
          const prod = prods.find(p => p.id === it.productId);
          const variant = prod?.variants?.find(v => v.id === it.variantId);
          const maxStock = prod?.trackInventory ? (variant ? variant.stock : prod.stock) : 999;
          return { ...it, quantity: Math.min(maxStock, Math.max(1, nextQty)) };
        }));
      },
      removeFromCart: (cartItemId) => {
        setDemoCart(prev => prev.filter(it => it.cartItemId !== cartItemId));
      },
      createDemoOrder: (customerData, summaryTotals) => {
        const newProj = clone(projectRef.current);
        newProj.orders = Array.isArray(newProj.orders) ? newProj.orders : [];
        const orderNumber = `ORD-${1001 + newProj.orders.length}`;
        const verifiedItems = [];

        for (const item of demoCart) {
          const prod = newProj.products.find(p => p.id === item.productId);
          if (!prod || prod.status !== 'published') continue;
          const variant = prod.variants?.find(v => v.id === item.variantId);
          const available = prod.trackInventory ? (variant ? variant.stock : prod.stock) : 999;
          const finalQty = Math.min(available, item.quantity);
          if (finalQty <= 0) continue;

          if (prod.trackInventory) {
            if (variant) variant.stock = Math.max(0, variant.stock - finalQty);
            prod.stock = Math.max(0, prod.stock - finalQty);
          }
          verifiedItems.push({
            ...item,
            quantity: finalQty,
            unitPrice: variant ? Number(variant.price) : Number(prod.price)
          });
        }

        const newOrder = {
          id: 'ord_' + Math.random().toString(36).substr(2, 8),
          orderNumber,
          createdAt: new Date().toISOString(),
          isDemoOrder: true,
          paymentStatus: 'demo_unverified',
          fulfilmentStatus: 'unfulfilled',
          trackingNumber: '',
          internalNotes: 'Created in local demonstration checkout. No live payment gateway verified.',
          currency: newProj.commerceSettings?.currency || 'USD',
          customer: customerData,
          items: verifiedItems,
          totals: summaryTotals
        };
        newProj.orders.unshift(newOrder);
        saveToHistory(newProj, 'instant');
        setDemoCart([]);
        return newOrder;
      },
      updateOrderStatus: (orderId, updates) => {
        const newProj = clone(projectRef.current);
        const idx = (newProj.orders || []).findIndex(o => o.id === orderId);
        if (idx === -1) return;
        const prevOrder = newProj.orders[idx];

        if (updates.fulfilmentStatus === 'cancelled' && prevOrder.fulfilmentStatus !== 'cancelled') {
          (prevOrder.items || []).forEach(it => {
            const prod = newProj.products.find(p => p.id === it.productId);
            if (prod && prod.trackInventory) {
              const variant = prod.variants?.find(v => v.id === it.variantId);
              if (variant) variant.stock += it.quantity;
              prod.stock += it.quantity;
            }
          });
        }
        newProj.orders[idx] = { ...prevOrder, ...updates };
        saveToHistory(newProj, 'instant');
      },
      updateCommerceSettings: (updates) => {
        const newProj = clone(projectRef.current);
        newProj.commerceSettings = { ...(newProj.commerceSettings || DEFAULT_COMMERCE_SETTINGS), ...updates };
        saveToHistory(newProj, 'instant');
      },
      updateSiteSettings: (updates) => {
        const newProj = clone(projectRef.current);
        newProj.siteSettings = { ...(newProj.siteSettings || DEFAULT_SITE_SETTINGS), ...updates };
        if (updates.siteName) newProj.name = updates.siteName;
        saveToHistory(newProj, 'instant');
      },
      updatePublishingConfig: (updates) => {
        const newProj = clone(projectRef.current);
        newProj.publishing = { ...(newProj.publishing || DEFAULT_PUBLISHING_STATE), ...updates };
        setProject(newProj);
      },
      addCustomDomain: (domainName) => {
        const clean = (domainName || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
        if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i.test(clean)) {
          return { ok: false, error: 'Invalid domain format. Example: www.yourdomain.com' };
        }
        const newProj = clone(projectRef.current);
        const domains = newProj.publishing?.customDomains || [];
        if (domains.some(d => d.domain === clean)) {
          return { ok: false, error: 'Domain is already added to this project.' };
        }
        const isRoot = clean.split('.').length === 2;
        domains.push({
          id: 'dom_' + Math.random().toString(36).substr(2, 7),
          domain: clean,
          isPrimary: domains.length === 0,
          verificationStatus: 'pending_external_dns',
          sslStatus: 'awaiting_provider_verification',
          requiredDnsRecord: isRoot
            ? { type: 'A', host: '@', value: '75.2.60.5 (Provider Load Balancer)' }
            : { type: 'CNAME', host: clean.split('.')[0], value: `${toSlug(newProj.name)}.hosting-provider.app` },
          addedAt: new Date().toISOString()
        });
        newProj.publishing = { ...(newProj.publishing || DEFAULT_PUBLISHING_STATE), customDomains: domains };
        saveToHistory(newProj, 'instant');
        return { ok: true };
      },
      removeCustomDomain: (domainId) => {
        const newProj = clone(projectRef.current);
        const domains = (newProj.publishing?.customDomains || []).filter(d => d.id !== domainId);
        if (domains.length > 0 && !domains.some(d => d.isPrimary)) domains[0].isPrimary = true;
        newProj.publishing = { ...(newProj.publishing || DEFAULT_PUBLISHING_STATE), customDomains: domains };
        saveToHistory(newProj, 'instant');
      },
      setPrimaryDomain: (domainId) => {
        const newProj = clone(projectRef.current);
        const domains = (newProj.publishing?.customDomains || []).map(d => ({ ...d, isPrimary: d.id === domainId }));
        newProj.publishing = { ...(newProj.publishing || DEFAULT_PUBLISHING_STATE), customDomains: domains };
        saveToHistory(newProj, 'instant');
      },
      recordDeploymentAttempt: (entry) => {
        const newProj = clone(projectRef.current);
        const pub = newProj.publishing || clone(DEFAULT_PUBLISHING_STATE);
        pub.deploymentHistory = [entry, ...(pub.deploymentHistory || [])].slice(0, 25);
        pub.status = entry.status;
        if (entry.status === 'published' && entry.url) {
          if (entry.environment === 'production') pub.publishedUrl = entry.url;
          else pub.previewUrl = entry.url;
          pub.lastPublishedAt = entry.timestamp;
        }
        newProj.publishing = pub;
        setProject(newProj);
      }
    }
  };
}

const generateExport = async (project) => {
  const toKebab = (str) => str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  const siteSettings = project.siteSettings || DEFAULT_SITE_SETTINGS;
  const baseUrl = (siteSettings.canonicalBaseUrl || 'https://example.com').replace(/\/+$/, '');
  const currencyCode = project.commerceSettings?.currency || 'USD';

  let globalCss = `/* NEXUS STUDIO GENERATED PRODUCTION CSS */\n* { box-sizing: border-box; margin: 0; padding: 0; }\nbody { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; -webkit-font-smoothing: antialiased; color: #0f172a; }\nimg { max-width: 100%; height: auto; display: block; }\na { text-decoration: none; color: inherit; }\n.nexus-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; width: 100%; }\n.nexus-list-vertical { display: flex; flex-direction: column; gap: 1rem; width: 100%; }\n.nexus-card { border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1.5rem; background: #fff; display: flex; flex-direction: column; gap: 0.75rem; }\n@media (max-width: 768px) { .nexus-grid-3 { grid-template-columns: 1fr; } }\n`;
  let htmlPages = {};
  let sitemapUrls = [];
  let processedNodes = new Set();

  const wrapHtmlDocument = (filename, title, desc, bodyContent) => {
    const canonicalUrl = `${baseUrl}/${filename === 'index.html' ? '' : filename}`;
    sitemapUrls.push(canonicalUrl);
    const robotsMeta = siteSettings.allowIndexing !== false ? 'index, follow' : 'noindex, nofollow';
    const ogImgTag = siteSettings.ogImageUrl ? `\n  <meta property="og:image" content="${escapeHtml(siteSettings.ogImageUrl)}">` : '';
    const faviconTag = siteSettings.faviconUrl ? `\n  <link rel="icon" href="${escapeHtml(siteSettings.faviconUrl)}">` : '';
    return `<!DOCTYPE html>\n<html lang="${escapeHtml(siteSettings.language || 'en')}">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>${escapeHtml(title)}</title>\n  <meta name="description" content="${escapeHtml(desc)}">\n  <meta name="robots" content="${robotsMeta}">\n  <link rel="canonical" href="${escapeHtml(canonicalUrl)}">\n  <meta property="og:title" content="${escapeHtml(title)}">\n  <meta property="og:description" content="${escapeHtml(desc)}">\n  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">${ogImgTag}${faviconTag}\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  ${bodyContent}\n</body>\n</html>`;
  };

  const buildNodeForPage = (node, page, contextRecordId = null, contextProductId = null) => {
    if (!node) return '';
    const nodeIdClass = `el-${node.id}`;
    let nodeHtml = '';

    if (node.styles && !processedNodes.has(node.id)) {
      processedNodes.add(node.id);
      if (node.styles.base && Object.keys(node.styles.base).length > 0) {
        globalCss += `.${nodeIdClass} { `;
        for (const [key, value] of Object.entries(node.styles.base)) { if (value) globalCss += `${toKebab(key)}: ${value}; `; }
        globalCss += `}\n`;
      }
      if (node.styles.tablet && Object.keys(node.styles.tablet).length > 0) {
        globalCss += `@media (max-width: 991px) { .${nodeIdClass} { `;
        for (const [key, value] of Object.entries(node.styles.tablet)) { if (value) globalCss += `${toKebab(key)}: ${value}; `; }
        globalCss += `} }\n`;
      }
      if (node.styles.mobile && Object.keys(node.styles.mobile).length > 0) {
        globalCss += `@media (max-width: 479px) { .${nodeIdClass} { `;
        for (const [key, value] of Object.entries(node.styles.mobile)) { if (value) globalCss += `${toKebab(key)}: ${value}; `; }
        globalCss += `} }\n`;
      }
    }

    const props = node.props || {};
    const boundVal = resolveCmsBindingValue(node, project, page, contextRecordId);
    const rawContent = boundVal !== null && node.type !== ELEMENT_TYPES.IMAGE ? boundVal : (props.content || '');
    const content = escapeHtml(rawContent);
    const childrenHtml = node.children ? node.children.map(c => buildNodeForPage(c, page, contextRecordId, contextProductId)).join('\n') : '';
    let href = (boundVal !== null && props.cmsBinding?.targetProp === 'href') ? boundVal : (props.href || '#');
    if (href.startsWith('page:')) {
      const targetPage = project.pages.find(p => p.id === href.split(':')[1]);
      if (targetPage) href = `${targetPage.slug}.html`;
    }

    const prodDetailPage = project.pages.find(p => p.isProductTemplate);

    switch (node.type) {
      case ELEMENT_TYPES.PAGE: nodeHtml = `<div class="${nodeIdClass}">${childrenHtml}</div>`; break;
      case ELEMENT_TYPES.SECTION: nodeHtml = `<section class="${nodeIdClass}">${childrenHtml}</section>`; break;
      case ELEMENT_TYPES.NAV: nodeHtml = `<nav class="${nodeIdClass}">${childrenHtml}</nav>`; break;
      case ELEMENT_TYPES.CONTAINER:
      case ELEMENT_TYPES.GRID: nodeHtml = `<div class="${nodeIdClass}">${childrenHtml}</div>`; break;
      case ELEMENT_TYPES.TEXT:
        const Tag = ['h1', 'h2', 'h3', 'h4', 'p', 'span'].includes(props.tag) ? props.tag : 'p';
        nodeHtml = `<${Tag} class="${nodeIdClass}">${content}</${Tag}>`; break;
      case ELEMENT_TYPES.BUTTON:
        nodeHtml = `<a href="${escapeHtml(href)}" class="${nodeIdClass}">${content}</a>`; break;
      case ELEMENT_TYPES.IMAGE:
        const imgSrc = boundVal !== null ? boundVal : (props.src || '');
        nodeHtml = `<img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(props.alt || 'Website image')}" class="${nodeIdClass}" />`; break;
      case ELEMENT_TYPES.FORM:
        nodeHtml = `<form class="${nodeIdClass}" onsubmit="event.preventDefault(); alert('Static Export Notice: Connect a form backend endpoint to receive submissions.');"><label style="font-size:12px;font-weight:600;">Name</label><input type="text" required placeholder="Your Name" style="padding:10px;border:1px solid #cbd5e1;border-radius:6px;"/><label style="font-size:12px;font-weight:600;">Email</label><input type="email" required placeholder="you@example.com" style="padding:10px;border:1px solid #cbd5e1;border-radius:6px;"/><button type="submit" style="padding:12px;background:#2563eb;color:#fff;border:none;border-radius:6px;font-weight:600;cursor:pointer;">${escapeHtml(props.submitLabel || 'Send Message')}</button></form>`; break;
      case ELEMENT_TYPES.PRODUCT_GRID:
        const pubProducts = queryProducts(project.products || [], props, true);
        const prodCards = pubProducts.map(p => {
          const detailHref = prodDetailPage ? `product-${p.slug}.html` : '#';
          return `<div class="nexus-card"><img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" style="height:180px;width:100%;object-fit:cover;border-radius:6px;"/><span style="font-size:11px;font-weight:700;color:#2563eb;text-transform:uppercase;">${escapeHtml(p.category)}</span><h4><a href="${escapeHtml(detailHref)}">${escapeHtml(p.name)}</a></h4><p style="color:#64748b;font-size:14px;">${escapeHtml(p.shortDescription)}</p><div style="display:flex;justify-content:space-between;align-items:center;margin-top:auto;"><strong style="font-size:18px;">${escapeHtml(formatMoney(p.price, currencyCode))}</strong><a href="${escapeHtml(detailHref)}" style="padding:8px 14px;background:#0f172a;color:#fff;border-radius:6px;font-size:12px;font-weight:600;">View Product</a></div></div>`;
        }).join('\n');
        nodeHtml = `<div class="${nodeIdClass} nexus-grid-3">${prodCards}</div>`; break;
      case ELEMENT_TYPES.PRODUCT_DETAIL:
        const pubList = queryProducts(project.products || [], {}, true);
        const targetProd = pubList.find(p => p.id === (contextProductId || props.productId)) || pubList[0];
        if (!targetProd) {
          nodeHtml = `<div class="nexus-card"><p>Product unavailable.</p></div>`;
        } else {
          nodeHtml = `<div class="${nodeIdClass} nexus-card" style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;"><img src="${escapeHtml(targetProd.image)}" alt="${escapeHtml(targetProd.name)}" style="width:100%;height:340px;object-fit:cover;border-radius:0.75rem;"/><div><span style="font-size:12px;color:#2563eb;font-weight:700;text-transform:uppercase;">${escapeHtml(targetProd.category)} • SKU: ${escapeHtml(targetProd.sku)}</span><h1 style="font-size:2rem;margin:0.5rem 0;">${escapeHtml(targetProd.name)}</h1><p style="font-size:1.5rem;font-weight:800;color:#0f172a;margin-bottom:1rem;">${escapeHtml(formatMoney(targetProd.price, currencyCode))}</p><p style="color:#475569;line-height:1.6;margin-bottom:1.5rem;">${escapeHtml(targetProd.description)}</p></div></div>`;
        }
        break;
      case ELEMENT_TYPES.CART_BLOCK:
        nodeHtml = `<div class="${nodeIdClass} nexus-card"><h3>Shopping Cart</h3><p style="color:#64748b;font-size:14px;">Static export preview. Live checkout requires a connected payment backend (Paystack/Stripe).</p></div>`;
        break;
      case ELEMENT_TYPES.CMS_LIST:
        const col = (project.collections || []).find(c => c.id === props.collectionId) || (project.collections || [])[0];
        const records = queryCollectionRecords(col, props, true);
        const detailTemplatePage = project.pages.find(p => p.isCmsTemplate && p.cmsCollectionId === col?.id);
        const layoutClass = props.layout === 'list' ? 'nexus-list-vertical' : 'nexus-grid-3';
        const cmsCards = records.map(item => {
          const itemUrl = detailTemplatePage ? `${col.slug}-${item.slug}.html` : '#';
          const showImg = props.showImage !== false && item.image;
          const imgHtml = showImg ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" style="height:180px;width:100%;object-fit:cover;border-radius:6px;"/>` : '';
          const linkBtn = detailTemplatePage ? `<a href="${escapeHtml(itemUrl)}" style="font-size:12px;font-weight:700;color:#2563eb;margin-top:4px;">Read More →</a>` : '';
          return `<article class="nexus-card">${imgHtml}<span style="font-size:11px;text-transform:uppercase;color:#2563eb;font-weight:700;">${escapeHtml(item.category || col?.name || '')}</span><h3>${escapeHtml(item.title)}</h3><p style="color:#475569;font-size:14px;">${escapeHtml(item.summary)}</p><span style="font-size:12px;color:#94a3b8;">${escapeHtml(item.date || '')}</span>${linkBtn}</article>`;
        }).join('\n');
        nodeHtml = `<div class="${nodeIdClass} ${layoutClass}">${cmsCards}</div>`; break;
      default: nodeHtml = `<div class="${nodeIdClass}">${childrenHtml}</div>`;
    }
    return nodeHtml;
  };

  project.pages.forEach(page => {
    if (page.isCmsTemplate && page.cmsCollectionId) {
      const col = (project.collections || []).find(c => c.id === page.cmsCollectionId);
      const publishedItems = (col?.items || []).filter(it => it.status !== 'draft');
      publishedItems.forEach(record => {
        const pageContent = buildNodeForPage(page.rootNode, page, record.id, null);
        const rawTitle = (page.seoTitle || `${record.title} — ${project.name}`).replace(/\{\{title\}\}/g, record.title || '').replace(/\{\{summary\}\}/g, record.summary || '');
        const rawDesc = (page.seoDesc || record.summary || siteSettings.defaultSeoDesc || '').replace(/\{\{title\}\}/g, record.title || '').replace(/\{\{summary\}\}/g, record.summary || '');
        const filename = `${col.slug}-${record.slug}.html`;
        htmlPages[filename] = wrapHtmlDocument(filename, rawTitle, rawDesc, pageContent);
      });
    } else if (page.isProductTemplate) {
      const publishedProducts = (project.products || []).filter(p => p.status === 'published');
      publishedProducts.forEach(prod => {
        const pageContent = buildNodeForPage(page.rootNode, page, null, prod.id);
        const rawTitle = (page.seoTitle || `${prod.name} — ${project.name}`).replace(/\{\{name\}\}/g, prod.name || '');
        const rawDesc = (page.seoDesc || prod.shortDescription || siteSettings.defaultSeoDesc || '').replace(/\{\{shortDescription\}\}/g, prod.shortDescription || '');
        const filename = `product-${prod.slug}.html`;
        htmlPages[filename] = wrapHtmlDocument(filename, rawTitle, rawDesc, pageContent);
      });
    } else {
      const pageContent = buildNodeForPage(page.rootNode, page, null, null);
      const title = page.seoTitle || siteSettings.defaultSeoTitle || `${project.name} - ${page.name}`;
      const desc = page.seoDesc || siteSettings.defaultSeoDesc || `Created with NEXUS STUDIO`;
      const filename = `${page.slug}.html`;
      htmlPages[filename] = wrapHtmlDocument(filename, title, desc, pageContent);
    }
  });

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.map(u => `  <url>\n    <loc>${escapeHtml(u)}</loc>\n    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>\n  </url>`).join('\n')}\n</urlset>`;

  const robotsTxt = `User-agent: *\n${siteSettings.allowIndexing !== false ? 'Allow: /' : 'Disallow: /'}\nSitemap: ${baseUrl}/sitemap.xml\n`;

  const buildManifest = {
    projectName: project.name,
    generatedAt: new Date().toISOString(),
    baseUrl,
    files: [
      { name: 'styles.css', bytes: globalCss.length },
      ...Object.entries(htmlPages).map(([k, v]) => ({ name: k, bytes: v.length })),
      ...(siteSettings.sitemapEnabled !== false ? [{ name: 'sitemap.xml', bytes: sitemapXml.length }] : []),
      ...(siteSettings.robotsTxtEnabled !== false ? [{ name: 'robots.txt', bytes: robotsTxt.length }] : [])
    ]
  };

  const readme = `# ${project.name} — Production Static Build\n\nGenerated by **NEXUS STUDIO (Phase 9 Publishing & E-Commerce Engine)**.\n\n## Build Manifest\n- \`styles.css\`: Consolidated responsive stylesheet.\n${Object.keys(htmlPages).map(f => `- \`${f}\``).join('\n')}\n- \`sitemap.xml\` & \`robots.txt\`: Search engine indexing configuration.\n\n## Security & Architecture Notes\n- Draft CMS records, unpublished products, and private customer orders are strictly excluded from public static output.\n- Live checkout payments (Paystack / Stripe) and form submissions require server-side API endpoints and webhook verification.`;

  return { css: globalCss, htmlPages, sitemapXml, robotsTxt, readme, buildManifest };
};

const CanvasNodeRenderer = ({ node, builder }) => {
  const { selectedId, setSelectedId, selectedIds, setSelectedIds, hoveredId, setHoveredId, deviceMode, isPreviewMode, snapEnabled, setSmartGuides, actions, project, activePage, setActivePageId, demoCart, setIsCartOpen, previewRecordByPage, setPreviewRecordByPage, previewProductByPage, setPreviewProductByPage } = builder;
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [liveMeasure, setLiveMeasure] = useState(null);
  const [dropIndicator, setDropIndicator] = useState(null); // 'before' | 'inside' | 'after' | null
  const [formSent, setFormSent] = useState(false);
  const [storeSearch, setStoreSearch] = useState('');
  const [storeCategory, setStoreCategory] = useState('all');
  const [storeSort, setStoreSort] = useState('newest');
  const [selectedVariantsByProd, setSelectedVariantsByProd] = useState({});
  const [detailQty, setDetailQty] = useState(1);
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);
  const [cartFeedback, setCartFeedback] = useState('');
  const nodeRef = useRef(null);
  const isCancelling = useRef(false);

  const isLocked = Boolean(node.props?.editorLocked);
  const isEditorHidden = Boolean(node.props?.editorHidden);
  const isSelected = (selectedId === node.id || (selectedIds || []).includes(node.id)) && !isPreviewMode;
  const isPrimarySelected = selectedId === node.id && !isPreviewMode;
  const isHovered = hoveredId === node.id && !isSelected && !isPreviewMode;
  const computedStyle = actions.getComputedStyles(node, deviceMode);

  const layoutKeys = ['position', 'top', 'bottom', 'left', 'right', 'zIndex', 'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'width', 'height', 'maxWidth', 'minHeight', 'maxHeight', 'minWidth', 'flex', 'flexGrow', 'flexShrink', 'flexBasis', 'alignSelf', 'justifySelf', 'order', 'gridColumn', 'gridRow', 'transform'];

  let wrapperStyle = { ...computedStyle };
  let innerStyle = { ...computedStyle };

  layoutKeys.forEach(key => { delete innerStyle[key]; });
  Object.keys(wrapperStyle).forEach(key => {
    if (!layoutKeys.includes(key) && key !== 'display') delete wrapperStyle[key];
  });

  if (computedStyle.display === 'flex' || computedStyle.display === 'grid') {
    innerStyle.display = computedStyle.display;
    wrapperStyle.display = 'block';
  } else if (computedStyle.display === 'inline-block') {
    wrapperStyle.display = 'inline-block';
    innerStyle.display = 'block';
  } else {
    wrapperStyle.display = computedStyle.display || 'block';
  }

  if (wrapperStyle.width || wrapperStyle.height || wrapperStyle.flex || wrapperStyle.flexGrow || wrapperStyle.position === 'absolute') {
    innerStyle.width = '100%'; innerStyle.height = '100%';
  }

  if (isEditing) {
    innerStyle.outline = 'none'; innerStyle.cursor = 'text';
  }

  if (isDragging) {
    wrapperStyle.transition = 'none'; wrapperStyle.userSelect = 'none';
  }

  useEffect(() => {
    if (isEditing && nodeRef.current) {
      nodeRef.current.focus();
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(nodeRef.current);
      range.collapse(false);
      sel.removeAllRanges(); sel.addRange(range);
    }
  }, [isEditing]);

  if (!isPreviewMode && isEditorHidden) {
    return null;
  }

  const handleSelect = (e) => {
    if (isPreviewMode) return;
    e.stopPropagation();
    if (isLocked) return;
    if (e.shiftKey) {
      setSelectedIds(prev => {
        const base = prev.length > 0 ? prev : (selectedId ? [selectedId] : []);
        return base.includes(node.id) ? base.filter(id => id !== node.id) : [...base, node.id];
      });
      setSelectedId(node.id);
    } else {
      setSelectedId(node.id);
      setSelectedIds([node.id]);
    }
    if (isEditing && selectedId !== node.id) setIsEditing(false);
  };

  const handleDoubleClick = (e) => {
    if (isPreviewMode || isLocked) return;
    if (node.type === ELEMENT_TYPES.TEXT || node.type === ELEMENT_TYPES.BUTTON) {
      e.stopPropagation();
      actions.saveToHistory(null, 'start');
      setIsEditing(true);
      isCancelling.current = false;
    }
  };

  const handleHover = (e, state) => {
    if (isPreviewMode) return;
    e.stopPropagation();
    setHoveredId(state ? node.id : null);
  };

  const handleCanvasDragStart = (e) => {
    if (isPreviewMode || isLocked || node.type === ELEMENT_TYPES.PAGE) {
      e.preventDefault();
      return;
    }
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', node.id);
  };

  const handleCanvasDragOver = (e) => {
    if (isPreviewMode || node.type === ELEMENT_TYPES.PAGE) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const relY = e.clientY - rect.top;
    const isContainer = [ELEMENT_TYPES.SECTION, ELEMENT_TYPES.CONTAINER, ELEMENT_TYPES.GRID, ELEMENT_TYPES.NAV].includes(node.type);
    if (isContainer && relY > rect.height * 0.25 && relY < rect.height * 0.75) {
      setDropIndicator('inside');
    } else if (relY < rect.height / 2) {
      setDropIndicator('before');
    } else {
      setDropIndicator('after');
    }
  };

  const handleCanvasDrop = (e) => {
    if (isPreviewMode) return;
    e.preventDefault();
    e.stopPropagation();
    const pos = dropIndicator || 'after';
    setDropIndicator(null);
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId && draggedId !== node.id) {
      actions.moveElementPosition(draggedId, node.id, pos);
    }
  };

  const handleResizeStart = (e, dir) => {
    e.stopPropagation();
    if (isPreviewMode || isLocked) return;

    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    actions.saveToHistory(null, 'start');
    setIsDragging(true);

    const startX = e.clientX; const startY = e.clientY;
    const wrapper = nodeRef.current?.closest('.nexus-wrapper');
    const parentEl = wrapper?.parentElement;
    const parentWidth = parentEl ? parentEl.clientWidth : 1200;
    const startWidth = wrapper ? wrapper.offsetWidth : 100;
    const startHeight = wrapper ? wrapper.offsetHeight : 100;
    const aspect = startWidth / Math.max(1, startHeight);
    const lockRatio = Boolean(node.props?.aspectRatioLocked);

    const onPointerMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      const updates = {};
      let nextW = startWidth;
      let nextH = startHeight;

      if (dir.includes('e')) nextW = Math.max(20, startWidth + deltaX);
      if (dir.includes('w')) nextW = Math.max(20, startWidth - deltaX);
      if (dir.includes('s')) nextH = Math.max(20, startHeight + deltaY);
      if (dir.includes('n')) nextH = Math.max(20, startHeight - deltaY);

      if (snapEnabled) {
        const guides = [];
        if (Math.abs(nextW - parentWidth) < 8) { nextW = parentWidth; guides.push({ type: 'v', label: '100% Parent Width' }); }
        if (Math.abs(nextW - Math.round(parentWidth / 2)) < 6) { nextW = Math.round(parentWidth / 2); guides.push({ type: 'v', label: '50% Parent Center' }); }
        setSmartGuides(guides);
      }

      if (moveEvent.shiftKey || lockRatio) {
        if (dir.includes('e') || dir.includes('w')) nextH = Math.round(nextW / aspect);
        else nextW = Math.round(nextH * aspect);
      }

      if (dir.includes('e') || dir.includes('w') || moveEvent.shiftKey || lockRatio) updates.width = `${Math.round(nextW)}px`;
      if (dir.includes('s') || dir.includes('n') || moveEvent.shiftKey || lockRatio) updates.height = `${Math.round(nextH)}px`;

      setLiveMeasure(`${Math.round(nextW)} × ${Math.round(nextH)} px`);
      const targetMode = deviceMode === 'desktop' ? 'base' : deviceMode;
      actions.updateNode(node.id, { styles: { [targetMode]: updates } }, 'update');
    };

    const onKeyDownCancel = (keyEv) => {
      if (keyEv.key === 'Escape') {
        cleanup();
        setIsDragging(false);
        setLiveMeasure(null);
        setSmartGuides([]);
        actions.saveToHistory(null, 'cancel');
      }
    };

    const cleanup = () => {
      target.removeEventListener('pointermove', onPointerMove);
      target.removeEventListener('pointerup', onPointerUp);
      target.removeEventListener('pointercancel', onPointerCancel);
      window.removeEventListener('keydown', onKeyDownCancel);
    };

    const onPointerUp = (upEvent) => {
      if (target.hasPointerCapture(upEvent.pointerId)) target.releasePointerCapture(upEvent.pointerId);
      cleanup(); setIsDragging(false); setLiveMeasure(null); setSmartGuides([]);
      actions.saveToHistory(null, 'commit');
    };

    const onPointerCancel = (cancelEvent) => {
      if (target.hasPointerCapture(cancelEvent.pointerId)) target.releasePointerCapture(cancelEvent.pointerId);
      cleanup(); setIsDragging(false); setLiveMeasure(null); setSmartGuides([]);
      actions.saveToHistory(null, 'cancel');
    };

    target.addEventListener('pointermove', onPointerMove);
    target.addEventListener('pointerup', onPointerUp);
    target.addEventListener('pointercancel', onPointerCancel);
    window.addEventListener('keydown', onKeyDownCancel);
  };

  const handleMoveStart = (e) => {
    e.stopPropagation();
    if (isPreviewMode || isLocked) return;

    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    actions.saveToHistory(null, 'start');
    setIsDragging(true);

    const startX = e.clientX; const startY = e.clientY;
    const position = computedStyle.position === 'absolute' ? 'absolute' : 'relative';
    const startLeft = parseFloat(computedStyle.left) || 0;
    const startTop = parseFloat(computedStyle.top) || 0;

    const onPointerMove = (moveEvent) => {
      let nextLeft = Math.round(startLeft + (moveEvent.clientX - startX));
      let nextTop = Math.round(startTop + (moveEvent.clientY - startY));

      if (snapEnabled) {
        const guides = [];
        if (Math.abs(nextLeft) < 6) { nextLeft = 0; guides.push({ type: 'v', label: 'Aligned X: 0px' }); }
        if (Math.abs(nextTop) < 6) { nextTop = 0; guides.push({ type: 'h', label: 'Aligned Y: 0px' }); }
        if (nextLeft % 8 === 0 && nextLeft !== 0) guides.push({ type: 'v', label: `8px Grid (${nextLeft}px)` });
        setSmartGuides(guides);
      }

      setLiveMeasure(`X: ${nextLeft}px, Y: ${nextTop}px`);
      const targetMode = deviceMode === 'desktop' ? 'base' : deviceMode;
      actions.updateNode(node.id, { styles: { [targetMode]: { position, left: `${nextLeft}px`, top: `${nextTop}px` } } }, 'update');
    };

    const onKeyDownCancel = (keyEv) => {
      if (keyEv.key === 'Escape') {
        cleanup();
        setIsDragging(false);
        setLiveMeasure(null);
        setSmartGuides([]);
        actions.saveToHistory(null, 'cancel');
      }
    };

    const cleanup = () => {
      target.removeEventListener('pointermove', onPointerMove);
      target.removeEventListener('pointerup', onPointerUp);
      target.removeEventListener('pointercancel', onPointerCancel);
      window.removeEventListener('keydown', onKeyDownCancel);
    };

    const onPointerUp = (upEvent) => {
      if (target.hasPointerCapture(upEvent.pointerId)) target.releasePointerCapture(upEvent.pointerId);
      cleanup(); setIsDragging(false); setLiveMeasure(null); setSmartGuides([]);
      actions.saveToHistory(null, 'commit');
    };

    const onPointerCancel = (cancelEvent) => {
      if (target.hasPointerCapture(cancelEvent.pointerId)) target.releasePointerCapture(cancelEvent.pointerId);
      cleanup(); setIsDragging(false); setLiveMeasure(null); setSmartGuides([]);
      actions.saveToHistory(null, 'cancel');
    };

    target.addEventListener('pointermove', onPointerMove);
    target.addEventListener('pointerup', onPointerUp);
    target.addEventListener('pointercancel', onPointerCancel);
    window.addEventListener('keydown', onKeyDownCancel);
  };

  const renderChildren = () => {
    if (!node.children || node.children.length === 0) return null;
    return node.children.map(child => <CanvasNodeRenderer key={child.id} node={child} builder={builder} />);
  };

  const renderElement = () => {
    const props = node.props || {};
    const activePreviewRecordId = previewRecordByPage?.[activePage?.id] || null;
    const boundValue = resolveCmsBindingValue(node, project, activePage, activePreviewRecordId);
    const hasBinding = Boolean(props.cmsBinding?.collectionId && props.cmsBinding?.fieldKey);
    const displayContent = boundValue !== null && node.type !== ELEMENT_TYPES.IMAGE ? boundValue : props.content;

    const editableProps = {
      contentEditable: isEditing && !hasBinding,
      suppressContentEditableWarning: true,
      onBlur: (e) => {
        if (isEditing) {
          setIsEditing(false);
          if (!isCancelling.current && !hasBinding) {
            actions.updateNode(node.id, { props: { content: e.target.innerText } }, 'update');
            actions.saveToHistory(null, 'commit');
          }
          isCancelling.current = false;
        }
      },
      onKeyDown: (e) => {
        if (!isEditing) return;
        if (e.key === 'Escape') {
          isCancelling.current = true;
          e.target.innerText = props.content;
          setIsEditing(false);
          e.target.blur();
          actions.saveToHistory(null, 'cancel');
        } else if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault(); setIsEditing(false); e.target.blur();
        }
      }
    };

    switch (node.type) {
      case ELEMENT_TYPES.SECTION: return <section ref={nodeRef} style={innerStyle}>{renderChildren()}</section>;
      case ELEMENT_TYPES.NAV: return <nav ref={nodeRef} style={innerStyle}>{renderChildren()}</nav>;
      case ELEMENT_TYPES.CONTAINER:
      case ELEMENT_TYPES.GRID: return <div ref={nodeRef} style={innerStyle}>{renderChildren()}</div>;
      case ELEMENT_TYPES.TEXT:
        const Tag = ['h1', 'h2', 'h3', 'h4', 'p', 'span'].includes(props.tag) ? props.tag : 'p';
        return <Tag ref={nodeRef} style={innerStyle} {...editableProps}>{displayContent}</Tag>;
      case ELEMENT_TYPES.BUTTON:
        return (
          <button
            ref={nodeRef}
            style={innerStyle}
            onClick={(e) => {
              if (isPreviewMode && props.href?.startsWith('page:')) {
                e.preventDefault();
                const targetPageId = props.href.split(':')[1];
                if (project.pages.some(p => p.id === targetPageId)) setActivePageId(targetPageId);
              }
            }}
            className={!isPreviewMode && !isEditing ? "pointer-events-none" : "cursor-pointer"}
            {...editableProps}
          >
            {displayContent}
          </button>
        );
      case ELEMENT_TYPES.IMAGE:
        const imgSrc = boundValue !== null ? boundValue : (props.src || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=');
        return <img ref={nodeRef} src={imgSrc} alt={props.alt || ''} style={{ ...innerStyle, minHeight: imgSrc ? 'auto' : '100px', backgroundColor: imgSrc ? 'transparent' : '#e2e8f0' }} className="max-w-full pointer-events-none" />;
      case ELEMENT_TYPES.FORM:
        return (
          <form
            ref={nodeRef}
            style={innerStyle}
            onSubmit={(e) => { e.preventDefault(); if (isPreviewMode) setFormSent(true); }}
          >
            <div className="text-sm font-bold text-slate-800">{props.formTitle || 'Send us a message'}</div>
            {formSent ? (
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded text-xs font-medium">Thank you! Your demonstration inquiry has been recorded.</div>
            ) : (
              <>
                <input type="text" placeholder="Your Name" disabled={!isPreviewMode} className="w-full p-2 border border-slate-300 rounded text-sm text-slate-800 bg-white" />
                <input type="email" placeholder="Email Address" disabled={!isPreviewMode} className="w-full p-2 border border-slate-300 rounded text-sm text-slate-800 bg-white" />
                <textarea placeholder="How can we help?" disabled={!isPreviewMode} className="w-full p-2 border border-slate-300 rounded text-sm text-slate-800 bg-white h-20" />
                <button type="submit" disabled={!isPreviewMode} className="bg-blue-600 text-white py-2 px-4 rounded font-medium text-sm hover:bg-blue-700 transition-colors">
                  {props.submitLabel || 'Send Message'}
                </button>
              </>
            )}
          </form>
        );
      case ELEMENT_TYPES.PRODUCT_GRID:
        const cols = deviceMode === 'mobile' ? 1 : (deviceMode === 'tablet' ? 2 : (props.columns || 3));
        const currencyCode = project.commerceSettings?.currency || 'USD';
        const allPubProducts = queryProducts(project.products || [], {}, isPreviewMode);
        const categories = ['all', ...Array.from(new Set(allPubProducts.map(p => p.category)))];
        const filteredProducts = queryProducts(project.products || [], {
          ...props,
          category: storeCategory,
          search: storeSearch,
          sortBy: storeSort
        }, isPreviewMode);
        const prodDetailTemplate = project.pages.find(p => p.isProductTemplate);

        return (
          <div ref={nodeRef} style={innerStyle} className="space-y-4">
            {(props.showSearch !== false || props.showCategories !== false) && (
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200" onClick={e => e.stopPropagation()}>
                {props.showCategories !== false && (
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setStoreCategory(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-colors ${storeCategory === cat ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  {props.showSearch !== false && (
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={storeSearch}
                      onChange={e => setStoreSearch(e.target.value)}
                      className="border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 bg-white"
                    />
                  )}
                  <select
                    value={storeSort}
                    onChange={e => setStoreSort(e.target.value)}
                    className="border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800 bg-white"
                  >
                    <option value="newest">Newest</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="name_asc">Name: A–Z</option>
                  </select>
                </div>
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="p-8 border border-dashed border-slate-300 rounded-xl text-center text-slate-500 text-sm">
                No matching products found.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '1.5rem' }}>
                {filteredProducts.map(prod => {
                  const chosenVarId = selectedVariantsByProd[prod.id] || prod.variants?.[0]?.id || null;
                  const chosenVar = prod.variants?.find(v => v.id === chosenVarId) || null;
                  const displayPrice = chosenVar ? chosenVar.price : prod.price;
                  const stockCount = prod.trackInventory ? (chosenVar ? chosenVar.stock : prod.stock) : 999;
                  const outOfStock = prod.trackInventory && stockCount <= 0;

                  return (
                    <div key={prod.id} className="border border-slate-200 rounded-xl p-4 bg-white flex flex-col gap-3 shadow-sm relative">
                      {!isPreviewMode && prod.status === 'draft' && (
                        <span className="absolute top-6 right-6 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase px-2 py-0.5 rounded">Draft</span>
                      )}
                      <img src={prod.image} alt={prod.name} className="w-full h-44 object-cover rounded-lg" />
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">{prod.category}</span>
                        <span className={`text-xs font-medium ${outOfStock ? 'text-red-600' : stockCount <= prod.lowStockThreshold ? 'text-amber-600' : 'text-slate-400'}`}>
                          {outOfStock ? 'Out of Stock' : prod.trackInventory ? `${stockCount} in stock` : 'Available'}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base">{prod.name}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed flex-1">{prod.shortDescription}</p>

                      {prod.variants && prod.variants.length > 0 && (
                        <select
                          value={chosenVarId || ''}
                          onClick={e => e.stopPropagation()}
                          onChange={e => setSelectedVariantsByProd(prev => ({ ...prev, [prod.id]: e.target.value }))}
                          className="w-full border border-slate-200 rounded-lg p-1.5 text-xs text-slate-700 bg-slate-50"
                        >
                          {prod.variants.map(v => (
                            <option key={v.id} value={v.id} disabled={prod.trackInventory && v.stock <= 0}>
                              {v.title} — {formatMoney(v.price, currencyCode)} {prod.trackInventory && v.stock <= 0 ? '(Sold Out)' : ''}
                            </option>
                          ))}
                        </select>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
                        <div>
                          <span className="font-extrabold text-slate-900 text-lg">{formatMoney(displayPrice, currencyCode)}</span>
                          {prod.compareAtPrice > displayPrice && (
                            <span className="text-xs text-slate-400 line-through ml-1.5">{formatMoney(prod.compareAtPrice, currencyCode)}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          {prodDetailTemplate && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewProductByPage(prev => ({ ...prev, [prodDetailTemplate.id]: prod.id }));
                                setActivePageId(prodDetailTemplate.id);
                              }}
                              className="border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-2 rounded-lg"
                            >
                              Details
                            </button>
                          )}
                          <button
                            type="button"
                            disabled={outOfStock}
                            onClick={(e) => {
                              e.stopPropagation();
                              actions.addToCart(prod, chosenVar, 1);
                              setIsCartOpen(true);
                            }}
                            className="bg-slate-900 hover:bg-blue-600 disabled:opacity-40 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                          >
                            {outOfStock ? 'Sold Out' : 'Add to Cart'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );

      case ELEMENT_TYPES.PRODUCT_DETAIL: {
        const curCode = project.commerceSettings?.currency || 'USD';
        const targetId = ( props.productId === 'context' || !props.productId )
          ? (previewProductByPage?.[activePage?.id] || project.products?.[0]?.id)
          : props.productId;
        const prod = (project.products || []).find(p => p.id === targetId) || project.products?.[0];
        if (!prod || (isPreviewMode && prod.status === 'draft')) {
          return (
            <div ref={nodeRef} style={innerStyle} className="p-8 border border-dashed border-slate-300 rounded-xl text-center text-slate-500">
              Product not found or currently unpublished.
            </div>
          );
        }
        const chosenVarId = selectedVariantsByProd[prod.id] || prod.variants?.[0]?.id || null;
        const chosenVar = prod.variants?.find(v => v.id === chosenVarId) || null;
        const unitPrice = chosenVar ? chosenVar.price : prod.price;
        const availableStock = prod.trackInventory ? (chosenVar ? chosenVar.stock : prod.stock) : 999;
        const isOut = prod.trackInventory && availableStock <= 0;
        const gallery = Array.isArray(prod.gallery) && prod.gallery.length > 0 ? prod.gallery : [prod.image];
        const activeImg = gallery[activeGalleryIdx] || prod.image;

        return (
          <div ref={nodeRef} style={innerStyle} className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <img src={activeImg} alt={prod.name} className="w-full h-80 object-cover rounded-xl border border-slate-100" />
                {gallery.length > 1 && (
                  <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                    {gallery.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveGalleryIdx(idx)}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${activeGalleryIdx === idx ? 'border-blue-600' : 'border-transparent'}`}
                      >
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-4" onClick={e => e.stopPropagation()}>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">{prod.category} • {prod.brand}</span>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">{prod.name}</h1>
                  <div className="text-xs text-slate-400 mt-0.5">SKU: {chosenVar ? chosenVar.sku : prod.sku}</div>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-extrabold text-slate-900">{formatMoney(unitPrice, curCode)}</span>
                  {prod.compareAtPrice > unitPrice && (
                    <span className="text-sm text-slate-400 line-through">{formatMoney(prod.compareAtPrice, curCode)}</span>
                  )}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{prod.description}</p>

                {prod.variants && prod.variants.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Select Variant</label>
                    <select
                      value={chosenVarId || ''}
                      onChange={e => setSelectedVariantsByProd(prev => ({ ...prev, [prod.id]: e.target.value }))}
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm text-slate-800 bg-white"
                    >
                      {prod.variants.map(v => (
                        <option key={v.id} value={v.id} disabled={prod.trackInventory && v.stock <= 0}>
                          {v.title} — {formatMoney(v.price, curCode)} ({prod.trackInventory ? `${v.stock} in stock` : 'Available'})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
                    <button type="button" onClick={() => setDetailQty(q => Math.max(1, q - 1))} className="px-3 py-2 bg-slate-100 text-slate-700 font-bold">-</button>
                    <span className="px-4 py-2 text-sm font-semibold text-slate-900">{detailQty}</span>
                    <button type="button" onClick={() => setDetailQty(q => Math.min(availableStock, q + 1))} className="px-3 py-2 bg-slate-100 text-slate-700 font-bold">+</button>
                  </div>
                  <button
                    type="button"
                    disabled={isOut}
                    onClick={() => {
                      const res = actions.addToCart(prod, chosenVar, detailQty);
                      if (res.ok) {
                        setCartFeedback('Added to cart!');
                        setTimeout(() => setCartFeedback(''), 2000);
                      }
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors"
                  >
                    {isOut ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  <button
                    type="button"
                    disabled={isOut}
                    onClick={() => {
                      actions.addToCart(prod, chosenVar, detailQty);
                      setIsCartOpen(true);
                    }}
                    className="bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
                {cartFeedback && <div className="text-xs font-semibold text-emerald-600">{cartFeedback}</div>}
              </div>
            </div>
          </div>
        );
      }

      case ELEMENT_TYPES.CART_BLOCK: {
        const curCode = project.commerceSettings?.currency || 'USD';
        const subtotal = demoCart.reduce((s, it) => s + it.unitPrice * it.quantity, 0);
        return (
          <div ref={nodeRef} style={innerStyle} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Your Shopping Cart ({demoCart.reduce((s, i) => s + i.quantity, 0)})</h3>
              <span className="text-lg font-extrabold text-slate-900">{formatMoney(subtotal, curCode)}</span>
            </div>
            {demoCart.length === 0 ? (
              <p className="text-sm text-slate-500 py-4 text-center">Your cart is currently empty.</p>
            ) : (
              <div className="space-y-3">
                {demoCart.map(item => (
                  <div key={item.cartItemId} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                      <div>
                        <div className="text-sm font-bold text-slate-900">{item.name}</div>
                        {item.variantTitle && <div className="text-xs text-slate-500">{item.variantTitle}</div>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => actions.updateCartQuantity(item.cartItemId, item.quantity - 1)} className="px-2 py-0.5 border rounded text-slate-700">-</button>
                      <span className="text-xs font-semibold text-slate-800">{item.quantity}</span>
                      <button type="button" onClick={() => actions.updateCartQuantity(item.cartItemId, item.quantity + 1)} className="px-2 py-0.5 border rounded text-slate-700">+</button>
                      <span className="text-sm font-bold text-slate-900 ml-2">{formatMoney(item.unitPrice * item.quantity, curCode)}</span>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        );
      }

      case ELEMENT_TYPES.CMS_LIST:
        const col = (project.collections || []).find(c => c.id === props.collectionId) || (project.collections || [])[0];
        const records = queryCollectionRecords(col, props, isPreviewMode);
        const detailTemplatePage = project.pages.find(p => p.isCmsTemplate && p.cmsCollectionId === col?.id);
        const layoutMode = props.layout || 'grid';
        const cmsCols = layoutMode === 'list' ? 1 : (deviceMode === 'mobile' ? 1 : (deviceMode === 'tablet' ? 2 : (props.columns || 3)));

        if (records.length === 0) {
          return (
            <div ref={nodeRef} style={innerStyle} className="p-8 border border-dashed border-slate-300 rounded-xl text-center text-slate-500 text-sm bg-slate-50">
              No matching records in <strong>{col?.name || 'Collection'}</strong>. Add or publish records in the CMS Studio.
            </div>
          );
        }

        return (
          <div ref={nodeRef} style={{ ...innerStyle, display: 'grid', gridTemplateColumns: `repeat(${cmsCols}, 1fr)`, gap: '1.5rem' }}>
            {records.map(item => (
              <article key={item.id} className={`border border-slate-200 rounded-xl p-5 bg-white flex ${layoutMode === 'list' ? 'flex-col md:flex-row items-start md:items-center gap-5' : 'flex-col gap-2.5'} shadow-sm relative`}>
                {!isPreviewMode && item.status === 'draft' && (
                  <span className="absolute top-3 right-3 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase px-2 py-0.5 rounded">Draft</span>
                )}
                {props.showImage !== false && item.image && (
                  <img
                    src={item.image}
                    alt={item.title || ''}
                    className={`${layoutMode === 'list' ? 'w-full md:w-48 h-36' : 'w-full h-44'} object-cover rounded-lg shrink-0`}
                  />
                )}
                <div className="flex flex-col gap-1.5 flex-1">
                  {props.showCategory !== false && (
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">{item.category || col?.name}</span>
                  )}
                  <h3 className="font-bold text-slate-900 text-lg">{item.title}</h3>
                  {props.showSummary !== false && (
                    <p className="text-sm text-slate-600 flex-1">{item.summary}</p>
                  )}
                  <div className="flex items-center justify-between pt-2 mt-auto">
                    {props.showDate !== false && (
                      <span className="text-xs text-slate-400">{item.date || (item.createdAt ? item.createdAt.slice(0, 10) : '')}</span>
                    )}
                    {detailTemplatePage && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewRecordByPage(prev => ({ ...prev, [detailTemplatePage.id]: item.id }));
                          setActivePageId(detailTemplatePage.id);
                        }}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 pointer-events-auto"
                      >
                        {props.linkLabel || 'View Entry →'}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        );
      case ELEMENT_TYPES.PAGE:
        return <div ref={nodeRef} style={computedStyle} className="min-h-full w-full">{renderChildren()}</div>;
      default:
        return <div style={{ padding: '20px', border: '1px dashed #ef4444', color: '#ef4444' }}>Unsupported Element</div>;
    }
  };

  if (node.type === ELEMENT_TYPES.PAGE) {
    return (
      <div onClick={handleSelect} className={`w-full h-full min-h-screen origin-top transition-all ${isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''}`}>
        {renderElement()}
      </div>
    );
  }

  return (
    <div
      className={`nexus-wrapper relative transition-all duration-150 group ${isSelected && !isEditing ? 'ring-2 ring-blue-500 z-10' : isHovered && !isSelected && !isEditing ? 'ring-1 ring-blue-400/60 z-0' : ''} ${dropIndicator === 'inside' ? 'ring-2 ring-emerald-500 bg-emerald-500/5' : ''}`}
      onClick={handleSelect} onDoubleClick={handleDoubleClick}
      onMouseEnter={(e) => handleHover(e, true)} onMouseLeave={(e) => { handleHover(e, false); setDropIndicator(null); }}
      onDragOver={handleCanvasDragOver} onDragLeave={() => setDropIndicator(null)} onDrop={handleCanvasDrop}
      style={wrapperStyle}
    >
      {dropIndicator === 'before' && (
        <div className="absolute -top-1 left-0 right-0 h-1 bg-emerald-500 z-30 pointer-events-none rounded-full" />
      )}
      {dropIndicator === 'after' && (
        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-emerald-500 z-30 pointer-events-none rounded-full" />
      )}
      {isSelected && !isEditing && (
        <>
          <div className="absolute -top-6 left-0 bg-blue-600 text-white text-[10px] uppercase font-bold rounded-t flex items-center z-20 shadow-sm whitespace-nowrap">
            <div
              draggable={!isLocked}
              onDragStart={handleCanvasDragStart}
              className="p-1 cursor-move hover:bg-blue-700 transition-colors pointer-events-auto touch-none"
              onPointerDown={handleMoveStart}
              title="Drag to Offset Position (or Drag into Container)"
            >
              <GripVertical className="w-3 h-3" />
            </div>
            <span className="px-1.5 py-0.5 pointer-events-none">{node.name} ({node.type})</span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); actions.selectParentElement(node.id); }}
              className="px-1.5 py-0.5 hover:bg-blue-700 border-l border-blue-400/40 text-[9px]"
              title="Select Parent Container"
            >
              ↑ Parent
            </button>
            {liveMeasure && (
              <span className="bg-gray-900 text-emerald-300 px-1.5 py-0.5 text-[9px] font-mono">{liveMeasure}</span>
            )}
            {node.props?.cmsBinding?.collectionId && (
              <span className="bg-indigo-900 text-indigo-200 px-1.5 py-0.5 text-[9px] rounded-tr">CMS: {node.props.cmsBinding.fieldKey}</span>
            )}
          </div>
          {isPrimarySelected && !isLocked && node.type !== ELEMENT_TYPES.TEXT && (
            <>
              <div className="absolute top-0 bottom-0 right-[-4px] w-[8px] cursor-e-resize z-20 touch-none" onPointerDown={(e) => handleResizeStart(e, 'e')} />
              <div className="absolute top-0 bottom-0 left-[-4px] w-[8px] cursor-w-resize z-20 touch-none" onPointerDown={(e) => handleResizeStart(e, 'w')} />
              <div className="absolute left-0 right-0 bottom-[-4px] h-[8px] cursor-s-resize z-20 touch-none" onPointerDown={(e) => handleResizeStart(e, 's')} />
              <div className="absolute left-0 right-0 top-[-4px] h-[8px] cursor-n-resize z-20 touch-none" onPointerDown={(e) => handleResizeStart(e, 'n')} />
              <div className="absolute bottom-[-5px] right-[-5px] w-3 h-3 bg-white border-2 border-blue-600 rounded-full cursor-se-resize z-30 shadow-sm touch-none" onPointerDown={(e) => handleResizeStart(e, 'se')} title="Drag to Resize (Hold Shift to Lock Aspect Ratio)" />
              <div className="absolute bottom-[-5px] left-[-5px] w-2.5 h-2.5 bg-white border-2 border-blue-600 rounded-full cursor-sw-resize z-30 shadow-sm touch-none" onPointerDown={(e) => handleResizeStart(e, 'sw')} />
              <div className="absolute top-[-5px] right-[-5px] w-2.5 h-2.5 bg-white border-2 border-blue-600 rounded-full cursor-ne-resize z-30 shadow-sm touch-none" onPointerDown={(e) => handleResizeStart(e, 'ne')} />
            </>
          )}
        </>
      )}
      {renderElement()}
    </div>
  );
};

const TopBar = ({ builder }) => {
  const { deviceMode, setDeviceMode, isPreviewMode, setIsPreviewMode, history, actions, project, demoCart, setIsCartOpen, setActiveModal } = builder;
  const [isExporting, setIsExporting] = useState(false);

  const pubStatus = project.publishing?.status || 'draft';
  const statusBadgeConfig = {
    draft: { label: 'Draft', cls: 'bg-gray-800 text-gray-300 border-gray-700' },
    ready_to_publish: { label: 'Ready to Publish', cls: 'bg-blue-950/60 text-blue-300 border-blue-500/40' },
    building: { label: 'Building...', cls: 'bg-amber-950/60 text-amber-300 border-amber-500/40' },
    deploying: { label: 'Deploying...', cls: 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40' },
    published: { label: 'Published', cls: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40' },
    failed: { label: 'Build/Deploy Failed', cls: 'bg-red-950/60 text-red-300 border-red-500/40' },
    changes_unpublished: { label: 'Unpublished Changes', cls: 'bg-amber-950/60 text-amber-300 border-amber-500/40' }
  }[pubStatus] || { label: 'Draft', cls: 'bg-gray-800 text-gray-300 border-gray-700' };

  const handleExportHTML = async () => {
    setIsExporting(true);
    try {
      const { css, htmlPages, sitemapXml, robotsTxt, readme, buildManifest } = await generateExport(project);
      actions.updatePublishingConfig({ lastBuildAt: buildManifest.generatedAt, lastBuildArtifacts: buildManifest });
      actions.markOnboardingStep('step_validate');
      if (!window.JSZip) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
          script.onload = resolve; script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      if (window.JSZip) {
        const zip = new window.JSZip();
        zip.file("styles.css", css);
        zip.file("README.md", readme);
        zip.file("sitemap.xml", sitemapXml);
        zip.file("robots.txt", robotsTxt);
        zip.file("manifest.json", JSON.stringify(buildManifest, null, 2));
        Object.keys(htmlPages).forEach(filename => { zip.file(filename, htmlPages[filename]); });
        const blob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `${project.name.replace(/\s+/g, '-').toLowerCase()}-production-build.zip`;
        a.click(); URL.revokeObjectURL(url);
      } else { throw new Error("JSZip unavailable"); }
    } catch (e) {
      const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${project.name.replace(/\s+/g, '-').toLowerCase()}.nexus.json`;
      a.click(); URL.revokeObjectURL(url);
    }
    setIsExporting(false);
  };

  const totalCartCount = demoCart.reduce((s, i) => s + (i.quantity || 1), 0);

  return (
    <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-3 text-white shrink-0 z-50 gap-2">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 font-bold text-sm tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent shrink-0">
          <Layers className="w-4 h-4 text-blue-500" /> NEXUS STUDIO
        </div>
        <button
          onClick={() => setActiveModal('dashboard')}
          className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 px-2.5 py-1 rounded-md text-xs font-medium border border-gray-700 transition-colors"
          title="Open Project Dashboard & Switch Websites"
        >
          <FolderKanban className="w-3.5 h-3.5 text-blue-400" />
          <span className="max-w-[115px] truncate">{project.name}</span>
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>
        <button
          onClick={() => setActiveModal('publishing')}
          className={`hidden xl:flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusBadgeConfig.cls}`}
          title="Open Publishing & Deployment Status"
        >
          <Globe className="w-3 h-3" /> {statusBadgeConfig.label}
        </button>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto">
        {!isPreviewMode && (
          <>
            <div className="flex bg-gray-800 rounded-lg p-0.5 border border-gray-700/60">
              {Object.values(BREAKPOINTS).map(bp => {
                const Icon = bp.icon;
                return (
                  <button
                    key={bp.id}
                    onClick={() => { setDeviceMode(bp.id); if (bp.id !== 'desktop') actions.markOnboardingStep('step_responsive'); }}
                    title={bp.label}
                    aria-label={bp.label}
                    className={`p-1.5 rounded-md transition-colors ${deviceMode === bp.id ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => builder.setSnapEnabled(!builder.snapEnabled)}
              title="Toggle Smart Alignment Guides & Snapping"
              className={`px-2 py-1 rounded-md text-[11px] font-semibold border transition-colors shrink-0 ${builder.snapEnabled ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40' : 'bg-gray-800 text-gray-400 border-gray-700'}`}
            >
              Snap: {builder.snapEnabled ? 'ON' : 'OFF'}
            </button>
          </>
        )}

        <button
          onClick={() => setActiveModal('design_system')}
          className="flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium bg-pink-600/20 text-pink-300 border border-pink-500/30 hover:bg-pink-600/30 transition-colors shrink-0"
          title="Global Design System & Tokens"
        >
          <Palette className="w-3.5 h-3.5 text-pink-400" /> Tokens
        </button>

        <button
          onClick={() => setActiveModal('ai')}
          className="flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 transition-colors shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> AI Architect
        </button>

        <button
          onClick={() => setActiveModal('cms')}
          className="flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 transition-colors shrink-0"
        >
          <Database className="w-3.5 h-3.5 text-purple-400" /> CMS ({project.collections?.reduce((acc, c) => acc + (c.items?.length || 0), 0) || 0})
        </button>

        <button
          onClick={() => setActiveModal('commerce')}
          className="flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 transition-colors shrink-0"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" /> Store ({project.products?.length || 0})
        </button>

        <button
          onClick={() => setActiveModal('history')}
          className="flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 transition-colors shrink-0"
          title="Version History, Snapshots & Activity Log"
        >
          <FileText className="w-3.5 h-3.5 text-amber-400" /> History ({project.versionSnapshots?.length || 0})
        </button>

        <button
          onClick={() => setActiveModal('team')}
          className="flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 transition-colors shrink-0"
          title="Role Permissions & Collaboration Boundary"
        >
          <Settings className="w-3.5 h-3.5 text-cyan-400" /> Role: {project.activeRole || 'Owner'}
        </button>

        <button
          onClick={() => setActiveModal('publishing')}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-blue-600/20 text-blue-300 border border-blue-500/40 hover:bg-blue-600/30 transition-colors shrink-0"
        >
          <Globe className="w-3.5 h-3.5 text-blue-400" /> Publish
        </button>

        <button
          onClick={() => {
            const next = !isPreviewMode;
            setIsPreviewMode(next);
            if (next) actions.markOnboardingStep('step_preview');
          }}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors shrink-0 ${isPreviewMode ? 'bg-amber-600 text-white' : 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700'}`}
        >
          {isPreviewMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {isPreviewMode ? 'Exit' : 'Preview'}
        </button>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setIsCartOpen(true)}
          title="Open Shopping Cart & Checkout Drawer"
          className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-emerald-300 px-2 py-1.5 rounded-md text-xs font-medium"
        >
          <ShoppingBag className="w-3.5 h-3.5" /> ({totalCartCount})
        </button>
        <div className="flex items-center gap-0.5 border-r border-gray-800 pr-1.5">
          <button onClick={actions.undo} disabled={history.past.length === 0 || isPreviewMode} aria-label="Undo" className="p-1 text-gray-400 hover:text-white disabled:opacity-30">
            <Undo2 className="w-4 h-4" />
          </button>
          <button onClick={actions.redo} disabled={history.future.length === 0 || isPreviewMode} aria-label="Redo" className="p-1 text-gray-400 hover:text-white disabled:opacity-30">
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
        <span className="text-[11px] text-gray-400 hidden 2xl:flex items-center gap-1"><Save className="w-3 h-3 text-blue-400" /> {builder.saveStatus}</span>
        <button onClick={handleExportHTML} disabled={isExporting} className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors shadow-sm">
          {isExporting ? <AlertCircle className="w-3.5 h-3.5 animate-pulse" /> : <Download className="w-3.5 h-3.5" />} Export ZIP
        </button>
      </div>
    </header>
  );
};

const LeftSidebar = ({ builder }) => {
  const [activeTab, setActiveTab] = useState('add');
  const { project, activePageId, setActivePageId, actions, selectedId, setSelectedId } = builder;

  const [sectionSearch, setSectionSearch] = useState('');
  const [assetSearch, setAssetSearch] = useState('');
  const [assetFolderFilter, setAssetFolderFilter] = useState('all');
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetUrl, setNewAssetUrl] = useState('');
  const [newAssetAlt, setNewAssetAlt] = useState('');
  const [newAssetFolder, setNewAssetFolder] = useState('General');
  const [assetMsg, setAssetMsg] = useState('');

  const [activeCmsColId, setActiveCmsColId] = useState(() => project.collections?.[0]?.id || 'col_blog');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('News');
  const [newPostSummary, setNewPostSummary] = useState('');

  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('99');
  const [newProdCategory, setNewProdCategory] = useState('Featured');

  const tabs = [
    { id: 'add', icon: Plus, label: 'Add' },
    { id: 'templates', icon: Layout, label: 'Sections' },
    { id: 'components', icon: Package, label: 'Symbols' },
    { id: 'assets', icon: ImageIcon, label: 'Assets' },
    { id: 'layers', icon: Layers, label: 'Layers' },
    { id: 'pages', icon: FileCode2, label: 'Pages' },
    { id: 'cms', icon: Database, label: 'CMS' },
    { id: 'store', icon: ShoppingBag, label: 'Store' }
  ];

  const handleFileAssetUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setAssetMsg('Only image files (PNG, JPG, SVG, WEBP) are supported.');
      return;
    }
    if (file.size > 450 * 1024) {
      setAssetMsg('File exceeds 450KB local storage safety limit. Use an external CDN URL or smaller image.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      actions.addAsset({
        name: file.name.replace(/\.[^/.]+$/, ''),
        url: ev.target.result,
        alt: file.name,
        folder: newAssetFolder || 'Uploads',
        mimeType: file.type,
        sizeBytes: file.size
      });
      setAssetMsg('Image uploaded to local project assets.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragStart = (e, id) => { e.dataTransfer.setData('text/plain', id); e.stopPropagation(); };
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e, targetId, position) => {
    e.preventDefault(); e.stopPropagation();
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId) actions.moveElementPosition(draggedId, targetId, position);
  };

  const [collapsedNodes, setCollapsedNodes] = useState({});

  const LayerItem = ({ node, depth = 0 }) => {
    const isSelected = selectedId === node.id || (builder.selectedIds || []).includes(node.id);
    const Icon = ELEMENT_CATALOG.flatMap(c => c.items).find(i => i.type === node.type)?.icon || Square;
    const isContainer = [ELEMENT_TYPES.SECTION, ELEMENT_TYPES.CONTAINER, ELEMENT_TYPES.GRID, ELEMENT_TYPES.PAGE, ELEMENT_TYPES.NAV].includes(node.type);
    const hasChildren = Array.isArray(node.children) && node.children.length > 0;
    const isCollapsed = Boolean(collapsedNodes[node.id]);
    const isLocked = Boolean(node.props?.editorLocked);
    const isHidden = Boolean(node.props?.editorHidden);

    return (
      <div>
        <div
          draggable={node.type !== ELEMENT_TYPES.PAGE && !isLocked}
          onDragStart={(e) => handleDragStart(e, node.id)} onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, node.id, isContainer ? 'inside' : 'after')}
          onClick={(e) => {
            if (e.shiftKey) {
              builder.setSelectedIds(prev => prev.includes(node.id) ? prev.filter(id => id !== node.id) : [...prev, node.id]);
              setSelectedId(node.id);
            } else {
              setSelectedId(node.id);
              builder.setSelectedIds([node.id]);
            }
          }}
          onMouseEnter={() => builder.setHoveredId(node.id)} onMouseLeave={() => builder.setHoveredId(null)}
          className={`flex items-center gap-1 py-1.5 px-1.5 text-xs cursor-pointer rounded-md border border-transparent transition-colors group ${isSelected ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' : 'text-gray-300 hover:bg-gray-800'} ${isHidden ? 'opacity-50' : ''}`}
          style={{ paddingLeft: `${depth * 10 + 6}px` }}
        >
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setCollapsedNodes(prev => ({ ...prev, [node.id]: !prev[node.id] })); }}
              className="p-0.5 text-gray-400 hover:text-white"
              aria-label="Toggle child layers"
            >
              {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          ) : (
            <GripVertical className={`w-3 h-3 cursor-grab ${node.type === ELEMENT_TYPES.PAGE ? 'opacity-0' : 'opacity-30 hover:opacity-100'}`} />
          )}
          <Icon className="w-3 h-3 opacity-70 shrink-0" />
          <span className="truncate flex-1">{node.name}</span>

          {node.type !== ELEMENT_TYPES.PAGE && (
            <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); actions.reorderSiblingElement(node.id, 'up'); }}
                title="Move Layer Up"
                className="p-0.5 hover:text-white"
              >
                <ArrowUp className="w-2.5 h-2.5" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); actions.reorderSiblingElement(node.id, 'down'); }}
                title="Move Layer Down"
                className="p-0.5 hover:text-white"
              >
                <ArrowDown className="w-2.5 h-2.5" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); actions.updateNode(node.id, { props: { editorHidden: !isHidden } }, 'instant'); }}
                title={isHidden ? 'Show in Editor Canvas' : 'Hide in Editor Canvas (Editor-only)'}
                className={`p-0.5 ${isHidden ? 'text-amber-400' : 'hover:text-white'}`}
              >
                {isHidden ? <EyeOff className="w-2.5 h-2.5" /> : <Eye className="w-2.5 h-2.5" />}
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); actions.updateNode(node.id, { props: { editorLocked: !isLocked } }, 'instant'); }}
                title={isLocked ? 'Unlock Layer' : 'Lock Layer against accidental moves'}
                className={`p-0.5 text-[9px] font-bold ${isLocked ? 'text-red-400' : 'hover:text-white'}`}
              >
                {isLocked ? '🔒' : '🔓'}
              </button>
            </div>
          )}
        </div>
        {!isCollapsed && node.children && node.children.map(child => <LayerItem key={child.id} node={child} depth={depth + 1} />)}
      </div>
    );
  };

  return (
    <div className="w-72 bg-gray-900 border-r border-gray-800 flex flex-col h-full shrink-0 z-20">
      <div className="grid grid-cols-8 border-b border-gray-800 bg-gray-950/40">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-0.5 flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === tab.id ? 'text-blue-400 border-b-2 border-blue-500 bg-gray-800/60' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/40'}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="text-[7px] font-semibold uppercase tracking-tighter">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'add' && (
          <div className="space-y-6">
            {ELEMENT_CATALOG.map(category => (
              <div key={category.category}>
                <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">{category.category}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {category.items.map(item => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.name} onClick={() => actions.addElement(item.create, selectedId, 'inside')}
                        className="flex flex-col items-center justify-center p-3 bg-gray-800/80 hover:bg-gray-700 hover:border-blue-500/50 border border-gray-700/60 rounded-lg text-gray-300 transition-all gap-1.5 group"
                      >
                        <Icon className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
                        <span className="text-xs font-medium">{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search 13+ sections (hero, faq, store...)"
                value={sectionSearch}
                onChange={(e) => setSectionSearch(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="text-[11px] text-gray-400">Click any section to append it with unique IDs to the current page:</div>
            {COMPONENTS.filter(c =>
              c.name.toLowerCase().includes(sectionSearch.toLowerCase()) ||
              c.category.toLowerCase().includes(sectionSearch.toLowerCase())
            ).map(comp => {
              const Icon = comp.icon;
              return (
                <button
                  key={comp.id} onClick={() => actions.addElement(comp.create, builder.activePage.rootNode.id, 'inside')}
                  className="w-full flex items-center gap-3 p-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-left transition-colors group"
                >
                  <div className="bg-gray-900 p-2 rounded group-hover:bg-blue-600/20"><Icon className="w-4 h-4 text-blue-400" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-gray-200 truncate">{comp.name}</div>
                    <div className="text-[10px] text-blue-400/80">{comp.category}</div>
                  </div>
                  <Plus className="w-3.5 h-3.5 text-gray-500 group-hover:text-white shrink-0" />
                </button>
              );
            })}
          </div>
        )}

        {activeTab === 'components' && (
          <div className="space-y-3">
            <div className="text-xs text-gray-400">Reusable Symbols (insert as Linked Instance or Independent Copy):</div>
            {(!project.savedComponents || project.savedComponents.length === 0) ? (
              <div className="p-4 bg-gray-800/40 border border-dashed border-gray-700 rounded-lg text-center text-xs text-gray-500">
                Select any element on the canvas and click &quot;Save Symbol&quot; in the right inspector to reuse it across pages.
              </div>
            ) : (
              project.savedComponents.map(comp => (
                <div key={comp.id} className="p-2.5 bg-gray-800 border border-gray-700 rounded-lg space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-200 font-bold truncate">{comp.name}</span>
                    <button onClick={() => actions.deleteSavedComponent(comp.id)} className="p-1 text-gray-400 hover:text-red-400" title="Delete Symbol">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => actions.insertSavedComponent(comp.id, true)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-[10px] font-semibold"
                      title="Linked instances can be synchronized across all pages"
                    >
                      + Linked Instance
                    </button>
                    <button
                      onClick={() => actions.insertSavedComponent(comp.id, false)}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded text-[10px] font-semibold"
                      title="Independent copy detached from master symbol"
                    >
                      + Detached Copy
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="space-y-4">
            <div className="p-3 bg-gray-800/80 border border-gray-700 rounded-lg space-y-2">
              <div className="text-xs font-bold text-gray-200 flex items-center justify-between">
                <span>Add Project Asset</span>
                <label className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 rounded text-[10px] cursor-pointer flex items-center gap-1">
                  <Upload className="w-3 h-3" /> Upload File
                  <input type="file" accept="image/*" onChange={handleFileAssetUpload} className="hidden" />
                </label>
              </div>
              <input type="text" placeholder="Asset Name" value={newAssetName} onChange={e => setNewAssetName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" />
              <input type="text" placeholder="Image URL (https://...)" value={newAssetUrl} onChange={e => setNewAssetUrl(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" />
              <div className="grid grid-cols-2 gap-1.5">
                <input type="text" placeholder="Alt Text" value={newAssetAlt} onChange={e => setNewAssetAlt(e.target.value)} className="bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" />
                <input type="text" placeholder="Folder" value={newAssetFolder} onChange={e => setNewAssetFolder(e.target.value)} className="bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" />
              </div>
              <button
                onClick={() => {
                  if (!newAssetUrl.trim()) return;
                  actions.addAsset({ name: newAssetName || 'External Image', url: newAssetUrl.trim(), alt: newAssetAlt, folder: newAssetFolder });
                  setNewAssetName(''); setNewAssetUrl(''); setNewAssetAlt('');
                }}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-1.5 rounded text-xs font-semibold"
              >
                + Add URL to Library
              </button>
              {assetMsg && <div className="text-[10px] text-amber-300">{assetMsg}</div>}
            </div>

            <div className="flex gap-1.5">
              <input type="text" placeholder="Search assets..." value={assetSearch} onChange={e => setAssetSearch(e.target.value)} className="flex-1 bg-gray-950 border border-gray-800 rounded p-1.5 text-xs text-white" />
              <select value={assetFolderFilter} onChange={e => setAssetFolderFilter(e.target.value)} className="bg-gray-950 border border-gray-800 rounded p-1 text-[10px] text-gray-300">
                <option value="all">All Folders</option>
                {Array.from(new Set((project.assets || []).map(a => a.folder || 'General'))).map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2.5">
              {(project.assets || [])
                .filter(a => (assetFolderFilter === 'all' || a.folder === assetFolderFilter) && a.name.toLowerCase().includes(assetSearch.toLowerCase()))
                .map(asset => {
                  const usageCount = countAssetReferences(project, asset.url);
                  return (
                    <div key={asset.id} className="p-2.5 bg-gray-800 border border-gray-700 rounded-lg space-y-2">
                      <div className="flex items-center gap-2.5">
                        <img src={asset.url} alt={asset.alt} className="w-12 h-12 rounded object-cover bg-gray-900 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-gray-200 truncate">{asset.name}</div>
                          <div className="text-[10px] text-blue-400">{asset.folder} • Used {usageCount}x</div>
                          <div className="text-[10px] text-gray-400 truncate">Alt: {asset.alt || 'None'}</div>
                        </div>
                        <button
                          onClick={() => actions.deleteAsset(asset.id)}
                          className="text-gray-500 hover:text-red-400 p-1"
                          title={usageCount > 0 ? `Warning: Used ${usageCount} time(s) on pages` : 'Delete Asset'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            if (selectedId) {
                              actions.updateNode(selectedId, { props: { src: asset.url, alt: asset.alt } }, 'instant');
                            } else {
                              actions.addElement(() => ({
                                id: generateId(), type: ELEMENT_TYPES.IMAGE, name: asset.name,
                                props: { src: asset.url, alt: asset.alt },
                                styles: { base: { ...DEFAULT_STYLES.image } }, children: []
                              }), builder.activePage.rootNode.id, 'inside');
                            }
                          }}
                          className="w-full bg-gray-900 hover:bg-blue-600/30 border border-gray-700 text-blue-300 py-1 rounded text-[10px] font-semibold"
                        >
                          {selectedId ? 'Apply to Selected Element' : '+ Insert as Image'}
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {activeTab === 'layers' && (
          <div className="space-y-1">
            <div className="text-[11px] text-gray-400 mb-2">Drag layers to reorder or nest inside containers:</div>
            <LayerItem node={builder.activePage.rootNode} />
          </div>
        )}

        {activeTab === 'pages' && (
          <div className="space-y-3">
            {project.pages.map((page, idx) => (
              <div key={page.id} className={`p-3 rounded-lg border transition-colors ${activePageId === page.id ? 'bg-blue-600/10 border-blue-500/50' : 'bg-gray-800 border-gray-700'}`}>
                <div className="flex items-center justify-between mb-2 cursor-pointer" onClick={() => { setActivePageId(page.id); setSelectedId(null); builder.setHoveredId(null); }}>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className={`text-xs font-semibold truncate ${activePageId === page.id ? 'text-blue-400' : 'text-gray-200'}`}>{page.name}</div>
                    {page.isCmsTemplate && (
                      <span className="text-[9px] bg-purple-600/30 text-purple-300 border border-purple-500/40 px-1.5 py-0.5 rounded font-bold uppercase shrink-0">CMS</span>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); actions.reorderPage(page.id, 'up'); }} disabled={idx === 0} title="Move Page Up" className="p-1 text-gray-400 hover:text-white disabled:opacity-20"><ArrowUp className="w-3 h-3" /></button>
                    <button onClick={(e) => { e.stopPropagation(); actions.reorderPage(page.id, 'down'); }} disabled={idx === project.pages.length - 1} title="Move Page Down" className="p-1 text-gray-400 hover:text-white disabled:opacity-20"><ArrowDown className="w-3 h-3" /></button>
                    <button onClick={(e) => { e.stopPropagation(); actions.duplicatePage(page.id); }} title="Duplicate Page" className="p-1 text-gray-400 hover:text-white"><Copy className="w-3 h-3" /></button>
                    {project.pages.length > 1 && (
                      <button onClick={(e) => { e.stopPropagation(); actions.deletePage(page.id); }} title="Delete Page" className="p-1 text-gray-400 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                    )}
                  </div>
                </div>
                {activePageId === page.id && (
                  <div className="space-y-2 pt-2 border-t border-gray-700/60">
                    <div>
                      <label className="block text-[10px] text-gray-400 mb-0.5">Page Name</label>
                      <input type="text" value={page.name} onChange={(e) => actions.updatePage(page.id, { name: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 mb-0.5">Filename Slug (.html)</label>
                      <input type="text" value={page.slug} onChange={(e) => actions.updatePage(page.id, { slug: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 mb-0.5">SEO Title</label>
                      <input type="text" value={page.seoTitle || ''} onChange={(e) => actions.updatePage(page.id, { seoTitle: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" placeholder="Browser title" />
                    </div>
                    <div className="pt-1 border-t border-gray-800">
                      <label className="flex items-center gap-2 text-[11px] text-purple-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(page.isCmsTemplate)}
                          onChange={(e) => actions.updatePage(page.id, {
                            isCmsTemplate: e.target.checked,
                            cmsCollectionId: e.target.checked ? (page.cmsCollectionId || project.collections?.[0]?.id || 'col_blog') : null
                          })}
                        />
                        <span>Dynamic CMS Detail Template</span>
                      </label>
                      {page.isCmsTemplate && (
                        <select
                          value={page.cmsCollectionId || ''}
                          onChange={(e) => actions.updatePage(page.id, { cmsCollectionId: e.target.value })}
                          className="w-full mt-1.5 bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white"
                        >
                          {(project.collections || []).map(c => (
                            <option key={c.id} value={c.id}>Collection: {c.name} (/{c.slug}-*.html)</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button onClick={() => actions.addPage()} className="w-full py-2 flex items-center justify-center gap-1.5 text-xs font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg border border-dashed border-gray-600 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add New Page
            </button>
          </div>
        )}

        {activeTab === 'cms' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-300 uppercase">CMS Collections</h3>
              <button onClick={() => builder.setActiveModal('cms')} className="text-[11px] bg-purple-600/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded hover:bg-purple-600/30">
                Open CMS Studio
              </button>
            </div>
            <div>
              <label className="block text-[10px] text-gray-400 uppercase mb-1">Active Collection</label>
              <select
                value={activeCmsColId}
                onChange={(e) => setActiveCmsColId(e.target.value)}
                className="w-full bg-gray-950 border border-gray-700 rounded p-1.5 text-xs text-white"
              >
                {(project.collections || []).map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.items?.length || 0} items)</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => actions.addElement(() => refreshIds({
                  id: 'temp', type: ELEMENT_TYPES.CMS_LIST, name: 'CMS Collection List',
                  props: { collectionId: activeCmsColId, layout: 'grid', columns: 3, statusFilter: 'published' },
                  styles: { base: { width: '100%', padding: '1rem 0' } }, children: []
                }), builder.activePage.rootNode.id, 'inside')}
                className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-blue-300 py-1.5 px-2 rounded text-[11px] font-medium"
              >
                + Insert List
              </button>
              <button
                onClick={() => actions.createCmsDetailPage(activeCmsColId)}
                className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-purple-300 py-1.5 px-2 rounded text-[11px] font-medium"
              >
                + Detail Page
              </button>
            </div>
            <div className="p-3 bg-gray-800/80 border border-gray-700 rounded-lg space-y-2">
              <div className="text-xs font-medium text-gray-200">Quick Add Record</div>
              <input type="text" placeholder="Record Title" value={newPostTitle} onChange={e => setNewPostTitle(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" />
              <input type="text" placeholder="Category / Tag" value={newPostCategory} onChange={e => setNewPostCategory(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" />
              <textarea placeholder="Short summary..." value={newPostSummary} onChange={e => setNewPostSummary(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white h-16" />
              <button
                onClick={() => {
                  if (!newPostTitle.trim()) return;
                  actions.addCmsItem(activeCmsColId, { title: newPostTitle, category: newPostCategory, summary: newPostSummary, date: '2026-10-13', status: 'published' });
                  setNewPostTitle(''); setNewPostSummary('');
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded text-xs font-medium"
              >
                Publish Record
              </button>
            </div>
            <div className="space-y-2">
              {(((project.collections || []).find(c => c.id === activeCmsColId) || project.collections?.[0])?.items || []).map(item => (
                <div key={item.id} className="p-2.5 bg-gray-800 border border-gray-700 rounded flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-gray-200 truncate">{item.title}</div>
                    <div className="text-[10px] text-blue-400 truncate">/{item.slug} • <span className={item.status === 'draft' ? 'text-amber-400' : 'text-emerald-400'}>{item.status || 'published'}</span></div>
                  </div>
                  <button onClick={() => actions.deleteCmsItem(activeCmsColId, item.id)} className="text-gray-500 hover:text-red-400 shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'store' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-300 uppercase">Storefront & Products</h3>
              <button onClick={() => builder.setActiveModal('commerce')} className="text-[11px] bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded hover:bg-emerald-600/30">
                Commerce Studio
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => actions.addElement(SECTION_TEMPLATES.ecommerceGrid, builder.activePage.rootNode.id, 'inside')}
                className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-blue-300 py-1.5 px-2 rounded text-[11px] font-medium"
              >
                + Product Grid
              </button>
              <button
                onClick={() => actions.createProductDetailPage()}
                className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-emerald-300 py-1.5 px-2 rounded text-[11px] font-medium"
              >
                + Detail Page
              </button>
            </div>
            <div className="p-3 bg-gray-800/80 border border-gray-700 rounded-lg space-y-2">
              <div className="text-xs font-medium text-gray-200">Quick Add Product</div>
              <input type="text" placeholder="Product Name" value={newProdName} onChange={e => setNewProdName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Price" value={newProdPrice} onChange={e => setNewProdPrice(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" />
                <input type="text" placeholder="Category" value={newProdCategory} onChange={e => setNewProdCategory(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" />
              </div>
              <button
                onClick={() => {
                  if (!newProdName.trim()) return;
                  actions.addProduct({
                    name: newProdName, price: parseFloat(newProdPrice) || 49, sku: 'SKU-' + Math.floor(Math.random() * 900 + 100),
                    stock: 25, category: newProdCategory, status: 'published',
                    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
                    shortDescription: 'Premium quality product ready for immediate shipment.'
                  });
                  setNewProdName('');
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 rounded text-xs font-medium"
              >
                Add to Catalog
              </button>
            </div>
            <div className="space-y-2">
              {(project.products || []).map(prod => (
                <div key={prod.id} className="p-2.5 bg-gray-800 border border-gray-700 rounded flex items-center justify-between gap-2">
                  <div className="truncate">
                    <div className="text-xs font-semibold text-gray-200 truncate">{prod.name}</div>
                    <div className="text-[10px] text-emerald-400">
                      {formatMoney(prod.price, project.commerceSettings?.currency)} • {prod.status} • Stock: {prod.stock}
                    </div>
                  </div>
                  <button onClick={() => actions.deleteProduct(prod.id)} className="text-gray-500 hover:text-red-400 shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PropGroup = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-800">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-3 text-xs font-semibold text-gray-300 uppercase tracking-wider hover:bg-gray-800/50 transition-colors">
        {title} <ChevronDown className={`w-4 h-4 transition-transform ${open ? '' : '-rotate-90'}`} />
      </button>
      {open && <div className="p-4 pt-0 space-y-3">{children}</div>}
    </div>
  );
};

const DebouncedTextInput = ({ label, value, onChange, placeholder, multiline }) => {
  const [localValue, setLocalValue] = useState(value || '');
  useEffect(() => { setLocalValue(value || ''); }, [value]);

  return (
    <div>
      {label && <label className="block text-xs text-gray-400 mb-1">{label}</label>}
      {multiline ? (
        <textarea
          value={localValue} onFocus={() => onChange(localValue, 'start')}
          onChange={(e) => { setLocalValue(e.target.value); onChange(e.target.value, 'update'); }}
          onBlur={() => onChange(localValue, 'commit')} placeholder={placeholder}
          className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-xs text-white focus:border-blue-500 min-h-[70px]"
        />
      ) : (
        <input
          type="text" value={localValue} onFocus={() => onChange(localValue, 'start')}
          onChange={(e) => { setLocalValue(e.target.value); onChange(e.target.value, 'update'); }}
          onBlur={() => onChange(localValue, 'commit')} placeholder={placeholder}
          className="w-full bg-gray-800 border border-gray-700 rounded p-1.5 text-xs text-white focus:border-blue-500"
        />
      )}
    </div>
  );
};

const NumberUnitInput = ({ label, value = '', onChange }) => {
  const match = String(value).match(/^([-\d.]+)([a-z%]*)$/i) || [null, '', 'px'];
  const num = match[1]; const unit = match[2] || 'px';

  return (
    <div>
      {label && <label className="block text-xs text-gray-400 mb-1">{label}</label>}
      <div className="flex bg-gray-800 border border-gray-700 rounded overflow-hidden">
        <input
          type="number" value={num} onFocus={() => onChange(value, 'start')}
          onChange={(e) => onChange(e.target.value ? `${e.target.value}${unit}` : '', 'update')}
          onBlur={(e) => onChange(e.target.value ? `${e.target.value}${unit}` : '', 'commit')}
          className="w-full bg-transparent p-1.5 text-xs text-white focus:outline-none"
        />
        <select
          value={unit} onFocus={() => onChange(value, 'start')}
          onChange={(e) => onChange(num ? `${num}${e.target.value}` : '', 'commit')}
          className="bg-gray-700 text-gray-300 text-[11px] border-l border-gray-600 focus:outline-none px-1"
        >
          <option value="px">px</option><option value="%">%</option><option value="rem">rem</option><option value="vh">vh</option><option value="vw">vw</option>
        </select>
      </div>
    </div>
  );
};

const RightSidebar = ({ builder }) => {
  const { selectedId, selectedIds, activePage, actions, deviceMode, project } = builder;
  const [symbolName, setSymbolName] = useState('');
  const [boxLinked, setBoxLinked] = useState(false);

  const findNode = useCallback((nodes, id) => {
    for (const n of nodes) {
      if (n.id === id) return n;
      if (n.children) { const found = findNode(n.children, id); if (found) return found; }
    }
    return null;
  }, []);

  let selectedNode = selectedId === activePage.rootNode.id ? activePage.rootNode : selectedId ? findNode(activePage.rootNode.children, selectedId) : null;

  if (!selectedNode) {
    return (
      <div className="w-72 bg-gray-900 border-l border-gray-800 flex flex-col items-center justify-center text-gray-500 p-6 text-center shrink-0 z-20">
        <MousePointer2 className="w-8 h-8 mb-3 opacity-40" />
        <p className="text-xs leading-relaxed">Select any element on the canvas (or Shift+Click multiple elements) to inspect and customize its layout, box model, and properties.</p>
      </div>
    );
  }

  const targetMode = deviceMode === 'desktop' ? 'base' : deviceMode;
  const modeSpecificStyles = selectedNode.styles?.[targetMode] || {};
  const isOverridden = (key) => deviceMode !== 'desktop' && modeSpecificStyles[key] !== undefined && modeSpecificStyles[key] !== '';

  const OverrideBadge = ({ propKey, label }) => (
    <div className="flex items-center justify-between mb-1">
      <label className="text-xs text-gray-400 flex items-center gap-1">
        <span>{label}</span>
        {isOverridden(propKey) && (
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title={`Overridden on ${deviceMode}`} />
        )}
      </label>
      {isOverridden(propKey) && (
        <button
          type="button"
          onClick={() => actions.resetStyleProperty(selectedNode.id, propKey)}
          className="text-[9px] text-amber-400 hover:underline"
          title="Reset override to inherit Desktop base value"
        >
          Reset
        </button>
      )}
    </div>
  );

  const updateStyle = (key, value, mode = 'instant') => {
    actions.updateNode(selectedNode.id, { styles: { [targetMode]: { [key]: value } } }, mode);
  };

  const updateProp = (key, value, mode = 'instant') => actions.updateNode(selectedNode.id, { props: { [key]: value } }, mode);
  const updateName = (name, mode = 'instant') => actions.updateNode(selectedNode.id, { name }, mode);
  const currentStyle = actions.getComputedStyles(selectedNode, deviceMode) || {};
  const colorValue = (val) => (val && val.startsWith('#') && val.length === 7) ? val : '#ffffff';

  const applyPresetStyles = (presetStyles) => {
    actions.saveToHistory(null, 'start');
    actions.updateNode(selectedNode.id, { styles: { [targetMode]: presetStyles } }, 'update');
    actions.saveToHistory(null, 'commit');
  };

  return (
    <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col h-full shrink-0 z-20 overflow-y-auto">
      <div className="p-3.5 border-b border-gray-800 flex flex-col gap-2 sticky top-0 bg-gray-900 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">{selectedNode.type} ({deviceMode})</span>
            {(selectedIds || []).length > 1 && (
              <span className="text-[10px] bg-blue-600/30 text-blue-300 px-1.5 py-0.5 rounded font-bold">{selectedIds.length} Selected</span>
            )}
          </div>
          <div className="flex gap-1">
            {selectedNode.type !== ELEMENT_TYPES.PAGE && (
              <button onClick={() => actions.selectParentElement(selectedNode.id)} className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white text-[10px] font-bold" title="Select Parent Container">↑</button>
            )}
            <button onClick={actions.copyElement} className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white" title="Copy (Ctrl+C)"><Copy className="w-3.5 h-3.5" /></button>
            <button onClick={actions.pasteElement} className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white" title="Paste (Ctrl+V)"><Clipboard className="w-3.5 h-3.5" /></button>
            <button onClick={actions.duplicateElement} className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white" title="Duplicate (Ctrl+D)"><PlusCircle className="w-3.5 h-3.5" /></button>
            <button onClick={() => actions.removeElement(selectedNode.id)} className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-red-400" title="Delete (Del)"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        </div>
        <DebouncedTextInput value={selectedNode.name} onChange={updateName} placeholder="Layer Name" />

        {selectedNode.type !== ELEMENT_TYPES.PAGE && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-1">
              <input type="text" placeholder="Symbol name..." value={symbolName} onChange={(e) => setSymbolName(e.target.value)} className="flex-1 bg-gray-800 border border-gray-700 rounded p-1 text-xs text-white" />
              <button onClick={() => { actions.saveAsComponent(symbolName); setSymbolName(''); }} className="bg-gray-800 hover:bg-gray-700 text-blue-400 border border-gray-700 px-2 py-1 rounded text-xs flex items-center gap-1 shrink-0">
                <Box className="w-3 h-3" /> Save Symbol
              </button>
            </div>
            {selectedNode.props?.symbolId && (
              <div className="p-2 bg-indigo-950/50 border border-indigo-500/40 rounded flex items-center justify-between gap-2 text-[11px]">
                <span className="text-indigo-200 truncate">Linked: <strong>{selectedNode.props.symbolName || 'Symbol'}</strong></span>
                <button
                  onClick={() => actions.syncLinkedSymbolInstances(selectedNode.props.symbolId)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-0.5 rounded text-[10px] font-semibold shrink-0"
                  title="Push changes from this instance to all linked instances across pages"
                >
                  Sync All Instances
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <PropGroup title="Alignment & Distribution">
        <div className="grid grid-cols-6 gap-1">
          <button onClick={() => actions.alignSelectedElements('left')} className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded flex justify-center text-gray-300" title="Align Left"><AlignLeft className="w-3.5 h-3.5" /></button>
          <button onClick={() => actions.alignSelectedElements('center')} className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded flex justify-center text-gray-300" title="Align Horizontal Center"><AlignCenter className="w-3.5 h-3.5" /></button>
          <button onClick={() => actions.alignSelectedElements('right')} className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded flex justify-center text-gray-300" title="Align Right"><AlignRight className="w-3.5 h-3.5" /></button>
          <button onClick={() => actions.alignSelectedElements('top')} className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded flex justify-center text-gray-300 text-[10px] font-bold" title="Align Top">Top</button>
          <button onClick={() => actions.alignSelectedElements('middle')} className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded flex justify-center text-gray-300 text-[10px] font-bold" title="Align Vertical Middle">Mid</button>
          <button onClick={() => actions.alignSelectedElements('bottom')} className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded flex justify-center text-gray-300 text-[10px] font-bold" title="Align Bottom">Bot</button>
        </div>
        <div className="grid grid-cols-4 gap-1 pt-1">
          <button onClick={() => actions.alignSelectedElements('distribute-h')} className="p-1 bg-gray-800 hover:bg-gray-700 rounded text-[10px] text-gray-300" title="Distribute Horizontally">Dist H</button>
          <button onClick={() => actions.alignSelectedElements('distribute-v')} className="p-1 bg-gray-800 hover:bg-gray-700 rounded text-[10px] text-gray-300" title="Distribute Vertically">Dist V</button>
          <button onClick={() => actions.alignSelectedElements('match-width')} className="p-1 bg-gray-800 hover:bg-gray-700 rounded text-[10px] text-gray-300" title="Match Widths">Match W</button>
          <button onClick={() => actions.alignSelectedElements('match-height')} className="p-1 bg-gray-800 hover:bg-gray-700 rounded text-[10px] text-gray-300" title="Match Heights">Match H</button>
        </div>
      </PropGroup>

      {['text', 'button'].includes(selectedNode.type) && (
        <PropGroup title="Content & Links">
          <DebouncedTextInput label="Text Content" value={selectedNode.props?.content || ''} onChange={(val, mode) => updateProp('content', val, mode)} multiline />
          {selectedNode.type === 'text' && (
            <div>
              <label className="block text-xs text-gray-400 mb-1">Semantic Tag</label>
              <select value={selectedNode.props?.tag || 'p'} onChange={(e) => updateProp('tag', e.target.value, 'instant')} className="w-full bg-gray-800 border border-gray-700 rounded p-1.5 text-xs text-white">
                <option value="h1">H1 - Main Heading</option>
                <option value="h2">H2 - Section Title</option>
                <option value="h3">H3 - Subheading</option>
                <option value="p">P - Paragraph</option>
              </select>
            </div>
          )}
          {selectedNode.type === 'button' && (
            <>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Navigate to Internal Page</label>
                <select
                  value={selectedNode.props?.href?.startsWith('page:') ? selectedNode.props.href : ''}
                  onChange={(e) => updateProp('href', e.target.value || '#', 'instant')}
                  className="w-full bg-gray-800 border border-gray-700 rounded p-1.5 text-xs text-white"
                >
                  <option value="">Custom External URL</option>
                  {project.pages.map(p => (
                    <option key={p.id} value={`page:${p.id}`}>Page: {p.name} ({p.slug}.html)</option>
                  ))}
                </select>
              </div>
              <DebouncedTextInput label="Target URL / Href" value={selectedNode.props?.href || '#'} onChange={(val, mode) => updateProp('href', val, mode)} />
            </>
          )}
        </PropGroup>
      )}

      {selectedNode.type === 'image' && (
        <PropGroup title="Image Asset & Library">
          <DebouncedTextInput label="Image Source URL" value={selectedNode.props?.src || ''} onChange={(val, mode) => updateProp('src', val, mode)} />
          <div>
            <label className="block text-xs text-gray-400 mb-1">Choose from Project Asset Library</label>
            <select
              value=""
              onChange={(e) => {
                const chosen = (project.assets || []).find(a => a.id === e.target.value);
                if (chosen) {
                  updateProp('src', chosen.url, 'instant');
                  updateProp('alt', chosen.alt, 'instant');
                }
              }}
              className="w-full bg-gray-800 border border-gray-700 rounded p-1.5 text-xs text-white"
            >
              <option value="">Select saved project image...</option>
              {(project.assets || []).map(a => (
                <option key={a.id} value={a.id}>{a.name} ({a.folder})</option>
              ))}
            </select>
          </div>
          <DebouncedTextInput label="Accessibility Alt Text" value={selectedNode.props?.alt || ''} onChange={(val, mode) => updateProp('alt', val, mode)} placeholder="Describe the image..." />
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Object Fit</label>
              <select value={currentStyle.objectFit || 'cover'} onChange={(e) => updateStyle('objectFit', e.target.value, 'instant')} className="w-full bg-gray-800 border border-gray-700 rounded p-1.5 text-xs text-white">
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
                <option value="fill">Fill</option>
                <option value="none">None</option>
              </select>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-1.5 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(selectedNode.props?.aspectRatioLocked)}
                  onChange={(e) => updateProp('aspectRatioLocked', e.target.checked, 'instant')}
                />
                <span>Lock Aspect Ratio</span>
              </label>
            </div>
          </div>
        </PropGroup>
      )}

      {['text', 'button', 'image'].includes(selectedNode.type) && (
        <PropGroup title="CMS Data Binding" defaultOpen={false}>
          <div className="space-y-2">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Bind to Collection</label>
              <select
                value={selectedNode.props?.cmsBinding?.collectionId || ''}
                onChange={(e) => {
                  const colId = e.target.value;
                  if (!colId) {
                    updateProp('cmsBinding', null, 'instant');
                  } else {
                    const col = (project.collections || []).find(c => c.id === colId);
                    updateProp('cmsBinding', {
                      collectionId: colId,
                      fieldKey: col?.fields?.[0]?.key || 'title',
                      recordId: 'context'
                    }, 'instant');
                  }
                }}
                className="w-full bg-gray-800 border border-gray-700 rounded p-1.5 text-xs text-white"
              >
                <option value="">None (Static Content)</option>
                {(project.collections || []).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            {selectedNode.props?.cmsBinding?.collectionId && (() => {
              const boundCol = (project.collections || []).find(c => c.id === selectedNode.props.cmsBinding.collectionId);
              return (
                <>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Field</label>
                    <select
                      value={selectedNode.props.cmsBinding.fieldKey || 'title'}
                      onChange={(e) => updateProp('cmsBinding', { ...selectedNode.props.cmsBinding, fieldKey: e.target.value }, 'instant')}
                      className="w-full bg-gray-800 border border-gray-700 rounded p-1.5 text-xs text-white"
                    >
                      {(boundCol?.fields || []).map(f => (
                        <option key={f.key} value={f.key}>{f.name} ({f.type})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Record Source</label>
                    <select
                      value={selectedNode.props.cmsBinding.recordId || 'context'}
                      onChange={(e) => updateProp('cmsBinding', { ...selectedNode.props.cmsBinding, recordId: e.target.value }, 'instant')}
                      className="w-full bg-gray-800 border border-gray-700 rounded p-1.5 text-xs text-white"
                    >
                      <option value="context">Active Template Record (or First Item)</option>
                      {(boundCol?.items || []).map(it => (
                        <option key={it.id} value={it.id}>{it.title}</option>
                      ))}
                    </select>
                  </div>
                </>
              );
            })()}
          </div>
        </PropGroup>
      )}

      <PropGroup title="Layout Engine (Flex, Grid & Child)">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <OverrideBadge propKey="display" label="Display Mode" />
            <select value={currentStyle.display || 'block'} onChange={(e) => updateStyle('display', e.target.value, 'instant')} className="w-full bg-gray-800 border border-gray-700 rounded p-1.5 text-xs text-white">
              <option value="block">Block</option>
              <option value="flex">Flexbox</option>
              <option value="grid">CSS Grid</option>
              <option value="inline-block">Inline Block</option>
              <option value="none">Hidden (Display None)</option>
            </select>
          </div>
          <div>
            <OverrideBadge propKey="overflow" label="Overflow" />
            <select value={currentStyle.overflow || 'visible'} onChange={(e) => updateStyle('overflow', e.target.value, 'instant')} className="w-full bg-gray-800 border border-gray-700 rounded p-1.5 text-xs text-white">
              <option value="visible">Visible</option>
              <option value="hidden">Hidden (Clip)</option>
              <option value="auto">Auto Scroll</option>
              <option value="scroll">Scroll</option>
            </select>
          </div>
        </div>

        {currentStyle.display === 'flex' && (
          <div className="space-y-2 mt-2 p-2.5 bg-gray-800/40 border border-gray-700/80 rounded-lg">
            <div className="text-[10px] font-bold uppercase text-blue-400">Flex Container Controls</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <OverrideBadge propKey="flexDirection" label="Direction" />
                <select value={currentStyle.flexDirection || 'column'} onChange={(e) => updateStyle('flexDirection', e.target.value, 'instant')} className="w-full bg-gray-800 border border-gray-700 rounded p-1.5 text-xs text-white">
                  <option value="row">Row (Horizontal)</option>
                  <option value="column">Column (Vertical)</option>
                  <option value="row-reverse">Row Reverse</option>
                  <option value="column-reverse">Column Reverse</option>
                </select>
              </div>
              <div>
                <OverrideBadge propKey="flexWrap" label="Wrap" />
                <select value={currentStyle.flexWrap || 'nowrap'} onChange={(e) => updateStyle('flexWrap', e.target.value, 'instant')} className="w-full bg-gray-800 border border-gray-700 rounded p-1.5 text-xs text-white">
                  <option value="nowrap">No Wrap</option>
                  <option value="wrap">Wrap</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <OverrideBadge propKey="justifyContent" label="Justify (Main)" />
                <select value={currentStyle.justifyContent || 'flex-start'} onChange={(e) => updateStyle('justifyContent', e.target.value, 'instant')} className="w-full bg-gray-800 border border-gray-700 rounded p-1.5 text-xs text-white">
                  <option value="flex-start">Start</option>
                  <option value="center">Center</option>
                  <option value="flex-end">End</option>
                  <option value="space-between">Space Between</option>
                  <option value="space-around">Space Around</option>
                  <option value="space-evenly">Space Evenly</option>
                </select>
              </div>
              <div>
                <OverrideBadge propKey="alignItems" label="Align (Cross)" />
                <select value={currentStyle.alignItems || 'stretch'} onChange={(e) => updateStyle('alignItems', e.target.value, 'instant')} className="w-full bg-gray-800 border border-gray-700 rounded p-1.5 text-xs text-white">
                  <option value="stretch">Stretch</option>
                  <option value="flex-start">Start</option>
                  <option value="center">Center</option>
                  <option value="flex-end">End</option>
                  <option value="baseline">Baseline</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <NumberUnitInput label="Gap" value={currentStyle.gap || ''} onChange={(val, mode) => updateStyle('gap', val, mode)} />
              <NumberUnitInput label="Row Gap" value={currentStyle.rowGap || ''} onChange={(val, mode) => updateStyle('rowGap', val, mode)} />
              <NumberUnitInput label="Col Gap" value={currentStyle.columnGap || ''} onChange={(val, mode) => updateStyle('columnGap', val, mode)} />
            </div>
          </div>
        )}

        {currentStyle.display === 'grid' && (
          <div className="space-y-2 mt-2 p-2.5 bg-gray-800/40 border border-gray-700/80 rounded-lg">
            <div className="text-[10px] font-bold uppercase text-purple-400">CSS Grid Container Controls</div>
            <DebouncedTextInput label="Grid Columns (e.g. repeat(3, 1fr))" value={currentStyle.gridTemplateColumns || ''} onChange={(val, mode) => updateStyle('gridTemplateColumns', val, mode)} placeholder="repeat(3, 1fr)" />
            <DebouncedTextInput label="Grid Rows (e.g. auto)" value={currentStyle.gridTemplateRows || ''} onChange={(val, mode) => updateStyle('gridTemplateRows', val, mode)} placeholder="auto" />
            <div className="grid grid-cols-3 gap-1.5">
              <NumberUnitInput label="Gap" value={currentStyle.gap || ''} onChange={(val, mode) => updateStyle('gap', val, mode)} />
              <NumberUnitInput label="Row Gap" value={currentStyle.rowGap || ''} onChange={(val, mode) => updateStyle('rowGap', val, mode)} />
              <NumberUnitInput label="Col Gap" value={currentStyle.columnGap || ''} onChange={(val, mode) => updateStyle('columnGap', val, mode)} />
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-gray-800 space-y-2">
          <div className="text-[10px] font-bold uppercase text-gray-400">Flex & Grid Child Item Placement</div>
          <div className="grid grid-cols-3 gap-1.5">
            <DebouncedTextInput label="Flex Grow" value={currentStyle.flexGrow || ''} onChange={(val, mode) => updateStyle('flexGrow', val, mode)} placeholder="0" />
            <DebouncedTextInput label="Flex Shrink" value={currentStyle.flexShrink || ''} onChange={(val, mode) => updateStyle('flexShrink', val, mode)} placeholder="1" />
            <DebouncedTextInput label="Flex Basis" value={currentStyle.flexBasis || ''} onChange={(val, mode) => updateStyle('flexBasis', val, mode)} placeholder="auto" />
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <DebouncedTextInput label="Align Self" value={currentStyle.alignSelf || ''} onChange={(val, mode) => updateStyle('alignSelf', val, mode)} placeholder="auto" />
            <DebouncedTextInput label="Grid Col Span" value={currentStyle.gridColumn || ''} onChange={(val, mode) => updateStyle('gridColumn', val, mode)} placeholder="span 1" />
            <DebouncedTextInput label="Order" value={currentStyle.order || ''} onChange={(val, mode) => updateStyle('order', val, mode)} placeholder="0" />
          </div>
        </div>
      </PropGroup>

      <PropGroup title="Size & Visual Box Model">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <OverrideBadge propKey="width" label="Width" />
            <NumberUnitInput value={currentStyle.width || ''} onChange={(val, mode) => updateStyle('width', val, mode)} />
          </div>
          <div>
            <OverrideBadge propKey="height" label="Height" />
            <NumberUnitInput value={currentStyle.height || ''} onChange={(val, mode) => updateStyle('height', val, mode)} />
          </div>
          <NumberUnitInput label="Min Width" value={currentStyle.minWidth || ''} onChange={(val, mode) => updateStyle('minWidth', val, mode)} />
          <NumberUnitInput label="Max Width" value={currentStyle.maxWidth || ''} onChange={(val, mode) => updateStyle('maxWidth', val, mode)} />
          <NumberUnitInput label="Min Height" value={currentStyle.minHeight || ''} onChange={(val, mode) => updateStyle('minHeight', val, mode)} />
          <NumberUnitInput label="Max Height" value={currentStyle.maxHeight || ''} onChange={(val, mode) => updateStyle('maxHeight', val, mode)} />
        </div>

        <div className="mt-3 p-2.5 bg-gray-950 border border-gray-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-amber-400">Box Model (Margin & Padding)</span>
            <label className="flex items-center gap-1 text-[10px] text-gray-400 cursor-pointer">
              <input type="checkbox" checked={boxLinked} onChange={e => setBoxLinked(e.target.checked)} />
              <span>Link All Sides</span>
            </label>
          </div>

          <div className="p-2 border border-dashed border-amber-500/40 rounded-lg bg-amber-950/10 space-y-1.5">
            <div className="text-[9px] font-bold uppercase text-amber-300 text-center">Margin (Outer)</div>
            <div className="grid grid-cols-4 gap-1">
              <input type="text" placeholder="Top" value={currentStyle.marginTop || ''} onChange={e => { const v = e.target.value; if (boxLinked) updateStyle('margin', v, 'instant'); else updateStyle('marginTop', v, 'instant'); }} className="bg-gray-900 border border-gray-700 rounded p-1 text-[10px] text-center text-white" title="Margin Top" />
              <input type="text" placeholder="Right" value={currentStyle.marginRight || ''} onChange={e => { const v = e.target.value; if (boxLinked) updateStyle('margin', v, 'instant'); else updateStyle('marginRight', v, 'instant'); }} className="bg-gray-900 border border-gray-700 rounded p-1 text-[10px] text-center text-white" title="Margin Right" />
              <input type="text" placeholder="Bottom" value={currentStyle.marginBottom || ''} onChange={e => { const v = e.target.value; if (boxLinked) updateStyle('margin', v, 'instant'); else updateStyle('marginBottom', v, 'instant'); }} className="bg-gray-900 border border-gray-700 rounded p-1 text-[10px] text-center text-white" title="Margin Bottom" />
              <input type="text" placeholder="Left" value={currentStyle.marginLeft || ''} onChange={e => { const v = e.target.value; if (boxLinked) updateStyle('margin', v, 'instant'); else updateStyle('marginLeft', v, 'instant'); }} className="bg-gray-900 border border-gray-700 rounded p-1 text-[10px] text-center text-white" title="Margin Left" />
            </div>

            <div className="p-2 border border-blue-500/40 rounded bg-blue-950/10 space-y-1.5">
              <div className="text-[9px] font-bold uppercase text-blue-300 text-center">Padding (Inner)</div>
              <div className="grid grid-cols-4 gap-1">
                <input type="text" placeholder="Top" value={currentStyle.paddingTop || ''} onChange={e => { const v = e.target.value; if (boxLinked) updateStyle('padding', v, 'instant'); else updateStyle('paddingTop', v, 'instant'); }} className="bg-gray-900 border border-gray-700 rounded p-1 text-[10px] text-center text-white" title="Padding Top" />
                <input type="text" placeholder="Right" value={currentStyle.paddingRight || ''} onChange={e => { const v = e.target.value; if (boxLinked) updateStyle('padding', v, 'instant'); else updateStyle('paddingRight', v, 'instant'); }} className="bg-gray-900 border border-gray-700 rounded p-1 text-[10px] text-center text-white" title="Padding Right" />
                <input type="text" placeholder="Bottom" value={currentStyle.paddingBottom || ''} onChange={e => { const v = e.target.value; if (boxLinked) updateStyle('padding', v, 'instant'); else updateStyle('paddingBottom', v, 'instant'); }} className="bg-gray-900 border border-gray-700 rounded p-1 text-[10px] text-center text-white" title="Padding Bottom" />
                <input type="text" placeholder="Left" value={currentStyle.paddingLeft || ''} onChange={e => { const v = e.target.value; if (boxLinked) updateStyle('padding', v, 'instant'); else updateStyle('paddingLeft', v, 'instant'); }} className="bg-gray-900 border border-gray-700 rounded p-1 text-[10px] text-center text-white" title="Padding Left" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <DebouncedTextInput label="Padding Shorthand" value={currentStyle.padding || ''} onChange={(val, mode) => updateStyle('padding', val, mode)} placeholder="2rem 1rem" />
            <DebouncedTextInput label="Margin Shorthand" value={currentStyle.margin || ''} onChange={(val, mode) => updateStyle('margin', val, mode)} placeholder="0 auto" />
          </div>
        </div>
      </PropGroup>

      <PropGroup title="Typography & Colors">
        <div>
          <OverrideBadge propKey="fontFamily" label="Font Family" />
          <select value={currentStyle.fontFamily || ''} onChange={(e) => updateStyle('fontFamily', e.target.value, 'instant')} className="w-full bg-gray-800 border border-gray-700 rounded p-1.5 text-xs text-white">
            <option value="">Inherit Project Font</option>
            <option value="system-ui, -apple-system, sans-serif">System Sans (Inter / SF)</option>
            <option value="Georgia, Cambria, serif">Editorial Serif (Georgia)</option>
            <option value="ui-monospace, SFMono-Regular, monospace">Monospace Code</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <OverrideBadge propKey="fontSize" label="Font Size" />
            <NumberUnitInput value={currentStyle.fontSize || ''} onChange={(val, mode) => updateStyle('fontSize', val, mode)} />
          </div>
          <div>
            <OverrideBadge propKey="fontWeight" label="Font Weight" />
            <select value={currentStyle.fontWeight || '400'} onChange={(e) => updateStyle('fontWeight', e.target.value, 'instant')} className="w-full bg-gray-800 border border-gray-700 rounded p-1.5 text-xs text-white">
              <option value="300">300 - Light</option>
              <option value="400">400 - Regular</option>
              <option value="500">500 - Medium</option>
              <option value="600">600 - Semibold</option>
              <option value="700">700 - Bold</option>
              <option value="800">800 - ExtraBold</option>
            </select>
          </div>
          <DebouncedTextInput label="Line Height" value={currentStyle.lineHeight || ''} onChange={(val, mode) => updateStyle('lineHeight', val, mode)} placeholder="1.5" />
          <NumberUnitInput label="Letter Spacing" value={currentStyle.letterSpacing || ''} onChange={(val, mode) => updateStyle('letterSpacing', val, mode)} />
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Align</label>
            <select value={currentStyle.textAlign || 'left'} onChange={(e) => updateStyle('textAlign', e.target.value, 'instant')} className="w-full bg-gray-800 border border-gray-700 rounded p-1.5 text-xs text-white">
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="justify">Justify</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Transform</label>
            <select value={currentStyle.textTransform || 'none'} onChange={(e) => updateStyle('textTransform', e.target.value, 'instant')} className="w-full bg-gray-800 border border-gray-700 rounded p-1.5 text-xs text-white">
              <option value="none">None</option>
              <option value="uppercase">UPPERCASE</option>
              <option value="capitalize">Capitalize</option>
              <option value="lowercase">lowercase</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Decoration</label>
            <select value={currentStyle.textDecoration || 'none'} onChange={(e) => updateStyle('textDecoration', e.target.value, 'instant')} className="w-full bg-gray-800 border border-gray-700 rounded p-1.5 text-xs text-white">
              <option value="none">None</option>
              <option value="underline">Underline</option>
              <option value="line-through">Strikethrough</option>
            </select>
          </div>
        </div>
        <div>
          <OverrideBadge propKey="color" label="Text Color" />
          <div className="flex gap-2">
            <input type="color" value={colorValue(currentStyle.color)} onChange={(e) => updateStyle('color', e.target.value, 'instant')} className="w-8 h-8 rounded bg-transparent cursor-pointer shrink-0" />
            <DebouncedTextInput value={currentStyle.color || ''} onChange={(val, mode) => updateStyle('color', val, mode)} placeholder="#0f172a" />
          </div>
        </div>
        <div>
          <OverrideBadge propKey="backgroundColor" label="Background Color" />
          <div className="flex gap-2">
            <input type="color" value={colorValue(currentStyle.backgroundColor)} onChange={(e) => updateStyle('backgroundColor', e.target.value, 'instant')} className="w-8 h-8 rounded bg-transparent cursor-pointer shrink-0" />
            <DebouncedTextInput value={currentStyle.backgroundColor || ''} onChange={(val, mode) => updateStyle('backgroundColor', val, mode)} placeholder="#ffffff" />
          </div>
        </div>
      </PropGroup>

      <PropGroup title="Borders, Shadows & Stacking (Z-Index)" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-2">
          <NumberUnitInput label="Border Radius" value={currentStyle.borderRadius || ''} onChange={(val, mode) => updateStyle('borderRadius', val, mode)} />
          <DebouncedTextInput label="Border (CSS)" value={currentStyle.border || ''} onChange={(val, mode) => updateStyle('border', val, mode)} placeholder="1px solid #e2e8f0" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <DebouncedTextInput label="Box Shadow" value={currentStyle.boxShadow || ''} onChange={(val, mode) => updateStyle('boxShadow', val, mode)} placeholder="0 4px 12px rgba(0,0,0,0.08)" />
          <DebouncedTextInput label="Opacity (0 - 1)" value={currentStyle.opacity || ''} onChange={(val, mode) => updateStyle('opacity', val, mode)} placeholder="1" />
        </div>
        <div className="pt-2 border-t border-gray-800 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <OverrideBadge propKey="position" label="Position Mode" />
              <select value={currentStyle.position || 'static'} onChange={(e) => updateStyle('position', e.target.value, 'instant')} className="w-full bg-gray-800 border border-gray-700 rounded p-1.5 text-xs text-white">
                <option value="static">Static (Flow)</option>
                <option value="relative">Relative</option>
                <option value="absolute">Absolute</option>
                <option value="sticky">Sticky</option>
              </select>
            </div>
            <DebouncedTextInput label="Z-Index" value={currentStyle.zIndex || ''} onChange={(val, mode) => updateStyle('zIndex', val, mode)} placeholder="auto" />
          </div>
          {currentStyle.position === 'absolute' && (
            <div className="p-2 bg-amber-950/40 border border-amber-500/40 rounded text-[10px] text-amber-200">
              Note: Absolute positioning removes this element from normal Flexbox/Grid flow. Use Arrow keys (or Shift+Arrow) to nudge.
            </div>
          )}
          {currentStyle.position && currentStyle.position !== 'static' && (
            <div className="grid grid-cols-4 gap-1">
              <NumberUnitInput label="Top" value={currentStyle.top || ''} onChange={(val, mode) => updateStyle('top', val, mode)} />
              <NumberUnitInput label="Right" value={currentStyle.right || ''} onChange={(val, mode) => updateStyle('right', val, mode)} />
              <NumberUnitInput label="Bottom" value={currentStyle.bottom || ''} onChange={(val, mode) => updateStyle('bottom', val, mode)} />
              <NumberUnitInput label="Left" value={currentStyle.left || ''} onChange={(val, mode) => updateStyle('left', val, mode)} />
            </div>
          )}
        </div>
      </PropGroup>
    </div>
  );
};

const PlatformModals = ({ builder }) => {
  const { activeModal, setActiveModal, project, projectsList, actions, setActivePageId, setSelectedId } = builder;
  const [newSiteName, setNewSiteName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('saas');

  // Phase 10: Project Dashboard, Backup Import, Design System, Snapshots & Team State
  const [projSearch, setProjSearch] = useState('');
  const [projFilter, setProjFilter] = useState('active'); // 'active' | 'archived'
  const [confirmDeleteProjId, setConfirmDeleteProjId] = useState(null);
  const [renamingProjId, setRenamingProjId] = useState(null);
  const [renameProjValue, setRenameProjValue] = useState('');
  const [importedBackupPreview, setImportedBackupPreview] = useState(null);
  const [importError, setImportError] = useState('');

  const [draftTokens, setDraftTokens] = useState(() => clone(project.designTokens || DEFAULT_DESIGN_TOKENS));
  const [newTokenPresetName, setNewTokenPresetName] = useState('');
  const [snapLabel, setSnapLabel] = useState('');
  const [snapDesc, setSnapDesc] = useState('');
  const [confirmRestoreSnapId, setConfirmRestoreSnapId] = useState(null);
  const [collabName, setCollabName] = useState('');
  const [collabEmail, setCollabEmail] = useState('');
  const [collabRole, setCollabRole] = useState('Editor');

  useEffect(() => {
    setDraftTokens(clone(project.designTokens || DEFAULT_DESIGN_TOKENS));
  }, [project.id, project.designTokens]);

  // Phase 7: CMS Studio Dashboard State
  const [selectedColId, setSelectedColId] = useState(() => project.collections?.[0]?.id || 'col_blog');
  const [newColName, setNewColName] = useState('');
  const [newColPreset, setNewColPreset] = useState('blog');
  const [cmsSearch, setCmsSearch] = useState('');
  const [cmsStatusFilter, setCmsStatusFilter] = useState('all');
  const [cmsSort, setCmsSort] = useState('date_desc');
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [recordForm, setRecordForm] = useState({ title: '', slug: '', status: 'published', summary: '', body: '', category: '', image: '', date: '2026-10-13' });
  const [cmsError, setCmsError] = useState('');
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');

  // Phase 8: Commerce Studio Dashboard State
  const [commerceTab, setCommerceTab] = useState('products'); // 'products' | 'orders' | 'settings'
  const [prodSearch, setProdSearch] = useState('');
  const [prodStatusFilter, setProdStatusFilter] = useState('all');
  const [selectedProdIds, setSelectedProdIds] = useState([]);
  const [editingProdId, setEditingProdId] = useState(null);
  const [prodForm, setProdForm] = useState(null);
  const [prodError, setProdError] = useState('');
  const [newVarTitle, setNewVarTitle] = useState('');
  const [newVarPrice, setNewVarPrice] = useState('');
  const [newVarStock, setNewVarStock] = useState('10');

  // Phase 9: Publishing, Deployment, Domains & Site Settings State
  const [pubTab, setPubTab] = useState('overview'); // 'overview' | 'validation' | 'provider' | 'domains' | 'seo' | 'history'
  const [validationReport, setValidationReport] = useState(null);
  const [isBuildingProd, setIsBuildingProd] = useState(false);
  const [domainInput, setDomainInput] = useState('');
  const [domainMsg, setDomainMsg] = useState('');
  const [deployFeedback, setDeployFeedback] = useState('');

  // Phase 6: AI Website Generator Brief & Plan State
  const [aiStep, setAiStep] = useState('brief'); // 'brief' | 'review'
  const [aiBrief, setAiBrief] = useState({
    name: 'Apex Digital Studio',
    category: 'Agency',
    description: 'Full-service creative design and web engineering studio helping ambitious brands launch high-converting digital products.',
    audience: 'Startup founders, marketing directors, and growing brands',
    style: 'modern_light',
    primaryColor: '#2563eb',
    pages: ['Home', 'Services', 'Portfolio', 'Contact'],
    features: ['features', 'services', 'gallery', 'testimonials', 'faq', 'contactForm'],
    language: 'English',
    layoutPriority: 'desktop-first'
  });
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [planValidation, setPlanValidation] = useState({ valid: true, errors: [] });
  const [applyMode, setApplyMode] = useState('new'); // 'new' | 'replace'
  const [customPageInput, setCustomPageInput] = useState('');

  if (!activeModal) return null;

  const toggleBriefList = (key, val) => {
    setAiBrief(prev => {
      const exists = prev[key].includes(val);
      return { ...prev, [key]: exists ? prev[key].filter(i => i !== val) : [...prev[key], val] };
    });
  };

  const handleCreatePlan = () => {
    const plan = generateStructuredWebsitePlan(aiBrief);
    const validation = validateWebsitePlan(plan);
    setGeneratedPlan(plan);
    setPlanValidation(validation);
    setAiStep('review');
  };

  const handleAddPageToPlan = () => {
    if (!customPageInput.trim() || !generatedPlan) return;
    const clean = customPageInput.trim();
    const slug = clean.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `page-${generatedPlan.sitemap.length + 1}`;
    const updatedPlan = clone(generatedPlan);
    updatedPlan.sitemap.push({
      id: `page_${slug}_${updatedPlan.sitemap.length}`,
      name: clean,
      slug,
      seoTitle: `${updatedPlan.siteSettings.name} — ${clean}`,
      seoDesc: updatedPlan.siteSettings.description.slice(0, 140),
      sections: ['navbar', 'hero', 'features', 'footer']
    });
    setGeneratedPlan(updatedPlan);
    setPlanValidation(validateWebsitePlan(updatedPlan));
    setCustomPageInput('');
  };

  const handleRemovePageFromPlan = (pageId) => {
    if (!generatedPlan || generatedPlan.sitemap.length <= 1) return;
    const updatedPlan = clone(generatedPlan);
    updatedPlan.sitemap = updatedPlan.sitemap.filter(p => p.id !== pageId);
    setGeneratedPlan(updatedPlan);
    setPlanValidation(validateWebsitePlan(updatedPlan));
  };

  const handleAddSectionToPlanPage = (pageId, sectionKey) => {
    if (!generatedPlan) return;
    const updatedPlan = clone(generatedPlan);
    const pg = updatedPlan.sitemap.find(p => p.id === pageId);
    if (pg) {
      const footerIdx = pg.sections.lastIndexOf('footer');
      if (footerIdx !== -1) pg.sections.splice(footerIdx, 0, sectionKey);
      else pg.sections.push(sectionKey);
      setGeneratedPlan(updatedPlan);
      setPlanValidation(validateWebsitePlan(updatedPlan));
    }
  };

  const handleRemoveSectionFromPlanPage = (pageId, secIdx) => {
    if (!generatedPlan) return;
    const updatedPlan = clone(generatedPlan);
    const pg = updatedPlan.sitemap.find(p => p.id === pageId);
    if (pg && pg.sections.length > 1) {
      pg.sections.splice(secIdx, 1);
      setGeneratedPlan(updatedPlan);
      setPlanValidation(validateWebsitePlan(updatedPlan));
    }
  };

  const runSiteAudit = () => {
    const findings = [];
    project.pages.forEach(p => {
      if (!p.seoTitle || p.seoTitle.trim().length < 3) {
        findings.push({ type: 'warn', page: p.name, msg: 'Page is missing a descriptive SEO Title.' });
      }
      let h1Count = 0;
      const walk = (node) => {
        if (node.type === ELEMENT_TYPES.TEXT && node.props?.tag === 'h1') h1Count++;
        if (node.type === ELEMENT_TYPES.IMAGE && (!node.props?.alt || !node.props.alt.trim())) {
          findings.push({ type: 'warn', page: p.name, msg: `Image "${node.name}" is missing accessibility alt text.` });
        }
        if (node.type === ELEMENT_TYPES.BUTTON && (!node.props?.href || node.props.href === '#')) {
          findings.push({ type: 'info', page: p.name, msg: `Button "${node.name}" points to placeholder '#' link.` });
        }
        if (node.children) node.children.forEach(walk);
      };
      walk(p.rootNode);
      if (h1Count === 0) findings.push({ type: 'warn', page: p.name, msg: 'No H1 heading found on page for semantic hierarchy.' });
    });
    if (findings.length === 0) {
      findings.push({ type: 'pass', page: 'All Pages', msg: 'All semantic, accessibility, and SEO checks passed!' });
    }
    return findings;
  };

  const handleRunValidation = () => {
    const report = runPrePublishValidation(project);
    setValidationReport(report);
    actions.updatePublishingConfig({
      status: report.canBuild ? 'ready_to_publish' : 'failed'
    });
    return report;
  };

  const handleRunProductionBuild = async (downloadZip = false) => {
    const report = handleRunValidation();
    if (!report.canBuild) {
      setPubTab('validation');
      return;
    }
    setIsBuildingProd(true);
    actions.updatePublishingConfig({ status: 'building' });
    try {
      const { css, htmlPages, sitemapXml, robotsTxt, readme, buildManifest } = await generateExport(project);
      actions.updatePublishingConfig({
        status: 'ready_to_publish',
        lastBuildAt: buildManifest.generatedAt,
        lastBuildArtifacts: buildManifest
      });
      if (downloadZip) {
        if (!window.JSZip) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            script.onload = resolve; script.onerror = reject;
            document.head.appendChild(script);
          });
        }
        if (window.JSZip) {
          const zip = new window.JSZip();
          zip.file("styles.css", css);
          zip.file("README.md", readme);
          zip.file("sitemap.xml", sitemapXml);
          zip.file("robots.txt", robotsTxt);
          zip.file("manifest.json", JSON.stringify(buildManifest, null, 2));
          Object.keys(htmlPages).forEach(fn => zip.file(fn, htmlPages[fn]));
          const blob = await zip.generateAsync({ type: "blob" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url; a.download = `${project.name.replace(/\s+/g, '-').toLowerCase()}-production-build.zip`;
          a.click(); URL.revokeObjectURL(url);
        }
      }
      setDeployFeedback(`Production build succeeded (${buildManifest.files.length} files compiled).`);
    } catch (e) {
      actions.updatePublishingConfig({ status: 'failed' });
      setDeployFeedback(`Build failed: ${e.message}`);
    }
    setIsBuildingProd(false);
  };

  const handleAttemptProviderDeploy = async (targetEnv = 'production') => {
    const report = handleRunValidation();
    if (!report.canBuild) {
      setPubTab('validation');
      return;
    }
    const pub = project.publishing || DEFAULT_PUBLISHING_STATE;
    const provider = HOSTING_PROVIDERS[pub.providerId] || HOSTING_PROVIDERS.netlify;

    if (!pub.providerConnected) {
      const failedEntry = {
        id: 'dep_' + Math.random().toString(36).substr(2, 8),
        timestamp: new Date().toISOString(),
        environment: targetEnv,
        provider: provider.name,
        status: 'failed',
        url: null,
        revision: `v${project.version}.${(pub.deploymentHistory?.length || 0) + 1}`,
        trigger: 'Manual Publish Request',
        errorSummary: `Deployment halted: ${provider.name} server-side credentials (${provider.requiredEnvVars.join(', ')}) are not connected in this browser sandbox. Export the Production Build ZIP to deploy.`
      };
      actions.recordDeploymentAttempt(failedEntry);
      setDeployFeedback(failedEntry.errorSummary);
      return;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-gray-200">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-950">
          <div className="flex items-center gap-2 font-bold text-sm">
            {activeModal === 'dashboard' && <><FolderKanban className="w-4 h-4 text-blue-400" /> Project Dashboard — Multi-Site Management, Templates & Backups</>}
            {activeModal === 'design_system' && <><Palette className="w-4 h-4 text-pink-400" /> Global Design System & Theme Tokens</>}
            {activeModal === 'history' && <><FileText className="w-4 h-4 text-amber-400" /> Version History Snapshots & Project Activity Log</>}
            {activeModal === 'team' && <><Settings className="w-4 h-4 text-cyan-400" /> User Roles, Permissions & Collaboration Architecture</>}
            {activeModal === 'ai' && <><Sparkles className="w-4 h-4 text-indigo-400" /> Create with AI — Structured Website Generator</>}
            {activeModal === 'cms' && <><Database className="w-4 h-4 text-purple-400" /> CMS Studio — Dynamic Collections, Schemas & Records</>}
            {activeModal === 'commerce' && <><ShoppingBag className="w-4 h-4 text-emerald-400" /> E-Commerce Studio — Products, Variants, Inventory & Orders</>}
            {activeModal === 'publishing' && <><Globe className="w-4 h-4 text-blue-400" /> Publishing, Deployment & Hosting Center</>}
            {activeModal === 'audit' && <><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Accessibility, SEO & Quality Audit</>}
          </div>
          <button onClick={() => setActiveModal(null)} className="p-1 text-gray-400 hover:text-white rounded"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeModal === 'dashboard' && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-gray-950 border border-gray-800 rounded-xl">
                <div className="text-xs text-gray-300">
                  <strong className="text-white">Quick Launch Flows:</strong> Start from a Blank Canvas, 10+ Industry Templates, AI Brief, or Import a `.nexus.json` Backup.
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveModal('ai')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Create with AI
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url; a.download = `${project.name.replace(/\s+/g, '-').toLowerCase()}-backup.nexus.json`;
                      a.click(); URL.revokeObjectURL(url);
                    }}
                    className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Export Backup (.json)
                  </button>
                  <label className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-blue-300 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" /> Import Backup
                    <input
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setImportError('');
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          try {
                            const parsed = JSON.parse(ev.target.result);
                            if (!parsed || !Array.isArray(parsed.pages)) {
                              setImportError('Invalid backup file: missing pages array.');
                            } else {
                              setImportedBackupPreview(parsed);
                            }
                          } catch (err) {
                            setImportError('Failed to parse JSON backup file.');
                          }
                        };
                        reader.readAsText(file);
                      }}
                    />
                  </label>
                </div>
              </div>

              {importError && <div className="p-3 bg-red-950/50 border border-red-500/40 rounded-lg text-xs text-red-300">{importError}</div>}

              {importedBackupPreview && (
                <div className="p-4 bg-blue-950/40 border border-blue-500/40 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-blue-300">Validated Backup Ready to Import: &quot;{importedBackupPreview.name}&quot;</div>
                    <button onClick={() => setImportedBackupPreview(null)} className="text-xs text-gray-400 hover:text-white">Cancel</button>
                  </div>
                  <div className="text-[11px] text-gray-300">
                    Contains {importedBackupPreview.pages?.length || 0} pages, {importedBackupPreview.collections?.length || 0} CMS collections, and {importedBackupPreview.products?.length || 0} products.
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { actions.importProjectBackup(importedBackupPreview, 'new'); setImportedBackupPreview(null); }} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-semibold">
                      Import as New Isolated Project
                    </button>
                    <button onClick={() => { actions.importProjectBackup(importedBackupPreview, 'replace'); setImportedBackupPreview(null); }} className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded text-xs font-semibold">
                      Overwrite Current Project
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Create New Website from Starter Template</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text" placeholder="Website Name (e.g. Acme Studio)" value={newSiteName}
                    onChange={e => setNewSiteName(e.target.value)}
                    className="md:col-span-2 bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-sm text-white"
                  />
                  <button
                    onClick={() => actions.createNewSiteProject(newSiteName.trim() || WEBSITE_TEMPLATES[selectedTemplate]?.label || 'Untitled Website', selectedTemplate)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg p-2.5 text-sm transition-colors"
                  >
                    Create & Open in Studio
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2">
                  {Object.entries(WEBSITE_TEMPLATES).map(([key, tpl]) => (
                    <div
                      key={key} onClick={() => setSelectedTemplate(key)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${selectedTemplate === key ? 'bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500' : 'bg-gray-800/70 border-gray-700 text-gray-300 hover:bg-gray-800'}`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-bold">{tpl.label}</span>
                          <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-gray-900 text-blue-400 shrink-0">{tpl.category}</span>
                        </div>
                        <div className="text-[11px] text-gray-400 leading-relaxed">{tpl.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {projectsList.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-gray-800">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Local Projects</h3>
                      <button onClick={() => setProjFilter('active')} className={`px-2 py-0.5 rounded text-xs ${projFilter === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
                        Active ({projectsList.filter(p => !p.archived).length})
                      </button>
                      <button onClick={() => setProjFilter('archived')} className={`px-2 py-0.5 rounded text-xs ${projFilter === 'archived' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
                        Archived ({projectsList.filter(p => p.archived).length})
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={projSearch}
                      onChange={e => setProjSearch(e.target.value)}
                      className="bg-gray-800 border border-gray-700 rounded px-2.5 py-1 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {projectsList
                      .filter(p => (projFilter === 'archived' ? p.archived : !p.archived) && p.name.toLowerCase().includes(projSearch.toLowerCase()))
                      .map(p => (
                        <div key={p.id} className={`p-3 rounded-lg border flex flex-col justify-between gap-2 ${p.id === project.id ? 'border-blue-500/50 bg-blue-950/20' : 'border-gray-800 bg-gray-800/50'}`}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              {renamingProjId === p.id ? (
                                <div className="flex gap-1">
                                  <input type="text" value={renameProjValue} onChange={e => setRenameProjValue(e.target.value)} className="bg-gray-900 border border-gray-700 rounded px-2 py-0.5 text-xs text-white flex-1" />
                                  <button onClick={() => { actions.renameProject(p.id, renameProjValue); setRenamingProjId(null); }} className="bg-emerald-600 text-white px-2 rounded text-[10px]">Save</button>
                                </div>
                              ) : (
                                <div className="text-sm font-semibold text-white truncate">{p.name}</div>
                              )}
                              <div className="text-[11px] text-gray-400">
                                {p.pages?.length || 1} pages • {p.category || 'Website'} • Status: <span className="text-blue-400">{p.publishing?.status || 'draft'}</span>
                              </div>
                              <div className="text-[10px] text-gray-500">Updated: {p.updatedAt ? new Date(p.updatedAt).toLocaleString() : 'Local Storage'}</div>
                            </div>
                            {p.id === project.id ? (
                              <span className="text-[10px] font-bold uppercase bg-blue-600/30 text-blue-300 px-2 py-1 rounded shrink-0">Active</span>
                            ) : (
                              <button onClick={() => actions.switchSiteProject(p)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded font-semibold shrink-0">Open</button>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-gray-800/80 text-[11px]">
                            <div className="flex items-center gap-2">
                              <button onClick={() => { setRenamingProjId(p.id); setRenameProjValue(p.name); }} className="text-gray-400 hover:text-white">Rename</button>
                              <button onClick={() => actions.duplicateSiteProject(p.id)} className="text-gray-400 hover:text-white">Duplicate</button>
                              <button onClick={() => actions.toggleArchiveProject(p.id)} className="text-gray-400 hover:text-amber-300">{p.archived ? 'Restore' : 'Archive'}</button>
                            </div>
                            {confirmDeleteProjId === p.id ? (
                              <div className="flex items-center gap-1">
                                <button onClick={() => { actions.deleteSiteProject(p.id); setConfirmDeleteProjId(null); }} className="bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-bold">Confirm Delete</button>
                                <button onClick={() => setConfirmDeleteProjId(null)} className="text-gray-400 text-[10px]">Cancel</button>
                              </div>
                            ) : (
                              <button onClick={() => setConfirmDeleteProjId(p.id)} className="text-gray-500 hover:text-red-400">Delete</button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeModal === 'design_system' && (
            <div className="space-y-5">
              <div className="p-3 bg-pink-950/30 border border-pink-500/30 rounded-lg text-xs text-pink-200 flex flex-wrap items-center justify-between gap-2">
                <span><strong>Global Design System:</strong> Configure brand colors, typography scales, radii, and container widths across your project.</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => actions.applyDesignTokens(draftTokens, true)}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1.5 rounded-lg font-semibold text-xs"
                  >
                    Apply Tokens to Project Pages
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Theme Presets</h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                  {[...GLOBAL_TOKEN_PRESETS, ...(project.customTokenPresets || [])].map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => setDraftTokens(clone(preset.tokens))}
                      className="p-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-left space-y-2"
                    >
                      <div className="text-xs font-bold text-white truncate">{preset.name}</div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: preset.tokens.backgroundColor }} />
                        <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: preset.tokens.primaryColor }} />
                        <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: preset.tokens.textColor }} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Primary Brand Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={draftTokens.primaryColor} onChange={e => setDraftTokens({ ...draftTokens, primaryColor: e.target.value })} className="w-8 h-8 rounded bg-transparent" />
                    <input type="text" value={draftTokens.primaryColor} onChange={e => setDraftTokens({ ...draftTokens, primaryColor: e.target.value })} className="flex-1 bg-gray-800 border border-gray-700 rounded p-1.5 text-xs text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Page Background Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={draftTokens.backgroundColor} onChange={e => setDraftTokens({ ...draftTokens, backgroundColor: e.target.value })} className="w-8 h-8 rounded bg-transparent" />
                    <input type="text" value={draftTokens.backgroundColor} onChange={e => setDraftTokens({ ...draftTokens, backgroundColor: e.target.value })} className="flex-1 bg-gray-800 border border-gray-700 rounded p-1.5 text-xs text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Surface / Card Background</label>
                  <div className="flex gap-2">
                    <input type="color" value={draftTokens.surfaceColor} onChange={e => setDraftTokens({ ...draftTokens, surfaceColor: e.target.value })} className="w-8 h-8 rounded bg-transparent" />
                    <input type="text" value={draftTokens.surfaceColor} onChange={e => setDraftTokens({ ...draftTokens, surfaceColor: e.target.value })} className="flex-1 bg-gray-800 border border-gray-700 rounded p-1.5 text-xs text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Primary Text Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={draftTokens.textColor} onChange={e => setDraftTokens({ ...draftTokens, textColor: e.target.value })} className="w-8 h-8 rounded bg-transparent" />
                    <input type="text" value={draftTokens.textColor} onChange={e => setDraftTokens({ ...draftTokens, textColor: e.target.value })} className="flex-1 bg-gray-800 border border-gray-700 rounded p-1.5 text-xs text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Muted / Body Text Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={draftTokens.mutedColor} onChange={e => setDraftTokens({ ...draftTokens, mutedColor: e.target.value })} className="w-8 h-8 rounded bg-transparent" />
                    <input type="text" value={draftTokens.mutedColor} onChange={e => setDraftTokens({ ...draftTokens, mutedColor: e.target.value })} className="flex-1 bg-gray-800 border border-gray-700 rounded p-1.5 text-xs text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Max Container Width</label>
                  <input type="text" value={draftTokens.containerWidth} onChange={e => setDraftTokens({ ...draftTokens, containerWidth: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded p-1.5 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Heading Font Stack</label>
                  <select value={draftTokens.headingFont} onChange={e => setDraftTokens({ ...draftTokens, headingFont: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded p-1.5 text-xs text-white">
                    <option value="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">System Sans-Serif (Inter / SF)</option>
                    <option value="Georgia, Cambria, serif">Editorial Serif (Georgia)</option>
                    <option value="ui-monospace, SFMono-Regular, monospace">Technical Monospace</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Button Border Radius</label>
                  <select value={draftTokens.buttonRadius} onChange={e => setDraftTokens({ ...draftTokens, buttonRadius: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded p-1.5 text-xs text-white">
                    <option value="0px">Sharp (0px)</option>
                    <option value="0.375rem">Rounded (0.375rem)</option>
                    <option value="0.75rem">Soft (0.75rem)</option>
                    <option value="9999px">Pill (9999px)</option>
                  </select>
                </div>
                <div className="flex items-end gap-2">
                  <input type="text" placeholder="Save preset as..." value={newTokenPresetName} onChange={e => setNewTokenPresetName(e.target.value)} className="flex-1 bg-gray-800 border border-gray-700 rounded p-1.5 text-xs text-white" />
                  <button
                    onClick={() => {
                      if (!newTokenPresetName.trim()) return;
                      actions.applyDesignTokens(draftTokens, false);
                      actions.saveCustomTokenPreset(newTokenPresetName);
                      setNewTokenPresetName('');
                    }}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded text-xs font-semibold"
                  >
                    Save Preset
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeModal === 'history' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-3.5 bg-gray-800/70 border border-gray-700 rounded-xl space-y-2.5">
                  <h4 className="text-xs font-bold uppercase text-amber-300">Create Named Version Snapshot</h4>
                  <input type="text" placeholder="Snapshot Label (e.g. Before Pricing Redesign)" value={snapLabel} onChange={e => setSnapLabel(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-xs text-white" />
                  <input type="text" placeholder="Optional notes..." value={snapDesc} onChange={e => setSnapDesc(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-xs text-white" />
                  <button
                    onClick={() => {
                      actions.createVersionSnapshot(snapLabel, snapDesc);
                      setSnapLabel(''); setSnapDesc('');
                    }}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg text-xs font-semibold"
                  >
                    + Save Project Snapshot (Local Storage)
                  </button>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-gray-400">Saved Snapshots ({project.versionSnapshots?.length || 0})</h4>
                  {(project.versionSnapshots || []).length === 0 ? (
                    <div className="p-6 border border-dashed border-gray-800 rounded-xl text-center text-xs text-gray-500">No named snapshots yet. Use Undo/Redo in the top bar or create a snapshot above.</div>
                  ) : (
                    project.versionSnapshots.map(snap => (
                      <div key={snap.id} className="p-3 bg-gray-800 border border-gray-700 rounded-lg space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{snap.label}</span>
                          <span className="text-[10px] text-gray-400">{new Date(snap.timestamp).toLocaleString()}</span>
                        </div>
                        {snap.description && <div className="text-[11px] text-gray-300">{snap.description}</div>}
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-gray-500">{snap.pages?.length || 1} pages • By {snap.actor}</span>
                          {confirmRestoreSnapId === snap.id ? (
                            <div className="flex gap-1.5">
                              <button onClick={() => { actions.restoreVersionSnapshot(snap.id); setConfirmRestoreSnapId(null); }} className="bg-emerald-600 text-white px-2.5 py-1 rounded text-[10px] font-bold">Confirm Restore</button>
                              <button onClick={() => setConfirmRestoreSnapId(null)} className="text-gray-400 text-[10px]">Cancel</button>
                            </div>
                          ) : (
                            <button onClick={() => setConfirmRestoreSnapId(snap.id)} className="bg-gray-900 hover:bg-gray-700 border border-gray-600 text-amber-300 px-2.5 py-1 rounded text-[10px] font-semibold">
                              Restore Version
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-gray-400">Project Activity & Diagnostics Log</h4>
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {(project.activityLog || []).map(act => (
                    <div key={act.id} className="p-2.5 bg-gray-800/60 border border-gray-800 rounded-lg flex items-start justify-between gap-2 text-xs">
                      <div>
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-gray-900 text-blue-400 mr-1.5">{act.type}</span>
                        <span className="text-gray-200">{act.message}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 shrink-0">{new Date(act.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeModal === 'team' && (
            <div className="space-y-5">
              <div className="p-3.5 bg-cyan-950/30 border border-cyan-500/30 rounded-xl text-xs text-cyan-200 leading-relaxed">
                <strong>Prototype Authentication & Collaboration Boundary:</strong> Real-time multi-user collaboration and authenticated cloud sessions require a connected backend (e.g. Supabase/Firebase Auth + WebSockets). In this local browser environment, the Role Selector below enforces permissions directly in the state operation layer so you can test role restrictions safely.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-4 bg-gray-800/70 border border-gray-700 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold uppercase text-gray-300">Active Role Simulator (Operation-Layer Enforced)</h4>
                  <select
                    value={project.activeRole || 'Owner'}
                    onChange={e => actions.setActiveRole(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-xs text-white"
                  >
                    {Object.entries(ROLE_PERMISSIONS).map(([roleKey, info]) => (
                      <option key={roleKey} value={roleKey}>{info.label}</option>
                    ))}
                  </select>
                  <div className="space-y-1 text-[11px] text-gray-300 pt-2">
                    <div>Canvas & Design Editing: <strong>{builder.currentPermissions.canEditCanvas ? 'Allowed' : 'Blocked'}</strong></div>
                    <div>Page Management: <strong>{builder.currentPermissions.canManagePages ? 'Allowed' : 'Blocked'}</strong></div>
                    <div>CMS & Store Management: <strong>{builder.currentPermissions.canManageCms ? 'Allowed' : 'Blocked'}</strong></div>
                    <div>Publishing & Deployment: <strong>{builder.currentPermissions.canPublish ? 'Allowed' : 'Blocked'}</strong></div>
                  </div>
                </div>

                <div className="p-4 bg-gray-800/70 border border-gray-700 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold uppercase text-gray-300">Project Members Roster (Local Prototype)</h4>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Name" value={collabName} onChange={e => setCollabName(e.target.value)} className="flex-1 bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" />
                    <input type="email" placeholder="Email" value={collabEmail} onChange={e => setCollabEmail(e.target.value)} className="flex-1 bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" />
                    <select value={collabRole} onChange={e => setCollabRole(e.target.value)} className="bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white">
                      {Object.keys(ROLE_PERMISSIONS).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <button
                      onClick={() => {
                        if (!collabName.trim() || !collabEmail.trim()) return;
                        actions.addCollaborator(collabName, collabEmail, collabRole);
                        setCollabName(''); setCollabEmail('');
                      }}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 rounded text-xs font-semibold"
                    >
                      Invite
                    </button>
                  </div>
                  <div className="space-y-1.5 pt-2">
                    {(project.collaborators || []).map(member => (
                      <div key={member.id} className="p-2 bg-gray-900 border border-gray-800 rounded flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-white">{member.name}</span>
                          <span className="text-gray-400 ml-1.5">({member.email})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded font-semibold">{member.role}</span>
                          {member.role !== 'Owner' && (
                            <button onClick={() => actions.removeCollaborator(member.id)} className="text-gray-500 hover:text-red-400">×</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeModal === 'ai' && (
            <div className="space-y-5">
              <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30 flex items-start justify-between gap-3">
                <div className="text-xs text-indigo-200 leading-relaxed">
                  <span className="font-bold text-indigo-300 uppercase tracking-wider block mb-0.5">Provider Status: {AI_PROVIDER_STATUS.providerName}</span>
                  {AI_PROVIDER_STATUS.notice}
                </div>
                <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800 shrink-0">
                  <button onClick={() => setAiStep('brief')} className={`px-2.5 py-1 rounded text-xs font-semibold ${aiStep === 'brief' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}>1. Website Brief</button>
                  <button onClick={() => { if (generatedPlan) setAiStep('review'); else handleCreatePlan(); }} className={`px-2.5 py-1 rounded text-xs font-semibold ${aiStep === 'review' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}>2. Review Sitemap Plan</button>
                </div>
              </div>

              {aiStep === 'brief' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Load Example Brief</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {EXAMPLE_AI_BRIEFS.map((ex, i) => (
                        <button
                          key={i}
                          onClick={() => setAiBrief({ ...aiBrief, ...ex })}
                          className="p-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-left transition-colors"
                        >
                          <div className="text-xs font-bold text-indigo-300">{ex.name}</div>
                          <div className="text-[10px] text-gray-400 truncate">{ex.category} • {ex.pages.join(', ')}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-300 mb-1">Website Name</label>
                      <input type="text" value={aiBrief.name} onChange={e => setAiBrief({ ...aiBrief, name: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs text-white" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-300 mb-1">Website Category</label>
                      <select value={aiBrief.category} onChange={e => setAiBrief({ ...aiBrief, category: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs text-white">
                        {AI_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-300 mb-1">Target Audience</label>
                      <input type="text" value={aiBrief.audience} onChange={e => setAiBrief({ ...aiBrief, audience: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs text-white" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-300 mb-1">Business or Project Description</label>
                    <textarea value={aiBrief.description} onChange={e => setAiBrief({ ...aiBrief, description: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs text-white h-16" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs text-gray-300 mb-1">Preferred Visual Style</label>
                      <select value={aiBrief.style} onChange={e => setAiBrief({ ...aiBrief, style: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs text-white">
                        {Object.values(AI_STYLE_THEMES).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-300 mb-1">Brand Accent Color</label>
                      <div className="flex gap-2">
                        <input type="color" value={aiBrief.primaryColor} onChange={e => setAiBrief({ ...aiBrief, primaryColor: e.target.value })} className="w-8 h-8 rounded bg-transparent cursor-pointer" />
                        <input type="text" value={aiBrief.primaryColor} onChange={e => setAiBrief({ ...aiBrief, primaryColor: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs text-white" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-300 mb-1">Content Language</label>
                      <select value={aiBrief.language} onChange={e => setAiBrief({ ...aiBrief, language: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs text-white">
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-300 mb-1">Responsive Priority</label>
                      <select value={aiBrief.layoutPriority} onChange={e => setAiBrief({ ...aiBrief, layoutPriority: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs text-white">
                        <option value="desktop-first">Desktop-First</option>
                        <option value="mobile-first">Mobile-First</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-800/60 border border-gray-700 rounded-lg">
                      <label className="block text-xs font-semibold text-gray-200 mb-2">Required Pages</label>
                      <div className="flex flex-wrap gap-1.5">
                        {['Home', 'About', 'Services', 'Portfolio', 'Shop', 'Pricing', 'Blog', 'Booking', 'FAQ', 'Contact'].map(pg => (
                          <button
                            key={pg} type="button"
                            onClick={() => toggleBriefList('pages', pg)}
                            className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${aiBrief.pages.includes(pg) ? 'bg-indigo-600/30 border-indigo-400 text-white' : 'bg-gray-900 border-gray-700 text-gray-400'}`}
                          >
                            {pg}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-gray-800/60 border border-gray-700 rounded-lg">
                      <label className="block text-xs font-semibold text-gray-200 mb-2">Required Sections & Features</label>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { id: 'features', label: 'Features' },
                          { id: 'services', label: 'Service Menu' },
                          { id: 'gallery', label: 'Portfolio Gallery' },
                          { id: 'ecommerceGrid', label: 'Online Store' },
                          { id: 'cmsBlock', label: 'Blog / CMS' },
                          { id: 'pricing', label: 'Pricing Tiers' },
                          { id: 'testimonials', label: 'Testimonials' },
                          { id: 'bookingCta', label: 'Booking CTA' },
                          { id: 'faq', label: 'FAQ' },
                          { id: 'newsletter', label: 'Newsletter' },
                          { id: 'contactForm', label: 'Lead Form' }
                        ].map(ft => (
                          <button
                            key={ft.id} type="button"
                            onClick={() => toggleBriefList('features', ft.id)}
                            className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${aiBrief.features.includes(ft.id) ? 'bg-emerald-600/30 border-emerald-400 text-white' : 'bg-gray-900 border-gray-700 text-gray-400'}`}
                          >
                            {ft.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCreatePlan}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Sparkles className="w-4 h-4" /> Generate Structured Website Plan & Preview Sitemap
                  </button>
                </div>
              )}

              {aiStep === 'review' && generatedPlan && (
                <div className="space-y-4">
                  <div className={`p-3 rounded-lg border flex items-center justify-between ${planValidation.valid ? 'bg-emerald-950/30 border-emerald-600/40 text-emerald-300' : 'bg-red-950/40 border-red-600/50 text-red-300'}`}>
                    <div className="text-xs font-semibold">
                      {planValidation.valid
                        ? `Plan Validated: ${generatedPlan.sitemap.length} pages, ${generatedPlan.sitemap.reduce((s, p) => s + p.sections.length, 0)} editable sections ready.`
                        : `Validation Issues: ${planValidation.errors.join(' ')}`}
                    </div>
                    <button onClick={() => setAiStep('brief')} className="text-xs underline hover:text-white">Edit Brief</button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Proposed Sitemap & Page Sections (Editable)</h4>
                      <div className="flex gap-1.5">
                        <input
                          type="text" placeholder="Add custom page..." value={customPageInput}
                          onChange={e => setCustomPageInput(e.target.value)}
                          className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white"
                        />
                        <button onClick={handleAddPageToPlan} className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white px-2.5 py-1 rounded text-xs font-medium">+ Add Page</button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {generatedPlan.sitemap.map((pg) => (
                        <div key={pg.id} className="p-3 bg-gray-800/80 border border-gray-700 rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs font-bold text-white">{pg.name}</span>
                              <span className="text-[10px] text-blue-400 ml-2">/{pg.slug}.html</span>
                            </div>
                            {generatedPlan.sitemap.length > 1 && (
                              <button onClick={() => handleRemovePageFromPlan(pg.id)} className="text-gray-400 hover:text-red-400 text-xs"><Trash2 className="w-3.5 h-3.5" /></button>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {pg.sections.map((sec, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-900 border border-gray-700 text-[10px] text-gray-300">
                                {sec}
                                {pg.sections.length > 1 && (
                                  <button onClick={() => handleRemoveSectionFromPlanPage(pg.id, idx)} className="text-gray-500 hover:text-red-400">×</button>
                                )}
                              </span>
                            ))}
                          </div>
                          <div className="pt-1">
                            <select
                              defaultValue=""
                              onChange={(e) => { if (e.target.value) { handleAddSectionToPlanPage(pg.id, e.target.value); e.target.value = ''; } }}
                              className="w-full bg-gray-900 border border-gray-700 rounded p-1 text-[11px] text-gray-300"
                            >
                              <option value="">+ Insert section into {pg.name}...</option>
                              {COMPONENTS.map(c => <option key={c.id} value={c.id}>{c.name} ({c.category})</option>)}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {generatedPlan.requiredIntegrations.length > 0 && (
                    <div className="p-3 bg-gray-800/40 border border-gray-700 rounded-lg text-xs text-gray-300">
                      <span className="font-bold text-gray-200 block mb-1">Included Platform Foundations & Integration Boundaries:</span>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-gray-400">
                        {generatedPlan.requiredIntegrations.map((intg, i) => <li key={i}>{intg}</li>)}
                      </ul>
                    </div>
                  )}

                  <div className="p-3 bg-gray-950 border border-gray-800 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-xs">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="radio" name="applyMode" checked={applyMode === 'new'} onChange={() => setApplyMode('new')} />
                        <span>Create as New Project (Safe — preserves current site)</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-amber-300">
                        <input type="radio" name="applyMode" checked={applyMode === 'replace'} onChange={() => setApplyMode('replace')} />
                        <span>Replace Current Project (Undoable)</span>
                      </label>
                    </div>
                    <button
                      disabled={!planValidation.valid}
                      onClick={() => actions.applyGeneratedPlan(generatedPlan, applyMode)}
                      className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shrink-0"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Apply Plan & Open in Visual Editor
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {}
          {activeModal === 'cms' && (() => {
            const activeCol = (project.collections || []).find(c => c.id === selectedColId) || project.collections?.[0];
            const filteredRecords = queryCollectionRecords(activeCol, {
              statusFilter: cmsStatusFilter,
              searchQuery: cmsSearch,
              sortBy: cmsSort
            }, false);

            const handleStartEditRecord = (rec) => {
              setCmsError('');
              setEditingRecordId(rec.id);
              setRecordForm({ ...rec });
            };

            const handleSaveRecord = () => {
              if (!activeCol) return;
              const missingReq = (activeCol.fields || []).filter(f => f.required && !String(recordForm[f.key] || '').trim());
              if (missingReq.length > 0) {
                setCmsError(`Required fields missing: ${missingReq.map(f => f.name).join(', ')}`);
                return;
              }
              setCmsError('');
              if (editingRecordId === 'new') {
                actions.addCmsItem(activeCol.id, recordForm);
              } else {
                actions.updateCmsItem(activeCol.id, editingRecordId, recordForm);
              }
              setEditingRecordId(null);
            };

            return (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-4 space-y-4 border-r border-gray-800 pr-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Collections ({project.collections?.length || 0})</h4>
                    <div className="space-y-1.5">
                      {(project.collections || []).map(col => (
                        <div
                          key={col.id}
                          onClick={() => { setSelectedColId(col.id); setEditingRecordId(null); setCmsError(''); }}
                          className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between ${activeCol?.id === col.id ? 'bg-purple-600/20 border-purple-500 text-white' : 'bg-gray-800/70 border-gray-700 text-gray-300 hover:bg-gray-800'}`}
                        >
                          <div className="min-w-0">
                            <div className="text-xs font-bold truncate">{col.name}</div>
                            <div className="text-[10px] text-gray-400">/{col.slug} • {col.items?.length || 0} records</div>
                          </div>
                          {project.collections.length > 1 && (
                            <button
                              onClick={(e) => { e.stopPropagation(); actions.deleteCollection(col.id); }}
                              className="text-gray-500 hover:text-red-400 p-1"
                              title="Delete Collection"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-gray-800/60 border border-gray-700 rounded-lg space-y-2">
                    <div className="text-xs font-bold text-gray-200">Create Collection</div>
                    <input
                      type="text"
                      placeholder="Collection Name (e.g. Case Studies)"
                      value={newColName}
                      onChange={e => setNewColName(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white"
                    />
                    <select
                      value={newColPreset}
                      onChange={e => setNewColPreset(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white"
                    >
                      {Object.entries(STARTER_COLLECTION_PRESETS).map(([k, v]) => (
                        <option key={k} value={k}>Starter Schema: {v.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => {
                        const createdId = actions.createCollection(newColName, newColPreset);
                        setNewColName('');
                        if (createdId) setSelectedColId(createdId);
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-1.5 rounded text-xs font-semibold"
                    >
                      + Add Collection
                    </button>
                  </div>

                  {activeCol && (
                    <div className="p-3 bg-gray-800/40 border border-gray-700 rounded-lg space-y-2">
                      <div className="text-xs font-bold text-gray-300">Schema Fields ({activeCol.fields?.length || 0})</div>
                      <div className="space-y-1 max-h-36 overflow-y-auto">
                        {(activeCol.fields || []).map(f => (
                          <div key={f.key} className="flex items-center justify-between text-[11px] bg-gray-900 px-2 py-1 rounded">
                            <span>{f.name} <span className="text-purple-400">({f.type})</span></span>
                            {!['title', 'summary'].includes(f.key) && (
                              <button onClick={() => actions.deleteCollectionField(activeCol.id, f.key)} className="text-gray-500 hover:text-red-400">×</button>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-1 pt-1">
                        <input
                          type="text"
                          placeholder="New field..."
                          value={newFieldName}
                          onChange={e => setNewFieldName(e.target.value)}
                          className="flex-1 bg-gray-900 border border-gray-700 rounded p-1 text-xs text-white"
                        />
                        <select
                          value={newFieldType}
                          onChange={e => setNewFieldType(e.target.value)}
                          className="bg-gray-900 border border-gray-700 rounded p-1 text-[10px] text-gray-300"
                        >
                          {CMS_FIELD_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                        </select>
                        <button
                          onClick={() => {
                            if (!newFieldName.trim()) return;
                            actions.addCollectionField(activeCol.id, { name: newFieldName.trim(), type: newFieldType });
                            setNewFieldName('');
                          }}
                          className="bg-gray-700 hover:bg-gray-600 text-white px-2 rounded text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="md:col-span-8 space-y-4">
                  {activeCol && (
                    <>
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-800">
                        <div>
                          <h3 className="text-sm font-bold text-white">{activeCol.name} Records</h3>
                          <p className="text-[11px] text-gray-400">Dynamic Route Pattern: <code className="text-purple-300">/{activeCol.slug}-[record-slug].html</code></p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => actions.createCmsDetailPage(activeCol.id)}
                            className="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 px-3 py-1.5 rounded-lg text-xs font-semibold"
                          >
                            Open / Create Detail Page Template
                          </button>
                          <button
                            onClick={() => {
                              setCmsError('');
                              setEditingRecordId('new');
                              setRecordForm({ title: '', slug: '', status: 'published', summary: '', body: '', category: 'General', image: '', date: '2026-10-13' });
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
                          >
                            + New Record
                          </button>
                        </div>
                      </div>

                      {editingRecordId ? (
                        <div className="p-4 bg-gray-800/90 border border-gray-700 rounded-xl space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase text-purple-300">{editingRecordId === 'new' ? 'Create New Record' : 'Edit Record'}</span>
                            <button onClick={() => setEditingRecordId(null)} className="text-xs text-gray-400 hover:text-white">Cancel</button>
                          </div>
                          {cmsError && <div className="p-2 bg-red-950/60 border border-red-500/50 rounded text-xs text-red-300">{cmsError}</div>}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="md:col-span-2">
                              <label className="block text-[11px] text-gray-300 mb-1">URL Slug</label>
                              <input
                                type="text"
                                value={recordForm.slug || ''}
                                onChange={e => setRecordForm({ ...recordForm, slug: e.target.value })}
                                placeholder="auto-generated-from-title"
                                className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-gray-300 mb-1">Publication Status</label>
                              <select
                                value={recordForm.status || 'published'}
                                onChange={e => setRecordForm({ ...recordForm, status: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white"
                              >
                                <option value="published">Published (Live in Export)</option>
                                <option value="draft">Draft (Hidden in Export)</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {(activeCol.fields || []).map(field => (
                              <div key={field.key} className={field.type === 'multiline' ? 'md:col-span-2' : ''}>
                                <label className="block text-[11px] text-gray-300 mb-1">
                                  {field.name} {field.required && <span className="text-red-400">*</span>}
                                </label>
                                {field.type === 'multiline' ? (
                                  <textarea
                                    value={recordForm[field.key] || ''}
                                    onChange={e => setRecordForm({ ...recordForm, [field.key]: e.target.value })}
                                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-xs text-white h-20"
                                  />
                                ) : field.type === 'boolean' ? (
                                  <input
                                    type="checkbox"
                                    checked={Boolean(recordForm[field.key])}
                                    onChange={e => setRecordForm({ ...recordForm, [field.key]: e.target.checked })}
                                  />
                                ) : field.type === 'select' && Array.isArray(field.options) && field.options.length > 0 ? (
                                  <select
                                    value={recordForm[field.key] || ''}
                                    onChange={e => setRecordForm({ ...recordForm, [field.key]: e.target.value })}
                                    className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white"
                                  >
                                    <option value="">Select...</option>
                                    {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                  </select>
                                ) : field.type === 'reference' ? (
                                  <select
                                    value={recordForm[field.key] || ''}
                                    onChange={e => setRecordForm({ ...recordForm, [field.key]: e.target.value })}
                                    className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white"
                                  >
                                    <option value="">Select Referenced Record...</option>
                                    {((project.collections || []).find(c => c.id === field.refCollectionId)?.items || []).map(refItem => (
                                      <option key={refItem.id} value={refItem.id}>{refItem.title}</option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                                    value={recordForm[field.key] || ''}
                                    onChange={e => setRecordForm({ ...recordForm, [field.key]: e.target.value })}
                                    className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white"
                                  />
                                )}
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-end gap-2 pt-2">
                            <button onClick={() => setEditingRecordId(null)} className="px-3 py-1.5 rounded bg-gray-700 text-xs text-gray-200">Cancel</button>
                            <button onClick={handleSaveRecord} className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white">Save Record</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input
                              type="text"
                              placeholder="Search records..."
                              value={cmsSearch}
                              onChange={e => setCmsSearch(e.target.value)}
                              className="bg-gray-800 border border-gray-700 rounded-lg p-1.5 text-xs text-white"
                            />
                            <select value={cmsStatusFilter} onChange={e => setCmsStatusFilter(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg p-1.5 text-xs text-white">
                              <option value="all">All Statuses</option>
                              <option value="published">Published Only</option>
                              <option value="draft">Drafts Only</option>
                            </select>
                            <select value={cmsSort} onChange={e => setCmsSort(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg p-1.5 text-xs text-white">
                              <option value="date_desc">Sort: Newest</option>
                              <option value="date_asc">Sort: Oldest</option>
                              <option value="title_asc">Sort: Title A–Z</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            {filteredRecords.map(rec => (
                              <div key={rec.id} className="p-3 bg-gray-800/70 border border-gray-700 rounded-lg flex items-center justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-white truncate">{rec.title}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase ${rec.status === 'draft' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                                      {rec.status || 'published'}
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-gray-400 truncate">{rec.summary}</div>
                                  <div className="text-[10px] text-purple-400 mt-0.5">Slug: /{activeCol.slug}-{rec.slug}.html</div>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    onClick={() => actions.updateCmsItem(activeCol.id, rec.id, { status: rec.status === 'draft' ? 'published' : 'draft' })}
                                    className="px-2 py-1 rounded bg-gray-900 hover:bg-gray-700 text-[10px] text-gray-300 border border-gray-700"
                                  >
                                    {rec.status === 'draft' ? 'Publish' : 'Set Draft'}
                                  </button>
                                  <button onClick={() => handleStartEditRecord(rec)} className="p-1.5 bg-gray-900 hover:bg-gray-700 rounded text-blue-400" title="Edit Record"><Edit2 className="w-3.5 h-3.5" /></button>
                                  <button onClick={() => actions.duplicateCmsItem(activeCol.id, rec.id)} className="p-1.5 bg-gray-900 hover:bg-gray-700 rounded text-gray-300" title="Duplicate Record"><Copy className="w-3.5 h-3.5" /></button>
                                  <button onClick={() => actions.deleteCmsItem(activeCol.id, rec.id)} className="p-1.5 bg-gray-900 hover:bg-gray-700 rounded text-red-400" title="Delete Record"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })()}

          {}
          {activeModal === 'commerce' && (() => {
            const curCode = project.commerceSettings?.currency || 'USD';
            const filteredProds = queryProducts(project.products || [], {
              statusFilter: prodStatusFilter,
              search: prodSearch
            }, false);

            const handleOpenProdEditor = (prod = null) => {
              setProdError('');
              if (!prod) {
                setEditingProdId('new');
                setProdForm(normalizeProduct({
                  name: '', slug: '', price: 49, compareAtPrice: null, sku: 'SKU-' + Math.floor(Math.random() * 899 + 100),
                  status: 'published', productType: 'physical', trackInventory: true, stock: 20, lowStockThreshold: 5,
                  category: 'General', brand: project.name, shortDescription: '', description: '', variants: []
                }));
              } else {
                setEditingProdId(prod.id);
                setProdForm(clone(prod));
              }
            };

            const handleSaveProductForm = () => {
              if (!prodForm.name || !prodForm.name.trim()) {
                setProdError('Product name is required.');
                return;
              }
              if (isNaN(prodForm.price) || Number(prodForm.price) < 0) {
                setProdError('Product price must be a non-negative number.');
                return;
              }
              setProdError('');
              if (editingProdId === 'new') {
                actions.addProduct(prodForm);
              } else {
                actions.updateProduct(editingProdId, prodForm);
              }
              setEditingProdId(null);
            };

            return (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800 pb-3">
                  <div className="flex gap-2">
                    <button onClick={() => setCommerceTab('products')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${commerceTab === 'products' ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-300'}`}>
                      Products & Variants ({project.products?.length || 0})
                    </button>
                    <button onClick={() => setCommerceTab('orders')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${commerceTab === 'orders' ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-300'}`}>
                      Orders ({project.orders?.length || 0})
                    </button>
                    <button onClick={() => setCommerceTab('settings')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${commerceTab === 'settings' ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-300'}`}>
                      Payment & Store Settings
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => actions.createProductDetailPage()} className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-emerald-300 px-3 py-1.5 rounded-lg text-xs font-semibold">
                      Open Product Detail Template
                    </button>
                    <button onClick={() => handleOpenProdEditor(null)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
                      + New Product
                    </button>
                  </div>
                </div>

                {commerceTab === 'products' && (
                  editingProdId && prodForm ? (
                    <div className="p-4 bg-gray-800/80 border border-gray-700 rounded-xl space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase text-emerald-300">{editingProdId === 'new' ? 'Create Product' : `Edit Product: ${prodForm.name}`}</h4>
                        <button onClick={() => setEditingProdId(null)} className="text-xs text-gray-400 hover:text-white">Cancel</button>
                      </div>
                      {prodError && <div className="p-2 bg-red-950/60 border border-red-500/50 rounded text-xs text-red-300">{prodError}</div>}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-2">
                          <label className="block text-[11px] text-gray-300 mb-1">Product Name *</label>
                          <input type="text" value={prodForm.name} onChange={e => setProdForm({ ...prodForm, name: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" />
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-300 mb-1">Status</label>
                          <select value={prodForm.status} onChange={e => setProdForm({ ...prodForm, status: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white">
                            <option value="published">Published</option>
                            <option value="draft">Draft (Hidden)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-300 mb-1">Price ({curCode}) *</label>
                          <input type="number" step="0.01" value={prodForm.price} onChange={e => setProdForm({ ...prodForm, price: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" />
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-300 mb-1">Compare-At Price</label>
                          <input type="number" step="0.01" value={prodForm.compareAtPrice || ''} onChange={e => setProdForm({ ...prodForm, compareAtPrice: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" />
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-300 mb-1">SKU</label>
                          <input type="text" value={prodForm.sku} onChange={e => setProdForm({ ...prodForm, sku: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" />
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-300 mb-1">Category</label>
                          <input type="text" value={prodForm.category} onChange={e => setProdForm({ ...prodForm, category: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" />
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-300 mb-1">Stock Quantity</label>
                          <input type="number" value={prodForm.stock} onChange={e => setProdForm({ ...prodForm, stock: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" />
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-300 mb-1">Main Image URL</label>
                          <input type="text" value={prodForm.image} onChange={e => setProdForm({ ...prodForm, image: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-gray-300 mb-1">Short Description</label>
                        <input type="text" value={prodForm.shortDescription} onChange={e => setProdForm({ ...prodForm, shortDescription: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-300 mb-1">Full Description</label>
                        <textarea value={prodForm.description} onChange={e => setProdForm({ ...prodForm, description: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-xs text-white h-16" />
                      </div>

                      <div className="p-3 bg-gray-900 border border-gray-700 rounded-lg space-y-2">
                        <div className="text-xs font-bold text-gray-300">Product Variants ({prodForm.variants?.length || 0})</div>
                        {(prodForm.variants || []).map((v, idx) => (
                          <div key={v.id} className="flex items-center justify-between text-xs bg-gray-800 px-2.5 py-1.5 rounded">
                            <span>{v.title} • SKU: {v.sku} • {formatMoney(v.price, curCode)} • Stock: {v.stock}</span>
                            <button
                              onClick={() => setProdForm({ ...prodForm, variants: prodForm.variants.filter((_, i) => i !== idx) })}
                              className="text-red-400 hover:underline text-[11px]"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1">
                          <input type="text" placeholder="Variant (e.g. Large / Black)" value={newVarTitle} onChange={e => setNewVarTitle(e.target.value)} className="sm:col-span-2 bg-gray-800 border border-gray-700 rounded p-1.5 text-xs text-white" />
                          <input type="number" placeholder="Price override" value={newVarPrice} onChange={e => setNewVarPrice(e.target.value)} className="bg-gray-800 border border-gray-700 rounded p-1.5 text-xs text-white" />
                          <div className="flex gap-1">
                            <input type="number" placeholder="Stock" value={newVarStock} onChange={e => setNewVarStock(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded p-1.5 text-xs text-white" />
                            <button
                              type="button"
                              onClick={() => {
                                if (!newVarTitle.trim()) return;
                                const nextVar = {
                                  id: 'var_' + Math.random().toString(36).substr(2, 7),
                                  title: newVarTitle.trim(),
                                  sku: `${prodForm.sku}-V${(prodForm.variants?.length || 0) + 1}`,
                                  price: newVarPrice !== '' ? Number(newVarPrice) : Number(prodForm.price),
                                  stock: Math.max(0, parseInt(newVarStock, 10) || 0)
                                };
                                setProdForm({ ...prodForm, variants: [...(prodForm.variants || []), nextVar] });
                                setNewVarTitle(''); setNewVarPrice('');
                              }}
                              className="bg-emerald-600 text-white px-2.5 rounded text-xs font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditingProdId(null)} className="px-3 py-1.5 rounded bg-gray-700 text-xs">Cancel</button>
                        <button onClick={handleSaveProductForm} className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white">Save Product</button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex gap-2">
                          <input type="text" placeholder="Search SKU or name..." value={prodSearch} onChange={e => setProdSearch(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-white" />
                          <select value={prodStatusFilter} onChange={e => setProdStatusFilter(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-white">
                            <option value="all">All Products</option>
                            <option value="published">Published</option>
                            <option value="draft">Drafts</option>
                          </select>
                        </div>
                        {selectedProdIds.length > 0 && (
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => { actions.bulkUpdateProducts(selectedProdIds, 'publish'); setSelectedProdIds([]); }} className="bg-gray-800 hover:bg-gray-700 text-emerald-300 px-2.5 py-1 rounded text-xs">Publish Selected</button>
                            <button onClick={() => { actions.bulkUpdateProducts(selectedProdIds, 'unpublish'); setSelectedProdIds([]); }} className="bg-gray-800 hover:bg-gray-700 text-amber-300 px-2.5 py-1 rounded text-xs">Set Draft</button>
                            <button onClick={() => { actions.bulkUpdateProducts(selectedProdIds, 'delete'); setSelectedProdIds([]); }} className="bg-red-950/60 hover:bg-red-900 text-red-300 px-2.5 py-1 rounded text-xs">Delete</button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        {filteredProds.map(prod => (
                          <div key={prod.id} className="p-3 bg-gray-800/70 border border-gray-700 rounded-lg flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <input
                                type="checkbox"
                                checked={selectedProdIds.includes(prod.id)}
                                onChange={e => setSelectedProdIds(prev => e.target.checked ? [...prev, prod.id] : prev.filter(id => id !== prod.id))}
                              />
                              <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded object-cover shrink-0" />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-white truncate">{prod.name}</span>
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase ${prod.status === 'draft' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>{prod.status}</span>
                                </div>
                                <div className="text-[11px] text-gray-400">
                                  {formatMoney(prod.price, curCode)} • SKU: {prod.sku} • Stock: {prod.stock} • Variants: {prod.variants?.length || 0}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button onClick={() => handleOpenProdEditor(prod)} className="p-1.5 bg-gray-900 hover:bg-gray-700 rounded text-blue-400" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
                              <button onClick={() => actions.duplicateProduct(prod.id)} className="p-1.5 bg-gray-900 hover:bg-gray-700 rounded text-gray-300" title="Duplicate"><Copy className="w-3.5 h-3.5" /></button>
                              <button onClick={() => actions.deleteProduct(prod.id)} className="p-1.5 bg-gray-900 hover:bg-gray-700 rounded text-red-400" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}

                {commerceTab === 'orders' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-lg text-xs text-amber-200">
                      Orders created in browser preview are explicitly labeled <strong>demo_unverified</strong>. Production order verification requires a server-side Paystack or Stripe webhook.
                    </div>
                    {(project.orders || []).length === 0 ? (
                      <div className="p-8 text-center text-xs text-gray-500 border border-dashed border-gray-800 rounded-xl">No orders recorded yet. Add items to the cart and test the checkout drawer.</div>
                    ) : (
                      (project.orders || []).map(ord => (
                        <div key={ord.id} className="p-3.5 bg-gray-800 border border-gray-700 rounded-lg space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <span className="text-xs font-bold text-white">{ord.orderNumber}</span>
                              <span className="text-[11px] text-gray-400 ml-2">{ord.customer?.name} ({ord.customer?.email})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">{ord.paymentStatus}</span>
                              <select
                                value={ord.fulfilmentStatus}
                                onChange={e => actions.updateOrderStatus(ord.id, { fulfilmentStatus: e.target.value })}
                                className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-white"
                              >
                                <option value="unfulfilled">Unfulfilled</option>
                                <option value="fulfilled">Fulfilled</option>
                                <option value="cancelled">Cancelled (Restores Stock)</option>
                              </select>
                            </div>
                          </div>
                          <div className="text-[11px] text-gray-300">
                            Items: {(ord.items || []).map(i => `${i.name} x${i.quantity}`).join(', ')} • Total: <strong>{formatMoney(ord.totals?.total, ord.currency)}</strong>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {commerceTab === 'settings' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-800/60 border border-gray-700 rounded-lg space-y-3">
                      <h4 className="text-xs font-bold uppercase text-gray-300">Store Currency & Shipping</h4>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Store Currency</label>
                        <select
                          value={project.commerceSettings?.currency || 'USD'}
                          onChange={e => actions.updateCommerceSettings({ currency: e.target.value })}
                          className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-xs text-white"
                        >
                          {Object.values(CURRENCIES).map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Flat Shipping Rate</label>
                          <input type="number" value={project.commerceSettings?.flatShippingRate ?? 12} onChange={e => actions.updateCommerceSettings({ flatShippingRate: Number(e.target.value) })} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Estimated Tax (%)</label>
                          <input type="number" value={project.commerceSettings?.taxRatePercent ?? 7.5} onChange={e => actions.updateCommerceSettings({ taxRatePercent: Number(e.target.value) })} className="w-full bg-gray-900 border border-gray-700 rounded p-1.5 text-xs text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-800/60 border border-gray-700 rounded-lg space-y-2">
                      <h4 className="text-xs font-bold uppercase text-gray-300">Payment Gateway Boundary</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Status: <strong className="text-amber-400">NOT CONFIGURED (Browser Sandbox)</strong>. Secret keys (`PAYSTACK_SECRET_KEY` / `STRIPE_SECRET_KEY`) are never stored in browser code. Connect a backend webhook endpoint after exporting to verify live transactions.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {}
          {activeModal === 'publishing' && (() => {
            const pub = project.publishing || DEFAULT_PUBLISHING_STATE;
            const siteSettings = project.siteSettings || DEFAULT_SITE_SETTINGS;
            const activeProvider = HOSTING_PROVIDERS[pub.providerId] || HOSTING_PROVIDERS.netlify;
            const currentReport = validationReport || runPrePublishValidation(project);

            return (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800 pb-3">
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'overview', label: '1. Overview & Build' },
                      { id: 'validation', label: `2. Pre-Publish Validation (${currentReport.errors.length} Errors, ${currentReport.warnings.length} Warnings)` },
                      { id: 'provider', label: '3. Hosting Provider' },
                      { id: 'domains', label: `4. Custom Domains (${pub.customDomains?.length || 0})` },
                      { id: 'seo', label: '5. Site & SEO Settings' },
                      { id: 'history', label: `6. Deployment History (${pub.deploymentHistory?.length || 0})` }
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setPubTab(t.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${pubTab === t.id ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {deployFeedback && (
                  <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-500/40 text-xs text-blue-200 flex items-center justify-between">
                    <span>{deployFeedback}</span>
                    <button onClick={() => setDeployFeedback('')} className="text-gray-400 hover:text-white">×</button>
                  </div>
                )}

                {pubTab === 'overview' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-4 bg-gray-800/70 border border-gray-700 rounded-xl">
                        <div className="text-[10px] font-bold uppercase text-gray-400">Publishing Status</div>
                        <div className="text-base font-extrabold text-white mt-1 capitalize">{(pub.status || 'draft').replace(/_/g, ' ')}</div>
                        <div className="text-[11px] text-gray-400 mt-1">Environment: <strong className="text-blue-400 uppercase">{pub.activeEnvironment}</strong></div>
                      </div>
                      <div className="p-4 bg-gray-800/70 border border-gray-700 rounded-xl">
                        <div className="text-[10px] font-bold uppercase text-gray-400">Published Website URL</div>
                        {pub.publishedUrl ? (
                          <a href={pub.publishedUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-emerald-400 underline mt-1 block truncate">{pub.publishedUrl}</a>
                        ) : (
                          <div className="text-xs font-semibold text-amber-300 mt-1">Not Published to Live Host</div>
                        )}
                        <div className="text-[11px] text-gray-400 mt-1">Provider: {activeProvider.name} ({pub.providerConnected ? 'Connected' : 'Backend Not Connected'})</div>
                      </div>
                      <div className="p-4 bg-gray-800/70 border border-gray-700 rounded-xl">
                        <div className="text-[10px] font-bold uppercase text-gray-400">Last Production Build</div>
                        <div className="text-xs font-bold text-white mt-1">{pub.lastBuildAt ? new Date(pub.lastBuildAt).toLocaleString() : 'No build generated yet'}</div>
                        <div className="text-[11px] text-gray-400 mt-1">Validation: {currentReport.errors.length === 0 ? 'Ready to build' : `${currentReport.errors.length} critical error(s)`}</div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl space-y-3">
                      <h4 className="text-xs font-bold uppercase text-gray-300">Production Build & Publishing Actions</h4>
                      <div className="flex flex-wrap gap-2.5">
                        <button
                          onClick={handleRunValidation}
                          className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white px-3.5 py-2 rounded-lg text-xs font-semibold"
                        >
                          1. Run Pre-Publish Validation
                        </button>
                        <button
                          disabled={!currentReport.canBuild || isBuildingProd}
                          onClick={() => handleRunProductionBuild(false)}
                          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white px-3.5 py-2 rounded-lg text-xs font-semibold"
                        >
                          2. Build Production Output
                        </button>
                        <button
                          disabled={!currentReport.canBuild || isBuildingProd}
                          onClick={() => handleRunProductionBuild(true)}
                          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" /> 3. Export Production ZIP
                        </button>
                        <button
                          disabled={!currentReport.canBuild || isBuildingProd}
                          onClick={() => handleAttemptProviderDeploy(pub.activeEnvironment)}
                          className="bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 px-3.5 py-2 rounded-lg text-xs font-semibold"
                        >
                          Deploy to {activeProvider.name} ({pub.activeEnvironment})
                        </button>
                      </div>
                    </div>

                    {pub.lastBuildArtifacts && (
                      <div className="p-4 bg-gray-950 border border-gray-800 rounded-xl space-y-2">
                        <div className="text-xs font-bold text-emerald-400">Compiled Production Build Manifest ({pub.lastBuildArtifacts.files.length} files)</div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {pub.lastBuildArtifacts.files.map(f => (
                            <div key={f.name} className="p-2 bg-gray-900 border border-gray-800 rounded flex items-center justify-between text-xs">
                              <span className="text-gray-200 font-mono truncate">{f.name}</span>
                              <span className="text-[10px] text-gray-500">{(f.bytes / 1024).toFixed(1)} KB</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {pubTab === 'validation' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-300">
                        Automated checks for broken internal links, duplicate slugs, unpublished CMS/Product references, SEO tags, and image alt attributes:
                      </div>
                      <button onClick={handleRunValidation} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-semibold">Re-Run Validation</button>
                    </div>
                    {[...currentReport.errors, ...currentReport.warnings, ...currentReport.suggestions].length === 0 ? (
                      <div className="p-6 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-center text-xs text-emerald-300 font-semibold">
                        Zero issues found! Your website passed all pre-publish validation checks.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {[...currentReport.errors, ...currentReport.warnings, ...currentReport.suggestions].map(item => (
                          <div
                            key={item.id}
                            className={`p-3 rounded-lg border flex items-center justify-between gap-3 ${
                              item.severity === 'error' ? 'bg-red-950/40 border-red-500/50 text-red-200' :
                              item.severity === 'warning' ? 'bg-amber-950/30 border-amber-500/40 text-amber-200' :
                              'bg-gray-800/80 border-gray-700 text-gray-300'
                            }`}
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-black/40">{item.severity}</span>
                                <span className="text-xs font-bold">{item.location}</span>
                              </div>
                              <div className="text-xs">{item.message}</div>
                            </div>
                            {item.pageId && (
                              <button
                                onClick={() => {
                                  setActivePageId(item.pageId);
                                  if (item.nodeId) setSelectedId(item.nodeId);
                                  setActiveModal(null);
                                }}
                                className="bg-gray-900 hover:bg-gray-700 text-white px-2.5 py-1 rounded text-[11px] font-semibold shrink-0 border border-gray-700"
                              >
                                Locate in Editor →
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {pubTab === 'provider' && (
                  <div className="space-y-4">
                    <div className="p-3 bg-indigo-950/40 border border-indigo-500/40 rounded-lg text-xs text-indigo-200 leading-relaxed">
                      <strong>Security Boundary:</strong> Deployment tokens (`NETLIFY_AUTH_TOKEN`, `VERCEL_TOKEN`, `CLOUDFLARE_API_TOKEN`) must be stored in server-side environment variables and are never saved in browser `localStorage` or client bundles.
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-gray-300 mb-1">Hosting Provider Adapter</label>
                        <select
                          value={pub.providerId}
                          onChange={e => actions.updatePublishingConfig({ providerId: e.target.value })}
                          className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-xs text-white"
                        >
                          {Object.values(HOSTING_PROVIDERS).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-300 mb-1">Target Environment</label>
                        <select
                          value={pub.activeEnvironment}
                          onChange={e => actions.updatePublishingConfig({ activeEnvironment: e.target.value })}
                          className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-xs text-white"
                        >
                          <option value="production">Production</option>
                          <option value="preview">Preview / Staging</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-300 mb-1">Project / Site Identifier</label>
                        <input
                          type="text"
                          value={pub.siteIdentifier || ''}
                          onChange={e => actions.updatePublishingConfig({ siteIdentifier: e.target.value })}
                          placeholder="e.g. nexus-flagship-site"
                          className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-xs text-white"
                        />
                      </div>
                    </div>
                    <div className="p-3 bg-gray-800/60 border border-gray-700 rounded-lg text-xs space-y-1">
                      <div className="font-bold text-gray-200">Required Server Environment Variables for {activeProvider.name}:</div>
                      <div className="font-mono text-blue-300">{activeProvider.requiredEnvVars.join(', ')}</div>
                    </div>
                  </div>
                )}

                {pubTab === 'domains' && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter custom domain (e.g. www.yourdomain.com)"
                        value={domainInput}
                        onChange={e => setDomainInput(e.target.value)}
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs text-white"
                      />
                      <button
                        onClick={() => {
                          const res = actions.addCustomDomain(domainInput);
                          if (!res.ok) setDomainMsg(res.error);
                          else { setDomainInput(''); setDomainMsg(''); }
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold"
                      >
                        + Add Domain
                      </button>
                    </div>
                    {domainMsg && <div className="text-xs text-red-400">{domainMsg}</div>}
                    {(pub.customDomains || []).length === 0 ? (
                      <div className="p-6 border border-dashed border-gray-800 rounded-xl text-center text-xs text-gray-500">No custom domains configured yet.</div>
                    ) : (
                      <div className="space-y-2.5">
                        {pub.customDomains.map(d => (
                          <div key={d.id} className="p-3.5 bg-gray-800 border border-gray-700 rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-white">{d.domain}</span>
                                {d.isPrimary && <span className="text-[10px] bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded font-bold uppercase">Primary</span>}
                                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-semibold uppercase">{d.verificationStatus.replace(/_/g, ' ')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {!d.isPrimary && (
                                  <button onClick={() => actions.setPrimaryDomain(d.id)} className="text-xs text-blue-400 hover:underline">Make Primary</button>
                                )}
                                <button onClick={() => actions.removeCustomDomain(d.id)} className="text-xs text-red-400 hover:underline">Remove</button>
                              </div>
                            </div>
                            <div className="text-[11px] font-mono bg-gray-900 p-2 rounded text-gray-300">
                              Required DNS: <strong>{d.requiredDnsRecord.type}</strong> | Host: <strong>{d.requiredDnsRecord.host}</strong> → Value: <strong>{d.requiredDnsRecord.value}</strong>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {pubTab === 'seo' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-300 mb-1">Site Name</label>
                      <input type="text" value={siteSettings.siteName || ''} onChange={e => actions.updateSiteSettings({ siteName: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-xs text-white" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-300 mb-1">Canonical Base URL</label>
                      <input type="text" value={siteSettings.canonicalBaseUrl || ''} onChange={e => actions.updateSiteSettings({ canonicalBaseUrl: e.target.value })} placeholder="https://yourdomain.com" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-xs text-white" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-300 mb-1">Default SEO Title</label>
                      <input type="text" value={siteSettings.defaultSeoTitle || ''} onChange={e => actions.updateSiteSettings({ defaultSeoTitle: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-xs text-white" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-300 mb-1">Social Sharing Image URL (og:image)</label>
                      <input type="text" value={siteSettings.ogImageUrl || ''} onChange={e => actions.updateSiteSettings({ ogImageUrl: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-xs text-white" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs text-gray-300 mb-1">Default Meta Description</label>
                      <textarea value={siteSettings.defaultSeoDesc || ''} onChange={e => actions.updateSiteSettings({ defaultSeoDesc: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-xs text-white h-16" />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-300">
                      <label className="flex items-center gap-1.5"><input type="checkbox" checked={siteSettings.allowIndexing !== false} onChange={e => actions.updateSiteSettings({ allowIndexing: e.target.checked })} /> Allow Search Indexing</label>
                      <label className="flex items-center gap-1.5"><input type="checkbox" checked={siteSettings.sitemapEnabled !== false} onChange={e => actions.updateSiteSettings({ sitemapEnabled: e.target.checked })} /> Generate sitemap.xml</label>
                    </div>
                  </div>
                )}

                {pubTab === 'history' && (
                  <div className="space-y-2.5">
                    {(pub.deploymentHistory || []).length === 0 ? (
                      <div className="p-6 border border-dashed border-gray-800 rounded-xl text-center text-xs text-gray-500">No deployment attempts recorded yet.</div>
                    ) : (
                      pub.deploymentHistory.map(dep => (
                        <div key={dep.id} className="p-3 bg-gray-800 border border-gray-700 rounded-lg space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">{dep.revision} • {dep.provider} ({dep.environment})</span>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${dep.status === 'published' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>{dep.status}</span>
                          </div>
                          <div className="text-[11px] text-gray-400">{new Date(dep.timestamp).toLocaleString()} • {dep.trigger}</div>
                          {dep.errorSummary && <div className="text-xs text-amber-300 pt-1">{dep.errorSummary}</div>}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {activeModal === 'audit' && (
            <div className="space-y-3">
              <div className="text-xs text-gray-400 mb-2">Live inspection of your multi-page DOM structure, SEO tags, and image alt attributes:</div>
              {runSiteAudit().map((item, idx) => (
                <div key={idx} className={`p-3 rounded-lg border flex items-center justify-between ${item.type === 'pass' ? 'bg-emerald-950/30 border-emerald-700/50 text-emerald-300' : item.type === 'warn' ? 'bg-amber-950/30 border-amber-700/50 text-amber-300' : 'bg-gray-800 border-gray-700 text-gray-300'}`}>
                  <div className="text-xs">{item.msg}</div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-black/30">{item.page}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CartCheckoutDrawer = ({ builder }) => {
  const { isCartOpen, setIsCartOpen, demoCart, project, actions } = builder;
  const [step, setStep] = useState('cart'); // 'cart' | 'checkout' | 'confirmation'
  const [promoInput, setPromoInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [customer, setCustomer] = useState({ name: '', email: '', address: '', city: '', country: 'Nigeria' });
  const [paymentMode, setPaymentMode] = useState('demo'); // 'demo' | 'live'
  const [checkoutError, setCheckoutError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  if (!isCartOpen) return null;

  const curCode = project.commerceSettings?.currency || 'USD';
  const subtotal = demoCart.reduce((s, it) => s + it.unitPrice * it.quantity, 0);
  const discountVal = appliedDiscount
    ? (appliedDiscount.type === 'percent' ? (subtotal * appliedDiscount.value) / 100 : appliedDiscount.value)
    : 0;
  const discountedSubtotal = Math.max(0, subtotal - discountVal);
  const shipping = demoCart.length === 0 ? 0 : (discountedSubtotal >= (project.commerceSettings?.freeShippingThreshold || 150) ? 0 : (project.commerceSettings?.flatShippingRate ?? 12));
  const tax = (discountedSubtotal * (project.commerceSettings?.taxRatePercent ?? 7.5)) / 100;
  const total = discountedSubtotal + shipping + tax;

  const handleCompleteCheckout = (e) => {
    e.preventDefault();
    setCheckoutError('');
    if (!customer.name.trim() || !customer.email.trim()) {
      setCheckoutError('Please enter your name and email address.');
      return;
    }
    if (paymentMode === 'live' && !project.commerceSettings?.livePaymentsConfigured) {
      setCheckoutError('Live Payment Gateway (Paystack / Stripe) is NOT CONFIGURED in this browser environment. Real payments require server-side webhook verification. Switch to Local Demo Order to test order creation.');
      return;
    }
    const order = actions.createDemoOrder(customer, { subtotal, discountVal, shipping, tax, total });
    setConfirmedOrder(order);
    setStep('confirmation');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-end">
      <div className="w-full max-w-md bg-gray-900 border-l border-gray-800 h-full flex flex-col text-gray-200 shadow-2xl">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-950">
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            {step === 'cart' ? 'Shopping Cart' : step === 'checkout' ? 'Storefront Checkout' : 'Order Confirmation'}
          </div>
          <button onClick={() => { setIsCartOpen(false); setStep('cart'); }} className="p-1 text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {step === 'cart' && (
            demoCart.length === 0 ? (
              <div className="text-center py-12 text-xs text-gray-500">Your shopping cart is empty.</div>
            ) : (
              <>
                <div className="space-y-3">
                  {demoCart.map(item => (
                    <div key={item.cartItemId} className="p-3 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{item.name}</div>
                        {item.variantTitle && <div className="text-[11px] text-emerald-400">{item.variantTitle}</div>}
                        <div className="text-xs text-gray-300 mt-0.5">{formatMoney(item.unitPrice, curCode)} each</div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button onClick={() => actions.updateCartQuantity(item.cartItemId, item.quantity - 1)} className="px-2 py-0.5 bg-gray-900 rounded">-</button>
                        <span className="text-xs font-bold px-1">{item.quantity}</span>
                        <button onClick={() => actions.updateCartQuantity(item.cartItemId, item.quantity + 1)} className="px-2 py-0.5 bg-gray-900 rounded">+</button>
                        <button onClick={() => actions.removeFromCart(item.cartItemId)} className="text-gray-400 hover:text-red-400 ml-1"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <input type="text" placeholder="Promo code (WELCOME10)" value={promoInput} onChange={e => setPromoInput(e.target.value)} className="flex-1 bg-gray-800 border border-gray-700 rounded p-2 text-xs text-white" />
                  <button
                    onClick={() => {
                      const found = (project.commerceSettings?.discountCodes || []).find(d => d.active && d.code.toLowerCase() === promoInput.trim().toLowerCase());
                      setAppliedDiscount(found || null);
                    }}
                    className="bg-gray-800 hover:bg-gray-700 border border-gray-600 px-3 rounded text-xs font-semibold"
                  >
                    Apply
                  </button>
                </div>

                <div className="p-3.5 bg-gray-950 border border-gray-800 rounded-lg space-y-1.5 text-xs">
                  <div className="flex justify-between"><span>Subtotal</span><span>{formatMoney(subtotal, curCode)}</span></div>
                  {discountVal > 0 && <div className="flex justify-between text-emerald-400"><span>Discount ({appliedDiscount.code})</span><span>-{formatMoney(discountVal, curCode)}</span></div>}
                  <div className="flex justify-between text-gray-400"><span>Estimated Shipping</span><span>{formatMoney(shipping, curCode)}</span></div>
                  <div className="flex justify-between text-gray-400"><span>Estimated Tax</span><span>{formatMoney(tax, curCode)}</span></div>
                  <div className="flex justify-between font-bold text-sm text-white pt-2 border-t border-gray-800"><span>Total</span><span>{formatMoney(total, curCode)}</span></div>
                </div>

                <button onClick={() => setStep('checkout')} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg text-xs">
                  Proceed to Checkout
                </button>
              </>
            )
          )}

          {step === 'checkout' && (
            <form onSubmit={handleCompleteCheckout} className="space-y-3">
              {checkoutError && <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-lg text-xs text-red-200">{checkoutError}</div>}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Full Name *</label>
                <input type="text" required value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-xs text-white" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Email Address *</label>
                <input type="email" required value={customer.email} onChange={e => setCustomer({ ...customer, email: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-xs text-white" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Shipping Address</label>
                <input type="text" value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-xs text-white" />
              </div>
              <div className="p-3 bg-gray-800/70 border border-gray-700 rounded-lg space-y-2 text-xs">
                <div className="font-bold text-gray-200">Payment Mode</div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={paymentMode === 'demo'} onChange={() => setPaymentMode('demo')} />
                  <span>Local Demo Order (Marks order as <code>demo_unverified</code>)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-amber-300">
                  <input type="radio" checked={paymentMode === 'live'} onChange={() => setPaymentMode('live')} />
                  <span>Live Paystack / Stripe Gateway (Requires Backend Webhook)</span>
                </label>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setStep('cart')} className="px-3 py-2 bg-gray-800 rounded text-xs">Back</button>
                <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded text-xs">
                  Place Order ({formatMoney(total, curCode)})
                </button>
              </div>
            </form>
          )}

          {step === 'confirmation' && confirmedOrder && (
            <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-xl space-y-3 text-xs">
              <div className="font-bold text-emerald-300 text-sm">Demo Order Recorded: {confirmedOrder.orderNumber}</div>
              <p className="text-gray-300">Status: <strong className="text-amber-300 uppercase">{confirmedOrder.paymentStatus}</strong> (Unverified browser demo order).</p>
              <button onClick={() => { setStep('cart'); setIsCartOpen(false); }} className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded font-semibold">Done</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function NexusStudio() {
  const builder = useBuilderState();
  const [showOnboarding, setShowOnboarding] = useState(false);

  const completedSteps = builder.project.onboarding?.completedSteps || [];
  const onboardingProgress = Math.round((completedSteps.length / ONBOARDING_STEPS.length) * 100);

  return (
    <div className="flex flex-col h-screen w-full bg-black overflow-hidden font-sans text-gray-200">
      <TopBar builder={builder} />
      {builder.permissionNotice && (
        <div className="bg-red-950/90 border-b border-red-500/40 px-4 py-1.5 text-xs text-red-200 flex items-center justify-between z-40">
          <span><strong>Permission Boundary:</strong> {builder.permissionNotice}</span>
          <button onClick={() => builder.setPermissionNotice('')} className="text-red-300 hover:text-white font-bold">×</button>
        </div>
      )}
      <PlatformModals builder={builder} />
      <CartCheckoutDrawer builder={builder} />
      <div className="flex flex-1 overflow-hidden relative">
        {!builder.isPreviewMode && <LeftSidebar builder={builder} />}

        <main
          onClick={() => { if (!builder.isPreviewMode) builder.setSelectedId(null); }}
          className="flex-1 bg-gray-950 relative overflow-auto flex flex-col items-center justify-start min-w-0 w-full"
        >
          {builder.activePage?.isCmsTemplate && (() => {
            const tplCol = (builder.project.collections || []).find(c => c.id === builder.activePage.cmsCollectionId);
            if (!tplCol) return null;
            const currentRecId = builder.previewRecordByPage?.[builder.activePage.id] || tplCol.items?.[0]?.id || '';
            return (
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-purple-950/80 border-b border-purple-500/30 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-purple-200 shrink-0 z-20"
              >
                <div className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-purple-400" />
                  <span className="font-bold">Dynamic CMS Template:</span>
                  <span>{tplCol.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-purple-300">Previewing Record:</span>
                  <select
                    value={currentRecId}
                    onChange={(e) => builder.setPreviewRecordByPage(prev => ({ ...prev, [builder.activePage.id]: e.target.value }))}
                    className="bg-gray-900 border border-purple-500/40 rounded px-2 py-1 text-xs text-white"
                  >
                    {(tplCol.items || []).map(it => (
                      <option key={it.id} value={it.id}>{it.title} (/{tplCol.slug}-{it.slug}.html) [{it.status}]</option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })()}
          <div className={`flex-1 transition-all duration-300 flex flex-col items-center ${builder.isPreviewMode ? 'w-full' : 'p-6 md:p-10 pb-32 w-full'}`}>
            {builder.smartGuides && builder.smartGuides.length > 0 && !builder.isPreviewMode && (
              <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 px-3 py-1 rounded-full text-[11px] font-mono shadow-lg pointer-events-none">
                <span>Smart Guide:</span>
                {builder.smartGuides.map((g, idx) => (
                  <span key={idx} className="font-bold">{g.label}</span>
                ))}
              </div>
            )}
            <div
              className={`bg-white shadow-2xl transition-all duration-300 relative shrink-0 overflow-x-hidden ${builder.isPreviewMode ? 'w-full flex-1' : 'ring-1 ring-gray-800 rounded-sm'}`}
              style={{
                width: builder.isPreviewMode ? '100%' : BREAKPOINTS[builder.deviceMode].width,
                maxWidth: '100%',
                minHeight: builder.isPreviewMode ? '100%' : '85vh'
              }}
            >
              {builder.activePage && (
                <CanvasNodeRenderer node={builder.activePage.rootNode} builder={builder} />
              )}
            </div>
          </div>

          {!builder.isPreviewMode && !builder.project.onboarding?.dismissed && (
            <div className="fixed bottom-4 left-76 z-30">
              {showOnboarding ? (
                <div className="w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Platform Onboarding ({onboardingProgress}%)
                    </span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => builder.actions.toggleOnboardingDismissed(true)} className="text-[10px] text-gray-400 hover:text-red-400">Dismiss</button>
                      <button onClick={() => setShowOnboarding(false)} className="text-gray-400 hover:text-white"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full transition-all" style={{ width: `${onboardingProgress}%` }} />
                  </div>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto">
                    {ONBOARDING_STEPS.map(st => {
                      const done = completedSteps.includes(st.id);
                      return (
                        <button
                          key={st.id}
                          onClick={() => {
                            builder.actions.markOnboardingStep(st.id);
                            if (st.actionModal) builder.setActiveModal(st.actionModal);
                            if (st.actionDevice) builder.setDeviceMode(st.actionDevice);
                            if (st.actionPreview) builder.setIsPreviewMode(true);
                          }}
                          className={`w-full text-left p-2 rounded-lg border flex items-center justify-between gap-2 transition-colors ${done ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-gray-800/70 border-gray-700 text-gray-300 hover:bg-gray-800'}`}
                        >
                          <span className={done ? 'line-through opacity-75' : ''}>{st.label}</span>
                          <span className="text-[10px] font-bold uppercase">{done ? 'Done' : 'Go →'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowOnboarding(true)}
                  className="bg-gray-900 hover:bg-gray-800 border border-gray-700 text-white px-3.5 py-2 rounded-full shadow-xl text-xs font-semibold flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Launch Guide ({onboardingProgress}%)
                </button>
              )}
            </div>
          )}
        </main>

        {!builder.isPreviewMode && <RightSidebar builder={builder} />}
      </div>
    </div>
  );
}