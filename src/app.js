//Third party libraries
require("module-alias/register");
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { generateUrl } = require("./utils/db-url-generate/db-url-generate");
const fs = require("fs");

//Api routes
const routers = require("./routes");

//Database connection
const { connectDB, createDatabaseToken } = require("./config/index");

//Server port number
const PORT = process.env.PORT || 5000;

const app = express();

connectDB();

//Middlewares
app.use(express.json());
app.use(cors());
app.use(
  fileUpload({
    limits: { fileSize: 250 * 1024 * 1024 },
  })
);

// app.use((err, req, res, next) => {
//   res.status(err.status || 500).json({
//       message: err.message || 'Internal Server Error',
//       error: err,
//   });
// });

app.use("/", routers);

const getGitDetails = () => {
  let gitCommitHash = "";
  try {
    gitCommitHash = fs.readFileSync("git-info.txt", "utf8").trim().split("\n");
  } catch (err) {
    console.error("Error reading git commit hash:", err);
  }

  return { gitCommitHash };
};

app.get("/", async (req, res) => {
  try {
    const gitDetails = getGitDetails();

    res.send({
      message: "Welcome to jago-merchback Server! at Staging",
      gitDetails,
    });
  } catch (error) {
    console.error("Failed to retrieve deployment data:", error);
    res.status(500).send({ error: error.message });
  }
});

createDatabaseToken({ name: "db-token", dburi: generateUrl("db-token") });

app.all("*", (req, res) => {
  res.status(404).send({
    success: false,
    resultCode: -1021,
    message: "Api end point is not available",
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
