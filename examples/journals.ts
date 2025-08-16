import { OpennoteClient } from '../src';

const SEPARATOR = "================================\n";

async function main() {
  // Initialize client with API key from environment variable
  const client = new OpennoteClient(process.env.OPENNOTE_API_KEY || '');
  
  try {
    // Fetch list of journals
    const journalsResponse = await client.journals.list();
    
    console.log(SEPARATOR);
    console.log("Set of Journals:");
    console.log(JSON.stringify(journalsResponse, null, 4));
    console.log(SEPARATOR);
    
    // If successful and journals exist, fetch content of the first journal
    if (journalsResponse.success && journalsResponse.journals && journalsResponse.journals.length > 0) {
      const firstJournalId = journalsResponse.journals[0].id;
      const firstContent = await client.journals.content(firstJournalId);
      
      console.log(SEPARATOR);
      console.log("First Journal Content:");
      console.log(JSON.stringify(firstContent, null, 4));
      console.log(SEPARATOR);
    } else {
      console.log("No journals found or request was unsuccessful.");
    }
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

// Run the example
main().catch(console.error);