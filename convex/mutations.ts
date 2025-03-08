
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const saveAddress = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    address1: v.string(),
    address2: v.string(),
    city: v.string(),
    state: v.string(),
    zip: v.string(),
    country: v.string(),
    saveAddress: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('addresses', args);
  },
});

export const savePayment = mutation({
  args: {
    cardNumber: v.string(),
    cvv: v.string(),
    expirationDate: v.string(),
    nameOnCard: v.string(),
    paymentType: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('payments', args);
  },
});
