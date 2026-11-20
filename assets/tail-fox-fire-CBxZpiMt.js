//# allFunctionsCalledOnLoad
import{B as e,Bn as t,K as n,O as r,P as i,Q as a,St as o,Tt as s,Xn as c,Z as l,c as u,ft as d,kt as f,nn as p,v as m,wr as h,wt as g}from"./three.core-DVTiNhEy.js";import"./src-BIhDzOTA.js";import{o as _}from"./src-BI6MMqKu.js";import{t as v}from"./after-frame-BGEZeqzD.js";var y=9,b={high:360,low:180},x={high:120,low:60},S=new m(_(`red`)),C=new m(_(`orange`)),w=new m(_(`yellow/1`)),T=new m(_(`white`)).lerp(w,.6),E=64;function D(){let e=E,t=new Uint8Array(16384),n=new Float32Array(4096);for(let[t,r,i]of[[4,.55,3107613],[8,.3,5350343],[16,.15,10363457]]){let a=new Float32Array(t*t),o=i;for(let e=0;e<a.length;e++)o=o*1664525+1013904223>>>0,a[e]=o/4294967296;let s=(e,n)=>a[n%t*t+e%t];for(let i=0;i<e;i++)for(let a=0;a<e;a++){let o=a/e*t,c=i/e*t,l=Math.floor(o),u=Math.floor(c),d=(o-l)*(o-l)*(3-2*(o-l)),f=(c-u)*(c-u)*(3-2*(c-u)),p=s(l,u)+(s(l+1,u)-s(l,u))*d,m=s(l,u+1)+(s(l+1,u+1)-s(l,u+1))*d;n[i*e+a]=n[i*e+a]+(p+(m-p)*f)*r}}let r=1/0,i=-1/0;for(let e of n)r=Math.min(r,e),i=Math.max(i,e);for(let e=0;e<n.length;e++){let a=Math.round((n[e]-r)/(i-r)*255),o=e*4;t[o]=a,t[o+1]=a,t[o+2]=a,t[o+3]=255}return t}var O=null;function k(){O??=D();let e=new r(O,E,E,p);return e.wrapS=e.wrapT=t,e.magFilter=e.minFilter=d,e.needsUpdate=!0,e}var A=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  attribute vec3 fireAnchor;
  attribute vec3 fireAim;
  attribute vec4 fireShape;
  uniform float fireStretch;
  uniform float fireAspect;
  varying vec2 vFireUv;
  varying vec4 vFireShape;
  void main() {
    vFireUv = uv;
    vFireShape = fireShape;
    vec4 centre = modelViewMatrix * vec4(fireAnchor, 1.0);
    vec3 velocity = (modelViewMatrix * vec4(fireAim, 0.0)).xyz;
    float speed = length(velocity.xy);
    vec2 along = speed > 0.00001 ? velocity.xy / speed : vec2(0.0, 1.0);
    vec2 across = vec2(along.y, -along.x);
    float size = fireShape.x * length(modelViewMatrix[0].xyz);
    // The streak trails behind the motion; its head stays on the particle.
    float stretch = fireAspect + min(speed * fireStretch / max(size, 0.00001), 3.0);
    centre.xy += (across * position.x + along * (position.y * stretch - (stretch - 1.0) * 0.5)) * size;
    gl_Position = projectionMatrix * centre;
    #include <logdepthbuf_vertex>
  }
`,j=`
  #include <common>
  #include <logdepthbuf_pars_fragment>
  uniform sampler2D fireNoise;
  uniform float fireTime;
  uniform float fireKeep;
  uniform vec3 fireRed;
  uniform vec3 fireOrange;
  uniform vec3 fireYellow;
  uniform vec3 fireHot;
  varying vec2 vFireUv;
  varying vec4 vFireShape;
  vec3 fireColour(float temperature) {
    vec3 colour = mix(fireRed * 0.45, fireRed, smoothstep(0.04, 0.28, temperature));
    colour = mix(colour, fireOrange, smoothstep(0.24, 0.55, temperature));
    colour = mix(colour, fireYellow, smoothstep(0.52, 0.82, temperature));
    return mix(colour, fireHot, smoothstep(0.80, 1.0, temperature));
  }
  float fireNoise1(vec2 p) { return texture2D(fireNoise, p * 0.25).r * 2.0 - 1.0; }
  float fireFbm(vec2 p) {
    mat2 turn = mat2(1.6, 1.2, -1.2, 1.6);
    float f = 0.5 * fireNoise1(p); p = turn * p;
    f += 0.25 * fireNoise1(p); p = turn * p;
    f += 0.125 * fireNoise1(p); p = turn * p;
    f += 0.0625 * fireNoise1(p);
    return 0.5 + 0.5 * f;
  }
  void main() {
    float age = vFireShape.y, seed = vFireShape.z, heat = vFireShape.w;
    vec2 p = vFireUv * 2.0 - 1.0;
    float radius = length(p);
    float soft = 1.0 - smoothstep(0.10, 1.0, radius);
    #ifdef FIRE_FLAME
      float grain = smoothstep(0.28, 0.72, fireFbm(vFireUv * 2.4 + vec2(seed, seed * 1.7 - fireTime * 2.2)));
      float alpha = clamp(soft * 1.9 - (1.0 - grain) * (1.05 + age * 0.9), 0.0, 1.0);
      float temperature = clamp(heat * (1.0 - age * 0.95) * (0.35 + 0.45 * soft) + grain * 0.14, 0.0, 1.0);
      alpha *= smoothstep(0.0, 0.07, age) * (1.0 - smoothstep(0.45, 1.0, age));
    #else
      float flicker = 0.72 + 0.28 * sin(fireTime * 29.0 + seed * 17.0);
      float alpha = soft * soft * flicker;
      float temperature = clamp(heat * (1.0 - age * 0.80) * (0.70 + 0.30 * soft), 0.0, 1.0);
      alpha *= smoothstep(0.0, 0.05, age) * (1.0 - smoothstep(0.62, 1.0, age));
    #endif
    // A cooled edge fades before it reddens: on a bright sky it read as pink.
    alpha *= smoothstep(0.06, 0.30, temperature);
    if (alpha < 0.004) discard;
    #include <logdepthbuf_fragment>
    gl_FragColor = vec4(fireColour(temperature) * (1.0 + temperature * 0.25), 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    // Part of the light adds to the background: the fire glows but does not turn white on a bright sky.
    gl_FragColor = vec4(gl_FragColor.rgb * alpha, alpha * fireKeep);
  }
`;function M(t,n,r,o,u=`Fox`){let d=new a;d.setAttribute(`position`,new e([-.5,-.5,0,.5,-.5,0,-.5,.5,0,.5,.5,0],3)),d.setAttribute(`uv`,new e([0,0,1,0,0,1,1,1],2)),d.setIndex([0,1,2,2,1,3]);let f=e=>new l(new Float32Array(n*e),e).setUsage(i),p=f(3),m=f(3),h=f(4);d.setAttribute(`fireAnchor`,p),d.setAttribute(`fireAim`,m),d.setAttribute(`fireShape`,h),d.instanceCount=0;let g=t===`flame`,_=new c({name:g?`${u}_Flame`:`${u}_Ember`,defines:g?{FIRE_FLAME:1}:{},vertexShader:A,fragmentShader:j,uniforms:{fireNoise:{value:r},fireTime:o,fireStretch:{value:g?.06:.1},fireAspect:{value:g?1.6:1},fireKeep:{value:g?.8:.55},fireRed:{value:S},fireOrange:{value:C},fireYellow:{value:w},fireHot:{value:T}},transparent:!0,depthWrite:!1,side:2,forceSinglePass:!0,blending:5,blendEquation:100,blendSrc:201,blendDst:205}),v=new s(d,_);return v.name=g?`${u}_Flames`:`${u}_Embers`,v.frustumCulled=!1,v.renderOrder=g?4:5,{mesh:v,geometry:d,anchors:p,aims:m,shapes:h,material:_}}function N(e,t,n,r){let i=new f({color:16777215,vertexColors:!0});return i.name=`Fox_Ember_Surface`,i.customProgramCacheKey=()=>`fox-ember-surface-v2`,i.onBeforeCompile=i=>{i.uniforms.foxTime=t,i.uniforms.foxFlames=n,i.uniforms.foxNoise={value:e},i.uniforms.foxScale={value:1/r},i.vertexShader=`attribute float _fox_glow;
      attribute float _fox_t;
      attribute float _fox_tail;
      uniform float foxScale;
      varying vec3 vFoxHeat;
      varying vec3 vFoxRest;
      ${i.vertexShader}`.replace(`#include <begin_vertex>`,`#include <begin_vertex>
        vFoxHeat = vec3(_fox_glow, _fox_t, _fox_tail);
        vFoxRest = position * foxScale;`),i.fragmentShader=`uniform float foxTime;
      uniform float foxFlames;
      uniform sampler2D foxNoise;
      varying vec3 vFoxHeat;
      varying vec3 vFoxRest;
      ${i.fragmentShader}`.replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
        vec2 flowA = vec2(vFoxHeat.y * 2.3 - foxTime * 0.62, dot(vFoxRest, vec3(0.71, 0.0, 0.71)) * 1.7 + vFoxHeat.z * 0.37);
        vec2 flowB = vec2(vFoxHeat.y * 4.9 - foxTime * 1.25, dot(vFoxRest, vec3(-0.45, 0.62, 0.64)) * 2.6 + vFoxHeat.z * 0.71);
        float flowNoise = texture2D(foxNoise, flowA).r * 0.6 + texture2D(foxNoise, flowB).r * 0.4;
        float flow = smoothstep(0.42, 0.90, flowNoise) * foxFlames;
        float rim = pow(1.0 - abs(dot(normal, normalize(vViewPosition))), 2.2) * foxFlames;
        float glow = clamp(vFoxHeat.x, 0.0, 1.0);
        vec3 hot = vec3(1.0, 0.80, 0.40);
        diffuseColor.rgb *= 0.82;
        totalEmissiveRadiance += mix(vColor.rgb, hot, flow * 0.55) * (0.10 + glow * (0.40 + flow * 1.05))
          + hot * rim * (0.20 + glow * 0.45);`)},i}function P(e){let t=e.geometry.getAttribute(`_fox_tail`),n=e.geometry.getAttribute(`_fox_t`),r=Array.from({length:y},()=>new Map);for(let e=0;e<t.count;e++){let i=Math.round(t.getX(e)),a=n.getX(e);if(!Number.isFinite(i)||i<0||i>=y||!Number.isFinite(a))continue;let o=Math.round(a*1e5),s=r[i].get(o);s?s.push(e):r[i].set(o,[e])}return r.map(e=>[...e.entries()].filter(([,e])=>e.length>=12).sort(([e],[t])=>e-t).map(([,e])=>e))}var F=new WeakMap;function I(e){let t=F.get(e.geometry);if(t!==void 0)return t;let n=e.geometry.getAttribute(`position`),r=e.geometry.getAttribute(`_fox_tail`),i=e.geometry.getAttribute(`_fox_t`),a=e.geometry.getAttribute(`_fox_glow`);if(!n||!r||!i||!a||r.count!==n.count||i.count!==n.count||a.count!==n.count)throw Error(`Fox fire requires matching position, _fox_tail, _fox_t and _fox_glow attributes.`);let s=new u().setFromBufferAttribute(n).getSize(new h).length()/3;if(!(s>0)||!Number.isFinite(s))throw Error(`Fox fire requires a finite tail mesh.`);let c=P(e);c.forEach((e,t)=>{if(e.length<4)throw Error(`Fox fire cannot find tail ${t+1}.`)});let l=new h,d=new h,f=(e,t)=>{l.fromBufferAttribute(n,e);let r=t[0],i=1/0;for(let e of t){let t=d.fromBufferAttribute(n,e).distanceToSquared(l);t<i&&(i=t,r=e)}return r},p=[],m=[];for(let e of c)for(let t=0;t<e.length;t++){let n=t+2<e.length,r=e[n?t+2:t-2];for(let s of e[t]){let e=i.getX(s);e<.08||(p.push({vertex:s,partner:f(s,r),sign:n?1:-1,t:e}),m.push(.3+e*e*1.2+o.clamp(a.getX(s),0,1)*.3))}}let g=new Float32Array(m.length);m.reduce((e,t,n)=>g[n]=e+t,0);let _={unit:s,samples:p,cumulative:g,total:g[g.length-1]};return F.set(e.geometry,_),_}async function L(e){await v(),I(e),await v(),O??=D(),await v()}function R(e){let{unit:t,samples:r,cumulative:i,total:a}=I(e),s=1831565813,c=()=>(s^=s<<13,s^=s>>>17,s^=s<<5,(s>>>0)/4294967296),l=()=>{let e=c()*a,t=0,n=i.length-1;for(;t<n;){let r=t+n>>1;i[r]<e?t=r+1:n=r}return r[t]},u=new n;u.name=`Fox_Fire`;let d=k(),f={value:0},p={value:1},m=N(d,f,p,t),_=M(`flame`,b.high,d,f),v=M(`ember`,x.high,d,f);u.add(_.mesh,v.mesh);let y=new g,S=new h,C=new h,w=new h,T=new h,E=new h,D=new h,O=1;function A(){u.updateWorldMatrix(!0,!1),y.copy(u.matrixWorld).invert(),S.set(0,1,0).transformDirection(y),C.set(1,0,0).transformDirection(y).addScaledVector(S,-C.dot(S)).normalize(),w.crossVectors(C,S),y.multiply(e.matrixWorld),O=y.getMaxScaleOnAxis()}function j(t,n){return e.getVertexPosition(t,n).applyMatrix4(y)}let P=(e,t)=>t===0?e.x:t===1?e.y:e.z,F=(e,t,n)=>({layer:e,capacity:t,count:0,ember:n,position:new Float32Array(t*3),velocity:new Float32Array(t*3),age:new Float32Array(t).fill(-1),life:new Float32Array(t).fill(1),size:new Float32Array(t),seed:new Float32Array(t),heat:new Float32Array(t)}),L=[F(_,b.high,!1),F(v,x.high,!0)];function R(e,n,r){let i=l();j(i.vertex,T),j(i.partner,E),D.subVectors(E,T).multiplyScalar(i.sign),D.lengthSq()>1e-12?D.normalize():D.copy(S);let a=t*O,o=(c()-.5)*2,s=(c()-.5)*2,u=e.ember?.9+c()*.7:.6+c()*.4,d=e.ember?.45:.3,f=e.ember?.4:.1,p=n*3;for(let t=0;t<3;t++)e.velocity[p+t]=a*(P(S,t)*u+P(D,t)*d+(P(C,t)*o+P(w,t)*s)*f),e.position[p+t]=P(T,t)+a*.035*((c()-.5)*2);e.life[n]=e.ember?.9+c()*.8:.45+c()*.35,e.size[n]=a*(e.ember?.03+c()*.022:(.22+c()*.12)*(.8+i.t*.4)),e.seed[n]=c()*10,e.heat[n]=e.ember?.85+c()*.15:.8+c()*.2,e.age[n]=0,r&&z(e,n,e.life[n]*c())}function z(e,n,r){let i=n*3,a=t*O,o=(e.ember?.35:1.4)*a,s=Math.exp(-(e.ember?.6:1.2)*r),c=(e.ember?1.6:.9)*a,l=e.seed[n],u=f.value+e.age[n],d=Math.sin(u*7.3+l*3.1)*c,p=Math.cos(u*6.1+l*5.3)*c;for(let t=0;t<3;t++)e.velocity[i+t]=(e.velocity[i+t]+(P(S,t)*o+P(C,t)*d+P(w,t)*p)*r)*s,e.position[i+t]=e.position[i+t]+e.velocity[i+t]*r;e.age[n]=e.age[n]+r}function B(e){let{anchors:t,aims:n,shapes:r}=e.layer;for(let i=0;i<e.count;i++){let a=Math.min(e.age[i]/e.life[i],1),s=i*3,c=e.ember?1:.55+.45*o.smoothstep(a,0,.12),l=e.ember?1-a*.4:1-a*.62;t.setXYZ(i,e.position[s],e.position[s+1],e.position[s+2]),n.setXYZ(i,e.velocity[s],e.velocity[s+1],e.velocity[s+2]),r.setXYZW(i,e.size[i]*c*l,a,e.seed[i],e.heat[i])}t.needsUpdate=n.needsUpdate=r.needsUpdate=!0,e.layer.geometry.instanceCount=e.count}let V=!1,H=!0;function U(e){L[0].count=b[e],L[1].count=x[e];for(let e of L)for(let t=e.count;t<e.capacity;t++)e.age[t]=-1}return U(`high`),{object:u,surface:m,update(e){if(V||!u.visible)return;let t=Number.isFinite(e)&&e>0?Math.min(e,.05):0;f.value=(f.value+t)%1e3,A();for(let e of L){for(let n=0;n<e.count;n++)e.age[n]<0?R(e,n,H):t>0&&(z(e,n,t),e.age[n]>=e.life[n]&&R(e,n,!1));B(e)}H=!1},setQuality(e){V||U(e)},setVisible(e){if(!(V||u.visible===e)&&(u.visible=e,p.value=+!!e,e)){for(let e of L)e.age.fill(-1);H=!0}},dispose(){if(!V){V=!0,u.visible=!1,u.removeFromParent(),u.clear();for(let e of[_,v])e.geometry.dispose(),e.material.dispose();m.dispose(),d.dispose()}}}}export{L as i,M as n,k as r,R as t};