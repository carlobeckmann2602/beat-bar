function main(){
    let esPkg = require('essentia.js');

    const essentia = new esPkg.Essentia(esPkg.EssentiaWASM);

// prints version of the essentia wasm backend
    console.log(essentia.version)

// prints all the available algorithm methods in Essentia
    console.log(essentia.algorithmNames)
}

main()