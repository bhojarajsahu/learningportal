import React from 'react';
import Link from 'next/link';
import { FiGitMerge, FiAward, FiLayers, FiActivity } from 'react-icons/fi';

export default function DesignPatternsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Design Patterns in C#
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Learn how to implement proven solutions to common architectural problems in C# applications.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">What are Design Patterns?</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Design patterns are reusable solutions to common problems that occur in software design. They represent best practices evolved over time by experienced software developers. Design patterns aren't finished designs that can be transformed directly into code but rather templates for how to solve a problem that can be used in many different situations.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Design patterns help you write more maintainable and flexible code by providing tested, proven development paradigms.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <FiAward className="w-8 h-8 text-green-500 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Creational Patterns
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Creational design patterns abstract the instantiation process, helping make a system independent of how its objects are created, composed, and represented.
            </p>
            <ul className="space-y-2 mb-4">
              <li className="ml-4">• Singleton Pattern</li>
              <li className="ml-4">• Factory Method Pattern</li>
              <li className="ml-4">• Abstract Factory Pattern</li>
              <li className="ml-4">• Builder Pattern</li>
              <li className="ml-4">• Prototype Pattern</li>
            </ul>
            <Link
              href="/advanced/patterns/creational"
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              Learn Creational Patterns
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <FiLayers className="w-8 h-8 text-blue-500 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Structural Patterns
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Structural design patterns focus on how classes and objects are composed to form larger structures, simplifying these structures and identifying relationships.
            </p>
            <ul className="space-y-2 mb-4">
              <li className="ml-4">• Adapter Pattern</li>
              <li className="ml-4">• Decorator Pattern</li>
              <li className="ml-4">• Composite Pattern</li>
              <li className="ml-4">• Facade Pattern</li>
              <li className="ml-4">• Proxy Pattern</li>
            </ul>
            <Link
              href="/advanced/patterns/structural"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Learn Structural Patterns
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <FiActivity className="w-8 h-8 text-purple-500 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Behavioral Patterns
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Behavioral design patterns focus on algorithms and the assignment of responsibilities between objects, improving communication between them.
            </p>
            <ul className="space-y-2 mb-4">
              <li className="ml-4">• Observer Pattern</li>
              <li className="ml-4">• Strategy Pattern</li>
              <li className="ml-4">• Command Pattern</li>
              <li className="ml-4">• State Pattern</li>
              <li className="ml-4">• Chain of Responsibility</li>
            </ul>
            <Link
              href="/advanced/patterns/behavioral"
              className="inline-block bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
            >
              Learn Behavioral Patterns
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/advanced/patterns/creational"
            className="inline-block bg-csharp-blue-500 hover:bg-csharp-blue-600 text-white font-bold py-2 px-4 rounded shadow"
          >
            Start Learning Design Patterns
          </Link>
        </div>
      </div>
    </div>
  );
} 