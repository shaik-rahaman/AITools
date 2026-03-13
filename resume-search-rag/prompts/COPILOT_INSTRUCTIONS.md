# GitHub Copilot Instructions for Resume Search Algorithm Development

## Overview
This document provides instructions for using GitHub Copilot effectively while developing the Resume Search Algorithm using the RAG (Retrieval-Augmented Generation) approach. It includes prompts and guidelines for generating, editing, and debugging code related to the project.

## Using GitHub Copilot

### 1. Generating Code
When you need to generate code for specific functionalities, use the following prompts:

- **For Express Route Handlers:**
  - "Create an Express route handler for the health check endpoint that returns the application status and version."
  
- **For Services:**
  - "Implement a method in the SearchService to perform BM25 search on resumes based on a query and filters."
  
- **For Middleware:**
  - "Write a middleware function that logs incoming requests, including the request ID, method, and endpoint."

### 2. Editing Code
To modify existing code, provide context about what needs to be changed:

- **For Adding New Features:**
  - "Add a new endpoint in the search route to handle hybrid search requests."
  
- **For Refactoring:**
  - "Refactor the LoggingService to include structured logging for error handling."

### 3. Debugging Code
When debugging, describe the issue clearly:

- **For Error Handling:**
  - "Identify and fix the issue in the errorHandler middleware that causes it to not return the correct status code for validation errors."
  
- **For Performance Issues:**
  - "Optimize the vector search method in the SearchService to improve response time."

### 4. Writing Tests
To generate unit tests or integration tests, use prompts like:

- **For Unit Tests:**
  - "Create unit tests for the EmbeddingService to ensure it correctly interacts with the Mistral API."
  
- **For Integration Tests:**
  - "Write integration tests for the /v1/search endpoint to validate the end-to-end search functionality."

### 5. Documentation
For generating documentation or comments, use:

- **For API Documentation:**
  - "Generate API documentation for the /v1/embeddings endpoint, including request and response formats."
  
- **For Code Comments:**
  - "Add comments to the SearchService methods explaining the logic behind BM25 and vector search implementations."

## Best Practices
- Always review the generated code for accuracy and adherence to project standards.
- Use descriptive prompts to guide Copilot in generating relevant code.
- Combine Copilot suggestions with your own expertise to enhance code quality.
- Regularly commit changes to track progress and maintain version control.

By following these instructions, you can leverage GitHub Copilot to streamline the development process of the Resume Search Algorithm effectively.