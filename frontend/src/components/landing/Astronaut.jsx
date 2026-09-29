import {useEffect,useRef} from "react";
import * as THREE from "three";

export default function Astronaut(){const ref=useRef();
 useEffect(()=>{const el=ref.current,R=new THREE.WebGLRenderer({canvas:el,alpha:true,antialias:true});R.setPixelRatio(Math.min(window.devicePixelRatio,2));
  const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(35,1,.1,50);cam.position.set(0,0,9);
  const suit=new THREE.MeshStandardMaterial({color:0xd2d2dc,roughness:.55,metalness:.1}),dark=new THREE.MeshStandardMaterial({color:0x14141c,roughness:.4,metalness:.3}),visor=new THREE.MeshStandardMaterial({color:0x04040a,roughness:.06,metalness:1});
  const G=new THREE.Group();sc.add(G);
  const add=(geo,mat,p,rot=[0,0,0],par=G)=>{const m=new THREE.Mesh(geo,mat);m.position.set(...p);m.rotation.set(...rot);par.add(m);return m};
  add(new THREE.SphereGeometry(.55,32,32),suit,[0,1.6,0]);add(new THREE.SphereGeometry(.42,32,32),visor,[0,1.62,.3]).scale.set(1.05,.85,.75);
  add(new THREE.CapsuleGeometry(.5,.7,8,16),suit,[0,.5,0]);add(new THREE.BoxGeometry(.85,1.1,.4),suit,[0,.65,-.5]);add(new THREE.BoxGeometry(.5,.35,.1),dark,[0,.55,.5]);
  const limb=(x,y,rz,len,w=.16)=>{const g=new THREE.Group();g.position.set(x,y,0);g.rotation.z=rz;G.add(g);add(new THREE.CapsuleGeometry(w,len,6,12),suit,[0,-len/2-.1,0],[0,0,0],g);add(new THREE.SphereGeometry(w*1.2,12,12),dark,[0,-len-.25,0],[0,0,0],g);return g};
  const aL=limb(-.62,1,-2.3,.8),aR=limb(.62,1,.5,.8),lL=limb(-.28,-.3,.15,.95,.2),lR=limb(.28,-.3,-.35,.95,.2);
  [lL,lR].forEach(l=>add(new THREE.BoxGeometry(.4,.25,.55),suit,[0,-1.45,.1],[0,0,0],l));
  const cable=new THREE.CatmullRomCurve3([[-2.8,-.5,.3],[-1.6,-.9,.4],[-.4,-.5,-.3],[.3,.1,-.8],[1.5,-.3,-.3],[2.9,-.7,.2]].map(a=>new THREE.Vector3(...a)));
  add(new THREE.TubeGeometry(cable,90,.05,8),dark,[0,0,0]);
  sc.add(new THREE.AmbientLight(0x8888aa,.7));const k=new THREE.DirectionalLight(0xffffff,2.4);k.position.set(-3,4,5);sc.add(k);const rim=new THREE.PointLight(0x6c6ecd,40,14);rim.position.set(3,0,-2);sc.add(rim);
  const size=()=>{const w=el.parentElement.clientWidth,h=el.parentElement.clientHeight;R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()};size();window.addEventListener("resize",size);
  let mx=0,vis=true,raf;const mm=e=>mx=e.clientX/window.innerWidth-.5;window.addEventListener("pointermove",mm);
  const io=new IntersectionObserver(([e])=>vis=e.isIntersecting);io.observe(el);
  const loop=t=>{raf=requestAnimationFrame(loop);if(!vis)return;t/=1000;G.position.y=Math.sin(t*.8)*.2;G.rotation.set(.1+Math.sin(t*.4)*.05,Math.sin(t*.35)*.5+mx*.5,.15+Math.sin(t*.5)*.1);aL.rotation.z=-2.3+Math.sin(t*1.4)*.25;aR.rotation.z=.5+Math.sin(t*1.1)*.12;lL.rotation.z=.15+Math.sin(t*.9)*.08;lR.rotation.z=-.35+Math.sin(t*.9+1)*.08;R.render(sc,cam)};
  raf=requestAnimationFrame(loop);return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",size);window.removeEventListener("pointermove",mm);io.disconnect();R.dispose()}},[]);
 return <canvas ref={ref} className="w-full h-full"/>}
