const shortid = require("shortid");
const URL = require("../models/url"); // Fix this import

async function handleGenerateNewShortURL(req, res) {
  const shortID = shortid.generate();
  if (!req.body.url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const newUrl = await URL.create({
    shortId: shortID,
    redirectURL: req.body.url,
    visitHistory: [],
  });

  return res.json({ Id: shortID, url: newUrl });
}

module.exports = {
  handleGenerateNewShortURL,
};
