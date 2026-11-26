//# allFunctionsCalledOnLoad
import{$ as e,Cr as t,P as n,Xn as r,Y as i,Z as a,d as o,qn as s,u as c,v as l,wr as u}from"./three.core-DVTiNhEy.js";import{o as d}from"./src-BI6MMqKu.js";import{n as f,r as p,t as m}from"./trail-shape-BsaeWHuc.js";import{t as h}from"./trail-slots-BYU9mmsR.js";var g=e=>new l().setHex(d(e),s),_=g(`white`),v=g(`cyan/1`).lerp(_,.38),y=g(`blue/-1`).lerp(_,.58);function b(){return{windClock:{value:0},windOrbit:{value:0},windMotion:{value:0},windWave:{value:0},windFaceCentre:{value:new u},windFaceRadius:{value:new t(1.05,1.05)},windFaceEnabled:{value:0}}}var x=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float windClock;
  varying vec3 vWindView, vWindNormal, vWindColour;
  varying vec2 vWindUv;
  varying float vWindAlpha, vWindSeed;

  float windSmooth(float x) {
    float t = clamp(x, 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
  }

  // Поворот в порядке XYZ, как у THREE.Euler по умолчанию.
  mat3 windEuler(vec3 angles) {
    float a = cos(angles.x), b = sin(angles.x), c = cos(angles.y), d = sin(angles.y);
    float e = cos(angles.z), f = sin(angles.z);
    float ae = a * e, af = a * f, be = b * e, bf = b * f;
    return mat3(c * e, af + be * d, bf - ae * d,
      -c * f, ae - bf * d, be + af * d,
      d, -b * c, a * c);
  }

  // Кратчайший поворот оси Y к направлению, как у Quaternion.setFromUnitVectors.
  mat3 windAlign(vec3 direction) {
    vec3 v = vec3(direction.z, 0.0, -direction.x);
    mat3 skew = mat3(0.0, v.z, -v.y, -v.z, 0.0, v.x, v.y, -v.x, 0.0);
    return mat3(1.0) + skew + skew * skew / (1.0 + direction.y);
  }
`,S=`
  #include <common>
  #include <logdepthbuf_pars_fragment>
  uniform float windWave, windFaceEnabled;
  uniform vec3 windFaceCentre, windWhite, windCyan, windBlue;
  uniform vec2 windFaceRadius;
  varying vec3 vWindView, vWindNormal, vWindColour;
  varying vec2 vWindUv;
  varying float vWindAlpha, vWindSeed;
  void main() {
    if (vWindAlpha < 0.003) discard;
    if (windFaceEnabled > 0.5 && vWindView.z < windFaceCentre.z + windFaceRadius.y) {
      vec2 offset = vWindView.xy / max(vWindView.z, 0.001)
        - windFaceCentre.xy / max(windFaceCentre.z, 0.001);
      float offAxis = sqrt(1.0 + dot(windFaceCentre.xy, windFaceCentre.xy)
        / max(windFaceCentre.z * windFaceCentre.z, 0.0001));
      vec2 radius = windFaceRadius * offAxis / max(windFaceCentre.z - windFaceRadius.x, 0.1);
      if (dot(offset / radius, offset / radius) < 1.0) discard;
    }
    vec3 normal = normalize(vWindNormal), view = normalize(vWindView + vec3(0.000001));
    vec3 up = normalize(mat3(viewMatrix) * vec3(0.0, 1.0, 0.0));
    vec3 light = normalize(mat3(viewMatrix) * vec3(-0.36, 0.84, 0.41));
    float rim = pow(1.0 - clamp(abs(dot(normal, view)), 0.0, 1.0), 2.6);
    float underside = smoothstep(-0.05, 0.85, -dot(normal, up));
    float gloss = pow(max(0.0, dot(normal, normalize(view + light))), 62.0);
    vec3 colour = vWindColour; float alpha = vWindAlpha;
    #ifdef WIND_STREAM
      colour = mix(colour, windBlue, underside * 0.45);
      colour = mix(colour, windCyan, rim * 0.28);
      colour = mix(colour, windWhite, gloss * 0.38);
      float current = sin(vWindUv.x * 34.0 - windWave + vWindSeed
        + sin(vWindUv.y * 6.28318530718) * 1.6);
      colour *= 0.91 + max(0.0, dot(normal, light)) * 0.09 + current * 0.018;
      alpha *= 0.94 + current * 0.035;
    #else
      colour = mix(colour, windWhite, gloss * 0.22);
    #endif
    #include <logdepthbuf_fragment>
    gl_FragColor = vec4(colour, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;function C(e,t,n,i,a={}){return new r({name:e,vertexShader:t,fragmentShader:S,defines:n?{...a,WIND_STREAM:1}:a,uniforms:{...i,windWhite:{value:_},windCyan:{value:v},windBlue:{value:y}},transparent:!0,depthWrite:!1,depthTest:!0,side:0,toneMapped:!0})}function w(e,t){let n=new u;return r=>{if(e===null){t.windFaceEnabled.value=0;return}r.updateMatrixWorld(),e.updateWorldMatrix(!0,!1),n.set(-.00570525,.6573547,.02455115),e.localToWorld(n);let i=1.00256*e.matrixWorld.getMaxScaleOnAxis()+.14,a=t.windFaceCentre.value;a.copy(n).applyMatrix4(r.matrixWorldInverse).multiplyScalar(-1),t.windFaceRadius.value.set(i,i),t.windFaceEnabled.value=Number.isFinite(a.lengthSq())&&a.z>.1?1:0}}var T=Math.PI*2,E=120,D=10.5,O=[8,6,4],k=[20,12,6],A=[96,54,30],j=[0,4,2,6,1,5,3,7],M=[{angle:.05,radius:2.18,arc:1.85,bottom:-2.2,rise:3.1,width:.25,wave:1.46},{angle:.85,radius:2.67,arc:.7,bottom:-2.12,rise:3.48,width:.18,wave:1.73},{angle:1.64,radius:2.38,arc:2.35,bottom:-2.17,rise:1.65,width:.32,wave:1.31},{angle:2.43,radius:2.82,arc:1.35,bottom:-1.83,rise:2.83,width:.23,wave:1.59},{angle:3.26,radius:2.45,arc:1.94,bottom:-1.42,rise:2.14,width:.2,wave:1.87},{angle:4.03,radius:2.12,arc:.88,bottom:-2.23,rise:3.4,width:.22,wave:1.38},{angle:4.83,radius:2.87,arc:2.27,bottom:-1.78,rise:1.96,width:.27,wave:1.67},{angle:5.61,radius:2.56,arc:1.27,bottom:-2.08,rise:2.5,width:.23,wave:1.51}],N=27,P=19,F=6,I=e=>Math.max(1,Math.round(e*E/T))*T/E,L=e=>Math.max(1,Math.round(E/e))/E,R=I(7.8),ee=`
  ${x}
  uniform float windOrbit, windMotion;
  uniform vec3 windWhite, windBlue;
  // Угол, радиус, дуга и низ струи.
  attribute vec4 windStream;
  // Подъём, толщина, затравка перелива.
  attribute vec3 windStreamShape;
  // Частота и сдвиг волны, частота и сдвиг порыва.
  attribute vec4 windPulse;

  vec3 windStreamPoint(float t, float phase) {
    float angle = windStream.x + windOrbit + (t - 0.5) * windStream.z + sin(t * 5.3 - phase) * 0.11;
    float radius = windStream.y + sin(t * 4.5 + phase) * 0.10 + sin(t * PI) * 0.12;
    return vec3(cos(angle) * radius, windStream.w + t * windStreamShape.x + sin(t * 6.1 - phase) * 0.105,
      sin(angle) * radius - windMotion * (0.14 + t * t * 0.42));
  }

  void main() {
    float phase = windClock * windPulse.x + windPulse.y;
    // x — доля длины, y — доля оборота сечения, z — торец.
    float t = position.x;
    vec3 centre = windStreamPoint(t, phase);
    vec3 tangent = normalize(windStreamPoint(min(1.0, t + 0.004), phase)
      - windStreamPoint(max(0.0, t - 0.004), phase));
    vec3 across = normalize(vec3(centre.x, 0.0, centre.z));
    across = normalize(across - tangent * dot(across, tangent));
    vec3 depth = normalize(cross(across, tangent));
    float gust = 0.73 + sin(phase + t * 4.3) * 0.16
      + sin(windClock * windPulse.z + windPulse.w - t * 5.1) * 0.08;
    float width = 0.005 + windStreamShape.y * pow(max(0.0, sin(t * PI)), 0.64) * gust;
    float ring = position.y * PI2;
    vec3 point = centre;
    vec3 objectNormal = t < 0.5 ? -tangent : tangent;
    if (position.z < 0.5) {
      point += across * cos(ring) * width + depth * sin(ring) * width * 0.26;
      objectNormal = normalize(across * cos(ring) * 0.26 + depth * sin(ring));
    }
    vec4 mvPosition = modelViewMatrix * vec4(point, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <logdepthbuf_vertex>
    vWindView = -mvPosition.xyz;
    vWindNormal = normalize(normalMatrix * objectNormal);
    // Низ струи синее, верх белее.
    float height = windStream.w + t * windStreamShape.x;
    vWindColour = mix(windBlue, windWhite, 0.42 + clamp((height + 2.3) / 3.1, 0.0, 1.0) * 0.58);
    vWindUv = uv;
    vWindAlpha = 0.72 + sin(phase) * 0.09;
    vWindSeed = windStreamShape.z;
  }`,te=`
  ${x}
  uniform float windOrbit, windMotion;
  // Доля жизни на старте, циклов в секунду, угол и радиус.
  attribute vec4 windCycle;
  // Низ, размер, затравка наклона.
  attribute vec3 windCurl;
  attribute vec3 windTint;
  void main() {
    float age = fract(windCycle.x + windClock * windCycle.y);
    float angle = windCycle.z + windOrbit + age * 0.44;
    vec3 centre = vec3(cos(angle) * windCycle.w, windCurl.x + age * 0.44,
      sin(angle) * windCycle.w - windMotion * age * 0.28);
    float spin = windCurl.z;
    mat3 turn = windEuler(vec3(sin(spin) * 0.52, angle + PI * 0.5, cos(spin) * 0.47));
    float size = windCurl.y * (0.66 + windSmooth(age / 0.16) * 0.34)
      * (1.0 - windSmooth((age - 0.63) / 0.37) * 0.34);
    vec3 scale = vec3(size, size * (0.85 + sin(spin) * 0.14), size);
    vec4 mvPosition = modelViewMatrix * vec4(centre + turn * (position * scale), 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <logdepthbuf_vertex>
    vWindView = -mvPosition.xyz;
    vWindNormal = normalize(normalMatrix * (turn * (normal / scale)));
    vWindColour = windTint;
    vWindUv = uv;
    vWindAlpha = windSmooth(age / 0.12) * (1.0 - windSmooth((age - 0.64) / 0.36)) * 0.70;
    vWindSeed = spin;
  }`,z=`
  ${x}
  uniform float windOrbit, windMotion;
  // Доля жизни на старте, циклов в секунду, угол и радиус.
  attribute vec4 windCycle;
  // Низ, размер, затравка вытянутости.
  attribute vec3 windSpark;
  attribute vec3 windTint;
  void main() {
    float age = fract(windCycle.x + windClock * windCycle.y);
    float angle = windCycle.z + windOrbit + age * 1.13;
    float radius = windCycle.w + age * 0.18;
    vec3 centre = vec3(cos(angle) * radius, windSpark.x + age * 2.23,
      sin(angle) * radius - windMotion * age * 0.31);
    // Штрих летит по касательной вверх и вытянут вдоль полёта.
    mat3 turn = windAlign(normalize(vec3(-sin(angle) * 0.67, 0.82, cos(angle) * 0.67 - windMotion * 0.18)));
    float size = windSpark.y * max(0.001, windSmooth(age / 0.08) * (1.0 - windSmooth((age - 0.63) / 0.37)));
    vec3 scale = vec3(size * 0.5, size * (4.0 + sin(windSpark.z) * 1.3), size * 0.5);
    vec4 mvPosition = modelViewMatrix * vec4(centre + turn * (position * scale), 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <logdepthbuf_vertex>
    vWindView = -mvPosition.xyz;
    vWindNormal = normalize(normalMatrix * (turn * (normal / scale)));
    vWindColour = windTint;
    vWindUv = uv;
    vWindAlpha = windSmooth(age / 0.055) * (1.0 - windSmooth((age - 0.72) / 0.28)) * 0.80;
    vWindSeed = 0.0;
  }`;function B(e,t){let n=e*(t+1),r=[];for(let n=0;n<e-1;n+=1)for(let e=0;e<t;e+=1){let i=n*(t+1)+e,a=i+t+1;r.push(i,a,i+1,i+1,a,a+1)}for(let i=0;i<t;i+=1){let a=(e-1)*(t+1)+i;r.push(n,i,i+1,n+1,a+1,a)}return r}function V(e,t){let n=e*(t+1),r=new Float32Array((n+2)*2);for(let n=0;n<e;n+=1)for(let i=0;i<=t;i+=1){let a=n*(t+1)+i;r[a*2]=n/(e-1),r[a*2+1]=i/t}return r[n*2]=0,r[(n+1)*2]=1,r}function H(){let e=new Float32Array(573);for(let t=0;t<N;t+=1)for(let n=0;n<=F;n+=1){let r=(t*7+n)*3;e[r]=t/26,e[r+1]=n/F}e[569]=1,e[570]=1,e[572]=1;let t=new o;return t.setAttribute(`position`,new c(e,3)),t.setAttribute(`uv`,new c(V(N,F),2)),t.setIndex(B(N,F)),t}function U(){let e=P,t=F,n=new Float32Array(405),r=new Float32Array(405),i=B(e,t),a=new u,s=new u,l=new u,d=new u,f=new u,p=new u,m=(e,t)=>{let n=e*4.55;t.set(Math.sin(n)*.72,(1-Math.cos(n))*.62-.68,Math.sin(e*Math.PI)*.23)};for(let r=0;r<e;r+=1){let e=r/18;m(e,a),m(Math.max(0,e-.004),s),m(Math.min(1,e+.004),l),d.subVectors(l,s).normalize(),f.set(0,0,1).addScaledVector(d,-d.z).normalize(),p.crossVectors(f,d).normalize();let i=.008+Math.sin(e*Math.PI)**.65*.062,o=i*.43;for(let e=0;e<=t;e+=1){let s=e/t*T,c=Math.cos(s)*i,l=Math.sin(s)*o,u=(r*7+e)*3;n[u]=a.x+f.x*c+p.x*l,n[u+1]=a.y+f.y*c+p.y*l,n[u+2]=a.z+f.z*c+p.z*l}if(r===0||r===18){let e=(133+(r===0?0:1))*3;n[e]=a.x,n[e+1]=a.y,n[e+2]=a.z}}for(let e=0;e<i.length;e+=3){let t=i[e]*3,a=i[e+1]*3,o=i[e+2]*3,s=n[a]-n[t],c=n[a+1]-n[t+1],l=n[a+2]-n[t+2],u=n[o]-n[t],d=n[o+1]-n[t+1],f=n[o+2]-n[t+2],p=c*f-l*d,m=l*u-s*f,h=s*d-c*u;for(let e of[t,a,o])r[e]=r[e]+p,r[e+1]=r[e+1]+m,r[e+2]=r[e+2]+h}for(let t=0;t<e;t+=1){let e=t*7*3,n=e+18,i=r[e]+r[n],a=r[e+1]+r[n+1],o=r[e+2]+r[n+2];r[e]=r[n]=i,r[e+1]=r[n+1]=a,r[e+2]=r[n+2]=o}for(let e=0;e<r.length;e+=3){let t=Math.hypot(r[e],r[e+1],r[e+2]);t<1e-9?(r[e]=0,r[e+1]=1,r[e+2]=0):(r[e]=r[e]/t,r[e+1]=r[e+1]/t,r[e+2]=r[e+2]/t)}let h=new o;return h.setAttribute(`position`,new c(n,3)),h.setAttribute(`normal`,new c(r,3)),h.setAttribute(`uv`,new c(V(e,t),2)),h.setIndex(i),h}function W(t,n,r,i,a){for(let[e,t]of Object.entries(a))n.setAttribute(e,t);let o=new e(n,r,i);return o.name=r.name,o.renderOrder=3,o.frustumCulled=!1,o.castShadow=o.receiveShadow=!1,t.add(o),o}var G=(e,t)=>new a(new Float32Array(e*t),t);function K(e,t=null){let n=b(),r=w(t,n),a=G(M.length,4),o=G(M.length,3),s=G(M.length,4);j.forEach((e,t)=>{let n=M[e];a.setXYZW(t,n.angle,n.radius,n.arc,n.bottom),o.setXYZ(t,n.rise,n.width,e*1.71),s.setXYZW(t,I(n.wave),e*1.83,I(n.wave*1.7),e*1.83*1.7)});let c=W(e,H(),C(`Wind_Aura_Streams`,ee,!0,n),M.length,{windStream:a,windStreamShape:o,windPulse:s}),l=968300463,u=()=>(l^=l<<13,l^=l>>>17,l^=l<<5,(l>>>0)/4294967296),d=G(k[0],4),f=G(k[0],3),p=G(k[0],3);for(let e=0;e<k[0];e+=1){let t=u(),n=1.4+u()*1.6,r=u()*T,i=2.18+u()*.87,a=-1.83+u()*2.51,o=.57+u()*.52,s=u()*T;d.setXYZW(e,t,L(n),r,i),f.setXYZ(e,a,o,s);let c=e%4==0?v:_;p.setXYZ(e,c.r,c.g,c.b)}let m=G(A[0],4),h=G(A[0],3),g=G(A[0],3);for(let e=0;e<A[0];e+=1){let t=u(),n=1.1+u()*1.4,r=u()*T,i=2+u()*1.02,a=-2.08+u()*.85,o=.023+u()*.014,s=u()*T;m.setXYZW(e,t,L(n),r,i),h.setXYZ(e,a,o,s);let c=e%6==0?y:e%3==0?v:_;g.setXYZ(e,c.r,c.g,c.b)}let x=W(e,U(),C(`Wind_Aura_Curls`,te,!0,n),k[0],{windCycle:d,windCurl:f,windTint:p}),S=W(e,new i(1,0),C(`Wind_Aura_Streaks`,z,!1,n),A[0],{windCycle:m,windSpark:h,windTint:g}),N=[c,x,S],P=0,F=0,B=0,V=!1,K=()=>{n.windClock.value=P,n.windOrbit.value=F,n.windMotion.value=B,n.windWave.value=P*R%T},q=e=>{c.count=O[e],x.count=k[e],S.count=A[e]};return q(0),K(),{step(e,t){V||!Number.isFinite(e)||e<=0||(P=(P+e)%E,F=(F+e%D*T/D)%T,B+=(+!!t-B)*(1-Math.exp(-e*3.2)),K())},setTier(e){V||q(e)},view(e){V||r(e)},reset(){V||(P=F=B=0,K())},dispose(){if(!V){V=!0;for(let e of N)e.removeFromParent(),e.geometry.dispose(),e.material.dispose(),e.dispose()}}}}var q=Math.PI*2,ne=[1.45,1.95,2.6],re=[3,4,6],ie=[4,2,1],ae=7.8,oe=2048,se=1024,ce=4096,J=e=>{let t=Math.sin(e*127.1+311.7)*43758.5453123;return t-Math.floor(t)};function Y(e){let t=e?36:26,n=new Float32Array((t+1)*7*3),r=new Float32Array((t+1)*7*2),i=[],a=new u,s=new u,l=new u,d=new u,f=new u,p=new u,m=(t,n)=>{if(e){let e=-.6+t*4.7,r=.18+t*.72;n.set(Math.cos(e)*r,t*.42+Math.sin(t*Math.PI)*.2,Math.sin(e)*r)}else n.set(Math.sin(t*Math.PI)*Math.sin(t*2.3+.3)*.33,Math.sin(t*Math.PI)*.1+t*.18,(.5-t)*3.4)};for(let o=0;o<=t;o+=1){let c=o/t,u=Math.max(.006,Math.sin(c*Math.PI)**.7);m(c,a),m(Math.max(0,c-.001),s),m(Math.min(1,c+.001),l),d.subVectors(l,s).normalize(),f.set(d.z,0,-d.x).normalize(),p.crossVectors(d,f).normalize();for(let s=0;s<=6;s+=1){let l=s/6*Math.PI*2,d=o*7+s,m=Math.cos(l)*u*(e?.1:.14),h=Math.sin(l)*u*(e?.045:.055);if(n[d*3]=a.x+f.x*m+p.x*h,n[d*3+1]=a.y+f.y*m+p.y*h,n[d*3+2]=a.z+f.z*m+p.z*h,r[d*2]=c,r[d*2+1]=s/6,o<t&&s<6){let e=d+7;i.push(d,d+1,e,d+1,e+1,e)}}}let h=new o;h.setAttribute(`position`,new c(n,3)),h.setAttribute(`uv`,new c(r,2)),h.setIndex(i),h.computeVertexNormals();let g=h.getAttribute(`normal`);for(let e=0;e<=t;e+=1){let t=e*7,n=t+6;a.fromBufferAttribute(g,t),s.fromBufferAttribute(g,n),a.add(s).normalize(),g.setXYZ(t,a.x,a.y,a.z),g.setXYZ(n,a.x,a.y,a.z)}return h}var X=`
  ${x}
  // Коробка формы детали: по ней ищется нижняя точка при любом наклоне.
  uniform vec3 windBoxLow, windBoxHigh;
  attribute vec3 windOrigin;
  // Рождение, задержка, срок, наибольшая прозрачность.
  attribute vec4 windTiming;
  // Направление пути по X и Z, высота и её прирост.
  attribute vec4 windFlow;
  // Сдвиг вбок и его прирост, вдоль пути и его прирост.
  attribute vec4 windMove;
  // Наклон по X, курс, наклон по Z, доворот курса.
  attribute vec4 windTurn;
  attribute vec3 windSize;
  // Цвет и затравка перелива.
  attribute vec4 windTint;
  void main() {
    float life = windTiming.z;
    float time = windClock - windTiming.x - windTiming.y;
    vec3 size;
    float alpha;
    #if WIND_KIND == 0
      float grow = windSmooth(time / 0.09);
      float fade = 1.0 - windSmooth((time - life * 0.46) / (life * 0.54));
      size = vec3(windSize.x * grow * (0.45 + fade * 0.55), windSize.y * grow, windSize.z * (0.7 + grow * 0.3));
      alpha = grow * fade;
      bool alive = time > 0.0 && time < life;
    #elif WIND_KIND == 1
      float grow = windSmooth(time / 0.18);
      float fade = 1.0 - windSmooth((time - life * 0.42) / (life * 0.58));
      float expansion = windSize.x * (0.66 + grow * 0.34 + time * 0.38);
      size = vec3(expansion, windSize.y * grow, expansion);
      alpha = grow * fade;
      bool alive = time > 0.0 && time < life;
    #else
      float envelope = windSmooth(time / 0.045) * (1.0 - windSmooth((time - life * 0.30) / (life * 0.70)));
      float hold = max(0.003, envelope);
      size = vec3(windSize.x * hold, windSize.x * hold * 0.72, windSize.z * hold);
      alpha = envelope;
      bool alive = time >= 0.0 && time < life;
    #endif
    // Ещё не родившаяся или отжившая частица стягивается в точку.
    if (!alive) { size = vec3(0.0); alpha = 0.0; }
    float side = windMove.x + windMove.y * time;
    float along = windMove.z + windMove.w * time;
    vec2 flow = windFlow.xy;
    vec3 centre = windOrigin + vec3(flow.y * side + flow.x * along, windFlow.z + windFlow.w * time,
      -flow.x * side + flow.y * along);
    mat3 turn = windEuler(vec3(windTurn.x, windTurn.y + windTurn.w * time, windTurn.z));
    // Пол — высота ступней на станции. Нижняя точка повёрнутой коробки детали
    // держится над ним на TRAIL_FLOOR: наклонённая струя или завиток не уходит
    // под землю, а при пониженной высоте следа ложится на эту границу.
    vec3 lean = vec3(turn[0].y, turn[1].y, turn[2].y);
    vec3 low = min(lean * windBoxLow * size, lean * windBoxHigh * size);
    centre.y = max(centre.y, windOrigin.y + ${m.toFixed(3)} - (low.x + low.y + low.z));
    vec4 mvPosition = modelViewMatrix * vec4(centre + turn * (position * size), 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <logdepthbuf_vertex>
    vWindView = -mvPosition.xyz;
    vWindNormal = normalize(normalMatrix * (turn * (normal / max(size, vec3(0.000001)))));
    vWindColour = windTint.rgb;
    vWindUv = uv;
    vWindAlpha = alpha * windTiming.w;
    vWindSeed = windTint.w;
  }`;function Z(t,r,i,o){let s=e=>new a(new Float32Array(o*e),e).setUsage(n),c=s(3),l=s(4),u=s(4),d=s(4),f=s(4),p=s(3),m=s(4);r.setAttribute(`windOrigin`,c),r.setAttribute(`windTiming`,l),r.setAttribute(`windFlow`,u),r.setAttribute(`windMove`,d),r.setAttribute(`windTurn`,f),r.setAttribute(`windSize`,p),r.setAttribute(`windTint`,m),r.computeBoundingBox();let g=r.boundingBox;i.uniforms.windBoxLow={value:g.min.clone()},i.uniforms.windBoxHigh={value:g.max.clone()};let _=new e(r,i,o);return _.instanceMatrix.array.fill(0),_.name=i.name,_.renderOrder=3,_.count=0,_.visible=!1,_.frustumCulled=!1,_.castShadow=!1,_.receiveShadow=!1,t.add(_),{mesh:_,origin:c,timing:l,flow:u,move:d,turn:f,size:p,tint:m,attributes:[c,l,u,d,f,p,m],born:new Float64Array(o),span:new Float64Array(o),capacity:o,count:0,slots:h(),appendStart:-1,rebased:!1}}function le(e){e.count=e.mesh.count=0,e.mesh.visible=!1,e.slots.clear(),e.appendStart=-1,e.rebased=!1;for(let t of e.attributes)t.clearUpdateRanges()}function ue(e,t){let n=0;for(;n<e.count;){if(t-e.born[n]<e.span[n]){n+=1;continue}let r=--e.count;if(n!==r){e.born[n]=e.born[r],e.span[n]=e.span[r];for(let t of e.attributes){let e=t.itemSize;t.array.copyWithin(n*e,r*e,(r+1)*e)}e.slots.moved(n)}}}function de(e,t){for(let n=0;n<e.count;n+=1)e.born[n]=e.born[n]-t,e.timing.setX(n,e.born[n]);e.rebased=!0}function Q(e){e.mesh.count=e.count,e.mesh.visible=e.count>0;for(let t of e.attributes){let n=t.itemSize,r=!1;t===e.timing&&e.rebased&&e.count>0?(t.addUpdateRange(0,e.count*n),r=!0):r=e.slots.upload(t,e.appendStart,e.count),r&&(t.needsUpdate=!0)}e.slots.clear(),e.appendStart=-1,e.rebased=!1}function fe(e){e.mesh.removeFromParent(),e.mesh.geometry.dispose(),e.mesh.material.dispose(),e.mesh.dispose()}function pe(e,t,n=null,r=f){let a=r.thickness,o=r.height,s=b(),c=Z(e,Y(!1),C(`Wind_Trail_Streams`,X,!0,s,{WIND_KIND:0}),oe),d=Z(e,Y(!0),C(`Wind_Trail_Curls`,X,!0,s,{WIND_KIND:1}),se),m=Z(e,new i(1,0),C(`Wind_Trail_Strokes`,X,!1,s,{WIND_KIND:2}),ce),h=[c,d,m],g=w(n,s),x=p(512),S=new u,T=new l,E=0,D=0,O=0,k=0,A=!1,j=(e,t,n,r,i,a,o,s)=>{if(e.count===e.capacity||D-t>=n+r)return-1;let c=e.count++;return e.appendStart<0&&(e.appendStart=c),e.born[c]=t,e.span[c]=n+r,e.origin.setXYZ(c,a,o,s),e.timing.setXYZW(c,t,n,r,i),c},M=(e,t,n)=>{e.tint.setXYZW(t,T.r,T.g,T.b,n%q)},N=(e,t,n,r,i,s)=>{let l=k++,u=Math.atan2(i,s);if(l%7<5)for(let d=0;d<2;d+=1){let f=l*13.31+d*2.17,p=J(f),m=d===0?-1:1,h=j(c,r,d*.045,1.1+p*.35,.66+p*.19,e,t,n);h<0||(c.flow.setXYZW(h,i,s,(.2+p*.38)*o,(.2+p*.12)*o),c.move.setXYZW(h,m*(.44+p*.43)*a,m*(.23+p*.24)*a,(J(f+1)-.5)*.75,-(.8+p*.6)),c.turn.setXYZW(h,Math.sin(f)*.09,u+m*.1,Math.cos(f)*.18,m*.13),c.size.setXYZ(h,(.7+p*.55)*a,(.75+p*.4)*a,.58+J(f+2)*.4),T.copy(_).lerp(d===0?v:y,.16+p*.17),M(c,h,f))}if(l%re[E]===0)for(let c=0;c<2;c+=1){let f=l*6.17+c*3.71,p=J(f),m=c===0?-1:1,h=j(d,r,.12+p*.13,1.28+p*.24,.72,e,t,n);h<0||(d.flow.setXYZW(h,i,s,.28*o,(.3+p*.3)*o),d.move.setXYZW(h,m*(.78+p*.38)*a,m*.44*a,0,-.48),d.turn.setXYZW(h,m*(.18+p*.32),u+f%q,Math.sin(f)*.32,m*1.4),d.size.setXYZ(h,(.56+p*.34)*a,(.62+p*.58)*a,0),T.copy(_).lerp(c===0?y:v,.25),M(d,h,f))}for(let c=0;c<ie[E];c+=1){let d=l*9.71+c*2.39,f=J(d),p=j(m,r,c*.035,.58+f*.44,.74,e,t,n);p<0||(m.flow.setXYZW(p,i,s,(.2+J(d+2)*1.25)*o,.26*o),m.move.setXYZW(p,(f-.5)*3.5*a,Math.sin(d)*.42*a,(J(d+1)-.5)*.85,-(2.1+f*1.5)),m.turn.setXYZW(p,Math.sin(d)*.06,u+Math.cos(d)*.14,0,0),m.size.setXYZ(p,(.013+f*.014)*a,0,.13+f*.28),T.copy(c%3==0?v:_).lerp(y,.08),M(m,p,d))}},P=()=>{for(let e of h)le(e);D=O=k=0,s.windClock.value=s.windWave.value=0;for(let e of h)Q(e)};return{setTier(e){A||(E=e)},step(e,n){if(A)return;t.getWorldPosition(S);let r=x.step(S.x,S.y,S.z,e,n,ne[E]);if(x.cleared){P();return}if(!Number.isFinite(e)||e<=0)return;if(D+=e,O=(O+e*ae)%q,D>=128){let e=Math.floor(D/128)*128;D-=e;for(let t of h)de(t,e)}for(let e of h)ue(e,D);let i=Math.hypot(x.direction[0],x.direction[2]),a=i>1e-4?x.direction[0]/i:0,o=i>1e-4?x.direction[2]/i:1;for(let e=0;e<r;e+=1){let t=e*3;N(x.positions[t],x.positions[t+1],x.positions[t+2],D-x.elapsed[e],a,o)}s.windClock.value=D,s.windWave.value=O;for(let e of h)Q(e)},view(e){A||g(e)},reset(){A||(P(),x.reset())},dispose(){if(!A){A=!0;for(let e of h)fe(e)}}}}var $=e=>e.character?.getObjectByName(`mixamorigHead_06`)??null;function me(e,t,n,r=f){return pe(e,t,$(n),r)}function he(e,t,n){return K(t,$(n))}export{he as createWindAuraEffect,me as createWindTrailEffect};