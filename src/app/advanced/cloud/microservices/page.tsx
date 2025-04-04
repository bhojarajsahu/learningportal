import React from 'react';
import { FiCloud, FiServer, FiDatabase, FiBox, FiLayers } from 'react-icons/fi';
import LessonLayout from '@/components/LessonLayout';
import CodeEditor from '@/components/CodeEditor';

const sidebarItems = [
  {
    title: 'Cloud Development',
    href: '/advanced/cloud',
    icon: <FiCloud className="w-4 h-4" />,
    children: [
      { title: 'Azure Fundamentals', href: '/advanced/cloud/azure-basics' },
      { title: 'Microservices Architecture', href: '/advanced/cloud/microservices' },
      { title: 'Containerization with Docker', href: '/advanced/cloud/docker' },
    ]
  },
];

const microserviceCode = `// ProductService/Controllers/ProductsController.cs
using Microsoft.AspNetCore.Mvc;
using ProductService.Models;
using ProductService.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProductService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _productRepository;
        private readonly IInventoryService _inventoryService;
        
        public ProductsController(IProductRepository productRepository, IInventoryService inventoryService)
        {
            _productRepository = productRepository;
            _inventoryService = inventoryService;
        }
        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            var products = await _productRepository.GetAllProductsAsync();
            return Ok(products);
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(Guid id)
        {
            var product = await _productRepository.GetProductByIdAsync(id);
            
            if (product == null)
            {
                return NotFound();
            }
            
            // Enrich product with inventory information from another microservice
            var inventory = await _inventoryService.GetInventoryForProductAsync(id);
            product.InStock = inventory?.QuantityAvailable > 0;
            product.StockQuantity = inventory?.QuantityAvailable ?? 0;
            
            return Ok(product);
        }
        
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct(Product product)
        {
            if (product == null)
            {
                return BadRequest();
            }
            
            product.Id = Guid.NewGuid();
            product.CreatedDate = DateTime.UtcNow;
            
            await _productRepository.AddProductAsync(product);
            
            // Initialize inventory in the inventory service
            await _inventoryService.InitializeInventoryAsync(product.Id, 0);
            
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(Guid id, Product product)
        {
            if (id != product.Id)
            {
                return BadRequest();
            }
            
            var existingProduct = await _productRepository.GetProductByIdAsync(id);
            
            if (existingProduct == null)
            {
                return NotFound();
            }
            
            product.UpdatedDate = DateTime.UtcNow;
            
            await _productRepository.UpdateProductAsync(product);
            
            return NoContent();
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(Guid id)
        {
            var product = await _productRepository.GetProductByIdAsync(id);
            
            if (product == null)
            {
                return NotFound();
            }
            
            await _productRepository.DeleteProductAsync(id);
            
            // Delete inventory in the inventory service
            await _inventoryService.DeleteInventoryAsync(id);
            
            return NoContent();
        }
    }
}`;

const inventoryServiceCode = `// InventoryService/Program.cs
var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add MongoDB client
builder.Services.Configure<InventoryDatabaseSettings>(
    builder.Configuration.GetSection("InventoryDatabase"));

builder.Services.AddSingleton<IInventoryService, InventoryService>();

builder.Services.AddHealthChecks()
    .AddMongoDb(builder.Configuration["InventoryDatabase:ConnectionString"]);

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.MapHealthChecks("/health");

app.Run();

// InventoryService/Controllers/InventoryController.cs
using InventoryService.Models;
using InventoryService.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InventoryService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryService _inventoryService;

        public InventoryController(IInventoryService inventoryService)
        {
            _inventoryService = inventoryService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Inventory>>> GetAllInventory()
        {
            var inventory = await _inventoryService.GetAllAsync();
            return Ok(inventory);
        }

        [HttpGet("{productId}")]
        public async Task<ActionResult<Inventory>> GetInventory(Guid productId)
        {
            var inventory = await _inventoryService.GetByProductIdAsync(productId);

            if (inventory == null)
            {
                return NotFound();
            }

            return Ok(inventory);
        }

        [HttpPost]
        public async Task<ActionResult<Inventory>> CreateInventory(Inventory inventory)
        {
            if (inventory == null)
            {
                return BadRequest();
            }

            await _inventoryService.CreateAsync(inventory);

            return CreatedAtAction(nameof(GetInventory), new { productId = inventory.ProductId }, inventory);
        }

        [HttpPut("{productId}")]
        public async Task<IActionResult> UpdateInventory(Guid productId, Inventory inventory)
        {
            if (productId != inventory.ProductId)
            {
                return BadRequest();
            }

            var existingInventory = await _inventoryService.GetByProductIdAsync(productId);

            if (existingInventory == null)
            {
                return NotFound();
            }

            await _inventoryService.UpdateAsync(productId, inventory);

            return NoContent();
        }

        [HttpPut("{productId}/adjust/{quantity}")]
        public async Task<IActionResult> AdjustInventory(Guid productId, int quantity)
        {
            var inventory = await _inventoryService.GetByProductIdAsync(productId);

            if (inventory == null)
            {
                return NotFound();
            }

            await _inventoryService.AdjustQuantityAsync(productId, quantity);

            return NoContent();
        }

        [HttpDelete("{productId}")]
        public async Task<IActionResult> DeleteInventory(Guid productId)
        {
            var inventory = await _inventoryService.GetByProductIdAsync(productId);

            if (inventory == null)
            {
                return NotFound();
            }

            await _inventoryService.RemoveAsync(productId);

            return NoContent();
        }
    }
}`;

const apiGatewayCode = `// ApiGateway/Program.cs
var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        policy => policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

builder.Services.AddAuthentication()
    .AddJwtBearer();

builder.Services.AddAuthorization();

var app = builder.Build();

// Configure middleware
app.UseCors("CorsPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapReverseProxy();

app.Run();

// ApiGateway/appsettings.json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ReverseProxy": {
    "Routes": {
      "products-route": {
        "ClusterId": "products-cluster",
        "Match": {
          "Path": "/api/products/{**catch-all}"
        },
        "Transforms": [
          { "PathPattern": "api/products/{**catch-all}" }
        ]
      },
      "inventory-route": {
        "ClusterId": "inventory-cluster",
        "Match": {
          "Path": "/api/inventory/{**catch-all}"
        },
        "Transforms": [
          { "PathPattern": "api/inventory/{**catch-all}" }
        ]
      },
      "orders-route": {
        "ClusterId": "orders-cluster",
        "Match": {
          "Path": "/api/orders/{**catch-all}"
        },
        "Transforms": [
          { "PathPattern": "api/orders/{**catch-all}" }
        ]
      }
    },
    "Clusters": {
      "products-cluster": {
        "Destinations": {
          "products-api": {
            "Address": "https://localhost:5001"
          }
        }
      },
      "inventory-cluster": {
        "Destinations": {
          "inventory-api": {
            "Address": "https://localhost:5002"
          }
        }
      },
      "orders-cluster": {
        "Destinations": {
          "orders-api": {
            "Address": "https://localhost:5003"
          }
        }
      }
    }
  }
}`;

export default function MicroservicesPage() {
  return (
    <LessonLayout 
      title="Microservices Architecture"
      level="advanced"
      sidebarItems={sidebarItems}
      prev={{ href: '/advanced/cloud/azure-basics', title: 'Azure Fundamentals' }}
      next={{ href: '/advanced/cloud/docker', title: 'Containerization with Docker' }}
    >
      <div className="prose dark:prose-invert max-w-none">
        <h1>Microservices Architecture in C#</h1>
        
        <p>
          Microservices architecture is an approach to building applications as a collection of small, 
          independently deployable services, each running in its own process and communicating through 
          lightweight mechanisms. This architectural style has gained significant popularity due to its 
          ability to enable continuous delivery, scalability, and resilience.
        </p>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg my-4">
          <h2 className="text-xl font-semibold">Key Characteristics of Microservices</h2>
          <ul className="mt-2">
            <li><strong>Service Independence</strong> - Each microservice can be developed, deployed, and scaled independently</li>
            <li><strong>Business Domain Focus</strong> - Services are organized around business capabilities</li>
            <li><strong>Decentralized Data Management</strong> - Each service manages its own database</li>
            <li><strong>Design for Failure</strong> - Services must be resilient to failures of other services</li>
            <li><strong>Infrastructure Automation</strong> - CI/CD pipelines are essential for managing multiple services</li>
            <li><strong>API-Based Communication</strong> - Services communicate via well-defined APIs</li>
          </ul>
        </div>

        <h2>Building Microservices in C# and .NET</h2>
        
        <p>
          .NET is well-suited for implementing microservices due to its lightweight, cross-platform capabilities 
          and extensive ecosystem. Here's an example of how to implement a product service microservice 
          using ASP.NET Core.
        </p>

        <CodeEditor 
          initialCode={microserviceCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
          <h3 className="text-blue-700 dark:text-blue-400">Service Communication Patterns</h3>
          <ul className="mt-2">
            <li><strong>Synchronous Communication (HTTP/REST)</strong> - Direct service-to-service calls</li>
            <li><strong>Asynchronous Communication (Message Queues)</strong> - Services communicate via message brokers</li>
            <li><strong>gRPC</strong> - High-performance RPC framework for service-to-service communication</li>
            <li><strong>GraphQL</strong> - Query language for APIs, allowing clients to request exactly what they need</li>
          </ul>
        </div>

        <h2>Implementing Service Boundaries</h2>
        
        <p>
          A critical aspect of microservices is properly defining service boundaries. This is often done using 
          Domain-Driven Design (DDD) to identify bounded contexts. Each bounded context becomes a candidate 
          for a microservice.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-700 dark:text-gray-300">Bounded Context Example: Inventory Service</h3>
            <p className="mt-2">
              The inventory service manages product stock levels, separate from the product catalog details.
              It has its own data store and business rules.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-700 dark:text-gray-300">Database Per Service</h3>
            <p className="mt-2">
              Each service should own its data and expose it only through well-defined APIs.
              This ensures loose coupling but requires careful handling of data consistency.
            </p>
          </div>
        </div>

        <p>
          Here's an example of implementing an inventory service that manages product stock levels:
        </p>

        <CodeEditor 
          initialCode={inventoryServiceCode}
          language="csharp"
          readOnly={true}
        />

        <h2>API Gateway Pattern</h2>
        
        <p>
          An API Gateway serves as the entry point for all client requests, routing them to the appropriate 
          microservices. It can also handle cross-cutting concerns like authentication, logging, and request 
          transformation.
        </p>

        <CodeEditor 
          initialCode={apiGatewayCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-4">
          <h3 className="font-semibold">API Gateway Responsibilities</h3>
          <ul className="mt-2">
            <li><strong>Request Routing</strong> - Directing requests to appropriate services</li>
            <li><strong>Authentication & Authorization</strong> - Centralized security</li>
            <li><strong>Response Aggregation</strong> - Combining responses from multiple services</li>
            <li><strong>Protocol Translation</strong> - Converting between different communication protocols</li>
            <li><strong>Load Balancing</strong> - Distributing traffic across service instances</li>
            <li><strong>Caching</strong> - Improving performance by caching responses</li>
            <li><strong>Rate Limiting</strong> - Protecting services from overload</li>
          </ul>
        </div>

        <h2>Resiliency Patterns</h2>
        
        <p>
          Microservices must be designed to handle failures of other services. Several patterns can help improve 
          resilience in a microservices architecture.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h3 className="text-purple-700 dark:text-purple-400">Circuit Breaker Pattern</h3>
            <p className="mt-2">
              Prevents a service from repeatedly trying to execute an operation that's likely to fail. 
              After a certain number of failures, the circuit "opens" and fails fast without attempting the operation.
            </p>
            <p className="mt-2 text-sm">
              Implementation: Use the Polly library in .NET for sophisticated circuit breaker policies.
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h3 className="text-purple-700 dark:text-purple-400">Retry Pattern</h3>
            <p className="mt-2">
              Automatically retries a failed operation, with exponential backoff to prevent overwhelming the failing service.
            </p>
            <p className="mt-2 text-sm">
              Implementation: Combine with circuit breaker to prevent excessive retries.
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h3 className="text-purple-700 dark:text-purple-400">Bulkhead Pattern</h3>
            <p className="mt-2">
              Isolates elements of an application into pools so that if one fails, the others will continue to function.
            </p>
            <p className="mt-2 text-sm">
              Implementation: Separate thread pools or process boundaries for different services.
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h3 className="text-purple-700 dark:text-purple-400">Fallback Pattern</h3>
            <p className="mt-2">
              Provides an alternative action when an operation fails, like returning cached data or a default response.
            </p>
            <p className="mt-2 text-sm">
              Implementation: Define fallback methods that provide alternatives when primary methods fail.
            </p>
          </div>
        </div>

        <h2>Service Discovery & Configuration</h2>
        
        <p>
          In a microservices architecture, services need to find and communicate with each other dynamically as 
          they scale up, down, or are redeployed.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
          <h3 className="text-blue-700 dark:text-blue-400">Service Discovery Options in .NET</h3>
          <ul className="mt-2">
            <li><strong>Azure Service Fabric</strong> - Microsoft's distributed systems platform with built-in service discovery</li>
            <li><strong>Consul</strong> - Service discovery and configuration tool (HashiCorp)</li>
            <li><strong>Kubernetes Service Discovery</strong> - DNS-based discovery for services in Kubernetes</li>
            <li><strong>Azure App Configuration</strong> - Centralized configuration service with feature flags</li>
            <li><strong>Steeltoe</strong> - .NET libraries for common microservice patterns including service discovery</li>
          </ul>
        </div>

        <h2>Event-Driven Architecture</h2>
        
        <p>
          Event-driven architecture is a common pattern in microservices, allowing for loose coupling and 
          asynchronous communication between services.
        </p>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-4">
          <h3 className="font-semibold">Implementing Event-Driven Architecture</h3>
          <ul className="mt-2">
            <li><strong>Azure Event Grid</strong> - Event routing service for event-driven architectures</li>
            <li><strong>Azure Service Bus</strong> - Message broker with queues and topics</li>
            <li><strong>Azure Event Hubs</strong> - Big data streaming platform and event ingestion service</li>
            <li><strong>RabbitMQ</strong> - Open-source message broker</li>
            <li><strong>Kafka</strong> - Distributed streaming platform for high-throughput event processing</li>
          </ul>
          <p className="mt-2 text-sm">
            Event-driven architecture helps achieve loose coupling but requires careful handling of eventual consistency.
          </p>
        </div>

        <h2>Monitoring and Observability</h2>
        
        <p>
          The distributed nature of microservices makes monitoring and troubleshooting more complex. 
          Distributed tracing, centralized logging, and health monitoring are essential.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h3 className="text-green-700 dark:text-green-400">Distributed Tracing</h3>
            <p className="mt-2">
              Tracking requests as they flow through various microservices to identify performance bottlenecks.
            </p>
            <p className="mt-2 text-sm">
              Tools: Application Insights, Jaeger, Zipkin, OpenTelemetry
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h3 className="text-green-700 dark:text-green-400">Centralized Logging</h3>
            <p className="mt-2">
              Aggregating logs from all services in a central location for analysis.
            </p>
            <p className="mt-2 text-sm">
              Tools: Elasticsearch, Logstash, Kibana (ELK stack), Seq, Azure Log Analytics
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h3 className="text-green-700 dark:text-green-400">Health Monitoring</h3>
            <p className="mt-2">
              Regularly checking service health and dependencies, often using health check endpoints.
            </p>
            <p className="mt-2 text-sm">
              Implementation: ASP.NET Core Health Checks middleware, monitoring dashboards
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h3 className="text-green-700 dark:text-green-400">Metrics Collection</h3>
            <p className="mt-2">
              Gathering performance metrics to understand system behavior over time.
            </p>
            <p className="mt-2 text-sm">
              Tools: Prometheus, Grafana, Application Insights, Custom metrics
            </p>
          </div>
        </div>

        <div className="bg-csharp-blue-50 dark:bg-csharp-blue-900/20 p-4 rounded-lg mt-6">
          <h3 className="text-csharp-blue-700 dark:text-csharp-blue-400">Practice Exercise</h3>
          <p>
            Implement a simplified e-commerce system using microservices architecture:
          </p>
          <ol className="mt-2">
            <li>Create a Product Catalog Service to manage product information</li>
            <li>Implement an Inventory Service to track product availability</li>
            <li>Build an Order Service for processing customer orders</li>
            <li>Set up an API Gateway to route client requests to appropriate services</li>
            <li>Implement event-driven communication for inventory updates when orders are placed</li>
            <li>Add health checks and logging to all services</li>
            <li>Deploy your microservices to Azure App Service or Azure Kubernetes Service</li>
          </ol>
          <p className="mt-2">
            This exercise will help you understand the challenges and benefits of building a microservices-based system.
          </p>
        </div>

        <div className="mt-8">
          <p>
            Microservices architecture provides flexibility, scalability, and resilience, but it also introduces 
            complexity in terms of deployment, monitoring, and data consistency. In the next lesson, we'll explore 
            containerization with Docker, which complements microservices by providing a consistent environment 
            for deployment.
          </p>
        </div>
      </div>
    </LessonLayout>
  );
} 