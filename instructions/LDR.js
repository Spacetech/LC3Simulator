var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var LDR = (function (_super) {
    __extends(LDR, _super);
    function LDR() {
        _super.apply(this, arguments);
    }
    LDR.prototype.getName = function () {
        return "LDR";
    };

    LDR.prototype.getOperandCount = function () {
        return 3;
    };

    LDR.prototype.getInstructionBits = function (operands) {
        return "0110" + Program.toBinaryPadded(operands[0].getRegisterNumber(), 3) + Program.toBinaryPadded(operands[1].getRegisterNumber(), 3) + Program.toBinaryPadded(operands[2].getImmediate(), 6);
    };

    LDR.prototype.areValidOperands = function (operands) {
        return operands[0].isRegisterNumber() && operands[1].isRegisterNumber() && operands[2].isImmediate();
    };

    LDR.prototype.execute = function (program, operands) {
        program.setRegister(operands[0].getRegisterNumber(), program.getInstructionBits(program.getRegister(operands[1].getRegisterNumber()) + operands[2].getImmediate()));
    };
    return LDR;
})(Instruction);
