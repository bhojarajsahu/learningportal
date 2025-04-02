import React from 'react';
import { FiCode, FiGitBranch, FiPackage, FiServer } from 'react-icons/fi';
import LessonLayout from '@/components/LessonLayout';
import CodeEditor from '@/components/CodeEditor';
import { SidebarItem } from '@/types/sidebar';

const sidebarItems: SidebarItem[] = [
  {
    title: 'Object-Oriented Programming',
    href: '/intermediate/oop',
    icon: <FiCode />,
    children: [
      { title: 'Classes and Objects', href: '/intermediate/oop/classes', icon: <FiCode /> },
      { title: 'Inheritance and Polymorphism', href: '/intermediate/oop/inheritance', icon: <FiGitBranch /> },
      { title: 'Interfaces and Abstract Classes', href: '/intermediate/oop/interfaces', icon: <FiPackage /> },
      { title: 'Encapsulation and Access Modifiers', href: '/intermediate/oop/encapsulation', icon: <FiServer /> },
    ],
  },
];

const interfaceExampleCode = `// Interface definition
public interface IPaymentMethod
{
    void ProcessPayment(decimal amount);
    bool ValidatePayment();
    string GetPaymentDetails();
}

// Interface implementation
public class CreditCardPayment : IPaymentMethod
{
    private string cardNumber;
    private string expiryDate;

    public CreditCardPayment(string cardNumber, string expiryDate)
    {
        this.cardNumber = cardNumber;
        this.expiryDate = expiryDate;
    }

    public void ProcessPayment(decimal amount)
    {
        Console.WriteLine($"Processing credit card payment of \${amount}");
        // Actual payment processing logic here
    }

    public bool ValidatePayment()
    {
        // Credit card validation logic
        return true;
    }

    public string GetPaymentDetails()
    {
        return $"Credit Card ending in {cardNumber.Substring(cardNumber.Length - 4)}";
    }
}

// Another implementation
public class PayPalPayment : IPaymentMethod
{
    private string email;

    public PayPalPayment(string email)
    {
        this.email = email;
    }

    public void ProcessPayment(decimal amount)
    {
        Console.WriteLine($"Processing PayPal payment of \${amount}");
        // PayPal payment processing logic here
    }

    public bool ValidatePayment()
    {
        // PayPal validation logic
        return true;
    }

    public string GetPaymentDetails()
    {
        return $"PayPal account: {email}";
    }
}`;

const abstractClassExampleCode = `// Abstract class
public abstract class Shape
{
    public string Name { get; set; }
    public string Color { get; set; }

    protected Shape(string name, string color)
    {
        Name = name;
        Color = color;
    }

    // Abstract method - must be implemented by derived classes
    public abstract double CalculateArea();

    // Abstract method - must be implemented by derived classes
    public abstract double CalculatePerimeter();

    // Concrete method - shared implementation
    public void DisplayInfo()
    {
        Console.WriteLine($"Shape: {Name}");
        Console.WriteLine($"Color: {Color}");
        Console.WriteLine($"Area: {CalculateArea()}");
        Console.WriteLine($"Perimeter: {CalculatePerimeter()}");
    }
}

// Concrete class
public class Circle : Shape
{
    public double Radius { get; set; }

    public Circle(string color, double radius) 
        : base("Circle", color)
    {
        Radius = radius;
    }

    public override double CalculateArea()
    {
        return Math.PI * Radius * Radius;
    }

    public override double CalculatePerimeter()
    {
        return 2 * Math.PI * Radius;
    }
}

// Another concrete class
public class Rectangle : Shape
{
    public double Width { get; set; }
    public double Height { get; set; }

    public Rectangle(string color, double width, double height) 
        : base("Rectangle", color)
    {
        Width = width;
        Height = height;
    }

    public override double CalculateArea()
    {
        return Width * Height;
    }

    public override double CalculatePerimeter()
    {
        return 2 * (Width + Height);
    }
}`;

export default function InterfacesPage() {
  return (
    <LessonLayout
      level="intermediate"
      title="Interfaces and Abstract Classes"
      sidebarItems={sidebarItems}
    >
      <div className="prose max-w-none">
        <h1>Interfaces and Abstract Classes in C#</h1>
        <p>
          Interfaces and abstract classes are powerful features in C# that enable you to define contracts and create
          reusable code structures. They help in achieving abstraction and polymorphism in your applications.
        </p>

        <h2>What are Interfaces?</h2>
        <p>
          An interface defines a contract that specifies what a class must do, without specifying how it should do it.
          It's a way to achieve multiple inheritance in C# and define common behavior across unrelated classes.
        </p>

        <h2>Interface Example</h2>
        <p>
          Let's look at a practical example using payment methods:
        </p>

        <div className="my-4">
          <CodeEditor
            initialCode={interfaceExampleCode}
            language="csharp"
            readOnly={true}
          />
        </div>

        <h2>Key Concepts in Interfaces</h2>
        <ul>
          <li><strong>Contract Definition:</strong> Interfaces define what methods a class must implement</li>
          <li><strong>Multiple Implementation:</strong> A class can implement multiple interfaces</li>
          <li><strong>No Implementation:</strong> Interfaces cannot contain implementation code</li>
          <li><strong>Default Methods:</strong> C# 8.0+ allows default implementation in interfaces</li>
        </ul>

        <h2>What are Abstract Classes?</h2>
        <p>
          Abstract classes are classes that cannot be instantiated and can contain both abstract and concrete members.
          They provide a way to share code among several closely related classes.
        </p>

        <h2>Abstract Class Example</h2>
        <p>
          Here's an example using shapes:
        </p>

        <div className="my-4">
          <CodeEditor
            initialCode={abstractClassExampleCode}
            language="csharp"
            readOnly={true}
          />
        </div>

        <h2>Key Concepts in Abstract Classes</h2>
        <ul>
          <li><strong>Partial Implementation:</strong> Can contain both abstract and concrete members</li>
          <li><strong>Constructor Support:</strong> Can have constructors</li>
          <li><strong>Access Modifiers:</strong> Can have different access levels for members</li>
          <li><strong>Single Inheritance:</strong> A class can inherit from only one abstract class</li>
        </ul>

        <h2>When to Use Each</h2>
        <ul>
          <li><strong>Use Interfaces When:</strong>
            <ul>
              <li>Defining a contract for unrelated classes</li>
              <li>Needing multiple inheritance</li>
              <li>Creating loosely coupled components</li>
              <li>Defining behavior that can be shared across different types</li>
            </ul>
          </li>
          <li><strong>Use Abstract Classes When:</strong>
            <ul>
              <li>Sharing code among closely related classes</li>
              <li>Providing common base implementation</li>
              <li>Needing to declare non-public members</li>
              <li>Having constructors or destructors</li>
            </ul>
          </li>
        </ul>

        <h2>Best Practices</h2>
        <ul>
          <li>Keep interfaces focused and small</li>
          <li>Use interfaces for defining contracts</li>
          <li>Use abstract classes for sharing code</li>
          <li>Prefer interfaces over abstract classes when possible</li>
          <li>Follow the Interface Segregation Principle</li>
        </ul>
      </div>
    </LessonLayout>
  );
} 