const express = require('express');
const bodyParser = require('body-parser');
const mysql = require("mysql");
const cors = require('cors');

const server = express();
server.use(bodyParser.json());
server.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mitali",
  database: "dblibrary",
});

db.connect(function (error) {
  if (error) {
    console.log("Error Connecting to DB");
  } else {
    console.log("Successfully Connected to DB");
  }
});

server.listen(8088, function check(error) {
  if (error) {
    console.log("Error....dddd!!!!");
  } else {
    console.log("Started....!!!! 8088");
  }
});
// Handle the root URL
server.get("/", (req, res) => {
  res.send("Server is running!");
});

//Create

server.post("/api/book/add", (req, res) => {
  const { title, category, department } = req.body;
  if (!title || !category || !department) {
    res.status(400).send({ status: false, message: "Missing required data." });
    return;
  }

  const bookDetails = {
    title,
    category,
    department,
  };

  const sql = "INSERT INTO book SET ?";
  db.query(sql, bookDetails, (error, result) => {
    if (error) {
      console.error("Error inserting book:", error);
      res.status(500).send({ status: false, message: "Library creation failed." });
    } else {
      console.log("New book inserted with ID:", result.insertId);
      res.send({ status: true, message: "Library created successfully." });
    }
  });
});

server.get("/api/books", (req, res) => {
    const sql = "SELECT * FROM book";
    db.query(sql, (error, result) => {
      if (error) {
        console.error("Error fetching books:", error);
        res.status(500).send({ status: false, message: "Error fetching books." });
      } else {
        res.send(result);
      }
    });
  });

server.get("/api/book/:id", (req, res) => {
    const bookid = req.params.id;
    console.log("Fetching book with ID:", bookid); // Log the ID to check if the request is reaching the server
    const sql = "SELECT * FROM book WHERE id = ?";
    db.query(sql, [bookid], (error, result) => {
      if (error) {
        console.error("Error fetching book:", error);
        res.status(500).send({ status: false, message: "Error fetching book." });
      } else {
        if (result.length === 0) {
          console.log("Book not found with ID:", bookid); // Log if the book is not found in the database
          res.status(404).send({ status: false, message: "Book not found." });
        } else {
          console.log("Book found with ID:", bookid); // Log if the book is found in the database
          res.send({ status: true, data: result });
        }
      }
    });
  });
  //Book updation
  server.put("/api/book/update/:id", (req, res) => {
    const bookId = req.params.id;
    const { title, category, department } = req.body;
  
    // Check for missing data
    if (!title || !category || !department) {
      res.status(400).send({ status: false, message: "Missing required data." });
      return;
    }
  
    const sql = "UPDATE book SET title = ?, category = ?, department = ? WHERE id = ?";
    db.query(sql, [title, category, department, bookId], (error, result) => {
      if (error) {
        console.error("Error updating book:", error);
        res.status(500).send({ status: false, message: "Book update failed." });
      } else {
        console.log("Book updated with ID:", bookId);
        res.send({ status: true, message: "Book updated successfully." });
      }
    });
  });
  // DELETE method to delete a specific book by ID
server.delete("/api/book/delete/:id", (req, res) => {
    const bookId = req.params.id;
  
    const sql = "DELETE FROM book WHERE id = ?";
    db.query(sql, [bookId], (error, result) => {
      if (error) {
        console.error("Error deleting book:", error);
        res.status(500).send({ status: false, message: "Book deletion failed." });
      } else {
        if (result.affectedRows === 0) {
          console.log("Book not found with ID:", bookId);
          res.status(404).send({ status: false, message: "Book not found." });
        } else {
          console.log("Book deleted with ID:", bookId);
          res.send({ status: true, message: "Book deleted successfully." });
        }
      }
    });
  });
  
  