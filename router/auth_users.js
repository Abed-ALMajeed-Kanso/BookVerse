const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("../data/booksdb.js");
const regd_users = express.Router();
const { users, isValid, authenticatedUser } = require('../data/usersdb.js');
const axios = require('axios');

regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) return res.status(404).json({message: 'Please enter both a username or password is missing from login'})

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', {expiresIn: 60 * 60})

    req.session.authorization = {
      accessToken, username
    }

    return res.status(200).send('User successfully logged in.')
  }
  return res.status(208).json({message: "Invalid login. Check your username and password."})

});

regd_users.post("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username
  const isbn = req.params.isbn
  const review = req.body.review
  const book = books[isbn]

  if (book.reviews[username]) return res.send(`${username} already has a review for "${book.title}" by ${book.author}`)
  book.reviews[username] = review
  res.send(`User ${username} successfully added a review to book ${book.title} by ${book.author}`)
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username
  const isbn = req.params.isbn
  const review = req.body.review
  const book = books[isbn]
  
  if (!book.reviews[username]) return res.send(`${username} does not yet have a review for "${book.title}" by ${book.author}`)
  book.reviews[username] = review
  res.send(`User ${username} successfully updated their review for book ${book.title} by ${book.author}`)
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username
  const isbn = req.params.isbn
  const book = books[isbn]
  
  if (!book.reviews[username]) return res.send(`${username} does not yet have a review for "${book.title}" by ${book.author}`)
  delete book.reviews[username]
  res.send(`User ${username} successfully deleted their review for book "${book.title}" by ${book.author}`)
});

const login = async (username, password) => {
  try {
    const response = await axios.post('http://localhost:5000/login', {
      username,
      password
    });
    console.log('Login Success:', response.data);
  } catch (error) {
    console.error('Login Error:', error.response.data);
  }
};

const addReview = async (isbn, review, accessToken) => {
  try {
    const response = await axios.post(`http://localhost:5000/auth/review/${isbn}`, {
      review
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    console.log('Review Added:', response.data);
  } catch (error) {
    console.error('Add Review Error:', error.response.data);
  }
};

const updateReview = async (isbn, review, accessToken) => {
  try {
    const response = await axios.put(`http://localhost:5000/auth/review/${isbn}`, {
      review
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    console.log('Review Updated:', response.data);
  } catch (error) {
    console.error('Update Review Error:', error.response.data);
  }
};

const deleteReview = async (isbn, accessToken) => {
  try {
    const response = await axios.delete(`http://localhost:5000/auth/review/${isbn}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    console.log('Review Deleted:', response.data);
  } catch (error) {
    console.error('Delete Review Error:', error.response.data);
  }
};

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
