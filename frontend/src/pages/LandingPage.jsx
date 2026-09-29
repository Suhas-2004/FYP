import {useEffect,useRef,useState} from "react";
import gsap from "gsap";import {ScrollTrigger} from "gsap/ScrollTrigger";import Lenis from "lenis";
import Particles from "../components/landing/Particles";
import Astronaut from "../components/landing/Astronaut";
import { Users, Briefcase, Search, ListOrdered, TrendingUp, ShieldCheck, Building2, Activity, Bell } from "lucide-react";
import SentinelAlerts from "../components/SentinelAlerts";
gsap.registerPlugin(ScrollTrigger);
const cl=(x)=>Math.min(1,Math.max(0,x));

const SERVICES=[
  ["Crisis Matching","AI-powered matching of startup crises to historical corporate downfalls and recoveries.",["Downfall Detection","Similarity Scoring","Recovery Playbooks","Root-Cause Attribution"],["ML","AI","DB","D3"]],
  ["Market Analysis","Real-time stock tracking with predictive ML models for short-term price movements.",["Live SSE Data Feed","Advanced Technical Charts","Moving Averages & Bollinger","4hr/Daily Price Predictions"],["YF","SSE","Nx","TS"]],
  ["Company Intel","A comprehensive 6-year historical repository of major corporations across diverse business domains.",["Financial Health Metrics","Strategic Collaborations","Leadership Changes","AI & Tech Investments"],["DB","API","UI","React"]],
  ["Startup Intel","Build market trust by comparing failed startups against established firms that survived identical crises.",["Failure Pattern Recognition","Comparative Strategy Matrices","Market Survival Proofs","Domain Categorization"],["Data","UX","Graph","Node"]],
  ["Deal Flow Engine","A specialized networking hub connecting startups with interested venture capital and angel investors.",["Interactive Startup Pitches","Investor Deal Filtering","Automated Email Expressions","Deep-Dive Dossiers"],["Mail","Auth","DB","TLS"]],
  ["Network Graphs","Physics-based visualization of relationships between companies, their subsidiaries, and investors.",["D3 Force-Directed Physics","Investment Connections","Hierarchical Mapping","Interactive Tooltips"],["D3","SVG","Canvas","Math"]]
];

const CASES=[
  ["Overview Dashboard",["Executive Summary","Metrics"],"/overview","from-indigo-900/60 to-purple-900/80","https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1000"],
  ["Company Intelligence",["Forensic Breakdown","Timelines"],"/companies","from-slate-800/70 to-indigo-900/80","https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=1000"],
  ["Search Crisis Condition",["Vector Cosine Query","Distress Symptoms"],"/search-condition","from-purple-900/70 to-indigo-800/80","https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1000"],
  ["Strategy Steps Roadmap",["Tactical 3-Phase","Milestones"],"/strategy-steps","from-zinc-800/70 to-purple-900/80","https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&q=80&w=1000"],
  ["Startup Intel (Vanished)",["Empirical Post-Mortems","MNC Playbooks"],"/startup-intel","from-slate-900/70 to-teal-900/80","https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1000"],
  ["Graph Analysis",["Interactive Plotting","Predictive Signals"],"/graph-analysis","from-indigo-800/70 to-zinc-900/80","https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000"]
];
const TESTI=[["ICLAS revolutionized how we evaluate startup pitches. Being able to instantly match a startup's condition against historical corporate downfalls is a game-changer for risk assessment.","Marcus T.","Venture Capitalist"],["The real-time TradingView-style charts combined with live SSE feeds from Yahoo Finance gives us unprecedented visibility into short-term market movements.","Sarah K.","Quantitative Analyst"],["As an entrepreneur, the Crisis Matching engine gave me the exact playbook a Fortune 500 company used to survive the same supply chain issue I am facing.","David R.","Startup Founder"]];
const NAV=[["Work","#work"],["Platform","#services"],["Intel","#company"],["Access Dashboard","/about"],["Contact","#footer"]];
const TEAM=[
  ["Somashankar","Frontend • UI/UX • Data Features • Integration","Architected the high-performance quantum UI/UX engine. Seamlessly integrated real-time data features, bridging the gap between raw financial intelligence and fluid, intuitive visual dashboards.","from-indigo-900 to-purple-900", "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=300&h=300"],
  ["Suhas K M","Backend • AI/ML • Data • APIs","Engineered the robust backend infrastructure and proprietary AI/ML algorithms. Powers the high-frequency data pipelines, core APIs, and predictive intelligence models.","from-slate-800 to-teal-900", "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300"]
];
const BELIEFS=["Data beats intuition. &mdash; Every strategy is backed by 6 years of historical corporate data.","Intelligence should be actionable, not just visible.","We bridge the gap between financial tracking and lifecycle strategy.","Survival is a pattern that can be learned from the giants."];

const MENU=[["Crisis Matching","⌘",SERVICES[0][2],"/search-condition"],["Market Analysis","</>",SERVICES[1][2],"/market-dashboard"],["Company Intel","↗",SERVICES[2][2],"/companies"],["Startup Intel","◎",SERVICES[3][2],"/startup-intel"],["Deal Flow Engine","✜",SERVICES[4][2],"/investors-startups"],["Network Graphs","⌗",SERVICES[5][2],"/graph-analysis"]];
const LOGOS = [
  { n: "META", url: "https://icon.horse/icon/meta.com" },
  { n: "NVIDIA", url: "https://icon.horse/icon/nvidia.com" },
  { n: "TARGET", url: "https://icon.horse/icon/target.com" },
  { n: "AMAZON", url: "https://icon.horse/icon/amazon.com" },
  { n: "BLOCK", url: "https://icon.horse/icon/block.xyz" },
  { n: "PAYPAL", url: "https://icon.horse/icon/paypal.com" },
  { n: "APPLE", url: "https://icon.horse/icon/apple.com" },
  { n: "MICROSOFT", url: "https://icon.horse/icon/microsoft.com" },
  { n: "TESLA", url: "https://icon.horse/icon/tesla.com" },
  { n: "GOOGLE", url: "https://icon.horse/icon/google.com" },
  { n: "NETFLIX", url: "https://icon.horse/icon/netflix.com" },
  { n: "UBER", url: "https://icon.horse/icon/uber.com" },
  { n: "AIRBNB", url: "https://icon.horse/icon/airbnb.com" },
  { n: "SHOPIFY", url: "https://icon.horse/icon/shopify.com" },
  { n: "PALANTIR", url: "https://icon.horse/icon/palantir.com" },
  { n: "COINBASE", url: "https://icon.horse/icon/coinbase.com" }
];
const Arrow=({c="w-3 h-3"})=><svg className={c} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M2.5 9.5l7-7M4 2.5h5.5V8"/></svg>;
const Split=({t,i=0})=>t.split(" ").map((w,k)=>{const h=w[0]==="_",it=w[0]==="*";const x=h||it?w.slice(1):w;return <span key={k} className="wm mr-[.26em]"><span className={"w inline-block will-change-transform "+(h?"text-indigo-200 ":"")+(it?"italic font-bold":"")}>{x}</span></span>});
function Rise({t,className="",as:T="p",delay=0}){const r=useRef();
 useEffect(()=>{const c=gsap.context(()=>{gsap.fromTo(".w",{yPercent:118,rotate:5},{yPercent:0,rotate:0,duration:1.1,stagger:.045,delay,ease:"expo.out",scrollTrigger:{trigger:r.current,start:"top 90%"}})},r);return()=>c.revert()},[]);
 return <T ref={r} className={className}><Split t={t}/></T>}
function Words({t,className=""}){const r=useRef();
 useEffect(()=>{const c=gsap.context(()=>{gsap.fromTo("span",{opacity:.18,y:8},{opacity:1,y:0,stagger:.25,ease:"none",scrollTrigger:{trigger:r.current,start:"top 88%",end:"top 42%",scrub:.6}})},r);return()=>c.revert()},[]);
 return <h2 ref={r} className={className}>{t.split(" ").map((w,i)=><span key={i} className="inline-block mr-[.27em]">{w}</span>)}</h2>}
const Btn=({children,className="",onClick,href="#footer"})=><a href={href} onClick={onClick} data-go={href} className={"mag pill inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium transition-shadow hover:shadow-[0_0_30px_rgba(130,132,240,.9)] "+className}>{children}</a>;
const Link2=({children})=><a className="group inline-flex items-center gap-1 text-xs border-b border-white/70 pb-0.5 cursor-pointer">{children}<span className="transition-transform group-hover:translate-x-1">â†’</span></a>;

function DotMap(){const c=useRef();
 useEffect(()=>{const cv=c.current,x=cv.getContext("2d"),W=cv.width,H=cv.height,P=[[.02,.12],[.25,.04],[.5,.08],[.85,.0],[1,.1],[.78,.27],[.66,.42],[.64,.56],[.55,.7],[.46,.98],[.34,.78],[.2,.58],[.08,.38]],dots=[];
  const inside=(px,py)=>{let o=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const[a,b]=P[i],[d,e]=P[j];if((b>py)!=(e>py)&&px<(d-a)*(py-b)/(e-b)+a)o=!o}return o};
  for(let i=0;i<36;i++)for(let j=0;j<32;j++){const px=i/35,py=j/31;if(inside(px,py))dots.push({px,py,k:Math.max(0,1-Math.hypot(px-.64,py-.52)*2.2),d:px*.6+py*.4+Math.random()*.15})}
  const st={p:0},draw=()=>{x.clearRect(0,0,W,H);for(const d of dots){const q=cl((st.p*1.8-d.d)/.45);if(q<=0)continue;const k=d.k;x.fillStyle=`rgba(${130+90*k},${125+70*k},${200+55*k},${(.45+.55*k)*q})`;x.beginPath();x.arc(4+d.px*(W-8),4+d.py*(H-8),(2+k*1.2)*q,0,7);x.fill()}};draw();
  const a=gsap.to(st,{p:1,ease:"none",onUpdate:draw,scrollTrigger:{trigger:cv,start:"top 85%",end:"top 30%",scrub:.8}});return()=>{a.scrollTrigger?.kill();a.kill()}},[]);
 return <div className="relative w-[300px] md:w-[400px]"><canvas ref={c} width={420} height={380} className="w-full"/><span className="absolute left-[64%] top-[52%] w-2 h-2 -ml-1 -mt-1 rounded-full bg-indigo-200"><span className="absolute inset-0 rounded-full bg-indigo-300 animate-ping"/></span></div>}

function LogoArc(){const r=useRef();
 useEffect(()=>{const items=[...r.current.querySelectorAll(".lg")],n=items.length,R=1150;let off=0;
  const tick=(t,dt)=>{off+=dt*.000025;items.forEach((el,i)=>{let th=((i/n)*Math.PI*2+off*6.283)%6.283;if(th>Math.PI)th-=6.283;const ab=Math.abs(th),vis=1-cl((ab-.42)/.2);el.style.opacity=vis;el.style.transform=`translate(${Math.sin(th)*R}px,${(1-Math.cos(th))*R}px) rotate(${th*57.3}deg)`})};
  gsap.ticker.add(tick);return()=>gsap.ticker.remove(tick)},[]);
 return <div ref={r} className="relative h-36 mt-10 overflow-hidden"><div className="absolute left-1/2 top-4 w-0">{[...LOGOS,...LOGOS].map((l,i)=><div key={i} className="lg absolute -translate-x-1/2 flex items-center justify-center gap-2.5 will-change-transform opacity-0"><img src={l.url} alt="" className="h-6 w-auto max-w-[40px] object-contain filter brightness-0 invert opacity-80" onError={(e)=>{e.target.style.display='none'}}/><span className="whitespace-nowrap text-lg font-bold tracking-tight text-white/90">{l.n}</span></div>)}</div>
  <div className="glow absolute left-1/2 -translate-x-1/2 top-[70px] w-[900px] h-[300px] rounded-[50%] border-t-2 border-indigo-300/70 shadow-[0_-12px_60px_rgba(108,110,205,.55)]"/></div>}

const Clock=({time, dateStr})=><div className="mt-3"><div className="text-[64px] leading-none font-medium tabular-nums tracking-tight">{time.slice(0,3).join(":")}<span className="text-[14px] ml-2 font-bold tracking-widest text-white/50">{time[3]}</span></div>{dateStr && <div className="text-sm text-white/50 mt-1 uppercase tracking-widest font-semibold">{dateStr}</div>}</div>;


const PERSPECTIVES_DATA = [
  {
    role: "Entrepreneurs & Founders",
    icon: <div className="text-amber-500">⚡</div>,
    cards: [
      { title: "Condition Matching", icon: <Search className="w-5 h-5 text-amber-500"/>, desc: "Input your current runway, burn rate, and tech bottleneck to extract proven playbook heuristics that rescued titans in the same spot." },
      { title: "3-Phase Action Roadmap", icon: <ListOrdered className="w-5 h-5 text-indigo-400"/>, desc: "Receive a prioritized, phased turnaround roadmap: Stabilization (Cash preservation), Core Re-engineering, and Scaled Growth." },
      { title: "Investor Credibility", icon: <Briefcase className="w-5 h-5 text-teal-500"/>, desc: "Show investors you have anchored your turnaround strategy in historical corporate data, elevating pitch deck authority." }
    ]
  },
  {
    role: "Venture Capital & Angels",
    icon: <Briefcase className="w-3.5 h-3.5" />,
    cards: [
      { title: "Deal Flow Engine", icon: <Briefcase className="w-5 h-5 text-amber-500"/>, desc: "Filter thousands of startups based on survival probability, mapping their metrics against Fortune 500 downfall events." },
      { title: "Startup Intel", icon: <ShieldCheck className="w-5 h-5 text-indigo-400"/>, desc: "Analyze empirical post-mortems of failed visionary startups to identify hidden portfolio risks before they manifest." },
      { title: "Graph Analysis", icon: <TrendingUp className="w-5 h-5 text-teal-500"/>, desc: "Visualize the interconnected relationships between your portfolio companies, their competitors, and supply chain dependencies." }
    ]
  },
  {
    role: "Academic Researchers",
    icon: <Building2 className="w-3.5 h-3.5" />,
    cards: [
      { title: "Corporate Forensics", icon: <Building2 className="w-5 h-5 text-amber-500"/>, desc: "Access 6-years of deep longitudinal data covering 11 corporate titans through their crisis events and turnaround phases." },
      { title: "Vector Cosine Queries", icon: <Search className="w-5 h-5 text-indigo-400"/>, desc: "Leverage our natural language vector matching to find historically identical crisis patterns across multiple industry sectors." },
      { title: "Market Dashboards", icon: <Activity className="w-5 h-5 text-teal-500"/>, desc: "Export granular, real-time market movement datasets seamlessly synced with historical event overlays." }
    ]
  }
];

function PerspectivesSection() {
  const [active, setActive] = useState(0);
  const data = PERSPECTIVES_DATA[active];

  return (
    <div className="bg-[#0c0c16] rounded-[24px] border border-white/5 p-10 md:p-16 flex flex-col items-center max-w-[1000px] mx-auto shadow-2xl relative overflow-hidden mt-10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-indigo-600/10 blur-[60px] pointer-events-none"/>
      
      <div className="flex items-center gap-2 border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 rounded-full mb-8">
        <Users className="w-3.5 h-3.5 text-indigo-400" />
        <span className="text-[10px] text-indigo-300 tracking-widest font-semibold uppercase">Tailored for Every Stakeholder</span>
      </div>

      <Words t="How ICLAS Serves Your Perspective" className="text-3xl md:text-4xl font-semibold mb-4 text-center"/>
      <Rise t="Select your role to preview how the platform adapts its decision heuristics, data visualizers, and tool kits." className="text-sm text-white/50 text-center max-w-lg mb-12"/>

      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full border border-white/10 bg-white/[0.02] mb-16 backdrop-blur-sm">
        {PERSPECTIVES_DATA.map((p, i) => (
          <button 
            key={p.role} 
            onClick={() => setActive(i)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium transition-all duration-300 ${active === i ? 'bg-white/5 text-amber-500 border border-white/10' : 'text-white/40 hover:text-white/80 border border-transparent'}`}
          >
            {p.icon}
            {p.role}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-5 w-full">
        {data.cards.map((card, i) => (
          <div key={card.title + active} className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 hover:bg-white/[0.04] transition-colors duration-300 flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              {card.icon}
            </div>
            <h4 className="text-[15px] font-semibold text-white mb-3">{card.title}</h4>
            <p className="text-[12px] text-white/50 leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LandingPage({ onNavigate }){

 const [ready,setReady]=useState(false),[active,setActive]=useState(0),[hover,setHover]=useState(0),[nav,setNav]=useState(true),[menu,setMenu]=useState(false),[time,setTime]=useState(["--","--","--","AM"]),[dateStr,setDateStr]=useState("--");
 const root=useRef(),lenis=useRef(),curtain=useRef(),load=useRef(),col=useRef(),num=useRef(),z=useRef(1),menuRef=useRef();
 
 useEffect(()=>{
  const timer = setInterval(()=>{
   const d = new Date();
   const timeStr = d.toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit' });
   const [h24, m, s] = timeStr.split(':');
   const hourNum = parseInt(h24, 10);
   const ampm = hourNum >= 12 ? 'PM' : 'AM';
   const h12 = hourNum % 12 || 12;
   setTime([String(h12).padStart(2, '0'), m, s, ampm]);
   setDateStr(d.toLocaleDateString("en-US", { timeZone: 'Asia/Kolkata', weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
  },1000);
  return ()=>clearInterval(timer);
 },[]);

 useEffect(()=>{
  // Add dark mode classes specifically for landing page styling
  document.documentElement.classList.add('dark');
  const l=new Lenis({lerp:.085});lenis.current=l;l.stop();l.on("scroll",e=>{ScrollTrigger.update();setNav(e.direction<=0||e.scroll<80)});
  const tick=t=>l.raf(t*1000);gsap.ticker.add(tick);gsap.ticker.lagSmoothing(0);
  const ctx=gsap.context(()=>{
   const p={v:0};
   gsap.set([".hw",".navin",".hfade",".beam",".wmk"],{willChange:"transform,opacity"});
   gsap.set(".hw",{yPercent:120,rotate:6});gsap.set([".navin",".hfade"],{opacity:0,y:24});gsap.set([".beam",".wmk"],{opacity:0});
   const tl=gsap.timeline({onComplete:()=>{l.start();ScrollTrigger.refresh()}});
   tl.to(p,{v:100,duration:1.7,ease:"power2.inOut",onUpdate:()=>{if(num.current) num.current.textContent=Math.round(p.v)+"%";if(col.current) col.current.style.left=`calc(${p.v/100} * (100% - 22vw))`}})
    .to(".ld-t",{opacity:0,y:-10,duration:.3},"+=.1")
    .to(load.current,{yPercent:-100,duration:1.1,ease:"power4.inOut",onStart:()=>setReady(true)},"<")
    .to(".wmk",{opacity:1,duration:1.6},"-=.5").to(".beam",{opacity:.85,duration:1.6,ease:"power2.out"},"<")
    .to(".navin",{opacity:1,y:0,duration:.9,ease:"power3.out"},"-=1.3")
    .to(".hw",{yPercent:0,rotate:0,duration:1.2,stagger:.12,ease:"expo.out"},"-=1.2")
    .to(".hfade",{opacity:1,y:0,duration:.9,stagger:.1,ease:"power3.out"},"-=.8");
   document.querySelectorAll(".cnt").forEach((el,i)=>{const o={v:0},to=+el.dataset.to;tl.to(o,{v:to,duration:1.8,ease:"power3.out",onUpdate:()=>{el.textContent=String(Math.round(o.v)).padStart(el.dataset.pad?3:1,"0")+el.dataset.suf}},"-=1.6")});
   gsap.to(".beam",{opacity:.6,duration:3.5,yoyo:true,repeat:-1,ease:"sine.inOut",delay:4});
   /* hero scroll-out */
   gsap.to(".hero-h",{yPercent:-60,opacity:0,ease:"none",scrollTrigger:{trigger:"#hero",start:"top top",end:"70% top",scrub:true}});
   gsap.to(".hero-b",{y:-60,opacity:0,ease:"none",scrollTrigger:{trigger:"#hero",start:"10% top",end:"55% top",scrub:true}});
   gsap.to(".wmk",{xPercent:-8,ease:"none",scrollTrigger:{trigger:"#hero",start:"top top",end:"bottom top",scrub:true}});
   /* services */
   gsap.fromTo(".card",{x:180,opacity:0},{x:0,opacity:1,duration:1.1,stagger:.09,ease:"power3.out",scrollTrigger:{trigger:"#services",start:"top 55%"}});
   gsap.fromTo(".svc-d",{opacity:0,y:20},{opacity:1,y:0,duration:1,ease:"power3.out",scrollTrigger:{trigger:"#services",start:"top 60%"}});
   ScrollTrigger.create({trigger:"#services",start:"top top",end:"bottom bottom",onUpdate:s=>setActive(Math.min(5,Math.round(s.progress*5)))});
   /* case studies */
   gsap.fromTo(".crow",{y:36,opacity:0},{y:0,opacity:1,duration:.9,stagger:.09,ease:"power3.out",scrollTrigger:{trigger:".clist",start:"top 85%"}});
   gsap.fromTo(".cline",{scaleX:0},{scaleX:1,duration:1.2,stagger:.09,ease:"expo.out",scrollTrigger:{trigger:".clist",start:"top 85%"}});
   gsap.fromTo(".cbox",{clipPath:"inset(100% 0 0 0)"},{clipPath:"inset(0% 0 0 0)",duration:1.3,ease:"expo.out",scrollTrigger:{trigger:".cbox",start:"top 88%"}});
   /* cta card */
   gsap.fromTo(".ctac",{y:60,opacity:0,scale:.97},{y:0,opacity:1,scale:1,duration:1.2,ease:"power3.out",scrollTrigger:{trigger:".ctac",start:"top 88%"}});
   gsap.to(".au1",{x:140,y:20,scale:1.25,duration:6,yoyo:true,repeat:-1,ease:"sine.inOut"});gsap.to(".au2",{x:-160,y:-10,scale:.85,duration:7,yoyo:true,repeat:-1,ease:"sine.inOut"});
   /* company */
   gsap.fromTo(".kh",{y:110,opacity:0,rotateX:-14,transformPerspective:900},{y:0,opacity:1,rotateX:0,duration:1.2,stagger:.15,ease:"expo.out",scrollTrigger:{trigger:".khg",start:"top 85%"}});
   gsap.fromTo(".tm",{y:90,opacity:0,scale:.92},{y:0,opacity:1,scale:1,duration:1.1,stagger:.14,ease:"expo.out",scrollTrigger:{trigger:".tmg",start:"top 85%"}});
   gsap.utils.toArray(".bl").forEach(el=>{gsap.fromTo(el.querySelector(".bln"),{scaleX:0},{scaleX:1,duration:1.2,ease:"expo.out",scrollTrigger:{trigger:el,start:"top 90%"}});gsap.fromTo(el.querySelector(".blt"),{x:-50,opacity:0},{x:0,opacity:1,duration:1,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 90%"}})});
   gsap.fromTo(".astro",{scale:.7,opacity:0,y:60},{scale:1,opacity:1,y:0,duration:1.6,ease:"expo.out",scrollTrigger:{trigger:"#cta",start:"top 60%"}});
   gsap.fromTo(".cta-f",{opacity:0,y:24},{opacity:1,y:0,duration:.9,stagger:.12,scrollTrigger:{trigger:"#cta",start:"top 55%"}});
   gsap.fromTo(".ft",{opacity:0,y:30},{opacity:1,y:0,duration:.9,stagger:.08,scrollTrigger:{trigger:"#footer",start:"top 85%"}});
   gsap.fromTo(".foot-glow",{opacity:0,yPercent:40},{opacity:1,yPercent:0,ease:"none",scrollTrigger:{trigger:"#footer",start:"top bottom",end:"bottom bottom",scrub:true}});
  },root);
  /* spotlight + magnetic */
  const pm=e=>{const s=e.target.closest?.(".spot");if(s){const r=s.getBoundingClientRect();s.style.setProperty("--mx",e.clientX-r.left+"px");s.style.setProperty("--my",e.clientY-r.top+"px")}
   document.querySelectorAll(".mag").forEach(m=>{const r=m.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),d=Math.hypot(dx,dy);if(d<90)gsap.to(m,{x:dx*.3,y:dy*.35,duration:.4,ease:"power3.out"});else gsap.to(m,{x:0,y:0,duration:.8,ease:"elastic.out(1,.4)",overwrite:"auto"})})};
  window.addEventListener("pointermove",pm);
   // Removed duplicate New York timezone clock interval
  const rf=()=>ScrollTrigger.refresh();window.addEventListener("load",rf);document.fonts?.ready.then(rf);
  return()=>{gsap.ticker.remove(tick);window.removeEventListener("pointermove",pm);window.removeEventListener("load",rf);ctx.revert();l.destroy()}
 },[]);

 /* active service card content animation */
 useEffect(()=>{const c=gsap.context(()=>{gsap.fromTo(".card.on .ci",{y:18,opacity:0},{y:0,opacity:1,duration:.7,stagger:.07,delay:.3,ease:"power3.out"});gsap.fromTo(".card.on .chip",{scale:0,opacity:0},{scale:1,opacity:1,duration:.5,stagger:.05,delay:.55,ease:"back.out(2)"})},root);return()=>c.revert()},[active]);
 /* case image wipe */
 useEffect(()=>{const el=document.querySelector(".cimg-"+hover);if(!el)return;el.style.zIndex=++z.current;gsap.fromTo(el,{clipPath:"inset(0 0 0 100%)"},{clipPath:"inset(0 0 0 0%)",duration:.9,ease:"expo.out"});gsap.fromTo(el.firstChild,{scale:1.25},{scale:1,duration:1.2,ease:"expo.out"})},[hover]);
 /* mega menu */
 useEffect(()=>{const m=menuRef.current;if(!m)return;const c=gsap.context(()=>{if(menu){gsap.fromTo(m,{clipPath:"inset(0 0 100% 0 round 14px)",opacity:0,y:-12},{clipPath:"inset(0 0 0% 0 round 14px)",opacity:1,y:0,duration:.55,ease:"expo.out"});gsap.fromTo(".mi",{y:16,opacity:0},{y:0,opacity:1,duration:.55,stagger:.045,delay:.1,ease:"power3.out"})}else gsap.to(m,{opacity:0,y:-8,duration:.25})},m);return()=>c.revert()},[menu]);
 const go=(e,h)=>{
   e.preventDefault();
   setMenu(false);
   if(h.startsWith("/")) {
     const tab = h.substring(1) || "about";
     onNavigate(tab);
   } else {
     try { lenis.current.scrollTo(h,{immediate:true,force:true}); } catch(err) {}
   }
 };
 const jump=i=>{const s=document.getElementById("services"),vh=window.innerHeight;lenis.current.scrollTo(s.offsetTop+(i/5)*(s.offsetHeight-vh)+2,{duration:1.4})};

 return (
  <main ref={root} className="relative bg-black text-white overflow-x-clip font-sans" style={{color: 'white'}}>
  <div ref={load} className="fixed inset-0 z-[100] bg-black overflow-hidden">
   <div className="absolute inset-x-0 top-[38%] text-center text-[16vw] font-bold leading-none whitespace-nowrap text-white/[.04]">ICLAS AI</div>
   <div className="absolute inset-5 rounded-2xl bg-[#1a1a1a] overflow-hidden"><div ref={col} className="absolute top-0 bottom-0 w-[22vw] rounded-2xl" style={{background:"linear-gradient(180deg,#05050a,#3a3a80)"}}>
    <span ref={num} className="ld-t absolute left-4 top-4 text-3xl font-light">0%</span><span className="ld-t absolute left-4 bottom-4 text-[11px] tracking-wider">LOADING...</span></div></div></div>
  <Particles ready={ready}/>
  
  <header onMouseLeave={()=>setMenu(false)} className={"fixed top-0 inset-x-0 z-50 transition-transform duration-500 "+(nav?"":"-translate-y-full")}>
   <div className="navin mx-auto max-w-[1120px] h-[70px] flex items-center justify-between relative px-4 md:px-0">
    <a href="#" className="text-[15px] tracking-[.12em]" style={{fontFamily:"Orbitron,sans-serif"}}>ICLAS</a>
    <nav className="hidden md:flex gap-9 text-xs">{NAV.map(([n,h])=><a key={n} href={h} onMouseEnter={()=>setMenu(n==="Platform")} onClick={e=>go(e,h)} className={"px-2.5 py-1 rounded-md transition-colors hover:bg-white/10 "+(n==="Platform"&&menu?"bg-white/10":"")}>{n}</a>)}</nav>
    
    <div className="flex items-center gap-4">
      <button 
        onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('open-omni-query')); }}
        className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition text-[10px] text-white/70 tracking-widest font-semibold uppercase"
      >
        <Search className="w-3 h-3" /> <span>Cmd+K</span>
      </button>
      <SentinelAlerts />
      <a href="/about" onClick={e=>go(e,"/about")} className="group flex items-center gap-4 pl-4 pr-1 h-[34px] rounded-full border border-white/20 bg-black/40 text-[11px] hover:border-white/50 transition">Enter Dashboard<span className="w-[42px] h-[26px] rounded-full bg-white text-black grid place-items-center transition-all duration-300 group-hover:w-[50px]"><span className="transition-transform duration-300 group-hover:rotate-45"><Arrow/></span></span></a>
    </div>
    
    {/* Mega Menu */}
    <div ref={menuRef} className={"absolute left-1/2 -translate-x-1/2 top-[62px] w-[930px] rounded-[14px] border border-white/10 bg-[#0c0c10]/95 backdrop-blur-xl p-4 grid grid-cols-[230px_1fr] gap-6 "+(menu?"":"pointer-events-none")} style={{opacity:0}}>
     <div className="mi"><div className="h-[110px] rounded-lg bg-gradient-to-br from-slate-600 to-teal-900 grid place-items-center text-[10px]">AI-Powered Crisis Matching Engine</div><div className="text-[10px] mt-2 text-white/60">ICLAS Intelligence</div><div className="text-sm font-semibold leading-4 mt-1">CORE<br/>PLATFORM</div></div>
     <div className="grid grid-cols-3 gap-x-6 gap-y-5">{MENU.map(([n,ic,ls,rt])=><a href={rt} onClick={e=>go(e,rt)} key={n} className="mi spot rounded-lg p-2 hover:bg-white/5 transition block"><div className="flex items-center gap-2 text-xs font-semibold"><span className="text-[11px] text-white/60">{ic}</span>{n}</div><ul className="mt-2 text-[9px] leading-[13px] text-white/50 pl-5">{ls.map(x=><li key={x}>{x}</li>)}</ul></a>)}</div></div>
   </div>
  </header>

  <section id="hero" className="relative z-10 h-screen min-h-[700px] overflow-hidden">
   <div className="beam absolute -left-6 -top-24 w-[200px] h-[760px] origin-top -rotate-[38deg] blur-[24px]" style={{background:"linear-gradient(180deg,#d9d7f4 0%,#7a76e0 10%,#2e2b98 40%,rgba(30,28,110,.3) 70%,transparent)"}}/>
   <div className="absolute -left-40 -top-40 w-[720px] h-[720px] rounded-full blur-3xl" style={{background:"radial-gradient(circle,rgba(80,78,200,.4),transparent 65%)"}}/>
   <div className="wmk absolute inset-x-0 top-[22%] text-center text-[16vw] font-bold leading-none whitespace-nowrap text-white/[.05] select-none">ICLAS SYSTEM</div>
   <div className="hero-h absolute inset-0 flex items-center justify-center pointer-events-none"><h1 className="text-[clamp(34px,4.3vw,64px)] leading-[1.1] font-light -mt-16">
    <span className="block text-left"><span className="wm"><span className="hw inline-block">Intelligent</span></span> <span className="wm"><i className="hw inline-block font-bold">Corporate</i></span></span>
    <span className="block text-right"><span className="wm"><i className="hw inline-block font-bold">& Leadership</i></span> <span className="wm"><span className="hw inline-block">Advisory</span></span> <span className="wm"><span className="hw inline-block">System</span></span></span></h1></div>
   <div className="hero-b absolute bottom-[8%] inset-x-0"><div className="mx-auto max-w-[1120px] px-4 md:px-0 flex flex-col md:flex-row items-end justify-between">
    <div className="hfade"><p className="text-[13px] leading-5 max-w-[300px] mb-8">We empower startups and investors with an AI engine that matches current crises to historical corporate survival strategies.</p><Btn onClick={(e)=>go(e,"/about")} href="/about">Enter Platform</Btn></div>
    <div className="hfade hidden md:flex gap-9">{[["6","","Years Historical Data",0],["18","","Data Pipeline Vectors",1],["4","hr","Prediction Engine",0]].map(([a,s,b,pd])=><div key={b} className="flex items-center gap-2"><span className="text-2xl font-medium tabular-nums"><span className="cnt" data-to={a} data-suf={s} data-pad={pd||undefined}>0{s}</span></span><span className="text-[10px] leading-3 w-[52px]">{b}</span></div>)}</div></div></div>
  </section>

  <section id="services" className="relative z-10" style={{height:"calc(100vh + 5 * 70vh)"}}>
   <div className="sticky top-0 h-screen flex items-center"><div className="w-full max-w-[1120px] mx-auto pl-[4%] md:pl-[36%] relative">
    <div className="flex items-start justify-between mb-8 pr-2"><Words t="Platform Modules" className="text-3xl font-semibold"/><p className="svc-d hidden md:block text-xs leading-[18px] w-[290px]">Comprehensive digital intelligence that transforms business survival and drives data-backed investment decisions.</p></div>
    <div className="overflow-hidden md:-mr-[40vw] md:pr-[40vw]"><div className="flex items-center gap-[18px] h-[410px] transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)]" style={{transform:`translateX(-${active*318}px)`}}>
     {SERVICES.map(([t,d,s,tools],i)=>{const on=i===active;return <div key={t} onClick={()=>jump(i)} className={"card spot relative shrink-0 rounded-[18px] border overflow-hidden cursor-pointer transition-[width,height,background-color,border-color] duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] "+(on?"on w-[335px] h-[405px] bg-card border-white/20":"w-[300px] h-[367px] bg-[#0a0a0a] border-white/10 hover:border-white/25")}>
      <div className="absolute top-6 left-6 right-6 flex justify-between items-start"><div className="relative h-8 w-full"><span className={"absolute left-0 top-0 text-2xl font-light transition-all duration-500 "+(on?"opacity-0 -translate-y-3":"opacity-100")}>{String(i+1).padStart(2,"0")}</span><span className={"absolute left-0 top-0 text-2xl font-medium whitespace-nowrap transition-all duration-500 delay-200 "+(on?"opacity-100":"opacity-0 translate-y-3")}>{t}</span></div><span className={"transition-transform duration-500 "+(on?"rotate-0":"-rotate-12")}><Arrow c="w-4 h-4"/></span></div>
      <span className={"absolute left-6 bottom-6 text-sm font-medium transition-all duration-500 "+(on?"opacity-0 translate-y-3":"opacity-100")}>{t}</span><div className={"dots absolute right-0 bottom-0 w-32 h-32 transition-opacity duration-500 "+(on?"opacity-0":"opacity-100")}/>
      {on&&<><p className="ci absolute left-6 right-6 top-[125px] text-xs leading-5">{d}</p>
       <div className="absolute left-6 bottom-6 right-6 flex justify-between"><div><div className="ci text-xs text-white/50 mb-1">Features</div>{s.map(x=><div key={x} className="ci text-[10px] leading-[15px] max-w-[160px]">{x}</div>)}</div>
        <div><div className="ci text-xs text-white/50 mb-1">Tech</div><div className="grid grid-cols-2 gap-1.5 mb-3">{tools.map(k=><span key={k} className="chip w-[22px] h-[22px] grid place-items-center rounded-md bg-white/85 text-[8px] font-bold text-card">{k}</span>)}</div><a href={["/search-condition","/market-dashboard","/companies","/startup-intel","/investors-startups","/graph-analysis"][i]} onClick={e=>{e.stopPropagation();go(e,["/search-condition","/market-dashboard","/companies","/startup-intel","/investors-startups","/graph-analysis"][i])}} className="ci text-[10px] text-indigo-300 hover:text-indigo-200 transition underline block">Explore Module &rarr;</a></div></div></>}
     </div>})}</div></div></div></div></section>

  <section id="work" className="relative z-10 py-40"><div className="mx-auto max-w-[1120px] px-4 md:px-0">
   <div className="flex justify-between items-start"><Words t="Launch Intelligence Modules" className="text-3xl font-semibold"/><Rise t="Jump directly into any analysis engine across the ICLAS platform." className="text-xs text-right w-[260px] leading-[18px]"/></div>
   <div className="grid md:grid-cols-[1.45fr_1fr] gap-14 mt-24"><ul className="clist">{CASES.map(([n,tags,rt,g],i)=><li key={n} onMouseEnter={()=>setHover(i)} onClick={e=>go(e,rt)} className="crow relative flex items-center gap-5 h-[62px] px-2 cursor-pointer overflow-hidden">
     <i className={"absolute inset-0 bg-white/[.06] origin-left transition-transform duration-500 ease-out "+(hover===i?"scale-x-100":"scale-x-0")}/><i className="cline absolute bottom-0 left-0 right-0 h-px bg-white/10 origin-left"/>
     <span className="relative text-xs text-white/60 w-6">{String(i+1).padStart(2,"0")}</span><span className={"relative text-sm font-semibold w-[220px] transition-transform duration-500 "+(hover===i?"translate-x-2":"")}>{n}</span>
     <span className="relative hidden md:flex gap-1.5 flex-wrap">{tags.map(t=><span key={t} className="text-[9px] px-2 py-1 rounded-full border border-white/10 text-white/60">{t}</span>)}</span>
     <span className={"absolute right-3 transition-all duration-500 "+(hover===i?"opacity-100 translate-x-0":"opacity-0 -translate-x-3")}><Arrow/></span></li>)}</ul>
    <div className="cbox relative aspect-square overflow-hidden hidden md:block rounded-2xl shadow-[0_0_50px_rgba(255,255,255,.05)] border border-white/5 bg-[#f8f9fa]">
   {CASES.map(([n,tags,rt,g,img],i)=><div key={n} className={"absolute inset-0 overflow-hidden cimg-"+i+" group"} style={{zIndex:i===0?1:0}}>
     
     <div className="absolute inset-0 bg-gradient-to-br from-[#ffffff] to-[#e2e8f0] transition-colors duration-1000 grid place-items-center">
       
       <div className="w-[85%] max-w-[420px] aspect-[4/3] rounded-xl bg-[#1e1e1e] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col relative transform group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-700 ease-out border border-black/20 overflow-hidden">
         <div className="h-9 bg-[#2d2d2d] flex items-center px-4 gap-2 border-b border-[#111] shrink-0 relative z-10">
           <div className="flex gap-1.5">
             <i className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></i>
             <i className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></i>
             <i className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></i>
           </div>
           <div className="absolute left-1/2 -translate-x-1/2 text-[11px] text-white/50 font-medium tracking-wide">{n}</div>
         </div>
         <div className="relative flex-1 bg-black">
           <img src={img} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-110 group-hover:opacity-100 transition-all duration-[10s] ease-out" alt="" />
         </div>
       </div>

     </div>
   </div>)}</div></div></div></section>
  
  <section className="relative z-10 pb-32"><div className="mx-auto max-w-[1120px] px-4 md:px-0">
   <PerspectivesSection />
   
   <div className="text-center mt-40"><Words t="Analyzing Data From Industry Leaders" className="text-2xl font-medium"/><p className="text-[10px] mt-2">Powering Innovation Through Historical Lifecycle Modeling</p></div>
   <div className="logos"><LogoArc/></div>
   
   <div className="ctac spot relative mt-20 rounded-2xl border border-white/10 h-[300px] overflow-hidden"><div className="au1 absolute -top-16 -left-10 w-[60%] h-44 blur-3xl rounded-full" style={{background:"#5a2cc0",opacity:.75}}/><div className="au2 absolute -top-12 right-0 w-[45%] h-36 blur-3xl rounded-full" style={{background:"#7a4ae0",opacity:.5}}/>
    <div className="relative p-[50px] md:p-[90px] md:pt-[100px]"><Rise as="p" t="We turn raw market data into" className="text-xl leading-6"/><Rise as="p" t="powerful survival strategies." className="text-xl leading-6 font-semibold" delay={.15}/><Btn onClick={(e)=>go(e,"/dashboard")} href="/dashboard" className="mt-9 group">Enter ICLAS Platform <span className="transition-transform group-hover:translate-x-1">&rarr;</span></Btn></div></div>
  </div></section>

  <section id="company" className="relative z-10 py-40"><div className="mx-auto max-w-[1120px] px-4 md:px-0">
   <div className="grid md:grid-cols-[.28fr_1fr] gap-10"><Rise t="STARTUPS BUILD PRODUCTS. ICLAS BUILDS SURVIVABILITY." className="text-xs leading-4 max-w-[190px]"/>
    <div><Words t="We're a data-driven intelligence system turning complex market crises into measurable recovery playbooks." className="text-4xl font-medium leading-[1.2] max-w-[620px]"/><div className="cta-f mt-24 flex items-center gap-6"><Btn onClick={(e)=>go(e,"/about")} href="/about">Open Dashboard</Btn></div></div></div>
   <div className="mt-48"><Rise t="OUR ARCHITECTURE" className="text-xs text-white/50"/><Words t="ICLAS operates at the intersection of real-time market data and historical corporate downfall analysis." className="mt-5 text-4xl font-medium leading-[1.2] max-w-[1000px]"/>
    <div className="mt-24 flex flex-wrap items-center justify-between gap-10"><DotMap/><Rise t="Built on a massive 3-Level Data Architecture, we synthesize _financial_statements, _market_pricing, _and _NLP_news_sentiment to predict lifecycle stages." className="text-sm leading-5 max-w-[300px]"/></div></div>
   
   <div className="mt-40 text-center"><Rise t="Key highlights" className="text-lg font-semibold"/><div className="khg grid md:grid-cols-3 gap-4 mt-14 text-left">
    {[["Crisis Survival Playbooks","Matching startups to exact strategies used by billion-dollar firms to survive identical crises."],["Predictive Market AI","Live SSE polling of Yahoo Finance mapped to 4-hour and Daily short-term prediction engines."],["3-Level Intelligence","Raw Data &rarr; Normalized Data &rarr; Machine Learning Features, Sentiment & Root-Cause Attribution."]].map(([a,b])=><div key={a} className="kh spot h-[350px] rounded-xl border border-white/10 bg-white/[.02] p-12 flex flex-col justify-end transition-colors hover:border-white/25"><h4 className="text-[32px] leading-9">{a}</h4><p className="text-xs mt-3 max-w-[200px]">{b}</p></div>)}</div></div>
   
   <div className="mt-48 text-center"><Words t="Meet the Architects" className="text-2xl font-semibold max-w-[300px] mx-auto"/><div className="tmg grid md:grid-cols-2 gap-10 max-w-[760px] mx-auto mt-14">
    {TEAM.map(([n,r,b,g,img])=><div key={n} className="tm group relative h-[373px] rounded-xl border border-white/10 overflow-hidden"><div className={"absolute inset-0 bg-gradient-to-b transition-transform duration-[900ms] group-hover:scale-110 "+g}/><div className="absolute inset-x-0 top-0 h-[65%]"><img src={img} alt={n} className="w-full h-full object-cover opacity-80 mix-blend-overlay group-hover:opacity-100 transition-opacity duration-700"/></div><div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"/>
     <div className="absolute inset-x-6 bottom-6 transition-transform duration-500 ease-out group-hover:-translate-y-[125px]"><b className="block text-xl">{n}</b><span className="text-[11px] opacity-80 block mt-1 leading-4">{r}</span></div>
     <p className="absolute inset-x-6 bottom-14 text-[10px] leading-4 text-white/60 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition duration-500 delay-100">{b}</p>
     <span className="absolute left-1/2 -translate-x-1/2 bottom-5 w-5 h-5 grid place-items-center bg-white text-black text-[10px] font-bold rounded-sm opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition duration-500 delay-200">in</span></div>)}</div></div>
   
   <div className="mt-48 text-center"><Words t="How We Analyze" className="text-2xl font-semibold"/><p className="text-xs mt-2">We don't just track stocks &mdash; we map corporate lifecycles.</p>
    <div className="mt-16 text-left"><Rise t="CORE SYSTEM BELIEFS" className="text-xs text-white/50"/>{BELIEFS.map((b,i)=><div key={b} className="bl group relative flex gap-4 py-5 text-lg font-medium overflow-hidden"><sup className="text-[9px] text-white/40">{String(i+1).padStart(2,"0")}</sup><span className="blt transition-transform duration-500 group-hover:translate-x-3">{b}</span><i className="bln absolute bottom-0 left-0 right-0 h-px bg-white/10 origin-left"/></div>)}</div></div>
  </div></section>
  
  <section id="cta" className="relative z-10 h-[720px] overflow-hidden"><div className="mx-auto max-w-[1120px] relative h-full px-4 md:px-0">
   <div className="absolute top-[130px]"><h2 className="text-3xl font-light"><Rise as="span" t="Enter the System" className="block"/><Rise as="span" t="*Predict *Survival" className="block text-[44px]" delay={.15}/></h2><div className="cta-f mt-14 flex items-center gap-6"><Btn onClick={(e)=>go(e,"/about")} href="/about">Access Dashboard</Btn></div></div>
   <Rise t="ICLAS bridges the gap between raw financial data and actionable lifecycle intelligence. Gain access to the predictive ML engine today." className="absolute right-4 md:right-0 top-[120px] text-[10px] leading-4 w-[250px]"/>
   <div className="astro absolute right-[-4%] top-[120px] w-[620px] h-[560px] hidden md:block"><Astronaut/></div></div></section>
  
  <footer id="footer" className="relative z-10 pt-24 pb-10 overflow-hidden"><div className="foot-glow absolute inset-x-0 bottom-0 h-72" style={{background:"radial-gradient(ellipse at 50% 120%,rgba(90,88,210,.65),transparent 70%)"}}/>
   <div className="relative mx-auto max-w-[1120px] px-4 md:px-0 flex flex-wrap justify-between gap-12"><div><a className="ft block text-base">intel@iclas.system</a><div className="ft text-[11px] underline mt-2">System Architecture &rarr;</div><p className="ft text-[11px] mt-6">Intelligent Corporate &<br/> Leadership Advisory System</p><div className="ft"><Clock time={time} dateStr={dateStr}/></div></div>
    <div className="flex gap-16 text-[11px] leading-[19px]">{[["Platform",SERVICES.map(s=>s[0])],["Modules",["Crisis Engine","D3 Visualizer"]]].map(([h,l])=><div key={h} className="ft"><div className="text-white/40 mb-1">{h}</div>{l.map(x=><div key={x} className="hover:translate-x-1 hover:text-indigo-200 transition cursor-pointer">{x}</div>)}</div>)}</div></div>
   <p className="relative mx-auto max-w-[1120px] px-4 md:px-0 mt-24 text-[10px] text-white/40">ICLAS System, &copy; 2026. Quantum Analytics Engine.</p></footer>
 </main>
 )
}
