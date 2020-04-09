//Id: 201701273
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

  const coll_customers = db.collection("customers");
  const coll_transactions = db.collection("transactions");

  let get_transactions = new Promise((resolve, reject) => {
    let query = { $or: [] };
    coll_customers.find({ username: "ashley97" }).toArray(function (err, docs) {
      assert.equal(err, null);
      console.log("Found the following records");
      for (let i = 0; i < docs[0].accounts.length; i++) {
        query.$or.push({ account_id: docs[0].accounts[i] });
      }
      resolve(query);
    });
  });

  get_transactions.then((query) => {
    coll_transactions.find(query).toArray(function (err, docs) {
      let sum = 0;
      docs.map((transaction) => {
        transaction.transactions.map((tran) => {
          sum += tran.amount;
        });
      });
      console.log(sum);
    });
  });

  setTimeout(() => {
    client.close();
  }, 1000);
});
