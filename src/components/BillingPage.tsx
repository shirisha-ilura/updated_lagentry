import React from 'react';
import '../poppins.css';


export function BillingPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start py-8 px-2 sm:px-0"
      style={{ background: '#ededed', fontFamily: 'Poppins, sans-serif' }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '20px',
          boxShadow: '0 1px 4px 0 rgba(16,30,54,.04)',
          width: '100%',
          maxWidth: '700px',
          minHeight: 'calc(100vh - 64px)',
          margin: '32px auto',
          marginTop: '120px',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
      >
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 dark:bg-[#18181b]" style={{ fontFamily: 'Poppins, sans-serif', boxShadow: 'none' }}>
          <div className="text-lg font-semibold text-black dark:text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Current plan</div>
          <div className="flex items-center mb-2 w-full" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <span className="font-bold text-black dark:text-white" style={{ fontWeight: 600, fontSize: 18 }}>Trial</span>
            <span className="text-gray-500 text-sm ml-3 dark:text-gray-300" style={{ fontWeight: 400 }}>(400 credits / month)</span>
            <span className="flex items-center ml-auto">
              <span className="text-gray-500 text-sm mr-2 dark:text-gray-300" style={{ fontWeight: 400 }}>Limit reached</span>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="mr-1" style={{ display: 'inline', verticalAlign: 'middle' }}>
                <circle cx="12" cy="12" r="10" stroke="#F87171" strokeWidth="2" fill="none" />
                <path d="M12 8v4" stroke="#F87171" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="16" r="1" fill="#F87171" />
              </svg>
              <span className="text-red-500 text-sm font-semibold dark:text-red-400" style={{ fontWeight: 500 }}>0 / 400</span>
            </span>
          </div>
          <div className="w-full h-1 bg-gray-200 rounded mb-2 dark:bg-gray-700">
            <div className="h-1 bg-gray-400 rounded dark:bg-gray-500" style={{ width: '0%' }} />
          </div>
          <div className="text-orange-700 text-sm mb-3 dark:text-orange-300" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>
            You've used your credits, all tasks are now on hold. Upgrade now to keep using Lindy.
          </div>
          <div className="flex space-x-2 mb-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>Upgrade</button>
            <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded border border-gray-300 dark:bg-gray-800 dark:text-gray-200" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>Manage</button>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-300" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>
            Your new billing plan <b>Free Monthly</b> will start on <b>Aug 30th 2025</b>. You will receive <b>400</b> credits per month.
          </div>
        </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 dark:bg-[#18181b]" style={{ boxShadow: 'none' }}>
            <div className="text-lg font-semibold text-black dark:text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Payment method</div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>Add</button>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 dark:bg-[#18181b]" style={{ fontFamily: 'Poppins, sans-serif', boxShadow: 'none' }}>
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-lg font-semibold text-black dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Enable overages</span>
              {/* Custom toggle switch */}
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input type="checkbox" className="sr-only peer" disabled />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 transition-all duration-200"></div>
                <div className="absolute left-0.5 top-0.5 bg-white border border-gray-300 h-5 w-5 rounded-full transition-all duration-200"></div>
              </label>
            </div>
            <div className="text-gray-700 dark:text-gray-200 text-base font-normal" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Overages let you keep using Lindy after running out credits, up to 4x your subscription. Overage credits cost twice as much.
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 dark:bg-[#18181b]" style={{ boxShadow: 'none' }}>
            <div className="text-lg font-semibold text-black dark:text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Usage</div>
            <div className="text-gray-700 text-sm mb-2 dark:text-gray-200" style={{ fontFamily: 'Poppins, sans-serif' }}>Your top 10 most used agents and their top 10 tasks. Interested in reducing your credit consumption? <a href="#" className="text-blue-600 underline dark:text-blue-400">Learn more</a></div>
            <select className="border border-gray-300 rounded px-3 py-2 mb-2 dark:bg-[#23232b] dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <option>Current billing period</option>
            </select>
            {/* Usage details would go here */}
          </div>
        </div>
      </div>
  );
}
