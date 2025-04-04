import React from 'react';
import Link from 'next/link';
import { FiCpu, FiBarChart, FiActivity, FiDatabase } from 'react-icons/fi';

export default function PerformanceOptimizationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Performance Optimization in C#
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Learn techniques and best practices for optimizing C# applications for better performance and scalability.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Why Performance Matters</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Performance optimization is a critical aspect of software development that impacts user experience, resource utilization, and operational costs. As C# applications grow in complexity and scale, understanding how to identify and resolve performance bottlenecks becomes essential.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            This module will guide you through advanced techniques to optimize memory usage, improve CPU efficiency, and enhance the overall responsiveness of your C# applications.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <FiActivity className="w-8 h-8 text-red-500 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Memory Management
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Learn how the .NET garbage collector works and how to optimize memory usage in your C# applications.
              Understand common memory issues and how to avoid them.
            </p>
            <ul className="space-y-2 mb-4">
              <li className="ml-4">• Understanding the garbage collector</li>
              <li className="ml-4">• Value types vs reference types</li>
              <li className="ml-4">• Memory leaks and how to prevent them</li>
              <li className="ml-4">• Large object heap optimization</li>
              <li className="ml-4">• Analyzing memory usage with tools</li>
            </ul>
            <Link
              href="/advanced/performance/memory"
              className="inline-block bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Learn Memory Management
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <FiBarChart className="w-8 h-8 text-purple-500 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Profiling and Diagnostics
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Master the tools and techniques for identifying performance bottlenecks in your C# applications.
              Learn how to use profilers and diagnostics tools effectively.
            </p>
            <ul className="space-y-2 mb-4">
              <li className="ml-4">• CPU and memory profiling</li>
              <li className="ml-4">• Performance counters</li>
              <li className="ml-4">• Event Tracing for Windows (ETW)</li>
              <li className="ml-4">• Visual Studio Diagnostics Tools</li>
              <li className="ml-4">• Application Insights and telemetry</li>
            </ul>
            <Link
              href="/advanced/performance/profiling"
              className="inline-block bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
            >
              Learn Profiling and Diagnostics
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <FiDatabase className="w-8 h-8 text-green-500 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Caching Strategies
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Explore various caching techniques to improve application responsiveness and reduce resource consumption.
              Learn when and how to implement different caching solutions.
            </p>
            <ul className="space-y-2 mb-4">
              <li className="ml-4">• Memory caching</li>
              <li className="ml-4">• Distributed caching with Redis</li>
              <li className="ml-4">• Output caching in ASP.NET Core</li>
              <li className="ml-4">• Entity Framework caching</li>
              <li className="ml-4">• Cache invalidation strategies</li>
            </ul>
            <Link
              href="/advanced/performance/caching"
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              Learn Caching Strategies
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/advanced/performance/memory"
            className="inline-block bg-csharp-blue-500 hover:bg-csharp-blue-600 text-white font-bold py-2 px-4 rounded shadow"
          >
            Start Learning Performance Optimization
          </Link>
        </div>
      </div>
    </div>
  );
} 