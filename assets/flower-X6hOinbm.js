//# allFunctionsCalledOnLoad
import{$ as e,B as t,Cr as n,F as r,Jt as i,P as a,Ut as o,Xn as s,Z as c,d as l,nr as u,qn as d,v as f,wr as p,wt as m}from"./three.core-DVTiNhEy.js";import{o as h}from"./src-BI6MMqKu.js";import{t as g}from"./trail-emitter-DtJSWeMd.js";import{t as _}from"./trail-slots-BYU9mmsR.js";var v=Math.PI*2,y=120,b=[120,80,48],x=[144,96,56],S=[`blush`,`pink/1`,`lilac/2`,`lavender/2`,`beige/2`].map(e=>new f().setHex(h(e),d)),C=new f().setHex(h(`white`),d),w=new f().setHex(h(`yellow/2`),d);function T(t,n,r,i){let a=i?x:b,l=new s({name:i?`Flower_Aura_Pollen`:`Flower_Aura_Petals`,uniforms:{flowerClock:n,flowerMotion:r,flowerWhite:{value:C}},defines:i?{FLOWER_POLLEN:1}:{},transparent:!0,depthWrite:!1,depthTest:!0,side:2,forceSinglePass:!0,blending:1,toneMapped:!0,vertexShader:`
      #include <common>
      #include <logdepthbuf_pars_vertex>
      uniform float flowerClock, flowerMotion;
      // Phase, lifetime, angular velocity, opacity.
      attribute vec4 flowerCycle;
      // Radius, bottom, ascent, seed angle.
      attribute vec4 flowerOrbit;
      // Pitch, roll, flutter frequency, spin speed.
      attribute vec4 flowerFlutter;
      varying vec2 vFlowerUv;
      varying vec3 vFlowerTint;
      varying float vFlowerFade, vFlowerLight, vFlowerSeed;

      vec3 rotatePetal(vec3 p, float pitch, float yaw, float roll) {
        p.yz = mat2(cos(pitch), -sin(pitch), sin(pitch), cos(pitch)) * p.yz;
        p.xz = mat2(cos(yaw), -sin(yaw), sin(yaw), cos(yaw)) * p.xz;
        p.xy = mat2(cos(roll), -sin(roll), sin(roll), cos(roll)) * p.xy;
        return p;
      }

      void main() {
        float age = fract(flowerClock / flowerCycle.y + flowerCycle.x);
        float seed = flowerOrbit.w;
        float flutter = flowerClock * flowerFlutter.z + seed;
        float angle = seed + flowerClock * flowerCycle.z + age * 0.55;
        float radius = flowerOrbit.x + sin(flutter) * 0.17;
        vec3 centre = vec3(cos(angle) * radius,
          flowerOrbit.y + age * flowerOrbit.z + sin(flutter * 2.0) * 0.09,
          sin(angle) * radius);
        // Верхние лепестки уходят за плечи, поток бега мягко раскрывает заднюю часть.
        centre.z -= smoothstep(0.05, 1.3, centre.y) * 0.7;
        centre.z -= flowerMotion * (0.25 + age * 0.95);
        float width = length(instanceMatrix[0].xyz);
        float span = length(instanceMatrix[1].xyz);
        float envelope = smoothstep(0.0, 0.12, age)
          * (1.0 - smoothstep(0.7, 1.0, age));
        vec4 viewCentre = modelViewMatrix * vec4(centre, 1.0);
        #ifdef FLOWER_POLLEN
          float shimmer = 0.78 + 0.22 * sin(flutter * 2.0);
          viewCentre.xy += position.xy * width * length(modelViewMatrix[0].xyz);
          vFlowerLight = shimmer;
        #else
          // Вогнутая поверхность и её наклон существуют в 3D, без разворота к камере.
          float across = uv.x * 2.0 - 1.0;
          float taper = pow(max(0.0, sin(uv.y * PI)), 0.6) * (0.7 + 0.3 * uv.y);
          vec3 petal = vec3(position.x * taper * width, position.y * span,
            (0.18 * across * across + 0.16 * sin(uv.y * PI)) * span);
          float pitch = flowerFlutter.x + sin(flutter) * 0.65;
          float yaw = seed + age * flowerFlutter.w;
          float roll = flowerFlutter.y + age * flowerFlutter.w * 0.7
            + sin(flutter + 0.8) * 0.38;
          petal = rotatePetal(petal, pitch, yaw, roll);
          viewCentre = modelViewMatrix * vec4(centre + petal, 1.0);
          vec3 normal = normalize(vec3(-0.72 * across * span / max(width, 0.001),
            -0.16 * PI * cos(uv.y * PI), 1.0));
          normal = normalize(mat3(modelMatrix) * rotatePetal(normal, pitch, yaw, roll));
          vFlowerLight = 0.72 + abs(dot(normal, normalize(vec3(-0.3, 0.85, 0.4)))) * 0.28;
        #endif
        gl_Position = projectionMatrix * viewCentre;
        #include <logdepthbuf_vertex>
        // Запас на край повернутого лепестка: перед лицом гаснет вся карточка.
        float padding = span * 0.7;
        float face = smoothstep(0.2, 0.82, centre.y + padding)
          * smoothstep(-0.4, 0.2, centre.z + padding)
          * (1.0 - smoothstep(0.95, 1.45, max(0.0, abs(centre.x) - padding)));
        vFlowerFade = flowerCycle.w * envelope * (1.0 - face);
        vFlowerTint = instanceColor;
        vFlowerUv = uv;
        vFlowerSeed = seed;
      }`,fragmentShader:`
      #include <common>
      #include <logdepthbuf_pars_fragment>
      uniform vec3 flowerWhite;
      varying vec2 vFlowerUv;
      varying vec3 vFlowerTint;
      varying float vFlowerFade, vFlowerLight, vFlowerSeed;
      void main() {
        float alpha;
        vec3 tint;
        #ifdef FLOWER_POLLEN
          float radius = length(vFlowerUv * 2.0 - 1.0);
          float dotShape = 1.0 - smoothstep(0.23, 0.95, radius);
          alpha = dotShape * vFlowerFade * vFlowerLight;
          tint = mix(vFlowerTint, flowerWhite, (1.0 - radius) * 0.28);
        #else
          float across = abs(vFlowerUv.x * 2.0 - 1.0);
          float edges = (1.0 - smoothstep(0.82, 1.0, across))
            * smoothstep(0.0, 0.055, vFlowerUv.y)
            * (1.0 - smoothstep(0.94, 1.0, vFlowerUv.y));
          float centre = pow(max(0.0, 1.0 - across), 2.0);
          float vein = (1.0 - smoothstep(0.01, 0.07, across))
            * sin(vFlowerUv.y * PI);
          float ribs = pow(max(0.0, cos(vFlowerUv.y * 42.0 + across * 13.0
            + vFlowerSeed)), 10.0) * centre * 0.045;
          tint = mix(vFlowerTint, flowerWhite, centre * 0.16 + vein * 0.12 + ribs);
          tint *= vFlowerLight;
          alpha = edges * vFlowerFade;
        #endif
        if (alpha < 0.004) discard;
        #include <logdepthbuf_fragment>
        gl_FragColor = vec4(tint, alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`}),u=new o(1,1,i?1:4,i?1:6),d=new c(new Float32Array(a[0]*4),4),f=new c(new Float32Array(a[0]*4),4),p=new c(new Float32Array(a[0]*4),4),m=new c(new Float32Array(a[0]*3),3);u.setAttribute(`flowerCycle`,d),u.setAttribute(`flowerOrbit`,f),u.setAttribute(`flowerFlutter`,p);let h=new e(u,l,a[0]);return h.instanceColor=m,h.name=l.name,h.frustumCulled=!1,h.castShadow=h.receiveShadow=!1,h.renderOrder=+!!i,t.add(h),{mesh:h,cycle:d,orbit:f,flutter:p,tint:m,budget:a,pollen:i}}function ee(e){let t={value:0},n={value:0},r=[T(e,t,n,!1),T(e,t,n,!0)],i=[2.4,3,4],a=0,o=0,s=0,c=916999969,l=!1,u=new m,d=()=>(c^=c<<13,c^=c>>>17,c^=c<<5,(c>>>0)/4294967296),f=e=>{for(let t=0;t<e.budget[0];t+=1){let n=(t*.61803398875+d()*.08)%1,r=12+Math.floor(d()*15),a=115+Math.floor(d()*60),o=i[t%i.length],s=e.pollen?.038+d()*.052:.5+d()*.32,c=e.pollen?s:s*(.6+d()*.22);if(u.makeScale(c,s,1),e.mesh.setMatrixAt(t,u),e.cycle.setXYZW(t,n,o,v*r/y,e.pollen?.58+d()*.3:.92+d()*.08),e.orbit.setXYZW(t,e.pollen?1.75+d()*1.2:2.05+d()*.85,-2.32+d()*.58,2.8+d()*1.1,d()*v),e.flutter.setXYZW(t,d()*v,d()*v,v*a/y,(d()<.5?-1:1)*(2.4+d()*4)),e.pollen){let n=.08+d()*.18;e.tint.setXYZ(t,w.r+(C.r-w.r)*n,w.g+(C.g-w.g)*n,w.b+(C.b-w.b)*n)}else{let n=t%20,r=S[n<9?n%2:n<16?2+n%2:4];e.tint.setXYZ(t,r.r,r.g,r.b)}}for(let t of[e.mesh.instanceMatrix,e.cycle,e.orbit,e.flutter,e.tint])t.needsUpdate=!0;e.mesh.count=e.budget[a]},p=()=>{o=s=0,c=916999969,t.value=n.value=0;for(let e of r)f(e)};return p(),{step(e,r){if(l||!Number.isFinite(e)||e<=0)return;let i=Math.min(e,.1);o=(o+i)%y,s+=(+!!r-s)*(1-Math.exp(-i/.3)),t.value=o,n.value=s},setTier(e){if(!(l||e===a||e!==0&&e!==1&&e!==2)){a=e;for(let e of r)e.mesh.count=e.budget[a]}},reset(){l||p()},dispose(){if(!l){l=!0;for(let e of r)e.mesh.removeFromParent(),e.mesh.geometry.dispose(),e.mesh.material.dispose(),e.mesh.dispose()}}}}var E=Math.PI*2,te=[.28,.4,.6],ne=[4,3,3],re=[.32,.48,.68],ie=[2,2,1],ae=2,oe=1.45,D=32768,se=10240,O=new f().setHex(h(`white`),d),k=[`blush`,`pink/1`,`lilac/2`,`lavender/2`,`beige/2`].map(e=>new f().setHex(h(e),d)),ce=new f().setHex(h(`yellow/2`),d);function le(){let e=new o(1,1,4,6),t=e.getAttribute(`position`),n=e.getAttribute(`uv`);for(let e=0;e<t.count;e+=1){let r=n.getX(e),i=n.getY(e),a=2*r-1,o=Math.max(0,Math.sin(Math.PI*i))**.6*(.7+.3*i);t.setXYZ(e,a*o*.5,i-.5,.18*a*a+.16*Math.sin(Math.PI*i))}return e.computeVertexNormals(),e}function A(t,n){let r=n?se:D,i=new s({name:n?`Flower_Trail_Pollen`:`Flower_Trail_Petals`,defines:n?{FLOWER_POLLEN:1}:{},uniforms:{flowerClock:{value:0},flowerWhite:{value:O}},transparent:!0,depthWrite:!1,depthTest:!0,side:2,forceSinglePass:!0,blending:1,toneMapped:!0,vertexShader:`
      #include <common>
      #include <logdepthbuf_pars_vertex>
      uniform float flowerClock;
      attribute vec2 flowerBornLife;
      attribute vec3 flowerVelocity;
      attribute vec4 flowerMotion;
      attribute vec4 flowerProfile;
      attribute vec3 flowerColour;
      varying vec2 vFlowerUv;
      varying vec3 vFlowerColour;
      varying float vFlowerFade, vFlowerLight;

      mat3 turnX(float angle) {
        float c = cos(angle), s = sin(angle);
        return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c);
      }
      mat3 turnY(float angle) {
        float c = cos(angle), s = sin(angle);
        return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
      }
      mat3 turnZ(float angle) {
        float c = cos(angle), s = sin(angle);
        return mat3(c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0);
      }
      // Кувырок — повороты вокруг X, затем Y, затем Z. Одна матрица на вершину
      // служит и лепестку, и его нормали: компилятор Direct3D разворачивает
      // каждый вызов отдельно, и второй проход по тем же поворотам удлинял
      // сборку программы на первом draw.
      mat3 tumble(float age) {
        float phase = flowerMotion.w;
        float flutter = sin(age * flowerProfile.y + phase) * 0.32;
        return turnZ(phase + age * flowerMotion.z)
          * turnY(flowerMotion.y + sin(age * 2.6 + phase) * 0.38)
          * turnX(flowerMotion.x + age * flowerMotion.z * 0.62 + flutter);
      }

      void main() {
        float age = max(0.0, flowerClock - flowerBornLife.x);
        float k = clamp(age / flowerBornLife.y, 0.0, 1.0);
        float phase = flowerMotion.w;
        float drift = (1.0 - exp(-age * 0.8)) / 0.8;
        // Каждая частица остаётся в мировом следе независимо от поворота источника.
        vec3 root = instanceMatrix[3].xyz + flowerVelocity * drift;
        float sway = flowerProfile.x;
        root.x += (sin(age * 2.4 + phase) - sin(phase)) * sway;
        root.z += (cos(age * 2.0 + phase) - cos(phase)) * sway * 0.65;
        root.y += sin(age * 3.0 + phase) * age * 0.035 - flowerProfile.w * age * age;
        float sizeX = length(instanceMatrix[0].xyz);
        float sizeY = length(instanceMatrix[1].xyz);
        #ifdef FLOWER_POLLEN
          vec4 centre = modelViewMatrix * vec4(root, 1.0);
          centre.xy += position.xy * vec2(sizeX, sizeY) * length(modelViewMatrix[0].xyz);
          gl_Position = projectionMatrix * centre;
          vFlowerLight = 0.86 + 0.14 * sin(age * 5.4 + phase);
        #else
          // Настоящий изогнутый лепесток вращается по трём осям, без billboard.
          vec3 petal = position * vec3(sizeX, sizeY, sizeY);
          mat3 turn = tumble(age);
          vec3 posed = turn * petal;
          vec3 scaledNormal = normal / max(vec3(sizeX, sizeY, sizeY), vec3(0.00001));
          vec3 petalNormal = normalize(turn * scaledNormal);
          float light = abs(dot(petalNormal, normalize(vec3(-0.35, 0.8, 0.48))));
          vFlowerLight = 0.72 + light * 0.28;
          // Скобки — два умножения матрицы на вектор вместо произведения матриц на каждой вершине.
          gl_Position = projectionMatrix * (modelViewMatrix * vec4(root + posed, 1.0));
        #endif
        #include <logdepthbuf_vertex>
        vFlowerUv = uv;
        vFlowerColour = flowerColour;
        float dissolve = 1.0 - smoothstep(${n?`0.52`:`0.72`}, 1.0, k);
        vFlowerFade = flowerProfile.z * dissolve;
      }`,fragmentShader:`
      #include <logdepthbuf_pars_fragment>
      uniform vec3 flowerWhite;
      varying vec2 vFlowerUv;
      varying vec3 vFlowerColour;
      varying float vFlowerFade, vFlowerLight;
      void main() {
        vec3 colour;
        float alpha;
        #ifdef FLOWER_POLLEN
          float radius = length(vFlowerUv - 0.5) * 2.0;
          float body = 1.0 - smoothstep(0.28, 0.94, radius);
          float core = 1.0 - smoothstep(0.0, 0.46, radius);
          colour = mix(vFlowerColour, flowerWhite, core * 0.42) * vFlowerLight;
          alpha = body * vFlowerFade;
        #else
          float across = abs(vFlowerUv.x * 2.0 - 1.0);
          float softSide = 1.0 - smoothstep(0.9, 1.0, across);
          float softTip = smoothstep(0.0, 0.035, vFlowerUv.y)
            * (1.0 - smoothstep(0.965, 1.0, vFlowerUv.y));
          float centre = pow(max(0.0, 1.0 - across), 1.4);
          float vein = (1.0 - smoothstep(0.012, 0.035, across))
            * smoothstep(0.07, 0.2, vFlowerUv.y)
            * (1.0 - smoothstep(0.76, 0.95, vFlowerUv.y));
          colour = mix(vFlowerColour, flowerWhite, centre * 0.16 + vein * 0.2)
            * vFlowerLight;
          alpha = softSide * softTip * vFlowerFade;
        #endif
        if (alpha < 0.003) discard;
        #include <logdepthbuf_fragment>
        gl_FragColor = vec4(colour, alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`}),l=n?new o(1,1):le(),u=new c(new Float32Array(r*2),2).setUsage(a),d=new c(new Float32Array(r*3),3).setUsage(a),f=new c(new Float32Array(r*4),4).setUsage(a),p=new c(new Float32Array(r*4),4).setUsage(a),m=new c(new Float32Array(r*3),3).setUsage(a);l.setAttribute(`flowerBornLife`,u),l.setAttribute(`flowerVelocity`,d),l.setAttribute(`flowerMotion`,f),l.setAttribute(`flowerProfile`,p),l.setAttribute(`flowerColour`,m);let h=new e(l,i,r);return h.name=i.name,h.renderOrder=+!!n,h.instanceMatrix.setUsage(a),h.count=0,h.visible=!1,h.frustumCulled=!1,h.castShadow=!1,h.receiveShadow=!1,t.add(h),{mesh:h,material:i,bornLife:u,velocity:d,motion:f,profile:p,colour:m,attributes:[h.instanceMatrix,u,d,f,p,m],born:new Float64Array(r),life:n?oe:ae,capacity:r,count:0,slots:_(),appendStart:-1,rebased:!1,seed:n?982901035:1525727549}}function j(e){e.count=e.mesh.count=0,e.mesh.visible=!1,e.slots.clear(),e.appendStart=-1,e.rebased=!1;for(let t of e.attributes)t.clearUpdateRanges()}function M(e,t){let n=0;for(;n<e.count;){if(t-e.born[n]<e.life){n+=1;continue}let r=--e.count;if(n!==r){e.born[n]=e.born[r];for(let t of e.attributes){let e=t.itemSize;t.array.copyWithin(n*e,r*e,(r+1)*e)}e.slots.moved(n)}}}function N(e,t){for(let n=0;n<e.count;n+=1)e.born[n]=e.born[n]-t,e.bornLife.setX(n,e.born[n]);e.rebased=!0}function P(e,t){e.mesh.count=e.count,e.mesh.visible=e.count>0,e.material.uniforms.flowerClock.value=t;for(let t of e.attributes){let n=t.itemSize,r=!1;t===e.bornLife&&e.rebased&&e.count>0?(t.addUpdateRange(0,e.count*n),r=!0):r=e.slots.upload(t,e.appendStart,e.count),r&&(t.needsUpdate=!0)}e.slots.clear(),e.appendStart=-1,e.rebased=!1}function F(e){e.mesh.removeFromParent(),e.mesh.geometry.dispose(),e.material.dispose(),e.mesh.dispose()}function ue(e,t){let n=A(e,!1),r=A(e,!0),i=g(1024),a=g(1024),o=new p,s=new m,c=0,l=0,u=0,d=-1,f=!1,h=e=>{let t=e.seed;return t^=t<<13,t^=t>>>17,t^=t<<5,e.seed=t,(t>>>0)/4294967296},_=(e,t,n,r)=>{if(e.count===e.capacity)return;let i=e.count++,a=n*3;e.appendStart<0&&(e.appendStart=i);let o=d,c=-u,f=(h(e)-.5)*2.2,p=(h(e)-.5)*.2,m=t.positions[a]+o*f+u*p,g=t.positions[a+1]+.15+h(e)*(r?.95:.75),_=t.positions[a+2]+c*f+d*p,v=r?.045+h(e)*.045:.4+h(e)*.26,y=r?v:v*(.6+h(e)*.18);s.makeScale(y,v,v),s.setPosition(m,g,_),e.mesh.setMatrixAt(i,s),e.born[i]=l-t.elapsed[n],e.bornLife.setXY(i,e.born[i],e.life);let b=(h(e)-.5)*(r?.24:.4),x=r?.05+h(e)*.15:.12+h(e)*.3;e.velocity.setXYZ(i,o*b-u*x,r?.28+h(e)*.26:.18+h(e)*.28,c*b-d*x),e.motion.setXYZW(i,(h(e)-.5)*E,h(e)*E,(h(e)<.5?-1:1)*(1.2+h(e)*2),h(e)*E),e.profile.setXYZW(i,r?.025+h(e)*.035:.07+h(e)*.11,3.5+h(e)*2.5,r?.65+h(e)*.2:.95+h(e)*.05,r?.015:.13+h(e)*.1);let S=h(e),C=r?ce:k[S<.225?0:S<.45?1:S<.625?2:S<.8?3:4],w=r?.06+h(e)*.12:.07+h(e)*.1;e.colour.setXYZ(i,C.r+(O.r-C.r)*w,C.g+(O.g-C.g)*w,C.b+(O.b-C.b)*w)},v=()=>{j(n),j(r),l=0,P(n,l),P(r,l)},y=()=>{v(),i.reset(),a.reset(),u=0,d=-1};return{setTier(e){f||(c=e)},step(e,s){if(f)return;t.getWorldPosition(o);let p=i.step(o.x,o.y,o.z,e,s,te[c]),m=a.step(o.x,o.y,o.z,e,s,re[c]);if(i.cleared||a.cleared){v();return}if(!Number.isFinite(e)||e<=0)return;if(l+=e,l>=128){let e=Math.floor(l/128)*128;l-=e,N(n,e),N(r,e)}M(n,l),M(r,l);let h=p>0?i.direction:a.direction,g=Math.hypot(h[0],h[2]);g>1e-5&&(u=h[0]/g,d=h[2]/g);for(let e=0;e<p;e+=1)for(let t=0;t<ne[c];t+=1)_(n,i,e,!1);for(let e=0;e<m;e+=1)for(let t=0;t<ie[c];t+=1)_(r,a,e,!0);P(n,l),P(r,l)},reset(){f||y()},dispose(){f||(f=!0,F(n),F(r))}}}var I=e=>new f().setHex(h(e),d),L=I(`white`),de=I(`beige/2`).lerp(L,.28),fe=I(`pink/1`),pe=I(`lavender/1`).lerp(I(`lilac/1`),.18),R=I(`yellow/1`).lerp(I(`orange`),.16),z=I(`green/-1`).lerp(I(`green/1`),.18);function B(e){let n=[],r=[],i=[],a=[],o=[],s=e===0?11:e===1?5:6,c=e===0?de:e===1?fe:pe,d=(t,s)=>{let l=s?3:e===1?4:5,u=s?3:e===1?5:3,d=l*u,f=n.length/3,p=Math.cos(t),m=Math.sin(t);for(let t=0;t<2;t+=1)for(let o=0;o<l;o+=1){let d=o/(l-1);for(let o=0;o<u;o+=1){let l=o/(u-1)*2-1,f,h,g;s?(f=.065+d*.42,h=.005+Math.sin(d*Math.PI)**.7*.092,g=-.065-d*.025+Math.sin(d*Math.PI)*.022):e===0?(f=.125+d*.865-l*l*Math.sin(d*Math.PI)*.035,h=.009+Math.sin(d*Math.PI)**.54*.12,g=.024+Math.sin(d*Math.PI)*.07+d*d*.032+l*l*.016):e===1?(f=.12+d*(1-Math.exp(-l*l*22)*.13-l**4*.14-.12),h=.018+Math.sin(d*Math.PI/2)**.85*.345,g=.03+Math.sin(d*Math.PI)*.09+d*d*.08+l*l*Math.sin(d*Math.PI)*.034):(f=.115+d*.88-l*l*Math.sin(d*Math.PI)*.025,h=.006+Math.sin(d*Math.PI)**.72*(1-d*.15)*.32,g=.014+d*d*.28+l*l*Math.sin(d*Math.PI)*.11);let _=l*h,v=t===0?.014:-.014;n.push(p*f-m*_,m*f+p*_,g+v),r.push(o/(u-1),d),a.push(s?0:t===0?1:.45);let y=s?z:c,b=s?.015:Math.exp(-l*l*35)*Math.sin(d*Math.PI)*.075,x=t===0?.94+d*.06:.86+d*.05;i.push((y.r+(L.r-y.r)*b)*x,(y.g+(L.g-y.g)*b)*x,(y.b+(L.b-y.b)*b)*x)}}for(let e=0;e<l-1;e+=1)for(let t=0;t<u-1;t+=1){let n=f+e*u+t,r=n+u;o.push(n,r,n+1,n+1,r,r+1),o.push(n+d,n+d+1,r+d,n+d+1,r+d+1,r+d)}let h=(e,t)=>{o.push(e,e+d,t,t,e+d,t+d)};for(let e=0;e<l-1;e+=1)h(f+e*u,f+(e+1)*u),h(f+(e+1)*u+u-1,f+e*u+u-1);for(let e=0;e<u-1;e+=1)h(f+(l-1)*u+e,f+(l-1)*u+e+1),h(f+e+1,f+e)};for(let e=0;e<s;e+=1)d(e*Math.PI*2/s+Math.PI/2,!1);let f=e===1?5:3;for(let e=0;e<f;e+=1)d(e*Math.PI*2/f,!0);let p=new u(1,8,5),m=n.length/3,h=p.getAttribute(`position`),g=p.getAttribute(`uv`),_=p.getAttribute(`normal`),v=e===0?.225:e===1?.155:.158,y=e===0?.115:.092;for(let e=0;e<h.count;e+=1){let t=h.getZ(e);n.push(h.getX(e)*v,h.getY(e)*v,.102+t*y),r.push(g.getX(e),g.getY(e)),a.push(0);let o=.83+Math.max(0,t)*.17;i.push(R.r*o,R.g*o,R.b*o)}for(let e of p.index.array)o.push(m+e);let b=new l;b.name=e===0?`Blossom_Cream_Daisy`:e===1?`Blossom_Pink_Notched`:`Blossom_Lilac_Cup`,b.setAttribute(`position`,new t(n,3)),b.setAttribute(`uv`,new t(r,2)),b.setAttribute(`color`,new t(i,3)),b.setAttribute(`blossomPetal`,new t(a,1)),b.setIndex(o),b.computeVertexNormals();let x=b.getAttribute(`normal`);for(let e=0;e<_.count;e+=1){let t=_.getX(e)/v,n=_.getY(e)/v,r=_.getZ(e)/y,i=Math.hypot(t,n,r);x.setXYZ(m+e,t/i,n/i,r/i)}for(let e=0;e<x.count;e+=1)Math.hypot(x.getX(e),x.getY(e),x.getZ(e))<1e-8&&x.setXYZ(e,0,0,1);return p.dispose(),b.computeBoundingSphere(),b}var me=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  attribute float blossomAlpha, blossomPetal;
  varying vec3 vBlossomView, vBlossomNormal, vBlossomColour;
  varying vec2 vBlossomUv;
  varying float vBlossomAlpha, vBlossomPetal;
  void main() {
    #include <beginnormal_vertex>
    #include <defaultnormal_vertex>
    vBlossomNormal = normalize(transformedNormal);
    vec3 transformed = position;
    #include <project_vertex>
    vBlossomView = -mvPosition.xyz; vBlossomColour = vec3(1.0);
    #ifdef USE_COLOR
      vBlossomColour *= color;
    #endif
    #ifdef USE_INSTANCING_COLOR
      vBlossomColour *= instanceColor;
    #endif
    vBlossomUv = uv; vBlossomAlpha = blossomAlpha; vBlossomPetal = blossomPetal;
    #include <logdepthbuf_vertex>
  }`,V=`
  #include <common>
  #include <logdepthbuf_pars_fragment>
  uniform vec3 blossomWhite, blossomFaceCentre;
  uniform vec2 blossomFaceRadius;
  uniform float blossomFaceEnabled;
  varying vec3 vBlossomView, vBlossomNormal, vBlossomColour;
  varying vec2 vBlossomUv;
  varying float vBlossomAlpha, vBlossomPetal;
  void main() {
    if (vBlossomAlpha < 0.003) discard;
    if (blossomFaceEnabled > 0.5 && vBlossomView.z < blossomFaceCentre.z + blossomFaceRadius.y) {
      vec2 offset = vBlossomView.xy / max(vBlossomView.z, 0.001)
        - blossomFaceCentre.xy / max(blossomFaceCentre.z, 0.001);
      float offAxis = sqrt(1.0 + dot(blossomFaceCentre.xy, blossomFaceCentre.xy)
        / max(blossomFaceCentre.z * blossomFaceCentre.z, 0.0001));
      vec2 radius = blossomFaceRadius * offAxis / max(blossomFaceCentre.z - blossomFaceRadius.x, 0.1);
      if (dot(offset / radius, offset / radius) < 1.0) discard;
    }
    vec3 normal = normalize(vBlossomNormal) * (gl_FrontFacing ? 1.0 : -1.0);
    vec3 view = normalize(vBlossomView + vec3(0.000001));
    vec3 light = normalize(mat3(viewMatrix) * vec3(-0.35, 0.85, 0.39));
    float diffuse = 0.74 + max(0.0, dot(normal, light)) * 0.26;
    float gloss = pow(max(0.0, dot(normal, normalize(view + light))), 44.0);
    float vein = exp(-pow((vBlossomUv.x - 0.5) * 48.0, 2.0))
      * sin(clamp(vBlossomUv.y, 0.0, 1.0) * 3.14159265359) * vBlossomPetal;
    vec3 colour = mix(vBlossomColour, blossomWhite, vein * 0.065 + gloss * 0.095) * diffuse;
    #include <logdepthbuf_fragment>
    gl_FragColor = vec4(colour, vBlossomAlpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;function H(e,t,r={}){let i=new s({name:e,vertexColors:!0,transparent:!0,depthWrite:!1,side:2,forceSinglePass:!0,toneMapped:!0,uniforms:{...r,blossomWhite:{value:L},blossomFaceCentre:{value:new p},blossomFaceRadius:{value:new n(1.05,1.05)},blossomFaceEnabled:{value:0}},vertexShader:t,fragmentShader:V});return Object.assign(i.defaultAttributeValues,{blossomAlpha:[1],blossomPetal:[0],color:[1,1,1],uv:[0,0]}),i}function U(e,t){let n=new p,r=new p;return i=>{let a=0,o=0;e&&(i.updateMatrixWorld(),e.updateWorldMatrix(!0,!1),n.set(-.00570525,.6573547,.02455115),e.localToWorld(n),a=1.00256*e.matrixWorld.getMaxScaleOnAxis()+.14,r.copy(n).applyMatrix4(i.matrixWorldInverse).multiplyScalar(-1),o=Number.isFinite(r.lengthSq())&&r.z>.1?1:0);for(let e of t)e.uniforms.blossomFaceCentre.value.copy(r),e.uniforms.blossomFaceRadius.value.set(a,a),e.uniforms.blossomFaceEnabled.value=o}}var W=Math.PI*2,G=[3,2,1],K=G[0],q=e=>{let t=Math.max(0,Math.min(1,e));return t*t*(3-2*t)},J=e=>{let t=Math.sin(e*127.1+311.7)*43758.5453123;return t-Math.floor(t)};function he(t){let n=H(`Blossom_Aura_Flowers`,me),o=[0,1,2].map(r=>{let i=B(r),o=new c(new Float32Array(K),1).setUsage(a);i.setAttribute(`blossomAlpha`,o);let s=new e(i,n,K);return s.name=`Flower_Aura_Whole_${[`Daisy`,`Pink`,`Violet`][r]}`,s.count=0,s.visible=!1,s.frustumCulled=!1,s.renderOrder=2,s.castShadow=s.receiveShadow=!1,s.instanceMatrix.setUsage(a),t.add(s),{mesh:s,alpha:o,kind:r}}),s=new Float64Array(K*3),l=new Float32Array(s.length),u=new Float32Array(s.length);for(let e=0;e<s.length;e+=1)l[e]=5.8+J(e+7)*2,u[e]=.12+J(e+9)*.66;let d=new p,f=new p,h=new r,g=new i,_=new m,v=0,y=0,b=0,x=0,S=!1,C=()=>{for(let e of o){let t=G[v];for(let n=0;n<t;n+=1){let t=n*3+e.kind,r=t*2.39996323,i=s[t],a=r+b,o=2.6+J(t+2)*.77+Math.sin(y*1.3+r)*.065;d.set(Math.cos(a)*o,-1.72+t%3*.68+Math.floor(t/3)*.17+Math.sin(y*1.1+r)*.13+(i-.5)*.28,Math.sin(a)*o-x*.18),h.set(-.22+Math.sin(y*.65+r)*.34,Math.PI/2-a+Math.sin(r)*.22,r+y*(.2+J(t+3)*.13));let c=q(i/.1),l=1-q((i-.79)/.21),u=(.48+J(t+5)*.14)*c*(.18+l*.82)*(1+Math.sin(y*1.7+r)*.018);f.setScalar(Math.max(.001,u)),g.setFromEuler(h),_.compose(d,g,f),e.mesh.setMatrixAt(n,_),e.alpha.setX(n,c*l*.96)}e.mesh.count=t,e.mesh.visible=t>0,e.mesh.instanceMatrix.needsUpdate=e.alpha.needsUpdate=!0}},w=()=>{y=b=x=0,s.set(u),C()};return w(),{material:n,step(e,t){if(!(S||!Number.isFinite(e)||e<=0)){y+=e,b=(b+e%12*W/12)%W,x+=(+!!t-x)*(1-Math.exp(-e*2.4));for(let t=0;t<s.length;t+=1){let n=l[t];s[t]=(s[t]+e%n/n)%1}C()}},setTier(e){S||e===v||(v=e,C())},reset(){S||w()},dispose(){if(!S){S=!0;for(let e of o)e.mesh.removeFromParent(),e.mesh.geometry.dispose(),e.mesh.dispose();n.dispose()}}}}var ge=Math.PI*2,_e=[4.8,8.7,16],ve=2.65,ye=1.7,Y=256,X=e=>{let t=Math.sin(e*127.1+311.7)*43758.5453123;return t-Math.floor(t)},be=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float blossomClock;
  attribute float blossomPetal;
  // Рождение, курс по земле (X, Z) и синус зерна.
  attribute vec4 blossomMotion;
  // Зерно в пределах круга и случайная доля размера.
  attribute vec2 blossomTurn;
  varying vec3 vBlossomView, vBlossomNormal, vBlossomColour;
  varying vec2 vBlossomUv;
  varying float vBlossomAlpha, vBlossomPetal;

  float blossomSmooth(float x) { float t = clamp(x, 0.0, 1.0); return t * t * (3.0 - 2.0 * t); }
  mat3 blossomTurnX(float a) { float c = cos(a), s = sin(a); return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c); }
  mat3 blossomTurnY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }
  mat3 blossomTurnZ(float a) { float c = cos(a), s = sin(a); return mat3(c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0); }

  void main() {
    float age = max(0.0, blossomClock - blossomMotion.x);
    float growth = blossomSmooth(age / 0.18);
    float closing = 1.0 - blossomSmooth((age - ${ye.toFixed(2)}) / ${.95.toFixed(2)});
    float wave = blossomMotion.w, seed = blossomTurn.x, random = blossomTurn.y;
    vec2 flow = blossomMotion.yz;
    // Цветок отходит вбок и назад от курса, всплывает и оседает; начальный
    // сдвиг уже лежит в корне экземпляра.
    float side = wave * age * 0.16, along = -age * 0.15;
    vec3 centre = instanceMatrix[3].xyz + vec3(flow.y * side + flow.x * along,
      age * 0.34 - age * age * 0.11, -flow.x * side + flow.y * along);
    // Порядок поворотов — XYZ, как у Euler по умолчанию.
    mat3 turn = blossomTurnX(-PI / 2.0 + 0.30 + wave * 0.25 + sin(age * 1.5 + seed) * 0.14)
      * blossomTurnY(seed + age * 0.25)
      * blossomTurnZ(wave * 0.2 + age * (0.22 + random * 0.17));
    float size = max(0.001, (0.38 + random * 0.17) * growth * (0.12 + closing * 0.88));
    vec4 mvPosition = modelViewMatrix * vec4(centre + turn * (position * size), 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <logdepthbuf_vertex>
    vBlossomNormal = normalize(normalMatrix * (turn * normal));
    vBlossomView = -mvPosition.xyz; vBlossomColour = vec3(1.0);
    #ifdef USE_COLOR
      vBlossomColour *= color;
    #endif
    vBlossomUv = uv; vBlossomAlpha = growth * closing * 0.94; vBlossomPetal = blossomPetal;
  }`;function Z(t,n,r){let i=B(r),o=new c(new Float32Array(Y*4),4).setUsage(a),s=new c(new Float32Array(Y*2),2).setUsage(a);i.setAttribute(`blossomMotion`,o),i.setAttribute(`blossomTurn`,s);let l=new e(i,n,Y);return l.name=`Flower_Path_Whole_${[`Daisy`,`Pink`,`Violet`][r]}`,l.instanceMatrix.setUsage(a),l.count=0,l.visible=!1,l.frustumCulled=!1,l.renderOrder=2,l.castShadow=l.receiveShadow=!1,t.add(l),{mesh:l,motion:o,turn:s,attributes:[l.instanceMatrix,o,s],born:new Float64Array(Y),count:0,slots:_(),appendStart:-1,rebased:!1}}function xe(e){e.count=e.mesh.count=0,e.mesh.visible=!1,e.slots.clear(),e.appendStart=-1,e.rebased=!1;for(let t of e.attributes)t.clearUpdateRanges()}function Se(e,t){let n=0;for(;n<e.count;){if(t-e.born[n]<ve){n+=1;continue}let r=--e.count;if(n!==r){e.born[n]=e.born[r];for(let t of e.attributes){let e=t.itemSize;t.array.copyWithin(n*e,r*e,(r+1)*e)}e.slots.moved(n)}}}function Ce(e,t){for(let n=0;n<e.count;n+=1)e.born[n]=e.born[n]-t,e.motion.setX(n,e.born[n]);e.rebased=!0}function Q(e){e.mesh.count=e.count,e.mesh.visible=e.count>0;for(let t of e.attributes){let n=!1;t===e.motion&&e.rebased&&e.count>0?(t.addUpdateRange(0,e.count*t.itemSize),n=!0):n=e.slots.upload(t,e.appendStart,e.count),n&&(t.needsUpdate=!0)}e.slots.clear(),e.appendStart=-1,e.rebased=!1}function we(e,t){let n={value:0},r=H(`Blossom_Path_Flowers`,be,{blossomClock:n}),i=[Z(e,r,0),Z(e,r,1),Z(e,r,2)],a=g(1024),o=new p,s=new m,c=0,l=0,u=0,d=!1,f=(e,t,n)=>{let r=u++,o=i[r%3];if(o.count===Y)return;let c=o.count++,d=e*3;o.appendStart<0&&(o.appendStart=c);let f=r*7.17,p=X(f),m=(r%2==0?-1:1)*(.78+p*.67),h=(X(f+1)-.5)*.35;s.makeTranslation(a.positions[d]+n*m+t*h,a.positions[d+1]+.38+p*.4,a.positions[d+2]-t*m+n*h),o.mesh.setMatrixAt(c,s),o.born[c]=l-a.elapsed[e],o.motion.setXYZW(c,o.born[c],t,n,Math.sin(f)),o.turn.setXY(c,f%ge,p)},h=()=>{for(let e of i)xe(e),Q(e);l=u=0,n.value=0};return{material:r,setTier(e){d||(c=e)},step(e,r){if(d)return;t.getWorldPosition(o);let s=a.step(o.x,o.y,o.z,e,r,_e[c]);if(a.cleared){h();return}if(!Number.isFinite(e)||e<=0)return;if(l+=e,l>=128){let e=Math.floor(l/128)*128;l-=e;for(let t of i)Ce(t,e)}for(let e of i)Se(e,l);let u=Math.hypot(a.direction[0],a.direction[2]),p=u>1e-4?a.direction[0]/u:0,m=u>1e-4?a.direction[2]/u:1;for(let e=0;e<s;e+=1)f(e,p,m);!r&&i.every(e=>e.count===0)&&(l=0),n.value=l;for(let e of i)Q(e)},reset(){d||(a.reset(),h())},dispose(){if(!d){d=!0;for(let e of i)e.mesh.removeFromParent(),e.mesh.geometry.dispose(),e.mesh.dispose();r.dispose()}}}}var $=e=>e.character?.getObjectByName(`mixamorigHead_06`)??null;function Te(e,t,n){let r=ue(e,t),i=we(e,t);return{step(e,t){r.step(e,t),i.step(e,t)},setTier(e){r.setTier(e),i.setTier(e)},reset(){r.reset(),i.reset()},view:U($(n),[i.material]),dispose(){r.dispose(),i.dispose()}}}function Ee(e,t,n){let r=ee(t),i=he(t);return{step(e,t){r.step(e,t),i.step(e,t)},setTier(e){r.setTier(e),i.setTier(e)},reset(){r.reset(),i.reset()},view:U($(n),[i.material]),dispose(){r.dispose(),i.dispose()}}}export{Ee as createFlowerAuraEffect,Te as createFlowerTrailEffect};