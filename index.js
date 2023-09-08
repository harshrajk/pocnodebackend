const express = require("express");
const app = express();
const port = 3001;
const cors = require('cors');

const db = require('./services/db');



app.use(cors());
// app.use((req, res, next) => {
//   // Allow requests from your React app's origin (http://localhost:3000)
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//   // Allow certain HTTP methods
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   // Allow specific headers
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   // Allow cookies to be included in requests (if needed)
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   // Continue with the next middleware/route
//   next();
// });

app.use(express.static('public'));
app.use('/assets', express.static('assets'));

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

// Setup with table, seed some data !! 
app.get("/api/init", async(req, res) => {
    const result = await db.setup()
    console.log('Result', result);
    if(result.status === 'success'){
        return res.json({ 'stauts': "success", 'message': 'Initial DB/Table setup done!'})
    }
});


app.get("/api/get-products", async(req, res) => {
    const get_products_cmd = `SELECT * from products`;

    const result = await db.query(get_products_cmd);
     
  //   if (result[0][0].img_64 !== null) {
  //     result[0][0].img_64 = Buffer.from(result[0][0].img_64).toString('base64');
  //  }
    res.json({products: result[0]})
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});