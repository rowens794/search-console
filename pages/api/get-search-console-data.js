const { google } = require("googleapis");
const fs = require("fs");
const dayjs = require("dayjs");

const RETURN_ITEMS = 25000;

export default async function handler(req, res) {
  let startingRecord = 0;
  let runSearch = true;
  let masterObj = {};

  while (runSearch) {
    let data = await getData(startingRecord, RETURN_ITEMS);
    masterObj = combineData(masterObj, data);
    startingRecord = startingRecord + RETURN_ITEMS;
    if (startingRecord / RETURN_ITEMS > 100) runSearch = false;
    if (data.rows.length < RETURN_ITEMS) {
      console.log("hit end of records");
      runSearch = false;
    }
    console.log(`retrieved page ${startingRecord / RETURN_ITEMS}`);
  }

  saveJSON(masterObj);

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

const combineData = (masterObj, newData) => {
  newData.rows.forEach((item) => {
    let url = item.keys[0];
    let date = item.keys[1];
    let { clicks, impressions, ctr, position } = item;
    if (masterObj[url]) {
      masterObj[url].push({
        date: new Date(date),
        clicks,
        impressions,
        ctr,
        position,
      });
    } else {
      masterObj[url] = [
        {
          date: new Date(date),
          clicks,
          impressions,
          ctr,
          position,
        },
      ];
    }
  });

  return masterObj;
};

const saveJSON = (masterObj) => {
  let promise = new Promise(async (resolve, reject) => {
    let keys = Object.keys(masterObj);
    keys.forEach((key) => {
      masterObj[key] = masterObj[key].sort((a, b) => {
        return a.date - b.date;
      });
    });

    let data = await JSON.stringify(masterObj);
    await fs.writeFileSync("search-console-data.json", data);

    resolve(null);
  });

  return promise;
};
