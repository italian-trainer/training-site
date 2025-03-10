import Message from "../models/Message.js";

export async function sendMessage(req, res) {
  try {
    //who sends it and who receives it in the body of the request
    const { sender, receiver, content, type } = req.body;
    const message = new Message({
      sender,
      receiver,
      content,
      type,
      read: false,
    });

    if (!sender || !receiver || !content || !type) {
      return res.status(400).json({ error: "All fields are required" });
    }

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
    const messages = await Message.find({ receiver: req.params.userId })
      .populate("sender", "first_name last_name email") // mongoose replaces sender's objectId with info
      .populate("receiver", "first_name last_name email")
      .sort({ timestamp: -1 });
    res.json(
      messages.map((message) => ({
        _id: message._id,
        sender: message.sender,
        receiver: message.receiver,
        type: message.type,
        //content: message.content,
        read: message.read,
        timestamp: message.timestamp,
      }))
    );
  } catch (error) {
    res.status(400).send("Error fetching messages");
  }
}

export async function markAsRead(req, res) {
  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.messageId,
      { read: true },
      { new: true }
    );
    res.json(updatedMessage);
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

    res.json({
      sender: message.sender,
      receiver: message.receiver,
      content: message.content,
      //read: message.read,
      timestamp: message.timestamp,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
