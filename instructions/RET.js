var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var RET = (function (_super) {
    __extends(RET, _super);
    function RET() {
        _super.apply(this, arguments);
    }
    RET.prototype.getName = function () {
        return "RET";
    };

    RET.prototype.getOperandCount = function () {
        return 0;
    };

    RET.prototype.getInstructionBits = function (operands) {
        return "1100000111000000";
    };

    RET.prototype.execute = function (program, operands) {
        program.setProgramCounter(program.getRegister(7));
    };
    return RET;
})(Instruction);
