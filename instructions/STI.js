var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var STI = (function (_super) {
    __extends(STI, _super);
    function STI() {
        _super.apply(this, arguments);
    }
    STI.prototype.getName = function () {
        return "STI";
    };

    STI.prototype.getOperandCount = function () {
        return 2;
    };

    STI.prototype.getInstructionBits = function (operands) {
        return "1011" + Program.toBinaryPadded(operands[0].getRegisterNumber(), 3) + Program.toBinaryPadded(operands[1].getLabelAddressOffset(), 9);
    };

    STI.prototype.areValidOperands = function (operands) {
        return operands[0].isRegisterNumber() && operands[1].isLabelAddress();
    };

    STI.prototype.execute = function (program, operands) {
        program.setInstructionBits(program.getInstructionBits(program.getProgramCounter() + operands[1].getLabelAddressOffset()), program.getRegister(operands[0].getRegisterNumber()));
    };
    return STI;
})(Instruction);
