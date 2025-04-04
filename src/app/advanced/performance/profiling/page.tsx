import React from 'react';
import { FiCpu, FiActivity, FiBarChart } from 'react-icons/fi';
import LessonLayout from '@/components/LessonLayout';
import CodeEditor from '@/components/CodeEditor';

const sidebarItems = [
  {
    title: 'Performance Optimization',
    href: '/advanced/performance',
    icon: <FiCpu className="w-4 h-4" />,
    children: [
      { title: 'Memory Management', href: '/advanced/performance/memory' },
      { title: 'Profiling and Diagnostics', href: '/advanced/performance/profiling' },
      { title: 'Caching Strategies', href: '/advanced/performance/caching' },
    ]
  },
];

const diagnosticsToolsCode = `using System;
using System.Diagnostics;
using System.Threading;

class DiagnosticsDemo
{
    static void Main()
    {
        // Using Stopwatch for timing operations
        Stopwatch stopwatch = new Stopwatch();
        
        Console.WriteLine("Measuring performance with Stopwatch");
        stopwatch.Start();
        
        // Simulate CPU-bound work
        PerformCpuBoundOperation();
        
        stopwatch.Stop();
        Console.WriteLine($"Operation took: {stopwatch.ElapsedMilliseconds}ms");
        
        // Using Performance Counters
        Console.WriteLine("\\nPerformance Counter Demo");
        MonitorPerformanceCounters();
        
        // Event Tracing for Windows (ETW) demo
        Console.WriteLine("\\nETW Event Example");
        EmitEtwEvent();
    }
    
    static void PerformCpuBoundOperation()
    {
        long sum = 0;
        for (int i = 0; i < 10_000_000; i++)
        {
            sum += i;
        }
        Console.WriteLine($"Sum result: {sum}");
    }
    
    static void MonitorPerformanceCounters()
    {
        try
        {
            // Access CPU usage counter
            var cpuCounter = new PerformanceCounter("Processor", "% Processor Time", "_Total");
            
            // Access memory usage counter
            var memCounter = new PerformanceCounter("Memory", "Available MBytes");
            
            // Access .NET GC counter
            var gcCounter = new PerformanceCounter(".NET CLR Memory", "# Gen 2 Collections", Process.GetCurrentProcess().ProcessName);
            
            // Take multiple samples
            for (int i = 0; i < 5; i++)
            {
                Console.WriteLine($"CPU Usage: {cpuCounter.NextValue()}%");
                Console.WriteLine($"Available Memory: {memCounter.NextValue()} MB");
                Console.WriteLine($"Gen 2 Collections: {gcCounter.NextValue()}");
                
                Thread.Sleep(1000); // Wait for a second between samples
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error accessing performance counters: {ex.Message}");
            Console.WriteLine("Note: Performance counters may require administrative privileges");
        }
    }
    
    static void EmitEtwEvent()
    {
        // In real applications, you would use EventSource for ETW events
        Console.WriteLine("In a real application, you would use:");
        Console.WriteLine("1. EventSource class for custom ETW events");
        Console.WriteLine("2. DiagnosticSource for in-process diagnostics");
    }
}`;

const profileApiCode = `using System;
using System.Diagnostics;
using System.Threading;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.DiagnosticAdapter;
using System.Diagnostics.Tracing;

// Example of a custom EventSource for ETW events
[EventSource(Name = "MyCompany-MyApp-Diagnostics")]
public class MyAppEventSource : EventSource
{
    // Singleton instance
    public static readonly MyAppEventSource Log = new MyAppEventSource();
    
    // Define event methods
    [Event(1, Level = EventLevel.Informational)]
    public void RequestStarted(string url) => WriteEvent(1, url);
    
    [Event(2, Level = EventLevel.Informational)]
    public void RequestCompleted(string url, int statusCode, long durationMs) => 
        WriteEvent(2, url, statusCode, durationMs);
    
    [Event(3, Level = EventLevel.Error)]
    public void RequestFailed(string url, string errorMessage) => 
        WriteEvent(3, url, errorMessage);
}

// DiagnosticSource example
public class ApiController
{
    private static readonly DiagnosticSource _diagnosticSource = 
        new DiagnosticListener("MyApp.ApiRequests");
    
    public void ProcessRequest(string url)
    {
        var stopwatch = Stopwatch.StartNew();
        
        try
        {
            // Signal the start of the request
            if (_diagnosticSource.IsEnabled("RequestStart"))
            {
                _diagnosticSource.Write("RequestStart", new { Url = url, Timestamp = DateTime.UtcNow });
            }
            
            // ETW event
            MyAppEventSource.Log.RequestStarted(url);
            
            Console.WriteLine($"Processing request to {url}");
            
            // Simulate work
            Thread.Sleep(100);
            
            // Simulate a database call
            using (var dbActivity = new Activity("Database.Query").Start())
            {
                Console.WriteLine("Executing database query");
                Thread.Sleep(50);
                dbActivity.Stop();
            }
            
            // Signal the end of the request
            if (_diagnosticSource.IsEnabled("RequestEnd"))
            {
                _diagnosticSource.Write("RequestEnd", new 
                { 
                    Url = url, 
                    Duration = stopwatch.ElapsedMilliseconds,
                    StatusCode = 200 
                });
            }
            
            // ETW event
            MyAppEventSource.Log.RequestCompleted(url, 200, stopwatch.ElapsedMilliseconds);
        }
        catch (Exception ex)
        {
            // Signal the error
            if (_diagnosticSource.IsEnabled("RequestError"))
            {
                _diagnosticSource.Write("RequestError", new 
                { 
                    Url = url, 
                    Error = ex 
                });
            }
            
            // ETW event
            MyAppEventSource.Log.RequestFailed(url, ex.Message);
            
            throw;
        }
        finally
        {
            stopwatch.Stop();
        }
    }
}

// Diagnostic Observer example
public class DiagnosticsObserver
{
    public void Subscribe(DiagnosticListener listener)
    {
        // Subscribe to the diagnostic listener
        if (listener.Name == "MyApp.ApiRequests")
        {
            listener.Subscribe(new Observer());
        }
    }
    
    private class Observer : IObserver<KeyValuePair<string, object>>
    {
        public void OnCompleted() { }
        public void OnError(Exception error) { }
        
        public void OnNext(KeyValuePair<string, object> value)
        {
            switch (value.Key)
            {
                case "RequestStart":
                    dynamic data = value.Value;
                    Console.WriteLine($"Diagnostic: Request started: {data.Url} at {data.Timestamp}");
                    break;
                    
                case "RequestEnd":
                    dynamic endData = value.Value;
                    Console.WriteLine($"Diagnostic: Request completed: {endData.Url} with status {endData.StatusCode} in {endData.Duration}ms");
                    break;
                    
                case "RequestError":
                    dynamic errorData = value.Value;
                    Console.WriteLine($"Diagnostic: Request failed: {errorData.Url} with error {errorData.Error.Message}");
                    break;
            }
        }
    }
}

// Main program
class Program
{
    static void Main()
    {
        Console.WriteLine("Diagnostics API Demo");
        Console.WriteLine("-------------------");
        
        // Set up the diagnostic observer
        var observer = new DiagnosticsObserver();
        DiagnosticListener.AllListeners.Subscribe(observer);
        
        // Create and use the controller
        var controller = new ApiController();
        
        // Process some requests
        controller.ProcessRequest("/api/products");
        controller.ProcessRequest("/api/customers");
        
        // Simulate an error
        try
        {
            Console.WriteLine("\\nSimulating an error...");
            throw new InvalidOperationException("Database connection failed");
        }
        catch (Exception ex)
        {
            controller.ProcessRequest("/api/error");
        }
        
        Console.WriteLine("\\nPress any key to exit...");
        Console.ReadKey();
    }
}`;

const appInsightsCode = `// Startup.cs - ASP.NET Core application 
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.ApplicationInsights.DependencyCollector;
using System;

namespace ProfilingDemo
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            // Add Application Insights telemetry
            services.AddApplicationInsightsTelemetry(options =>
            {
                options.ConnectionString = Configuration["ApplicationInsights:ConnectionString"];
                options.EnableAdaptiveSampling = false; // Disable sampling for demo purposes
            });
            
            // Configure Application Insights
            services.Configure<TelemetryConfiguration>((config) =>
            {
                // Enable capturing of SQL dependencies
                var dependencyConfig = config.TelemetryProcessorChainBuilder
                    .Build()
                    .OfType<DependencyTrackingTelemetryModule>()
                    .FirstOrDefault();
                    
                if (dependencyConfig != null)
                {
                    dependencyConfig.EnableSqlCommandTextInstrumentation = true;
                }
                
                // Add custom telemetry initializer
                config.TelemetryInitializers.Add(new CustomTelemetryInitializer());
            });
            
            // Add custom telemetry client for high-performance scenarios
            services.AddSingleton<CustomTelemetryClient>();
            
            // Remaining service configuration
            services.AddControllers();
            services.AddRazorPages();
            // ...
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapRazorPages();
            });
        }
    }
    
    // Custom telemetry initializer to add context to all telemetry
    public class CustomTelemetryInitializer : ITelemetryInitializer
    {
        public void Initialize(Microsoft.ApplicationInsights.Channel.ITelemetry telemetry)
        {
            telemetry.Context.Cloud.RoleName = "WebApp";
            telemetry.Context.Cloud.RoleInstance = Environment.MachineName;
            
            // Add custom properties
            telemetry.Context.GlobalProperties["Environment"] = 
                Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production";
            telemetry.Context.GlobalProperties["DeploymentId"] = 
                Environment.GetEnvironmentVariable("DEPLOYMENT_ID") ?? "Unknown";
        }
    }
    
    // Custom high-performance telemetry client
    public class CustomTelemetryClient
    {
        private readonly Microsoft.ApplicationInsights.TelemetryClient _telemetryClient;
        
        public CustomTelemetryClient(TelemetryConfiguration configuration)
        {
            _telemetryClient = new Microsoft.ApplicationInsights.TelemetryClient(configuration);
        }
        
        public void TrackHighVolumeEvent(string name, double value)
        {
            // For very high volume events, we can use a metric
            // which is more efficient than event telemetry
            _telemetryClient.GetMetric(name).TrackValue(value);
        }
        
        public void TrackPerformanceMetric(string operation, long durationMs, bool success)
        {
            var properties = new Dictionary<string, string>
            {
                ["OperationType"] = operation,
                ["Success"] = success.ToString()
            };
            
            _telemetryClient.TrackMetric(
                $"{operation}.Duration", 
                durationMs, 
                properties);
        }
        
        public IDisposable StartOperation(string operationName)
        {
            // Returns an operation that will automatically be timed
            return _telemetryClient.StartOperation<RequestTelemetry>(operationName);
        }
    }
}

// Example controller using Application Insights
using Microsoft.AspNetCore.Mvc;
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;

namespace ProfilingDemo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly TelemetryClient _telemetryClient;
        private readonly CustomTelemetryClient _customTelemetry;
        
        public ProductsController(
            TelemetryClient telemetryClient,
            CustomTelemetryClient customTelemetry)
        {
            _telemetryClient = telemetryClient;
            _customTelemetry = customTelemetry;
        }
        
        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            // Track a request with custom properties
            var stopwatch = Stopwatch.StartNew();
            
            try
            {
                // Track an event
                _telemetryClient.TrackEvent("ProductsRequested", new Dictionary<string, string>
                {
                    ["UserId"] = User.Identity.IsAuthenticated ? User.Identity.Name : "Anonymous",
                    ["RequestTime"] = DateTime.UtcNow.ToString("o")
                });
                
                // Track a dependency (e.g., database call, external API)
                using (var operation = _telemetryClient.StartOperation<DependencyTelemetry>("Database.GetProducts"))
                {
                    operation.Telemetry.Type = "SQL";
                    operation.Telemetry.Target = "ProductsDatabase";
                    operation.Telemetry.Data = "SELECT * FROM Products";
                    
                    // Simulate database work
                    await Task.Delay(50);
                    
                    // Randomly track some warnings
                    if (new Random().Next(10) < 3)
                    {
                        _telemetryClient.TrackTrace(
                            "Database responded slowly", 
                            SeverityLevel.Warning, 
                            new Dictionary<string, string> { ["ResponseTime"] = "250ms" });
                    }
                    
                    // Mark the operation as successful
                    operation.Telemetry.Success = true;
                }
                
                // Use custom telemetry for high-volume events
                _customTelemetry.TrackHighVolumeEvent("ProductsViews", 1);
                
                var products = new[] 
                { 
                    new { Id = 1, Name = "Product 1", Price = 19.99 },
                    new { Id = 2, Name = "Product 2", Price = 29.99 },
                    new { Id = 3, Name = "Product 3", Price = 39.99 }
                };
                
                return Ok(products);
            }
            catch (Exception ex)
            {
                // Track exceptions
                _telemetryClient.TrackException(ex, new Dictionary<string, string>
                {
                    ["Operation"] = "GetProducts",
                    ["UserId"] = User.Identity.IsAuthenticated ? User.Identity.Name : "Anonymous"
                });
                
                return StatusCode(500, "An error occurred while processing your request.");
            }
            finally
            {
                stopwatch.Stop();
                
                // Track custom performance metric
                _customTelemetry.TrackPerformanceMetric(
                    "GetProducts", 
                    stopwatch.ElapsedMilliseconds, 
                    true);
            }
        }
    }
}`;

export default function ProfilingPage() {
  return (
    <LessonLayout 
      title="Profiling and Diagnostics"
      level="advanced"
      sidebarItems={sidebarItems}
      prev={{ href: '/advanced/performance/memory', title: 'Memory Management' }}
      next={{ href: '/advanced/performance/caching', title: 'Caching Strategies' }}
    >
      <div className="prose dark:prose-invert max-w-none">
        <h1>Profiling and Diagnostics in C#</h1>
        
        <p>
          Effective performance troubleshooting requires the ability to measure, analyze, and diagnose various aspects of
          your application's behavior. This lesson covers the tools and techniques for profiling C# applications and
          diagnosing performance issues.
        </p>

        <h2>Built-in Diagnostics Tools</h2>
        
        <p>
          .NET provides several built-in diagnostic tools that help you understand your application's performance
          characteristics without requiring third-party software.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="text-blue-700 dark:text-blue-400 font-semibold">Stopwatch</h4>
            <p className="mt-2">
              The <code>System.Diagnostics.Stopwatch</code> class provides a high-precision timer for measuring elapsed time.
              It's useful for timing specific operations in your code.
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="text-blue-700 dark:text-blue-400 font-semibold">Performance Counters</h4>
            <p className="mt-2">
              Performance counters provide real-time system metrics for CPU, memory, disk I/O, and .NET-specific information.
              Use the <code>System.Diagnostics.PerformanceCounter</code> class to access them.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="text-blue-700 dark:text-blue-400 font-semibold">Event Tracing for Windows (ETW)</h4>
            <p className="mt-2">
              ETW is a high-performance tracing facility built into Windows. .NET provides the <code>EventSource</code> class
              for emitting ETW events from your applications.
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="text-blue-700 dark:text-blue-400 font-semibold">Activity API</h4>
            <p className="mt-2">
              The <code>System.Diagnostics.Activity</code> class helps track causality and create correlation IDs across
              distributed systems, which is essential for distributed tracing.
            </p>
          </div>
        </div>

        <p>
          Here's an example of using basic diagnostic tools:
        </p>

        <CodeEditor 
          initialCode={diagnosticsToolsCode}
          language="csharp"
          readOnly={true}
        />

        <h2>Advanced Diagnostics APIs</h2>
        
        <p>
          For more complex applications, .NET provides powerful diagnostic APIs that offer fine-grained control
          over instrumentation and telemetry collection.
        </p>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-4">
          <h4 className="text-gray-700 dark:text-gray-300 font-semibold">Key Diagnostics APIs</h4>
          <ul className="mt-2">
            <li><strong>DiagnosticSource/DiagnosticListener</strong> - In-process diagnostics pipeline for libraries and applications</li>
            <li><strong>EventSource</strong> - High-performance event tracing mechanism compatible with ETW</li>
            <li><strong>Activity</strong> - API for tracking logical operations, especially across process/machine boundaries</li>
            <li><strong>EventCounter</strong> - Lightweight alternative to performance counters for collecting metrics</li>
            <li><strong>DiagnosticCounter</strong> - Advanced metrics API with support for gauges, counters, and histograms</li>
          </ul>
        </div>

        <p>
          Here's an example using the Diagnostics API to instrument an API controller:
        </p>

        <CodeEditor 
          initialCode={profileApiCode}
          language="csharp"
          readOnly={true}
        />

        <h2>Profiling with Visual Studio</h2>
        
        <p>
          Visual Studio includes powerful profiling tools that help you analyze your application's CPU usage,
          memory allocation, and other performance characteristics.
        </p>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg my-4">
          <h4 className="text-yellow-700 dark:text-yellow-400 font-semibold">Visual Studio Profiling Tools</h4>
          <ul className="mt-2">
            <li><strong>CPU Usage Tool</strong> - Identifies methods consuming the most CPU time</li>
            <li><strong>Memory Usage Tool</strong> - Tracks memory allocation and identifies memory leaks</li>
            <li><strong>Performance Profiler</strong> - Collects detailed data on CPU, memory, and other resources</li>
            <li><strong>Database Tool</strong> - Analyzes database queries execution time and resource usage</li>
            <li><strong>Network Tool</strong> - Monitors network operations in your application</li>
          </ul>
        </div>

        <h3>Key Profiling Techniques</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h4 className="text-green-700 dark:text-green-400 font-semibold">CPU Profiling</h4>
            <ul className="mt-2">
              <li>Use sampling mode for minimal impact on application performance</li>
              <li>Use instrumentation mode for detailed call graphs and timing information</li>
              <li>Focus on hot paths - methods consuming the most CPU time</li>
              <li>Look for unnecessary computations and optimizable algorithms</li>
              <li>Check for thread contention issues in multi-threaded code</li>
            </ul>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h4 className="text-green-700 dark:text-green-400 font-semibold">Memory Profiling</h4>
            <ul className="mt-2">
              <li>Take memory snapshots at key points in your application's execution</li>
              <li>Analyze object retention and identify memory leaks</li>
              <li>Look for excessive temporary object allocations</li>
              <li>Examine the heap to understand memory fragmentation</li>
              <li>Use allocation tracking to find hotspots in allocation patterns</li>
            </ul>
          </div>
        </div>

        <h2>Application Performance Monitoring (APM)</h2>
        
        <p>
          While local profiling is valuable during development, monitoring production applications requires
          a different approach. Application Performance Monitoring tools provide continuous insights into
          your application's behavior in real-world scenarios.
        </p>

        <h3>Azure Application Insights</h3>
        
        <p>
          Azure Application Insights is a comprehensive APM solution for .NET applications that provides
          insights into performance, usage patterns, and exceptions in production environments.
        </p>

        <CodeEditor 
          initialCode={appInsightsCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
          <h4 className="text-blue-700 dark:text-blue-400 font-semibold">Key Application Insights Features</h4>
          <ul className="mt-2">
            <li><strong>Request Tracking</strong> - Monitors HTTP requests with timing information</li>
            <li><strong>Dependency Tracking</strong> - Tracks database calls, HTTP requests, and other dependencies</li>
            <li><strong>Exception Tracking</strong> - Captures and reports unhandled exceptions</li>
            <li><strong>Custom Events and Metrics</strong> - Allows you to define application-specific telemetry</li>
            <li><strong>Live Metrics Stream</strong> - Provides real-time monitoring of your application</li>
            <li><strong>User Behavior Analytics</strong> - Tracks page views, user sessions, and custom events</li>
            <li><strong>Smart Detection</strong> - Automatically detects unusual patterns and anomalies</li>
          </ul>
        </div>

        <h2>Benchmarking with BenchmarkDotNet</h2>
        
        <p>
          For controlled performance measurement, BenchmarkDotNet is a powerful .NET library that helps you
          transform methods into benchmarks, track their performance, and compare different implementations.
        </p>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-4">
          <h4 className="text-gray-700 dark:text-gray-300 font-semibold">BenchmarkDotNet Features</h4>
          <ul className="mt-2">
            <li>Precise timing with statistical analysis</li>
            <li>Support for multiple runtime versions and JIT compilers</li>
            <li>Memory allocation tracking</li>
            <li>Hardware intrinsics usage analysis</li>
            <li>Parameterized benchmarks for testing different inputs</li>
            <li>Export results to various formats (JSON, XML, CSV, Markdown)</li>
          </ul>
        </div>

        <div className="bg-csharp-blue-50 dark:bg-csharp-blue-900/20 p-4 rounded-lg mt-6">
          <h3 className="text-csharp-blue-700 dark:text-csharp-blue-400">Practice Exercise</h3>
          <p>
            Create a simple web API application and implement comprehensive diagnostics using the techniques from this lesson:
          </p>
          <ol className="mt-2">
            <li>Create an ASP.NET Core Web API project with a few endpoints</li>
            <li>Implement custom telemetry using DiagnosticSource for cross-cutting concerns</li>
            <li>Create an EventSource class to emit ETW events for key operations</li>
            <li>Use the Activity API to track distributed operations</li>
            <li>Set up Application Insights to collect telemetry in development</li>
            <li>Create a simple benchmark for a key algorithm in your application</li>
            <li>Profile the application using Visual Studio's performance tools and identify potential improvements</li>
          </ol>
          <p className="mt-2">
            This exercise will help you apply the profiling and diagnostics techniques covered in this lesson to a real-world scenario.
          </p>
        </div>

        <div className="mt-8">
          <p>
            Profiling and diagnostics are essential skills for building high-performance C# applications.
            By mastering these tools and techniques, you'll be able to identify and address performance issues
            throughout your application's lifecycle, from development to production.
          </p>
        </div>
      </div>
    </LessonLayout>
  );
} 