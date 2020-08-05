const express = require('express')
const router = express.Router()
const { auth, guest } = require('../middlewares/auth')
const Story = require('../models/Story')

// @desc Login/Landing page
// route GET    /
router.get('/', guest, (req, res) => {
    res.render('login', {
        layout: 'login'
    })
})

// @desc Dashboard
// route GET    /dashboard
router.get('/dashboard', auth, async (req, res) => {

    try {
        const stories = await Story.find({user: req.user.id}).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            stories
        })        
    } catch (error) {
        console.log(error)
        res.render('/errors/500')
    }

})


module.exports = router