const express = require('express')
const path = require('path');
const cors = require('cors')
const { logger } = require('./middleware/logEvents')
const errorHandler= require('./middleware/errorHandler')
const verifyJwt = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')
const corsOptions = require('./config/corsOptions')

const app = express();

const PORT = process.env.PORT || 3500;

// custom middleware
app.use(logger)
// Cross Origin Resource Sharing
app.use(cors(corsOptions))

// build-in middlewares
app.use(express.urlencoded({extended: false}))
app.use(express.json())
// middleware for cookies
app.use(cookieParser())
// serve static files
app.use(express.static(path.join(__dirname, 'public')))


// routes
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))

app.use(verifyJwt);
app.use('/employees', require('./routes/employees'))

const one = (req, res, next) => {
    console.log("one");
    next();
}
const two = (req, res, next) => {
    console.log("two");
    next();
}
const three = (req, res) => {
    console.log("three")
    res.send("Finished!")
}

app.get('/chain(.html)?', [one, two, three]);

app.all('*', (req, res) => {
    res.status(404)

    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, "views", "404.html"))
    } else if (req.accepts('json')) {
        res.json({error: '404 Not Found'})
    } else {
        res.type('txt').send('404 Not Found')
    }
})


app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
