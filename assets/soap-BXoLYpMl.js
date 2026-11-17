//# allFunctionsCalledOnLoad
import{$ as e,Cr as t,P as n,Xn as r,Y as i,Z as a,nr as o,qn as s,v as c,wr as l,wt as u}from"./three.core-DVTiNhEy.js";import{o as d}from"./src-BI6MMqKu.js";import{t as f}from"./trail-emitter-DtJSWeMd.js";import{t as p}from"./trail-slots-BYU9mmsR.js";var m=e=>new c().setHex(d(e),s),h=m(`cyan/1`),g=m(`pink/1`),_=m(`violet/1`),v=m(`yellow/1`),y=m(`white`),b=200/17;function x(e){return new o(1,e===`hero`?20:e===`trail`?12:8,e===`hero`?12:e===`trail`?8:6)}function S(){return{soapClock:{value:0},soapTime:{value:0},soapFaceCentre:{value:new l},soapFaceRadius:{value:new t(1.05,1.05)},soapFaceEnabled:{value:0}}}var C=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float soapClock;
  uniform vec3 soapCyan, soapPink, soapViolet, soapGold, soapWhite;
  varying vec3 vSoapView, vSoapNormal, vSoapLocal, vSoapColour;
  varying float vSoapAlpha, vSoapPop, vSoapSeed;

  vec3 soapTint(float index) {
    float slot = mod(index, 4.0);
    return slot < 0.5 ? soapCyan : slot < 1.5 ? soapPink : slot < 2.5 ? soapViolet : soapGold;
  }

  // Поворот по углам Эйлера в порядке XYZ, как у Euler в three.js.
  mat3 soapEuler(vec3 angles) {
    float a = cos(angles.x), b = sin(angles.x), c = cos(angles.y), d = sin(angles.y);
    float e = cos(angles.z), f = sin(angles.z);
    float ae = a * e, af = a * f, be = b * e, bf = b * f;
    return mat3(c * e, af + be * d, bf - ae * d,
      -c * f, ae - bf * d, be + af * d,
      d, -b * c, a * c);
  }

  // Кратчайший поворот оси Y к направлению, как Quaternion.setFromUnitVectors.
  mat3 soapAlign(vec3 direction) {
    float c = direction.y;
    if (c < -0.999999) return mat3(1.0, 0.0, 0.0, 0.0, -1.0, 0.0, 0.0, 0.0, -1.0);
    float x = direction.z, z = -direction.x, k = 1.0 / (1.0 + c);
    return mat3(x * x * k + c, z, z * x * k,
      -z, c, x,
      x * z * k, -x, z * z * k + c);
  }

  void soapPlace(vec3 centre, mat3 turn, vec3 scale) {
    vec4 mvPosition = modelViewMatrix * vec4(centre + turn * (position * scale), 1.0);
    gl_Position = projectionMatrix * mvPosition;
    // Нормаль вытянутой сферы — через обратный масштаб, как у экземпляров three.js.
    vSoapNormal = normalize(normalMatrix * (turn * (normal / max(abs(scale), vec3(0.000001)))));
    vSoapView = -mvPosition.xyz;
    vSoapLocal = position;
  }

  // Оболочка вне жизни целиком уходит за дальнюю плоскость: пикселей она не стоит.
  void soapHide() {
    gl_Position = vec4(0.0, 0.0, 2.0, 1.0);
    vSoapView = vSoapNormal = vSoapLocal = vSoapColour = vec3(0.0);
    vSoapAlpha = vSoapPop = vSoapSeed = 0.0;
  }
`,w=`
  #include <common>
  #include <logdepthbuf_pars_fragment>
  uniform float soapTime, soapFaceEnabled;
  uniform vec3 soapFaceCentre, soapCyan, soapPink, soapViolet, soapGold, soapWhite;
  uniform vec2 soapFaceRadius;
  varying vec3 vSoapView, vSoapNormal, vSoapLocal, vSoapColour;
  varying float vSoapAlpha, vSoapPop, vSoapSeed;
  void main() {
    if (vSoapAlpha < 0.003 || vSoapPop >= 0.999) discard;
    if (soapFaceEnabled > 0.5 && vSoapView.z < soapFaceCentre.z + soapFaceRadius.y) {
      vec2 offset = vSoapView.xy / max(vSoapView.z, 0.001)
        - soapFaceCentre.xy / max(soapFaceCentre.z, 0.001);
      float offAxis = sqrt(1.0 + dot(soapFaceCentre.xy, soapFaceCentre.xy)
        / max(soapFaceCentre.z * soapFaceCentre.z, 0.0001));
      vec2 radius = soapFaceRadius * offAxis / max(soapFaceCentre.z - soapFaceRadius.x, 0.1);
      if (dot(offset / radius, offset / radius) < 1.0) discard;
    }
    vec3 local = normalize(vSoapLocal + vec3(0.000001));
    float seed = vSoapSeed;
    if (vSoapPop > 0.001) {
      // Расширяющиеся рваные отверстия закреплены на оболочке, а не на экране.
      vec3 a = normalize(vec3(sin(seed * 1.7) + 0.2, cos(seed * 0.8), sin(seed * 2.1) - 0.3));
      vec3 b = normalize(vec3(-a.z + 0.41, -a.x - 0.28, a.y + 0.37));
      vec3 c = normalize(-a - b + vec3(0.13, -0.27, 0.19));
      float tears = sin(local.x * 23.0 + local.y * 17.0 + seed) * 0.060
        + sin(local.z * 31.0 - local.y * 21.0 + seed * 1.9) * 0.035;
      float puncture = max(dot(local, a), max(dot(local, b) - 0.18, dot(local, c) - 0.30)) + tears;
      if (puncture > 1.12 - vSoapPop * 2.32) discard;
    }
    vec3 normal = normalize(vSoapNormal), view = normalize(vSoapView + vec3(0.000001));
    float facing = clamp(abs(dot(normal, view)), 0.0, 1.0), rim = pow(1.0 - facing, 2.25);
    vec3 light = normalize(mat3(viewMatrix) * vec3(-0.48, 0.82, 0.31));
    vec3 light2 = normalize(mat3(viewMatrix) * vec3(0.70, 0.26, -0.52));
    float glint = pow(max(0.0, dot(normal, normalize(view + light))), 112.0);
    float glint2 = pow(max(0.0, dot(normal, normalize(view + light2))), 168.0) * 0.38;
    vec3 colour; float alpha;
    #ifdef SOAP_DROP
      colour = mix(vSoapColour, soapWhite, (glint + glint2) * 0.62);
      alpha = vSoapAlpha * (0.63 + rim * 0.22 + glint * 0.15);
    #else
      float filmPhase = (1.0 - facing) * 2.7 + local.y * 0.23 + seed * 0.11 + soapTime * 0.085;
      float band = fract(filmPhase) * 4.0;
      vec3 film = band < 1.0 ? mix(soapCyan, soapPink, band)
        : band < 2.0 ? mix(soapPink, soapViolet, band - 1.0)
        : band < 3.0 ? mix(soapViolet, soapGold, band - 2.0)
        : mix(soapGold, soapCyan, band - 3.0);
      colour = mix(vSoapColour, film, 0.82);
      // Плёнка отражает мир: верх ловит небо, низ — землю и темнее. Без этого
      // пузырь на светлом фоне растворялся до тонкого кольца.
      vec3 reflected = transformDirectionByInverseViewMatrix(reflect(-view, normal), viewMatrix);
      float sky = smoothstep(-0.25, 0.35, reflected.y);
      colour *= mix(0.6, 1.08, sky);
      colour = mix(colour, soapWhite, clamp(glint * 0.94 + glint2 * 0.70, 0.0, 1.0));
      float film2 = pow(1.0 - facing, 1.7);
      alpha = vSoapAlpha * min(0.95, 0.07 + film2 * 0.78 + (1.0 - sky) * 0.06
        + glint * 0.50 + glint2 * 0.28);
      #ifdef SOAP_FOAM
        colour = mix(colour, soapWhite, 0.22);
        alpha = vSoapAlpha * min(0.8, 0.10 + rim * 0.45 + glint * 0.24);
      #endif
      alpha *= 1.0 - vSoapPop * vSoapPop * 0.25;
    #endif
    #include <logdepthbuf_fragment>
    gl_FragColor = vec4(colour, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;function T(e,t,n,i,a={}){return new r({name:e,defines:t===`foam`?{SOAP_FOAM:1}:t===`drop`?{SOAP_DROP:1}:{},transparent:!0,depthWrite:!1,depthTest:!0,side:0,toneMapped:!0,uniforms:{...i,...a,soapCyan:{value:h},soapPink:{value:g},soapViolet:{value:_},soapGold:{value:v},soapWhite:{value:y}},vertexShader:n,fragmentShader:w})}function E(e,t){let n=t?.getObjectByName(`mixamorigHead_06`)??null,r=new l,i=new l;return t=>{if(n===null){e.soapFaceEnabled.value=0;return}t.updateMatrixWorld(),n.updateWorldMatrix(!0,!1),r.set(-.00570525,.6573547,.02455115),n.localToWorld(r);let a=1.00256*n.matrixWorld.getMaxScaleOnAxis()+.14;i.copy(r).applyMatrix4(t.matrixWorldInverse).multiplyScalar(-1),e.soapFaceCentre.value.copy(i),e.soapFaceRadius.value.set(a,a),e.soapFaceEnabled.value=Number.isFinite(i.lengthSq())&&i.z>.1?1:0}}var D=Math.PI*2,O=34,k=18,A=5,j=[34,20,10],M=[18,12,6],N=.84,P=14,F=840,I=D*100/F,L=`
  uniform float soapMotion;
  // Начальный угол, радиус орбиты, низ и верх подъёма.
  attribute vec4 soapOrbit;
  // Жизнь, возраст в начале часов, фаза, наклон.
  attribute vec4 soapCycle;

  // Положение пузыря на доле жизни age и при повороте орбиты turn.
  void soapPose(float age, float turn, float size0, out vec3 centre, out mat3 rotation, out vec3 scale) {
    float phase = soapCycle.z, travel = min(1.0, age / ${N.toFixed(2)});
    float angle = soapOrbit.x + turn + sin(travel * 4.2 + phase) * 0.085;
    float radius = soapOrbit.y + sin(travel * 3.8 + phase) * 0.095;
    centre = vec3(cos(angle) * radius,
      soapOrbit.z + (soapOrbit.w - soapOrbit.z) * travel + sin(travel * 5.1 + phase) * 0.065,
      sin(angle) * radius - soapMotion * 0.16);
    rotation = soapEuler(vec3(soapCycle.w + sin(travel * 3.7 + phase) * 0.075,
      phase + travel * 0.44, cos(travel * 4.4 + phase) * 0.09));
    float size = size0 * (0.64 + smoothstep(0.0, 1.0, age / 0.10) * 0.36);
    float breathe = sin(travel * 9.5 + phase) * 0.025;
    scale = size * vec3(1.0 + breathe, 1.0 - breathe * 0.70, 1.0 - breathe * 0.30);
  }
`,R=`${C}${L}
  // Размер и номер оттенка.
  attribute vec2 soapShape;
  void main() {
    float life = soapCycle.x, seconds = mod(soapCycle.y + soapClock, life), age = seconds / life;
    // Лопнувший пузырь застывает там, где его застал разрыв: орбита — на тот миг.
    float since = max(0.0, seconds - ${N.toFixed(2)} * life);
    float pop = clamp(since / 0.21, 0.0, 1.0);
    if (pop >= 0.999) { soapHide(); return; }
    vec3 centre, scale; mat3 rotation;
    soapPose(min(age, ${N.toFixed(2)}), (soapClock - since) * ${(D/P).toFixed(8)},
      soapShape.x, centre, rotation, scale);
    soapPlace(centre, rotation, scale);
    #include <logdepthbuf_vertex>
    vSoapColour = soapTint(soapShape.y);
    vSoapAlpha = smoothstep(0.0, 1.0, age / 0.085); vSoapPop = pop; vSoapSeed = soapCycle.z;
  }`,ee=`${C}${L}
  // Размер пузыря, номер оттенка, скорость разлёта.
  attribute vec3 soapShape;
  // Направление разлёта в осях пузыря и размер капли.
  attribute vec4 soapDrop;
  void main() {
    float life = soapCycle.x, seconds = mod(soapCycle.y + soapClock, life);
    // Капли летят от последнего лопания своего пузыря.
    float since = mod(seconds - ${N.toFixed(2)} * life + life, life);
    if (since >= 0.58) { soapHide(); return; }
    vec3 centre, scale; mat3 rotation;
    soapPose(${N.toFixed(2)}, (soapClock - since) * ${(D/P).toFixed(8)},
      soapShape.x, centre, rotation, scale);
    vec3 velocity = rotation * soapDrop.xyz * soapShape.z + vec3(0.0, 0.12, 0.0);
    vec3 point = rotation * (soapDrop.xyz * scale) + centre + velocity * since;
    point.y -= 3.3 * since * since;
    if (point.y < -2.44) { soapHide(); return; }
    float size = soapDrop.w * (1.0 - smoothstep(0.0, 1.0, since / 0.58) * 0.70);
    soapPlace(point, soapAlign(normalize(velocity - vec3(0.0, since * 6.6, 0.0))),
      vec3(size, size * 1.65, size));
    #include <logdepthbuf_vertex>
    vSoapColour = mix(soapTint(soapShape.y), soapCyan, 0.35);
    vSoapAlpha = smoothstep(0.0, 1.0, since / 0.025) * (1.0 - smoothstep(0.0, 1.0, (since - 0.28) / 0.30)) * 0.82;
    vSoapPop = 0.0; vSoapSeed = 0.0;
  }`,te=`${C}
  // Место у ног, размер, фаза дыхания.
  attribute vec4 soapFoam;
  void main() {
    float size = soapFoam.z;
    soapPlace(vec3(soapFoam.x, -2.32 + size * 0.7, soapFoam.y), mat3(1.0),
      vec3(size, size * (0.79 + sin(soapClock * ${I.toFixed(8)} + soapFoam.w) * 0.035), size));
    #include <logdepthbuf_vertex>
    vSoapColour = mix(soapCyan, soapWhite, 0.24);
    vSoapAlpha = 1.0; vSoapPop = 0.0; vSoapSeed = soapFoam.w;
  }`;function z(e,t,n,r){e.setAttribute(t,new a(n,r))}function B(t,n){let r={value:0},a=T(`Soap_Aura_Bubbles`,`bubble`,R,n,{soapMotion:r}),o=T(`Soap_Aura_Foot_Foam`,`foam`,te,n),s=T(`Soap_Aura_Pop_Drops`,`drop`,ee,n,{soapMotion:r}),c=[a,o,s],l=x(`hero`),u=x(`foam`),d=new i(1,0),f=new Float32Array(136),p=new Float32Array(136),m=new Float32Array(68),h=new Float32Array(680),g=new Float32Array(680),_=new Float32Array(510),v=new Float32Array(680),y=new Float32Array(72),S=1906061045,C=()=>(S^=S<<13,S^=S>>>17,S^=S<<5,(S>>>0)/4294967296);for(let e=0;e<O;e+=1){let t=e<7?.65+C()*.35:e<20?.3+C()*.25:.12+C()*.16,n=e*2.39996323+C()*.18,r=2.28+C()*1.22,i=.62+C()*.56,a=5+C()*3.5,o=F/Math.round(F/a),s=(.1+C()*.72)*o,c=C()*D,l=(C()-.5)*.4;f.set([n,r,-2.26+t,i],e*4),p.set([o,s,c,l],e*4),m.set([t,e%4],e*2);for(let a=0;a<A;a+=1){let u=e*A+a,d=(C()-.5)*1.75,f=a*D/A+c,p=Math.sqrt(1-d*d);h.set([n,r,-2.26+t,i],u*4),g.set([o,s,c,l],u*4),_.set([t,e%4,1.65+a*.14],u*3),v.set([Math.cos(f)*p,d,Math.sin(f)*p,.022+C()*.025],u*4)}}for(let e=0;e<k;e+=1){let t=Math.floor(e/3),n=e%3,r=t*D/6+.23,i=1.9+(n-1)*.19,a=(n*6+t)*4;y.set([Math.cos(r)*i+(n-1)*.08,Math.sin(r)*i,.14+C()*.1,C()*D],a)}z(l,`soapOrbit`,f,4),z(l,`soapCycle`,p,4),z(l,`soapShape`,m,2),z(d,`soapOrbit`,h,4),z(d,`soapCycle`,g,4),z(d,`soapShape`,_,3),z(d,`soapDrop`,v,4),z(u,`soapFoam`,y,4);let w=new e(l,a,O),E=new e(u,o,k),N=new e(d,s,170),P=[w,E,N];for(let e of P)e.name=e.material.name,e.frustumCulled=!1,e.castShadow=e.receiveShadow=!1,e.renderOrder=3,t.add(e);let I=0,L=0,B=0,V=0,H=!1,U=()=>{w.count=j[I],E.count=M[I],N.count=j[I]*A},W=()=>{n.soapClock.value=L,n.soapTime.value=B,r.value=V};return U(),W(),{step(e,t){H||!Number.isFinite(e)||e<=0||(L=(L+e)%F,B=(B+e)%b,V+=(+!!t-V)*(1-Math.exp(-e*2.4)),W())},setTier(e){H||e===I||e!==0&&e!==1&&e!==2||(I=e,U())},reset(){H||(L=B=V=0,W())},dispose(){if(!H){H=!0;for(let e of P)e.removeFromParent(),e.geometry.dispose(),e.dispose();for(let e of c)e.dispose()}}}}var V=Math.PI*2,H=3,U=.16,W=.35,ne=[1.5,1.9,2.8],re=[[0,1,2],[0,-1],[0,-1]],G=[[0,1,2,3],[0,1,3],[0,2]],K=[[0,1,2,3,4],[0,1,2,4],[0,1,3]],q=6144,J=3584,ie=4096,Y=9,X=e=>{let t=Math.sin(e*127.1+311.7)*43758.5453123;return t-Math.floor(t)},ae=`${C}
  // Рождение с учётом задержки, лопание после рождения, подъём, зерно.
  attribute vec4 soapBubbleTime;
  // Сдвиг вбок, вдоль, дрейф вбок, скорость отставания.
  attribute vec4 soapBubblePath;
  // Курс станции и номер оттенка.
  attribute vec3 soapBubbleHeading;
  void main() {
    float time = soapClock - soapBubbleTime.x;
    float popAt = soapBubbleTime.y, lift = soapBubbleTime.z, seed = soapBubbleTime.w;
    float pop = max(0.0, (time - popAt) / ${U.toFixed(2)});
    if (time < 0.0 || pop >= 1.0) { soapHide(); return; }
    float radius = length(instanceMatrix[0].xyz);
    float dx = soapBubbleHeading.x, dz = soapBubbleHeading.y;
    // Пузырь всплывает и замедляется: лёгкий, но не воздушный шар. После
    // лопания место застывает, а оболочка рвётся.
    float phase = min(time, popAt);
    float sideways = soapBubblePath.x + soapBubblePath.z * phase;
    float forward = soapBubblePath.y - phase * soapBubblePath.w;
    vec3 centre = instanceMatrix[3].xyz + vec3(dz * sideways + dx * forward,
      0.12 + radius + lift * (1.0 - exp(-phase * 1.3)) * 1.5 + (sin(phase * 2.4 + seed) - sin(seed)) * 0.045,
      -dx * sideways + dz * forward);
    float grow = smoothstep(0.0, 1.0, time / 0.16), expansion = 1.0 + pop * 0.07;
    float breathing = sin(time * 3.1 + seed) * 0.04;
    float size = radius * max(0.005, grow) * expansion;
    soapPlace(centre, soapEuler(vec3(seed * 0.21 + time * 0.13, seed + time * 0.17, sin(seed) * 0.12)),
      size * vec3(1.0 + breathing, 1.0 - breathing * 0.62, 1.0 - breathing * 0.38));
    #include <logdepthbuf_vertex>
    vSoapColour = mix(soapWhite, soapTint(soapBubbleHeading.z), 0.18);
    vSoapAlpha = grow * 0.96; vSoapPop = pop; vSoapSeed = seed;
  }`,oe=`${C}
  // Миг лопания, угол разлёта, зерно пузыря, номер оттенка.
  attribute vec4 soapDropTime;
  // Направление разлёта и радиус пузыря, с которого капля сорвалась.
  attribute vec4 soapDropFlight;
  // Скорость разлёта и подъём пузыря.
  attribute vec2 soapDropMotion;
  void main() {
    float after = soapClock - soapDropTime.x;
    if (after <= 0.0 || after >= ${W.toFixed(2)}) { soapHide(); return; }
    vec3 centre = instanceMatrix[3].xyz + soapDropFlight.xyz * (soapDropFlight.w + after * soapDropMotion.x);
    centre.y += soapDropMotion.y * after - 2.4 * after * after;
    float envelope = smoothstep(0.0, 1.0, after / 0.025) * (1.0 - smoothstep(0.0, 1.0, (after - 0.11) / 0.24));
    float size = length(instanceMatrix[0].xyz) * max(0.005, envelope);
    soapPlace(centre, soapEuler(vec3(soapDropTime.y, soapDropTime.z * 0.31, after * 1.8)),
      vec3(size, size * (1.45 + after), size));
    #include <logdepthbuf_vertex>
    vSoapColour = mix(soapTint(soapDropTime.w), soapWhite, 0.22);
    vSoapAlpha = envelope * 0.84; vSoapPop = 0.0; vSoapSeed = soapDropTime.z;
  }`,se=`${C}
  // Рождение, зерно, доля голубого.
  attribute vec3 soapFoamTime;
  void main() {
    float age = soapClock - soapFoamTime.x;
    if (age < 0.0 || age >= ${H.toFixed(1)}) { soapHide(); return; }
    float envelope = smoothstep(0.0, 1.0, age / 0.10)
      * (1.0 - smoothstep(0.0, 1.0, (age - 1.55) / ${1.45.toFixed(2)}));
    float size = length(instanceMatrix[0].xyz) * max(0.005, envelope);
    float seed = soapFoamTime.y, c = cos(seed), s = sin(seed);
    soapPlace(instanceMatrix[3].xyz + vec3(0.0, size * 0.43, 0.0),
      mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c), vec3(size * 1.12, size * 0.56, size));
    #include <logdepthbuf_vertex>
    vSoapColour = mix(soapWhite, soapCyan, soapFoamTime.z);
    vSoapAlpha = envelope * 0.72; vSoapPop = 0.0; vSoapSeed = seed;
  }`;function Z(t,r,i,o,s,c,l,u){let d=T(r,i,c,l),f=u.map(([e,t])=>{let r=new a(new Float32Array(s*t),t).setUsage(n);return o.setAttribute(e,r),r}),m=new e(o,d,s);return m.instanceMatrix.setUsage(n),m.name=r,m.renderOrder=3,m.count=0,m.visible=!1,m.frustumCulled=!1,m.castShadow=!1,m.receiveShadow=!1,t.add(m),{mesh:m,material:d,time:f[0],extra:f,attributes:[m.instanceMatrix,...f],born:new Float64Array(s),until:new Float64Array(s),capacity:s,count:0,slots:p(),appendStart:-1,rebased:!1}}function Q(e,t,n){if(e.count===e.capacity)return-1;let r=e.count++;return e.appendStart<0&&(e.appendStart=r),e.born[r]=t,e.until[r]=n,r}function ce(e){e.count=e.mesh.count=0,e.mesh.visible=!1,e.slots.clear(),e.appendStart=-1,e.rebased=!1;for(let t of e.attributes)t.clearUpdateRanges()}function le(e,t){let n=0;for(;n<e.count;){if(t<e.until[n]){n+=1;continue}let r=--e.count;if(n!==r){e.born[n]=e.born[r],e.until[n]=e.until[r];for(let t of e.attributes){let e=t.itemSize;t.array.copyWithin(n*e,r*e,(r+1)*e)}e.slots.moved(n)}}}function ue(e,t){for(let n=0;n<e.count;n+=1)e.born[n]=e.born[n]-t,e.until[n]=e.until[n]-t,e.time.setX(n,e.born[n]);e.rebased=!0}function $(e){e.mesh.count=e.count,e.mesh.visible=e.count>0;for(let t of e.attributes){let n=t.itemSize,r=!1;t===e.time&&e.rebased&&e.count>0?(t.addUpdateRange(0,e.count*n),r=!0):r=e.slots.upload(t,e.appendStart,e.count),r&&(t.needsUpdate=!0)}e.slots.clear(),e.appendStart=-1,e.rebased=!1}function de(e){e.mesh.removeFromParent(),e.mesh.geometry.dispose(),e.material.dispose(),e.mesh.dispose()}function fe(e,t,n){let r=Z(e,`Soap_Path_Floating_Bubbles`,`bubble`,x(`trail`),q,ae,n,[[`soapBubbleTime`,4],[`soapBubblePath`,4],[`soapBubbleHeading`,3]]),a=Z(e,`Soap_Path_Foam_Islands`,`foam`,x(`foam`),ie,se,n,[[`soapFoamTime`,3]]),o=Z(e,`Soap_Path_Pop_Droplets`,`drop`,new i(1,0),J,oe,n,[[`soapDropTime`,4],[`soapDropFlight`,4],[`soapDropMotion`,2]]),s=[r,a,o],[c,d,p]=r.extra,[m]=a.extra,[h,g,_]=o.extra,v=new Float64Array(q*Y),y=f(1024),S=new l,C=new l,w=new u,T=0,E=0,D=0,O=0,k=0,A=!1,j=(e,t,n,i,o,s)=>{let l=O++;for(let a of re[T]){let u=a>=0?a:1+l%2,f=l*13.31+u*2.17,m=X(f),h=u===0?.52+m*.3:.24+m*.24,g=i+u*.06,_=1.35+X(f+1)*.9;if(k===q)return;let y=Q(r,g,g+_+U);if(y<0)return;let b=.7+X(f+2)*.8,x=u===0?Math.sin(f)*.84:(u===1?-1:1)*(.86+m*.39),S=(X(f+3)-.5)*.8,C=(m-.5)*.4,T=.14+m*.2;w.makeScale(h,h,h),w.setPosition(e,t,n),r.mesh.setMatrixAt(y,w),c.setXYZW(y,g,_,b,f),d.setXYZW(y,x,S,C,T),p.setXYZ(y,o,s,(l+u)%4);let E=x+C*_,D=S-_*T,O=k++*Y;v[O]=g+_,v[O+1]=e+s*E+o*D,v[O+2]=t+.12+h+b*(1-Math.exp(-_*1.3))*1.5+(Math.sin(_*2.4+f)-Math.sin(f))*.045,v[O+3]=n-o*E+s*D,v[O+4]=h,v[O+5]=f,v[O+6]=b,v[O+7]=m,v[O+8]=l+u}if(l%3==0)for(let r of K[T]){let c=l*7.11+r*2.71,u=X(c),d=Q(a,i,i+H);if(d<0)return;let f=r*V/5+l,p=r===0?0:.18+u*.12,h=Math.sin(l*2.17)*1.03+Math.cos(f)*p,g=Math.sin(f)*p,_=.105+u*.13;w.makeScale(_,_,_),w.setPosition(e+s*h+o*g,t+.025,n-o*h+s*g),a.mesh.setMatrixAt(d,w),m.setXYZ(d,i,c,.13+u*.15)}},M=e=>{let t=v[e],n=v[e+5];if(!(E>=t+W))for(let r of G[T]){let i=Q(o,t,t+W);if(i<0)return;let a=n+r*Math.PI*.5,s=-.15+X(n+r+5)*1.1;C.set(Math.cos(a),s,Math.sin(a)).normalize();let c=.021+X(n+r+7)*.024;w.makeScale(c,c,c),w.setPosition(v[e+1],v[e+2],v[e+3]),o.mesh.setMatrixAt(i,w),h.setXYZW(i,t,a,n,(v[e+8]+r)%4),g.setXYZW(i,C.x,C.y,C.z,v[e+4]),_.setXY(i,1.25+v[e+7]*.85,v[e+6])}},N=()=>{let e=0;for(;e<k*Y;){if(v[e]>E){e+=Y;continue}M(e);let t=--k*Y;v.copyWithin(e,t,t+Y)}},P=()=>{for(let e of s)ce(e),$(e);E=O=k=0,n.soapClock.value=0};return{setTier(e){if(e!==0&&e!==1&&e!==2)throw RangeError(`Invalid soap trail tier`);A||(T=e)},step(e,r){if(A)return;t.getWorldPosition(S);let i=y.step(S.x,S.y,S.z,e,r,ne[T]);if(y.cleared){P();return}if(!Number.isFinite(e)||e<=0)return;if(E+=e,D=(D+e)%b,E>=128){let e=Math.floor(E/128)*128;E-=e;for(let t of s)ue(t,e);for(let t=0;t<k*Y;t+=Y)v[t]=v[t]-e}for(let e of s)le(e,E);N();let a=Math.hypot(y.direction[0],y.direction[2]),o=a>1e-4?y.direction[0]/a:0,c=a>1e-4?y.direction[2]/a:1;for(let e=0;e<i;e+=1){let t=e*3;j(y.positions[t],y.positions[t+1],y.positions[t+2],E-y.elapsed[e],o,c)}for(let e of s)$(e);n.soapClock.value=E,n.soapTime.value=D},reset(){A||(P(),y.reset())},dispose(){if(!A){A=!0;for(let e of s)de(e)}}}}function pe(e,t,n){let r=S(),i=fe(e,t,r);return{step:(e,t)=>i.step(e,t),setTier:e=>i.setTier(e),reset:()=>i.reset(),view:E(r,n.character),dispose:()=>i.dispose()}}function me(e,t,n){let r=S(),i=B(t,r);return{step:(e,t)=>i.step(e,t),setTier:e=>i.setTier(e),reset:()=>i.reset(),view:E(r,n.character),dispose:()=>i.dispose()}}export{me as createSoapAuraEffect,pe as createSoapTrailEffect};