import React from 'react';
import { FiDatabase, FiCpu, FiLayers } from 'react-icons/fi';
import LessonLayout from '@/components/LessonLayout';
import CodeEditor from '@/components/CodeEditor';

const sidebarItems = [
  {
    title: 'Intermediate',
    href: '/intermediate',
    icon: <FiCpu className="w-4 h-4" />,
    children: [
      { title: 'LINQ', href: '/intermediate/linq' },
      { title: 'Asynchronous Programming', href: '/intermediate/async' },
      { title: 'Entity Framework Core', href: '/intermediate/entity-framework' },
    ]
  },
];

const dbContextCode = `using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace EFCoreExample
{
    // Entity classes
    public class Book
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public int Year { get; set; }
        public string ISBN { get; set; }
        public decimal Price { get; set; }
        
        // Navigation properties
        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public List<Review> Reviews { get; set; }
    }
    
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        
        // Navigation property
        public List<Book> Books { get; set; }
    }
    
    public class Review
    {
        public int Id { get; set; }
        public string ReviewerName { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        
        // Navigation property
        public int BookId { get; set; }
        public Book Book { get; set; }
    }
    
    // DbContext class
    public class BookStoreContext : DbContext
    {
        // DbSet properties - these represent tables in the database
        public DbSet<Book> Books { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Review> Reviews { get; set; }
        
        // Constructor with options
        public BookStoreContext(DbContextOptions<BookStoreContext> options) 
            : base(options)
        {
        }
        
        // Configure the model
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure relationships
            modelBuilder.Entity<Book>()
                .HasOne(b => b.Category)
                .WithMany(c => c.Books)
                .HasForeignKey(b => b.CategoryId);
                
            modelBuilder.Entity<Review>()
                .HasOne(r => r.Book)
                .WithMany(b => b.Reviews)
                .HasForeignKey(r => r.BookId);
                
            // Configure properties
            modelBuilder.Entity<Book>()
                .Property(b => b.Title)
                .IsRequired()
                .HasMaxLength(200);
                
            modelBuilder.Entity<Book>()
                .Property(b => b.ISBN)
                .HasMaxLength(13);
                
            modelBuilder.Entity<Book>()
                .Property(b => b.Price)
                .HasPrecision(18, 2);
        }
    }
}`;

const crudOperationsCode = `using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace EFCoreExample
{
    class Program
    {
        static async Task Main()
        {
            // Setup dependency injection
            var serviceProvider = new ServiceCollection()
                .AddDbContext<BookStoreContext>(options =>
                    options.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=BookStore;Trusted_Connection=True;"))
                .BuildServiceProvider();
                
            // Get DbContext
            using (var context = serviceProvider.GetService<BookStoreContext>())
            {
                // Ensure database is created
                await context.Database.EnsureCreatedAsync();
                
                // CREATE operations
                await CreateSampleDataAsync(context);
                
                // READ operations
                await QueryDataAsync(context);
                
                // UPDATE operations
                await UpdateDataAsync(context);
                
                // DELETE operations
                await DeleteDataAsync(context);
            }
        }
        
        static async Task CreateSampleDataAsync(BookStoreContext context)
        {
            // Check if we already have data
            if (await context.Books.AnyAsync())
                return;
                
            // Create categories
            var fictionCategory = new Category 
            { 
                Name = "Fiction", 
                Description = "Novels, short stories, and other fictional works" 
            };
            
            var nonFictionCategory = new Category 
            { 
                Name = "Non-Fiction", 
                Description = "Factual works such as biography, history, and essays" 
            };
            
            // Add categories to context
            context.Categories.AddRange(fictionCategory, nonFictionCategory);
            await context.SaveChangesAsync();
            
            // Create books
            var book1 = new Book
            {
                Title = "The Great Gatsby",
                Author = "F. Scott Fitzgerald",
                Year = 1925,
                ISBN = "9780743273565",
                Price = 12.99m,
                CategoryId = fictionCategory.Id
            };
            
            var book2 = new Book
            {
                Title = "Sapiens: A Brief History of Humankind",
                Author = "Yuval Noah Harari",
                Year = 2011,
                ISBN = "9780062316097",
                Price = 16.99m,
                CategoryId = nonFictionCategory.Id
            };
            
            // Add books to context
            context.Books.AddRange(book1, book2);
            await context.SaveChangesAsync();
            
            // Add reviews
            var review1 = new Review
            {
                BookId = book1.Id,
                ReviewerName = "Alice",
                Rating = 5,
                Comment = "A classic that still resonates today."
            };
            
            var review2 = new Review
            {
                BookId = book1.Id,
                ReviewerName = "Bob",
                Rating = 4,
                Comment = "Beautifully written, if a bit melancholy."
            };
            
            var review3 = new Review
            {
                BookId = book2.Id,
                ReviewerName = "Charlie",
                Rating = 5,
                Comment = "Fascinating perspective on human history."
            };
            
            // Add reviews to context
            context.Reviews.AddRange(review1, review2, review3);
            await context.SaveChangesAsync();
            
            Console.WriteLine("Sample data created successfully!");
        }
        
        static async Task QueryDataAsync(BookStoreContext context)
        {
            Console.WriteLine("\\n--- Querying Data ---");
            
            // Basic query
            var allBooks = await context.Books.ToListAsync();
            Console.WriteLine($"Total books: {allBooks.Count}");
            
            // Query with filtering
            var fictionBooks = await context.Books
                .Where(b => b.Category.Name == "Fiction")
                .ToListAsync();
                
            Console.WriteLine($"Fiction books: {fictionBooks.Count}");
            
            // Query with ordering
            var booksByYear = await context.Books
                .OrderByDescending(b => b.Year)
                .ToListAsync();
                
            Console.WriteLine("Latest books:");
            foreach (var book in booksByYear.Take(2))
            {
                Console.WriteLine($"- {book.Title} ({book.Year})");
            }
            
            // Query with include
            var booksWithReviews = await context.Books
                .Include(b => b.Reviews)
                .ToListAsync();
                
            Console.WriteLine("\\nBooks with reviews:");
            foreach (var book in booksWithReviews)
            {
                Console.WriteLine($"- {book.Title} ({book.Reviews.Count} reviews)");
                foreach (var review in book.Reviews)
                {
                    Console.WriteLine($"  * {review.Rating}/5 stars: \"{review.Comment}\"");
                }
            }
            
            // Query with projection
            var bookSummaries = await context.Books
                .Select(b => new 
                {
                    b.Title,
                    b.Author,
                    CategoryName = b.Category.Name,
                    ReviewCount = b.Reviews.Count,
                    AverageRating = b.Reviews.Any() ? b.Reviews.Average(r => r.Rating) : 0
                })
                .ToListAsync();
                
            Console.WriteLine("\\nBook summaries:");
            foreach (var summary in bookSummaries)
            {
                Console.WriteLine($"- {summary.Title} by {summary.Author}");
                Console.WriteLine($"  Category: {summary.CategoryName}");
                Console.WriteLine($"  Reviews: {summary.ReviewCount}, Avg Rating: {summary.AverageRating:F1}/5");
            }
        }
        
        static async Task UpdateDataAsync(BookStoreContext context)
        {
            Console.WriteLine("\\n--- Updating Data ---");
            
            // Update a single entity
            var book = await context.Books
                .FirstOrDefaultAsync(b => b.Title.Contains("Gatsby"));
                
            if (book != null)
            {
                Console.WriteLine($"Updating price for: {book.Title}");
                book.Price = 14.99m;
                await context.SaveChangesAsync();
                Console.WriteLine("Price updated successfully!");
            }
            
            // Batch update
            var result = await context.Books
                .Where(b => b.Year < 2000)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(b => b.Price, b => b.Price * 0.9m));
                    
            Console.WriteLine($"Applied 10% discount to {result} classic books.");
        }
        
        static async Task DeleteDataAsync(BookStoreContext context)
        {
            Console.WriteLine("\\n--- Deleting Data ---");
            
            // Delete a single entity
            var review = await context.Reviews
                .FirstOrDefaultAsync(r => r.Rating < 3);
                
            if (review != null)
            {
                Console.WriteLine($"Deleting negative review by {review.ReviewerName}");
                context.Reviews.Remove(review);
                await context.SaveChangesAsync();
                Console.WriteLine("Review deleted successfully!");
            }
            
            // Batch delete
            var deletedCount = await context.Reviews
                .Where(r => r.Comment.Length < 10)
                .ExecuteDeleteAsync();
                
            Console.WriteLine($"Deleted {deletedCount} short reviews.");
        }
    }
}`;

export default function EntityFrameworkPage() {
  return (
    <LessonLayout 
      title="Entity Framework Core"
      level="intermediate"
      sidebarItems={sidebarItems}
      prev={{ href: '/intermediate/async', title: 'Asynchronous Programming' }}
    >
      <div className="prose dark:prose-invert max-w-none">
        <h1>Entity Framework Core</h1>
        
        <p>
          Entity Framework Core (EF Core) is Microsoft's modern object-relational mapping (ORM) framework for .NET.
          It enables developers to work with databases using .NET objects, eliminating the need for most of the
          data-access code typically needed.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
          <h3 className="text-xl font-semibold">Key Concepts</h3>
          <ul className="mt-2">
            <li><strong>DbContext</strong> - The primary class for interacting with the database</li>
            <li><strong>Entity</strong> - A class that maps to a database table</li>
            <li><strong>DbSet</strong> - Represents a collection of entities in the database</li>
            <li><strong>Migrations</strong> - The mechanism for evolving the database schema</li>
            <li><strong>LINQ</strong> - The query language used to query the database</li>
          </ul>
        </div>

        <h2>Getting Started with EF Core</h2>
        
        <p>
          Let's examine a typical EF Core application structure, including entity classes and a DbContext.
        </p>

        <CodeEditor 
          initialCode={dbContextCode}
          language="csharp"
          readOnly={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <h3 className="text-yellow-700 dark:text-yellow-400">Entity Classes</h3>
            <p className="mt-2">
              Entity classes are POCO (Plain Old CLR Objects) that:
            </p>
            <ul className="mt-2">
              <li>Map to database tables</li>
              <li>Have properties that map to columns</li>
              <li>Include navigation properties for relationships</li>
              <li>Usually have a primary key property (often named 'Id')</li>
              <li>Can be configured with data annotations or fluent API</li>
            </ul>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h3 className="text-green-700 dark:text-green-400">DbContext</h3>
            <p className="mt-2">
              DbContext is the main class that coordinates EF functionality:
            </p>
            <ul className="mt-2">
              <li>Acts as a session with the database</li>
              <li>Contains DbSet properties for each entity set</li>
              <li>Manages change tracking</li>
              <li>Handles database connections</li>
              <li>Configures the data model through the OnModelCreating method</li>
              <li>Provides SaveChanges method to persist changes to the database</li>
            </ul>
          </div>
        </div>

        <h2>Working with Entity Framework Core</h2>
        
        <p>
          Now let's see how to perform CRUD (Create, Read, Update, Delete) operations using EF Core.
        </p>

        <CodeEditor 
          initialCode={crudOperationsCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg my-4">
          <h4 className="text-purple-700 dark:text-purple-400 font-semibold">Change Tracking</h4>
          <p className="mt-2">
            One of EF Core's key features is change tracking:
          </p>
          <ul className="mt-2">
            <li>EF Core tracks changes to entities retrieved from the database</li>
            <li>When SaveChanges is called, tracked changes are sent to the database</li>
            <li>Entity states include: Added, Unchanged, Modified, Deleted, Detached</li>
            <li>You can modify tracking behavior with methods like AsNoTracking for read-only queries</li>
            <li>Use context.Entry(entity) to manually control tracking states</li>
          </ul>
        </div>

        <h2>Relationship Types in EF Core</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-blue-700 dark:text-blue-400">One-to-Many</h3>
            <p className="mt-2">
              The most common relationship type, where one entity can be related to many instances of another entity.
            </p>
            <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded mt-2 text-sm">
{`public class Category
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List<Book> Books { get; set; }
}

public class Book
{
    public int Id { get; set; }
    public string Title { get; set; }
    public int CategoryId { get; set; }
    public Category Category { get; set; }
}`}
            </pre>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-blue-700 dark:text-blue-400">One-to-One</h3>
            <p className="mt-2">
              A relationship where each entity can only be related to one instance of another entity.
            </p>
            <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded mt-2 text-sm">
{`public class Author
{
    public int Id { get; set; }
    public string Name { get; set; }
    public AuthorBiography Biography { get; set; }
}

public class AuthorBiography
{
    public int Id { get; set; }
    public string Biography { get; set; }
    public int AuthorId { get; set; }
    public Author Author { get; set; }
}`}
            </pre>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-blue-700 dark:text-blue-400">Many-to-Many</h3>
            <p className="mt-2">
              A relationship where many entities can be related to many other entities.
            </p>
            <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded mt-2 text-sm">
{`public class Book
{
    public int Id { get; set; }
    public string Title { get; set; }
    public List<BookAuthor> BookAuthors { get; set; }
}

public class Author
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List<BookAuthor> BookAuthors { get; set; }
}

public class BookAuthor
{
    public int BookId { get; set; }
    public Book Book { get; set; }
    public int AuthorId { get; set; }
    public Author Author { get; set; }
}`}
            </pre>
          </div>
        </div>

        <div className="bg-csharp-blue-50 dark:bg-csharp-blue-900/20 p-4 rounded-lg mt-6">
          <h3 className="text-csharp-blue-700 dark:text-csharp-blue-400">Practice Exercise</h3>
          <p>
            Build a Book Management Console Application using Entity Framework Core:
          </p>
          <ol className="mt-2">
            <li>Create a new console application with Entity Framework Core</li>
            <li>Define entity classes for:
              <ul className="ml-4 mt-1">
                <li>Books (Id, Title, Description, ISBN, PublicationDate, Price)</li>
                <li>Authors (Id, FirstName, LastName, Biography)</li>
                <li>Publishers (Id, Name, Address, Founded)</li>
              </ul>
            </li>
            <li>Establish the following relationships:
              <ul className="ml-4 mt-1">
                <li>Many-to-many between Books and Authors</li>
                <li>One-to-many between Publishers and Books</li>
              </ul>
            </li>
            <li>Create a DbContext class with appropriate configurations</li>
            <li>Implement a repository pattern for data access</li>
            <li>Add features for:
              <ul className="ml-4 mt-1">
                <li>Adding, editing, and removing books</li>
                <li>Searching books by title, author, or ISBN</li>
                <li>Displaying the list of books by an author</li>
                <li>Displaying the list of books from a publisher</li>
              </ul>
            </li>
            <li>Use migrations to evolve your database schema</li>
            <li>Include seed data for initial testing</li>
          </ol>
          <p className="mt-2">
            This exercise will help you apply Entity Framework Core concepts in a practical scenario.
          </p>
        </div>
      </div>
    </LessonLayout>
  );
} 