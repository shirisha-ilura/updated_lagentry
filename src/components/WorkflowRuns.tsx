
import React, { useState } from 'react';
import { Star, MoreVertical, ChevronDown } from 'lucide-react';

const workflowCards = [
  {
    status: 'Active',
    statusColor: 'bg-yellow-100 text-yellow-700',
    star: false,
    title: 'Workflow Run - Gmail Agent',
    name: 'Gmail Agent',
    nextRun: 'Aug 15,2025',
    nextRunColor: 'text-yellow-300',
  },
  {
    status: 'Completed',
    statusColor: 'bg-green-100 text-green-700',
    star: true,
    title: 'Workflow Run - Excel Agent',
    name: 'Excel Agent',
    nextRun: 'Completed',
    nextRunColor: 'text-green-400',
  },
  {
    status: 'Pending',
    statusColor: 'bg-pink-200 text-pink-700',
    star: false,
    title: 'Workflow Run - HR Agent',
    name: 'HR Agent',
    nextRun: 'Aug 11,2025',
    nextRunColor: 'text-red-400',
  },
  {
    status: 'Active',
    statusColor: 'bg-yellow-100 text-yellow-700',
    star: false,
    title: 'Workflow Run - Marketing Agent',
    name: 'Gmail Agent',
    nextRun: 'Aug 15,2025',
    nextRunColor: 'text-yellow-300',
  },
];
export function WorkflowRuns() {
  const [selectedAgentIdx, setSelectedAgentIdx] = useState<number | null>(null);
  return (
    <div className="w-full">
      {/* Top Banner */}
      <div className="w-full bg-gradient-to-r from-[#181028] to-[#22143a] py-4 flex justify-center items-center border-b border-[#232136] mb-8">
        <span className="text-white text-lg font-medium tracking-wide">Workflow Runs Automation</span>
      </div>
      <div className="flex flex-row gap-8 w-full items-start mt-8 min-h-[calc(100vh-100px)]">
      {/* Agent Cards 2x2 Grid Centered */}
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {workflowCards.map((card, idx) => {
            const isGmail = card.title === 'Workflow Run - Gmail Agent';
            const isExcel = card.title === 'Workflow Run - Excel Agent';
            const isHR = card.title === 'Workflow Run - HR Agent';
            const isMarketing = card.title === 'Workflow Run - Marketing Agent';
            return (
              <div
                key={idx}
                className={
                  isGmail || isExcel || isHR || isMarketing
                    ? "relative rounded-xl p-6 flex flex-col justify-between border border-[#a084e8] shadow-[0_0_12px_2px_rgba(160,132,232,0.15)] bg-gradient-to-br from-[#181028] to-[#22143a] cursor-pointer hover:scale-105 transition-transform"
                    : "relative bg-[#181028] border border-gray-700 rounded-xl p-6 min-w-[320px] min-h-[170px] shadow-lg flex flex-col justify-between cursor-pointer hover:scale-105 transition-transform"
                }
                onClick={() => setSelectedAgentIdx(idx)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {isGmail ? (
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-200 text-[#181028] shadow-sm">Active</span>
                    ) : isExcel ? (
                      <span className="text-xs font-semibold px-4 py-1 rounded-full bg-green-200 text-green-700 shadow-sm">Completed</span>
                    ) : isHR ? (
                      <span className="text-xs font-semibold px-4 py-1 rounded-full bg-pink-300 text-pink-800 shadow-sm">Pending</span>
                    ) : isMarketing ? (
                      <span className="text-xs font-semibold px-4 py-1 rounded-full bg-yellow-200 text-[#181028] shadow-sm">Active</span>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${card.statusColor}`}>{card.status}</span>
                    )}
                    {isGmail ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    ) : isExcel ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFD600" stroke="#FFD600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    ) : isHR ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    ) : isMarketing ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#bdbdbd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    ) : (
                      card.star && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    )}
                  </div>
                  {isGmail || isExcel || isHR || isMarketing ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-vertical"><circle cx="12" cy="6" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="18" r="1"/></svg>
                  ) : (
                    <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer" />
                  )}
                </div>
                <div className="text-lg font-semibold text-white mb-1">{card.title}</div>
                <div className={isExcel ? "text-gray-400 text-lg font-semibold mb-1" : isGmail ? "text-gray-400 text-sm mb-1" : isHR ? "text-gray-400 text-lg font-semibold mb-1" : isMarketing ? "text-gray-400 text-lg font-semibold mb-1" : "text-sm text-gray-400 mb-2"}>Name- <span className={isExcel ? "font-semibold" : isHR ? "font-semibold" : isMarketing ? "font-semibold" : "text-white"}>{card.name}</span></div>
                <div className={isExcel ? "text-gray-400 text-lg font-semibold" : isGmail ? "text-gray-400 text-sm" : isHR ? "text-gray-400 text-lg font-semibold" : isMarketing ? "text-gray-400 text-lg font-semibold" : "text-sm text-gray-400"}>
                  Next Run- <span className={isExcel ? "text-green-400 font-semibold" : isGmail ? "text-yellow-400 font-semibold" : isHR ? "text-red-600 font-semibold" : isMarketing ? "text-yellow-400 font-semibold" : `font-semibold ${card.nextRunColor}`}>{card.nextRun}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Workflow Configuration Panel (show only if agent selected) */}
      {selectedAgentIdx !== null && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-60">
          <div className="relative w-full max-w-xl h-full overflow-y-auto bg-gradient-to-br from-[#181028] to-[#22143a] border-l border-[#232136] shadow-2xl p-8 flex flex-col">
            {/* Close button */}
            <button
              className="absolute top-6 right-6 text-gray-300 hover:text-white text-2xl focus:outline-none"
              onClick={() => setSelectedAgentIdx(null)}
              aria-label="Close"
            >
              &times;
            </button>
            {/* Title */}
            <div className="text-2xl font-bold text-white mb-6 mt-2">Workflow Configuration</div>
            <hr className="border-[#35304a] mb-6" />
            {/* General Settings */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="text-lg font-semibold text-white mb-1">General Settings</div>
                <div className="text-base text-gray-300">Rename Workflow</div>
                <div className="text-base text-gray-300">Description</div>
              </div>
              <button className="bg-[#a259ff] hover:bg-[#7c5fe6] text-white text-base px-6 py-2 rounded-lg font-semibold">Edit</button>
            </div>
            <hr className="border-[#35304a] mb-6" />
            {/* Trigger Schedule */}
            <div className="mb-8">
              <div className="text-lg font-semibold text-white mb-2">Trigger Schedule</div>
              <div className="flex flex-row items-center justify-between w-full" style={{ minHeight: 64 }}>
                <div className="flex flex-col">
                  <div className="text-base text-gray-300">Time Settings</div>
                  <div className="text-base text-gray-300">Time Picker</div>
                </div>
                <button
                  className="flex items-center px-6 py-3 rounded-lg border border-white text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-white"
                  style={{ minWidth: 340, justifyContent: 'space-between' }}
                >
                  <span className="mr-4 whitespace-nowrap">Friday, 26th September, 11:00 AM</span>
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white">
                    <ChevronDown className="w-5 h-5 text-black" />
                  </span>
                </button>
              </div>
            </div>
            <hr className="border-[#35304a] mb-6" />
            {/* Agent Settings */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="text-lg font-semibold text-white mb-1">Agent Settings</div>
                <div className="text-base text-gray-300">Edit System Promt</div>
                <div className="text-base text-gray-300">Test Prompt Button</div>
              </div>
              <div className="flex flex-col gap-3">
                <button className="bg-[#a259ff] hover:bg-[#7c5fe6] text-white text-base px-6 py-2 rounded-lg font-semibold">Edit Prompt</button>
                <button className="bg-[#a259ff] hover:bg-[#7c5fe6] text-white text-base px-6 py-2 rounded-lg font-semibold">Test Run</button>
              </div>
            </div>
            <hr className="border-[#35304a] mb-6" />
            {/* Other Configurations */}
            <div className="mb-8">
              <div className="text-lg font-semibold text-white mb-1">Other Configurations</div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-base text-gray-300">Enable/Disable Workflow</span>
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-[#4f46e5] transition-colors duration-200 relative">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform duration-200"></div>
                  </div>
                  <span className="ml-2 text-base text-white">Enable Changes</span>
                </label>
              </div>
              <div className="text-base text-gray-300">View Logs</div>
            </div>
            <hr className="border-[#35304a] mb-6" />
            <div className="flex justify-center gap-4 mt-4">
              <button className="px-8 py-2 rounded-lg bg-[#232136] text-[#bdbdbd] font-semibold text-lg">Cancel</button>
              <button className="px-8 py-2 rounded-lg bg-[#a259ff] hover:bg-[#7c5fe6] text-white font-semibold text-lg">Save Changes</button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
