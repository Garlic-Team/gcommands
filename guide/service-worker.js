if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return a[e]||(s=new Promise((async s=>{if("document"in self){const a=document.createElement("script");a.src=e,document.head.appendChild(a),a.onload=s}else importScripts(e),s()}))),s.then((()=>{if(!a[e])throw new Error(`Module ${e} didn’t register its module`);return a[e]}))},s=(s,a)=>{Promise.all(s.map(e)).then((e=>a(1===e.length?e[0]:e)))},a={require:Promise.resolve(s)};self.define=(s,i,d)=>{a[s]||(a[s]=Promise.resolve().then((()=>{let a={};const r={uri:location.origin+s.slice(1)};return Promise.all(i.map((s=>{switch(s){case"exports":return a;case"module":return r;default:return e(s)}}))).then((e=>{const s=d(...e);return a.default||(a.default=s),a}))})))}}define("./service-worker.js",["./workbox-2c301fb6"],(function(e){"use strict";e.setCacheNameDetails({prefix:"mr-hope"}),self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.clientsClaim(),e.precacheAndRoute([{url:"assets/css/0.styles.62864a43.css",revision:"86c69f814d202e3fe6c8c1c4629d6808"},{url:"assets/img/danger-dark.7b1d6aa1.svg",revision:"7b1d6aa1bdcf013d0edfe316ab770f8e"},{url:"assets/img/danger.b143eda2.svg",revision:"b143eda243548a9982491dca4c81eed5"},{url:"assets/img/default-skin.b257fa9c.svg",revision:"b257fa9c5ac8c515ac4d77a667ce2943"},{url:"assets/img/info-dark.f8a43cf6.svg",revision:"f8a43cf67fa96a27a078530a3a43253c"},{url:"assets/img/info.88826912.svg",revision:"88826912d81d91c9e2d03164cd1481a1"},{url:"assets/img/search.83621669.svg",revision:"83621669651b9a3d4bf64d1a670ad856"},{url:"assets/img/tip-dark.075a244c.svg",revision:"075a244c83d1403c167defe81b4d7fe7"},{url:"assets/img/tip.a2b80aa5.svg",revision:"a2b80aa50b769a26da12fe352322a657"},{url:"assets/img/warning-dark.aac7e30c.svg",revision:"aac7e30c5fafc6748e21f7a9ef546698"},{url:"assets/img/warning.ec428b6d.svg",revision:"ec428b6d6d45ac5d0c610f08d757f40f"},{url:"assets/js/29.bc150ede.js",revision:"1d90d2dbb6608d5202acdb7609cbcb90"},{url:"assets/js/30.63f423f9.js",revision:"665a5b91ebcadfa1e204c7b2432fd145"},{url:"assets/js/app.72f553cb.js",revision:"a4a214665381082d693371d76fcc4b4c"},{url:"assets/js/layout-Blog.872fe4b7.js",revision:"9d37428f5ac5ce18d1029cfecf499d20"},{url:"assets/js/layout-Layout.0f99aa0c.js",revision:"a0901909a3803a3409db0dd824fea090"},{url:"assets/js/layout-NotFound.3d8f8870.js",revision:"0dd465aa8a10a231b6a4dde76da734a9"},{url:"assets/js/layout-Slide.7680046e.js",revision:"22eeb5312c6eda496e47be071a8f11a8"},{url:"assets/js/page-AdditionalFeatures.c33c4324.js",revision:"ba57e299af6268e7691cd54983efc0ff"},{url:"assets/js/page-ContextMenus.36451c7a.js",revision:"b5634a99e59ea6ed0e6cf2f60792cc72"},{url:"assets/js/page-Database.ea7bf5ae.js",revision:"dbcbb20ba9483b61bb8be5a6e7df30dc"},{url:"assets/js/page-Events.0e40fe02.js",revision:"ef7a218cfbb3271cd8a82be46087951e"},{url:"assets/js/page-FAQ.d4b7cb38.js",revision:"046045f76907085054857208dea84e52"},{url:"assets/js/page-Home.b49fe1d1.js",revision:"c0ea78c50d568396df7c0ae23ae8eb9c"},{url:"assets/js/page-Inhibitor.1499ddb0.js",revision:"9cc36bd804355d07272709941fd1893e"},{url:"assets/js/page-InstallingNodejsandGCommands.9a57f0bb.js",revision:"8480ab8b0256729abe50b266ec4bc682"},{url:"assets/js/page-Introduction.7895d760.js",revision:"484466cb5c2c065f7874a88603e864a3"},{url:"assets/js/page-Makingabasicbot.0daa392f.js",revision:"76e461ff46bfbb94efacf7824aab9ccd"},{url:"assets/js/page-Mentions.e13401ff.js",revision:"ff31297f33e7ac66fd41b39fb6d90555"},{url:"assets/js/page-MessageComponents.507b59f1.js",revision:"d8bc303621e2c2e84a68b0546546b699"},{url:"assets/js/page-MoreEvents.0f9caf48.js",revision:"3215aaa48aac93b95ec4328fe1b24c11"},{url:"assets/js/page-SlashCommands.38d89c19.js",revision:"628ada194eb6fc6f1126c1682e4198f7"},{url:"assets/js/page-Updatingfromv2tov3.be8f1b5a.js",revision:"ac250ca401bd39a5a9e8e11013460165"},{url:"assets/js/page-Updatingfromv3tov4.bd59c2c3.js",revision:"e1799e3c614f761ed8312a0f3b29f5df"},{url:"assets/js/page-Updatingfromv4tov5.1be7765b.js",revision:"81870ba5f01142fed0b5cae6c71dcd0e"},{url:"assets/js/page-Updatingfromv5tov6.cc1d579a.js",revision:"acf2cc085abdb4ec7a4cc5aed667da6e"},{url:"assets/js/page-UsingargumentsinCommands.e60eb006.js",revision:"54bd2a0cdc5f0ff5c369b37d27e0a867"},{url:"assets/js/vendors~layout-Blog~layout-Layout~layout-NotFound.5156f8a3.js",revision:"ea58e6536feab0dd9fa6bb89d99d1aab"},{url:"assets/js/vendors~layout-Blog~layout-Layout~layout-NotFound~layout-Slide.b4ed0d1d.js",revision:"cee7413c059f90b02f8a3f7badff5b67"},{url:"assets/js/vendors~layout-Layout.de9ffcbe.js",revision:"04a9b2fa2a84595d4486d5f8c88e53b3"},{url:"assets/js/vendors~photo-swipe.7780fe04.js",revision:"974c7c3fe1c21610ac3b30710a51149d"},{url:"404.html",revision:"7d79f259c10410b9475c0c16b0107466"},{url:"guide/additional/fromv2tov3/index.html",revision:"e3c21be5c2f8c984964de9712f3c8d11"},{url:"guide/additional/fromv3tov4/index.html",revision:"7bc5f42d70b7a8e683fc78c907159619"},{url:"guide/additional/fromv4tov5/index.html",revision:"ac906c8a0422ad570bd1c306a28856cd"},{url:"guide/additional/fromv5tov6/index.html",revision:"7e79c9d53ae1aac225804fe8240f3212"},{url:"guide/arguments/usingargsincmd/index.html",revision:"20b4d09bf0266529f2cfd915c41015e0"},{url:"guide/beginner/additionalfeatures/index.html",revision:"8f79fc89096b5e44925847f5276ed3b9"},{url:"guide/beginner/basicbot/index.html",revision:"2c7dac70574adee5e9259845be0d8ae9"},{url:"guide/beginner/database/index.html",revision:"fb1ee2b44b4272b6f66d2b5357716f0d"},{url:"guide/beginner/events/index.html",revision:"9a6b5d184de83f8eb5f090b5052364a0"},{url:"guide/faq/index.html",revision:"4cd83d5d4cc62200db4d42367dea7c1f"},{url:"guide/index.html",revision:"58b037ba3fcb2ff0f9920fafec0525d9"},{url:"guide/interactions/contextmenus/index.html",revision:"484248599dcb26c4812e64bc06eff3b8"},{url:"guide/interactions/messagecomponents/index.html",revision:"d4a16c56f9bf50409931a7705cf06d7f"},{url:"guide/interactions/slashcommands/index.html",revision:"861d6d88112540a42f56d9bfc0f28558"},{url:"guide/miscellaneous/inhibitor/index.html",revision:"26f30dcb6f1697465bcf47918079b24f"},{url:"guide/miscellaneous/mentions/index.html",revision:"3fa26c301a5731ce485c297e926a27f4"},{url:"guide/miscellaneous/moreevents/index.html",revision:"7b2d485376fe0faaea4d1165a48c8d70"},{url:"guide/setup/index.html",revision:"51facd7bdef453708a8ec25a9067d906"},{url:"index.html",revision:"7b14f6cb9d93ac46cbe62c272f3c385e"}],{}),e.cleanupOutdatedCaches()}));
//# sourceMappingURL=service-worker.js.map
addEventListener("message", (event) => {
  const replyPort = event.ports[0];
  const message = event.data;
  if (replyPort && message && message.type === "skip-waiting")
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        (error) => replyPort.postMessage({ error })
      )
    );
});
