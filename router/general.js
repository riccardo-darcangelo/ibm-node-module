const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);
    console.log(password);
  if (!username && username.length > 1)
    return res.status(400).json({ error: "Name is required" });
  if (!password &&  password.length > 1)
    return res.status(400).json({error: "Password is required"});
  users.push({username: username,password: password,});
  res.status(200).json({ message: "user registered successfully.", users });
});


const getallBooks = new Promise((resolve, reject) => {
    if (Object.keys(books).length > 0) {
      resolve(books);
    } else {
      reject(new Error("Books Database is empty"));
    }
  });
  
  public_users.get('/', function(req, res) {
    getallBooks.then(function(books) {
      return res.status(300).json({message: JSON.stringify(books, null, 4)});
    }).catch(function(err) {
      return res.status(500).json({error: err.message});
    });
  });
  
  
  
  // Get book details based on ISBN
  public_users.get('/isbn/:isbn',function (req, res) {
  
    getallBooks.then(function (books) {
      let isbn = req.params.isbn;

      if (isbn in books) {
        return res.status(300).json(books[isbn]);
      } else {
        return res.status(404).send('Book not found with the given ISBN');
      }
  
    }).catch(function (err) {
      return res.status(500).json({error: err.message});
    });
  });
  
  // Get book details based on author
  public_users.get('/author/:author', function(req, res) {
    const author = req.params.author;
    const booksByAuthor = [];
  
    const getBooksbyauthor = new Promise(function(resolve, reject) {
      for (const isbn in books) {
        const book = books[isbn];
  
        if (book.author === author) {
          booksByAuthor.push(book);
        }
      }
  
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject(`No books found for author '${author}'`);
      }
    });
  
    getBooksbyauthor
        .then(function(result) {
          return res.status(200).json({message: result});
        })
        .catch(function(error) {
          return res.status(404).json({error: error});
        });
  });
  
  
  // Get all books based on title
  public_users.get("/title/:title",function (req, res) {
    const title = req.params.title;
    const booksByTitle = [];
  
    const getBooksByTitle = new Promise(function(resolve, reject) {
  
      for (const isbn in books) {
        const book = books[isbn];
        if (book.title === title) {
          booksByTitle.push(book);
        }
      }
      if (booksByTitle.length > 0) {
  
        resolve(booksByTitle);
      } else {
        reject(`No books found with Title '${title}'`);
      }
    });
  
 
    getBooksByTitle
        .then(function(result) {
          return res.status(200).json({message: result});
        })
        .catch(function(error) {
          return res.status(404).json({error: error});
        });
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbnbook = req.params.isbn;
    const book = books[isbnbook];
    res.send(book.reviews);

});

module.exports.general = public_users;
