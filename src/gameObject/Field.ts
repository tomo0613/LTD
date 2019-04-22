import {FieldEdgeSegmentBuffer, EdgeSegmentIndex} from './FieldEdgeSegmentBuffer.js';
import {BaseObject} from './BaseObject.js';

// ToDo
type World = any;

export class Field extends BaseObject {
    public rowIndex: PositionIndex;
    public columnIndex: PositionIndex;
    public edgeSegmentBuffer: FieldEdgeSegmentBuffer;
    public empty?: boolean;
    protected $World: World;

    constructor($World: World, rowIndex: PositionIndex, columnIndex: PositionIndex, data: string) {
        const width = $World.fieldProps.width;
        const height = $World.fieldProps.height;

        // ToDo All fields are same width  & height.
        // TypeObj ? some pattern ?

        super(width, height, width * columnIndex, height * rowIndex);

        this.$World = $World;
        this.rowIndex = rowIndex;
        this.columnIndex = columnIndex;

        this.edgeSegmentBuffer = new FieldEdgeSegmentBuffer();

        if (!data) {
            this.empty = true;
        }
    }

    get adjacentFields(): Record<EdgeSegmentIndex, Field> {
        return this.$World.getAdjacentFields(this.rowIndex, this.columnIndex);
    }
}
