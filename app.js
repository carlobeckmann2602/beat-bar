function main(){
    let esPkg = require('essentia.js');
    const express = require('express')

    const essentia = new esPkg.Essentia(esPkg.EssentiaWASM);

// prints version of the essentia wasm backend
    console.log(essentia.version)

// prints all the available algorithm methods in Essentia
    console.log(essentia.algorithmNames)

    const app = express()
    const port = 3000

    app.get('/', (req, res) => {
        res.send('Hello World!')
    })

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

main()