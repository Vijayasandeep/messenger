import User from '../models/User.js';
export const getUsers = async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUser } });
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getUsers", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatWith } = req.params;
        const loggedInUser = req.user._id;
        const messages = await Message.find({
            $or: [
                { sender: loggedInUser, receiver: userToChatWith },
                { sender: userToChatWith, receiver: loggedInUser },
            ],
        });
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages", error);
        res.status(500).json({ message: "Server Error" });

    }
};

export const sendMessage = async (req, res) => {
    try {
        const {id:receiverId} = req.params;
        const{text,image}   = req.body;
        const sender = req.user._id;
        let imageUrl;
        if(image){
            const uploadResponse = cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.url;
        }
        const newMessage = new Message({
            sender,
            receiver: receiverId,
            text,
            image: imageUrl,
        });
        await newMessage.save();
        res.status(200).json(newMessage);

        //todo implement socket io here
        
    } catch (error) {
        console.log("Error in sendMessage", error);
        res.status(500).json({ message: "Server Error" });
        
    }
};