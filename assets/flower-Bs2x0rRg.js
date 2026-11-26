//# allFunctionsCalledOnLoad
import{$ as e,B as t,Cr as n,F as r,Jt as i,P as a,Ut as o,Xn as s,Z as c,d as l,nr as u,qn as d,v as f,wr as p,wt as m}from"./three.core-DVTiNhEy.js";import{o as h}from"./src-BI6MMqKu.js";import{n as g,r as _,t as v}from"./trail-shape-BsaeWHuc.js";import{t as y}from"./trail-slots-BYU9mmsR.js";var b=Math.PI*2,x=120,S=[120,80,48],C=[144,96,56],w=[`blush`,`pink/1`,`lilac/2`,`lavender/2`,`beige/2`].map(e=>new f().setHex(h(e),d)),T=new f().setHex(h(`white`),d),E=new f().setHex(h(`yellow/2`),d);function D(t,n,r,i){let a=i?C:S,l=new s({name:i?`Flower_Aura_Pollen`:`Flower_Aura_Petals`,uniforms:{flowerClock:n,flowerMotion:r,flowerWhite:{value:T}},defines:i?{FLOWER_POLLEN:1}:{},transparent:!0,depthWrite:!1,depthTest:!0,side:2,forceSinglePass:!0,blending:1,toneMapped:!0,vertexShader:`
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
      }`}),u=new o(1,1,i?1:4,i?1:6),d=new c(new Float32Array(a[0]*4),4),f=new c(new Float32Array(a[0]*4),4),p=new c(new Float32Array(a[0]*4),4),m=new c(new Float32Array(a[0]*3),3);u.setAttribute(`flowerCycle`,d),u.setAttribute(`flowerOrbit`,f),u.setAttribute(`flowerFlutter`,p);let h=new e(u,l,a[0]);return h.instanceColor=m,h.name=l.name,h.frustumCulled=!1,h.castShadow=h.receiveShadow=!1,h.renderOrder=+!!i,t.add(h),{mesh:h,cycle:d,orbit:f,flutter:p,tint:m,budget:a,pollen:i}}function ee(e){let t={value:0},n={value:0},r=[D(e,t,n,!1),D(e,t,n,!0)],i=[2.4,3,4],a=0,o=0,s=0,c=916999969,l=!1,u=new m,d=()=>(c^=c<<13,c^=c>>>17,c^=c<<5,(c>>>0)/4294967296),f=e=>{for(let t=0;t<e.budget[0];t+=1){let n=(t*.61803398875+d()*.08)%1,r=12+Math.floor(d()*15),a=115+Math.floor(d()*60),o=i[t%i.length],s=e.pollen?.038+d()*.052:.5+d()*.32,c=e.pollen?s:s*(.6+d()*.22);if(u.makeScale(c,s,1),e.mesh.setMatrixAt(t,u),e.cycle.setXYZW(t,n,o,b*r/x,e.pollen?.58+d()*.3:.92+d()*.08),e.orbit.setXYZW(t,e.pollen?1.75+d()*1.2:2.05+d()*.85,-2.32+d()*.58,2.8+d()*1.1,d()*b),e.flutter.setXYZW(t,d()*b,d()*b,b*a/x,(d()<.5?-1:1)*(2.4+d()*4)),e.pollen){let n=.08+d()*.18;e.tint.setXYZ(t,E.r+(T.r-E.r)*n,E.g+(T.g-E.g)*n,E.b+(T.b-E.b)*n)}else{let n=t%20,r=w[n<9?n%2:n<16?2+n%2:4];e.tint.setXYZ(t,r.r,r.g,r.b)}}for(let t of[e.mesh.instanceMatrix,e.cycle,e.orbit,e.flutter,e.tint])t.needsUpdate=!0;e.mesh.count=e.budget[a]},p=()=>{o=s=0,c=916999969,t.value=n.value=0;for(let e of r)f(e)};return p(),{step(e,r){if(l||!Number.isFinite(e)||e<=0)return;let i=Math.min(e,.1);o=(o+i)%x,s+=(+!!r-s)*(1-Math.exp(-i/.3)),t.value=o,n.value=s},setTier(e){if(!(l||e===a||e!==0&&e!==1&&e!==2)){a=e;for(let e of r)e.mesh.count=e.budget[a]}},reset(){l||p()},dispose(){if(!l){l=!0;for(let e of r)e.mesh.removeFromParent(),e.mesh.geometry.dispose(),e.mesh.material.dispose(),e.mesh.dispose()}}}}var O=Math.PI*2,te=[.28,.4,.6],ne=[4,3,3],re=[.32,.48,.68],ie=[2,2,1],k=2,A=1.45,ae=32768,oe=10240,j=new f().setHex(h(`white`),d),se=[`blush`,`pink/1`,`lilac/2`,`lavender/2`,`beige/2`].map(e=>new f().setHex(h(e),d)),ce=new f().setHex(h(`yellow/2`),d);function le(){let e=new o(1,1,4,6),t=e.getAttribute(`position`),n=e.getAttribute(`uv`);for(let e=0;e<t.count;e+=1){let r=n.getX(e),i=n.getY(e),a=2*r-1,o=Math.max(0,Math.sin(Math.PI*i))**.6*(.7+.3*i);t.setXYZ(e,a*o*.5,i-.5,.18*a*a+.16*Math.sin(Math.PI*i))}return e.computeVertexNormals(),e}function M(t,n,r){let i=n?oe:ae,l=new s({name:n?`Flower_Trail_Pollen`:`Flower_Trail_Petals`,defines:n?{FLOWER_POLLEN:1}:{},uniforms:{flowerClock:{value:0},flowerWhite:{value:j},trailShapeHeight:{value:r}},transparent:!0,depthWrite:!1,depthTest:!0,side:2,forceSinglePass:!0,blending:1,toneMapped:!0,vertexShader:`
      #include <common>
      #include <logdepthbuf_pars_vertex>
      uniform float flowerClock, trailShapeHeight;
      // Рождение и высота пола под частицей; жизнь у слоя общая.
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
        float k = clamp(age / ${(n?A:k).toFixed(2)}, 0.0, 1.0);
        float phase = flowerMotion.w;
        float drift = (1.0 - exp(-age * 0.8)) / 0.8;
        // Каждая частица остаётся в мировом следе независимо от поворота источника.
        vec3 root = instanceMatrix[3].xyz + flowerVelocity * drift;
        float sway = flowerProfile.x;
        root.x += (sin(age * 2.4 + phase) - sin(phase)) * sway;
        root.z += (cos(age * 2.0 + phase) - cos(phase)) * sway * 0.65;
        // Покачивание и оседание по высоте сжимаются вместе с обликом следа.
        root.y += (sin(age * 3.0 + phase) * age * 0.035 - flowerProfile.w * age * age) * trailShapeHeight;
        float sizeX = length(instanceMatrix[0].xyz);
        float sizeY = length(instanceMatrix[1].xyz);
        #ifdef FLOWER_POLLEN
          // Пылинка оседает на пол, а не проходит сквозь: её нижний край
          // держится над ступнями в миг рождения.
          root.y = max(flowerBornLife.y + ${v.toFixed(3)} + sizeY * 0.5, root.y);
          vec4 centre = modelViewMatrix * vec4(root, 1.0);
          centre.xy += position.xy * vec2(sizeX, sizeY) * length(modelViewMatrix[0].xyz);
          gl_Position = projectionMatrix * centre;
          vFlowerLight = 0.86 + 0.14 * sin(age * 5.4 + phase);
        #else
          // Настоящий изогнутый лепесток вращается по трём осям, без billboard.
          vec3 petal = position * vec3(sizeX, sizeY, sizeY);
          mat3 turn = tumble(age);
          // Лепесток ложится на пол, а не уходит под него: самая низкая точка
          // повёрнутого лепестка (по его рамке) держится над ступнями в миг
          // рождения. Рамка лепестка: ±0.5 поперёк и вдоль, изгиб до 0.34.
          vec3 down = vec3(turn[0].y, turn[1].y, turn[2].y);
          float reach = abs(down.x) * 0.5 * sizeX + abs(down.y) * 0.5 * sizeY + max(0.0, -down.z) * 0.34 * sizeY;
          root.y = max(flowerBornLife.y + ${v.toFixed(3)} + reach, root.y);
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
      }`}),u=n?new o(1,1):le(),d=new c(new Float32Array(i*2),2).setUsage(a),f=new c(new Float32Array(i*3),3).setUsage(a),p=new c(new Float32Array(i*4),4).setUsage(a),m=new c(new Float32Array(i*4),4).setUsage(a),h=new c(new Float32Array(i*3),3).setUsage(a);u.setAttribute(`flowerBornLife`,d),u.setAttribute(`flowerVelocity`,f),u.setAttribute(`flowerMotion`,p),u.setAttribute(`flowerProfile`,m),u.setAttribute(`flowerColour`,h);let g=new e(u,l,i);return g.name=l.name,g.renderOrder=+!!n,g.instanceMatrix.setUsage(a),g.count=0,g.visible=!1,g.frustumCulled=!1,g.castShadow=!1,g.receiveShadow=!1,t.add(g),{mesh:g,material:l,bornLife:d,velocity:f,motion:p,profile:m,colour:h,attributes:[g.instanceMatrix,d,f,p,m,h],born:new Float64Array(i),life:n?A:k,capacity:i,count:0,slots:y(),appendStart:-1,rebased:!1,seed:n?982901035:1525727549}}function N(e){e.count=e.mesh.count=0,e.mesh.visible=!1,e.slots.clear(),e.appendStart=-1,e.rebased=!1;for(let t of e.attributes)t.clearUpdateRanges()}function P(e,t){let n=0;for(;n<e.count;){if(t-e.born[n]<e.life){n+=1;continue}let r=--e.count;if(n!==r){e.born[n]=e.born[r];for(let t of e.attributes){let e=t.itemSize;t.array.copyWithin(n*e,r*e,(r+1)*e)}e.slots.moved(n)}}}function F(e,t){for(let n=0;n<e.count;n+=1)e.born[n]=e.born[n]-t,e.bornLife.setX(n,e.born[n]);e.rebased=!0}function I(e,t){e.mesh.count=e.count,e.mesh.visible=e.count>0,e.material.uniforms.flowerClock.value=t;for(let t of e.attributes){let n=t.itemSize,r=!1;t===e.bornLife&&e.rebased&&e.count>0?(t.addUpdateRange(0,e.count*n),r=!0):r=e.slots.upload(t,e.appendStart,e.count),r&&(t.needsUpdate=!0)}e.slots.clear(),e.appendStart=-1,e.rebased=!1}function L(e){e.mesh.removeFromParent(),e.mesh.geometry.dispose(),e.material.dispose(),e.mesh.dispose()}function ue(e,t,n=g){let{thickness:r,height:i}=n,a=M(e,!1,i),o=M(e,!0,i),s=_(1024),c=_(1024),l=new p,u=new m,d=0,f=0,h=0,v=-1,y=!1,b=e=>{let t=e.seed;return t^=t<<13,t^=t>>>17,t^=t<<5,e.seed=t,(t>>>0)/4294967296},x=(e,t,n,a)=>{if(e.count===e.capacity)return;let o=e.count++,s=n*3;e.appendStart<0&&(e.appendStart=o);let c=v,l=-h,d=(b(e)-.5)*2.2*r,p=(b(e)-.5)*.2,m=t.positions[s]+c*d+h*p,g=t.positions[s+1]+.15*i+b(e)*(a?.95:.75)*i,_=t.positions[s+2]+l*d+v*p,y=a?.045+b(e)*.045:.4+b(e)*.26,x=a?y:y*(.6+b(e)*.18);u.makeScale(x*r,y*r,y*r),u.setPosition(m,g,_),e.mesh.setMatrixAt(o,u),e.born[o]=f-t.elapsed[n],e.bornLife.setXY(o,e.born[o],t.positions[s+1]);let S=(b(e)-.5)*(a?.24:.4)*r,C=a?.05+b(e)*.15:.12+b(e)*.3;e.velocity.setXYZ(o,c*S-h*C,(a?.28+b(e)*.26:.18+b(e)*.28)*i,l*S-v*C),e.motion.setXYZW(o,(b(e)-.5)*O,b(e)*O,(b(e)<.5?-1:1)*(1.2+b(e)*2),b(e)*O),e.profile.setXYZW(o,(a?.025+b(e)*.035:.07+b(e)*.11)*r,3.5+b(e)*2.5,a?.65+b(e)*.2:.95+b(e)*.05,a?.015:.13+b(e)*.1);let w=b(e),T=a?ce:se[w<.225?0:w<.45?1:w<.625?2:w<.8?3:4],E=a?.06+b(e)*.12:.07+b(e)*.1;e.colour.setXYZ(o,T.r+(j.r-T.r)*E,T.g+(j.g-T.g)*E,T.b+(j.b-T.b)*E)},S=()=>{N(a),N(o),f=0,I(a,f),I(o,f)},C=()=>{S(),s.reset(),c.reset(),h=0,v=-1};return{setTier(e){y||(d=e)},step(e,n){if(y)return;t.getWorldPosition(l);let r=s.step(l.x,l.y,l.z,e,n,te[d]),i=c.step(l.x,l.y,l.z,e,n,re[d]);if(s.cleared||c.cleared){S();return}if(!Number.isFinite(e)||e<=0)return;if(f+=e,f>=128){let e=Math.floor(f/128)*128;f-=e,F(a,e),F(o,e)}P(a,f),P(o,f);let u=r>0?s.direction:c.direction,p=Math.hypot(u[0],u[2]);p>1e-5&&(h=u[0]/p,v=u[2]/p);for(let e=0;e<r;e+=1)for(let t=0;t<ne[d];t+=1)x(a,s,e,!1);for(let e=0;e<i;e+=1)for(let t=0;t<ie[d];t+=1)x(o,c,e,!0);I(a,f),I(o,f)},reset(){y||C()},dispose(){y||(y=!0,L(a),L(o))}}}var R=e=>new f().setHex(h(e),d),z=R(`white`),de=R(`beige/2`).lerp(z,.28),fe=R(`pink/1`),pe=R(`lavender/1`).lerp(R(`lilac/1`),.18),B=R(`yellow/1`).lerp(R(`orange`),.16),me=R(`green/-1`).lerp(R(`green/1`),.18);function V(e){let n=[],r=[],i=[],a=[],o=[],s=e===0?11:e===1?5:6,c=e===0?de:e===1?fe:pe,d=(t,s)=>{let l=s?3:e===1?4:5,u=s?3:e===1?5:3,d=l*u,f=n.length/3,p=Math.cos(t),m=Math.sin(t);for(let t=0;t<2;t+=1)for(let o=0;o<l;o+=1){let d=o/(l-1);for(let o=0;o<u;o+=1){let l=o/(u-1)*2-1,f,h,g;s?(f=.065+d*.42,h=.005+Math.sin(d*Math.PI)**.7*.092,g=-.065-d*.025+Math.sin(d*Math.PI)*.022):e===0?(f=.125+d*.865-l*l*Math.sin(d*Math.PI)*.035,h=.009+Math.sin(d*Math.PI)**.54*.12,g=.024+Math.sin(d*Math.PI)*.07+d*d*.032+l*l*.016):e===1?(f=.12+d*(1-Math.exp(-l*l*22)*.13-l**4*.14-.12),h=.018+Math.sin(d*Math.PI/2)**.85*.345,g=.03+Math.sin(d*Math.PI)*.09+d*d*.08+l*l*Math.sin(d*Math.PI)*.034):(f=.115+d*.88-l*l*Math.sin(d*Math.PI)*.025,h=.006+Math.sin(d*Math.PI)**.72*(1-d*.15)*.32,g=.014+d*d*.28+l*l*Math.sin(d*Math.PI)*.11);let _=l*h,v=t===0?.014:-.014;n.push(p*f-m*_,m*f+p*_,g+v),r.push(o/(u-1),d),a.push(s?0:t===0?1:.45);let y=s?me:c,b=s?.015:Math.exp(-l*l*35)*Math.sin(d*Math.PI)*.075,x=t===0?.94+d*.06:.86+d*.05;i.push((y.r+(z.r-y.r)*b)*x,(y.g+(z.g-y.g)*b)*x,(y.b+(z.b-y.b)*b)*x)}}for(let e=0;e<l-1;e+=1)for(let t=0;t<u-1;t+=1){let n=f+e*u+t,r=n+u;o.push(n,r,n+1,n+1,r,r+1),o.push(n+d,n+d+1,r+d,n+d+1,r+d+1,r+d)}let h=(e,t)=>{o.push(e,e+d,t,t,e+d,t+d)};for(let e=0;e<l-1;e+=1)h(f+e*u,f+(e+1)*u),h(f+(e+1)*u+u-1,f+e*u+u-1);for(let e=0;e<u-1;e+=1)h(f+(l-1)*u+e,f+(l-1)*u+e+1),h(f+e+1,f+e)};for(let e=0;e<s;e+=1)d(e*Math.PI*2/s+Math.PI/2,!1);let f=e===1?5:3;for(let e=0;e<f;e+=1)d(e*Math.PI*2/f,!0);let p=new u(1,8,5),m=n.length/3,h=p.getAttribute(`position`),g=p.getAttribute(`uv`),_=p.getAttribute(`normal`),v=e===0?.225:e===1?.155:.158,y=e===0?.115:.092;for(let e=0;e<h.count;e+=1){let t=h.getZ(e);n.push(h.getX(e)*v,h.getY(e)*v,.102+t*y),r.push(g.getX(e),g.getY(e)),a.push(0);let o=.83+Math.max(0,t)*.17;i.push(B.r*o,B.g*o,B.b*o)}for(let e of p.index.array)o.push(m+e);let b=new l;b.name=e===0?`Blossom_Cream_Daisy`:e===1?`Blossom_Pink_Notched`:`Blossom_Lilac_Cup`,b.setAttribute(`position`,new t(n,3)),b.setAttribute(`uv`,new t(r,2)),b.setAttribute(`color`,new t(i,3)),b.setAttribute(`blossomPetal`,new t(a,1)),b.setIndex(o),b.computeVertexNormals();let x=b.getAttribute(`normal`);for(let e=0;e<_.count;e+=1){let t=_.getX(e)/v,n=_.getY(e)/v,r=_.getZ(e)/y,i=Math.hypot(t,n,r);x.setXYZ(m+e,t/i,n/i,r/i)}for(let e=0;e<x.count;e+=1)Math.hypot(x.getX(e),x.getY(e),x.getZ(e))<1e-8&&x.setXYZ(e,0,0,1);return p.dispose(),b.computeBoundingSphere(),b}var he=`
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
  }`,ge=`
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
  }`;function H(e,t,r={}){let i=new s({name:e,vertexColors:!0,transparent:!0,depthWrite:!1,side:2,forceSinglePass:!0,toneMapped:!0,uniforms:{...r,blossomWhite:{value:z},blossomFaceCentre:{value:new p},blossomFaceRadius:{value:new n(1.05,1.05)},blossomFaceEnabled:{value:0}},vertexShader:t,fragmentShader:ge});return Object.assign(i.defaultAttributeValues,{blossomAlpha:[1],blossomPetal:[0],color:[1,1,1],uv:[0,0]}),i}function U(e,t){let n=new p,r=new p;return i=>{let a=0,o=0;e&&(i.updateMatrixWorld(),e.updateWorldMatrix(!0,!1),n.set(-.00570525,.6573547,.02455115),e.localToWorld(n),a=1.00256*e.matrixWorld.getMaxScaleOnAxis()+.14,r.copy(n).applyMatrix4(i.matrixWorldInverse).multiplyScalar(-1),o=Number.isFinite(r.lengthSq())&&r.z>.1?1:0);for(let e of t)e.uniforms.blossomFaceCentre.value.copy(r),e.uniforms.blossomFaceRadius.value.set(a,a),e.uniforms.blossomFaceEnabled.value=o}}var W=Math.PI*2,G=[3,2,1],K=G[0],q=e=>{let t=Math.max(0,Math.min(1,e));return t*t*(3-2*t)},J=e=>{let t=Math.sin(e*127.1+311.7)*43758.5453123;return t-Math.floor(t)};function _e(t){let n=H(`Blossom_Aura_Flowers`,he),o=[0,1,2].map(r=>{let i=V(r),o=new c(new Float32Array(K),1).setUsage(a);i.setAttribute(`blossomAlpha`,o);let s=new e(i,n,K);return s.name=`Flower_Aura_Whole_${[`Daisy`,`Pink`,`Violet`][r]}`,s.count=0,s.visible=!1,s.frustumCulled=!1,s.renderOrder=2,s.castShadow=s.receiveShadow=!1,s.instanceMatrix.setUsage(a),t.add(s),{mesh:s,alpha:o,kind:r}}),s=new Float64Array(K*3),l=new Float32Array(s.length),u=new Float32Array(s.length);for(let e=0;e<s.length;e+=1)l[e]=5.8+J(e+7)*2,u[e]=.12+J(e+9)*.66;let d=new p,f=new p,h=new r,g=new i,_=new m,v=0,y=0,b=0,x=0,S=!1,C=()=>{for(let e of o){let t=G[v];for(let n=0;n<t;n+=1){let t=n*3+e.kind,r=t*2.39996323,i=s[t],a=r+b,o=2.6+J(t+2)*.77+Math.sin(y*1.3+r)*.065;d.set(Math.cos(a)*o,-1.72+t%3*.68+Math.floor(t/3)*.17+Math.sin(y*1.1+r)*.13+(i-.5)*.28,Math.sin(a)*o-x*.18),h.set(-.22+Math.sin(y*.65+r)*.34,Math.PI/2-a+Math.sin(r)*.22,r+y*(.2+J(t+3)*.13));let c=q(i/.1),l=1-q((i-.79)/.21),u=(.48+J(t+5)*.14)*c*(.18+l*.82)*(1+Math.sin(y*1.7+r)*.018);f.setScalar(Math.max(.001,u)),g.setFromEuler(h),_.compose(d,g,f),e.mesh.setMatrixAt(n,_),e.alpha.setX(n,c*l*.96)}e.mesh.count=t,e.mesh.visible=t>0,e.mesh.instanceMatrix.needsUpdate=e.alpha.needsUpdate=!0}},w=()=>{y=b=x=0,s.set(u),C()};return w(),{material:n,step(e,t){if(!(S||!Number.isFinite(e)||e<=0)){y+=e,b=(b+e%12*W/12)%W,x+=(+!!t-x)*(1-Math.exp(-e*2.4));for(let t=0;t<s.length;t+=1){let n=l[t];s[t]=(s[t]+e%n/n)%1}C()}},setTier(e){S||e===v||(v=e,C())},reset(){S||w()},dispose(){if(!S){S=!0;for(let e of o)e.mesh.removeFromParent(),e.mesh.geometry.dispose(),e.mesh.dispose();n.dispose()}}}}var ve=Math.PI*2,ye=[4.8,8.7,16],be=2.65,xe=1.7,Y=256,X=e=>{let t=Math.sin(e*127.1+311.7)*43758.5453123;return t-Math.floor(t)},Se=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float blossomClock;
  // Облик следа: толщина множит размер и уход вбок, высота — всплытие и оседание.
  uniform float trailShapeThickness, trailShapeHeight;
  attribute float blossomPetal;
  // Рождение, курс по земле (X, Z) и синус зерна.
  attribute vec4 blossomMotion;
  // Зерно в пределах круга, случайная доля размера и высота пола (ступней)
  // в миг рождения.
  attribute vec3 blossomTurn;
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
    float closing = 1.0 - blossomSmooth((age - ${xe.toFixed(2)}) / ${.95.toFixed(2)});
    float wave = blossomMotion.w, seed = blossomTurn.x, random = blossomTurn.y;
    vec2 flow = blossomMotion.yz;
    // Цветок отходит вбок и назад от курса, всплывает и оседает; начальный
    // сдвиг уже лежит в корне экземпляра.
    float side = wave * age * 0.16 * trailShapeThickness, along = -age * 0.15;
    vec3 centre = instanceMatrix[3].xyz + vec3(flow.y * side + flow.x * along,
      (age * 0.34 - age * age * 0.11) * trailShapeHeight, -flow.x * side + flow.y * along);
    // Порядок поворотов — XYZ, как у Euler по умолчанию.
    mat3 turn = blossomTurnX(-PI / 2.0 + 0.30 + wave * 0.25 + sin(age * 1.5 + seed) * 0.14)
      * blossomTurnY(seed + age * 0.25)
      * blossomTurnZ(wave * 0.2 + age * (0.22 + random * 0.17));
    float size = max(0.001, (0.38 + random * 0.17) * growth * (0.12 + closing * 0.88) * trailShapeThickness);
    // Цветок не уходит под пол: самая низкая точка повёрнутой головки держится
    // над ступнями в миг рождения. Головка — круг радиусом до 1.01 с толщиной от
    // -0.105 (чашелистики) до 0.33 (загнутые лепестки) по своей оси.
    vec3 down = vec3(turn[0].y, turn[1].y, turn[2].y);
    float reach = size * (length(down.xy) * 1.01 + max(down.z * 0.105, -down.z * 0.33));
    centre.y = max(blossomTurn.z + ${v.toFixed(3)} + reach, centre.y);
    vec4 mvPosition = modelViewMatrix * vec4(centre + turn * (position * size), 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <logdepthbuf_vertex>
    vBlossomNormal = normalize(normalMatrix * (turn * normal));
    vBlossomView = -mvPosition.xyz; vBlossomColour = vec3(1.0);
    #ifdef USE_COLOR
      vBlossomColour *= color;
    #endif
    vBlossomUv = uv; vBlossomAlpha = growth * closing * 0.94; vBlossomPetal = blossomPetal;
  }`;function Z(t,n,r){let i=V(r),o=new c(new Float32Array(Y*4),4).setUsage(a),s=new c(new Float32Array(Y*3),3).setUsage(a);i.setAttribute(`blossomMotion`,o),i.setAttribute(`blossomTurn`,s);let l=new e(i,n,Y);return l.name=`Flower_Path_Whole_${[`Daisy`,`Pink`,`Violet`][r]}`,l.instanceMatrix.setUsage(a),l.count=0,l.visible=!1,l.frustumCulled=!1,l.renderOrder=2,l.castShadow=l.receiveShadow=!1,t.add(l),{mesh:l,motion:o,turn:s,attributes:[l.instanceMatrix,o,s],born:new Float64Array(Y),count:0,slots:y(),appendStart:-1,rebased:!1}}function Ce(e){e.count=e.mesh.count=0,e.mesh.visible=!1,e.slots.clear(),e.appendStart=-1,e.rebased=!1;for(let t of e.attributes)t.clearUpdateRanges()}function we(e,t){let n=0;for(;n<e.count;){if(t-e.born[n]<be){n+=1;continue}let r=--e.count;if(n!==r){e.born[n]=e.born[r];for(let t of e.attributes){let e=t.itemSize;t.array.copyWithin(n*e,r*e,(r+1)*e)}e.slots.moved(n)}}}function Te(e,t){for(let n=0;n<e.count;n+=1)e.born[n]=e.born[n]-t,e.motion.setX(n,e.born[n]);e.rebased=!0}function Q(e){e.mesh.count=e.count,e.mesh.visible=e.count>0;for(let t of e.attributes){let n=!1;t===e.motion&&e.rebased&&e.count>0?(t.addUpdateRange(0,e.count*t.itemSize),n=!0):n=e.slots.upload(t,e.appendStart,e.count),n&&(t.needsUpdate=!0)}e.slots.clear(),e.appendStart=-1,e.rebased=!1}function Ee(e,t,n=g){let{thickness:r,height:i}=n,a={value:0},o=H(`Blossom_Path_Flowers`,Se,{blossomClock:a,trailShapeThickness:{value:r},trailShapeHeight:{value:i}}),s=[Z(e,o,0),Z(e,o,1),Z(e,o,2)],c=_(1024),l=new p,u=new m,d=0,f=0,h=0,v=!1,y=(e,t,n)=>{let a=h++,o=s[a%3];if(o.count===Y)return;let l=o.count++,d=e*3;o.appendStart<0&&(o.appendStart=l);let p=a*7.17,m=X(p),g=(a%2==0?-1:1)*(.78+m*.67)*r,_=(X(p+1)-.5)*.35;u.makeTranslation(c.positions[d]+n*g+t*_,c.positions[d+1]+.38*i+m*.4*i,c.positions[d+2]-t*g+n*_),o.mesh.setMatrixAt(l,u),o.born[l]=f-c.elapsed[e],o.motion.setXYZW(l,o.born[l],t,n,Math.sin(p)),o.turn.setXYZ(l,p%ve,m,c.positions[d+1])},b=()=>{for(let e of s)Ce(e),Q(e);f=h=0,a.value=0};return{material:o,setTier(e){v||(d=e)},step(e,n){if(v)return;t.getWorldPosition(l);let r=c.step(l.x,l.y,l.z,e,n,ye[d]);if(c.cleared){b();return}if(!Number.isFinite(e)||e<=0)return;if(f+=e,f>=128){let e=Math.floor(f/128)*128;f-=e;for(let t of s)Te(t,e)}for(let e of s)we(e,f);let i=Math.hypot(c.direction[0],c.direction[2]),o=i>1e-4?c.direction[0]/i:0,u=i>1e-4?c.direction[2]/i:1;for(let e=0;e<r;e+=1)y(e,o,u);!n&&s.every(e=>e.count===0)&&(f=0),a.value=f;for(let e of s)Q(e)},reset(){v||(c.reset(),b())},dispose(){if(!v){v=!0;for(let e of s)e.mesh.removeFromParent(),e.mesh.geometry.dispose(),e.mesh.dispose();o.dispose()}}}}var $=e=>e.character?.getObjectByName(`mixamorigHead_06`)??null;function De(e,t,n,r=g){let i=ue(e,t,r),a=Ee(e,t,r);return{step(e,t){i.step(e,t),a.step(e,t)},setTier(e){i.setTier(e),a.setTier(e)},reset(){i.reset(),a.reset()},view:U($(n),[a.material]),dispose(){i.dispose(),a.dispose()}}}function Oe(e,t,n){let r=ee(t),i=_e(t);return{step(e,t){r.step(e,t),i.step(e,t)},setTier(e){r.setTier(e),i.setTier(e)},reset(){r.reset(),i.reset()},view:U($(n),[i.material]),dispose(){r.dispose(),i.dispose()}}}export{Oe as createFlowerAuraEffect,De as createFlowerTrailEffect};