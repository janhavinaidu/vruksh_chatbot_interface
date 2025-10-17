// src/app/page.tsx
"use client";

import React, { useState } from 'react';
import { X, Loader, Send, Bot, User, FileText, BarChart2, University } from 'lucide-react';

interface MessageType {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export default function Home() {
  const [topics, setTopics] = useState<string[]>(['Leukemia', 'Lung Cancer']);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisRan, setAnalysisRan] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! I'm ready to answer questions based on your analysis. What would you like to know?",
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleAddTopic = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newTopic = inputValue.trim();
      if (!topics.includes(newTopic)) {
        setTopics([...topics, newTopic]);
      }
      setInputValue('');
    }
  };

  const handleRemoveTopic = (topicToRemove: string) => {
    setTopics(topics.filter(topic => topic !== topicToRemove));
  };
  
  const handleRunAnalysis = async () => {
    if (topics.length < 1) return;
    setIsLoading(true);
    setAnalysisRan(false);
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setIsLoading(false);
    setAnalysisRan(true);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage: MessageType = {
      id: Date.now(),
      sender: 'user',
      text: chatInput,
    };

    const botResponse: MessageType = {
      id: Date.now() + 1,
      sender: 'bot',
      text: 'Based on the analysis, publications on Leukemia have seen a 15% year-over-year growth, significantly higher than Lung Cancer.',
    };

    setMessages([...messages, userMessage, botResponse]);
    setChatInput('');
  };

  return (
    <main className="flex min-h-screen w-full flex-col bg-gray-100 font-sans">
      <div className="mx-auto w-full max-w-7xl space-y-6 p-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Research AI Assistant</h1>
          <p className="mt-2 text-gray-600">Comparative analysis and insights across research topics</p>
        </div>

        {/* Analysis Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-800">Analysis Hub</h2>
            <div className="flex flex-wrap gap-2">
              {topics.map(topic => (
                <div key={topic} className="flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-sm font-medium text-white">
                  {topic}
                  <button onClick={() => handleRemoveTopic(topic)} className="ml-1 hover:text-blue-200">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4 flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 p-3">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleAddTopic}
              placeholder="Add topic or researcher name and press Enter..."
              className="flex-grow bg-transparent p-1 text-gray-800 outline-none"
            />
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={isLoading || topics.length < 1}
            className="w-full flex items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isLoading ? <><Loader className="animate-spin mr-2" size={20} /> Running Analysis...</> : 'Run Comparative Analysis'}
          </button>
        </div>

        {/* Insights Section - Statistical Charts, Quantitative and Qualitative */}
        {analysisRan && !isLoading && (
          <div className="space-y-6">
            {/* Statistical Comparison Charts */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Publication Trends Chart */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-gray-800">Publication Trends by Year</h3>
                <div className="flex h-64 items-end justify-around gap-2 rounded-lg bg-gray-50 p-4">
                  {/* Leukemia bars */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="relative flex h-full w-8 items-end">
                      <div className="w-full rounded-t bg-purple-400" style={{ height: '45%' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">2020</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="relative flex h-full w-8 items-end">
                      <div className="w-full rounded-t bg-purple-500" style={{ height: '55%' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">2021</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="relative flex h-full w-8 items-end">
                      <div className="w-full rounded-t bg-purple-600" style={{ height: '70%' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">2022</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="relative flex h-full w-8 items-end">
                      <div className="w-full rounded-t bg-purple-700" style={{ height: '85%' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">2023</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="relative flex h-full w-8 items-end">
                      <div className="w-full rounded-t bg-purple-800" style={{ height: '100%' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">2024</span>
                  </div>
                  
                  {/* Lung Cancer bars */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="relative flex h-full w-8 items-end">
                      <div className="w-full rounded-t bg-blue-300" style={{ height: '35%' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">2020</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="relative flex h-full w-8 items-end">
                      <div className="w-full rounded-t bg-blue-400" style={{ height: '42%' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">2021</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="relative flex h-full w-8 items-end">
                      <div className="w-full rounded-t bg-blue-500" style={{ height: '50%' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">2022</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="relative flex h-full w-8 items-end">
                      <div className="w-full rounded-t bg-blue-600" style={{ height: '58%' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">2023</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="relative flex h-full w-8 items-end">
                      <div className="w-full rounded-t bg-blue-700" style={{ height: '65%' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">2024</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-purple-600"></div>
                    <span className="text-sm text-gray-600">Leukemia</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-blue-500"></div>
                    <span className="text-sm text-gray-600">Lung Cancer</span>
                  </div>
                </div>
              </div>

              {/* Top Research Institutions Chart */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-gray-800">Top Research Institutions</h3>
                <div className="flex items-center justify-center rounded-lg bg-gray-50 p-4">
                  <div className="relative h-48 w-48">
                    {/* Pie chart using conic gradient */}
                    <div className="h-full w-full rounded-full shadow-lg" style={{
                      background: 'conic-gradient(from 0deg, #6366f1 0deg 90deg, #ec4899 90deg 180deg, #3b82f6 180deg 270deg, #8b5cf6 270deg 360deg)'
                    }}></div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
                    <span className="text-gray-600">Harvard (25%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-pink-500"></div>
                    <span className="text-gray-600">Johns Hopkins (25%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    <span className="text-gray-600">Stanford (25%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    <span className="text-gray-600">MIT (25%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantitative and Qualitative Insights */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Quantitative Insights */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-gray-800">Quantitative Insights</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="rounded-lg bg-purple-100 p-2 text-purple-600">
                      <FileText size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">15,280</p>
                      <p className="text-sm text-gray-500">Total Publications</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                      <BarChart2 size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">5.76%</p>
                      <p className="text-sm text-gray-500">Scientific Share of Voice</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="rounded-lg bg-green-100 p-2 text-green-600">
                      <University size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">Harvard University</p>
                      <p className="text-sm text-gray-500">Top Institution</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Qualitative Insights */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                  <FileText className="text-cyan-500" size={24} />
                  <h3 className="text-lg font-bold text-gray-800">Qualitative Insights</h3>
                </div>
                <p className="mb-6 text-sm text-gray-500">Breakdown of publication types</p>
                
                <div className="space-y-6">
                  {/* Review Papers */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-semibold text-gray-800">Review Papers</span>
                      <span className="font-bold text-gray-900">1,245</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-cyan-400" style={{ width: '25%' }}></div>
                    </div>
                  </div>

                  {/* Clinical Trials */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-semibold text-gray-800">Clinical Trials</span>
                      <span className="font-bold text-gray-900">890</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-cyan-400" style={{ width: '18%' }}></div>
                    </div>
                  </div>

                  {/* Journal Articles */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-semibold text-gray-800">Journal Articles</span>
                      <span className="font-bold text-gray-900">13,145</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-cyan-400" style={{ width: '86%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Insight Box */}
                <div className="mt-6 flex items-center gap-2 rounded-lg bg-cyan-50 p-4">
                  <svg className="h-5 w-5 flex-shrink-0 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-sm font-medium text-cyan-700">Clinical trials increased by 23% this year</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Three Step Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Step 1: Ask a Question */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-center">
              <div className="rounded-lg bg-blue-50 p-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-blue-100 p-2">
                      <Bot className="text-blue-600" size={20} />
                    </div>
                    <div className="rounded-2xl bg-gray-100 px-4 py-2 text-sm text-gray-700">
                      Hi! How can I help you today?
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <div className="rounded-2xl bg-blue-600 px-4 py-2 text-sm text-white">
                      How many NSCLC patients were treated?
                    </div>
                    <div className="rounded-full bg-blue-600 p-2">
                      <User className="text-white" size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">Step 1: Ask a Question</h3>
            <p className="text-sm text-gray-600">
              Use natural language prompts to start generating insights. Explore therapeutic areas, patient populations, prescribing trends, and more.
            </p>
          </div>

          {/* Step 2: Go Deeper */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-center">
              <div className="rounded-lg bg-blue-50 p-8">
                <div className="space-y-2">
                  <div className="rounded-lg bg-blue-100 px-3 py-1 text-center text-xs text-blue-700">
                    NSCLC patients treated
                  </div>
                  <div className="flex items-end justify-center gap-1">
                    <div className="h-12 w-8 rounded-t bg-blue-400"></div>
                    <div className="h-16 w-8 rounded-t bg-blue-500"></div>
                    <div className="h-14 w-8 rounded-t bg-blue-400"></div>
                    <div className="h-20 w-8 rounded-t bg-blue-600"></div>
                    <div className="h-16 w-8 rounded-t bg-blue-400"></div>
                  </div>
                  <button className="w-full rounded-lg bg-white px-3 py-1 text-xs text-gray-700 shadow-sm">
                    Create a cohort
                  </button>
                </div>
              </div>
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">Step 2: Go Deeper</h3>
            <p className="text-sm text-gray-600">
              Construct highly segmented patient cohorts from a broad array of disease areas, HCP behaviors, and treatments using clinical and therapeutic signals from our Healthcare Map.
            </p>
          </div>

          {/* Step 3: Leverage Findings */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-center">
              <div className="rounded-lg bg-blue-50 p-8">
                <div className="space-y-2">
                  <div className="rounded-lg bg-blue-100 px-3 py-1 text-center text-xs text-blue-700">
                    New Patient Starts
                  </div>
                  <div className="flex items-end justify-center gap-1">
                    <div className="flex h-16 w-6 flex-col">
                      <div className="h-1/4 bg-cyan-400"></div>
                      <div className="h-3/4 bg-blue-500"></div>
                    </div>
                    <div className="flex h-20 w-6 flex-col">
                      <div className="h-1/3 bg-cyan-400"></div>
                      <div className="h-2/3 bg-blue-600"></div>
                    </div>
                    <div className="flex h-16 w-6 flex-col">
                      <div className="h-1/4 bg-cyan-400"></div>
                      <div className="h-3/4 bg-blue-500"></div>
                    </div>
                    <div className="flex h-20 w-6 flex-col">
                      <div className="h-1/3 bg-cyan-400"></div>
                      <div className="h-2/3 bg-blue-600"></div>
                    </div>
                    <div className="flex h-16 w-6 flex-col">
                      <div className="h-1/4 bg-cyan-400"></div>
                      <div className="h-3/4 bg-blue-500"></div>
                    </div>
                    <div className="flex h-20 w-6 flex-col">
                      <div className="h-1/3 bg-cyan-400"></div>
                      <div className="h-2/3 bg-blue-600"></div>
                    </div>
                    <div className="flex h-16 w-6 flex-col">
                      <div className="h-1/4 bg-cyan-400"></div>
                      <div className="h-3/4 bg-blue-500"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">Step 3: Leverage Findings</h3>
            <p className="text-sm text-gray-600">
              Share insights among teams to facilitate and optimize trial design, engagement tactics, commercial strategy, and more.
            </p>
          </div>
        </div>

        {/* Chatbot Section */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h3 className="text-lg font-bold text-gray-800">Ask Questions</h3>
            <p className="text-sm text-gray-500">Get insights based on the analysis above</p>
          </div>
          
          <div className="max-h-96 space-y-4 overflow-y-auto p-6">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''} animate-fade-in`}>
                  <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-white shadow-md ${isUser ? 'bg-purple-600' : 'bg-gray-700'}`}>
                    {isUser ? <User size={18} /> : <Bot size={18} />}
                  </div>
                  <div className={`max-w-md rounded-lg p-3 shadow-sm ${isUser ? 'rounded-br-none bg-purple-600 text-white' : 'rounded-bl-none border border-gray-200 bg-white text-gray-800'}`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-gray-200 bg-white p-4">
            <div className="flex items-center space-x-2 rounded-lg border border-gray-300 bg-gray-50 p-3 transition-all focus-within:ring-2 focus-within:ring-purple-500">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask a question about your analysis..."
                className="flex-grow bg-transparent text-sm text-gray-800 outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="rounded-md bg-purple-600 p-2 text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                disabled={!chatInput.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}