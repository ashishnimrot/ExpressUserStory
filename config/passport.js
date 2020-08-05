var GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = function(passport){
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, cb) => {
      
        const userNew = new Object()
        userNew.googleId = profile.id
        userNew.displayName = profile.displayName
        userNew.firstName = profile.name.givenName
        userNew.lastName = profile.name.familyName
        userNew.image = profile.photos[0].value
       
        try {
            let user = await User.findOne({googleId: profile.id})
            
            if(user){
                cb(null, user)
            }else{
                user = await User.create(userNew);
                cb(null, user)
            }

        } catch (error) {
            console.error(error)
        }
      
        // User.findOrCreate({ googleId: profile.id },  (err, user) => {
        //   return cb(err, user);
        // })
    },

  passport.serializeUser((user, done) => {
    done(null, user.id);
  }),
  
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })

))};
