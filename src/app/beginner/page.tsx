"use client";

import React from 'react';
import Link from 'next/link';
import { FiCode, FiBox, FiList, FiGitBranch, FiFileText, FiLayout } from 'react-icons/fi';

const beginnerModules = [
  {
    title: 'C# Fundamentals',
    description: 'Learn the core concepts of C# programming including syntax, variables, and control flow.',
    icon: FiCode,
    lessons: [
      { title: 'Getting Started', link: '/beginner/fundamentals/getting-started' },
      { title: 'Variables and Data Types', link: '/beginner/fundamentals/variables' },
      { title: 'Control Flow', link: '/beginner/fundamentals/control-flow' },
      { title: 'Methods and Functions', link: '/beginner/fundamentals/methods' },
    ],
  },
  {
    title: 'Object-Oriented Basics',
    description: 'Understand the foundational principles of object-oriented programming in C#.',
    icon: FiBox,
    lessons: [
      { title: 'Classes and Objects', link: '/beginner/oop/classes' },
      { title: 'Properties and Fields', link: '/beginner/oop/properties' },
      { title: 'Inheritance Basics', link: '/beginner/oop/inheritance' },
      { title: 'Interfaces Intro', link: '/beginner/oop/interfaces' },
    ],
  },
  {
    title: 'Collections',
    description: 'Work with various types of collections to store and manipulate data in your applications.',
    icon: FiList,
    lessons: [
      { title: 'Arrays', link: '/beginner/collections/arrays' },
      { title: 'Lists', link: '/beginner/collections/lists' },
      { title: 'Dictionaries', link: '/beginner/collections/dictionaries' },
      { title: 'Collection Methods', link: '/beginner/collections/methods' },
    ],
  },
  {
    title: 'Error Handling',
    description: 'Learn how to handle errors and exceptions in your C# programs for better stability.',
    icon: FiGitBranch,
    lessons: [
      { title: 'Try-Catch Basics', link: '/beginner/errors/try-catch' },
      { title: 'Exception Types', link: '/beginner/errors/exception-types' },
      { title: 'Throwing Exceptions', link: '/beginner/errors/throwing' },
    ],
  },
  {
    title: 'File Operations',
    description: 'Read from and write to files using C#\'s built-in file handling capabilities.',
    icon: FiFileText,
    lessons: [
      { title: 'Reading Files', link: '/beginner/files/reading' },
      { title: 'Writing Files', link: '/beginner/files/writing' },
      { title: 'File Management', link: '/beginner/files/management' },
    ],
  },
  {
    title: 'Console Applications',
    description: 'Build complete console applications that interact with users through the command line.',
    icon: FiLayout,
    lessons: [
      { title: 'User Input', link: '/beginner/console/user-input' },
      { title: 'Output Formatting', link: '/beginner/console/formatting' },
      { title: 'Simple Console App', link: '/beginner/console/simple-app' },
    ],
  },
];

export default function BeginnerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Beginner C# Programming
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Start your journey with C# programming and build a solid foundation with these essential concepts.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {beginnerModules.map((module, index) => (
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
            href="/beginner/fundamentals/getting-started"
            className="inline-block bg-csharp-blue-500 hover:bg-csharp-blue-600 text-white font-bold py-2 px-4 rounded shadow"
          >
            Start Learning
          </Link>
        </div>
      </div>
    </div>
  );
} 