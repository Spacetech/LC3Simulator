var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var JMP = (function (_super) {
    __extends(JMP, _super);
    function JMP() {
        _super.apply(this, arguments);
    }
    JMP.prototype.getName = function () {
        return "JMP";
    };

    JMP.prototype.getOperandCount = function () {
        return 1;
    };

    JMP.prototype.getInstructionBits = function (operands) {
        return "1100000" + Program.toBinaryPadded(operands[0].getRegisterNumber(), 3) + "000000";
    };

    JMP.prototype.areValidOperands = function (operands) {
        return operands[0].isRegisterNumber();
    };

    JMP.prototype.execute = function (program, operands) {
        program.setRegister(7, program.getProgramCounter());
        program.setProgramCounter(program.getRegister(operands[0].getRegisterNumber()));
    };
    return JMP;
})(Instruction);
