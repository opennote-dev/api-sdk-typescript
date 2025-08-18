# Opennote Typescript SDK

This is the official Typescript SDK for the Opennote API, providing access to both Video and Journals APIs. [Read the documentation here and see more examples](https://docs.opennote.com).

## Installation

```bash
npm install opennote
# or
yarn add opennote
# or
pnpm add opennote
# or
bun add opennote
```

## Quick Start

```typescript
import { OpennoteClient } from 'opennote';

// Initialize the client with your API key
const client = new OpennoteClient(process.env.OPENNOTE_API_KEY || 'your_api_key');
```

## Video API Usage

### Creating a Video

```typescript
import { OpennoteClient, VideoAPIRequestMessage } from 'opennote';

const client = new OpennoteClient(process.env.OPENNOTE_API_KEY || '');

// Define the messages for video generation
const messages: VideoAPIRequestMessage[] = [
  {
    role: "user",
    content: "Make a video about the Silk Road"
  }
];

// Create a video job
const response = await client.video.create({
  model: "picasso",
  messages: messages,
  include_sources: true,
  search_for: "Silk Road History",
  source_count: 5,
  upload_to_s3: true,
  title: "The Silk Road",
});

console.log(`Video ID: ${response.video_id}`);
```

### Checking Video Status

```typescript
// Poll for video status
const status = await client.video.status(response.video_id);

if (status.status === "completed" && status.response) {
  console.log(`Video URL: ${status.response.s3_url}`);
} else if (status.status === "pending") {
  console.log("Video is still processing...");
} else if (status.status === "failed") {
  console.error("Video generation failed:", status.error);
}
```

### Complete Video Example with Polling

```typescript
import { OpennoteClient, VideoAPIRequestMessage } from 'opennote';

// Helper function to sleep
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createVideoWithPolling() {
  const client = new OpennoteClient(process.env.OPENNOTE_API_KEY || '');
  
  try {
    // Create video
    const response = await client.video.create({
      model: "picasso",
      messages: [{ role: "user", content: "Explain quantum computing" }],
      include_sources: true,
      upload_to_s3: true,
      title: "Quantum Computing Explained",
    });
    
    if (!response.success || !response.video_id) {
      throw new Error(`Failed to create video: ${response.message}`);
    }
    
    // Poll for completion
    let status;
    do {
      await sleep(15000); // Wait 15 seconds between checks
      status = await client.video.status(response.video_id);
      console.log(`Status: ${status.status}`);
    } while (status.status === "pending");
    
    if (status.status === "completed" && status.response?.s3_url) {
      console.log(`Video ready: ${status.response.s3_url}`);
    } else {
      console.error("Video generation failed:", status.error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
```

## Journals API Usage

### Listing Journals

```typescript
import { OpennoteClient } from 'opennote';

const client = new OpennoteClient(process.env.OPENNOTE_API_KEY || '');

// Get all journals
const journalsResponse = await client.journals.list();

if (journalsResponse.success && journalsResponse.journals) {
  journalsResponse.journals.forEach(journal => {
    console.log(`${journal.title} (ID: ${journal.id})`);
    console.log(`  Created: ${journal.created_at}`);
    console.log(`  Updated: ${journal.updated_at}`);
  });
}

// Handle pagination
if (journalsResponse.next_page_token) {
  const nextPage = await client.journals.list(journalsResponse.next_page_token);
}
```

### Getting Journal Content

```typescript
// Get content of a specific journal
const journalId = 'your-journal-id';
const contentResponse = await client.journals.content(journalId);

if (contentResponse.success && contentResponse.content) {
  console.log(`Title: ${contentResponse.title}`);
  console.log(`Content: ${contentResponse.content}`);
  console.log(`Last updated: ${contentResponse.timestamp}`);
}
```

### Complete Journals Example

```typescript
import { OpennoteClient } from 'opennote';

async function displayAllJournals() {
  const client = new OpennoteClient(process.env.OPENNOTE_API_KEY || '');
  
  try {
    // List all journals
    const journalsResponse = await client.journals.list();
    
    if (!journalsResponse.success || !journalsResponse.journals) {
      throw new Error('Failed to fetch journals');
    }
    
    // Display each journal's content
    for (const journal of journalsResponse.journals) {
      console.log(`\n=== ${journal.title} ===`);
      
      const content = await client.journals.content(journal.id);
      if (content.success && content.content) {
        console.log(content.content);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## API Reference

### Client Configuration

```typescript
const client = new OpennoteClient(
  apiKey: string,          // Required: Your Opennote API key
  baseUrl?: string,        // Optional: API base URL (default: "https://api.opennote.com")
  timeout?: number,        // Optional: Request timeout in ms (default: 60000)
  maxRetries?: number      // Optional: Max retry attempts (default: 3)
);
```

### Video API Methods

- `client.video.create(params)` - Create a new video generation job
- `client.video.status(videoId)` - Check the status of a video generation job

### Journals API Methods

- `client.journals.list(pageToken?)` - List all journals with optional pagination
- `client.journals.content(journalId)` - Get the content of a specific journal

## Error Handling

All API methods may throw errors. It's recommended to wrap API calls in try-catch blocks:

```typescript
try {
  const response = await client.video.create(params);
  // Handle success
} catch (error) {
  console.error('API Error:', error);
  // Handle error
}
```

## Environment Variables

Store your API key securely using environment variables:

```bash
export OPENNOTE_API_KEY="your_api_key_here"
```

## More Examples

Check out the [examples](./examples) directory for complete working examples:

- [Video API Example](./examples/videos.ts)
- [Journals API Example](./examples/journals.ts)