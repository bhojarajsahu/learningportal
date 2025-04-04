import React from 'react';
import { FiShield, FiKey, FiLock, FiAlertTriangle } from 'react-icons/fi';
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

const identitySetupCode = `// Program.cs
var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();

// Configure Identity with Entity Framework
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    // Password settings
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;
    
    // Lockout settings
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
    options.Lockout.MaxFailedAccessAttempts = 5;
    
    // User settings
    options.User.RequireUniqueEmail = true;
    options.SignIn.RequireConfirmedEmail = true;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// Configure application cookie settings
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.ExpireTimeSpan = TimeSpan.FromHours(1);
    options.LoginPath = "/Account/Login";
    options.AccessDeniedPath = "/Account/AccessDenied";
    options.SlidingExpiration = true;
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();`;

const jwtAuthCode = `// Program.cs - JWT Authentication Configuration
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
    
    // Enable JWT events for additional validation or logging
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
            {
                context.Response.Headers.Add("Token-Expired", "true");
            }
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            // Additional validation logic here
            return Task.CompletedTask;
        }
    };
});

// JWT Token Generation Service
public class TokenService
{
    private readonly IConfiguration _configuration;
    
    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    
    public string GenerateJwtToken(ApplicationUser user, IList<string> roles)
    {
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id)
        };
        
        // Add roles as claims
        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }
        
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.Now.AddHours(Convert.ToDouble(_configuration["Jwt:ExpireHours"]));
        
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: expires,
            signingCredentials: creds
        );
        
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

// Example Controller for Login and Token Generation
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly TokenService _tokenService;
    
    public AuthController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        TokenService tokenService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        
        if (user == null)
        {
            return Unauthorized("Invalid email or password");
        }
        
        var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
        
        if (!result.Succeeded)
        {
            return Unauthorized("Invalid email or password");
        }
        
        var roles = await _userManager.GetRolesAsync(user);
        var token = _tokenService.GenerateJwtToken(user, roles);
        
        return Ok(new { token });
    }
}

public class LoginDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    
    [Required]
    public string Password { get; set; }
}`;

const authorizationCode = `// Program.cs - Authorization Configuration
builder.Services.AddAuthorization(options =>
{
    // Policy requiring a specific role
    options.AddPolicy("RequireAdminRole", policy => 
        policy.RequireRole("Admin"));
    
    // Policy requiring multiple roles
    options.AddPolicy("ContentManagement", policy => 
        policy.RequireRole("Editor", "Admin"));
    
    // Policy based on claims
    options.AddPolicy("CanManageUsers", policy => 
        policy.RequireClaim("Permission", "ManageUsers"));
    
    // Policy with custom requirements
    options.AddPolicy("UserOwnershipPolicy", policy =>
        policy.AddRequirements(new ResourceOwnerRequirement()));
        
    // Combined requirements
    options.AddPolicy("SeniorEditor", policy =>
        policy.RequireRole("Editor")
              .RequireClaim("Department", "Editorial")
              .RequireClaim("Level", "Senior"));
});

// Add authorization handler for custom requirement
builder.Services.AddScoped<IAuthorizationHandler, ResourceOwnerHandler>();

// Custom Authorization Requirement
public class ResourceOwnerRequirement : IAuthorizationRequirement { }

// Custom Authorization Handler
public class ResourceOwnerHandler : AuthorizationHandler<ResourceOwnerRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context, 
        ResourceOwnerRequirement requirement)
    {
        if (!context.User.Identity.IsAuthenticated)
        {
            return Task.CompletedTask;
        }
        
        // Get resource from the request
        var resource = context.Resource as ResourceWithOwner;
        
        if (resource == null)
        {
            return Task.CompletedTask;
        }
        
        // Check if the user is the owner
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (resource.OwnerId == userId)
        {
            context.Succeed(requirement);
        }
        
        return Task.CompletedTask;
    }
}

// Example resource with owner information
public class ResourceWithOwner
{
    public string Id { get; set; }
    public string OwnerId { get; set; }
    public string Content { get; set; }
}

// Example Controller with Authorization
[ApiController]
[Route("api/[controller]")]
public class DocumentsController : ControllerBase
{
    private readonly IAuthorizationService _authorizationService;
    
    public DocumentsController(IAuthorizationService authorizationService)
    {
        _authorizationService = authorizationService;
    }
    
    // Using Role-based authorization
    [HttpGet]
    [Authorize(Roles = "Admin,Editor")]
    public IActionResult GetAll()
    {
        return Ok(new[] { "Document1", "Document2" });
    }
    
    // Using Policy-based authorization
    [HttpPost]
    [Authorize(Policy = "ContentManagement")]
    public IActionResult Create(DocumentDto document)
    {
        // Create document
        return Ok(new { Id = Guid.NewGuid().ToString() });
    }
    
    // Using custom resource-based authorization
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var document = GetDocumentById(id);
        
        if (document == null)
        {
            return NotFound();
        }
        
        // Create resource with owner info for authorization check
        var resource = new ResourceWithOwner
        {
            Id = document.Id,
            OwnerId = document.OwnerId,
            Content = document.Content
        };
        
        // Perform authorization check
        var authResult = await _authorizationService.AuthorizeAsync(
            User, resource, "UserOwnershipPolicy");
            
        if (!authResult.Succeeded)
        {
            return Forbid();
        }
        
        return Ok(document);
    }
    
    // Simulate document retrieval
    private DocumentDto GetDocumentById(string id)
    {
        return new DocumentDto
        {
            Id = id,
            OwnerId = "user-123", // In real app, this would be from database
            Content = "Document content",
            Title = "Test Document"
        };
    }
}

public class DocumentDto
{
    public string Id { get; set; }
    public string OwnerId { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
}`;

const oauthCode = `// Program.cs - OAuth Configuration
var builder = WebApplication.CreateBuilder(args);

// Add authentication with multiple schemes
builder.Services.AddAuthentication(options => 
{
    options.DefaultScheme = "Cookies";
    options.DefaultChallengeScheme = "oidc";
})
.AddCookie("Cookies")
.AddOpenIdConnect("oidc", options =>
{
    options.Authority = "https://your-identity-provider.com";
    options.ClientId = builder.Configuration["Authentication:ClientId"];
    options.ClientSecret = builder.Configuration["Authentication:ClientSecret"];
    options.ResponseType = "code";
    options.UsePkce = true;
    
    options.Scope.Add("openid");
    options.Scope.Add("profile");
    options.Scope.Add("email");
    options.Scope.Add("api1");
    
    options.SaveTokens = true;
    options.GetClaimsFromUserInfoEndpoint = true;
    
    options.TokenValidationParameters = new TokenValidationParameters
    {
        NameClaimType = "name",
        RoleClaimType = "role"
    };
});

// Add Google authentication
builder.Services.AddAuthentication()
.AddGoogle(options =>
{
    options.ClientId = builder.Configuration["Authentication:Google:ClientId"];
    options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
});

// Add Microsoft authentication
builder.Services.AddAuthentication()
.AddMicrosoftAccount(options =>
{
    options.ClientId = builder.Configuration["Authentication:Microsoft:ClientId"];
    options.ClientSecret = builder.Configuration["Authentication:Microsoft:ClientSecret"];
});

// API Client for calling protected APIs with access tokens
public class ApiClient
{
    private readonly HttpClient _httpClient;
    private readonly IHttpContextAccessor _httpContextAccessor;
    
    public ApiClient(HttpClient httpClient, IHttpContextAccessor httpContextAccessor)
    {
        _httpClient = httpClient;
        _httpContextAccessor = httpContextAccessor;
    }
    
    public async Task<T> GetAsync<T>(string endpoint)
    {
        var accessToken = await _httpContextAccessor.HttpContext.GetTokenAsync("access_token");
        
        _httpClient.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue("Bearer", accessToken);
            
        var response = await _httpClient.GetAsync(endpoint);
        response.EnsureSuccessStatusCode();
        
        var content = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<T>(content);
    }
}

// Controller example for initiating login and logout with OAuth
public class AccountController : Controller
{
    [HttpGet("login")]
    public IActionResult Login(string returnUrl = "/")
    {
        return Challenge(new AuthenticationProperties 
        { 
            RedirectUri = returnUrl 
        }, "oidc");
    }
    
    [HttpGet("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync("Cookies");
        await HttpContext.SignOutAsync("oidc");
        
        return RedirectToAction("Index", "Home");
    }
    
    [Authorize]
    [HttpGet("profile")]
    public IActionResult Profile()
    {
        return View();
    }
}`;

export default function AuthenticationPage() {
  return (
    <LessonLayout 
      title="Authentication & Authorization"
      level="advanced"
      sidebarItems={sidebarItems}
      next={{ href: '/advanced/security/vulnerabilities', title: 'Common Vulnerabilities' }}
    >
      <div className="prose dark:prose-invert max-w-none">
        <h1>Authentication & Authorization in C#</h1>
        
        <p>
          Implementing secure authentication and authorization is critical for protecting user data and
          controlling access to resources in your applications. This lesson covers essential techniques
          and best practices for securing your C# applications.
        </p>

        <h2>Understanding the Difference</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
            <h3 className="text-indigo-700 dark:text-indigo-400 font-semibold">Authentication</h3>
            <p className="mt-2">
              Authentication is the process of verifying who a user is. It answers the question: "Who are you?"
              This typically involves validating user credentials (username/password) or other identity proof.
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h3 className="text-green-700 dark:text-green-400 font-semibold">Authorization</h3>
            <p className="mt-2">
              Authorization is the process of verifying what a user can do. It answers the question: "What are you allowed to do?"
              This involves checking if an authenticated user has permission to access specific resources or perform actions.
            </p>
          </div>
        </div>

        <h2>ASP.NET Core Identity</h2>
        
        <p>
          ASP.NET Core Identity is a membership system that adds login functionality to ASP.NET Core applications.
          It provides a framework for managing users, passwords, profile data, roles, claims, and more.
        </p>

        <CodeEditor 
          initialCode={identitySetupCode}
          language="csharp"
          readOnly={true}
        />

        <h3>Key Features of ASP.NET Core Identity</h3>
        
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <li className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <strong>User Management</strong>: Create, read, update, and delete user accounts
          </li>
          <li className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <strong>Password Validation</strong>: Enforce password complexity requirements
          </li>
          <li className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <strong>Account Confirmation</strong>: Email verification for new accounts
          </li>
          <li className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <strong>Two-factor Authentication</strong>: Additional security with 2FA
          </li>
          <li className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <strong>Account Lockout</strong>: Protection against brute force attacks
          </li>
          <li className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <strong>Role Management</strong>: Organize users into groups with permissions
          </li>
          <li className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <strong>Claims-based Authentication</strong>: Flexible authorization with claims
          </li>
          <li className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <strong>External Authentication</strong>: Support for OAuth/OpenID providers
          </li>
        </ul>

        <h2>JWT Authentication</h2>
        
        <p>
          JSON Web Tokens (JWT) provide a stateless authentication mechanism, which is particularly useful 
          for API authentication and single-page applications (SPAs).
        </p>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg my-4">
          <h4 className="text-yellow-700 dark:text-yellow-400 font-semibold">JWT Structure</h4>
          <p className="mt-2">JWTs consist of three parts separated by dots:</p>
          <ul className="mt-2">
            <li><strong>Header</strong>: Contains the token type and signing algorithm</li>
            <li><strong>Payload</strong>: Contains claims (statements about the user and metadata)</li>
            <li><strong>Signature</strong>: Verifies the token hasn't been tampered with</li>
          </ul>
        </div>

        <CodeEditor 
          initialCode={jwtAuthCode}
          language="csharp"
          readOnly={true}
        />

        <h2>Authorization Techniques</h2>
        
        <p>
          ASP.NET Core offers several approaches to authorization, from simple role-based controls to
          fine-grained policy-based authorization.
        </p>

        <CodeEditor 
          initialCode={authorizationCode}
          language="csharp"
          readOnly={true}
        />

        <h3>Authorization Strategies</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="text-blue-700 dark:text-blue-400 font-semibold">Role-based Authorization</h4>
            <ul className="mt-2">
              <li>Simple to implement</li>
              <li>Based on predefined user roles (Admin, Editor, User, etc.)</li>
              <li>Limited flexibility for complex permission scenarios</li>
              <li>Example: <code>[Authorize(Roles = "Admin")]</code></li>
            </ul>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="text-blue-700 dark:text-blue-400 font-semibold">Claims-based Authorization</h4>
            <ul className="mt-2">
              <li>More flexible than role-based</li>
              <li>Based on user characteristics or entitlements</li>
              <li>Claims can represent any user attribute</li>
              <li>Example: <code>[Authorize(Policy = "CanEditContent")]</code></li>
            </ul>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="text-blue-700 dark:text-blue-400 font-semibold">Policy-based Authorization</h4>
            <ul className="mt-2">
              <li>Encapsulates authorization logic</li>
              <li>Can combine multiple requirements</li>
              <li>Centralized management of authorization rules</li>
              <li>Reusable across controllers and actions</li>
            </ul>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="text-blue-700 dark:text-blue-400 font-semibold">Resource-based Authorization</h4>
            <ul className="mt-2">
              <li>Authorization based on the specific resource being accessed</li>
              <li>Allows for ownership checks (e.g., user can only edit their own content)</li>
              <li>Requires custom authorization handlers</li>
              <li>Most flexible approach</li>
            </ul>
          </div>
        </div>

        <h2>OAuth and OpenID Connect</h2>
        
        <p>
          OAuth 2.0 and OpenID Connect (OIDC) are industry-standard protocols for authorization and authentication,
          enabling secure delegated access to resources on behalf of users.
        </p>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-4">
          <h4 className="text-gray-700 dark:text-gray-300 font-semibold">Key Concepts</h4>
          <ul className="mt-2">
            <li><strong>OAuth 2.0</strong>: Authorization framework that allows third-party applications to access resources on behalf of users</li>
            <li><strong>OpenID Connect</strong>: Identity layer on top of OAuth 2.0, providing authentication capabilities</li>
            <li><strong>Authorization Code Flow</strong>: Secure flow for server-side applications</li>
            <li><strong>Implicit Flow</strong>: Simplified flow for browser-based applications</li>
            <li><strong>PKCE (Proof Key for Code Exchange)</strong>: Enhanced security for public clients</li>
          </ul>
        </div>

        <CodeEditor 
          initialCode={oauthCode}
          language="csharp"
          readOnly={true}
        />

        <h2>Security Best Practices</h2>
        
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg my-6">
          <h3 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-4">Authentication & Authorization Security Checklist</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Password Security</h4>
              <ul className="space-y-1">
                <li>✅ Use secure password hashing (bcrypt, Argon2)</li>
                <li>✅ Implement strong password policies</li>
                <li>✅ Support multi-factor authentication</li>
                <li>✅ Implement account lockout after failed attempts</li>
                <li>✅ Don't store passwords in plain text</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Session Management</h4>
              <ul className="space-y-1">
                <li>✅ Use secure cookies (HttpOnly, Secure flags)</li>
                <li>✅ Implement proper session timeouts</li>
                <li>✅ Regenerate session IDs after login</li>
                <li>✅ Provide secure logout functionality</li>
                <li>✅ Implement CSRF protection</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Token Security</h4>
              <ul className="space-y-1">
                <li>✅ Use short expiration times for tokens</li>
                <li>✅ Implement token revocation</li>
                <li>✅ Securely store token signing keys</li>
                <li>✅ Validate all aspects of tokens</li>
                <li>✅ Use HTTPS for all token transmissions</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Authorization Controls</h4>
              <ul className="space-y-1">
                <li>✅ Apply least privilege principle</li>
                <li>✅ Implement authorization at all layers</li>
                <li>✅ Don't rely on security by obscurity</li>
                <li>✅ Re-validate permissions for critical operations</li>
                <li>✅ Audit and log access attempts</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-csharp-blue-50 dark:bg-csharp-blue-900/20 p-4 rounded-lg mt-6">
          <h3 className="text-csharp-blue-700 dark:text-csharp-blue-400">Practice Exercise</h3>
          <p>
            Implement a secure API with JWT authentication and role-based authorization:
          </p>
          <ol className="mt-2">
            <li>Create an ASP.NET Core Web API project</li>
            <li>Set up ASP.NET Core Identity with Entity Framework</li>
            <li>Implement JWT token generation and validation</li>
            <li>Create endpoints for user registration and login</li>
            <li>Implement role-based authorization for API endpoints</li>
            <li>Add policy-based authorization for specific operations</li>
            <li>Implement refresh token functionality</li>
            <li>Add proper error handling and security headers</li>
          </ol>
          <p className="mt-2">
            This exercise will help you apply the authentication and authorization concepts covered
            in this lesson to build a secure API.
          </p>
        </div>

        <div className="mt-8">
          <p>
            Authentication and authorization are foundational security concepts for any application.
            By implementing these mechanisms correctly using the approaches covered in this lesson,
            you can ensure that your C# applications properly verify user identities and control
            access to resources.
          </p>
        </div>
      </div>
    </LessonLayout>
  );
} 