// Create web server

// Import modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Create router
const commentRouter = express.Router();

// Import models
const { Comment } = require('../models/comment');
const { BlogPost } = require('../models/blog-post');

// Parse JSON
const jsonParser = bodyParser.json();

// Get all comments
commentRouter.get('/', (req, res) => {
  Comment
    .find()
    .then(comments => {
      res.json(comments.map(comment => comment.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
});

// Get comment by id
commentRouter.get('/:id', (req, res) => {
  Comment
    .findById(req.params.id)
    .then(comment => res.json(comment.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
});

// Create a new comment
commentRouter.post('/', jsonParser, (req, res) => {
  const requiredFields = ['author', 'content', 'blogPostId'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
    }
  }

  BlogPost
    .findById(req.body.blogPostId)
    .then(blogPost => {
      if (blogPost) {
        Comment
          .create({