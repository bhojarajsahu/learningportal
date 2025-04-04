import React from 'react';
import { FiShield, FiAlertTriangle, FiKey, FiLock } from 'react-icons/fi';
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

const sqlInjectionCode = `// Vulnerable code - DO NOT USE
public IEnumerable<Customer> FindCustomers(string searchTerm)
{
    string connectionString = _configuration.GetConnectionString("DefaultConnection");
    var customers = new List<Customer>();
    
    using (SqlConnection connection = new SqlConnection(connectionString))
    {
        connection.Open();
        
        // VULNERABLE: Direct string concatenation in SQL query
        string sql = "SELECT * FROM Customers WHERE Name LIKE '%" + searchTerm + "%' OR Email LIKE '%" + searchTerm + "%'";
        
        using (SqlCommand command = new SqlCommand(sql, connection))
        {
            using (SqlDataReader reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    customers.Add(new Customer
                    {
                        Id = (int)reader["Id"],
                        Name = reader["Name"].ToString(),
                        Email = reader["Email"].ToString()
                    });
                }
            }
        }
    }
    
    return customers;
}

// Secure code - USE THIS INSTEAD
public IEnumerable<Customer> FindCustomersSafely(string searchTerm)
{
    string connectionString = _configuration.GetConnectionString("DefaultConnection");
    var customers = new List<Customer>();
    
    using (SqlConnection connection = new SqlConnection(connectionString))
    {
        connection.Open();
        
        // SECURE: Parameterized query
        string sql = "SELECT * FROM Customers WHERE Name LIKE @SearchName OR Email LIKE @SearchEmail";
        
        using (SqlCommand command = new SqlCommand(sql, connection))
        {
            // Add parameters with proper types
            command.Parameters.Add("@SearchName", SqlDbType.NVarChar).Value = "%" + searchTerm + "%";
            command.Parameters.Add("@SearchEmail", SqlDbType.NVarChar).Value = "%" + searchTerm + "%";
            
            using (SqlDataReader reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    customers.Add(new Customer
                    {
                        Id = (int)reader["Id"],
                        Name = reader["Name"].ToString(),
                        Email = reader["Email"].ToString()
                    });
                }
            }
        }
    }
    
    return customers;
}

// Using Entity Framework (even more secure and cleaner)
public IEnumerable<Customer> FindCustomersWithEF(string searchTerm)
{
    string search = "%" + searchTerm + "%";
    
    return _dbContext.Customers
        .Where(c => EF.Functions.Like(c.Name, search) || EF.Functions.Like(c.Email, search))
        .ToList();
}`;

const xssCode = `// ASP.NET MVC/Razor Pages - Cross-Site Scripting Vulnerabilities

// 1. VULNERABLE: Directly outputting user input in Razor view
@* VULNERABLE: Renders HTML as-is *@
<div>@Html.Raw(Model.Comment)</div>

// 2. SECURE: Default encoding in Razor views
@* SECURE: Automatically HTML-encodes the output *@
<div>@Model.Comment</div>

// 3. JavaScript context - VULNERABLE
@* VULNERABLE: JavaScript injection possible *@
<script>
    var userName = '@Model.UserName'; // If userName contains '; alert('XSS'); //', it executes
</script>

// 4. JavaScript context - SECURE
@* SECURE: Properly encoding for JavaScript context *@
<script>
    var userName = '@Json.Serialize(Model.UserName)';
</script>

// 5. VULNERABLE: Using innerHTML with user input
// VULNERABLE: In JavaScript
function displayComment(comment) {
    document.getElementById('commentSection').innerHTML = comment; // Vulnerable
}

// 6. SECURE: Using textContent instead
// SECURE: In JavaScript
function displayCommentSafely(comment) {
    document.getElementById('commentSection').textContent = comment; // Safe
}

// 7. VULNERABLE: API returning user content without encoding
[HttpGet]
public ActionResult GetComments()
{
    var comments = _repository.GetComments();
    return Json(comments); // If rendered with innerHTML, could be vulnerable
}

// 8. SECURE: API with sanitization
[HttpGet]
public ActionResult GetCommentsSafely()
{
    var comments = _repository.GetComments();
    
    // Sanitize the content before returning
    foreach (var comment in comments)
    {
        comment.Content = _htmlSanitizer.Sanitize(comment.Content);
    }
    
    return Json(comments);
}

// 9. SECURE: Using Content Security Policy (in Startup.cs)
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    // ...existing configuration...
    
    app.Use(async (context, next) =>
    {
        // Add Content Security Policy header
        context.Response.Headers.Add(
            "Content-Security-Policy",
            "default-src 'self'; " +
            "script-src 'self' https://trusted-cdn.com; " +
            "style-src 'self' https://trusted-cdn.com; " +
            "img-src 'self' data:; " +
            "font-src 'self'; " +
            "object-src 'none'");
            
        await next();
    });
    
    // ...rest of configuration...
}`;

const insecureDeserializationCode = `using System;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text.Json;
using System.Xml;
using System.Xml.Serialization;
using Newtonsoft.Json;

// Example class
[Serializable]
public class UserData
{
    public int UserId { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    
    // VULNERABLE: This could be exploited in deserialization attacks
    public string SerializedData { get; set; }
}

class DeserializationVulnerabilities
{
    // 1. VULNERABLE: BinaryFormatter (highly dangerous, now obsolete)
    public static UserData DeserializeUserBinaryVulnerable(byte[] data)
    {
        // VULNERABLE: BinaryFormatter can execute arbitrary code during deserialization
        BinaryFormatter formatter = new BinaryFormatter();
        using (MemoryStream ms = new MemoryStream(data))
        {
            return (UserData)formatter.Deserialize(ms); // DANGEROUS!
        }
    }
    
    // 2. VULNERABLE: XML Deserialization without restrictions
    public static UserData DeserializeUserXmlVulnerable(string xml)
    {
        // VULNERABLE: XMLSerializer without proper restrictions
        XmlSerializer serializer = new XmlSerializer(typeof(UserData));
        using (StringReader reader = new StringReader(xml))
        {
            return (UserData)serializer.Deserialize(reader); // Potentially dangerous
        }
    }
    
    // 3. VULNERABLE: Newtonsoft JSON with type handling
    public static UserData DeserializeUserJsonVulnerable(string json)
    {
        // VULNERABLE: TypeNameHandling.All allows deserialization attacks
        var settings = new JsonSerializerSettings
        {
            TypeNameHandling = TypeNameHandling.All // DANGEROUS!
        };
        
        return JsonConvert.DeserializeObject<UserData>(json, settings); // Potentially dangerous
    }
    
    // SECURE ALTERNATIVES
    
    // 1. SECURE: System.Text.Json (preferred modern approach)
    public static UserData DeserializeUserJsonSafe(string json)
    {
        // SECURE: System.Text.Json doesn't support type handling by default
        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };
        
        return System.Text.Json.JsonSerializer.Deserialize<UserData>(json, options); // Safe
    }
    
    // 2. SECURE: Newtonsoft JSON with safe settings
    public static UserData DeserializeUserNewtonsoftSafe(string json)
    {
        // SECURE: Default settings without type handling
        return JsonConvert.DeserializeObject<UserData>(json); // Safe with default settings
    }
    
    // 3. SECURE: XML Deserialization with restrictions
    public static UserData DeserializeUserXmlSafe(string xml)
    {
        // SECURE: XmlSerializer with proper restrictions
        XmlSerializer serializer = new XmlSerializer(typeof(UserData));
        
        // Add security settings
        XmlReaderSettings settings = new XmlReaderSettings
        {
            DtdProcessing = DtdProcessing.Prohibit, // Prevent DTD processing
            ValidationType = ValidationType.None,
            XmlResolver = null, // Prevent external entity resolution
            MaxCharactersInDocument = 1024 * 1024 // Limit size to prevent DoS
        };
        
        using (StringReader strReader = new StringReader(xml))
        using (XmlReader xmlReader = XmlReader.Create(strReader, settings))
        {
            return (UserData)serializer.Deserialize(xmlReader); // Safer
        }
    }
}`;

export default function VulnerabilitiesPage() {
  return (
    <LessonLayout 
      title="Common Vulnerabilities"
      level="advanced"
      sidebarItems={sidebarItems}
      prev={{ href: '/advanced/security/authentication', title: 'Authentication & Authorization' }}
      next={{ href: '/advanced/security/data-protection', title: 'Data Protection' }}
    >
      <div className="prose dark:prose-invert max-w-none">
        <h1>Common Security Vulnerabilities in C#</h1>
        
        <p>
          This lesson covers common security vulnerabilities that C# developers must be aware of and provides
          strategies to protect applications against these threats. Understanding these vulnerabilities is essential
          for building secure applications.
        </p>

        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg my-4">
          <h3 className="text-xl font-semibold">OWASP Top 10</h3>
          <p className="mt-2">
            The Open Web Application Security Project (OWASP) maintains a list of the most critical security
            risks to web applications. Many of the vulnerabilities we'll cover are part of this list, which
            should be considered essential knowledge for any C# developer building web applications.
          </p>
        </div>

        <h2>SQL Injection</h2>
        
        <p>
          SQL Injection occurs when untrusted data is sent to an interpreter as part of a command or query,
          tricking the interpreter into executing unintended commands or accessing unauthorized data.
        </p>

        <CodeEditor 
          initialCode={sqlInjectionCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg my-4">
          <h4 className="text-yellow-700 dark:text-yellow-400 font-semibold">Prevention Techniques</h4>
          <ul className="mt-2">
            <li><strong>Use parameterized queries</strong> - Always use parameterized statements or stored procedures with parameters</li>
            <li><strong>Use an ORM</strong> - Entity Framework and other ORMs provide protection against SQL injection by default</li>
            <li><strong>Apply least privilege</strong> - Database accounts should have minimal required permissions</li>
            <li><strong>Input validation</strong> - Validate input for type, length, format, and range</li>
            <li><strong>Escape special characters</strong> - If parameterized queries aren't possible, escape special characters</li>
          </ul>
        </div>

        <h2>Cross-Site Scripting (XSS)</h2>
        
        <p>
          Cross-Site Scripting occurs when an application takes untrusted data and sends it to a web browser
          without proper validation or encoding. This allows attackers to execute scripts in the victim's browser.
        </p>

        <CodeEditor 
          initialCode={xssCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg my-4">
          <h4 className="text-yellow-700 dark:text-yellow-400 font-semibold">Prevention Techniques</h4>
          <ul className="mt-2">
            <li><strong>Context-aware output encoding</strong> - Use the appropriate encoding based on where the data will be used (HTML, JavaScript, CSS, URL)</li>
            <li><strong>Content Security Policy (CSP)</strong> - Implement CSP headers to restrict script sources</li>
            <li><strong>Avoid dangerous APIs</strong> - Don't use methods like <code>Html.Raw()</code> unless absolutely necessary</li>
            <li><strong>Sanitize HTML</strong> - Use a library like HtmlSanitizer when you need to allow limited HTML</li>
            <li><strong>Use modern frameworks</strong> - Modern JavaScript frameworks like React, Angular, and Vue automatically escape content</li>
          </ul>
        </div>

        <h2>Cross-Site Request Forgery (CSRF)</h2>
        
        <p>
          CSRF attacks trick a user's browser into executing unwanted actions on a site where the user is authenticated.
        </p>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-4">
          <h4 className="text-gray-700 dark:text-gray-300 font-semibold">How CSRF Works</h4>
          <ol className="mt-2">
            <li>The user logs into a legitimate site (e.g., a bank) and receives a session cookie</li>
            <li>Without logging out, the user visits a malicious site</li>
            <li>The malicious site contains code that submits a form to the legitimate site</li>
            <li>The browser includes the user's cookies with the request</li>
            <li>The legitimate site processes the request as if it came from the user</li>
          </ol>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg my-4">
          <h4 className="text-green-700 dark:text-green-400 font-semibold">Prevention in ASP.NET Core</h4>
          <p className="mt-2">
            ASP.NET Core provides built-in protection against CSRF attacks:
          </p>
          <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded mt-2 text-sm">
{`// 1. Enable CSRF protection in Program.cs
builder.Services.AddControllersWithViews(options =>
{
    options.Filters.Add(new AutoValidateAntiforgeryTokenAttribute());
});

// 2. Generate anti-forgery tokens in forms
@using (Html.BeginForm())
{
    @Html.AntiForgeryToken()
    <!-- form fields -->
    <button type="submit">Submit</button>
}

// 3. Apply [ValidateAntiForgeryToken] attribute to actions
[HttpPost]
[ValidateAntiForgeryToken]
public IActionResult UpdateProfile(ProfileViewModel model)
{
    // Update profile
    return RedirectToAction("Index");
}`}
          </pre>
        </div>

        <h2>Insecure Deserialization</h2>
        
        <p>
          Insecure deserialization occurs when an application deserializes untrusted data without sufficient verification,
          allowing attackers to manipulate serialized objects to achieve harmful results, including remote code execution.
        </p>

        <CodeEditor 
          initialCode={insecureDeserializationCode}
          language="csharp"
          readOnly={true}
        />

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg my-4">
          <h4 className="text-yellow-700 dark:text-yellow-400 font-semibold">Prevention Techniques</h4>
          <ul className="mt-2">
            <li><strong>Avoid dangerous serializers</strong> - Never use BinaryFormatter for untrusted data</li>
            <li><strong>Use safe serialization formats</strong> - Prefer JSON over XML or binary formats</li>
            <li><strong>Disable type information</strong> - Avoid type handling options that allow specifying types during deserialization</li>
            <li><strong>Input validation</strong> - Validate serialized data before deserialization</li>
            <li><strong>Integrity checks</strong> - Implement digital signatures or encryption for serialized data</li>
            <li><strong>Principle of least privilege</strong> - Run deserialization with minimal privileges</li>
          </ul>
        </div>

        <h2>Security Misconfiguration</h2>
        
        <p>
          Security misconfiguration is the most common vulnerability and includes improperly configured
          permissions, unnecessary features enabled, default accounts/passwords, overly informative error messages,
          and missing security headers.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
          <h4 className="text-blue-700 dark:text-blue-400 font-semibold">Common Misconfigurations</h4>
          <ul className="mt-2">
            <li><strong>Development features in production</strong> - Detailed error pages, debugging enabled</li>
            <li><strong>Default credentials</strong> - Not changing default accounts or passwords</li>
            <li><strong>Unnecessary services running</strong> - Unused features or components that increase attack surface</li>
            <li><strong>Missing security headers</strong> - Not implementing important HTTP security headers</li>
            <li><strong>Outdated software</strong> - Using frameworks or libraries with known vulnerabilities</li>
            <li><strong>Overly permissive CORS</strong> - Using wildcard (*) or permitting untrusted origins</li>
          </ul>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg my-4">
          <h4 className="text-green-700 dark:text-green-400 font-semibold">Secure Configuration in ASP.NET Core</h4>
          <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded mt-2 text-sm">
{`// Program.cs - Secure configuration
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Different configuration for different environments
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

// Always use HTTPS redirection in production
app.UseHttpsRedirection();

// Add security headers
app.Use(async (context, next) =>
{
    // Add security headers
    context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Add("X-Frame-Options", "DENY");
    context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");
    context.Response.Headers.Add("Referrer-Policy", "strict-origin-when-cross-origin");
    context.Response.Headers.Add("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    
    await next();
});

// Configure CORS properly
app.UseCors(policy => policy
    .WithOrigins("https://trusted-site.com", "https://another-trusted-site.com")
    .WithMethods("GET", "POST")
    .WithHeaders("Content-Type", "Authorization")
    .AllowCredentials()
);

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();`}
          </pre>
        </div>

        <h2>Other Common Vulnerabilities</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-700 dark:text-gray-300">Broken Access Control</h3>
            <p className="mt-2">
              Occurs when users can access functionality or data they shouldn't.
              Prevent by implementing proper authorization checks and following 
              the principle of least privilege.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-700 dark:text-gray-300">Sensitive Data Exposure</h3>
            <p className="mt-2">
              Failure to properly protect sensitive data. Prevent with proper encryption,
              secure storage, and secure transmission of sensitive information.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-700 dark:text-gray-300">XML External Entities (XXE)</h3>
            <p className="mt-2">
              Occurs when XML processors process external entity references in untrusted XML.
              Prevent by configuring XML parsers to disable external entity processing.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-700 dark:text-gray-300">Open Redirect</h3>
            <p className="mt-2">
              Allows attackers to redirect users to malicious sites. Prevent by validating 
              redirect URLs against a whitelist or not using user-provided URLs for redirection.
            </p>
          </div>
        </div>

        <h2>Security Testing Tools</h2>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
          <h4 className="text-blue-700 dark:text-blue-400 font-semibold">Tools to Help Identify Vulnerabilities</h4>
          <ul className="mt-2">
            <li><strong>Static Application Security Testing (SAST)</strong> - Tools like SonarQube, Security Code Scan, or Microsoft Security Code Analysis</li>
            <li><strong>Dynamic Application Security Testing (DAST)</strong> - Tools like OWASP ZAP or Burp Suite</li>
            <li><strong>Dependency checkers</strong> - Tools like OWASP Dependency-Check or Snyk to identify vulnerable dependencies</li>
            <li><strong>Security headers analyzers</strong> - Tools like securityheaders.com to check HTTP security headers</li>
            <li><strong>Penetration testing</strong> - Professional security testing to identify vulnerabilities</li>
          </ul>
        </div>

        <div className="bg-csharp-blue-50 dark:bg-csharp-blue-900/20 p-4 rounded-lg mt-6">
          <h3 className="text-csharp-blue-700 dark:text-csharp-blue-400">Practice Exercise</h3>
          <p>
            Secure a vulnerable web application:
          </p>
          <ol className="mt-2">
            <li>Take an existing ASP.NET Core MVC or Web API project</li>
            <li>Identify and fix at least one instance of each vulnerability type discussed in this lesson</li>
            <li>Implement proper security headers</li>
            <li>Add CSRF protection to all forms</li>
            <li>Ensure all database access uses parameterized queries or an ORM</li>
            <li>Implement proper output encoding for all user-generated content</li>
            <li>Configure proper error handling for different environments</li>
            <li>Run a security analysis tool and address any findings</li>
          </ol>
          <p className="mt-2">
            This exercise will help you apply the security concepts and techniques covered in
            this lesson to identify and fix common vulnerabilities in real applications.
          </p>
        </div>

        <div className="mt-8">
          <p>
            Understanding and addressing common security vulnerabilities is an essential skill for C# developers.
            By implementing the defense strategies described in this lesson, you can significantly reduce the
            risk of security breaches in your applications. Remember that security is an ongoing process, not
            a one-time task, and requires continuous vigilance and updates as new threats emerge.
          </p>
        </div>
      </div>
    </LessonLayout>
  );
} 