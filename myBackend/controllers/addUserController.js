const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const { default: mongoose } = require("mongoose");

const Images = mongoose.model('User');

const createUser = asyncHandler(async (req, res) => {
    const { name, email, phone, password, pImage } = req.body;

    if (!name || !email || !phone || !password || !pImage) {
        res.status(400);
        throw new Error("All fields are mandatory !");
    }
    try {
        const user = await User.create({
            name,
            email,
            phone,
            password,
            pImage
        });
        await Images.create({ userId: user._id, image: pImage });
        res.status(201).json(user);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error creating user", message: error.message });
    }
});


const getAllUser = asyncHandler(async (req, res) => {
    const users = await User.find({ name: { $exists: true } });
    if (users.length === 0) {
        res.status(404);
        throw new Error("No users found without a name.");
    }
    res.status(200).json(users);

});


const signInUser = asyncHandler(async (req, res) => {
    const { number, pass } = req.body;
    console.log("ServerSide..........")
    console.log(number, pass)

    const user = await User.findOne({ "phone": number, "password": pass }).select('name email phone pImage');

    // console.log(user)
    if (user) {
        res.status(200).json({ message: "Sign in successful", user });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

const getUserById = asyncHandler(async (req, res) => {
    try {
        var i=req.params.id;
        console.log(i);
        const user = await User.findById(req.params.id);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.status(200).json(user);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data', error: error.message });
    }
});
module.exports = {
    createUser,
    getAllUser,
    signInUser,
    getUserById,
};
