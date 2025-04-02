import React from 'react';
import { FiBook, FiCode, FiCpu, FiDatabase } from 'react-icons/fi';
import LessonLayout from '@/components/LessonLayout';
import CodeEditor from '@/components/CodeEditor';

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

const setupInstructions = `1. Download and install .NET SDK from https://dotnet.microsoft.com/download
2. Verify installation by opening a terminal and running:
   dotnet --version
3. Create a new C# project:
   dotnet new console -n MyFirstProgram
4. Navigate to the project directory:
   cd MyFirstProgram
5. Open the project in your preferred IDE (Visual Studio, VS Code, etc.)`;

export default function SetupPage() {
  return (
    <LessonLayout
      title="Setting Up Your Environment"
      level="beginner"
      sidebarItems={beginnerSidebarItems}
      prev={{ href: '/beginner/introduction', title: 'Introduction to C#' }}
      next={{ href: '/beginner/first-program', title: 'Your First C# Program' }}
    >
      <div className="prose max-w-none">
        <h1>Setting Up Your Development Environment</h1>
        <p>
          Before you can start programming in C#, you'll need to set up your development environment.
          This guide will walk you through the process of installing the necessary tools and creating your first project.
        </p>

        <h2>Required Tools</h2>
        <ul>
          <li><strong>.NET SDK:</strong> The software development kit for C# and .NET</li>
          <li><strong>Code Editor:</strong> Visual Studio Code, Visual Studio, or Rider</li>
          <li><strong>Git (optional):</strong> For version control</li>
        </ul>

        <h2>Installation Steps</h2>
        <div className="my-4">
          <CodeEditor
            initialCode={setupInstructions}
            language="bash"
            readOnly={true}
            title="Setup Instructions"
          />
        </div>

        <h2>IDE Setup</h2>
        <h3>Visual Studio Code (Recommended for Beginners)</h3>
        <ol>
          <li>Download and install VS Code from https://code.visualstudio.com/</li>
          <li>Install the C# extension from the Extensions marketplace</li>
          <li>Install the .NET Core Tools extension</li>
        </ol>

        <h3>Visual Studio</h3>
        <ol>
          <li>Download Visual Studio Community Edition (free) from https://visualstudio.microsoft.com/</li>
          <li>During installation, select the ".NET Desktop Development" workload</li>
          <li>Additional components will be installed automatically</li>
        </ol>

        <h2>Verifying Your Setup</h2>
        <p>
          After installation, you can verify your setup by creating a new project and running it:
        </p>

        <div className="my-4">
          <CodeEditor
            initialCode={`// Program.cs
using System;

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Hello, C#!");
    }
}`}
            language="csharp"
            readOnly={true}
            title="Test Program"
          />
        </div>

        <h2>Next Steps</h2>
        <p>
          Once you have your environment set up, you're ready to create your first C# program.
          In the next lesson, we'll write and run a simple program to ensure everything is working correctly.
        </p>
      </div>
    </LessonLayout>
  );
} 