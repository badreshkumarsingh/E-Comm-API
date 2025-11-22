import fs from "fs";

const fsPromise = fs.promises;

async function log(logData) {
    try {
        logData = `\n${new Date().toString()}. Log Data: ${logData}`;
        // Append the log data to the file
        await fsPromise.appendFile('log.txt', logData);
    } catch(err) {
        console.log(err);
    }
}

const loggerMiddleware = async (req, res, next) => {
    if(!req.url.includes('signin')) {
        const logData = `${req.url} - ${JSON.stringify(req.body)}`;
        console.log(logData);
        await log(logData);
    }
    next();
}

export default loggerMiddleware;