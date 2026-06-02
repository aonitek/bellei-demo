(function(){
  'use strict';
  var scripts=document.querySelectorAll('script[data-widget]');
  scripts.forEach(function(script){
    if(script.dataset.aonitekInit)return;
    script.dataset.aonitekInit='1';
    createLauncher(script);
  });
  function createLauncher(script){
    var cfg={
      widgetId:script.dataset.widget||'',
      avatar:script.dataset.avatar||'',
      shape:script.dataset.shape||'circle',
      size:parseInt(script.dataset.size,10)||120,
      width:parseInt(script.dataset.width,10)||135,
      height:parseInt(script.dataset.height,10)||84,
      zoom:parseFloat(script.dataset.zoom)||1,
      label:script.dataset.label||'',
      labelHighlight:script.dataset.labelHighlight||'',
      color:script.dataset.color||'#0097B2',
      position:script.dataset.position||'bottom-right',
      bob:script.dataset.bob!=='false',
      sound:script.dataset.sound==='true',
      teaserDelay:parseInt(script.dataset.teaserDelay,10)||6,
      panelTitle:script.dataset.panelTitle||'',
      panelWidth:parseInt(script.dataset.panelWidth,10)||380,
      panelHeight:parseInt(script.dataset.panelHeight,10)||600
    };
    if(!cfg.widgetId)return;
    var uid='aon-'+cfg.widgetId+'-'+Math.random().toString(36).slice(2,7);
    var isRight=cfg.position!=='bottom-left';
    var fabW,fabH,fabRadius;
    if(cfg.shape==='circle'){fabW=fabH=cfg.size;fabRadius='50%';}
    else if(cfg.shape==='rectangle'){fabW=cfg.width;fabH=cfg.height;fabRadius='14px';}
    else{fabW=fabH=cfg.size;fabRadius='22px';}
    var iframeUrl='https://app.aonitek.com/agents/'+cfg.widgetId+'/embed';
    var DISMISS_KEY='aonitekTeaser_'+cfg.widgetId;
    var css=[
      '#'+uid+'-wrap{position:fixed;'+(isRight?'right':'left')+':20px;bottom:20px;z-index:2147483640;font-family:-apple-system,sans-serif;display:flex;flex-direction:column;align-items:'+(isRight?'flex-end':'flex-start')+';gap:10px;}',
      '#'+uid+'-btn{width:'+fabW+'px;height:'+fabH+'px;border-radius:'+fabRadius+';border:0;padding:0;cursor:pointer;overflow:hidden;display:flex;align-items:center;justify-content:center;background:'+cfg.color+';box-shadow:0 6px 24px rgba(0,0,0,0.22);transition:transform 0.2s ease,box-shadow 0.2s ease;position:relative;flex-shrink:0;'+(cfg.bob?'animation:'+uid+'-bob 3s ease-in-out infinite;':'')+'}',
      '#'+uid+'-btn:hover{transform:scale(1.08);box-shadow:0 10px 32px rgba(0,0,0,0.32);'+(cfg.bob?'animation-play-state:paused;':'')+'}',
      '#'+uid+'-btn img.aon-avatar{width:100%;height:100%;object-fit:cover;display:block;transform:scale('+cfg.zoom+');transform-origin:center center;}',
      '#'+uid+'-btn .aon-close-ico{position:absolute;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,0.55);color:#fff;font-size:'+Math.round(fabH*0.35)+'px;font-weight:300;line-height:1;pointer-events:none;}',
      '#'+uid+'-btn.is-open .aon-close-ico{display:flex;}',
      '#'+uid+'-btn svg.aon-fallback{width:50%;height:50%;fill:#fff;display:none;}',
      cfg.bob?'@keyframes '+uid+'-bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-6px);}}':'',
      '#'+uid+'-teaser{background:#fff;color:#1a1a1a;padding:10px 14px 10px 16px;border-radius:14px;box-shadow:0 6px 20px rgba(0,0,0,0.16);font-size:14px;font-weight:500;line-height:1.35;display:flex;align-items:center;gap:10px;white-space:nowrap;opacity:0;transform:translateY(8px);transition:opacity 0.35s ease,transform 0.35s cubic-bezier(0.34,1.56,0.64,1);pointer-events:none;cursor:pointer;max-width:260px;position:relative;}',
      '#'+uid+'-teaser::after{content:"";position:absolute;bottom:-7px;'+(isRight?'right':'left')+':28px;width:14px;height:14px;background:#fff;transform:rotate(45deg);box-shadow:3px 3px 6px rgba(0,0,0,0.06);}',
      '#'+uid+'-teaser.aon-show{opacity:1;transform:translateY(0);pointer-events:auto;}',
      '#'+uid+'-teaser .aon-hl{color:'+cfg.color+';font-weight:700;}',
      '#'+uid+'-teaser-x{background:none;border:0;color:#999;font-size:18px;line-height:1;cursor:pointer;padding:0 2px;flex-shrink:0;}',
      '#'+uid+'-panel{position:fixed;'+(isRight?'right':'left')+':20px;bottom:'+(fabH+30)+'px;width:'+cfg.panelWidth+'px;height:'+cfg.panelHeight+'px;max-height:calc(100vh - '+(fabH+60)+'px);background:#fff;border-radius:18px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 16px 48px rgba(0,0,0,0.22);z-index:2147483639;opacity:0;transform:translateY(20px) scale(0.95);transform-origin:'+(isRight?'bottom right':'bottom left')+';transition:opacity 0.25s ease,transform 0.25s cubic-bezier(0.34,1.56,0.64,1);pointer-events:none;}',
      '#'+uid+'-panel.aon-open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto;}',
      '#'+uid+'-panel-hdr{background:'+cfg.color+';color:#fff;padding:13px 16px;display:flex;align-items:center;justify-content:space-between;font-size:14px;font-weight:600;letter-spacing:0.04em;flex-shrink:0;}',
      '#'+uid+'-panel-hdr-avatar{width:30px;height:30px;border-radius:50%;overflow:hidden;border:2px solid rgba(255,255,255,0.5);flex-shrink:0;background:rgba(255,255,255,0.2);}',
      '#'+uid+'-panel-hdr-avatar img{width:100%;height:100%;object-fit:cover;transform:scale('+Math.min(cfg.zoom,1.5)+');transform-origin:center center;}',
      '#'+uid+'-panel-hdr-info{display:flex;align-items:center;gap:10px;}',
      '#'+uid+'-panel-hdr-status{font-size:11px;font-weight:400;opacity:0.85;display:flex;align-items:center;gap:4px;}',
      '#'+uid+'-panel-hdr-status::before{content:"";width:6px;height:6px;border-radius:50%;background:#4ade80;display:inline-block;}',
      '#'+uid+'-panel-close{background:transparent;border:0;color:rgba(255,255,255,0.9);font-size:24px;line-height:1;cursor:pointer;padding:0 4px;flex-shrink:0;}',
      '#'+uid+'-iframe{flex:1;width:100%;border:0;background:#fff;display:block;}',
      '@media(max-width:600px){#'+uid+'-wrap{right:12px!important;left:12px!important;bottom:12px;align-items:flex-end;}#'+uid+'-panel{right:0!important;left:0!important;bottom:0!important;width:100%!important;height:88vh!important;max-height:88vh!important;border-radius:20px 20px 0 0!important;}#'+uid+'-btn{width:72px!important;height:72px!important;}#'+uid+'-teaser{font-size:13px;white-space:normal;max-width:200px;}}'
    ].join('\n');
    var styleEl=document.createElement('style');
    styleEl.textContent=css;
    document.head.appendChild(styleEl);
    var wrap=el('div',{id:uid+'-wrap'});
    var teaser=null,teaserX=null;
    if(cfg.label){
      teaser=el('div',{id:uid+'-teaser',role:'button',tabIndex:'0','aria-label':'Abrir chat'});
      var labelHtml=cfg.label;
      if(cfg.labelHighlight)labelHtml=cfg.label.replace(cfg.labelHighlight,'<span class="aon-hl">'+cfg.labelHighlight+'</span>');
      var labelSpan=el('span');labelSpan.innerHTML=labelHtml;teaser.appendChild(labelSpan);
      teaserX=el('button',{id:uid+'-teaser-x','aria-label':'Descartar'});teaserX.textContent='×';teaser.appendChild(teaserX);
      wrap.appendChild(teaser);
    }
    var btn=el('button',{id:uid+'-btn',type:'button','aria-label':'Abrir chat','aria-expanded':'false'});
    var avatarImg=null,fallbackSvg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    if(cfg.avatar){
      avatarImg=el('img');avatarImg.className='aon-avatar';avatarImg.src=cfg.avatar;avatarImg.alt='Chat';
      avatarImg.onerror=function(){avatarImg.style.display='none';fallbackSvg.style.display='block';};
      btn.appendChild(avatarImg);
    }
    fallbackSvg.setAttribute('viewBox','0 0 24 24');fallbackSvg.className.baseVal='aon-fallback';
    fallbackSvg.style.display=cfg.avatar?'none':'block';
    fallbackSvg.innerHTML='<path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.953 7.953 0 01-4.078-1.117l-.292-.174-3.026.9.9-3.026-.174-.292A7.953 7.953 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>';
    btn.appendChild(fallbackSvg);
    var closeIco=el('div');closeIco.className='aon-close-ico';closeIco.innerHTML='&#x2715;';btn.appendChild(closeIco);
    wrap.appendChild(btn);document.body.appendChild(wrap);
    var panel=el('div',{id:uid+'-panel',role:'dialog','aria-label':cfg.panelTitle||'Chat','aria-modal':'true'});
    var hdr=el('div',{id:uid+'-panel-hdr'});
    var hdrInfo=el('div',{id:uid+'-panel-hdr-info'});
    if(cfg.avatar){var hdrAv=el('div',{id:uid+'-panel-hdr-avatar'});var hdrAvImg=el('img');hdrAvImg.src=cfg.avatar;hdrAvImg.alt='';hdrAvImg.setAttribute('aria-hidden','true');hdrAv.appendChild(hdrAvImg);hdrInfo.appendChild(hdrAv);}
    var hdrTitle=el('div',{id:uid+'-panel-hdr-title'});
    if(cfg.panelTitle){var tl=el('div');tl.textContent=cfg.panelTitle;hdrTitle.appendChild(tl);}
    var sl=el('div',{id:uid+'-panel-hdr-status'});sl.textContent='En línea';hdrTitle.appendChild(sl);hdrInfo.appendChild(hdrTitle);hdr.appendChild(hdrInfo);
    var panelClose=el('button',{id:uid+'-panel-close',type:'button','aria-label':'Cerrar chat'});panelClose.textContent='×';hdr.appendChild(panelClose);panel.appendChild(hdr);
    var iframe=el('iframe',{id:uid+'-iframe','data-src':iframeUrl,title:cfg.panelTitle||'Chat',allow:'camera; microphone; clipboard-write; clipboard-read; autoplay'});
    panel.appendChild(iframe);document.body.appendChild(panel);
    var iframeLoaded=false,isOpen=false;
    function openPanel(){if(!iframeLoaded){iframe.src=iframe.dataset.src;iframeLoaded=true;}isOpen=true;panel.classList.add('aon-open');btn.classList.add('is-open');btn.setAttribute('aria-expanded','true');if(teaser)dismissTeaser();}
    function closePanel(){isOpen=false;panel.classList.remove('aon-open');btn.classList.remove('is-open');btn.setAttribute('aria-expanded','false');}
    function dismissTeaser(){if(!teaser)return;teaser.classList.remove('aon-show');try{sessionStorage.setItem(DISMISS_KEY,'1');}catch(_){}}
    function showTeaser(){if(!teaser||isOpen)return;var d=false;try{d=sessionStorage.getItem(DISMISS_KEY)==='1';}catch(_){}if(d)return;teaser.classList.add('aon-show');}
    btn.addEventListener('click',function(){isOpen?closePanel():openPanel();});
    panelClose.addEventListener('click',closePanel);
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&isOpen)closePanel();});
    if(teaser){
      teaser.addEventListener('click',function(e){if(e.target!==teaserX)openPanel();});
      teaser.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openPanel();}});
      teaserX.addEventListener('click',function(e){e.stopPropagation();dismissTeaser();});
      setTimeout(showTeaser,cfg.teaserDelay*1000);
    }
  }
  function el(tag,attrs){var n=document.createElement(tag);if(attrs)Object.keys(attrs).forEach(function(k){n.setAttribute(k,attrs[k]);});return n;}
})();