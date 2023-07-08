const MongoClient = require('mongodb').MongoClient;

async function removeSampleTracks() {
  const uri = 'mongodb+srv://Antoine:OoNsBwcb4Gi0cKmQ@cluster0.h9uq5il.mongodb.net/Project_FUXI?retryWrites=true&w=majority&ssl=true'
  const dbName = 'Project_FUXI'; // Replace with your database name
  const collectionName = 'tracks'; // Replace with your collection name

  let client; // Declare the client variable

  try {
    client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const filter = { Sample: true };
    const result = await collection.deleteMany(filter);

    console.log(`${result.deletedCount} documents removed.`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (client) {
      client.close();
    }
  }
}

// Call the function to remove sample tracks
removeSampleTracks();
