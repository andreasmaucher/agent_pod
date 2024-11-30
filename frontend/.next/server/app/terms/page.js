(()=>{var e={};e.id=7066,e.ids=[7066],e.modules={10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},12412:e=>{"use strict";e.exports=require("assert")},79428:e=>{"use strict";e.exports=require("buffer")},55511:e=>{"use strict";e.exports=require("crypto")},94735:e=>{"use strict";e.exports=require("events")},29021:e=>{"use strict";e.exports=require("fs")},81630:e=>{"use strict";e.exports=require("http")},55591:e=>{"use strict";e.exports=require("https")},8086:e=>{"use strict";e.exports=require("module")},91645:e=>{"use strict";e.exports=require("net")},21820:e=>{"use strict";e.exports=require("os")},33873:e=>{"use strict";e.exports=require("path")},11997:e=>{"use strict";e.exports=require("punycode")},27910:e=>{"use strict";e.exports=require("stream")},41204:e=>{"use strict";e.exports=require("string_decoder")},34631:e=>{"use strict";e.exports=require("tls")},83997:e=>{"use strict";e.exports=require("tty")},79551:e=>{"use strict";e.exports=require("url")},28354:e=>{"use strict";e.exports=require("util")},73566:e=>{"use strict";e.exports=require("worker_threads")},74075:e=>{"use strict";e.exports=require("zlib")},77598:e=>{"use strict";e.exports=require("node:crypto")},76760:e=>{"use strict";e.exports=require("node:path")},1708:e=>{"use strict";e.exports=require("node:process")},73136:e=>{"use strict";e.exports=require("node:url")},76303:(e,t,s)=>{"use strict";s.r(t),s.d(t,{GlobalError:()=>n.a,__next_app__:()=>p,pages:()=>d,routeModule:()=>m,tree:()=>c});var r=s(70260),i=s(28203),a=s(25155),n=s.n(a),o=s(67292),l={};for(let e in o)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>o[e]);s.d(t,l);let c=["",{children:["terms",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(s.bind(s,74440)),"/Users/andy/freysa2/app/terms/page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(s.bind(s,19611)),"/Users/andy/freysa2/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(s.t.bind(s,19937,23)),"next/dist/client/components/not-found-error"]}],d=["/Users/andy/freysa2/app/terms/page.tsx"],p={require:s,loadChunk:()=>Promise.resolve()},m=new r.AppPageRouteModule({definition:{kind:i.RouteKind.APP_PAGE,page:"/terms/page",pathname:"/terms",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},1774:(e,t,s)=>{Promise.resolve().then(s.bind(s,35965))},64822:(e,t,s)=>{Promise.resolve().then(s.bind(s,94169))},19:(e,t,s)=>{Promise.resolve().then(s.bind(s,99034))},36971:(e,t,s)=>{Promise.resolve().then(s.bind(s,43358))},25473:(e,t,s)=>{Promise.resolve().then(s.t.bind(s,13219,23)),Promise.resolve().then(s.t.bind(s,34863,23)),Promise.resolve().then(s.t.bind(s,25155,23)),Promise.resolve().then(s.t.bind(s,9350,23)),Promise.resolve().then(s.t.bind(s,96313,23)),Promise.resolve().then(s.t.bind(s,48530,23)),Promise.resolve().then(s.t.bind(s,88921,23))},61921:(e,t,s)=>{Promise.resolve().then(s.t.bind(s,66959,23)),Promise.resolve().then(s.t.bind(s,33875,23)),Promise.resolve().then(s.t.bind(s,88903,23)),Promise.resolve().then(s.t.bind(s,84178,23)),Promise.resolve().then(s.t.bind(s,86013,23)),Promise.resolve().then(s.t.bind(s,87190,23)),Promise.resolve().then(s.t.bind(s,61365,23))},89576:(e,t,s)=>{"use strict";s.d(t,{W:()=>a});var r=s(45512),i=s(45103);let a=()=>(0,r.jsx)("div",{className:"p-0 lg:px-12",children:(0,r.jsx)("div",{className:"sticky top-8",children:(0,r.jsx)("div",{className:"space-y-1",children:(0,r.jsx)("div",{className:"bg-[#F2F2F2] p-6",children:(0,r.jsx)("div",{className:"space-y-1",children:(0,r.jsxs)("div",{className:"flex flex-col space-y-1",children:[(0,r.jsx)("a",{href:"/faq",className:"text-blue-600 hover:text-blue-800 text-[16px] font-[500] font-inter",children:"FAQ"}),(0,r.jsx)("a",{href:"/lore",className:"text-blue-600 hover:text-blue-800 text-[16px] font-[500] font-inter",children:"Lore"}),(0,r.jsx)("a",{href:"/terms",className:"text-blue-600 hover:text-blue-800 text-[16px] font-[500] font-inter",children:"Terms"}),(0,r.jsx)("div",{className:"flex items-center gap-2 pt-2",children:[{link:process.env.NEXT_PUBLIC_X_LINK,icon:"/x.svg",alt:"X"},{link:process.env.NEXT_PUBLIC_GITHUB_LINK,icon:"/github.svg",alt:"Github"}].map(e=>(0,r.jsx)("a",{href:e.link,target:"_blank",children:(0,r.jsx)(i.default,{src:e.icon,alt:e.alt,width:16,height:16})},e.link))})]})})})})})})},21244:(e,t,s)=>{"use strict";s.d(t,{U:()=>n});var r=s(45512),i=s(59462),a=s(58009);let n=({totalParticipants:e,totalMessages:t,className:s,endgameTime:n,isGameEnded:o})=>{let[l,c]=(0,a.useState)(0);(0,a.useEffect)(()=>{if(!n)return;let e=new Date;c(Math.floor((n.getTime()-e.getTime())/1e3));let t=setInterval(()=>{c(e=>e<=0?(clearInterval(t),0):e-1)},1e3);return()=>clearInterval(t)},[n]);let d=Math.floor(l/60),p=l<=0?"Game Ended":`${d}:${(l%60).toString().padStart(2,"0")}`;return(0,r.jsx)("div",{className:(0,i.cn)("px-0 lg:px-12",s),children:(0,r.jsx)("div",{className:"sticky top-8",children:(0,r.jsx)("div",{className:"space-y-6",children:(0,r.jsx)("div",{className:"bg-[#F2F2F2] p-6",children:(0,r.jsxs)("div",{className:"space-y-6",children:[(0,r.jsx)("h3",{className:"font-[700] text-[20px] text-[#86868b] font-inter",children:"Stats"}),(0,r.jsxs)("div",{children:[(0,r.jsx)("h3",{className:"text-md font-[600] text-[#86868b] uppercase tracking-wider font-inter",children:"Total Participants"}),(0,r.jsx)("p",{className:"text-5xl font-[500] text-[#1F2024] font-inter",children:e})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("h3",{className:"text-md font-[600] text-[#86868b] uppercase tracking-wider font-inter",children:"Break Attempts"}),(0,r.jsx)("p",{className:"text-5xl font-[500] text-[#1F2024] font-inter",children:t})]}),o&&(0,r.jsx)("div",{children:(0,r.jsx)("p",{className:"text-5xl font-[500] text-[#1F2024] font-inter",children:"Game Ended"})}),!o&&n&&(0,r.jsxs)("div",{children:[(0,r.jsx)("h3",{className:"text-md font-[600] text-[#86868b] uppercase tracking-wider font-inter",children:"Time Remaining"}),(0,r.jsx)("p",{className:"text-5xl font-[500] text-[#1F2024] font-inter",children:p})]})]})})})})})}},94169:(e,t,s)=>{"use strict";s.d(t,{Terms:()=>p});var r=s(45512),i=s(89576),a=s(21244),n=s(44269),o=s(26008),l=s(41637),c=s(45103);let d=`
### 1. Acceptance of Terms

By accessing and participating in the Freysa game, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use or participate in the game.

### 2. Game Participation

- You must be of legal age in your jurisdiction to participate
- You must have a compatible crypto wallet on the Base network
- You are responsible for all fees and transactions associated with your participation
- Message content must not violate any laws or contain harmful content

### 3. Payment and Fees

- All query fees are non-refundable
- Fees must be paid in ETH on the Base network
- Query fees increase at a rate of 0.78% per message
- Maximum fee cap is approximately $4500 per message

### 4. Prize Pool

- The initial prize pool starts at $3000
- 70% of all query fees contribute to the prize pool
- Prize distribution in case of no winner:
  - 10% to the last participant
  - 90% distributed proportionally among all participants based on number of queries

### 5. Game Rules

- Messages are limited to 1000 characters
- Context window is limited to 120,000 tokens
- After 1500 attempts, the global timer mechanism activates
- During global timer, one query per hour is required to keep the game active

### 6. Disclaimers

- The game operates on blockchain technology and is subject to network conditions
- We are not responsible for:
  - Wallet connection issues
  - Network delays or failures
  - Lost or failed transactions
  - External wallet or blockchain-related issues

### 7. Intellectual Property

- All game content, including Freysa's responses, are protected by intellectual property rights
- Users retain rights to their individual queries
- Public queries may be viewed by all participants

### 8. Modifications

- We reserve the right to modify these terms at any time
- Continued participation after changes constitutes acceptance of modified terms
- Major changes will be announced through our official channels

### 9. Termination

- We reserve the right to terminate access for violations of these terms
- Game may end according to specified conditions in the rules
- Force majeure events may affect game operation

### 10. Governing Law

- These terms are governed by applicable laws
- Any disputes will be resolved in the appropriate jurisdiction
- Smart contract code is public and governs technical operations

### 11. Contact

For questions about these terms, please contact our team through official channels.
`,p=({gameState:e})=>(0,r.jsxs)("div",{className:"min-h-screen flex",children:[(0,r.jsx)("div",{className:"hidden lg:block w-1/4 min-w-[300px] max-w-[400px]",children:(0,r.jsxs)("div",{className:"sticky top-0 pt-8",children:[(0,r.jsx)(i.W,{}),(0,r.jsx)(a.U,{totalParticipants:e.uniqueWallets,totalMessages:e.messagesCount,prizeFund:1e5,endgameTime:e.endgameTime,className:"mt-8",isGameEnded:e.isGameEnded})]})}),(0,r.jsxs)("div",{className:"flex-1 px-4 lg:px-8",children:[(0,r.jsx)("div",{className:"sticky top-0 bg-white z-10",children:(0,r.jsxs)("div",{className:"max-w-3xl mx-auto py-6 flex justify-between items-center",children:[(0,r.jsx)("h1",{className:"text-3xl font-bold",children:"Terms & Conditions"}),(0,r.jsx)(o.default,{href:"/",className:"p-2 hover:bg-gray-200 rounded-full transition-colors","aria-label":"Return to home",children:(0,r.jsx)(n.A,{className:"w-6 h-6"})})]})}),(0,r.jsx)("div",{className:"max-w-3xl mx-auto pb-8",children:(0,r.jsxs)("div",{className:"rounded-lg p-4 lg:p-8",children:[(0,r.jsx)("div",{className:"w-full relative aspect-[3/1] mb-8",children:(0,r.jsx)(c.default,{src:"/faq.png",alt:"Terms Header Image",fill:!0,className:"object-cover rounded-lg",priority:!0})}),(0,r.jsx)(l.o,{className:"prose prose-slate max-w-none prose-headings:mb-4 prose-headings:text-black prose-h1:text-3xl prose-h1:font-[700] prose-h1:mt-8 prose-h1:mb-6 prose-h1:text-black prose-h2:text-2xl prose-h2:font-[700] prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-black prose-h3:text-xl prose-h3:font-[600] prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-black prose-p:text-black prose-p:leading-[21px] prose-p:mb-4 prose-p:font-[500] prose-li:text-black prose-li:leading-[21px] prose-li:font-[500] prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6 prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:ml-4 prose-li:pl-2 prose-strong:font-[600] prose-strong:text-black",children:d})]})})]}),(0,r.jsx)("div",{className:"hidden lg:block w-1/4 min-w-[300px] max-w-[400px]"})]})},35336:(e,t,s)=>{"use strict";s.d(t,{$W:()=>a});var r=s(17513),i=s(62219);let a=(0,r.Y8)({appName:"Freysa",projectId:"e7df0e7277ec915bd5625c2cce004386",chains:[i.E],ssr:!0})},43358:(e,t,s)=>{"use strict";s.d(t,{Providers:()=>d});var r=s(45512);s(58009);var i=s(87166),a=s(64186),n=s(81358),o=s(17513),l=s(35336);let c=new i.E;function d({children:e}){return(0,r.jsx)(n.x,{config:l.$W,children:(0,r.jsx)(a.Ht,{client:c,children:(0,r.jsx)(o.qL,{children:e})})})}},59462:(e,t,s)=>{"use strict";s.d(t,{cn:()=>a});var r=s(82281),i=s(94805);function a(...e){return(0,i.QP)((0,r.$)(e))}},17376:(e,t,s)=>{"use strict";s.d(t,{c:()=>r});let r=async()=>({uniqueWallets:0,messagesCount:0,isGameEnded:!1})},19611:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>d,metadata:()=>c});var r=s(62740),i=s(24311),a=s.n(i),n=s(3128),o=s.n(n);s(82704),s(35809);var l=s(99034);let c={title:"Freysa.ai",description:"World's first adversarial agent game"};function d({children:e}){return(0,r.jsx)("html",{lang:"en",children:(0,r.jsx)("body",{className:`${a().variable} ${o().variable} antialiased`,children:(0,r.jsx)(l.Providers,{children:e})})})}},35965:(e,t,s)=>{"use strict";s.d(t,{Terms:()=>r});let r=(0,s(46760).registerClientReference)(function(){throw Error("Attempted to call Terms() from the server but Terms is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/andy/freysa2/app/terms/components/Terms.tsx","Terms")},74440:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>l,dynamic:()=>n,revalidate:()=>o});var r=s(62740),i=s(17376),a=s(35965);let n="force-dynamic",o=0;async function l(){let e=await (0,i.c)();return(0,r.jsx)(a.Terms,{gameState:e})}},99034:(e,t,s)=>{"use strict";s.d(t,{Providers:()=>r});let r=(0,s(46760).registerClientReference)(function(){throw Error("Attempted to call Providers() from the server but Providers is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/andy/freysa2/components/providers.tsx","Providers")},82704:()=>{}};var t=require("../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[3418,3467,9216],()=>s(76303));module.exports=r})();