import Message from "../models/Message.js";

export async function sendMessage(req, res) {
  try {
    //who sends it and who receives it in the body of the request
    const { receiver, subject, content, type } = req.body;
    const message = new Message({
      sender: req.user._id,
      receiver,
      subject,
      content,
      type,
      read: false,
    });

    const savedMessage = await message.save(); //save the message to the database
    res.status(200).json({
      status: "success",
      code: 200,
      data: savedMessage,
      message: "Message Sent!",
    });
  } catch (error) {
    res.status(400).send("Invalid request!");
  }
}
//fetch all the messages and show them which one is read which one is unread
//After send the message set it to read!
export async function readMessages(req, res) {
  try {
    const messages = await Message.find({ receiver: req.user._id })
      .populate("sender", "first_name last_name email") // mongoose replaces sender's objectId with info
      .populate("receiver", "first_name last_name email")
      .sort({ timestamp: -1 });
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Messages fetched!",
      data: messages.map((message) => ({
        _id: message._id,
        sender: message.sender,
        receiver: message.receiver,
        type: message.type,
        subject: message.subject,
        //content: message.content,
        read: message.read,
        timestamp: message.timestamp,
      })),
    });
  } catch (error) {
    res.status(400).send("Error fetching messages");
  }
}

export async function markAsRead(req, res) {
  try {
    const updatedMessage = await Message.findById(req.params.messageId);
    if (!updatedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }
    if (!updatedMessage.receiver._id.equals(req.user._id)) {
      res.sendStatus(401); // Cannot access messages that arent yours
      return;
    }
    updatedMessage.read = true;
    await updatedMessage.save();
    res.status(200).json({
      status: "success",
      code: 200,
      data: updatedMessage,
      message: "Message Sent!",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getSingleMessage(req, res) {
  try {
    const message = await Message.findById(req.params.messageId)
      .populate("sender", "first_name last_name email")
      .populate("receiver", "first_name last_name email");

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    if (!message.receiver._id.equals(req.user._id)) {
      return res.sendStatus(401); // Can only access your own messages
    }

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        sender: message.sender,
        receiver: message.receiver,
        subject: message.subject,
        content: message.content,
        read: message.read,
        timestamp: message.timestamp,
      },
      message: "Message retrieved!",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
