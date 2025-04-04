import React from 'react';
import Link from 'next/link';
import { FiDatabase, FiCode, FiCpu, FiClock } from 'react-icons/fi';

export default function IntermediatePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Intermediate C# Programming</h1>
      
      <p className="text-lg mb-8">
        Welcome to the intermediate level of C# programming. Here you'll deepen your understanding of 
        important C# concepts and technologies that are essential for building robust applications.
      </p>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">What You'll Learn</h2>
        <p className="mb-4">
          The intermediate modules build upon your foundational knowledge of C# to explore
          more advanced concepts and techniques used in professional software development:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Working with data more efficiently using LINQ</li>
          <li>Writing responsive applications with asynchronous programming</li>
          <li>Managing database operations with Entity Framework Core</li>
        </ul>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <FiCode className="h-6 w-6 text-indigo-500 mr-2" />
            <h3 className="text-xl font-semibold">LINQ</h3>
          </div>
          <p className="mb-4">
            Language Integrated Query (LINQ) is a powerful feature that provides a consistent syntax to query 
            various data sources. Learn how to write elegant and efficient data operations.
          </p>
          <div className="space-y-2">
            <Link href="/intermediate/linq/fundamentals" className="block text-blue-600 dark:text-blue-400 hover:underline">
              → LINQ Fundamentals
            </Link>
            <Link href="/intermediate/linq/advanced" className="block text-blue-600 dark:text-blue-400 hover:underline">
              → Advanced LINQ Operations
            </Link>
            <Link href="/intermediate/linq/entity-framework" className="block text-blue-600 dark:text-blue-400 hover:underline">
              → LINQ to Entities
            </Link>
          </div>
          <Link href="/intermediate/linq" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Start Learning LINQ
          </Link>
        </div>
        
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <FiClock className="h-6 w-6 text-green-500 mr-2" />
            <h3 className="text-xl font-semibold">Asynchronous Programming</h3>
          </div>
          <p className="mb-4">
            Build responsive applications by learning how to use asynchronous programming with async/await. 
            Understand Tasks, thread management, and common patterns for non-blocking operations.
          </p>
          <div className="space-y-2">
            <Link href="/intermediate/async" className="block text-blue-600 dark:text-blue-400 hover:underline">
              → Async/Await Concepts
            </Link>
            <span className="block text-gray-500">→ Tasks and Thread Management</span>
            <span className="block text-gray-500">→ Asynchronous Patterns</span>
          </div>
          <Link href="/intermediate/async" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Start Learning Async
          </Link>
        </div>
        
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <FiDatabase className="h-6 w-6 text-purple-500 mr-2" />
            <h3 className="text-xl font-semibold">Entity Framework Core</h3>
          </div>
          <p className="mb-4">
            Master database operations using Entity Framework Core, Microsoft's modern ORM for .NET. 
            Learn how to model databases, perform CRUD operations, and optimize performance.
          </p>
          <div className="space-y-2">
            <Link href="/intermediate/entity-framework" className="block text-blue-600 dark:text-blue-400 hover:underline">
              → Entity Framework Basics
            </Link>
            <span className="block text-gray-500">→ Relationships and Navigation</span>
            <span className="block text-gray-500">→ Performance Optimization</span>
          </div>
          <Link href="/intermediate/entity-framework" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Start Learning EF Core
          </Link>
        </div>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800">
        <h3 className="text-xl font-semibold mb-3">Prerequisites</h3>
        <p className="mb-4">
          Before starting the intermediate modules, you should have a good understanding of:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>C# language fundamentals (variables, data types, control flow)</li>
          <li>Object-oriented programming concepts</li>
          <li>Methods, properties, and events</li>
          <li>Exception handling</li>
          <li>Collections and generics</li>
        </ul>
        <p className="mt-4">
          If you need to review these topics, visit our <Link href="/beginner" className="text-blue-600 dark:text-blue-400 hover:underline">Beginner C# section</Link>.
        </p>
      </div>
    </div>
  );
} 