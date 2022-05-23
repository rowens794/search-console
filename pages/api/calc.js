const dayjs = require("dayjs");
import PageData from "../../models/PageData";
import dbConnect from "../../utils/dbConnect";

let START_DATE = "1/1/2022";

export default async function handler(req, res) {
  await dbConnect();
  let startingRecord = 0;
  let runSearch = true;

  let pages = await PageData.find(
    { date: { $gt: new Date(START_DATE) } },
    "_id ein date clicks impressions"
  ).lean();

  let dict = createPageDict(pages);
  calcImpressions(dict);

  console.log("done");
  res.status(200).json({ name: "John Doe" });
}

const createPageDict = (pages) => {
  let dict = {};
  pages.forEach((page) => {
    let indexNumber = dayjs(new Date()).diff(page.date, "day");
    if (dict[page.ein]) {
      dict[page.ein].imp[indexNumber] = page.impressions;
      dict[page.ein].clicks[indexNumber] = page.clicks;
    } else {
      dict[page.ein] = {
        imp: new Array(dayjs(new Date()).diff(START_DATE, "day")).fill(0),
        clicks: new Array(dayjs(new Date()).diff(START_DATE, "day")).fill(0),
      };
      dict[page.ein].imp[indexNumber] = page.impressions;
      dict[page.ein].clicks[indexNumber] = page.clicks;
    }
  });

  return dict;
};

const calcImpressions = (dict) => {
  let keys = Object.keys(dict);
  let daysRankingDict = {};

  keys.forEach((ein) => {
    let page = dict[ein];
    let impressionDays = 0;
    let totalImpressions = 0;
    let impressionsArray = [];
    let start = false;
    let end = false;

    page.imp.forEach((day) => {
      if (!start && !end && day > 0) start = true;
      if (start && day === 0) end = true;
      if (start) impressionsArray.push(day);
      if (start) impressionDays += 1;
      if (start) totalImpressions += day;
    });

    if (daysRankingDict[`${impressionDays}`]) {
      daysRankingDict[`${impressionDays}`] += 1;
    } else {
      daysRankingDict[`${impressionDays}`] = 1;
    }

    if (impressionDays > 100) console.log(ein, impressionDays);
  });

  console.log(daysRankingDict);
};
