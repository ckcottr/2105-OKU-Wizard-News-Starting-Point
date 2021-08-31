const express = require("express");
const morgan = require("morgan")
const postBank = require("./postBank")
const app = express();
app.use(express.static('public'))



app.use(morgan('dev'));

app.get("/", (req, res) => {
  //first get list of posts
  const posts = postBank.list();
  //then prepare some html to send as an output
  const html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      ${posts.map(post => `
        <div class='news-item'>
          <p>
          <a href="/posts/${post.id}">${post.title}</a>
          <span class="news-position"><a href="/posts/${post.id}">${post.id}</a>. ▲</span>
            <small>(by <a href="/posts/${post.id}">${post.name}</a>)</small>
          </p>
          <small class="news-info">
          <a href="/posts/${post.id}">${post.upvotes}</a>upvotes | <a href="/posts/${post.id}">${post.date}</a>
          </small>
          
          
        </div>`
  ).join('')}
    </div>
  </body>
</html>`

  res.send(html)

});

app.get('/posts/:id', (req, res) => {
  const id = req.params.id;
  const post = postBank.find(id);

  const html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css"/>
  </head>
  <body>
    <div class="new-list">
      <header><img src="/logo.png"/>Wizard News</header>
        <div class="news-item">
         <p>
           <span class="news-position"></span>${post.title}
           <small>(by ${post.name})</small>
        </p>
       <span class= "news-position"><small>${post.date}</small></span>
       <br></br>
       ${post.content}
    </div>
  </body>
  </html>`

  if (!post.id) {
    const wrong = "DOESNT EXIST!"
    throw new Error(wrong)
  } else {
    res.send(html)
  }
})


const { PORT = 1337 } = process.env;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});