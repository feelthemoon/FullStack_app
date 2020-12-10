const { Router } = require('express');
const config = require('config');
const shortId = require('shortid');
const auth = require('../middleware/auth.middleware');
const Link = require('../models/Link');
const router = Router();

router.post('/generate', auth, async (req, res) => {
    try {
        const baseUrl = config.get('baseUrl');
        const { from } = req.body;
        const existing = await Link.findOne({from});
        const code = shortId.generate();
        if (existing) {
            return res.json({ link: existing });
        }
        const to = baseUrl+ '/t' + code;
        const link = new Link({
            to: to,
            from: from,
            code: code,
            owner: req.user.userId
        })
       
        await link.save();
        res.status(201).json({ link });
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong. Try again.' });
    }
})

router.get('/', auth, async(req, res) => {
     try {
         const links = await Link.find({ owner: req.user.userId });
         res.json(links);
    } catch (e) {
            console.log(e);
        res.status(500).json({ message: 'Something went wrong. Try again.' });
    }
})

router.get('/:id', auth, async(req, res) => {
     try {
         const link = await Link.findById(req.params.id);
         res.json(link);
    } catch (e) {
            console.log(e);
        res.status(500).json({ message: 'Something went wrong. Try again.' });
    }
})
module.exports = router;