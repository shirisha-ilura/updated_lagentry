import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  BarChart3,
  CheckCircle,
  Lock
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Data for the concentric rings chart
const concentricData = [
  { name: 'Gmail', value: 80, color: '#6A1B9A' },
  { name: 'Slack', value: 50, color: '#9575CD' },
  { name: 'Jira', value: 95, color: '#4527A0' },
];

const renderConcentricLegend = () => {
  const itemStyles = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    fontSize: '1rem',
  };

  const dotStyles = {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    marginRight: '10px',
  };

  return (
    <ul className="legend-list" style={{ listStyle: 'none', padding: 0, margin: 'auto' }}>
      {concentricData.map((entry, index) => (
        <li key={`item-${index}`} style={itemStyles}>
          <span style={{ ...dotStyles, backgroundColor: entry.color }}></span>
          {entry.name}
        </li>
      ))}
    </ul>
  );
};

export function Analytics() {
  const { resolvedTheme } = useTheme();
  const [selectedTimeframe, setSelectedTimeframe] = useState('Day');
  const [barTooltip, setBarTooltip] = useState<{
    value: number;
    color: string;
    x: number;
    y: number;
    day: string;
    type: 'blue' | 'orange';
  } | null>(null);

  const timeframes = ['Day', 'Week', 'Month'];

  // Bar data for performance chart
  const barData = [
    { day: 'Sun', blue: 120, orange: 160 },
    { day: 'Mon', blue: 80, orange: 60 },
    { day: 'Tue', blue: 100, orange: 120 },
    { day: 'Wed', blue: 45, orange: 55 },
    { day: 'Thu', blue: 70, orange: 60 },
    { day: 'Fri', blue: 130, orange: 170 },
    { day: 'Sat', blue: 90, orange: 60 },
  ];

  // Helper to get bar position for tooltip
  const handleBarMouseEnter = (
    e: React.MouseEvent,
    value: number,
    color: string,
    day: string,
    type: 'blue' | 'orange'
  ) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setBarTooltip({
      value,
      color,
      x: rect.left + rect.width / 2,
      y: rect.top,
      day,
      type,
    });
  };
  const handleBarMouseLeave = () => setBarTooltip(null);

  return (
    <div
      className="min-h-screen w-full p-0 m-0"
      style={{
        background: resolvedTheme === 'dark'
          ? 'radial-gradient(ellipse at 50% 0%, #4b206b 0%, #181028 60%, #0a0a0a 100%)'
          : '#fff',
        transition: 'background 0.3s',
        borderTopLeftRadius: 0,
        margin: 0,
      }}
    >
      <div className="p-8 relative">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 opacity-10 dark:opacity-5"
        style={{
          backgroundImage: 'url(/images/hero-background.png)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      ></div>
      
      {/* Content */}
      <div className="relative z-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white">Overview</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Last 30 Days</span>
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* HR Agent Box */}
        <div className="w-full mb-6">
    <div
      className="w-full border border-gray-300 rounded-md h-16 flex items-center justify-center text-lg font-medium text-black dark:text-white"
      style={{
        background: resolvedTheme === 'dark'
          ? 'radial-gradient(ellipse at 50% 0%, #4b206b 0%, #181028 60%, #0a0a0a 100%)'
          : 'white',
      }}
    >
      HR Agent
    </div>
        </div>

        {/* KPI Cards - Figma style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Workflow Generation */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-purple-400 to-purple-300 text-black flex flex-col justify-between min-h-[120px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-base font-semibold">Workflow Generation</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold">721K</span>
              <span className="text-xs font-medium flex items-center gap-1">+11.02% <img src="/images/one.png" alt="trend up" className="w-5 h-5 ml-1 inline-block align-middle" /></span>
            </div>
          </div>
          {/* Visits */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-purple-100 to-purple-200 text-black flex flex-col justify-between min-h-[120px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-base font-semibold">Visits</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold">367K</span>
              <span className="text-xs font-medium flex items-center gap-1">-0.03% <img src="/images/two.png" alt="trend up" className="w-5 h-5 ml-1 inline-block align-middle" /></span>
            </div>
          </div>
          {/* Success rates */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-purple-300 to-purple-400 text-black flex flex-col justify-between min-h-[120px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-base font-semibold">Success rates</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold">1,156</span>
              <span className="text-xs font-medium flex items-center gap-1">+15.03% <img src="/images/three.png" alt="trend up" className="w-5 h-5 ml-1 inline-block align-middle" /></span>
            </div>
          </div>
          {/* Active Users */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-purple-100 to-purple-200 text-black flex flex-col justify-between min-h-[120px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-base font-semibold">Active Users</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold">239K</span>
              <span className="text-xs font-medium flex items-center gap-1">+6.08% <img src="/images/four.png" alt="trend up" className="w-5 h-5 ml-1 inline-block align-middle" /></span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
  <div className="grid grid-cols-1 lg:grid-cols-[2.5fr_1fr] gap-6 mb-8">
          {/* Total Workflows Chart */}
          <div
            className="border border-gray-300 rounded-2xl p-8 min-w-0 text-black dark:text-white"
            style={{
              boxShadow: 'none',
              borderRadius: '32px',
              borderColor: '#d1d5db',
              minHeight: '620px',
              background: resolvedTheme === 'dark'
                ? 'radial-gradient(ellipse at 50% 0%, #4b206b 0%, #181028 60%, #0a0a0a 100%)'
                : 'white',
            }}
          >
            <h3 className="text-3xl font-bold text-black dark:text-white mb-2">Total Workflows</h3>
            {/* Legend */}
            <div className="flex items-center space-x-6 mb-2 mt-2 text-black dark:text-white">
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full" style={{background:'#7c3aed', display:'inline-block'}}></span>
                <span className="text-lg font-medium text-black dark:text-white">Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full" style={{background:'#222', display:'inline-block'}}></span>
                <span className="text-lg font-medium text-black dark:text-white">Inactive</span>
              </div>
            </div>
            {/* Chart Area */}
            <div className="w-full h-[540px] relative mt-2">
              {/* Y-axis and Success Rate label */}
              <div className="absolute left-0 top-8 bottom-8 flex flex-row items-center z-10" style={{height:'calc(100% - 32px)'}}>
                <span className="text-base text-gray-700 font-medium mr-8" style={{writingMode:'vertical-rl', transform:'rotate(180deg)', minWidth:24}}>Success Rate</span>
                <div className="flex flex-col justify-between items-end" style={{height:'100%', width: '40px', paddingRight: '8px'}}>
                  {[1000, 800, 600, 400, 200, 0].map((num, idx, arr) => (
                    <span key={num} className="text-base text-gray-700 dark:text-gray-200" style={{position:'absolute', left: 24, top: `calc(${(idx/(arr.length-1))*80}%)`}}>{num}</span>
                  ))}
                </div>
              </div>
              {/* X-axis and Area Chart */}
              <div className="absolute left-24 right-4 top-0 bottom-0">
                {/* Area Chart SVG */}
                <svg width="100%" height="100%" viewBox="0 0 900 500" style={{position:'absolute',top:0,left:0}}>
                  {/* Inactive area (black/gray) */}
                  <defs>
                    <linearGradient id="inactiveGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#222" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#222" stopOpacity="0.03" />
                    </linearGradient>
                    <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.10" />
                    </linearGradient>
                  </defs>
                  {/* Grid box border */}
                  <rect x="0" y="0" width="900" height="500" fill="none" stroke="#d1d5db" strokeWidth="2" rx="18" />
                  {/* Grid lines - lighter gray */}
                  {[1,2,3,4,5,6].map(i => (
                    <line key={i} x1="0" x2="900" y1={500/7*i} y2={500/7*i} stroke="#ede9fe" strokeWidth="2" />
                  ))}
                  {[1,2,3,4,5,6,7,8,9].map(i => (
                    <line key={i} y1="0" y2="500" x1={i*100} x2={i*100} stroke="#ede9fe" strokeWidth="2" />
                  ))}
                  <path d="M0,450 Q100,400 180,420 Q250,440 300,380 Q350,320 400,400 Q500,500 600,380 Q700,300 800,420 Q900,450 900,500 0,500 Z" fill="url(#inactiveGradient)" />
                  <path d="M0,400 Q100,350 180,370 Q250,390 300,330 Q350,270 400,350 Q500,450 600,330 Q700,250 800,370 Q900,400 900,500 0,500 Z" fill="url(#activeGradient)" />
                </svg>
                {/* X-axis labels */}
                  <div className="absolute left-0 right-0 bottom-0 flex justify-between text-base text-gray-700 px-2" style={{width:'calc(100% - 8px)'}}>
                    {[0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map((num, idx, arr) => (
                      <span key={num} style={{position:'absolute', left: `calc(${(idx/(arr.length-1))*100}% - 12px)`, bottom: '32px', color: resolvedTheme === 'dark' ? '#fff' : '#374151'}}>{num}</span>
                    ))}
                  </div>
                {/* Y-axis label */}
              </div>
            </div>
          </div>

          {/* Most Used Integrations (Custom Styled) */}
          <div
            className="rounded-2xl p-0 border-2 text-black dark:text-white"
            style={{
              minHeight: 420,
              boxShadow: 'none',
              borderRadius: '32px',
              background: resolvedTheme === 'dark'
                ? 'radial-gradient(ellipse at 50% 0%, #4b206b 0%, #181028 60%, #0a0a0a 100%)'
                : 'white',
            }}
          >
            <div className="p-6 pb-0">
              <h3 className="text-2xl font-bold text-black dark:text-white mb-1 w-fit">Most Used Integrations</h3>
              <p className="text-lg text-black dark:text-white font-normal mb-4"><span className="font-bold dark:text-white">Frequently used events</span> and conditions</p>
            </div>
            <div className="flex flex-row items-center justify-center flex-1 gap-8 px-4 pb-6">
              <div
                className="flex items-center justify-center text-black dark:text-white"
                style={{
                  width: 340,
                  height: 340,
                  boxSizing: 'content-box',
                  background: resolvedTheme === 'dark'
                    ? 'radial-gradient(ellipse at 50% 0%, #4b206b 0%, #181028 60%, #0a0a0a 100%)'
                    : 'white',
                }}
              >
                <ResponsiveContainer width="100%" height="100%" aspect={1}>
                  <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    {concentricData.map((entry, index) => (
                      <Pie
                        key={`pie-${index}`}
                        data={[{ name: entry.name, value: entry.value }, { name: 'Empty', value: 100 - entry.value }]}
                        dataKey="value"
                        innerRadius={70 + index * 35}
                        outerRadius={100 + index * 35}
                        fill={entry.color}
                        paddingAngle={0}
                        startAngle={0}
                        endAngle={360}
                        isAnimationActive={false}
                        stroke="none"
                      >
                        <Cell key={`cell-${index}-active`} fill={entry.color} />
                        <Cell key={`cell-${index}-inactive`} fill="#d1d5db" />
                      </Pie>
                    ))}
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col justify-center ml-6">
                <ul className="space-y-6 text-black dark:text-white">
                  {concentricData.map((entry) => (
                    <li key={entry.name} className="flex items-center text-xl font-normal">
                      <span style={{ backgroundColor: entry.color, width: 22, height: 22, borderRadius: '50%', display: 'inline-block', marginRight: 16 }}></span>
                      <span className="text-black dark:text-white font-medium">{entry.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-6">
          {/* Performance Chart */}
          <div
            className="border border-gray-300 rounded-2xl p-6 col-span-1 flex flex-col justify-between text-black dark:text-white"
            style={{
              minWidth: 0,
              borderRadius: '32px',
              background: resolvedTheme === 'dark'
                ? 'radial-gradient(ellipse at 50% 0%, #4b206b 0%, #181028 60%, #0a0a0a 100%)'
                : 'white',
            }}
          >
            <div className="flex justify-between items-start mb-2 text-black dark:text-white">
              <h3 className="text-2xl font-bold text-black dark:text-white mb-0">Performance</h3>
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full p-1 gap-1">
                {timeframes.map((timeframe) => (
                  <button
                    key={timeframe}
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className={`px-4 py-1 text-base rounded-full transition-colors duration-200 font-medium ${
                      selectedTimeframe === timeframe
                        ? 'bg-white dark:bg-gray-900 text-black dark:text-white shadow font-bold'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {timeframe}
                  </button>
                ))}
              </div>
            </div>
            {/* Custom Gradient Bar Chart with Y-axis */}
            <div className="flex flex-row w-full h-56 mt-2 mb-2 px-2">
              {/* Y-axis */}
              <div className="flex flex-col justify-between items-end h-full pr-2">
                {[180, 150, 120, 90, 60, 30, 0].map((num) => (
                  <span key={num} className="text-xs text-gray-500 dark:text-gray-200">{num}</span>
                ))}
              </div>
              {/* Bars and X-axis */}
              <div className="flex flex-1 items-end justify-between h-full" style={{position:'relative'}}>
                {barData.map((d, idx) => (
                  <div key={d.day} className="flex flex-col items-center justify-end w-16" style={{position:'relative'}}>
                    <div className="flex flex-row items-end gap-1 w-full" style={{ height: 180 }}>
                      {/* Blue bar */}
                      <div
                        style={{
                          height: `${d.blue}px`,
                          width: 18,
                          borderRadius: '0',
                          background: 'linear-gradient(to top, #90caf9 0%, #1976d2 100%)',
                          marginRight: 2,
                          position: 'relative',
                          zIndex: 2,
                        }}
                        onMouseEnter={e => handleBarMouseEnter(e, d.blue, '#1976d2', d.day, 'blue')}
                        onMouseLeave={handleBarMouseLeave}
                      ></div>
                      {/* Orange bar */}
                      <div
                        style={{
                          height: `${d.orange}px`,
                          width: 18,
                          borderRadius: '0',
                          background: 'linear-gradient(to top, #ffe082 0%, #ffb300 100%)',
                          position: 'relative',
                          zIndex: 2,
                        }}
                        onMouseEnter={e => handleBarMouseEnter(e, d.orange, '#ffb300', d.day, 'orange')}
                        onMouseLeave={handleBarMouseLeave}
                      ></div>
                    </div>
                    <div className="text-base text-black dark:text-white mt-2">{d.day}</div>
                  </div>
                ))}
                {/* Tooltip for bar value */}
                {barTooltip && (
                  <div
                    style={{
                      position: 'fixed',
                      left: barTooltip.x,
                      top: barTooltip.y - 32,
                      transform: 'translate(-50%, -100%)',
                      background: '#fff',
                      color: '#222',
                      borderRadius: 6,
                      boxShadow: '0 2px 8px 0 rgba(60,60,60,0.10)',
                      padding: '6px 14px',
                      fontWeight: 600,
                      fontSize: 16,
                      border: `2px solid ${barTooltip.color}`,
                      zIndex: 9999,
                      pointerEvents: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {barTooltip.value}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Integration Hub - Match provided screenshot */}
          <div
            className="rounded-2xl p-6 border border-gray-300 min-w-[260px] max-w-[320px] shadow-sm flex flex-col text-black dark:text-white"
            style={{
              boxShadow: '0 2px 8px 0 rgba(60,60,60,0.06)',
              background: resolvedTheme === 'dark'
                ? 'radial-gradient(ellipse at 50% 0%, #4b206b 0%, #181028 60%, #0a0a0a 100%)'
                : 'white',
            }}
          >
            <h3 className="text-xl font-bold text-black dark:text-white mb-4">Integration Hub</h3>
            {/* Status Card */}
            <div className="flex items-center bg-white rounded-xl px-4 py-2 mb-6 shadow" style={{boxShadow: '0 2px 8px 0 rgba(60,60,60,0.10)'}}>
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" stroke="#E0E0E0" strokeWidth="6" fill="none" />
                  <circle cx="32" cy="32" r="28" stroke="#7C3AED" strokeWidth="6" fill="none" strokeDasharray={2 * Math.PI * 28} strokeDashoffset={2 * Math.PI * 28 * (1 - 0.74)} strokeLinecap="round" />
                </svg>
                <span className="absolute text-lg font-bold text-[#7C3AED] left-1/2 top-1/2" style={{transform:'translate(-50%,-50%)'}}>74%</span>
              </div>
              <span className="ml-4 text-lg font-medium text-[#7C3AED]">Integration Status</span>
            </div>
            {/* Integration List */}
            <div className="flex flex-col gap-3 mb-4 mt-2">
              {['Gmail', 'Slack', 'Jira', 'Others'].map((integration) => (
                <div key={integration} className="flex justify-between items-center">
                  <span className="text-base text-black dark:text-white font-normal">{integration}</span>
                  <span className="inline-flex items-center justify-center">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="11" fill="black" />
                      <polyline points="17 8 11 16 7 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              ))}
            </div>
            <a href="#" className="text-sm text-[#2563eb] mt-2" style={{textDecoration: 'none'}}>Overview of connected apps and authentication status</a>
          </div>

          {/* OAuth Access - Match provided screenshot */}
          <div
            className="rounded-2xl border border-gray-200 p-0 flex flex-col items-center justify-start relative overflow-hidden min-h-[420px] max-w-[340px] text-black dark:text-white"
            style={{
              background: resolvedTheme === 'dark'
                ? 'radial-gradient(ellipse at 50% 0%, #4b206b 0%, #181028 60%, #0a0a0a 100%)'
                : 'linear-gradient(180deg, #f7f6fa 0%, #fff 60%, #cfc2f7 100%)',
            }}
          >
            {/* Title */}
            <div className="w-full flex flex-col items-center mt-12 mb-8 z-10">
              <span className="text-xl font-bold text-black dark:text-white text-center leading-tight" style={{textShadow: '0 1px 0 #fff', fontSize: '1.35rem', fontWeight: 700}}>Quick access to OAuth<br/>integrations and management.</span>
            </div>
            {/* Zigzag line and lock */}
            <div className="flex flex-col items-center justify-center w-full z-10 relative" style={{marginTop: '0px'}}>
              {/* Zigzag line */}
              <svg className="absolute left-0 right-0" style={{top: '60px'}} width="100%" height="60" viewBox="0 0 400 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <polyline points="0,30 140,30 200,60 260,30 400,30" stroke="#bdbdbd" strokeWidth="3" fill="none" />
              </svg>
              {/* Lock circle */}
              <div className="rounded-full flex items-center justify-center" style={{width: '100px', height: '100px', background: 'radial-gradient(circle at 60% 40%, #3a186a 80%, #7b3ff7 100%)', zIndex:2, marginTop: '30px'}}>
                {/* Closed lock icon */}
               <svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
  
  <path 
    d="M30 20 
      V14 
      A8 8 0 0 0 14 14 
      V20" 
    fill="none" 
    stroke="#bdbdbd" 
    stroke-width="3" 
    stroke-linecap="round"
  />
  
  
  <rect x="12" y="20" width="20" height="16" rx="3" fill="#fff" stroke="#bdbdbd" stroke-width="2" />
</svg>
              </div>
            </div>
          </div>
        </div>

        {/* What Powers Lagentry Section */}
        <div className="w-full mt-12 md:mt-16 px-4 md:px-0">
          <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-8 text-left">What Powers Lagentry</h2>
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full bg-transparent text-black dark:text-white border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="text-lg font-semibold px-6 py-4 text-left bg-transparent">Component</th>
                  <th className="text-lg font-semibold px-6 py-4 text-left bg-transparent">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <td className="px-6 py-4 font-medium border-b border-gray-200 dark:border-gray-700">Proprietary Architecture</td>
                  <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">Multi-stage reasoning across your full codebase</td>
                </tr>
                <tr className="">
                  <td className="px-6 py-4 font-medium border-b border-gray-200 dark:border-gray-700">Advanced Context Builder</td>
                  <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">Maintains project-wide context awareness in Visual Studio</td>
                </tr>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <td className="px-6 py-4 font-medium border-b border-gray-200 dark:border-gray-700">AI Reasoning Engine</td>
                  <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">Analyzes syntax, structure, intent, and logic</td>
                </tr>
                <tr className="">
                  <td className="px-6 py-4 font-medium border-b border-gray-200 dark:border-gray-700">Adaptive Execution Planner</td>
                  <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">Manages complex interdependencies dynamically</td>
                </tr>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <td className="px-6 py-4 font-medium">Production Code Generator</td>
                  <td className="px-6 py-4">Outputs ready-to-deploy, testable enterprise code</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}