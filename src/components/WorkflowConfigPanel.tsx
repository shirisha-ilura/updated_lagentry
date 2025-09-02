import React from 'react';

export function WorkflowConfigPanel({ agent, onClose }) {
  const [showEdit, setShowEdit] = React.useState(false);
  const [showDateModal, setShowDateModal] = React.useState(false);
  if (showEdit) {
    // Render the edit/settings box styled as in the screenshot
    return (
      <div className="relative w-[650px] min-h-[700px] bg-gradient-to-br from-[#181028] to-[#22143a] border border-[#232136] shadow-2xl p-10 flex flex-col ml-4 rounded-2xl text-white">
        {/* Close button */}
        <button
          className="absolute top-6 right-6 text-white text-2xl focus:outline-none hover:text-gray-300"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="text-2xl font-bold mb-6 mt-2">Workflow Configuration Settings- {agent.title.replace('Workflow Run - ', '')}</div>
        <hr className="border-[#35304a] mb-8" />
        {/* Chatbot Settings */}
        <div className="mb-8">
          <div className="text-lg font-semibold mb-4">Chatbot Settings</div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-base">System Prompt</span>
              <button className="bg-[#a259ff] hover:bg-[#7c5fe6] text-white text-base px-6 py-2 rounded-lg font-semibold">Edit</button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base">Test Prompt Button</span>
              <button className="bg-[#a259ff] hover:bg-[#7c5fe6] text-white text-base px-6 py-2 rounded-lg font-semibold">Test Run</button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base">App Connections</span>
              <div className="flex items-center gap-2">
                {/* Custom toggle switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-[#2563eb] transition-colors duration-200 relative">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform duration-200"></div>
                  </div>
                </label>
                <span className="ml-2 text-base">Enable Changes</span>
              </div>
            </div>
          </div>
        </div>
        <hr className="border-[#35304a] mb-8" />
        {/* Trigger Schedule */}
        <div className="mb-8">
          <div className="text-lg font-semibold mb-4">Trigger Schedule</div>
          <div className="flex flex-col gap-4">
            {/* Date Settings Row */}
            <div className="flex items-center w-full mb-2">
              <div className="w-1/3 min-w-[140px] text-base">Date Settings</div>
              <div className="flex-1 flex justify-end">
                <div className="flex items-center w-[320px]">
                  <div className="flex flex-row items-center w-full h-12 border-2 border-white rounded-2xl pr-3 pl-4 bg-transparent relative">
                    <span className="text-white text-base font-medium tracking-wide whitespace-nowrap">Friday, 26th September, 11:00 AM</span>
                    <span className="flex items-center justify-center ml-2 cursor-pointer" onClick={() => setShowDateModal(true)}>
                      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#181028" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                      </span>
                    </span>
                    {/* Modal for date/time picker */}
                    {showDateModal && (
                      <div className="absolute left-0 top-14 z-50 w-[320px] bg-[#f5f5f5] rounded-2xl shadow-2xl border-2 border-black flex flex-col items-center p-0 animate-fade-in">
                        <div className="w-full text-center text-black text-xl font-semibold pt-6 pb-2">Pick a time</div>
                        <hr className="w-full border-gray-300 mb-2" />
                        {/* Fake scrollable pickers for demo */}
                        <div className="flex flex-row justify-center items-center w-full px-2 mb-6">
                          <div className="flex flex-col items-center w-1/4">
                            <span className="text-gray-400 text-lg">January</span>
                            <span className="text-gray-700 text-lg">February</span>
                            <span className="text-blue-700 text-lg font-semibold">March</span>
                            <span className="text-gray-700 text-lg">April</span>
                            <span className="text-gray-400 text-lg">May</span>
                          </div>
                          <div className="flex flex-col items-center w-1/5">
                            <span className="text-gray-400 text-lg">30</span>
                            <span className="text-gray-700 text-lg">31</span>
                            <span className="text-blue-700 text-lg font-semibold">1</span>
                            <span className="text-gray-700 text-lg">2</span>
                            <span className="text-gray-400 text-lg">3</span>
                          </div>
                          <div className="flex flex-col items-center w-1/5">
                            <span className="text-gray-400 text-lg">10</span>
                            <span className="text-gray-700 text-lg">12</span>
                            <span className="text-blue-700 text-lg font-semibold">1</span>
                            <span className="text-gray-700 text-lg">2</span>
                            <span className="text-gray-400 text-lg">3</span>
                          </div>
                          <div className="flex flex-col items-center w-1/5">
                            <span className="text-gray-400 text-lg">PM</span>
                            <span className="text-gray-700 text-lg">PM</span>
                            <span className="text-blue-700 text-lg font-semibold">AM</span>
                            <span className="text-gray-700 text-lg">AM</span>
                            <span className="text-gray-400 text-lg">AM</span>
                          </div>
                        </div>
                        <div className="w-full flex justify-center pb-6">
                          <button className="w-11/12 py-3 rounded-xl bg-black text-white text-lg font-semibold" onClick={() => setShowDateModal(false)}>Save</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Time Picker Row */}
            <div className="flex items-center w-full mb-2">
              <div className="w-1/3 min-w-[140px] text-base">Time Picker</div>
              <div className="flex-1 flex justify-end">
                <div className="flex items-center gap-4">
                  {/* Hour: just a vertical line in a purple-outlined box */}
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg border-2 border-[#a259ff] bg-transparent">
                    <div className="w-[2px] h-8 bg-white"></div>
                  </div>
                  {/* Minute: white box with 00 */}
                  <div className="w-14 h-12 flex items-center justify-center rounded-lg bg-white text-black text-2xl font-bold">00</div>
                  {/* AM/PM segmented control */}
                  <div className="flex rounded-lg overflow-hidden border-2 border-[#a259ff] h-12">
                    <div className="flex items-center justify-center w-16 h-full bg-[#a259ff] text-white text-lg font-semibold">AM</div>
                    <div className="flex items-center justify-center w-16 h-full bg-[#181028] text-white text-lg font-semibold">PM</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Trigger Frequency Row */}
            <div className="flex items-center w-full">
              <div className="w-1/3 min-w-[140px] text-base">Trigger Frequency</div>
            </div>
          </div>
        </div>
        <hr className="border-[#35304a] mb-8" />
        <div className="flex justify-center gap-4 mt-4">
          <button className="px-8 py-2 rounded-lg border border-[#35304a] bg-transparent text-white font-semibold text-lg">Cancel</button>
          <button className="px-8 py-2 rounded-lg bg-[#a259ff] hover:bg-[#7c5fe6] text-white font-semibold text-lg">Save Changes</button>
        </div>
      </div>
    );
  }
  // Default Workflow Configuration Panel
  return (
    <div className="relative w-[600px] min-h-[700px] bg-gradient-to-br from-[#181028] to-[#22143a] border-l border-[#232136] shadow-2xl p-8 flex flex-col ml-4 rounded-xl">
      {/* Close button */}
      <button
        className="absolute top-6 right-6 text-gray-300 hover:text-white text-2xl focus:outline-none"
        onClick={onClose}
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
        <button className="bg-[#a259ff] hover:bg-[#7c5fe6] text-white text-base px-6 py-2 rounded-lg font-semibold" onClick={() => setShowEdit(true)}>Edit</button>
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
          <div className="flex items-center w-[320px]">
            <div className="flex flex-row items-center w-full h-12 border-2 border-white rounded-2xl pr-3 pl-4 bg-transparent">
              <span className="text-white text-base font-medium tracking-wide whitespace-nowrap">Friday, 26th September, 11:00 AM</span>
              <span className="flex items-center justify-center ml-2">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#181028" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </span>
              </span>
            </div>
          </div>
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
  );
}
