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

const observerCode = `using System;
using System.Collections.Generic;

namespace DesignPatterns.Behavioral
{
    // Subject interface
    public interface ISubject
    {
        void Attach(IObserver observer);
        void Detach(IObserver observer);
        void Notify();
    }
    
    // Observer interface
    public interface IObserver
    {
        void Update(ISubject subject);
    }
    
    // Concrete Subject - Weather Station
    public class WeatherStation : ISubject
    {
        private List<IObserver> _observers = new List<IObserver>();
        private float _temperature;
        
        // Property that notifies observers when changed
        public float Temperature
        {
            get { return _temperature; }
            set
            {
                if (_temperature != value)
                {
                    _temperature = value;
                    Notify();
                }
            }
        }
        
        public void Attach(IObserver observer)
        {
            Console.WriteLine("Subject: Attached an observer");
            _observers.Add(observer);
        }
        
        public void Detach(IObserver observer)
        {
            _observers.Remove(observer);
            Console.WriteLine("Subject: Detached an observer");
        }
        
        public void Notify()
        {
            Console.WriteLine("Subject: Notifying observers...");
            
            foreach (var observer in _observers)
            {
                observer.Update(this);
            }
        }
    }
    
    // Concrete Observer - Temperature Display
    public class TemperatureDisplay : IObserver
    {
        private string _displayName;
        
        public TemperatureDisplay(string displayName)
        {
            _displayName = displayName;
        }
        
        public void Update(ISubject subject)
        {
            if (subject is WeatherStation weatherStation)
            {
                Console.WriteLine($"{_displayName} display: The temperature is now " +
                                 $"{weatherStation.Temperature}°C");
            }
        }
    }
    
    // Concrete Observer - Temperature Alert
    public class TemperatureAlert : IObserver
    {
        private float _threshold;
        
        public TemperatureAlert(float threshold)
        {
            _threshold = threshold;
        }
        
        public void Update(ISubject subject)
        {
            if (subject is WeatherStation weatherStation && 
                weatherStation.Temperature > _threshold)
            {
                Console.WriteLine($"ALERT: Temperature above threshold " +
                                 $"({_threshold}°C)! Current: {weatherStation.Temperature}°C");
            }
        }
    }
    
    // Usage
    public class Program
    {
        public static void Main()
        {
            // Create the subject
            var weatherStation = new WeatherStation();
            
            // Create observers
            var phoneDisplay = new TemperatureDisplay("Phone");
            var windowDisplay = new TemperatureDisplay("Window");
            var alert = new TemperatureAlert(30);
            
            // Register observers
            weatherStation.Attach(phoneDisplay);
            weatherStation.Attach(windowDisplay);
            weatherStation.Attach(alert);
            
            // Simulate temperature changes
            weatherStation.Temperature = 25.5f;
            weatherStation.Temperature = 32.1f;
            
            // Detach an observer
            weatherStation.Detach(windowDisplay);
            
            // One more temperature change
            weatherStation.Temperature = 26.4f;
        }
    }
}`;

const strategyCode = `using System;

namespace DesignPatterns.Behavioral
{
    // Strategy interface
    public interface IPaymentStrategy
    {
        void Pay(decimal amount);
    }
    
    // Concrete Strategies
    public class CreditCardPayment : IPaymentStrategy
    {
        private string _cardNumber;
        private string _name;
        private string _expiryDate;
        private string _cvv;
        
        public CreditCardPayment(string cardNumber, string name, string expiryDate, string cvv)
        {
            _cardNumber = cardNumber;
            _name = name;
            _expiryDate = expiryDate;
            _cvv = cvv;
        }
        
        public void Pay(decimal amount)
        {
            string maskedCard = $"XXXX-XXXX-XXXX-{_cardNumber.Substring(_cardNumber.Length - 4)}";
            Console.WriteLine($"Paid ${amount} using Credit Card: {maskedCard}");
        }
    }
    
    public class PayPalPayment : IPaymentStrategy
    {
        private string _email;
        private string _password;
        
        public PayPalPayment(string email, string password)
        {
            _email = email;
            _password = password;
        }
        
        public void Pay(decimal amount)
        {
            Console.WriteLine($"Paid ${amount} using PayPal account: {_email}");
        }
    }
    
    public class BitcoinPayment : IPaymentStrategy
    {
        private string _address;
        
        public BitcoinPayment(string address)
        {
            _address = address;
        }
        
        public void Pay(decimal amount)
        {
            Console.WriteLine($"Paid ${amount} worth of Bitcoin to address: {_address}");
        }
    }
    
    // Context
    public class ShoppingCart
    {
        private IPaymentStrategy _paymentStrategy;
        private decimal _total;
        
        public void SetPaymentStrategy(IPaymentStrategy paymentStrategy)
        {
            _paymentStrategy = paymentStrategy;
        }
        
        public void AddItem(string item, decimal price)
        {
            _total += price;
            Console.WriteLine($"Added item: {item}, Price: ${price}, Total: ${_total}");
        }
        
        public void Checkout()
        {
            if (_paymentStrategy == null)
            {
                Console.WriteLine("No payment strategy set! Please select a payment method.");
                return;
            }
            
            _paymentStrategy.Pay(_total);
            _total = 0; // Reset cart after payment
        }
    }
    
    // Usage
    public class Program
    {
        public static void Main()
        {
            var cart = new ShoppingCart();
            
            // Add items to cart
            cart.AddItem("MacBook Pro", 1299.99m);
            cart.AddItem("Headphones", 99.99m);
            
            // Pay with credit card
            Console.WriteLine("\\nPaying with Credit Card:");
            cart.SetPaymentStrategy(new CreditCardPayment(
                "1234567890123456", "John Doe", "12/25", "123"));
            cart.Checkout();
            
            // Add more items and pay with PayPal
            cart.AddItem("Smartphone", 699.99m);
            
            Console.WriteLine("\\nPaying with PayPal:");
            cart.SetPaymentStrategy(new PayPalPayment("john.doe@example.com", "password"));
            cart.Checkout();
            
            // Add more items and pay with Bitcoin
            cart.AddItem("Tablet", 499.99m);
            
            Console.WriteLine("\\nPaying with Bitcoin:");
            cart.SetPaymentStrategy(new BitcoinPayment("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"));
            cart.Checkout();
        }
    }
}`;

const commandCode = `using System;
using System.Collections.Generic;

namespace DesignPatterns.Behavioral
{
    // Command interface
    public interface ICommand
    {
        void Execute();
        void Undo();
    }
    
    // Receiver
    public class TextEditor
    {
        private string _text = "";
        
        public string Text
        {
            get { return _text; }
            set { _text = value; }
        }
        
        public void Append(string text)
        {
            Console.WriteLine($"Appending: '{text}'");
            _text += text;
        }
        
        public void Delete(int length)
        {
            if (length <= _text.Length)
            {
                string deleted = _text.Substring(_text.Length - length);
                _text = _text.Remove(_text.Length - length);
                Console.WriteLine($"Deleted: '{deleted}'");
            }
        }
        
        public void Print()
        {
            Console.WriteLine($"Current text: '{_text}'");
        }
    }
    
    // Concrete Command for appending text
    public class AppendTextCommand : ICommand
    {
        private TextEditor _editor;
        private string _textToAppend;
        
        public AppendTextCommand(TextEditor editor, string text)
        {
            _editor = editor;
            _textToAppend = text;
        }
        
        public void Execute()
        {
            _editor.Append(_textToAppend);
        }
        
        public void Undo()
        {
            _editor.Delete(_textToAppend.Length);
        }
    }
    
    // Concrete Command for deleting text
    public class DeleteTextCommand : ICommand
    {
        private TextEditor _editor;
        private int _length;
        private string _deletedText;
        
        public DeleteTextCommand(TextEditor editor, int length)
        {
            _editor = editor;
            _length = length;
        }
        
        public void Execute()
        {
            if (_length <= _editor.Text.Length)
            {
                _deletedText = _editor.Text.Substring(_editor.Text.Length - _length);
                _editor.Delete(_length);
            }
        }
        
        public void Undo()
        {
            if (_deletedText != null)
            {
                _editor.Append(_deletedText);
            }
        }
    }
    
    // Invoker
    public class CommandHistory
    {
        private Stack<ICommand> _history = new Stack<ICommand>();
        
        public void ExecuteCommand(ICommand command)
        {
            command.Execute();
            _history.Push(command);
        }
        
        public void Undo()
        {
            if (_history.Count > 0)
            {
                var command = _history.Pop();
                command.Undo();
            }
            else
            {
                Console.WriteLine("No commands to undo");
            }
        }
    }
    
    // Client
    public class Program
    {
        public static void Main()
        {
            // Receiver
            var editor = new TextEditor();
            
            // Invoker
            var history = new CommandHistory();
            
            // Create and execute commands
            Console.WriteLine("Executing commands:");
            
            var appendHello = new AppendTextCommand(editor, "Hello, ");
            history.ExecuteCommand(appendHello);
            editor.Print();
            
            var appendWorld = new AppendTextCommand(editor, "World!");
            history.ExecuteCommand(appendWorld);
            editor.Print();
            
            var deleteCmd = new DeleteTextCommand(editor, 6);
            history.ExecuteCommand(deleteCmd);
            editor.Print();
            
            // Undo operations
            Console.WriteLine("\\nUndoing commands:");
            
            history.Undo();  // Undo the delete
            editor.Print();
            
            history.Undo();  // Undo the second append
            editor.Print();
            
            history.Undo();  // Undo the first append
            editor.Print();
            
            history.Undo();  // Try to undo when history is empty
        }
    }
}`;

export default function BehavioralPatternsPage() {
  return (
    <LessonLayout 
      title="Behavioral Patterns"
      level="advanced"
      sidebarItems={sidebarItems}
      prev={{ href: '/advanced/patterns/structural', title: 'Structural Patterns' }}
    >
      <div className="prose dark:prose-invert max-w-none">
        <h1>Behavioral Design Patterns in C#</h1>
        
        <p>
          Behavioral design patterns are concerned with algorithms and the assignment of responsibilities between objects.
          These patterns characterize complex control flow that's difficult to follow at run-time, shifting your focus
          away from flow of control to focus on the way objects are interconnected.
        </p>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg my-4">
          <p className="font-semibold">Key Benefits of Behavioral Patterns:</p>
          <ul className="mt-2">
            <li>Encapsulate behavior in separate objects, making it easier to extend and maintain</li>
            <li>Define communication patterns between objects that increase flexibility</li>
            <li>Reduce coupling between components of a system</li>
            <li>Enable complex workflows while keeping individual components simpler</li>
          </ul>
        </div>

        <h2>Observer Pattern</h2>
        
        <p>
          The Observer pattern defines a one-to-many dependency between objects so that when one object changes state,
          all its dependents are notified and updated automatically. It's commonly used in event handling systems.
        </p>

        <CodeEditor 
          initialCode={observerCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
          <p className="font-semibold">When to use the Observer Pattern:</p>
          <ul className="mt-2">
            <li>When a change to one object requires changing others, and you don't know how many objects need to be changed</li>
            <li>When an object should be able to notify other objects without making assumptions about who these objects are</li>
            <li>When loosely coupled system is needed between objects that interact with each other</li>
          </ul>
          <p className="mt-2 text-sm italic">
            <FiInfo className="inline mr-1" /> Real-world examples: Event handling systems, MVC architectures (model notifies views), reactive programming.
          </p>
        </div>

        <h2>Strategy Pattern</h2>
        
        <p>
          The Strategy pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable.
          Strategy lets the algorithm vary independently from clients that use it.
        </p>

        <CodeEditor 
          initialCode={strategyCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
          <p className="font-semibold">When to use the Strategy Pattern:</p>
          <ul className="mt-2">
            <li>When you want to define a class that will have one behavior that is similar to other behaviors in a list</li>
            <li>When you need different variants of an algorithm</li>
            <li>When an algorithm uses data that clients shouldn't know about</li>
            <li>When a class defines many behaviors, and these appear as multiple conditional statements</li>
          </ul>
          <p className="mt-2 text-sm italic">
            <FiInfo className="inline mr-1" /> Common examples: Sorting algorithms, payment processing, validation strategies.
          </p>
        </div>

        <h2>Command Pattern</h2>
        
        <p>
          The Command pattern encapsulates a request as an object, thereby allowing you to parameterize clients with
          different requests, queue or log requests, and support undoable operations.
        </p>

        <CodeEditor 
          initialCode={commandCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
          <p className="font-semibold">When to use the Command Pattern:</p>
          <ul className="mt-2">
            <li>When you need to parameterize objects with operations</li>
            <li>When you need to queue operations, schedule their execution, or execute them remotely</li>
            <li>When you need to support undo/redo functionality</li>
            <li>When you want to structure a system around high-level operations built on primitive operations</li>
          </ul>
          <p className="mt-2 text-sm italic">
            <FiInfo className="inline mr-1" /> Common examples: Text editors, transaction processing, GUI buttons and menu items.
          </p>
        </div>

        <h2>Other Behavioral Patterns</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-700 dark:text-gray-300">Chain of Responsibility</h3>
            <p className="mt-2">
              Passes a request along a chain of handlers. Each handler decides to process the request
              or pass it to the next handler in the chain.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-700 dark:text-gray-300">Template Method</h3>
            <p className="mt-2">
              Defines the skeleton of an algorithm, deferring some steps to subclasses.
              It lets subclasses redefine certain steps without changing the algorithm's structure.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-700 dark:text-gray-300">State</h3>
            <p className="mt-2">
              Allows an object to alter its behavior when its internal state changes.
              The object will appear to change its class.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-700 dark:text-gray-300">Visitor</h3>
            <p className="mt-2">
              Represents an operation to be performed on elements of an object structure.
              Lets you define a new operation without changing the classes of the elements it works on.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-700 dark:text-gray-300">Mediator</h3>
            <p className="mt-2">
              Defines an object that encapsulates how a set of objects interact.
              Promotes loose coupling by preventing objects from referring to each other explicitly.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-700 dark:text-gray-300">Interpreter</h3>
            <p className="mt-2">
              Implements a specialized language and provides an interpreter to evaluate sentences in the language.
              Used for languages with simple grammars.
            </p>
          </div>
        </div>

        <div className="bg-csharp-blue-50 dark:bg-csharp-blue-900/20 p-4 rounded-lg mt-6">
          <h3 className="text-csharp-blue-700 dark:text-csharp-blue-400">Practice Exercise</h3>
          <p>
            Implement a music player application using both the State and Command patterns:
          </p>
          <ul className="mt-2">
            <li>Use the State pattern to model different states of the player (Playing, Paused, Stopped)</li>
            <li>Use the Command pattern to implement Play, Pause, Stop, Next, Previous functionality</li>
            <li>Add a command history to support undo/redo operations</li>
          </ul>
          <p className="mt-2">
            Consider how these patterns help you structure the code in a more maintainable way compared to
            using conditional statements for the various player states and operations.
          </p>
        </div>

        <div className="mt-8">
          <p>
            Congratulations on completing the Design Patterns module! You now have a solid understanding
            of the three main categories of design patterns and how to apply them in C# applications.
            These patterns will help you write more maintainable, flexible, and robust code.
          </p>
        </div>
      </div>
    </LessonLayout>
  );
} 