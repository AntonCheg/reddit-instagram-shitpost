import 'reflect-metadata';

import { dataSource } from './db/db-config';
import { initInstagramClient } from './inst';

async function main() {
  await dataSource.initialize();

  const a = await initInstagramClient();

  const aa = setInterval(a, 60000);

  setTimeout(() => clearInterval(aa), 300000);
}

main();
