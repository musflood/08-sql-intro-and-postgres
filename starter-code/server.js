'use strict';

// DONE: Install and require the NPM Postgres package 'pg' into your server.js, and ensure that it is then listed as a dependency in your package.json
const fs = require('fs');
const express = require('express');
const pg = require('pg');

// REVIEW: Require in body-parser for post requests in our server. If you want to know more about what this does, read the docs!
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const app = express();

// DONE: Complete the connection string for the url that will connect to your local postgres database
// Windows and Linux users; You should have retained the user/pw from the pre-work for this course.
// Your url may require that it's composed of additional information including user and password
// const conString = 'postgres://USER:PASSWORD@HOST:PORT/DBNAME';
const conString = 'postgres://localhost:5432';

// DONE: Our pg module has a Client constructor that accepts one argument: the conString we just defined.
//       This is how it knows the URL and, for Windows and Linux users, our username and password for our
//       database when client.connect is called on line 26. Thus, we need to pass our conString into our
//       pg.Client() call.
const client = new pg.Client(conString);

// REVIEW: Use the client object to connect to our DB.
client.connect();


// REVIEW: Install the middleware plugins so that our app is aware and can use the body-parser module
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./public'));


// REVIEW: Routes for requesting HTML resources
app.get('/new', function(request, response) {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Identify which line(s) of code from the client-side blog app are interacting with this particular piece of `server.js`, and the name of the method. Do those lines of code interact with or invoke a different portion of the blog, and if so, where? What part of CRUD is being enacted/managed by this particular piece of code?
  /*
   - Corresponds to number 5 in the diagram.
   - There is no line of code in the blog app that interacts with this particular line of code. It is a new route for the user's browser to go to.
   - No, this does not invoke any part of the blog.
   - READ
  */
  response.sendFile('new.html', {root: './public'});
});


// REVIEW: Routes for making API calls to use CRUD Operations on our database
app.get('/articles', function(request, response) {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Identify which line(s) of code from the client-side blog app are interacting with this particular piece of `server.js`, and the name of the method. Do those lines of code interact with or invoke a different portion of the blog, and if so, where? What part of CRUD is being enacted/managed by this particular piece of code?
  /*
   - Corresponds to numbers 3, 4, and 5 in the diagram.
   - article.js interacts with this code at line 46 in Article.fetchAll
   - Article.fetchAll invokes Article.loadAll, when the request is successful, which in turn invoke the Article constructor and pushes the new objects to the array Article.all.
   - READ
  */
  client.query('SELECT * FROM articles')
  .then(function(result) {
    response.send(result.rows);
  })
  .catch(function(err) {
    console.error(err)
  })
});

app.post('/articles', function(request, response) {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Identify which line(s) of code from the client-side blog app are interacting with this particular piece of `server.js`, and the name of the method. Do those lines of code interact with or invoke a different portion of the blog, and if so, where? What part of CRUD is being enacted/managed by this particular piece of code?
  /*
   - Corresponds to numbers 3 and 5 in the diagram. ( 4 being if it was successful or not)
   - article.js interacts with this code at line 70 in Article.prototype.insertRecord
   - No, this does not invoke any other part of the blog, besides acting on the instance of the object.
   - CREATE
  */
  client.query(
    `INSERT INTO
    articles(title, author, "authorUrl", category, "publishedOn", body)
    VALUES ($1, $2, $3, $4, $5, $6);
    `,
    [
      request.body.title,
      request.body.author,
      request.body.authorUrl,
      request.body.category,
      request.body.publishedOn,
      request.body.body
    ]
  )
  .then(function() {
    response.send('insert complete')
  })
  .catch(function(err) {
    console.error(err);
  });
});

app.put('/articles/:id', function(request, response) {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Identify which line(s) of code from the client-side blog app are interacting with this particular piece of `server.js`, and the name of the method. Do those lines of code interact with or invoke a different portion of the blog, and if so, where? What part of CRUD is being enacted/managed by this particular piece of code?
  /*
   - Corresponds to numbers 3 and 5 in the diagram. (4 being if it was successful or not)
   - article.js interacts with this code at line 89 in Article.prototype.updataRecord
   - No, this does not invoke any other part of the blog, besides acting on the instance of the object.
   - UPDATE
  */
  client.query(
    `UPDATE articles
    SET
      title=$1, author=$2, "authorUrl"=$3, category=$4, "publishedOn"=$5, body=$6
    WHERE article_id=$7;
    `,
    [
      request.body.title,
      request.body.author,
      request.body.authorUrl,
      request.body.category,
      request.body.publishedOn,
      request.body.body,
      request.params.id
    ]
  )
  .then(function() {
    response.send('update complete')
  })
  .catch(function(err) {
    console.error(err);
  });
});

app.delete('/articles/:id', function(request, response) {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Identify which line(s) of code from the client-side blog app are interacting with this particular piece of `server.js`, and the name of the method. Do those lines of code interact with or invoke a different portion of the blog, and if so, where? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  /*
   - Corresponds to numbers 3 and 5 in the diagram. (4 being if it was successful or not)
   - article.js interacts with this code at line 78 in Article.prototype.deleteRecord
   - No, this does not invoke any other part of the blog, besides acting on the instance of the object.
   - DESTROY
  */
  client.query(
    `DELETE FROM articles WHERE article_id=$1;`,
    [request.params.id]
  )
  .then(function() {
    response.send('Delete complete')
  })
  .catch(function(err) {
    console.error(err);
  });
});

app.delete('/articles', function(request, response) {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Identify which line(s) of code from the client-side blog app are interacting with this particular piece of `server.js`, and the name of the method. Do those lines of code interact with or invoke a different portion of the blog, and if so, where? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  /*
   - Corresponds to numbers 3 and 5 in the diagram. (4 being if it was successful or not)
   - article.js interacts with this code at line 59 in Article.truncaeTable
   - No, this does not invoke any other part of the blog.
   - DESTROY
  */
  client.query(
    'DELETE FROM articles;'
  )
  .then(function() {
    response.send('Delete complete')
  })
  .catch(function(err) {
    console.error(err);
  });
});

// COMMENT: What is this function invocation doing?
// Put your response here...
// this will create a table if it doesn't exist, then it calls the loadArticles which fills the DB if empty
loadDB();

app.listen(PORT, function() {
  console.log(`Server started on port ${PORT}!`);
});


//////// ** DATABASE LOADER ** ////////
////////////////////////////////////////
function loadArticles() {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Identify which line(s) of code from the client-side blog app are interacting with this particular piece of `server.js`, and the name of the method. Do those lines of code interact with or invoke a different portion of the blog, and if so, where? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  /*
   - Corresponds to numbers 3 and 4 in the diagram.
   - server.js interacts with this code at line 208 in loadDB, it does not interct with the client-side blog app
   - No, this does not invoke any other part of the blog
   - CREATE
  */
  client.query('SELECT COUNT(*) FROM articles')
  .then(result => {
    // REVIEW: result.rows is an array of objects that Postgres returns as a response to a query.
    //         If there is nothing on the table, then result.rows[0] will be undefined, which will
    //         make count undefined. parseInt(undefined) returns NaN. !NaN evaluates to true.
    //         Therefore, if there is nothing on the table, line 151 will evaluate to true and
    //         enter into the code block.
    if(!parseInt(result.rows[0].count)) {
      fs.readFile('./public/data/hackerIpsum.json', (err, fd) => {
        JSON.parse(fd.toString()).forEach(ele => {
          client.query(`
            INSERT INTO
            articles(title, author, "authorUrl", category, "publishedOn", body)
            VALUES ($1, $2, $3, $4, $5, $6);
          `,
            [ele.title, ele.author, ele.authorUrl, ele.category, ele.publishedOn, ele.body]
          )
        })
      })
    }
  })
}

function loadDB() {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Identify which line(s) of code from the client-side blog app are interacting with this particular piece of `server.js`, and the name of the method. Do those lines of code interact with or invoke a different portion of the blog, and if so, where? What part of CRUD is being enacted/managed by this particular piece of code?
  // Put your response here...
  /*
   - Corresponds to numbers 3 and 4 in the diagram.
   - server.js invokes at line 159, it does not interct with the client-side blog app
   - No, this does not invoke any other part of the blog
   - CREATE // his will create a table if it doesn't exist, then it calls the loadArticles which fills the DB if empty
  */
  client.query(`
    CREATE TABLE IF NOT EXISTS articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255) NOT NULL,
      "authorUrl" VARCHAR (255),
      category VARCHAR(20),
      "publishedOn" DATE,
      body TEXT NOT NULL);`
    )
    .then(function() {
      loadArticles();
    })
    .catch(function(err) {
      console.error(err);
    }
  );
}
