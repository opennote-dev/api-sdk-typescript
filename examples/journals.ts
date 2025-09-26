import { OpennoteClient } from '../src';

const SEPARATOR = "================================\n";

async function main() {
  // Initialize client with API key from environment variable
  const client = new OpennoteClient({ api_key: process.env.OPENNOTE_API_KEY || '' });
  
  try {
    // Create a new journal
    console.log(SEPARATOR);
    console.log("Creating a new journal...");
    const createResponse = await client.journals.create({ 
      title: "My New Journal" 
    });
    console.log("Create Journal Response:");
    console.log(JSON.stringify(createResponse, null, 4));
    console.log(SEPARATOR);

    // Rename the journal if creation was successful
    if (createResponse.success && createResponse.journal_id) {
      console.log("Renaming the journal...");
      const renameResponse = await client.journals.rename({
        journal_id: createResponse.journal_id,
        title: "My Renamed Journal"
      });
      console.log("Rename Journal Response:");
      console.log(JSON.stringify(renameResponse, null, 4));
      console.log(SEPARATOR);
    }

    // Fetch list of journals
    const journalsResponse = await client.journals.list();
    
    console.log(SEPARATOR);
    console.log("Set of Journals:");
    console.log(JSON.stringify(journalsResponse, null, 4));
    console.log(SEPARATOR);
    
    // If successful and journals exist, fetch content of the first journal
    if (journalsResponse.success && journalsResponse.journals && journalsResponse.journals.length > 0) {
      const firstJournalId = journalsResponse.journals[0].id;
      const firstContent = await client.journals.content({ journal_id: firstJournalId });
      
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