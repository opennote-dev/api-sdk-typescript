# Opennote Typescript SDK

This is the Typescript SDK for the Opennote Video API. [Read the documentation here and see more examples](https://docs.opennote.com/video-api/introduction).

## Installation

```bash
npm/bun/pnpm/yarn install opennote
```

## Usage

```typescript
import { OpennoteVideoClient } from "opennote";

const client = new OpennoteVideoClient({ apiKey: "your_api_key" });

// Create a video
const video = await client.video.create({
    sections: 5,
    model: "feynman2",
    messages: [{ role: "user", content: "Hello, world!" }],
});

// Get the status of a video
const status = await client.video.status(video.videoId);
```