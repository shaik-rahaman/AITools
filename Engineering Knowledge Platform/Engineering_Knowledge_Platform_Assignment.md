# Engineering Knowledge Platform -- Assignment Submission

------------------------------------------------------------------------

## A. Use Case Document

### Use Case Name

Engineering Knowledge Platform

### Use Case Description

An AI-powered centralized knowledge platform designed to accelerate
onboarding and enable engineering teams (QA, Developers, Ops) with
contextual, role-based access to organizational knowledge.

### Problem Statement

-   New joiners require 2--3 hours per day of senior guidance for
    multiple days.
-   Knowledge is scattered across documents, repositories, and informal
    conversations.
-   Inconsistent onboarding across QA, Dev, and Ops.
-   Repeated explanations consume senior bandwidth.

### Why This Use Case

Engineering teams frequently face repeated knowledge transfer efforts.
By centralizing documentation and enabling AI-based retrieval,
onboarding becomes structured, consistent, and scalable.

### Expected Benefits

-   40--60% reduction in senior onboarding effort
-   Faster time-to-productivity
-   Standardized knowledge sharing
-   Reduced early-stage errors
-   Long-term institutional knowledge retention

------------------------------------------------------------------------

## B. Input & Output Definition

### Input Sources

-   Project documentation (PDF, DOCX)
-   Architecture diagrams
-   CI/CD pipeline documentation
-   SOPs and onboarding guides
-   RCA and production issue documents
-   Jira workflow documentation
-   Git repository guidelines

### Output Produced by the Agent

-   Contextual answers based on user role (QA / Dev / Ops)
-   Personalized onboarding path (5-day structured guide)
-   Recommended documents and learning sequence
-   Process explanations
-   Knowledge gap analytics (future enhancement)

------------------------------------------------------------------------

## C. Architecture / Technical Document

### High-Level Architecture

Document Loader → Text Chunking → Embeddings → Vector Database →
Retriever → LLM → Web Interface\
Role-based personalization applied during retrieval stage.

### API-First Approach

REST APIs expose endpoints for: - Role selection - Query submission -
Document ingestion - Feedback capture

### Database Layer

-   Vector database for semantic search
-   Metadata tagging (Role, Module, Owner, Version)
-   Simple relational or document DB for user sessions and feedback

### Web Layer

-   Role selection screen (QA / Dev / Ops)
-   Chat interface for queries
-   Suggested onboarding plan dashboard
-   Admin interface for document uploads

### Design Simplicity

Single application layer. No microservices. Modular components. Build
incrementally and test each component independently.

------------------------------------------------------------------------

## D. Copilot Plan Mode Output

### 1. API -- First

1.  Create role selection API
2.  Create query processing API
3.  Create document ingestion API
4.  Create feedback capture API
5.  Implement retrieval orchestration logic

### 2. DB -- Second

1.  Setup vector database for embeddings
2.  Define metadata schema (Role, Module, Owner, Version)
3.  Setup simple user session storage
4.  Enable document indexing and re-indexing process

### 3. Web -- Third

1.  Build role selection UI
2.  Develop chat interface
3.  Display structured onboarding plan
4.  Add admin upload interface
5.  Integrate feedback mechanism

### 4. Design Guidelines

-   Keep architecture simple
-   Build small, testable modules
-   Avoid overengineering
-   Validate retrieval quality before expanding features
