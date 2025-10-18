// src/app/page.tsx
"use client";

import React, { useState } from 'react';
import { X, Loader, Send, Bot, User, FileText, BarChart2, University, AlertCircle } from 'lucide-react';
import { type ComparativeAnalysis, calculateGrowthRate } from '@/services/analysisService';

interface MessageType {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export default function Home() {
  const [topics, setTopics] = useState<string[]>(['Leukemia', 'Lung Cancer']);
  const [inputValue, setInputValue] = useState('');
  const [authors, setAuthors] = useState<string[]>([]);
  const [authorInput, setAuthorInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisRan, setAnalysisRan] = useState(false);
  const [analysisData, setAnalysisData] = useState<ComparativeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! I'm ready to answer questions based on your analysis. What would you like to know?",
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

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

  const handleAddAuthor = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && authorInput.trim()) {
      e.preventDefault();
      const newAuthor = authorInput.trim();
      if (!authors.includes(newAuthor)) {
        setAuthors([...authors, newAuthor]);
      }
      setAuthorInput('');
    }
  };

  const handleRemoveAuthor = (authorToRemove: string) => {
    setAuthors(authors.filter(author => author !== authorToRemove));
  };
  
  const handleRunAnalysis = async () => {
    if (topics.length < 1 && authors.length < 1) return;
    setIsLoading(true);
    setAnalysisRan(false);
    setError(null);
    
    try {
      // Call the API route with both topics and authors
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topics, authors }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Analysis API error:', response.status, errorData);
        throw new Error(`Failed to fetch analysis data: ${errorData.error || response.statusText}`);
      }

      const data: ComparativeAnalysis = await response.json();
      console.log('Analysis data received:', data);
      setAnalysisData(data);
      setAnalysisRan(true);
    } catch (err) {
      console.error('Analysis error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: MessageType = {
      id: Date.now(),
      sender: 'user',
      text: chatInput,
    };

    // Add user message immediately
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setChatInput('');
    setIsChatLoading(true);

    try {
      // Prepare chat history for Cohere (exclude the current message)
      const chatHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'USER' as const : 'CHATBOT' as const,
        message: msg.text,
      }));

      // Call Cohere API through our API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: chatInput,
          analysisData,
          chatHistory,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Chat API error:', response.status, errorData);
        throw new Error(`Failed to get AI response: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      
      const botResponse: MessageType = {
        id: Date.now() + 1,
        sender: 'bot',
        text: data.response,
      };

      setMessages([...updatedMessages, botResponse]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorResponse: MessageType = {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages([...updatedMessages, errorResponse]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col bg-gray-900 font-sans">
      <div className="mx-auto w-full max-w-7xl space-y-6 p-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">Research AI Assistant</h1>
          <p className="mt-2 text-gray-300">Comparative analysis and insights across research topics</p>
        </div>

        {/* Analysis Section */}
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-white">Analysis Hub</h2>
          
          {/* Topics Section */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-gray-300">Research Topics</label>
            <div className="mb-2 flex flex-wrap gap-2">
              {topics.map(topic => (
                <div key={topic} className="flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-sm font-medium text-white">
                  {topic}
                  <button onClick={() => handleRemoveTopic(topic)} className="ml-1 hover:text-blue-200">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-gray-600 bg-gray-700 p-3">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleAddTopic}
                placeholder="Add research topic (e.g., Leukemia, COVID-19) and press Enter..."
                className="flex-grow bg-transparent p-1 text-gray-100 placeholder-gray-400 outline-none"
              />
            </div>
          </div>

          {/* Authors Section */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-gray-300">Author Names</label>
            <div className="mb-2 flex flex-wrap gap-2">
              {authors.map(author => (
                <div key={author} className="flex items-center gap-1 rounded-full bg-purple-600 px-3 py-1 text-sm font-medium text-white">
                  {author}
                  <button onClick={() => handleRemoveAuthor(author)} className="ml-1 hover:text-purple-200">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-gray-600 bg-gray-700 p-3">
              <input
                type="text"
                value={authorInput}
                onChange={e => setAuthorInput(e.target.value)}
                onKeyDown={handleAddAuthor}
                placeholder="Add author name (e.g., John Smith, Jane Doe) and press Enter..."
                className="flex-grow bg-transparent p-1 text-gray-100 placeholder-gray-400 outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={isLoading || (topics.length < 1 && authors.length < 1)}
            className="w-full flex items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-gray-600"
          >
            {isLoading ? <><Loader className="animate-spin mr-2" size={20} /> Running Analysis...</> : 'Run Comparative Analysis'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg border border-red-800 bg-red-900/30 p-4 flex items-center gap-3">
            <AlertCircle className="text-red-400" size={24} />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Insights Section - Statistical Charts, Quantitative and Qualitative */}
        {analysisRan && !isLoading && analysisData && (
          <div className="space-y-6">
            {/* Statistical Comparison Charts */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Publication Trends Chart */}
              <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-white">Publication Trends by Year</h3>
                <div className="rounded-lg bg-gray-700 p-4">
                  <div className="flex h-48 items-end justify-around gap-1">
                    {(() => {
                      const colors = ['purple', 'blue', 'green', 'orange', 'pink'];
                      const maxCount = Math.max(
                        ...analysisData.results.flatMap(r => r.publicationTrends.map(t => t.count))
                      );
                      
                      return analysisData.results[0]?.publicationTrends.map((trend, yearIdx) => (
                        <div key={`year-${trend.year}`} className="flex flex-col items-center gap-1">
                          <div className="flex items-end h-40 gap-1">
                            {analysisData.results.map((result, topicIdx) => {
                              const yearData = result.publicationTrends[yearIdx];
                              const height = maxCount > 0 ? (yearData.count / maxCount) * 100 : 0;
                              const colorClass = `bg-${colors[topicIdx % colors.length]}-${400 + topicIdx * 100}`;
                              return (
                                <div
                                  key={`${result.topic}-${yearData.year}`}
                                  className={`w-6 rounded-t ${colorClass}`}
                                  style={{ height: `${height}%` }}
                                  title={`${result.topic}: ${yearData.count}`}
                                ></div>
                              );
                            })}
                          </div>
                          <span className="text-xs text-gray-500 mt-1">{trend.year}</span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
                <div className="mt-4 flex justify-center gap-4 flex-wrap">
                  {analysisData.results.map((result, idx) => {
                    const colors = ['purple', 'blue', 'green', 'orange', 'pink'];
                    const colorClass = `bg-${colors[idx % colors.length]}-600`;
                    return (
                      <div key={result.topic} className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded ${colorClass}`}></div>
                        <span className="text-sm text-gray-300">{result.topic}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Research Institutions Chart */}
              <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-white">Top Research Institutions</h3>
                <div className="flex items-center justify-center rounded-lg bg-gray-700 p-4">
                  <div className="relative h-48 w-48">
                    {/* Pie chart using conic gradient */}
                    {(() => {
                      const topInsts = analysisData.combinedInstitutions.slice(0, 4);
                      const colors = ['#6366f1', '#ec4899', '#3b82f6', '#8b5cf6'];
                      let currentDeg = 0;
                      const gradientParts = topInsts.map((inst, idx) => {
                        const deg = (inst.percentage / 100) * 360;
                        const start = currentDeg;
                        const end = currentDeg + deg;
                        currentDeg = end;
                        return `${colors[idx]} ${start}deg ${end}deg`;
                      }).join(', ');
                      
                      return (
                        <div className="h-full w-full rounded-full shadow-lg" style={{
                          background: `conic-gradient(from 0deg, ${gradientParts})`
                        }}></div>
                      );
                    })()}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  {analysisData.combinedInstitutions.slice(0, 4).map((inst, idx) => {
                    const colors = ['indigo', 'pink', 'blue', 'purple'];
                    return (
                      <div key={inst.name} className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full bg-${colors[idx]}-500`}></div>
                        <span className="text-gray-300">{inst.name.substring(0, 20)} ({inst.percentage.toFixed(0)}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quantitative and Qualitative Insights */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Quantitative Insights */}
              <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-white">Quantitative Insights</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 rounded-lg border border-gray-600 bg-gray-700 p-4">
                    <div className="rounded-lg bg-purple-100 p-2 text-purple-600">
                      <FileText size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">
                        {analysisData.results.reduce((sum, r) => sum + r.totalPublications, 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-400">Total Publications</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 rounded-lg border border-gray-600 bg-gray-700 p-4">
                    <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                      <BarChart2 size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">
                        {analysisData.results[0]?.averageCitations.toFixed(1) || '0'}
                      </p>
                      <p className="text-sm text-gray-400">Avg Citations Per Paper</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 rounded-lg border border-gray-600 bg-gray-700 p-4">
                    <div className="rounded-lg bg-green-100 p-2 text-green-600">
                      <University size={24} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">
                        {analysisData.combinedInstitutions[0]?.name.substring(0, 25) || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-400">Top Institution</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Qualitative Insights */}
              <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                  <FileText className="text-cyan-500" size={24} />
                  <h3 className="text-lg font-bold text-white">Qualitative Insights</h3>
                </div>
                <p className="mb-6 text-sm text-gray-400">Breakdown of publication types</p>
                
                <div className="space-y-6">
                  {(() => {
                    const allTypes = analysisData.results[0]?.publicationTypes || [];
                    const totalTypes = allTypes.reduce((sum, t) => sum + t.count, 0);
                    
                    return allTypes.slice(0, 3).map((pubType) => {
                      const percentage = totalTypes > 0 ? (pubType.count / totalTypes) * 100 : 0;
                      return (
                        <div key={pubType.type}>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="font-semibold text-gray-200">{pubType.type}</span>
                            <span className="font-bold text-white">{pubType.count.toLocaleString()}</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-600">
                            <div className="h-full rounded-full bg-cyan-400" style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>

                {/* Insight Box */}
                <div className="mt-6 flex items-center gap-2 rounded-lg bg-cyan-900/30 p-4">
                  <svg className="h-5 w-5 flex-shrink-0 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-sm font-medium text-cyan-300">
                    {(() => {
                      const firstTopic = analysisData.results[0];
                      if (firstTopic) {
                        const growthRate = calculateGrowthRate(firstTopic.publicationTrends);
                        return `${firstTopic.topic} publications ${growthRate > 0 ? 'increased' : 'decreased'} by ${Math.abs(growthRate).toFixed(1)}%`;
                      }
                      return 'Analysis complete';
                    })()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Three Step Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Step 1: Ask a Question */}
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-center">
              <div className="rounded-lg bg-gray-700 p-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-gray-600 p-2">
                      <Bot className="text-blue-600" size={20} />
                    </div>
                    <div className="rounded-2xl bg-gray-600 px-4 py-2 text-sm text-gray-200">
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
            <h3 className="mb-2 text-xl font-bold text-white">Step 1: Ask a Question</h3>
            <p className="text-sm text-gray-300">
              Use natural language prompts to start generating insights. Explore therapeutic areas, patient populations, prescribing trends, and more.
            </p>
          </div>

          {/* Step 2: Go Deeper */}
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-center">
              <div className="rounded-lg bg-gray-700 p-8">
                <div className="space-y-2">
                  <div className="rounded-lg bg-gray-600 px-3 py-1 text-center text-xs text-gray-200">
                    NSCLC patients treated
                  </div>
                  <div className="flex items-end justify-center gap-1">
                    <div className="h-12 w-8 rounded-t bg-blue-400"></div>
                    <div className="h-16 w-8 rounded-t bg-blue-500"></div>
                    <div className="h-14 w-8 rounded-t bg-blue-400"></div>
                    <div className="h-20 w-8 rounded-t bg-blue-600"></div>
                    <div className="h-16 w-8 rounded-t bg-blue-400"></div>
                  </div>
                  <button className="w-full rounded-lg bg-gray-600 px-3 py-1 text-xs text-gray-200 shadow-sm">
                    Create a cohort
                  </button>
                </div>
              </div>
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">Step 2: Go Deeper</h3>
            <p className="text-sm text-gray-300">
              Construct highly segmented patient cohorts from a broad array of disease areas, HCP behaviors, and treatments using clinical and therapeutic signals from our Healthcare Map.
            </p>
          </div>

          {/* Step 3: Leverage Findings */}
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-center">
              <div className="rounded-lg bg-gray-700 p-8">
                <div className="space-y-2">
                  <div className="rounded-lg bg-gray-600 px-3 py-1 text-center text-xs text-gray-200">
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
            <h3 className="mb-2 text-xl font-bold text-white">Step 3: Leverage Findings</h3>
            <p className="text-sm text-gray-300">
              Share insights among teams to facilitate and optimize trial design, engagement tactics, commercial strategy, and more.
            </p>
          </div>
        </div>

        {/* Chatbot Section */}
        <div className="rounded-lg border border-gray-700 bg-gray-800 shadow-sm">
          <div className="border-b border-gray-700 bg-gray-750 px-6 py-4">
            <h3 className="text-lg font-bold text-white">Ask Questions</h3>
            <p className="text-sm text-gray-400">Get insights based on the analysis above</p>
          </div>
          
          <div className="max-h-96 space-y-4 overflow-y-auto p-6">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''} animate-fade-in`}>
                  <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-white shadow-md ${isUser ? 'bg-purple-600' : 'bg-gray-700'}`}>
                    {isUser ? <User size={18} /> : <Bot size={18} />}
                  </div>
                  <div className={`max-w-md rounded-lg p-3 shadow-sm ${isUser ? 'rounded-br-none bg-purple-600 text-white' : 'rounded-bl-none border border-gray-600 bg-gray-700 text-gray-100'}`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              );
            })}
            {isChatLoading && (
              <div className="flex items-start gap-3 animate-fade-in">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-white shadow-md bg-gray-700">
                  <Bot size={18} />
                </div>
                <div className="max-w-md rounded-lg p-3 shadow-sm rounded-bl-none border border-gray-600 bg-gray-700 text-gray-100">
                  <div className="flex items-center gap-2">
                    <Loader className="animate-spin" size={16} />
                    <span className="text-sm text-gray-500">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-700 bg-gray-800 p-4">
            <div className="flex items-center space-x-2 rounded-lg border border-gray-600 bg-gray-700 p-3 transition-all focus-within:ring-2 focus-within:ring-purple-500">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isChatLoading && handleSendMessage()}
                placeholder="Ask a question about your analysis..."
                className="flex-grow bg-transparent text-sm text-gray-100 placeholder-gray-400 outline-none"
                disabled={isChatLoading}
              />
              <button
                onClick={handleSendMessage}
                className="rounded-md bg-purple-600 p-2 text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                disabled={!chatInput.trim() || isChatLoading}
              >
                {isChatLoading ? <Loader className="animate-spin" size={18} /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}