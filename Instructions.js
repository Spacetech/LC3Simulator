var Instructions = (function () {
    function Instructions() {
    }
    Instructions.isInstruction = function (opCode) {
        return opCode in this.instructions;
    };

    Instructions.getInstruction = function (opCode) {
        return Instructions.instructions[opCode];
    };
    Instructions.instructions = {
        "ADD": new ADD(),
        "AND": new AND(),
        "BR": new BR(),
        "JMP": new JMP(),
        "JSR": new JSR(),
        "JSSR": new JSSR(),
        "LD": new LD(),
        "LDI": new LDI(),
        "LDR": new LDR(),
        "LEA": new LEA(),
        "NOT": new NOT(),
        "RET": new RET(),
        "ST": new ST(),
        "STR": new STR(),
        "STI": new STI(),
        "TRAP": new TRAP()
    };
    return Instructions;
})();
