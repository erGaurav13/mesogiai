const http = require('http');
const PORT = process.env.PORT || 3000;
const app = require('./app');
const connectDB = require('./src/db/db.config');
const server = http.createServer(app);

server.listen(PORT, async () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Server is running in development mode on port ${PORT}`);
  } else {
    console.log(`Server is running in production mode on port ${PORT}`);
  }
  try{

    await connectDB();
  }catch(Err) {
console.log(Err)
  }
});
