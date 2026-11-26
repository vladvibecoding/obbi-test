//# allFunctionsCalledOnLoad
import{$ as e,B as t,Cr as n,P as r,R as i,St as a,Tr as o,Xn as s,Z as c,Zn as l,d as u,l as d,qn as f,ur as p,v as m,wr as h,wt as g}from"./three.core-DVTiNhEy.js";import{o as _}from"./src-BI6MMqKu.js";import{n as v,r as y,t as b}from"./trail-shape-BsaeWHuc.js";import{t as x}from"./trail-slots-BYU9mmsR.js";var S=Math.PI*2,ee=108,C=3,w=14,te=[9,7,5],T=te[0],E=C*T,D=.27,O=.205,k=1.32,A=-2.23,j=24,M=3600,N=e=>new m().setHex(_(e),f),P=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float musicOrbit, musicBeat, musicMotion, musicWidth, musicClear;
  // Высота столбца и его пиковой метки.
  uniform vec2 musicColumns[${E}];
  // Из слоя ауры в пространство камеры: по нему столбцы расступаются перед лицом.
  uniform mat4 musicBodyView;
  // Голова в слое ауры и её радиус там же.
  uniform vec4 musicHead;
  uniform vec3 musicFaceCentre;
  // Радиус головы в мире и её угловой радиус на экране.
  uniform vec2 musicHeadReach;
  // Полоса: столбец, сектор, место полосы в секторе из девяти, ряд. Дуга: сектор, волна.
  attribute vec4 musicCell;
  attribute vec3 musicTint;
  varying vec3 vMusicTint, vMusicNormal, vMusicViewPosition;
  varying vec2 vMusicUv;
  varying float vMusicGlow;

  // Столбец перед лицом опускается под подбородок, чтобы не закрывать его.
  float musicClearTop(float x, float z, float top, float base) {
    if (musicClear < 0.5) return top;
    vec4 seen = musicBodyView * vec4(x, musicHead.y, z, 1.0);
    float depth = -seen.z;
    if (depth <= 0.001 || depth > musicFaceCentre.z + musicHeadReach.x) return top;
    float offset = abs(-seen.x / depth - musicFaceCentre.x / max(musicFaceCentre.z, 0.001));
    float weight = clamp((1.35 - offset / max(musicHeadReach.y, 0.0001)) / 0.45, 0.0, 1.0);
    weight = weight * weight * (3.0 - 2.0 * weight);
    float ceiling = max(base + 0.30, musicHead.y - musicHead.w - 0.30);
    return top + (min(top, ceiling) - top) * weight;
  }

  void main() {
    vec3 centre, scale;
    float yaw, glow;
    #if MUSIC_KIND == 2
      float sector = musicCell.x, wave = musicCell.y;
      float middle = PI * 0.5 + sector * PI2 / 3.0 + musicOrbit;
      yaw = -(middle - ${k.toFixed(2)} * 0.5);
      float phase = wave < 0.5 ? 0.0 : fract(musicBeat * 0.5 + wave * 0.5 + sector * 0.12);
      scale = vec3(2.70 + sector * 0.13 + phase * 0.55);
      centre = vec3(0.0, ${A.toFixed(2)} - 0.07 + wave * 0.035, -musicMotion * 0.20);
      glow = wave < 0.5 ? 0.52 : sin(phase * PI) * 0.63;
    #else
      float sector = musicCell.y, band = musicCell.z;
      float middle = PI * 0.5 + sector * PI2 / 3.0 + musicOrbit;
      float angle = middle - ${k.toFixed(2)} * 0.5 + band * ${k.toFixed(2)} / ${(T-1).toFixed(1)};
      float radius = 2.70 + sector * 0.13 + sin(musicBeat * PI2 / 8.0 + sector * 1.6) * 0.055;
      float x = cos(angle) * radius, z = sin(angle) * radius - musicMotion * 0.20;
      float base = ${A.toFixed(2)} + sector * 0.035;
      vec2 level = musicColumns[int(musicCell.x + 0.5)];
      yaw = -angle - PI * 0.5;
      #if MUSIC_KIND == 0
        float row = musicCell.w;
        float height = max(0.30, musicClearTop(x, z, base + level.x, base) - base);
        float fraction = clamp((height - row * ${D.toFixed(2)}) / ${D.toFixed(2)}, 0.0, 1.0);
        float tall = ${O.toFixed(3)} * fraction;
        centre = vec3(x, base + row * ${D.toFixed(2)} + tall * 0.5, z);
        scale = vec3((0.25 + sector * 0.012) * musicWidth, tall, 0.18);
        glow = (0.79 + row / ${w.toFixed(1)} * 0.17) * (0.5 + fraction * 0.5);
        if (fraction < 0.012) { scale = vec3(0.0); glow = 0.0; }
      #else
        centre = vec3(x, musicClearTop(x, z, base + level.y + 0.11, base), z);
        scale = vec3(0.31 * musicWidth, 0.065, 0.22);
        glow = 0.98;
      #endif
    #endif
    float c = cos(yaw), s = sin(yaw);
    vec3 local = position * scale;
    // Нормаль под неравномерным растяжением: обратная к масштабу, потом поворот.
    vec3 bent = normal / max(scale, vec3(0.000001));
    vec4 point = modelViewMatrix * vec4(centre + vec3(local.x * c + local.z * s, local.y,
      local.z * c - local.x * s), 1.0);
    vMusicNormal = normalize(normalMatrix * vec3(bent.x * c + bent.z * s, bent.y, bent.z * c - bent.x * s));
    vMusicViewPosition = -point.xyz; vMusicUv = uv;
    vMusicTint = musicTint; vMusicGlow = glow;
    gl_Position = projectionMatrix * point;
    #include <logdepthbuf_vertex>
  }`,F=`
  #include <common>
  #include <logdepthbuf_pars_fragment>
  uniform vec3 musicFaceCentre, musicLight;
  uniform vec2 musicFaceRadius;
  uniform float musicFaceEnabled;
  varying vec3 vMusicTint, vMusicNormal, vMusicViewPosition;
  varying vec2 vMusicUv;
  varying float vMusicGlow;
  void main() {
    if (vMusicGlow < 0.006) discard;
    if (musicFaceEnabled > 0.5 && vMusicViewPosition.z < musicFaceCentre.z + musicFaceRadius.y) {
      vec2 offset = vMusicViewPosition.xy / max(vMusicViewPosition.z, 0.001)
        - musicFaceCentre.xy / max(musicFaceCentre.z, 0.001);
      float offAxis = sqrt(1.0 + dot(musicFaceCentre.xy, musicFaceCentre.xy)
        / max(musicFaceCentre.z * musicFaceCentre.z, 0.0001));
      vec2 radius = musicFaceRadius * offAxis
        / max(musicFaceCentre.z - max(musicFaceRadius.x, musicFaceRadius.y), 0.1);
      if (dot(offset / radius, offset / radius) < 1.0) discard;
    }
    vec3 normalView = normalize(vMusicNormal);
    vec3 lightDirection = normalize(vec3(-0.45, 0.80, 0.65));
    float face = max(0.0, dot(normalView, lightDirection));
    float edge = min(min(vMusicUv.x, 1.0 - vMusicUv.x), min(vMusicUv.y, 1.0 - vMusicUv.y));
    float bevel = smoothstep(0.015, 0.07, edge);
    vec3 colour = vMusicTint * (0.68 + face * 0.42) * mix(0.66, 1.0, bevel);
    vec3 eye = normalize(vMusicViewPosition + vec3(0.0001));
    float sheen = pow(max(0.0, dot(reflect(-lightDirection, normalView), eye)), 18.0);
    colour += musicLight * sheen * 0.16;
    #include <logdepthbuf_fragment>
    gl_FragColor = vec4(colour, min(0.96, vMusicGlow * 0.92));
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;function I(t,r){let i=N(`cyan/1`),a=N(`lavender/2`),l=N(`white`),u=Array.from({length:E},()=>new n),f=new h,_=new n(1.05,1.05),v=new o,y=new n,b=new g,x={musicOrbit:{value:0},musicBeat:{value:0},musicMotion:{value:0},musicWidth:{value:1},musicClear:{value:0},musicColumns:{value:u},musicBodyView:{value:b},musicHead:{value:v},musicHeadReach:{value:y},musicFaceCentre:{value:f},musicFaceRadius:{value:_},musicFaceEnabled:{value:0},musicLight:{value:l}},D=new d(1,1,1),O=new d(1,1,1),A=new p(1,.014,5,26,k);A.rotateX(Math.PI/2);let I=(n,r,i,a)=>{let o=new c(new Float32Array(i*4),4),l=new c(new Float32Array(i*3),3);n.setAttribute(`musicCell`,o),n.setAttribute(`musicTint`,l);let u=new s({name:a,vertexShader:P,fragmentShader:F,defines:{MUSIC_KIND:r},uniforms:{...x},transparent:!0,depthWrite:!1,depthTest:!0,blending:1,toneMapped:!0}),d=new e(n,u,i);return d.name=a,d.frustumCulled=!1,d.castShadow=d.receiveShadow=!1,d.renderOrder=2,d.count=0,d.visible=!1,t.add(d),{mesh:d,cell:o,tint:l}},L=I(D,0,E*w,`Music_Aura_Segmented_Columns`),R=I(O,1,E,`Music_Aura_Peak_Markers`),z=I(A,2,9,`Music_Aura_Base_And_Waves`),B=[L,R,z],V=new Float32Array(E),H=new Float32Array(E),U=new Float32Array(E),W=new Float32Array(E),G=r?.getObjectByName(`mixamorigHead_06`)??null,K=new h,q=new h,J=new m,Y=0,X=0,Z=0,Q=0,$=!1,ne=(e,t)=>{let n=Z*ee/60,r=.5+.5*Math.sin(n*S/(4+e*2)+t*.68+e*1.45),i=(.5+.5*Math.cos(S*n-t*.27+e*.8))**2;return .96+r*1.88+i*(.42+.42*Math.sin((t+1)*Math.PI/10))},re=()=>{for(let e=0;e<X;e+=1)u[e].set(V[e],H[e]);x.musicOrbit.value=Z*S/60%S,x.musicBeat.value=Z*ee/60%j,x.musicMotion.value=Q},ie=()=>{for(let e=0;e<X;e+=1)V[e]=H[e]=ne(U[e],W[e]);re()},ae=()=>{let e=te[Y];X=C*e,x.musicWidth.value=1+((T-1)/(e-1)-1)*.5;for(let t=0;t<X;t+=1){let n=Math.floor(t/e),r=t%e*(T-1)/(e-1);U[t]=n,W[t]=r;let o=n===0?.15+r*.035:n===1?.65+r*.035:.25+r*.075;J.copy(i).lerp(a,o);for(let e=0;e<w;e+=1){let i=t*w+e;L.cell.setXYZW(i,t,n,r,e),L.tint.setXYZ(i,J.r,J.g,J.b)}J.lerp(l,.3),R.cell.setXYZW(t,t,n,r,0),R.tint.setXYZ(t,J.r,J.g,J.b)}for(let e=0;e<C;e+=1){J.copy(i).lerp(a,e/2);for(let t=0;t<3;t+=1)z.cell.setXYZW(e*3+t,e,t,0,0),z.tint.setXYZ(e*3+t,J.r,J.g,J.b)}L.mesh.count=X*w,R.mesh.count=X,z.mesh.count=9;for(let e of B)e.mesh.visible=!0,e.cell.needsUpdate=e.tint.needsUpdate=!0;ie()};return ae(),{setTier(e){$||e===Y||(Y=e,ae())},step(e,t){if($||!Number.isFinite(e)||e<=0)return;Z=(Z+e%M)%M,Q+=(+!!t-Q)*(1-Math.exp(-e*3));let n=1-Math.exp(-e*5.2);for(let t=0;t<X;t+=1)V[t]=V[t]+(ne(U[t],W[t])-V[t])*n,H[t]=Math.max(V[t],H[t]-e*.85);re()},view(e){if($)return;if(G===null){x.musicFaceEnabled.value=x.musicClear.value=0;return}e.updateMatrixWorld(),t.updateWorldMatrix(!0,!1);let n=Math.max(1e-4,t.matrixWorld.getMaxScaleOnAxis());G.updateWorldMatrix(!0,!1),K.set(-.00570525,.6573547,.02455115),G.localToWorld(K);let r=1.00256*G.matrixWorld.getMaxScaleOnAxis()+.14;q.copy(K),t.worldToLocal(q),v.set(q.x,q.y,q.z,r/n),f.copy(K).applyMatrix4(e.matrixWorldInverse).multiplyScalar(-1),_.set(r,r);let i=Number.isFinite(f.lengthSq())&&f.z>.1?1:0,a=Math.max(.001,f.z),o=Math.sqrt(1+(f.x**2+f.y**2)/(a*a));y.set(r,r*o/Math.max(a-r,.1)),b.multiplyMatrices(e.matrixWorldInverse,t.matrixWorld),x.musicFaceEnabled.value=x.musicClear.value=i},reset(){$||(Z=Q=0,ie())},dispose(){if(!$){$=!0;for(let e of B)e.mesh.removeFromParent(),e.mesh.material.dispose(),e.mesh.dispose();D.dispose(),O.dispose(),A.dispose()}}}}var L=Math.PI*2,R=108/60,z=60,B=1.6,V=1.48,H=[.65,1.18,2.17],U=3072,W=3072,G=512,K=6,q=4,J=900,Y=e=>new m().setHex(_(e),f),X=Y(`cyan/1`),Z=Y(`lavender/2`),Q=Y(`white`),$=e=>{let t=a.clamp(e,0,1);return t*t*(3-2*t)},ne=`
  // Гаснет со второй трети жизни; в начале следа станции сужаются.
  float musicFade(float age, float taper) {
    return (1.0 - smoothstep(0.3, 1.0, age / ${B.toFixed(2)})) * taper;
  }`,re=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float musicClock;
  // Облик следа: толщина множит трубки и вынос вбок, высота — подъём над ступнями.
  uniform float trailShapeThickness, trailShapeHeight;
  uniform vec3 musicCyan, musicViolet, musicWhite;
  // Рождение станций A и B и их сужение в начале следа.
  attribute vec4 musicLife;
  // Станция A: место и фаза волны. Станция B: место и приращение фазы.
  attribute vec4 musicFrom;
  attribute vec4 musicTo;
  // Курс бега по земле у A и у B.
  attribute vec4 musicCourse;
  // Такт и размах волны у A и у B.
  attribute vec4 musicBeat;
  varying vec3 vMusicTint, vMusicNormal, vMusicView;
  varying float vMusicAlpha, vMusicRail;
  ${ne}

  vec2 musicDirection(float t) {
    vec2 course = mix(musicCourse.xy, musicCourse.zw, t);
    float size = length(course);
    return size > 0.00001 ? course / size : musicCourse.zw;
  }

  void main() {
    // x — доля пути от A к B, y — угол вокруг трубки или сторона полосы,
    // z — канал, у боковой полосы на два больше.
    float t = position.x;
    float channel = mod(position.z, 2.0);
    float flank = 1.0 - 2.0 * channel;
    vec3 colour = channel < 0.5 ? musicCyan : musicViolet;
    float age = max(0.0, musicClock - mix(musicLife.x, musicLife.y, t));
    float fade = musicFade(age, mix(musicLife.z, musicLife.w, t));
    vec4 point;
    if (position.z > 1.5) {
      // Стереодорожка вдоль графика: прямая между станциями толщиной в точку.
      float offset = flank * 1.06 * trailShapeThickness;
      // Курсы самих станций процессор уже нормировал при рождении: нормировать
      // их здесь ещё раз — лишняя работа компилятора Direct3D на первом draw.
      vec2 a = musicCourse.xy, b = musicCourse.zw;
      // Дорожка без объёма: не ниже TRAIL_FLOOR над станцией, иначе пол спорит с ней за пиксель.
      float rail = max(0.12 * trailShapeHeight, ${b.toFixed(3)});
      vec4 from = modelViewMatrix * vec4(musicFrom.x - a.y * offset, musicFrom.y + rail,
        musicFrom.z + a.x * offset, 1.0);
      vec4 to = modelViewMatrix * vec4(musicTo.x - b.y * offset, musicTo.y + rail,
        musicTo.z + b.x * offset, 1.0);
      vec2 along = to.xy / max(-to.z, 0.0001) - from.xy / max(-from.z, 0.0001);
      float size = length(along);
      vec2 across = size > 0.000001 ? vec2(-along.y, along.x) / size : vec2(0.0, 1.0);
      point = t < 0.5 ? from : to;
      point.xy += across * position.y * max(-point.z, 0.0001)
        / (projectionMatrix[1][1] * ${J.toFixed(1)});
      vMusicNormal = vec3(0.0, 0.0, 1.0);
      vMusicTint = colour;
      vMusicAlpha = fade * 0.3;
      vMusicRail = 1.0;
    } else {
      float beat = mix(musicBeat.x, musicBeat.z, t);
      float amplitude = mix(musicBeat.y, musicBeat.w, t);
      float phase = musicFrom.w + musicTo.w * t - age * 2.1;
      vec3 root = mix(musicFrom.xyz, musicTo.xyz, t);
      vec2 course = musicDirection(t);
      float across = flank * (0.3 + sin(phase) * amplitude) * (0.35 + fade * 0.65) * trailShapeThickness;
      float height = 0.18 * trailShapeHeight
        + (0.24 + cos(phase + channel * PI) * 0.19) * (0.2 + fade * 0.8) * trailShapeHeight;
      float radius = (0.095 + beat * 0.035) * max(0.02, fade) * trailShapeThickness;
      // Низ трубки — не ниже TRAIL_FLOOR над станциями: низкий след ложится трубкой на пол.
      height = max(height, ${b.toFixed(3)} + radius);
      float h = cos(position.y), v = sin(position.y);
      float reach = across + h * radius;
      point = modelViewMatrix * vec4(root.x - course.y * reach, root.y + height + v * radius,
        root.z + course.x * reach, 1.0);
      vMusicNormal = normalize(normalMatrix * vec3(-course.y * h, v, course.x * h));
      vMusicTint = mix(colour, musicWhite, beat * 0.23);
      vMusicAlpha = fade * 0.94;
      vMusicRail = 0.0;
    }
    vMusicView = -point.xyz;
    gl_Position = projectionMatrix * point;
    #include <logdepthbuf_vertex>
  }`,ie=`
  #include <common>
  #include <logdepthbuf_pars_fragment>
  uniform vec3 musicWhite;
  varying vec3 vMusicTint, vMusicNormal, vMusicView;
  varying float vMusicAlpha, vMusicRail;
  void main() {
    float core = pow(abs(dot(normalize(vMusicNormal), normalize(vMusicView))), 4.0);
    // У дорожки нет объёма: светлого ядра трубки у неё нет.
    float glow = vMusicRail > 0.5 ? 0.0 : core;
    float alpha = vMusicRail > 0.5 ? vMusicAlpha : vMusicAlpha * (0.4 + core * 0.6);
    if (alpha < 0.003) discard;
    #include <logdepthbuf_fragment>
    gl_FragColor = vec4(mix(vMusicTint, musicWhite, glow * 0.42), alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`,ae=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float musicClock;
  // Ширина штриха и его вынос записаны с толщиной; здесь она множит высоту и глубину.
  uniform float trailShapeThickness;
  uniform vec3 musicCyan, musicViolet;
  attribute float musicBorn;
  // Место штриха и курс, поперёк которого он стоит.
  attribute vec4 musicTick;
  // Ширина, такт, сужение в начале следа, канал.
  attribute vec4 musicTickShape;
  varying vec3 vMusicTint;
  ${ne}
  void main() {
    float fade = musicFade(max(0.0, musicClock - musicBorn), musicTickShape.z);
    vec3 scale = fade > 0.004 ? vec3(musicTickShape.x * fade,
      (0.045 + musicTickShape.y * 0.065) * max(0.1, fade) * trailShapeThickness,
      0.085 * trailShapeThickness) : vec3(0.0);
    vec3 local = position * scale;
    float c = cos(musicTick.w), s = sin(musicTick.w);
    vec3 world = musicTick.xyz + vec3(local.x * c + local.z * s, local.y, local.z * c - local.x * s);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(world, 1.0);
    vMusicTint = (musicTickShape.w < 0.5 ? musicCyan : musicViolet) * (0.4 + fade * 0.6);
    #include <logdepthbuf_vertex>
  }`,oe=`
  #include <common>
  #include <logdepthbuf_pars_fragment>
  varying vec3 vMusicTint;
  void main() {
    #include <logdepthbuf_fragment>
    gl_FragColor = vec4(vMusicTint, 0.78);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`,se=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float musicClock, musicPulse, musicSway, musicSide;
  // Облик следа: толщина — размер ноты и её качание вбок, высота — подъём.
  uniform float trailShapeThickness, trailShapeHeight;
  // Половины ширины и высоты ноты: по ним нота держит низ над полом.
  uniform vec2 musicNoteHalf;
  uniform vec3 musicCyan, musicViolet, musicWhite;
  attribute float musicBorn;
  // Место станции и вынос ноты вбок от пути.
  attribute vec4 musicNote;
  // Курс бега, фаза пританцовывания, фиолетовая ли нота.
  attribute vec4 musicNoteCourse;
  varying vec3 vMusicNormal, vMusicView, vMusicTint;
  void main() {
    float age = max(0.0, musicClock - musicBorn);
    float k = age / ${B.toFixed(2)};
    // Выпрыгивает с перелётом и сжимается к концу жизни.
    float grow = 1.0 - pow(1.0 - min(age / 0.22, 1.0), 3.0);
    float overshoot = 1.0 + sin(min(age / 0.32, 1.0) * PI) * 0.28;
    float size = 0.95 * grow * overshoot * (1.0 - smoothstep(0.72, 1.0, k)) * (1.0 + musicPulse * 0.1)
      * trailShapeThickness;
    if (size <= 0.002 || k >= 1.0) size = 0.0;
    float seed = musicNoteCourse.z;
    vec2 course = musicNoteCourse.xy;
    float across = musicNote.w + sin(age * 3.1 + seed) * 0.16 * trailShapeThickness;
    float back = -age * 0.25;
    vec3 centre = vec3(musicNote.x - course.y * across + course.x * back,
      musicNote.y + 0.45 * trailShapeHeight + age * 1.3 * trailShapeHeight
        + sin(age * 5.0 + seed) * 0.05 * trailShapeHeight,
      musicNote.z + course.x * across + course.y * back);
    // Нота смотрит назад по ходу бега, к догоняющей камере, но не на камеру:
    // поворот зависит только от пути. Пританцовывает вокруг вертикали и в такт.
    float yaw = atan(-course.x, -course.y) + sin(age * 4.2 + seed) * 0.38;
    float roll = musicSide * 0.18 + musicSway * 0.12;
    float cy = cos(yaw), sy = sin(yaw), cr = cos(roll), sr = sin(roll);
    // Нота выпрыгивает из пола, а не из-под него: низ наклонённой ноты держится
    // над станцией на TRAIL_FLOOR. Поворот вокруг вертикали высоту не меняет.
    centre.y = max(centre.y, musicNote.y + ${b.toFixed(3)}
      + size * (musicNoteHalf.x * abs(sr) + musicNoteHalf.y * abs(cr)));
    vec3 p = position * size;
    p = vec3(p.x * cr - p.y * sr, p.x * sr + p.y * cr, p.z);
    p = vec3(p.x * cy + p.z * sy, p.y, p.z * cy - p.x * sy);
    vec3 n = vec3(normal.x * cr - normal.y * sr, normal.x * sr + normal.y * cr, normal.z);
    n = vec3(n.x * cy + n.z * sy, n.y, n.z * cy - n.x * sy);
    vec4 point = modelViewMatrix * vec4(centre + p, 1.0);
    gl_Position = projectionMatrix * point;
    vMusicNormal = normalize(normalMatrix * n);
    vMusicView = -point.xyz;
    vMusicTint = mix(musicNoteCourse.w > 0.5 ? musicViolet : musicCyan, musicWhite, musicPulse * 0.2);
    #include <logdepthbuf_vertex>
  }`,ce=`
  #include <common>
  #include <logdepthbuf_pars_fragment>
  uniform vec3 musicWhite;
  varying vec3 vMusicNormal, vMusicView, vMusicTint;
  void main() {
    vec3 normal = normalize(vMusicNormal), view = normalize(vMusicView);
    vec3 light = normalize(mat3(viewMatrix) * vec3(-0.45, 0.85, 0.3));
    float diffuse = max(dot(normal, light), 0.0);
    float rim = pow(1.0 - abs(dot(normal, view)), 2.0);
    float shine = pow(max(dot(normal, normalize(light + view)), 0.0), 40.0);
    #include <logdepthbuf_fragment>
    gl_FragColor = vec4(vMusicTint * (0.62 + diffuse * 0.45) + musicWhite * (rim * 0.35 + shine * 0.6), 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;function le(e){let t=[],n=(e,n)=>{let r=new l;r.absellipse(e,n,.2,.14,0,L,!1,-.35),t.push(r)},r=e=>{let n=new l;n.moveTo(e[0],e[1]);for(let t=2;t<e.length;t+=2)n.lineTo(e[t],e[t+1]);t.push(n)};if(n(0,0),r([.155,.03,.215,.03,.215,.95,.155,.95]),e)n(.5,.1),r([.655,.13,.715,.13,.715,1.03,.655,1.03]),r([.155,.8,.715,.9,.715,1.03,.155,.93]);else{let e=new l;e.moveTo(.155,.95),e.lineTo(.215,.95),e.quadraticCurveTo(.25,.78,.4,.66),e.quadraticCurveTo(.49,.56,.42,.38),e.quadraticCurveTo(.45,.58,.215,.7),e.lineTo(.155,.7),t.push(e)}let a=new i(t,{depth:.1,curveSegments:10,bevelEnabled:!0,bevelThickness:.025,bevelSize:.02,bevelSegments:1});return a.center(),a}function ue(){let e=[],n=[];for(let t=0;t<2;t+=1){let r=e.length/3;for(let n=0;n<q;n+=1)for(let r=0;r<K;r+=1)e.push(n/3,r*L/K,t);for(let e=0;e<3;e+=1)for(let t=0;t<K;t+=1){let i=r+e*K+t,a=r+e*K+(t+1)%K;n.push(i,i+K,a,a,i+K,a+K)}let i=e.length/3;e.push(0,-1,t+2,0,1,t+2,1,-1,t+2,1,1,t+2),n.push(i,i+2,i+1,i+1,i+2,i+3)}let r=new u;return r.setAttribute(`position`,new t(e,3)),r.setIndex(n),r}function de(t,n,i,a,o,s){let l=o.map(([e,t])=>{let i=new c(new Float32Array(a*t),t).setUsage(r);return n.setAttribute(e,i),i}),u=new e(n,i,a);return u.instanceMatrix.array.fill(0),u.name=i.name,u.count=0,u.visible=!1,u.frustumCulled=!1,u.castShadow=!1,u.receiveShadow=!1,t.add(u),{mesh:u,material:i,born:l[0],bornWidth:s,attributes:l,expiry:new Float64Array(a),capacity:a,count:0,slots:x(),appendStart:-1,rebased:!1}}function fe(e,t){if(e.count===e.capacity)return-1;let n=e.count++;return e.appendStart<0&&(e.appendStart=n),e.expiry[n]=t,n}function pe(e){e.count=e.mesh.count=0,e.mesh.visible=!1,e.slots.clear(),e.appendStart=-1,e.rebased=!1;for(let t of e.attributes)t.clearUpdateRanges()}function me(e,t){let n=0;for(;n<e.count;){if(t-e.expiry[n]<B){n+=1;continue}let r=--e.count;if(n!==r){e.expiry[n]=e.expiry[r];for(let t of e.attributes){let e=t.itemSize;t.array.copyWithin(n*e,r*e,(r+1)*e)}e.slots.moved(n)}}}function he(e,t){let n=e.born.array,r=e.born.itemSize;for(let i=0;i<e.count;i+=1){e.expiry[i]=e.expiry[i]-t;for(let a=i*r;a<i*r+e.bornWidth;a+=1)n[a]=n[a]-t}e.rebased=!0}function ge(e){e.mesh.count=e.count,e.mesh.visible=e.count>0;for(let t of e.attributes){let n;t===e.born&&e.rebased&&e.count>0?(t.addUpdateRange(0,e.count*t.itemSize),n=!0):n=e.slots.upload(t,e.appendStart,e.count),n&&(t.needsUpdate=!0)}e.slots.clear(),e.appendStart=-1,e.rebased=!1}function _e(e){e.mesh.removeFromParent(),e.mesh.geometry.dispose(),e.material.dispose(),e.mesh.dispose()}function ve(e,t,r=v){let i={value:0},a={value:0},o={value:0},c=r.thickness,l=r.height,u={trailShapeThickness:{value:c},trailShapeHeight:{value:l}},f={musicCyan:{value:X},musicViolet:{value:Z},musicWhite:{value:Q}},p=de(e,ue(),new s({name:`Music_Trail_Waves`,vertexShader:re,fragmentShader:ie,uniforms:{musicClock:i,...f,...u},transparent:!0,depthWrite:!1,toneMapped:!0}),U,[[`musicLife`,4],[`musicFrom`,4],[`musicTo`,4],[`musicCourse`,4],[`musicBeat`,4]],2),m=de(e,new d(1,1,1),new s({name:`Music_Trail_Spectrum_Ticks`,vertexShader:ae,fragmentShader:oe,uniforms:{musicClock:i,...f,...u},transparent:!0,depthWrite:!1,toneMapped:!0}),W,[[`musicBorn`,1],[`musicTick`,4],[`musicTickShape`,4]],1),g=[!1,!0].map(t=>{let r=le(t);r.computeBoundingBox();let c=r.boundingBox,l=new n(Math.max(-c.min.x,c.max.x),Math.max(-c.min.y,c.max.y));return de(e,r,new s({name:t?`Music_Trail_Beamed_Notes`:`Music_Trail_Single_Notes`,vertexShader:se,fragmentShader:ce,uniforms:{musicClock:i,musicPulse:a,musicSway:o,musicSide:{value:t?-1:1},musicNoteHalf:{value:l},...f,...u},toneMapped:!0}),G,[[`musicBorn`,1],[`musicNote`,4],[`musicNoteCourse`,4]],1)}),_=[p,m,...g],[x,S,ee,C,w]=p.attributes,[te,T,E]=m.attributes,D=y(1024),O=new h,k={x:0,y:0,z:0,born:0,dx:0,dz:1,phase:0,beat:0,amplitude:0,taper:0,lead:0,spacing:0},A=0,j=0,M=0,N=0,P=!1,F=!1,I=(e,t,n,r,i,a)=>{let o=j-r,s=N++,u=H[A],d=(.5+Math.cos((M-r)*R*L)*.5)**3,f=.6+d*.48+Math.sin(s*.31)*.12,h=P&&j-k.born<B&&Math.hypot(e-k.x,t-k.y,n-k.z)<=k.spacing+u+.25,_=h?k.lead+1:0,v=$((_+1)/5),y=s===0?0:(k.phase+u*V)%L;if(h){let r=fe(p,k.born);r>=0&&(x.setXYZW(r,k.born,o,k.taper,v),S.setXYZW(r,k.x,k.y,k.z,k.phase),ee.setXYZW(r,e,t,n,u*V),C.setXYZW(r,k.dx,k.dz,i,a),w.setXYZW(r,k.beat,k.amplitude,d,f))}if(s%2==0)for(let r=0;r<2;r+=1){let u=fe(m,o);if(u<0)break;let p=r===0?1:-1,h=.2+f*(.28+(.5+Math.sin(s*.57+r*1.7)*.5)*.56),g=p*(1.12+h/2)*c;te.setX(u,o);let _=t+b+(.045+d*.065)*c/2;T.setXYZW(u,e-a*g,Math.max(t+.15*l+d*.04*l,_),n+i*g,Math.atan2(-i,-a)),E.setXYZW(u,h*c,d,v,r)}if(s%3==0){let r=s%2,l=g[r],u=fe(l,o);if(u>=0){let d=r===0?1:-1,[f,p,m]=l.attributes;f.setX(u,o),p.setXYZW(u,e,t,n,d*(.55+Math.sin(s*1.7)*.2)*c),m.setXYZW(u,i,a,s%L,+(s%4==0))}}Object.assign(k,{x:e,y:t,z:n,born:o,dx:i,dz:a,phase:y,beat:d,amplitude:f,taper:v,lead:_,spacing:u}),P=!0},K=()=>{for(let e of _)ge(e);i.value=j;let e=M*R*L;a.value=(.5+.5*Math.cos(e))**4,o.value=Math.sin(e)},q=()=>{for(let e of _)pe(e);j=0,N=0,P=!1,K()},J=()=>{q(),D.reset(),M=0,K()};return{setTier(e){F||(A=e)},step(e,n){if(F)return;t.getWorldPosition(O);let r=D.step(O.x,O.y,O.z,e,n,H[A]);if(D.cleared){q();return}if(!Number.isFinite(e)||e<=0)return;if(j+=e,M=(M+e)%z,j>=128){let e=Math.floor(j/128)*128;j-=e,k.born-=e;for(let t of _)he(t,e)}for(let e of _)me(e,j);let i=D.direction,a=Math.hypot(i[0],i[2]),o=a>1e-6?i[0]/a:0,s=a>1e-6?i[2]/a:1;for(let e=0;e<r;e+=1){let t=e*3;I(D.positions[t],D.positions[t+1],D.positions[t+2],D.elapsed[e],o,s)}K()},reset(){F||J()},dispose(){if(!F){F=!0;for(let e of _)_e(e)}}}}function ye(e,t,n,r=v){return ve(e,t,r)}function be(e,t,n){return I(t,n.character)}export{be as createMusicAuraEffect,ye as createMusicTrailEffect};