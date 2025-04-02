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

const ifStatementsExample = `using System;

class Program
{
    static void Main(string[] args)
    {
        // Simple if statement
        int age = 18;
        if (age >= 18)
        {
            Console.WriteLine("You are an adult.");
        }
        
        // if-else statement
        int score = 75;
        if (score >= 60)
        {
            Console.WriteLine("You passed!");
        }
        else
        {
            Console.WriteLine("You failed.");
        }
        
        // if-else if-else statement
        int grade = 85;
        if (grade >= 90)
        {
            Console.WriteLine("Grade: A");
        }
        else if (grade >= 80)
        {
            Console.WriteLine("Grade: B");
        }
        else if (grade >= 70)
        {
            Console.WriteLine("Grade: C");
        }
        else
        {
            Console.WriteLine("Grade: F");
        }
        
        // Nested if statements
        bool isStudent = true;
        int studentAge = 20;
        
        if (isStudent)
        {
            if (studentAge < 18)
            {
                Console.WriteLine("You are a minor student.");
            }
            else
            {
                Console.WriteLine("You are an adult student.");
            }
        }
        
        // Ternary operator
        int number = 7;
        string result = (number % 2 == 0) ? "Even" : "Odd";
        
        // Logical operators in conditions
        bool hasLicense = true;
        bool hasInsurance = true;
        
        if (hasLicense && hasInsurance)
        {
            Console.WriteLine("You can drive.");
        }
        
        if (hasLicense || hasInsurance)
        {
            Console.WriteLine("You have at least one requirement.");
        }
    }
}`;

export default function IfStatementsPage() {
  return (
    <LessonLayout
      title="If Statements in C#"
      level="beginner"
      sidebarItems={beginnerSidebarItems}
      prev={{ href: '/beginner/type-conversion', title: 'Type Conversion' }}
      next={{ href: '/beginner/switch', title: 'Switch Statements' }}
    >
      <div className="prose max-w-none">
        <h1>If Statements in C#</h1>
        <p>
          If statements are fundamental control structures that allow your program to make decisions
          based on conditions. They enable your code to execute different blocks of code depending
          on whether certain conditions are true or false.
        </p>

        <h2>Types of If Statements</h2>
        <ul>
          <li><strong>Simple if:</strong> Executes code if a condition is true</li>
          <li><strong>if-else:</strong> Executes one block if true, another if false</li>
          <li><strong>if-else if-else:</strong> Checks multiple conditions in sequence</li>
          <li><strong>Nested if:</strong> If statements inside other if statements</li>
        </ul>

        <h2>Example Program</h2>
        <p>
          Here's a program demonstrating various types of if statements:
        </p>

        <div className="my-4">
          <CodeEditor
            initialCode={ifStatementsExample}
            language="csharp"
            readOnly={true}
            title="If Statements Example"
          />
        </div>

        <h2>Conditional Operators</h2>
        <p>
          If statements use various operators to create conditions:
        </p>
        <ul>
          <li><strong>Comparison Operators:</strong> ==, !=, &gt;, &lt;, &gt;=, &lt;=</li>
          <li><strong>Logical Operators:</strong> && (AND), || (OR), ! (NOT)</li>
          <li><strong>Ternary Operator:</strong> condition ? value1 : value2</li>
        </ul>

        <h2>Best Practices</h2>
        <ul>
          <li>Use meaningful condition names</li>
          <li>Keep conditions simple and readable</li>
          <li>Use parentheses to clarify complex conditions</li>
          <li>Consider using early returns to reduce nesting</li>
          <li>Use switch statements for multiple conditions on the same variable</li>
        </ul>

        <h2>Common Pitfalls</h2>
        <ul>
          <li>Using = instead of == for comparison</li>
          <li>Forgetting curly braces in single-line if statements</li>
          <li>Deep nesting of if statements</li>
          <li>Complex conditions that are hard to read</li>
          <li>Not handling all possible cases</li>
        </ul>

        <h2>Code Style</h2>
        <p>
          Follow these style guidelines for if statements:
        </p>
        <ul>
          <li>Always use curly braces, even for single-line statements</li>
          <li>Place the opening brace on the same line as the if</li>
          <li>Use proper indentation for nested statements</li>
          <li>Keep conditions on a single line when possible</li>
          <li>Use meaningful variable names in conditions</li>
        </ul>

        <h2>Next Steps</h2>
        <p>
          In the next lesson, we'll learn about switch statements, which provide an alternative
          way to handle multiple conditions based on a single variable's value.
        </p>
      </div>
    </LessonLayout>
  );
} 