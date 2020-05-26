const uri = 'mongodb+srv://zerler:IkRHfEnxHlUApnot@cluster0-kfosa.mongodb.net/test?retryWrites=true&w=majority';

const db = require('monk')(uri);
const express = require('express');
const cors = require('cors');
const moment = require('moment');

const leetcode = db.get('leetcode');
const app = express();

app.use(cors())
app.use(express.json())

app.get('/recent', function (req, res) {
    leetcode
        .find({}, { rawCursor: true })
        .then(cursor => cursor.sort({last_done: 1}).limit(5).toArray() )
        .then(arr => addRelativeDate(arr))
        .then(result => JSON.stringify(result))
        .then(data => res.send(data))
        .catch(err => console.log(err));
});

app.post('/update', function (req, res) {
    const name = req.body.name;
    const time = Date.now();
    
    leetcode
        .update({ name: name }, { $set: { last_done: time }})
        .then(() => res.send('success'))
        .then(() => console.log(`updated ${name}!`))
        .catch(err => console.log(err));
});

app.listen(3000);

const addRelativeDate = arr => {
    for (let i = 0; i < arr.length; i++)
        arr[i] = { ...arr[i], 'relative_time': moment(arr[i].last_done).fromNow() };
    return arr;
};