import React from 'react';
import Link from 'next/link';
import { FiCode, FiDatabase, FiFilter, FiList } from 'react-icons/fi';

export default function LinqPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Language Integrated Query (LINQ)</h1>
      
      <p className="text-lg mb-8">
        LINQ is a powerful feature in C# that provides a consistent syntax to query and manipulate data 
        from different sources. With LINQ, you can write expressive, type-safe queries that are easier 
        to read, maintain, and debug.
      </p>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Why Learn LINQ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="mb-4">
              LINQ simplifies data manipulation tasks and makes your code more:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Readable - Query syntax is clear and declarative</li>
              <li>Concise - Accomplish more with less code</li>
              <li>Maintainable - Consistent patterns for data operations</li>
              <li>Type-safe - Compile-time checking prevents errors</li>
              <li>Versatile - Works with different data sources</li>
            </ul>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">LINQ in Action</h3>
            <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm">
{`// Query Syntax
var result = 
    from product in products
    where product.Price < 50
    orderby product.Name
    select new { product.Name, product.Price };

// Method Syntax
var result = products
    .Where(p => p.Price < 50)
    .OrderBy(p => p.Name)
    .Select(p => new { p.Name, p.Price });`}
            </pre>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <FiList className="h-6 w-6 text-indigo-500 mr-2" />
            <h3 className="text-xl font-semibold">LINQ Fundamentals</h3>
          </div>
          <p className="mb-4">
            Learn the core concepts of LINQ, including query syntax, method syntax, and common operators 
            for filtering, projecting, and ordering data.
          </p>
          <ul className="mb-4 space-y-1">
            <li>• Query vs. Method syntax</li>
            <li>• Filtering operations (Where)</li>
            <li>• Projection operations (Select)</li>
            <li>• Ordering data (OrderBy, ThenBy)</li>
            <li>• Deferred execution</li>
          </ul>
          <Link href="/intermediate/linq/fundamentals" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Start Learning
          </Link>
        </div>
        
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <FiFilter className="h-6 w-6 text-green-500 mr-2" />
            <h3 className="text-xl font-semibold">Advanced LINQ Operations</h3>
          </div>
          <p className="mb-4">
            Explore advanced LINQ techniques for complex data manipulation, including grouping, joining, 
            aggregation, and set operations.
          </p>
          <ul className="mb-4 space-y-1">
            <li>• Grouping data (GroupBy)</li>
            <li>• Joining data sources</li>
            <li>• Aggregation functions</li>
            <li>• Set operations</li>
            <li>• Custom extension methods</li>
          </ul>
          <Link href="/intermediate/linq/advanced" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Start Learning
          </Link>
        </div>
        
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <FiDatabase className="h-6 w-6 text-purple-500 mr-2" />
            <h3 className="text-xl font-semibold">LINQ to Entities</h3>
          </div>
          <p className="mb-4">
            Master using LINQ with Entity Framework Core to query databases in a strongly-typed, 
            efficient way with optimized query translation.
          </p>
          <ul className="mb-4 space-y-1">
            <li>• Entity Framework basics</li>
            <li>• IQueryable vs. IEnumerable</li>
            <li>• Query translation to SQL</li>
            <li>• Loading related data</li>
            <li>• Performance optimization</li>
          </ul>
          <Link href="/intermediate/linq/entity-framework" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Start Learning
          </Link>
        </div>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800">
        <h3 className="text-xl font-semibold mb-3">Prerequisites</h3>
        <p className="mb-4">
          Before diving into LINQ, you should be familiar with:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>C# basics including variables, control flow, and methods</li>
          <li>Collections and generics</li>
          <li>Lambda expressions and delegates</li>
          <li>Object-oriented programming concepts</li>
        </ul>
        <p className="mt-4">
          Ready to start? Begin with <Link href="/intermediate/linq/fundamentals" className="text-blue-600 dark:text-blue-400 hover:underline">LINQ Fundamentals</Link>.
        </p>
      </div>
    </div>
  );
} 