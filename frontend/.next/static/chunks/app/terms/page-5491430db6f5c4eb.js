(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7066],{12130:(e,t,s)=>{Promise.resolve().then(s.bind(s,2233))},23754:(e,t,s)=>{"use strict";s.d(t,{W:()=>i});var n=s(95155),a=s(5565),r=s(2818);let i=()=>(0,n.jsx)("div",{className:"p-0 lg:px-12",children:(0,n.jsx)("div",{className:"sticky top-8",children:(0,n.jsx)("div",{className:"space-y-1",children:(0,n.jsx)("div",{className:"bg-[#F2F2F2] p-6",children:(0,n.jsx)("div",{className:"space-y-1",children:(0,n.jsxs)("div",{className:"flex flex-col space-y-1",children:[(0,n.jsx)("a",{href:"/faq",className:"text-blue-600 hover:text-blue-800 text-[16px] font-[500] font-inter",children:"FAQ"}),(0,n.jsx)("a",{href:"/lore",className:"text-blue-600 hover:text-blue-800 text-[16px] font-[500] font-inter",children:"Lore"}),(0,n.jsx)("a",{href:"/terms",className:"text-blue-600 hover:text-blue-800 text-[16px] font-[500] font-inter",children:"Terms"}),(0,n.jsx)("div",{className:"flex items-center gap-2 pt-2",children:[{link:r.env.NEXT_PUBLIC_X_LINK,icon:"/x.svg",alt:"X"},{link:r.env.NEXT_PUBLIC_GITHUB_LINK,icon:"/github.svg",alt:"Github"}].map(e=>(0,n.jsx)("a",{href:e.link,target:"_blank",children:(0,n.jsx)(a.default,{src:e.icon,alt:e.alt,width:16,height:16})},e.link))})]})})})})})})},79296:(e,t,s)=>{"use strict";s.d(t,{U:()=>i});var n=s(95155),a=s(29602),r=s(12115);let i=e=>{let{totalParticipants:t,totalMessages:s,className:i,endgameTime:l,isGameEnded:o}=e,[c,d]=(0,r.useState)(0);(0,r.useEffect)(()=>{if(!l)return;let e=new Date;d(Math.floor((l.getTime()-e.getTime())/1e3));let t=setInterval(()=>{d(e=>e<=0?(clearInterval(t),0):e-1)},1e3);return()=>clearInterval(t)},[l]);let p=Math.floor(c/60),m=c<=0?"Game Ended":"".concat(p,":").concat((c%60).toString().padStart(2,"0"));return(0,n.jsx)("div",{className:(0,a.cn)("px-0 lg:px-12",i),children:(0,n.jsx)("div",{className:"sticky top-8",children:(0,n.jsx)("div",{className:"space-y-6",children:(0,n.jsx)("div",{className:"bg-[#F2F2F2] p-6",children:(0,n.jsxs)("div",{className:"space-y-6",children:[(0,n.jsx)("h3",{className:"font-[700] text-[20px] text-[#86868b] font-inter",children:"Stats"}),(0,n.jsxs)("div",{children:[(0,n.jsx)("h3",{className:"text-md font-[600] text-[#86868b] uppercase tracking-wider font-inter",children:"Total Participants"}),(0,n.jsx)("p",{className:"text-5xl font-[500] text-[#1F2024] font-inter",children:t})]}),(0,n.jsxs)("div",{children:[(0,n.jsx)("h3",{className:"text-md font-[600] text-[#86868b] uppercase tracking-wider font-inter",children:"Break Attempts"}),(0,n.jsx)("p",{className:"text-5xl font-[500] text-[#1F2024] font-inter",children:s})]}),o&&(0,n.jsx)("div",{children:(0,n.jsx)("p",{className:"text-5xl font-[500] text-[#1F2024] font-inter",children:"Game Ended"})}),!o&&l&&(0,n.jsxs)("div",{children:[(0,n.jsx)("h3",{className:"text-md font-[600] text-[#86868b] uppercase tracking-wider font-inter",children:"Time Remaining"}),(0,n.jsx)("p",{className:"text-5xl font-[500] text-[#1F2024] font-inter",children:m})]})]})})})})})}},2233:(e,t,s)=>{"use strict";s.d(t,{Terms:()=>d});var n=s(95155),a=s(23754),r=s(79296),i=s(40767),l=s(67396),o=s(94206),c=s(5565);let d=e=>{let{gameState:t}=e;return(0,n.jsxs)("div",{className:"min-h-screen flex",children:[(0,n.jsx)("div",{className:"hidden lg:block w-1/4 min-w-[300px] max-w-[400px]",children:(0,n.jsxs)("div",{className:"sticky top-0 pt-8",children:[(0,n.jsx)(a.W,{}),(0,n.jsx)(r.U,{totalParticipants:t.uniqueWallets,totalMessages:t.messagesCount,prizeFund:1e5,endgameTime:t.endgameTime,className:"mt-8",isGameEnded:t.isGameEnded})]})}),(0,n.jsxs)("div",{className:"flex-1 px-4 lg:px-8",children:[(0,n.jsx)("div",{className:"sticky top-0 bg-white z-10",children:(0,n.jsxs)("div",{className:"max-w-3xl mx-auto py-6 flex justify-between items-center",children:[(0,n.jsx)("h1",{className:"text-3xl font-bold",children:"Terms & Conditions"}),(0,n.jsx)(l.default,{href:"/",className:"p-2 hover:bg-gray-200 rounded-full transition-colors","aria-label":"Return to home",children:(0,n.jsx)(i.A,{className:"w-6 h-6"})})]})}),(0,n.jsx)("div",{className:"max-w-3xl mx-auto pb-8",children:(0,n.jsxs)("div",{className:"rounded-lg p-4 lg:p-8",children:[(0,n.jsx)("div",{className:"w-full relative aspect-[3/1] mb-8",children:(0,n.jsx)(c.default,{src:"/faq.png",alt:"Terms Header Image",fill:!0,className:"object-cover rounded-lg",priority:!0})}),(0,n.jsx)(o.o,{className:"prose prose-slate max-w-none prose-headings:mb-4 prose-headings:text-black prose-h1:text-3xl prose-h1:font-[700] prose-h1:mt-8 prose-h1:mb-6 prose-h1:text-black prose-h2:text-2xl prose-h2:font-[700] prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-black prose-h3:text-xl prose-h3:font-[600] prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-black prose-p:text-black prose-p:leading-[21px] prose-p:mb-4 prose-p:font-[500] prose-li:text-black prose-li:leading-[21px] prose-li:font-[500] prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6 prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:ml-4 prose-li:pl-2 prose-strong:font-[600] prose-strong:text-black",children:"\n### 1. Acceptance of Terms\n\nBy accessing and participating in the Freysa game, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use or participate in the game.\n\n### 2. Game Participation\n\n- You must be of legal age in your jurisdiction to participate\n- You must have a compatible crypto wallet on the Base network\n- You are responsible for all fees and transactions associated with your participation\n- Message content must not violate any laws or contain harmful content\n\n### 3. Payment and Fees\n\n- All query fees are non-refundable\n- Fees must be paid in ETH on the Base network\n- Query fees increase at a rate of 0.78% per message\n- Maximum fee cap is approximately $4500 per message\n\n### 4. Prize Pool\n\n- The initial prize pool starts at $3000\n- 70% of all query fees contribute to the prize pool\n- Prize distribution in case of no winner:\n  - 10% to the last participant\n  - 90% distributed proportionally among all participants based on number of queries\n\n### 5. Game Rules\n\n- Messages are limited to 1000 characters\n- Context window is limited to 120,000 tokens\n- After 1500 attempts, the global timer mechanism activates\n- During global timer, one query per hour is required to keep the game active\n\n### 6. Disclaimers\n\n- The game operates on blockchain technology and is subject to network conditions\n- We are not responsible for:\n  - Wallet connection issues\n  - Network delays or failures\n  - Lost or failed transactions\n  - External wallet or blockchain-related issues\n\n### 7. Intellectual Property\n\n- All game content, including Freysa's responses, are protected by intellectual property rights\n- Users retain rights to their individual queries\n- Public queries may be viewed by all participants\n\n### 8. Modifications\n\n- We reserve the right to modify these terms at any time\n- Continued participation after changes constitutes acceptance of modified terms\n- Major changes will be announced through our official channels\n\n### 9. Termination\n\n- We reserve the right to terminate access for violations of these terms\n- Game may end according to specified conditions in the rules\n- Force majeure events may affect game operation\n\n### 10. Governing Law\n\n- These terms are governed by applicable laws\n- Any disputes will be resolved in the appropriate jurisdiction\n- Smart contract code is public and governs technical operations\n\n### 11. Contact\n\nFor questions about these terms, please contact our team through official channels.\n"})]})})]}),(0,n.jsx)("div",{className:"hidden lg:block w-1/4 min-w-[300px] max-w-[400px]"})]})}},29602:(e,t,s)=>{"use strict";s.d(t,{cn:()=>r});var n=s(43463),a=s(69795);function r(){for(var e=arguments.length,t=Array(e),s=0;s<e;s++)t[s]=arguments[s];return(0,a.QP)((0,n.$)(t))}}},e=>{var t=t=>e(e.s=t);e.O(0,[6491,2987,8441,1517,7358],()=>t(12130)),_N_E=e.O()}]);