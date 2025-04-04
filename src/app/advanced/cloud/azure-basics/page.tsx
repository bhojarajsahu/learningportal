import React from 'react';
import { FiCloud, FiServer, FiDatabase, FiHardDrive, FiLayers } from 'react-icons/fi';
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

const azureAppServiceCode = `// Program.cs
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

app.Run();

// WeatherForecastController.cs
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AzureWebApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", 
            "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        [HttpGet]
        public IEnumerable<WeatherForecast> Get()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            })
            .ToArray();
        }
    }

    public class WeatherForecast
    {
        public DateTime Date { get; set; }
        public int TemperatureC { get; set; }
        public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
        public string Summary { get; set; }
    }
}`;

const azureStorageCode = `using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using System;
using System.IO;
using System.Threading.Tasks;

namespace AzureStorageSample
{
    class Program
    {
        // Set your connection string from the Azure Portal
        static string connectionString = "DefaultEndpointsProtocol=https;AccountName=youraccountname;AccountKey=youraccountkey;EndpointSuffix=core.windows.net";
        static string containerName = "samples-container";
        static string blobName = "sample-blob.txt";
        static string downloadPath = "downloaded-sample.txt";
        
        static async Task Main(string[] args)
        {
            Console.WriteLine("Azure Blob Storage sample");

            // Create a BlobServiceClient
            BlobServiceClient blobServiceClient = new BlobServiceClient(connectionString);

            // Create the container
            await CreateContainerAsync(blobServiceClient);
            
            // Get a reference to the container
            BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient(containerName);
            
            // Upload a blob
            await UploadBlobAsync(containerClient);
            
            // List blobs
            await ListBlobsAsync(containerClient);
            
            // Download a blob
            await DownloadBlobAsync(containerClient);
            
            // Delete the container
            Console.WriteLine("\\nPress any key to delete the container and exit");
            Console.ReadKey();
            
            await containerClient.DeleteAsync();
            Console.WriteLine($"Container {containerName} deleted");
        }
        
        static async Task CreateContainerAsync(BlobServiceClient blobServiceClient)
        {
            try
            {
                // Create the container
                BlobContainerClient containerClient = await blobServiceClient.CreateBlobContainerAsync(containerName);
                
                // Make the container public
                await containerClient.SetAccessPolicyAsync(PublicAccessType.Blob);
                
                Console.WriteLine($"Container {containerName} created");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating container: {ex.Message}");
                if (ex.Message.Contains("already exists"))
                {
                    Console.WriteLine("Container already exists, continuing...");
                }
                else
                {
                    throw;
                }
            }
        }
        
        static async Task UploadBlobAsync(BlobContainerClient containerClient)
        {
            // Get a reference to a blob
            BlobClient blobClient = containerClient.GetBlobClient(blobName);
            
            Console.WriteLine($"Uploading to {blobClient.Uri}");
            
            // Upload blob from a string
            string blobContent = "Hello Azure Blob Storage!";
            using MemoryStream ms = new MemoryStream();
            using StreamWriter writer = new StreamWriter(ms);
            writer.Write(blobContent);
            writer.Flush();
            ms.Position = 0;
            
            await blobClient.UploadAsync(ms, true);
            Console.WriteLine("Blob uploaded successfully");
        }
        
        static async Task ListBlobsAsync(BlobContainerClient containerClient)
        {
            Console.WriteLine("\\nListing blobs...");
            
            // List all blobs in the container
            await foreach (BlobItem blobItem in containerClient.GetBlobsAsync())
            {
                Console.WriteLine("\\t" + blobItem.Name);
                Console.WriteLine("\\t\\tSize: " + blobItem.Properties.ContentLength + " bytes");
                Console.WriteLine("\\t\\tLast modified: " + blobItem.Properties.LastModified);
            }
        }
        
        static async Task DownloadBlobAsync(BlobContainerClient containerClient)
        {
            // Get a reference to a blob
            BlobClient blobClient = containerClient.GetBlobClient(blobName);
            
            Console.WriteLine("\\nDownloading blob to " + downloadPath);
            
            // Download the blob's contents and save it to a file
            BlobDownloadInfo download = await blobClient.DownloadAsync();
            
            using FileStream downloadFileStream = File.OpenWrite(downloadPath);
            await download.Content.CopyToAsync(downloadFileStream);
            downloadFileStream.Close();
            
            Console.WriteLine("Blob downloaded successfully");
        }
    }
}`;

const azureCosmosDbCode = `using Microsoft.Azure.Cosmos;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace CosmosDBSample
{
    class Program
    {
        // Azure Cosmos DB connection details
        private static readonly string EndpointUri = "https://your-account.documents.azure.com:443/";
        private static readonly string PrimaryKey = "your-primary-key";
        private static CosmosClient cosmosClient;
        private static Database database;
        private static Container container;

        private static readonly string databaseId = "SampleDatabase";
        private static readonly string containerId = "SampleContainer";

        static async Task Main(string[] args)
        {
            try
            {
                Console.WriteLine("Azure Cosmos DB - .NET Core Sample");
                
                // Initialize the Cosmos client
                cosmosClient = new CosmosClient(EndpointUri, PrimaryKey, new CosmosClientOptions { ApplicationName = "CosmosDBSample" });
                
                // Create a database and container
                await CreateDatabaseAndContainerAsync();
                
                // Create items
                await AddItemsToContainerAsync();
                
                // Query items
                await QueryItemsAsync();
                
                // Get a single item
                await GetItemAsync("1");
                
                // Update an item
                await UpdateItemAsync("1");
                
                // Delete an item
                await DeleteItemAsync("1");
                
                Console.WriteLine("\\nPress any key to exit");
                Console.ReadKey();
            }
            catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
            {
                Console.WriteLine($"Resource Not Found: {ex.Message}");
            }
            catch (CosmosException ex)
            {
                Console.WriteLine($"Cosmos DB Error: {ex.StatusCode} - {ex.Message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
            finally
            {
                // Cleanup resources when done
                cosmosClient?.Dispose();
            }
        }

        private static async Task CreateDatabaseAndContainerAsync()
        {
            // Create a new database
            database = await cosmosClient.CreateDatabaseIfNotExistsAsync(databaseId);
            Console.WriteLine($"Created Database: {database.Id}");

            // Create a new container
            container = await database.CreateContainerIfNotExistsAsync(containerId, "/lastName");
            Console.WriteLine($"Created Container: {container.Id}");
        }

        private static async Task AddItemsToContainerAsync()
        {
            // Create a new item
            Person person = new Person
            {
                Id = "1",
                FirstName = "John",
                LastName = "Doe",
                Email = "john.doe@example.com",
                Age = 35
            };

            try
            {
                // Add the item to the container
                ItemResponse<Person> response = await container.CreateItemAsync(person, new PartitionKey(person.LastName));
                Console.WriteLine($"Created item: {person.Id} - Request Units: {response.RequestCharge}");
                
                // Add another item
                Person person2 = new Person
                {
                    Id = "2",
                    FirstName = "Jane",
                    LastName = "Smith",
                    Email = "jane.smith@example.com",
                    Age = 28
                };
                
                response = await container.CreateItemAsync(person2, new PartitionKey(person2.LastName));
                Console.WriteLine($"Created item: {person2.Id} - Request Units: {response.RequestCharge}");
            }
            catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.Conflict)
            {
                Console.WriteLine($"Item with id {person.Id} already exists");
            }
        }

        private static async Task QueryItemsAsync()
        {
            Console.WriteLine("\\nQuerying items:");
            
            // Query for all persons
            var sqlQueryText = "SELECT * FROM c";
            QueryDefinition queryDefinition = new QueryDefinition(sqlQueryText);
            
            using FeedIterator<Person> queryResultSetIterator = container.GetItemQueryIterator<Person>(queryDefinition);
            
            List<Person> people = new List<Person>();
            
            while (queryResultSetIterator.HasMoreResults)
            {
                FeedResponse<Person> currentResultSet = await queryResultSetIterator.ReadNextAsync();
                foreach (Person person in currentResultSet)
                {
                    people.Add(person);
                    Console.WriteLine($"Person: {person.FirstName} {person.LastName}, Age: {person.Age}");
                }
            }
            
            // Query with a filter
            Console.WriteLine("\\nQuerying for person with age > 30:");
            
            sqlQueryText = "SELECT * FROM c WHERE c.age > 30";
            queryDefinition = new QueryDefinition(sqlQueryText);
            
            using FeedIterator<Person> filteredQueryIterator = container.GetItemQueryIterator<Person>(queryDefinition);
            
            while (filteredQueryIterator.HasMoreResults)
            {
                FeedResponse<Person> currentResultSet = await filteredQueryIterator.ReadNextAsync();
                foreach (Person person in currentResultSet)
                {
                    Console.WriteLine($"Person: {person.FirstName} {person.LastName}, Age: {person.Age}");
                }
            }
        }

        private static async Task GetItemAsync(string id)
        {
            Console.WriteLine($"\\nGetting item with id: {id}");
            
            ItemResponse<Person> response = await container.ReadItemAsync<Person>(id, new PartitionKey("Doe"));
            Console.WriteLine($"Retrieved {response.Resource.FirstName} {response.Resource.LastName} - Request Units: {response.RequestCharge}");
        }

        private static async Task UpdateItemAsync(string id)
        {
            Console.WriteLine($"\\nUpdating item with id: {id}");
            
            ItemResponse<Person> response = await container.ReadItemAsync<Person>(id, new PartitionKey("Doe"));
            Person person = response.Resource;
            
            // Update the age
            person.Age = 36;
            
            // Update the item in the container
            response = await container.ReplaceItemAsync(person, id, new PartitionKey(person.LastName));
            Console.WriteLine($"Updated {person.FirstName}'s age to {person.Age} - Request Units: {response.RequestCharge}");
        }

        private static async Task DeleteItemAsync(string id)
        {
            Console.WriteLine($"\\nDeleting item with id: {id}");
            
            ItemResponse<Person> response = await container.DeleteItemAsync<Person>(id, new PartitionKey("Doe"));
            Console.WriteLine($"Deleted item id: {id} - Request Units: {response.RequestCharge}");
        }
    }

    public class Person
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public int Age { get; set; }
    }
}`;

export default function AzureFundamentalsPage() {
  return (
    <LessonLayout 
      title="Azure Fundamentals"
      level="advanced"
      sidebarItems={sidebarItems}
      next={{ href: '/advanced/cloud/microservices', title: 'Microservices Architecture' }}
    >
      <div className="prose dark:prose-invert max-w-none">
        <h1>Azure Fundamentals for C# Developers</h1>
        
        <p>
          Microsoft Azure is a comprehensive cloud computing platform that offers a wide range of services
          for building, deploying, and managing applications. As a C# developer, you'll find Azure's
          tight integration with .NET and Visual Studio particularly beneficial.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
          <h2 className="text-xl font-semibold">Key Azure Services for C# Developers</h2>
          <ul className="mt-2">
            <li><strong>App Service</strong> - Host web applications, REST APIs, and mobile backends</li>
            <li><strong>Azure Functions</strong> - Serverless compute service for event-driven applications</li>
            <li><strong>Azure Storage</strong> - Scalable storage for blobs, files, queues, and NoSQL data</li>
            <li><strong>Azure SQL Database</strong> - Managed relational database service</li>
            <li><strong>Cosmos DB</strong> - Globally distributed, multi-model database service</li>
            <li><strong>Azure Key Vault</strong> - Secure storage for keys, secrets, and certificates</li>
            <li><strong>Azure Service Bus</strong> - Reliable message queuing and publish-subscribe messaging</li>
          </ul>
        </div>

        <h2>Getting Started with Azure</h2>
        
        <p>
          Before you can start using Azure services, you need to create an Azure account and set up your development environment.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-700 dark:text-gray-300">Setting Up Your Azure Account</h3>
            <ol className="mt-2 space-y-2">
              <li>1. Create a <a href="https://azure.microsoft.com/free/" className="text-blue-600 dark:text-blue-400">free Azure account</a></li>
              <li>2. Install <a href="https://learn.microsoft.com/cli/azure/install-azure-cli" className="text-blue-600 dark:text-blue-400">Azure CLI</a></li>
              <li>3. Install the <a href="https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions" className="text-blue-600 dark:text-blue-400">Azure Extensions</a> for Visual Studio or VS Code</li>
            </ol>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-700 dark:text-gray-300">Authentication and Access</h3>
            <ul className="mt-2 space-y-2">
              <li><strong>Azure Active Directory</strong> - Identity and access management</li>
              <li><strong>Service Principals</strong> - App identities for authentication</li>
              <li><strong>Managed Identities</strong> - Secure identity for Azure resources</li>
              <li><strong>Connection Strings</strong> - Connect to databases and storage</li>
            </ul>
          </div>
        </div>

        <h2>Web Hosting with Azure App Service</h2>
        
        <p>
          Azure App Service is a fully managed platform for building, deploying, and scaling web applications.
          It supports multiple programming languages including .NET, Java, Node.js, Python, and PHP.
        </p>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg my-4">
          <h3 className="text-green-700 dark:text-green-400">Creating an ASP.NET Core Web App for Azure</h3>
          <p className="mt-2">
            Here's a basic ASP.NET Core Web API that you can deploy to Azure App Service:
          </p>
        </div>

        <CodeEditor 
          initialCode={azureAppServiceCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-4">
          <h3 className="font-semibold">Deploying to Azure App Service</h3>
          <ol className="mt-2 space-y-1">
            <li>1. Right-click your project in Visual Studio and select <strong>Publish</strong></li>
            <li>2. Select <strong>Azure</strong> as the target</li>
            <li>3. Choose <strong>Azure App Service</strong> (Windows or Linux)</li>
            <li>4. Create a new App Service or select an existing one</li>
            <li>5. Configure deployment settings and click <strong>Publish</strong></li>
          </ol>
          <p className="mt-2 text-sm">
            Alternatively, you can use continuous deployment from GitHub, Azure DevOps, or other source control systems.
          </p>
        </div>

        <h2>Working with Azure Storage</h2>
        
        <p>
          Azure Storage provides cloud storage solutions for modern applications. It offers several types of storage:
          Blob Storage, File Storage, Queue Storage, and Table Storage.
        </p>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg my-4">
          <h3 className="text-green-700 dark:text-green-400">Azure Blob Storage in C#</h3>
          <p className="mt-2">
            Here's how to use Azure Storage Blob SDK to upload, download, and list blobs:
          </p>
        </div>

        <CodeEditor 
          initialCode={azureStorageCode}
          language="csharp"
          readOnly={true}
        />

        <div className="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 my-4">
          <p className="text-sm">
            <strong>Note:</strong> Never hardcode connection strings in your code. Use configuration files,
            environment variables, Azure Key Vault, or managed identities to securely store and access connection strings.
          </p>
        </div>

        <h2>NoSQL with Azure Cosmos DB</h2>
        
        <p>
          Azure Cosmos DB is a globally distributed, multi-model database service designed for low latency and elastic scalability.
          It supports multiple APIs including SQL, MongoDB, Cassandra, Gremlin, and Table.
        </p>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg my-4">
          <h3 className="text-green-700 dark:text-green-400">Using Cosmos DB in C#</h3>
          <p className="mt-2">
            The following code demonstrates basic CRUD operations with Cosmos DB SQL API:
          </p>
        </div>

        <CodeEditor 
          initialCode={azureCosmosDbCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
          <h3 className="text-blue-700 dark:text-blue-400">When to Use Cosmos DB</h3>
          <ul className="mt-2">
            <li>Global distribution for low-latency access worldwide</li>
            <li>Multi-model support for different data models</li>
            <li>Elastic scaling for variable workloads</li>
            <li>High availability (99.999%) with multi-region writes</li>
            <li>Schema-less design for flexible data structures</li>
          </ul>
        </div>

        <h2>Serverless with Azure Functions</h2>
        
        <p>
          Azure Functions is a serverless compute service that enables you to run event-triggered code
          without provisioning or managing infrastructure.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-700 dark:text-gray-300">Common Triggers</h3>
            <ul className="mt-2">
              <li><strong>HTTP</strong> - Respond to HTTP requests</li>
              <li><strong>Timer</strong> - Run on a schedule</li>
              <li><strong>Blob</strong> - Process new or updated blobs</li>
              <li><strong>Queue</strong> - Process queue messages</li>
              <li><strong>Cosmos DB</strong> - React to changes in Cosmos DB</li>
              <li><strong>Event Hub</strong> - Process event hub events</li>
            </ul>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-700 dark:text-gray-300">Benefits of Azure Functions</h3>
            <ul className="mt-2">
              <li>Pay only for the time your code runs</li>
              <li>Automatic scaling based on load</li>
              <li>No infrastructure management</li>
              <li>Integrated with other Azure services</li>
              <li>Local development and debugging support</li>
            </ul>
          </div>
        </div>

        <div className="bg-csharp-blue-50 dark:bg-csharp-blue-900/20 p-4 rounded-lg mt-6">
          <h3 className="text-csharp-blue-700 dark:text-csharp-blue-400">Practice Exercise</h3>
          <p>
            Create a simple image processing application using Azure services:
          </p>
          <ol className="mt-2">
            <li>Create an Azure Storage account for storing images</li>
            <li>Create an Azure Function triggered by blob uploads</li>
            <li>When an image is uploaded, resize it and save the thumbnail to another container</li>
            <li>Store metadata about the image (filename, size, thumbnail URL) in Cosmos DB</li>
            <li>Create a simple web app to list and display the images</li>
          </ol>
          <p className="mt-2">
            This exercise will help you understand how different Azure services can work together
            to build a complete solution.
          </p>
        </div>

        <h2>Azure DevOps and CI/CD</h2>
        
        <p>
          Azure DevOps provides developer services for teams to plan work, collaborate on code development,
          and build and deploy applications.
        </p>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-4">
          <h3 className="font-semibold">Setting Up CI/CD for .NET Applications</h3>
          <ol className="mt-2">
            <li>Create an Azure DevOps organization and project</li>
            <li>Push your code to Azure Repos or connect to GitHub</li>
            <li>Create a build pipeline to compile, test, and package your application</li>
            <li>Create a release pipeline to deploy to different environments (Dev, QA, Production)</li>
            <li>Configure approval workflows and gates for promoting releases</li>
          </ol>
        </div>

        <div className="mt-8">
          <p>
            This lesson has covered the fundamentals of using Azure with C#. In the next lesson, we'll
            explore how to build microservices architecture using Azure services.
          </p>
        </div>
      </div>
    </LessonLayout>
  );
} 