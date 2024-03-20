const express = require('express');
const asyncHandler = require('express-async-handler');
const Chat = require('../Models/chatModel');
const User = require('../Models/userModel');

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        res.status(400);
        throw new Error('User ID is required');
    }

    var isChat = await Chat.find({

        isGroupChat: false,
        $and: [

            { users: { $elemMatch: { $eq: req.user._Id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]

    }).populate('users', '-password')
        .populate('latestMessage');

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    }
    else {
        const otherUser = await User.findById(userId);

        const chatName = otherUser.name;


        var Chatdata = {
            chatName,
            isGroupChat: false,
            users: [req.user._id, userId]
        };

        try {
            const createdChat = await Chat.create(Chatdata);

            const FullChat = await Chat.findOne({ _id: createdChat._id })
                .populate('users', '-password');

            res.status(200).send(FullChat);
        }
        catch (err) {
            res.status(400);
            throw new Error(err.message);
        }
    }
});

const fetchChats = asyncHandler(async (req, res) => {

    try {
        Chat.find({
            users: { $elemMatch: { $eq: req.user._id } }
        })
            .populate('users', '-password')
            .populate("groupAdmin", "-password")
            .populate('latestMessage')
            .sort({ updatedAt: -1 })
            .then(async (result) => {
                result = await User.populate(result, {
                    path: "latestMessage.sender",
                    select: "name pic email",

                });
                res.status(200).send(result);
            })

    } catch (err) {
        res.status(400);
        throw new Error(err.message);
    }
});

const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please fill all the fields" });
    }

    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res.status(400).send({ message: "Please add atleast 2 users" });
    }

    users.push(req.user);

    try {

        const groupChat = await Chat.create({
            chatName: req.body.name,
            isGroupChat: true,
            users: users,
            groupAdmin: req.user
        })

        const FllGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate('users', '-password')
            .populate("groupAdmin", "-password");

        res.status(200).send(FllGroupChat);

    }
    catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName: chatName
        },
        {
            new: true
        }
    )
        .populate('users', '-password')
        .populate("groupAdmin", "-password");

    if (!updatedChat) {
        res.status(400);
        throw new Error("Chat not found");
    }
    else {
        res.json(updatedChat);
    }
});


const addToGroup = asyncHandler(async (req, res) => {

    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId }
        },
        {
            new: true
        }

    )
        .populate('users', '-password')
        .populate("groupAdmin", "-password");


    if (!added) {
        res.status(400);
        throw new Error("User not added");

    }
    else {
        res.json(added);

    }
});


const removeFromGroup = asyncHandler(async (req, res) => {

    const { chatId, userId } = req.body;

    const removed =  await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId }
        },
        {
            new: true
        }

    )
        .populate('users', '-password')
        .populate("groupAdmin", "-password");


    if (!removed) {
        res.status(400);
        throw new Error("User not removed");

    }
    else {
        res.json(removed);

    }
});




module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup };