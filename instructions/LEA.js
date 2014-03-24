var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var LEA = (function (_super) {
    __extends(LEA, _super);
    function LEA() {
        _super.apply(this, arguments);
    }
    LEA.prototype.getName = function () {
        return "LEA";
    };

    LEA.prototype.getOperandCount = function () {
        return 2;
    };

    LEA.prototype.getInstructionBits = function (operands) {
        return "1110" + Program.toBinaryPadded(operands[0].getRegisterNumber(), 3) + Program.toBinaryPadded(operands[1].getLabelAddressOffset(), 9);
    };

    LEA.prototype.areValidOperands = function (operands) {
        return operands[0].isRegisterNumber() && operands[1].isLabelAddress();
    };

    LEA.prototype.execute = function (program, operands) {
        program.setRegister(operands[0].getRegisterNumber(), (program.getProgramCounter() + operands[1].getLabelAddressOffset()));
    };
    return LEA;
})(Instruction);
