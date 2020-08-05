const express = require('express')
const router = express.Router()
const { auth } = require('../middlewares/auth')
const Story = require('../models/Story')
const { route } = require('.')

// @desc Show add page
// route GET    /
router.get('/add', auth, (req, res) => {
    res.render('stories/add')
})

// @desc Show User Story
// route GET
router.get('/:id', auth, async (req, res) => {
    try {
        const story = await Story.findById(req.params.id).populate('user').lean()

        if(!story){
            res.render('errors/404')
        }

        res.render('stories/show', {
            story
        })

    } catch (error) {
        console.error(error)
        res.render('errors/500')
    }
})

// @desc Show Edit page
// route GET    /
router.get('/edit/:id', auth, async (req, res) => {

    try {
        const story = await Story.findOne({ 
            _id: req.params.id
        }).lean();
    
        if(!story){
            res.render('errors/404')
        }
    
        if(req.user.id != story.user){
        // if (story.user != req.user.id) {
    
            res.redirect('/stories')
        }else{
            res.render('stories/edit',{
                story
            })
        }    
    } catch (error) {
        console.error(error)
        res.render('errors/500')
    }
})

router.put('/:id', auth, async (req, res) => {

    try {
        let story = await Story.findById(req.params.id).lean()

        if(!story) {
            res.render('errors/404')
        }

        if(story.user != req.user.id){
            res.redirect('/stories')
        }else{
            story = await Story.findByIdAndUpdate({_id: req.params.id}, req.body, {
                new: true,
                runValidators: true
            })

            res.redirect('/dashboard')
        }
    } catch (error) {
        console.error(error)
        res.render('errors/500')
    }
})

// @desc Delete story
// route DELETE
router.delete('/:id', auth, async (req, res) => {
    try {
        await Story.remove({_id: req.params.id})
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error)
        res.render('errors/500')
    }
})

// @desc Show add page
// route GET    /
router.get('/', async (req, res) => {
    try {
        const stories = await Story.find({status: 'public'}).populate('user').sort({createdAt: 'desc'}).lean()
        res.render('stories/index',{
            stories
        })
    } catch (error) {
        console.error(error)
        res.render('errors/500')
    }
})

// @desc Show User Stories
// route GET    /
router.get('/user/:userId', async (req, res) => {
    try {
        const stories = await Story.find({status: 'public', user: req.params.userId}).populate('user').sort({createdAt: 'desc'}).lean()
        res.render('stories/index',{
            stories
        })
    } catch (error) {
        console.error(error)
        res.render('errors/500')
    }
})

// @desc Show add page
// route POST    /
router.post('/', auth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('dashboard')
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})

module.exports = router