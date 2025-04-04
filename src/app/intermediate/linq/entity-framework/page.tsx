import React from 'react';
import { FiList, FiFilter, FiDatabase } from 'react-icons/fi';
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

const basicQueriesCode = `using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace LinqToEntities
{
    class Program
    {
        static void Main()
        {
            using (var context = new BookStoreContext())
            {
                // Simple query - get all books
                var allBooks = context.Books.ToList();
                Console.WriteLine($"Total books: {allBooks.Count}");
                
                // Filtering with Where
                var fictionBooks = context.Books
                    .Where(b => b.Genre == "Fiction")
                    .ToList();
                Console.WriteLine($"Fiction books: {fictionBooks.Count}");
                
                // Sorting with OrderBy
                var booksByPrice = context.Books
                    .OrderBy(b => b.Price)
                    .ToList();
                
                Console.WriteLine("Books by price (ascending):");
                foreach (var book in booksByPrice.Take(3))
                {
                    Console.WriteLine($"{book.Title} - ${book.Price}");
                }
                
                // Projection with Select
                var bookTitles = context.Books
                    .Select(b => new { b.Title, b.Author })
                    .ToList();
                
                Console.WriteLine("\\nBook titles and authors:");
                foreach (var item in bookTitles.Take(3))
                {
                    Console.WriteLine($"{item.Title} by {item.Author}");
                }
                
                // Joining related data
                var booksWithPublishers = context.Books
                    .Include(b => b.Publisher)
                    .ToList();
                
                Console.WriteLine("\\nBooks with publishers:");
                foreach (var book in booksWithPublishers.Take(3))
                {
                    Console.WriteLine($"{book.Title} - {book.Publisher.Name}");
                }
                
                // Aggregation
                var bookStats = new
                {
                    Count = context.Books.Count(),
                    AveragePrice = context.Books.Average(b => b.Price),
                    MaxPrice = context.Books.Max(b => b.Price),
                    MinPrice = context.Books.Min(b => b.Price)
                };
                
                Console.WriteLine("\\nBook statistics:");
                Console.WriteLine($"Total books: {bookStats.Count}");
                Console.WriteLine($"Price range: ${bookStats.MinPrice} to ${bookStats.MaxPrice}");
                Console.WriteLine($"Average price: ${bookStats.AveragePrice:F2}");
                
                // Grouping
                var booksByGenre = context.Books
                    .GroupBy(b => b.Genre)
                    .Select(g => new
                    {
                        Genre = g.Key,
                        Count = g.Count(),
                        AveragePrice = g.Average(b => b.Price)
                    })
                    .ToList();
                
                Console.WriteLine("\\nBooks by genre:");
                foreach (var genre in booksByGenre)
                {
                    Console.WriteLine($"{genre.Genre}: {genre.Count} books, avg price: ${genre.AveragePrice:F2}");
                }
            }
        }
    }
    
    // Entity classes
    public class Book
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string Genre { get; set; }
        public decimal Price { get; set; }
        public int PublisherId { get; set; }
        public Publisher Publisher { get; set; }
    }
    
    public class Publisher
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
    }
    
    // DbContext
    public class BookStoreContext : DbContext
    {
        public DbSet<Book> Books { get; set; }
        public DbSet<Publisher> Publishers { get; set; }
        
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(
                "Server=(localdb)\\mssqllocaldb;Database=BookStore;Trusted_Connection=True;");
        }
    }
}`;

const queryOptimizationCode = `using System;
using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace LinqToEntities.Optimization
{
    class Program
    {
        static void Main()
        {
            using (var context = new BookStoreContext())
            {
                // Enable query logging
                context.Database.Log = Console.WriteLine;
                
                Console.WriteLine("Inefficient query example:");
                // INEFFICIENT: Multiple database queries
                var publishers = context.Publishers.ToList();
                foreach (var publisher in publishers)
                {
                    // This causes N separate queries (N+1 problem)
                    var books = context.Books
                        .Where(b => b.PublisherId == publisher.Id)
                        .ToList();
                    
                    Console.WriteLine($"{publisher.Name}: {books.Count} books");
                }
                
                Console.WriteLine("\\nEfficient query with Include:");
                // EFFICIENT: Eager loading with Include
                var publishersWithBooks = context.Publishers
                    .Include(p => p.Books)
                    .ToList();
                
                foreach (var publisher in publishersWithBooks)
                {
                    // No additional queries - data already loaded
                    Console.WriteLine($"{publisher.Name}: {publisher.Books.Count} books");
                }
                
                Console.WriteLine("\\nDeferred execution and multiple enumeration:");
                // Deferred execution - query not executed yet
                var expensiveBooks = context.Books.Where(b => b.Price > 50);
                
                // First enumeration - query executed
                Console.WriteLine("Expensive books count: " + expensiveBooks.Count());
                
                // Second enumeration - query executed AGAIN
                foreach (var book in expensiveBooks.Take(3))
                {
                    Console.WriteLine($"{book.Title} - ${book.Price}");
                }
                
                Console.WriteLine("\\nSingle execution with ToList:");
                // Execute once and cache results with ToList
                var expensiveBooksList = context.Books
                    .Where(b => b.Price > 50)
                    .ToList();
                
                // Using cached results - no query executed
                Console.WriteLine("Expensive books count: " + expensiveBooksList.Count);
                
                // Still using cached results - no query executed
                foreach (var book in expensiveBooksList.Take(3))
                {
                    Console.WriteLine($"{book.Title} - ${book.Price}");
                }
                
                Console.WriteLine("\\nProjection optimization:");
                // INEFFICIENT: Fetching entire entities when only need names
                var allPublishers = context.Publishers.ToList();
                var publisherNames1 = allPublishers.Select(p => p.Name).ToList();
                
                // EFFICIENT: Projecting at the database level
                var publisherNames2 = context.Publishers
                    .Select(p => p.Name)
                    .ToList();
                
                Console.WriteLine("\\nPaging example:");
                // Efficient paging
                int pageSize = 10;
                int pageNumber = 2; // Second page
                
                var pagedBooks = context.Books
                    .OrderBy(b => b.Title)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();
                
                Console.WriteLine($"Page {pageNumber} (items {(pageNumber - 1) * pageSize + 1}-{pageNumber * pageSize}):");
                foreach (var book in pagedBooks.Take(3))
                {
                    Console.WriteLine($"{book.Title} - {book.Author}");
                }
            }
        }
    }
    
    public class BookStoreContext : DbContext
    {
        public DbSet<Book> Books { get; set; }
        public DbSet<Publisher> Publishers { get; set; }
        
        // Additional DbContext configuration...
        
        public class Book
        {
            public int Id { get; set; }
            public string Title { get; set; }
            public string Author { get; set; }
            public decimal Price { get; set; }
            public int PublisherId { get; set; }
            public Publisher Publisher { get; set; }
        }
        
        public class Publisher
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Location { get; set; }
            public List<Book> Books { get; set; }
        }
    }
}`;

const advancedLoadingCode = `using System;
using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace LinqToEntities.Loading
{
    class Program
    {
        static void Main()
        {
            using (var context = new BookStoreContext())
            {
                Console.WriteLine("Eager Loading Example:");
                // EAGER LOADING: Load related data immediately with Include
                var authorsWithBooks = context.Authors
                    .Include(a => a.Books)
                    .ToList();
                
                foreach (var author in authorsWithBooks.Take(2))
                {
                    Console.WriteLine($"Author: {author.Name}");
                    foreach (var book in author.Books.Take(2))
                    {
                        Console.WriteLine($"  Book: {book.Title}");
                    }
                }
                
                Console.WriteLine("\\nMulti-level Eager Loading:");
                // Multiple levels of Include
                var authorsWithBooksAndPublishers = context.Authors
                    .Include(a => a.Books)
                        .ThenInclude(b => b.Publisher)
                    .ToList();
                
                foreach (var author in authorsWithBooksAndPublishers.Take(2))
                {
                    Console.WriteLine($"Author: {author.Name}");
                    foreach (var book in author.Books.Take(2))
                    {
                        Console.WriteLine($"  Book: {book.Title} - Publisher: {book.Publisher.Name}");
                    }
                }
                
                Console.WriteLine("\\nFiltered Include (EF Core 5.0+):");
                // Include with filtering (EF Core 5.0+)
                var authorsWithExpensiveBooks = context.Authors
                    .Include(a => a.Books.Where(b => b.Price > 50))
                    .ToList();
                
                foreach (var author in authorsWithExpensiveBooks.Take(2))
                {
                    Console.WriteLine($"Author: {author.Name} - Expensive books: {author.Books.Count}");
                }
                
                Console.WriteLine("\\nLazy Loading Example:");
                // LAZY LOADING: Related data loaded only when accessed
                // Note: Requires lazy loading enabled and virtual navigation properties
                
                // Get a single author without eager loading
                var author1 = context.Authors.First();
                
                // Books property access triggers lazy loading
                Console.WriteLine($"Author: {author1.Name} - Books: {author1.Books.Count}");
                
                Console.WriteLine("\\nExplicit Loading Example:");
                // EXPLICIT LOADING: Manually control when related data is loaded
                
                // Get a single publisher without related data
                var publisher = context.Publishers.First();
                Console.WriteLine($"Publisher: {publisher.Name}");
                
                // Explicitly load related books
                context.Entry(publisher)
                    .Collection(p => p.Books)
                    .Load();
                
                Console.WriteLine($"After explicit load - Books: {publisher.Books.Count}");
                
                // Explicit loading with filtering
                var publisher2 = context.Publishers.Skip(1).First();
                Console.WriteLine($"Publisher: {publisher2.Name}");
                
                context.Entry(publisher2)
                    .Collection(p => p.Books)
                    .Query()
                    .Where(b => b.Price > 30)
                    .Load();
                
                Console.WriteLine($"After filtered explicit load - " +
                    $"Books over $30: {publisher2.Books.Count}");
                
                Console.WriteLine("\\nSplit Queries (EF Core 5.0+):");
                // Split queries for large result sets
                var authorsWithBooksSplit = context.Authors
                    .Include(a => a.Books)
                    .AsSplitQuery()
                    .ToList();
                
                Console.WriteLine($"Split query loaded {authorsWithBooksSplit.Count} authors " +
                    $"with their books");
            }
        }
    }
    
    // Entity classes and DbContext classes
    public class Author
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public virtual ICollection<Book> Books { get; set; }
    }
    
    public class Book
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public decimal Price { get; set; }
        public int PublisherId { get; set; }
        public virtual Publisher Publisher { get; set; }
        public int AuthorId { get; set; }
        public virtual Author Author { get; set; }
    }
    
    public class Publisher
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public virtual ICollection<Book> Books { get; set; }
    }
    
    public class BookStoreContext : DbContext
    {
        public DbSet<Author> Authors { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<Publisher> Publishers { get; set; }
        
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder
                .UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=BookStore;Trusted_Connection=True;")
                .UseLazyLoadingProxies(); // Enable lazy loading
        }
    }
}`;

export default function LinqToEntitiesPage() {
  return (
    <LessonLayout 
      title="LINQ to Entities with Entity Framework"
      level="intermediate"
      sidebarItems={sidebarItems}
      prev={{ href: '/intermediate/linq/advanced', title: 'Advanced LINQ Operations' }}
    >
      <div className="prose dark:prose-invert max-w-none">
        <h1>LINQ to Entities with Entity Framework</h1>
        
        <p>
          LINQ to Entities is the implementation of LINQ for querying relational databases through Entity Framework.
          It allows you to write strongly-typed queries against your database that are translated into SQL, 
          combining the elegance of LINQ with the power of database operations.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
          <h3 className="text-xl font-semibold">Key Concepts</h3>
          <ul className="mt-2">
            <li><strong>IQueryable vs. IEnumerable</strong> - Understanding the difference is crucial for performance</li>
            <li><strong>Query Translation</strong> - LINQ queries are translated into SQL queries</li>
            <li><strong>Deferred Execution</strong> - Queries are only executed when results are needed</li>
            <li><strong>Loading Strategies</strong> - Different approaches for loading related data</li>
            <li><strong>Query Optimization</strong> - Techniques to write efficient database queries</li>
          </ul>
        </div>

        <h2>Basic Database Queries with LINQ</h2>
        
        <p>
          Let's start with basic LINQ to Entities queries using Entity Framework. These examples
          demonstrate common operations like filtering, sorting, and projecting data from a database.
        </p>

        <CodeEditor 
          initialCode={basicQueriesCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg my-4">
          <h4 className="text-yellow-700 dark:text-yellow-400 font-semibold">IQueryable vs. IEnumerable</h4>
          <p className="mt-2">
            Understanding the difference between <code>IQueryable&lt;T&gt;</code> and <code>IEnumerable&lt;T&gt;</code> is crucial 
            for writing efficient Entity Framework queries:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <h5 className="font-semibold">IQueryable&lt;T&gt;</h5>
              <ul className="mt-1">
                <li>Represents a query that hasn't been executed yet</li>
                <li>Query operations are translated to SQL and run on the database server</li>
                <li>Filtering happens before data is retrieved</li>
                <li>Enables server-side paging, sorting, and filtering</li>
                <li>EF Core methods return IQueryable by default</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold">IEnumerable&lt;T&gt;</h5>
              <ul className="mt-1">
                <li>Represents data that has already been loaded into memory</li>
                <li>Query operations run in application memory</li>
                <li>Filtering happens after all data is retrieved</li>
                <li>Methods like ToList(), ToArray() convert IQueryable to IEnumerable</li>
                <li>Less efficient for large data sets</li>
              </ul>
            </div>
          </div>
        </div>

        <h2>Query Optimization and Performance</h2>
        
        <p>
          Writing efficient Entity Framework queries is essential for application performance.
          Here are some techniques and considerations for optimizing LINQ to Entities queries.
        </p>

        <CodeEditor 
          initialCode={queryOptimizationCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg my-4">
          <h4 className="text-green-700 dark:text-green-400 font-semibold">Performance Best Practices</h4>
          <ul className="mt-2">
            <li><strong>Filter data on the server</strong> - Use Where before fetching data, not after</li>
            <li><strong>Use projection</strong> - Select only the columns you need</li>
            <li><strong>Avoid the N+1 query problem</strong> - Use Include or explicit loading strategies</li>
            <li><strong>Implement paging</strong> - Use Skip and Take for large result sets</li>
            <li><strong>Be mindful of tracking</strong> - Use AsNoTracking for read-only queries</li>
            <li><strong>Cache executed queries</strong> - Call ToList(), ToArray() when reusing results</li>
            <li><strong>Use compiled queries</strong> - For frequently executed queries</li>
            <li><strong>Monitor generated SQL</strong> - Use logging to see what SQL is being executed</li>
          </ul>
        </div>

        <h2>Loading Related Data</h2>
        
        <p>
          Entity Framework offers several strategies for loading related data, each with its own
          advantages and trade-offs. Choosing the right loading strategy is key to application performance.
        </p>

        <CodeEditor 
          initialCode={advancedLoadingCode}
          language="csharp"
          readOnly={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-blue-700 dark:text-blue-400">Eager Loading</h3>
            <p className="mt-2">
              Loads related entities in the same query using Include() and ThenInclude().
            </p>
            <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded mt-2 text-sm">
{`// Load authors with their books
context.Authors
    .Include(a => a.Books)
    .ToList();
              
// Multiple levels
context.Authors
    .Include(a => a.Books)
        .ThenInclude(b => b.Publisher)
    .ToList();`}
            </pre>
            <p className="mt-2 text-sm">
              <strong>Best for:</strong> When you know you'll need the related data and want to minimize database calls.
            </p>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-blue-700 dark:text-blue-400">Lazy Loading</h3>
            <p className="mt-2">
              Loads related entities automatically when the navigation property is accessed.
            </p>
            <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded mt-2 text-sm">
{`// Enable lazy loading in DbContext
optionsBuilder.UseLazyLoadingProxies();

// Navigation properties must be virtual
public virtual ICollection<Book> Books { get; set; }

// Lazy loading in action
var author = context.Authors.First();
// This causes a separate query
var books = author.Books;`}
            </pre>
            <p className="mt-2 text-sm">
              <strong>Best for:</strong> Development simplicity when performance isn't critical.
            </p>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-blue-700 dark:text-blue-400">Explicit Loading</h3>
            <p className="mt-2">
              Manually load related entities when needed using Entry().Collection() or Entry().Reference().
            </p>
            <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded mt-2 text-sm">
{`// Get an author
var author = context.Authors.First();

// Explicitly load related books
context.Entry(author)
    .Collection(a => a.Books)
    .Load();
              
// With filtering
context.Entry(author)
    .Collection(a => a.Books)
    .Query()
    .Where(b => b.Price > 30)
    .Load();`}
            </pre>
            <p className="mt-2 text-sm">
              <strong>Best for:</strong> Fine-grained control over when and what related data is loaded.
            </p>
          </div>
        </div>

        <h2>Advanced Entity Framework Features</h2>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-4">
          <h4 className="text-gray-700 dark:text-gray-300 font-semibold">Global Query Filters</h4>
          <p className="mt-2">
            Define filters that are automatically applied to all queries for a specific entity type.
          </p>
          <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded mt-2 text-sm">
{`protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    // Apply a global query filter for soft delete
    modelBuilder.Entity<Book>()
        .HasQueryFilter(b => !b.IsDeleted);
        
    // Apply tenant filter for multi-tenant apps
    modelBuilder.Entity<Customer>()
        .HasQueryFilter(c => c.TenantId == _tenantId);
}`}
          </pre>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-4">
          <h4 className="text-gray-700 dark:text-gray-300 font-semibold">Raw SQL Queries</h4>
          <p className="mt-2">
            Execute raw SQL queries when LINQ doesn't provide the functionality you need.
          </p>
          <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded mt-2 text-sm">
{`// FromSqlRaw for raw SQL queries
var books = context.Books
    .FromSqlRaw("SELECT * FROM Books WHERE Price > {0}", 50)
    .Include(b => b.Author)
    .ToList();
    
// FromSqlInterpolated for safer string interpolation
var authorName = "Martin Fowler";
var authorsBooks = context.Books
    .FromSqlInterpolated($"SELECT * FROM Books WHERE Author.Name = {authorName}")
    .ToList();
    
// ExecuteSqlRaw for non-query commands
int affected = context.Database
    .ExecuteSqlRaw("UPDATE Books SET Price = Price * 0.9 WHERE Genre = 'Fiction'");`}
          </pre>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-4">
          <h4 className="text-gray-700 dark:text-gray-300 font-semibold">Tracking vs. No-Tracking Queries</h4>
          <p className="mt-2">
            Control whether Entity Framework tracks entity changes, which affects performance and behavior.
          </p>
          <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded mt-2 text-sm">
{`// Default behavior: Tracking query
var books = context.Books.ToList();

// No-tracking query for read-only scenarios
var booksNoTracking = context.Books
    .AsNoTracking()
    .ToList();
    
// Global query tracking behavior
context.ChangeTracker.QueryTrackingBehavior = 
    QueryTrackingBehavior.NoTracking;`}
          </pre>
        </div>

        <div className="bg-csharp-blue-50 dark:bg-csharp-blue-900/20 p-4 rounded-lg mt-6">
          <h3 className="text-csharp-blue-700 dark:text-csharp-blue-400">Practice Exercise</h3>
          <p>
            Build a book inventory management system with Entity Framework Core:
          </p>
          <ol className="mt-2">
            <li>Create a console application with Entity Framework Core</li>
            <li>Define entity classes for:
              <ul className="ml-4 mt-1">
                <li>Books (Id, Title, Author, Genre, Price, PublicationDate, PublisherId)</li>
                <li>Publishers (Id, Name, Location, EstablishedDate)</li>
                <li>Sales (Id, BookId, Quantity, SaleDate, Revenue)</li>
              </ul>
            </li>
            <li>Create a DbContext with appropriate relationships</li>
            <li>Implement the following queries:
              <ul className="ml-4 mt-1">
                <li>List all books by a specific publisher, including sales data (using eager loading)</li>
                <li>Find the top 5 bestselling books of all time based on quantity sold</li>
                <li>Calculate monthly sales statistics (total revenue, books sold) for the past year</li>
                <li>Create a report showing each publisher's revenue contribution</li>
                <li>Implement efficient paging for the book catalog</li>
                <li>Use projections to create DTOs for API responses</li>
              </ul>
            </li>
            <li>Optimize your queries for performance and implement proper exception handling</li>
            <li>Add a global query filter for "active" books (not discontinued)</li>
            <li>Implement a raw SQL query for a complex report that would be difficult with LINQ</li>
          </ol>
          <p className="mt-2">
            This exercise will help you apply Entity Framework and LINQ to Entities concepts in a practical scenario.
          </p>
        </div>
      </div>
    </LessonLayout>
  );
} 