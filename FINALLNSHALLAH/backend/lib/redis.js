/*import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redis = new Redis(process.env.UPSTASH_REDIS_URL);
*/

// Create a mock Redis client since we're not using Redis
export const redis = {
    get: async () => null,
    set: async () => null,
    del: async () => null,
    on: () => null,  // Add this to handle event listeners
    // Add other Redis methods you're using as needed
  };
  
  // Log that we're running without Redis
  console.log("Running without Redis - using mock implementation");