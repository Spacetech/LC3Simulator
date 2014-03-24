var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ADD = (function (_super) {
    __extends(ADD, _super);
    function ADD() {
        _super.apply(this, arguments);
    }
    ADD.prototype.getName = function () {
        return "ADD";
    };

    ADD.prototype.getOperandCount = function () {
        return 3;
    };

    ADD.prototype.getInstructionBits = function (operands) {
        if (operands[2].isRegisterNumber()) {
            return "0001" + Program.toBinaryPadded(operands[0].getRegisterNumber(), 3) + Program.toBinaryPadded(operands[1].getRegisterNumber(), 3) + "000" + +Program.toBinaryPadded(operands[2].getRegisterNumber(), 3);
        }
        return "0001" + Program.toBinaryPadded(operands[0].getRegisterNumber(), 3) + Program.toBinaryPadded(operands[1].getRegisterNumber(), 3) + "1" + Program.toBinaryPadded(operands[2].getImmediate(), 5);
    };

    ADD.prototype.areValidOperands = function (operands) {
        return operands[0].isRegisterNumber() && operands[1].isRegisterNumber() && (operands[2].isImmediate() || operands[2].isRegisterNumber());
    };

    ADD.prototype.execute = function (program, operands) {
        if (operands[2].isRegisterNumber()) {
            program.setRegister(operands[0].getRegisterNumber(), program.getRegister(operands[1].getRegisterNumber()) + program.getRegister(operands[2].getRegisterNumber()));
        } else {
            program.setRegister(operands[0].getRegisterNumber(), program.getRegister(operands[1].getRegisterNumber()) + operands[2].getImmediate());
        }
    };
    return ADD;
})(Instruction);
