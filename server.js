const express = require("express");
const axios = require("axios");

const cors = require("cors");
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const allowedOrigins = [process.env.FRONTEND_URL];

const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 8083;

app.get("/health", (_, res) => {
  res.send("OK");
});

// Endpoint to get file content from URL
app.get("/get-file", async (req, res) => {
  const fileUrl = req.query.url;
  if (!fileUrl) {
    res.status(400).send("URL parameter is required");
    return;
  }
  try {
    // Perform the HTTP GET request to get the file content
    const response = await axios({
      url: fileUrl,
      method: "GET",
      responseType: "arraybuffer",
    });
    const contentType = response.headers["content-type"];

    // Set content type in the response header based on what was retrieved
    res.setHeader("Content-Type", contentType);
    const contentDisposition = response.headers["content-disposition"];

    // Extract the file name from the content disposition header and set it in the response header
    res.setHeader(
      "Access-Control-Expose-Headers",
      "X-Filename, Content-Type, Content-Length"
    );
    const filenameMatch = contentDisposition
      ? contentDisposition.match(/filename="([^"]+)"/)
      : null;
    const fileName = filenameMatch ? filenameMatch[1] : "unknown_file_name";
    res.setHeader("X-Filename", fileName);

    res.send(response.data);
  } catch (error) {
    res.status(500).send("An error occurred while fetching the file content.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
