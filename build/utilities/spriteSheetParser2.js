const frameMapper = (function () {
    let spriteSheet;
    let frameWidth;
    let frameHeight;
    let rowCount;
    let columnCount;
    let frameRanges;
    const mapperInterface = {
        get: extractFrames,
        from: setFrameExtractionStart,
        to: setFrameExtractionEnd,
    };
    return {
        init,
        ...mapperInterface,
    };
    function init(_spriteSheet, _frameWidth, _frameHeight) {
        spriteSheet = _spriteSheet;
        frameWidth = _frameWidth;
        frameHeight = _frameHeight;
        rowCount = _spriteSheet.height / _frameHeight;
        columnCount = _spriteSheet.width / _frameWidth;
        frameRanges = [];
    }
    function getFrameIndices() {
        const frameIndicesToExtract = [];
        if (!frameRanges.length) {
            setFrameExtractionStart(0, 0);
        }
        frameRanges.forEach(({ from, to }) => {
            const [fromRowIndex, fromColumnIndex] = from;
            const [toRowIndex, toColumnIndex] = to;
            for (let rowIndex = fromRowIndex; rowIndex <= toRowIndex; rowIndex++) {
                for (let columnIndex = fromColumnIndex; columnIndex <= toColumnIndex; columnIndex++) {
                    frameIndicesToExtract.push([rowIndex, columnIndex]);
                }
            }
        });
        return frameIndicesToExtract;
    }
    function extractFrame(xIndex, yIndex) {
        return createFrameBuffer(spriteSheet, yIndex * frameWidth, xIndex * frameHeight, frameWidth, frameHeight);
    }
    function extractFrames(...frameIndices) {
        const frames = (frameIndices.length ? frameIndices : getFrameIndices()).map(([rowIndex, columnIndex]) => {
            return extractFrame(rowIndex, columnIndex);
        });
        frameRanges.length = 0;
        return frames.length === 1 ? frames[0] : frames;
    }
    function setFrameExtractionStart(fromRowIndex, fromColumnIndex) {
        frameRanges.push({ from: [fromRowIndex, fromColumnIndex], to: [rowCount, columnCount] });
        return mapperInterface;
    }
    function setFrameExtractionEnd(toRowIndex, toColumnIndex) {
        if (!frameRanges.length) {
            setFrameExtractionStart(0, 0);
        }
        frameRanges[frameRanges.length - 1].to = [toRowIndex, toColumnIndex];
        return mapperInterface;
    }
})();
export function parseSpriteSheet(spriteSheet, frameWidth, frameHeight, spriteSheetMapper) {
    frameMapper.init(spriteSheet, frameWidth, frameHeight);
    return spriteSheetMapper(frameMapper);
}
function createFrameBuffer(sprite, srcX, srcY, srcW, srcH, destX = 0, destY = 0, destW = srcW, destH = srcH) {
    const frameBuffer = document.createElement('canvas');
    frameBuffer.width = destW;
    frameBuffer.height = destH;
    frameBuffer.getContext('2d').drawImage(sprite, srcX, srcY, srcW, srcH, destX, destY, destW, destH);
    return frameBuffer;
}
//# sourceMappingURL=spriteSheetParser2.js.map