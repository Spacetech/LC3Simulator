var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var STR = (function (_super) {
    __extends(STR, _super);
    function STR() {
        _super.apply(this, arguments);
    }
    STR.prototype.getName = function () {
        return "STR";
    };

    STR.prototype.getOperandCount = function () {
        return 3;
    };

    STR.prototype.getInstructionBits = function (operands) {
        return "0111" + Program.toBinaryPadded(operands[0].getRegisterNumber(), 3) + Program.toBinaryPadded(operands[1].getRegisterNumber(), 3) + Program.toBinaryPadded(operands[2].getLabelAddressOffset(), 6);
    };

    STR.prototype.areValidOperands = function (operands) {
        return operands[0].isRegisterNumber() && operands[1].isRegisterNumber() && operands[2].isImmediate();
    };

    STR.prototype.execute = function (program, operands) {
        program.setInstructionBits((program.getRegister(operands[1].getRegisterNumber()) + operands[2].getImmediate()), program.getRegister(operands[0].getRegisterNumber()));
    };
    return STR;
})(Instruction);
