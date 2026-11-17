//# allFunctionsCalledOnLoad
import{$ as e,Cr as t,F as n,Jt as r,K as i,P as a,R as o,Rt as s,St as c,Xn as l,Z as u,Zn as d,d as f,qn as p,u as m,ur as h,v as g,wr as _,wt as v}from"./three.core-DVTiNhEy.js";import{o as y}from"./src-BI6MMqKu.js";import{t as b}from"./trail-emitter-DtJSWeMd.js";import{t as x}from"./trail-slots-BYU9mmsR.js";import{t as S}from"./BufferGeometryUtils-pFWRFHdl.js";var C=[[[0,-.65,0,.65],[0,.08,-.43,.48],[0,.08,.43,.48],[-.26,-.38,.26,-.38]],[[0,-.67,0,.67],[0,.5,.42,.15],[.42,.15,0,-.2],[0,.02,-.38,-.3]],[[-.35,-.54,0,-.22],[0,-.22,.35,-.54],[0,-.22,0,.62],[-.4,.25,0,.62],[0,.62,.4,.25]],[[-.4,.45,.4,.45],[.4,.45,-.25,-.42],[-.25,-.42,.35,-.42],[-.13,.1,.28,.1],[.05,.45,.05,.7]],[[-.4,-.35,0,-.62],[0,-.62,.4,-.35],[-.4,-.35,-.4,.4],[.4,-.35,.4,.4],[-.4,.4,0,.65],[0,.65,.4,.4],[0,-.28,0,.3]],[[-.32,-.6,-.32,.6],[-.32,.6,.35,.3],[.35,.3,-.1,-.05],[-.1,-.05,.32,-.42],[.32,-.42,.32,-.65]]],w=C.length;function T(e){let t=C[e%w],n=t.map(([e,n,r,i],a)=>{let s=Math.hypot(r-e,i-n),l=.046,u=new d;u.moveTo(-.046,-s/2),u.lineTo(l,-s/2),u.lineTo(l,s/2),u.lineTo(-.046,s/2),u.closePath();let f=new o(u,{depth:.055,bevelEnabled:!0,bevelSize:.014,bevelThickness:.012,bevelSegments:1,steps:1,curveSegments:1}),p=f.getAttribute(`position`),h=new Float32Array(p.count);for(let e=0;e<h.length;e+=1){let n=c.clamp(p.getY(e)/s+.5,0,1);h[e]=(a+n)/t.length}return f.setAttribute(`runeStroke`,new m(h,1)),f.deleteAttribute(`uv`),f.translate(0,0,-.0275),f.rotateZ(Math.atan2(i-n,r-e)-Math.PI/2),f.translate((e+r)/2,(n+i)/2,0),f}),r=S(n,!1);for(let e of n)e.dispose();r.computeBoundingBox();let i=r.getIndex();return{position:r.getAttribute(`position`).array,normal:r.getAttribute(`normal`).array,stroke:r.getAttribute(`runeStroke`).array,index:i===null?null:i.array,centre:r.boundingBox.getCenter(new _)}}var E=null,D=0;function O(){return E??=Array.from({length:w},(e,t)=>T(t)),D+=1,E}function k(){--D,D===0&&(E=null)}function ee(e){let t=new f;return t.setAttribute(`position`,new m(e.position,3)),t.setAttribute(`normal`,new m(e.normal,3)),t.setAttribute(`runeStroke`,new m(e.stroke,1)),e.index!==null&&t.setIndex(new m(e.index,1)),t}function A(e,t){let n=new u(new Float32Array(t),1).setUsage(a),r=new u(new Float32Array(t).fill(1),1).setUsage(a),i=new u(new Float32Array(t),1).setUsage(a);return e.setAttribute(`runeAlpha`,n),e.setAttribute(`runeReveal`,r),e.setAttribute(`runeErase`,i),{alpha:n,reveal:r,erase:i}}var j=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  attribute float runeStroke, runeAlpha, runeReveal, runeErase;
  varying vec3 vRuneView, vRuneNormal, vRuneColour;
  varying vec4 vRuneState;
  void main() {
    #include <beginnormal_vertex>
    #include <defaultnormal_vertex>
    vRuneNormal = normalize(transformedNormal);
    vec3 transformed = position;
    #include <project_vertex>
    vRuneView = -mvPosition.xyz;
    vRuneColour = vec3(1.0);
    #ifdef USE_INSTANCING_COLOR
      vRuneColour = instanceColor;
    #endif
    vRuneState = vec4(runeStroke, runeAlpha, runeReveal, runeErase);
    #include <logdepthbuf_vertex>
  }`,M=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float runeClock;
  uniform vec3 runeViolet, runeLilac, runeWhite;
  attribute float runeStroke;
  // Рождение и неизменные с него данные: тон, направление разлёта, номер осколка.
  attribute vec4 runeTrail;
  varying vec3 vRuneView, vRuneNormal, vRuneColour;
  varying vec4 vRuneState;

  float runeEase(float x) { float t = clamp(x, 0.0, 1.0); return t * t * (3.0 - 2.0 * t); }
  mat3 runeYaw(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }
  mat3 runePitch(float a) { float c = cos(a), s = sin(a); return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c); }

  void main() {
    float age = max(0.0, runeClock - runeTrail.x);
    float shown = runeEase(age / 0.11) * (1.0 - runeEase((age - 1.3) / 0.55));
    vec3 local, bent, rise = vec3(0.0);
    float alpha, reveal = 1.0, erase = 0.0;
    #if defined(RUNE_GLYPH)
      // Знак лежит верхом по ходу бега; дописанный, он отрывается от земли
      // и встаёт лицом назад, к догоняющей камере.
      reveal = runeEase(age / 0.32);
      erase = runeEase((age - 1.05) / 0.8);
      float lift = runeEase((age - 0.4) / 1.0);
      mat3 turn = runePitch(-PI * 0.5 + lift * 1.15);
      local = turn * position * (0.95 + runeEase(age / 0.24) * 0.05);
      bent = turn * normal;
      rise.y = lift * 0.95;
      alpha = shown * 0.96;
      vRuneColour = mix(mix(runeViolet, runeLilac, runeTrail.y), runeWhite, 0.05 + (1.0 - reveal) * 0.12);
    #elif defined(RUNE_RING)
      mat3 turn = runeYaw(age * 0.12);
      float base = length(instanceMatrix[0].xyz);
      local = turn * position * (1.0 + runeEase(age / 0.4) * 0.1 / base);
      bent = turn * normal;
      alpha = shown * 0.36 * runeEase(age / 0.2);
      vRuneColour = mix(runeViolet, runeLilac, runeTrail.y);
    #else
      // Осколки стёртых штрихов разлетаются только во второй половине жизни знака.
      float dissolve = (age - 0.95) / 0.9;
      alpha = runeEase(dissolve / 0.16) * (1.0 - runeEase(dissolve)) * 0.66;
      vec3 size = vec3(0.033, 0.11 + runeTrail.w * 0.025, 0.028) * max(0.01, 1.0 - dissolve);
      mat3 turn = runeYaw(dissolve * 0.8);
      local = turn * (position * size);
      bent = turn * (normal / size);
      float drift = 0.36 + dissolve * 0.58;
      rise = vec3(runeTrail.y * drift, dissolve * (0.4 + runeTrail.w * 0.08), runeTrail.z * drift);
      vRuneColour = mix(runeViolet, runeWhite, 0.28);
    #endif
    vRuneState = vec4(runeStroke, alpha, reveal, erase);
    vRuneView = vec3(0.0); vRuneNormal = vec3(0.0, 1.0, 0.0);
    if (alpha < 0.004) {
      // Невидимый экземпляр уходит за край кадра: его треугольники отсекаются
      // до растеризации и не тратят заливку.
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    } else {
      vec4 world = instanceMatrix * vec4(local, 1.0);
      world.xyz += rise;
      vec4 mvPosition = modelViewMatrix * world;
      gl_Position = projectionMatrix * mvPosition;
      vRuneView = -mvPosition.xyz;
      vRuneNormal = normalize(normalMatrix * (mat3(instanceMatrix) * bent));
    }
    #include <logdepthbuf_vertex>
  }`,N=`
  #include <common>
  #include <logdepthbuf_pars_fragment>
  uniform vec3 runeWhite;
  #ifdef RUNE_FACE
    uniform vec3 runeFaceCentre;
    uniform vec2 runeFaceRadius;
    uniform float runeFaceEnabled;
  #endif
  varying vec3 vRuneView, vRuneNormal, vRuneColour;
  varying vec4 vRuneState;
  void main() {
    float ink = (1.0 - smoothstep(vRuneState.z, vRuneState.z + 0.035, vRuneState.x))
      * smoothstep(vRuneState.w - 0.05, vRuneState.w, vRuneState.x);
    float alpha = ink * vRuneState.y;
    if (alpha < 0.004) discard;
    #ifdef RUNE_FACE
      if (runeFaceEnabled > 0.5 && vRuneView.z < runeFaceCentre.z + runeFaceRadius.y) {
        vec2 offset = vRuneView.xy / max(vRuneView.z, 0.001)
          - runeFaceCentre.xy / max(runeFaceCentre.z, 0.001);
        float offAxis = sqrt(1.0 + dot(runeFaceCentre.xy, runeFaceCentre.xy)
          / max(runeFaceCentre.z * runeFaceCentre.z, 0.0001));
        vec2 radius = runeFaceRadius * offAxis / max(runeFaceCentre.z - runeFaceRadius.x, 0.1);
        if (dot(offset / radius, offset / radius) < 1.0) discard;
      }
    #endif
    vec3 n = normalize(vRuneNormal);
    if (!gl_FrontFacing) n = -n;
    float face = max(0.0, dot(n, normalize(vec3(-0.4, 0.7, 0.6))));
    float edgeDistance = (vRuneState.x - vRuneState.z + 0.025) / 0.045;
    float edge = exp(-edgeDistance * edgeDistance);
    vec3 colour = vRuneColour * (0.62 + face * 0.46);
    colour = mix(colour, runeWhite, edge * 0.6);
    #include <logdepthbuf_fragment>
    gl_FragColor = vec4(colour, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;function P(e,t){let n=e===`aura`,r=new l({name:n?`Rune_Incised_Light`:`Rune_Trail_${e}`,defines:n?{RUNE_FACE:1}:e===`glyph`?{RUNE_GLYPH:1}:e===`ring`?{RUNE_RING:1}:{RUNE_CHIP:1},transparent:!0,depthWrite:!1,toneMapped:!0,side:2,forceSinglePass:!0,uniforms:t,vertexShader:n?j:M,fragmentShader:N});return Object.assign(r.defaultAttributeValues,{runeStroke:[.5]}),r}var F=Math.PI*2,I=36,L=5,R=[8,6,4],z=R[0];function B(i,o){let s=P(`aura`,{runeFaceCentre:{value:new _},runeFaceRadius:{value:new t(1.05,1.05)},runeFaceEnabled:{value:0},runeWhite:{value:new g().setHex(y(`white`),p)}}),c=s.uniforms.runeFaceCentre.value,l=s.uniforms.runeFaceRadius.value,u=s.uniforms.runeFaceEnabled,d=new g().setHex(y(`lavender/2`),p),f=new g().setHex(y(`lilac/1`),p),m=new g().setHex(y(`white`),p),b=new g,x=O().map((t,n)=>{let r=ee(t),o=n<z-w?2:1,c=A(r,o),l=new e(r,s,o);return l.name=`Rune_Aura_Glyph_${n+1}`,l.instanceMatrix.setUsage(a),l.frustumCulled=!1,l.castShadow=l.receiveShadow=!1,l.renderOrder=2,l.visible=!1,l.count=0,i.add(l),{geometry:r,mesh:l,attributes:c,centre:t.centre,shown:0}}),S=new h(1,.013,5,26,.58);S.rotateX(Math.PI/2);let C=A(S,L),T=new e(S,s,L);T.name=`Rune_Aura_Broken_Magic_Circle`,T.instanceMatrix.setUsage(a),T.frustumCulled=!1,T.castShadow=T.receiveShadow=!1,T.renderOrder=2,T.visible=!1,T.count=0,i.add(T);for(let e=0;e<z;e+=1){let t=e%w,n=e<w?0:1;b.copy(d).lerp(f,e%3*.26),x[t].mesh.setColorAt(n,b)}b.copy(d).lerp(m,.17);for(let e=0;e<L;e+=1)T.setColorAt(e,b);let E=new Float64Array(z),D=new Float64Array(z),j=new Float64Array(z);for(let e=0;e<z;e+=1)j[e]=6.2+e*.37,E[e]=e*.61803398875%1*j[e];D.set(E);let M=new v,N=new r,B=new r,V=new r,H=new _(0,1,0),U=new n,W=new _,G=new _,K=new _,q=o?.getObjectByName(`mixamorigHead_06`)??null,J=new _,Y=0,X=0,Z=0,Q=!1,$=()=>{let e=R[Z];for(let e of x)e.shown=0;for(let t=0;t<e;t+=1){let n=t%w,r=t<w?0:1,i=x[n];i.shown=Math.max(i.shown,r+1);let a=D[t]/j[t],o=t*F/e+Y,s=t%2==1,c=s?1.42+t%3*.065:1.22+t%3*.055,l=3.22+t%3*.19+Math.sin(a*F+t)*.075;W.set(Math.cos(o)*l,(s?.16:-1.29)+Math.sin(a*F+t*.73)*(s?.17:.1),Math.sin(o)*l-X*.22),U.set(Math.sin(a*F+t)*.11,Math.sin(Y+t*.61)*.16,Math.sin(a*F*2+t*.4)*.095),B.setFromAxisAngle(H,Math.PI/2-o),V.setFromEuler(U),N.copy(B).multiply(V),K.copy(i.centre).multiplyScalar(c).applyQuaternion(N),W.sub(K),G.setScalar(c),M.compose(W,N,G),i.mesh.setMatrixAt(r,M);let u=Math.max(0,Math.min(1,a/.07));u=u*u*(3-2*u);let d=Math.max(0,Math.min(1,(a-.84)/.16));d=d*d*(3-2*d),i.attributes.alpha.setX(r,u*(1-d)*.94),i.attributes.reveal.setX(r,Math.min(1,a/.34)),i.attributes.erase.setX(r,Math.max(0,Math.min(1,(a-.67)/.3)))}for(let e of x)e.mesh.count=e.shown,e.mesh.visible=e.shown>0,e.mesh.instanceMatrix.needsUpdate=!0,e.attributes.alpha.needsUpdate=e.attributes.reveal.needsUpdate=e.attributes.erase.needsUpdate=!0;for(let e=0;e<L;e+=1){let t=e*F/L+Y+Math.sin(Y+e)*.05;N.setFromAxisAngle(H,-t),W.set(0,-2.24+e%2*.035,-X*.1),G.setScalar(2.67+e%3*.09+Math.sin(Y*2+e)*.045),M.compose(W,N,G),T.setMatrixAt(e,M),C.alpha.setX(e,.31+Math.sin(Y*2+e*.8)*.1),C.reveal.setX(e,1),C.erase.setX(e,0)}T.count=L,T.visible=!0,T.instanceMatrix.needsUpdate=!0,C.alpha.needsUpdate=C.reveal.needsUpdate=C.erase.needsUpdate=!0};return $(),{setTier(e){Q||e===Z||(Z=e,$())},step(e,t){if(!(Q||!Number.isFinite(e)||e<=0)){Y=(Y+e%I*F/I)%F,X+=(+!!t-X)*(1-Math.exp(-e*3));for(let t=0;t<z;t+=1)D[t]=(D[t]+e%j[t])%j[t];$()}},view(e){if(Q)return;if(q===null){u.value=0;return}e.updateMatrixWorld(),q.updateWorldMatrix(!0,!1),J.set(-.00570525,.6573547,.02455115),q.localToWorld(J);let t=1.00256*q.matrixWorld.getMaxScaleOnAxis()+.14;c.copy(J).applyMatrix4(e.matrixWorldInverse).multiplyScalar(-1),l.set(t,t),u.value=Number.isFinite(c.lengthSq())&&c.z>.1?1:0},reset(){Q||(Y=X=0,D.set(E),$())},dispose(){if(!Q){Q=!0;for(let e of x)e.mesh.removeFromParent(),e.mesh.dispose(),e.geometry.dispose();T.removeFromParent(),T.dispose(),S.dispose(),s.dispose(),k()}}}}var V=Math.PI*2,H=1.85,U=[2.6,3.9,5.6],W=[2,2,1],G=[3,2,1],K=144,q=1728,J=2592;function Y(t,n,r,i,o){let s=new u(new Float32Array(i*4),4).setUsage(a);n.setAttribute(`runeTrail`,s);let c=new e(n,r,i);return c.instanceMatrix.setUsage(a),c.name=o,c.count=0,c.visible=!1,c.frustumCulled=!1,c.castShadow=!1,c.receiveShadow=!1,t.add(c),{mesh:c,data:s,attributes:[c.instanceMatrix,s],born:new Float64Array(i),capacity:i,count:0,slots:x(),appendStart:-1,rebased:!1}}function X(e,t,n,r,i,a){if(e.count===e.capacity)return;let o=e.count++;e.appendStart<0&&(e.appendStart=o),e.mesh.setMatrixAt(o,t),e.born[o]=n,e.data.setXYZW(o,n,r,i,a)}function Z(e){e.count=e.mesh.count=0,e.mesh.visible=!1,e.slots.clear(),e.appendStart=-1,e.rebased=!1;for(let t of e.attributes)t.clearUpdateRanges()}function Q(e,t){let n=0;for(;n<e.count;){if(t-e.born[n]<H){n+=1;continue}let r=--e.count;if(n!==r){e.born[n]=e.born[r];for(let t of e.attributes){let e=t.itemSize;t.array.copyWithin(n*e,r*e,(r+1)*e)}e.slots.moved(n)}}}function $(e,t){for(let n=0;n<e.count;n+=1)e.born[n]=e.born[n]-t,e.data.setX(n,e.born[n]);e.rebased=!0}function te(e){e.mesh.count=e.count,e.mesh.visible=e.count>0;for(let t of e.attributes){let n=t.itemSize,r=!1;t===e.data&&e.rebased&&e.count>0?(t.addUpdateRange(0,e.count*n),r=!0):r=e.slots.upload(t,e.appendStart,e.count),r&&(t.needsUpdate=!0)}e.slots.clear(),e.appendStart=-1,e.rebased=!1}function ne(e,t){let n={runeClock:{value:0},runeViolet:{value:new g().setHex(y(`lavender`),p)},runeLilac:{value:new g().setHex(y(`lilac/1`),p)},runeWhite:{value:new g().setHex(y(`white`),p)}},a=P(`glyph`,n),o=P(`ring`,n),c=P(`chip`,n),l=new i;l.name=`Rune_Written_Path`,e.add(l);let u=O().map((e,t)=>Y(l,ee(e),a,K,`Rune_Path_Glyph_${t}`)),d=new h(1,.019,5,24,1.8);d.rotateX(-Math.PI/2);let f=Y(l,d,o,q,`Rune_Path_Broken_Seals`),m=Y(l,new s(1,0),c,J,`Rune_Path_Erased_Strokes`),x=[...u,f,m],S=b(256),C=new _,T=new _,E=new _,D=new v,A=new r,j=new _(0,1,0),M=0,N=0,F=0,I=!1,L=(e,t,n,r,i,a)=>{let o=F++,s=o%w,c=o%3,l=Math.atan2(i,a)+Math.PI+Math.sin(o*1.7)*.09,d=Math.sin(o*2.1)*.14;T.set(e-a*d,t+.085,n+i*d),A.setFromAxisAngle(j,l),E.setScalar(1.38+c*.09),X(u[s],D.compose(T,A,E),r,c*.25,0,0),T.set(e,t+.048,n),E.setScalar(1.12+o%2*.07);for(let e=0;e<W[M];e+=1)A.setFromAxisAngle(j,l+e*Math.PI+.3),X(f,D.compose(T,A,E),r,e*.65,0,0);T.set(e,t+.12,n),E.setScalar(1);for(let e=0;e<G[M];e+=1){let t=o*1.79+e*V/3;A.setFromAxisAngle(j,t),X(m,D.compose(T,A,E),r,Math.cos(t),Math.sin(t),e)}},R=()=>{for(let e of x)Z(e);N=0,F=0,n.runeClock.value=0;for(let e of x)te(e)};return{setTier(e){I||(M=e)},step(e,r){if(I)return;t.getWorldPosition(C);let i=S.step(C.x,C.y,C.z,e,r,U[M]);if(S.cleared){R();return}if(!Number.isFinite(e)||e<=0)return;if(N+=e,N>=128){let e=Math.floor(N/128)*128;N-=e;for(let t of x)$(t,e)}for(let e of x)Q(e,N);let a=Math.hypot(S.direction[0],S.direction[2]),o=a>1e-6?S.direction[0]/a:0,s=a>1e-6?S.direction[2]/a:1;for(let e=0;e<i;e+=1){let t=e*3;L(S.positions[t],S.positions[t+1],S.positions[t+2],N-S.elapsed[e],o,s)}n.runeClock.value=N;for(let e of x)te(e)},reset(){I||(R(),S.reset())},dispose(){if(!I){I=!0,l.removeFromParent();for(let e of x)e.mesh.geometry.dispose(),e.mesh.dispose();a.dispose(),o.dispose(),c.dispose(),k()}}}}function re(e,t,n){return ne(e,t)}function ie(e,t,n){return B(t,n.character)}export{ie as createRuneAuraEffect,re as createRuneTrailEffect};