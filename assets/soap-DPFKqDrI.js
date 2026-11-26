//# allFunctionsCalledOnLoad
import{$ as e,Cr as t,P as n,Xn as r,Y as i,Z as a,nr as o,qn as s,v as c,wr as l,wt as u}from"./three.core-DVTiNhEy.js";import{o as d}from"./src-BI6MMqKu.js";import{n as f,r as p,t as m}from"./trail-shape-BsaeWHuc.js";import{t as h}from"./trail-slots-BYU9mmsR.js";var g=e=>new c().setHex(d(e),s),_=g(`cyan/1`),v=g(`pink/1`),y=g(`violet/1`),b=g(`yellow/1`),x=g(`white`),S=200/17;function C(e){return new o(1,e===`hero`?20:e===`trail`?12:8,e===`hero`?12:e===`trail`?8:6)}function w(){return{soapClock:{value:0},soapTime:{value:0},soapFaceCentre:{value:new l},soapFaceRadius:{value:new t(1.05,1.05)},soapFaceEnabled:{value:0}}}var T=`
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
`,E=`
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
  }`;function D(e,t,n,i,a={}){return new r({name:e,defines:t===`foam`?{SOAP_FOAM:1}:t===`drop`?{SOAP_DROP:1}:{},transparent:!0,depthWrite:!1,depthTest:!0,side:0,toneMapped:!0,uniforms:{...i,...a,soapCyan:{value:_},soapPink:{value:v},soapViolet:{value:y},soapGold:{value:b},soapWhite:{value:x}},vertexShader:n,fragmentShader:E})}function O(e,t){let n=t?.getObjectByName(`mixamorigHead_06`)??null,r=new l,i=new l;return t=>{if(n===null){e.soapFaceEnabled.value=0;return}t.updateMatrixWorld(),n.updateWorldMatrix(!0,!1),r.set(-.00570525,.6573547,.02455115),n.localToWorld(r);let a=1.00256*n.matrixWorld.getMaxScaleOnAxis()+.14;i.copy(r).applyMatrix4(t.matrixWorldInverse).multiplyScalar(-1),e.soapFaceCentre.value.copy(i),e.soapFaceRadius.value.set(a,a),e.soapFaceEnabled.value=Number.isFinite(i.lengthSq())&&i.z>.1?1:0}}var k=Math.PI*2,A=34,j=18,M=5,N=[34,20,10],P=[18,12,6],F=.84,I=14,L=840,R=k*100/L,z=`
  uniform float soapMotion;
  // Начальный угол, радиус орбиты, низ и верх подъёма.
  attribute vec4 soapOrbit;
  // Жизнь, возраст в начале часов, фаза, наклон.
  attribute vec4 soapCycle;

  // Положение пузыря на доле жизни age и при повороте орбиты turn.
  void soapPose(float age, float turn, float size0, out vec3 centre, out mat3 rotation, out vec3 scale) {
    float phase = soapCycle.z, travel = min(1.0, age / ${F.toFixed(2)});
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
`,B=`${T}${z}
  // Размер и номер оттенка.
  attribute vec2 soapShape;
  void main() {
    float life = soapCycle.x, seconds = mod(soapCycle.y + soapClock, life), age = seconds / life;
    // Лопнувший пузырь застывает там, где его застал разрыв: орбита — на тот миг.
    float since = max(0.0, seconds - ${F.toFixed(2)} * life);
    float pop = clamp(since / 0.21, 0.0, 1.0);
    if (pop >= 0.999) { soapHide(); return; }
    vec3 centre, scale; mat3 rotation;
    soapPose(min(age, ${F.toFixed(2)}), (soapClock - since) * ${(k/I).toFixed(8)},
      soapShape.x, centre, rotation, scale);
    soapPlace(centre, rotation, scale);
    #include <logdepthbuf_vertex>
    vSoapColour = soapTint(soapShape.y);
    vSoapAlpha = smoothstep(0.0, 1.0, age / 0.085); vSoapPop = pop; vSoapSeed = soapCycle.z;
  }`,V=`${T}${z}
  // Размер пузыря, номер оттенка, скорость разлёта.
  attribute vec3 soapShape;
  // Направление разлёта в осях пузыря и размер капли.
  attribute vec4 soapDrop;
  void main() {
    float life = soapCycle.x, seconds = mod(soapCycle.y + soapClock, life);
    // Капли летят от последнего лопания своего пузыря.
    float since = mod(seconds - ${F.toFixed(2)} * life + life, life);
    if (since >= 0.58) { soapHide(); return; }
    vec3 centre, scale; mat3 rotation;
    soapPose(${F.toFixed(2)}, (soapClock - since) * ${(k/I).toFixed(8)},
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
  }`,ee=`${T}
  // Место у ног, размер, фаза дыхания.
  attribute vec4 soapFoam;
  void main() {
    float size = soapFoam.z;
    soapPlace(vec3(soapFoam.x, -2.32 + size * 0.7, soapFoam.y), mat3(1.0),
      vec3(size, size * (0.79 + sin(soapClock * ${R.toFixed(8)} + soapFoam.w) * 0.035), size));
    #include <logdepthbuf_vertex>
    vSoapColour = mix(soapCyan, soapWhite, 0.24);
    vSoapAlpha = 1.0; vSoapPop = 0.0; vSoapSeed = soapFoam.w;
  }`;function H(e,t,n,r){e.setAttribute(t,new a(n,r))}function U(t,n){let r={value:0},a=D(`Soap_Aura_Bubbles`,`bubble`,B,n,{soapMotion:r}),o=D(`Soap_Aura_Foot_Foam`,`foam`,ee,n),s=D(`Soap_Aura_Pop_Drops`,`drop`,V,n,{soapMotion:r}),c=[a,o,s],l=C(`hero`),u=C(`foam`),d=new i(1,0),f=new Float32Array(136),p=new Float32Array(136),m=new Float32Array(68),h=new Float32Array(680),g=new Float32Array(680),_=new Float32Array(510),v=new Float32Array(680),y=new Float32Array(72),b=1906061045,x=()=>(b^=b<<13,b^=b>>>17,b^=b<<5,(b>>>0)/4294967296);for(let e=0;e<A;e+=1){let t=e<7?.65+x()*.35:e<20?.3+x()*.25:.12+x()*.16,n=e*2.39996323+x()*.18,r=2.28+x()*1.22,i=.62+x()*.56,a=5+x()*3.5,o=L/Math.round(L/a),s=(.1+x()*.72)*o,c=x()*k,l=(x()-.5)*.4;f.set([n,r,-2.26+t,i],e*4),p.set([o,s,c,l],e*4),m.set([t,e%4],e*2);for(let a=0;a<M;a+=1){let u=e*M+a,d=(x()-.5)*1.75,f=a*k/M+c,p=Math.sqrt(1-d*d);h.set([n,r,-2.26+t,i],u*4),g.set([o,s,c,l],u*4),_.set([t,e%4,1.65+a*.14],u*3),v.set([Math.cos(f)*p,d,Math.sin(f)*p,.022+x()*.025],u*4)}}for(let e=0;e<j;e+=1){let t=Math.floor(e/3),n=e%3,r=t*k/6+.23,i=1.9+(n-1)*.19,a=(n*6+t)*4;y.set([Math.cos(r)*i+(n-1)*.08,Math.sin(r)*i,.14+x()*.1,x()*k],a)}H(l,`soapOrbit`,f,4),H(l,`soapCycle`,p,4),H(l,`soapShape`,m,2),H(d,`soapOrbit`,h,4),H(d,`soapCycle`,g,4),H(d,`soapShape`,_,3),H(d,`soapDrop`,v,4),H(u,`soapFoam`,y,4);let w=new e(l,a,A),T=new e(u,o,j),E=new e(d,s,170),O=[w,T,E];for(let e of O)e.name=e.material.name,e.frustumCulled=!1,e.castShadow=e.receiveShadow=!1,e.renderOrder=3,t.add(e);let F=0,I=0,R=0,z=0,U=!1,W=()=>{w.count=N[F],T.count=P[F],E.count=N[F]*M},G=()=>{n.soapClock.value=I,n.soapTime.value=R,r.value=z};return W(),G(),{step(e,t){U||!Number.isFinite(e)||e<=0||(I=(I+e)%L,R=(R+e)%S,z+=(+!!t-z)*(1-Math.exp(-e*2.4)),G())},setTier(e){U||e===F||e!==0&&e!==1&&e!==2||(F=e,W())},reset(){U||(I=R=z=0,G())},dispose(){if(!U){U=!0;for(let e of O)e.removeFromParent(),e.geometry.dispose(),e.dispose();for(let e of c)e.dispose()}}}}var W=Math.PI*2,G=3,K=.16,q=.35,te=[1.5,1.9,2.8],ne=[[0,1,2],[0,-1],[0,-1]],re=[[0,1,2,3],[0,1,3],[0,2]],ie=[[0,1,2,3,4],[0,1,2,4],[0,1,3]],J=6144,ae=3584,oe=4096,Y=9,X=e=>{let t=Math.sin(e*127.1+311.7)*43758.5453123;return t-Math.floor(t)},se=`${T}
  // Высота облика следа: отрыв от земли и покачивание; подъём уже умножен в данных.
  uniform float trailShapeHeight;
  // Рождение с учётом задержки, лопание после рождения, подъём, зерно.
  attribute vec4 soapBubbleTime;
  // Сдвиг вбок, вдоль, дрейф вбок, скорость отставания.
  attribute vec4 soapBubblePath;
  // Курс станции и номер оттенка.
  attribute vec3 soapBubbleHeading;
  void main() {
    float time = soapClock - soapBubbleTime.x;
    float popAt = soapBubbleTime.y, lift = soapBubbleTime.z, seed = soapBubbleTime.w;
    float pop = max(0.0, (time - popAt) / ${K.toFixed(2)});
    if (time < 0.0 || pop >= 1.0) { soapHide(); return; }
    float radius = length(instanceMatrix[0].xyz);
    float dx = soapBubbleHeading.x, dz = soapBubbleHeading.y;
    // Пузырь всплывает и замедляется: лёгкий, но не воздушный шар. После
    // лопания место застывает, а оболочка рвётся.
    float phase = min(time, popAt);
    float sideways = soapBubblePath.x + soapBubblePath.z * phase;
    float forward = soapBubblePath.y - phase * soapBubblePath.w;
    vec3 centre = instanceMatrix[3].xyz + vec3(dz * sideways + dx * forward,
      0.12 * trailShapeHeight + radius + lift * (1.0 - exp(-phase * 1.3)) * 1.5
        + (sin(phase * 2.4 + seed) - sin(seed)) * 0.045 * trailShapeHeight,
      -dx * sideways + dz * forward);
    float grow = smoothstep(0.0, 1.0, time / 0.16), expansion = 1.0 + pop * 0.07;
    float breathing = sin(time * 3.1 + seed) * 0.04;
    float size = radius * max(0.005, grow) * expansion;
    // Низ пузыря не уходит под пол: корень экземпляра — высота ступней в миг
    // рождения. Повёрнутый сплюснутый шар не ниже центра больше чем на
    // size · (1 + |breathing|). При высоте следа ×1 подъём и так держит пузырь выше.
    centre.y = max(instanceMatrix[3].y + ${m.toFixed(3)} + size * (1.0 + abs(breathing)), centre.y);
    soapPlace(centre, soapEuler(vec3(seed * 0.21 + time * 0.13, seed + time * 0.17, sin(seed) * 0.12)),
      size * vec3(1.0 + breathing, 1.0 - breathing * 0.62, 1.0 - breathing * 0.38));
    #include <logdepthbuf_vertex>
    vSoapColour = mix(soapWhite, soapTint(soapBubbleHeading.z), 0.18);
    vSoapAlpha = grow * 0.96; vSoapPop = pop; vSoapSeed = seed;
  }`,ce=`${T}
  // Облик следа: разлёт вбок — толщина, вверх и падение — высота.
  uniform float trailShapeThickness, trailShapeHeight;
  // Миг лопания, угол разлёта, зерно пузыря, номер оттенка.
  attribute vec4 soapDropTime;
  // Направление разлёта и радиус пузыря, с которого капля сорвалась.
  attribute vec4 soapDropFlight;
  // Скорость разлёта и подъём пузыря.
  attribute vec2 soapDropMotion;
  void main() {
    float after = soapClock - soapDropTime.x;
    if (after <= 0.0 || after >= ${q.toFixed(2)}) { soapHide(); return; }
    vec3 centre = instanceMatrix[3].xyz + soapDropFlight.xyz * (soapDropFlight.w
      + after * soapDropMotion.x * vec3(trailShapeThickness, trailShapeHeight, trailShapeThickness));
    centre.y += soapDropMotion.y * after - 2.4 * after * after * trailShapeHeight;
    float envelope = smoothstep(0.0, 1.0, after / 0.025) * (1.0 - smoothstep(0.0, 1.0, (after - 0.11) / 0.24));
    float size = length(instanceMatrix[0].xyz) * max(0.005, envelope);
    soapPlace(centre, soapEuler(vec3(soapDropTime.y, soapDropTime.z * 0.31, after * 1.8)),
      vec3(size, size * (1.45 + after), size));
    #include <logdepthbuf_vertex>
    vSoapColour = mix(soapTint(soapDropTime.w), soapWhite, 0.22);
    vSoapAlpha = envelope * 0.84; vSoapPop = 0.0; vSoapSeed = soapDropTime.z;
  }`,le=`${T}
  // Рождение, зерно, доля голубого.
  attribute vec3 soapFoamTime;
  void main() {
    float age = soapClock - soapFoamTime.x;
    if (age < 0.0 || age >= ${G.toFixed(1)}) { soapHide(); return; }
    float envelope = smoothstep(0.0, 1.0, age / 0.10)
      * (1.0 - smoothstep(0.0, 1.0, (age - 1.55) / ${1.45.toFixed(2)}));
    float size = length(instanceMatrix[0].xyz) * max(0.005, envelope);
    float seed = soapFoamTime.y, c = cos(seed), s = sin(seed);
    soapPlace(instanceMatrix[3].xyz + vec3(0.0, size * 0.43, 0.0),
      mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c), vec3(size * 1.12, size * 0.56, size));
    #include <logdepthbuf_vertex>
    vSoapColour = mix(soapWhite, soapCyan, soapFoamTime.z);
    vSoapAlpha = envelope * 0.72; vSoapPop = 0.0; vSoapSeed = seed;
  }`;function Z(t,r,i,o,s,c,l,u,d){let f=D(r,i,c,l,d),p=u.map(([e,t])=>{let r=new a(new Float32Array(s*t),t).setUsage(n);return o.setAttribute(e,r),r}),m=new e(o,f,s);return m.instanceMatrix.setUsage(n),m.name=r,m.renderOrder=3,m.count=0,m.visible=!1,m.frustumCulled=!1,m.castShadow=!1,m.receiveShadow=!1,t.add(m),{mesh:m,material:f,time:p[0],extra:p,attributes:[m.instanceMatrix,...p],born:new Float64Array(s),until:new Float64Array(s),capacity:s,count:0,slots:h(),appendStart:-1,rebased:!1}}function Q(e,t,n){if(e.count===e.capacity)return-1;let r=e.count++;return e.appendStart<0&&(e.appendStart=r),e.born[r]=t,e.until[r]=n,r}function ue(e){e.count=e.mesh.count=0,e.mesh.visible=!1,e.slots.clear(),e.appendStart=-1,e.rebased=!1;for(let t of e.attributes)t.clearUpdateRanges()}function de(e,t){let n=0;for(;n<e.count;){if(t<e.until[n]){n+=1;continue}let r=--e.count;if(n!==r){e.born[n]=e.born[r],e.until[n]=e.until[r];for(let t of e.attributes){let e=t.itemSize;t.array.copyWithin(n*e,r*e,(r+1)*e)}e.slots.moved(n)}}}function fe(e,t){for(let n=0;n<e.count;n+=1)e.born[n]=e.born[n]-t,e.until[n]=e.until[n]-t,e.time.setX(n,e.born[n]);e.rebased=!0}function $(e){e.mesh.count=e.count,e.mesh.visible=e.count>0;for(let t of e.attributes){let n=t.itemSize,r=!1;t===e.time&&e.rebased&&e.count>0?(t.addUpdateRange(0,e.count*n),r=!0):r=e.slots.upload(t,e.appendStart,e.count),r&&(t.needsUpdate=!0)}e.slots.clear(),e.appendStart=-1,e.rebased=!1}function pe(e){e.mesh.removeFromParent(),e.mesh.geometry.dispose(),e.material.dispose(),e.mesh.dispose()}function me(e,t,n,r=f){let{thickness:a,height:o}=r,s={trailShapeThickness:{value:a},trailShapeHeight:{value:o}},c=Z(e,`Soap_Path_Floating_Bubbles`,`bubble`,C(`trail`),J,se,n,[[`soapBubbleTime`,4],[`soapBubblePath`,4],[`soapBubbleHeading`,3]],s),d=Z(e,`Soap_Path_Foam_Islands`,`foam`,C(`foam`),oe,le,n,[[`soapFoamTime`,3]],s),h=Z(e,`Soap_Path_Pop_Droplets`,`drop`,new i(1,0),ae,ce,n,[[`soapDropTime`,4],[`soapDropFlight`,4],[`soapDropMotion`,2]],s),g=[c,d,h],[_,v,y]=c.extra,[b]=d.extra,[x,w,T]=h.extra,E=new Float64Array(J*Y),D=p(1024),O=new l,k=new l,A=new u,j=0,M=0,N=0,P=0,F=0,I=!1,L=(e,t,n,r,i,s)=>{let l=P++;for(let u of ne[j]){let d=u>=0?u:1+l%2,f=l*13.31+d*2.17,p=X(f),h=(d===0?.52+p*.3:.24+p*.24)*a,g=r+d*.06,b=1.35+X(f+1)*.9;if(F===J)return;let x=Q(c,g,g+b+K);if(x<0)return;let S=(.7+X(f+2)*.8)*o,C=(d===0?Math.sin(f)*.84:(d===1?-1:1)*(.86+p*.39))*a,w=(X(f+3)-.5)*.8,T=(p-.5)*.4*a,D=.14+p*.2;A.makeScale(h,h,h),A.setPosition(e,t,n),c.mesh.setMatrixAt(x,A),_.setXYZW(x,g,b,S,f),v.setXYZW(x,C,w,T,D),y.setXYZ(x,i,s,(l+d)%4);let O=C+T*b,k=w-b*D,j=F++*Y;E[j]=g+b,E[j+1]=e+s*O+i*k,E[j+2]=t+.12*o+h+S*(1-Math.exp(-b*1.3))*1.5+(Math.sin(b*2.4+f)-Math.sin(f))*.045*o,E[j+2]=Math.max(t+m+h*(1+Math.abs(Math.sin(b*3.1+f)*.04)),E[j+2]),E[j+3]=n-i*O+s*k,E[j+4]=h,E[j+5]=f,E[j+6]=S,E[j+7]=p,E[j+8]=l+d}if(l%3==0)for(let o of ie[j]){let c=l*7.11+o*2.71,u=X(c),f=Q(d,r,r+G);if(f<0)return;let p=o*W/5+l,h=o===0?0:(.18+u*.12)*a,g=Math.sin(l*2.17)*1.03*a+Math.cos(p)*h,_=Math.sin(p)*h,v=(.105+u*.13)*a;A.makeScale(v,v,v),A.setPosition(e+s*g+i*_,t+Math.max(.025,m+.13*v),n-i*g+s*_),d.mesh.setMatrixAt(f,A),b.setXYZ(f,r,c,.13+u*.15)}},R=e=>{let t=E[e],n=E[e+5];if(!(M>=t+q))for(let r of re[j]){let i=Q(h,t,t+q);if(i<0)return;let o=n+r*Math.PI*.5,s=-.15+X(n+r+5)*1.1;k.set(Math.cos(o),s,Math.sin(o)).normalize();let c=(.021+X(n+r+7)*.024)*a;A.makeScale(c,c,c),A.setPosition(E[e+1],E[e+2],E[e+3]),h.mesh.setMatrixAt(i,A),x.setXYZW(i,t,o,n,(E[e+8]+r)%4),w.setXYZW(i,k.x,k.y,k.z,E[e+4]),T.setXY(i,1.25+E[e+7]*.85,E[e+6])}},z=()=>{let e=0;for(;e<F*Y;){if(E[e]>M){e+=Y;continue}R(e);let t=--F*Y;E.copyWithin(e,t,t+Y)}},B=()=>{for(let e of g)ue(e),$(e);M=P=F=0,n.soapClock.value=0};return{setTier(e){if(e!==0&&e!==1&&e!==2)throw RangeError(`Invalid soap trail tier`);I||(j=e)},step(e,r){if(I)return;t.getWorldPosition(O);let i=D.step(O.x,O.y,O.z,e,r,te[j]);if(D.cleared){B();return}if(!Number.isFinite(e)||e<=0)return;if(M+=e,N=(N+e)%S,M>=128){let e=Math.floor(M/128)*128;M-=e;for(let t of g)fe(t,e);for(let t=0;t<F*Y;t+=Y)E[t]=E[t]-e}for(let e of g)de(e,M);z();let a=Math.hypot(D.direction[0],D.direction[2]),o=a>1e-4?D.direction[0]/a:0,s=a>1e-4?D.direction[2]/a:1;for(let e=0;e<i;e+=1){let t=e*3;L(D.positions[t],D.positions[t+1],D.positions[t+2],M-D.elapsed[e],o,s)}for(let e of g)$(e);n.soapClock.value=M,n.soapTime.value=N},reset(){I||(B(),D.reset())},dispose(){if(!I){I=!0;for(let e of g)pe(e)}}}}function he(e,t,n,r=f){let i=w(),a=me(e,t,i,r);return{step:(e,t)=>a.step(e,t),setTier:e=>a.setTier(e),reset:()=>a.reset(),view:O(i,n.character),dispose:()=>a.dispose()}}function ge(e,t,n){let r=w(),i=U(t,r);return{step:(e,t)=>i.step(e,t),setTier:e=>i.setTier(e),reset:()=>i.reset(),view:O(r,n.character),dispose:()=>i.dispose()}}export{ge as createSoapAuraEffect,he as createSoapTrailEffect};