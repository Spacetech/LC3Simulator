var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BR = (function (_super) {
    __extends(BR, _super);
    function BR() {
        _super.apply(this, arguments);
    }
    BR.prototype.getName = function () {
        return "BR";
    };

    BR.prototype.getOperandCount = function () {
        return 4;
    };

    BR.prototype.getInstructionBits = function (operands) {
        return "0000" + operands[0].getImmediate() + operands[1].getImmediate() + operands[2].getImmediate() + Program.toBinaryPadded(operands[3].isLabelAddress() ? operands[3].getLabelAddressOffset() : operands[3].getImmediate(), 9);
    };

    BR.prototype.areValidOperands = function (operands) {
        return operands[0].isImmediate() && operands[1].isImmediate() && operands[2].isImmediate() && (operands[3].isLabelAddress() || operands[3].isImmediate());
    };

    BR.prototype.execute = function (program, operands) {
        if ((operands[0].getImmediate() == 1 && program.isConditionNegativeSet()) || (operands[1].getImmediate() == 1 && program.isConditionZeroSet()) || (operands[2].getImmediate() == 1 && program.isConditionPositiveSet()) || (operands[0].getImmediate() == 0 && operands[1].getImmediate() == 0 && operands[2].getImmediate() == 0)) {
            if (operands[3].isLabelAddress()) {
                program.setProgramCounter(program.getProgramCounter() + operands[3].getLabelAddressOffset());
            } else {
                program.setProgramCounter(program.getProgramCounter() + operands[3].getImmediate());
            }
        }
    };
    return BR;
})(Instruction);
