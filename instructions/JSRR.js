var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var JSRR = (function (_super) {
    __extends(JSRR, _super);
    function JSRR() {
        _super.apply(this, arguments);
    }
    JSRR.prototype.getName = function () {
        return "JSRR";
    };

    JSRR.prototype.getOperandCount = function () {
        return 1;
    };

    JSRR.prototype.getInstructionBits = function (operands) {
        return "0100000" + Program.toBinaryPadded(operands[0].getRegisterNumber(), 3) + "000000";
    };

    JSRR.prototype.areValidOperands = function (operands) {
        return operands[0].isRegisterNumber();
    };

    JSRR.prototype.execute = function (program, operands) {
        program.setRegister(7, program.getProgramCounter());
        program.setProgramCounter(program.getRegister(operands[0].getRegisterNumber()));
    };
    return JSRR;
})(Instruction);
