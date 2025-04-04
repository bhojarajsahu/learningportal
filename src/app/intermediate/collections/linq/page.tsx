import React from 'react';
import { FiPackage, FiDatabase, FiFilter } from 'react-icons/fi';
import LessonLayout from '@/components/LessonLayout';
import CodeEditor from '@/components/CodeEditor';

const sidebarItems = [
  {
    title: 'Collections and Generics',
    href: '/intermediate/collections',
    icon: <FiPackage className="w-4 h-4" />,
    children: [
      { title: 'Generic Types and Methods', href: '/intermediate/collections/generics' },
      { title: 'Advanced Collections', href: '/intermediate/collections/advanced' },
      { title: 'LINQ Fundamentals', href: '/intermediate/collections/linq' },
    ]
  },
];

const linqBasicsCode = `using System;
using System.Collections.Generic;
using System.Linq;

class Program
{
    static void Main(string[] args)
    {
        // Sample data
        List<int> numbers = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
        
        // LINQ query using query syntax
        var evenNumbersQuery = 
            from num in numbers
            where num % 2 == 0
            select num;
        
        Console.WriteLine("Even numbers (query syntax):");
        foreach (var num in evenNumbersQuery)
        {
            Console.WriteLine(num);
        }
        
        // LINQ query using method syntax
        var evenNumbersMethod = numbers.Where(num => num % 2 == 0);
        
        Console.WriteLine("\\nEven numbers (method syntax):");
        foreach (var num in evenNumbersMethod)
        {
            Console.WriteLine(num);
        }
        
        // Creating a transformed sequence
        var squaredNumbers = numbers.Select(num => num * num);
        
        Console.WriteLine("\\nSquared numbers:");
        foreach (var num in squaredNumbers)
        {
            Console.WriteLine(num);
        }
        
        // Filtering and transforming
        var evenSquares = numbers
            .Where(num => num % 2 == 0)
            .Select(num => num * num);
        
        Console.WriteLine("\\nSquares of even numbers:");
        foreach (var num in evenSquares)
        {
            Console.WriteLine(num);
        }
        
        Console.ReadKey();
    }
}`;

const filteringSortingCode = `using System;
using System.Collections.Generic;
using System.Linq;

// Sample data class
class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Category { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
    
    public override string ToString()
    {
        return $"{Id}: {Name}, {Category}, {Price}, Stock: {Stock}";
    }
}

class Program
{
    static void Main(string[] args)
    {
        // Create sample data
        List<Product> products = new List<Product>
        {
            new Product { Id = 1, Name = "Laptop", Category = "Electronics", Price = 999.99m, Stock = 10 },
            new Product { Id = 2, Name = "Phone", Category = "Electronics", Price = 699.99m, Stock = 20 },
            new Product { Id = 3, Name = "T-Shirt", Category = "Clothing", Price = 19.99m, Stock = 50 },
            new Product { Id = 4, Name = "Jeans", Category = "Clothing", Price = 49.99m, Stock = 30 },
            new Product { Id = 5, Name = "Book", Category = "Books", Price = 14.99m, Stock = 100 },
            new Product { Id = 6, Name = "Headphones", Category = "Electronics", Price = 149.99m, Stock = 15 },
            new Product { Id = 7, Name = "Tablet", Category = "Electronics", Price = 399.99m, Stock = 5 },
            new Product { Id = 8, Name = "Notebook", Category = "Books", Price = 4.99m, Stock = 200 }
        };
        
        // Filtering
        Console.WriteLine("Electronics products:");
        var electronics = products.Where(p => p.Category == "Electronics");
        foreach (var product in electronics)
        {
            Console.WriteLine(product);
        }
        
        // Filtering with multiple conditions
        Console.WriteLine("\\nExpensive electronics (price > 500):");
        var expensiveElectronics = products
            .Where(p => p.Category == "Electronics" && p.Price > 500);
        foreach (var product in expensiveElectronics)
        {
            Console.WriteLine(product);
        }
        
        // Sorting (OrderBy)
        Console.WriteLine("\\nProducts sorted by price (ascending):");
        var sortedByPrice = products.OrderBy(p => p.Price);
        foreach (var product in sortedByPrice)
        {
            Console.WriteLine(product);
        }
        
        // Sorting (OrderByDescending)
        Console.WriteLine("\\nProducts sorted by price (descending):");
        var sortedByPriceDesc = products.OrderByDescending(p => p.Price);
        foreach (var product in sortedByPriceDesc)
        {
            Console.WriteLine(product);
        }
        
        // Sorting by multiple properties (ThenBy)
        Console.WriteLine("\\nProducts sorted by category, then by price:");
        var sortedByCategoryThenPrice = products
            .OrderBy(p => p.Category)
            .ThenBy(p => p.Price);
        foreach (var product in sortedByCategoryThenPrice)
        {
            Console.WriteLine(product);
        }
        
        // Taking a subset of results
        Console.WriteLine("\\nTop 3 most expensive products:");
        var top3 = products
            .OrderByDescending(p => p.Price)
            .Take(3);
        foreach (var product in top3)
        {
            Console.WriteLine(product);
        }
        
        // Skipping and taking (paging)
        Console.WriteLine("\\nPage 2 (items 3-4) when sorted by price:");
        var page2 = products
            .OrderBy(p => p.Price)
            .Skip(2)
            .Take(2);
        foreach (var product in page2)
        {
            Console.WriteLine(product);
        }
        
        Console.ReadKey();
    }
}`;

const projectionsJoinsCode = `using System;
using System.Collections.Generic;
using System.Linq;

// Sample data classes
class Category
{
    public int Id { get; set; }
    public string Name { get; set; }
}

class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int CategoryId { get; set; }
    public decimal Price { get; set; }
}

class Program
{
    static void Main(string[] args)
    {
        // Sample data
        List<Category> categories = new List<Category>
        {
            new Category { Id = 1, Name = "Electronics" },
            new Category { Id = 2, Name = "Clothing" },
            new Category { Id = 3, Name = "Books" }
        };
        
        List<Product> products = new List<Product>
        {
            new Product { Id = 1, Name = "Laptop", CategoryId = 1, Price = 999.99m },
            new Product { Id = 2, Name = "Phone", CategoryId = 1, Price = 699.99m },
            new Product { Id = 3, Name = "T-Shirt", CategoryId = 2, Price = 19.99m },
            new Product { Id = 4, Name = "Jeans", CategoryId = 2, Price = 49.99m },
            new Product { Id = 5, Name = "Book", CategoryId = 3, Price = 14.99m },
            new Product { Id = 6, Name = "Headphones", CategoryId = 1, Price = 149.99m },
            new Product { Id = 7, Name = "Tablet", CategoryId = 1, Price = 399.99m },
            new Product { Id = 8, Name = "Notebook", CategoryId = 3, Price = 4.99m },
            new Product { Id = 9, Name = "Discontinued Item", CategoryId = 4, Price = 9.99m }
        };
        
        // Projection - Selecting specific properties
        Console.WriteLine("Product names and prices:");
        var productInfos = products.Select(p => new { p.Name, p.Price });
        foreach (var info in productInfos)
        {
            Console.WriteLine(info.Name + ": $" + info.Price);
        }
        
        // Projection with transformation
        Console.WriteLine("\\nProduct names and discounted prices (10% off):");
        var discountedProducts = products.Select(p => new { 
            p.Name, 
            OriginalPrice = p.Price,
            DiscountedPrice = p.Price * 0.9m
        });
        foreach (var product in discountedProducts)
        {
            Console.WriteLine($"{product.Name}: {product.OriginalPrice} -> {product.DiscountedPrice:F2}");
        }
        
        // Inner Join
        Console.WriteLine("\\nProducts with category names (inner join):");
        var productsWithCategories = products
            .Join(
                categories,
                product => product.CategoryId,
                category => category.Id,
                (product, category) => new { 
                    ProductName = product.Name, 
                    CategoryName = category.Name,
                    Price = product.Price
                }
            );
        foreach (var item in productsWithCategories)
        {
            Console.WriteLine(item.ProductName + " (" + item.CategoryName + "): $" + item.Price);
        }
        
        // Group Join
        Console.WriteLine("\\nCategories with their products (group join):");
        var categoriesWithProducts = categories
            .GroupJoin(
                products,
                category => category.Id,
                product => product.CategoryId,
                (category, productGroup) => new {
                    CategoryName = category.Name,
                    Products = productGroup.ToList()
                }
            );
        foreach (var category in categoriesWithProducts)
        {
            Console.WriteLine(category.CategoryName + " (" + category.Products.Count + " products):");
            foreach (var product in category.Products)
            {
                Console.WriteLine("  - " + product.Name + ": $" + product.Price);
            }
        }
        
        // Left Outer Join
        Console.WriteLine("\\nProducts with category names (left outer join):");
        var leftJoin = products
            .GroupJoin(
                categories,
                product => product.CategoryId,
                category => category.Id,
                (product, categoryGroup) => new { 
                    Product = product, 
                    Categories = categoryGroup
                }
            )
            .SelectMany(
                x => x.Categories.DefaultIfEmpty(),
                (productInfo, category) => new { 
                    ProductName = productInfo.Product.Name,
                    CategoryName = category?.Name ?? "Unknown Category",
                    Price = productInfo.Product.Price
                }
            );
        foreach (var item in leftJoin)
        {
            Console.WriteLine(item.ProductName + " (" + item.CategoryName + "): $" + item.Price);
        }
        
        Console.ReadKey();
    }
}`;

const aggregationsGroupingCode = `using System;
using System.Collections.Generic;
using System.Linq;

class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Category { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
}

class Program
{
    static void Main(string[] args)
    {
        // Sample data
        List<Product> products = new List<Product>
        {
            new Product { Id = 1, Name = "Laptop", Category = "Electronics", Price = 999.99m, Stock = 10 },
            new Product { Id = 2, Name = "Phone", Category = "Electronics", Price = 699.99m, Stock = 20 },
            new Product { Id = 3, Name = "T-Shirt", Category = "Clothing", Price = 19.99m, Stock = 50 },
            new Product { Id = 4, Name = "Jeans", Category = "Clothing", Price = 49.99m, Stock = 30 },
            new Product { Id = 5, Name = "Book", Category = "Books", Price = 14.99m, Stock = 100 },
            new Product { Id = 6, Name = "Headphones", Category = "Electronics", Price = 149.99m, Stock = 15 },
            new Product { Id = 7, Name = "Tablet", Category = "Electronics", Price = 399.99m, Stock = 5 },
            new Product { Id = 8, Name = "Notebook", Category = "Books", Price = 4.99m, Stock = 200 }
        };
        
        // Simple aggregation functions
        Console.WriteLine("Aggregation examples:");
        Console.WriteLine("Total number of products: " + products.Count());
        Console.WriteLine("Number of electronics: " + products.Count(p => p.Category == "Electronics"));
        Console.WriteLine("Average price: $" + products.Average(p => p.Price).ToString("F2"));
        Console.WriteLine("Total inventory value: $" + products.Sum(p => p.Price * p.Stock).ToString("F2"));
        Console.WriteLine("Lowest price: $" + products.Min(p => p.Price));
        Console.WriteLine("Highest price: $" + products.Max(p => p.Price));
        
        // Finding items
        Console.WriteLine("\\nFound items:");
        Product cheapest = products.OrderBy(p => p.Price).First();
        Console.WriteLine("Cheapest product: " + cheapest.Name + " ($" + cheapest.Price + ")");
        
        Product mostExpensive = products.OrderByDescending(p => p.Price).First();
        Console.WriteLine("Most expensive product: " + mostExpensive.Name + " ($" + mostExpensive.Price + ")");
        
        // FirstOrDefault for potentially empty results
        Product expensiveBook = products
            .Where(p => p.Category == "Books" && p.Price > 100)
            .FirstOrDefault();
        Console.WriteLine("Expensive book: " + (expensiveBook != null ? expensiveBook.Name : "None found"));
        
        // Grouping
        Console.WriteLine("\\nProducts grouped by category:");
        var groupedByCategory = products.GroupBy(p => p.Category);
        
        foreach (var group in groupedByCategory)
        {
            Console.WriteLine(group.Key + " (" + group.Count() + " products):");
            
            foreach (var product in group)
            {
                Console.WriteLine("  - " + product.Name + ": $" + product.Price);
            }
            
            // Aggregations within groups
            Console.WriteLine("  Average price: $" + group.Average(p => p.Price).ToString("F2"));
            Console.WriteLine("  Total value: $" + group.Sum(p => p.Price * p.Stock).ToString("F2"));
            Console.WriteLine();
        }
        
        // Grouping with projection
        Console.WriteLine("Category summary:");
        var categorySummary = products
            .GroupBy(p => p.Category)
            .Select(g => new {
                Category = g.Key,
                ProductCount = g.Count(),
                AveragePrice = g.Average(p => p.Price),
                TotalStock = g.Sum(p => p.Stock),
                TotalValue = g.Sum(p => p.Price * p.Stock)
            });
        
        foreach (var summary in categorySummary)
        {
            Console.WriteLine(summary.Category + ":");
            Console.WriteLine("  Count: " + summary.ProductCount);
            Console.WriteLine("  Avg Price: $" + summary.AveragePrice.ToString("F2"));
            Console.WriteLine("  Total Stock: " + summary.TotalStock);
            Console.WriteLine("  Total Value: $" + summary.TotalValue.ToString("F2"));
        }
        
        Console.ReadKey();
    }
}`;

export default function LinqPage() {
  return (
    <LessonLayout 
      title="LINQ Fundamentals"
      level="intermediate"
      sidebarItems={sidebarItems}
      prev={{ href: '/intermediate/collections/advanced', title: 'Advanced Collections' }}
      next={{ href: '/advanced', title: 'Advanced C# Programming' }}
    >
      <div className="prose dark:prose-invert max-w-none">
        <h1>LINQ Fundamentals in C#</h1>
        
        <p>
          Language Integrated Query (LINQ) is one of the most powerful features in C#. It provides a unified
          syntax for querying data from various sources, including collections, databases, XML, and more.
          LINQ brings the power of query expressions directly into the C# language.
        </p>

        <h2>Introduction to LINQ</h2>
        
        <p>
          LINQ allows you to perform complex data operations like filtering, sorting, grouping, and joining
          using a consistent syntax, regardless of the data source. It makes data manipulation code more:
        </p>

        <ul>
          <li><strong>Readable</strong>: Query expressions closely resemble SQL, making them intuitive</li>
          <li><strong>Concise</strong>: Accomplish complex operations with minimal code</li>
          <li><strong>Type-safe</strong>: Queries are checked at compile time, reducing runtime errors</li>
          <li><strong>Consistent</strong>: Use the same syntax across different data sources</li>
        </ul>

        <h2>LINQ Query Syntax vs. Method Syntax</h2>
        
        <p>
          LINQ provides two different syntaxes to write queries: query syntax and method syntax.
        </p>

        <CodeEditor 
          initialCode={linqBasicsCode}
          language="csharp"
          readOnly={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3>Query Syntax</h3>
            <pre className="text-sm"><code>
            {`var query = 
    from item in collection
    where item.Property > value
    select item;`}
            </code></pre>
            <p className="text-sm mt-2">
              Similar to SQL, more readable for complex queries with joins and grouping.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3>Method Syntax</h3>
            <pre className="text-sm"><code>
            {`var query = collection
    .Where(item => item.Property > value)
    .Select(item => item);`}
            </code></pre>
            <p className="text-sm mt-2">
              More flexible, supports all LINQ operators, and enables method chaining.
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg my-4">
          <p className="font-semibold">Note:</p>
          <p>
            Both syntaxes are compiled to the same intermediate language code. The choice between them
            is primarily a matter of preference and readability for the specific query.
          </p>
        </div>

        <h2>Filtering and Sorting with LINQ</h2>
        
        <p>
          LINQ makes it easy to filter and sort collections based on various criteria.
        </p>

        <CodeEditor 
          initialCode={filteringSortingCode}
          language="csharp"
          readOnly={true}
        />

        <p>
          Key filtering and sorting operators include:
        </p>

        <ul>
          <li><code>Where</code>: Filters elements based on a predicate</li>
          <li><code>OrderBy</code>: Sorts elements in ascending order</li>
          <li><code>OrderByDescending</code>: Sorts elements in descending order</li>
          <li><code>ThenBy</code>/<code>ThenByDescending</code>: Adds secondary sorting criteria</li>
          <li><code>Take</code>: Selects a specified number of elements from the beginning</li>
          <li><code>Skip</code>: Bypasses a specified number of elements</li>
          <li><code>First</code>/<code>FirstOrDefault</code>: Gets the first element matching a condition</li>
          <li><code>Single</code>/<code>SingleOrDefault</code>: Gets the only element matching a condition</li>
        </ul>

        <h2>Projections and Joins</h2>
        
        <p>
          LINQ allows you to transform data and combine related data from different sources.
        </p>

        <CodeEditor 
          initialCode={projectionsJoinsCode}
          language="csharp"
          readOnly={true}
        />

        <p>
          Key projection and join operators include:
        </p>

        <ul>
          <li><code>Select</code>: Transforms each element into a new form</li>
          <li><code>SelectMany</code>: Flattens collections of collections</li>
          <li><code>Join</code>: Performs an inner join between two collections</li>
          <li><code>GroupJoin</code>: Performs a group join between two collections</li>
        </ul>

        <h2>Aggregation and Grouping</h2>
        
        <p>
          LINQ provides powerful aggregation functions and grouping capabilities.
        </p>

        <CodeEditor 
          initialCode={aggregationsGroupingCode}
          language="csharp"
          readOnly={true}
        />

        <p>
          Key aggregation and grouping operators:
        </p>

        <ul>
          <li><code>Count</code>/<code>LongCount</code>: Counts the elements in a sequence</li>
          <li><code>Sum</code>: Calculates the sum of numeric values</li>
          <li><code>Average</code>: Calculates the average of numeric values</li>
          <li><code>Min</code>: Finds the minimum value</li>
          <li><code>Max</code>: Finds the maximum value</li>
          <li><code>GroupBy</code>: Groups elements by a key</li>
          <li><code>Aggregate</code>: Performs a custom aggregation operation</li>
        </ul>

        <h2>LINQ Execution: Deferred vs. Immediate</h2>
        
        <p>
          Understanding when LINQ queries execute is crucial:
        </p>

        <ul>
          <li>
            <strong>Deferred execution</strong>: Most LINQ queries use deferred execution, meaning they're only 
            executed when you iterate over the results. This allows for building query expressions incrementally.
          </li>
          <li>
            <strong>Immediate execution</strong>: Some LINQ operations force immediate execution, such as:
            <ul>
              <li>Aggregation operators: <code>Count()</code>, <code>Sum()</code>, <code>Average()</code>, etc.</li>
              <li>Element operators: <code>First()</code>, <code>Single()</code>, <code>Last()</code>, etc.</li>
              <li>Conversion operators: <code>ToList()</code>, <code>ToArray()</code>, <code>ToDictionary()</code>, etc.</li>
            </ul>
          </li>
        </ul>

        <div className="bg-csharp-blue-50 dark:bg-csharp-blue-900/20 p-4 rounded-lg mt-6">
          <h3 className="text-csharp-blue-700 dark:text-csharp-blue-400">Practice Exercise</h3>
          <p>
            Create a program that uses LINQ to analyze a collection of books. Your program should:
          </p>
          <ul>
            <li>Define a <code>Book</code> class with properties for Title, Author, PublicationYear, Genre, and Price</li>
            <li>Create a list of at least 10 books with varied data</li>
            <li>Write LINQ queries to:
              <ul>
                <li>Find all books published after 2000</li>
                <li>Find the most expensive book</li>
                <li>Find the average price of books by genre</li>
                <li>Group books by author and display the count for each author</li>
                <li>Select the top 3 most recent books</li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="mt-8">
          <p>
            Congratulations! You've completed the Intermediate Collections and Generics module. In the next section,
            we'll move on to advanced C# topics like asynchronous programming, reflection, and more.
          </p>
        </div>
      </div>
    </LessonLayout>
  );
} 