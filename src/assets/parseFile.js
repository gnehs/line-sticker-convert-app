const PSD = require('psd-parser');
const fs = require('fs');
async function parseFile({
    filePath,
    outputFilePath,
    tempFilePath
}) {

    let img = document.createElement("img");
    let canvas = document.createElement("canvas");
    if (filePath.endsWith('.psd')) {
        let psd = PSD.parse(filePath)
        await psd.saveAsPng(tempFilePath)
        img.src = tempFilePath
    } else {
        img.src = filePath
    }
    var MAX_WIDTH = 360;
    var MAX_HEIGHT = 310;
    var width = img.width;
    var height = img.height;

    if (width > height) {
        if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
        }
    } else {
        if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
        }
    }



    canvas.width = width + 10;
    canvas.height = height + 10;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 5, 5, width, height);

    fs.writeFileSync(outputFilePath, canvas.toBlob())

    if (filePath.endsWith('.psd')) {
        await fs.unlinkSync(tempFilePath);
    }

    console.log(JSON.stringify({
        success: true,
        metadata
    }))
}
exports.default = parseFile
/*try {
    parseFile({
        filePath: process.argv[2],
        outputFilePath: process.argv[3],
        tempFilePath: process.argv[4]
    })
} catch (error) {
    throw error
}*/