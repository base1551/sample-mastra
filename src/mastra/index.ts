import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import { searchAgent } from './agents';

export const mastra = new Mastra({
  agents: { searchAgent },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
