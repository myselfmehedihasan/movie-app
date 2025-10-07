import { Client, Databases, ID, Query } from "appwrite";

/**
 * Appwrite project configuration
 * * Stores project ID, database ID, table ID, and endpoint
 * TODO: Move sensitive info to a secure server-side environment if needed
 */
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;

/**
 * Initialize Appwrite client
 * * Sets endpoint and project
 */
const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID);

/** Initialize Appwrite databases instance */
const databases = new Databases(client);

/** Export client and database constants */
export { client, databases, DATABASE_ID, TABLE_ID };

/**
 * Update or create search count document
 * * Tracks how many times a movie search term has been searched
 * * Now stores additional movie data (release_date, vote_average)
 * @param {string} searchTerm - Term entered by the user
 * @param {Object} movie - Movie object from TMDB API
 * @param {number} movie.id - TMDB numeric ID
 * @param {string} movie.poster_path - Movie poster path
 * @param {string} movie.release_date - Movie release date
 * @param {number} movie.vote_average - Movie rating
 * TODO: Add error handling for network or permission errors
 */
export const updateSearchCount = async (searchTerm, movie) => {
  try {
    // 1. Check if the search term already exists
    const result = await databases.listDocuments(DATABASE_ID, TABLE_ID, [
      Query.equal("searchTerm", searchTerm),
    ]);

    if (result.documents.length > 0) {
      /**
       * 2. If found, update the count and movie data
       * * Increment count by 1
       * * Update release_date and vote_average in case they changed
       */
      const doc = result.documents[0];
      await databases.updateDocument(DATABASE_ID, TABLE_ID, doc.$id, {
        count: doc.count + 1,
        release_date: movie.release_date || "",
        vote_average: movie.vote_average || 0,
      });
    } else {
      /**
       * 3. If not found, create a new document
       * * Stores searchTerm, initial count, TMDB movie ID, poster URL, release_date, and vote_average
       */
      await databases.createDocument(DATABASE_ID, TABLE_ID, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        release_date: movie.release_date || "",
        vote_average: movie.vote_average || 0,
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
  }
};

/**
 * Get top trending movies based on search count
 * * Returns top 10 searched movies with all details
 * @returns {Array} Array of movie documents from Appwrite
 */
export const getTrendingMovies = async () => {
  try {
    const result = await databases.listDocuments(DATABASE_ID, TABLE_ID, [
      Query.limit(10),
      Query.orderDesc("count"),
    ]);
    return result.documents;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
};