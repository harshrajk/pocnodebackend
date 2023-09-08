const express = require("express");
const app = express();
const port = 3001;
const cors = require('cors');

const db = require('./services/db');



app.use(cors());
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

    res.json({products: result[0]})
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});