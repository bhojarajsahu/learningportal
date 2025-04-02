import React from 'react';
import { FiCode, FiGitBranch, FiPackage } from 'react-icons/fi';
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

const genericTypesCode = `using System;
using System.Collections.Generic;

class Program
{
    static void Main(string[] args)
    {
        // Creating a generic List of integers
        List<int> numbers = new List<int>();
        
        // Adding items to the list
        numbers.Add(1);
        numbers.Add(2);
        numbers.Add(3);
        numbers.Add(4);
        numbers.Add(5);
        
        // Accessing items by index
        Console.WriteLine($"The third number is: {numbers[2]}");
        
        // Iterating through the list
        Console.WriteLine("All numbers:");
        foreach (int number in numbers)
        {
            Console.WriteLine(number);
        }
        
        // Creating a generic List of strings
        List<string> names = new List<string>
        {
            "Alice", "Bob", "Charlie", "David", "Eve"
        };
        
        // Using list methods
        Console.WriteLine($"Number of names: {names.Count}");
        Console.WriteLine($"Does list contain 'Bob'? {names.Contains("Bob")}");
        
        // Sorting the list
        names.Sort();
        Console.WriteLine("Sorted names:");
        foreach (string name in names)
        {
            Console.WriteLine(name);
        }
        
        // Creating a Dictionary (key-value pairs)
        Dictionary<string, int> ages = new Dictionary<string, int>
        {
            { "Alice", 25 },
            { "Bob", 30 },
            { "Charlie", 35 }
        };
        
        // Adding another entry
        ages["David"] = 40;
        
        // Accessing values by key
        Console.WriteLine($"Bob's age is: {ages["Bob"]}");
        
        // Checking if a key exists
        if (ages.ContainsKey("Eve"))
        {
            Console.WriteLine($"Eve's age is: {ages["Eve"]}");
        }
        else
        {
            Console.WriteLine("Eve's age is unknown.");
        }
        
        // Iterating through a dictionary
        Console.WriteLine("Names and ages:");
        foreach (KeyValuePair<string, int> person in ages)
        {
            Console.WriteLine($"{person.Key} is {person.Value} years old");
        }
        
        Console.ReadKey();
    }
}`;

const customGenericClass = `using System;
using System.Collections.Generic;

// Generic class with a type parameter T
public class Box<T>
{
    // Private field of type T
    private T item;
    
    // Constructor
    public Box(T item)
    {
        this.item = item;
    }
    
    // Property to get the item
    public T Item
    {
        get { return item; }
    }
    
    // Method that returns the item type
    public Type GetItemType()
    {
        return typeof(T);
    }
}

// Generic class with multiple type parameters
public class Pair<TFirst, TSecond>
{
    public TFirst First { get; set; }
    public TSecond Second { get; set; }
    
    public Pair(TFirst first, TSecond second)
    {
        First = first;
        Second = second;
    }
    
    public override string ToString()
    {
        return $"({First}, {Second})";
    }
}

class Program
{
    static void Main(string[] args)
    {
        // Using Box<T> with different types
        Box<int> intBox = new Box<int>(123);
        Console.WriteLine($"Integer box contains: {intBox.Item}");
        Console.WriteLine($"Item type: {intBox.GetItemType()}");
        
        Box<string> stringBox = new Box<string>("Hello, Generics!");
        Console.WriteLine($"String box contains: {stringBox.Item}");
        Console.WriteLine($"Item type: {stringBox.GetItemType()}");
        
        // Using Pair<TFirst, TSecond> with mixed types
        Pair<string, int> nameAgePair = new Pair<string, int>("Alice", 25);
        Console.WriteLine($"Name: {nameAgePair.First}, Age: {nameAgePair.Second}");
        
        Pair<double, double> point = new Pair<double, double>(10.5, 20.7);
        Console.WriteLine($"Point coordinates: {point}");
        
        Console.ReadKey();
    }
}`;

const genericMethodsCode = `using System;
using System.Collections.Generic;

class Program
{
    static void Main(string[] args)
    {
        // Using generic methods with different types
        int[] numbers = { 1, 2, 3, 4, 5 };
        string[] names = { "Alice", "Bob", "Charlie" };
        
        // Display arrays using generic method
        DisplayArray(numbers);
        DisplayArray(names);
        
        // Find maximum value using generic method
        Console.WriteLine($"Max number: {FindMax(numbers)}");
        Console.WriteLine($"First name alphabetically: {FindMax(names)}");
        
        // Swap values using generic method
        int a = 10, b = 20;
        Console.WriteLine($"Before swap: a = {a}, b = {b}");
        Swap(ref a, ref b);
        Console.WriteLine($"After swap: a = {a}, b = {b}");
        
        string firstName = "John", lastName = "Doe";
        Console.WriteLine($"Before swap: {firstName} {lastName}");
        Swap(ref firstName, ref lastName);
        Console.WriteLine($"After swap: {firstName} {lastName}");
        
        // Convert array to list
        List<int> numberList = CreateList(numbers);
        Console.WriteLine($"Number list count: {numberList.Count}");
        
        Console.ReadKey();
    }
    
    // Generic method to display array elements
    static void DisplayArray<T>(T[] array)
    {
        Console.WriteLine($"Array of {typeof(T).Name}:");
        foreach (T item in array)
        {
            Console.WriteLine(item);
        }
        Console.WriteLine();
    }
    
    // Generic method with constraint (IComparable)
    static T FindMax<T>(T[] array) where T : IComparable<T>
    {
        if (array == null || array.Length == 0)
        {
            throw new ArgumentException("Array cannot be empty or null");
        }
        
        T max = array[0];
        for (int i = 1; i < array.Length; i++)
        {
            if (array[i].CompareTo(max) > 0)
            {
                max = array[i];
            }
        }
        
        return max;
    }
    
    // Generic method to swap two values
    static void Swap<T>(ref T a, ref T b)
    {
        T temp = a;
        a = b;
        b = temp;
    }
    
    // Generic method that returns a generic collection
    static List<T> CreateList<T>(T[] array)
    {
        List<T> list = new List<T>();
        foreach (T item in array)
        {
            list.Add(item);
        }
        return list;
    }
}`;

const genericConstraintsCode = `using System;
using System.Collections.Generic;

// Interface for constraint example
public interface IEntity
{
    int Id { get; }
    string Name { get; }
}

// Class for constraint example
public class Repository<T> where T : IEntity
{
    private List<T> items = new List<T>();
    
    public void Add(T item)
    {
        items.Add(item);
    }
    
    public T GetById(int id)
    {
        return items.Find(item => item.Id == id);
    }
    
    public IEnumerable<T> GetAll()
    {
        return items;
    }
}

// Example implementation of IEntity
public class Product : IEntity
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    
    public Product(int id, string name, decimal price)
    {
        Id = id;
        Name = name;
        Price = price;
    }
}

// Generic class with value type constraint
public class NumericCalculator<T> where T : struct, IComparable<T>
{
    public T Add(T a, T b)
    {
        // This won't work directly because T could be any value type
        // Just for demonstration purposes
        dynamic da = a;
        dynamic db = b;
        return da + db;
    }
    
    public T Max(T a, T b)
    {
        return a.CompareTo(b) > 0 ? a : b;
    }
}

// Generic class with constructor constraint
public class Factory<T> where T : new()
{
    public T Create()
    {
        return new T();
    }
}

class Program
{
    static void Main(string[] args)
    {
        // Using Repository<T> with IEntity constraint
        Repository<Product> productRepo = new Repository<Product>();
        productRepo.Add(new Product(1, "Laptop", 999.99m));
        productRepo.Add(new Product(2, "Mouse", 25.99m));
        
        Product product = productRepo.GetById(1);
        Console.WriteLine($"Found product: {product.Name}, Price: {product.Price}");
        
        // Using NumericCalculator<T> with struct constraint
        NumericCalculator<int> intCalc = new NumericCalculator<int>();
        Console.WriteLine($"Max of 10 and 20: {intCalc.Max(10, 20)}");
        Console.WriteLine($"Sum of 10 and 20: {intCalc.Add(10, 20)}");
        
        NumericCalculator<double> doubleCalc = new NumericCalculator<double>();
        Console.WriteLine($"Max of 10.5 and 20.7: {doubleCalc.Max(10.5, 20.7)}");
        
        // Using Factory<T> with new() constraint
        Factory<List<string>> listFactory = new Factory<List<string>>();
        List<string> newList = listFactory.Create();
        newList.Add("Created from factory");
        Console.WriteLine($"List contains: {newList[0]}");
        
        Console.ReadKey();
    }
}`;

export default function GenericsPage() {
  return (
    <LessonLayout 
      title="Generic Types and Methods"
      level="intermediate"
      sidebarItems={sidebarItems}
      prev={{ href: '/intermediate/exceptions/best-practices', title: 'Exception Best Practices' }}
      next={{ href: '/intermediate/collections/advanced', title: 'Advanced Collections' }}
    >
      <div className="prose dark:prose-invert max-w-none">
        <h1>Generic Types and Methods in C#</h1>
        
        <p>
          Generics are one of the most powerful features in C#, allowing you to write flexible, reusable, and 
          type-safe code. They were introduced in C# 2.0 and have become a fundamental part of the language 
          and the .NET Framework.
        </p>

        <h2>Introduction to Generics</h2>
        
        <p>
          Generics enable you to define classes, interfaces, methods, and delegates with placeholder types that 
          are specified when the code is used, rather than when it's written. This allows for code reuse while 
          maintaining type safety.
        </p>

        <p>
          The main benefits of generics include:
        </p>

        <ul>
          <li><strong>Type Safety:</strong> Detect type errors at compile time rather than runtime</li>
          <li><strong>Code Reusability:</strong> Write algorithms that work with different types</li>
          <li><strong>Performance:</strong> Avoid boxing/unboxing operations for value types</li>
          <li><strong>Cleaner Code:</strong> Reduce code duplication and casting</li>
        </ul>

        <h2>Using Generic Collection Types</h2>
        
        <p>
          The .NET Framework provides many generic collection classes in the <code>System.Collections.Generic</code> 
          namespace. These collections are type-safe and more efficient than the non-generic collections in 
          <code>System.Collections</code>.
        </p>

        <CodeEditor 
          initialCode={genericTypesCode}
          language="csharp"
          readOnly={true}
        />

        <p>
          This example demonstrates the use of generic collections like <code>List&lt;T&gt;</code> and 
          <code>Dictionary&lt;TKey, TValue&gt;</code>, which are two of the most commonly used generic 
          collection types in C#.
        </p>

        <h2>Creating Custom Generic Classes</h2>
        
        <p>
          You can create your own generic types to implement reusable data structures or services.
        </p>

        <CodeEditor 
          initialCode={customGenericClass}
          language="csharp"
          readOnly={true}
        />

        <p>
          This example shows:
        </p>

        <ul>
          <li>How to define a generic class with a single type parameter (<code>Box&lt;T&gt;</code>)</li>
          <li>How to define a generic class with multiple type parameters (<code>Pair&lt;TFirst, TSecond&gt;</code>)</li>
          <li>How to use these generic classes with different types</li>
        </ul>

        <h2>Generic Methods</h2>
        
        <p>
          Generic methods allow you to define algorithms that can work with different types without 
          duplicating code.
        </p>

        <CodeEditor 
          initialCode={genericMethodsCode}
          language="csharp"
          readOnly={true}
        />

        <p>
          In this example, we've created several generic methods:
        </p>

        <ul>
          <li><code>DisplayArray&lt;T&gt;</code>: Works with arrays of any type</li>
          <li><code>FindMax&lt;T&gt;</code>: Finds the maximum value in an array (with a constraint)</li>
          <li><code>Swap&lt;T&gt;</code>: Swaps two values of the same type</li>
          <li><code>CreateList&lt;T&gt;</code>: Converts an array to a List</li>
        </ul>

        <h2>Generic Constraints</h2>
        
        <p>
          Generic constraints allow you to restrict the types that can be used as type arguments in 
          a generic type or method. This enables you to make assumptions about the capabilities of 
          the types.
        </p>

        <CodeEditor 
          initialCode={genericConstraintsCode}
          language="csharp"
          readOnly={true}
        />

        <p>
          This example demonstrates several types of constraints:
        </p>

        <ul>
          <li><strong>Interface constraints:</strong> <code>where T : IEntity</code> - The type must implement the IEntity interface</li>
          <li><strong>Multiple constraints:</strong> <code>where T : struct, IComparable&lt;T&gt;</code> - The type must be a value type and implement IComparable</li>
          <li><strong>Constructor constraint:</strong> <code>where T : new()</code> - The type must have a parameterless constructor</li>
        </ul>

        <h2>Common Generic Constraints</h2>
        
        <ul>
          <li><code>where T : struct</code> - T must be a value type</li>
          <li><code>where T : class</code> - T must be a reference type</li>
          <li><code>where T : new()</code> - T must have a parameterless constructor</li>
          <li><code>where T : &lt;base class&gt;</code> - T must be or derive from the specified base class</li>
          <li><code>where T : &lt;interface&gt;</code> - T must implement the specified interface</li>
          <li><code>where T : U</code> - T must be or derive from the type argument U</li>
        </ul>

        <div className="bg-csharp-blue-50 dark:bg-csharp-blue-900/20 p-4 rounded-lg mt-6">
          <h3 className="text-csharp-blue-700 dark:text-csharp-blue-400">Practice Exercise</h3>
          <p>
            Create a generic <code>Stack&lt;T&gt;</code> class that implements a basic stack data structure with the following methods:
          </p>
          <ul>
            <li><code>Push(T item)</code>: Adds an item to the top of the stack</li>
            <li><code>T Pop()</code>: Removes and returns the top item from the stack</li>
            <li><code>T Peek()</code>: Returns the top item without removing it</li>
            <li><code>bool IsEmpty()</code>: Checks if the stack is empty</li>
            <li><code>int Count()</code>: Returns the number of items in the stack</li>
          </ul>
          <p>
            Test your implementation with different types (integers, strings, custom objects).
          </p>
        </div>

        <div className="mt-8">
          <p>
            In the next lesson, we'll explore more advanced collection types in C# and learn how to use them effectively.
          </p>
        </div>
      </div>
    </LessonLayout>
  );
} 