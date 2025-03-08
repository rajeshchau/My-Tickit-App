import { query } from './_generated/server';

export const getAddresses = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('addresses').collect();
  },
});

export const getPayments = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('payments').collect();
  },
});