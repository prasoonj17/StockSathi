import mongoose, { Schema } from "mongoose";

const userSchema= new mongoose.Schema(
    {
name:{type:String,require:true},
email:{type:String,require:true},
password: { type: String, required: true },
    shopName: { type: String, required: true },
    address: { type: String },
    tenantId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const User=mongoose.model("User",userSchema);