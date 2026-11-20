//# allFunctionsCalledOnLoad
import{B as e,K as t,P as n,Q as r,St as i,Tt as a,Xn as o,Z as s,er as c,i as l,s as u,u as d,wr as f,wt as p}from"./three.core-DVTiNhEy.js";import{Ct as m,Et as h}from"./src-BIhDzOTA.js";import{t as g}from"./after-frame-BGEZeqzD.js";var _=60,v=24,y=24,b=12,x=2,ee=1,S=3,C=2,te=93,w=2.4,ne=12,T=[1.86,7.36],re=.42,ie=1.3,ae=.14,oe=0,se=1,ce=2,le=3,ue=4,de=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  attribute vec3 sparkPosition;
  attribute vec3 sparkEnd;
  attribute vec4 sparkShape;
  varying vec2 vSparkUv;
  varying float vSparkAlpha;
  varying float vSparkKind;
  varying float vSparkLength;
  varying float vSparkSeed;
  void main() {
    vSparkUv = position.xy;
    vSparkAlpha = sparkShape.y;
    vSparkSeed = sparkShape.z;
    vSparkKind = sparkShape.w;
    vec4 start = modelViewMatrix * vec4(sparkPosition, 1.0);
    vec4 end = modelViewMatrix * vec4(sparkEnd, 1.0);
    float width = sparkShape.x * length(modelViewMatrix[0].xyz);
    vec2 delta = end.xy - start.xy;
    float span = length(delta);
    vec2 along = span > 0.00001 ? delta / span : vec2(0.0, 1.0);
    vec2 across = vec2(along.y, -along.x);
    vSparkLength = span / max(width, 0.00001);
    // An arc needs room across for its zigzag; other kinds hug their capsule.
    float breadth = sparkShape.w > 3.5 ? 4.0 : 1.0;
    vec4 centre = mix(start, end, 0.5);
    centre.xy += along * position.y * (span + width) + across * position.x * width * breadth;
    gl_Position = projectionMatrix * centre;
    #include <logdepthbuf_vertex>
  }
`,fe=`
  #include <logdepthbuf_pars_fragment>
  varying vec2 vSparkUv;
  varying float vSparkAlpha;
  varying float vSparkKind;
  varying float vSparkLength;
  varying float vSparkSeed;
  void main() {
    float glow;
    float heat;
    float along = vSparkUv.y * (vSparkLength + 1.0);
    if (vSparkKind < 1.5) {
      // A capsule along the motion, brighter at its head.
      float d = length(vec2(max(abs(along) - vSparkLength * 0.5, 0.0), vSparkUv.x)) * 2.0;
      float head = smoothstep(-0.5 * vSparkLength - 0.5, 0.5 * vSparkLength + 0.5, along);
      glow = exp(-d * d * 2.0) * (1.0 - smoothstep(0.85, 1.0, d)) * mix(0.55, 1.0, head);
      heat = exp(-d * d * 9.0) * mix(0.5, 1.0, head);
    } else if (vSparkKind < 2.5) {
      float r = length(vSparkUv) * 2.0;
      glow = exp(-r * r * 3.4) * (1.0 - smoothstep(0.8, 1.0, r));
      heat = exp(-r * r * 10.0);
    } else if (vSparkKind < 3.5) {
      float band = (length(vSparkUv) * 2.0 - 0.82) / 0.09;
      glow = exp(-band * band);
      heat = glow * 0.55;
    } else {
      // Electric arc: a jagged line pinned at both ends.
      float s = along / max(vSparkLength, 0.001) + 0.5;
      float pinned = sin(clamp(s, 0.0, 1.0) * 3.14159265);
      float jag = sin(s * 17.0 + vSparkSeed * 3.1) * 0.55 + sin(s * 41.0 + vSparkSeed * 7.7) * 0.30
        + sin(s * 83.0 + vSparkSeed * 13.3) * 0.15;
      float d = abs(vSparkUv.x * 4.0 - jag * pinned * 1.2);
      float inside = step(0.0, s) * step(s, 1.0);
      glow = exp(-d * d * 2.2) * inside;
      heat = exp(-d * d * 12.0) * inside;
    }
    float alpha = glow * vSparkAlpha;
    if (alpha < 0.006) discard;
    #include <logdepthbuf_fragment>
    // Deep blue at the edge and saturated cyan in the core: a pale core would
    // merge with a bright sky and leave a hollow outline. Tone mapping is off
    // for the same reason: it bleaches bright cyan towards white.
    vec3 colour = mix(vec3(0.0, 0.16, 0.80), vec3(0.0, 0.62, 1.0), smoothstep(0.30, 0.90, glow));
    colour = mix(colour, vec3(0.45, 0.95, 1.0), heat * 0.25);
    gl_FragColor = vec4(colour * (1.0 + heat * 0.25), 1.0);
    #include <colorspace_fragment>
    // Part of the light adds to the background: it glows on dark walls and keeps its body on a bright sky.
    gl_FragColor = vec4(gl_FragColor.rgb * alpha, alpha * 0.92);
  }
`;function E(l){let d=[],m=[],h=[],g=[],E=[],D=[],O=[],k=[],A=new p,j=new p,M=new f,N=new f,P=new f,F=new f,I=new f,pe=new f,me=l.getObjectByName(`Hub`);if(!(me instanceof u))throw Error(`В модели Спрута нет основания`);let he=me;l.updateWorldMatrix(!0,!0);for(let e=1;e<=4;e++){let t=`Arm${String(e).padStart(2,`0`)}`,n=l.getObjectByName(`${t}_Wrist`);if(!(n instanceof u))throw Error(`Нет запястья Спрута: ${t}`);d.push(n);let r=[];for(let e=1;e<=9;e++){let n=l.getObjectByName(`${t}_Segment${String(e).padStart(2,`0`)}`);if(!(n instanceof u))throw Error(`Нет сустава Спрута: ${t}/${e}`);r.push(n)}r.push(n),m.push(r),g.push(Array.from({length:11},()=>new f)),E.push(Array.from({length:11},()=>new f)),A.copy(n.matrixWorld).invert();let i=new f,a=[];for(let e=1;e<=S;e++){let n=l.getObjectByName(`${t}_Finger${String(e).padStart(2,`0`)}`);if(!(n instanceof u))throw Error(`Нет пальца Спрута: ${t}/${e}`);a.push(n),M.setFromMatrixPosition(n.matrixWorld).applyMatrix4(A),i.add(M)}h.push(a),i.multiplyScalar(1/3);let o=i.length()/(.055+(.002+.026)/3);if(!(o>0)||!Number.isFinite(o))throw Error(`Неверный размер клешни Спрута`);O.push(o),i.multiplyScalar(4.4),D.push(i),P.copy(i).normalize(),F.set(1,0,0),Math.abs(P.dot(F))>.9&&F.set(0,0,1),F.cross(P).normalize(),I.crossVectors(P,F).normalize();let s=[];for(let e=0;e<y;e++){let t=e*2.399963229728653,n=e*.61803398875%1;s.push(new f().copy(F).multiplyScalar(Math.cos(t)).addScaledVector(I,Math.sin(t)).multiplyScalar(.7+n*.9).addScaledVector(P,.3+n*.4))}k.push(s)}let L=new f,ge=0;if(A.copy(he.matrixWorld).invert(),l.traverse(e=>{if(!(e instanceof c)||Array.isArray(e.material)||e.material.name!==`Octopus_Cyan`)return;let t=e.geometry.getAttribute(`skinIndex`),n=e.geometry.getAttribute(`skinWeight`),r=e.skeleton.bones.indexOf(he);if(!(!t||!n||r<0))for(let i=0;i<t.count;i++){let a=0;for(let e=0;e<4;e++)t.getComponent(i,e)===r&&(a+=n.getComponent(i,e));a<.99||(e.getVertexPosition(i,M),M.applyMatrix4(e.matrixWorld).applyMatrix4(A),L.add(M),ge++)}}),ge===0)throw Error(`В модели Спрута нет центральной линзы`);L.divideScalar(ge),M.copy(L).normalize().multiplyScalar(O[0]*.014),L.add(M);let R=new t;R.name=`Octopus_Effects`;let z=new r;z.setAttribute(`position`,new e([-.5,-.5,0,.5,-.5,0,-.5,.5,0,.5,.5,0],3)),z.setIndex([0,1,2,2,1,3]);let _e=e=>new s(new Float32Array(te*e),e).setUsage(n),ve=_e(3),ye=_e(3),B=_e(4);z.setAttribute(`sparkPosition`,ve),z.setAttribute(`sparkEnd`,ye),z.setAttribute(`sparkShape`,B);let be=new o({name:`Octopus_Cyan_Sparks`,vertexShader:de,fragmentShader:fe,transparent:!0,depthWrite:!1,side:2,forceSinglePass:!0,toneMapped:!1,blending:5,blendEquation:100,blendSrc:201,blendDst:205}),V=new a(z,be);V.name=`Octopus_Grab_Sparks`,V.frustumCulled=!1,R.add(V);let H=new f,U=new f,W=new Float32Array(72),G=new Float32Array(4),K=_,q=y,J=x,Y=-1,xe=-1,X=1,Z=!1,Se=()=>C+K+q+C+S+J;z.instanceCount=Se();function Q(e,t,n,r,i,a,o){ve.setXYZ(e,t.x,t.y,t.z),ye.setXYZ(e,n.x,n.y,n.z),B.setXYZW(e,r,i,a,o)}let $=e=>{B.setXYZW(e,0,0,0,0)},Ce=e=>.6+.4*Math.abs(Math.sin(e*12.9898)*43758.5453%1);function we(e){A.copy(j),U.set(0,-1,0).transformDirection(A),A.multiply(d[e].matrixWorld),X=O[e]*A.getMaxScaleOnAxis(),H.copy(D[e]).applyMatrix4(A);for(let t=0;t<y;t++){let n=k[e][t],r=n.length();M.copy(n).transformDirection(A).multiplyScalar(r*X),W[t*3]=M.x,W[t*3+1]=M.y,W[t*3+2]=M.z}}function Te(e,t,n){let r=t*t*X*.9;return n.set(H.x+W[e*3]*t+U.x*r,H.y+W[e*3+1]*t+U.y*r,H.z+W[e*3+2]*t+U.z*r)}function Ee(e){R.updateWorldMatrix(!0,!1),j.copy(R.matrixWorld).invert();for(let e=0;e<4;e++){let t=g[e],n=m[e],r=E[e];for(let e=0;e<n.length;e++)t[e].setFromMatrixPosition(n[e].matrixWorld).applyMatrix4(j),r[e].setFromMatrixColumn(n[e].matrixWorld,0).transformDirection(j);A.copy(j).multiply(d[e].matrixWorld),t[10].copy(D[e]).applyMatrix4(A),r[10].copy(r[9]),G[e]=O[e]*A.getMaxScaleOnAxis()}M.copy(L).applyMatrix4(he.matrixWorld).applyMatrix4(j);let t=(.5+.5*Math.cos(e*Math.PI*2/w))**8;Q(0,M,M,G[0]*(.34+t*.08),.4+t*.45,0,ce);let n=e%w/.55;n<1?Q(1,M,M,G[0]*(.3+n*.85),(1-n)**1.6*.75,0,le):$(1);let r=K/4;for(let t=0;t<K;t++){let n=t%4,a=Math.floor(t/4),o=((e-n*.12)%w+w)%w,s=(o-a*w/r+w)%w*10/1.8-.6,c=C+t;if(s<0||s>=10){$(c);continue}let l=g[n],u=Math.floor(s),d=s-u,f=s/10,p=G[n];M.copy(l[u]).lerp(l[u+1],d),P.subVectors(l[u+1],l[Math.max(0,u-1)]).normalize(),pe.subVectors(l[Math.min(10,u+2)],l[u]).normalize(),P.lerp(pe,d).normalize(),F.copy(E[n][u]).lerp(E[n][u+1],d),F.addScaledVector(P,-F.dot(P)).normalize(),I.crossVectors(P,F).normalize();let m=e*Math.PI*2/w+a*2.399963229728653+n*.7,h=i.smoothstep(f,.68,1),_=p*(.095+.018*Math.sin(m*2)+h*.1);M.addScaledVector(F,Math.cos(m)*_).addScaledVector(I,Math.sin(m)*_);let v=s-(o*10/1.8-.6),y=Math.exp(-v*v/2.6),b=i.smoothstep(f,0,.07)*(1-i.smoothstep(f,.87,1)),x=t*.61803398875%1;N.copy(M).addScaledVector(P,-p*(.07+y*.1)),Q(c,N,M,p*(.048+x*.02)*(1+y*.4),b*(.62+y*.38),0,oe)}let a=Se()-J;for(let t=0;t<J;t++){let n=a+t,r=e+t*ie*.5,i=Math.floor(r/ie),o=r-i*ie;if(o>=ae){$(n);continue}let s=(i*3+t*2)%4,c=4+(i*2+t)%5,l=G[s],u=i*2.399963229728653+t,d=(e,t)=>(P.subVectors(g[s][Math.min(10,e+1)],g[s][e-1]).normalize(),F.copy(E[s][e]).addScaledVector(P,-E[s][e].dot(P)).normalize(),I.crossVectors(P,F),t.copy(g[s][e]).addScaledVector(F,Math.cos(u)*l*.08).addScaledVector(I,Math.sin(u)*l*.08));d(c,N),d(c+2,M);let f=Math.floor(o*24);Q(n,N,M,l*.024,(1-o/ae)*Ce(f+i),f*1.7+i,ue)}}function De(e){let t=C+K+q,n=-1;for(let t=0;t<T.length;t++)e>=T[t]&&e<T[t]+re&&(n=t);if(n<0){for(let e=C+K;e<t+C+S;e++)$(e);Y=-1,xe=e;return}(Y!==n||e<xe)&&we(n),Y=n,xe=e;let r=e-T[Y];for(let e=0;e<q;e++){let t=C+K+e,n=e*.61803398875%1,i=r/(.32+n*.1);if(i>=1){$(t);continue}Te(e,r,M),Te(e,Math.max(0,r-.05),N),Q(t,N,M,X*(.036+n*.02)*(1-i*.35),(1-i)**1.05,0,se)}A.copy(j).multiply(d[Y].matrixWorld);let i=H.copy(D[Y]).applyMatrix4(A),a=X,o=r/.22;o<1?Q(t,i,i,a*.55*(1-o*.3),(1-o)*(1-o),0,ce):$(t);let s=r/.38;Q(t+1,i,i,a*(.25+s*1.1),Math.max(0,1-s)**1.5*.9,0,le);let c=Math.floor(r*24);for(let e=0;e<S;e++){let n=t+C+e;if(r>=.36){$(n);continue}M.setFromMatrixPosition(h[Y][e].matrixWorld).applyMatrix4(j),Q(n,M,i,a*.022,(1-r/.36)*Ce(c*3+e),c*3.7+e*11,ue)}}return{object:R,update(e){Z||!R.visible||!Number.isFinite(e)||(e=(e%ne+ne)%ne,Ee(e),De(e),ve.needsUpdate=ye.needsUpdate=B.needsUpdate=!0)},setVisible(e){Z||R.visible===e||(R.visible=e,Y=-1,B.array.fill(0),B.needsUpdate=!0)},setQuality(e){Z||(K=e===`low`?v:_,q=e===`low`?b:y,J=e===`low`?ee:x,z.instanceCount=Se(),Y=-1,B.array.fill(0),B.needsUpdate=!0)},dispose(){Z||(Z=!0,R.visible=!1,R.removeFromParent(),R.clear(),z.dispose(),be.dispose())}}}var D=new URL(``+new URL(`mechanical-octopus-DwN_y9dL.glb`,import.meta.url).href,``+import.meta.url).href,O=`Octopus_Active_Snap_12s`,k=`_octopus_flow`,A;function j(e){let t=e.geometry;if(t.hasAttribute(k))return;let n=t.getAttribute(`skinIndex`),r=t.getAttribute(`skinWeight`),i=t.getAttribute(`position`);if(!n||!r||!i||n.count!==i.count||r.count!==i.count)throw Error(`Неверные веса модели Спрута`);let a=e.skeleton.bones.map(e=>{let t=/^Arm(\d{2})_(Segment(\d{2})|Wrist|Finger\d{2})$/.exec(e.name);return t?[t[3]?Number(t[3])-1:9,Number(t[1])-1]:[0,-1]}),o=new Float32Array(i.count*2);for(let e=0;e<i.count;e++){let t=0,i=0,s=0;for(let o=0;o<4;o++){let c=r.getComponent(e,o);if(c<=0)continue;let l=a[n.getComponent(e,o)];if(!l)throw Error(`Неизвестная кость в весах Спрута`);t+=l[0]*c,i+=l[1]*c,s+=c}if(!(s>0)||!Number.isFinite(t+i+s))throw Error(`Пустые веса Спрута`);o[e*2]=t/s,o[e*2+1]=i/s}t.setAttribute(k,new d(o,2))}function M(e,t,n){e.customProgramCacheKey=()=>`octopus-cyan-flow-v2`,e.onBeforeCompile=e=>{e.uniforms.octopusPhase=t,e.uniforms.octopusEffects=n,e.vertexShader=`attribute vec2 ${k};
      varying vec2 vOctopusFlow;
      ${e.vertexShader}`.replace(`#include <begin_vertex>`,`#include <begin_vertex>
        vOctopusFlow = ${k};`),e.fragmentShader=`uniform float octopusPhase;
      uniform float octopusEffects;
      varying vec2 vOctopusFlow;
      ${e.fragmentShader}`.replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
        float isArm = step(-0.5, vOctopusFlow.y);
        float cycle = mod(octopusPhase - max(0.0, vOctopusFlow.y) * 0.12 + 2.4, 2.4);
        float head = cycle * (10.0 / 1.8) - 0.6;
        float distanceToHead = vOctopusFlow.x - head;
        float envelope = smoothstep(0.0, 0.10, cycle) * (1.0 - smoothstep(1.95, 2.4, cycle));
        float wave = exp(-distanceToHead * distanceToHead / 2.6) * envelope;
        float wake = exp(-distanceToHead * distanceToHead / 10.0)
          * (1.0 - smoothstep(-0.3, 0.0, distanceToHead)) * envelope;
        float corePulse = pow(0.5 + 0.5 * cos(octopusPhase * 2.617993878), 8.0);
        float lightAmount = mix(0.65 + corePulse * 5.5, 0.12 + wave * 5.5 + wake * 0.6, isArm);
        // Darker resting joints keep the travelling front readable under bright daylight.
        float surfaceAmount = mix(0.55 + corePulse * 0.45, 0.18 + wave * 0.82, isArm);
        diffuseColor.rgb *= mix(1.0, surfaceAmount, octopusEffects);
        totalEmissiveRadiance *= mix(1.0, lightAmount, octopusEffects);`)}}function N(){return A??=m(D).then(async e=>{await g();let n=e.scene.getObjectByName(`Octopus_Rig`)?.userData.attachmentInverse;if(!Array.isArray(n)||n.length!==16||!n.every(Number.isFinite))throw Error(`В модели Спрута нет точки крепления`);let r=new p().fromArray(n),i=r.determinant();if(!Number.isFinite(i)||Math.abs(i)<1e-12)throw Error(`Неверная точка крепления Спрута`);let a=e.animations.find(e=>e.name===O);if(!a||!Number.isFinite(a.duration)||Math.abs(a.duration-12)>.001||a.tracks.length===0||!a.validate())throw Error(`Неверный цикл анимации Спрута`);if(!(e.scene.getObjectByName(`Hub`)instanceof u))throw Error(`В модели Спрута нет основания`);for(let t=1;t<=4;t++){let n=`Arm${String(t).padStart(2,`0`)}`,r=[`Wrist`,...Array.from({length:9},(e,t)=>`Segment${String(t+1).padStart(2,`0`)}`),...Array.from({length:3},(e,t)=>`Finger${String(t+1).padStart(2,`0`)}`)];for(let t of r)if(!(e.scene.getObjectByName(`${n}_${t}`)instanceof u))throw Error(`В модели Спрута нет кости ${n}_${t}`)}let o=0,s=!1;if(e.scene.traverse(e=>{if(!(e instanceof c))return;j(e);let t=Array.isArray(e.material)?e.material:[e.material];s||=t.some(e=>e.name===`Octopus_Cyan`),o++}),o===0)throw Error(`В модели Спрута нет щупалец`);if(!s)throw Error(`В модели Спрута нет светящихся стыков`);return{create(){let n=h(e.scene),i=new t;i.name=`Premium_Octopus_Tail`,i.add(n);let o={value:0},s={value:1},u=new Map,d=[],f=new Set,p=e=>{let t=u.get(e);return t||(t=e.clone(),e.name===`Octopus_Cyan`&&M(t,o,s),u.set(e,t),t)};n.traverse(e=>{if(e instanceof c){e.material=Array.isArray(e.material)?e.material.map(p):p(e.material),e.castShadow=!0,e.receiveShadow=!0,e.frustumCulled=!1,d.push(e);for(let t of f)if(t.bones.length===e.skeleton.bones.length&&t.bones.every((n,r)=>n===e.skeleton.bones[r]&&t.boneInverses[r].equals(e.skeleton.boneInverses[r]))){e.skeleton!==t&&e.skeleton.dispose(),e.skeleton=t;break}f.add(e.skeleton)}});let m=new l(n),g=m.clipAction(a).play();m.update(0),i.updateMatrixWorld(!0);for(let e of f)e.update();let _=E(n);n.add(_.object);let v,y=!0,b=!1,x={object:i,mesh:d[0],meshes:d,attach(e){b||(v&&(v.visible=y),v=e.object.getObjectByName(`Tail_Base`),y=v?.visible??!0,v&&(v.visible=!1),x.stand(e.slots.back))},stand(e){b||(i.matrix.copy(r),i.matrixAutoUpdate=!1,e.add(i),x.update(0))},update(e){if(!(b||!i.visible||!Number.isFinite(e)||e<0)){m.update(Math.min(e,.1)),o.value=g.time,i.updateWorldMatrix(!0,!0);for(let e of f)e.update();_.update(o.value)}},setEffectsVisible(e){b||(s.value=+!!e,_.setVisible(e))},setQuality(e){b||_.setQuality(e)},dispose(){if(!b){b=!0,v&&(v.visible=y),_.dispose(),m.stopAllAction(),m.uncacheRoot(n);for(let e of u.values())e.dispose();for(let e of f)e.dispose();i.removeFromParent()}}};return x.update(0),x}}}).catch(e=>{throw A=void 0,e}),A}export{N as loadOctopusTail};