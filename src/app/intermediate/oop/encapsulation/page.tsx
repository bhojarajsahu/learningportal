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

const encapsulationExampleCode = `public class BankAccount
{
    // Private field - only accessible within this class
    private decimal _balance;
    
    // Private field with validation
    private string _accountNumber;
    
    // Protected field - accessible in this class and derived classes
    protected DateTime _lastTransactionDate;
    
    // Public property with validation
    public decimal Balance
    {
        get { return _balance; }
        private set
        {
            if (value < 0)
                throw new ArgumentException("Balance cannot be negative");
            _balance = value;
        }
    }
    
    // Public property with validation
    public string AccountNumber
    {
        get { return _accountNumber; }
        private set
        {
            if (string.IsNullOrEmpty(value) || value.Length != 10)
                throw new ArgumentException("Invalid account number");
            _accountNumber = value;
        }
    }
    
    // Constructor
    public BankAccount(string accountNumber, decimal initialBalance)
    {
        AccountNumber = accountNumber;
        Balance = initialBalance;
        _lastTransactionDate = DateTime.Now;
    }
    
    // Public method
    public void Deposit(decimal amount)
    {
        if (amount <= 0)
            throw new ArgumentException("Deposit amount must be positive");
            
        Balance += amount;
        _lastTransactionDate = DateTime.Now;
        LogTransaction("Deposit", amount);
    }
    
    // Public method
    public void Withdraw(decimal amount)
    {
        if (amount <= 0)
            throw new ArgumentException("Withdrawal amount must be positive");
            
        if (amount > Balance)
            throw new InvalidOperationException("Insufficient funds");
            
        Balance -= amount;
        _lastTransactionDate = DateTime.Now;
        LogTransaction("Withdrawal", amount);
    }
    
    // Private method - only accessible within this class
    private void LogTransaction(string type, decimal amount)
    {
        Console.WriteLine($"{DateTime.Now}: {type} of \${amount} on account {AccountNumber}");
    }
    
    // Internal method - only accessible within the same assembly
    internal void UpdateLastTransactionDate()
    {
        _lastTransactionDate = DateTime.Now;
    }
}`;

const accessModifiersExampleCode = `// Access modifiers at the class level
public class PublicClass { }           // Accessible everywhere
internal class InternalClass { }       // Accessible only within the same assembly
class DefaultClass { }                 // Internal by default

public class AccessModifiersExample
{
    // Field access modifiers
    private int _privateField;         // Only accessible within this class
    protected int _protectedField;     // Accessible in this class and derived classes
    internal int _internalField;       // Accessible within the same assembly
    protected internal int _protectedInternalField;  // Accessible in derived classes and same assembly
    public int _publicField;           // Accessible everywhere
    
    // Property access modifiers
    private int PrivateProperty { get; set; }
    protected int ProtectedProperty { get; set; }
    internal int InternalProperty { get; set; }
    protected internal int ProtectedInternalProperty { get; set; }
    public int PublicProperty { get; set; }
    
    // Method access modifiers
    private void PrivateMethod() { }
    protected void ProtectedMethod() { }
    internal void InternalMethod() { }
    protected internal void ProtectedInternalMethod() { }
    public void PublicMethod() { }
}`;

export default function EncapsulationPage() {
  return (
    <LessonLayout
      level="intermediate"
      title="Encapsulation and Access Modifiers"
      sidebarItems={sidebarItems}
    >
      <div className="prose max-w-none">
        <h1>Encapsulation and Access Modifiers in C#</h1>
        <p>
          Encapsulation is one of the fundamental principles of object-oriented programming. It involves bundling data
          and methods that operate on that data within a single unit, while controlling access to the internal details.
        </p>

        <h2>What is Encapsulation?</h2>
        <p>
          Encapsulation is the practice of hiding internal implementation details and providing a controlled interface
          to access and modify the data. This helps maintain data integrity and reduces coupling between components.
        </p>

        <h2>Encapsulation Example</h2>
        <p>
          Let's look at a practical example using a bank account:
        </p>

        <div className="my-4">
          <CodeEditor
            initialCode={encapsulationExampleCode}
            language="csharp"
            readOnly={true}
          />
        </div>

        <h2>Key Concepts in Encapsulation</h2>
        <ul>
          <li><strong>Data Hiding:</strong> Using private fields to store data</li>
          <li><strong>Property Access:</strong> Using properties to control access to data</li>
          <li><strong>Validation:</strong> Implementing validation in property setters</li>
          <li><strong>Method Encapsulation:</strong> Controlling access to methods</li>
        </ul>

        <h2>Access Modifiers</h2>
        <p>
          C# provides several access modifiers to control the visibility of types and their members:
        </p>

        <div className="my-4">
          <CodeEditor
            initialCode={accessModifiersExampleCode}
            language="csharp"
            readOnly={true}
          />
        </div>

        <h2>Access Modifier Levels</h2>
        <ul>
          <li><strong>private:</strong> Only accessible within the declaring class</li>
          <li><strong>protected:</strong> Accessible in the declaring class and derived classes</li>
          <li><strong>internal:</strong> Accessible within the same assembly</li>
          <li><strong>protected internal:</strong> Accessible in derived classes and within the same assembly</li>
          <li><strong>public:</strong> Accessible everywhere</li>
        </ul>

        <h2>Best Practices for Encapsulation</h2>
        <ul>
          <li>Keep fields private and provide public properties for access</li>
          <li>Use properties instead of public fields</li>
          <li>Implement validation in property setters</li>
          <li>Use the most restrictive access level possible</li>
          <li>Consider using read-only properties when appropriate</li>
        </ul>

        <h2>Benefits of Encapsulation</h2>
        <ul>
          <li><strong>Data Integrity:</strong> Prevents invalid data states</li>
          <li><strong>Maintainability:</strong> Easier to modify implementation details</li>
          <li><strong>Flexibility:</strong> Can change internal implementation without affecting external code</li>
          <li><strong>Security:</strong> Better control over data access</li>
        </ul>
      </div>
    </LessonLayout>
  );
} 