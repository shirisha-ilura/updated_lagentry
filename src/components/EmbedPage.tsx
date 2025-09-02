import React from 'react';

const EMBED_CARDS = [
  {
    icon: <svg width="28" height="28" fill="none" stroke="#fff" strokeWidth="2"><rect x="4" y="4" width="20" height="20" rx="4" stroke="#fff" strokeWidth="2"/><rect x="8" y="8" width="12" height="12" rx="2" stroke="#fff" strokeWidth="2"/><rect x="12" y="12" width="4" height="4" rx="1" stroke="#fff" strokeWidth="2"/></svg>, // Website Embed
    title: 'Website Embed (iframe)',
    desc: 'Add this HTML snippet to your website and embed the bot window.',
    code: '<iframe src="https://yourbotdomain.com/embed" width="400" height="6"></iframe>',
    color: 'border-gray-400',
  },
  {
    icon: <svg width="28" height="28" fill="none"><circle cx="14" cy="14" r="13" stroke="#25D366" strokeWidth="2"/><path d="M8 14l4 4 8-8" stroke="#25D366" strokeWidth="2"/></svg>,
    title: 'WhatsApp Chat Link',
    desc: 'Add this HTML snippet to your website and embed the bot window.',
    code: '<iframe src="https://yourbotdomain.com/embed" width="400" height="6"></iframe>',
    color: 'border-green-400',
  },
  {
    icon: <img src="/images/slack-icon.png" alt="Slack" className="w-7 h-7" />, // Slack
    title: 'Slack Integration',
    desc: 'Add your bot to a Slack workspace and connect commands.',
    code: '<iframe src="https://yourbotdomain.com/embed" width="400" height="6"></iframe>',
    color: 'border-[#4A154B]',
  },
  {
    icon: <img src="/images/jira-icon.png" alt="Jira" className="w-7 h-7" />, // Jira
    title: 'Jira Integration',
    desc: 'Add this HTML snippet to your website and embed the bot window.',
    code: '<iframe src="https://yourbotdomain.com/embed" width="400" height="6"></iframe>',
    color: 'border-blue-400',
  },
  {
    icon: <img src="/images/framer-icon.png" alt="Framer" className="w-7 h-7" />, // Framer
    title: 'Framer Integration',
    desc: 'Add this HTML snippet to your website and embed the bot window.',
    code: '<iframe src="https://yourbotdomain.com/embed" width="400" height="6"></iframe>',
    color: 'border-indigo-400',
  },
  {
    icon: <img src="/images/shopify-icon.png" alt="Shopify" className="w-7 h-7" />, // Shopify
    title: 'Shopify Integration',
    desc: 'Add this HTML snippet to your website and embed the bot window.',
    code: '<iframe src="https://yourbotdomain.com/embed" width="400" height="6"></iframe>',
    color: 'border-green-400',
  },
];

export default function EmbedPage() {
  return (
    <div className="min-h-screen w-full p-8" style={{
      background: 'radial-gradient(ellipse at 50% 0%, #4b206b 0%, #181028 60%, #0a0a0a 100%)',
      color: '#fff',
    }}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {EMBED_CARDS.map((card, i) => (
          <div key={i} className="rounded-xl border border-gray-700 bg-[#181028] shadow-lg p-6 flex flex-col min-h-[280px]" style={{borderColor: '#2d2d3a'}}>
            <div className="flex items-center gap-3 mb-2">{card.icon}<span className="text-lg font-semibold text-white">{card.title}</span></div>
            <div className="text-gray-300 text-sm mb-4">{card.desc}</div>
            <div className="flex gap-2 mb-4">
              <button className="px-3 py-1 rounded-lg bg-[#232136] text-gray-200 text-xs font-medium">Bubble view</button>
              <button className="px-3 py-1 rounded-lg bg-[#232136] text-gray-200 text-xs font-medium">Bar View</button>
              <button className="px-3 py-1 rounded-lg bg-[#232136] text-gray-200 text-xs font-medium">Frame view</button>
            </div>
            <div className="rounded-lg bg-[#232136] text-gray-400 text-xs font-mono p-3 mb-4 whitespace-pre overflow-x-auto">
              {card.code}
            </div>
            <div className="flex gap-2 mt-auto">
              <button className="flex-1 px-4 py-2 rounded-lg bg-[#232136] text-white text-sm font-medium">Copy Code</button>
              <button className="flex-1 px-4 py-2 rounded-lg bg-[#4b206b] text-white text-sm font-medium flex items-center justify-center gap-1">Preview <span className="ml-1">&gt;</span></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
