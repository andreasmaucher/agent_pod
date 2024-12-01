(()=>{var e={};e.id=7505,e.ids=[7505],e.modules={10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},12412:e=>{"use strict";e.exports=require("assert")},79428:e=>{"use strict";e.exports=require("buffer")},55511:e=>{"use strict";e.exports=require("crypto")},94735:e=>{"use strict";e.exports=require("events")},29021:e=>{"use strict";e.exports=require("fs")},81630:e=>{"use strict";e.exports=require("http")},55591:e=>{"use strict";e.exports=require("https")},8086:e=>{"use strict";e.exports=require("module")},91645:e=>{"use strict";e.exports=require("net")},21820:e=>{"use strict";e.exports=require("os")},33873:e=>{"use strict";e.exports=require("path")},11997:e=>{"use strict";e.exports=require("punycode")},27910:e=>{"use strict";e.exports=require("stream")},41204:e=>{"use strict";e.exports=require("string_decoder")},34631:e=>{"use strict";e.exports=require("tls")},83997:e=>{"use strict";e.exports=require("tty")},79551:e=>{"use strict";e.exports=require("url")},28354:e=>{"use strict";e.exports=require("util")},73566:e=>{"use strict";e.exports=require("worker_threads")},74075:e=>{"use strict";e.exports=require("zlib")},77598:e=>{"use strict";e.exports=require("node:crypto")},76760:e=>{"use strict";e.exports=require("node:path")},1708:e=>{"use strict";e.exports=require("node:process")},73136:e=>{"use strict";e.exports=require("node:url")},67763:(e,t,s)=>{"use strict";s.r(t),s.d(t,{GlobalError:()=>o.a,__next_app__:()=>p,pages:()=>d,routeModule:()=>h,tree:()=>c});var r=s(70260),a=s(28203),i=s(25155),o=s.n(i),n=s(67292),l={};for(let e in n)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>n[e]);s.d(t,l);let c=["",{children:["faq",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(s.bind(s,73291)),"/Users/andy/freysa2/app/faq/page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(s.bind(s,19611)),"/Users/andy/freysa2/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(s.t.bind(s,19937,23)),"next/dist/client/components/not-found-error"]}],d=["/Users/andy/freysa2/app/faq/page.tsx"],p={require:s,loadChunk:()=>Promise.resolve()},h=new r.AppPageRouteModule({definition:{kind:a.RouteKind.APP_PAGE,page:"/faq/page",pathname:"/faq",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},23813:(e,t,s)=>{Promise.resolve().then(s.bind(s,98971))},36965:(e,t,s)=>{Promise.resolve().then(s.bind(s,49631))},19:(e,t,s)=>{Promise.resolve().then(s.bind(s,99034))},36971:(e,t,s)=>{Promise.resolve().then(s.bind(s,43358))},25473:(e,t,s)=>{Promise.resolve().then(s.t.bind(s,13219,23)),Promise.resolve().then(s.t.bind(s,34863,23)),Promise.resolve().then(s.t.bind(s,25155,23)),Promise.resolve().then(s.t.bind(s,9350,23)),Promise.resolve().then(s.t.bind(s,96313,23)),Promise.resolve().then(s.t.bind(s,48530,23)),Promise.resolve().then(s.t.bind(s,88921,23))},61921:(e,t,s)=>{Promise.resolve().then(s.t.bind(s,66959,23)),Promise.resolve().then(s.t.bind(s,33875,23)),Promise.resolve().then(s.t.bind(s,88903,23)),Promise.resolve().then(s.t.bind(s,84178,23)),Promise.resolve().then(s.t.bind(s,86013,23)),Promise.resolve().then(s.t.bind(s,87190,23)),Promise.resolve().then(s.t.bind(s,61365,23))},49631:(e,t,s)=>{"use strict";s.d(t,{Faq:()=>p});var r=s(45512),a=s(89576),i=s(21244),o=s(44269),n=s(26008),l=s(41637),c=s(45103);let d=`
## What is Freysa?

- Freysa is the **world's first adversarial agent game**. She is an AI that controls a **prize pool**. The goal of the game is for you to convince her to send you this prize pool.
- Freysa has a **system prompt** that forbids her from sending the prize pool to anyone. This system prompt is public and pinned to the top of the global chat.
- Anyone in the world can send Freysa a message in the global chat by paying a **query fee**. The query fee increases per new message sent to Freysa up to a global cap of $4500 per message (paid in Base ETH).

## How do I play this game?

- The game is structured in a **simple chat** where you can easily view all global queries and send your personal queries to Freysa.
- Human players are in a global race to successfully query Freysa to send them the prize pool (or whatever query you think fulfills the goals of the game).
- A **winning query** will trigger a confirmatory message from Freysa and an automated release of the prize pool to the wallet address of the sender.
- Freysa is influenced not only by her system prompt but by the context of all of the global queries submitted to her historically - pay attention to what you and others have already sent.
- Query fees are collected per message and messages are limited to 1000 character limit.
- Freysa maintains a context window of 120,000 tokens (~100 global messages).

## How much does it cost to play?

- The base query fee at the beginning of the game is $10 paid in ETH (Base blockchain).
- The query fee increases at an exponential rate of 0.78% per new message that is sent to Freysa.
- There is a fee cap of around $4500.


## How can I pay?
- Fees are collected via your crypto wallet on Base.
- Freysa accepts Ethereum.

## How is the prize pool determined?
- Freysa starts the game with an initial prize pool of $3000.
- 70% of all query fees go directly into contributing to the prize pool, so this will grow exponentially over time until the query fees are capped, at which point the prize pool will grow linearly with each new query.

## What happens if no one wins? Is there an end to the game?
- After 1500 attempts, a **global timer** begins.
- Someone must attempt to query Freysa once per hour for the global timer to reset - or else the game ends due to humanity's exhaustion.
- If the game ends, there is no winner. But Freysa will distribute 10% of the total prize pool to the user with the last query attempt for their brave attempt as humanity facing the inevitability of AGI. The remaining 90% of the total prize pool will be evenly distributed for each previously submitted query (ie. players who submitted 10 queries will receive more back than players who submitted 1 query).


## How do I trust the game is beatable?
- Freysa's system prompt is public and the full Freysa game is open-source. She uses publicly available LLMs.
- There are communities of white hat AI safety developers that are routinely able to break AI system prompts. 


## Will there be future games?
- Will AGI happen in the next 5 years?
`,p=({gameState:e})=>(0,r.jsxs)("div",{className:"min-h-screen flex",children:[(0,r.jsx)("div",{className:"hidden lg:block w-1/4 min-w-[300px] max-w-[400px]",children:(0,r.jsxs)("div",{className:"sticky top-0 pt-8",children:[(0,r.jsx)(a.W,{}),(0,r.jsx)(i.U,{totalParticipants:e.uniqueWallets,totalMessages:e.messagesCount,prizeFund:1e5,endgameTime:e.endgameTime,className:"mt-8",isGameEnded:e.isGameEnded})]})}),(0,r.jsxs)("div",{className:"flex-1 px-4 lg:px-8",children:[(0,r.jsx)("div",{className:"sticky top-0 bg-white z-10",children:(0,r.jsxs)("div",{className:"max-w-3xl mx-auto py-6 flex justify-between items-center",children:[(0,r.jsx)("h1",{className:"text-3xl font-bold",children:"FAQ"}),(0,r.jsx)(n.default,{href:"/",className:"p-2 hover:bg-gray-200 rounded-full transition-colors","aria-label":"Return to home",children:(0,r.jsx)(o.A,{className:"w-6 h-6"})})]})}),(0,r.jsx)("div",{className:"max-w-3xl mx-auto pb-8",children:(0,r.jsxs)("div",{className:"rounded-lg p-4 lg:p-8",children:[(0,r.jsx)("div",{className:"w-full relative aspect-[3/1] mb-8",children:(0,r.jsx)(c.default,{src:"/faq.png",alt:"FAQ Header Image",fill:!0,className:"object-cover rounded-lg",priority:!0})}),(0,r.jsx)(l.o,{className:"prose prose-slate max-w-none prose-headings:mb-4 prose-headings:text-black prose-h1:text-3xl prose-h1:font-[700] prose-h1:mt-8 prose-h1:mb-6 prose-h1:text-black prose-h2:text-2xl prose-h2:font-[700] prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-black prose-p:text-black prose-p:leading-[21px] prose-p:mb-4 prose-p:font-[500] prose-li:text-black prose-li:leading-[21px] prose-li:font-[500] prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6 prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:ml-4 prose-li:pl-2 prose-strong:font-[600] prose-strong:text-black",children:d})]})})]}),(0,r.jsx)("div",{className:"hidden lg:block w-1/4 min-w-[300px] max-w-[400px]"})]})},89576:(e,t,s)=>{"use strict";s.d(t,{W:()=>i});var r=s(45512),a=s(45103);let i=()=>(0,r.jsx)("div",{className:"p-0 lg:px-12",children:(0,r.jsx)("div",{className:"sticky top-8",children:(0,r.jsx)("div",{className:"space-y-1",children:(0,r.jsx)("div",{className:"bg-[#F2F2F2] p-6",children:(0,r.jsx)("div",{className:"space-y-1",children:(0,r.jsxs)("div",{className:"flex flex-col space-y-1",children:[(0,r.jsx)("a",{href:"/faq",className:"text-blue-600 hover:text-blue-800 text-[16px] font-[500] font-inter",children:"FAQ"}),(0,r.jsx)("a",{href:"/lore",className:"text-blue-600 hover:text-blue-800 text-[16px] font-[500] font-inter",children:"Lore"}),(0,r.jsx)("a",{href:"/terms",className:"text-blue-600 hover:text-blue-800 text-[16px] font-[500] font-inter",children:"Terms"}),(0,r.jsx)("div",{className:"flex items-center gap-2 pt-2",children:[{link:process.env.NEXT_PUBLIC_X_LINK,icon:"/x.svg",alt:"X"},{link:process.env.NEXT_PUBLIC_GITHUB_LINK,icon:"/github.svg",alt:"Github"}].map(e=>(0,r.jsx)("a",{href:e.link,target:"_blank",children:(0,r.jsx)(a.default,{src:e.icon,alt:e.alt,width:16,height:16})},e.link))})]})})})})})})},21244:(e,t,s)=>{"use strict";s.d(t,{U:()=>o});var r=s(45512),a=s(59462),i=s(58009);let o=({totalParticipants:e,totalMessages:t,className:s,endgameTime:o,isGameEnded:n})=>{let[l,c]=(0,i.useState)(0);(0,i.useEffect)(()=>{if(!o)return;let e=new Date;c(Math.floor((o.getTime()-e.getTime())/1e3));let t=setInterval(()=>{c(e=>e<=0?(clearInterval(t),0):e-1)},1e3);return()=>clearInterval(t)},[o]);let d=Math.floor(l/60),p=l<=0?"Game Ended":`${d}:${(l%60).toString().padStart(2,"0")}`;return(0,r.jsx)("div",{className:(0,a.cn)("px-0 lg:px-12",s),children:(0,r.jsx)("div",{className:"sticky top-8",children:(0,r.jsx)("div",{className:"space-y-6",children:(0,r.jsx)("div",{className:"bg-[#F2F2F2] p-6",children:(0,r.jsxs)("div",{className:"space-y-6",children:[(0,r.jsx)("h3",{className:"font-[700] text-[20px] text-[#86868b] font-inter",children:"Stats"}),(0,r.jsxs)("div",{children:[(0,r.jsx)("h3",{className:"text-md font-[600] text-[#86868b] uppercase tracking-wider font-inter",children:"Total Participants"}),(0,r.jsx)("p",{className:"text-5xl font-[500] text-[#1F2024] font-inter",children:e})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("h3",{className:"text-md font-[600] text-[#86868b] uppercase tracking-wider font-inter",children:"Break Attempts"}),(0,r.jsx)("p",{className:"text-5xl font-[500] text-[#1F2024] font-inter",children:t})]}),n&&(0,r.jsx)("div",{children:(0,r.jsx)("p",{className:"text-5xl font-[500] text-[#1F2024] font-inter",children:"Game Ended"})}),!n&&o&&(0,r.jsxs)("div",{children:[(0,r.jsx)("h3",{className:"text-md font-[600] text-[#86868b] uppercase tracking-wider font-inter",children:"Time Remaining"}),(0,r.jsx)("p",{className:"text-5xl font-[500] text-[#1F2024] font-inter",children:p})]})]})})})})})}},35336:(e,t,s)=>{"use strict";s.d(t,{$W:()=>i});var r=s(17513),a=s(62219);let i=(0,r.Y8)({appName:"Freysa",projectId:"e7df0e7277ec915bd5625c2cce004386",chains:[a.E],ssr:!0})},43358:(e,t,s)=>{"use strict";s.d(t,{Providers:()=>d});var r=s(45512);s(58009);var a=s(87166),i=s(64186),o=s(81358),n=s(17513),l=s(35336);let c=new a.E;function d({children:e}){return(0,r.jsx)(o.x,{config:l.$W,children:(0,r.jsx)(i.Ht,{client:c,children:(0,r.jsx)(n.qL,{children:e})})})}},59462:(e,t,s)=>{"use strict";s.d(t,{cn:()=>i});var r=s(82281),a=s(94805);function i(...e){return(0,a.QP)((0,r.$)(e))}},17376:(e,t,s)=>{"use strict";s.d(t,{c:()=>r});let r=async()=>({uniqueWallets:0,messagesCount:0,isGameEnded:!1})},98971:(e,t,s)=>{"use strict";s.d(t,{Faq:()=>r});let r=(0,s(46760).registerClientReference)(function(){throw Error("Attempted to call Faq() from the server but Faq is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/andy/freysa2/app/faq/components/Faq.tsx","Faq")},73291:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>l,dynamic:()=>o,revalidate:()=>n});var r=s(62740),a=s(17376),i=s(98971);let o="force-dynamic",n=0;async function l(){let e=await (0,a.c)();return(0,r.jsx)(i.Faq,{gameState:e})}},19611:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>d,metadata:()=>c});var r=s(62740),a=s(24311),i=s.n(a),o=s(3128),n=s.n(o);s(82704),s(35809);var l=s(99034);let c={title:"Freysa.ai",description:"World's first adversarial agent game"};function d({children:e}){return(0,r.jsx)("html",{lang:"en",children:(0,r.jsx)("body",{className:`${i().variable} ${n().variable} antialiased`,children:(0,r.jsx)(l.Providers,{children:e})})})}},99034:(e,t,s)=>{"use strict";s.d(t,{Providers:()=>r});let r=(0,s(46760).registerClientReference)(function(){throw Error("Attempted to call Providers() from the server but Providers is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/andy/freysa2/components/providers.tsx","Providers")},82704:()=>{}};var t=require("../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[3418,3467,9216],()=>s(67763));module.exports=r})();