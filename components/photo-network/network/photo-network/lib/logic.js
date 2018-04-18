'use strict';

/**
 * Sample transaction
 * @param {ampretia.photo.addImage} addImage
*/
async function addImage(addImage) {
    let assetRegistry = await getAssetRegistry('ampretia.photo.Image');

    let factory = getFactory();
    let pHash = factory.newConcept('ampretia.photo','pHash');
    // pHash.phash = await imghash.hash(Buffer.from(addImage.base64Img,'base64'));
    pHash.hash = addImage.pHash;
    pHash.algorthm = updateString('a cheat until this is a proper module');


    let image = factory.newResource('ampretia.photo','Image',addImage.uri);
    image.photographer = addImage.photographer;
    image.pHash = pHash;

    // cheat here....
    image.exifdata = addImage.exifdata;
    image.iptcdata = addImage.iptcdata;

    await assetRegistry.add(image);
}
