var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ST = (function (_super) {
    __extends(ST, _super);
    function ST() {
        _super.apply(this, arguments);
    }
    ST.prototype.getName = function () {
        return "ST";
    };

    ST.prototype.getOperandCount = function () {
        return 2;
    };

    ST.prototype.getInstructionBits = function (operands) {
        return "0011" + Program.toBinaryPadded(operands[0].getRegisterNumber(), 3) + Program.toBinaryPadded(operands[1].getLabelAddressOffset(), 9);
    };

    ST.prototype.areValidOperands = function (operands) {
        return operands[0].isRegisterNumber() && operands[1].isLabelAddress();
    };

    ST.prototype.execute = function (program, operands) {
        program.setInstructionBits((program.getProgramCounter() + operands[1].getLabelAddressOffset()), program.getRegister(operands[0].getRegisterNumber()));
    };
    return ST;
})(Instruction);
