const fs = require("fs");

export default async function handler(req, res) {
  let data = await fs.readFileSync("search-console-data.json");
  data = await JSON.parse(data);

  res.status(200).json({ name: "John Doe" });
}
