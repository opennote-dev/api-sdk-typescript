import { OpennoteClient } from '../src';

const SEPARATOR = "================================\n";

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  // Initialize client with API key from environment variable
  const client = new OpennoteClient(process.env.OPENNOTE_API_KEY || '');
  
  try {
    console.log(SEPARATOR);
    console.log("Creating Practice Problem Set...");

    const response = await client.practice.create({
      set_description: "Linear algebra concepts including matrices, eigenvalues, and vector spaces",
      count: 3,
      set_name: "Linear Algebra Practice",
      search_for_problems: true,
    });

    console.log("\nPractice Set Creation Response:");
    console.log(JSON.stringify(response, null, 4));

    console.log(SEPARATOR);

    let statusCheckCount = 0;
    let status;
    
    if (response.success && response.set_id) {
      while (true) {
        console.log(SEPARATOR);
        console.log(`Checking Practice Set Status (#${statusCheckCount})...`);
        status = await client.practice.status(response.set_id);
        
        console.log("\n", JSON.stringify(status, null, 4));
        console.log(SEPARATOR);
        
        if (status.status === "pending") {
          await sleep(10000);
          statusCheckCount++;
          continue;
        } else {
          break;
        }
      }
    }

    if (status) {
      console.log(SEPARATOR);
      console.log("Practice Set Final Status\n");
      console.log(JSON.stringify(status, null, 4));
      console.log(SEPARATOR);

      if (status.success && status.response?.problems && status.response.problems.length > 0) {
        console.log(SEPARATOR);
        console.log("Grading Example - First Problem...");
        
        const firstProblem = { ...status.response.problems[0] };
        
        // Add a student answer to the problem
        firstProblem.user_answer = "A matrix is a rectangular array of numbers. Eigenvalues are scalar values that represent how a matrix transforms vectors.";
        
        const gradeResponse = await client.practice.grade(firstProblem);
        
        console.log("\nGrading Response:");
        console.log(JSON.stringify(gradeResponse, null, 4));
        console.log(SEPARATOR);
      }
    }
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

main().catch(console.error);