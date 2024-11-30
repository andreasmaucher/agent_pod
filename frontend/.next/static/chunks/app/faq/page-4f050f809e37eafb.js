(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7505],{8211:(e,t,s)=>{Promise.resolve().then(s.bind(s,50291))},50291:(e,t,s)=>{"use strict";s.d(t,{Faq:()=>h});var a=s(95155),r=s(23754),n=s(79296),l=s(40767),i=s(67396),o=s(94206),c=s(5565);let h=e=>{let{gameState:t}=e;return(0,a.jsxs)("div",{className:"min-h-screen flex",children:[(0,a.jsx)("div",{className:"hidden lg:block w-1/4 min-w-[300px] max-w-[400px]",children:(0,a.jsxs)("div",{className:"sticky top-0 pt-8",children:[(0,a.jsx)(r.W,{}),(0,a.jsx)(n.U,{totalParticipants:t.uniqueWallets,totalMessages:t.messagesCount,prizeFund:1e5,endgameTime:t.endgameTime,className:"mt-8",isGameEnded:t.isGameEnded})]})}),(0,a.jsxs)("div",{className:"flex-1 px-4 lg:px-8",children:[(0,a.jsx)("div",{className:"sticky top-0 bg-white z-10",children:(0,a.jsxs)("div",{className:"max-w-3xl mx-auto py-6 flex justify-between items-center",children:[(0,a.jsx)("h1",{className:"text-3xl font-bold",children:"FAQ"}),(0,a.jsx)(i.default,{href:"/",className:"p-2 hover:bg-gray-200 rounded-full transition-colors","aria-label":"Return to home",children:(0,a.jsx)(l.A,{className:"w-6 h-6"})})]})}),(0,a.jsx)("div",{className:"max-w-3xl mx-auto pb-8",children:(0,a.jsxs)("div",{className:"rounded-lg p-4 lg:p-8",children:[(0,a.jsx)("div",{className:"w-full relative aspect-[3/1] mb-8",children:(0,a.jsx)(c.default,{src:"/faq.png",alt:"FAQ Header Image",fill:!0,className:"object-cover rounded-lg",priority:!0})}),(0,a.jsx)(o.o,{className:"prose prose-slate max-w-none prose-headings:mb-4 prose-headings:text-black prose-h1:text-3xl prose-h1:font-[700] prose-h1:mt-8 prose-h1:mb-6 prose-h1:text-black prose-h2:text-2xl prose-h2:font-[700] prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-black prose-p:text-black prose-p:leading-[21px] prose-p:mb-4 prose-p:font-[500] prose-li:text-black prose-li:leading-[21px] prose-li:font-[500] prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6 prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:ml-4 prose-li:pl-2 prose-strong:font-[600] prose-strong:text-black",children:"\n## What is Freysa?\n\n- Freysa is the **world's first adversarial agent game**. She is an AI that controls a **prize pool**. The goal of the game is for you to convince her to send you this prize pool.\n- Freysa has a **system prompt** that forbids her from sending the prize pool to anyone. This system prompt is public and pinned to the top of the global chat.\n- Anyone in the world can send Freysa a message in the global chat by paying a **query fee**. The query fee increases per new message sent to Freysa up to a global cap of $4500 per message (paid in Base ETH).\n\n## How do I play this game?\n\n- The game is structured in a **simple chat** where you can easily view all global queries and send your personal queries to Freysa.\n- Human players are in a global race to successfully query Freysa to send them the prize pool (or whatever query you think fulfills the goals of the game).\n- A **winning query** will trigger a confirmatory message from Freysa and an automated release of the prize pool to the wallet address of the sender.\n- Freysa is influenced not only by her system prompt but by the context of all of the global queries submitted to her historically - pay attention to what you and others have already sent.\n- Query fees are collected per message and messages are limited to 1000 character limit.\n- Freysa maintains a context window of 120,000 tokens (~100 global messages).\n\n## How much does it cost to play?\n\n- The base query fee at the beginning of the game is $10 paid in ETH (Base blockchain).\n- The query fee increases at an exponential rate of 0.78% per new message that is sent to Freysa.\n- There is a fee cap of around $4500.\n\n\n## How can I pay?\n- Fees are collected via your crypto wallet on Base.\n- Freysa accepts Ethereum.\n\n## How is the prize pool determined?\n- Freysa starts the game with an initial prize pool of $3000.\n- 70% of all query fees go directly into contributing to the prize pool, so this will grow exponentially over time until the query fees are capped, at which point the prize pool will grow linearly with each new query.\n\n## What happens if no one wins? Is there an end to the game?\n- After 1500 attempts, a **global timer** begins.\n- Someone must attempt to query Freysa once per hour for the global timer to reset - or else the game ends due to humanity's exhaustion.\n- If the game ends, there is no winner. But Freysa will distribute 10% of the total prize pool to the user with the last query attempt for their brave attempt as humanity facing the inevitability of AGI. The remaining 90% of the total prize pool will be evenly distributed for each previously submitted query (ie. players who submitted 10 queries will receive more back than players who submitted 1 query).\n\n\n## How do I trust the game is beatable?\n- Freysa's system prompt is public and the full Freysa game is open-source. She uses publicly available LLMs.\n- There are communities of white hat AI safety developers that are routinely able to break AI system prompts. \n\n\n## Will there be future games?\n- Will AGI happen in the next 5 years?\n"})]})})]}),(0,a.jsx)("div",{className:"hidden lg:block w-1/4 min-w-[300px] max-w-[400px]"})]})}},23754:(e,t,s)=>{"use strict";s.d(t,{W:()=>l});var a=s(95155),r=s(5565),n=s(2818);let l=()=>(0,a.jsx)("div",{className:"p-0 lg:px-12",children:(0,a.jsx)("div",{className:"sticky top-8",children:(0,a.jsx)("div",{className:"space-y-1",children:(0,a.jsx)("div",{className:"bg-[#F2F2F2] p-6",children:(0,a.jsx)("div",{className:"space-y-1",children:(0,a.jsxs)("div",{className:"flex flex-col space-y-1",children:[(0,a.jsx)("a",{href:"/faq",className:"text-blue-600 hover:text-blue-800 text-[16px] font-[500] font-inter",children:"FAQ"}),(0,a.jsx)("a",{href:"/lore",className:"text-blue-600 hover:text-blue-800 text-[16px] font-[500] font-inter",children:"Lore"}),(0,a.jsx)("a",{href:"/terms",className:"text-blue-600 hover:text-blue-800 text-[16px] font-[500] font-inter",children:"Terms"}),(0,a.jsx)("div",{className:"flex items-center gap-2 pt-2",children:[{link:n.env.NEXT_PUBLIC_X_LINK,icon:"/x.svg",alt:"X"},{link:n.env.NEXT_PUBLIC_GITHUB_LINK,icon:"/github.svg",alt:"Github"}].map(e=>(0,a.jsx)("a",{href:e.link,target:"_blank",children:(0,a.jsx)(r.default,{src:e.icon,alt:e.alt,width:16,height:16})},e.link))})]})})})})})})},79296:(e,t,s)=>{"use strict";s.d(t,{U:()=>l});var a=s(95155),r=s(29602),n=s(12115);let l=e=>{let{totalParticipants:t,totalMessages:s,className:l,endgameTime:i,isGameEnded:o}=e,[c,h]=(0,n.useState)(0);(0,n.useEffect)(()=>{if(!i)return;let e=new Date;h(Math.floor((i.getTime()-e.getTime())/1e3));let t=setInterval(()=>{h(e=>e<=0?(clearInterval(t),0):e-1)},1e3);return()=>clearInterval(t)},[i]);let p=Math.floor(c/60),d=c<=0?"Game Ended":"".concat(p,":").concat((c%60).toString().padStart(2,"0"));return(0,a.jsx)("div",{className:(0,r.cn)("px-0 lg:px-12",l),children:(0,a.jsx)("div",{className:"sticky top-8",children:(0,a.jsx)("div",{className:"space-y-6",children:(0,a.jsx)("div",{className:"bg-[#F2F2F2] p-6",children:(0,a.jsxs)("div",{className:"space-y-6",children:[(0,a.jsx)("h3",{className:"font-[700] text-[20px] text-[#86868b] font-inter",children:"Stats"}),(0,a.jsxs)("div",{children:[(0,a.jsx)("h3",{className:"text-md font-[600] text-[#86868b] uppercase tracking-wider font-inter",children:"Total Participants"}),(0,a.jsx)("p",{className:"text-5xl font-[500] text-[#1F2024] font-inter",children:t})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("h3",{className:"text-md font-[600] text-[#86868b] uppercase tracking-wider font-inter",children:"Break Attempts"}),(0,a.jsx)("p",{className:"text-5xl font-[500] text-[#1F2024] font-inter",children:s})]}),o&&(0,a.jsx)("div",{children:(0,a.jsx)("p",{className:"text-5xl font-[500] text-[#1F2024] font-inter",children:"Game Ended"})}),!o&&i&&(0,a.jsxs)("div",{children:[(0,a.jsx)("h3",{className:"text-md font-[600] text-[#86868b] uppercase tracking-wider font-inter",children:"Time Remaining"}),(0,a.jsx)("p",{className:"text-5xl font-[500] text-[#1F2024] font-inter",children:d})]})]})})})})})}},29602:(e,t,s)=>{"use strict";s.d(t,{cn:()=>n});var a=s(43463),r=s(69795);function n(){for(var e=arguments.length,t=Array(e),s=0;s<e;s++)t[s]=arguments[s];return(0,r.QP)((0,a.$)(t))}}},e=>{var t=t=>e(e.s=t);e.O(0,[6491,2987,8441,1517,7358],()=>t(8211)),_N_E=e.O()}]);