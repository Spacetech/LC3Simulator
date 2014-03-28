class Program {
    private memory: number = Math.pow(2, 16);

    private code: CodeLine[] = new Array(this.memory);
    private labels: { [name: string]: number } = {};
    private registers: number[] = new Array(8);
    private conditions: boolean[] = new Array(3);

    private halted: boolean;
    private programCounter: number;
    private origAddress: number;
    private reachedHalt: boolean;
    private interval: number;

    private codeElement: HTMLTableElement;
    private logElement: HTMLTableElement;
    private programCounterElement: HTMLElement;
    private registersElements: HTMLElement[] = new Array(8);
    private conditionElements: HTMLElement[] = new Array(3);

    public static LOG_NORMAL: number = 0;
    public static LOG_INFO: number = 1;
    public static LOG_SUCCESS: number = 2;
    public static LOG_WARNING: number = 3;
    public static LOG_DANGER: number = 4;

    constructor() {
        this.interval = null;
        this.codeElement = <HTMLTableElement>document.getElementById("code");
        this.logElement = <HTMLTableElement>document.getElementById("log");
        this.programCounterElement = document.getElementById("program-counter");

        for (var i = 0; i < 8; i++) {
            this.registersElements[i] = document.getElementById("register-" + i);
        }

        for (var i = 0; i < 3; i++) {
            this.conditionElements[i] = document.getElementById("condition-" + i);
        }

        this.reset();
    }

    onCommandRun() {
        if (this.interval === null) {
            this.run();
        }
        else {
            this.stopInterval();
            this.setHalted(true);
            this.log("Stopped running", Program.LOG_INFO);
        }
    }

    onCommandStep() {
        this.stopInterval();
        this.setHalted(true);
        this.step();
    }

    onCommandResetProgram() {
        this.reset(false);
        this.setProgramCounter(this.origAddress);
        this.log("Reset program", Program.LOG_INFO);
    }

    onCommandClearLog() {
        for (var i = this.logElement.rows.length - 1; i >= 0; i--) {
            this.logElement.deleteRow(i);
        }
    }

    stopInterval() {
        if (this.interval !== null) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    getProgramCounter() {
        return this.programCounter;
    }

    setProgramCounter(programCounter: number) {
        if (programCounter === undefined) {
            this.programCounterElement.innerHTML = "<h2>-</h2>";
            return;
        }

        var item = this.programCounter - this.origAddress;
        if (item >= 0) {
            var element = <HTMLElement>this.codeElement.rows.item(item);
            if (element != null) {
                element.className = "";
            }
        }

        this.programCounter = programCounter;

        var item = this.programCounter - this.origAddress;
        if (item >= 0) {
            var element = <HTMLElement>this.codeElement.rows.item(item);
            if (element != null) {
                element.className = "active";
                element.scrollIntoView(false);
            }
        }

        this.programCounterElement.innerHTML = "<h2>" + Program.toHex(this.programCounter) + "</h2>";
    }

    getRegister(index: number, override: boolean = false) {
        if (!override && this.registers[index] === undefined) {
            throw "tried to access uninitialized register";
        }
        return this.registers[index];
    }

    setRegister(index: number, value: number) {
        if (index < 0 || index > 7) {
            throw "tried to access invalid register '" + index + "'";
        }

        if (value >= this.memory || value < -this.memory) {
            throw "register '" + index + "' overflowed";
        }

        this.registers[index] = value;

        if (value === undefined) {
            this.registersElements[index].innerHTML = "<h2>-</h2><h4>-</h4>";
        }
        else {
            // 0 - negative
            // 1 - zero
            // 2 - positive
            this.setCondition(0, value < 0);
            this.setCondition(1, value == 0);
            this.setCondition(2, value > 0);

            this.registersElements[index].innerHTML = "<h2>" + value + "</h2><h4>" + Program.toHex(value) + "</h4>";
        }
    }

    setCondition(index: number, value: boolean) {
        this.conditions[index] = value;

        if (value === undefined) {
            this.conditionElements[index].innerHTML = "<h2>-</h2>";
        }
        else {
            this.conditionElements[index].innerHTML = "<h2>" + (value ? 1 : 0) + "</h2>";
        }
    }

    isHalted() {
        return this.halted;
    }

    setHalted(halted: boolean, reachedHalt: boolean = null) {
        this.halted = halted;
        if (reachedHalt !== null) {
            this.reachedHalt = reachedHalt;
        }
    }

    isLabel(name: string) {
        return name in this.labels;
    }

    getLabel(name: string) {
        return this.labels[name];
    }

    getLabelAtAddress(address: number) {
        for (var key in this.labels) {
            if (this.labels[key] === address) {
                return key;
            }
        }
        return "";
    }

    setLabel(name: string, address: number) {
        this.labels[name] = address;
    }

    getInstructionBits(address: number) {
        return parseInt(this.getInstructionBitsBinary(address), 2);
    }

    getInstructionBitsBinary(address: number) {
        return this.code[address].getInstructionBits();
    }

    getInstructionBitsHex(address: number) {
        return Program.toHex(this.getInstructionBits(address));
    }

    getInstructionBitsHexPadded(address: number, padding: number) {
        return Program.toHexPadded(this.getInstructionBits(address), padding);
    }

    setInstructionBits(address: number, data: number) {
        this.code[address].setInstructionBits(data);
        this.updateCodeTableRow(this.code[address]);
    }

    isConditionNegativeSet() {
        if (this.conditions[0] === undefined) {
            throw "tried to access uninitilized negative condition bit ";
        }
        return this.conditions[0];
    }

    isConditionZeroSet() {
        if (this.conditions[1] === undefined) {
            throw "tried to access uninitilized zero condition bit ";
        }
        return this.conditions[1];
    }

    isConditionPositiveSet() {
        if (this.conditions[2] === undefined) {
            throw "tried to access uninitilized positive condition bit ";
        }
        return this.conditions[2];
    }

    reset(resetCode: boolean = true) {
        this.stopInterval();
        this.setHalted(false, false);
        this.setProgramCounter(undefined);

        for (var i = 0; i < this.conditions.length; i++) {
            this.setCondition(i, undefined);
        }

        for (var i = 0; i < this.registers.length; i++) {
            this.setRegister(i, undefined);
        }

        if (resetCode) {
            for (var i = this.codeElement.rows.length - 1; i >= 0; i--) {
                this.codeElement.deleteRow(i);
            }
            this.addCodeTableFullRow("Click Load File to get started.");
        }
    }

    run() {
        if (this.origAddress === undefined) {
            this.log("Load a file before running", Program.LOG_WARNING);
            return;
        }

        if (this.interval !== null) {
            this.log("Already running", Program.LOG_WARNING);
            return;
        }

        this.log("Running", Program.LOG_INFO);

        this.setHalted(false);

        this.stopInterval();

        this.interval = setInterval(() => {
            var display = this.step();
            if (this.isHalted()) {
                this.stopInterval();
                if (display) {
                    this.log("Finished running", Program.LOG_INFO);
                }
            }
        }, 1);
    }

    step() {
        if (this.origAddress === undefined) {
            this.log("Load a file before stepping", Program.LOG_WARNING);
            return false;
        }

        if (this.reachedHalt) {
            this.setHalted(true);
            this.log("Cannot step past HALT", Program.LOG_WARNING);
            return false;
        }

        var line = this.code[this.getProgramCounter()];

        this.setProgramCounter(this.getProgramCounter() + 1);

        try {
            line.execute(this, line.getOperands());
            return true;
        }
        catch (ex) {
            this.setHalted(true);
            this.log("Error executing line '" + Program.toHex(this.getProgramCounter() - 1) + "': " + ex, Program.LOG_DANGER);
            //throw ex;
        }

        return false;
    }

    setCodeLine(instruction: Instruction, operands: Operand[], address: number, data: number) {
        this.code[address] = new CodeLine(instruction, operands, address, data);
    }

    open(str: string) {
        //this.log("Loading source code", Program.LOG_INFO);

        this.code = new Array(this.memory);
        this.labels = {};

        var lines = str.toUpperCase().split("\n");

        if (lines.length == 0) {
            throw "Program file is empty";
        }

        var origLine = lines[0].trim();
        var origSplit = origLine.split(" ");

        if (origSplit.length != 2 || origSplit[0] != ".ORIG") {
            throw "Expected first line to contain .ORIG";
        }

        this.codeElement.deleteRow(0);

        this.origAddress = parseInt("0" + origSplit[1], 16);

        var foundEnd = false;

        for (var s = 0; s < 2; s++) {
            var symbols = s == 0;
            var address = this.origAddress;

            for (var i = 1; i < lines.length; i++) {
                var lineTrim = lines[i].trim();

                if (lineTrim.length == 0 || lineTrim.charAt(0) == ";") {
                    continue;
                }

                var lineSplit = lineTrim.split(" ");
                var opCode = lineSplit[0];

                if (opCode == ".END") {
                    if (!symbols) {
                        foundEnd = true;
                    }
                    break;
                }

                try {
                    address = this.parseLine(lineTrim, lineSplit, opCode, address, symbols);
                }
                catch (ex) {
                    throw "line " + (i + 1) + ": " + ex;
                }

            }
        }

        if (!foundEnd) {
            throw ".END not found";
        }

        this.setProgramCounter(this.origAddress);

        //this.log("Loaded source code", Program.LOG_SUCCESS);
    }

    parseLine(lineTrim: string, lineSplit: string[], opCode: string, address: number, symbols: boolean) {

        var isBranch = false; // he's special
        var operands = [];

        if (opCode.substr(-1) == ":") {
            opCode = opCode.substr(0, opCode.length - 1);
        }
        else if (opCode.length >= 2 && opCode.substr(0, 2) == "BR") {
            isBranch = true;

            if (!symbols) {
                var remaining = opCode.substr(2);

                for (var i = 0; i < remaining.length; i++) {
                    if (remaining[i] != "N" && remaining[i] != "Z" && remaining[i] != "P") {
                        throw "invalid branch instruction, unknown character '" + remaining[i] + "'";
                    }
                }

                if (remaining.indexOf("N") != remaining.lastIndexOf("N") || remaining.indexOf("Z") != remaining.lastIndexOf("Z") || remaining.indexOf("P") != remaining.lastIndexOf("P")) {
                    throw "invalid branch instruction, double condition detected";
                }

                operands.push(new Operand(program, "#" + (remaining.indexOf("N") != -1 ? "1" : "0"), address));
                operands.push(new Operand(program, "#" + (remaining.indexOf("Z") != -1 ? "1" : "0"), address));
                operands.push(new Operand(program, "#" + (remaining.indexOf("P") != -1 ? "1" : "0"), address));
            }
        }

        if (opCode === "HALT") {
            opCode = "TRAP";
            operands.push(new Operand(program, "X25", address));
        }

        if (!Instructions.isInstruction(opCode) && !isBranch) {

            // let's assume it's a label.
            if (symbols) {
                if (this.isLabel(opCode)) {
                    throw "a label with the name " + opCode + " already exists";
                }
                this.setLabel(opCode, address);
            }

            if (lineSplit.length == 1) {
                // label on a line by itself
                return address;
            }

            if (lineSplit.length >= 3) {

                if (lineSplit[1] == ".FILL") {
                    symbols ? this.setCodeLine(null, null, address, Program.toNumber(lineSplit[2])) : this.updateCodeTableRow(this.code[address]);
                }
                else if (lineSplit[1] == ".BLKW") {
                    var len = Program.toNumber(lineSplit[2]);

                    if (len <= 0) {
                        throw "invalid BLKW length '" + len + "'";
                    }

                    for (var i = 0; i < len; i++) {
                        symbols ? this.setCodeLine(null, null, address + i, 0) : this.updateCodeTableRow(this.code[address + i]);
                    }

                    return address + len;
                }
                else if (lineSplit[1] == ".STRINGZ") {
                    var len = lineSplit[2].length;

                    for (var i = 0; i < len; i++) {
                        symbols ? this.setCodeLine(null, null, address + i, lineSplit[2].charCodeAt(i)) : this.updateCodeTableRow(this.code[address + i]);
                    }

                    symbols ? this.setCodeLine(null, null, address + len, 0) : this.updateCodeTableRow(this.code[address + len]);

                    return address + len + 1;
                }                
            }
        }

        if (symbols) {
            return address + 1;
        }

        if (this.isLabel(opCode)) {
            if (lineSplit.length >= 2) {
                lineTrim = lineTrim.substr(opCode.length + 2);
                opCode = lineSplit[1];

                if (opCode === "HALT") {
                    opCode = "TRAP";
                    operands.push(new Operand(program, "X25", address));
                }
            }
        }

        if (!Instructions.isInstruction(opCode) && !isBranch) {
            //throw "invalid instruction '" + opCode + "'";
            return address + 1;
        }

        //this.log("Instruction " + opCode);

        var instruction = Instructions.getInstruction(opCode);
        if (instruction === undefined) {
            if (opCode.length > 2 && opCode.substr(0, 2) == "BR") {
                instruction = Instructions.getInstruction("BR");
            }
        }

        if (instruction === undefined) {
            throw "invalid instruction for opCode '" + opCode + "'";
        }

        var operandTrim = lineTrim.substr(opCode.length).trim();
        var operandSplit = operandTrim.split(",");

        if (operandTrim.length == 0) {
            operandSplit = [];
        }

        for (var j = 0; j < operandSplit.length; j++) {
            var arg = operandSplit[j].trim();
            operands.push(new Operand(this, arg, address));
        }

        if (operands.length != instruction.getOperandCount()) {
            throw "invalid number of operands for '" + opCode + "' expected '" + instruction.getOperandCount() + "', got '" + operands.length + "'";
        }

        if (!instruction.areValidOperands(operands)) {
            throw "invalid operands for '" + opCode + "'";
        }

        this.setCodeLine(instruction, operands, address, null);
        this.updateCodeTableRow(this.code[address]);

        //this.log("Instruction " + opCode + " @ 0x" + Program.toHex(address));

        return address + 1;
    }

    log(line: string, type: number = Program.LOG_NORMAL) {
        var tbody = <HTMLElement>this.logElement.tBodies.item(0);

        var scrollDown = (tbody.scrollHeight - tbody.scrollTop) == tbody.clientHeight;

        var row = <HTMLTableRowElement>this.logElement.insertRow(this.logElement.rows.length);

        switch (type) {
            case Program.LOG_INFO:
                row.className = "info";
                break;
            case Program.LOG_SUCCESS:
                row.className = "success";
                break;
            case Program.LOG_WARNING:
                row.className = "warning";
                break;
            case Program.LOG_DANGER:
                row.className = "danger";
                break;
            default:
                break;
        }

        var cell = row.insertCell(0);
        cell.innerHTML = line;

        if (scrollDown) {
            tbody.scrollTop = tbody.scrollHeight;
        }
    }

    addCodeTableFullRow(line: string) {
        var row = <HTMLTableRowElement>this.codeElement.insertRow(this.codeElement.rows.length);
        row.className = "info";

        var cell = <HTMLTableCellElement>row.insertCell(0);
        cell.innerHTML = line;
        cell.colSpan = 6;
    }

    updateCodeTableRow(codeLine: CodeLine) {

        if (codeLine === undefined) {
            return;
        }

        var row = codeLine.getRow();
        var cell0, cell1, cell2, cell3, cell4, cell5;

        if (row == null) {
            row = <HTMLTableRowElement>this.codeElement.insertRow(this.codeElement.rows.length);
            codeLine.setRow(row);

            cell0 = row.insertCell(0);
            cell1 = row.insertCell(1);
            cell2 = row.insertCell(2);
            cell3 = row.insertCell(3);
            cell4 = row.insertCell(4);
            cell5 = row.insertCell(5);
        }
        else {
            cell0 = row.cells[0];
            cell1 = row.cells[1];
            cell2 = row.cells[2];
            cell3 = row.cells[3];
            cell4 = row.cells[4];
            cell5 = row.cells[5];
        }

        var address = codeLine.getAddress();
        var instruction = codeLine.getInstruction();
        var operands = codeLine.getOperands();

        if (operands !== null) {
            operands = operands.slice(0); // clone it.
        }

        var instructionName = "";
        if (instruction != null) {
            instructionName = instruction.getName();
            if (instructionName === "BR") {
                if (operands.shift().getImmediate() === 1) {
                    instructionName += "n";
                }
                if (operands.shift().getImmediate() === 1) {
                    instructionName += "z";
                }
                if (operands.shift().getImmediate() === 1) {
                    instructionName += "p";
                }
            }
        }

        var html = "";

        if (operands !== null) {
            for (var i = 0; i < operands.length; i++) {

                var operand = operands[i];

                if (operand.isRegisterNumber()) {
                    html += "R" + operand.getRegisterNumber();
                }
                else if (operand.isLabelAddress()) {
                    html += this.getLabelAtAddress(operand.getLabelAddress());
                }
                else if (operand.isImmediate()) {
                    if (instructionName === "TRAP") {
                        switch (operand.getImmediate()) {
                            case 37:
                                html += "HALT";
                                break;

                            default:
                                html += "#" + operand.getImmediate();
                                break;
                        }
                    }
                    else {
                        html += "#" + operand.getImmediate();
                    }
                }
                else {
                    // error?
                }

                html += " ";
            }

            html = html.substr(0, html.length - 1);
        }

        cell0.innerHTML = Program.toHex(address);
        cell1.innerHTML = this.getInstructionBitsBinary(address);
        cell2.innerHTML = this.getInstructionBitsHexPadded(address, 4);
        cell3.innerHTML = this.getLabelAtAddress(address);
        cell4.innerHTML = instructionName;
        cell5.innerHTML = html;
    }

    static toHex(data: number) {
        var ret = "0x";
        if (data < 0) {
            data *= -1;
            ret = "-" + ret;
        }
        return ret + data.toString(16).toUpperCase();
    }

    static toHexPadded(data: number, padding: number) {
        var temp = data.toString(16);
        var zeros = Array(padding - temp.length + 1).join("0");
        return "0x" + zeros + temp.toUpperCase();
    }

    static toBinaryPadded(data: number, padding: number) {
        var temp = (data >>> 0).toString(2).toUpperCase();
        if (temp.length > padding) {
            return temp.substr(-padding);
        }
        var zeros = Array(padding - temp.length + 1).join("0");
        return zeros + temp;
    }

    static toNumber(num: string) {
        var radix = 10;

        if (num.charAt(0) == "X") {
            radix = 16;
            num = "0" + num;
        }
        else if (num.length > 2 && num.charAt(0) == "0" && num.charAt(1) == "X") {
            radix = 16;
        }

        return parseInt(num, radix);
    }
}
