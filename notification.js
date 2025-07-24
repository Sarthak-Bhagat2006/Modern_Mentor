import Notification from './models/notification.model.js';

const sendNotification = async ({ reciver, sender, group, message }) => {
    return await Notification.create({
        reciver,
        sender,
        group,
        message
    });
};

export default sendNotification;