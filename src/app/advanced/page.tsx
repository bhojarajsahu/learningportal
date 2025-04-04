import React from 'react';
import Link from 'next/link';
import { FiZap, FiCode, FiShield, FiCloud, FiDatabase, FiCpu } from 'react-icons/fi';

const advancedModules = [
  {
    title: 'Asynchronous Programming',
    description: 'Master advanced asynchronous programming techniques in C# for building responsive and scalable applications.',
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
    description: 'Learn essential design patterns to solve common software design problems in elegant and maintainable ways.',
    icon: FiCode,
    lessons: [
      { title: 'Creational Patterns', link: '/advanced/patterns/creational' },
      { title: 'Structural Patterns', link: '/advanced/patterns/structural' },
      { title: 'Behavioral Patterns', link: '/advanced/patterns/behavioral' },
    ],
  },
  {
    title: 'Security',
    description: 'Implement robust security practices in your C# applications to protect data and prevent common vulnerabilities.',
    icon: FiShield,
    lessons: [
      { title: 'Authentication & Authorization', link: '/advanced/security/authentication' },
      { title: 'Common Vulnerabilities', link: '/advanced/security/vulnerabilities' },
      { title: 'Data Protection', link: '/advanced/security/data-protection' },
    ],
  },
  {
    title: 'Cloud Development',
    description: 'Build scalable cloud-native applications using C# and Azure services.',
    icon: FiCloud,
    lessons: [
      { title: 'Azure Fundamentals', link: '/advanced/cloud/azure' },
      { title: 'Microservices Architecture', link: '/advanced/cloud/microservices' },
      { title: 'Containerization with Docker', link: '/advanced/cloud/docker' },
    ],
  },
  {
    title: 'Performance Optimization',
    description: 'Optimize your C# applications for better performance, scalability, and resource utilization.',
    icon: FiCpu,
    lessons: [
      { title: 'Memory Management', link: '/advanced/performance/memory' },
      { title: 'Profiling and Diagnostics', link: '/advanced/performance/profiling' },
      { title: 'Caching Strategies', link: '/advanced/performance/caching' },
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
          Take your C# expertise to the professional level with advanced concepts and best practices.
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