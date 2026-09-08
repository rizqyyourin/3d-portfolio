'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Html, Lightformer, OrbitControls, RoundedBox, useGLTF } from '@react-three/drei';
import { Component, Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from 'react';
import * as THREE from 'three';
import { screenTexture } from '@/lib/screen-texture';
import type { JourneyDetail, JourneyMotion } from '@/lib/journey';

const MODEL_URL = '/models/macbook.glb';
const TAU = Math.PI * 2;
type Props = { motion: MutableRefObject<JourneyMotion>; chapter: number; free: boolean; reduced: boolean; onSelect: (detail: JourneyDetail) => void; onReady: () => void; onError: () => void; reset: number };

function textureCard(title: string, sub: string, number: string, kind: number) {
  const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 680;
  const c = canvas.getContext('2d')!;
  c.fillStyle = '#e9ebe6'; c.fillRect(0, 0, 1024, 680);
  c.fillStyle = '#1d2823'; c.font = '20px monospace'; c.fillText(number + ' / SELECTED WORK', 48, 55); c.fillText('↗', 940, 58);
  if (kind === 0) {
    c.fillStyle = '#d4e1d4'; c.fillRect(45, 95, 934, 400);
    c.fillStyle = '#f6f7f2'; c.beginPath(); c.roundRect(100, 130, 824, 335, 12); c.fill();
    c.fillStyle = '#162b22'; c.font = 'bold 26px sans-serif'; c.fillText('solutif / service desk', 132, 179);
    [128,24,96].forEach((n,i) => { c.fillStyle='#e9eee4';c.fillRect(132+i*251,205,230,90);c.fillStyle='#6b8261';c.font='16px monospace';c.fillText(['TOTAL TICKETS','IN PROGRESS','RESOLVED'][i],148+i*251,233);c.fillStyle='#243b2b';c.font='36px sans-serif';c.fillText(String(n),148+i*251,278); });
    ['SLA engine','Tenant isolation','Live presence'].forEach((t,i)=>{c.fillStyle='#dce5d7';c.fillRect(132,322+i*36,733,1);c.fillStyle='#52634b';c.font='17px sans-serif';c.fillText(t,145,347+i*36);c.fillStyle='#709458';c.fillText('● Connected',700,347+i*36)});
  } else if(kind===1) {
    c.fillStyle='#cbd8b7';c.fillRect(45,95,934,400);c.strokeStyle='#76945b';c.lineWidth=2;c.strokeRect(385,127,240,320);
    c.save();c.translate(495,274);c.rotate(.23);c.fillStyle='#6d8e50';c.fillRect(-25,-118,50,24);const g=c.createLinearGradient(-70,0,70,0);g.addColorStop(0,'#7fa15b');g.addColorStop(.45,'#d6e4b9');g.addColorStop(1,'#8ca96d');c.fillStyle=g;c.beginPath();c.roundRect(-65,-78,130,235,35);c.fill();c.fillStyle='#6a8853';c.font='65px sans-serif';c.fillText('♻',-37,67);c.restore();
    c.fillStyle='#f3f5e9';c.fillRect(615,345,305,98);c.fillStyle='#587143';c.font='24px sans-serif';c.fillText('● Bottle detected',637,387);c.font='15px monospace';c.fillText('MobileNetV2',637,417);
  } else {
    c.fillStyle='#ddd7c9';c.fillRect(45,95,934,400);c.fillStyle='#faf8f0';c.fillRect(170,122,680,344);c.fillStyle='#475c40';c.font='bold 28px sans-serif';c.fillText('bp.  Student attendance',201,170);
    ['Ahmad F.','Nadia P.','Muhammad R.','Aulia S.'].forEach((n,i)=>{c.fillStyle='#e4e6d9';c.fillRect(201,199+i*58,618,1);c.fillStyle='#4b5546';c.font='22px sans-serif';c.fillText(n,215,235+i*58);c.fillStyle='#70875a';c.font='18px sans-serif';c.fillText('✓ Present',680,235+i*58)});
  }
  c.fillStyle='#26342b';c.font='bold 43px sans-serif';c.fillText(title,48,567);c.fillStyle='#71816b';c.font='20px monospace';c.fillText(sub,48,621);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;return texture;
}

function Surface({ title, sub, index, onClick }: { title: string; sub: string; index: number; onClick: () => void }) {
  const mat=useRef<THREE.MeshBasicMaterial>(null);
  const [hover,setHover]=useState(false);
  useEffect(()=>{const t=textureCard(title,sub,`0${index+1}`,index);if(mat.current){mat.current.map=t;mat.current.needsUpdate=true}return()=>t.dispose()},[title,sub,index]);
  return <group onPointerOver={e=>{e.stopPropagation();setHover(true)}} onPointerOut={()=>setHover(false)} onClick={e=>{e.stopPropagation();if(e.delta<=5)onClick()}} scale={hover?1.045:1}>
    <RoundedBox args={[3.8,2.54,.09]} radius={.08} smoothness={3}><meshStandardMaterial color={hover?'#9fb98a':'#aeb5a8'} metalness={.65} roughness={.25}/></RoundedBox>
    <mesh position={[0,0,.051]}><planeGeometry args={[3.72,2.46]}/><meshBasicMaterial ref={mat} toneMapped={false}/></mesh>
    <Html position={[0,-1.5,0]} center zIndexRange={[5,0]}><button className="object-label" onClick={onClick}>OPEN PROJECT <span>↗</span></button></Html>
  </group>;
}

function Laptop({ motion, reduced, chapter, onSelect, onReady }: Pick<Props,'motion'|'reduced'|'chapter'|'onSelect'|'onReady'>) {
  const {size}=useThree();const mobile=size.width<=760;
  const {scene}=useGLTF(MODEL_URL);const model=useMemo(()=>scene.clone(true),[scene]);const root=useRef<THREE.Group>(null);const screen=useRef<THREE.MeshBasicMaterial>(null);
  useEffect(()=>{onReady()},[onReady]);
  useEffect(()=>{const t=screenTexture(chapter===1?1:chapter===2?2:0);if(screen.current){screen.current.map=t;screen.current.needsUpdate=true}return()=>t.dispose()},[chapter]);
  useFrame(({clock},delta)=>{
    if(!root.current)return;
    const p=motion.current.progress;
    const anchors=mobile?[1,.38,.72,.35,.93]:[1,.57,.72,.5,.93];const rotations=[-.4,TAU-.25,TAU*1.5+.2,TAU*2+.15,TAU*3-.25];const i=Math.min(3,Math.floor(p));const f=THREE.MathUtils.smoothstep(p-i,0,1);const scale=THREE.MathUtils.lerp(anchors[i],anchors[i+1],f);
    root.current.scale.setScalar(scale);
    root.current.rotation.y=THREE.MathUtils.damp(root.current.rotation.y, reduced?-.25:THREE.MathUtils.lerp(rotations[i],rotations[i+1],f),5,delta);
    root.current.rotation.z=reduced?0:Math.sin(p*Math.PI)*.13-.07;
    root.current.position.x=mobile?Math.sin(p*Math.PI/2)*.6:0;
    root.current.position.z=mobile? -Math.max(0,1-Math.abs(p-1))*2-Math.max(0,1-Math.abs(p-3))*2:0;
    root.current.position.y=-.4+(reduced||motion.current.paused?0:Math.sin(clock.elapsedTime*.65)*.07);
  });
  return <group ref={root}>
    <group position={[0,-1.3,.5]}>
      <primitive object={model} scale={5.4/.31}/>
      <mesh position={[0,2.05,-1.876]} onClick={e=>{e.stopPropagation();if(e.delta<=5)onSelect(chapter===4?'contact':chapter===2?'skills':'projects')}}>
        <planeGeometry args={[4.97,3.08]}/><meshBasicMaterial ref={screen} toneMapped={false}/>
      </mesh>
    </group>
  </group>;
}

function Artifacts({ motion, chapter, onSelect, reduced }: Pick<Props,'motion'|'chapter'|'onSelect'|'reduced'>) {
  const hovered=useRef(false);const projects=useRef<THREE.Group>(null);const stack=useRef<THREE.Group>(null);const journey=useRef<THREE.Group>(null);
  const {size}=useThree();const mobile=size.width<=760;
  const mobileSpread=Math.min(2.35,6.4*size.height/size.width*.26);
  const mobileCardScale=Math.min(.72,6.4*size.height/size.width*.08);
  useFrame((_,delta)=>{
    const p=motion.current.progress;
    for(const [ref,center] of [[projects,1],[stack,2],[journey,3]] as const){if(ref.current){const a=Math.max(0,1-Math.abs(p-center)*1.6);ref.current.visible=a>.015;ref.current.scale.setScalar(Math.max(.001,a)*(ref===stack&&mobile?.65:1));}}
    if(stack.current&&!reduced&&!motion.current.paused&&!hovered.current)stack.current.rotation.y+=delta*.08;
  });
  return <>
    {chapter===1&&<group ref={projects}>
      <group position={mobile?[-.65,mobileSpread,.5]:[-4.1,1.4,.4]} rotation={[.03,.2,-.08]} scale={mobile?mobileCardScale:.9}><Surface title="A smarter service desk." sub="SOLUTIF / FULLSTACK / 2026" index={0} onClick={()=>onSelect('project-0')}/></group>
      <group position={mobile?[.65,0,.6]:[.2,2.85,-1.2]} rotation={[-.04,-.1,.04]} scale={mobile?mobileCardScale:.84}><Surface title="Small bin. Big possibilities." sub="SMART BIN / MACHINE LEARNING" index={1} onClick={()=>onSelect('project-1')}/></group>
      <group position={mobile?[-.65,-mobileSpread,.7]:[4.1,.8,.8]} rotation={[.06,-.22,.09]} scale={mobile?mobileCardScale:.9}><Surface title="Every attendance counts." sub="SIMTEG / FULLSTACK / 2024" index={2} onClick={()=>onSelect('project-2')}/></group>
    </group>}
    {chapter===2&&<group ref={stack}>
      {[0,1,2].map((n)=><mesh key={n} rotation={[1.2+n*.3,n*.55,.2]}><torusGeometry args={[3.6+n*.48,.013,8,120]}/><meshStandardMaterial color="#6d8d54" metalness={.7} roughness={.3}/></mesh>)}
      {['TypeScript','Next.js / Nuxt.js','Go / PHP','PostgreSQL','Docker / K8s','WebSocket'].map((label,i)=>{const a=i/6*TAU;return <group key={label} position={[Math.cos(a)*3.7,Math.sin(a)*2.3,Math.sin(a+.4)*2]}><mesh onClick={e=>{if(e.delta<=5)onSelect('skills')}}><icosahedronGeometry args={[.17,0]}/><meshStandardMaterial color="#809d62" metalness={.8} roughness={.2}/></mesh><Html center position={[0,.38,0]} zIndexRange={[5,0]}><button className="skill-orbit-label" onPointerEnter={()=>{hovered.current=true}} onPointerLeave={()=>{hovered.current=false}} onFocus={()=>{hovered.current=true}} onBlur={()=>{hovered.current=false}} onClick={()=>onSelect('skills')}>{label}</button></Html></group>})}
    </group>}
    {chapter===3&&<group ref={journey}>
      {[['2021 — 2025','DIPONEGORO','Computer Engineering'],['2024','BINTANG PELAJAR','Fullstack internship'],['2025 — 2026','SOLUTIF','Fullstack / MagangHub']].map(([year,title,sub],i)=><group key={year} position={mobile?[0,mobileSpread*(1-i),1]:[(i-1)*4,1.1+Math.sin(i)*.9,0]}><mesh position={mobile?[-2.05,0,0]:[0,0,0]} rotation={[.2,.4,.12]} onClick={e=>{if(e.delta<=5)onSelect('journey')}}><boxGeometry args={[.64,.64,.64]}/><meshStandardMaterial color={i===2?'#819d61':'#c9ccc3'} metalness={.8} roughness={.2}/></mesh><Html center position={mobile?[.2,0,.2]:[0,-.8,0]} zIndexRange={[5,0]}><button className="milestone" onClick={()=>onSelect('journey')}><span>{year}</span><strong>{title}</strong><small>{sub}</small></button></Html></group>)}
    </group>}
  </>;
}

function Atmosphere({motion,reduced}:Pick<Props,'motion'|'reduced'>){
  const group=useRef<THREE.Group>(null);
  const particles=useMemo(()=>{const a=new Float32Array(180*3);for(let i=0;i<180;i++){a[i*3]=Math.sin(i*127.1)*15;a[i*3+1]=Math.cos(i*311.7)*9;a[i*3+2]=Math.sin(i*74.7)*12-4}return a},[]);
  useFrame((_,delta)=>{if(group.current&&!reduced&&!motion.current.paused)group.current.rotation.y+=delta*.013});
  return <group ref={group}><points><bufferGeometry><bufferAttribute attach="attributes-position" args={[particles,3]}/></bufferGeometry><pointsMaterial color="#6d8064" size={.027} transparent opacity={.48} sizeAttenuation/></points><mesh rotation={[Math.PI/2,0,0]} position={[0,-3,0]}><ringGeometry args={[5.7,5.72,160]}/><meshBasicMaterial color="#9fae93" transparent opacity={.3} side={THREE.DoubleSide}/></mesh></group>;
}

function CameraRig({motion,free,reduced}:Pick<Props,'motion'|'free'|'reduced'>){
  const target=useRef(new THREE.Vector3());const location=useRef(new THREE.Vector3());
  useFrame(({camera,size,pointer},delta)=>{
    if(free)return;
    const p=motion.current.progress;const i=Math.min(3,Math.floor(p));const t=THREE.MathUtils.smoothstep(p-i,0,1);const mobile=size.width<=760;
    const positions=[[.2,1.6,10.3],[0,1.6,14],[2.5,5.5,12],[0,2.2,14],[0,1.2,9.7]];
    const from=positions[i],to=positions[i+1];
    const widths=[7.3,6.4,7,6.4,7.3];
    const mobileWidth=THREE.MathUtils.lerp(widths[i],widths[i+1],t);
    const mobileDistance=mobileWidth/(2*Math.tan(THREE.MathUtils.degToRad(42/2))*(size.width/size.height));
    location.current.set(mobile?0:THREE.MathUtils.lerp(from[0],to[0],t),mobile?.7:THREE.MathUtils.lerp(from[1],to[1],t),mobile?mobileDistance:THREE.MathUtils.lerp(from[2],to[2],t));
    if(!reduced){location.current.x+=pointer.x*.22;location.current.y+=pointer.y*.12;camera.position.lerp(location.current,1-Math.exp(-delta*4));}else camera.position.copy(location.current);
    target.current.set(0,.1,0);camera.lookAt(target.current);
  });return null;
}

class SceneBoundary extends Component<{children:ReactNode;onError:()=>void},{failed:boolean}>{
  state={failed:false};static getDerivedStateFromError(){return{failed:true}}componentDidCatch(){useGLTF.clear(MODEL_URL);this.props.onError()}render(){return this.state.failed?null:this.props.children}
}
export default function Macbook(props:Props){
  return <SceneBoundary key={props.reset} onError={props.onError}><Canvas camera={{position:[.2,1.6,10.3],fov:42}} dpr={[1,1.5]} gl={{antialias:true,alpha:true,powerPreference:'high-performance'}} fallback={<div className="webgl-fallback">3D isn’t supported here. Use the chapter menu to explore my work.</div>}>
    <ambientLight intensity={.7}/><directionalLight position={[2,6,5]} intensity={2}/>
    <Environment resolution={128}><Lightformer intensity={3} position={[0,5,0]} rotation={[Math.PI/2,0,0]} scale={[10,10,1]}/><Lightformer intensity={2} position={[0,2,6]} scale={[10,5,1]}/><Lightformer intensity={3} position={[-5,2,0]} rotation={[0,Math.PI/2,0]} scale={[5,5,1]}/></Environment>
    <Suspense fallback={null}><Laptop {...props}/><Artifacts {...props}/></Suspense>
    <Atmosphere {...props}/><CameraRig {...props}/>
    {props.free&&<OrbitControls makeDefault enablePan={false} enableZoom={false} target={[0,.1,0]} minPolarAngle={.15} maxPolarAngle={Math.PI-.15}/>}
  </Canvas></SceneBoundary>;
}
