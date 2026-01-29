import { z } from 'zod';

/**
 * Payout information schema and types
 */

export const PayoutSchema = z.object({
  miner: z.number(),
  template_id: z.string(),
  side_height: z.number(),
  main_id: z.string(),
  main_height: z.number(),
  timestamp: z.number(),
  coinbase_id: z.string(),
  coinbase_reward: z.number(),
  coinbase_private_key: z.string(),
  coinbase_output_index: z.number(),
  global_output_index: z.number(),
});

export const PayoutsResponseSchema = z.array(PayoutSchema);

export type Payout = z.infer<typeof PayoutSchema>;

/**
 * Calculate total earnings from payouts
 */
export function calculateTotalEarnings(payouts: Payout[]): bigint {
  return payouts.reduce((acc, payout) => acc + BigInt(payout.coinbase_reward), BigInt(0));
}
