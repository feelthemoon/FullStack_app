const { Router } = require('express');
const User = require('../models/User');
const config = require('config');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = Router();

router.post(
    '/register',
    [
        check('email', 'Invalid email').isEmail(),
        check('password', 'Min password length is 6 symbols').isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Invalid data'
                })
            }
            const { email, password } = req.body;

            const candidate = await User.findOne({ email });

            if (candidate) {
                return res.status(400).json({ message: 'Such user already exists' });
            }

        const hashedPass = await bcrypt.hash(password, 12);
        const user = new User({ email, password:hashedPass });

        await user.save();

        res.status(201).json({ message: 'User has successfully created' });
        
        } catch (e) {
            console.log(e);
        res.status(500).json({ message: 'Something went wrong. Try again.' });
    }
});

router.post('/login',
    [
        check('email', 'Invalid email').normalizeEmail().isEmail(),
        check('password', 'Invalid password').exists()
    ],
    async (req, res) => {
    try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Invalid data'
                })
            }
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Such user does not exists' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Can not to login. Try again.' });
        }

        const token = jwt.sign(
            { userId: user.id },
            config.get('jwtSecret'),
            {expiresIn: '1h'}
        )
        res.json({ token, userId: user.id });
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong. Try again.' });
    }
});
module.exports = router;

