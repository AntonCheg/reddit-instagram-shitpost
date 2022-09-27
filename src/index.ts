import 'reflect-metadata';

import { dataSource } from './db/db-config';

async function main() {
  await dataSource.initialize();

  // await initInstagramClient();
}

main();
