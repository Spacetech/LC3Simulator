var CodeLine = (function () {
    function CodeLine(instruction, operands, address, data) {
        this.instruction = instruction;
        this.operands = operands;
        this.address = address;
        this.data = data;
    }
    CodeLine.prototype.getInstruction = function () {
        return this.instruction;
    };

    CodeLine.prototype.getOperands = function () {
        return this.operands;
    };

    CodeLine.prototype.getAddress = function () {
        return this.address;
    };

    CodeLine.prototype.isData = function () {
        return this.data !== null;
    };

    CodeLine.prototype.getData = function () {
        return this.data;
    };

    CodeLine.prototype.getInstructionBits = function () {
        if (this.instruction !== null && this.operands !== null) {
            return this.instruction.getInstructionBits(this.operands);
        }
        return Program.toBinaryPadded(this.data, 16);
    };

    CodeLine.prototype.setInstructionBits = function (data) {
        this.data = data;
    };

    CodeLine.prototype.execute = function (program, operands) {
        if (this.isData()) {
            throw "tried to execute data line";
        }
        this.instruction.execute(program, operands);
    };
    return CodeLine;
})();
