const express = require('express');
const User = require('../db/models/user');
const Channel = require('../db/models/channel');
const Video = require('../db/models/video');
const Helper = require('../middleware/helpers');
const verify = require('../middleware/auth');

const getSignUp = async (req, res) => {
    try {
        res.send('Sign Up Page');
    } catch(err) {
        console.log(err);
        res.json(err)
    }   
};

const postSignUp = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        if (!email || !password) {
            return res.status(400).send({'message': 'Some values are missing'});
          }
          if (!Helper.isValidEmail(email)) {
            return res.status(400).send({ 'message': 'Please enter a valid email address' });
          }
          const hashPassword = Helper.hashPassword(password);
          const userExists = await User.query().where('email', '=', email);
          if(userExists.length==0) {
              const user = await User.query().insert({
                  name: name,
                  email: email,
                  password: hashPassword,
              });
              if(user) {
                const token = Helper.generateToken(user.id);
                return res.status(201).send({ token });
              } else {
                return res.status(400).send({ 'message': 'Some err occured' })
              }
          } else {
            return res.status(400).send({ 'message': 'User with that EMAIL already exist' })
          }
    } catch(err) {
        console.log(err);
        res.json(err)
    }   
};

const getSignIn = async (req, res) => {
    try {
        res.send('Sign In Page');
    } catch(err) {
        console.log(err);
        res.json(err)
    }   
};

const postSignIn = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).send({'message': 'Some values are missing'});
        }
        const userExists = await User.query().where('email', '=', email);
        if(userExists.length == 1) {
            if(Helper.comparePassword(userExists[0].password, password)) {
                const token = Helper.generateToken(userExists[0].id);
                console.log('Signed In');
                return res.status(200).send({ token });
            } else {
                return res.status(400).send({ 'message': 'Incorrect Credentials' }) 
            }
        } else {
            return res.status(400).send({ 'message': 'No user with that EMAIL exists' })
        }
    } catch(err) {
        console.log(err);
        res.json(err)
    }  
};

const getMyProfile = async (req, res) => {
    try {
        if(req.user) {
            res.send(req.user);
        } else {
            return res.status(400).send({ 'message': 'Plaese Log in!' })
        }
    } catch(err) {
        console.log(err);
        res.json(err)
    }  
};

module.exports = {
    getSignUp,
    postSignUp,
    getSignIn,
    postSignIn,
    getMyProfile,
}

