"use client";

import React from 'react';
import Link from 'next/link';
import { FiArrowRight, FiBook, FiCode, FiCpu, FiDatabase } from 'react-icons/fi';

const beginnerModules = [
  {
    title: 'Getting Started',
    description: 'Learn about C# and set up your development environment',
    icon: <FiBook className="h-8 w-8 text-csharp-blue-500" />,
    lessons: [
      { title: 'Introduction to C#', href: '/beginner/introduction' },
      { title: 'Setting Up Your Environment', href: '/beginner/setup' },
      { title: 'Your First C# Program', href: '/beginner/first-program' },
    ]
  },
  {
    title: 'C# Basics',
    description: 'Master the fundamental building blocks of C# programming',
    icon: <FiCode className="h-8 w-8 text-csharp-blue-500" />,
    lessons: [
      { title: 'Variables and Data Types', href: '/beginner/data-types' },
      { title: 'Operators', href: '/beginner/operators' },
      { title: 'Type Conversion', href: '/beginner/type-conversion' },
    ]
  },
  {
    title: 'Control Structures',
    description: 'Learn to control the flow of your C# programs',
    icon: <FiCpu className="h-8 w-8 text-csharp-blue-500" />,
    lessons: [
      { title: 'If Statements', href: '/beginner/if-statements' },
      { title: 'Switch Statements', href: '/beginner/switch' },
      { title: 'Loops', href: '/beginner/loops' },
    ]
  },
  {
    title: 'Functions and Methods',
    description: 'Organize code into reusable blocks with methods',
    icon: <FiDatabase className="h-8 w-8 text-csharp-blue-500" />,
    lessons: [
      { title: 'Methods Basics', href: '/beginner/methods' },
      { title: 'Parameters and Return Values', href: '/beginner/parameters' },
      { title: 'Method Overloading', href: '/beginner/overloading' },
    ]
  }
];

export default function BeginnerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-csharp-blue-600 dark:text-csharp-blue-400 mb-4">
            Beginner C# Programming
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Start your C# journey with these foundational modules designed for complete beginners
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {beginnerModules.map((module, index) => (
            <div key={index} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start">
                <div className="mr-4 p-2 bg-csharp-blue-50 dark:bg-csharp-blue-900/20 rounded-lg">
                  {module.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-csharp-blue-700 dark:text-csharp-blue-400 mb-2">
                    {module.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {module.description}
                  </p>

                  <ul className="space-y-1 mb-4">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <li key={lessonIndex}>
                        <Link
                          href={lesson.href}
                          className="text-csharp-blue-600 dark:text-csharp-blue-400 hover:underline flex items-center"
                        >
                          <FiArrowRight className="mr-2 h-3 w-3" />
                          <span>{lesson.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-csharp-blue-500 to-csharp-blue-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Begin Your C# Journey?</h2>
          <p className="mb-6">
            Start with the Introduction to C# to learn the basics and get ready for more advanced topics.
          </p>
          <Link
            href="/beginner/introduction"
            className="inline-block bg-white text-csharp-blue-600 hover:bg-gray-100 px-6 py-3 rounded-full font-bold transition-colors"
          >
            Start Learning Now
          </Link>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            After completing the beginner modules, you'll be ready to move on to the{' '}
            <Link href="/intermediate" className="text-csharp-blue-600 dark:text-csharp-blue-400 hover:underline">
              intermediate C# concepts
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
} 