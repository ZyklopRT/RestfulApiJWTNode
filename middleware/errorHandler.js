const {logEvents} = require('./logEvents')

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt')
        .catch(err => console.error(`Could not log error: ${err}`))
    res.status(500).send(err.message);
};

module.exports = errorHandler;