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

const groupingCode = `using System;
using System.Linq;
using System.Collections.Generic;

namespace AdvancedLinqExamples
{
    class Program
    {
        static void Main()
        {
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
            
            // Basic GroupBy
            var groupsByCategory = products.GroupBy(p => p.Category);
            
            Console.WriteLine("Products grouped by category:");
            foreach (var group in groupsByCategory)
            {
                Console.WriteLine($"Category: {group.Key} ({group.Count()} items)");
                foreach (var product in group)
                {
                    Console.WriteLine($"  {product.Name}: ${product.Price}");
                }
            }
            
            // GroupBy with projection
            var categorySummary = products
                .GroupBy(p => p.Category)
                .Select(g => new {
                    Category = g.Key,
                    Count = g.Count(),
                    AveragePrice = g.Average(p => p.Price),
                    MinPrice = g.Min(p => p.Price),
                    MaxPrice = g.Max(p => p.Price),
                    TotalValue = g.Sum(p => p.Price)
                });
                
            Console.WriteLine("\\nCategory summary:");
            foreach (var summary in categorySummary)
            {
                Console.WriteLine($"Category: {summary.Category}");
                Console.WriteLine($"  Count: {summary.Count}");
                Console.WriteLine($"  Price Range: ${summary.MinPrice} - ${summary.MaxPrice}");
                Console.WriteLine($"  Average Price: ${summary.AveragePrice:F2}");
                Console.WriteLine($"  Total Value: ${summary.TotalValue:F2}");
            }
            
            // Multiple keys grouping
            var groupsByPriceAndCategory = products
                .GroupBy(p => new { 
                    Category = p.Category, 
                    PriceRange = p.Price < 100 ? "Budget" : 
                                (p.Price < 500 ? "Mid-range" : "Premium") 
                });
                
            Console.WriteLine("\\nProducts grouped by category and price range:");
            foreach (var group in groupsByPriceAndCategory)
            {
                Console.WriteLine($"{group.Key.Category} - {group.Key.PriceRange} ({group.Count()} items)");
                foreach (var product in group)
                {
                    Console.WriteLine($"  {product.Name}: ${product.Price}");
                }
            }
            
            // Using query syntax
            var queryGroups = 
                from product in products
                group product by product.Category into categoryGroup
                select new {
                    Category = categoryGroup.Key,
                    Products = categoryGroup.OrderBy(p => p.Price),
                    Count = categoryGroup.Count()
                };
                
            Console.WriteLine("\\nGrouping with query syntax:");
            foreach (var group in queryGroups)
            {
                Console.WriteLine($"{group.Category} ({group.Count} items)");
                foreach (var product in group.Products)
                {
                    Console.WriteLine($"  {product.Name}: ${product.Price}");
                }
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

const joinCode = `using System;
using System.Linq;
using System.Collections.Generic;

namespace JoiningExamples
{
    class Program
    {
        static void Main()
        {
            var products = new List<Product>
            {
                new Product { Id = 1, Name = "Laptop", Price = 1200, CategoryId = 1 },
                new Product { Id = 2, Name = "Headphones", Price = 100, CategoryId = 1 },
                new Product { Id = 3, Name = "Coffee Mug", Price = 15, CategoryId = 2 },
                new Product { Id = 4, Name = "Desk Chair", Price = 250, CategoryId = 3 },
                new Product { Id = 5, Name = "Smartphone", Price = 800, CategoryId = 1 }
            };
            
            var categories = new List<Category>
            {
                new Category { Id = 1, Name = "Electronics" },
                new Category { Id = 2, Name = "Kitchenware" },
                new Category { Id = 3, Name = "Furniture" },
                new Category { Id = 4, Name = "Books" } // No products in this category
            };
            
            var orders = new List<Order>
            {
                new Order { Id = 1, CustomerId = "C1", OrderDate = new DateTime(2023, 1, 15) },
                new Order { Id = 2, CustomerId = "C2", OrderDate = new DateTime(2023, 2, 10) }
            };
            
            var orderDetails = new List<OrderDetail>
            {
                new OrderDetail { OrderId = 1, ProductId = 1, Quantity = 1 },
                new OrderDetail { OrderId = 1, ProductId = 2, Quantity = 1 },
                new OrderDetail { OrderId = 2, ProductId = 3, Quantity = 2 },
                new OrderDetail { OrderId = 2, ProductId = 5, Quantity = 1 }
            };
            
            // Inner Join with method syntax
            var innerJoin = products.Join(
                categories,
                product => product.CategoryId,
                category => category.Id,
                (product, category) => new { 
                    ProductName = product.Name, 
                    Price = product.Price, 
                    Category = category.Name 
                }
            );
            
            Console.WriteLine("Products with categories (Inner Join):");
            foreach (var item in innerJoin)
            {
                Console.WriteLine($"{item.ProductName} (${item.Price}) - Category: {item.Category}");
            }
            
            // Inner Join with query syntax
            var innerJoinQuery =
                from product in products
                join category in categories
                on product.CategoryId equals category.Id
                select new { 
                    ProductName = product.Name, 
                    Price = product.Price, 
                    Category = category.Name 
                };
                
            Console.WriteLine("\\nProducts with categories (Query Syntax):");
            foreach (var item in innerJoinQuery)
            {
                Console.WriteLine($"{item.ProductName} (${item.Price}) - Category: {item.Category}");
            }
            
            // Left Join (using GroupJoin + SelectMany)
            var leftJoin = categories.GroupJoin(
                products,
                category => category.Id,
                product => product.CategoryId,
                (category, productsGroup) => new { 
                    Category = category.Name, 
                    Products = productsGroup.DefaultIfEmpty() 
                }
            ).SelectMany(
                x => x.Products.Select(product => new { 
                    Category = x.Category, 
                    ProductName = product?.Name ?? "No Product", 
                    Price = product?.Price ?? 0 
                })
            );
            
            Console.WriteLine("\\nCategories with products (Left Join):");
            foreach (var item in leftJoin)
            {
                Console.WriteLine($"Category: {item.Category} - {item.ProductName} (${item.Price})");
            }
            
            // Left Join with query syntax
            var leftJoinQuery =
                from category in categories
                join product in products
                on category.Id equals product.CategoryId into categoryProducts
                from cp in categoryProducts.DefaultIfEmpty()
                select new { 
                    Category = category.Name, 
                    ProductName = cp?.Name ?? "No Product", 
                    Price = cp?.Price ?? 0 
                };
                
            Console.WriteLine("\\nCategories with products (Query Syntax):");
            foreach (var item in leftJoinQuery)
            {
                Console.WriteLine($"Category: {item.Category} - {item.ProductName} (${item.Price})");
            }
            
            // Multiple joins - getting order information with product details
            var orderInfo = 
                from order in orders
                join detail in orderDetails on order.Id equals detail.OrderId
                join product in products on detail.ProductId equals product.Id
                join category in categories on product.CategoryId equals category.Id
                select new {
                    OrderId = order.Id,
                    OrderDate = order.OrderDate,
                    ProductName = product.Name,
                    Category = category.Name,
                    Quantity = detail.Quantity,
                    ItemTotal = product.Price * detail.Quantity
                };
                
            Console.WriteLine("\\nOrder details with product information:");
            foreach (var item in orderInfo)
            {
                Console.WriteLine($"Order #{item.OrderId} ({item.OrderDate.ToShortDateString()})");
                Console.WriteLine($"  {item.ProductName} ({item.Category})");
                Console.WriteLine($"  Quantity: {item.Quantity}, Total: ${item.ItemTotal}");
            }
        }
    }
    
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int CategoryId { get; set; }
    }
    
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
    
    public class Order
    {
        public int Id { get; set; }
        public string CustomerId { get; set; }
        public DateTime OrderDate { get; set; }
    }
    
    public class OrderDetail
    {
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}`;

const aggregationCode = `using System;
using System.Linq;
using System.Collections.Generic;

namespace AggregationExamples
{
    class Program
    {
        static void Main()
        {
            var products = new List<Product>
            {
                new Product { Id = 1, Name = "Laptop", Price = 1200, CategoryId = 1 },
                new Product { Id = 2, Name = "Headphones", Price = 100, CategoryId = 1 },
                new Product { Id = 3, Name = "Coffee Mug", Price = 15, CategoryId = 2 },
                new Product { Id = 4, Name = "Desk Chair", Price = 250, CategoryId = 3 },
                new Product { Id = 5, Name = "Smartphone", Price = 800, CategoryId = 1 },
                new Product { Id = 6, Name = "Water Bottle", Price = 25, CategoryId = 2 },
                new Product { Id = 7, Name = "Bookshelf", Price = 175, CategoryId = 3 }
            };
            
            var sales = new List<Sale>
            {
                new Sale { ProductId = 1, Quantity = 3, Date = new DateTime(2023, 1, 15) },
                new Sale { ProductId = 2, Quantity = 5, Date = new DateTime(2023, 1, 20) },
                new Sale { ProductId = 3, Quantity = 10, Date = new DateTime(2023, 1, 25) },
                new Sale { ProductId = 4, Quantity = 2, Date = new DateTime(2023, 2, 5) },
                new Sale { ProductId = 1, Quantity = 1, Date = new DateTime(2023, 2, 10) },
                new Sale { ProductId = 5, Quantity = 4, Date = new DateTime(2023, 2, 15) }
            };
            
            // Basic aggregation functions
            decimal totalInventoryValue = products.Sum(p => p.Price);
            decimal averagePrice = products.Average(p => p.Price);
            decimal minPrice = products.Min(p => p.Price);
            decimal maxPrice = products.Max(p => p.Price);
            int productCount = products.Count();
            
            Console.WriteLine("Basic aggregation:");
            Console.WriteLine($"Total product count: {productCount}");
            Console.WriteLine($"Total inventory value: ${totalInventoryValue}");
            Console.WriteLine($"Average price: ${averagePrice:F2}");
            Console.WriteLine($"Price range: ${minPrice} - ${maxPrice}");
            
            // Aggregation with filtering
            decimal electronicsValue = products
                .Where(p => p.CategoryId == 1)
                .Sum(p => p.Price);
                
            Console.WriteLine($"\\nTotal value of electronics: ${electronicsValue}");
            
            // Aggregation with complex calculations
            var salesWithValues = sales
                .Join(products,
                    sale => sale.ProductId,
                    product => product.Id,
                    (sale, product) => new { 
                        sale.Date, sale.Quantity, product.Price, 
                        Total = sale.Quantity * product.Price
                    });
                    
            decimal totalSalesValue = salesWithValues.Sum(s => s.Total);
            int totalItemsSold = salesWithValues.Sum(s => s.Quantity);
            
            Console.WriteLine("\\nSales summary:");
            Console.WriteLine($"Total sales value: ${totalSalesValue:F2}");
            Console.WriteLine($"Total items sold: {totalItemsSold}");
            
            // Grouped aggregation
            var salesByMonth = salesWithValues
                .GroupBy(s => new { Month = s.Date.Month, Year = s.Date.Year })
                .Select(g => new {
                    Period = $"{g.Key.Year}-{g.Key.Month}",
                    TotalSales = g.Sum(s => s.Total),
                    ItemsSold = g.Sum(s => s.Quantity)
                })
                .OrderBy(s => s.Period);
                
            Console.WriteLine("\\nSales by month:");
            foreach (var monthlySales in salesByMonth)
            {
                Console.WriteLine($"{monthlySales.Period}: ${monthlySales.TotalSales:F2} ({monthlySales.ItemsSold} items)");
            }
            
            // Category-based statistics
            var categoryStats = products
                .GroupBy(p => p.CategoryId)
                .Select(g => new {
                    CategoryId = g.Key,
                    AveragePrice = g.Average(p => p.Price),
                    TotalProducts = g.Count(),
                    TotalValue = g.Sum(p => p.Price)
                });
                
            Console.WriteLine("\\nCategory statistics:");
            foreach (var stat in categoryStats)
            {
                Console.WriteLine($"Category {stat.CategoryId}:");
                Console.WriteLine($"  Products: {stat.TotalProducts}");
                Console.WriteLine($"  Average price: ${stat.AveragePrice:F2}");
                Console.WriteLine($"  Total value: ${stat.TotalValue:F2}");
            }
            
            // Aggregate with query syntax
            var categorySales = 
                from sale in sales
                join product in products on sale.ProductId equals product.Id
                group new { sale, product } by product.CategoryId into g
                select new {
                    CategoryId = g.Key,
                    TotalSales = g.Sum(x => x.sale.Quantity * x.product.Price),
                    UnitsSold = g.Sum(x => x.sale.Quantity)
                };
                
            Console.WriteLine("\\nSales by category:");
            foreach (var categorySale in categorySales)
            {
                Console.WriteLine($"Category {categorySale.CategoryId}: ${categorySale.TotalSales:F2} ({categorySale.UnitsSold} units)");
            }
        }
    }
    
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int CategoryId { get; set; }
    }
    
    public class Sale
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public DateTime Date { get; set; }
    }
}`;

export default function AdvancedLinqPage() {
  return (
    <LessonLayout 
      title="Advanced LINQ Operations"
      level="intermediate"
      sidebarItems={sidebarItems}
      prev={{ href: '/intermediate/linq/fundamentals', title: 'LINQ Fundamentals' }}
      next={{ href: '/intermediate/linq/entity-framework', title: 'LINQ to Entities' }}
    >
      <div className="prose dark:prose-invert max-w-none">
        <h1>Advanced LINQ Operations</h1>
        
        <p>
          This lesson covers advanced LINQ operations that help you solve complex data manipulation challenges. 
          We'll explore grouping, joining, aggregation, and other powerful LINQ capabilities for working with collections.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
          <h3 className="text-xl font-semibold">What You'll Learn</h3>
          <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
            <li>Using GroupBy to organize data by keys</li>
            <li>Joining multiple data sources</li>
            <li>Aggregation functions (Sum, Average, etc.)</li>
            <li>Set operations (Union, Intersect, etc.)</li>
            <li>Using custom comparers</li>
            <li>Elements, partitioning, and generation</li>
            <li>Efficient LINQ query techniques</li>
            <li>Creating your own extension methods</li>
          </ul>
        </div>

        <h2>Grouping Data with GroupBy</h2>
        
        <p>
          The <code>GroupBy</code> operator organizes a sequence of elements into groups based on a key. This is 
          similar to the GROUP BY clause in SQL and is useful for creating summaries and reports.
        </p>

        <CodeEditor 
          initialCode={groupingCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg my-4">
          <h4 className="text-yellow-700 dark:text-yellow-400 font-semibold">Working with Groups</h4>
          <p className="mt-2">
            When you use GroupBy, you get an <code>IGrouping&lt;TKey, TElement&gt;</code> object for each group:
          </p>
          <ul className="mt-2">
            <li><strong>Key property</strong> - Represents the grouping key value</li>
            <li><strong>Elements</strong> - The group is enumerable and contains the grouped elements</li>
            <li><strong>Aggregation</strong> - You can apply aggregate functions (Count, Sum, etc.) to each group</li>
            <li><strong>Projection</strong> - Often used with Select to transform each group into a summary</li>
          </ul>
          <p className="mt-2">
            Common pattern for group summaries:
          </p>
          <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded mt-2 text-sm">
{`var groupSummary = collection
    .GroupBy(item => item.Category)
    .Select(g => new {
        Category = g.Key,
        Count = g.Count(),
        Average = g.Average(item => item.Value),
        Total = g.Sum(item => item.Value)
    });`}
          </pre>
        </div>

        <h2>Joining Multiple Data Sources</h2>
        
        <p>
          LINQ provides several methods for combining data from multiple collections, similar to SQL joins. 
          These operations allow you to correlate data across different sources.
        </p>

        <CodeEditor 
          initialCode={joinCode}
          language="csharp"
          readOnly={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
            <h3 className="text-indigo-700 dark:text-indigo-400">Inner Join</h3>
            <p className="mt-2">
              Combines elements from two sequences when there's a matching key, similar to SQL INNER JOIN.
            </p>
            <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded mt-2 text-sm">
{`// Method syntax
var innerJoin = collection1.Join(
    collection2,
    item1 => item1.Key,
    item2 => item2.Key,
    (item1, item2) => new { item1.Property, item2.Property }
);

// Query syntax
var innerJoin = 
    from item1 in collection1
    join item2 in collection2
    on item1.Key equals item2.Key
    select new { item1.Property, item2.Property };`}
            </pre>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h3 className="text-purple-700 dark:text-purple-400">Left Join</h3>
            <p className="mt-2">
              Preserves all elements from the first sequence, similar to SQL LEFT OUTER JOIN.
            </p>
            <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded mt-2 text-sm">
{`// Method syntax with GroupJoin + SelectMany
var leftJoin = collection1.GroupJoin(
    collection2,
    item1 => item1.Key,
    item2 => item2.Key,
    (item1, item2s) => new { item1, item2s }
).SelectMany(
    x => x.item2s.DefaultIfEmpty(),
    (x, item2) => new { 
        x.item1.Property, 
        Item2Property = item2?.Property ?? default 
    }
);

// Query syntax
var leftJoin = 
    from item1 in collection1
    join item2 in collection2
    on item1.Key equals item2.Key into item2Group
    from item2 in item2Group.DefaultIfEmpty()
    select new { 
        item1.Property, 
        Item2Property = item2?.Property ?? default 
    };`}
            </pre>
          </div>
        </div>

        <h2>Aggregation Operations</h2>
        
        <p>
          Aggregation operations compute a single value from a collection of values. LINQ provides several
          aggregation methods that are useful for calculating statistics and summaries.
        </p>

        <CodeEditor 
          initialCode={aggregationCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg my-4">
          <h4 className="text-green-700 dark:text-green-400 font-semibold">Common Aggregation Methods</h4>
          <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
            <li><strong>Count()/Count(predicate)</strong> - Counts elements, optionally with a condition</li>
            <li><strong>Sum(selector)</strong> - Sums numeric values from elements</li>
            <li><strong>Average(selector)</strong> - Calculates the average of numeric values</li>
            <li><strong>Min(selector)/Max(selector)</strong> - Finds minimum or maximum values</li>
            <li><strong>Aggregate(func)</strong> - Custom aggregation with seed and accumulator function</li>
            <li><strong>LongCount()</strong> - Counts elements when the result might exceed int.MaxValue</li>
            <li><strong>Any(predicate)</strong> - Determines if any elements satisfy a condition</li>
            <li><strong>All(predicate)</strong> - Determines if all elements satisfy a condition</li>
          </ul>
          <p className="mt-2 italic">
            Always check for empty collections when using aggregation methods that could throw exceptions
            on empty sequences (like Min, Max, Average, etc.).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-700 dark:text-gray-300">Set Operations</h3>
            <p className="mt-2">
              Perform set-based operations on sequences:
            </p>
            <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded mt-2 text-sm">
{`// Distinct - removes duplicates
var unique = source.Distinct();

// Union - combines unique elements
var combined = source1.Union(source2);

// Intersect - common elements
var common = source1.Intersect(source2);

// Except - elements in first but not second
var difference = source1.Except(source2);`}
            </pre>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-700 dark:text-gray-300">Element Operations</h3>
            <p className="mt-2">
              Retrieve specific elements from a sequence:
            </p>
            <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded mt-2 text-sm">
{`// First/FirstOrDefault
var first = source.First(x => x.Id > 5);

// Single/SingleOrDefault
var single = source.Single(x => x.Id == 5);

// ElementAt/ElementAtOrDefault
var third = source.ElementAt(2);

// Last/LastOrDefault
var last = source.Last(x => x.Price > 100);`}
            </pre>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-700 dark:text-gray-300">Partitioning Operations</h3>
            <p className="mt-2">
              Extract subsets of sequence elements:
            </p>
            <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded mt-2 text-sm">
{`// Take - first n elements
var firstThree = source.Take(3);

// Skip - bypass n elements
var afterThree = source.Skip(3);

// TakeLast - last n elements
var lastTwo = source.TakeLast(2);

// SkipLast - all except last n
var skipLastTwo = source.SkipLast(2);

// TakeWhile/SkipWhile
var takeUntil = source.TakeWhile(x => x < 10);`}
            </pre>
          </div>
        </div>

        <div className="bg-csharp-blue-50 dark:bg-csharp-blue-900/20 p-4 rounded-lg mt-6">
          <h3 className="text-csharp-blue-700 dark:text-csharp-blue-400">Practice Exercise</h3>
          <p>
            Build an e-commerce data analysis application:
          </p>
          <ol className="mt-2">
            <li>Create classes for Products, Categories, Customers, and Orders</li>
            <li>Generate sample data with at least:
              <ul className="ml-4 mt-1">
                <li>20 products across 5 categories</li>
                <li>10 customers</li>
                <li>50 orders spanning 3 months</li>
              </ul>
            </li>
            <li>Implement the following LINQ reports:
              <ul className="ml-4 mt-1">
                <li>Top 5 best-selling products by quantity</li>
                <li>Sales by category showing percentage of total sales</li>
                <li>Monthly sales report with growth/decline percentages</li>
                <li>Customer purchase frequency analysis</li>
                <li>Product pairs that are frequently purchased together</li>
              </ul>
            </li>
            <li>Create a console menu system to display the reports</li>
            <li>Optimize your LINQ queries for readability and performance</li>
          </ol>
          <p className="mt-2">
            This exercise will help you apply advanced LINQ operations to solve realistic business analytics challenges.
          </p>
        </div>
      </div>
    </LessonLayout>
  );
} 