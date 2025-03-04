const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());

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
  console.log(`Server running on http://localhost:${PORT}`);
});
