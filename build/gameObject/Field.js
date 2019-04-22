import { FieldEdgeSegmentBuffer } from './FieldEdgeSegmentBuffer.js';
import { BaseObject } from './BaseObject.js';
export class Field extends BaseObject {
    constructor($World, rowIndex, columnIndex, data) {
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
    get adjacentFields() {
        return this.$World.getAdjacentFields(this.rowIndex, this.columnIndex);
    }
}
//# sourceMappingURL=Field.js.map