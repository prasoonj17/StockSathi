const bwipjs = require('bwip-js');
const cloudinary = require('./cloudinary');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const generateBarcode = async (sku) => {
  const fileName = `${uuidv4()}.png`;
  const filePath = path.join(__dirname, '..', 'temp', fileName);

  try {
    // Step 1: Generate barcode image and save temporarily
    await new Promise((resolve, reject) => {
      bwipjs.toBuffer(
        {
            text: sku,
          bcid: 'code128',
          
          scale: 3,
          height: 10,
          includetext: true,
          textxalign: 'center',
        },
        (err, png) => {
          if (err) reject(err);
          fs.writeFileSync(filePath, png);
          resolve();
        }
      );
    });

    // Step 2: Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'barcodes',
    });
    console.log(result);

    // Step 3: Clean up temp file
    fs.unlinkSync(filePath);

    // Return Cloudinary image URL
    return result.secure_url;
    console.log(result.secure_url);
  } catch (err) {
    console.error('Barcode Generation Error:', err);
    throw err;
  }
};

module.exports = generateBarcode;
