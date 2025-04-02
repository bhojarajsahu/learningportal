"use client";

import React from 'react';
import LessonLayout from '@/components/LessonLayout';
import CodeEditor from '@/components/CodeEditor';
import ConceptMap from '@/components/ConceptMap';
import FlowChart from '@/components/FlowChart';
import { FiBook, FiCode, FiCpu, FiDatabase } from 'react-icons/fi';

// Sidebar configuration for beginner section
const beginnerSidebarItems = [
  {
    title: 'Getting Started',
    href: '/beginner',
    icon: <FiBook className="w-4 h-4" />,
    children: [
      { title: 'Introduction to C#', href: '/beginner/introduction' },
      { title: 'Setting Up Your Environment', href: '/beginner/setup' },
      { title: 'Your First C# Program', href: '/beginner/first-program' },
    ]
  },
  {
    title: 'C# Basics',
    href: '/beginner/basics',
    icon: <FiCode className="w-4 h-4" />,
    children: [
      { title: 'Variables and Data Types', href: '/beginner/data-types' },
      { title: 'Operators', href: '/beginner/operators' },
      { title: 'Type Conversion', href: '/beginner/type-conversion' },
    ]
  },
  {
    title: 'Control Structures',
    href: '/beginner/control',
    icon: <FiCpu className="w-4 h-4" />,
    children: [
      { title: 'If Statements', href: '/beginner/if-statements' },
      { title: 'Switch Statements', href: '/beginner/switch' },
      { title: 'Loops', href: '/beginner/loops' },
    ]
  },
  {
    title: 'Functions and Methods',
    href: '/beginner/functions',
    icon: <FiDatabase className="w-4 h-4" />,
    children: [
      { title: 'Methods Basics', href: '/beginner/methods' },
      { title: 'Parameters and Return Values', href: '/beginner/parameters' },
      { title: 'Method Overloading', href: '/beginner/overloading' },
    ]
  }
];

// Sample code for Hello World
const helloWorldCode = `using System;

namespace HelloWorld
{
    class Program
    {
        static void Main(string[] args)
        {
            // This is a comment
            Console.WriteLine("Hello, World!");
            
            // Wait for user input before closing
            Console.ReadKey();
        }
    }
}`;

// C# Concept Map data
const conceptMapNodes = [
  { id: 'csharp', label: 'C#', category: 'core', description: 'Modern, object-oriented programming language developed by Microsoft' },
  { id: 'dotnet', label: '.NET', category: 'core', description: 'Platform for building applications on Windows, Linux and macOS' },
  { id: 'clr', label: 'CLR', category: 'core', description: 'Common Language Runtime - executes .NET applications' },
  { id: 'il', label: 'IL Code', category: 'core', description: 'Intermediate Language code compiled from C#' },
  { id: 'libs', label: 'Libraries', category: 'feature', description: 'Rich set of libraries and frameworks' },
  { id: 'oop', label: 'OOP', category: 'feature', description: 'Object-Oriented Programming concepts' },
  { id: 'async', label: 'Async', category: 'advanced', description: 'Asynchronous programming capabilities' },
  { id: 'linq', label: 'LINQ', category: 'feature', description: 'Language Integrated Query for data manipulation' },
];

const conceptMapLinks = [
  { source: 'csharp', target: 'dotnet', label: 'runs on' },
  { source: 'csharp', target: 'il', label: 'compiles to' },
  { source: 'il', target: 'clr', label: 'executed by' },
  { source: 'clr', target: 'dotnet', label: 'part of' },
  { source: 'dotnet', target: 'libs', label: 'provides' },
  { source: 'csharp', target: 'oop', label: 'supports' },
  { source: 'csharp', target: 'async', label: 'supports' },
  { source: 'csharp', target: 'linq', label: 'includes' },
];

export default function IntroductionPage() {
  return (
    <LessonLayout 
      title="Introduction to C#"
      level="beginner"
      sidebarItems={beginnerSidebarItems}
      next={{ href: '/beginner/setup', title: 'Setting Up Your Environment' }}
    >
      <p>
        Welcome to our comprehensive C# learning portal! This introduction will give you a solid foundation in C# programming
        and prepare you for more advanced concepts in later lessons.
      </p>

      <h2>What is C#?</h2>
      <p>
        C# (pronounced "C-sharp") is a modern, object-oriented programming language developed by Microsoft as part of its .NET initiative.
        Since its first release in 2002, C# has evolved significantly and is now used for developing:
      </p>

      <ul>
        <li>Desktop applications (Windows Forms, WPF)</li>
        <li>Web applications (ASP.NET)</li>
        <li>Mobile applications (Xamarin, MAUI)</li>
        <li>Games (Unity)</li>
        <li>Cloud services (Azure)</li>
        <li>Internet of Things (IoT) applications</li>
      </ul>

      <h2>C# and .NET Ecosystem</h2>
      <ConceptMap 
        nodes={conceptMapNodes} 
        links={conceptMapLinks} 
        title="C# and .NET Ecosystem" 
        height={400}
      />

      <p>
        C# is designed to be simple, modern, flexible, and versatile. Its syntax is similar to other C-style languages
        such as C, C++, and Java, making it easier to learn if you're already familiar with these languages.
      </p>

      <h2>Your First C# Program</h2>
      <p>
        Let's look at a simple "Hello World" program in C#. This is typically the first program you write
        when learning a new programming language:
      </p>

      <CodeEditor 
        initialCode={helloWorldCode}
        title="Hello World in C#"
        readOnly={true}
      />

      <h3>Breaking Down the Code</h3>
      <p>Let's examine the components of this program:</p>

      <ul>
        <li><code>using System;</code> - Includes the System namespace, which contains fundamental classes and base types</li>
        <li><code>namespace HelloWorld</code> - Declares a namespace for your code</li>
        <li><code>class Program</code> - Defines a class named Program</li>
        <li><code>static void Main(string[] args)</code> - The entry point of your application</li>
        <li><code>Console.WriteLine("Hello, World!");</code> - Prints text to the console</li>
        <li><code>Console.ReadKey();</code> - Waits for a key press before closing the console window</li>
      </ul>

      <h2>Program Execution Flow</h2>
      <FlowChart 
        nodes={[
          { id: 'start', type: 'start', text: 'Start', x: 300, y: 50 },
          { id: 'compile', type: 'process', text: 'Compile C# code', x: 300, y: 130 },
          { id: 'il', type: 'process', text: 'Generate IL code', x: 300, y: 210 },
          { id: 'jit', type: 'process', text: 'JIT compilation', x: 300, y: 290 },
          { id: 'execute', type: 'process', text: 'Execute machine code', x: 300, y: 370 },
          { id: 'end', type: 'end', text: 'End', x: 300, y: 450 }
        ]}
        connections={[
          { from: 'start', to: 'compile' },
          { from: 'compile', to: 'il' },
          { from: 'il', to: 'jit' },
          { from: 'jit', to: 'execute' },
          { from: 'execute', to: 'end' }
        ]}
        title="C# Program Execution Flow"
        animated={true}
      />

      <h2>Why Learn C#?</h2>
      <p>
        There are many compelling reasons to learn C#:
      </p>

      <ul>
        <li><strong>Versatility:</strong> C# can be used for almost any type of software development</li>
        <li><strong>Large Community:</strong> Extensive resources, libraries, and community support</li>
        <li><strong>Modern Features:</strong> Regular updates with modern programming features</li>
        <li><strong>Cross-Platform:</strong> With .NET Core/.NET 5+, C# applications can run on Windows, macOS, and Linux</li>
        <li><strong>Career Opportunities:</strong> High demand for C# developers in various industries</li>
      </ul>

      <h2>Getting Ready</h2>
      <p>
        In the next lesson, we'll set up your development environment so you can start writing and running
        C# code on your own computer. You'll learn how to install Visual Studio or Visual Studio Code,
        and we'll walk through creating your first project.
      </p>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 border-l-4 border-csharp-blue-500 rounded">
        <p className="font-medium">Ready to continue?</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Click the "Setting Up Your Environment" link below to proceed to the next lesson.
        </p>
      </div>
    </LessonLayout>
  );
} 