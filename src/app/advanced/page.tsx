import React from 'react';
import Link from 'next/link';
import { FiCloud, FiCpu, FiGitMerge, FiLock, FiServer, FiZap } from 'react-icons/fi';

const advancedModules = [
  {
    title: 'Asynchronous Programming',
    description: 'Master async/await patterns and parallel programming in C#.',
    icon: FiZap,
    lessons: [
      { title: 'Async/Await Fundamentals', link: '/advanced/async/basics' },
      { title: 'Task Parallel Library', link: '/advanced/async/tpl' },
      { title: 'Async Streams', link: '/advanced/async/streams' },
      { title: 'Async Best Practices', link: '/advanced/async/best-practices' },
    ],
  },
  {
    title: 'Design Patterns',
    description: 'Learn and implement common design patterns in C# applications.',
    icon: FiGitMerge,
    lessons: [
      { title: 'Creational Patterns', link: '/advanced/patterns/creational' },
      { title: 'Structural Patterns', link: '/advanced/patterns/structural' },
      { title: 'Behavioral Patterns', link: '/advanced/patterns/behavioral' },
    ],
  },
  {
    title: 'Cloud Development',
    description: 'Build and deploy cloud-native applications using Azure services.',
    icon: FiCloud,
    lessons: [
      { title: 'Azure Fundamentals', link: '/advanced/cloud/azure-basics' },
      { title: 'Microservices Architecture', link: '/advanced/cloud/microservices' },
      { title: 'Containerization with Docker', link: '/advanced/cloud/docker' },
    ],
  },
  {
    title: 'Performance Optimization',
    description: 'Optimize your C# applications for better performance and scalability.',
    icon: FiCpu,
    lessons: [
      { title: 'Memory Management', link: '/advanced/performance/memory' },
      { title: 'Profiling and Diagnostics', link: '/advanced/performance/profiling' },
      { title: 'Caching Strategies', link: '/advanced/performance/caching' },
    ],
  },
  {
    title: 'Security Best Practices',
    description: 'Implement security measures and protect your C# applications.',
    icon: FiLock,
    lessons: [
      { title: 'Authentication and Authorization', link: '/advanced/security/auth' },
      { title: 'Data Protection', link: '/advanced/security/data-protection' },
      { title: 'Security Vulnerabilities', link: '/advanced/security/vulnerabilities' },
    ],
  },
  {
    title: 'Enterprise Architecture',
    description: 'Design and implement enterprise-level C# applications.',
    icon: FiServer,
    lessons: [
      { title: 'Clean Architecture', link: '/advanced/enterprise/clean-architecture' },
      { title: 'Domain-Driven Design', link: '/advanced/enterprise/ddd' },
      { title: 'Event Sourcing', link: '/advanced/enterprise/event-sourcing' },
    ],
  },
];

export default function AdvancedPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Advanced C# Programming
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Dive deep into advanced C# concepts and enterprise-level development practices.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {advancedModules.map((module, index) => (
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
            href="/advanced/async/basics"
            className="inline-block bg-csharp-blue-500 hover:bg-csharp-blue-600 text-white font-bold py-2 px-4 rounded shadow"
          >
            Start Learning
          </Link>
        </div>
      </div>
    </div>
  );
} 