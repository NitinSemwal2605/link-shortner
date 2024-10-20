const express = require("express");
const cors = require("cors"); // Import the cors package
const { connectToMongoDB } = require("./connect");
const app = express();
const port = 3000;
const urlRouter = require("./routes/url");
const { connect } = require("mongoose");
const URL = require("./models/url");

// Enable CORS
app.use(cors()); // Use the CORS middleware

connectToMongoDB("mongodb://127.0.0.1:27017/url-shortener")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(express.json());

app.use("/url", urlRouter);

app.get("/:shortID", async (req, res) => {
  const shortId = req.params.shortID;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );

  // Check if entry is found
  if (!entry) {
    return res.status(404).send("URL not found");
  }

  res.redirect(entry.redirectURL);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
