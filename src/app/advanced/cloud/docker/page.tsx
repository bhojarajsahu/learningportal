import React from 'react';
import { FiCloud, FiPackage, FiBox, FiServer } from 'react-icons/fi';
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

const dockerfileCode = `# Use the official .NET SDK as a parent image
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /app

# Copy csproj and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy the rest of the source code
COPY . ./
RUN dotnet publish -c Release -o out

# Build the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime
WORKDIR /app
COPY --from=build /app/out ./

# Configure the container to run the application
EXPOSE 80
EXPOSE 443
ENTRYPOINT ["dotnet", "MyWebApi.dll"]`;

const dockerComposeCode = `version: '3.8'

services:
  api:
    build:
      context: ./src/Api
      dockerfile: Dockerfile
    ports:
      - "5000:80"
      - "5001:443"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ConnectionStrings__DefaultConnection=Server=db;Database=MyApp;User=sa;Password=MyP@ssw0rd!;TrustServerCertificate=True
    depends_on:
      - db
    networks:
      - myapp-network
      
  db:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=MyP@ssw0rd!
    ports:
      - "1433:1433"
    volumes:
      - sql-data:/var/opt/mssql
    networks:
      - myapp-network
      
  cache:
    image: redis:alpine
    ports:
      - "6379:6379"
    networks:
      - myapp-network
  
networks:
  myapp-network:
    driver: bridge
    
volumes:
  sql-data:`;

const dockerCliCode = `# Build a Docker image
docker build -t mywebapi .

# Run a container from the image
docker run -d -p 8080:80 --name myapi mywebapi

# View running containers
docker ps

# Stop a container
docker stop myapi

# Remove a container
docker rm myapi

# View logs
docker logs myapi

# Execute a command in a running container
docker exec -it myapi bash

# Push to a container registry
docker tag mywebapi myregistry.azurecr.io/mywebapi:v1
docker push myregistry.azurecr.io/mywebapi:v1

# Run with environment variables
docker run -d -p 8080:80 \\
  -e "ConnectionStrings__DefaultConnection=Server=db;Database=MyApp;User=sa;Password=MyP@ssw0rd!" \\
  --name myapi mywebapi

# Mounting volumes
docker run -d -p 8080:80 \\
  -v $(pwd)/logs:/app/logs \\
  --name myapi mywebapi

# Run multiple containers with Docker Compose
docker-compose up -d

# Stop and remove all containers defined in docker-compose.yml
docker-compose down`;

const kubernetesDeploymentCode = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: mywebapi
  labels:
    app: mywebapi
spec:
  replicas: 3
  selector:
    matchLabels:
      app: mywebapi
  template:
    metadata:
      labels:
        app: mywebapi
    spec:
      containers:
      - name: mywebapi
        image: myregistry.azurecr.io/mywebapi:v1
        ports:
        - containerPort: 80
        env:
        - name: ASPNETCORE_ENVIRONMENT
          value: Production
        - name: ConnectionStrings__DefaultConnection
          valueFrom:
            secretKeyRef:
              name: db-secrets
              key: connection-string
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "500m"
        readinessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 15
          periodSeconds: 20

---
apiVersion: v1
kind: Service
metadata:
  name: mywebapi-service
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 80
  selector:
    app: mywebapi`;

export default function DockerContainerizationPage() {
  return (
    <LessonLayout 
      title="Containerization with Docker"
      level="advanced"
      sidebarItems={sidebarItems}
      prev={{ href: '/advanced/cloud/microservices', title: 'Microservices Architecture' }}
    >
      <div className="prose dark:prose-invert max-w-none">
        <h1>Containerization with Docker for C# Applications</h1>
        
        <p>
          Containerization enables you to package your application and its dependencies into a standardized 
          unit (a container) that can run consistently across different environments. Docker is the most 
          popular containerization platform, providing tools to build, ship, and run containers.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
          <h2 className="text-xl font-semibold">Benefits of Containerization</h2>
          <ul className="mt-2">
            <li><strong>Consistency</strong> - "It works on my machine" becomes "It works on any machine"</li>
            <li><strong>Isolation</strong> - Applications run in their own environment with their own dependencies</li>
            <li><strong>Portability</strong> - Run the same container across development, testing, and production</li>
            <li><strong>Efficiency</strong> - Containers share the host OS kernel and start up in seconds</li>
            <li><strong>Scalability</strong> - Easily scale by deploying multiple instances of the same container</li>
            <li><strong>CI/CD Integration</strong> - Containerization fits perfectly into modern CI/CD pipelines</li>
          </ul>
        </div>

        <h2>Docker Basics</h2>
        
        <p>
          Docker consists of several key components:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-700 dark:text-gray-300">Docker Engine</h3>
            <p className="mt-2">
              The runtime that builds and runs containers. It includes a server (daemon), 
              REST API, and command-line interface.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-700 dark:text-gray-300">Docker Images</h3>
            <p className="mt-2">
              Read-only templates used to create containers. Images include the application 
              code, runtime, libraries, environment variables, and configuration files.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-700 dark:text-gray-300">Docker Containers</h3>
            <p className="mt-2">
              Runnable instances of Docker images. A container is isolated from other containers
              and the host system.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-700 dark:text-gray-300">Docker Registry</h3>
            <p className="mt-2">
              A repository for Docker images. Docker Hub is a public registry, but you can 
              also use private registries like Azure Container Registry.
            </p>
          </div>
        </div>

        <h2>Containerizing .NET Applications</h2>
        
        <p>
          Microsoft provides official Docker images for .NET, making it easy to containerize your C# applications.
          Let's look at how to create a Dockerfile for an ASP.NET Core Web API.
        </p>

        <CodeEditor 
          initialCode={dockerfileCode}
          language="dockerfile"
          readOnly={true}
        />

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg my-4">
          <h3 className="text-green-700 dark:text-green-400">Multi-stage Builds</h3>
          <p className="mt-2">
            The Dockerfile above uses a multi-stage build approach, which has several advantages:
          </p>
          <ul className="mt-2">
            <li>Smaller final image size by excluding build tools and intermediate files</li>
            <li>Separation of build environment from runtime environment</li>
            <li>Better layering and caching for faster rebuilds</li>
          </ul>
        </div>

        <h2>Working with Docker Compose</h2>
        
        <p>
          Docker Compose allows you to define and run multi-container Docker applications. It's especially 
          useful for development environments where you need multiple services (e.g., web app, database, cache).
        </p>

        <CodeEditor 
          initialCode={dockerComposeCode}
          language="yaml"
          readOnly={true}
        />

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg my-4">
          <h3 className="text-yellow-700 dark:text-yellow-400">Docker Compose Features</h3>
          <ul className="mt-2">
            <li><strong>Service definitions</strong> - Define all the services your application needs</li>
            <li><strong>Environment variables</strong> - Configure each service with environment variables</li>
            <li><strong>Networks</strong> - Create custom networks for service communication</li>
            <li><strong>Volumes</strong> - Persist data outside the container lifecycle</li>
            <li><strong>Dependencies</strong> - Define the startup order of services</li>
            <li><strong>Port mapping</strong> - Map container ports to host ports</li>
          </ul>
        </div>

        <h2>Common Docker Commands</h2>
        
        <p>
          Here are some common Docker commands you'll use when working with .NET applications.
        </p>

        <CodeEditor 
          initialCode={dockerCliCode}
          language="bash"
          readOnly={true}
        />

        <h2>Docker Best Practices for .NET Applications</h2>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
          <h3 className="text-blue-700 dark:text-blue-400">Optimizing Docker Builds</h3>
          <ul className="mt-2">
            <li><strong>Layer caching</strong> - Order Dockerfile commands to maximize cache usage</li>
            <li><strong>Minimize image size</strong> - Use multi-stage builds and remove unnecessary files</li>
            <li><strong>Use specific tags</strong> - Don't rely on the 'latest' tag for production</li>
            <li><strong>Consider Alpine-based images</strong> - They're smaller but may have compatibility issues</li>
            <li><strong>Use .dockerignore</strong> - Exclude unnecessary files from the build context</li>
          </ul>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
          <h3 className="text-blue-700 dark:text-blue-400">Container Security</h3>
          <ul className="mt-2">
            <li><strong>Run as non-root</strong> - Use a non-root user in your containers</li>
            <li><strong>Scan images for vulnerabilities</strong> - Use tools like Trivy or Docker Scan</li>
            <li><strong>Use secrets management</strong> - Don't hardcode secrets in your images</li>
            <li><strong>Limit container capabilities</strong> - Apply the principle of least privilege</li>
            <li><strong>Keep images up to date</strong> - Regularly update base images to get security patches</li>
          </ul>
        </div>

        <h2>Deploying Containerized .NET Applications</h2>
        
        <p>
          Once you've containerized your application, you can deploy it to various environments.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-700 dark:text-gray-300">Azure Container Instances (ACI)</h3>
            <p className="mt-2">
              The simplest way to run a container in Azure. Great for simple applications, 
              dev/test scenarios, or jobs with temporary spikes in demand.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-700 dark:text-gray-300">Azure App Service</h3>
            <p className="mt-2">
              Platform as a Service (PaaS) offering that supports containerized applications.
              Provides easy deployment, scaling, and integration with other Azure services.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-700 dark:text-gray-300">Azure Kubernetes Service (AKS)</h3>
            <p className="mt-2">
              Managed Kubernetes service for running containerized applications at scale.
              Ideal for microservices architectures.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-700 dark:text-gray-300">Azure Container Apps</h3>
            <p className="mt-2">
              Serverless container service that enables running microservices and containerized 
              applications on a fully managed environment.
            </p>
          </div>
        </div>

        <h2>Introduction to Kubernetes</h2>
        
        <p>
          Kubernetes (K8s) is an open-source container orchestration platform that automates the deployment, 
          scaling, and management of containerized applications. While a full Kubernetes course is beyond the 
          scope of this lesson, here's a basic example of deploying a .NET application to Kubernetes.
        </p>

        <CodeEditor 
          initialCode={kubernetesDeploymentCode}
          language="yaml"
          readOnly={true}
        />

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4">
          <h3 className="text-blue-700 dark:text-blue-400">Key Kubernetes Concepts</h3>
          <ul className="mt-2">
            <li><strong>Pods</strong> - The smallest deployable units that can be created and managed</li>
            <li><strong>Deployments</strong> - Describe desired state and handle updates to Pods</li>
            <li><strong>Services</strong> - Expose applications running on Pods to network traffic</li>
            <li><strong>ConfigMaps/Secrets</strong> - Store configuration and sensitive information</li>
            <li><strong>Namespaces</strong> - Virtual clusters for resource isolation</li>
            <li><strong>Ingress</strong> - Manage external access to services</li>
            <li><strong>Persistent Volumes</strong> - Storage resources for data persistence</li>
          </ul>
        </div>

        <h2>CI/CD for Containerized Applications</h2>
        
        <p>
          Integrating containerization into your CI/CD pipeline enables you to build, test, and deploy your applications consistently.
        </p>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-4">
          <h3 className="font-semibold">Azure DevOps Pipeline Example</h3>
          <p className="mt-2 text-sm font-mono bg-gray-100 dark:bg-gray-900 p-3 rounded">
{`# azure-pipelines.yml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

variables:
  imageName: 'mywebapi'
  imageTag: '$(Build.BuildNumber)'
  acrName: 'myregistry'

stages:
- stage: Build
  jobs:
  - job: BuildAndPush
    steps:
    - task: Docker@2
      inputs:
        containerRegistry: 'MyACRConnection'
        repository: '$(imageName)'
        command: 'buildAndPush'
        Dockerfile: '**/Dockerfile'
        tags: |
          $(imageTag)
          latest

- stage: Deploy
  jobs:
  - job: DeployToAKS
    steps:
    - task: KubernetesManifest@0
      inputs:
        action: 'deploy'
        kubernetesServiceConnection: 'MyAKSConnection'
        manifests: |
          kubernetes/deployment.yml
          kubernetes/service.yml
        containers: '$(acrName).azurecr.io/$(imageName):$(imageTag)'`}
          </p>
        </div>

        <div className="bg-csharp-blue-50 dark:bg-csharp-blue-900/20 p-4 rounded-lg mt-6">
          <h3 className="text-csharp-blue-700 dark:text-csharp-blue-400">Practice Exercise</h3>
          <p>
            Containerize a .NET microservices application:
          </p>
          <ol className="mt-2">
            <li>Create a simple ASP.NET Core Web API project</li>
            <li>Write a Dockerfile for the application</li>
            <li>Create a SQL Server database container to store data</li>
            <li>Set up a Docker Compose file to run both the API and database</li>
            <li>Build and run the containers locally</li>
            <li>Push the image to Azure Container Registry</li>
            <li>Deploy the containerized application to Azure Container Instances or Azure App Service</li>
          </ol>
          <p className="mt-2">
            This exercise will help you understand the complete workflow of containerizing and deploying a .NET application.
          </p>
        </div>

        <div className="mt-8">
          <p>
            Containerization with Docker provides a consistent way to package and deploy your C# applications across 
            different environments. When combined with orchestration platforms like Kubernetes, it enables you to 
            build scalable, resilient systems that align perfectly with microservices architecture.
          </p>
          
          <p>
            Congratulations on completing the Cloud Development module! You now have a solid foundation in Azure services, 
            microservices architecture, and containerization with Docker.
          </p>
        </div>
      </div>
    </LessonLayout>
  );
} 