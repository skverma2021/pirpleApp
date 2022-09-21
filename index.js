const http = require('http')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder

const server = http.createServer(function (req, res) {
    const parsedUrl = url.parse(req.url, true)
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '')
    const method = req.method.toLowerCase()
    const qStrObj = parsedUrl.query
    const headers = req.headers
    const decoder = new StringDecoder('utf-8')
    var buffer = ''
    req.on('data', function (data) {
        buffer += decoder.write(data)
    })
    req.on('end', function () {
        buffer += decoder.end()
        const chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
        const data = {
            trimmedPath,
            qStrObj,
            method,
            headers,
            'payLoad': buffer
        }

        chosenHandler(data, function (statusCode, payLoad) {
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200
            payLoad = typeof (payLoad) == 'object' ? payLoad : {}
            const payLoadStr = JSON.stringify(payLoad)
            res.setHeader('Content-Type','Application/Json')
            res.writeHead(statusCode)
            res.end(payLoadStr)
            console.log(`The response received: Status Code - ${statusCode} and Payload - ${payLoadStr}`)
        })
    })

    const handlers = {}
    handlers.sample = function (data, callBack) {
        // console.log(JSON.stringify(data))
        callBack(406, { 'name': 'The Sample Handler' })
    }
    handlers.notFound = function (data, callBack) {
        callBack(404)
    }
    const router = {
        'sample': handlers.sample,
    }
})

server.listen(7000, function () {
    console.log('Server started listening at port 7000')
})
