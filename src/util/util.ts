import fs from "fs";
import axios from 'axios'
import Jimp = require("jimp");
const fileType = require('file-type');

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      //getting buffer data to verify if it's allowed
      const request = await axios.get(inputURL, { responseType: 'arraybuffer' })

      //If not a successful code return error
      if(!(request.status >= 200) && !(request.status < 300)) throw new Error(`Request failed with status ${request.status}`);

      //Allowed types by jimp
      const allowedTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/tiff', 'image/gif'];

      //image type
      const imageType = fileType(request.data);

      //If type not allowed error
      if (!allowedTypes.includes(imageType.mime)) throw new Error(`Image type: ${imageType.mime} not allowed.`);

      const photo = await Jimp.read(request.data);
      const outpath =
        "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname + outpath, (img) => {
          resolve(__dirname + outpath);
        });
    } catch (error) {
      reject(error);
    }
  });
}


// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    console.log('remove: ' + file)
    fs.unlinkSync(file);
  }
}
