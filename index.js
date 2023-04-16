const app = require('./app');
const port = 3000; // specifying the port

// listens for connection
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
