(function(){
  if(window.__snow)return;window.__snow=1;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var c=document.createElement('canvas');
  c.setAttribute('aria-hidden','true');
  c.style.cssText='position:fixed;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:40;';
  document.body.appendChild(c);
  var x=c.getContext('2d'),W=0,H=0,dpr=Math.min(window.devicePixelRatio||1,2),flakes=[],pile=reduce?14:4,maxPile=26,run=true,last=0,t0=Date.now();
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
