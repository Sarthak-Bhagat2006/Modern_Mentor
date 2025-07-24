import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const notificationSchema = new Schema({
    reciver: { type: Schema.Types.ObjectId, ref: "User" },
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    message: { type: String },
    group: { type: Schema.Types.ObjectId, ref: "Group" },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Notification = model("Notification", notificationSchema);

export default Notification;