"use client";

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Editor from '@monaco-editor/react';
import { FiPlay, FiCopy, FiCheck, FiMaximize, FiMinimize } from 'react-icons/fi';

interface CodeEditorProps {
  initialCode: string;
  readOnly?: boolean;
  height?: string;
  title?: string;
  language?: string;
  showOutput?: boolean;
}

export default function CodeEditor({
  initialCode,
  readOnly = false,
  height = '400px',
  title = 'C# Code Example',
  language = 'csharp',
  showOutput = true,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Function to copy code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mock function to simulate code execution
  // In a real implementation, this would connect to a backend service
  const runCode = async () => {
    setIsRunning(true);
    setOutput('');
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock output based on the code
      let simulatedOutput = '';
      
      if (code.includes('Console.WriteLine')) {
        const matches = code.match(/Console\.WriteLine\s*\(\s*["'](.+?)["']\s*\)/g);
        if (matches) {
          simulatedOutput = matches
            .map(match => {
              const content = match.match(/["'](.+?)["']/);
              return content ? content[1] : '';
            })
            .join('\n');
        }
      }
      
      if (simulatedOutput === '') {
        simulatedOutput = '// Code executed successfully without console output';
      }
      
      setOutput(simulatedOutput);
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`code-editor ${isFullscreen ? 'fixed inset-0 z-50 p-4 bg-white dark:bg-gray-900' : ''}`}>
      <div className="bg-gray-800 text-white py-2 px-4 flex items-center justify-between rounded-t-md">
        <div className="text-sm font-medium">{title}</div>
        <div className="flex items-center space-x-2">
          {!readOnly && (
            <button 
              onClick={runCode}
              disabled={isRunning}
              className="p-1.5 rounded text-green-400 hover:bg-gray-700 transition-colors"
              title="Run code"
            >
              <FiPlay className={isRunning ? 'animate-pulse' : ''} />
            </button>
          )}
          <button 
            onClick={copyToClipboard}
            className="p-1.5 rounded text-gray-400 hover:bg-gray-700 transition-colors"
            title="Copy code"
          >
            {copied ? <FiCheck className="text-green-400" /> : <FiCopy />}
          </button>
          <button 
            onClick={toggleFullscreen}
            className="p-1.5 rounded text-gray-400 hover:bg-gray-700 transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <FiMinimize /> : <FiMaximize />}
          </button>
        </div>
      </div>
      
      <div className={isFullscreen ? 'h-[calc(100%-10rem)]' : ''}>
        {readOnly ? (
          <SyntaxHighlighter 
            language={language} 
            style={vscDarkPlus}
            customStyle={{ 
              margin: 0,
              borderRadius: '0', 
              minHeight: height
            }}
          >
            {code}
          </SyntaxHighlighter>
        ) : (
          <Editor
            height={isFullscreen ? '100%' : height}
            defaultLanguage={language}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              folding: true,
              readOnly: readOnly,
              automaticLayout: true,
            }}
          />
        )}
      </div>
      
      {showOutput && (
        <div className="border-t border-gray-700">
          <div className="bg-gray-800 text-white py-1 px-4 text-xs font-medium">Output</div>
          <div className="bg-black text-white p-4 font-mono text-sm overflow-auto max-h-40" style={{ whiteSpace: 'pre-wrap' }}>
            {isRunning ? (
              <div className="animate-pulse">Running code...</div>
            ) : output ? (
              output
            ) : (
              <div className="text-gray-500">// Code output will appear here after running</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 