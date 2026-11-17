//# allFunctionsCalledOnLoad
import{$ as e,B as t,Cr as n,F as r,Jt as i,P as a,Tt as o,Xn as s,Y as c,Z as l,d as u,qn as d,u as f,ur as p,v as m,wr as h}from"./three.core-DVTiNhEy.js";import{o as g}from"./src-BI6MMqKu.js";import{t as _}from"./trail-emitter-DtJSWeMd.js";import{t as v}from"./trail-slots-BYU9mmsR.js";var y=e=>new m().setHex(g(e),d),b=y(`yellow`).lerp(y(`orange`),.18),x=y(`white`).lerp(y(`yellow`),.12);function S(){let e=new u;return e.setAttribute(`position`,new t([0,0,0,-.16,.25,0,0,.25,.1,.16,.25,0,0,.25,-.1,0,1,0],3)),e.setAttribute(`uv`,new t([.5,0,0,.25,.5,.25,1,.25,.5,.25,.5,1],2)),e.setIndex([0,2,1,0,3,2,0,4,3,0,1,4,5,1,2,5,2,3,5,3,4,5,4,1]),e.computeVertexNormals(),e}function C(){let e=[0,0,.16,0,0,-.16],n=[.5,.5,.5,.5],r=[];for(let t=0;t<8;t+=1){let i=t*Math.PI/4,a=t%2==0?1:.22,o=Math.cos(i)*a,s=Math.sin(i)*a;e.push(o,s,0),n.push(o*.5+.5,s*.5+.5);let c=t+2,l=(t+1)%8+2;r.push(0,c,l,1,l,c)}let i=new u;return i.setAttribute(`position`,new t(e,3)),i.setAttribute(`uv`,new t(n,2)),i.setIndex(r),i.computeVertexNormals(),i}function w(){return{solarClock:{value:0},solarTime:{value:0},solarMotion:{value:0},solarGold:{value:b.clone()},solarWhite:{value:x.clone()},solarFaceCentre:{value:new h},solarFaceRadius:{value:new n(1.05,1.05)},solarFaceEnabled:{value:0}}}var T=`
  // Поворот по углам XYZ, как Euler в three: Rx * Ry * Rz.
  mat3 solarEuler(vec3 angle) {
    float a = cos(angle.x), b = sin(angle.x), c = cos(angle.y);
    float d = sin(angle.y), e = cos(angle.z), f = sin(angle.z);
    return mat3(1.0, 0.0, 0.0, 0.0, a, b, 0.0, -b, a)
      * mat3(c, 0.0, -d, 0.0, 1.0, 0.0, d, 0.0, c)
      * mat3(e, f, 0.0, -f, e, 0.0, 0.0, 0.0, 1.0);
  }
  mat3 solarTurnY(float angle) {
    float c = cos(angle), s = sin(angle);
    return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
  }
  // Кратчайший поворот, переводящий ось +Y в направление луча.
  mat3 solarFromUp(vec3 direction) {
    vec3 axis = vec3(direction.z, 0.0, -direction.x);
    float s = length(axis), c = direction.y;
    if (s < 0.00001) return mat3(1.0);
    axis /= s;
    float t = 1.0 - c;
    return mat3(
      t * axis.x * axis.x + c, t * axis.x * axis.y + s * axis.z, t * axis.x * axis.z - s * axis.y,
      t * axis.x * axis.y - s * axis.z, t * axis.y * axis.y + c, t * axis.y * axis.z + s * axis.x,
      t * axis.x * axis.z + s * axis.y, t * axis.y * axis.z - s * axis.x, t * axis.z * axis.z + c);
  }`,E=`
  varying vec3 vSolarView, vSolarNormal, vSolarColour;
  varying vec2 vSolarUv;
  varying float vSolarAlpha, vSolarBreak;`,D=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  attribute float solarAlpha, solarBreak;
  attribute vec3 solarTint;
  uniform vec3 solarColour;
  ${E}
  void main() {
    #include <beginnormal_vertex>
    #include <defaultnormal_vertex>
    vSolarNormal = normalize(transformedNormal);
    vec3 transformed = position;
    #include <project_vertex>
    vSolarView = -mvPosition.xyz; vSolarColour = solarColour * solarTint;
    #ifdef USE_INSTANCING_COLOR
      vSolarColour *= instanceColor;
    #endif
    vSolarUv = uv; vSolarAlpha = solarAlpha; vSolarBreak = solarBreak;
    #include <logdepthbuf_vertex>
  }`,O=`
  #include <common>
  #include <logdepthbuf_pars_fragment>
  uniform float solarTime, solarFaceEnabled;
  uniform vec3 solarWhite, solarFaceCentre;
  uniform vec2 solarFaceRadius;
  ${E}
  float grain(vec2 cell) { return fract(sin(dot(cell, vec2(127.1, 311.7))) * 43758.5453); }
  void main() {
    if (vSolarAlpha < 0.003) discard;
    if (solarFaceEnabled > 0.5 && vSolarView.z < solarFaceCentre.z + solarFaceRadius.y) {
      vec2 offset = vSolarView.xy / max(vSolarView.z, 0.001)
        - solarFaceCentre.xy / max(solarFaceCentre.z, 0.001);
      float offAxis = sqrt(1.0 + dot(solarFaceCentre.xy, solarFaceCentre.xy)
        / max(solarFaceCentre.z * solarFaceCentre.z, 0.0001));
      vec2 radius = solarFaceRadius * offAxis / max(solarFaceCentre.z - solarFaceRadius.x, 0.1);
      if (dot(offset / radius, offset / radius) < 1.0) discard;
    }
    vec3 normal = normalize(vSolarNormal) * (gl_FrontFacing ? 1.0 : -1.0);
    vec3 view = normalize(vSolarView + vec3(0.0001));
    vec3 light = normalize(mat3(viewMatrix) * vec3(-0.35, 0.84, 0.42));
    float shine = pow(max(0.0, dot(normal, normalize(light + view))), 42.0);
    float rim = pow(1.0 - max(0.0, dot(normal, view)), 3.0);
    float core = 0.14, alpha = vSolarAlpha;
    #ifdef SOLAR_RIBBON
      float across = abs(vSolarUv.y * 2.0 - 1.0);
      core = pow(max(0.0, 1.0 - across), 3.0) * 0.68;
      alpha *= 1.0 - smoothstep(0.62, 1.0, across);
      float cell = grain(floor(vSolarUv * vec2(18.0, 19.0)));
      alpha *= 1.0 - smoothstep(cell * 0.82 + 0.02, cell * 0.82 + 0.16, vSolarBreak);
      core += sin(vSolarUv.x * 8.0 - solarTime * 2.0) * 0.018;
    #endif
    #ifdef SOLAR_RAY
      core = (1.0 - smoothstep(0.15, 0.95, abs(vSolarUv.x * 2.0 - 1.0))) * 0.46;
      alpha *= 1.0 - smoothstep(0.78, 1.0, vSolarUv.y) * 0.60;
    #endif
    vec3 colour = vSolarColour * (0.91 + max(0.0, dot(normal, light)) * 0.15);
    colour = mix(colour, solarWhite, clamp(core + shine * 0.34 + rim * 0.06, 0.0, 0.88));
    if (alpha < 0.003) discard;
    #include <logdepthbuf_fragment>
    gl_FragColor = vec4(colour, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;function k(e,t,n,r,i=D){let a=new s({name:e,defines:t===`ribbon`?{SOLAR_RIBBON:1}:t===`ray`?{SOLAR_RAY:1}:{},transparent:!0,depthWrite:!1,side:2,forceSinglePass:!0,toneMapped:!0,uniforms:{...n,solarColour:{value:r.clone()}},vertexShader:i,fragmentShader:O});return Object.assign(a.defaultAttributeValues,{solarAlpha:[1],solarBreak:[0],solarTint:[1,1,1]}),a}function A(e){return e?.getObjectByName(`mixamorigHead_06`)??null}function j(e,t){let n=new h,r=new h;return i=>{if(e===null){t.solarFaceEnabled.value=0;return}i.updateMatrixWorld(),e.updateWorldMatrix(!0,!1),n.set(-.00570525,.6573547,.02455115),e.localToWorld(n);let a=1.00256*e.matrixWorld.getMaxScaleOnAxis()+.14;r.copy(n).applyMatrix4(i.matrixWorldInverse).multiplyScalar(-1),t.solarFaceCentre.value.copy(r),t.solarFaceRadius.value.set(a,a),t.solarFaceEnabled.value=Number.isFinite(r.lengthSq())&&r.z>.1?1:0}}var M=Math.PI*2,N=42,P=120,ee=[120,66,36],te=[16,10,6],F=e=>M*Math.max(1,Math.round(P/e))/P,I=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float solarClock, solarMotion;
  uniform vec3 solarColour;
  ${E}
  ${T}`,ne=`${I}
  // Начальный угол, высота, удаление, длина.
  attribute vec4 solarRayShape;
  // Ширина, частота дыхания, начальная фаза, наклон яруса.
  attribute vec4 solarRayBreath;
  void main() {
    float start = solarRayShape.x;
    float angle = start + solarClock * (PI2 / 12.0);
    float phase = solarRayBreath.z + solarClock * solarRayBreath.y;
    float breath = 0.90 + sin(phase) * 0.10;
    float inclination = solarRayBreath.w + sin(phase + 1.3) * 0.05;
    vec3 direction = normalize(vec3(cos(angle), inclination, sin(angle)));
    vec3 centre = vec3(cos(angle) * solarRayShape.z, solarRayShape.y + sin(phase + start) * 0.055,
      sin(angle) * solarRayShape.z - solarMotion * 0.12);
    mat3 turn = solarFromUp(direction) * solarTurnY(start * 1.7 + sin(phase) * 0.12);
    float width = solarRayBreath.x * (0.93 + sin(phase + 1.7) * 0.07);
    vec3 scale = vec3(width, solarRayShape.w * breath, width * 0.78);
    vec4 mvPosition = modelViewMatrix * vec4(centre + turn * (position * scale), 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vSolarNormal = normalize(normalMatrix * (turn * (normal / scale)));
    vSolarView = -mvPosition.xyz; vSolarColour = solarColour;
    #ifdef USE_INSTANCING_COLOR
      vSolarColour *= instanceColor;
    #endif
    vSolarUv = uv; vSolarAlpha = 0.81 + sin(phase) * 0.09; vSolarBreak = 0.0;
    #include <logdepthbuf_vertex>
  }`,re=`${I}
  // Начальный возраст, частота жизни, начальный угол, удаление.
  attribute vec4 solarDustOrbit;
  // Высота, размер, частота обхода, частота вращения.
  attribute vec4 solarDustMotion;
  // Начальное вращение, наибольшая непрозрачность.
  attribute vec2 solarDustSpin;
  void main() {
    float age = fract(solarDustOrbit.x + solarClock * solarDustOrbit.y);
    float start = solarDustOrbit.z;
    float angle = start + solarClock * solarDustMotion.z;
    float spin = solarDustSpin.x + solarClock * solarDustMotion.w;
    float envelope = smoothstep(0.0, 0.13, age) * (1.0 - smoothstep(0.66, 0.90, age));
    vec3 centre = vec3(cos(angle) * solarDustOrbit.w,
      solarDustMotion.x + (age - 0.5) * 0.26 + sin(spin + start) * 0.045,
      sin(angle) * solarDustOrbit.w - solarMotion * 0.14);
    mat3 turn = solarEuler(vec3(sin(spin) * 0.44 + start, cos(spin) * 0.31, spin));
    float size = solarDustMotion.y * max(0.001, envelope);
    vec4 mvPosition = modelViewMatrix * vec4(centre + turn * (position * size), 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vSolarNormal = normalize(normalMatrix * (turn * normal));
    vSolarView = -mvPosition.xyz; vSolarColour = solarColour;
    #ifdef USE_INSTANCING_COLOR
      vSolarColour *= instanceColor;
    #endif
    vSolarUv = uv; vSolarBreak = 0.0;
    vSolarAlpha = solarDustSpin.y * smoothstep(0.0, 0.08, age) * (1.0 - smoothstep(0.81, 0.90, age));
    #include <logdepthbuf_vertex>
  }`;function L(t,n){let a=w(),s=new m(16777215),u=k(`Solar_Aura_Rays`,`ray`,a,s,ne),d=k(`Solar_Aura_Corona`,`ribbon`,a,b),g=k(`Solar_Aura_Dust`,`solid`,a,s,re),_=[u,d,g],v=j(n,a),y=1470241251,T=()=>(y^=y<<13,y^=y>>>17,y^=y<<5,(y>>>0)/4294967296),E=S(),D=new l(new Float32Array(168),4),O=new l(new Float32Array(168),4);E.setAttribute(`solarRayShape`,D),E.setAttribute(`solarRayBreath`,O);let A=new e(E,u,N);A.name=`Solar_Aura_Radial_Rays`;for(let e=0;e<N;e+=1){let t=Math.floor(e/14),n=e%14*M/14+t*.2+(T()-.5)*.1,r=1.82+T()*.19,i=1.08+T()*.66,a=1.07+T()*.73,o=2.8+T()*2.6,s=T()*M;D.setXYZW(e,n,t===0?-1.23:t===1?-.33:.6,r,i),O.setXYZW(e,a,F(o),s,t===0?-.17:t===1?0:.22),A.setColorAt(e,e%6==0?x:b)}let I=[{radius:2.71,height:-1.06,tiltX:.16,tiltZ:.08,span:4.62,period:10,phase:.3},{radius:3.15,height:-.24,tiltX:-.2,tiltZ:.04,span:4.14,period:12,phase:2.2},{radius:3.34,height:.45,tiltX:.18,tiltZ:-.08,span:4.42,period:14,phase:4.3}].map((e,t)=>{let n=new p(e.radius,t===1?.026:.021,5,68,e.span);n.setAttribute(`solarAlpha`,new f(new Float32Array(n.getAttribute(`position`).count).fill(.76),1));let a=new o(n,d);return a.name=`Solar_Aura_Open_Corona_${t+1}`,{mesh:a,geometry:n,orientation:new i().setFromEuler(new r(Math.PI/2+e.tiltX,0,e.tiltZ)),height:e.height,phase:e.phase,speed:F(e.period)}}),L=[{name:`Solar_Aura_Gold_Dust`,budget:ee,bright:!1,geometry:new c(1,0)},{name:`Solar_Aura_Bright_Glimmers`,budget:te,bright:!0,geometry:C()}].map(t=>{let n=t.budget[0],r=new l(new Float32Array(n*4),4),i=new l(new Float32Array(n*4),4),a=new l(new Float32Array(n*2),2);t.geometry.setAttribute(`solarDustOrbit`,r),t.geometry.setAttribute(`solarDustMotion`,i),t.geometry.setAttribute(`solarDustSpin`,a);let o=new e(t.geometry,g,n);o.name=t.name;for(let e=0;e<n;e+=1){let n=T(),s=3.4+T()*3.1,c=T()*M,l=2.05+T()*1.45,u=-1.55+T()*2.75,d=t.bright?.095+T()*.07:.025+T()*.035,f=10+T()*4,p=7+T()*7,m=T()*M;r.setXYZW(e,n,F(s)/M,c,l),i.setXYZW(e,u,d,F(f),F(p)),a.setXY(e,m,t.bright?.94:.57),o.setColorAt(e,t.bright||e%9==0?x:b)}return{mesh:o,budget:t.budget}}),R=[A,...I.map(e=>e.mesh),...L.map(e=>e.mesh)];for(let e of R)e.frustumCulled=!1,e.castShadow=e.receiveShadow=!1,e.renderOrder=3,t.add(e);let z=new h(0,1,0),B=new i,V=0,H=0,U=0,W=!1,G=()=>{for(let e of I){let t=e.phase+V*e.speed;B.setFromAxisAngle(z,t),e.mesh.quaternion.copy(B).multiply(e.orientation),e.mesh.position.set(0,e.height,-U*.1),e.mesh.scale.setScalar(1+Math.sin(t*2)*.012)}a.solarClock.value=V,a.solarTime.value=H,a.solarMotion.value=U},K=e=>{for(let t of L)t.mesh.count=t.budget[e]},q=()=>{V=H=U=0,G()};return q(),{step(e,t){W||!Number.isFinite(e)||e<=0||(V=(V+e)%P,H=(H+e)%Math.PI,U+=(+!!t-U)*(1-Math.exp(-e*3)),G())},setTier(e){!W&&(e===0||e===1||e===2)&&K(e)},view(e){W||v(e)},reset(){W||q()},dispose(){if(!W){W=!0;for(let e of R)e.removeFromParent();A.dispose(),E.dispose();for(let e of I)e.geometry.dispose();for(let e of L)e.mesh.dispose(),e.mesh.geometry.dispose();for(let e of _)e.dispose()}}}}var R=Math.PI*2,z=.7,B=1.95,V=1.15,H=7,U=[8,4,2],W=[2,3,4],G=z*.13,K=100,q=3584,ie=28672,ae=1024,J=e=>{let t=Math.sin(e*127.1+311.7)*43758.5453123;return t-Math.floor(t)},Y=e=>e-Math.floor(e/R)*R,X=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float solarClock;
  uniform vec3 solarColour, solarGold, solarWhite;
  ${E}
  ${T}`,oe=`${X}
  attribute vec2 solarBorn;
  attribute vec4 solarFilament;
  void main() {
    float channel = position.x, v = position.z;
    bool late = position.y > 0.5;
    mat4 m = instanceMatrix;
    vec3 at = late ? vec3(m[0].w, m[1].x, m[1].y) : m[0].xyz;
    vec2 flow = late ? m[2].xy : m[1].zw;
    float u = late ? m[2].w : m[2].z;
    float broadWidth = late ? m[3].y : m[3].x;
    float broadCentre = late ? m[3].w : m[3].z;
    vec2 filament = late ? solarFilament.zw : solarFilament.xy;
    float age = solarClock - (late ? solarBorn.y : solarBorn.x);
    float grow = smoothstep(0.0, 0.065, age);
    float breakup = smoothstep(0.36, 1.28, age);
    float fade = 1.0 - smoothstep(0.94, 1.46, age);
    bool broad = channel < 0.5;
    float width = (broad ? broadWidth : 0.11) * max(0.01, grow * (1.0 - breakup * 0.52));
    float centre = broad ? broadCentre : channel < 1.5 ? -filament.x : filament.y;
    float elevation = broad ? 0.10 : 0.20, dome = broad ? 0.16 : 0.045;
    float side = centre + (v * 2.0 - 1.0) * width;
    vec3 world = vec3(at.x + flow.y * side, at.y + elevation + sin(v * PI) * dome, at.z - flow.x * side);
    float slope = cos(v * PI) * PI * dome / max(0.03, width * 2.0);
    vec3 objectNormal = vec3(-flow.y * slope, 1.0, flow.x * slope) / sqrt(slope * slope + 1.0);
    vec4 mvPosition = modelViewMatrix * vec4(world, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vSolarNormal = normalize(normalMatrix * objectNormal);
    vSolarView = -mvPosition.xyz; vSolarColour = solarColour;
    vSolarUv = vec2(u, v);
    vSolarAlpha = grow * fade * (broad ? 0.89 : 0.95); vSolarBreak = breakup;
    #include <logdepthbuf_vertex>
  }`,se=`${X}
  attribute float solarBorn;
  void main() {
    mat4 m = instanceMatrix;
    float random = m[0].w, delay = m[1].z;
    float time = solarClock - solarBorn - delay;
    float phase = time / (${B.toFixed(2)} - delay);
    float envelope = smoothstep(0.0, 0.13, time) * (1.0 - smoothstep(0.60, 1.0, phase));
    float side = (random * 2.0 - 1.0) * 1.36 + m[2].y * time * 0.33;
    float along = m[2].x + m[2].z * time * 0.20;
    vec2 flow = m[1].xy;
    vec3 centre = vec3(m[0].x + flow.y * side + flow.x * along,
      m[0].y + 0.18 + time * (0.42 + random * 0.48), m[0].z - flow.x * side + flow.y * along);
    mat3 turn = solarEuler(vec3(m[2].w + time * 1.1, m[3].x - time * 0.6, time + random));
    float size = max(0.001, m[1].w * envelope);
    vec4 mvPosition = modelViewMatrix * vec4(centre + turn * (position * size), 1.0);
    // До своей задержки пылинки ещё нет.
    gl_Position = time < 0.0 ? vec4(0.0, 0.0, 2.0, 1.0) : projectionMatrix * mvPosition;
    vSolarNormal = normalize(normalMatrix * (turn * normal));
    vSolarView = -mvPosition.xyz;
    vSolarColour = mix(solarGold, solarWhite, (0.12 + random * 0.42) * (1.0 - phase * 0.65));
    vSolarUv = uv; vSolarAlpha = time < 0.0 ? 0.0 : envelope * 0.91; vSolarBreak = 0.0;
    #include <logdepthbuf_vertex>
  }`,ce=`${X}
  attribute float solarBorn;
  void main() {
    mat4 m = instanceMatrix;
    float time = solarClock - solarBorn - 0.10;
    float envelope = smoothstep(0.0, 0.11, time) * (1.0 - smoothstep(0.60, 1.05, time));
    float side = m[0].w * (1.0 + time * 0.4);
    vec2 flow = m[1].xy;
    vec3 centre = vec3(m[0].x + flow.y * side, m[0].y + 0.28 + time * 0.56, m[0].z - flow.x * side);
    mat3 turn = solarEuler(vec3(m[1].w, m[2].x + time * 0.51, time * 0.74));
    float size = max(0.001, m[1].z * envelope);
    vec3 scale = vec3(size, size * 1.24, size);
    vec4 mvPosition = modelViewMatrix * vec4(centre + turn * (position * scale), 1.0);
    gl_Position = time < 0.0 ? vec4(0.0, 0.0, 2.0, 1.0) : projectionMatrix * mvPosition;
    vSolarNormal = normalize(normalMatrix * (turn * (normal / vec3(1.0, 1.24, 1.0))));
    vSolarView = -mvPosition.xyz;
    vSolarColour = mix(solarWhite, solarGold, 0.27);
    vSolarUv = uv; vSolarAlpha = time < 0.0 ? 0.0 : envelope * 0.93; vSolarBreak = 0.0;
    #include <logdepthbuf_vertex>
  }`;function le(){let e=[],n=[];for(let t=0;t<3;t+=1){for(let n=0;n<2;n+=1)for(let r=0;r<H;r+=1)e.push(t,n,r/6);for(let e=0;e<6;e+=1){let r=t*H*2+e,i=r+H;n.push(r,i,r+1,i,i+1,r+1)}}let r=new u;return r.setAttribute(`position`,new t(e,3)),r.setIndex(n),r}function Z(t,n,r,i,o,s,c={}){let u=new l(new Float32Array(i*o),o).setUsage(a);n.setAttribute(`solarBorn`,u);let d=[];for(let[e,t]of Object.entries(c)){let r=new l(new Float32Array(i*t),t).setUsage(a);n.setAttribute(e,r),d.push(r)}let f=new e(n,r,i);return f.instanceMatrix.setUsage(a),f.name=r.name,f.count=0,f.visible=!1,f.frustumCulled=!1,f.castShadow=!1,f.receiveShadow=!1,t.add(f),{mesh:f,material:r,data:f.instanceMatrix.array,bornAttribute:u,attributes:[f.instanceMatrix,u,...d],born:new Float64Array(i),life:s,capacity:i,count:0,slots:v(),appendStart:-1,rebased:!1}}function Q(e,t){if(e.count===e.capacity)return-1;let n=e.count++;return e.appendStart<0&&(e.appendStart=n),e.born[n]=t,n}function ue(e){e.count=e.mesh.count=0,e.mesh.visible=!1,e.slots.clear(),e.appendStart=-1,e.rebased=!1;for(let t of e.attributes)t.clearUpdateRanges()}function de(e,t){let n=0;for(;n<e.count;){if(t-e.born[n]<e.life){n+=1;continue}let r=--e.count;if(n!==r){e.born[n]=e.born[r];for(let t of e.attributes){let e=t.itemSize;t.array.copyWithin(n*e,r*e,(r+1)*e)}e.slots.moved(n)}}}function fe(e,t){let n=e.bornAttribute.array;for(let n=0;n<e.count;n+=1)e.born[n]=e.born[n]-t;for(let r=0;r<e.count*e.bornAttribute.itemSize;r+=1)n[r]=n[r]-t;e.rebased=!0}function pe(e){e.mesh.count=e.count,e.mesh.visible=e.count>0;for(let t of e.attributes){let n=!1;t===e.bornAttribute&&e.rebased&&e.count>0?(t.addUpdateRange(0,e.count*t.itemSize),n=!0):n=e.slots.upload(t,e.appendStart,e.count),n&&(t.needsUpdate=!0)}e.slots.clear(),e.appendStart=-1,e.rebased=!1}function me(e){e.mesh.removeFromParent(),e.mesh.geometry.dispose(),e.material.dispose(),e.mesh.dispose()}var $=()=>({x:0,y:0,z:0,born:0,dx:0,dz:1,id:0,broadWidth:0,broadCentre:0,left:0,right:0});function he(e,t,n){let r=w(),i=Z(e,le(),k(`Solar_Path_Radiant_Stream`,`ribbon`,r,b,oe),q,2,B,{solarFilament:4}),a=Z(e,new c(1,0),k(`Solar_Path_Golden_Dust`,`solid`,r,b,se),ie,1,B),o=Z(e,C(),k(`Solar_Path_Sun_Glimmers`,`solid`,r,b,ce),ae,1,V),s=[i,a,o],l=i.attributes[2].array,u=j(n,r),d=_(1024),f=new h,p=$(),m=$(),g=!1,v=0,y=0,x=0,S=0,T=!1,E=(e,t)=>{let n=Q(i,e.born);if(n<0)return;let r=n*16,a=e.id*G%K,o=i.data;o[r]=e.x,o[r+1]=e.y,o[r+2]=e.z,o[r+3]=t.x,o[r+4]=t.y,o[r+5]=t.z,o[r+6]=e.dx,o[r+7]=e.dz,o[r+8]=t.dx,o[r+9]=t.dz,o[r+10]=a,o[r+11]=a+(t.id-e.id)*G,o[r+12]=e.broadWidth,o[r+13]=t.broadWidth,o[r+14]=e.broadCentre,o[r+15]=t.broadCentre,i.bornAttribute.setXY(n,e.born,t.born),l[n*4]=e.left,l[n*4+1]=e.right,l[n*4+2]=t.left,l[n*4+3]=t.right},D=(e,t)=>{let n=Q(a,e.born);if(n<0)return;let r=e.id*11.7+t*2.31,i=J(r),o=n*16,s=a.data;s[o]=e.x,s[o+1]=e.y,s[o+2]=e.z,s[o+3]=i,s[o+4]=e.dx,s[o+5]=e.dz,s[o+6]=.22+J(r+2.1)*.33,s[o+7]=.028+J(r+.4)*.052,s[o+8]=(J(r+.7)-.5)*.7,s[o+9]=Math.sin(r),s[o+10]=Math.cos(r),s[o+11]=Y(r),s[o+12]=Y(r*.73),s[o+13]=s[o+14]=s[o+15]=0,a.bornAttribute.setX(n,e.born)},O=e=>{let t=Q(o,e.born);if(t<0)return;let n=t*16,r=o.data;r[n]=e.x,r[n+1]=e.y,r[n+2]=e.z,r[n+3]=Math.sin(e.id*2.4),r[n+4]=e.dx,r[n+5]=e.dz,r[n+6]=.13+J(e.id)*.1,r[n+7]=Y(.4+e.id*.73),r[n+8]=Y(e.id*1.37),r[n+9]=r[n+10]=r[n+11]=0,r[n+12]=r[n+13]=r[n+14]=r[n+15]=0,o.bornAttribute.setX(t,e.born)},A=()=>{for(let e of s)pe(e);r.solarClock.value=y,r.solarTime.value=x},M=()=>{for(let e of s)ue(e);y=0,S=0,g=!1,A()};return{setTier(e){T||(v=e)},step(e,n){if(T)return;t.getWorldPosition(f);let r=d.step(f.x,f.y,f.z,e,n,z);if(d.cleared){M();return}if(!Number.isFinite(e)||e<=0)return;if(y+=e,x=(x+e)%Math.PI,y>=128){let e=Math.floor(y/128)*128;y-=e,p.born-=e;for(let t of s)fe(t,e)}for(let e of s)de(e,y);g&&y-p.born>=B&&(g=!1);let i=Math.hypot(d.direction[0],d.direction[2]),a=i>1e-6?d.direction[0]/i:0,o=i>1e-6?d.direction[2]/i:1;for(let e=0;e<r;e+=1){let t=m,n=S++,r=n*z;t.x=d.positions[e*3],t.y=d.positions[e*3+1],t.z=d.positions[e*3+2],t.born=y-d.elapsed[e],t.dx=a,t.dz=o,t.id=n,t.broadWidth=1.4+Math.sin(r*.3)*.14,t.broadCentre=Math.sin(r*.24)*.12,t.left=1.38+Math.sin(r*.47+1)*.2,t.right=1.38+Math.sin(r*.47+2)*.2,g&&E(p,t);for(let e=0;e<U[v];e+=1)D(t,e);n%W[v]===0&&O(t),m=p,p=t,g=!0}A()},view(e){T||u(e)},reset(){T||(M(),d.reset(),x=0)},dispose(){if(!T){T=!0;for(let e of s)me(e)}}}}function ge(e,t,n){return he(e,t,A(n.character))}function _e(e,t,n){return L(t,A(n.character))}export{_e as createSolarAuraEffect,ge as createSolarTrailEffect};