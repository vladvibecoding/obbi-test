//# allFunctionsCalledOnLoad
import{$ as e,B as t,Cr as n,P as r,R as i,Tr as a,Xn as o,Y as s,Z as c,Zn as l,d as u,l as d,tr as f,u as p,v as m,wr as h}from"./three.core-DVTiNhEy.js";import{o as g}from"./src-BI6MMqKu.js";import{n as _,r as v,t as y}from"./trail-shape-BsaeWHuc.js";import{t as b}from"./trail-slots-BYU9mmsR.js";var x=[`red`,`orange`,`yellow`,`green`,`cyan`,`blue`,`violet`].map(e=>new m(g(e))),S=new m(g(`white`)),C=`
  mat3 prismEuler(vec3 angle) {
    float a = cos(angle.x), b = sin(angle.x), c = cos(angle.y), d = sin(angle.y);
    float e = cos(angle.z), f = sin(angle.z);
    float ae = a * e, af = a * f, be = b * e, bf = b * f;
    return mat3(c * e, af + be * d, bf - ae * d,
      -c * f, ae - bf * d, be + af * d,
      d, -b * c, a * c);
  }`;function w(){let e=[0,0,.15,0,0,-.15],n=[.5,.5,.5,.5],r=[];for(let t=0;t<8;t+=1){let i=t*Math.PI/4,a=t%2==0?1:.24,o=Math.cos(i)*a,s=Math.sin(i)*a;e.push(o,s,0),n.push(o*.5+.5,s*.5+.5);let c=t+2,l=(t+1)%8+2;r.push(0,c,l,1,l,c)}let i=new u;return i.setAttribute(`position`,new t(e,3)),i.setAttribute(`uv`,new t(n,2)),i.setIndex(r),i.computeVertexNormals(),i}var T=`
  #include <common>
  #include <logdepthbuf_pars_fragment>
  uniform float prismFaceEnabled;
  uniform vec3 prismWhite, prismFaceCentre;
  uniform vec2 prismFaceRadius;
  varying vec3 vPrismView, vPrismNormal, vPrismColour;
  varying float vPrismAlpha;
  #ifdef PRISM_RIBBON
    uniform float prismSilkClock;
    varying float vPrismSilk, vPrismAcross;
  #endif
  void main() {
    if (vPrismAlpha < 0.003) discard;
    if (prismFaceEnabled > 0.5 && vPrismView.z < prismFaceCentre.z + prismFaceRadius.y) {
      vec2 offset = vPrismView.xy / max(vPrismView.z, 0.001)
        - prismFaceCentre.xy / max(prismFaceCentre.z, 0.001);
      float offAxis = sqrt(1.0 + dot(prismFaceCentre.xy, prismFaceCentre.xy)
        / max(prismFaceCentre.z * prismFaceCentre.z, 0.0001));
      vec2 radius = prismFaceRadius * offAxis / max(prismFaceCentre.z - prismFaceRadius.x, 0.1);
      if (dot(offset / radius, offset / radius) < 1.0) discard;
    }
    vec3 normal = normalize(vPrismNormal) * (gl_FrontFacing ? 1.0 : -1.0);
    vec3 view = normalize(vPrismView + vec3(0.0001));
    vec3 light = normalize(mat3(viewMatrix) * vec3(-0.35, 0.84, 0.42));
    float rim = pow(1.0 - max(0.0, dot(normal, view)), 3.0);
    float gloss = pow(max(0.0, dot(normal, normalize(light + view))), 52.0);
    float alpha = vPrismAlpha;
    vec3 colour = vPrismColour * (0.86 + max(0.0, dot(normal, light)) * 0.21);
    #ifdef PRISM_RIBBON
      float edge = abs(vPrismAcross * 2.0 - 1.0);
      float silk = sin(vPrismSilk - prismSilkClock);
      colour *= 0.99 + silk * 0.018;
      colour = mix(colour, prismWhite, gloss * 0.18 + rim * 0.04);
      alpha *= 1.0 - smoothstep(0.97, 1.0, edge) * 0.18;
    #else
      colour = mix(colour, prismWhite, gloss * 0.27 + rim * 0.10);
    #endif
    #include <logdepthbuf_fragment>
    gl_FragColor = vec4(colour, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;function E(e,t,r,i,a={}){return new o({name:e,defines:i?{...a,PRISM_RIBBON:1}:a,transparent:!0,depthWrite:!1,side:2,forceSinglePass:!0,toneMapped:!0,uniforms:{...r,prismWhite:{value:S},prismFaceCentre:{value:new h},prismFaceRadius:{value:new n(1.05,1.05)},prismFaceEnabled:{value:0}},vertexShader:t,fragmentShader:T})}function D(e,t){let n=e?.getObjectByName(`mixamorigHead_06`);if(n===void 0)return()=>void 0;let r=new h,i=new h;return e=>{e.updateMatrixWorld(),n.updateWorldMatrix(!0,!1),r.set(-.00570525,.6573547,.02455115),n.localToWorld(r);let a=1.00256*n.matrixWorld.getMaxScaleOnAxis()+.14;i.copy(r).applyMatrix4(e.matrixWorldInverse).multiplyScalar(-1);let o=Number.isFinite(i.lengthSq())&&i.z>.1?1:0;for(let e of t)e.uniforms.prismFaceCentre.value.copy(i),e.uniforms.prismFaceRadius.value.set(a,a),e.uniforms.prismFaceEnabled.value=o}}var O=Math.PI*2,k=7,A=29,j=28,M=128,N=[4,3,2],P=[28,18,10],F=[{radius:2.77,width:1.1,height:-.96,span:3.6,offset:0,tiltX:.17,tiltZ:-.22,wave:.64},{radius:3.17,width:1.26,height:.27,span:3.55,offset:Math.PI,tiltX:-.3,tiltZ:.28,wave:.77},{radius:3.45,width:.88,height:-.25,span:3.3,offset:Math.PI/2,tiltX:.34,tiltZ:.1,wave:.7},{radius:2.95,width:.94,height:.66,span:3.35,offset:Math.PI*1.5,tiltX:-.13,tiltZ:-.35,wave:.83}],I=[{name:`Prism_Aura_Confetti`,count:48,budget:[48,28,16],opacity:.88,tumble:[.93,.64,.46]},{name:`Prism_Aura_Stars`,count:28,budget:[28,16,10],opacity:.94,tumble:[.31,.22,.81]},{name:`Prism_Aura_Magic_Dust`,count:112,budget:[112,64,34],opacity:.61,tumble:[.31,.22,.46]}],L=e=>e-Math.floor(e/O)*O,R=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform vec2 prismRibbonPhase[${F.length}];
  uniform float prismMotion;
  // Радиус, ширина, высота и размах дуги ленты; наклон её плоскости.
  attribute vec4 prismRibbon;
  attribute vec2 prismTilt;
  attribute vec3 prismTint;
  // Сужение ленты к концам в этом ряду и его разность на ±0.01 вдоль ленты.
  attribute vec2 prismTaper;
  varying vec3 vPrismView, vPrismNormal, vPrismColour;
  varying float vPrismAlpha, vPrismSilk, vPrismAcross;

  void main() {
    // Фаза волны и угол обхода ленты; экземпляр — номер ленты.
    vec2 phase = prismRibbonPhase[gl_InstanceID];
    float a = cos(prismTilt.x), b = sin(prismTilt.x), e = cos(prismTilt.y), f = sin(prismTilt.y);
    mat3 tilt = mat3(e, a * f, b * f, -f, a * e, b * e, 0.0, -b, a);
    // Позиция вершины заготовки — место вдоль ленты, поперёк полос и сторона слоя.
    float t = position.x, v = position.y;
    float outer = position.z < 0.5 ? 1.0 : -1.0;
    float thickness = 0.028 * outer;
    // Точка ленты считается один раз: компилятор Direct3D разворачивает каждый
    // вызов функции целиком, а время сборки шейдера растёт с его длиной, и
    // соседние точки для нормали стоили бы впятеро.
    float sway = t * 4.1 + phase.x, swell = t * 4.4 - phase.x, breadth = t * 3.8 + phase.x;
    float sag = t * 3.4 - phase.x, rise = t * 5.3 + phase.x, crease = t * 7.1 + v * 2.9 - phase.x;
    float angle = phase.y + (t - 0.5) * prismRibbon.w + sin(sway) * 0.065;
    float radius = prismRibbon.x + sin(swell) * 0.055;
    float width = prismRibbon.y + sin(breadth) * 0.13;
    float taper = prismTaper.x, sinCrease = sin(crease), cosCrease = cos(crease);
    float across = (v - 0.5) * width * taper;
    float stretch = 1.0 + sin(sag) * 0.18;
    float y = across * stretch + sin(rise) * 0.10;
    float reach = radius + sinCrease * 0.045 + thickness;
    float c = cos(angle), s = sin(angle);
    vec3 point = tilt * vec3(c * reach, y, s * reach) + vec3(0.0, prismRibbon.z, -prismMotion * 0.14);
    // Поперёк полос — разность точек на ±0.01, как у поверхности: от места
    // поперёк зависят только сдвиг и складка, а разность синусов складки —
    // 2·cos·sin(0.029).
    float foldGap = cosCrease * ${(2*Math.sin(.029)*.045).toPrecision(8)};
    vec3 alongV = tilt * vec3(c * foldGap, 0.02 * width * taper * stretch, s * foldGap);
    // Вдоль ленты — производные тех же волн на шаг 0.02; сужение — разностью
    // на ±0.01, потому что у концов у него нет производной.
    float turning = prismRibbon.w + cos(sway) * ${(.065*4.1).toFixed(4)};
    float reaching = cos(swell) * ${(.055*4.4).toFixed(3)} + cosCrease * ${(.045*7.1).toFixed(4)};
    float widening = (v - 0.5) * (cos(breadth) * ${.494.toFixed(3)} * taper * 0.02 + width * prismTaper.y);
    float lifting = widening * stretch
      + (across * cos(sag) * ${.612.toFixed(3)} + cos(rise) * ${.53.toFixed(2)}) * 0.02;
    vec3 alongT = tilt * vec3((c * reaching - s * reach * turning) * 0.02, lifting,
      (s * reaching + c * reach * turning) * 0.02);
    vec3 surface = normalize(cross(alongV, alongT)) * outer;
    vec4 mvPosition = modelViewMatrix * vec4(point, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <logdepthbuf_vertex>
    vPrismView = -mvPosition.xyz;
    vPrismNormal = normalize(normalMatrix * surface);
    vPrismColour = prismTint;
    vPrismAlpha = 0.96;
    vPrismSilk = t * 54.0 + v * 8.0;
    vPrismAcross = v;
  }`,ee=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  // Обход нечётных и чётных бликов, качание, поворот; пульс наклона, размера и яркости.
  uniform vec4 prismGlimmerClock;
  uniform vec3 prismGlimmerPulse;
  uniform float prismMotion;
  // Фаза, радиус, высота, размер.
  attribute vec4 prismGlimmer;
  attribute vec3 prismTint;
  varying vec3 vPrismView, vPrismNormal, vPrismColour;
  varying float vPrismAlpha;
  ${C}
  void main() {
    float phase = prismGlimmer.x;
    float angle = phase + (mod(float(gl_InstanceID), 2.0) > 0.5 ? prismGlimmerClock.x : prismGlimmerClock.y);
    vec3 centre = vec3(cos(angle) * prismGlimmer.y, prismGlimmer.z + sin(prismGlimmerClock.z + phase) * 0.085,
      sin(angle) * prismGlimmer.y - prismMotion * 0.12);
    mat3 rotation = prismEuler(vec3(phase * 0.28, prismGlimmerClock.w + phase, sin(prismGlimmerPulse.x + phase) * 0.24));
    float size = prismGlimmer.w * (0.88 + sin(prismGlimmerPulse.y + phase) * 0.12);
    vec4 mvPosition = modelViewMatrix * vec4(centre + rotation * (position * size), 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <logdepthbuf_vertex>
    vPrismView = -mvPosition.xyz;
    vPrismNormal = normalize(normalMatrix * (rotation * normal));
    vPrismColour = prismTint;
    vPrismAlpha = 0.31 + sin(prismGlimmerPulse.z + phase) * 0.16;
  }`,te=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float prismClock;
  uniform float prismMotion;
  // Фаза жизни, доля жизни в секунду, фаза обхода, угловая скорость обхода.
  attribute vec4 prismCycle;
  // Фазы поворота вокруг X, Y и Z, скорость кувырка.
  attribute vec4 prismTurn;
  // Постоянные: сдвиг волны радиуса, сдвиг качания, радиус, высота.
  attribute vec4 prismShape;
  // Размер и подъём за жизнь.
  attribute vec2 prismSize;
  attribute vec3 prismTint;
  varying vec3 vPrismView, vPrismNormal, vPrismColour;
  varying float vPrismAlpha;
  ${C}
  void main() {
    float age = fract(prismCycle.x + prismClock * prismCycle.y);
    float angle = prismCycle.z + prismClock * prismCycle.w;
    vec3 turn = prismTurn.xyz + prismClock * prismTurn.w * PRISM_TUMBLE;
    float envelope = smoothstep(0.0, 0.10, age) * (1.0 - smoothstep(0.65, 0.85, age));
    float size = prismSize.x * max(0.001, envelope);
    float radius = prismShape.z + sin(angle * 2.0 + prismShape.x) * 0.08;
    vec3 centre = vec3(cos(angle) * radius,
      prismShape.w + sin(turn.z + prismShape.y) * 0.10 + prismSize.y * (age - 0.5),
      sin(angle) * radius - prismMotion * 0.16);
    mat3 rotation = prismEuler(turn);
    #ifdef PRISM_CONFETTI
      vec3 scale = vec3(size * 0.12, size * 0.25, size * 0.036);
    #else
      vec3 scale = vec3(size);
    #endif
    vec4 mvPosition = modelViewMatrix * vec4(centre + rotation * (position * scale), 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <logdepthbuf_vertex>
    vPrismView = -mvPosition.xyz;
    vPrismNormal = normalize(normalMatrix * (rotation * (normal / scale)));
    vPrismColour = prismTint;
    // Альфа убывает вслед за размером; конец жизни не превращается в резкий вспыхивающий кадр.
    vPrismAlpha = PRISM_OPACITY * smoothstep(0.0, 0.065, age) * (1.0 - smoothstep(0.76, 0.85, age));
  }`;function ne(){let e=new l;for(let t=0;t<10;t+=1){let n=Math.PI/2+t*Math.PI/5,r=t%2==0?1:.43,i=Math.cos(n)*r,a=Math.sin(n)*r;t===0?e.moveTo(i,a):e.lineTo(i,a)}e.closePath();let t=new i(e,{depth:.15,steps:1,curveSegments:1,bevelEnabled:!0,bevelThickness:.025,bevelSize:.025,bevelSegments:1});return t.translate(0,0,-.075),t}function re(){let e=new Float32Array(2436),t=new Float32Array(2436),n=new Float32Array(1624),r=e=>.48+Math.max(0,Math.sin(e*Math.PI))**.7*.52,i=[],a=(e,t,n,r)=>(e*A+t)*4+n*2+r;for(let i=0;i<k;i+=1)for(let o=0;o<A;o+=1)for(let s=0;s<2;s+=1)for(let c=0;c<2;c+=1){let l=a(i,o,s,c)*3,u=x[i],d=o/28;e[l]=d,e[l+1]=(i+s)/k,e[l+2]=c,t[l]=u.r,t[l+1]=u.g,t[l+2]=u.b,n.set([r(d),r(d+.01)-r(d-.01)],l/3*2)}let o=(e,t,n)=>{i.push(e,t,n)},s=(e,t)=>{o(e,e+1,t),o(t,e+1,t+1)};for(let e=0;e<k;e+=1){for(let t=0;t<28;t+=1){let n=a(e,t,0,0),r=a(e,t,1,0),i=a(e,t+1,0,0),s=a(e,t+1,1,0);o(n,r,i),o(r,s,i),o(n+1,i+1,r+1),o(r+1,i+1,s+1)}s(a(e,0,0,0),a(e,0,1,0)),s(a(e,28,1,0),a(e,28,0,0))}for(let e=0;e<28;e+=1)s(a(0,e+1,0,0),a(0,e,0,0)),s(a(6,e,1,0),a(6,e+1,1,0));let c=new u;return c.setAttribute(`position`,new p(e,3)),c.setAttribute(`prismTint`,new p(t,3)),c.setAttribute(`prismTaper`,new p(n,2)),c.setIndex(i),c}function z(e,t,n){e.frustumCulled=!1,e.castShadow=e.receiveShadow=!1,e.renderOrder=n,t.add(e)}function B(t){let r={value:0},i={value:0},o={value:F.map(()=>new n)},l={value:0},u={value:new a},f={value:new h},p=E(`Prism_Aura_Open_Ribbons`,R,{prismRibbonPhase:o,prismMotion:r,prismSilkClock:l},!0),m=re(),g=new c(new Float32Array(F.length*4),4),_=new c(new Float32Array(F.length*2),2);F.forEach((e,t)=>{g.setXYZW(t,e.radius,e.width,e.height,e.span),_.setXY(t,e.tiltX,e.tiltZ)}),m.setAttribute(`prismRibbon`,g),m.setAttribute(`prismTilt`,_);let v=new e(m,p,F.length);v.name=p.name,z(v,t,2);let y=E(`Prism_Aura_Faceted_Glimmers`,ee,{prismGlimmerClock:u,prismGlimmerPulse:f,prismMotion:r},!1),b=w(),S=new c(new Float32Array(112),4),C=new c(new Float32Array(84),3),T=1168033815,D=()=>(T^=T<<13,T^=T>>>17,T^=T<<5,(T>>>0)/4294967296);for(let e=0;e<j;e+=1){let t=D()*O,n=2.77+D()*.58,r=-1.78+D()*2.98,i=.047+D()*.055;S.setXYZW(e,t,n,r,i);let a=x[e%k];C.setXYZ(e,a.r,a.g,a.b)}b.setAttribute(`prismGlimmer`,S),b.setAttribute(`prismTint`,C);let A=new e(b,y,j);A.name=y.name,z(A,t,3),T=1917786541;let B=I.map((n,a)=>{let o=E(n.name,te,{prismClock:i,prismMotion:r},!1,{PRISM_TUMBLE:`vec3(${n.tumble.map(e=>e.toFixed(2)).join(`, `)})`,PRISM_OPACITY:n.opacity.toFixed(2),...a===0?{PRISM_CONFETTI:1}:{}}),l=a===0?new d(1,1,1):a===1?ne():new s(1,0),u=n.count,f=new c(new Float32Array(u*4),4),p=new c(new Float32Array(u*4),4),m=new c(new Float32Array(u*4),4),h=new c(new Float32Array(u*2),2),g=new c(new Float32Array(u*3),3),_=new Float64Array(u*5),v=new Float64Array(u*5);for(let e=0;e<u;e+=1){let t=D(),r=3.6+D()*3.2,i=D()*O,o=2.15+D()*1.42,s=-1.4+D()*2.5,c=18+D()*17,l=D()*O,u=D()*O,d=D()*O,y=a===0?.85+D()*.35:a===1?.13+D()*.07:.025+D()*.035,b=(a===0?-.48:a===1?.22:.38)*(.8+D()*.4),S=.7+D()*.6,C=e*5;_.set([t,i,l,u,d],C),v.set([1/r,O/c,S*n.tumble[0],S*n.tumble[1],S*n.tumble[2]],C),f.setXYZW(e,t,1/r,i,O/c),p.setXYZW(e,l,u,d,S),m.setXYZW(e,i,l,o,s),h.setXY(e,y,b);let w=x[(e+a*2)%k];g.setXYZ(e,w.r,w.g,w.b)}l.setAttribute(`prismCycle`,f),l.setAttribute(`prismTurn`,p),l.setAttribute(`prismShape`,m),l.setAttribute(`prismSize`,h),l.setAttribute(`prismTint`,g);let y=new e(l,o,u);return y.name=n.name,z(y,t,3),{mesh:y,material:o,cycle:f,turn:p,budget:n.budget,initial:_,phases:_.slice(),rates:v}}),V=[p,y,...B.map(e=>e.material)],H=0,U=0,W=0,G=0,K=!1,q=()=>{for(let e of B){for(let t=0;t<e.cycle.count;t+=1){let n=t*5,r=e.phases;e.cycle.setX(t,r[n]),e.cycle.setZ(t,r[n+1]),e.turn.setXYZ(t,r[n+2],r[n+3],r[n+4])}e.cycle.needsUpdate=e.turn.needsUpdate=!0}},J=e=>{for(let t of B){let n=t.phases,r=t.rates;for(let t=0;t<n.length;t+=5){let i=n[t]+e*r[t];n[t]=i-Math.floor(i);for(let i=1;i<5;i+=1)n[t+i]=L(n[t+i]+e*r[t+i])}}q()},Y=()=>{v.count=N[H],A.count=P[H];for(let e of B)e.mesh.count=e.budget[H]},X=()=>{r.value=G,i.value=W,F.forEach((e,t)=>{o.value[t].set(L(U*e.wave+t*1.9),L(U*O/11+e.offset))}),l.value=L(U*1.8),u.value.set(L(U*O/10),L(U*O/12),L(U*.43),L(U*.34)),f.value.set(L(U*.28),L(U*.61),L(U*.72))},ie=()=>{U=W=G=0;for(let e of B)e.phases.set(e.initial);q(),X()};return Y(),X(),{materials:V,setTier(e){K||(H=e,Y())},step(e,t){if(!(K||!Number.isFinite(e)||e<=0)){if(U+=e,W+=e,W>=M){let e=Math.floor(W/M)*M;W-=e,J(e)}G+=(+!!t-G)*(1-Math.exp(-e*3)),X()}},reset(){K||ie()},dispose(){if(!K){K=!0;for(let e of[v,A,...B.map(e=>e.mesh)])e.removeFromParent(),e.geometry.dispose(),e.dispose();for(let e of V)e.dispose()}}}}var V=Math.PI*2,H=7,U=1.9,W=1.15,G=[.7,1.25,2.3],K=3072,q=1280,J=[.22,.36,.31,.52],Y=[1.3,2,1.7,2.3],X=5.4,ie=1.8,Z=y.toFixed(2),Q=e=>e-Math.floor(e/V)*V,ae=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float prismClock;
  // Облик следа: толщина множит ширину, слой и изгиб вбок, высота — всё над ступнями.
  uniform float trailShapeThickness, trailShapeHeight;
  uniform vec4 prismWave;
  attribute vec2 prismBorn;
  attribute vec3 prismTint;
  varying vec3 vPrismView, vPrismNormal, vPrismColour;
  varying float vPrismAlpha, vPrismSilk, vPrismAcross;
  void main() {
    // Матрица экземпляра — данные двух соседних станций, а не преобразование:
    // старшая станция и фаза ряби, младшая и путь между ними, курсы обеих,
    // фазы волн старшей. Сетку между станциями строит шейдер.
    vec4 older = instanceMatrix[0], newer = instanceMatrix[1];
    vec4 course = instanceMatrix[2], phases = instanceMatrix[3];
    // Позиция вершины заготовки — ряд (0 — старшая станция), полоса и угол.
    float row = position.x, band = position.y, corner = position.z;
    vec3 station = row < 0.5 ? older.xyz : newer.xyz;
    vec2 heading = row < 0.5 ? course.xy : course.zw;
    float path = row * newer.w;
    vec4 wave = phases + path * vec4(${J.map(e=>e.toFixed(2)).join(`, `)}) - prismWave;
    float age = prismClock - (row < 0.5 ? prismBorn.x : prismBorn.y);
    float life = smoothstep(0.0, 0.09, age) * (1.0 - smoothstep(1.16, 1.90, age));
    float width = (1.88 + sin(wave.x) * 0.15) * max(0.014, life) * trailShapeThickness;
    float roll = sin(wave.y) * 0.27;
    float bend = sin(wave.z) * 0.20 * trailShapeThickness;
    float height = 1.02 * trailShapeHeight + sin(wave.w) * 0.24 * trailShapeHeight;
    float c = cos(roll), s = sin(roll);
    float thickness = 0.046 * max(0.06, life) * trailShapeThickness;
    float v = (band + mod(corner, 2.0)) / ${H.toFixed(1)};
    float side = (v * 2.0 - 1.0) * width;
    float lift = corner < 1.5 ? thickness * 0.5 : -thickness * 0.5;
    vec3 sideways = vec3(heading.y, 0.0, -heading.x);
    // Крен поднимает край ленты, и высота сжимает этот подъём вместе с остальным.
    vec3 point = station + sideways * (bend + side * c - lift * s)
      + vec3(0.0, height + side * s * trailShapeHeight + lift * c, 0.0);
    // Опущенный креном край низкой или широкой ленты ложится на пол следа, а не под него.
    point.y = max(point.y, station.y + ${Z});
    // Нормаль — из производных той же формы вдоль пути и поперёк ленты: соседние
    // отрезки сходятся на общей станции с одной нормалью, и лента не гранится.
    float twist = cos(wave.y) * 0.27 * 0.36;
    vec3 tangent = vec3(heading.x, 0.0, heading.y)
      + sideways * (cos(wave.z) * 0.20 * 0.31 * trailShapeThickness - side * s * twist)
      + vec3(0.0, cos(wave.w) * 0.24 * 0.52 * trailShapeHeight + side * c * twist * trailShapeHeight, 0.0);
    vec3 across = sideways * c + vec3(0.0, s * trailShapeHeight, 0.0);
    vec3 surface = normalize(cross(tangent, across)) * (corner < 1.5 ? 1.0 : -1.0);
    vec4 mvPosition = modelViewMatrix * vec4(point, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <logdepthbuf_vertex>
    vPrismView = -mvPosition.xyz;
    vPrismNormal = normalize(normalMatrix * surface);
    vPrismColour = prismTint;
    vPrismAlpha = life * 0.94;
    vPrismSilk = older.w + path * ${X.toFixed(1)} + v * 8.0;
    vPrismAcross = v;
  }`,oe=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float prismClock;
  // Облик следа: высота множит подъём блика; разлёт вбок и размер помножены на толщину при записи.
  uniform float trailShapeHeight;
  attribute float prismBorn;
  varying vec3 vPrismView, vPrismNormal, vPrismColour;
  varying float vPrismAlpha;
  ${C}
  void main() {
    // Матрица экземпляра — данные блика: станция; курс, покачивание и край;
    // начальный поворот и размер; цвет.
    vec4 station = instanceMatrix[0], drift = instanceMatrix[1];
    vec4 turn = instanceMatrix[2], tint = instanceMatrix[3];
    float age = prismClock - prismBorn;
    float envelope = smoothstep(0.0, 0.09, age) * (1.0 - smoothstep(0.62, 1.15, age));
    float spread = drift.w * (1.68 + age * 0.45);
    vec3 centre = vec3(station.x + drift.y * spread + drift.z * age * 0.11,
      station.y + 1.05 * trailShapeHeight + age * 0.57 * trailShapeHeight + sin(age * PI) * 0.26 * trailShapeHeight,
      station.z - drift.x * spread);
    mat3 rotation = prismEuler(vec3(age * 1.7 + turn.x, turn.y + age * 1.1, turn.z - age * 1.6));
    float size = max(0.001, turn.w * envelope);
    // Повёрнутый блик опускается не больше чем на наибольший свой радиус.
    centre.y = max(centre.y, station.y + ${Z} + size * 1.3);
    vec4 mvPosition = modelViewMatrix * vec4(centre + rotation * (position * vec3(size, size * 1.3, size)), 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <logdepthbuf_vertex>
    vPrismView = -mvPosition.xyz;
    vPrismNormal = normalize(normalMatrix * (rotation * (normal / vec3(1.0, 1.3, 1.0))));
    vPrismColour = tint.rgb;
    vPrismAlpha = envelope * 0.93;
  }`;function se(){let e=new Float32Array(168),t=new Float32Array(e.length);for(let n=0;n<2;n+=1)for(let r=0;r<H;r+=1){let i=x[r];for(let a=0;a<4;a+=1){let o=(n*28+r*4+a)*3;e[o]=n,e[o+1]=r,e[o+2]=a,t[o]=i.r,t[o+1]=i.g,t[o+2]=i.b}}let n=[];for(let e=0;e<H;e+=1){let t=e*4,r=t+28;n.push(t,r,t+1,t+1,r,r+1,t+2,t+3,r+2,t+3,r+3,r+2),e===0&&n.push(t,t+2,r,r,t+2,r+2),e===6&&n.push(t+1,r+1,t+3,r+1,r+3,t+3)}let r=new u;return r.setAttribute(`position`,new p(e,3)),r.setAttribute(`prismTint`,new p(t,3)),r.setIndex(n),r}function ce(t,n,i,a,o,s,l){let u=new c(new Float32Array(a*o),o).setUsage(r);n.setAttribute(`prismBorn`,u);let d=new e(n,i,a);return d.instanceMatrix.setUsage(r),d.boundingSphere=new f(new h,1/0),d.name=i.name,d.renderOrder=l,d.count=0,d.visible=!1,d.frustumCulled=!1,d.castShadow=!1,d.receiveShadow=!1,t.add(d),{mesh:d,material:i,bornAttribute:u,attributes:[d.instanceMatrix,u],born:new Float64Array(a*o),life:s,capacity:a,count:0,slots:b(),appendStart:-1,rebased:!1}}function le(e){e.count=e.mesh.count=0,e.mesh.visible=!1,e.slots.clear(),e.appendStart=-1,e.rebased=!1;for(let t of e.attributes)t.clearUpdateRanges()}function ue(e,t){let n=e.bornAttribute.itemSize,r=0;for(;r<e.count;){if(t-e.born[r*n]<e.life){r+=1;continue}let i=--e.count;if(r!==i){e.born.copyWithin(r*n,i*n,(i+1)*n);for(let t of e.attributes){let e=t.itemSize;t.array.copyWithin(r*e,i*e,(i+1)*e)}e.slots.moved(r)}}}function de(e,t){let n=e.bornAttribute.array;for(let r=0;r<e.count*e.bornAttribute.itemSize;r+=1)e.born[r]=e.born[r]-t,n[r]=e.born[r];e.rebased=!0}function $(e){e.mesh.count=e.count,e.mesh.visible=e.count>0;for(let t of e.attributes){let n=t.itemSize,r=!1;t===e.bornAttribute&&e.rebased&&e.count>0?(t.addUpdateRange(0,e.count*n),r=!0):r=e.slots.upload(t,e.appendStart,e.count),r&&(t.needsUpdate=!0)}e.slots.clear(),e.appendStart=-1,e.rebased=!1}function fe(e){e.mesh.removeFromParent(),e.mesh.geometry.dispose(),e.material.dispose(),e.mesh.dispose()}function pe(e,t,n=_){let r=n.thickness,i={value:r},o={value:n.height},s={value:0},c={value:new a},l={value:0},u=E(`Prism_Trail_Seven_Band_Ribbon`,ae,{prismClock:s,prismWave:c,prismSilkClock:l,trailShapeThickness:i,trailShapeHeight:o},!0),d=E(`Prism_Trail_Colour_Glimmers`,oe,{prismClock:s,trailShapeHeight:o},!1),f=ce(e,se(),u,K,2,U,0),p=ce(e,w(),d,q,1,W,1),m=v(512),g=new h,y=!1,b=0,S=0,C=0,T=0,D=0,O=1,k=0,A=0,j=0,M=0,N=0,P=0,F=!1,I=(e,t,n,r,i,a,o)=>{if(!y||j-T>=U||f.count===f.capacity)return;let s=f.count++,c=s*16;f.appendStart<0&&(f.appendStart=s);let l=f.mesh.instanceMatrix.array;l[c]=b,l[c+1]=S,l[c+2]=C,l[c+3]=Q(k*X),l[c+4]=e,l[c+5]=t,l[c+6]=n,l[c+7]=o-k,l[c+8]=D,l[c+9]=O,l[c+10]=i,l[c+11]=a;for(let e=0;e<4;e+=1)l[c+12+e]=Q(k*J[e]);f.born[s*2]=T,f.born[s*2+1]=r,f.bornAttribute.setXY(s,T,r)},L=(e,t,n,i,a,o,s,c)=>{if(p.count===p.capacity)return;let l=p.count++,u=l*16;p.appendStart<0&&(p.appendStart=l);let d=p.mesh.instanceMatrix.array,f=x[(s+c*3)%H];d[u]=e,d[u+1]=t,d[u+2]=n,d[u+3]=0,d[u+4]=a,d[u+5]=o,d[u+6]=Math.sin(s*1.7)*r,d[u+7]=(c===0?-1:1)*r,d[u+8]=c,d[u+9]=Q(s*1.13),d[u+10]=Q(s*.47),d[u+11]=(.09+s%5*.012)*r,d[u+12]=f.r,d[u+13]=f.g,d[u+14]=f.b,d[u+15]=1,p.born[l]=i,p.bornAttribute.setX(l,i)},R=()=>{le(f),le(p),j=0,N=0,P=0,y=!1,s.value=0,$(f),$(p)},ee=()=>{R(),m.reset(),M=0,c.value.set(0,0,0,0),l.value=0};return{materials:[u,d],setTier(e){F||(A=e)},step(e,n){if(F)return;t.getWorldPosition(g);let r=m.step(g.x,g.y,g.z,e,n,G[A]);if(m.cleared){R();return}if(!Number.isFinite(e)||e<=0)return;if(j+=e,M+=e,j>=128){let e=Math.floor(j/128)*128;j-=e,T-=e,de(f,e),de(p,e)}ue(f,j),ue(p,j);let i=Math.hypot(m.direction[0],m.direction[2]),a=i>1e-6?m.direction[0]/i:0,o=i>1e-6?m.direction[2]/i:1;for(let e=0;e<r;e+=1){let t=e*3,n=m.positions[t],r=m.positions[t+1],i=m.positions[t+2],s=j-m.elapsed[e],c=N++;if(I(n,r,i,s,a,o,P),c%3==0)for(let e=0;e<2;e+=1)L(n,r,i,s,a,o,c,e);y=!0,b=n,S=r,C=i,T=s,D=a,O=o,k=P,P+=G[A]}$(f),$(p),s.value=j,c.value.set(Q(M*Y[0]),Q(M*Y[1]),Q(M*Y[2]),Q(M*Y[3])),l.value=Q(M*ie)},reset(){F||ee()},dispose(){F||(F=!0,fe(f),fe(p))}}}function me(e,t,n,r=_){let i=pe(e,t,r);return{step:(e,t)=>i.step(e,t),setTier:e=>i.setTier(e),reset:()=>i.reset(),view:D(n.character,i.materials),dispose:()=>i.dispose()}}function he(e,t,n){let r=B(t);return{step:(e,t)=>r.step(e,t),setTier:e=>r.setTier(e),reset:()=>r.reset(),view:D(n.character,r.materials),dispose:()=>r.dispose()}}export{he as createPrismAuraEffect,me as createPrismTrailEffect};