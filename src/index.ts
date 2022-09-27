import 'reflect-metadata';

import ms from 'ms';

import { dataSource } from './db/db-config';
import { uploadWrapper } from './inst';

async function main() {
  await dataSource.initialize();

  const upload = await uploadWrapper();

  const intervalTimer = setInterval(upload, ms(process.env.INTERVAL));

  setTimeout(() => clearInterval(intervalTimer), ms(process.env.TIME));
}

main();
