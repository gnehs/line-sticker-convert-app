const sharp = require('sharp');
const PSD = require('psd');
const fs = require('fs');
const path = require('path');
async function parseFile({
    filePath,
    outputFilePath,
    tempFilePath
}) {
    let imgData
    if (filePath.endsWith('.psd')) {
        let psd = PSD.fromFile(filePath)
        await psd.parse()
        await psd.image.saveAsPng(tempFilePath)
        imgData = sharp(tempFilePath)
    } else {
        imgData = sharp(filePath)
    }
    // 縮放大小
    let metadata = await imgData.metadata()
    imgData = sharp(await imgData.trim().resize(370 - 10, 320 - 10, {
        fit: 'inside'
    }).toBuffer())

    // 擴張
    metadata = await imgData.metadata()
    imgData = sharp(await imgData.extend({
        top: 5,
        bottom: metadata.height % 2 == 0 ? 5 : 4,
        left: metadata.width % 2 == 0 ? 5 : 4,
        right: 5,
        background: {
            r: 0,
            g: 0,
            b: 0,
            alpha: 0
        }
    }).toBuffer())
    metadata = await imgData.metadata()

    await imgData.toFile(outputFilePath);
    if (filePath.endsWith('.psd')) {
        await fs.unlinkSync(tempFilePath);
    }

    console.log(JSON.stringify({
        success: true,
        metadata
    }))
}
try {
    parseFile({
        filePath: process.argv[2],
        outputFilePath: process.argv[3],
        tempFilePath: process.argv[4]
    })
} catch (error) {
    throw error
}