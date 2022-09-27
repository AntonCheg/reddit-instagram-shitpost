import "reflect-metadata";

import { config } from "dotenv";

import { dataSource } from "./db/db-config";
import { Subreddit } from "./db/entity/subreddit.entity";

config();

async function main() {
  await dataSource.initialize();

  await Subreddit.insert([
    { name: "meme" },
    { name: "memes" },
    { name: "dankmemes" },
    { name: "wholesomememes" },
  ]);
  // await initInstagramClient();
}

main();
