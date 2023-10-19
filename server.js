const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const cors = require('cors');

 
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.static(__dirname));


var Message = mongoose.model('message',{
    name : String,
    message : String
})

var dbUrl;
function getUrl(){
    return "mongodb+srv://test:test@cluster0.acoacmw.mongodb.net/?retryWrites=true&w=majority"
}

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    })
})

app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) => {
        if(err)
            sendStatus(500);
        io.emit('message', req.body)
        res.sendStatus(200);
    })
})

io.on('connection', () =>{
    console.log('a user is connected')
})

mongoose.connect(getUrl(), { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Connection to MongoDB failed:', err);
  });

var server = http.listen(3000, () => {
    console.log('server is running on port', server.address().port);
});