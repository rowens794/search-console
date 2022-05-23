const { Schema, model, models } = require("mongoose");

export const PageDataSchema = new Schema({
  ein: { type: String },
  date: { type: Date },
  url: { type: String },
  clicks: { type: Number },
  impressions: { type: Number },
  position: { type: Number },
});

let PageData = (models && models.PageData) || model("PageData", PageDataSchema);

// export interface PageDataInt {
//   ein: string;
//   date: Date;
//   url: string;
//   clicks: number;
//   impressions: number;
//   position: number;
// }

export default PageData;
