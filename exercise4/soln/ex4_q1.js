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

  const coll_customers = db.collection("customers");
  const coll_transactions = db.collection("transactions");
  const coll_accounts = db.collection("accounts");

  let get_user_data = new Promise((resolve, reject) => {
    let data = [];
    coll_accounts.find().toArray(function (err, docs) {
      assert.equal(err, null);
      console.log("Found the following records");
      // console.log(docs);
      data = docs.filter((item) => {
        return item.products.indexOf("InvestmentStock") === -1;
      });
      // console.log(data);
      resolve(data);
    });
  });

  let user_data = new Promise((resolve, reject) => {
    get_user_data.then((data) => {
      ///check for array of data is empty
      if (JSON.stringify(data) === JSON.stringify([])) {
        coll_customers.find().toArray(function (err, docs) {
          docs.map((user) => {
            console.log({
              owner_name: user.name,
              email: user.email,
              username: user.username,
              account_no: user.accounts,
            });
          });
          // console.log(docs);
        });
      }
    });
  });

  user_data.then(() => {});

  setTimeout(() => {
    client.close();
  }, 100);
});
