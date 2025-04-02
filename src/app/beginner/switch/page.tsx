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

const switchStatementsExample = `using System;

class Program
{
    static void Main(string[] args)
    {
        // Basic switch statement
        int day = 3;
        switch (day)
        {
            case 1:
                Console.WriteLine("Monday");
                break;
            case 2:
                Console.WriteLine("Tuesday");
                break;
            case 3:
                Console.WriteLine("Wednesday");
                break;
            default:
                Console.WriteLine("Other day");
                break;
        }
        
        // Switch with multiple cases
        char grade = 'B';
        switch (grade)
        {
            case 'A':
            case 'a':
                Console.WriteLine("Excellent!");
                break;
            case 'B':
            case 'b':
                Console.WriteLine("Good job!");
                break;
            case 'C':
            case 'c':
                Console.WriteLine("Passed");
                break;
            default:
                Console.WriteLine("Failed");
                break;
        }
        
        // Switch with enum
        enum Days { Monday, Tuesday, Wednesday, Thursday, Friday }
        Days today = Days.Wednesday;
        
        switch (today)
        {
            case Days.Monday:
                Console.WriteLine("Start of the week");
                break;
            case Days.Friday:
                Console.WriteLine("End of the week");
                break;
            default:
                Console.WriteLine("Middle of the week");
                break;
        }
        
        // Switch expression (C# 8.0+)
        string status = "active";
        string message = status switch
        {
            "active" => "User is active",
            "inactive" => "User is inactive",
            "pending" => "User is pending",
            _ => "Unknown status"
        };
        
        // Switch with pattern matching
        object value = 42;
        switch (value)
        {
            case int number:
                Console.WriteLine($"It's an integer: {number}");
                break;
            case string text:
                Console.WriteLine($"It's a string: {text}");
                break;
            case null:
                Console.WriteLine("It's null");
                break;
            default:
                Console.WriteLine("It's something else");
                break;
        }
    }
}`;

export default function SwitchStatementsPage() {
  return (
    <LessonLayout
      title="Switch Statements in C#"
      level="beginner"
      sidebarItems={beginnerSidebarItems}
      prev={{ href: '/beginner/if-statements', title: 'If Statements' }}
      next={{ href: '/beginner/loops', title: 'Loops' }}
    >
      <div className="prose max-w-none">
        <h1>Switch Statements in C#</h1>
        <p>
          Switch statements provide a clean way to handle multiple conditions based on a single variable's value.
          They are particularly useful when you have multiple possible values for a variable and want to execute
          different code for each value.
        </p>

        <h2>Types of Switch Statements</h2>
        <ul>
          <li><strong>Basic switch:</strong> Matches exact values</li>
          <li><strong>Multiple cases:</strong> Multiple cases executing the same code</li>
          <li><strong>Enum switch:</strong> Working with enumerated types</li>
          <li><strong>Switch expression:</strong> Modern C# syntax for concise switch statements</li>
          <li><strong>Pattern matching:</strong> Advanced pattern matching capabilities</li>
        </ul>

        <h2>Example Program</h2>
        <p>
          Here's a program demonstrating various types of switch statements:
        </p>

        <div className="my-4">
          <CodeEditor
            initialCode={switchStatementsExample}
            language="csharp"
            readOnly={true}
            title="Switch Statements Example"
          />
        </div>

        <h2>Key Features</h2>
        <ul>
          <li><strong>Case Labels:</strong> Define possible values to match</li>
          <li><strong>Break Statement:</strong> Exits the switch block</li>
          <li><strong>Default Case:</strong> Handles unmatched values</li>
          <li><strong>Fall-through:</strong> Multiple cases executing the same code</li>
          <li><strong>Pattern Matching:</strong> Advanced matching capabilities</li>
        </ul>

        <h2>Best Practices</h2>
        <ul>
          <li>Use switch statements for multiple conditions on a single variable</li>
          <li>Always include a default case</li>
          <li>Use break statements to prevent fall-through</li>
          <li>Consider using switch expressions for simple cases</li>
          <li>Use pattern matching for complex scenarios</li>
        </ul>

        <h2>Common Pitfalls</h2>
        <ul>
          <li>Forgetting break statements (unintentional fall-through)</li>
          <li>Missing default case</li>
          <li>Using switch for complex conditions (if statements might be better)</li>
          <li>Not handling all possible enum values</li>
          <li>Using switch for floating-point comparisons</li>
        </ul>

        <h2>When to Use Switch vs If</h2>
        <p>
          Choose switch statements when:
        </p>
        <ul>
          <li>Testing a single variable against multiple values</li>
          <li>Working with enums or simple types</li>
          <li>Code readability is important</li>
          <li>Performance is critical (switch can be more efficient)</li>
        </ul>

        <p>
          Use if statements when:
        </p>
        <ul>
          <li>Testing multiple variables</li>
          <li>Using complex conditions</li>
          <li>Working with ranges or comparisons</li>
          <li>Need to evaluate expressions</li>
        </ul>

        <h2>Next Steps</h2>
        <p>
          In the next lesson, we'll learn about loops in C#, which allow us to repeat code blocks
          multiple times based on various conditions.
        </p>
      </div>
    </LessonLayout>
  );
} 