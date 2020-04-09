// Id: 201701273

const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

// Connection URL
const url = "mongodb://localhost:27017";

// Database Name
const dbName = "sales";

// Create a new MongoClient
const client = new MongoClient(url);

// Use connect method to connect to the Server
client.connect(function (err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  const collection = db.collection("sales");

  let promise = new Promise((resolve, reject) => {
    collection.find().toArray(function (err, docs) {
      assert.equal(err, null);
      console.log("Found the following records");
      resolve(docs);
    });
  });

  promise.then((response) => {
    // console.log(response);
    let data = response.map((item) => {
      return {
        store_id: item._id,
        total_sales: item.items.length,
      };
    });

    console.log(data);
  });

  client.close();
});
