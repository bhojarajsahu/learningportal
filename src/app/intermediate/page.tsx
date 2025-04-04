import React from 'react';
import Link from 'next/link';
import { FiBook, FiCode, FiDatabase, FiGitBranch, FiPackage, FiServer } from 'react-icons/fi';

const intermediateModules = [
  {
    title: 'Object-Oriented Programming',
    description: 'Master the principles of OOP in C# including classes, inheritance, polymorphism, and interfaces.',
    icon: FiCode,
    lessons: [
      { title: 'Classes and Objects', link: '/intermediate/oop/classes' },
      { title: 'Inheritance and Polymorphism', link: '/intermediate/oop/inheritance' },
      { title: 'Interfaces and Abstract Classes', link: '/intermediate/oop/interfaces' },
      { title: 'Encapsulation and Access Modifiers', link: '/intermediate/oop/encapsulation' },
    ],
  },
  {
    title: 'Exception Handling',
    description: 'Learn how to handle errors and exceptions gracefully in your C# applications.',
    icon: FiGitBranch,
    lessons: [
      { title: 'Try-Catch Blocks', link: '/intermediate/exceptions/try-catch' },
      { title: 'Custom Exceptions', link: '/intermediate/exceptions/custom' },
      { title: 'Exception Best Practices', link: '/intermediate/exceptions/best-practices' },
    ],
  },
  {
    title: 'Collections and Generics',
    description: 'Explore advanced data structures and generic programming in C#.',
    icon: FiPackage,
    lessons: [
      { title: 'Generic Types and Methods', link: '/intermediate/collections/generics' },
      { title: 'Advanced Collections', link: '/intermediate/collections/advanced' },
      { title: 'LINQ Fundamentals', link: '/intermediate/collections/linq' },
    ],
  },
  {
    title: 'File I/O and Serialization',
    description: 'Learn how to work with files and serialize data in C# applications.',
    icon: FiServer,
    lessons: [
      { title: 'File Operations', link: '/intermediate/io/file-operations' },
      { title: 'JSON Serialization', link: '/intermediate/io/json' },
      { title: 'XML Serialization', link: '/intermediate/io/xml' },
    ],
  },
  {
    title: 'Database Operations',
    description: 'Connect to and work with databases using Entity Framework Core.',
    icon: FiDatabase,
    lessons: [
      { title: 'Entity Framework Basics', link: '/intermediate/database/ef-basics' },
      { title: 'CRUD Operations', link: '/intermediate/database/crud' },
      { title: 'Relationships and Navigation', link: '/intermediate/database/relationships' },
    ],
  },
];

export default function IntermediatePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Intermediate C# Programming
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Take your C# skills to the next level with advanced concepts and practical applications.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {intermediateModules.map((module, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <module.icon className="w-8 h-8 text-csharp-blue-500 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {module.title}
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{module.description}</p>
              <ul className="space-y-2">
                {module.lessons.map((lesson, lessonIndex) => (
                  <li key={lessonIndex}>
                    <Link
                      href={lesson.link}
                      className="text-csharp-blue-500 hover:text-csharp-blue-600 dark:text-csharp-blue-400 dark:hover:text-csharp-blue-300"
                    >
                      {lesson.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/intermediate/oop/classes"
            className="inline-block bg-csharp-blue-500 hover:bg-csharp-blue-600 text-white font-bold py-2 px-4 rounded shadow"
          >
            Start Learning
          </Link>
        </div>
      </div>
    </div>
  );
} 