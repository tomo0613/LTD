type RowIndex = number;

type ColumnIndex = number;

type FrameIndex = [RowIndex, ColumnIndex];

type FrameRange = {
    from: FrameIndex;
    to: FrameIndex;
};

type FrameMapper = typeof frameMapper;

type Frames = ReturnType<FrameMapper['get']>;

type SpriteSheetMapper = (frameMapper: FrameMapper) => Record<string, Frames>;

type MapperOptions = {
    scale?: number;
};

const frameMapper = (function () {
    let spriteSheet: HTMLImageElement;
    let frameWidth: number;
    let frameHeight: number;
    let rowCount: number;
    let columnCount: number;
    let frameRanges: FrameRange[];
    let scale = 1;

    const mapperInterface = {
        get: extractFrames,
        from: setFrameExtractionStart,
        to: setFrameExtractionEnd,
    };

    return {
        init,
        ...mapperInterface,
    };

    function init(_spriteSheet: HTMLImageElement, _frameWidth: number, _frameHeight: number, options: MapperOptions) {
        spriteSheet = _spriteSheet;
        frameWidth = _frameWidth;
        frameHeight = _frameHeight;
        rowCount = _spriteSheet.height / _frameHeight;
        columnCount = _spriteSheet.width / _frameWidth;
        frameRanges = [];

        if (options && options.scale) {
            scale = options.scale;
        }
    }

    function getFrameIndices() {
        const frameIndicesToExtract = [];

        if (!frameRanges.length) {
            setFrameExtractionStart(0, 0);
        }

        frameRanges.forEach(({from, to}) => {
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

    function extractFrame(xIndex: number, yIndex: number) {
        return createFrameBuffer(
            spriteSheet,
            yIndex * frameWidth,
            xIndex * frameHeight,
            frameWidth,
            frameHeight,
            0,
            0,
            Math.ceil(frameWidth * scale),
            Math.ceil(frameHeight * scale),
        );
    }

    function extractFrames(...frameIndices: FrameIndex[]|undefined) {
        const frames = (frameIndices.length ? frameIndices : getFrameIndices()).map(([rowIndex, columnIndex]) => {
            return extractFrame(rowIndex, columnIndex);
        });

        frameRanges.length = 0;

        return frames;
    }

    function setFrameExtractionStart(fromRowIndex: number, fromColumnIndex: number) {
        frameRanges.push({from: [fromRowIndex, fromColumnIndex], to: [rowCount, columnCount]});

        return mapperInterface;
    }

    function setFrameExtractionEnd(toRowIndex: number, toColumnIndex: number) {
        if (!frameRanges.length) {
            setFrameExtractionStart(0, 0);
        }
        frameRanges[frameRanges.length - 1].to = [toRowIndex, toColumnIndex];

        return mapperInterface;
    }
})();

export function parseSpriteSheet<Mapper extends SpriteSheetMapper>(
    spriteSheet: HTMLImageElement,
    frameWidth: number,
    frameHeight: number,
    spriteSheetMapper: Mapper,
    options: MapperOptions,
) {
    frameMapper.init(spriteSheet, frameWidth, frameHeight, options);

    return spriteSheetMapper(frameMapper) as {[Key in keyof ReturnType<Mapper>]: Frames};
}

function createFrameBuffer(
    sprite: HTMLImageElement,
    srcX: number,
    srcY: number,
    srcW: number,
    srcH: number,
    destX = 0,
    destY = 0,
    destW = srcW,
    destH = srcH,
) {
    const frameBuffer = document.createElement('canvas');

    frameBuffer.width = destW;
    frameBuffer.height = destH;

    frameBuffer.getContext('2d').drawImage(sprite, srcX, srcY, srcW, srcH, destX, destY, destW, destH);

    return frameBuffer;
}
