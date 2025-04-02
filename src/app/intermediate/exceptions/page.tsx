import React from 'react';
import Link from 'next/link';
import { FiAlertTriangle, FiCode, FiFileText, FiCheckCircle } from 'react-icons/fi';

const exceptionLessons = [
  {
    title: 'Try-Catch Blocks',
    description: 'Learn how to handle errors and exceptions gracefully in your C# applications.',
    icon: <FiAlertTriangle className="w-8 h-8 text-csharp-blue-500" />,
    href: '/intermediate/exceptions/try-catch'
  },
  {
    title: 'Custom Exceptions',
    description: 'Create your own exception types for more specific error handling.',
    icon: <FiCode className="w-8 h-8 text-csharp-blue-500" />,
    href: '/intermediate/exceptions/custom'
  },
  {
    title: 'Exception Best Practices',
    description: 'Discover best practices and common patterns for effective exception handling.',
    icon: <FiCheckCircle className="w-8 h-8 text-csharp-blue-500" />,
    href: '/intermediate/exceptions/best-practices'
  }
];

export default function ExceptionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Exception Handling in C#
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Learn how to handle errors and exceptional situations in your C# applications with proper exception handling techniques.
        </p>

        <div className="bg-gradient-to-r from-csharp-blue-600 to-csharp-blue-800 rounded-xl p-8 text-white mb-10">
          <div className="flex items-start">
            <FiFileText className="w-12 h-12 mr-6 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold mb-4">Why Exception Handling Matters</h2>
              <p className="mb-4">
                Exception handling is a critical aspect of software development that allows your applications to:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Gracefully handle unexpected errors</li>
                <li>Provide meaningful feedback to users</li>
                <li>Recover from error conditions when possible</li>
                <li>Maintain data integrity and application state</li>
                <li>Log issues for troubleshooting and improvement</li>
              </ul>
              <p>
                Well-implemented exception handling can be the difference between an application that crashes 
                and one that gracefully handles problems and continues to function.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {exceptionLessons.map((lesson, index) => (
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
            Learning Path
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We recommend completing these lessons in order:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Start with <Link href="/intermediate/exceptions/try-catch" className="text-csharp-blue-600 dark:text-csharp-blue-400 hover:underline">Try-Catch Blocks</Link> to learn the fundamentals of exception handling</li>
            <li>Move on to <Link href="/intermediate/exceptions/custom" className="text-csharp-blue-600 dark:text-csharp-blue-400 hover:underline">Custom Exceptions</Link> to create your own exception types</li>
            <li>Finally, study <Link href="/intermediate/exceptions/best-practices" className="text-csharp-blue-600 dark:text-csharp-blue-400 hover:underline">Exception Best Practices</Link> to master effective error handling techniques</li>
          </ol>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/intermediate/exceptions/try-catch"
            className="inline-block bg-csharp-blue-600 hover:bg-csharp-blue-700 text-white font-semibold py-3 px-6 rounded-md shadow transition-colors"
          >
            Start Learning Exception Handling
          </Link>
        </div>
      </div>
    </div>
  );
} 