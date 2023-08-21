const express = require("express");
const mysql = require("mysql"); // You need to require the mysql module
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "routes")));

// Establishing database connection using pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "student",
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "routes", "storData.html"));
});
///  this api get data from db
app.get("/data", (req, resp) => {
  pool.query("select * from picnic", (err, result) => {
    if (err) {
      resp.send("error in api");
    } else {
      resp.send(result);
    }
  });
});
//// this api is insert data in to db
app.post("/form-submit", (req, res) => {
  const { name, father_name, Class } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to the database: " + err.stack);
      res.status(500).send("Internal Server Error");
      return;
    }

    const sql =
      "INSERT INTO picnic (name, father_name, Class) VALUES (?, ?, ?)";
    const values = [name, father_name, Class];

    connection.query(sql, values, (error, results) => {
      connection.release();

      if (error) {
        console.error("Error inserting data: " + error.stack);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.sendFile(path.join(__dirname, "routes", "out.html"));
    });
  });
});

app.listen(3030, () => {
  console.log("Server is running on port 3030");
});
