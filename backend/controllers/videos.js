const express = require('express');
const User = require('../db/models/user');
const Channel = require('../db/models/channel');
const Video = require('../db/models/video');
const Helper = require('../middleware/helpers');
const verify = require('../middleware/auth');

const getCreateVideo = async (req, res) => {
    try {
        res.send('Create Video Page');
    } catch(err) {
        console.log(err);
        res.json(err)
    }   
};

const postCreateVideo = async (req, res) => {
    try {
        if(req.user) {
            if(req.user.channelId!=null) {
                const {title} = req.body;
                const video = await Video.query().insert({title: title, channelId: req.user.channelId});
                res.json(video);
            } else {
                return res.status(400).send({ 'message': 'Create a Channel!' })
            }
        } else {
            return res.status(400).send({ 'message': 'Plaese Log in!' })
        }
    } catch(err) {
        console.log(err);
        res.json(err)
    } 
};

const getAllVideo = async (req, res) => {
    try {
        const allVideo = await Video.query();
        res.json(allVideo)
    } catch(err) {
        console.log(err);
        res.json(err)
    } 
};

const getAllVideoOfChannel =  async (req, res) => {
    try {
        const videos = await Video.query().where('channelId', '=', req.params.id);
        if(videos.length!=0) {
            res.json(videos)
        } else {
            return res.status(400).send({ 'message': 'No Videos Available' })
        }
    } catch(err) {
        console.log(err);
        res.json(err)
    } 
};

const getParticularVideo = async (req, res) => {
    try {
        const video = await Video.query().findById(req.params.videoId);
        if(video) {
            res.json(video)
        } else {
            return res.status(400).send({ 'message': 'No Video Available' })
        }
        
    } catch(err) {
        console.log(err);
        res.json(err)
    } 
};

const getDeleteVideo = async (req, res) => {
    try {
        if(req.user) {
            const video = await Video.query().findById(req.params.id);
            const channelId = video.channelId;
            const reqUser = await User.query().where('channelId', '=', channelId);
            console.log(reqUser);
            if(reqUser[0] && reqUser[0].email == req.user.email) {
                res.send('Delete Video Page');
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
}

const postDeleteVideo = async (req, res) => {
    try {
        if(req.user) {
            const video = await Video.query().findById(req.params.id);
            const channelId = video.channelId;
            const reqUser = await User.query().where('channelId', '=', channelId);
            console.log(reqUser);
            if(reqUser[0] && reqUser[0].email == req.user.email) {
                const deletedVideo = await Video.query().deleteById(req.params.id);
                if(deletedVideo) {
                    return res.status(200).send({ 'message': 'Video Deleted!!' })
                } else {
                    return res.status(400).send({ 'message': 'Videos Not Deleted!' })
                }
            } else {
                return res.status(400).send({ 'message': 'Not the owner of channel' })
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
    getCreateVideo,
    postCreateVideo,
    getAllVideo,
    getAllVideoOfChannel,
    getParticularVideo,
    getDeleteVideo,
    postDeleteVideo,
}