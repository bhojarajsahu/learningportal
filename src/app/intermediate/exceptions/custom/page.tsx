import React from 'react';
import { FiBook, FiCode, FiGitBranch, FiPackage, FiServer, FiDatabase } from 'react-icons/fi';
import LessonLayout from '@/components/LessonLayout';
import CodeEditor from '@/components/CodeEditor';

const sidebarItems = [
  {
    title: 'Exception Handling',
    href: '/intermediate/exceptions',
    icon: <FiGitBranch className="w-4 h-4" />,
    children: [
      { title: 'Try-Catch Blocks', href: '/intermediate/exceptions/try-catch' },
      { title: 'Custom Exceptions', href: '/intermediate/exceptions/custom' },
      { title: 'Exception Best Practices', href: '/intermediate/exceptions/best-practices' },
    ]
  },
];

const basicCustomExceptionCode = `using System;

// Custom exception class
public class InsufficientFundsException : Exception
{
    public decimal CurrentBalance { get; }
    public decimal WithdrawalAmount { get; }
    
    // Constructor with custom properties
    public InsufficientFundsException(decimal currentBalance, decimal withdrawalAmount)
        : base($"Insufficient funds to withdraw {withdrawalAmount:C}. Current balance: {currentBalance:C}")
    {
        CurrentBalance = currentBalance;
        WithdrawalAmount = withdrawalAmount;
    }
    
    // Constructor with message and inner exception
    public InsufficientFundsException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
    
    // Default constructor
    public InsufficientFundsException()
        : base("Insufficient funds for this operation")
    {
    }
}

// Bank account class that uses the custom exception
public class BankAccount
{
    public string AccountNumber { get; }
    public decimal Balance { get; private set; }
    
    public BankAccount(string accountNumber, decimal initialBalance)
    {
        AccountNumber = accountNumber;
        Balance = initialBalance;
    }
    
    public void Withdraw(decimal amount)
    {
        if (amount <= 0)
        {
            throw new ArgumentException("Withdrawal amount must be positive", nameof(amount));
        }
        
        if (Balance < amount)
        {
            // Throw our custom exception with specific information
            throw new InsufficientFundsException(Balance, amount);
        }
        
        Balance -= amount;
        Console.WriteLine($"Withdrawal of {amount:C} successful. New balance: {Balance:C}");
    }
}

class Program
{
    static void Main(string[] args)
    {
        BankAccount account = new BankAccount("1234567890", 1000);
        
        try
        {
            account.Withdraw(1500); // This will throw InsufficientFundsException
        }
        catch (InsufficientFundsException ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
            Console.WriteLine($"Current balance: {ex.CurrentBalance:C}");
            Console.WriteLine($"Attempted withdrawal: {ex.WithdrawalAmount:C}");
            Console.WriteLine($"Shortfall: {ex.WithdrawalAmount - ex.CurrentBalance:C}");
        }
        catch (ArgumentException ex)
        {
            Console.WriteLine($"Invalid argument: {ex.Message}");
        }
        
        Console.ReadKey();
    }
}`;

const serializableExceptionCode = `using System;
using System.Runtime.Serialization;

// Making the exception serializable
[Serializable]
public class ProductNotFoundException : Exception
{
    public string ProductId { get; }
    
    public ProductNotFoundException(string productId)
        : base($"Product with ID {productId} was not found")
    {
        ProductId = productId;
    }
    
    public ProductNotFoundException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
    
    public ProductNotFoundException()
        : base("Product not found")
    {
    }
    
    // Special constructor for deserialization
    protected ProductNotFoundException(SerializationInfo info, StreamingContext context)
        : base(info, context)
    {
        ProductId = info.GetString("ProductId");
    }
    
    // Override GetObjectData to include custom properties
    public override void GetObjectData(SerializationInfo info, StreamingContext context)
    {
        base.GetObjectData(info, context);
        info.AddValue("ProductId", ProductId);
    }
}

class Program
{
    static void Main(string[] args)
    {
        try
        {
            // Simulate looking up a product
            string productId = "ABC123";
            FindProduct(productId);
        }
        catch (ProductNotFoundException ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
            Console.WriteLine($"Product ID: {ex.ProductId}");
        }
        
        Console.ReadKey();
    }
    
    static void FindProduct(string productId)
    {
        // Simulate product lookup failure
        throw new ProductNotFoundException(productId);
    }
}`;

const exceptionHierarchyCode = `using System;

// Base exception for all application-specific exceptions
public class AppException : Exception
{
    public AppException() : base() { }
    public AppException(string message) : base(message) { }
    public AppException(string message, Exception innerException) : base(message, innerException) { }
}

// Domain-specific exceptions
public class DataAccessException : AppException
{
    public string EntityName { get; }
    
    public DataAccessException(string entityName, string message)
        : base(message)
    {
        EntityName = entityName;
    }
    
    public DataAccessException(string entityName, string message, Exception innerException)
        : base(message, innerException)
    {
        EntityName = entityName;
    }
}

public class EntityNotFoundException : DataAccessException
{
    public string EntityId { get; }
    
    public EntityNotFoundException(string entityName, string entityId)
        : base(entityName, $"{entityName} with ID {entityId} was not found")
    {
        EntityId = entityId;
    }
}

public class DuplicateEntityException : DataAccessException
{
    public string EntityId { get; }
    
    public DuplicateEntityException(string entityName, string entityId)
        : base(entityName, $"{entityName} with ID {entityId} already exists")
    {
        EntityId = entityId;
    }
}

class Program
{
    static void Main(string[] args)
    {
        try
        {
            // Simulate entity operations that might fail
            GetUser("USER123");
        }
        catch (EntityNotFoundException ex) when (ex.EntityName == "User")
        {
            Console.WriteLine($"User not found: {ex.Message}");
            Console.WriteLine($"Entity ID: {ex.EntityId}");
        }
        catch (DataAccessException ex)
        {
            Console.WriteLine($"Data access error: {ex.Message}");
            Console.WriteLine($"Entity: {ex.EntityName}");
        }
        catch (AppException ex)
        {
            Console.WriteLine($"Application error: {ex.Message}");
        }
        
        Console.ReadKey();
    }
    
    static void GetUser(string userId)
    {
        // Simulate user lookup failure
        throw new EntityNotFoundException("User", userId);
    }
}`;

export default function CustomExceptionsPage() {
  return (
    <LessonLayout 
      title="Custom Exceptions"
      level="intermediate"
      sidebarItems={sidebarItems}
      prev={{ href: '/intermediate/exceptions/try-catch', title: 'Try-Catch Blocks' }}
      next={{ href: '/intermediate/exceptions/best-practices', title: 'Exception Best Practices' }}
    >
      <div className="prose dark:prose-invert max-w-none">
        <h1>Creating Custom Exceptions in C#</h1>
        
        <p>
          While the .NET Framework provides a rich set of built-in exception classes, you may need to create 
          custom exceptions to handle specific error conditions in your application. Custom exceptions can 
          make your error handling more descriptive, consistent, and easier to manage.
        </p>

        <h2>Why Create Custom Exceptions?</h2>
        
        <ul>
          <li>To provide more specific information about an error condition</li>
          <li>To create a clear hierarchy of application-specific exceptions</li>
          <li>To associate domain-specific data with exceptions</li>
          <li>To enable more granular exception handling</li>
        </ul>

        <h2>Basic Custom Exception Class</h2>
        
        <p>
          Creating a custom exception is as simple as deriving from the <code>Exception</code> class or a more 
          specific exception class. Here's a full example of a custom exception for a banking application:
        </p>

        <CodeEditor 
          initialCode={basicCustomExceptionCode}
          language="csharp"
          readOnly={true}
        />

        <p>
          In this example, we created a custom <code>InsufficientFundsException</code> that:
        </p>

        <ul>
          <li>Derives from the base <code>Exception</code> class</li>
          <li>Adds domain-specific properties (<code>CurrentBalance</code> and <code>WithdrawalAmount</code>)</li>
          <li>Provides multiple constructors for flexibility</li>
          <li>Includes a descriptive error message with formatting</li>
        </ul>

        <h2>Making Exceptions Serializable</h2>
        
        <p>
          If your exceptions need to cross application domain boundaries (such as in distributed applications), 
          they should be serializable. This is accomplished by adding the <code>[Serializable]</code> attribute
          and implementing the proper serialization constructors and methods:
        </p>

        <CodeEditor 
          initialCode={serializableExceptionCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg my-4">
          <p className="font-semibold">Note:</p>
          <p>
            In .NET Core 3.0 and later, serializable exceptions are less commonly needed as the
            .NET Core runtime doesn't use binary serialization for exception marshaling.
            However, it's still good practice if your application might interact with older .NET Framework code.
          </p>
        </div>

        <h2>Creating an Exception Hierarchy</h2>
        
        <p>
          For larger applications, it's often useful to create a hierarchy of exceptions to organize
          different types of errors:
        </p>

        <CodeEditor 
          initialCode={exceptionHierarchyCode}
          language="csharp"
          readOnly={true}
        />

        <p>
          This hierarchical approach has several advantages:
        </p>

        <ul>
          <li>Provides structure to the different types of errors in your application</li>
          <li>Allows catching exceptions at different levels of specificity</li>
          <li>Makes it easier to add new exception types consistently</li>
          <li>Enables the use of exception filters to handle specific cases</li>
        </ul>

        <h2>Best Practices for Custom Exceptions</h2>
        
        <ul>
          <li><strong>Naming</strong>: Always end the class name with "Exception"</li>
          <li><strong>Constructors</strong>: Provide at least three constructors:
            <ul>
              <li>A default constructor</li>
              <li>A constructor that takes a message</li>
              <li>A constructor that takes a message and an inner exception</li>
            </ul>
          </li>
          <li><strong>Properties</strong>: Include domain-specific properties that provide additional information about the error</li>
          <li><strong>Documentation</strong>: Document when and why each exception is thrown</li>
          <li><strong>Inheritance</strong>: Choose the most appropriate base exception class to derive from</li>
        </ul>

        <div className="bg-csharp-blue-50 dark:bg-csharp-blue-900/20 p-4 rounded-lg mt-6">
          <h3 className="text-csharp-blue-700 dark:text-csharp-blue-400">Practice Exercise</h3>
          <p>
            Create a custom exception hierarchy for an e-commerce application. Include exceptions for:
          </p>
          <ul>
            <li>Item out of stock</li>
            <li>Invalid coupon code</li>
            <li>Payment processing failure</li>
          </ul>
          <p>
            Each exception should include appropriate properties (such as product ID, coupon code, etc.)
            and meaningful error messages.
          </p>
        </div>

        <div className="mt-8">
          <p>
            In the next lesson, we'll dive into exception handling best practices to ensure your
            application handles errors effectively and maintains reliability.
          </p>
        </div>
      </div>
    </LessonLayout>
  );
} 