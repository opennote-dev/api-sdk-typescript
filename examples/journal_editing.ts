/**
 * To test, first create a journal on Opennote at https://opennote.com/home and get the Journal ID
 * 
 * This is found in the url, such as https://opennote.com/journals/<JOURNAL_ID>
 * 
 * This is referenced below as JOURNAL_ID ->
 */

import { OpennoteClient } from '../src';
import { HeadingBlock, ImageBlock, Position, ParagraphBlock } from '../src/block_types';
import { createBlock, updateBlock, deleteBlock } from '../src/util/edit_operations';

const JOURNAL_ID = '...'; // Replace with your journal ID

async function main() {
  const client = new OpennoteClient({
    api_key: process.env.OPENNOTE_API_KEY!
  });
  
  // Get the journal model info
  const journalModel = await client.journals.editor.modelInfo({ journal_id: JOURNAL_ID });
  
  // Get the last block from the journal
  const lastBlock = journalModel.model?.content?.[journalModel.model.content.length - 1];
  if (!lastBlock) {
    throw new Error('No last block found');
  }
  
  // Try all the possible edit operations below!
  
  await client.journals.editor.edit({
    journal_id: JOURNAL_ID,
    operations: [
      // Uncomment any of these to test:
      
      // Create a new image block after the last block
      createBlock(
        new ImageBlock(
          "https://contentfs-opennote-us-east-1.s3.us-east-1.amazonaws.com/20250922113116-ce36a32a-d8e8-4102-8f58-ba05311b8553.png", 
          "Barry B. Benson"
        ),
        lastBlock.attrs.id,
        Position.AFTER
      ),
      
      // Update the last block to be a heading
      // updateBlock(
      //   lastBlock.attrs.id,
      //   new HeadingBlock(3, "Updated Block Through SDK")
      // ),
      
      // Delete the last block
      // deleteBlock(lastBlock.attrs.id)
    ],
    sync_realtime_state: true
  })
  
  console.log("Done");
}

// Run the example
main().catch(console.error);