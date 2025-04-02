import React from 'react';
import Link from 'next/link';
import { FiZap, FiCpu, FiActivity, FiCheckSquare } from 'react-icons/fi';

const asyncLessons = [
  {
    title: 'Async/Await Fundamentals',
    description: 'Master the basics of async/await in C# for writing non-blocking code.',
    icon: <FiZap className="w-8 h-8 text-csharp-blue-500" />,
    href: '/advanced/async/basics'
  },
  {
    title: 'Task Parallel Library',
    description: 'Explore the Task Parallel Library (TPL) for managing parallel and concurrent operations.',
    icon: <FiCpu className="w-8 h-8 text-csharp-blue-500" />,
    href: '/advanced/async/tpl'
  },
  {
    title: 'Async Streams',
    description: 'Learn about IAsyncEnumerable and async streams for asynchronous data processing.',
    icon: <FiActivity className="w-8 h-8 text-csharp-blue-500" />,
    href: '/advanced/async/streams'
  },
  {
    title: 'Async Best Practices',
    description: 'Discover best practices and common patterns for effective asynchronous programming.',
    icon: <FiCheckSquare className="w-8 h-8 text-csharp-blue-500" />,
    href: '/advanced/async/best-practices'
  }
];

export default function AsyncPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Asynchronous Programming in C#
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Master advanced asynchronous programming techniques in C# to build responsive and scalable applications.
        </p>

        <div className="bg-gradient-to-r from-csharp-blue-600 to-csharp-blue-800 rounded-xl p-8 text-white mb-10">
          <h2 className="text-2xl font-bold mb-4">Why Asynchronous Programming Matters</h2>
          <p className="mb-6">
            Modern applications need to be responsive, scalable, and efficient. Asynchronous programming is key to achieving these goals by:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ul className="list-disc list-inside space-y-2">
              <li>Preventing UI freezing in client applications</li>
              <li>Improving server application throughput</li>
              <li>Efficiently handling I/O-bound operations</li>
              <li>Making better use of system resources</li>
            </ul>
            <ul className="list-disc list-inside space-y-2">
              <li>Supporting parallel execution of tasks</li>
              <li>Enabling more concurrent operations</li>
              <li>Reducing thread usage for I/O operations</li>
              <li>Creating more responsive applications</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {asyncLessons.map((lesson, index) => (
            <Link href={lesson.href} key={index}>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 h-full">
                <div className="flex items-center mb-4">
                  {lesson.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {lesson.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {lesson.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            What You'll Learn
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This module will teach you to:
          </p>
          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <span className="mr-2 text-csharp-blue-500">•</span>
              <span>Understand the async/await pattern and how it works under the hood</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-csharp-blue-500">•</span>
              <span>Use Task, Task&lt;T&gt;, ValueTask, and ValueTask&lt;T&gt; appropriately</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-csharp-blue-500">•</span>
              <span>Implement parallel processing with the Task Parallel Library</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-csharp-blue-500">•</span>
              <span>Work with asynchronous streams for data processing</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-csharp-blue-500">•</span>
              <span>Handle cancellation, exceptions, and error propagation in async code</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-csharp-blue-500">•</span>
              <span>Apply best practices for performance and resource management</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/advanced/async/basics"
            className="inline-block bg-csharp-blue-600 hover:bg-csharp-blue-700 text-white font-semibold py-3 px-6 rounded-md shadow transition-colors"
          >
            Start Learning Async Programming
          </Link>
        </div>
      </div>
    </div>
  );
} 