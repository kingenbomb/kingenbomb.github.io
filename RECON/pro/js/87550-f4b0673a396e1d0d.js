"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[87550],{9976:(e,t,r)=>{r.d(t,{E:()=>i});let i={wildness:.85,curlStrength:6.5,velocityDissipation:.96,dyeDissipation:.965,splatForce:8e3,cursorForce:3500,displace:.035,coreStrength:.02,haloStrength:.015,haloWidth:2.6,mistWidth:5.5,mistStrength:.2,bendDim:0,stagnationDim:0,flowMag:2e-4,jetSpeed:3.9,bendDecel:1.7,decelWindow:.15,phaseWarp:1.7,gustDepth:.06,waveAmpBase:.22,streakAmp:.3,streakFreq:7.1,meanderBase:.0015,meanderVt:.008,swayAmp:0,swayAmp2:0,surgeAmp:0,widthBreath:.22,anchorYFrac:1,landRx:.09,landRy:.1,sweepRy:.22,gatherLen:.12,fallWidth:5e-4,ropeR:3e-4,ropeXOff:.028}},56191:(e,t,r)=>{r.d(t,{BZ:()=>v,Ce:()=>s,FW:()=>d,L4:()=>c,UQ:()=>u,Wg:()=>o,_I:()=>x,nk:()=>f,ub:()=>p,xJ:()=>l,xw:()=>m});var i=r(18543),n=r(18893);let o=i.f5.filter(e=>!e.hidden).length,a=e=>e.reduce((e,t)=>e+(t.variants?.length??1),0),l=i.Bz.length,u=a(i.Bz),s=i.un.length,c=a(i.un),f=i.IT.length,d=n.K_.length+1,m=i.f5.filter(e=>!e.hidden&&e.isNew).length,v=i.Bz.filter(e=>!e.hidden).reduce((e,t)=>e+(t.variants?.filter(e=>e.isNew).length??0),0),x=i.IT.filter(e=>!e.hidden&&e.isNew).length,p=o+u+c+f+d},82786:(e,t,r)=>{r.d(t,{$t:()=>n,SU:()=>o,_O:()=>a,bD:()=>l,ii:()=>s,ps:()=>c,s1:()=>u});var i=r(18893);let n="/docs/agent-kit",o="Agent Kit",a="Design skills, page prompts and full-page recipes you hand to your AI agent.";function l(e){return`${n}/${i.b4[e.kind]}/${e.slug}`}function u(e,t){return`${n}/${i.b4[e]}/${t}`}let s={facet:"agent",slug:"agent-skill",name:"React Bits Pro Skill",category:"Integration",href:`${n}/agent-skill`,summary:"Teach your agent to install and use React Bits Pro components and blocks correctly on the first try.",tierLabel:"Starter"},c=[{facet:"skill",label:"Skills",singular:"Skill"},{facet:"prompt",label:"Prompts",singular:"Prompt"},{facet:"recipe",label:"Recipes",singular:"Recipe"},{facet:"agent",label:"Setup",singular:"Setup"}];i.K_.length},82894:(e,t,r)=>{r.d(t,{S:()=>w});var i=r(95155),n=r(12115),o=r(9976);let a=2*Math.PI,l=(0,n.memo)(({dotRadius:e=1.5,dotSpacing:t=14,cursorRadius:r=500,cursorForce:o=.1,bulgeOnly:l=!0,bulgeStrength:u=67,glowRadius:s=160,sparkle:c=!1,waveAmplitude:f=0,gradientFrom:d="rgba(168, 85, 247, 0.35)",gradientTo:m="rgba(180, 151, 207, 0.25)",glowColor:v="#120F17",fadeBottom:x=0,fadeTop:p=0,fadeTopOffset:h=0,liquidColor:y="",liquidRadius:g=240,...T})=>{let E=(0,n.useRef)(null),w=(0,n.useRef)(null),b=(0,n.useRef)(null),R=(0,n.useRef)([]),M=(0,n.useRef)({x:-9999,y:-9999,prevX:-9999,prevY:-9999,speed:0}),A=(0,n.useRef)(null),U=(0,n.useRef)({w:0,h:0,offsetX:0,offsetY:0}),D=(0,n.useRef)(0),F=(0,n.useRef)(0),C=(0,n.useRef)({});C.current={dotRadius:e,dotSpacing:t,cursorRadius:r,cursorForce:o,bulgeOnly:l,bulgeStrength:u,sparkle:c,waveAmplitude:f,gradientFrom:d,gradientTo:m,fadeBottom:x,fadeTop:p,fadeTopOffset:h,liquidColor:y,liquidRadius:g};let S=(0,n.useRef)(null),P=(0,n.useRef)(`dot-field-glow-${Math.random().toString(36).slice(2,9)}`);return(0,n.useEffect)(()=>{let e,t=E.current,r=b.current;if(!t)return;let i=t.getContext("2d",{alpha:!0});if(!i)return;let n=Math.min(window.devicePixelRatio||1,2);function o(){clearTimeout(e),e=setTimeout(l,100)}function l(){let e=t.parentElement.getBoundingClientRect(),r=e.width,o=e.height;t.width=r*n,t.height=o*n,t.style.width=`${r}px`,t.style.height=`${o}px`,i.setTransform(n,0,0,n,0,0),U.current={w:r,h:o,offsetX:e.left+window.scrollX,offsetY:e.top+window.scrollY},u(r,o),m=!1}function u(e,t){let r=C.current,i=r.dotRadius+r.dotSpacing,n=Math.floor(e/i),o=Math.floor(t/i),a=e%i/2,l=t%i/2,u=Math.min(Math.max(r.fadeBottom,0),1),s=t*(1-u),c=t-s,f=Math.min(Math.max(r.fadeTop,0),1),d=Math.max(r.fadeTopOffset,0),m=t*f,v=Array(o*n),x=0;for(let e=0;e<o;e++)for(let t=0;t<n;t++){let r=a+t*i+i/2,n=l+e*i+i/2,o=1;if(u>0&&n>s){let e=Math.min((n-s)/c,1);o=1-e*e*(3-2*e)}n<d?o=0:f>0&&n<d+m&&(o*=Math.cbrt(Math.min((n-d)/m,1))),v[x++]={ax:r,ay:n,sx:r,sy:n,vx:0,vy:0,x:r,y:n,fade:o,heat:0}}R.current=v}function s(e){let t=U.current;M.current.x=e.pageX-t.offsetX,M.current.y=e.pageY-t.offsetY,m=!1}let c=setInterval(function(){let e=M.current,t=e.prevX-e.x,r=e.prevY-e.y,i=Math.sqrt(t*t+r*r);e.speed+=(i-e.speed)*.5,e.speed<.001&&(e.speed=0),e.prevX=e.x,e.prevY=e.y},20),f=0,d=!0,m=!1,v=0,x=null,p="",h={x:-9999,y:-9999},y=[],g="",T=0;l(),window.addEventListener("resize",o),window.addEventListener("mousemove",s,{passive:!0}),A.current=requestAnimationFrame(function e(){if(!d||m){A.current=requestAnimationFrame(e);return}f++;let t=R.current,n=M.current,{w:o,h:l}=U.current,u=C.current,s=t.length,c=.02*f,E=Math.min(n.speed/5,1);F.current+=(E-F.current)*.06,F.current<.001&&(F.current=0);let w=F.current;D.current+=(w-D.current)*.08,r&&(r.setAttribute("cx",String(n.x)),r.setAttribute("cy",String(n.y)),r.style.opacity=String(D.current));let b=u.liquidColor,S=b.length>0,P=u.liquidRadius,_=P*P;if(S&&(Math.abs(n.x-h.x)+Math.abs(n.y-h.y)>3e3?(h.x=n.x,h.y=n.y):(h.x+=(n.x-h.x)*.07,h.y+=(n.y-h.y)*.07),g!==b)){let e=b.replace("#",""),t=parseInt(e.slice(0,2),16),r=parseInt(e.slice(2,4),16),i=parseInt(e.slice(4,6),16);y=[];for(let e=1;e<=8;e++){let n=(e/8*.9).toFixed(3);y.push(`rgba(${t}, ${r}, ${i}, ${n})`)}g=b}let k=S?Array(8):null,X=0;if(!(u.sparkle||u.waveAmplitude>0)&&0===w&&D.current<.005&&T<.01){if(++v>60){for(let e=0;e<s;e++){let r=t[e];r.sx=r.ax,r.sy=r.ay,r.vx=0,r.vy=0,r.heat=0}m=!0}}else v=0;i.clearRect(0,0,o,l);let I=`${o}|${l}|${u.gradientFrom}|${u.gradientTo}`;I!==p&&((x=i.createLinearGradient(0,0,o,l)).addColorStop(0,u.gradientFrom),x.addColorStop(1,u.gradientTo),p=I),i.fillStyle=x;let B=u.cursorRadius,L=B*B,V=u.dotRadius/2,N=u.bulgeOnly;i.beginPath();for(let e=0;e<s;e++){let r=t[e],o=n.x-r.ax,l=n.y-r.ay,s=o*o+l*l;if(s<L&&w>.01){let e=Math.sqrt(s);if(N){let t=1-e/B,i=t*t*u.bulgeStrength*w,n=Math.atan2(l,o);r.sx+=(r.ax-Math.cos(n)*i-r.sx)*.15,r.sy+=(r.ay-Math.sin(n)*i-r.sy)*.15}else{let t=Math.atan2(l,o),i=500/e*(n.speed*u.cursorForce);r.vx+=-(Math.cos(t)*i),r.vy+=-(Math.sin(t)*i)}}else N&&(r.sx+=(r.ax-r.sx)*.1,r.sy+=(r.ay-r.sy)*.1);if(N||(r.vx*=.9,r.vy*=.9,r.x=r.ax+r.vx,r.y=r.ay+r.vy,r.sx+=(r.x-r.sx)*.1,r.sy+=(r.y-r.sy)*.1),S){let e=h.x-r.ax,t=h.y-r.ay,i=e*e+t*t;if(i<_){let e=1-Math.sqrt(i)/P,t=e*e;t>r.heat&&(r.heat+=(t-r.heat)*.3)}r.heat*=.955,r.heat<.004?r.heat=0:r.heat>X&&(X=r.heat)}let d=r.sx,m=r.sy;u.waveAmplitude>0&&(m+=Math.sin(.03*r.ax+c)*u.waveAmplitude,d+=Math.cos(.03*r.ay+.7*c)*u.waveAmplitude*.5);let v=V*r.fade;if(!(v<=.01)&&(u.sparkle&&((0x9e3779b1*e^f>>3)>>>0)%100<3?(i.moveTo(d+1.8*v,m),i.arc(d,m,1.8*v,0,a)):(i.moveTo(d+v,m),i.arc(d,m,v,0,a)),k&&r.heat>.03)){let e=Math.min(7,8*r.heat|0),t=k[e];t||(t=k[e]=new Path2D);let i=v*(1+r.heat);t.moveTo(d+i,m),t.arc(d,m,i,0,a)}}if(i.fill(),k){for(let e=0;e<8;e++){let t=k[e];t&&(i.fillStyle=y[e],i.fill(t))}T=X}A.current=requestAnimationFrame(e)});let w=new IntersectionObserver(([e])=>{(d=e.isIntersecting)&&(m=!1)});return w.observe(t),S.current=()=>{let{w:e,h:t}=U.current;e>0&&t>0&&u(e,t),m=!1},()=>{A.current&&cancelAnimationFrame(A.current),clearInterval(c),clearTimeout(e),w.disconnect(),window.removeEventListener("resize",o),window.removeEventListener("mousemove",s)}},[]),(0,n.useEffect)(()=>{S.current?.()},[e,t,x,p,h]),(0,i.jsxs)("div",{className:"relative h-full w-full",...T,children:[(0,i.jsx)("canvas",{ref:E,style:{position:"absolute",inset:0,width:"100%",height:"100%"}}),(0,i.jsxs)("svg",{ref:w,style:{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"},children:[(0,i.jsx)("defs",{children:(0,i.jsxs)("radialGradient",{id:P.current,children:[(0,i.jsx)("stop",{offset:"0%",stopColor:v,stopOpacity:"1"}),(0,i.jsx)("stop",{offset:"30%",stopColor:v,stopOpacity:"0.75"}),(0,i.jsx)("stop",{offset:"55%",stopColor:v,stopOpacity:"0.4"}),(0,i.jsx)("stop",{offset:"75%",stopColor:v,stopOpacity:"0.15"}),(0,i.jsx)("stop",{offset:"90%",stopColor:v,stopOpacity:"0.04"}),(0,i.jsx)("stop",{offset:"100%",stopColor:v,stopOpacity:"0"})]})}),(0,i.jsx)("circle",{ref:b,cx:"-9999",cy:"-9999",r:s,fill:`url(#${P.current})`,style:{opacity:0,willChange:"opacity"}})]})]})});l.displayName="DotField";let u=`#version 300 es
precision highp float;
layout(location=0) in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`,s=`#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 uTexel;
uniform float uDt;
uniform float uDissipation;
out vec4 o;
void main() {
  vec2 coord = vUv - uDt * texture(uVelocity, vUv).xy * uTexel;
  o = uDissipation * texture(uSource, coord);
}`,c=`#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uVelocity;
uniform vec2 uTexel;
out vec4 o;
void main() {
  float l = texture(uVelocity, vUv - vec2(uTexel.x, 0.0)).x;
  float r = texture(uVelocity, vUv + vec2(uTexel.x, 0.0)).x;
  float b = texture(uVelocity, vUv - vec2(0.0, uTexel.y)).y;
  float t = texture(uVelocity, vUv + vec2(0.0, uTexel.y)).y;
  o = vec4(0.5 * (r - l + t - b), 0.0, 0.0, 1.0);
}`,f=`#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uVelocity;
uniform vec2 uTexel;
out vec4 o;
void main() {
  float l = texture(uVelocity, vUv - vec2(uTexel.x, 0.0)).y;
  float r = texture(uVelocity, vUv + vec2(uTexel.x, 0.0)).y;
  float b = texture(uVelocity, vUv - vec2(0.0, uTexel.y)).x;
  float t = texture(uVelocity, vUv + vec2(0.0, uTexel.y)).x;
  o = vec4(0.5 * (r - l - t + b), 0.0, 0.0, 1.0);
}`,d=`#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform vec2 uTexel;
uniform float uCurlStrength;
uniform float uDt;
out vec4 o;
void main() {
  float l = texture(uCurl, vUv - vec2(uTexel.x, 0.0)).x;
  float r = texture(uCurl, vUv + vec2(uTexel.x, 0.0)).x;
  float b = texture(uCurl, vUv - vec2(0.0, uTexel.y)).x;
  float t = texture(uCurl, vUv + vec2(0.0, uTexel.y)).x;
  float c = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(t) - abs(b), abs(r) - abs(l));
  force /= length(force) + 0.0001;
  force *= uCurlStrength * c;
  force.y *= -1.0;
  vec2 vel = texture(uVelocity, vUv).xy + force * uDt;
  o = vec4(clamp(vel, -1000.0, 1000.0), 0.0, 1.0);
}`,m=`#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
uniform vec2 uTexel;
out vec4 o;
void main() {
  float l = texture(uPressure, vUv - vec2(uTexel.x, 0.0)).x;
  float r = texture(uPressure, vUv + vec2(uTexel.x, 0.0)).x;
  float b = texture(uPressure, vUv - vec2(0.0, uTexel.y)).x;
  float t = texture(uPressure, vUv + vec2(0.0, uTexel.y)).x;
  float div = texture(uDivergence, vUv).x;
  o = vec4((l + r + b + t - div) * 0.25, 0.0, 0.0, 1.0);
}`,v=`#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
uniform vec2 uTexel;
out vec4 o;
void main() {
  float l = texture(uPressure, vUv - vec2(uTexel.x, 0.0)).x;
  float r = texture(uPressure, vUv + vec2(uTexel.x, 0.0)).x;
  float b = texture(uPressure, vUv - vec2(0.0, uTexel.y)).x;
  float t = texture(uPressure, vUv + vec2(0.0, uTexel.y)).x;
  vec2 vel = texture(uVelocity, vUv).xy - 0.5 * vec2(r - l, t - b);
  o = vec4(vel, 0.0, 1.0);
}`,x=`#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uTarget;
uniform float uAspect;
uniform vec2 uPoint;
uniform vec3 uColor;
uniform float uRadius;
out vec4 o;
void main() {
  vec2 p = vUv - uPoint;
  p.x *= uAspect;
  vec3 splat = exp(-dot(p, p) / uRadius) * uColor;
  vec3 base = texture(uTarget, vUv).xyz;
  o = vec4(base + splat, 1.0);
}`,p=`#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uTarget;
uniform float uAspect;
uniform int uCount;
uniform vec4 uPos[48];
uniform vec4 uCol[48];
out vec4 o;
void main() {
  vec3 acc = texture(uTarget, vUv).xyz;
  for (int i = 0; i < 48; i++) {
    if (i >= uCount) break;
    vec2 p = vUv - uPos[i].xy;
    p.x *= uAspect;
    acc += exp(-dot(p, p) / uPos[i].z) * uCol[i].xyz;
  }
  o = vec4(acc, 1.0);
}`,h=`#version 300 es
precision highp float;
layout(location=0) in vec2 aPos;
layout(location=1) in float aFade;
uniform vec2 uResolution;
uniform sampler2D uVelocity;
uniform sampler2D uDye;
uniform float uDotSize;
uniform float uDpr;
uniform float uDisplace;
out float vFade;
out vec3 vInk;
out float vInkAmt;
out float vGradT;
void main() {
  vec2 uv = vec2(aPos.x / uResolution.x, 1.0 - aPos.y / uResolution.y);
  vec2 vel = texture(uVelocity, uv).xy;
  vec3 dye = texture(uDye, uv).rgb;
  float ink = clamp(max(dye.r, max(dye.g, dye.b)), 0.0, 1.0);
  vec2 pos = aPos + vec2(vel.x, -vel.y) * uDisplace;
  vec2 clip = (pos / uResolution) * 2.0 - 1.0;
  clip.y = -clip.y;
  gl_Position = vec4(clip, 0.0, 1.0);
  gl_PointSize = max(uDotSize * (1.0 + ink * 0.8) * aFade * uDpr, 0.0);
  vFade = aFade;
  vInk = dye;
  vInkAmt = ink;
  vGradT = (uv.x + (1.0 - uv.y)) * 0.5;
}`,y=`#version 300 es
precision highp float;
in float vFade;
in vec3 vInk;
in float vInkAmt;
in float vGradT;
uniform vec4 uColorA;
uniform vec4 uColorB;
out vec4 o;
void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0;
  float d = dot(c, c);
  if (d > 1.0) discard;
  float edge = 1.0 - smoothstep(0.5, 1.0, d);
  vec4 base = mix(uColorA, uColorB, vGradT);
  float inkMix = clamp(vInkAmt * 1.4, 0.0, 0.8);
  // Normalize by the TRUE max channel; dividing by the clamped ink
  // amount blew every channel to 1.0 (white) where dye accumulated.
  float m = max(vInk.r, max(vInk.g, vInk.b));
  vec3 chroma = clamp(vInk / max(m, 0.0001), 0.0, 1.0);
  vec3 col = mix(base.rgb, chroma, inkMix);
  float alpha = mix(base.a, 0.85, inkMix) * edge * vFade;
  o = vec4(col * alpha, alpha);
}`;function g(e){let t=e.trim();if(t.startsWith("#")){let e=t.slice(1);return[parseInt(e.slice(0,2),16)/255,parseInt(e.slice(2,4),16)/255,parseInt(e.slice(4,6),16)/255,1]}let r=t.match(/rgba?\(([^)]+)\)/);if(!r)return[.5,.5,.5,.4];let i=r[1].split(",").map(e=>parseFloat(e));return[(i[0]??128)/255,(i[1]??128)/255,(i[2]??128)/255,i[3]??1]}function T(e,t,r){let i=e.createShader(t);if(e.shaderSource(i,r),e.compileShader(i),!e.getShaderParameter(i,e.COMPILE_STATUS))throw Error(e.getShaderInfoLog(i)??"shader compile failed");return i}function E(e,t,r){let i=e.createProgram();if(e.attachShader(i,T(e,e.VERTEX_SHADER,t)),e.attachShader(i,T(e,e.FRAGMENT_SHADER,r)),e.linkProgram(i),!e.getProgramParameter(i,e.LINK_STATUS))throw Error(e.getProgramInfoLog(i)??"program link failed");return i}let w=(0,n.memo)(({dotRadius:e=1.5,dotSpacing:t=14,gradientFrom:r="rgba(115, 115, 115, 0.55)",gradientTo:a="rgba(163, 163, 163, 0.38)",inkColors:T=["#7c3aed","#c026d3","#4f46e5"],fadeBottom:w=0,fadeTop:b=0,fadeTopOffset:R=0,streamPath:M=null})=>{let A=(0,n.useRef)(null),[U,D]=(0,n.useState)(!1),[F,C]=(0,n.useState)(0),S=(0,n.useRef)(0),P=(0,n.useRef)({dotRadius:e,dotSpacing:t,gradientFrom:r,gradientTo:a,inkColors:T,fadeBottom:w,fadeTop:b,fadeTopOffset:R,streamPath:M});P.current={dotRadius:e,dotSpacing:t,gradientFrom:r,gradientTo:a,inkColors:T,fadeBottom:w,fadeTop:b,fadeTopOffset:R,streamPath:M};let _=(0,n.useRef)(null),k=(0,n.useRef)(null);(0,n.useEffect)(()=>{let e,t,r,i,n,a,l=A.current;if(!l)return;let w=window.matchMedia("(prefers-reduced-motion: reduce)").matches,b=window.matchMedia("(hover: none)").matches;if(w||b)return void D(!0);let R=0,M=!1,U=()=>{S.current>=3?D(!0):(S.current+=1,R=window.setTimeout(()=>C(e=>e+1),400))},F=document.createElement("canvas");F.style.position="absolute",F.style.inset="0",l.appendChild(F);let X=F.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!X||X.isContextLost()||!X.getExtension("EXT_color_buffer_float"))return F.remove(),U(),()=>clearTimeout(R);let I=e=>{e.preventDefault(),M||U()};F.addEventListener("webglcontextlost",I);let B=Math.min(window.devicePixelRatio||1,1.5),L=1e3/60,V=X.createVertexArray();X.bindVertexArray(V);let N=X.createBuffer();X.bindBuffer(X.ARRAY_BUFFER,N),X.bufferData(X.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),X.STATIC_DRAW),X.enableVertexAttribArray(0),X.vertexAttribPointer(0,2,X.FLOAT,!1,0,0),X.bindVertexArray(null);let $={advect:E(X,u,s),divergence:E(X,u,c),curl:E(X,u,f),vorticity:E(X,u,d),pressure:E(X,u,m),gradient:E(X,u,v),splat:E(X,u,x),multiSplat:E(X,u,p),dots:E(X,h,y)},O=(e,t)=>X.getUniformLocation(e,t);function j(e,t,r,i,n){let o=X.createTexture();X.bindTexture(X.TEXTURE_2D,o),X.texParameteri(X.TEXTURE_2D,X.TEXTURE_MIN_FILTER,n),X.texParameteri(X.TEXTURE_2D,X.TEXTURE_MAG_FILTER,n),X.texParameteri(X.TEXTURE_2D,X.TEXTURE_WRAP_S,X.CLAMP_TO_EDGE),X.texParameteri(X.TEXTURE_2D,X.TEXTURE_WRAP_T,X.CLAMP_TO_EDGE),X.texImage2D(X.TEXTURE_2D,0,r,e,t,0,i,X.HALF_FLOAT,null);let a=X.createFramebuffer();return X.bindFramebuffer(X.FRAMEBUFFER,a),X.framebufferTexture2D(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,X.TEXTURE_2D,o,0),X.clearColor(0,0,0,1),X.clear(X.COLOR_BUFFER_BIT),{fb:a,tex:o,w:e,h:t,texelX:1/e,texelY:1/t}}function G(e,t,r,i,n){let o={read:j(e,t,r,i,n),write:j(e,t,r,i,n),swap(){let e=o.read;o.read=o.write,o.write=e}};return o}let W=0,z=0,Y=0,q=0,H=0,K=0,Z=null,J=null,Q=0;function ee(e){X.deleteFramebuffer(e.fb),X.deleteTexture(e.tex)}function et(){let e=P.current,t=e.dotRadius+e.dotSpacing,r=Math.floor(H/t),i=Math.floor(K/t),n=H%t/2,o=K%t/2,a=Math.min(Math.max(e.fadeBottom,0),1),l=K*(1-a),u=K-l,s=Math.min(Math.max(e.fadeTop,0),1),c=Math.max(e.fadeTopOffset,0),f=K*s,d=new Float32Array(i*r*3),m=0;for(let e=0;e<i;e++)for(let i=0;i<r;i++){let r=n+i*t+t/2,v=o+e*t+t/2,x=1;if(a>0&&v>l){let e=Math.min((v-l)/u,1);x=1-e*e*(3-2*e)}v<c?x=0:s>0&&v<c+f&&(x*=Math.cbrt(Math.min((v-c)/f,1))),!(x<=.005)&&(d[3*m]=r,d[3*m+1]=v,d[3*m+2]=x,m++)}Q=m,Z||(Z=X.createVertexArray()),J||(J=X.createBuffer()),X.bindVertexArray(Z),X.bindBuffer(X.ARRAY_BUFFER,J),X.bufferData(X.ARRAY_BUFFER,d.subarray(0,3*m),X.STATIC_DRAW),X.enableVertexAttribArray(0),X.vertexAttribPointer(0,2,X.FLOAT,!1,12,0),X.enableVertexAttribArray(1),X.vertexAttribPointer(1,1,X.FLOAT,!1,12,8),X.bindVertexArray(null)}function er(e){e?(X.viewport(0,0,e.w,e.h),X.bindFramebuffer(X.FRAMEBUFFER,e.fb)):(X.viewport(0,0,F.width,F.height),X.bindFramebuffer(X.FRAMEBUFFER,null)),X.bindVertexArray(V),X.drawArrays(X.TRIANGLES,0,3),X.bindVertexArray(null)}let ei=[],en=0,eo=!1,ea=!0,el=0,eu=performance.now(),es=T.map(g),ec=T.join();function ef(a){let l,u,s;if(!ea){eo=!0;return}let c=a-eu;if(c<L-2){el=requestAnimationFrame(ef);return}let f=Math.min(c/1e3,1/30);eu=a,ec!==P.current.inkColors.join()&&(ec=P.current.inkColors.join(),es=P.current.inkColors.map(g)),function(){let e=P.current.streamPath;if(!e||!e.length||(!function(e){if(e===ep)return;ep=e,eh=[],ey=[],eg=0;let t=Array.isArray(e[0])?e:[e];for(let e=0;e<t.length;e++)!function(e,t,r){if(e.length<2)return;let i=e.map(e=>({x:e.x,y:1-e.y,r:e.r??8e-4,s:e.s??1})),n=[],a=0;for(let e=1;e<i.length;e++){let t=i[e-1],r=i[e],o=Math.hypot(r.x-t.x,r.y-t.y);o<=0||(n.push({a:t,b:r,start:a,len:o,tx:(r.x-t.x)/o,ty:(r.y-t.y)/o}),a+=o)}if(!n.length)return;let l=new Float32Array(161),u=new Float32Array(161),s=[];for(let e=0;e<=n.length;e++){let t=n[Math.max(0,e-1)],r=n[Math.min(n.length-1,e)],i=t.tx+r.tx,o=t.ty+r.ty,a=Math.hypot(i,o)||1;i/=a,o/=a,s.push({tx:i,ty:o})}let c=[];for(let e=0;e<=n.length;e++){if(0===e||e===n.length){c.push(0);continue}let t=n[e-1],r=n[e],i=Math.min(.55,Math.acos(Math.min(1,Math.max(-1,t.tx*r.tx+t.ty*r.ty)))/((t.len+r.len)*.5)/20);c.push(i)}let f=0,d=e=>{for(;f<n.length-1&&e>n[f].start+n[f].len;)f++;let t=n[f],r=Math.min(1,Math.max(0,(e-t.start)/t.len)),i=s[f],o=s[f+1],a=i.tx+(o.tx-i.tx)*r,l=i.ty+(o.ty-i.ty)*r,u=Math.hypot(a,l)||1;a/=u,l/=u;let d=c[f]+(c[f+1]-c[f])*r;return{x:t.a.x+(t.b.x-t.a.x)*r,y:t.a.y+(t.b.y-t.a.y)*r,r:t.a.r+(t.b.r-t.a.r)*r,s:t.a.s+(t.b.s-t.a.s)*r,tx:a,ty:l,nx:-l,ny:a,vt:Math.max(0,-l),bend:d}};{let e=a/160,t=0;for(let r=0;r<160;r++){let i=d((r+.5)*e);t+=e/(1+o.E.phaseWarp*i.vt),l[r+1]=t,u[r]=i.bend}u[160]=0,f=0}let m=Math.max(1,Math.round(o.E.decelWindow/a*160)),v=e=>{let t=Math.min(160,Math.max(0,Math.floor(e/a*160))),r=0;for(let e=t;e<=Math.min(160,t+m);e++)u[e]>r&&(r=u[e]);return r},x=e=>{let t=Math.min(160,Math.max(0,e/a*160)),r=Math.min(159,Math.floor(t));return l[r]+(l[r+1]-l[r])*(t-r)},p=H/Math.max(K,1);eg=Math.max(eg,a);let h=.0015,y=0;for(;h<a;){let e=h,i=d(e),n=Math.hypot(i.tx*p,i.ty)||1;h+=.55*Math.sqrt(i.r)/n,y++;let a=x(e)+t,l=55e-5*(.1+.9*i.vt),u=i.s*(1-o.E.bendDim*i.bend)*(1-o.E.stagnationDim*v(e)*i.vt);eh.push({x:i.x,y:i.y,dx:i.tx*l,dy:-i.ty*l,r:i.r,s:o.E.coreStrength*u,w:.55,layer:0,pid:r,prog:e,nx:i.nx,ny:i.ny,ph:a,vt:i.vt}),eh.push({x:i.x,y:i.y,dx:i.tx*l,dy:-i.ty*l,r:i.r*(o.E.haloWidth-.8*i.bend),s:o.E.haloStrength*u,layer:1,pid:r,prog:e,nx:i.nx,ny:i.ny,ph:a,vt:i.vt});let s=1-Math.min(.3,.55*i.bend);y%3==0&&s>.05&&eh.push({x:i.x,y:i.y,dx:i.tx*l,dy:-i.ty*l,r:i.r*o.E.mistWidth,s:o.E.haloStrength*u*o.E.mistStrength*s,layer:2,pid:r,prog:e,nx:i.nx,ny:i.ny,ph:a,vt:i.vt})}f=0;let g=Math.max(2,Math.round(a/.09));for(let e=0;e<g;e++){let r=(e+.5)/g*a,i=d(r),n=x(r)+t,l=o.E.flowMag*(.06+i.vt*o.E.jetSpeed)*Math.max(.05,1-o.E.bendDecel*v(r));ey.push({x:i.x,y:i.y,dx:i.tx*l,dy:-i.ty*l,r:.001,prog:r,nx:i.nx,ny:i.ny,ph:n,vt:i.vt})}}(t[e],.61*e,e);!function(){let e=H/Math.max(K,1);for(let t=0;t<3;t++){let r=[];for(let e=0;e<eh.length;e++)eh[e].layer===t&&r.push(e);let i=r.length;if(i<4)continue;let n=new Float64Array(i),o=new Float64Array(i).fill(1);for(let e=0;e<i;e++)n[e]=eh[r[e]].s??0;let a=(t,a)=>{let l=eh[r[t]],u=0;for(let t=0;t<i;t++){let i=eh[r[t]],s=(l.x-i.x)*e,c=l.y-i.y,f=(s*s+c*c)/i.r;f<9&&(u+=n[t]*(a?o[t]:1)*Math.exp(-f))}return u},l=[];for(let e=0;e<i;e++)n[e]>1e-6&&l.push(a(e,!1)/n[e]);if(!l.length)continue;l.sort((e,t)=>e-t);let u=l[Math.floor(l.length/2)];if(u>0){for(let e=0;e<8;e++)for(let e=0;e<i;e++){let t=a(e,!0),r=n[e]*u;t>1e-9&&r>0&&(o[e]=Math.min(2,Math.max(.2,o[e]*(r/t)**.7)))}for(let e=0;e<i;e++)eh[r[e]].s=n[e]*o[e]}}}()}(e),!eh.length))return;let t=.001*performance.now();eT<0&&(eT=t);let r=Math.min(1,(t-eT)/2.4),i=r>=1?1/0:r*r*(3-2*r)*1.25*eg,n=5e-5*performance.now()%1*es.length,a=Math.floor(n)%es.length,l=(a+1)%es.length,u=n-Math.floor(n),s=es[a],c=es[l],f=s[0]+(c[0]-s[0])*u,d=s[1]+(c[1]-s[1])*u,m=s[2]+(c[2]-s[2])*u,v=f+(1-f)*.55,x=d+(1-d)*.55,p=m+(1-m)*.55;for(let e of eh){let r=i-(e.prog??0);if(r<=0)continue;let n=Math.min(1,r/.06),a=e.ph??0,l=e.vt??0,u=.5*Math.sin(2.1*t-9.3*a)+.3*Math.sin(1.1*t-17.9*a+2.1)+.2*Math.sin(3.4*t-5.1*a+4),s=Math.sin(.23*t+2.4*a)*Math.sin(.11*t+1.3),c=o.E,h=1-(c.gustDepth-c.gustDepth*s)*(.35+.65*l)*c.wildness,y=Math.min(1,(c.waveAmpBase+(1-c.waveAmpBase)*l)*c.wildness),g=u*(c.meanderBase+l*l*c.meanderVt)*c.wildness,T=.8+c.streakAmp*c.wildness*Math.sin(t*c.streakFreq-26*a+2.4*u),E=(1-.3*y+.6*y*(.5+.5*u))*h*(1+l*(T-1)),w=(e.s??.1)*E*(.9+.2*Math.random())*n,b=e.x+(e.nx??0)*g,R=e.y+(e.ny??0)*g,M=e.r*(1-o.E.widthBreath*u*y);e.w?eA(!0,b,R,M,v*w,x*w,p*w):eA(!0,b,R,M,f*w,d*w,m*w)}if(eM(),o.E.flowMag>0){for(let e of ey){if((e.prog??0)>i)continue;let r=e.ph??0,n=e.vt??0,a=(Math.sin(1.37*t-9.3*r)*o.E.swayAmp+Math.sin(.53*t-6.7*r+.8)*o.E.swayAmp2)*(.25+3.25*n*n),l=1+Math.max(0,Math.sin(.31*t-3.1*r))**3*o.E.surgeAmp,u=(e.dx+(e.nx??0)*a*o.E.flowMag)*l,s=(e.dy-(e.ny??0)*a*o.E.flowMag)*l;eA(!1,e.x,e.y,e.r,u*o.E.splatForce,-s*o.E.splatForce,0)}eM()}en=1}();for(X.disable(X.BLEND);ei.length;){let r=ei.shift();!function(r,i,n,a,l=.0035,u,s=0){let c=H/Math.max(K,1);X.useProgram($.splat),X.uniform1f(O($.splat,"uAspect"),c),X.uniform2f(O($.splat,"uPoint"),r,i),X.uniform1f(O($.splat,"uRadius"),l),X.activeTexture(X.TEXTURE0),X.bindTexture(X.TEXTURE_2D,e.read.tex),X.uniform1i(O($.splat,"uTarget"),0),X.uniform3f(O($.splat,"uColor"),n*o.E.cursorForce,-a*o.E.cursorForce,0),er(e.write),e.swap();let f=5e-5*performance.now()%1*es.length,d=Math.floor(f)%es.length,m=(d+1)%es.length,v=f-Math.floor(f),x=es[d],p=es[m],h=Math.min(40*Math.hypot(n,a),1),y=u??.1+.45*h,g=x[0]+(p[0]-x[0])*v,T=x[1]+(p[1]-x[1])*v,E=x[2]+(p[2]-x[2])*v;s>0&&(g+=(1-g)*s,T+=(1-T)*s,E+=(1-E)*s),X.bindTexture(X.TEXTURE_2D,t.read.tex),X.uniform3f(O($.splat,"uColor"),g*y,T*y,E*y),er(t.write),t.swap(),en=1}(r.x,r.y,r.dx,r.dy,r.r,r.s,r.w)}let d=e.read.texelX,m=e.read.texelY;X.useProgram($.curl),X.uniform2f(O($.curl,"uTexel"),d,m),X.activeTexture(X.TEXTURE0),X.bindTexture(X.TEXTURE_2D,e.read.tex),X.uniform1i(O($.curl,"uVelocity"),0),er(i),X.useProgram($.vorticity),X.uniform2f(O($.vorticity,"uTexel"),d,m),X.uniform1f(O($.vorticity,"uCurlStrength"),o.E.curlStrength),X.uniform1f(O($.vorticity,"uDt"),f),X.activeTexture(X.TEXTURE0),X.bindTexture(X.TEXTURE_2D,e.read.tex),X.uniform1i(O($.vorticity,"uVelocity"),0),X.activeTexture(X.TEXTURE1),X.bindTexture(X.TEXTURE_2D,i.tex),X.uniform1i(O($.vorticity,"uCurl"),1),er(e.write),e.swap(),X.useProgram($.divergence),X.uniform2f(O($.divergence,"uTexel"),d,m),X.activeTexture(X.TEXTURE0),X.bindTexture(X.TEXTURE_2D,e.read.tex),X.uniform1i(O($.divergence,"uVelocity"),0),er(r),X.useProgram($.pressure),X.uniform2f(O($.pressure,"uTexel"),d,m),X.activeTexture(X.TEXTURE1),X.bindTexture(X.TEXTURE_2D,r.tex),X.uniform1i(O($.pressure,"uDivergence"),1);for(let e=0;e<6;e++)X.activeTexture(X.TEXTURE0),X.bindTexture(X.TEXTURE_2D,n.read.tex),X.uniform1i(O($.pressure,"uPressure"),0),er(n.write),n.swap();if(X.useProgram($.gradient),X.uniform2f(O($.gradient,"uTexel"),d,m),X.activeTexture(X.TEXTURE0),X.bindTexture(X.TEXTURE_2D,n.read.tex),X.uniform1i(O($.gradient,"uPressure"),0),X.activeTexture(X.TEXTURE1),X.bindTexture(X.TEXTURE_2D,e.read.tex),X.uniform1i(O($.gradient,"uVelocity"),1),er(e.write),e.swap(),X.useProgram($.advect),X.uniform2f(O($.advect,"uTexel"),d,m),X.uniform1f(O($.advect,"uDt"),f),X.uniform1f(O($.advect,"uDissipation"),o.E.velocityDissipation),X.activeTexture(X.TEXTURE0),X.bindTexture(X.TEXTURE_2D,e.read.tex),X.uniform1i(O($.advect,"uVelocity"),0),X.activeTexture(X.TEXTURE1),X.bindTexture(X.TEXTURE_2D,e.read.tex),X.uniform1i(O($.advect,"uSource"),1),er(e.write),e.swap(),X.uniform1f(O($.advect,"uDissipation"),o.E.dyeDissipation),X.activeTexture(X.TEXTURE0),X.bindTexture(X.TEXTURE_2D,e.read.tex),X.uniform1i(O($.advect,"uVelocity"),0),X.activeTexture(X.TEXTURE1),X.bindTexture(X.TEXTURE_2D,t.read.tex),X.uniform1i(O($.advect,"uSource"),1),er(t.write),t.swap(),l=P.current,X.viewport(0,0,F.width,F.height),X.bindFramebuffer(X.FRAMEBUFFER,null),X.clearColor(0,0,0,0),X.clear(X.COLOR_BUFFER_BIT),X.enable(X.BLEND),X.blendFunc(X.ONE,X.ONE_MINUS_SRC_ALPHA),X.useProgram($.dots),X.uniform2f(O($.dots,"uResolution"),H,K),X.uniform1f(O($.dots,"uDotSize"),2*l.dotRadius),X.uniform1f(O($.dots,"uDpr"),B),X.uniform1f(O($.dots,"uDisplace"),o.E.displace),u=g(l.gradientFrom),s=g(l.gradientTo),X.uniform4f(O($.dots,"uColorA"),u[0],u[1],u[2],u[3]),X.uniform4f(O($.dots,"uColorB"),s[0],s[1],s[2],s[3]),X.activeTexture(X.TEXTURE0),X.bindTexture(X.TEXTURE_2D,e.read.tex),X.uniform1i(O($.dots,"uVelocity"),0),X.activeTexture(X.TEXTURE1),X.bindTexture(X.TEXTURE_2D,t.read.tex),X.uniform1i(O($.dots,"uDye"),1),X.bindVertexArray(Z),X.drawArrays(X.POINTS,0,Q),X.bindVertexArray(null),(en*=.99)<.003&&0===ei.length){eo=!0;return}el=requestAnimationFrame(ef)}function ed(){eo&&(eo=!1,eu=performance.now(),el=requestAnimationFrame(ef))}let em={x:0,y:0,init:!1};function ev(e){let t=F.getBoundingClientRect();if(t.bottom<0||t.top>window.innerHeight)return;let r=(e.clientX-t.left)/t.width,i=1-(e.clientY-t.top)/t.height;if(r<0||r>1||i<0||i>1){em.init=!1;return}if(!em.init){em.x=r,em.y=i,em.init=!0;return}let n=r-em.x,o=i-em.y,a=Math.hypot(n,o);if(a<1e-4)return;if(a>.1){em.x=r,em.y=i;return}let l=Math.min(Math.ceil(a/.012),6);for(let e=1;e<=l;e++){let t=e/l;ei.push({x:em.x+n*t,y:em.y+o*t,dx:n/l,dy:o/l})}ei.length>24&&ei.splice(0,ei.length-24),em.x=r,em.y=i,en=1,ed()}function ex(){em.init=!1}let ep=null,eh=[],ey=[],eg=0,eT=-1,eE=new Float32Array(192),ew=new Float32Array(192),eb=0,eR=!0;function eM(){if(!eb)return;let r=eR?t:e;X.disable(X.BLEND),X.useProgram($.multiSplat),X.uniform1f(O($.multiSplat,"uAspect"),H/Math.max(K,1)),X.uniform1i(O($.multiSplat,"uCount"),eb),X.uniform4fv(O($.multiSplat,"uPos"),eE),X.uniform4fv(O($.multiSplat,"uCol"),ew),X.activeTexture(X.TEXTURE0),X.bindTexture(X.TEXTURE_2D,r.read.tex),X.uniform1i(O($.multiSplat,"uTarget"),0),er(r.write),r.swap(),eb=0}function eA(e,t,r,i,n,o,a){(48===eb||eR!==e)&&eM(),eR=e;let l=4*eb;eE[l]=t,eE[l+1]=r,eE[l+2]=i,ew[l]=n,ew[l+1]=o,ew[l+2]=a,eb++}function eU(){let o,a=F.parentElement.getBoundingClientRect();H=Math.max(a.width,1),K=Math.max(a.height,1),F.width=Math.round(H*B),F.height=Math.round(K*B),F.style.width=`${H}px`,F.style.height=`${K}px`,e&&(ee(e.read),ee(e.write),ee(t.read),ee(t.write),ee(r),ee(i),ee(n.read),ee(n.write)),W=Math.round(116*Math.max(o=H/Math.max(K,1),1)),z=Math.round(116*Math.max(1/o,1)),Y=Math.round(256*Math.max(o,1)),q=Math.round(256*Math.max(1/o,1)),e=G(W,z,X.RG16F,X.RG,X.LINEAR),t=G(Y,q,X.RGBA16F,X.RGBA,X.LINEAR),r=j(W,z,X.R16F,X.RED,X.NEAREST),i=j(W,z,X.R16F,X.RED,X.NEAREST),n=G(W,z,X.R16F,X.RED,X.NEAREST),et(),en=1,ed()}function eD(){clearTimeout(a),a=setTimeout(eU,120)}_.current=()=>{H>0&&K>0&&(et(),en=1,ed())},k.current=ed;let eF=new IntersectionObserver(([e])=>{(ea=e.isIntersecting)&&(eu=performance.now(),ed())});eF.observe(F);try{eU()}catch{return F.removeEventListener("webglcontextlost",I),X.getExtension("WEBGL_lose_context")?.loseContext(),F.remove(),U(),()=>clearTimeout(R)}return S.current=0,window.addEventListener("resize",eD),window.addEventListener("pointermove",ev,{passive:!0}),window.addEventListener("scroll",ex,{passive:!0}),el=requestAnimationFrame(ef),()=>{M=!0,cancelAnimationFrame(el),clearTimeout(a),clearTimeout(R),eF.disconnect(),window.removeEventListener("resize",eD),window.removeEventListener("pointermove",ev),window.removeEventListener("scroll",ex),F.removeEventListener("webglcontextlost",I),X.getExtension("WEBGL_lose_context")?.loseContext(),F.remove(),_.current=null,k.current=null}},[F]),(0,n.useEffect)(()=>{_.current?.()},[e,t,w,b,R]);let X=`${r}|${a}|${T.join()}`;return((0,n.useEffect)(()=>{k.current?.()},[X]),(0,n.useEffect)(()=>{M&&k.current?.()},[M]),U)?(0,i.jsx)(l,{dotRadius:e,dotSpacing:t,gradientFrom:r,gradientTo:a,glowColor:"transparent",glowRadius:0,fadeBottom:w,fadeTop:b,fadeTopOffset:R}):(0,i.jsx)("div",{ref:A,className:"relative h-full w-full"})});w.displayName="FluidDotField"},93022:(e,t,r)=>{r.d(t,{Ie:()=>n,PF:()=>o,lv:()=>a,pC:()=>i});let i="/docs/blocks/tools/bento-builder",n="Bento Builder",o="Tools",a=[{title:n,url:i,isNew:!0}]},98359:(e,t,r)=>{r.d(t,{SW:()=>c,UC:()=>v,bs:()=>m,dj:()=>u,hp:()=>d,z4:()=>s});var i=r(18543),n=r(18893),o=r(82786),a=r(93022),l=r(56191);function u(e=[]){return e.includes("text")?"Text":e.includes("cursor")?"Cursor Effects":e.includes("background")?"Backgrounds":e.includes("shader")||e.includes("3d")||e.includes("webgl")||e.includes("particles")?"3D & Shaders":"UI & Cards"}let s=["Text","Backgrounds","3D & Shaders","Cursor Effects","UI & Cards"],c=["AI & Agents","Navigation","Data","Forms","Overlays","Auth & Onboarding","Workflows"];function f(e){return e.filter(e=>!e.hidden).reduce((e,t)=>e+(t.variants?.length??0),0)}let d=[{id:"getting-started",title:"Get Started",items:[{title:"Introduction",url:"/docs/introduction"},{title:"Installation",url:"/docs/installation"},{title:"MCP Server",url:"/docs/mcp"}]},{id:"components",title:"Components",routePrefix:"/docs/components",browseUrl:"/docs/components",browseNewCount:l.xw,groups:function(){let e=new Map;for(let t of i.f5){if(t.hidden)continue;let r=u(t.tags),i=e.get(r)??[];i.push({title:t.name,url:`/docs/components/${t.slug}`,...t.isNew&&{isNew:!0}}),e.set(r,i)}return s.filter(t=>e.has(t)).map(t=>({title:t,items:e.get(t).sort((e,t)=>e.title.localeCompare(t.title))}))}()},{id:"blocks",title:"Blocks",routePrefix:"/docs/blocks",browseUrl:"/docs/blocks",browseNewCount:l.BZ,totalCount:f(i.Bz),items:i.Bz.filter(e=>!e.hidden).map(e=>{let t=e.newCount??e.variants?.filter(e=>e.isNew).length??0;return{title:e.name,url:`/docs/blocks/${e.slug}`,count:e.variants?.length??0,...t&&{newCount:t}}}),hideGroupCounts:!0,groups:[{title:a.PF,items:a.lv,pinned:!0}]},{id:"app-ui",title:"Application UI",routePrefix:"/docs/app-ui",browseUrl:"/docs/app-ui",totalCount:f(i.un),hideGroupCounts:!0,items:[{title:"Theming",url:"/docs/app-ui/theming"}],groups:function(){let e=new Map;for(let t of i.un){if(t.hidden)continue;let r=t.category??"Workflows",i=e.get(r)??[];i.push({title:t.name,url:`/docs/app-ui/${t.slug}`,count:t.variants?.length??0,...t.newCount&&{newCount:t.newCount}}),e.set(r,i)}return[...c.filter(t=>e.has(t)),...[...e.keys()].filter(e=>!c.includes(e))].map(t=>({title:t,items:e.get(t)}))}()},{id:"templates",title:"Templates",routePrefix:"/docs/templates",browseUrl:"/docs/templates",browseNewCount:l._I,items:i.IT.map(e=>({title:e.name,url:`/docs/templates/${e.slug}`,...e.isNew&&{isNew:!0},...e.isFree&&{isFree:!0}}))},{id:"agent-kit",title:o.SU,routePrefix:o.$t,browseUrl:o.$t,browseLabel:"Everything",hideGroupCounts:!0,groups:function(){let e=[{title:"Setup",items:[{title:o.ii.name,url:o.ii.href}]}];for(let{kind:t,title:r}of[{kind:"skill",title:"Design Skills"},{kind:"prompt",title:"Prompts"},{kind:"recipe",title:"Recipes"}]){let i=n.K_.filter(e=>e.kind===t).map(e=>({title:e.name,url:`${o.$t}/${n.b4[t]}/${e.slug}`}));i.length&&e.push({title:r,items:i})}return e}()}];function m(e){let t=d.find(t=>t.id===e);return t?t.items?t.items.map(e=>({name:e.title,url:e.url})):(t.groups??[]).flatMap(e=>e.items.map(t=>({name:t.title,url:t.url,group:e.title}))):[]}(d.find(e=>"Components"===e.title)?.groups??[]).flatMap(e=>e.items.map(t=>({name:t.title,slug:t.url.split("/").pop()??"",group:e.title})));let v=d.flatMap(e=>[...(e.items??[]).map(t=>({...t,section:e.title})),...(e.groups??[]).flatMap(t=>t.items.map(r=>({...r,section:e.title,group:t.title})))])}}]);