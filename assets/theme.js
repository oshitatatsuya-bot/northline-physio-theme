(function(){
  window.__vpReveal = true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".vp-reveal").forEach(function(el){ el.classList.add("is-in"); });
    return;
  }
  var nodes = document.querySelectorAll(".vp-reveal");
  if (!("IntersectionObserver" in window)) {
    nodes.forEach(function(el){ el.classList.add("is-in"); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: "0px 0px 12% 0px" });
  nodes.forEach(function(el, i){
    el.style.transitionDelay = Math.min(i, 6) * 0.05 + "s";
    if (el.closest(".vp-hero")) el.classList.add("is-in");
    io.observe(el);
  });
  function vpReached(el){ var r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < window.innerHeight + 80; }
  function vpSweep(){
    if (window.innerHeight < 80) return;
    nodes.forEach(function(el){ if (el.closest(".vp-hero") || vpReached(el)) el.classList.add("is-in"); });
    document.documentElement.classList.add("vp-reveal-on");
  }
  vpSweep();
  window.addEventListener("scroll", vpSweep, { passive: true });
  window.addEventListener("resize", vpSweep);
  window.addEventListener("load", vpSweep);
  var vpTries = 0;
  var vpTimer = setInterval(function(){ vpSweep(); if (++vpTries > 8) clearInterval(vpTimer); }, 400);
})();
(function(){
var nodes=document.querySelectorAll(".vp-m");
if(!nodes.length)return;
if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
function vpReached(el){var r=el.getBoundingClientRect();return r.bottom>0&&r.top<window.innerHeight+80;}
function viewportReady(){return window.innerHeight>=80;}
var EASE={smooth:"cubic-bezier(.16,1,.3,1)",spring:"cubic-bezier(.34,1.56,.64,1)",linear:"linear",gentle:"cubic-bezier(.45,0,.2,1)"};
var DEF={"fade":{d:900},"fade-up":{d:900,x:40},"zoom-in":{d:1000,s:85},"slide":{d:900,x:90},"parallax":{i:18},"hover-zoom":{d:600,s:108},"float":{d:6000,x:14},"stagger":{d:800,x:28,g:120},"typing":{d:1400},"mask":{d:1300},"words":{d:900,g:60},"scrub":{i:15},"count":{d:1600},"tilt":{x:12},"bounce":{d:200},"expand":{d:400},"glass":{},"snap-x":{},"line-rise":{d:1100,x:36}};
var PRESETS=["fade-up","fade","zoom-in","slide","parallax","hover-zoom","float","stagger","typing","bgvideo","mask","words","scrub","count","tilt","glass","bounce","expand","snap-x","line-rise"];
var ITEMS=".vp-card,.vp-step,.vp-price,.vp-tl-row,.vp-member,.vp-value,.vp-zig-row,.vp-faq-item,.vp-menu-row,.vp-info-row,.vp-logo,.vp-stat,.vp-hbl-row,.vp-mtc-item,.vp-mq-point,.vp-item,.vp-sticky-item,.vp-index-row,.vp-bento-tile,.vp-scroll-card,.vp-table-row,.vp-vc-chapter,.vp-ln-door,.vp-stg-cas-panel,.vp-stg-ch-beat,.vp-stg-pin-item,.vp-stg-rail-row,.vp-stg-duo-card,.vp-stg-lad-rung,.vp-stg-ov-chapter,.vp-stg-void-line,.wp-block-column";
function presetOf(el){for(var i=0;i<PRESETS.length;i++){if(el.classList.contains("vp-m-"+PRESETS[i]))return PRESETS[i];}return "";}
function params(el,preset){var p={},d=DEF[preset]||{},k;for(k in d)p[k]=d[k];
for(var i=0;i<el.classList.length;i++){var c=el.classList[i];if(c.indexOf("vp-m-")!==0)continue;var t=c.slice(5);var m=/^([dwxrsgi])(n?)(\d+)$/.exec(t);
if(m){p[m[1]]=(m[2]?-1:1)*Number(m[3]);}else if(t.indexOf("e-")===0){p.e=t.slice(2);}else if(t.indexOf("to-")===0){p.to=t.slice(3);}}
return p;}
var io="IntersectionObserver" in window?new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);play(e.target);}});},{threshold:0,rootMargin:"0px 0px 12% 0px"}):null;
function play(el){if(el.__vpPlay){el.__vpPlay();}else{el.classList.add("is-in");}}
function watch(el){if(io){io.observe(el);}else{play(el);}}
function enter(el,p,preset,delay){var x=0,y=0,dist=p.x||0;
if(preset==="fade-up"||preset==="stagger")y=dist;
if(preset==="slide"){var to=p.to||"left";if(to==="left")x=-dist;else if(to==="right")x=dist;else if(to==="up")y=dist;else y=-dist;}
var s=p.s?p.s/100:1;var st=el.style;el.classList.add("vp-m-enter");
st.setProperty("--vp-tx",x+"px");st.setProperty("--vp-ty",y+"px");st.setProperty("--vp-sc",String(s));st.setProperty("--vp-rot",(p.r||0)+"deg");
st.setProperty("--vp-dur",(p.d||900)+"ms");st.setProperty("--vp-delay",(delay||0)+"ms");st.setProperty("--vp-ease",EASE[p.e]||EASE.smooth);}
var par=[],scr=[],ticking=false;
function onScroll(){if(ticking)return;ticking=true;requestAnimationFrame(function(){ticking=false;var vh=window.innerHeight;
par.forEach(function(o){var r=o.el.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;var off=(r.top+r.height/2-vh/2)*-o.k;
for(var i=0;i<o.media.length;i++){o.media[i].style.transform="translate3d(0,"+off.toFixed(1)+"px,0)"+(o.zoom?" scale("+o.zoom+")":"");}});
scr.forEach(function(o){var r=o.el.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;var t=Math.max(0,Math.min(1,(vh-r.top)/(vh+r.height)));
for(var i=0;i<o.media.length;i++){o.media[i].style.transform="translate3d(0,"+((0.5-t)*o.k*240).toFixed(1)+"px,0) scale("+(1+o.k*(1.2-t)).toFixed(3)+")";}
var shift=Math.min(600,window.innerWidth*0.3);for(var j=0;j<o.heads.length;j++){o.heads[j].style.transform="translate3d("+((0.5-t)*o.k*shift).toFixed(1)+"px,0,0)";}});});}
function words(t){var out=[];if(window.Intl&&Intl.Segmenter&&/[\u3040-\u30ff\u3400-\u9fff]/.test(t)){Array.from(new Intl.Segmenter("ja",{granularity:"word"}).segment(t)).forEach(function(s){out.push(s.segment);});}else{t.split(/(\s+)/).forEach(function(s){if(s)out.push(s);});}
while(out.length>40){var merged=[];for(var i=0;i<out.length;i+=2)merged.push(out[i]+(out[i+1]||""));out=merged;}return out;}
function fmt(v,dec,comma){var s=v.toFixed(dec);if(!comma)return s;var parts=s.split(".");parts[0]=parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,",");return parts.join(".");}
for(var n=0;n<nodes.length;n++){(function(el){
var preset=presetOf(el);if(!preset||preset==="bgvideo")return;var p=params(el,preset);
if(preset==="fade"||preset==="fade-up"||preset==="zoom-in"||preset==="slide"||preset==="line-rise"){if(el.classList.contains("vp-hero"))return;enter(el,preset==="line-rise"?Object.assign({},p,{x:p.x||36}):p,preset==="line-rise"?"fade-up":preset,p.w);watch(el);return;}
if(preset==="stagger"){var items=el.querySelectorAll(ITEMS);if(!items.length)items=el.querySelectorAll(".vp-items > *,.vp-sticky-list > *,.vp-menu > *");if(!items.length)items=el.querySelectorAll("h2,h3");
var list=[];for(var i=0;i<items.length&&list.length<24;i++){var it=items[i];var anc=it.parentElement&&it.parentElement.closest(ITEMS);if(anc&&el.contains(anc))continue;list.push(it);var delay=(p.w||0)+list.length*(p.g||120)-(p.g||120);if(delay>520)delay=520;enter(it,p,"stagger",delay);}
el.__vpPlay=function(){list.forEach(function(x){x.classList.add("is-in");});};watch(el);return;}
if(preset==="typing"){if(!viewportReady()||vpReached(el)||el.classList.contains("vp-hero"))return;var heads=el.querySelectorAll("h1,h2");var jobs=[];
for(var j=0;j<heads.length&&jobs.length<2;j++){(function(h){if(h.children.length)return;var full=h.textContent||"";if(!full.trim())return;
h.setAttribute("aria-label",full);h.style.minHeight=h.offsetHeight+"px";h.classList.add("vp-typing");h.textContent="";
jobs.push(function(start){var step=Math.max(16,Math.min(180,(p.d||1400)/Math.max(1,full.length)));var c=0;
setTimeout(function tick(){c++;h.textContent=full.slice(0,c);if(c<full.length){setTimeout(tick,step);}else{h.classList.add("vp-typed");h.style.minHeight="";}},start);});})(heads[j]);}
el.__vpPlay=function(){var t=p.w||0;jobs.forEach(function(job){job(t);t+=(p.d||1400)+200;});};watch(el);return;}
if(preset==="parallax"){var media=el.querySelectorAll(".wp-block-cover__image-background,figure img,.vp-panel img,.vp-panel svg,.vp-fill img,.vp-photo-bg img,video");var k=(p.i||18)/100;
if(media.length){for(var q=0;q<media.length;q++)media[q].classList.add("vp-parallax-media");par.push({el:el,media:media,k:k,zoom:(1+k*1.2).toFixed(3)});}
else{var inner=el.querySelectorAll(".vp-wrap,.wp-block-group__inner-container");if(inner.length)par.push({el:el,media:[inner[0]],k:k*0.5,zoom:""});}
return;}
if(preset==="float"){var targets=el.querySelectorAll(".vp-panel,figure,.vp-card,.vp-fill");if(!targets.length)targets=el.querySelectorAll("h1,h2");
var count=0;for(var f=0;f<targets.length&&count<8;f++){var tg=targets[f];if(tg.parentElement&&tg.parentElement.closest(".vp-floater"))continue;count++;
tg.classList.add("vp-floater");tg.style.setProperty("--vp-float",(p.x||14)+"px");tg.style.setProperty("--vp-float-dur",(p.d||6000)+"ms");tg.style.animationDelay=(-(count*900))+"ms";}
return;}
if(preset==="hover-zoom"){el.style.setProperty("--vp-zoom",String((p.s||108)/100));el.style.setProperty("--vp-dur",(p.d||600)+"ms");el.style.setProperty("--vp-ease",EASE[p.e]||EASE.smooth);}
if(preset==="mask"){var ms=el.querySelectorAll(".vp-panel,.vp-fill,figure.wp-block-image,.vp-photo-bg,.wp-block-cover__image-background");var mk=0;
for(var a=0;a<ms.length&&mk<16;a++){var m=ms[a];if(m.parentElement&&m.parentElement.closest(".vp-mask"))continue;m.classList.add("vp-mask");
m.style.setProperty("--vp-dur",(p.d||1300)+"ms");m.style.setProperty("--vp-delay",((p.w||0)+(mk%3)*140)+"ms");m.style.setProperty("--vp-ease",EASE[p.e]||EASE.smooth);mk++;
var host=m.parentElement||el;if(!host.__vpMasks){host.__vpMasks=[];(function(hs){hs.__vpPlay=function(){hs.__vpMasks.forEach(function(x){x.classList.add("is-in");});};watch(hs);})(host);}host.__vpMasks.push(m);}
if(!mk){enter(el,p,"fade-up",p.w);watch(el);}return;}
if(preset==="words"){if(el.classList.contains("vp-hero"))return;var hs=el.querySelectorAll("h1,h2");var wl=[];
for(var b=0;b<hs.length&&wl.length<2;b++){var h=hs[b];if(h.children.length)continue;var txt=h.textContent||"";if(!txt.trim())continue;
h.setAttribute("aria-label",txt);h.textContent="";words(txt).forEach(function(w,k){if(!w.trim()){h.appendChild(document.createTextNode(" "));return;}
var o=document.createElement("span");o.className="vp-word";o.setAttribute("aria-hidden","true");var inner=document.createElement("span");inner.textContent=w;
inner.style.transitionDelay=((p.w||0)+k*(p.g||60))+"ms";inner.style.setProperty("--vp-dur",(p.d||900)+"ms");inner.style.setProperty("--vp-ease",EASE[p.e]||EASE.smooth);o.appendChild(inner);h.appendChild(o);});
h.classList.add("vp-words");wl.push(h);}
if(!wl.length){enter(el,p,"fade-up",p.w);watch(el);return;}
el.__vpPlay=function(){wl.forEach(function(x){x.classList.add("is-in");});};watch(el);return;}
if(preset==="scrub"){var sm=el.querySelectorAll(".wp-block-cover__image-background,figure img,.vp-panel img,.vp-panel svg,.vp-fill img,.vp-photo-bg img");var sh=el.querySelectorAll("h1,h2");
for(var c=0;c<sm.length;c++)sm[c].classList.add("vp-parallax-media");for(var e=0;e<sh.length;e++)sh[e].classList.add("vp-scrub-head");
if(sm.length||sh.length)scr.push({el:el,media:sm,heads:sh,k:(p.i||15)/100});return;}
if(preset==="count"){var cands=el.querySelectorAll(".vp-value-num,.vp-price-amount,.vp-sticky-num,.vp-index-num,.vp-index-meta,.vp-meta,h2,h3,p");var cl=[];
for(var f2=0;f2<cands.length&&cl.length<12;f2++){var nd=cands[f2];if(nd.children.length)continue;var raw=(nd.textContent||"").trim();if(!raw||raw.length>24)continue;
var mm=/^(\D*?)(\d[\d,]*(?:\.\d+)?)(\D*)$/.exec(raw);if(!mm||/^(19|20)\d{2}$/.test(mm[2]))continue;var target=Number(mm[2].replace(/,/g,""));if(!isFinite(target)||target<2)continue;
cl.push({el:nd,raw:nd.textContent,pre:mm[1],post:mm[3],to:target,dec:(mm[2].split(".")[1]||"").length,comma:mm[2].indexOf(",")>=0});}
if(!cl.length){enter(el,p,"fade-up",p.w);watch(el);return;}
el.__vpPlay=function(){var dur=p.d||1600,t0=0;cl.forEach(function(x){x.el.classList.add("vp-counting");});
function step(ts){if(!t0)t0=ts;var k=Math.min(1,(ts-t0)/dur),ease=1-Math.pow(1-k,3);
cl.forEach(function(x){x.el.textContent=k<1?x.pre+fmt(x.to*ease,x.dec,x.comma)+x.post:x.raw;});if(k<1)requestAnimationFrame(step);}
setTimeout(function(){requestAnimationFrame(step);},p.w||0);};watch(el);return;}
if(preset==="bounce"){el.style.setProperty("--vp-dur",(p.d||200)+"ms");return;}
if(preset==="glass"||preset==="expand"||preset==="snap-x"){return;}
if(preset==="tilt"){var max=p.x||12;var tg=el.querySelectorAll(".vp-card,.vp-panel,figure,.vp-fill,.vp-value,.vp-price,.vp-member");
var list=[];for(var t=0;t<tg.length&&list.length<12;t++){tg[t].classList.add("vp-tilt-target");list.push(tg[t]);}
if(!list.length)return;
el.addEventListener("mousemove",function(ev){var r=el.getBoundingClientRect();var px=(ev.clientX-r.left)/Math.max(1,r.width)-0.5;var py=(ev.clientY-r.top)/Math.max(1,r.height)-0.5;
for(var i=0;i<list.length;i++){var tr=list[i].getBoundingClientRect();var cx=(tr.left+tr.width/2-r.left)/Math.max(1,r.width)-0.5;var cy=(tr.top+tr.height/2-r.top)/Math.max(1,r.height)-0.5;
list[i].style.transform="rotateX("+((py-cy)*-max*2).toFixed(2)+"deg) rotateY("+((px-cx)*max*2).toFixed(2)+"deg)";}});
el.addEventListener("mouseleave",function(){for(var i=0;i<list.length;i++)list[i].style.transform="";});
return;}
})(nodes[n]);}
if(par.length||scr.length){window.addEventListener("scroll",onScroll,{passive:true});window.addEventListener("resize",onScroll);onScroll();}
function vpShowNow(el){el.classList.remove("vp-m-wait");el.style.setProperty("--vp-dur","1ms");el.style.setProperty("--vp-delay","0ms");el.classList.add("is-in");}
function armMotion(){if(!viewportReady())return;document.querySelectorAll(".vp-m-enter,.vp-mask,.vp-words").forEach(function(el){if(el.classList.contains("is-in")||el.classList.contains("vp-m-wait"))return;if(vpReached(el)||el.closest(".vp-hero"))el.classList.add("is-in");else el.classList.add("vp-m-wait");});document.documentElement.classList.add("vp-motion-on");}
function vpSweep(){armMotion();document.querySelectorAll(".vp-hero").forEach(function(el){el.classList.add("is-in");});document.querySelectorAll(".vp-m").forEach(function(el){if(!vpReached(el))return;if(typeof el.__vpPlay==="function")el.__vpPlay();else el.classList.add("is-in");el.querySelectorAll(".vp-m-enter:not(.is-in),.vp-mask:not(.is-in),.vp-words:not(.is-in)").forEach(function(n){if(vpReached(n)||n.closest(".vp-hero"))vpShowNow(n);});});document.querySelectorAll(".vp-reveal").forEach(function(el){if(el.closest(".vp-hero")||vpReached(el))el.classList.add("is-in");});}
vpSweep();
requestAnimationFrame(vpSweep);
window.addEventListener("scroll",vpSweep,{passive:true});
window.addEventListener("resize",vpSweep);
window.addEventListener("load",vpSweep);
var vpTries=0;var vpTimer=setInterval(function(){vpSweep();if(++vpTries>8)clearInterval(vpTimer);},400);
})();
(function(){
var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var chapterRoots=[];
var runways=[];
var ticking=false;
function activate(dots,chs,shots,index){
for(var i=0;i<dots.length;i++){dots[i].classList.toggle("is-on",i===index);}
for(var c=0;c<chs.length;c++){chs[c].classList.toggle("is-on",c===index);}
for(var s=0;s<shots.length;s++){shots[s].classList.toggle("is-on",s===index);}
}
/** Active chapter = the one containing the focus line (avoids IO ratio flicker between neighbors). */
function chapterIndex(chs){
var focus=window.innerHeight*0.42;var idx=0;
for(var i=0;i<chs.length;i++){var r=chs[i].getBoundingClientRect();if(r.top<=focus&&r.bottom>focus)return i;if(r.top>focus)return Math.max(0,i-1);idx=i;}
return idx;
}
function bindChapters(root,dotSel,chSel,shotSel){
var dots=root.querySelectorAll(dotSel);var chs=root.querySelectorAll(chSel);var shots=shotSel?root.querySelectorAll(shotSel):[];
if(!chs.length)return;
var current=-1;var lockUntil=0;
function setIndex(i,force){
i=Math.max(0,Math.min(chs.length-1,i));
if(!force&&i===current)return;
current=i;activate(dots,chs,shots,i);
}
function go(i){
i=Math.max(0,Math.min(chs.length-1,i));
setIndex(i,true);
lockUntil=Date.now()+(reduce?0:900);
if(chs[i]&&chs[i].scrollIntoView)chs[i].scrollIntoView({behavior:reduce?"auto":"smooth",block:"center"});
}
for(var d=0;d<dots.length;d++){(function(i){dots[i].addEventListener("click",function(){go(i);});dots[i].setAttribute("role","button");dots[i].tabIndex=0;dots[i].addEventListener("keydown",function(ev){if(ev.key==="Enter"||ev.key===" "){ev.preventDefault();go(i);}});})(d);}
chapterRoots.push({chs:chs,setIndex:setIndex,getLock:function(){return lockUntil;}});
setIndex(chapterIndex(chs),true);
}
document.querySelectorAll(".vp-stg-story").forEach(function(root){bindChapters(root,".vp-stg-story-dot",".vp-stg-story-ch",".vp-stg-story-shot");});
document.querySelectorAll(".vp-stg-prog").forEach(function(root){bindChapters(root,".vp-stg-prog-dot",".vp-stg-prog-ch","");});
document.querySelectorAll(".vp-stg-runway").forEach(function(root){
var pin=root.querySelector(".vp-stg-runway-pin");var track=root.querySelector(".vp-stg-runway-track");
if(!pin||!track)return;
if(reduce||window.matchMedia("(max-width:820px)").matches)return;
runways.push({root:root,track:track});
});
function frame(){
ticking=false;var now=Date.now();
for(var i=0;i<chapterRoots.length;i++){var o=chapterRoots[i];if(now<o.getLock())continue;o.setIndex(chapterIndex(o.chs),false);}
var vh=window.innerHeight;
for(var r=0;r<runways.length;r++){var u=runways[r];var box=u.root.getBoundingClientRect();var span=Math.max(1,u.root.offsetHeight-vh);var t=Math.max(0,Math.min(1,(-box.top)/span));
var max=Math.max(0,u.track.scrollWidth-u.root.clientWidth+48);u.track.style.transform="translate3d("+(-(max*t)).toFixed(1)+"px,0,0)";}
}
function onScroll(){if(ticking)return;ticking=true;requestAnimationFrame(frame);}
if(chapterRoots.length||runways.length){window.addEventListener("scroll",onScroll,{passive:true});window.addEventListener("resize",onScroll);frame();}
})();