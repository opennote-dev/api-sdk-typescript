import { OpennoteClient, VideoAPIRequestMessage } from '../src';

const SEPARATOR = "================================\n";

// Helper function to sleep for a given number of milliseconds
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  // Initialize client with API key from environment variable
  const client = new OpennoteClient(process.env.OPENNOTE_API_KEY || '');
  
  try {
    console.log(SEPARATOR);
    console.log("Creating Video...");
    
    // Create messages for video generation
    const messages: VideoAPIRequestMessage[] = [
      {
        role: "user",
        content: "Make a video about the Silk Road"
      }
    ];
    
    // Create video job
    const response = await client.video.create({
      model: "picasso",
      messages: messages,
      include_sources: true,
      search_for: "Silk Road History",
      source_count: 5,
      upload_to_s3: true,
      title: "The Silk Road",
    });
    
    console.log("\nVideo Creation Response:");
    console.log(JSON.stringify(response, null, 4));
    console.log(SEPARATOR);
    
    // Poll for video status if creation was successful
    if (response.success && response.video_id) {
      let statusCheckCount = 0;
      let finalStatus: any;
      
      while (true) {
        console.log(SEPARATOR);
        console.log(`Checking Video Status (#${statusCheckCount})...`);
        
        const status = await client.video.status(response.video_id);
        
        console.log("\n", JSON.stringify(status, null, 4));
        console.log(SEPARATOR);
        
        if (status.status === "pending") {
          statusCheckCount++;
          await sleep(15000); // Wait 15 seconds before next check
          continue;
        } else {
          finalStatus = status;
          break;
        }
      }
      
      console.log(SEPARATOR);
      console.log("Video Final Status\n");
      console.log(JSON.stringify(finalStatus, null, 4));
      console.log(SEPARATOR);
      
      // Handle different completion states
      if (finalStatus.status === "completed" && finalStatus.response) {
        console.log("Video generated successfully!");
        if (finalStatus.response.s3_url) {
          console.log(`Video URL: ${finalStatus.response.s3_url}`);
        }
      } else if (finalStatus.status === "failed") {
        console.error("Video generation failed:", finalStatus.error);
      }
    } else {
      console.error("Failed to create video job:", response.message);
    }
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

// Run the example
main().catch(console.error);