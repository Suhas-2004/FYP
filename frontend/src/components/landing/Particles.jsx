import {useEffect,useRef} from "react";
import * as THREE from "three";
import gsap from "gsap";

const N=14000,r=(a=1)=>(Math.random()-.5)*a,cl=(x)=>Math.min(1,Math.max(0,x));
const stroke=(p,w=.05)=>{const s=[];let L=0;for(let i=0;i<p.length-1;i++){const d=Math.hypot(p[i+1][0]-p[i][0],p[i+1][1]-p[i][1]);s.push(d);L+=d}
 let t=Math.random()*L,i=0;while(t>s[i]&&i<s.length-1){t-=s[i];i++}const u=t/s[i];return[p[i][0]+(p[i+1][0]-p[i][0])*u+r(w*2),p[i][1]+(p[i+1][1]-p[i][1])*u+r(w*2),r(.35)]};
const build=(fn)=>{const a=new Float32Array(N*3);for(let i=0;i<N;i++){a.set(fn(i),i*3)}return a};
const star=(cx,cy,R)=>{const t=Math.random()*6.283,k=Math.pow(Math.random(),.55);return[cx+R*k*Math.pow(Math.cos(t),3),cy+R*k*Math.pow(Math.sin(t),3),r(.3)]};
const SHAPES=[
 build(i=>{const y=1-2*(i+.5)/N,q=Math.sqrt(1-y*y),t=i*2.399963,R=2*(Math.random()<.85?1:Math.random());return[Math.cos(t)*q*R,y*R,Math.sin(t)*q*R]}),
 build(()=>{const s=1.5,v=[r(2*s),r(2*s),r(2*s)],f=Math.floor(Math.random()*3);v[f]=Math.random()<.5?s:-s;if(Math.random()<.6){const o=(f+1)%3;v[o]=(Math.random()<.5?s:-s)+r(.3)}
  const a=.6,b=.45,[x,y,z]=v,x1=x*Math.cos(a)+z*Math.sin(a),z1=-x*Math.sin(a)+z*Math.cos(a);return[x1,y*Math.cos(b)-z1*Math.sin(b),y*Math.sin(b)+z1*Math.cos(b)]}),
 build(()=>{const q=Math.random();return q<.4?stroke([[-.7,1.1],[-2,0],[-.7,-1.1]],.09):q<.6?stroke([[.45,1.3],[-.45,-1.3]],.09):q<.8?stroke([[.9,1.3],[-.1,-1.3]],.09):stroke([[.7,1.1],[2,0],[.7,-1.1]],.09)}),
 build(()=>{const q=Math.random();if(q<.6){const b=[[-1.7,-1.1,-1.05,-.3],[-.55,.15,-1.05,.5],[.6,1.3,-1.05,1.1]][Math.floor(Math.random()*3)];return[b[0]+Math.random()*(b[1]-b[0]),b[2]+Math.random()*(b[3]-b[2]),r(.3)]}
  return q<.9?stroke([[-1.9,-.1],[-.7,.5],[.3,1.1],[1.6,1.9]],.06):stroke(Math.random()<.5?[[1.6,1.9],[1,1.85]]:[[1.6,1.9],[1.55,1.3]],.06)}),
 build(()=>{const t=r(2),ph=Math.random()<.5?0:Math.PI,y=t*2.2,x=Math.cos(t*7+ph)*.75,z=Math.sin(t*7+ph)*.75,q=Math.random()<.2,c=Math.cos(.6),s=Math.sin(.6),jx=(q?r(1.5):x)+r(.12);return[jx*c-y*s,jx*s+y*c,(q?0:z)+r(.12)]}),
 build(()=>{const q=Math.random();return q<.62?star(-.5,-.1,1.7):q<.88?star(1.3,1.2,.8):star(1.2,-1.4,.5)}),
 build(()=>{const c=Math.floor(Math.random()*14),x=-1.3+c*.2,yb=-1.5*(1-Math.pow(x/1.3,2)*.85)+.2;return Math.random()<.75?[x+r(.08),yb+Math.random()*(1.6-yb),r(.3)]:[r(2.6),yb+Math.random()*(1.6-yb),r(.3)]}),
];

export default function Particles({ready}){
 const cv=useRef(),glow=useRef();
 useEffect(()=>{if(!ready)return;
  const R=new THREE.WebGLRenderer({canvas:cv.current,alpha:true,antialias:true});R.setPixelRatio(Math.min(window.devicePixelRatio,2));
  const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(45,1,.1,100);cam.position.z=10;
  const U={uMix:{value:0},uTime:{value:0},uSize:{value:2.7},uIntro:{value:0},uOp:{value:1},uMouse:{value:new THREE.Vector2(99,99)},uOff:{value:new THREE.Vector3()},uSc:{value:1},uPx:{value:1}};
  const g=new THREE.BufferGeometry(),rr=new Float32Array(N*3).map(()=>r(2));
  g.setAttribute("position",new THREE.BufferAttribute(new Float32Array(SHAPES[0]),3));g.setAttribute("aB",new THREE.BufferAttribute(new Float32Array(SHAPES[1]),3));g.setAttribute("aR",new THREE.BufferAttribute(rr,3));
  const m=new THREE.ShaderMaterial({uniforms:U,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
   vertexShader:`attribute vec3 aB;attribute vec3 aR;uniform float uMix,uTime,uSize,uPx,uIntro;uniform vec2 uMouse;uniform vec3 uOff;uniform float uSc;varying float vRing;varying float vT;
   void main(){vec3 p=mix(position,aB,uMix);p+=aR*sin(3.14159*uMix)*2.4;float ie=1.-pow(1.-uIntro,3.);p=mix(p*.15+aR*3.,p,ie);float a=sin(uTime*.4)*.4;p.xz=mat2(cos(a),-sin(a),sin(a),cos(a))*p.xz;p+=sin(uTime+aR*5.)*.015;p=p*uSc+uOff;
   vec2 d=p.xy-uMouse;float l=length(d);float f=smoothstep(.95,0.,l);p.xy+=normalize(d+1e-4)*f*.75;vRing=clamp(f*(1.-f)*4.,0.,1.);vT=aR.z;
   vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=uSize*uPx*(1.+vRing*1.3)*(9./-mv.z)*(1.+step(.965,fract(abs(aR.x)*91.7))*1.7);gl_Position=projectionMatrix*mv;}`,
   fragmentShader:`uniform float uOp,uIntro;varying float vRing;varying float vT;void main(){float d=length(gl_PointCoord-.5);float al=smoothstep(.5,.05,d)*uOp*uIntro*(.6+.4*abs(vT));vec3 c=mix(vec3(.86,.87,1.),vec3(.66,.62,1.),vRing);gl_FragColor=vec4(c,al);}`});
  sc.add(new THREE.Points(g,m));gsap.to(U.uIntro,{value:1,duration:2.6,ease:"power2.out",delay:.15});
  const size=()=>{R.setSize(window.innerWidth,window.innerHeight,false);cam.aspect=window.innerWidth/window.innerHeight;cam.updateProjectionMatrix();U.uPx.value=window.innerHeight/826*R.getPixelRatio()};size();window.addEventListener("resize",size);
  const H=2*10*Math.tan(THREE.MathUtils.degToRad(22.5));let cur=0,raf,tx=99,ty=99;
  const mv=(e)=>{tx=(e.clientX/window.innerWidth-.5)*H*cam.aspect;ty=-(e.clientY/window.innerHeight-.5)*H};window.addEventListener("pointermove",mv);
  const loop=(t)=>{raf=requestAnimationFrame(loop);U.uTime.value=t/1000;
   const sv=document.getElementById("services");if(sv){const b=sv.getBoundingClientRect(),vh=window.innerHeight,enter=cl(1-b.top/vh),svc=cl(-b.top/(sv.offsetHeight-vh)),out=cl((b.bottom-vh*.55)/(vh*.4));
    const e=enter*enter*(3-2*enter),pos=Math.min(6,e+svc*5),a=Math.min(5,Math.floor(pos)),f=pos-a,ss=cl((f-.3)/.4);
    if(cur!==a){cur=a;g.attributes.position.array.set(SHAPES[a]);g.attributes.aB.array.set(SHAPES[a+1]);g.attributes.position.needsUpdate=g.attributes.aB.needsUpdate=true}
    U.uMix.value=ss*ss*(3-2*ss);U.uOp.value=out;const w=H*cam.aspect,ox=-.26*w*e,s=1-.2*e;U.uSc.value=s;U.uOff.value.set(ox,-.1*e,0);
    if(glow.current){glow.current.style.transform=`translate(${(ox/w)*window.innerWidth}px,0) scale(${s})`;glow.current.style.opacity=out}}
   U.uMouse.value.x+=(tx-U.uMouse.value.x)*.15;U.uMouse.value.y+=(ty-U.uMouse.value.y)*.15;R.render(sc,cam)};
  raf=requestAnimationFrame(loop);
  return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",size);window.removeEventListener("pointermove",mv);R.dispose()}},[ready]);
 return (
  <>
   <div ref={glow} className="fixed inset-0 z-0 pointer-events-none">
    <div className="absolute left-1/2 top-1/2 w-[700px] h-[700px] -translate-x-1/2 -translate-y-1/2" style={{background:"radial-gradient(circle,rgba(70,68,150,.55) 0%,rgba(40,38,100,.25) 35%,transparent 65%)"}}/>
   </div>
   <canvas ref={cv} className="fixed inset-0 w-full h-full z-[1] pointer-events-none"/>
  </>
 )
}
