import { OpennoteClient } from '../src';

const SEPARATOR = "================================\n";

async function main() {
  // Initialize client with API key from environment variable
  const client = new OpennoteClient(process.env.OPENNOTE_API_KEY || '');
  
  try {
    // Create list of flashcards
    const flashcardsResponse = await client.flashcards.create({
      set_description: "The most important things to know about the Silk Road",
      count: 5
    });
    
    console.log(SEPARATOR);
    console.log("Set of Flashcards:");
    console.log(JSON.stringify(flashcardsResponse, null, 4));
    console.log(SEPARATOR);
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

main().catch(console.error);
