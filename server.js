const host = 'localhost';
const port = 3000;
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const file = require('fs')
const cors = require('cors');
const mongoose = require('mongoose');

let saved_user = '';

app.use(express.json());
app.use(cors());
const mongoDB = 'mongodb+srv://lohiv78099:qzOAkrkZggXsoGqd@mideabudcluster.eupolqw.mongodb.net/';
console.log("connecting Database...");
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
    console.log("Database Connected");
});

let current_date = () => {
    let usable = new Date();
    let h = usable.getHours();
    let m = usable.getMinutes();
    if (m < 10) {
        m = `0${m}`;
    };
    let date = usable.getDate();
    let month = usable.getMonth() + 1;
    let year = usable.getFullYear();
    let returnable = date + "/" + month + "/" + year + "   " + h + ":" + m;
    return returnable
}

let initial = 1;
let check = 1;

try {
    if (check == 1) {
        file.readFile('check.txt', (error, data) => {
            if (error) {
                initial = 1;
            } else {
                if ((Number(data.toString()) % 2) == 0)
                    initial = Number(data.toString());
                else {
                    initial = Number(data.toString()) + 1;
                }
                if (Number(data.toString()) == 0) {
                    initial = 1;
                }
            }
        })
    }
} catch {
    console.log("File does not exist")
}


const setInitial = () => {
    if (check != 1) {
        file.writeFile('check.txt', initial.toString(), function () {

        })
    }
}

const getCounter = () => {
    initial += 1;
    check += 1;
}

const MideabudSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    gender: { type: String, default: 'none' },
    dob: String,
    profile_img: { type: String, default: './assets/user.jpg' },
    images: [{ img: String, likes: { type: Array, default: [] }, comments: [{ username: String, comment: String }], caption: { type: String, default: 'No caption' }, date: String, post_id: Number }],
    bio: { type: String, default: '' },
    date: String,
    verified: { type: Boolean, default: false }
});
const Mideabud = mongoose.model("MideaBUD", MideabudSchema, "mideabud")

app.use(fileUpload());
app.use(express.static('public'));
app.use('/', express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.get('/user:username', (req, res) => {
    if (saved_user !== '') {
        res.sendFile(__dirname + '/home.html');
    } else {
        res.sendFile(__dirname + '/error.html');
    }
});

app.get('/logout', (req, res) => {
    saved_user = '';
    res.status(200)
});

app.get('/showalluserdata', async (req, res) => {
    res.status(200);
    const data = await Mideabud.find()
    res.json(data)
});

app.get('/:username', async (req, res) => {
    const username = req.params.username;
    if (username !== 'favicon.ico' && username !== 'new-profile') {
        saved_user = username;
    }
    const data = await Mideabud.find({ username: username })
    res.json(data)
})

app.get('/requested/send/data/user/profile', (req, res) => {
    res.json({
        saved_user
    })
})

app.get('/another-user-liked-post-by/:post_username', async (req, res) => {
    if (saved_user !== '') {
        const { post_username } = req.params;
        const { posts } = req.query;
        await Mideabud.updateOne({ username: post_username, "images": { $elemMatch: { img: posts } } }, { $push: { "images.$.likes": saved_user } })
    }

})

app.post('/liked-post-by/', async (req, res) => {
    if (saved_user !== '') {
        const { posts } = req.body;
        const data = await Mideabud.find({ "images": { $elemMatch: { img: posts } } });
        res.json(data)
    }

})

app.post('/another-user-commented-post-by', async (req, res) => {
    if (saved_user !== '') {
        const { username } = req.body;
        const { posts } = req.body;
        const { com } = req.body;
        await Mideabud.updateOne({ username: username, "images": { $elemMatch: { img: posts } } }, { $push: { "images.$.comments": { username: saved_user, comment: com } } })
    }

})

app.post('/signup', async (req, res) => {
    const { firstname } = req.body;
    const { lastname } = req.body;
    const { username } = req.body;
    const { password } = req.body;
    const { gender } = req.body;
    const { dob } = req.body;
    const { date } = req.body;
    await Mideabud.insertMany({ firstname: firstname, lastname: lastname, username: username, password: password, gender: gender, dob: dob, date: date })   //insertOne is not working but insertmany is working
    saved_user = username;
});

/* app.get('/home.css', (req, res) => {
    res.status(200)
    res.sendFile(__dirname + '/home.css');
});

app.get('/home.js', (req, res) => {
    res.status(200)
    res.sendFile(__dirname + '/home.js');
});
 */

app.post('/', (req, res) => {
    if (req.files) {
        var file = req.files.file;
        var mime = file.mimetype.split("/")[1];
        var date_extension = Date.now();
        const date_now = current_date();
        newFilename = `./assets/pictures_upload/${saved_user}_${date_extension}.${mime}`;
        file.mv(__dirname + `/assets/pictures_upload/${saved_user}_${date_extension}.${mime}`, async (err) => {
            if (err) {
                res.send(err)
            } else {
                setInitial()
                await Mideabud.updateOne({ username: saved_user }, { $push: { images: { img: `./assets/pictures_upload/${saved_user}_${date_extension}.${mime}`, date: date_now, post_id: initial, caption: req.body.text } } })
                getCounter();
            }
        })
    } else {
        res.status(204)
    }
});



/* app.get('/post-caption/:caption', async (req, res) => {
    const { caption } = req.params;
    const { filename } = req.query;
    console.log(`filename from input value(split)-------------> ${filename.split('\\')[2]}`)
    console.log(`thisFILEname -------------> ${thisFILEname}`)

    let modifiedCount = 0;
    while (modifiedCount < 1) {
        console.log(thisFILEname)
        console.log(filename.split('\\')[2])
        console.log(`${thisFILEname} --------> ${thisFILEname == filename.split('\\')[2]}`)
        if (thisFILEname === filename.split('\\')[2]) {
            console.log(modifiedCount)
            let check = await Mideabud.updateOne({ "images": { $elemMatch: { img: newFilename } } }, { $set: { "images.$.caption": caption } });
            modifiedCount = check.modifiedCount;
            console.log('done' + thisFILEname + ' -------- ' + filename.split('\\')[2]);
            thisFILEname = '';
            newFilename = '';
        }
    }

}) */

app.post('/new-profile', (req, res) => {
    if (req.files) {
        var file = req.files.profile;
        var mime = file.mimetype.split("/")[1];
        var date_extension = Date.now();
        file.mv(__dirname + `/assets/profile_pictures/${saved_user}_${date_extension}.${mime}`, async (err) => {
            if (err) {
                res.send(err)
            } else {
                await Mideabud.updateOne({ username: saved_user }, { $set: { profile_img: `./assets/profile_pictures/${saved_user}_${date_extension}.${mime}` } })
            }
        })
    } else {
        res.status(204)
    }
});

app.post('/update-fn/:fn', async (req, res) => {
    await Mideabud.updateOne({ username: saved_user }, { $set: { firstname: `${req.params.fn}` } })   //insertOne is not working but insertmany is working
})

app.post('/update-ln/:ln', async (req, res) => {
    await Mideabud.updateOne({ username: saved_user }, { $set: { lastname: `${req.params.ln}` } })   //insertOne is not working but insertmany is working
})

app.post('/update-un/:un', async (req, res) => {
    await Mideabud.updateOne({ username: saved_user }, { $set: { username: `${req.params.un}` } })   //insertOne is not working but insertmany is working
})

app.post('/update-bio/:bio', async (req, res) => {
    await Mideabud.updateOne({ username: saved_user }, { $set: { bio: `${req.params.bio}` } })   //insertOne is not working but insertmany is working
})

app.post('/update-pwd/:pwd', async (req, res) => {
    await Mideabud.updateOne({ username: saved_user }, { $set: { password: `${req.params.pwd}` } })   //insertOne is not working but insertmany is working
})

app.get('/delete-post/:id', async (req, res) => {
    const { id } = req.params;
    await Mideabud.updateOne({ username: saved_user }, { $pull: { images: { _id: id } } })
})

app.get('/delete/account-delete/', async (req, res) => {
    await Mideabud.deleteOne({ username: saved_user });
})

app.listen(port, () => {
    console.log(`Example app listening on port http://${host}:${port}`);
});
