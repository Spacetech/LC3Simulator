var Instruction = (function () {
    function Instruction() {
    }
    Instruction.prototype.getName = function () {
        return "";
    };

    Instruction.prototype.getOperandCount = function () {
        return 0;
    };

    Instruction.prototype.getInstructionBits = function (operands) {
        return "0";
    };

    Instruction.prototype.areValidOperands = function (operands) {
        return true;
    };

    Instruction.prototype.execute = function (program, operands) {
    };
    return Instruction;
})();
