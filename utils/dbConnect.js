/* This is a database connection function*/
import mongoose from "mongoose";

let connection = {}; /* creating connection object*/

async function dbConnect() {
  /* check if we have connection to our databse*/
  if (connection.isConnected) {
    return;
  } else {
    /* connecting to our database */
    const db = await mongoose.connect(process.env.MONGODB_ATLAS, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false, //change to true to generate indexes
    });

    mongoose.set("debug", false); //change to true to log mongoose queries

    connection.isConnected = db.connections[0].readyState;
  }
}

export default dbConnect;
