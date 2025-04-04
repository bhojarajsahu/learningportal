import React from 'react';
import { FiList, FiFilter, FiSearch } from 'react-icons/fi';
import LessonLayout from '@/components/LessonLayout';
import CodeEditor from '@/components/CodeEditor';

const sidebarItems = [
  {
    title: 'LINQ',
    href: '/intermediate/linq',
    icon: <FiList className="w-4 h-4" />,
    children: [
      { title: 'LINQ Fundamentals', href: '/intermediate/linq/fundamentals' },
      { title: 'Advanced LINQ Operations', href: '/intermediate/linq/advanced' },
      { title: 'LINQ to Entities', href: '/intermediate/linq/entity-framework' },
    ]
  },
];

const introCode = `using System;
using System.Collections.Generic;
using System.Linq;

namespace LinqExamples
{
    class Program
    {
        static void Main()
        {
            // Sample data - a list of products
            var products = new List<Product>
            {
                new Product { Id = 1, Name = "Laptop", Price = 1200, Category = "Electronics" },
                new Product { Id = 2, Name = "Headphones", Price = 100, Category = "Electronics" },
                new Product { Id = 3, Name = "Coffee Mug", Price = 15, Category = "Kitchenware" },
                new Product { Id = 4, Name = "Desk Chair", Price = 250, Category = "Furniture" },
                new Product { Id = 5, Name = "Smartphone", Price = 800, Category = "Electronics" },
                new Product { Id = 6, Name = "Water Bottle", Price = 20, Category = "Kitchenware" },
                new Product { Id = 7, Name = "Bookshelf", Price = 175, Category = "Furniture" }
            };
            
            // LINQ query using query syntax
            var electronicsQuery =
                from product in products
                where product.Category == "Electronics"
                orderby product.Price descending
                select product;
                
            Console.WriteLine("Electronics (query syntax):");
            foreach (var product in electronicsQuery)
            {
                Console.WriteLine($"{product.Name}: ${product.Price}");
            }
            
            // LINQ query using method syntax
            var electronicsMethod = products
                .Where(p => p.Category == "Electronics")
                .OrderByDescending(p => p.Price);
                
            Console.WriteLine("\\nElectronics (method syntax):");
            foreach (var product in electronicsMethod)
            {
                Console.WriteLine($"{product.Name}: ${product.Price}");
            }
            
            // Projecting to a new anonymous type
            var productInfo = products
                .Select(p => new { p.Name, p.Price, Tax = p.Price * 0.08m });
                
            Console.WriteLine("\\nProducts with tax:");
            foreach (var item in productInfo)
            {
                Console.WriteLine($"{item.Name}: ${item.Price} (Tax: ${item.Tax:F2})");
            }
        }
    }
    
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Category { get; set; }
    }
}`;

const filteringCode = `using System;
using System.Linq;
using System.Collections.Generic;

namespace LinqFilteringExamples
{
    class Program
    {
        static void Main()
        {
            var numbers = new[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
            var fruits = new List<string> { "Apple", "Banana", "Cherry", "Date", "Elderberry" };
            var people = new List<Person>
            {
                new Person { Name = "Alice", Age = 25, City = "New York" },
                new Person { Name = "Bob", Age = 30, City = "Seattle" },
                new Person { Name = "Charlie", Age = 35, City = "New York" },
                new Person { Name = "Diana", Age = 28, City = "Boston" },
                new Person { Name = "Edward", Age = 22, City = "Seattle" }
            };
            
            // Basic Where clause
            var evenNumbers = numbers.Where(n => n % 2 == 0);
            Console.WriteLine("Even numbers:");
            Console.WriteLine(string.Join(", ", evenNumbers));
            
            // Filtering with multiple conditions
            var youngAdults = people.Where(p => p.Age >= 18 && p.Age < 30);
            Console.WriteLine("\\nYoung adults (18-29):");
            foreach (var person in youngAdults)
            {
                Console.WriteLine($"{person.Name}, {person.Age}");
            }
            
            // Filtering with string operations
            var fruitsWithA = fruits.Where(f => f.Contains("a"));
            Console.WriteLine("\\nFruits containing 'a':");
            Console.WriteLine(string.Join(", ", fruitsWithA));
            
            // Using query syntax
            var seattleResidents =
                from person in people
                where person.City == "Seattle"
                select person;
                
            Console.WriteLine("\\nSeattle residents:");
            foreach (var person in seattleResidents)
            {
                Console.WriteLine($"{person.Name}");
            }
            
            // Combining multiple filters
            var filteredPeople = people
                .Where(p => p.Age > 25)
                .Where(p => p.City == "New York");
                
            Console.WriteLine("\\nNew York residents over 25:");
            foreach (var person in filteredPeople)
            {
                Console.WriteLine($"{person.Name}, {person.Age}");
            }
            
            // Using IndexOf in filter
            var shortFruits = fruits.Where((fruit, index) => fruit.Length < 6);
            Console.WriteLine("\\nFruits with less than 6 letters:");
            Console.WriteLine(string.Join(", ", shortFruits));
        }
    }
    
    public class Person
    {
        public string Name { get; set; }
        public int Age { get; set; }
        public string City { get; set; }
    }
}`;

const projectingCode = `using System;
using System.Linq;
using System.Collections.Generic;

namespace LinqProjectionExamples
{
    class Program
    {
        static void Main()
        {
            var products = new List<Product>
            {
                new Product { Id = 1, Name = "Laptop", Price = 1200, Category = "Electronics" },
                new Product { Id = 2, Name = "Headphones", Price = 100, Category = "Electronics" },
                new Product { Id = 3, Name = "Coffee Mug", Price = 15, Category = "Kitchenware" }
            };
            
            // Basic Select to transform each element
            var productNames = products.Select(p => p.Name);
            Console.WriteLine("Product names:");
            Console.WriteLine(string.Join(", ", productNames));
            
            // Select with index
            var indexedProducts = products.Select((p, i) => $"{i+1}. {p.Name} (${p.Price})");
            Console.WriteLine("\\nNumbered product list:");
            foreach (var item in indexedProducts)
            {
                Console.WriteLine(item);
            }
            
            // Projecting to an anonymous type
            var productDetails = products.Select(p => new { 
                p.Name, 
                p.Price, 
                PriceWithTax = p.Price * 1.08m,
                PriceCategory = p.Price < 50 ? "Budget" : (p.Price < 500 ? "Mid-range" : "Premium")
            });
            
            Console.WriteLine("\\nDetailed product information:");
            foreach (var item in productDetails)
            {
                Console.WriteLine($"{item.Name} (${item.Price}) - {item.PriceCategory}");
                Console.WriteLine($"  Price with tax: ${item.PriceWithTax:F2}");
            }
            
            // Projecting to a named type
            var productViewModels = products.Select(p => new ProductViewModel
            {
                DisplayName = p.Name.ToUpper(),
                FormattedPrice = $"${p.Price:F2}",
                Category = p.Category
            });
            
            Console.WriteLine("\\nProduct view models:");
            foreach (var vm in productViewModels)
            {
                Console.WriteLine($"{vm.DisplayName} - {vm.FormattedPrice} ({vm.Category})");
            }
            
            // SelectMany to flatten collections
            var stores = new List<Store>
            {
                new Store { 
                    Name = "Main Street Store", 
                    Products = new List<Product> { 
                        new Product { Name = "T-Shirt", Price = 20 },
                        new Product { Name = "Jeans", Price = 60 }
                    }
                },
                new Store { 
                    Name = "Mall Store", 
                    Products = new List<Product> { 
                        new Product { Name = "Dress", Price = 80 },
                        new Product { Name = "Shoes", Price = 70 }
                    }
                }
            };
            
            var allProducts = stores.SelectMany(s => s.Products);
            
            Console.WriteLine("\\nAll products from all stores:");
            foreach (var product in allProducts)
            {
                Console.WriteLine($"{product.Name}: ${product.Price}");
            }
            
            // SelectMany with projection
            var storeProducts = stores.SelectMany(
                store => store.Products,
                (store, product) => new { StoreName = store.Name, ProductName = product.Name, product.Price }
            );
            
            Console.WriteLine("\\nProducts with store information:");
            foreach (var item in storeProducts)
            {
                Console.WriteLine($"{item.StoreName} - {item.ProductName}: ${item.Price}");
            }
        }
    }
    
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Category { get; set; }
    }
    
    public class ProductViewModel
    {
        public string DisplayName { get; set; }
        public string FormattedPrice { get; set; }
        public string Category { get; set; }
    }
    
    public class Store
    {
        public string Name { get; set; }
        public List<Product> Products { get; set; }
    }
}`;

const orderingCode = `using System;
using System.Linq;
using System.Collections.Generic;

namespace LinqOrderingExamples
{
    class Program
    {
        static void Main()
        {
            var products = new List<Product>
            {
                new Product { Name = "Laptop", Price = 1200, Rating = 4.5 },
                new Product { Name = "Smartphone", Price = 800, Rating = 4.8 },
                new Product { Name = "Headphones", Price = 200, Rating = 4.2 },
                new Product { Name = "Tablet", Price = 500, Rating = 4.5 },
                new Product { Name = "Smartwatch", Price = 250, Rating = 4.0 }
            };
            
            // Basic OrderBy
            var orderByPrice = products.OrderBy(p => p.Price);
            Console.WriteLine("Products ordered by price (ascending):");
            foreach (var product in orderByPrice)
            {
                Console.WriteLine($"{product.Name}: ${product.Price}");
            }
            
            // OrderByDescending
            var orderByPriceDesc = products.OrderByDescending(p => p.Price);
            Console.WriteLine("\\nProducts ordered by price (descending):");
            foreach (var product in orderByPriceDesc)
            {
                Console.WriteLine($"{product.Name}: ${product.Price}");
            }
            
            // ThenBy for secondary ordering
            var orderByRatingThenPrice = products
                .OrderByDescending(p => p.Rating)
                .ThenBy(p => p.Price);
                
            Console.WriteLine("\\nProducts ordered by rating (desc) then price (asc):");
            foreach (var product in orderByRatingThenPrice)
            {
                Console.WriteLine($"{product.Name}: {product.Rating} stars, ${product.Price}");
            }
            
            // Using query syntax
            var orderedQuery =
                from product in products
                orderby product.Rating descending, product.Name
                select product;
                
            Console.WriteLine("\\nProducts ordered by rating (desc) then name (query syntax):");
            foreach (var product in orderedQuery)
            {
                Console.WriteLine($"{product.Name}: {product.Rating} stars");
            }
            
            // Ordering with string operations
            var orderByNameLength = products.OrderBy(p => p.Name.Length);
            Console.WriteLine("\\nProducts ordered by name length:");
            foreach (var product in orderByNameLength)
            {
                Console.WriteLine($"{product.Name}: {product.Name.Length} characters");
            }
            
            // Reversing a sequence
            var reversed = products.OrderBy(p => p.Price).Reverse();
            Console.WriteLine("\\nProducts in reverse price order:");
            foreach (var product in reversed)
            {
                Console.WriteLine($"{product.Name}: ${product.Price}");
            }
        }
    }
    
    public class Product
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
        public double Rating { get; set; }
    }
}`;

export default function LinqFundamentalsPage() {
  return (
    <LessonLayout 
      title="LINQ Fundamentals"
      level="intermediate"
      sidebarItems={sidebarItems}
      next={{ href: '/intermediate/linq/advanced', title: 'Advanced LINQ Operations' }}
    >
      <div className="prose dark:prose-invert max-w-none">
        <h1>LINQ Fundamentals</h1>
        
        <p>
          Language Integrated Query (LINQ) is a set of features in C# that provides powerful query capabilities 
          directly within the language. LINQ allows you to write expressive queries to filter, transform, and 
          aggregate data from various sources using a consistent syntax.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
          <h3 className="text-xl font-semibold">Key Concepts</h3>
          <ul className="mt-2">
            <li><strong>Query Expressions</strong> - SQL-like syntax for defining queries</li>
            <li><strong>Extension Methods</strong> - Methods that extend IEnumerable&lt;T&gt;</li>
            <li><strong>Lambda Expressions</strong> - Compact function syntax used in LINQ queries</li>
            <li><strong>Deferred Execution</strong> - Queries are executed when enumerated, not when defined</li>
            <li><strong>Query Providers</strong> - Translate LINQ queries to different data sources</li>
          </ul>
        </div>

        <h2>Introduction to LINQ</h2>
        
        <p>
          LINQ provides two syntax options for writing queries:
        </p>
        <ul>
          <li><strong>Query Syntax</strong>: SQL-like syntax using keywords like <code>from</code>, <code>where</code>, and <code>select</code></li>
          <li><strong>Method Syntax</strong>: Uses extension methods like <code>Where()</code>, <code>Select()</code>, and <code>OrderBy()</code></li>
        </ul>
        <p>Both syntaxes are functionally equivalent, and you can choose based on your preference or readability.</p>

        <CodeEditor 
          initialCode={introCode}
          language="csharp"
          readOnly={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <h3 className="text-yellow-700 dark:text-yellow-400">Query Syntax</h3>
            <p className="mt-2">
              SQL-like declarative syntax:
            </p>
            <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded mt-2 text-sm">
{`var query = 
    from item in collection
    where item.Property > value
    orderby item.Name
    select item;`}
            </pre>
            <p className="mt-2">
              Advantages:
            </p>
            <ul className="mt-1">
              <li>Familiar to SQL developers</li>
              <li>Can be more readable for complex queries</li>
              <li>Clearer syntax for joins and groupings</li>
            </ul>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h3 className="text-green-700 dark:text-green-400">Method Syntax</h3>
            <p className="mt-2">
              Fluent API using method chaining:
            </p>
            <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded mt-2 text-sm">
{`var query = collection
    .Where(item => item.Property > value)
    .OrderBy(item => item.Name)
    .Select(item => item);`}
            </pre>
            <p className="mt-2">
              Advantages:
            </p>
            <ul className="mt-1">
              <li>More discoverable with IntelliSense</li>
              <li>Access to methods without query equivalents</li>
              <li>Preferred by many C# developers</li>
              <li>More flexible in some scenarios</li>
            </ul>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg my-4">
          <h4 className="text-purple-700 dark:text-purple-400 font-semibold">Deferred Execution</h4>
          <p className="mt-2">
            LINQ queries use deferred execution, which means:
          </p>
          <ul className="mt-2">
            <li>The query is not executed when it's defined, but when it's enumerated (e.g., in a foreach loop)</li>
            <li>This allows efficient processing of large datasets</li>
            <li>The query will reflect changes to the data source if executed multiple times</li>
            <li>Use methods like <code>ToList()</code>, <code>ToArray()</code>, or <code>ToDictionary()</code> to force immediate execution</li>
          </ul>
          <p className="mt-2">
            Example of deferred vs. immediate execution:
          </p>
          <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded mt-2 text-sm">
{`// Deferred execution: query is defined but not executed yet
var query = numbers.Where(n => n > 5);

// Add a new number to the source collection
numbers.Add(10);

// Immediate execution: creates a snapshot of results
var snapshot = numbers.Where(n => n > 5).ToList();

// Add another number
numbers.Add(20);

// The query will include both 10 and 20
// The snapshot will only include numbers > 5 from before ToList() was called`}
          </pre>
        </div>

        <h2>Filtering Operations</h2>
        
        <p>
          Filtering operations allow you to select elements from a collection based on a condition.
          The primary filtering method in LINQ is <code>Where</code>.
        </p>

        <CodeEditor 
          initialCode={filteringCode}
          language="csharp"
          readOnly={true}
        />

        <h2>Projections</h2>
        
        <p>
          Projection operations transform elements from the source sequence into a new form.
          The main projection methods are <code>Select</code> and <code>SelectMany</code>.
        </p>

        <CodeEditor 
          initialCode={projectingCode}
          language="csharp"
          readOnly={true}
        />
        
        <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg my-4">
          <h4 className="text-pink-700 dark:text-pink-400 font-semibold">Select vs. SelectMany</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <h5 className="font-semibold">Select</h5>
              <ul className="mt-1">
                <li>One-to-one transformation</li>
                <li>Returns the same number of elements as the source</li>
                <li>Each input element maps to one output element</li>
              </ul>
              <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded mt-2 text-sm">
{`var names = people.Select(p => p.Name);
// If people has 5 elements, names has 5`}
              </pre>
            </div>
            <div>
              <h5 className="font-semibold">SelectMany</h5>
              <ul className="mt-1">
                <li>One-to-many transformation</li>
                <li>Flattens nested collections</li>
                <li>Each input element can map to multiple output elements</li>
              </ul>
              <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded mt-2 text-sm">
{`var allOrders = customers.SelectMany(c => c.Orders);
// Flattens all customer orders into a single sequence`}
              </pre>
            </div>
          </div>
        </div>

        <h2>Ordering Operations</h2>
        
        <p>
          Ordering operations allow you to sort elements in a sequence based on one or more criteria.
        </p>

        <CodeEditor 
          initialCode={orderingCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-csharp-blue-50 dark:bg-csharp-blue-900/20 p-4 rounded-lg mt-6">
          <h3 className="text-csharp-blue-700 dark:text-csharp-blue-400">Practice Exercise</h3>
          <p>
            Build a LINQ-powered movie catalog application:
          </p>
          <ol className="mt-2">
            <li>Create a console application with the following classes:
              <ul className="ml-4 mt-1">
                <li>Movie (Id, Title, Year, Director, Duration, Rating, Genres)</li>
                <li>Director (Id, Name, Country, BirthDate)</li>
                <li>Actor (Id, Name, Gender, BirthDate)</li>
                <li>MovieActor (MovieId, ActorId, Role)</li>
              </ul>
            </li>
            <li>Define sample data with at least 10 movies, 5 directors, and 15 actors</li>
            <li>Implement the following LINQ queries:
              <ul className="ml-4 mt-1">
                <li>List all movies released after 2010, ordered by rating</li>
                <li>Find all movies by a specific director</li>
                <li>List all actors in a specific movie, ordered by name</li>
                <li>Find all movies in a specific genre (e.g., "Action", "Comedy")</li>
                <li>Create a summary of movies by year, showing count and average rating</li>
                <li>Create a combined report with movie titles and their actor counts</li>
              </ul>
            </li>
            <li>Implement both query syntax and method syntax for at least two queries</li>
            <li>Create a simple menu system to allow the user to select which query to run</li>
          </ol>
          <p className="mt-2">
            This exercise will help you apply filtering, projection, and ordering operations in a realistic scenario.
          </p>
        </div>
      </div>
    </LessonLayout>
  );
}