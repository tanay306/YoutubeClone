const express = require('express');
const User = require('../db/models/user');
const Channel = require('../db/models/channel');
const Video = require('../db/models/video');
const Helper = require('../middleware/helpers');
const verify = require('../middleware/auth');

const getCreateChannel = async (req, res) => {
    try {
        res.send('Create Channel Page');
    } catch(err) {
        console.log(err);
        res.json(err)
    }   
};

const postCreateChannel = async (req, res) => {
    try {
        if(req.user) {
            if(req.user.channelId==null) {
                const {name} = req.body;
                const channel = await Channel.query().insert({name: name});
                const user = await User.query().findById(req.user.id).patch({channelId: channel.id});
                const updatedUser = await User.query().findById(req.user.id).withGraphFetched('channel');
                res.json(updatedUser)
            } else {
                return res.status(400).send({ 'message': 'Channel already exists!' });
            } 
        } else {
            return res.status(400).send({ 'message': 'Plaese Log in!' });
        }
    } catch(err) {
        console.log(err);
        res.json(err)
    } 
};

const getAllChannels = async (req, res) => {
    try {
        const allChannels = await Channel.query();
        res.json(allChannels);
    } catch(err) {
        console.log(err);
        res.json(err)
    } 
};

const getParticularChannel = async (req, res) => {
    try {
        const channel = await Channel.query().findById(req.params.id);
        res.json(channel);
    } catch(err) {
        console.log(err);
        res.json(err)
    } 
};

const getDeleteChannel = async (req, res) => {
    try {
        if(req.user) {
            const reqUser = await User.query().where('channelId', '=', req.params.id);
            if(reqUser[0] && reqUser[0].email == req.user.email) {
                res.send('Delete Channel Page')
            } else {
                return res.status(400).send({ 'message': 'Not the owner of channel!' })
            }
        } else {
            return res.status(400).send({ 'message': 'Please Log In!' })
        }
    } catch(err) {
        console.log(err);
        res.json(err)
    } 
};

const postDeleteChannel = async (req, res) => {
    try {
        if(req.user) {
            const reqUser = await User.query().where('channelId', '=', req.params.id);
            if(reqUser[0] && reqUser[0].email == req.user.email) {
                const user = await User.query().findById(req.user.id).patch({channelId: null});
                const updatedUser = await User.query().findById(req.user.id).withGraphFetched('channel'); 
                const deleteAllVideos = await Video.query().delete().where('channelId', '=', req.params.id);
                const deletedChannel = await Channel.query().deleteById(req.params.id);
                if(deleteAllVideos && deletedChannel) {
                    return res.status(200).send({ 'message': 'Successfully deleted channel!' })
                } else {
                    return res.status(400).send({ 'message': 'Some error occured!' })
                }
            } else {
                return res.status(400).send({ 'message': 'Not the owner of channel!' })
            }
        } else {
            return res.status(400).send({ 'message': 'Please Log In!' })
        }
    } catch(err) {
        console.log(err);
        res.json(err)
    } 
};

module.exports = {
    getCreateChannel,
    postCreateChannel,
    getAllChannels,
    getParticularChannel,
    getDeleteChannel,
    postDeleteChannel,
}