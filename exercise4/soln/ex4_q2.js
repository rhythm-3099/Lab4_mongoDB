// Id: 201701273
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

// Connection URL
const url = "mongodb://localhost:27017";

// Database Name
const dbName = "bank";

// Create a new MongoClient
const client = new MongoClient(url);

// Use connect method to connect to the Server
client.connect(function (err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  const collection = db.collection("accounts");

  let promise = new Promise((resolve, reject) => {
    collection.find().toArray(function (err, docs) {
      assert.equal(err, null);
      console.log("Found the following records");
      resolve(docs);
    });
  });

  let data = new Promise((resolve, reject) => {
    promise.then((response) => {
      let data = response.filter((account) => {
        return account.products.indexOf("Commodity") > -1;
      });
      resolve(data);
    });
  });

  data.then((item) => {
    let sum = 0;
    for (let i = 0; i < item.length; i++) {
      sum += item[i].limit;
    }
    sum = sum / item.length;
    console.log(sum.toFixed(2));
  });

  setTimeout(() => {
    client.close();
  }, 3000);
});
