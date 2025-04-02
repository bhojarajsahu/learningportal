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

const operatorsExample = `using System;

class Program
{
    static void Main(string[] args)
    {
        // Arithmetic Operators
        int a = 10;
        int b = 3;
        
        Console.WriteLine($"Addition: {a + b}");      // 13
        Console.WriteLine($"Subtraction: {a - b}");   // 7
        Console.WriteLine($"Multiplication: {a * b}"); // 30
        Console.WriteLine($"Division: {a / b}");      // 3
        Console.WriteLine($"Modulus: {a % b}");       // 1
        
        // Increment and Decrement
        int x = 5;
        Console.WriteLine($"Pre-increment: {++x}");   // 6
        Console.WriteLine($"Post-increment: {x++}");  // 6
        Console.WriteLine($"Final value: {x}");       // 7
        
        // Comparison Operators
        bool isEqual = a == b;        // false
        bool isNotEqual = a != b;     // true
        bool isGreater = a > b;       // true
        bool isLess = a < b;          // false
        bool isGreaterOrEqual = a >= b; // true
        bool isLessOrEqual = a <= b;    // false
        
        // Logical Operators
        bool condition1 = true;
        bool condition2 = false;
        
        Console.WriteLine($"AND: {condition1 && condition2}");  // false
        Console.WriteLine($"OR: {condition1 || condition2}");   // true
        Console.WriteLine($"NOT: {!condition1}");              // false
        
        // Assignment Operators
        int number = 10;
        number += 5;  // number = number + 5
        number -= 3;  // number = number - 3
        number *= 2;  // number = number * 2
        number /= 4;  // number = number / 4
        number %= 3;  // number = number % 3
    }
}`;

const operatorPrecedence = `| Operator Category | Operators | Precedence |
|------------------|-----------|------------|
| Primary          | x.y, f(x), a[x], x++, x--, new, typeof, checked, unchecked | Highest |
| Unary            | +, -, !, ~, ++x, --x, (T)x | |
| Multiplicative   | *, /, % | |
| Additive         | +, - | |
| Shift            | <<, >> | |
| Relational       | <, >, <=, >=, is, as | |
| Equality         | ==, != | |
| Logical AND      | & | |
| Logical XOR      | ^ | |
| Logical OR       | \| | |
| Conditional AND  | && | |
| Conditional OR   | \|\| | |
| Null Coalescing  | ?? | |
| Ternary          | ?: | |
| Assignment       | =, +=, -=, *=, /=, %=, &=, \|=, ^=, <<=, >>=, ??= | Lowest |`;

export default function OperatorsPage() {
  return (
    <LessonLayout
      title="Operators in C#"
      level="beginner"
      sidebarItems={beginnerSidebarItems}
      prev={{ href: '/beginner/data-types', title: 'Variables and Data Types' }}
      next={{ href: '/beginner/type-conversion', title: 'Type Conversion' }}
    >
      <div className="prose max-w-none">
        <h1>Operators in C#</h1>
        <p>
          Operators are symbols that perform operations on operands (variables and values).
          C# provides various types of operators for different operations.
        </p>

        <h2>Types of Operators</h2>
        <ul>
          <li><strong>Arithmetic Operators:</strong> For mathematical operations</li>
          <li><strong>Comparison Operators:</strong> For comparing values</li>
          <li><strong>Logical Operators:</strong> For boolean operations</li>
          <li><strong>Assignment Operators:</strong> For assigning values</li>
          <li><strong>Increment/Decrement Operators:</strong> For increasing/decreasing values</li>
        </ul>

        <h2>Example Program</h2>
        <p>
          Here's a program demonstrating various operators:
        </p>

        <div className="my-4">
          <CodeEditor
            initialCode={operatorsExample}
            language="csharp"
            readOnly={true}
            title="Operators Example"
          />
        </div>

        <h2>Operator Precedence</h2>
        <p>
          When multiple operators are used in an expression, C# follows operator precedence rules
          to determine the order of evaluation:
        </p>

        <div className="my-4">
          <CodeEditor
            initialCode={operatorPrecedence}
            language="text"
            readOnly={true}
            title="Operator Precedence"
          />
        </div>

        <h2>Common Operators</h2>
        <h3>Arithmetic Operators</h3>
        <ul>
          <li><code>+</code> Addition</li>
          <li><code>-</code> Subtraction</li>
          <li><code>*</code> Multiplication</li>
          <li><code>/</code> Division</li>
          <li><code>%</code> Modulus (remainder)</li>
        </ul>

        <h3>Comparison Operators</h3>
        <ul>
          <li><code>==</code> Equal to</li>
          <li><code>!=</code> Not equal to</li>
          <li><code>&gt;</code> Greater than</li>
          <li><code>&lt;</code> Less than</li>
          <li><code>&gt;=</code> Greater than or equal to</li>
          <li><code>&lt;=</code> Less than or equal to</li>
        </ul>

        <h3>Logical Operators</h3>
        <ul>
          <li><code>&&</code> Logical AND</li>
          <li><code>||</code> Logical OR</li>
          <li><code>!</code> Logical NOT</li>
        </ul>

        <h3>Assignment Operators</h3>
        <ul>
          <li><code>=</code> Simple assignment</li>
          <li><code>+=</code> Add and assign</li>
          <li><code>-=</code> Subtract and assign</li>
          <li><code>*=</code> Multiply and assign</li>
          <li><code>/=</code> Divide and assign</li>
          <li><code>%=</code> Modulus and assign</li>
        </ul>

        <h2>Best Practices</h2>
        <ul>
          <li>Use parentheses to make operator precedence clear</li>
          <li>Break complex expressions into multiple lines for readability</li>
          <li>Be careful with increment/decrement operators in expressions</li>
          <li>Use appropriate operators for the data type</li>
        </ul>

        <h2>Next Steps</h2>
        <p>
          In the next lesson, we'll learn about type conversion in C#,
          which allows us to convert values between different data types.
        </p>
      </div>
    </LessonLayout>
  );
} 