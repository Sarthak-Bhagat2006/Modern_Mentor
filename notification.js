const Notification = require("./models/notification");

const sendNotification = async({reciver,sender,group,message}) =>{
    return await Notification.create({
        reciver,
        sender,
        group,
        message,
    });
}

module.exports = sendNotification;