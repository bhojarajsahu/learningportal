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

const dataTypesExample = `using System;

class Program
{
    static void Main(string[] args)
    {
        // Integer types
        int age = 25;
        long population = 7800000000;
        byte smallNumber = 255;
        
        // Floating-point types
        float pi = 3.14f;
        double precisePi = 3.14159265359;
        decimal money = 99.99m;
        
        // Boolean type
        bool isStudent = true;
        
        // Character type
        char grade = 'A';
        
        // String type
        string name = "John Doe";
        
        // Display values
        Console.WriteLine($"Age: {age}");
        Console.WriteLine($"Population: {population}");
        Console.WriteLine($"Pi: {pi}");
        Console.WriteLine($"Precise Pi: {precisePi}");
        Console.WriteLine($"Money: {money:C}");
        Console.WriteLine($"Is Student: {isStudent}");
        Console.WriteLine($"Grade: {grade}");
        Console.WriteLine($"Name: {name}");
    }
}`;

const dataTypesTable = `| Data Type | Size (bytes) | Range | Example |
|-----------|--------------|--------|---------|
| byte      | 1           | 0 to 255 | 255 |
| short     | 2           | -32,768 to 32,767 | 32000 |
| int       | 4           | -2,147,483,648 to 2,147,483,647 | 2000000 |
| long      | 8           | -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807 | 7800000000 |
| float     | 4           | ±1.5 × 10^-45 to ±3.4 × 10^38 | 3.14f |
| double    | 8           | ±5.0 × 10^-324 to ±1.7 × 10^308 | 3.14159 |
| decimal   | 16          | ±1.0 × 10^-28 to ±7.9 × 10^28 | 99.99m |
| bool      | 1           | true or false | true |
| char      | 2           | Unicode character | 'A' |
| string    | Variable    | Text | "Hello" |`;

export default function DataTypesPage() {
  return (
    <LessonLayout
      title="Variables and Data Types"
      level="beginner"
      sidebarItems={beginnerSidebarItems}
      prev={{ href: '/beginner/first-program', title: 'Your First C# Program' }}
      next={{ href: '/beginner/operators', title: 'Operators' }}
    >
      <div className="prose max-w-none">
        <h1>Variables and Data Types in C#</h1>
        <p>
          Variables are containers for storing data values in your program. In C#,
          variables must be declared with a specific data type that determines what kind of data they can store.
        </p>

        <h2>Basic Data Types</h2>
        <p>
          C# provides several built-in data types for different kinds of data:
        </p>

        <div className="my-4">
          <CodeEditor
            initialCode={dataTypesTable}
            language="text"
            readOnly={true}
            title="C# Data Types"
          />
        </div>

        <h2>Example Program</h2>
        <p>
          Here's a program demonstrating the use of different data types:
        </p>

        <div className="my-4">
          <CodeEditor
            initialCode={dataTypesExample}
            language="csharp"
            readOnly={true}
            title="Data Types Example"
          />
        </div>

        <h2>Variable Declaration and Initialization</h2>
        <p>
          There are several ways to declare and initialize variables in C#:
        </p>
        <ul>
          <li><strong>Explicit Declaration:</strong> <code>int age = 25;</code></li>
          <li><strong>Implicit Declaration:</strong> <code>var age = 25;</code></li>
          <li><strong>Multiple Declaration:</strong> <code>int x = 10, y = 20, z = 30;</code></li>
        </ul>

        <h2>Naming Conventions</h2>
        <p>
          Follow these conventions when naming variables:
        </p>
        <ul>
          <li>Use camelCase for variables (e.g., <code>firstName</code>)</li>
          <li>Use PascalCase for constants (e.g., <code>MaxValue</code>)</li>
          <li>Use meaningful names that describe the purpose</li>
          <li>Start with a letter or underscore</li>
          <li>Cannot use C# keywords as names</li>
        </ul>

        <h2>Type Safety</h2>
        <p>
          C# is a strongly-typed language, which means:
        </p>
        <ul>
          <li>Variables must be declared with a specific type</li>
          <li>Type checking is performed at compile time</li>
          <li>Implicit conversions are only allowed when no data loss can occur</li>
          <li>Explicit conversions (casting) are required when data loss might occur</li>
        </ul>

        <h2>Constants</h2>
        <p>
          Use the <code>const</code> keyword to declare constants:
        </p>
        <pre>const double Pi = 3.14159;</pre>

        <h2>Next Steps</h2>
        <p>
          In the next lesson, we'll learn about operators in C#,
          which allow us to perform operations on variables and values.
        </p>
      </div>
    </LessonLayout>
  );
} 