import React from 'react';
import { FiShield, FiLock, FiKey, FiAlertTriangle } from 'react-icons/fi';
import LessonLayout from '@/components/LessonLayout';
import CodeEditor from '@/components/CodeEditor';

const sidebarItems = [
  {
    title: 'Security',
    href: '/advanced/security',
    icon: <FiShield className="w-4 h-4" />,
    children: [
      { title: 'Authentication & Authorization', href: '/advanced/security/authentication' },
      { title: 'Common Vulnerabilities', href: '/advanced/security/vulnerabilities' },
      { title: 'Data Protection', href: '/advanced/security/data-protection' }
    ]
  },
];

const symmetricEncryptionCode = `using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace Security.DataProtection
{
    public class SymmetricEncryptionExample
    {
        // AES encryption using .NET Core's modern cryptography APIs
        public static (byte[] ciphertext, byte[] key, byte[] iv) EncryptData(string plainText)
        {
            // Create a new AES instance with secure defaults
            using Aes aes = Aes.Create();
            // Key and IV are automatically generated with secure random values
            
            // Convert the plaintext into bytes
            byte[] plainBytes = Encoding.UTF8.GetBytes(plainText);
            
            // Perform the encryption
            using MemoryStream ms = new MemoryStream();
            using CryptoStream cs = new CryptoStream(
                ms, 
                aes.CreateEncryptor(), 
                CryptoStreamMode.Write);
            
            cs.Write(plainBytes, 0, plainBytes.Length);
            cs.FlushFinalBlock();
            
            // Return the encrypted data and the key/IV for decryption
            return (ms.ToArray(), aes.Key, aes.IV);
        }
        
        public static string DecryptData(byte[] cipherText, byte[] key, byte[] iv)
        {
            using Aes aes = Aes.Create();
            // Use the same key and IV that were used for encryption
            aes.Key = key;
            aes.IV = iv;
            
            using MemoryStream ms = new MemoryStream();
            using CryptoStream cs = new CryptoStream(
                ms, 
                aes.CreateDecryptor(), 
                CryptoStreamMode.Write);
            
            cs.Write(cipherText, 0, cipherText.Length);
            cs.FlushFinalBlock();
            
            // Convert the decrypted bytes back to string
            return Encoding.UTF8.GetString(ms.ToArray());
        }
        
        // Example of how to use the encryption and decryption methods
        public static void DemoEncryption()
        {
            string sensitiveData = "This is confidential information!";
            Console.WriteLine($"Original data: {sensitiveData}");
            
            // Encrypt the data
            var (encrypted, key, iv) = EncryptData(sensitiveData);
            Console.WriteLine($"Encrypted data (base64): {Convert.ToBase64String(encrypted)}");
            
            // Decrypt the data
            string decrypted = DecryptData(encrypted, key, iv);
            Console.WriteLine($"Decrypted data: {decrypted}");
            
            // IMPORTANT: In a real application, you need to securely store the key and IV!
        }
    }
}`;

const hashingCode = `using System;
using System.Security.Cryptography;
using System.Text;

namespace Security.DataProtection
{
    public class PasswordHashingExample
    {
        // Modern password hashing using PBKDF2 with a random salt
        public static (string hashedPassword, byte[] salt) HashPassword(string password)
        {
            // Generate a random salt
            byte[] salt = RandomNumberGenerator.GetBytes(16);
            
            // Hash the password with the salt using PBKDF2
            byte[] hash = Rfc2898DeriveBytes.Pbkdf2(
                Encoding.UTF8.GetBytes(password),
                salt,
                iterations: 350000, // High iteration count for security
                HashAlgorithmName.SHA512,
                outputLength: 32);
            
            // Return the hash and salt as a Base64 string and byte array
            return (Convert.ToBase64String(hash), salt);
        }
        
        // Verify a password against a stored hash and salt
        public static bool VerifyPassword(string providedPassword, string storedHash, byte[] storedSalt)
        {
            // Hash the provided password with the same salt and parameters
            byte[] providedHash = Rfc2898DeriveBytes.Pbkdf2(
                Encoding.UTF8.GetBytes(providedPassword),
                storedSalt,
                iterations: 350000,
                HashAlgorithmName.SHA512,
                outputLength: 32);
            
            // Convert the stored hash from Base64 to bytes
            byte[] originalHash = Convert.FromBase64String(storedHash);
            
            // Compare the computed hash with the stored hash (constant-time comparison)
            return CryptographicOperations.FixedTimeEquals(providedHash, originalHash);
        }
        
        // Example of how to use the password hashing methods
        public static void DemoPasswordHashing()
        {
            string password = "MySecurePassword123!";
            
            // Hash the password
            var (hashedPassword, salt) = HashPassword(password);
            Console.WriteLine($"Hashed password: {hashedPassword}");
            Console.WriteLine($"Salt (base64): {Convert.ToBase64String(salt)}");
            
            // Simulate a login attempt with the correct password
            bool isCorrectPassword = VerifyPassword(password, hashedPassword, salt);
            Console.WriteLine($"Correct password verification: {isCorrectPassword}");
            
            // Simulate a login attempt with an incorrect password
            bool isIncorrectPassword = VerifyPassword("WrongPassword!", hashedPassword, salt);
            Console.WriteLine($"Incorrect password verification: {isIncorrectPassword}");
        }
    }
}`;

const dataProtectionApiCode = `using System;
using System.IO;
using System.Text;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.Extensions.DependencyInjection;

namespace Security.DataProtection
{
    public class AspNetCoreDataProtectionExample
    {
        // Setting up the Data Protection API in an ASP.NET Core application
        // This would typically be in Program.cs or Startup.cs
        public static void ConfigureDataProtection(IServiceCollection services)
        {
            services.AddDataProtection()
                // Set a unique application name to isolate keys from other apps
                .SetApplicationName("MySecureApplication")
                // Persist keys to a specific directory
                .PersistKeysToFileSystem(new DirectoryInfo(@"C:\Keys"))
                // Automatically encrypt the keys at rest
                .ProtectKeysWithCertificate("thumbprint-of-certificate")
                // Set default key lifetime
                .SetDefaultKeyLifetime(TimeSpan.FromDays(90));
        }
        
        // Example of protecting and unprotecting data
        public static void ProtectUnprotectExample(IDataProtectionProvider provider)
        {
            // Create a protector with a specific purpose string
            var protector = provider.CreateProtector("MyApp.SensitiveData");
            
            // Protect some data
            string sensitiveData = "User's credit card: 4111-1111-1111-1111";
            string protectedData = protector.Protect(sensitiveData);
            Console.WriteLine($"Protected data: {protectedData}");
            
            // Unprotect the data
            string unprotectedData = protector.Unprotect(protectedData);
            Console.WriteLine($"Unprotected data: {unprotectedData}");
        }
        
        // Example of using purpose chains for more granular protection
        public static void PurposeChainsExample(IDataProtectionProvider provider)
        {
            // Create a protector with a purpose chain
            var userDataProtector = provider.CreateProtector("MyApp.UserData");
            
            // For a specific user (further isolating the protection key)
            var userSpecificProtector = userDataProtector.CreateProtector("User123");
            
            // Protect some user-specific data
            string userPreferences = "Theme: Dark, Language: English";
            string protectedPreferences = userSpecificProtector.Protect(userPreferences);
            
            // Only this specific protector can unprotect this data
            string unprotectedPreferences = userSpecificProtector.Unprotect(protectedPreferences);
        }
        
        // Example of time-limited data protection
        public static void TimeLimitedProtectionExample(IDataProtectionProvider provider)
        {
            // Create a regular protector
            var protector = provider.CreateProtector("MyApp.TemporaryData");
            
            // Convert it to a time-limited protector
            var timeLimitedProtector = protector.ToTimeLimitedDataProtector();
            
            // Protect data with a 1-hour expiration
            string temporaryAccessCode = "ACCESS-123456";
            string protectedCode = timeLimitedProtector.Protect(
                temporaryAccessCode, 
                lifetime: TimeSpan.FromHours(1));
            
            try
            {
                // If within the time limit, this will work
                string unprotectedCode = timeLimitedProtector.Unprotect(protectedCode);
                Console.WriteLine($"Code is still valid: {unprotectedCode}");
            }
            catch (Exception ex)
            {
                // This will be thrown if the protected data has expired
                Console.WriteLine($"Code has expired: {ex.Message}");
            }
        }
    }
}`;

const secureStorageCode = `using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace Security.DataProtection
{
    public class SecureStorageExample
    {
        // Setting up User Secrets in development (Program.cs)
        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((hostingContext, config) =>
                {
                    // Add user secrets when in Development environment
                    if (hostingContext.HostingEnvironment.IsDevelopment())
                    {
                        config.AddUserSecrets<Program>();
                    }
                })
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
        
        // Using Azure Key Vault for secret storage in production
        public static void ConfigureKeyVault(IConfigurationBuilder config)
        {
            // Add Azure Key Vault to the configuration
            config.AddAzureKeyVault(
                new Uri("https://myvault.vault.azure.net/"),
                new DefaultAzureCredential());
        }
        
        // Retrieving secrets from Azure Key Vault
        public static async Task AccessKeyVaultSecret()
        {
            // Create a SecretClient using the DefaultAzureCredential
            var client = new SecretClient(
                new Uri("https://myvault.vault.azure.net/"),
                new DefaultAzureCredential());
            
            // Get a secret from Key Vault
            KeyVaultSecret secret = await client.GetSecretAsync("DatabaseConnectionString");
            Console.WriteLine($"Secret Value: {secret.Value}");
        }
        
        // Example of using Azure Managed Identities with Key Vault
        public static async Task AccessWithManagedIdentity()
        {
            // When running in Azure with Managed Identity configured,
            // DefaultAzureCredential will use the Managed Identity
            var client = new SecretClient(
                new Uri("https://myvault.vault.azure.net/"),
                new DefaultAzureCredential());
            
            // Access secrets using the application's Managed Identity
            KeyVaultSecret secret = await client.GetSecretAsync("ApiKey");
            Console.WriteLine($"API Key: {secret.Value}");
        }
        
        // Reading configuration in the application
        public static void UseConfiguration(IConfiguration configuration)
        {
            // Get secrets from configuration (abstracted from the actual source)
            string connectionString = configuration["ConnectionStrings:DefaultConnection"];
            string apiKey = configuration["ApiKeys:ExternalService"];
            
            // Use the secrets for application functionality
            Console.WriteLine($"Connection String: {connectionString}");
            Console.WriteLine($"API Key: {apiKey}");
        }
    }
}`;

export default function DataProtectionPage() {
  return (
    <LessonLayout 
      title="Data Protection"
      level="advanced"
      sidebarItems={sidebarItems}
      prev={{ href: '/advanced/security/vulnerabilities', title: 'Common Vulnerabilities' }}
    >
      <div className="prose dark:prose-invert max-w-none">
        <h1>Data Protection in C#</h1>
        
        <p>
          Data protection is a critical aspect of application security that involves safeguarding sensitive information
          from unauthorized access, both at rest and in transit. This lesson covers techniques and best practices
          for protecting data in your C# applications.
        </p>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg my-4">
          <h3 className="text-xl font-semibold">Key Data Protection Concepts</h3>
          <ul className="mt-2">
            <li><strong>Encryption</strong> - Transforming data into an unreadable format that requires a key to decrypt</li>
            <li><strong>Hashing</strong> - Creating a fixed-length value that represents data but cannot be reversed</li>
            <li><strong>Key Management</strong> - Securely storing and managing encryption keys</li>
            <li><strong>Secure Storage</strong> - Protecting sensitive configuration values like connection strings and API keys</li>
            <li><strong>Transport Security</strong> - Protecting data as it moves between systems</li>
          </ul>
        </div>

        <h2>Encryption in C#</h2>
        
        <p>
          Encryption is the process of converting data into a secure format that cannot be easily understood without
          the proper decryption key. .NET provides robust cryptographic APIs for implementing encryption.
        </p>

        <CodeEditor 
          initialCode={symmetricEncryptionCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg my-4">
          <h4 className="text-yellow-700 dark:text-yellow-400 font-semibold">Encryption Best Practices</h4>
          <ul className="mt-2">
            <li><strong>Use modern algorithms</strong> - Prefer AES-256 for symmetric encryption and RSA-2048 or better for asymmetric encryption</li>
            <li><strong>Secure key management</strong> - Encryption is only as secure as your key management</li>
            <li><strong>Use random initialization vectors (IVs)</strong> - Never reuse IVs with the same key</li>
            <li><strong>Implement authenticated encryption</strong> - Use modes like AES-GCM that provide both confidentiality and authenticity</li>
            <li><strong>Don't implement custom encryption</strong> - Use established libraries and APIs</li>
          </ul>
        </div>

        <h2>Password Hashing and Storage</h2>
        
        <p>
          Passwords should never be stored in plaintext or encrypted form. Instead, they should be hashed using
          a strong algorithm with a salt to protect against various attacks.
        </p>

        <CodeEditor 
          initialCode={hashingCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
          <h4 className="text-blue-700 dark:text-blue-400 font-semibold">Password Storage Guidelines</h4>
          <ul className="mt-2">
            <li><strong>Use modern hashing algorithms</strong> - PBKDF2, Argon2, or BCrypt are recommended</li>
            <li><strong>Include a unique salt for each password</strong> - Prevents rainbow table attacks</li>
            <li><strong>Use high iteration counts</strong> - Makes brute-force attacks computationally expensive</li>
            <li><strong>Use constant-time comparison</strong> - Prevents timing attacks when verifying passwords</li>
            <li><strong>Consider using Identity framework</strong> - ASP.NET Core Identity handles password hashing properly</li>
          </ul>
        </div>

        <h2>ASP.NET Core Data Protection API</h2>
        
        <p>
          The ASP.NET Core Data Protection API provides a simple, easy-to-use cryptographic API for protecting data,
          with built-in key management and rotation.
        </p>

        <CodeEditor 
          initialCode={dataProtectionApiCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg my-4">
          <h4 className="text-green-700 dark:text-green-400 font-semibold">When to Use Data Protection API</h4>
          <ul className="mt-2">
            <li><strong>Protecting cookies and tokens</strong> - Secure authentication cookies, CSRF tokens, etc.</li>
            <li><strong>Encrypting form data</strong> - Protect sensitive form fields</li>
            <li><strong>Protecting cached data</strong> - Secure sensitive data stored in a distributed cache</li>
            <li><strong>Encrypting query string parameters</strong> - Protect sensitive data in URLs</li>
            <li><strong>Temporary data protection</strong> - Time-limited protection for temporary tokens</li>
          </ul>
        </div>

        <h2>Secure Storage of Application Secrets</h2>
        
        <p>
          Application secrets like connection strings, API keys, and other sensitive configuration values
          should never be stored in source code or configuration files. .NET provides several options for
          secure secret storage.
        </p>

        <CodeEditor 
          initialCode={secureStorageCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
          <h4 className="text-blue-700 dark:text-blue-400 font-semibold">Secret Management Options</h4>
          <ul className="mt-2">
            <li><strong>User Secrets</strong> - For local development environments</li>
            <li><strong>Environment Variables</strong> - Simple option for development and testing</li>
            <li><strong>Azure Key Vault</strong> - Managed service for secrets in production</li>
            <li><strong>Managed Identities</strong> - Secure access to Azure services without storing credentials</li>
            <li><strong>Kubernetes Secrets</strong> - For applications running in Kubernetes</li>
            <li><strong>Hashicorp Vault</strong> - Third-party secret management solution</li>
          </ul>
        </div>

        <h2>Transport Layer Security (TLS)</h2>
        
        <p>
          Data in transit should always be protected using Transport Layer Security (TLS, formerly SSL).
          This protects data as it travels between clients and servers.
        </p>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-4">
          <h4 className="text-gray-700 dark:text-gray-300 font-semibold">Implementing HTTPS in ASP.NET Core</h4>
          <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded mt-2 text-sm">
{`// Program.cs
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Always redirect HTTP to HTTPS
app.UseHttpsRedirection();

// Force HTTPS by applying the HSTS middleware
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

// Configure HTTPS in appsettings.json
/*
{
  "Kestrel": {
    "Endpoints": {
      "Http": {
        "Url": "http://localhost:5000"
      },
      "Https": {
        "Url": "https://localhost:5001",
        "Certificate": {
          "Path": "certificate.pfx",
          "Password": "cert-password"
        }
      }
    }
  }
}
*/

// Or in code
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5000); // HTTP
    options.ListenAnyIP(5001, listenOptions =>
    {
        listenOptions.UseHttps("certificate.pfx", "cert-password");
    }); // HTTPS
});`}
          </pre>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg my-4">
          <h4 className="text-yellow-700 dark:text-yellow-400 font-semibold">TLS Best Practices</h4>
          <ul className="mt-2">
            <li><strong>Use TLS 1.2 or later</strong> - Older versions have known vulnerabilities</li>
            <li><strong>Configure secure cipher suites</strong> - Disable weak ciphers and algorithms</li>
            <li><strong>Use strong certificates</strong> - At least 2048-bit RSA or 256-bit ECC keys</li>
            <li><strong>Implement HSTS</strong> - HTTP Strict Transport Security enforces HTTPS</li>
            <li><strong>Use secure cookies</strong> - Set Secure and HttpOnly flags on cookies</li>
            <li><strong>Consider OCSP stapling</strong> - Improves certificate validation performance</li>
          </ul>
        </div>

        <h2>Data Protection in Entity Framework Core</h2>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-4">
          <h4 className="text-gray-700 dark:text-gray-300 font-semibold">Protecting Sensitive Data in Entity Framework</h4>
          <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded mt-2 text-sm">
{`using System;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.AspNetCore.DataProtection;

// Entity model with sensitive data
public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; }
    
    // Sensitive data that will be encrypted
    public string SocialSecurityNumber { get; set; }
    public string CreditCardNumber { get; set; }
}

// DbContext with encryption
public class ApplicationDbContext : DbContext
{
    private readonly IDataProtectionProvider _dataProtectionProvider;
    
    public ApplicationDbContext(
        DbContextOptions options,
        IDataProtectionProvider dataProtectionProvider) : base(options)
    {
        _dataProtectionProvider = dataProtectionProvider;
    }
    
    public DbSet<Customer> Customers { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Create a protector for specific purpose
        var protector = _dataProtectionProvider.CreateProtector("EntityFramework.Encryption");
        
        // Configure value converters for sensitive fields
        var ssnConverter = new ValueConverter<string, string>(
            // Converting to database (encrypting)
            v => protector.Protect(v),
            // Converting from database (decrypting)
            v => protector.Unprotect(v));
            
        var ccConverter = new ValueConverter<string, string>(
            v => protector.Protect(v),
            v => protector.Unprotect(v));
        
        // Apply the converters
        modelBuilder.Entity<Customer>()
            .Property(c => c.SocialSecurityNumber)
            .HasConversion(ssnConverter);
            
        modelBuilder.Entity<Customer>()
            .Property(c => c.CreditCardNumber)
            .HasConversion(ccConverter);
    }
}`}
          </pre>
        </div>

        <div className="bg-csharp-blue-50 dark:bg-csharp-blue-900/20 p-4 rounded-lg mt-6">
          <h3 className="text-csharp-blue-700 dark:text-csharp-blue-400">Practice Exercise</h3>
          <p>
            Implement comprehensive data protection in a sample application:
          </p>
          <ol className="mt-2">
            <li>Create an ASP.NET Core Web API that stores and retrieves sensitive user information</li>
            <li>Implement proper password storage using PBKDF2 or ASP.NET Core Identity</li>
            <li>Use the Data Protection API to protect authentication cookies and tokens</li>
            <li>Implement field-level encryption for sensitive database columns</li>
            <li>Configure the application to use Azure Key Vault for storing secrets in production</li>
            <li>Set up proper HTTPS configuration with HSTS</li>
            <li>Implement an audit trail for all data access operations</li>
          </ol>
          <p className="mt-2">
            This exercise will help you apply multiple data protection techniques in a real-world
            scenario, ensuring that sensitive data is properly protected throughout your application.
          </p>
        </div>

        <div className="mt-8">
          <p>
            Data protection is a critical component of application security. By implementing the techniques
            covered in this lesson, you can ensure that sensitive data in your C# applications is properly
            protected, both at rest and in transit. Remember that security is an ongoing process, and you
            should regularly review and update your data protection strategies as new threats and technologies
            emerge.
          </p>
          
          <p>
            Congratulations on completing the Security module! You now have a solid foundation in authentication
            and authorization, common security vulnerabilities, and data protection techniques in C# applications.
          </p>
        </div>
      </div>
    </LessonLayout>
  );
} 