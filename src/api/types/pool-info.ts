import { z } from 'zod';

/**
 * Pool information schema and types
 */

export const SideBlockSchema = z.object({
  main_id: z.string(),
  main_height: z.number(),
  template_id: z.string(),
  side_height: z.number(),
  parent_template_id: z.string(),
  miner: z.number(),
  uncle_of: z.string().nullable(),
  effective_height: z.number(),
  nonce: z.number(),
  extra_nonce: z.number(),
  timestamp: z.number(),
  software_id: z.number(),
  software_version: z.number(),
  window_depth: z.number(),
  window_outputs: z.number(),
  transaction_count: z.number(),
  difficulty: z.number(),
  cumulative_difficulty: z.number(),
  pow_difficulty: z.number(),
  pow_hash: z.string(),
  inclusion: z.number(),
  miner_address: z.string().optional(),
  coinbase_reward: z.number().optional(),
});

export const PoolInfoSchema = z.object({
  sidechain: z.object({
    id: z.number(),
    height: z.number(),
    difficulty: z.number(),
    timestamp: z.number(),
    effort: z.object({
      current: z.number(),
      average: z.number(),
      last: z.number().array(),
    }),
    window: z.object({
      miners: z.number(),
      blocks: z.number(),
      uncles: z.number(),
      weight: z.number(),
    }),
    found: z.number(),
    miners: z.number(),
    last_found: SideBlockSchema.nullable().optional(),
  }),
  mainchain: z.object({
    id: z.string(),
    height: z.number(),
    difficulty: z.number(),
    reward: z.number(),
    base_reward: z.number(),
    next_difficulty: z.number(),
  }),
  versions: z.object({
    p2pool: z.object({
      version: z.string(),
      timestamp: z.number(),
      link: z.string(),
    }),
    monero: z.object({
      version: z.string(),
      timestamp: z.number(),
      link: z.string(),
    }),
  }),
});

export type SideBlock = z.infer<typeof SideBlockSchema>;
export type PoolInfo = z.infer<typeof PoolInfoSchema>;
