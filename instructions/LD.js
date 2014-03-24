var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var LD = (function (_super) {
    __extends(LD, _super);
    function LD() {
        _super.apply(this, arguments);
    }
    LD.prototype.getName = function () {
        return "LD";
    };

    LD.prototype.getOperandCount = function () {
        return 2;
    };

    LD.prototype.getInstructionBits = function (operands) {
        return "0010" + Program.toBinaryPadded(operands[0].getRegisterNumber(), 3) + Program.toBinaryPadded(operands[1].getLabelAddressOffset(), 9);
    };

    LD.prototype.areValidOperands = function (operands) {
        return operands[0].isRegisterNumber() && operands[1].isLabelAddress();
    };

    LD.prototype.execute = function (program, operands) {
        program.setRegister(operands[0].getRegisterNumber(), program.getInstructionBits(program.getProgramCounter() + operands[1].getLabelAddressOffset()));
    };
    return LD;
})(Instruction);
