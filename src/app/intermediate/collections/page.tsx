import React from 'react';
import Link from 'next/link';
import { FiPackage, FiDatabase, FiFilter } from 'react-icons/fi';

const collectionsLessons = [
  {
    title: 'Generic Types and Methods',
    description: 'Learn about generics in C# to create type-safe and reusable code.',
    icon: <FiPackage className="w-8 h-8 text-csharp-blue-500" />,
    href: '/intermediate/collections/generics'
  },
  {
    title: 'Advanced Collections',
    description: 'Explore advanced collection types in C# for specialized scenarios.',
    icon: <FiDatabase className="w-8 h-8 text-csharp-blue-500" />,
    href: '/intermediate/collections/advanced'
  },
  {
    title: 'LINQ Fundamentals',
    description: 'Master Language Integrated Query (LINQ) for powerful data manipulation.',
    icon: <FiFilter className="w-8 h-8 text-csharp-blue-500" />,
    href: '/intermediate/collections/linq'
  }
];

export default function CollectionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Collections and Generics in C#
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Explore the powerful collection types and generic programming features in C# to manage and manipulate data effectively.
        </p>

        <div className="bg-gradient-to-r from-csharp-blue-600 to-csharp-blue-800 rounded-xl p-8 text-white mb-10">
          <h2 className="text-2xl font-bold mb-4">Why Collections and Generics Matter</h2>
          <p className="mb-4">
            Effective data management is at the heart of most applications. Collections and generics provide:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Collections</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Specialized data structures for different scenarios</li>
                <li>Efficient algorithms for storing and retrieving data</li>
                <li>Thread-safe options for concurrent programming</li>
                <li>Specialized implementations for different performance needs</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Generics</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Type safety while maintaining code reusability</li>
                <li>Better performance through elimination of boxing/unboxing</li>
                <li>Reduced code duplication and fewer runtime errors</li>
                <li>More expressive and self-documenting code</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {collectionsLessons.map((lesson, index) => (
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
          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <span className="mr-2 text-csharp-blue-500">•</span>
              <span>How to use generic types and create your own generic classes and methods</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-csharp-blue-500">•</span>
              <span>The various collection types available in .NET and when to use each one</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-csharp-blue-500">•</span>
              <span>How to use specialized collections like Stack, Queue, LinkedList, and ConcurrentDictionary</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-csharp-blue-500">•</span>
              <span>How to use LINQ to query, filter, transform, and aggregate data from any collection</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-csharp-blue-500">•</span>
              <span>Best practices for working with collections and performance considerations</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/intermediate/collections/generics"
            className="inline-block bg-csharp-blue-600 hover:bg-csharp-blue-700 text-white font-semibold py-3 px-6 rounded-md shadow transition-colors"
          >
            Start Learning Collections and Generics
          </Link>
        </div>
      </div>
    </div>
  );
} 