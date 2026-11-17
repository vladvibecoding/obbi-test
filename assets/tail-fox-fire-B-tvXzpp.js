//# allFunctionsCalledOnLoad
import{B as e,Bn as t,K as n,O as r,P as i,Q as a,St as o,Tt as s,Xn as c,Z as l,c as u,ft as d,kt as f,nn as p,v as m,wr as h,wt as g}from"./three.core-DVTiNhEy.js";import{o as _}from"./src-BI6MMqKu.js";var v=9,y={high:360,low:180},b={high:120,low:60},x=new m(_(`red`)),S=new m(_(`orange`)),C=new m(_(`yellow/1`)),w=new m(_(`white`)).lerp(C,.6);function T(){let e=new Uint8Array(16384),n=new Float32Array(4096);for(let[e,t,r]of[[4,.55,3107613],[8,.3,5350343],[16,.15,10363457]]){let i=new Float32Array(e*e),a=r;for(let e=0;e<i.length;e++)a=a*1664525+1013904223>>>0,i[e]=a/4294967296;let o=(t,n)=>i[n%e*e+t%e];for(let r=0;r<64;r++)for(let i=0;i<64;i++){let a=i/64*e,s=r/64*e,c=Math.floor(a),l=Math.floor(s),u=(a-c)*(a-c)*(3-2*(a-c)),d=(s-l)*(s-l)*(3-2*(s-l)),f=o(c,l)+(o(c+1,l)-o(c,l))*u,p=o(c,l+1)+(o(c+1,l+1)-o(c,l+1))*u;n[r*64+i]=n[r*64+i]+(f+(p-f)*d)*t}}let i=1/0,a=-1/0;for(let e of n)i=Math.min(i,e),a=Math.max(a,e);for(let t=0;t<n.length;t++){let r=Math.round((n[t]-i)/(a-i)*255);e.set([r,r,r,255],t*4)}let o=new r(e,64,64,p);return o.wrapS=o.wrapT=t,o.magFilter=o.minFilter=d,o.needsUpdate=!0,o}var E=`
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
`,D=`
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
`;function O(t,n,r,o,u=`Fox`){let d=new a;d.setAttribute(`position`,new e([-.5,-.5,0,.5,-.5,0,-.5,.5,0,.5,.5,0],3)),d.setAttribute(`uv`,new e([0,0,1,0,0,1,1,1],2)),d.setIndex([0,1,2,2,1,3]);let f=e=>new l(new Float32Array(n*e),e).setUsage(i),p=f(3),m=f(3),h=f(4);d.setAttribute(`fireAnchor`,p),d.setAttribute(`fireAim`,m),d.setAttribute(`fireShape`,h),d.instanceCount=0;let g=t===`flame`,_=new c({name:g?`${u}_Flame`:`${u}_Ember`,defines:g?{FIRE_FLAME:1}:{},vertexShader:E,fragmentShader:D,uniforms:{fireNoise:{value:r},fireTime:o,fireStretch:{value:g?.06:.1},fireAspect:{value:g?1.6:1},fireKeep:{value:g?.8:.55},fireRed:{value:x},fireOrange:{value:S},fireYellow:{value:C},fireHot:{value:w}},transparent:!0,depthWrite:!1,side:2,forceSinglePass:!0,blending:5,blendEquation:100,blendSrc:201,blendDst:205}),v=new s(d,_);return v.name=g?`${u}_Flames`:`${u}_Embers`,v.frustumCulled=!1,v.renderOrder=g?4:5,{mesh:v,geometry:d,anchors:p,aims:m,shapes:h,material:_}}function k(e,t,n,r){let i=new f({color:16777215,vertexColors:!0});return i.name=`Fox_Ember_Surface`,i.customProgramCacheKey=()=>`fox-ember-surface-v2`,i.onBeforeCompile=i=>{i.uniforms.foxTime=t,i.uniforms.foxFlames=n,i.uniforms.foxNoise={value:e},i.uniforms.foxScale={value:1/r},i.vertexShader=`attribute float _fox_glow;
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
          + hot * rim * (0.20 + glow * 0.45);`)},i}function A(e){let t=e.geometry.getAttribute(`_fox_tail`),n=e.geometry.getAttribute(`_fox_t`),r=Array.from({length:v},()=>new Map);for(let e=0;e<t.count;e++){let i=Math.round(t.getX(e)),a=n.getX(e);if(!Number.isFinite(i)||i<0||i>=v||!Number.isFinite(a))continue;let o=Math.round(a*1e5),s=r[i].get(o);s?s.push(e):r[i].set(o,[e])}return r.map(e=>[...e.entries()].filter(([,e])=>e.length>=12).sort(([e],[t])=>e-t).map(([,e])=>e))}function j(e){let t=e.geometry.getAttribute(`position`),r=e.geometry.getAttribute(`_fox_tail`),i=e.geometry.getAttribute(`_fox_t`),a=e.geometry.getAttribute(`_fox_glow`);if(!t||!r||!i||!a||r.count!==t.count||i.count!==t.count||a.count!==t.count)throw Error(`Fox fire requires matching position, _fox_tail, _fox_t and _fox_glow attributes.`);let s=new u().setFromBufferAttribute(t).getSize(new h).length()/3;if(!(s>0)||!Number.isFinite(s))throw Error(`Fox fire requires a finite tail mesh.`);let c=A(e);c.forEach((e,t)=>{if(e.length<4)throw Error(`Fox fire cannot find tail ${t+1}.`)});let l=1831565813,d=()=>(l^=l<<13,l^=l>>>17,l^=l<<5,(l>>>0)/4294967296),f=new h,p=new h,m=(e,n)=>{f.fromBufferAttribute(t,e);let r=n[0],i=1/0;for(let e of n){let n=p.fromBufferAttribute(t,e).distanceToSquared(f);n<i&&(i=n,r=e)}return r},_=[],v=[];for(let e of c)for(let t=0;t<e.length;t++){let n=t+2<e.length,r=e[n?t+2:t-2];for(let s of e[t]){let e=i.getX(s);e<.08||(_.push({vertex:s,partner:m(s,r),sign:n?1:-1,t:e}),v.push(.3+e*e*1.2+o.clamp(a.getX(s),0,1)*.3))}}let x=new Float32Array(v.length);v.reduce((e,t,n)=>x[n]=e+t,0);let S=x[x.length-1],C=()=>{let e=d()*S,t=0,n=x.length-1;for(;t<n;){let r=t+n>>1;x[r]<e?t=r+1:n=r}return _[t]},w=new n;w.name=`Fox_Fire`;let E=T(),D={value:0},j={value:1},M=k(E,D,j,s),N=O(`flame`,y.high,E,D),P=O(`ember`,b.high,E,D);w.add(N.mesh,P.mesh);let F=new g,I=new h,L=new h,R=new h,z=new h,B=new h,V=new h,H=1;function U(){w.updateWorldMatrix(!0,!1),F.copy(w.matrixWorld).invert(),I.set(0,1,0).transformDirection(F),L.set(1,0,0).transformDirection(F).addScaledVector(I,-L.dot(I)).normalize(),R.crossVectors(L,I),F.multiply(e.matrixWorld),H=F.getMaxScaleOnAxis()}function W(t,n){return e.getVertexPosition(t,n).applyMatrix4(F)}let G=(e,t)=>t===0?e.x:t===1?e.y:e.z,K=(e,t,n)=>({layer:e,capacity:t,count:0,ember:n,position:new Float32Array(t*3),velocity:new Float32Array(t*3),age:new Float32Array(t).fill(-1),life:new Float32Array(t).fill(1),size:new Float32Array(t),seed:new Float32Array(t),heat:new Float32Array(t)}),q=[K(N,y.high,!1),K(P,b.high,!0)];function J(e,t,n){let r=C();W(r.vertex,z),W(r.partner,B),V.subVectors(B,z).multiplyScalar(r.sign),V.lengthSq()>1e-12?V.normalize():V.copy(I);let i=s*H,a=(d()-.5)*2,o=(d()-.5)*2,c=e.ember?.9+d()*.7:.6+d()*.4,l=e.ember?.45:.3,u=e.ember?.4:.1,f=t*3;for(let t=0;t<3;t++)e.velocity[f+t]=i*(G(I,t)*c+G(V,t)*l+(G(L,t)*a+G(R,t)*o)*u),e.position[f+t]=G(z,t)+i*.035*((d()-.5)*2);e.life[t]=e.ember?.9+d()*.8:.45+d()*.35,e.size[t]=i*(e.ember?.03+d()*.022:(.22+d()*.12)*(.8+r.t*.4)),e.seed[t]=d()*10,e.heat[t]=e.ember?.85+d()*.15:.8+d()*.2,e.age[t]=0,n&&Y(e,t,e.life[t]*d())}function Y(e,t,n){let r=t*3,i=s*H,a=(e.ember?.35:1.4)*i,o=Math.exp(-(e.ember?.6:1.2)*n),c=(e.ember?1.6:.9)*i,l=e.seed[t],u=D.value+e.age[t],d=Math.sin(u*7.3+l*3.1)*c,f=Math.cos(u*6.1+l*5.3)*c;for(let t=0;t<3;t++)e.velocity[r+t]=(e.velocity[r+t]+(G(I,t)*a+G(L,t)*d+G(R,t)*f)*n)*o,e.position[r+t]=e.position[r+t]+e.velocity[r+t]*n;e.age[t]=e.age[t]+n}function X(e){let{anchors:t,aims:n,shapes:r}=e.layer;for(let i=0;i<e.count;i++){let a=Math.min(e.age[i]/e.life[i],1),s=i*3,c=e.ember?1:.55+.45*o.smoothstep(a,0,.12),l=e.ember?1-a*.4:1-a*.62;t.setXYZ(i,e.position[s],e.position[s+1],e.position[s+2]),n.setXYZ(i,e.velocity[s],e.velocity[s+1],e.velocity[s+2]),r.setXYZW(i,e.size[i]*c*l,a,e.seed[i],e.heat[i])}t.needsUpdate=n.needsUpdate=r.needsUpdate=!0,e.layer.geometry.instanceCount=e.count}let Z=!1,Q=!0;function $(e){q[0].count=y[e],q[1].count=b[e];for(let e of q)for(let t=e.count;t<e.capacity;t++)e.age[t]=-1}return $(`high`),{object:w,surface:M,update(e){if(Z||!w.visible)return;let t=Number.isFinite(e)&&e>0?Math.min(e,.05):0;D.value=(D.value+t)%1e3,U();for(let e of q){for(let n=0;n<e.count;n++)e.age[n]<0?J(e,n,Q):t>0&&(Y(e,n,t),e.age[n]>=e.life[n]&&J(e,n,!1));X(e)}Q=!1},setQuality(e){Z||$(e)},setVisible(e){if(!(Z||w.visible===e)&&(w.visible=e,j.value=+!!e,e)){for(let e of q)e.age.fill(-1);Q=!0}},dispose(){if(!Z){Z=!0,w.visible=!1,w.removeFromParent(),w.clear();for(let e of[N,P])e.geometry.dispose(),e.material.dispose();M.dispose(),E.dispose()}}}}export{O as n,T as r,j as t};