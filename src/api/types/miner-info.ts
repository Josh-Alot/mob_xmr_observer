import { z } from 'zod';

/**
 * Miner information schema and types
 */

export const ShareEntrySchema = z.object({
  shares: z.number(),
  uncles: z.number(),
  last_height: z.number(),
});

export const MinerInfoSchema = z.object({
  id: z.number(),
  address: z.string(),
  alias: z.string().nullable().optional(),
  shares: z.array(ShareEntrySchema),
  last_share_height: z.number(),
  last_share_timestamp: z.number(),
});

export type ShareEntry = z.infer<typeof ShareEntrySchema>;
export type MinerInfo = z.infer<typeof MinerInfoSchema>;

/**
 * Shares in PPLNS window schema
 */
export const ShareInWindowSchema = z.object({
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
});

export const SharesInWindowSchema = z.array(ShareInWindowSchema);

export type ShareInWindow = z.infer<typeof ShareInWindowSchema>;

/**
 * Miner blocks found schema
 */
export const MinerBlockSchema = z.object({
  main_id: z.string(),
  main_height: z.number(),
  template_id: z.string(),
  side_height: z.number(),
  miner: z.number(),
  timestamp: z.number(),
  difficulty: z.number(),
  coinbase_reward: z.number().optional(),
});

export const MinerBlocksSchema = z.array(MinerBlockSchema);

export type MinerBlock = z.infer<typeof MinerBlockSchema>;
