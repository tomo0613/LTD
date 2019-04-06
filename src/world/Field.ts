import {FieldEdgeSegmentBuffer, EdgeSegmentIndex} from './FieldEdgeSegmentBuffer.js';
import {Vector2} from '../common/Vector2.js';

// ToDo
type World = any;

export class Field {
    public rowIndex: PositionIndex;
    public columnIndex: PositionIndex;
    public width: number;
    public height: number;
    public position: Vector2;
    public edgeSegmentBuffer: FieldEdgeSegmentBuffer;
    public empty?: boolean;
    protected $World: World;

    constructor($World: World, rowIndex: PositionIndex, columnIndex: PositionIndex, data: string) {
        this.$World = $World;
        this.rowIndex = rowIndex;
        this.columnIndex = columnIndex;
        this.width = $World.fieldProps.width;
        this.height = $World.fieldProps.height;
        this.position = new Vector2(this.width * columnIndex, this.height * rowIndex);

        this.edgeSegmentBuffer = new FieldEdgeSegmentBuffer();

        if (!data) {
            this.empty = true;
        }
    }

    get adjacentFields(): Record<EdgeSegmentIndex, Field> {
        return this.$World.getAdjacentFields(this.rowIndex, this.columnIndex);
    }
}
