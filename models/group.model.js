import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const groupSchema = new Schema({
  groupName: { type: String, required: true },
  groupAdmin: { type: Schema.Types.ObjectId, ref: "User" },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  Mentors: { type: Schema.Types.ObjectId, ref: "User" },
  description: { type: String },
  pendingMembers: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

const Group = model("Group", groupSchema);

export default Group;