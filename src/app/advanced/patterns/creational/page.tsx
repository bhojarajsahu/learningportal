import React from 'react';
import { FiGitMerge, FiCheckCircle, FiInfo, FiCode } from 'react-icons/fi';
import LessonLayout from '@/components/LessonLayout';
import CodeEditor from '@/components/CodeEditor';

const sidebarItems = [
  {
    title: 'Design Patterns',
    href: '/advanced/patterns',
    icon: <FiGitMerge className="w-4 h-4" />,
    children: [
      { title: 'Creational Patterns', href: '/advanced/patterns/creational' },
      { title: 'Structural Patterns', href: '/advanced/patterns/structural' },
      { title: 'Behavioral Patterns', href: '/advanced/patterns/behavioral' },
    ]
  },
];

const singletonCode = `using System;

namespace DesignPatterns.Creational
{
    // Singleton Design Pattern
    public sealed class Singleton
    {
        // Private static instance - lazy initialized
        private static readonly Lazy<Singleton> _instance = 
            new Lazy<Singleton>(() => new Singleton());
            
        // Private constructor to prevent external instantiation
        private Singleton()
        {
            Console.WriteLine("Singleton instance created");
        }
        
        // Public access point
        public static Singleton Instance => _instance.Value;
        
        // Example method
        public void DoSomething()
        {
            Console.WriteLine("Singleton is doing something");
        }
    }
    
    // Usage
    public class Program
    {
        public static void Main()
        {
            // Get the singleton instance
            Singleton instance1 = Singleton.Instance;
            instance1.DoSomething();
            
            // Try to get another instance - will return the same one
            Singleton instance2 = Singleton.Instance;
            
            // Check if they're the same instance
            bool isSameInstance = ReferenceEquals(instance1, instance2);
            Console.WriteLine($"Are they the same instance? {isSameInstance}");
        }
    }
}`;

const factoryMethodCode = `using System;

namespace DesignPatterns.Creational
{
    // Product interface
    public interface IProduct
    {
        string Operation();
    }
    
    // Concrete products
    public class ConcreteProductA : IProduct
    {
        public string Operation()
        {
            return "Result of ConcreteProductA";
        }
    }
    
    public class ConcreteProductB : IProduct
    {
        public string Operation()
        {
            return "Result of ConcreteProductB";
        }
    }
    
    // Creator abstract class
    public abstract class Creator
    {
        // Factory Method
        public abstract IProduct FactoryMethod();
        
        // Template method that uses the factory method
        public string SomeOperation()
        {
            // Call the factory method to create a product
            var product = FactoryMethod();
            
            // Use the product
            return $"Creator: The same creator's code has just worked with {product.Operation()}";
        }
    }
    
    // Concrete creators override the factory method to change the product type
    public class ConcreteCreatorA : Creator
    {
        public override IProduct FactoryMethod()
        {
            return new ConcreteProductA();
        }
    }
    
    public class ConcreteCreatorB : Creator
    {
        public override IProduct FactoryMethod()
        {
            return new ConcreteProductB();
        }
    }
    
    // Client code
    public class Client
    {
        public void ClientCode(Creator creator)
        {
            Console.WriteLine($"Client: I'm not aware of the creator's class but it still works.\\n{creator.SomeOperation()}");
        }
    }
    
    // Usage
    public class Program
    {
        public static void Main()
        {
            Console.WriteLine("App: Launched with ConcreteCreatorA.");
            var client = new Client();
            client.ClientCode(new ConcreteCreatorA());
            
            Console.WriteLine("\\nApp: Launched with ConcreteCreatorB.");
            client.ClientCode(new ConcreteCreatorB());
        }
    }
}`;

const abstractFactoryCode = `using System;

namespace DesignPatterns.Creational
{
    // Abstract Products
    public interface IChair
    {
        void SitOn();
        bool HasLegs();
    }
    
    public interface ITable
    {
        void PutOn(string item);
        string GetStyle();
    }
    
    // Abstract Factory
    public interface IFurnitureFactory
    {
        IChair CreateChair();
        ITable CreateTable();
    }
    
    // Concrete Products - Modern Style
    public class ModernChair : IChair
    {
        public void SitOn()
        {
            Console.WriteLine("Sitting on a modern chair");
        }
        
        public bool HasLegs()
        {
            return false; // Modern chair is legless
        }
    }
    
    public class ModernTable : ITable
    {
        public void PutOn(string item)
        {
            Console.WriteLine($"Placing {item} on modern table");
        }
        
        public string GetStyle()
        {
            return "Minimalist sleek style";
        }
    }
    
    // Concrete Products - Victorian Style
    public class VictorianChair : IChair
    {
        public void SitOn()
        {
            Console.WriteLine("Sitting on an ornate Victorian chair");
        }
        
        public bool HasLegs()
        {
            return true; // Victorian chair has ornate legs
        }
    }
    
    public class VictorianTable : ITable
    {
        public void PutOn(string item)
        {
            Console.WriteLine($"Carefully placing {item} on antique Victorian table");
        }
        
        public string GetStyle()
        {
            return "Ornate carved style";
        }
    }
    
    // Concrete Factories
    public class ModernFurnitureFactory : IFurnitureFactory
    {
        public IChair CreateChair()
        {
            return new ModernChair();
        }
        
        public ITable CreateTable()
        {
            return new ModernTable();
        }
    }
    
    public class VictorianFurnitureFactory : IFurnitureFactory
    {
        public IChair CreateChair()
        {
            return new VictorianChair();
        }
        
        public ITable CreateTable()
        {
            return new VictorianTable();
        }
    }
    
    // Client
    public class Client
    {
        private readonly IChair _chair;
        private readonly ITable _table;
        
        public Client(IFurnitureFactory factory)
        {
            _chair = factory.CreateChair();
            _table = factory.CreateTable();
        }
        
        public void UseProducts()
        {
            _chair.SitOn();
            Console.WriteLine($"Chair has legs: {_chair.HasLegs()}");
            _table.PutOn("coffee mug");
            Console.WriteLine($"Table style: {_table.GetStyle()}");
        }
    }
    
    // Usage
    public class Program
    {
        public static void Main()
        {
            Console.WriteLine("Client ordered modern furniture:");
            var modernClient = new Client(new ModernFurnitureFactory());
            modernClient.UseProducts();
            
            Console.WriteLine("\\nClient ordered Victorian furniture:");
            var victorianClient = new Client(new VictorianFurnitureFactory());
            victorianClient.UseProducts();
        }
    }
}`;

export default function CreationalPatternsPage() {
  return (
    <LessonLayout 
      title="Creational Patterns"
      level="advanced"
      sidebarItems={sidebarItems}
      next={{ href: '/advanced/patterns/structural', title: 'Structural Patterns' }}
    >
      <div className="prose dark:prose-invert max-w-none">
        <h1>Creational Design Patterns in C#</h1>
        
        <p>
          Creational design patterns are concerned with the way objects are created,
          helping to make a system independent of how its objects are created, composed, and represented.
          These patterns address common problems in object creation, particularly when simple direct
          instantiation leads to design problems or complexity.
        </p>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg my-4">
          <p className="font-semibold">Key Benefits of Creational Patterns:</p>
          <ul className="mt-2">
            <li>Encapsulate knowledge about which concrete classes the system uses</li>
            <li>Hide how instances of these classes are created and combined</li>
            <li>Make systems independent of how objects are created, composed, and represented</li>
            <li>Promote flexibility by allowing the system to be configured with different objects</li>
          </ul>
        </div>

        <h2>Singleton Pattern</h2>
        
        <p>
          The Singleton pattern ensures a class has only one instance and provides a global point of
          access to it. This is useful when exactly one object is needed to coordinate actions across
          the system.
        </p>

        <CodeEditor 
          initialCode={singletonCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
          <p className="font-semibold">When to use the Singleton Pattern:</p>
          <ul className="mt-2">
            <li>When a class should have exactly one instance available to all clients</li>
            <li>When you need stricter control over global variables</li>
            <li>Common examples: configuration managers, logging systems, connection pools</li>
          </ul>
          <p className="mt-2 text-sm italic">
            <FiInfo className="inline mr-1" /> Note: Be cautious with singletons as they can introduce global state and make testing difficult.
          </p>
        </div>

        <h2>Factory Method Pattern</h2>
        
        <p>
          The Factory Method pattern defines an interface for creating an object but lets subclasses decide
          which class to instantiate. This lets a class defer instantiation to subclasses.
        </p>

        <CodeEditor 
          initialCode={factoryMethodCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
          <p className="font-semibold">When to use the Factory Method Pattern:</p>
          <ul className="mt-2">
            <li>When a class cannot anticipate the class of objects it must create</li>
            <li>When a class wants its subclasses to specify the objects it creates</li>
            <li>When classes delegate responsibility to one of several helper subclasses, and you want to localize the knowledge of which helper subclass is the delegate</li>
          </ul>
        </div>

        <h2>Abstract Factory Pattern</h2>
        
        <p>
          The Abstract Factory pattern provides an interface for creating families of related or dependent
          objects without specifying their concrete classes. It's particularly useful when a system should
          be independent of how its products are created, composed, and represented.
        </p>

        <CodeEditor 
          initialCode={abstractFactoryCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
          <p className="font-semibold">When to use the Abstract Factory Pattern:</p>
          <ul className="mt-2">
            <li>When a system should be independent of how its products are created, composed, and represented</li>
            <li>When a system should be configured with one of multiple families of products</li>
            <li>When you want to provide a class library of products, and you want to reveal just their interfaces, not their implementations</li>
            <li>When related product objects need to be used together and this constraint needs to be enforced</li>
          </ul>
        </div>

        <h2>Other Creational Patterns</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-700 dark:text-gray-300">Builder Pattern</h3>
            <p className="mt-2">
              Separates the construction of a complex object from its representation,
              allowing the same construction process to create various representations.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-700 dark:text-gray-300">Prototype Pattern</h3>
            <p className="mt-2">
              Creates new objects by copying an existing object, known as the prototype.
              Useful when object creation is more efficient than standard instantiation.
            </p>
          </div>
        </div>

        <div className="bg-csharp-blue-50 dark:bg-csharp-blue-900/20 p-4 rounded-lg mt-6">
          <h3 className="text-csharp-blue-700 dark:text-csharp-blue-400">Practice Exercise</h3>
          <p>
            Implement a Builder pattern in C# to create a complex document with various elements
            (text, images, tables). Create a Director class that uses the Builder interface to
            construct several standard document types.
          </p>
          <p className="mt-2">
            Consider how this pattern helps separate construction logic from the final
            representation, making the system more flexible when new document types are needed.
          </p>
        </div>
      </div>
    </LessonLayout>
  );
} 