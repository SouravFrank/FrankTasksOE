const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const { sendWelcomeMail, sendCancelMail } = require('../emails/accounts')


router.post('/users', async (req,res) => {
    const users = new User(req.body)

    try {
        await users.save()
        sendWelcomeMail( users.email, users.name )
        const token = await users.generateAuthToken()
        res.status(201).send({users, token})
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users/login', async (req,res) => {
    
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users/logout', auth, async (req,res) => {    
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()
        res.send()
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users/logoutAll', auth, async (req,res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()

    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/users/me', auth, async (req,res) => {
    try {
        // const users = await User.find({})
        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})


router.patch('/users/me', auth, async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdated = ['name','email','password','age']
    const isValidUpdate = updates.every((update) => allowedUpdated.includes(update))

    if(!isValidUpdate) {
        return res.status(400).send({error: 'Invalid updates'})
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.status(200).send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/users/me', auth, async (req,res) => {
    try {
        await req.user.remove()
        sendCancelMail( req.user.email, req.user.name )
        res.status(200).send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }
})

const upload = multer({
    // dest: 'avatars/',
    limits: {
        fileSize: 8000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error('Please upload image'))
        }
        
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req,res) => {

    const buffer = await sharp(req.file.buffer).png().resize({ height: 250, width: 250 }).toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send('Photo uploaded')
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req,res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

//Browser compatible API for image view
router.get('/users/:id/avatar', async (req,res) => {
    const user = await User.findById(req.params.id)
    try {
        if(!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type','image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router