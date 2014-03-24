var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var JSSR = (function (_super) {
    __extends(JSSR, _super);
    function JSSR() {
        _super.apply(this, arguments);
    }
    JSSR.prototype.getName = function () {
        return "JSSR";
    };

    JSSR.prototype.getOperandCount = function () {
        return 1;
    };

    JSSR.prototype.getInstructionBits = function (operands) {
        return "0100000" + Program.toBinaryPadded(operands[0].getRegisterNumber(), 3) + "000000";
    };

    JSSR.prototype.areValidOperands = function (operands) {
        return operands[0].isRegisterNumber();
    };

    JSSR.prototype.execute = function (program, operands) {
        program.setRegister(7, program.getProgramCounter());
        program.setProgramCounter(program.getRegister(operands[0].getRegisterNumber()));
    };
    return JSSR;
})(Instruction);
