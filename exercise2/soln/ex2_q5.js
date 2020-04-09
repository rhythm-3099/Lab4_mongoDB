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

  const col_sales = db.collection("sales");
  const col_stock_replenish = db.collection("stock_replenish");

  let promise = new Promise((resolve, reject) => {
    col_sales.aggregate(
      [
        { $unwind: "$items" },
        {
          $group: {
            _id: { item_name: "$items.name", storeLocation: "$storeLocation" },
            sales: { $sum: "$items.quantity" },
          },
        },
        {
          $group: {
            _id: "$_id.item_name",
            sales_history: {
              $addToSet: {
                storeLocation: "$_id.storeLocation",
                quantity: "$sales",
              },
            },
          },
        },
      ],
      function (err, cursor) {
        assert.equal(err, null);
        cursor.toArray(function (err, documents) {
          resolve(documents);
        });
      }
    );
  });

  promise.then((data) => {
    col_stock_replenish.insertMany(data, function (err, r) {
      assert.equal(null, err);
      console.log(r.insertedCount);
    });
  });

  setTimeout(() => {
    client.close();
  }, 1000);
});
