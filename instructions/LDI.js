var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var LDI = (function (_super) {
    __extends(LDI, _super);
    function LDI() {
        _super.apply(this, arguments);
    }
    LDI.prototype.getName = function () {
        return "LDI";
    };

    LDI.prototype.getOperandCount = function () {
        return 2;
    };

    LDI.prototype.getInstructionBits = function (operands) {
        return "1010" + Program.toBinaryPadded(operands[0].getRegisterNumber(), 3) + Program.toBinaryPadded(operands[1].getLabelAddressOffset(), 9);
    };

    LDI.prototype.areValidOperands = function (operands) {
        return operands[0].isRegisterNumber() && operands[1].isLabelAddress();
    };

    LDI.prototype.execute = function (program, operands) {
        program.setRegister(operands[0].getRegisterNumber(), program.getInstructionBits(program.getInstructionBits(operands[1].getLabelAddressOffset())));
    };
    return LDI;
})(Instruction);
