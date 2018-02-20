/**
 * Created by lmislm on 2018/2/19- 22:20.
 */

const express = require('express')
const path = require('path')
const app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.listen(3003, () => {
    console.log(`App listening at port 3003`)
});