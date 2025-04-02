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

const loopsExample = `using System;

class Program
{
    static void Main(string[] args)
    {
        // For Loop
        Console.WriteLine("For Loop Example:");
        for (int i = 0; i < 5; i++)
        {
            Console.WriteLine($"Iteration {i}");
        }
        
        // While Loop
        Console.WriteLine("\\nWhile Loop Example:");
        int count = 0;
        while (count < 5)
        {
            Console.WriteLine($"Count: {count}");
            count++;
        }
        
        // Do-While Loop
        Console.WriteLine("\\nDo-While Loop Example:");
        int j = 0;
        do
        {
            Console.WriteLine($"j is {j}");
            j++;
        } while (j < 5);
        
        // Foreach Loop with array
        Console.WriteLine("\\nForeach with Array Example:");
        string[] fruits = { "Apple", "Banana", "Cherry", "Date" };
        foreach (string fruit in fruits)
        {
            Console.WriteLine($"Current fruit: {fruit}");
        }
        
        // Nested Loops
        Console.WriteLine("\\nNested Loops Example:");
        for (int row = 1; row <= 3; row++)
        {
            for (int col = 1; col <= 3; col++)
            {
                Console.Write($"({row},{col}) ");
            }
            Console.WriteLine();
        }
        
        // Break statement
        Console.WriteLine("\\nBreak Example:");
        for (int i = 0; i < 10; i++)
        {
            if (i == 5)
                break;
            Console.WriteLine($"Value: {i}");
        }
        
        // Continue statement
        Console.WriteLine("\\nContinue Example:");
        for (int i = 0; i < 10; i++)
        {
            if (i % 2 == 0)
                continue;
            Console.WriteLine($"Odd Value: {i}");
        }
    }
}`;

export default function LoopsPage() {
  return (
    <LessonLayout
      title="Loops in C#"
      level="beginner"
      sidebarItems={beginnerSidebarItems}
      prev={{ href: '/beginner/switch', title: 'Switch Statements' }}
      next={{ href: '/beginner/methods', title: 'Methods Basics' }}
    >
      <div className="prose max-w-none">
        <h1>Loops in C#</h1>
        <p>
          Loops are control structures that allow your program to execute a block of code repeatedly.
          They are essential for automating repetitive tasks, processing collections of data, and
          implementing algorithms that require iteration.
        </p>

        <h2>Types of Loops</h2>
        <ul>
          <li><strong>For Loop:</strong> Ideal for known number of iterations</li>
          <li><strong>While Loop:</strong> Executes as long as a condition is true</li>
          <li><strong>Do-While Loop:</strong> Like while, but ensures at least one execution</li>
          <li><strong>Foreach Loop:</strong> Simplifies iterating through collections</li>
        </ul>

        <h2>Example Program</h2>
        <p>
          Here's a program demonstrating various types of loops and loop control:
        </p>

        <div className="my-4">
          <CodeEditor
            initialCode={loopsExample}
            language="csharp"
            readOnly={true}
            title="Loops Example"
          />
        </div>

        <h2>Loop Components</h2>
        <h3>For Loop</h3>
        <p>A for loop consists of three parts:</p>
        <ul>
          <li><strong>Initialization:</strong> <code>int i = 0;</code> - Runs once at the beginning</li>
          <li><strong>Condition:</strong> <code>i &lt; 5;</code> - Checked before each iteration</li>
          <li><strong>Iteration:</strong> <code>i++</code> - Executes after each iteration</li>
        </ul>

        <h3>While Loop</h3>
        <p>
          The while loop continues executing as long as its condition remains true.
          The condition is evaluated before executing the loop body.
        </p>

        <h3>Do-While Loop</h3>
        <p>
          Similar to while, but the condition is checked after executing the loop body,
          ensuring the loop body executes at least once.
        </p>

        <h3>Foreach Loop</h3>
        <p>
          The foreach loop simplifies iteration through collections like arrays, lists, and other
          enumerable types without needing to keep track of indices.
        </p>

        <h2>Loop Control Statements</h2>
        <ul>
          <li><strong>break:</strong> Exits the loop immediately</li>
          <li><strong>continue:</strong> Skips the current iteration and moves to the next</li>
        </ul>

        <h2>Best Practices</h2>
        <ul>
          <li>Choose the right loop type for your task</li>
          <li>Avoid infinite loops by ensuring the condition will eventually become false</li>
          <li>Keep loop bodies concise and focused</li>
          <li>Consider performance implications for large collections</li>
          <li>Use foreach for collections when you don't need the index</li>
          <li>Be careful with break/continue to maintain readability</li>
        </ul>

        <h2>Common Pitfalls</h2>
        <ul>
          <li>Off-by-one errors (fence post errors)</li>
          <li>Infinite loops</li>
          <li>Modifying collection elements while iterating (can cause errors)</li>
          <li>Overlooking edge cases (empty collections, etc.)</li>
          <li>Overly complex nested loops</li>
        </ul>

        <h2>When to Use Each Loop Type</h2>
        <ul>
          <li><strong>For:</strong> When you know exactly how many times to loop</li>
          <li><strong>While:</strong> When the number of iterations depends on a condition</li>
          <li><strong>Do-While:</strong> When you need to execute the loop at least once</li>
          <li><strong>Foreach:</strong> When iterating through collections is the primary goal</li>
        </ul>

        <h2>Next Steps</h2>
        <p>
          In the next lesson, we'll start learning about methods in C#, which allow you to
          organize your code into reusable blocks of functionality.
        </p>
      </div>
    </LessonLayout>
  );
} 