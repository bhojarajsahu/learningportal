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

const inMemoryCacheCode = `using Microsoft.Extensions.Caching.Memory;
using System;
using System.Threading.Tasks;

public class ProductService
{
    private readonly IMemoryCache _cache;
    private readonly TimeSpan _cacheDuration = TimeSpan.FromMinutes(10);
    
    public ProductService(IMemoryCache cache)
    {
        _cache = cache;
    }
    
    public async Task<Product> GetProductByIdAsync(int id)
    {
        // Create a cache key for this specific product
        string cacheKey = $"product_{id}";
        
        // Try to get the item from cache
        if (_cache.TryGetValue(cacheKey, out Product cachedProduct))
        {
            Console.WriteLine($"Cache hit for product {id}");
            return cachedProduct;
        }
        
        // Cache miss - get from database
        Console.WriteLine($"Cache miss for product {id}");
        Product product = await GetProductFromDatabaseAsync(id);
        
        // Set cache options
        var cacheOptions = new MemoryCacheEntryOptions()
            .SetAbsoluteExpiration(_cacheDuration)
            // Add callbacks to handle eviction events
            .RegisterPostEvictionCallback((key, value, reason, state) => 
            {
                Console.WriteLine($"Product {id} was evicted from cache. Reason: {reason}");
            });
            
        // Store in cache
        _cache.Set(cacheKey, product, cacheOptions);
        
        return product;
    }
    
    // Invalidate cache when product is updated
    public async Task UpdateProductAsync(Product product)
    {
        // Update in database
        await UpdateProductInDatabaseAsync(product);
        
        // Remove from cache
        string cacheKey = $"product_{product.Id}";
        _cache.Remove(cacheKey);
    }
    
    // Simulate database access
    private async Task<Product> GetProductFromDatabaseAsync(int id)
    {
        // Simulate database delay
        await Task.Delay(500);
        
        return new Product { Id = id, Name = $"Product {id}", Price = 9.99m * id };
    }
    
    private async Task UpdateProductInDatabaseAsync(Product product)
    {
        // Simulate database delay
        await Task.Delay(300);
        
        Console.WriteLine($"Product {product.Id} updated in database");
    }
}

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
}`;

const distributedCacheCode = `using Microsoft.Extensions.Caching.Distributed;
using System;
using System.Text.Json;
using System.Threading.Tasks;

public class ProductCatalogService
{
    private readonly IDistributedCache _cache;
    private readonly TimeSpan _cacheDuration = TimeSpan.FromMinutes(30);
    
    public ProductCatalogService(IDistributedCache cache)
    {
        _cache = cache;
    }
    
    public async Task<Product> GetProductByIdAsync(int id)
    {
        string cacheKey = $"product:{id}";
        
        // Try to get serialized product from distributed cache
        byte[] cachedData = await _cache.GetAsync(cacheKey);
        
        if (cachedData != null)
        {
            // Deserialize the cached data back to a Product object
            try
            {
                string cachedJson = System.Text.Encoding.UTF8.GetString(cachedData);
                Product cachedProduct = JsonSerializer.Deserialize<Product>(cachedJson);
                Console.WriteLine($"Distributed cache hit for product {id}");
                return cachedProduct;
            }
            catch (JsonException ex)
            {
                Console.WriteLine($"Error deserializing product from cache: {ex.Message}");
                // Continue to fetch from database if deserialization fails
            }
        }
        
        // Cache miss or deserialization error - get from database
        Console.WriteLine($"Distributed cache miss for product {id}");
        Product product = await GetProductFromDatabaseAsync(id);
        
        try
        {
            // Serialize the product and store in distributed cache
            string productJson = JsonSerializer.Serialize(product);
            byte[] productData = System.Text.Encoding.UTF8.GetBytes(productJson);
            
            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = _cacheDuration,
                SlidingExpiration = TimeSpan.FromMinutes(10)
            };
            
            await _cache.SetAsync(cacheKey, productData, options);
            Console.WriteLine($"Product {id} added to distributed cache");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error caching product: {ex.Message}");
            // Continue even if caching fails
        }
        
        return product;
    }
    
    public async Task UpdateProductAsync(Product product)
    {
        // Update in database
        await UpdateProductInDatabaseAsync(product);
        
        // Remove from cache
        string cacheKey = $"product:{product.Id}";
        await _cache.RemoveAsync(cacheKey);
        Console.WriteLine($"Product {product.Id} removed from distributed cache");
    }
    
    // Example of cache refresh pattern
    public async Task RefreshProductCacheAsync(int id)
    {
        // Get latest from database
        Product product = await GetProductFromDatabaseAsync(id);
        
        // Update the cache with fresh data
        string productJson = JsonSerializer.Serialize(product);
        byte[] productData = System.Text.Encoding.UTF8.GetBytes(productJson);
        
        var options = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = _cacheDuration,
            SlidingExpiration = TimeSpan.FromMinutes(10)
        };
        
        string cacheKey = $"product:{id}";
        await _cache.SetAsync(cacheKey, productData, options);
        Console.WriteLine($"Product {id} refreshed in distributed cache");
    }
    
    // Simulate database access
    private async Task<Product> GetProductFromDatabaseAsync(int id)
    {
        // Simulate database delay
        await Task.Delay(500);
        
        return new Product { Id = id, Name = $"Product {id}", Price = 9.99m * id };
    }
    
    private async Task UpdateProductInDatabaseAsync(Product product)
    {
        // Simulate database delay
        await Task.Delay(300);
        
        Console.WriteLine($"Product {product.Id} updated in database");
    }
}

// Configure Redis as a distributed cache in ASP.NET Core Startup.cs
/*
public void ConfigureServices(IServiceCollection services)
{
    services.AddStackExchangeRedisCache(options =>
    {
        options.Configuration = Configuration.GetConnectionString("Redis");
        options.InstanceName = "SampleInstance:";
    });
    
    // Or use SQL Server cache
    // services.AddDistributedSqlServerCache(options =>
    // {
    //     options.ConnectionString = Configuration.GetConnectionString("SqlCache");
    //     options.SchemaName = "dbo";
    //     options.TableName = "CacheTable";
    // });
    
    // ... other service registrations
}
*/`;

const outputCacheCode = `using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading.Tasks;

// Configure Output Caching in Program.cs
/*
var builder = WebApplication.CreateBuilder(args);

// Add Output Caching services
builder.Services.AddOutputCache(options =>
{
    // Global cache profile with a default duration
    options.DefaultExpirationTimeSpan = TimeSpan.FromMinutes(5);
    
    // Define named policies
    options.AddPolicy("ShortLived", policyBuilder => 
        policyBuilder.Expire(TimeSpan.FromSeconds(30)));
        
    options.AddPolicy("ProductsPolicy", policyBuilder => 
        policyBuilder
            .Tag("products")
            .SetVaryByQuery("category")
            .SetVaryByHeader("Accept")
            .Expire(TimeSpan.FromMinutes(10)));
            
    options.AddPolicy("StaticAssets", policyBuilder => 
        policyBuilder
            .SetVaryByQuery(string.Empty)
            .Expire(TimeSpan.FromDays(1)));
            
    // Custom policy
    options.AddPolicy("ApiCache", policyBuilder => 
        policyBuilder.With(c => 
            c.HttpContext.Request.Path.StartsWithSegments("/api")));
});

var app = builder.Build();

// Enable output caching middleware
app.UseOutputCache();

// ... other app configuration
*/

// Controller example using output caching
/*
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductRepository _repository;
    private readonly IOutputCacheStore _cacheStore;
    
    public ProductsController(
        IProductRepository repository,
        IOutputCacheStore cacheStore)
    {
        _repository = repository;
        _cacheStore = cacheStore;
    }
    
    // Apply output caching with a named policy
    [HttpGet]
    [OutputCache(PolicyName = "ProductsPolicy")]
    public async Task<IActionResult> GetAllProducts([FromQuery] string category = null)
    {
        var products = await _repository.GetProductsAsync(category);
        return Ok(products);
    }
    
    // Apply custom caching settings directly
    [HttpGet("{id}")]
    [OutputCache(Duration = 120, VaryByQueryKeys = new[] { "version" })]
    public async Task<IActionResult> GetProductById(int id, [FromQuery] string version = null)
    {
        var product = await _repository.GetProductByIdAsync(id);
        
        if (product == null)
            return NotFound();
            
        return Ok(product);
    }
    
    // Manually invalidate cache when updating a product
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, ProductUpdateModel model)
    {
        var product = await _repository.GetProductByIdAsync(id);
        
        if (product == null)
            return NotFound();
            
        // Update product
        product.Name = model.Name;
        product.Price = model.Price;
        product.Category = model.Category;
        
        await _repository.UpdateProductAsync(product);
        
        // Invalidate cache for all product endpoints using the "products" tag
        await _cacheStore.EvictByTagAsync("products", default);
        
        return NoContent();
    }
}
*/`;

export default function CachingPage() {
  return (
    <LessonLayout 
      title="Caching Strategies"
      level="advanced"
      sidebarItems={sidebarItems}
      prev={{ href: '/advanced/performance/profiling', title: 'Profiling and Diagnostics' }}
    >
      <div className="prose dark:prose-invert max-w-none">
        <h1>Caching Strategies in C#</h1>
        
        <p>
          Caching is a powerful technique for improving application performance by storing frequently accessed
          data in memory or other fast-access storage. This lesson explores various caching strategies
          in C# and .NET, their implementation, and best practices.
        </p>

        <h2>Why Caching Matters</h2>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
          <h3 className="text-xl font-semibold">Benefits of Effective Caching</h3>
          <ul className="mt-2">
            <li><strong>Reduced latency</strong> - Faster response times by avoiding expensive data fetching operations</li>
            <li><strong>Lower resource utilization</strong> - Reduced database load and computing resources</li>
            <li><strong>Improved scalability</strong> - Handle more concurrent users with the same infrastructure</li>
            <li><strong>Cost savings</strong> - Reduced infrastructure costs by optimizing resource usage</li>
            <li><strong>Enhanced user experience</strong> - More responsive applications lead to better user satisfaction</li>
          </ul>
        </div>

        <h2>In-Memory Caching</h2>
        
        <p>
          The simplest form of caching is in-memory caching, where data is stored in the application's memory.
          .NET Core provides the <code>IMemoryCache</code> interface for implementing in-memory caching.
        </p>

        <CodeEditor 
          initialCode={inMemoryCacheCode}
          language="csharp"
          readOnly={true}
        />

        <h3>In-Memory Cache Considerations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h4 className="text-green-700 dark:text-green-400 font-semibold">Advantages</h4>
            <ul className="mt-2">
              <li>Fast access (in-process memory)</li>
              <li>No serialization overhead</li>
              <li>No network latency</li>
              <li>Easy to implement</li>
              <li>Supports complex object graphs</li>
            </ul>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <h4 className="text-red-700 dark:text-red-400 font-semibold">Limitations</h4>
            <ul className="mt-2">
              <li>Limited to a single application instance</li>
              <li>Cache is lost on application restart</li>
              <li>Increased memory pressure on the application</li>
              <li>Not suitable for distributed applications</li>
              <li>Not shared across multiple servers</li>
            </ul>
          </div>
        </div>

        <h2>Distributed Caching</h2>
        
        <p>
          Distributed caching stores cached data in an external caching system that can be accessed by
          multiple application instances. This approach is ideal for web farms and microservices architectures.
        </p>

        <CodeEditor 
          initialCode={distributedCacheCode}
          language="csharp"
          readOnly={true}
        />

        <h3>Distributed Cache Providers</h3>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-4">
          <h4 className="text-gray-700 dark:text-gray-300 font-semibold">Common Distributed Cache Providers</h4>
          <ul className="mt-2">
            <li><strong>Redis</strong> - High-performance, in-memory data store with persistence and cluster support</li>
            <li><strong>SQL Server</strong> - Uses a SQL Server database table for distributed caching</li>
            <li><strong>NCache</strong> - Enterprise distributed cache for .NET applications</li>
            <li><strong>Memcached</strong> - High-performance, distributed memory object caching system</li>
            <li><strong>Custom Providers</strong> - Implement <code>IDistributedCache</code> for specialized needs</li>
          </ul>
        </div>

        <h3>Distributed Caching Considerations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h4 className="text-green-700 dark:text-green-400 font-semibold">Advantages</h4>
            <ul className="mt-2">
              <li>Shared across multiple application instances</li>
              <li>Survives application restarts</li>
              <li>Centralized cache management</li>
              <li>Scalable with dedicated cache servers</li>
              <li>Supports high availability configurations</li>
            </ul>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <h4 className="text-red-700 dark:text-red-400 font-semibold">Limitations</h4>
            <ul className="mt-2">
              <li>Network latency overhead</li>
              <li>Serialization/deserialization required</li>
              <li>More complex setup and maintenance</li>
              <li>Additional infrastructure costs</li>
              <li>Potential single point of failure</li>
            </ul>
          </div>
        </div>

        <h2>Output Caching</h2>
        
        <p>
          Output caching is a technique for caching the entire response of an HTTP request, including
          headers and content. ASP.NET Core provides output caching middleware for efficient response caching.
        </p>

        <CodeEditor 
          initialCode={outputCacheCode}
          language="csharp"
          readOnly={true}
        />

        <h3>Cache Invalidation Strategies</h3>
        
        <p>
          Effectively managing cache invalidation is crucial for maintaining data consistency while
          optimizing performance.
        </p>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg my-4">
          <h4 className="text-yellow-700 dark:text-yellow-400 font-semibold">Common Cache Invalidation Strategies</h4>
          <ul className="mt-2">
            <li><strong>Time-based expiration</strong> - Items are automatically evicted after a set time</li>
            <li><strong>Explicit invalidation</strong> - Cache items are removed when data changes</li>
            <li><strong>Cache dependencies</strong> - Items are invalidated when their dependencies change</li>
            <li><strong>Event-based invalidation</strong> - Cache is updated in response to application events</li>
            <li><strong>Version or ETag-based</strong> - A version identifier is used to detect stale data</li>
          </ul>
        </div>

        <div className="bg-csharp-blue-50 dark:bg-csharp-blue-900/20 p-4 rounded-lg mt-6">
          <h3 className="text-csharp-blue-700 dark:text-csharp-blue-400">Practice Exercise</h3>
          <p>
            Implement a multi-level caching strategy for a product catalog service:
          </p>
          <ol className="mt-2">
            <li>Create a caching service that combines in-memory and distributed caching</li>
            <li>Implement cache-aside pattern for product data retrieval</li>
            <li>Add intelligent cache invalidation when products are updated</li>
            <li>Implement a background service for proactive cache refreshing of popular products</li>
            <li>Add response caching for product listing API endpoints</li>
            <li>Implement cache metrics to monitor hit rates and performance</li>
          </ol>
          <p className="mt-2">
            This exercise will help you apply multiple caching strategies in a real-world scenario,
            demonstrating how different approaches can be combined for optimal performance.
          </p>
        </div>

        <div className="mt-8">
          <p>
            Effective caching is a critical skill for building high-performance applications. By understanding
            different caching strategies and their appropriate use cases, you can significantly improve your 
            application's performance, scalability, and user experience.
          </p>
        </div>
      </div>
    </LessonLayout>
  );
} 