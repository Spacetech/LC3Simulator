var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var NOT = (function (_super) {
    __extends(NOT, _super);
    function NOT() {
        _super.apply(this, arguments);
    }
    NOT.prototype.getName = function () {
        return "NOT";
    };

    NOT.prototype.getOperandCount = function () {
        return 2;
    };

    NOT.prototype.getInstructionBits = function (operands) {
        return "1001" + Program.toBinaryPadded(operands[0].getRegisterNumber(), 3) + Program.toBinaryPadded(operands[1].getRegisterNumber(), 3) + "111111";
    };

    NOT.prototype.areValidOperands = function (operands) {
        return operands[0].isRegisterNumber() && operands[1].isRegisterNumber();
    };

    NOT.prototype.execute = function (program, operands) {
        program.setRegister(operands[0].getRegisterNumber(), -program.getRegister(operands[1].getRegisterNumber()) - 1);
    };
    return NOT;
})(Instruction);
