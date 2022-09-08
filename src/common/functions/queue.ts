import PgBoss from 'pg-boss';
import { ModelKey, ModelSize } from '../interfaces';

async function getSizeOfModel(boss: PgBoss, model: string): Promise<number> {
  const job = await boss.fetch(`${model}-size`);

  return (job?.data as ModelSize).size;
}

async function getKeyFromQueue(boss: PgBoss, model: string): Promise<string> {
  const job = await boss.fetch(`${model}`);

  return (job?.data as ModelKey).key;
}

export { getSizeOfModel, getKeyFromQueue };
