export { getURL, getTileBBox, getMercCoords };


/**
 * getURL
 *
 * @param    {String}  baseUrl  Base url of the WMS server
 * @param    {String}  layer    Layer name
 * @param    {Number}  x        Tile coordinate x
 * @param    {Number}  y        Tile coordinate y
 * @param    {Number}  z        Tile zoom
 * @param    {Object}  [options]
 * @param    {String}  [options.format='image/png']
 * @param    {String}  [options.service='WMS']
 * @param    {String}  [options.version='1.1.1']
 * @param    {String}  [options.request='GetMap']
 * @param    {String}  [options.srs='EPSG:3857']
 * @param    {Number}  [options.width='256']
 * @param    {Number}  [options.height='256']
 * @returns  {String}  url
 * @example
 * var baseUrl = 'http://geodata.state.nj.us/imagerywms/Natural2015';
 * var layer = 'Natural2015';
 * var url = whoots.getURL(baseUrl, layer, 154308, 197167, 19);
 */
function getURL(baseUrl, layer, x, y, z, options) {
    options = options || {};
    let crs=options.crs || 'EPSG:3857';
    var url = baseUrl + '?' + [
        'bbox='    + getTileBBox(x, y, z,crs),
        'format='  + (options.format || 'image/png'),
        'service=' + (options.service || 'WMS'),
        'version=' + (options.version || '1.1.1'),
        'request=' + (options.request || 'GetMap'),
        'srs='     + crs,
        'width='   + (options.width || 256),
        'height='  + (options.height || 256),
        'layers='  + layer
    ].join('&');

    return url;
}


/**
 * getTileBBox
 *
 * @param    {Number}  x  Tile coordinate x
 * @param    {Number}  y  Tile coordinate y
 * @param    {Number}  z  Tile zoom
 * @param    {String}  srs 
 * @returns  {String}  String of the bounding box
 */
function getTileBBox(x, y, z,crs) {
    if(crs==='EPSG:4490'){
        const scale = 360 / Math.pow(2, z);

        const minX = x * scale - 180;
        const minY = 90 - (y + 1) * scale;
        const maxX = (x + 1) * scale - 180;
        const maxY = 90 - y * scale;
    
        return [minX, minY, maxX, maxY].join(',');
    }else{
        y = (Math.pow(2, z) - y - 1);
        var min = getMercCoords(x * 256, y * 256, z),
            max = getMercCoords((x + 1) * 256, (y + 1) * 256, z);
        return min[0] + ',' + min[1] + ',' + max[0] + ',' + max[1];
    }
    

   
}


/**
 * getMercCoords
 *
 * @param    {Number}  x  Pixel coordinate x
 * @param    {Number}  y  Pixel coordinate y
 * @param    {Number}  z  Tile zoom
 * @returns  {Array}   [x, y]
 */
function getMercCoords(x, y, z) {
    var resolution = (2 * Math.PI * 6378137 / 256) / Math.pow(2, z),
        merc_x = (x * resolution - 2 * Math.PI  * 6378137 / 2.0),
        merc_y = (y * resolution - 2 * Math.PI  * 6378137 / 2.0);

    return [merc_x, merc_y];
}
