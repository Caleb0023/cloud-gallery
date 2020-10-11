const express = require('express');
const multer = require('multer');
const morgan = require('morgan');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { format } = require('timeago.js');
const { urlencoded } = require('express');

//server
const app = express();
require('./database'); 

//settings
app.set('port',process.env.PORT || 3000);
app.set('views' , path.join(__dirname , 'views'));
app.set('view-engine', 'ejs');

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}))
const storage = multer.diskStorage({
    destination: path.join(__dirname , 'public/uploads'),
    filename:(req,file,cb,filename)=>{
        cb(null, uuidv4() + path.extname(file.originalname))
    }
})
app.use(multer({storage}).single('image'));


//Global variables of timeago.js
app.use((req, res, next) => {
    app.locals.format = format;
    next();
});

// routes
app.use(require('./routes/index'));

//Static files
app.use(express.static(path.join(__dirname , 'public')));

//Start
app.listen(app.get('port') , ()=>{
    console.log("Server on port:" + app.get('port'));
    console.log('Envirement:', process.env.NODE_ENV);
});

