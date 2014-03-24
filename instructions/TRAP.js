var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TRAP = (function (_super) {
    __extends(TRAP, _super);
    function TRAP() {
        _super.apply(this, arguments);
    }
    TRAP.prototype.getName = function () {
        return "TRAP";
    };

    TRAP.prototype.getOperandCount = function () {
        return 1;
    };

    TRAP.prototype.getInstructionBits = function (operands) {
        return "11110000" + Program.toBinaryPadded(operands[0].getImmediate(), 8);
    };

    TRAP.prototype.areValidOperands = function (operands) {
        return operands[0].isImmediate();
    };

    TRAP.prototype.execute = function (program, operands) {
        if (operands[0].getImmediate() == 37) {
            program.setHalted(true, true);
        }
    };
    return TRAP;
})(Instruction);
