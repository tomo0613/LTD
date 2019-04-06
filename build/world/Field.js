import { FieldEdgeSegmentBuffer } from './FieldEdgeSegmentBuffer.js';
import { Vector2 } from '../common/Vector2.js';
export class Field {
    constructor($World, rowIndex, columnIndex, data) {
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
    get adjacentFields() {
        return this.$World.getAdjacentFields(this.rowIndex, this.columnIndex);
    }
}
//# sourceMappingURL=Field.js.map