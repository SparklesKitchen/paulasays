(function(){
  if(window.__snow)return;window.__snow=1;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var c=document.createElement('canvas');
  c.setAttribute('aria-hidden','true');
  c.style.cssText='position:fixed;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:40;';
  document.body.appendChild(c);
  var x=c.getContext('2d'),W=0,H=0,dpr=Math.min(window.devicePixelRatio||1,2),flakes=[],pile=reduce?16:10,maxPile=32,run=true,last=0,t0=Date.now();
  function size(){W=innerWidth;H=innerHeight;c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0);}
  size();addEventListener('resize',size);
  var N=W<700?22:46;
  function mk(top){return{x:Math.random()*W,y:top?Math.random()*H:-10,r:1+Math.random()*2.2,v:18+Math.random()*28,s:Math.random()*6.28,a:.35+Math.random()*.45}}
  if(!reduce)for(var i=0;i<N;i++)flakes.push(mk(true));
  function drawPile(){
    var h=pile,g=x.createLinearGradient(0,H-h-8,0,H);
    g.addColorStop(0,'rgba(245,248,252,.92)');g.addColorStop(1,'rgba(214,224,236,.96)');
    x.fillStyle=g;x.beginPath();x.moveTo(0,H);
    for(var px=0;px<=W;px+=20){x.lineTo(px,H-h-Math.sin(px/70)*h*.25-Math.sin(px/23+1)*h*.12);}
    x.lineTo(W,H);x.closePath();x.fill();
  }
  function frame(t){
    if(!run){return}
    var dt=Math.min((t-last)/1000||0.016,.05);last=t;
    x.clearRect(0,0,W,H);
    x.fillStyle='#fff';
    for(var i=0;i<flakes.length;i++){var f=flakes[i];
      f.y+=f.v*dt;f.s+=dt*.8;f.x+=Math.sin(f.s)*12*dt;
      if(f.y>H-pile+2){flakes[i]=mk(false);pile=Math.min(maxPile,pile+.006);continue}
      x.globalAlpha=f.a;x.beginPath();x.arc(f.x,f.y,f.r,0,6.283);x.fill();}
    x.globalAlpha=1;drawPile();
    requestAnimationFrame(frame);
  }
  if(reduce){drawPile();addEventListener('resize',function(){x.clearRect(0,0,W,H);drawPile()});}
  else{requestAnimationFrame(frame);
    document.addEventListener('visibilitychange',function(){if(document.hidden){run=false}else if(!run){run=true;last=performance.now();requestAnimationFrame(frame)}});}
})();

/* festoon lights: homepage hero and the two table pages */
(function(){
  if(window.__lights)return;
  if(!document.querySelector('header.hero')&&!document.querySelector('section#table'))return;
  window.__lights=1;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var st=document.createElement('style');
  st.textContent='#festoon{position:absolute;left:0;top:70px;width:100%;height:96px;pointer-events:none;z-index:30;overflow:hidden}#festoon svg{display:block;width:100%;height:100%;overflow:visible}'
   +'#festoon .b{transform-box:fill-box;transform-origin:50% 0}'
   +(document.querySelector('header.hero')?'header.hero .hero-in{padding-top:110px}':'section#table{padding-top:clamp(150px,16vw,200px)!important}')
   +(reduce?'':'@keyframes ftw{0%,100%{opacity:1}50%{opacity:.55}}#festoon .b{animation:ftw 3.2s ease-in-out infinite}');
  document.head.appendChild(st);
  var d=document.createElement('div');d.id='festoon';d.setAttribute('aria-hidden','true');
  document.body.insertBefore(d,document.body.firstChild);
  var cols=['#e5483b','#f2b84b','#3fbf7f','#4aa3e0','#f08a3c'];
  function build(){
    var W=d.clientWidth||innerWidth,sw=W<700?150:250,sag=W<700?20:30,n=Math.ceil(W/sw),w=W/n;
    var p='<svg viewBox="0 0 '+W+' 96" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">',wire='M0 4',bulbs='',k=0;
    for(var i=0;i<n;i++){var x0=i*w;wire+=' Q'+(x0+w/2)+' '+(4+sag*2)+' '+(x0+w)+' 4';
      var per=W<700?4:5;
      for(var j=1;j<=per;j++){var t=j/(per+1),bx=x0+w*t,by=4+2*sag*t*(1-t)*2;
        var c=cols[k%cols.length];
        p+='';bulbs+='<g class="b" style="animation-delay:'+((k*0.37)%3.2).toFixed(2)+'s"><rect x="'+(bx-2.5)+'" y="'+(by)+'" width="5" height="6" rx="1" fill="#2a2a2a"/><ellipse cx="'+bx+'" cy="'+(by+16)+'" rx="6.5" ry="10" fill="'+c+'" style="filter:drop-shadow(0 0 7px '+c+')"/><ellipse cx="'+(bx-2)+'" cy="'+(by+12)+'" rx="1.8" ry="3" fill="#fff" opacity=".55"/></g>';k++;}
    }
    p+='<path d="'+wire+'" fill="none" stroke="#1c1c1c" stroke-width="2"/>'+bulbs+'</svg>';
    d.innerHTML=p;
  }
  build();var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(build,150)});
})();
