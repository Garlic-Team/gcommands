if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return a[e]||(s=new Promise((async s=>{if("document"in self){const a=document.createElement("script");a.src=e,document.head.appendChild(a),a.onload=s}else importScripts(e),s()}))),s.then((()=>{if(!a[e])throw new Error(`Module ${e} didn’t register its module`);return a[e]}))},s=(s,a)=>{Promise.all(s.map(e)).then((e=>a(1===e.length?e[0]:e)))},a={require:Promise.resolve(s)};self.define=(s,i,d)=>{a[s]||(a[s]=Promise.resolve().then((()=>{let a={};const r={uri:location.origin+s.slice(1)};return Promise.all(i.map((s=>{switch(s){case"exports":return a;case"module":return r;default:return e(s)}}))).then((e=>{const s=d(...e);return a.default||(a.default=s),a}))})))}}define("./service-worker.js",["./workbox-2c301fb6"],(function(e){"use strict";e.setCacheNameDetails({prefix:"mr-hope"}),self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.clientsClaim(),e.precacheAndRoute([{url:"assets/css/0.styles.f200a387.css",revision:"cba571f236f4cc6fbb8ac4870ed50b0f"},{url:"assets/img/danger-dark.7b1d6aa1.svg",revision:"7b1d6aa1bdcf013d0edfe316ab770f8e"},{url:"assets/img/danger.b143eda2.svg",revision:"b143eda243548a9982491dca4c81eed5"},{url:"assets/img/default-skin.b257fa9c.svg",revision:"b257fa9c5ac8c515ac4d77a667ce2943"},{url:"assets/img/info-dark.f8a43cf6.svg",revision:"f8a43cf67fa96a27a078530a3a43253c"},{url:"assets/img/info.88826912.svg",revision:"88826912d81d91c9e2d03164cd1481a1"},{url:"assets/img/search.83621669.svg",revision:"83621669651b9a3d4bf64d1a670ad856"},{url:"assets/img/tip-dark.075a244c.svg",revision:"075a244c83d1403c167defe81b4d7fe7"},{url:"assets/img/tip.a2b80aa5.svg",revision:"a2b80aa50b769a26da12fe352322a657"},{url:"assets/img/warning-dark.aac7e30c.svg",revision:"aac7e30c5fafc6748e21f7a9ef546698"},{url:"assets/img/warning.ec428b6d.svg",revision:"ec428b6d6d45ac5d0c610f08d757f40f"},{url:"assets/js/31.e2932c7b.js",revision:"cbba81564cb5930b0041ad21e4a7f292"},{url:"assets/js/32.2523a8d2.js",revision:"534c806929377f9aa405b70d70daeed9"},{url:"assets/js/app.3a80f42a.js",revision:"ed5ce4aebba68aa7f151bc7f07c90ad9"},{url:"assets/js/layout-Blog.872fe4b7.js",revision:"9d37428f5ac5ce18d1029cfecf499d20"},{url:"assets/js/layout-Layout.0f99aa0c.js",revision:"a0901909a3803a3409db0dd824fea090"},{url:"assets/js/layout-NotFound.7e414c35.js",revision:"0dd465aa8a10a231b6a4dde76da734a9"},{url:"assets/js/layout-Slide.4105128c.js",revision:"22eeb5312c6eda496e47be071a8f11a8"},{url:"assets/js/page-AdditionalFeatures.c33c4324.js",revision:"ba57e299af6268e7691cd54983efc0ff"},{url:"assets/js/page-ContextMenus.36451c7a.js",revision:"b5634a99e59ea6ed0e6cf2f60792cc72"},{url:"assets/js/page-Database.db293e58.js",revision:"53d403405ec537f3ade445b6b9f81a6b"},{url:"assets/js/page-Events.91abcd9d.js",revision:"6cac578b503ac4b23f49411048e8f8f1"},{url:"assets/js/page-Example.ca06e8ce.js",revision:"9e614364cb767a4f9cee687b721157d6"},{url:"assets/js/page-FAQ.ea30f112.js",revision:"9198c84b09c064229d6f5d62d5ff9df5"},{url:"assets/js/page-Home.4c436152.js",revision:"81ef60c76f5f5d87b2630ff8f79efc7d"},{url:"assets/js/page-Inhibitor.3558f2b3.js",revision:"9bf22e8cef223a19d23df4d5f4a38412"},{url:"assets/js/page-InstallingNodejsand@gcommandsvoice.53247d86.js",revision:"e1740c64686e91b13dc4a903bde39cf3"},{url:"assets/js/page-InstallingNodejsandGCommands.ffa59649.js",revision:"01ced08eda286323ea173f95042b8e9c"},{url:"assets/js/page-Introduction.9f8398eb.js",revision:"9f07071606ab8d3e6a25fb21d3c1f059"},{url:"assets/js/page-Makingabasicbot.46eed902.js",revision:"ae975b3bef341847c12fed8661e3f0ea"},{url:"assets/js/page-Mentions.f9674d58.js",revision:"84f69f35259e6dbbbb202508b41144ba"},{url:"assets/js/page-MessageComponents.70ddece1.js",revision:"6e20237074067a480e9b36766552278b"},{url:"assets/js/page-MoreEvents.caa47296.js",revision:"a99c5e104c8b3209cca78f4e0d4ddd9e"},{url:"assets/js/page-SlashCommands.ca197adf.js",revision:"53fdafeef39b49e9b509a55b59bfb7ed"},{url:"assets/js/page-Updatingfromv2tov3.7d356b88.js",revision:"c181853fe4d2352319c2af144b2ab7e3"},{url:"assets/js/page-Updatingfromv3tov4.878becc1.js",revision:"f66b92a23c0b5fb297094219e2ce67af"},{url:"assets/js/page-Updatingfromv4tov5.3f39e7cf.js",revision:"6f566c4dce831456e7af5fc6d9a42c88"},{url:"assets/js/page-Updatingfromv5tov6.0fb282d4.js",revision:"3341ebad32113ad83f0efb1362c261cc"},{url:"assets/js/page-UsingargumentsinCommands.7e31fe8e.js",revision:"6d5be2044153f8f50ab8308fb25282a6"},{url:"assets/js/vendors~layout-Blog~layout-Layout~layout-NotFound.47c8dcfe.js",revision:"c60bdb4fbc981c6c7ae702c37cc02006"},{url:"assets/js/vendors~layout-Blog~layout-Layout~layout-NotFound~layout-Slide.2cf2cb47.js",revision:"cee7413c059f90b02f8a3f7badff5b67"},{url:"assets/js/vendors~layout-Layout.c6ec2d88.js",revision:"fcc1d77091bb158420c9756967a18450"},{url:"assets/js/vendors~photo-swipe.0dc506e3.js",revision:"9b726fc6aa2b5d8b7430aa8d7c4d1d74"},{url:"404.html",revision:"745af74c7485af4502d6f54e25c91687"},{url:"guide/additional/fromv2tov3/index.html",revision:"01e7bf13026062106ddedd645a61fd84"},{url:"guide/additional/fromv3tov4/index.html",revision:"2bc719eaa9f20440b76c94c15a1a85c7"},{url:"guide/additional/fromv4tov5/index.html",revision:"9f16f5d2c61b3a468a660eedcd81ba52"},{url:"guide/additional/fromv5tov6/index.html",revision:"12a33e29627c4c4a8c1ce3c030c9d0e1"},{url:"guide/arguments/usingargsincmd/index.html",revision:"ea63e99ff5f2681a6bb692d1b7da22ae"},{url:"guide/beginner/additionalfeatures/index.html",revision:"2a5e8adc783b08ba2dce0b718101f55b"},{url:"guide/beginner/basicbot/index.html",revision:"d66bcf47f4dee07b5c10ad395616b829"},{url:"guide/beginner/database/index.html",revision:"f362c2e331b275b2a5689906ec29310d"},{url:"guide/beginner/events/index.html",revision:"59459a78a2db72403266dd553e90d34c"},{url:"guide/faq/index.html",revision:"9979a3ed906d2f80fd58bece9424e8d0"},{url:"guide/index.html",revision:"4b80fbc5bd40660d7dd09de9f619c9ed"},{url:"guide/interactions/contextmenus/index.html",revision:"5e8e53ebaa83705a8fac278bfbb6beed"},{url:"guide/interactions/messagecomponents/index.html",revision:"5004bfea41f1e2b2849d2596f4b92628"},{url:"guide/interactions/slashcommands/index.html",revision:"e4dbd54955f520dabc9e52cc7a51d37d"},{url:"guide/miscellaneous/inhibitor/index.html",revision:"82a7f350da7303123b5e0a23deec5d16"},{url:"guide/miscellaneous/mentions/index.html",revision:"0cca9b62e2050ef38a1e63ba2c2103ee"},{url:"guide/miscellaneous/moreevents/index.html",revision:"d6ed3ea71469dce84372d1ce9c505a6c"},{url:"guide/setup/index.html",revision:"f00db7a428eab1fe9ce44fb47f80679c"},{url:"index.html",revision:"d835880b64d5034b2aee57cdb3de2006"},{url:"voice/beginner/example/index.html",revision:"be0fa02639b0500bf7d9d981d7cf094c"},{url:"voice/beginner/faq/index.html",revision:"bcd7ec5857bee241a3eba3dbd7cecd96"},{url:"voice/beginner/setup/index.html",revision:"5b613baf2d362c78868f1f3094ddf17d"},{url:"voice/index.html",revision:"789ba94c4e87c24f9b30d52a2d57fb23"}],{}),e.cleanupOutdatedCaches()}));
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
