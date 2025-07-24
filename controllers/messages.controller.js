import cloudinary from "../lib/cloudinary.js";
import { isLoggedIn } from "../middleware.js";
import Group from "../models/group.model.js";
import Message from "../models/message.model.js";

export const getMemberForSidebar = async (req, res) => {
    try {
        const currUserId = req.user._id;
        const groupId = req.params.groupId;

        const group = await Group.findById(groupId)
            .populate("members", "-password -__v");

        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        const otherMembers = group.members.filter(
            (member) => member._id.toString() !== currUserId.toString()
        );

        res.status(200).json(otherMembers);
    } catch (error) {
        console.error("Error fetching group members:", error); // ✅ Fixed name
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessagesController = async (req, res) => {
    try {
        const { id: userTochatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, recieverId: userTochatId },
                { recieverId: userTochatId, senderId: myId }
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error getMessagesController:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const sendMessageController = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: recieverId } = req.params
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            //upload base64 image to cloudinary
            const uploadResponce = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponce.secure_url;
        }

        const newMessage = new Message({
            senderId,
            recieverId,
            text,
            image: imageUrl
        });

        await newMessage.save();

        //TODO use SOCKET.IO

        res.status(201).json(newMessage);

    } catch (error) {
        console.error("Error sendMessagesController:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}