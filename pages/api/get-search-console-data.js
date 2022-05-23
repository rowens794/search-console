const { google } = require("googleapis");
const dayjs = require("dayjs");
import PageData from "../../models/PageData";
import dbConnect from "../../utils/dbConnect";

const RETURN_ITEMS = 25000;

export default async function handler(req, res) {
  await dbConnect();
  let startingRecord = 0;
  let runSearch = true;

  while (runSearch) {
    let data = await getData(startingRecord, RETURN_ITEMS);
    await saveToDB(data.rows);

    startingRecord = startingRecord + RETURN_ITEMS;
    if (startingRecord / RETURN_ITEMS > 100) runSearch = false;
    if (data.rows.length < RETURN_ITEMS) {
      console.log("hit end of records");
      runSearch = false;
    }
    console.log(`retrieved page ${startingRecord / RETURN_ITEMS}`);
  }

  res.status(200).json({ name: "John Doe" });
}

const getData = (startingRecord, recordsToGet) => {
  let promise = new Promise(async (resolve, reject) => {
    let siteUrl = "sc-domain:www.intellispect.co";

    const auth = await google.auth.getClient({
      scopes: ["https://www.googleapis.com/auth/webmasters"],
    });

    const gsc = await google.webmasters({ version: "v3", auth });
    let response = await gsc.searchanalytics.query({
      siteUrl: siteUrl,
      requestBody: {
        startDate: "2021-06-01",
        endDate: dayjs(new Date()).format("YYYY-MM-DD"),
        dimensions: ["page", "date"],
        rowLimit: recordsToGet,
        startRow: startingRecord,
      },
    });

    resolve(response.data);
  });

  return promise;
};

const saveToDB = (data) => {
  return new Promise(async (res, rej) => {
    let pageDateArray = [];

    data.forEach((item) => {
      let ein = item.keys[0].slice(42, 51);

      pageDateArray.push({
        ein: ein,
        date: new Date(item.keys[1]),
        url: item.keys[0],
        clicks: item.clicks,
        impressions: item.impressions,
        position: item.position,
      });
    });

    console.log(pageDateArray.length);
    await PageData.insertMany(pageDateArray);

    res(null);
  });
};
