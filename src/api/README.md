# QBank UI API Client

This folder contains the auto-generated types and the standard API client for the QBank UI. Use the exported `apiClient` methods in your React components/pages for all backend communication.

## Usage Example

```typescript
import { apiClient } from './api/apiClient';

// Fetch all prompt templates
const templates = await apiClient.getPromptTemplates();

// Create a new template
const newTemplate = await apiClient.createPromptTemplate({ name: 'New', description: '' });
```

All methods are fully typed for request and response objects.
