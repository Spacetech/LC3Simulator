var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var JSR = (function (_super) {
    __extends(JSR, _super);
    function JSR() {
        _super.apply(this, arguments);
    }
    JSR.prototype.getName = function () {
        return "JSR";
    };

    JSR.prototype.getOperandCount = function () {
        return 1;
    };

    JSR.prototype.getInstructionBits = function (operands) {
        return "01001" + Program.toBinaryPadded(operands[0].getLabelAddressOffset(), 11);
    };

    JSR.prototype.areValidOperands = function (operands) {
        return operands[0].isLabelAddress();
    };

    JSR.prototype.execute = function (program, operands) {
        program.setRegister(7, program.getProgramCounter());
        program.setProgramCounter(program.getProgramCounter() + operands[0].getLabelAddressOffset());
    };
    return JSR;
})(Instruction);
