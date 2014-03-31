var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AND = (function (_super) {
    __extends(AND, _super);
    function AND() {
        _super.apply(this, arguments);
    }
    AND.prototype.getName = function () {
        return "AND";
    };

    AND.prototype.getOperandCount = function () {
        return 3;
    };

    AND.prototype.getInstructionBits = function (operands) {
        if (operands[2].isRegisterNumber()) {
            return "0101" + Program.toBinaryPadded(operands[0].getRegisterNumber(), 3) + Program.toBinaryPadded(operands[1].getRegisterNumber(), 3) + "000" + Program.toBinaryPadded(operands[2].getRegisterNumber(), 3);
        }
        return "0101" + Program.toBinaryPadded(operands[0].getRegisterNumber(), 3) + Program.toBinaryPadded(operands[1].getRegisterNumber(), 3) + "1" + Program.toBinaryPadded(operands[2].getImmediate(), 5);
    };

    AND.prototype.areValidOperands = function (operands) {
        return operands[0].isRegisterNumber() && operands[1].isRegisterNumber() && (operands[2].isImmediate() || operands[2].isRegisterNumber());
    };

    AND.prototype.execute = function (program, operands) {
        if (operands[2].isRegisterNumber()) {
            program.setRegister(operands[0].getRegisterNumber(), program.getRegister(operands[1].getRegisterNumber(), true) & program.getRegister(operands[2].getRegisterNumber(), true));
        } else {
            program.setRegister(operands[0].getRegisterNumber(), program.getRegister(operands[1].getRegisterNumber(), true) & operands[2].getImmediate());
        }
    };
    return AND;
})(Instruction);
