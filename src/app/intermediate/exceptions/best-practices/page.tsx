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

const badExceptionHandlingCode = `using System;
using System.IO;

class Program
{
    static void Main(string[] args)
    {
        // BAD PRACTICE: Catching all exceptions and silently ignoring them
        try
        {
            ProcessFile("data.txt");
        }
        catch
        {
            // Empty catch block - silently ignores all errors
        }
        
        // BAD PRACTICE: Catching Exception instead of specific types
        try
        {
            int number = int.Parse("abc");
        }
        catch (Exception ex)
        {
            Console.WriteLine("An error occurred: " + ex.Message);
            // Continue program as if nothing happened
        }
        
        // BAD PRACTICE: Using exceptions for normal program flow
        bool userExists = false;
        try
        {
            User user = GetUser("username");
            userExists = true;
        }
        catch (Exception)
        {
            userExists = false;
        }
        
        Console.ReadKey();
    }
    
    static void ProcessFile(string filePath)
    {
        // Simulate file processing
        throw new FileNotFoundException("File not found", filePath);
    }
    
    static User GetUser(string username)
    {
        // Simulate user lookup
        if (username != "admin")
        {
            throw new Exception("User not found");
        }
        return new User { Username = username };
    }
}

class User
{
    public string Username { get; set; }
}`;

const goodExceptionHandlingCode = `using System;
using System.IO;

class Program
{
    static void Main(string[] args)
    {
        // GOOD PRACTICE: Catch specific exceptions and handle them appropriately
        try
        {
            ProcessFile("data.txt");
        }
        catch (FileNotFoundException ex)
        {
            Console.WriteLine($"The file {ex.FileName} was not found.");
            Console.WriteLine("Please verify the file path and try again.");
            // Log the exception details for troubleshooting
            LogException(ex);
        }
        catch (IOException ex)
        {
            Console.WriteLine("An I/O error occurred while processing the file.");
            Console.WriteLine($"Error details: {ex.Message}");
            LogException(ex);
        }
        catch (Exception ex)
        {
            Console.WriteLine("An unexpected error occurred.");
            Console.WriteLine("Please contact support with the following information:");
            Console.WriteLine($"Error ID: {LogException(ex)}");
        }
        
        // GOOD PRACTICE: Use normal control flow instead of exceptions
        bool userExists = UserExists("username");
        if (userExists)
        {
            User user = GetUser("username");
            ProcessUser(user);
        }
        else
        {
            Console.WriteLine("User not found. Please register first.");
        }
        
        Console.ReadKey();
    }
    
    static void ProcessFile(string filePath)
    {
        // Validate parameters before proceeding
        if (string.IsNullOrEmpty(filePath))
        {
            throw new ArgumentException("File path cannot be null or empty", nameof(filePath));
        }
        
        // Check if file exists before attempting to open it
        if (!File.Exists(filePath))
        {
            throw new FileNotFoundException("The specified file was not found.", filePath);
        }
        
        // Process the file...
        using (var reader = new StreamReader(filePath))
        {
            string content = reader.ReadToEnd();
            Console.WriteLine($"File content: {content}");
        }
    }
    
    static bool UserExists(string username)
    {
        // Normal return value for checking existence
        return username == "admin";
    }
    
    static User GetUser(string username)
    {
        // Pre-condition check
        if (string.IsNullOrEmpty(username))
        {
            throw new ArgumentException("Username cannot be null or empty", nameof(username));
        }
        
        // Only call if UserExists returned true
        return new User { Username = username };
    }
    
    static void ProcessUser(User user)
    {
        Console.WriteLine($"Processing user: {user.Username}");
    }
    
    static string LogException(Exception ex)
    {
        // Generate a unique ID for this exception
        string exceptionId = Guid.NewGuid().ToString("N");
        
        // Log details to a file or database
        Console.WriteLine($"[LOGGED] Exception {exceptionId}: {ex}");
        
        return exceptionId;
    }
}

class User
{
    public string Username { get; set; }
}`;

const rethrowingExceptionsCode = `using System;
using System.IO;

class Program
{
    static void Main(string[] args)
    {
        try
        {
            ProcessUserData("userData.txt");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in Main: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            
            // Check for inner exceptions
            if (ex.InnerException != null)
            {
                Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
            }
        }
        
        Console.ReadKey();
    }
    
    static void ProcessUserData(string filePath)
    {
        try
        {
            // Call a method that might throw an exception
            string data = ReadUserDataFile(filePath);
            ParseUserData(data);
        }
        catch (FileNotFoundException ex)
        {
            // Log the specific error
            Console.WriteLine($"File not found: {ex.FileName}");
            
            // BAD: Throws away the original stack trace
            // throw new Exception("Error processing user data: file not found");
            
            // GOOD: Preserves the original exception info
            throw new ApplicationException("Error processing user data", ex);
        }
        catch (Exception ex)
        {
            // BAD: throw ex; - loses the original stack trace
            
            // GOOD: Re-throw preserving the stack trace
            throw;
        }
    }
    
    static string ReadUserDataFile(string filePath)
    {
        if (!File.Exists(filePath))
        {
            throw new FileNotFoundException("User data file not found", filePath);
        }
        
        // Read the file...
        return "sample data";
    }
    
    static void ParseUserData(string data)
    {
        // Parse the data...
        Console.WriteLine($"Parsing data: {data}");
    }
}`;

const exceptionFiltersCode = `using System;
using System.IO;
using System.Net;

class Program
{
    static void Main(string[] args)
    {
        // Example 1: Using exception filters based on a condition
        try
        {
            ProcessWebRequest("https://example.com/api/data");
        }
        catch (WebException ex) when (ex.Response is HttpWebResponse response && 
                                     response.StatusCode == HttpStatusCode.NotFound)
        {
            Console.WriteLine("The requested resource was not found (404).");
        }
        catch (WebException ex) when (ex.Response is HttpWebResponse response && 
                                     response.StatusCode == HttpStatusCode.Unauthorized)
        {
            Console.WriteLine("Authentication failed. Please log in again (401).");
        }
        catch (WebException ex)
        {
            Console.WriteLine($"A web request error occurred: {ex.Message}");
        }
        
        // Example 2: Using exception filters for logging without handling
        try
        {
            ProcessCriticalOperation();
        }
        catch (Exception ex) when (LogException(ex))
        {
            // This code is never executed because LogException returns false
            // The exception continues to propagate up the call stack
        }
        catch (InvalidOperationException ex)
        {
            Console.WriteLine($"Invalid operation: {ex.Message}");
        }
        
        Console.ReadKey();
    }
    
    static void ProcessWebRequest(string url)
    {
        // Simulate a web request that fails
        throw new WebException("Web request failed", 
            null, WebExceptionStatus.ProtocolError, 
            new HttpWebResponseMock(HttpStatusCode.NotFound));
    }
    
    static void ProcessCriticalOperation()
    {
        // Simulate a critical operation that fails
        throw new InvalidOperationException("Critical operation failed");
    }
    
    static bool LogException(Exception ex)
    {
        // Log the exception
        Console.WriteLine($"[LOGGED] {DateTime.Now}: {ex.GetType().Name} - {ex.Message}");
        
        // Return false so the exception continues to propagate
        return false;
    }
}

// Mock class for example purposes
class HttpWebResponseMock : WebResponse, HttpWebResponse
{
    public HttpStatusCode StatusCode { get; }
    
    public HttpWebResponseMock(HttpStatusCode statusCode)
    {
        StatusCode = statusCode;
    }
    
    // Implementing required properties and methods
    public Version ProtocolVersion => new Version(1, 1);
    public string StatusDescription => StatusCode.ToString();
    public CookieCollection Cookies { get; set; } = new CookieCollection();
    public WebHeaderCollection Headers { get; } = new WebHeaderCollection();
    public string Method => "GET";
    public Uri ResponseUri => new Uri("https://example.com");
    public bool IsMutuallyAuthenticated => false;
    public string CharacterSet => "UTF-8";
    public string ContentEncoding => "";
    public string Server => "Example";
    
    public override long ContentLength => 0;
    public override string ContentType => "application/json";
    
    public override Stream GetResponseStream() => new MemoryStream();
    
    public override void Close() { }
}`;

export default function ExceptionBestPracticesPage() {
  return (
    <LessonLayout 
      title="Exception Best Practices"
      level="intermediate"
      sidebarItems={sidebarItems}
      prev={{ href: '/intermediate/exceptions/custom', title: 'Custom Exceptions' }}
      next={{ href: '/intermediate/collections/generics', title: 'Generic Types and Methods' }}
    >
      <div className="prose dark:prose-invert max-w-none">
        <h1>Exception Handling Best Practices in C#</h1>
        
        <p>
          Effective exception handling is crucial for creating robust applications. This lesson covers best 
          practices that will help you write more reliable and maintainable exception handling code.
        </p>

        <h2>Common Mistakes in Exception Handling</h2>
        
        <p>
          Let's first look at some common anti-patterns and mistakes to avoid:
        </p>

        <CodeEditor 
          initialCode={badExceptionHandlingCode}
          language="csharp"
          readOnly={true}
        />

        <h2>Best Practices for Exception Handling</h2>
        
        <p>
          Now let's examine the proper way to handle exceptions:
        </p>

        <CodeEditor 
          initialCode={goodExceptionHandlingCode}
          language="csharp"
          readOnly={true}
        />

        <h2>Key Principles of Exception Handling</h2>
        
        <ul>
          <li><strong>Be specific</strong>: Catch specific exception types rather than general ones</li>
          <li><strong>Don't catch what you can't handle</strong>: If you can't meaningfully recover from an exception, let it propagate</li>
          <li><strong>Clean up resources</strong>: Use <code>try-finally</code> or <code>using</code> statements to ensure proper resource cleanup</li>
          <li><strong>Preserve exception information</strong>: When re-throwing, preserve the original exception details</li>
          <li><strong>Log exceptions</strong>: Always log exceptions with enough context for troubleshooting</li>
          <li><strong>Don't use exceptions for flow control</strong>: Exceptions should be for exceptional circumstances, not normal program flow</li>
        </ul>

        <h2>Rethrowing Exceptions</h2>
        
        <p>
          When you catch an exception and need to rethrow it, there are right and wrong ways to do it:
        </p>

        <CodeEditor 
          initialCode={rethrowingExceptionsCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg my-4">
          <p className="font-semibold">Important:</p>
          <p>
            When rethrowing exceptions, use <code>throw;</code> instead of <code>throw ex;</code> to preserve 
            the original stack trace. If you need to add context, wrap the original exception as an inner exception.
          </p>
        </div>

        <h2>Using Exception Filters (C# 6.0+)</h2>
        
        <p>
          Exception filters were introduced in C# 6.0 and allow you to specify conditions for when a catch block should execute:
        </p>

        <CodeEditor 
          initialCode={exceptionFiltersCode}
          language="csharp"
          readOnly={true}
        />

        <p>
          Exception filters offer two main advantages:
        </p>

        <ul>
          <li>They allow more granular exception handling without nested catch blocks</li>
          <li>They enable logging of exceptions without disrupting the stack trace (as shown in the second example)</li>
        </ul>

        <h2>Exception Handling Checklist</h2>
        
        <ul>
          <li>Only catch exceptions you can handle properly</li>
          <li>Order catch blocks from most specific to least specific</li>
          <li>Use finally blocks or using statements to clean up resources</li>
          <li>Include appropriate context in exception messages</li>
          <li>Log exceptions with sufficient detail for troubleshooting</li>
          <li>Don't catch exceptions just to rethrow them immediately</li>
          <li>Use exception filters for more specific handling (C# 6.0+)</li>
          <li>Consider performance implications of exception handling</li>
          <li>Test your exception handling code thoroughly</li>
        </ul>

        <h2>When to Use Exceptions vs. Error Codes</h2>
        
        <p>
          Use exceptions for:
        </p>

        <ul>
          <li>Exceptional or unexpected conditions</li>
          <li>Constructor failures (where return codes are not possible)</li>
          <li>Method failures where the caller cannot reasonably check beforehand</li>
        </ul>

        <p>
          Use return values for:
        </p>

        <ul>
          <li>Expected conditions (like "not found" in a search operation)</li>
          <li>Validation results that are part of normal program flow</li>
          <li>Operations where checking beforehand is trivial</li>
        </ul>

        <div className="bg-csharp-blue-50 dark:bg-csharp-blue-900/20 p-4 rounded-lg mt-6">
          <h3 className="text-csharp-blue-700 dark:text-csharp-blue-400">Practice Exercise</h3>
          <p>
            Refactor the following code to follow exception handling best practices:
          </p>
          <pre><code>
{`void ProcessData(string filePath)
{
    try
    {
        var data = File.ReadAllText(filePath);
        var result = ParseData(data);
        SaveResult(result);
    }
    catch(Exception ex)
    {
        Console.WriteLine("Error: " + ex.Message);
    }
}

object ParseData(string data)
{
    // Implementation
}`}
          </code></pre>
          <p>
            Your refactored code should:
          </p>
          <ul>
            <li>Handle specific exceptions appropriately</li>
            <li>Use proper resource management</li>
            <li>Include appropriate validation</li>
            <li>Follow the exception handling best practices discussed in this lesson</li>
          </ul>
        </div>

        <div className="mt-8">
          <p>
            You've now learned the best practices for exception handling in C#. In the next module, 
            we'll explore Collections and Generics, starting with Generic Types and Methods.
          </p>
        </div>
      </div>
    </LessonLayout>
  );
} 