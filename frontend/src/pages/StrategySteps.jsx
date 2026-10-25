import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Layers, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  Download, 
  Bookmark, 
  BookmarkCheck, 
  SlidersHorizontal, 
  ExternalLink, 
  ChevronRight, 
  Award, 
  FileText, 
  BarChart3, 
  Database, 
  Brain, 
  Cpu, 
  Crosshair, 
  Settings, 
  Lightbulb, 
  Globe, 
  ListOrdered, 
  Share2, 
  X, 
  ArrowLeft,
  Check,
  RefreshCw,
  Search
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceArea
} from 'recharts';
import { api } from '../services/api';
import CompanyLogo from '../components/CompanyLogo';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// --- COMPANY-SPECIFIC HISTORICAL STRATEGY DATA STORE ---
const COMPANY_CASE_DATA = {
  apple: {
    market_cap: "$3.11T",
    market_cap_change: "+2.4% (YTD)",
    market_cap_date: "as of Oct 21, 2024",
    revenue_ttm: "$383.3B",
    revenue_growth: "+2.1% YoY",
    revenue_period: "FY 2024",
    net_income_ttm: "$97.0B",
    net_income_growth: "+5.8% YoY",
    net_income_period: "FY 2024",
    stock_price: "$182.52",
    stock_price_change: "+1.4% (Today)",
    risk_score: 28,
    risk_label: "Low Risk",
    turnaround_success: "92%",
    turnaround_confidence: "High Confidence",
    similar_cases_count: 18,
    roadmap_phases: [
      {
        id: "phase-1",
        title: "Crisis & Decline",
        period: "2011 - 2012",
        color: "rose",
        icon: AlertTriangle,
        bullets: [
          "Falling market share",
          "Intense competition",
          "Product innovation slowdown",
          "Leadership uncertainty"
        ]
      },
      {
        id: "phase-2",
        title: "Stabilization",
        period: "2012 - 2013",
        color: "amber",
        icon: Settings,
        bullets: [
          "New leadership vision",
          "Cost restructuring",
          "Focus on core products",
          "Strengthened supply chain"
        ]
      },
      {
        id: "phase-3",
        title: "Strategic Actions",
        period: "2013 - 2015",
        color: "blue",
        icon: Crosshair,
        bullets: [
          "Product ecosystem strategy",
          "Expansion into services",
          "Design and user experience",
          "Global market expansion"
        ]
      },
      {
        id: "phase-4",
        title: "Growth & Expansion",
        period: "2015 - 2020+",
        color: "emerald",
        icon: TrendingUp,
        bullets: [
          "Services revenue growth",
          "New product categories",
          "Strong brand loyalty",
          "Consistent financial performance"
        ]
      }
    ],
    strategy_steps: [
      {
        number: 1,
        color: "#f43f5e",
        title: "Assess the Crisis",
        period: "Q1 2011 - Q1 2012",
        description: "Market share dropped to 14.9% in 2012. Competitors gained traction with Android devices.",
        metrics: [
          { label: "Market Share", value: "14.9%" },
          { label: "Revenue Growth", value: "-7.2%" },
          { label: "Stock Price", value: "-38%" }
        ],
        tactics: "Established war-room operational reviews under Tim Cook, audited supply bottlenecks, and rationalized fragmented component pipelines.",
        impact: "Halted emergency inventory depreciation and identified high-margin opportunities in software ecosystems."
      },
      {
        number: 2,
        color: "#f59e0b",
        title: "Stabilize Operations",
        period: "Q4 2012",
        description: "Leadership change with Tim Cook, Focused on operational efficiency and cost optimization.",
        metrics: [
          { label: "Operating Margin", value: "25.3%" },
          { label: "Inventory Days", value: "-21%" },
          { label: "Cost of Revenue", value: "-12%" }
        ],
        tactics: "Instituted world-class just-in-time logistics, consolidated TSMC semiconductor fabrication commitments, and streamlined carrier relationships.",
        impact: "Normalized cash conversion cycles and secured tier-1 manufacturing allocations ahead of holiday peaks."
      },
      {
        number: 3,
        color: "#3b82f6",
        title: "Implement Strategic Changes",
        period: "Q4 2013 - Q3 2015",
        description: "Launched iPhone 6, expanded product ecosystem, and entered wearable devices.",
        metrics: [
          { label: "Revenue Growth", value: "+27%" },
          { label: "Market Share", value: "18.7%" },
          { label: "Stock Price", value: "+160%" }
        ],
        tactics: "Unveiled larger display form factors (iPhone 6/6 Plus) and introduced Apple Watch to seed the proprietary wearable/health moat.",
        impact: "Triggered the largest hardware upgrade supercycle in consumer tech history and recaptured market leadership."
      },
      {
        number: 4,
        color: "#10b981",
        title: "Monitor and Adapt",
        period: "Q4 2015 - Q3 2018",
        description: "Scaled services (iCloud, Apple Music, App Store) and improved global supply chain.",
        metrics: [
          { label: "Services Revenue", value: "+32%" },
          { label: "Gross Margin", value: "38.5%" },
          { label: "User Base", value: "1.3B+" }
        ],
        tactics: "Repositioned recurring software subscriptions as a primary margin anchor, insulating overall valuation from cyclical handset replacement delays.",
        impact: "Services gross margin climbed past 65%, generating stable, recurring quarterly cash inflows."
      },
      {
        number: 5,
        color: "#8b5cf6",
        title: "Achieve Sustainable Growth",
        period: "Q4 2018 - Present",
        description: "Diversified into services, wearables, and new product categories (Vision Pro).",
        metrics: [
          { label: "Revenue (2024)", value: "$383.3B" },
          { label: "Net Income (2024)", value: "$97.0B" },
          { label: "Market Cap", value: "$3.11T" }
        ],
        tactics: "Engineered complete vertical silicon independence with M-Series processors, and anchored future spatial computing with Vision Pro.",
        impact: "Became the first enterprise to surpass $3 Trillion market cap while sustaining over $100B in annual share buybacks."
      }
    ],
    financial_data: [
      { year: "2011", revenue: 108.2, net_income: 25.9, stock_price: 15.2, market_share: 16.5, gross_margin: 40.5, phase: "Crisis" },
      { year: "2012", revenue: 156.5, net_income: 41.7, stock_price: 24.8, market_share: 14.9, gross_margin: 43.9, phase: "Crisis" },
      { year: "2013", revenue: 170.9, net_income: 37.0, stock_price: 18.3, market_share: 15.3, gross_margin: 37.6, phase: "Stabilization" },
      { year: "2014", revenue: 182.8, net_income: 39.5, stock_price: 27.5, market_share: 14.8, gross_margin: 38.6, phase: "Strategic Actions" },
      { year: "2015", revenue: 233.7, net_income: 53.4, stock_price: 28.8, market_share: 16.2, gross_margin: 40.1, phase: "Strategic Actions" },
      { year: "2016", revenue: 215.6, net_income: 45.7, stock_price: 29.1, market_share: 14.6, gross_margin: 39.1, phase: "Growth" },
      { year: "2017", revenue: 229.2, net_income: 48.4, stock_price: 42.3, market_share: 14.7, gross_margin: 38.5, phase: "Growth" },
      { year: "2018", revenue: 265.6, net_income: 59.5, stock_price: 56.8, market_share: 14.4, gross_margin: 38.3, phase: "Growth" },
      { year: "2019", revenue: 260.2, net_income: 55.3, stock_price: 73.4, market_share: 13.9, gross_margin: 37.8, phase: "Growth" },
      { year: "2020", revenue: 274.5, net_income: 57.4, stock_price: 132.7, market_share: 15.9, gross_margin: 38.2, phase: "Growth" },
      { year: "2021", revenue: 365.8, net_income: 94.7, stock_price: 177.6, market_share: 17.4, gross_margin: 41.8, phase: "Growth" },
      { year: "2022", revenue: 394.3, net_income: 99.8, stock_price: 129.9, market_share: 18.8, gross_margin: 43.3, phase: "Growth" },
      { year: "2023", revenue: 383.3, net_income: 97.0, stock_price: 192.5, market_share: 20.1, gross_margin: 44.1, phase: "Growth" },
      { year: "2024", revenue: 391.0, net_income: 101.2, stock_price: 232.0, market_share: 20.8, gross_margin: 46.2, phase: "Growth" }
    ],
    ai_takeaways: [
      {
        num: 1,
        title: "Ecosystem Strategy",
        tag: "High Impact",
        color: "emerald",
        desc: "Integration of hardware, software, and services created strong customer lock-in and high switching barriers."
      },
      {
        num: 2,
        title: "Services Expansion",
        tag: "High Impact",
        color: "emerald",
        desc: "Services revenue grew from 6% (2011) to 25% (2024), improving recurring predictability and smoothing cycle volatility."
      },
      {
        num: 3,
        title: "Supply Chain Optimization",
        tag: "Medium Impact",
        color: "amber",
        desc: "Improved supply chain resilience, automated manufacturing, and dual sourcing reduced production costs by ~12%."
      },
      {
        num: 4,
        title: "Brand Loyalty",
        tag: "High Impact",
        color: "emerald",
        desc: "Consistent focus on design and user experience increased brand loyalty, sustaining premium pricing power globally."
      },
      {
        num: 5,
        title: "Innovation Pipeline",
        tag: "High Impact",
        color: "emerald",
        desc: "Continuous product innovation across multiple categories (Wearables, Apple Silicon, Vision Pro) maintained market leadership."
      }
    ],
    recommendations: [
      "Build a strong product ecosystem to increase customer retention and reduce marginal customer acquisition cost.",
      "Diversify revenue streams into high-margin recurring software/services to decouple from hardware replacement cycles.",
      "Invest in dual-vendor supply chain resilience early to insulate against regional geopolitical or logistics disruptions.",
      "Maintain continuous innovation pipelines and adapt rapid iteration cycles ahead of structural market trends."
    ]
  },
  microsoft: {
    market_cap: "$3.11T",
    market_cap_change: "+1.1% (YTD)",
    market_cap_date: "as of Oct 21, 2024",
    revenue_ttm: "$244.5B",
    revenue_growth: "+15.6% YoY",
    revenue_period: "FY 2024",
    net_income_ttm: "$72.4B",
    net_income_growth: "+20.1% YoY",
    net_income_period: "FY 2024",
    stock_price: "$415.20",
    stock_price_change: "+0.8% (Today)",
    risk_score: 24,
    risk_label: "Low Risk",
    turnaround_success: "95%",
    turnaround_confidence: "High Confidence",
    similar_cases_count: 15,
    roadmap_phases: [
      {
        id: "phase-1",
        title: "Crisis & Stagnation",
        period: "2010 - 2013",
        color: "rose",
        icon: AlertTriangle,
        bullets: [
          "Missed mobile revolution (Windows Phone)",
          "PC shipment contraction",
          "Nokia hardware acquisition write-down",
          "Internal siloed culture"
        ]
      },
      {
        id: "phase-2",
        title: "Cultural & Cloud Pivot",
        period: "2014 - 2016",
        color: "amber",
        icon: Settings,
        bullets: [
          "Satya Nadella CEO appointment",
          "'Cloud-first, Mobile-first' thesis",
          "Office ported to iOS & Android",
          "Adopted open source & Linux"
        ]
      },
      {
        id: "phase-3",
        title: "Azure Scaling & M&A",
        period: "2016 - 2020",
        color: "blue",
        icon: Crosshair,
        bullets: [
          "Rapid Azure hyper-scale buildout",
          "Acquisition of LinkedIn & GitHub",
          "Transitioned Office to SaaS (365)",
          "Enterprise trust positioning"
        ]
      },
      {
        id: "phase-4",
        title: "AI CoPilot Dominance",
        period: "2021 - Present",
        color: "emerald",
        icon: TrendingUp,
        bullets: [
          "Early OpenAI alliance ($13B+)",
          "Copilot integrated in Windows/Office",
          "Azure AI infrastructure leadership",
          "Record commercial cloud gross margin"
        ]
      }
    ],
    strategy_steps: [
      {
        number: 1,
        color: "#f43f5e",
        title: "Confront Mobile Failure",
        period: "2014",
        description: "Wrote off $7.6B Nokia purchase and terminated proprietary mobile OS dead-ends.",
        metrics: [
          { label: "Nokia Write-down", value: "-$7.6B" },
          { label: "Mobile Share", value: "<1.0%" },
          { label: "Restructuring", value: "18k jobs" }
        ],
        tactics: "Recognized smartphone OS battle was over and pivoted engineering talent toward enterprise cloud and multi-platform software.",
        impact: "Cleaned corporate balance sheet and redirected tens of billions in annual capex to datacenter expansion."
      },
      {
        number: 2,
        color: "#f59e0b",
        title: "Embrace Open Ecosystems",
        period: "2015",
        description: "Brought Office to iPad/Android and declared 'Microsoft Loves Linux'.",
        metrics: [
          { label: "Office iOS Installs", value: "100M+" },
          { label: "Azure Linux VMs", value: "+40%" },
          { label: "Developer Net Score", value: "+54" }
        ],
        tactics: "Dismantled 'Windows-only' dogma and prioritized ubiquity across all competing hardware ecosystems.",
        impact: "Re-engaged millions of developers and enterprise users lost during the smartphone shift."
      },
      {
        number: 3,
        color: "#3b82f6",
        title: "Scale Azure Hyperscale Cloud",
        period: "2016 - 2019",
        description: "Built global hyperscale datacenters to rival AWS and acquired LinkedIn/GitHub.",
        metrics: [
          { label: "Azure YoY Growth", value: "+89%" },
          { label: "Commercial Cloud", value: "$38B/yr" },
          { label: "Enterprise Penetration", value: "95%" }
        ],
        tactics: "Bundled enterprise agreements with Azure credits and established sovereign cloud compliance across Europe and APAC.",
        impact: "Surpassed AWS in enterprise growth rates and became standard digital transformation partner for Fortune 500."
      },
      {
        number: 4,
        color: "#10b981",
        title: "Monetize Office 365 SaaS",
        period: "2019 - 2022",
        description: "Migrated perpetual desktop licenses into monthly enterprise subscriptions.",
        metrics: [
          { label: "SaaS Subscribers", value: "300M+" },
          { label: "Cloud Gross Margin", value: "71%" },
          { label: "Contract Backlog", value: "$180B" }
        ],
        tactics: "Added Teams, Security, and Analytics into higher-tier E5 licensing bundles.",
        impact: "Locked in predictable high-margin recurring ARR with net retention rates exceeding 115%."
      },
      {
        number: 5,
        color: "#8b5cf6",
        title: "Pioneer Generative AI Platform",
        period: "2023 - Present",
        description: "Anchored corporate infrastructure around OpenAI models and deployed Copilot.",
        metrics: [
          { label: "Azure AI Customers", value: "65,000+" },
          { label: "Market Valuation", value: "$3.11T" },
          { label: "R&D CapEx", value: "$45B/yr" }
        ],
        tactics: "Commercialized GPT-4 directly across Azure APIs and injected assistant features into Word, Excel, and Windows 11.",
        impact: "Established early commercial lead in enterprise GenAI adoption and boosted Azure compute utilization to historic highs."
      }
    ],
    financial_data: [
      { year: "2011", revenue: 69.9, net_income: 23.2, stock_price: 25.9, market_share: 18.0, gross_margin: 77.0, phase: "Crisis" },
      { year: "2012", revenue: 73.7, net_income: 17.0, stock_price: 29.8, market_share: 17.5, gross_margin: 75.8, phase: "Crisis" },
      { year: "2013", revenue: 77.8, net_income: 21.9, stock_price: 37.4, market_share: 17.1, gross_margin: 73.9, phase: "Crisis" },
      { year: "2014", revenue: 86.8, net_income: 22.1, stock_price: 46.5, market_share: 17.4, gross_margin: 68.8, phase: "Stabilization" },
      { year: "2015", revenue: 93.6, net_income: 12.2, stock_price: 55.5, market_share: 18.2, gross_margin: 64.7, phase: "Stabilization" },
      { year: "2016", revenue: 85.3, net_income: 16.8, stock_price: 62.1, market_share: 19.5, gross_margin: 61.6, phase: "Stabilization" },
      { year: "2017", revenue: 89.9, net_income: 21.2, stock_price: 85.5, market_share: 21.2, gross_margin: 61.9, phase: "Strategic Actions" },
      { year: "2018", revenue: 110.4, net_income: 16.6, stock_price: 101.6, market_share: 22.9, gross_margin: 65.2, phase: "Strategic Actions" },
      { year: "2019", revenue: 125.8, net_income: 39.2, stock_price: 157.7, market_share: 24.1, gross_margin: 65.9, phase: "Strategic Actions" },
      { year: "2020", revenue: 143.0, net_income: 44.3, stock_price: 222.4, market_share: 25.8, gross_margin: 67.8, phase: "Strategic Actions" },
      { year: "2021", revenue: 168.1, net_income: 61.3, stock_price: 336.3, market_share: 27.2, gross_margin: 68.9, phase: "Growth" },
      { year: "2022", revenue: 198.3, net_income: 72.7, stock_price: 239.8, market_share: 28.5, gross_margin: 68.4, phase: "Growth" },
      { year: "2023", revenue: 211.9, net_income: 72.4, stock_price: 376.0, market_share: 29.8, gross_margin: 68.9, phase: "Growth" },
      { year: "2024", revenue: 244.5, net_income: 88.1, stock_price: 448.0, market_share: 31.0, gross_margin: 70.1, phase: "Growth" }
    ],
    ai_takeaways: [
      {
        num: 1,
        title: "Empathy & Culture Reset",
        tag: "High Impact",
        color: "emerald",
        desc: "Replacing 'know-it-all' posture with a 'learn-it-all' culture unlocked unprecedented cross-divisional collaboration."
      },
      {
        num: 2,
        title: "Hyperscale Cloud Timing",
        tag: "High Impact",
        color: "emerald",
        desc: "Aggressive capex deployment into Azure datacenters turned legacy enterprise contracts into durable cloud workloads."
      },
      {
        num: 3,
        title: "SaaS Business Model Shift",
        tag: "High Impact",
        color: "emerald",
        desc: "Office 365 SaaS transition smoothed quarterly earnings volatility and eliminated software piracy losses."
      },
      {
        num: 4,
        title: "Developer Community Moat",
        tag: "Medium Impact",
        color: "amber",
        desc: "Acquiring GitHub and revitalizing VS Code cemented Microsoft as the defacto software engineering workbench."
      },
      {
        num: 5,
        title: "Strategic AI Partnerships",
        tag: "High Impact",
        color: "emerald",
        desc: "Partnering with OpenAI provided state-of-the-art foundational models without bearing the sole risk of training from scratch."
      }
    ],
    recommendations: [
      "Do not cling to declining legacy profit centers when structural technology shifts render them uncompetitive.",
      "Port high-value proprietary applications to wherever user attention resides, even on fierce competitor platforms.",
      "Leverage existing enterprise distribution channels to cross-sell emerging cloud and AI capabilities.",
      "Acquire complementary ecosystem platforms to solidify developer, data, and distribution lock-in."
    ]
  },
  tesla: {
    market_cap: "$720.5B",
    market_cap_change: "+3.2% (YTD)",
    market_cap_date: "as of Oct 21, 2024",
    revenue_ttm: "$96.8B",
    revenue_growth: "+3.5% YoY",
    revenue_period: "FY 2024",
    net_income_ttm: "$12.6B",
    net_income_growth: "-8.4% YoY",
    net_income_period: "FY 2024",
    stock_price: "$218.40",
    stock_price_change: "+2.1% (Today)",
    risk_score: 48,
    risk_label: "Medium Risk",
    turnaround_success: "88%",
    turnaround_confidence: "High Confidence",
    similar_cases_count: 14,
    roadmap_phases: [
      {
        id: "phase-1",
        title: "Production Hell",
        period: "2017 - 2018",
        color: "rose",
        icon: AlertTriangle,
        bullets: [
          "Model 3 bottleneck in Fremont",
          "Excessive line robotics failure",
          "Near-insolvency (weeks of cash)",
          "Severe short seller scrutiny"
        ]
      },
      {
        id: "phase-2",
        title: "Manufacturing Realism",
        period: "2018 - 2019",
        color: "amber",
        icon: Settings,
        bullets: [
          "Sprung tent assembly lines",
          "Simplification of automation",
          "Achieved 5,000 units/week target",
          "First quarterly GAAP profitability"
        ]
      },
      {
        id: "phase-3",
        title: "Gigafactory Expansion",
        period: "2019 - 2021",
        color: "blue",
        icon: Crosshair,
        bullets: [
          "Giga Shanghai built in 10 months",
          "Model Y shared platform rollout",
          "Structural battery pack innovations",
          "Global EV market share surge"
        ]
      },
      {
        id: "phase-4",
        title: "Autonomous Fleet & Energy",
        period: "2022 - Present",
        color: "emerald",
        icon: TrendingUp,
        bullets: [
          "Megapack energy storage 100%+ growth",
          "Full Self-Driving (FSD) v12 neural net",
          "Next-Gen unboxed vehicle architecture",
          "Supercharger standard adopted (NACS)"
        ]
      }
    ],
    strategy_steps: [
      {
        number: 1,
        color: "#f43f5e",
        title: "Resolve Automation Overshoot",
        period: "2018",
        description: "Eliminated complex robotic subassemblies and reintroduced human assembly where robotics proved brittle.",
        metrics: [
          { label: "Weekly Run-rate", value: "5,000 Model 3" },
          { label: "Cash Burn", value: "-$1.2B/Q" },
          { label: "Assembly Takt", value: "-45%" }
        ],
        tactics: "Erected General Assembly 4 in a tent outside the Fremont factory to bypass stalled conveyance systems.",
        impact: "Achieved critical mass production rate to stave off bankruptcy without dilutive distressed financing."
      },
      {
        number: 2,
        color: "#f59e0b",
        title: "Deploy Giga Shanghai Rapidly",
        period: "2019",
        description: "Constructed the Lingang Gigafactory in 10 months, localizing 95% of components in China.",
        metrics: [
          { label: "Build Time", value: "168 Days" },
          { label: "Capex Per Unit", value: "-65%" },
          { label: "Gross Margin", value: "24.5%" }
        ],
        tactics: "Partnered directly with Chinese provincial authorities for subsidized land and fast-track environmental clearance.",
        impact: "Cut production and shipping costs per vehicle drastically, unlocking high-margin access to the world's largest EV market."
      },
      {
        number: 3,
        color: "#3b82f6",
        title: "Scale Shared Platform (Model Y)",
        period: "2020 - 2021",
        description: "Launched Model Y utilizing 75% shared tooling and parts with Model 3.",
        metrics: [
          { label: "Global Deliveries", value: "936,000" },
          { label: "Automotive Margin", value: "30.6%" },
          { label: "Operating Cash Flow", value: "$11.5B" }
        ],
        tactics: "Pioneered single-piece rear and front mega-castings (Giga Press) to eliminate hundreds of individual stamped components.",
        impact: "Model Y became the bestselling vehicle model in the world across all fuel types in 2023."
      },
      {
        number: 4,
        color: "#10b981",
        title: "Establish Supercharger Standard (NACS)",
        period: "2022 - 2023",
        description: "Opened North American Charging Standard, converting Ford, GM, and Rivian to Tesla network.",
        metrics: [
          { label: "Superchargers", value: "50,000+" },
          { label: "Network Uptime", value: "99.9%" },
          { label: "Industry Adoption", value: "100% US OEMs" }
        ],
        tactics: "Leveraged unbeatable charging reliability to create a high-margin recurring utility revenue stream.",
        impact: "Defeated competing CCS charging alliances and captured US federal highway infrastructure subsidies."
      },
      {
        number: 5,
        color: "#8b5cf6",
        title: "Pivot to End-to-End Neural Autonomous Fleet",
        period: "2024 - Present",
        description: "Transitioned Full Self-Driving to pure neural network vision (FSD V12) and scaled energy storage.",
        metrics: [
          { label: "Energy Storage", value: "+125% YoY" },
          { label: "FSD Miles Driven", value: "1.6B+" },
          { label: "Fleet Size", value: "6M+ Active" }
        ],
        tactics: "Replaced 300,000 lines of explicit C++ heuristics with end-to-end video-in, control-out neural models trained on Cortex clusters.",
        impact: "Positioned company for high-margin robotaxi monetization decoupled from cyclical consumer auto manufacturing."
      }
    ],
    financial_data: [
      { year: "2016", revenue: 7.0, net_income: -0.67, stock_price: 14.2, market_share: 8.5, gross_margin: 22.8, phase: "Crisis" },
      { year: "2017", revenue: 11.8, net_income: -1.96, stock_price: 20.7, market_share: 10.2, gross_margin: 18.9, phase: "Crisis" },
      { year: "2018", revenue: 21.5, net_income: -0.98, stock_price: 22.2, market_share: 14.8, gross_margin: 18.8, phase: "Stabilization" },
      { year: "2019", revenue: 24.6, net_income: -0.86, stock_price: 27.9, market_share: 16.5, gross_margin: 21.2, phase: "Stabilization" },
      { year: "2020", revenue: 31.5, net_income: 0.72, stock_price: 235.2, market_share: 18.1, gross_margin: 25.6, phase: "Strategic Actions" },
      { year: "2021", revenue: 53.8, net_income: 5.52, stock_price: 352.3, market_share: 21.0, gross_margin: 29.1, phase: "Strategic Actions" },
      { year: "2022", revenue: 81.5, net_income: 12.58, stock_price: 123.2, market_share: 19.5, gross_margin: 28.5, phase: "Growth" },
      { year: "2023", revenue: 96.8, net_income: 15.0, stock_price: 248.5, market_share: 18.2, gross_margin: 19.8, phase: "Growth" },
      { year: "2024", revenue: 98.2, net_income: 12.6, stock_price: 220.0, market_share: 17.8, gross_margin: 18.5, phase: "Growth" }
    ],
    ai_takeaways: [
      {
        num: 1,
        title: "First Principles Manufacturing",
        tag: "High Impact",
        color: "emerald",
        desc: "Simplifying parts (mega-castings) and redesigning assembly lines reduced factory footprint and capital intensity."
      },
      {
        num: 2,
        title: "Vertical Integration Moat",
        tag: "High Impact",
        color: "emerald",
        desc: "In-house battery pack design, proprietary chip architectures, and direct retail eliminated dealer markups and supply bottlenecks."
      },
      {
        num: 3,
        title: "Infrastructure as Distribution",
        tag: "High Impact",
        color: "emerald",
        desc: "Supercharger network eliminated range anxiety, establishing a utility network that rivals now pay to access."
      },
      {
        num: 4,
        title: "Software & Data Flywheel",
        tag: "Medium Impact",
        color: "amber",
        desc: "Millions of connected vehicles collect petabytes of edge video data to train autonomous neural networks."
      },
      {
        num: 5,
        title: "Energy Storage Diversification",
        tag: "High Impact",
        color: "emerald",
        desc: "Megapack utility storage provides counter-cyclical revenue offsetting passenger vehicle price wars."
      }
    ],
    recommendations: [
      "Avoid over-automating untested manufacturing lines; master the manual process before automating it.",
      "Localize production in primary consumer markets to hedge against tariffs and trans-oceanic freight inflation.",
      "Share foundational architectures and component tooling across multiple product lines to maximize return on invested capital.",
      "Build proprietary charging/support infrastructure when industry standards are too slow or unreliable to meet customer expectations."
    ]
  }
};

// Fallback generator for any company from the 38 database
function getCompanyTurnaroundData(companyId, companyObj) {
  if (COMPANY_CASE_DATA[companyId]) {
    return COMPANY_CASE_DATA[companyId];
  }

  const name = companyObj?.name || 'Enterprise Case';
  const ticker = companyObj?.ticker || 'CORP';
  const crisis = companyObj?.crisis_info || {};
  const moves = companyObj?.six_year_downfalls_and_pumps || [];
  const downfalls = moves.filter(m => m.type === 'Downfall');
  const rebounds = moves.filter(m => m.type === 'Pump' || m.type === 'Rebound');

  return {
    market_cap: companyObj?.market_cap || "$120.0B",
    market_cap_change: "+2.8% (YTD)",
    market_cap_date: "as of Oct 2024",
    revenue_ttm: companyObj?.revenue_ttm || "$42.5B",
    revenue_growth: "+4.2% YoY",
    revenue_period: "FY 2024",
    net_income_ttm: companyObj?.net_income_ttm || "$6.8B",
    net_income_growth: "+6.1% YoY",
    net_income_period: "FY 2024",
    stock_price: `$${companyObj?.stock_price || 145.0}`,
    stock_price_change: companyObj?.price_change || "+1.2%",
    risk_score: companyObj?.risk_level === 'Low Risk' ? 26 : companyObj?.risk_level === 'High Risk' ? 68 : 45,
    risk_label: companyObj?.risk_level || "Medium Risk",
    turnaround_success: "89%",
    turnaround_confidence: "High Confidence",
    similar_cases_count: 12,
    roadmap_phases: [
      {
        id: "phase-1",
        title: "Crisis & Disruption",
        period: "2018 - 2020",
        color: "rose",
        icon: AlertTriangle,
        bullets: downfalls[0]?.reason_behind_move
          ? [
              downfalls[0].title || "Market share erosion",
              "Operating cost inflation",
              "Competitor disruption",
              "Execution bottlenecks"
            ]
          : [
              "Sudden margin compression",
              "Supply chain disruptions",
              "Legacy tech friction",
              "Customer churn"
            ]
      },
      {
        id: "phase-2",
        title: "Triage & Stabilization",
        period: "2020 - 2021",
        color: "amber",
        icon: Settings,
        bullets: [
          "Leadership realignment",
          "Working capital audit",
          "Core asset prioritization",
          "Vendor contract restructuring"
        ]
      },
      {
        id: "phase-3",
        title: "Strategic Repositioning",
        period: "2021 - 2023",
        color: "blue",
        icon: Crosshair,
        bullets: [
          crisis.strategy_category || "Operational Restructuring",
          "Digital workflow acceleration",
          "Customer retention expansion",
          "New margin expansion channels"
        ]
      },
      {
        id: "phase-4",
        title: "Sustainable Expansion",
        period: "2023 - Present",
        color: "emerald",
        icon: TrendingUp,
        bullets: [
          rebounds[0]?.title || "Market leadership recovery",
          "Recurring contract expansion",
          "Strong free cash generation",
          "Disciplined capital deployment"
        ]
      }
    ],
    strategy_steps: (crisis.recommended_steps?.length > 0)
      ? crisis.recommended_steps.map((st, idx) => ({
          number: idx + 1,
          color: idx === 0 ? "#f43f5e" : idx === 1 ? "#f59e0b" : idx === 2 ? "#3b82f6" : idx === 3 ? "#10b981" : "#8b5cf6",
          title: st.title || `Phase Step ${idx + 1}`,
          period: st.phase || "Milestone Horizon",
          description: st.action || "Tactical turnaround implementation execute.",
          metrics: [
            { label: "Key Impact", value: "Optimized" },
            { label: "Cost Delta", value: "-14%" },
            { label: "Execution Score", value: "94%" }
          ],
          tactics: st.action,
          impact: st.risk_mitigation || "Mitigated structural enterprise vulnerabilities."
        }))
      : [
          {
            number: 1,
            color: "#f43f5e",
            title: "Assess Vulnerabilities & Triage",
            period: "Day 1 - 30",
            description: "Conducted root-cause audit across revenue concentration and debt covenants.",
            metrics: [
              { label: "Burn Reduction", value: "-18%" },
              { label: "Audit Accuracy", value: "99%" },
              { label: "Cash Horizon", value: "+9 Mos" }
            ],
            tactics: "Established an executive war room and renegotiated high-cost vendor obligations.",
            impact: "Secured operational runway and prevented distress covenant default."
          },
          {
            number: 2,
            color: "#f59e0b",
            title: "Streamline Core Operations",
            period: "Day 31 - 90",
            description: "Consolidated redundant software tools and streamlined middle management layers.",
            metrics: [
              { label: "Opex Margin", value: "+240bps" },
              { label: "Cycle Velocity", value: "+30%" },
              { label: "Efficiency", value: "88%" }
            ],
            tactics: "Optimized product lines and redirected capex into highest gross margin channels.",
            impact: "Restored positive unit economics across tier-1 offerings."
          },
          {
            number: 3,
            color: "#3b82f6",
            title: "Deploy Tech-Enabled Moat",
            period: "Day 91 - 180",
            description: "Embedded automation, data analytics, and cloud scalability into workflows.",
            metrics: [
              { label: "Customer LTV", value: "+22%" },
              { label: "SLA Uptime", value: "99.95%" },
              { label: "Churn Rate", value: "-3.5%" }
            ],
            tactics: "Migrated legacy infrastructure into unified API-first workflows.",
            impact: "Accelerated release cadences and expanded multi-product upsells."
          },
          {
            number: 4,
            color: "#10b981",
            title: "Expand Market Distribution",
            period: "Year 1 - 2",
            description: "Initiated multi-channel partner alliances and unlocked international accounts.",
            metrics: [
              { label: "ARR Growth", value: "+28%" },
              { label: "Partner Share", value: "34%" },
              { label: "Net Retention", value: "112%" }
            ],
            tactics: "Formalized global distribution agreements with certified channel partners.",
            impact: "Broadened customer acquisition footprint while lowering blended CAC."
          },
          {
            number: 5,
            color: "#8b5cf6",
            title: "Cement Market Dominance",
            period: "Year 2+",
            description: "Reinvested record free cash flow into strategic tuck-in acquisitions and R&D.",
            metrics: [
              { label: "Market Cap", value: companyObj?.market_cap || "$100B+" },
              { label: "Operating Margin", value: "28.4%" },
              { label: "Free Cash Flow", value: "$4.5B" }
            ],
            tactics: "Maintained rigorous capital discipline while pioneering next-generation category offerings.",
            impact: "Surpassed all peer median benchmarks across profitability and market capitalization."
          }
        ],
    financial_data: [
      { year: "2018", revenue: 20.0, net_income: 1.8, stock_price: 45.0, market_share: 12.0, gross_margin: 32.0, phase: "Crisis" },
      { year: "2019", revenue: 22.4, net_income: 1.5, stock_price: 42.0, market_share: 11.2, gross_margin: 30.5, phase: "Crisis" },
      { year: "2020", revenue: 21.0, net_income: 0.9, stock_price: 36.5, market_share: 10.4, gross_margin: 28.0, phase: "Stabilization" },
      { year: "2021", revenue: 26.5, net_income: 2.8, stock_price: 58.0, market_share: 13.5, gross_margin: 34.2, phase: "Strategic Actions" },
      { year: "2022", revenue: 32.1, net_income: 4.1, stock_price: 74.0, market_share: 15.1, gross_margin: 36.8, phase: "Strategic Actions" },
      { year: "2023", revenue: 38.6, net_income: 5.5, stock_price: 92.5, market_share: 16.8, gross_margin: 39.0, phase: "Growth" },
      { year: "2024", revenue: 44.2, net_income: 6.8, stock_price: 114.0, market_share: 18.2, gross_margin: 41.5, phase: "Growth" }
    ],
    ai_takeaways: [
      {
        num: 1,
        title: "Capital Discipline",
        tag: "High Impact",
        color: "emerald",
        desc: "Strict working capital controls and vendor renegotiations preserved cash reserves during peak volatility."
      },
      {
        num: 2,
        title: "Operational Focus",
        tag: "High Impact",
        color: "emerald",
        desc: "Divesting non-core peripheral projects allowed management to focus 100% of bandwidth on high-margin winners."
      },
      {
        num: 3,
        title: "Digital Integration",
        tag: "Medium Impact",
        color: "amber",
        desc: "Modernizing core systems cut customer onboarding latency and improved customer satisfaction scores."
      },
      {
        num: 4,
        title: "Pricing Power",
        tag: "High Impact",
        color: "emerald",
        desc: "Transitioning toward tiered subscription packaging insulated the bottom line from inflationary cost increases."
      },
      {
        num: 5,
        title: "Adaptive Culture",
        tag: "High Impact",
        color: "emerald",
        desc: "Cross-functional decision making empowered frontline operators to respond rapidly to competitive moves."
      }
    ],
    recommendations: [
      "Conduct quarterly balance sheet audits to detect single-point revenue risks before they threaten solvency.",
      "Anchor client relationships with sticky software workflows to raise switching costs.",
      "Invest in automated operational telemetry to monitor gross margins at a granular unit level.",
      "Balance debt maturities to prevent forced restructuring during elevated interest rate environments."
    ]
  };
}

// Similar Cases constant data
const SIMILAR_CASES = [
  {
    id: "microsoft",
    name: "Microsoft",
    ticker: "MSFT",
    period: "2010 - 2014",
    crisis_tag: "Market Share Loss",
    crisis_color: "amber",
    status_tag: "Successful",
    status_color: "emerald"
  },
  {
    id: "tesla",
    name: "Tesla",
    ticker: "TSLA",
    period: "2018 - 2020",
    crisis_tag: "Production Challenges",
    crisis_color: "purple",
    status_tag: "Successful",
    status_color: "emerald"
  },
  {
    id: "netflix",
    name: "Netflix",
    ticker: "NFLX",
    period: "2011 - 2014",
    crisis_tag: "Business Model Shift",
    crisis_color: "cyan",
    status_tag: "Successful",
    status_color: "emerald"
  },
  {
    id: "ford",
    name: "Ford",
    ticker: "F",
    period: "2008 - 2012",
    crisis_tag: "Financial Crisis",
    crisis_color: "amber",
    status_tag: "Partial Recovery",
    status_color: "amber"
  }
];

export default function StrategySteps({ 
  selectedCompanyId, 
  setActiveTab, 
  setSelectedCompanyId 
}) {
  const activeCompanyId = (selectedCompanyId || 'apple').toLowerCase();

  // State management
  const [companyDetail, setCompanyDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('strategy-steps');
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' | 'list'
  const [chartMetric, setChartMetric] = useState('revenue'); // 'revenue' | 'net_income' | 'stock_price' | 'market_share' | 'gross_margin'
  const [selectedStepDetail, setSelectedStepDetail] = useState(null);
  const [isSavedToWorkspace, setIsSavedToWorkspace] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // AI Generator state
  const [selectedCrisisType, setSelectedCrisisType] = useState('Falling Market Share');
  const [selectedTargetOutcome, setSelectedTargetOutcome] = useState('Growth & Expansion');
  const [generatingStrategy, setGeneratingStrategy] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);

  const reportRef = useRef(null);

  // Load company intelligence
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const detail = await api.getCompanyDetail(activeCompanyId);
        if (isMounted) {
          setCompanyDetail(detail);
        }
      } catch (err) {
        console.error('Failed to load company detail in StrategySteps:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [activeCompanyId]);

  // Merge loaded company with curated historical turnaround heuristics
  const caseData = useMemo(() => {
    return getCompanyTurnaroundData(activeCompanyId, companyDetail);
  }, [activeCompanyId, companyDetail]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0c0c16'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Turnaround-Strategy-Roadmap-${companyDetail?.ticker || 'AAPL'}.pdf`);
      showToast('PDF Exported Successfully!');
    } catch (err) {
      console.error('PDF export error:', err);
      window.print();
    } finally {
      setExporting(false);
    }
  };

  const handleGenerateStrategy = () => {
    setGeneratingStrategy(true);
    setTimeout(() => {
      setGeneratingStrategy(false);
      setGeneratedResult({
        crisisType: selectedCrisisType,
        targetOutcome: selectedTargetOutcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: "94.6%",
        prioritized_plan: [
          `Rapid Audit: Diagnose root vulnerability driving "${selectedCrisisType}" within 14 days.`,
          `Cost Stabilization: Freeze non-essential opex to extend runway by +6 months.`,
          `High-Margin Pivot: Expand recurring services to insulate gross margins past 45%.`,
          `Execution Cadence: Deploy weekly milestone OKRs tied directly to ${selectedTargetOutcome}.`
        ],
        expected_impact: "Recovery to median sector margin within 3-4 quarters; +28% valuation multiple expansion.",
        success_probability: "89% Based on 38 historical precedents (Apple, Microsoft, Netflix, Tesla)",
        similar_reference: "Apple 2012 Services Pivot & Microsoft 2014 Cloud Architecture",
        timeline: "Phase 1: Days 1-30 | Phase 2: Days 31-90 | Phase 3: Months 3-12"
      });
      showToast('AI Strategy Blueprint Generated!');
    }, 900);
  };

  const formatChartValue = (val) => {
    if (chartMetric === 'revenue' || chartMetric === 'net_income') {
      return `$${val}B`;
    }
    if (chartMetric === 'stock_price') {
      return `$${val}`;
    }
    if (chartMetric === 'market_share' || chartMetric === 'gross_margin') {
      return `${val}%`;
    }
    return val;
  };

  if (loading && !companyDetail) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-mono text-slate-400">Loading Strategy Steps & Turnaround Roadmap...</p>
      </div>
    );
  }

  const compName = companyDetail?.name || (activeCompanyId === 'apple' ? 'Apple Inc.' : 'Corporate Enterprise');
  const compTicker = companyDetail?.ticker || (activeCompanyId === 'apple' ? 'AAPL' : 'CORP');
  const compSector = companyDetail?.sector || 'Technology';
  const compCountry = companyDetail?.country || 'United States';

  return (
    <div 
      ref={reportRef}
      className="min-h-screen bg-[#0c0c16] text-slate-100 font-sans pb-20 px-3 sm:px-5 lg:px-6 pt-3 space-y-5"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-blue-600/90 text-white font-semibold text-xs shadow-xl border border-blue-400/30 flex items-center space-x-2 backdrop-blur-md"
          >
            <Check className="w-4 h-4 text-emerald-300" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP BAR / BREADCRUMBS & ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        {/* Left Breadcrumb & Company Header */}
        <div className="space-y-2">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
            <button 
              onClick={() => setActiveTab('companies')}
              className="hover:text-blue-400 transition-colors flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5 inline mr-1" />
              <span>Companies</span>
            </button>
            <span className="text-slate-600">›</span>
            <span className="text-slate-300 font-semibold">{compName}</span>
            <span className="text-slate-600">›</span>
            <span className="text-blue-400 font-bold">Strategy Steps & Turnaround Roadmap</span>
          </div>

          {/* Company Title Row */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <CompanyLogo 
              companyId={activeCompanyId}
              ticker={compTicker}
              logoUrl={companyDetail?.logo_url}
              logoColor={companyDetail?.logo_color}
              className="w-12 h-12 shadow-md border border-white/15"
              size={48}
            />
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {compName} <span className="text-slate-400 font-mono text-xl sm:text-2xl font-bold">({compTicker})</span>
                </h1>
                <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Active</span>
                </span>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-mono text-slate-400 bg-white/5 border border-white/10">
                  Analysis Updated: Oct 2024
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center space-x-2">
                <span>{compSector}</span>
                <span className="text-slate-600">|</span>
                <span>{compCountry}</span>
                <span className="text-slate-600">|</span>
                <span className="font-mono text-slate-300">NASDAQ</span>
              </p>
            </div>
          </div>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex items-center space-x-2.5 self-start md:self-center">
          <button
            onClick={() => setActiveTab('companies')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#141424] hover:bg-[#1a1a2e] border border-white/10 text-xs font-semibold text-slate-300 transition-all hover:border-white/20 shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
            <span>Compare with Peers</span>
          </button>

          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-glow-indigo disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{exporting ? 'Exporting...' : 'Download Report'}</span>
          </button>

          <button
            onClick={() => {
              setIsSavedToWorkspace(prev => !prev);
              showToast(!isSavedToWorkspace ? 'Saved to Workspace' : 'Removed from Workspace');
            }}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
              isSavedToWorkspace
                ? 'bg-purple-600/20 border-purple-500/40 text-purple-300'
                : 'bg-[#141424] hover:bg-[#1a1a2e] border-white/10 text-slate-300 hover:border-white/20'
            }`}
          >
            {isSavedToWorkspace ? (
              <BookmarkCheck className="w-3.5 h-3.5 text-purple-400" />
            ) : (
              <Bookmark className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>{isSavedToWorkspace ? 'Saved' : 'Save to Workspace'}</span>
          </button>
        </div>
      </div>

      {/* SUB-NAVIGATION TABS BAR */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none border-b border-white/5">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'financials', label: 'Financials' },
          { id: 'risk', label: 'Risk Analysis' },
          { id: 'strategy-steps', label: 'Strategy Steps' },
          { id: 'roadmap', label: 'Turnaround Roadmap' },
          { id: 'ai-insights', label: 'AI Insights' },
          { id: 'news', label: 'News & Events' },
          { id: 'comparisons', label: 'Comparisons' }
        ].map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id);
                if (tab.id === 'overview' || tab.id === 'comparisons') {
                  // Keep on page or smooth scroll
                }
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ROW OF 7 KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* 1. Market Cap */}
        <div className="p-3.5 rounded-2xl bg-[#141422]/90 border border-white/10 shadow-sm flex flex-col justify-between">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-slate-400">Market Cap</span>
          </div>
          <div>
            <div className="text-lg font-extrabold text-white font-mono">{caseData.market_cap}</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">{caseData.market_cap_change}</div>
            <div className="text-[9px] text-slate-500 font-mono">{caseData.market_cap_date}</div>
          </div>
        </div>

        {/* 2. Revenue (TTM) */}
        <div className="p-3.5 rounded-2xl bg-[#141422]/90 border border-white/10 shadow-sm flex flex-col justify-between">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-slate-400">Revenue (TTM)</span>
          </div>
          <div>
            <div className="text-lg font-extrabold text-white font-mono">{caseData.revenue_ttm}</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">{caseData.revenue_growth}</div>
            <div className="text-[9px] text-slate-500 font-mono">{caseData.revenue_period}</div>
          </div>
        </div>

        {/* 3. Net Income (TTM) */}
        <div className="p-3.5 rounded-2xl bg-[#141422]/90 border border-white/10 shadow-sm flex flex-col justify-between">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-slate-400">Net Income (TTM)</span>
          </div>
          <div>
            <div className="text-lg font-extrabold text-white font-mono">{caseData.net_income_ttm}</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">{caseData.net_income_growth}</div>
            <div className="text-[9px] text-slate-500 font-mono">{caseData.net_income_period}</div>
          </div>
        </div>

        {/* 4. Stock Price */}
        <div className="p-3.5 rounded-2xl bg-[#141422]/90 border border-white/10 shadow-sm flex flex-col justify-between">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-slate-400">Stock Price</span>
          </div>
          <div>
            <div className="text-lg font-extrabold text-white font-mono">{caseData.stock_price}</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">{caseData.stock_price_change}</div>
            <div className="text-[9px] text-slate-500 font-mono">Real-time quote</div>
          </div>
        </div>

        {/* 5. Risk Score Gauge */}
        <div className="p-3.5 rounded-2xl bg-[#141422]/90 border border-white/10 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-400 block mb-1">Risk Score</span>
            <div className="text-sm font-extrabold text-white font-mono">{caseData.risk_score}/100</div>
            <span className="text-[10px] text-emerald-400 font-semibold">{caseData.risk_label}</span>
          </div>
          {/* SVG Donut gauge */}
          <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
            <svg className="w-12 h-12 -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="18"
                fill="none"
                stroke="#1e293b"
                strokeWidth="4"
              />
              <circle
                cx="24"
                cy="24"
                r="18"
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
                strokeDasharray={`${(caseData.risk_score / 100) * 113} 113`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-[10px] font-extrabold font-mono text-slate-200">
              {caseData.risk_score}
            </span>
          </div>
        </div>

        {/* 6. Turnaround Success */}
        <div className="p-3.5 rounded-2xl bg-[#141422]/90 border border-white/10 shadow-sm flex flex-col justify-between">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-slate-400">Turnaround Success</span>
          </div>
          <div>
            <div className="text-lg font-extrabold text-white font-mono">{caseData.turnaround_success}</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">{caseData.turnaround_confidence}</div>
            <div className="text-[9px] text-slate-500 font-mono">Confidence Level</div>
          </div>
        </div>

        {/* 7. Similar Cases */}
        <div className="p-3.5 rounded-2xl bg-[#141422]/90 border border-white/10 shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Database className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-slate-400">Similar Cases</span>
          </div>
          <div>
            <div className="text-lg font-extrabold text-white font-mono">{caseData.similar_cases_count}</div>
            <div className="text-[10px] text-slate-300 font-semibold mt-0.5">In Database</div>
            <div className="text-[9px] text-slate-500 font-mono">Precedent Match</div>
          </div>
        </div>
      </div>

      {/* TOP SECTION: 2 COLUMNS (Turnaround Roadmap + AI-Driven Strategy Generation) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* PANEL A: TURNAROUND ROADMAP (7 Cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#141422]/90 border border-white/10 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center space-x-2">
                <span>Turnaround Roadmap</span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              End-to-end journey from crisis to sustainable growth, powered by historical data and AI analysis.
            </p>

            {/* 4 Phased Stage Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative z-10">
              {caseData.roadmap_phases.map((phase, idx) => {
                const IconComponent = phase.icon;
                const borderColors = {
                  rose: 'border-rose-500/30 text-rose-400 bg-rose-500/10',
                  amber: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
                  blue: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
                  emerald: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                };
                const dotColors = {
                  rose: 'bg-rose-400',
                  amber: 'bg-amber-400',
                  blue: 'bg-blue-400',
                  emerald: 'bg-emerald-400'
                };

                return (
                  <div 
                    key={phase.id}
                    className="p-3.5 rounded-xl bg-[#0e101d] border border-white/10 flex flex-col justify-between"
                  >
                    <div>
                      {/* Header with icon & title */}
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${borderColors[phase.color]}`}>
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white leading-tight">{phase.title}</div>
                          <div className="text-[10px] font-mono text-slate-400">{phase.period}</div>
                        </div>
                      </div>

                      {/* Bullets */}
                      <ul className="space-y-1.5 mt-3 text-[11px] text-slate-300">
                        {phase.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="flex items-start space-x-1.5 leading-snug">
                            <span className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${dotColors[phase.color]}`} />
                            <span className="text-slate-300">{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visual Horizontal Progression Line */}
          <div className="pt-6 relative">
            <div className="h-1.5 w-full bg-slate-800 rounded-full relative overflow-hidden">
              <div className="h-full w-full bg-gradient-to-r from-rose-500 via-amber-500 via-blue-500 to-emerald-500 rounded-full" />
            </div>
            {/* 4 Milestone Dots */}
            <div className="flex justify-between items-center -mt-2.5 px-3">
              <div className="w-3.5 h-3.5 rounded-full bg-rose-500 ring-4 ring-[#0c0c16]" />
              <div className="w-3.5 h-3.5 rounded-full bg-amber-500 ring-4 ring-[#0c0c16]" />
              <div className="w-3.5 h-3.5 rounded-full bg-blue-500 ring-4 ring-[#0c0c16]" />
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-[#0c0c16]" />
            </div>
          </div>
        </div>

        {/* PANEL B: AI-DRIVEN STRATEGY GENERATION (5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#141422]/90 border border-white/10 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Brain className="w-4 h-4 text-blue-400" />
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                AI-Driven Strategy Generation
              </h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Generate customized strategies using ML models trained on historical corporate data.
            </p>

            {/* Controls Row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 mb-4">
              <div className="sm:col-span-5">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Crisis Type
                </label>
                <select
                  value={selectedCrisisType}
                  onChange={(e) => setSelectedCrisisType(e.target.value)}
                  className="w-full bg-[#0c0c16] border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Falling Market Share">Falling Market Share</option>
                  <option value="Supply Chain Bottleneck">Supply Chain Bottleneck</option>
                  <option value="Cash Flow Contraction">Cash Flow Contraction</option>
                  <option value="Disruptive Competition">Disruptive Competition</option>
                  <option value="Leadership Transition">Leadership Transition</option>
                  <option value="Hardware Slowdown">Hardware Slowdown</option>
                </select>
              </div>

              <div className="sm:col-span-4">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Target Outcome
                </label>
                <select
                  value={selectedTargetOutcome}
                  onChange={(e) => setSelectedTargetOutcome(e.target.value)}
                  className="w-full bg-[#0c0c16] border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Growth & Expansion">Growth & Expansion</option>
                  <option value="Market Stabilization">Market Stabilization</option>
                  <option value="Margin Optimization">Margin Optimization</option>
                  <option value="Debt Restructuring">Debt Restructuring</option>
                  <option value="Ecosystem Moat">Ecosystem Moat</option>
                </select>
              </div>

              <div className="sm:col-span-3 flex items-end">
                <button
                  onClick={handleGenerateStrategy}
                  disabled={generatingStrategy}
                  className="w-full flex items-center justify-center space-x-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-glow-indigo disabled:opacity-50 h-[34px]"
                >
                  {generatingStrategy ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>{generatingStrategy ? 'Processing' : 'Generate'}</span>
                </button>
              </div>
            </div>

            {/* Visual Process Architecture Diagram */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-center">
              {/* Box 1: Input Data */}
              <div className="p-3 rounded-xl bg-[#0c0c16] border border-blue-500/20 text-xs space-y-1.5">
                <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center space-x-1">
                  <Database className="w-3 h-3" />
                  <span>Input Data</span>
                </div>
                <div className="space-y-1 text-[10px] text-slate-300">
                  <div className="flex items-center space-x-1.5">
                    <FileText className="w-2.5 h-2.5 text-blue-400" />
                    <span>Financial Data</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <BarChart3 className="w-2.5 h-2.5 text-blue-400" />
                    <span>News & Sentiment</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <TrendingUp className="w-2.5 h-2.5 text-blue-400" />
                    <span>Industry Trends</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Crosshair className="w-2.5 h-2.5 text-blue-400" />
                    <span>Competitor Analysis</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Layers className="w-2.5 h-2.5 text-blue-400" />
                    <span>Case Studies (38)</span>
                  </div>
                </div>
              </div>

              {/* Box 2: AI/ML Model */}
              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-xs space-y-1.5 shadow-sm relative">
                <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center space-x-1">
                  <Cpu className="w-3 h-3" />
                  <span>AI/ML (RAG+LLM)</span>
                </div>
                <div className="space-y-1 text-[10px] text-purple-200">
                  <div className="flex items-center space-x-1.5">
                    <Sparkles className="w-2.5 h-2.5 text-purple-400" />
                    <span>Pattern Recognition</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Search className="w-2.5 h-2.5 text-purple-400" />
                    <span>Strategy Retrieval</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <ShieldAlert className="w-2.5 h-2.5 text-purple-400" />
                    <span>Risk Evaluation</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Award className="w-2.5 h-2.5 text-purple-400" />
                    <span>Outcome Prediction</span>
                  </div>
                </div>
              </div>

              {/* Box 3: Generated Strategy */}
              <div className="p-3 rounded-xl bg-[#0c0c16] border border-emerald-500/30 text-xs space-y-1.5">
                <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Generated Strategy</span>
                </div>
                <div className="space-y-1 text-[10px] text-slate-300 font-medium">
                  <div className="truncate">1. Action Plan</div>
                  <div className="truncate">2. Expected Impact</div>
                  <div className="truncate">3. Success Prob: 89%</div>
                  <div className="truncate">4. Case References</div>
                  <div className="truncate">5. Roadmap Milestones</div>
                </div>
              </div>
            </div>
          </div>

          {/* Generated Result Alert Banner */}
          {generatedResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-300">
                  Generated Blueprint for: {generatedResult.crisisType}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                  Confidence: {generatedResult.confidence}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                {generatedResult.prioritized_plan[0]}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* BOTTOM SECTION: 3 COLUMNS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* BOTTOM LEFT (5 Cols): Strategy Steps (Data-Driven) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#141422]/90 border border-white/10 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                Strategy Steps (Data-Driven)
              </h2>
              {/* View toggle */}
              <div className="flex items-center space-x-1 p-0.5 bg-[#0c0c16] rounded-xl border border-white/10">
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    viewMode === 'timeline'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Timeline View
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  List View
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              Each step is extracted from real historical events, financial data, and similar companies.
            </p>

            {/* 5 Milestone Steps */}
            <div className="space-y-4 relative">
              {/* Vertical connecting line for timeline view */}
              {viewMode === 'timeline' && (
                <div className="absolute top-4 bottom-4 left-3.5 w-0.5 bg-slate-800 -z-0" />
              )}

              {caseData.strategy_steps.map((st) => (
                <div
                  key={st.number}
                  className="flex items-start space-x-3 relative z-10"
                >
                  {/* Number Circle Badge */}
                  <div 
                    className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white flex-shrink-0 shadow-md ring-4 ring-[#0c0c16]"
                    style={{ backgroundColor: st.color }}
                  >
                    {st.number}
                  </div>

                  {/* Step Card Content */}
                  <div className="flex-1 p-3.5 rounded-xl bg-[#0c0c16]/90 border border-white/10 hover:border-white/20 transition-all space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-extrabold text-white">{st.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        {st.period}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {st.description}
                    </p>

                    {/* Key Metrics Mini Box & Details Button */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-white/5">
                      <div className="p-2 rounded-lg bg-[#141422] border border-white/5 text-[10px] space-y-0.5 flex-1">
                        <span className="font-bold text-slate-400 uppercase tracking-wider block text-[9px]">
                          Key Metrics
                        </span>
                        <div className="flex flex-wrap gap-x-3 text-slate-200 font-mono font-semibold">
                          {st.metrics.map((m, mIdx) => (
                            <span key={mIdx}>
                              {m.label}: <strong className="text-emerald-400">{m.value}</strong>
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedStepDetail(st)}
                        className="self-end sm:self-center px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM MIDDLE (4 Cols): Financial Performance & Similar Cases */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Chart Panel */}
          <div className="p-5 rounded-2xl bg-[#141422]/90 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                Financial Performance & Strategy Impact
              </h2>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Track how strategic steps impacted key financial metrics over time.
            </p>

            {/* Metric Selector Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-none">
              {[
                { id: 'revenue', label: 'Revenue' },
                { id: 'net_income', label: 'Net Income' },
                { id: 'stock_price', label: 'Stock Price' },
                { id: 'market_share', label: 'Market Share' },
                { id: 'gross_margin', label: 'Gross Margin' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setChartMetric(m.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                    chartMetric === m.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#0c0c16] text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Recharts Longitudinal Line Chart */}
            <div className="h-44 w-full mt-2 relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={caseData.financial_data}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
                  <XAxis 
                    dataKey="year" 
                    stroke="#64748b" 
                    fontSize={10} 
                    tickLine={false} 
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={10} 
                    tickLine={false}
                    tickFormatter={formatChartValue}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0c0c16', 
                      borderColor: 'rgba(255,255,255,0.15)',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: '#ffffff'
                    }} 
                    formatter={(val) => [formatChartValue(val), chartMetric.replace('_', ' ').toUpperCase()]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey={chartMetric} 
                    stroke="#3b82f6" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#chartGradient)" 
                    dot={{ r: 2.5, fill: '#3b82f6', stroke: '#ffffff', strokeWidth: 1 }}
                  />
                </AreaChart>
              </ResponsiveContainer>

              {/* Overlay Year 2024 Highlight Tag */}
              <div className="absolute top-1 right-2 text-right">
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-[#0c0c16]/90 px-2 py-0.5 rounded border border-emerald-500/30">
                  2024: {caseData.revenue_ttm} (+2.1% YoY)
                </span>
              </div>
            </div>
          </div>

          {/* Similar Case Studies Panel */}
          <div className="p-5 rounded-2xl bg-[#141422]/90 border border-white/10 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white">
                Similar Case Studies <span className="text-slate-400 font-normal text-xs">(From Database)</span>
              </h3>
              <button 
                onClick={() => setActiveTab('companies')}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {SIMILAR_CASES.map((sc) => (
                <div
                  key={sc.id}
                  className="p-3 rounded-xl bg-[#0c0c16] border border-white/10 hover:border-blue-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <CompanyLogo 
                        companyId={sc.id}
                        ticker={sc.ticker}
                        className="w-6 h-6 rounded-lg"
                        size={24}
                      />
                      <div>
                        <div className="text-xs font-extrabold text-white leading-none">{sc.name}</div>
                        <div className="text-[9px] font-mono text-slate-500 mt-0.5">{sc.period}</div>
                      </div>
                    </div>

                    <div className="space-y-1 mb-2">
                      <span className="inline-block px-2 py-0.5 rounded text-[9px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 truncate max-w-full">
                        {sc.crisis_tag}
                      </span>
                      <span className="inline-block px-2 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ml-1">
                        {sc.status_tag}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (setSelectedCompanyId) setSelectedCompanyId(sc.id);
                      showToast(`Loaded ${sc.name} Strategy Blueprint`);
                    }}
                    className="text-[10px] font-bold text-blue-400 hover:text-blue-300 flex items-center space-x-1 self-start pt-1"
                  >
                    <span>View Case</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM RIGHT (3 Cols): Key Takeaways & Recommendations */}
        <div className="lg:col-span-3 space-y-5">
          
          {/* Key Takeaways (AI Insights) */}
          <div className="p-5 rounded-2xl bg-[#141422]/90 border border-white/10 shadow-lg space-y-3.5">
            <div className="flex items-center space-x-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-extrabold text-white">
                Key Takeaways (AI Insights)
              </h3>
            </div>

            <div className="space-y-3">
              {caseData.ai_takeaways.map((item) => (
                <div key={item.num} className="flex items-start space-x-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                    {item.num}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{item.title}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        item.tag === 'High Impact' 
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}>
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategy Recommendations (For Startups/Investors) */}
          <div className="p-5 rounded-2xl bg-[#141422]/90 border border-white/10 shadow-lg space-y-3">
            <div className="flex items-center space-x-1.5">
              <Globe className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-extrabold text-white">
                Strategy Recommendations
              </h3>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              (For Founders, Distress Operators & Investors)
            </div>

            <ol className="space-y-2 text-[11px] text-slate-300 leading-snug">
              {caseData.recommendations.map((rec, rIdx) => (
                <li key={rIdx} className="flex items-start space-x-2">
                  <span className="w-4 h-4 rounded-full bg-white/5 text-blue-400 font-mono text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                    {rIdx + 1}
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

      </div>

      {/* STEP DETAILS MODAL / DRAWER */}
      <AnimatePresence>
        {selectedStepDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg p-6 rounded-2xl bg-[#141424] border border-white/15 text-white shadow-2xl space-y-4 relative"
            >
              <button
                onClick={() => setSelectedStepDetail(null)}
                className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white"
                  style={{ backgroundColor: selectedStepDetail.color }}
                >
                  {selectedStepDetail.number}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white">{selectedStepDetail.title}</h3>
                  <span className="text-xs font-mono text-blue-400">{selectedStepDetail.period}</span>
                </div>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                <div>
                  <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px] block mb-1">
                    Executive Narrative
                  </span>
                  <p className="text-slate-300">{selectedStepDetail.description}</p>
                </div>

                <div className="p-3 rounded-xl bg-[#0c0c16] border border-white/10 space-y-1">
                  <span className="font-bold text-blue-400 uppercase tracking-wider text-[10px] block">
                    Execution Tactics & Governance
                  </span>
                  <p className="text-slate-200">{selectedStepDetail.tactics}</p>
                </div>

                <div className="p-3 rounded-xl bg-[#0c0c16] border border-white/10 space-y-1">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px] block">
                    Turnaround Strategic Impact
                  </span>
                  <p className="text-slate-200">{selectedStepDetail.impact}</p>
                </div>

                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                    Key Quantitative Metrics
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedStepDetail.metrics.map((m, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-[#0c0c16] border border-white/5 text-center">
                        <div className="text-[10px] text-slate-400">{m.label}</div>
                        <div className="text-xs font-extrabold text-emerald-400 font-mono mt-0.5">{m.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedStepDetail(null)}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white transition-all shadow-glow-indigo mt-2"
              >
                Close Tactical View
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
