import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import '../poppins.css';

const cards = [
  {
    icon: (
      <svg width="28" height="28" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" fill="#23232a" stroke="#fff"/><rect x="6" y="6" width="12" height="12" rx="2" fill="#23232a" stroke="#fff"/><rect x="9" y="9" width="6" height="6" rx="1" fill="#23232a" stroke="#fff"/></svg>
    ),
    title: 'Website Embed (iframe)',
    desc: 'Add this HTML snippet to your website and embed the bot window.',
    code: '<iframe src="https://yourbotdomain.com/embed" width="400" height="6"></iframe>',
    color: 'border-white',
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#25D366"/><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.967-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.205 5.077 4.366.71.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#fff"/></svg>
    ),
    title: 'WhatsApp Chat Link',
    desc: 'Add this HTML snippet to your website and embed the bot window.',
    code: '<iframe src="https://yourbotdomain.com/embed" width="400" height="6"></iframe>',
    color: 'border-green-400',
  },
  {
    icon: (
      <img src="/images/slack-integration.png" alt="Slack" className="w-7 h-7" />
    ),
    title: 'Slack Integration',
    desc: 'Add your bot to a Slack workspace and connect commands.',
    code: '<iframe src="https://yourbotdomain.com/embed" width="400" height="6"></iframe>',
    color: 'border-[#4A154B]',
  },
  {
    icon: (
      <img src="/images/jira-icon.png" alt="Jira" className="w-7 h-7" />
    ),
    title: 'Jira Integration',
    desc: 'Add this HTML snippet to your website and embed the bot window.',
    code: '<iframe src="https://yourbotdomain.com/embed" width="400" height="6"></iframe>',
    color: 'border-blue-400',
  },
  {
    icon: (
      <img src="/images/framer-icon.png" alt="Framer" className="w-7 h-7" />
    ),
    title: 'Framer Integration',
    desc: 'Add this HTML snippet to your website and embed the bot window.',
    code: '<iframe src="https://yourbotdomain.com/embed" width="400" height="6"></iframe>',
    color: 'border-purple-400',
  },
  {
    icon: (
      <img src="/images/shopify-icon.png" alt="Shopify" className="w-7 h-7" />
    ),
    title: 'Shopify Integration',
    desc: 'Add this HTML snippet to your website and embed the bot window.',
    code: '<iframe src="https://yourbotdomain.com/embed" width="400" height="6"></iframe>',
    color: 'border-green-300',
  },
];

export function Embed() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const background = isDark
    ? 'radial-gradient(ellipse at 50% 0%, #4b206b 0%, #181028 60%, #0a0a0a 100%)'
    : '#fff';
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 relative"
      style={{ background }}
    >
      {/* Hero Background Overlay (same as Analytics) */}
      <div
        className="absolute inset-0 opacity-10 dark:opacity-5 pointer-events-none select-none"
        style={{
          backgroundImage: "url(/images/hero-background.png)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      ></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl relative z-10">
        {cards.map((card, idx) => {
          // Highlight the Website Embed card
          const isWebsiteEmbed = idx === 0;
          const isLight = resolvedTheme === 'light';
          // All boxes: white bg, black text, white buttons/code in light mode
          return (
            <div
              key={idx}
              className={`rounded-2xl border border-white ${isLight ? 'bg-white' : 'bg-gradient-to-br from-[#23232a] to-[#181028]'} shadow-2xl shadow-white/10 p-7 flex flex-col min-h-[340px] max-w-md w-full`}
              style={isLight ? { boxShadow: '0 4px 32px 0 #ffffff30', background: '#fff' } : { boxShadow: '0 4px 32px 0 #00000040' }}
            >
              <div className="flex items-center gap-3 mb-1">
                {isWebsiteEmbed ? (
                  <svg width="28" height="28" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" fill="#23232a" stroke="#fff"/><rect x="6" y="6" width="12" height="12" rx="2" fill="#23232a" stroke="#fff"/><rect x="9" y="9" width="6" height="6" rx="1" fill="#23232a" stroke="#fff"/></svg>
                ) : idx === 2 ? (
                  <img src="/images/slacks.webp" alt="Slack" className="w-7 h-7" style={{marginRight: 4}} />
                ) : idx === 3 ? (
                  <img src="/images/jira.png" alt="Jira" className="w-7 h-7" style={{marginRight: 4}} />
                ) : idx === 5 ? (
                  <img src="/images/shopify.webp" alt="Shopify" className="w-7 h-7" style={{marginRight: 4}} />
                ) : idx === 4 ? (
                  <img src="/images/framer.webp" alt="Framer" className="w-7 h-7" style={{marginRight: 4}} />
                ) : card.icon}
                <span
                  className={`text-xl font-semibold ${isLight ? 'text-black' : 'text-white'}`}
                  style={isWebsiteEmbed || idx === 1 || idx === 2 || idx === 3 || idx === 4 || idx === 5 ? { fontFamily: 'Poppins, sans-serif' } : {}}
                >
                  {card.title}
                </span>
              </div>
              <div
                className={`text-base mb-5 ${isLight ? 'text-black' : 'text-gray-300'}`}
                style={isWebsiteEmbed || idx === 1 || idx === 2 || idx === 3 || idx === 4 || idx === 5 ? { fontFamily: 'Poppins, sans-serif' } : {}}
              >
                {card.desc}
              </div>
              <div className="flex gap-2 mb-4">
                <button
                  className={`px-4 py-1 rounded-full border text-xs ${isLight ? 'bg-white text-black border-[#353545]' : 'bg-[#21162a] text-gray-200 border-white'}`}
                >Bubble view</button>
                <button
                  className={`px-4 py-1 rounded-full border text-xs ${isLight ? 'bg-white text-black border-[#353545]' : 'bg-[#21162a] text-gray-200 border-white'}`}
                >Bar View</button>
                <button
                  className={`px-4 py-1 rounded-full border text-xs ${isLight ? 'bg-white text-black border-[#353545]' : 'bg-[#21162a] text-gray-200 border-white'}`}
                >Frame view</button>
              </div>
              <div
                className={`rounded-2xl px-4 py-6 text-sm font-mono mb-7 whitespace-pre border ${isLight ? 'border-[#23232a] bg-white text-black' : 'border-white text-gray-300'} `}
                style={{ minHeight: 90, maxHeight: 90, overflow: 'hidden', resize: 'none', display: 'flex', alignItems: 'center', ...(isLight ? {} : { background: '#21162a' }) }}
              >
                {card.code}
              </div>
              <div className="flex gap-4 mt-auto">
                <button
                  className={`flex-1 px-6 py-2 rounded-lg border transition text-base font-medium ${isLight ? 'bg-white text-black hover:bg-gray-100 border-gray-700' : 'bg-[#23232a] text-gray-200 hover:bg-[#23232a]/80 border-white'}`}
                >Copy Code</button>
                <button
                  className={`flex-1 px-6 py-2 rounded-lg border transition text-base font-medium ${isLight ? 'bg-white text-black hover:bg-gray-100 border-gray-700' : 'bg-[#23232a] text-gray-200 hover:bg-[#23232a]/80 border-white'}`}
                >Preview <span className="ml-2">&rarr;</span></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}