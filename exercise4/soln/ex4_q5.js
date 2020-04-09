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

  let get_user = new Promise((resolve, reject) => {
    let query = { $or: [] };
    coll_customers
      .find({ name: "Leslie Martinez" })
      .toArray(function (err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        for (let i = 0; i < docs[0].accounts.length; i++) {
          query.$or.push({ account_id: docs[0].accounts[i] });
        }
        resolve(query);
      });
  });

  let get_account = new Promise((resolve, reject) => {
    get_user.then((user_query) => {
      coll_accounts.find(user_query).toArray(function (err, docs) {
        let data;
        data = docs.filter((item) => {
          return item.products.indexOf("Commodity") > -1;
        });
        data.map((item) => {
          coll_accounts.deleteMany(item, function (err, r) {
            assert.equal(null, err);
            assert.equal(1, r.deletedCount);
            console.log(r.deletedCount, "delete from accounts");
          });
        });
        resolve(data);
      });
    });
  });

  get_account.then((acc) => {
    let query = [];
    acc.map((a) => {
      query.push({ account_id: a.account_id });
    });
    query.map((item) => {
      coll_transactions.deleteMany(item, function (err, r) {
        assert.equal(null, err);
        assert.equal(1, r.deletedCount);
        console.log(r.deletedCount, "delete from transactions");
      });
    });
  });

  setTimeout(() => {
    client.close();
  }, 1000);
});
