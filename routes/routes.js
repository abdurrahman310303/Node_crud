const express = require('express');
const router = express.Router();
const User = require("../models/users");
const multer = require("multer");
const fs = require('fs');


// Image upload
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});

var upload = multer({
    storage: storage,
}).single("image");

// Insert user into database route
router.post("/add", upload, async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file.filename, 
        });

        await user.save();

        req.session.message = {
            type: 'success',
            message: 'User added successfully!'
        };
        res.redirect('/');
    } catch (err) {
        res.json({
            type: 'danger',
            message: err.message, 
        });
    }
});

// get all users route

router.get('/', async ( req, res)=>{
    try{
        const users = await User.find({});
        res.render('index',{title:'Home page', users:users});
        req.session.message=null;
    }
    catch(err){
        res.json({
            type:'danger',
            message:'Failed to fetch Users!'
        });
    }
});

router.get('/add', (req, res) => {
    res.render('./layout/add_users', { title: "Add Users" });
});


// Edit user route
router.get('/edit/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.redirect('/');
        } else {
            res.render('./layout/edit_users', {
                title: 'Edit page',
                user: user,
            });
        }
    } catch (err) {
        res.redirect('/');
    }
});


// Update user route
router.post('/update/:id', upload, async (req, res) => {
    let id = req.params.id;
    let new_image = '';
    if (req.file) {
        new_image = req.file.filename;

        try {
            fs.unlinkSync('./uploads/' + req.body.old_image);
        } catch (err) {
            console.log(err);
        }
    } else {
        new_image = req.body.old_image;
    }

    try {
        await User.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: new_image,
        });

        req.session.message = {
            type: 'success',
            message: 'User updated successfully!'
        };
        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});


// Delete user route
router.get('/delete/:id', async (req, res) => {
    let id = req.params.id;
    try {
        const result = await User.findByIdAndDelete(id);
        if (result.image != '') {
            try {
                fs.unlinkSync('./uploads/' + result.image);
            } catch (err) {
                console.log(err);
            }
        }
        req.session.message = {
            type: 'danger',
            message: 'User deleted successfully!',
        };
        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});




// Example route to render speedtest view
router.get('/weather', async (req, res) => {
    try {
        // You can optionally fetch data here before rendering the view
        res.render('./layout/speedtest', { title: 'Weather Check' });
    } catch (error) {
        console.error('Error fetching speed test data:', error);
        // Handle error appropriately, e.g., render an error page
        res.status(500).send('Error fetching speed test data');
    }
});


module.exports = router;
