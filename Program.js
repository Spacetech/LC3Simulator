var Program = (function () {
    function Program() {
        this.memory = Math.pow(2, 16);
        this.code = new Array(this.memory);
        this.labels = {};
        this.registers = new Array(8);
        this.conditions = new Array(3);
        this.registersElements = new Array(8);
        this.conditionElements = new Array(3);
        this.interval = null;
        this.codeElement = document.getElementById("code");
        this.logElement = document.getElementById("log");
        this.programCounterElement = document.getElementById("program-counter");

        for (var i = 0; i < 8; i++) {
            this.registersElements[i] = document.getElementById("register-" + i);
        }

        for (var i = 0; i < 3; i++) {
            this.conditionElements[i] = document.getElementById("condition-" + i);
        }

        this.reset();
    }
    Program.prototype.onCommandRun = function () {
        if (this.interval === null) {
            this.run();
        } else {
            this.stopInterval();
            this.setHalted(true);
            this.log("Stopped running", Program.LOG_INFO);
        }
    };

    Program.prototype.onCommandStep = function () {
        this.stopInterval();
        this.setHalted(true);
        this.step();
    };

    Program.prototype.onCommandResetProgram = function () {
        this.reset(false);
        this.setProgramCounter(this.origAddress);
        this.log("Reset program", Program.LOG_INFO);
    };

    Program.prototype.onCommandClearLog = function () {
        for (var i = this.logElement.rows.length - 1; i >= 0; i--) {
            this.logElement.deleteRow(i);
        }
    };

    Program.prototype.stopInterval = function () {
        if (this.interval !== null) {
            clearInterval(this.interval);
            this.interval = null;
        }
    };

    Program.prototype.getProgramCounter = function () {
        return this.programCounter;
    };

    Program.prototype.setProgramCounter = function (programCounter) {
        if (programCounter === undefined) {
            this.programCounterElement.innerHTML = "<h2>-</h2>";
            return;
        }

        var item = this.programCounter - this.origAddress;
        if (item >= 0) {
            var element = this.codeElement.rows.item(item);
            if (element != null) {
                element.className = "";
            }
        }

        this.programCounter = programCounter;

        var item = this.programCounter - this.origAddress;
        if (item >= 0) {
            var element = this.codeElement.rows.item(item);
            if (element != null) {
                element.className = "active";
                element.scrollIntoView(false);
            }
        }

        this.programCounterElement.innerHTML = "<h2>" + Program.toHex(this.programCounter) + "</h2>";
    };

    Program.prototype.getRegister = function (index, override) {
        if (typeof override === "undefined") { override = false; }
        if (!override && this.registers[index] === undefined) {
            throw "tried to access uninitialized register";
        }
        return this.registers[index];
    };

    Program.prototype.setRegister = function (index, value) {
        if (index < 0 || index > 7) {
            throw "tried to access invalid register '" + index + "'";
        }

        if (value >= this.memory || value < -this.memory) {
            throw "register '" + index + "' overflowed";
        }

        this.registers[index] = value;

        if (value === undefined) {
            this.registersElements[index].innerHTML = "<h2>-</h2><h4>-</h4>";
        } else {
            this.setCondition(0, value < 0);
            this.setCondition(1, value == 0);
            this.setCondition(2, value > 0);

            this.registersElements[index].innerHTML = "<h2>" + value + "</h2><h4>" + Program.toHex(value) + "</h4>";
        }
    };

    Program.prototype.setCondition = function (index, value) {
        this.conditions[index] = value;

        if (value === undefined) {
            this.conditionElements[index].innerHTML = "<h2>-</h2>";
        } else {
            this.conditionElements[index].innerHTML = "<h2>" + (value ? 1 : 0) + "</h2>";
        }
    };

    Program.prototype.isHalted = function () {
        return this.halted;
    };

    Program.prototype.setHalted = function (halted, reachedHalt) {
        if (typeof reachedHalt === "undefined") { reachedHalt = null; }
        this.halted = halted;
        if (reachedHalt !== null) {
            this.reachedHalt = reachedHalt;
        }
    };

    Program.prototype.isLabel = function (name) {
        return name in this.labels;
    };

    Program.prototype.getLabel = function (name) {
        return this.labels[name];
    };

    Program.prototype.getLabelAtAddress = function (address) {
        for (var key in this.labels) {
            if (this.labels[key] === address) {
                return key;
            }
        }
        return "";
    };

    Program.prototype.setLabel = function (name, address) {
        this.labels[name] = address;
    };

    Program.prototype.getInstructionBits = function (address) {
        return parseInt(this.getInstructionBitsBinary(address), 2);
    };

    Program.prototype.getInstructionBitsBinary = function (address) {
        return this.code[address].getInstructionBits();
    };

    Program.prototype.getInstructionBitsHex = function (address) {
        return Program.toHex(this.getInstructionBits(address));
    };

    Program.prototype.getInstructionBitsHexPadded = function (address, padding) {
        return Program.toHexPadded(this.getInstructionBits(address), padding);
    };

    Program.prototype.setInstructionBits = function (address, data) {
        this.code[address].setInstructionBits(data);
    };

    Program.prototype.isConditionNegativeSet = function () {
        if (this.conditions[0] === undefined) {
            throw "tried to access uninitilized negative condition bit ";
        }
        return this.conditions[0];
    };

    Program.prototype.isConditionZeroSet = function () {
        if (this.conditions[1] === undefined) {
            throw "tried to access uninitilized zero condition bit ";
        }
        return this.conditions[1];
    };

    Program.prototype.isConditionPositiveSet = function () {
        if (this.conditions[2] === undefined) {
            throw "tried to access uninitilized positive condition bit ";
        }
        return this.conditions[2];
    };

    Program.prototype.reset = function (resetCode) {
        if (typeof resetCode === "undefined") { resetCode = true; }
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
    };

    Program.prototype.run = function () {
        var _this = this;
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

        this.interval = setInterval(function () {
            var display = _this.step();
            if (_this.isHalted()) {
                _this.stopInterval();
                if (display) {
                    _this.log("Finished running", Program.LOG_INFO);
                }
            }
        }, 1);
    };

    Program.prototype.step = function () {
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

        try  {
            line.execute(this, line.getOperands());
            return true;
        } catch (ex) {
            this.setHalted(true);
            this.log("Error executing line '" + Program.toHex(this.getProgramCounter() - 1) + "': " + ex, Program.LOG_DANGER);
        }

        return false;
    };

    Program.prototype.setCodeLine = function (instruction, operands, address, data) {
        this.code[address] = new CodeLine(instruction, operands, address, data);
    };

    Program.prototype.open = function (str) {
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

            for (var i = 1; i < lines.length; i++) {
                var lineTrim = lines[i].trim();

                if (lineTrim.length == 0) {
                    continue;
                }

                if (lineTrim.charAt(0) == ";") {
                    continue;
                }

                var lineSplit = lineTrim.split(" ");
                var opCode = lineSplit[0];
                var address = this.origAddress + i - 1;

                if (opCode == ".END") {
                    if (!symbols) {
                        foundEnd = true;
                    }
                    break;
                }

                try  {
                    address = this.parseLine(lineTrim, lineSplit, opCode, address, symbols);
                } catch (ex) {
                    throw "line " + (i + 1) + ": " + ex;
                }
            }
        }

        if (!foundEnd) {
            throw ".END not found";
        }

        this.setProgramCounter(this.origAddress);
    };

    Program.prototype.parseLine = function (lineTrim, lineSplit, opCode, address, symbols) {
        var isBranch = false;
        var operands = [];

        if (opCode.substr(-1) == ":") {
            opCode = opCode.substr(0, opCode.length - 1);
        } else if (opCode.length >= 2 && opCode.substr(0, 2) == "BR") {
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

        if (symbols) {
            if (!Instructions.isInstruction(opCode) && !isBranch) {
                if (this.isLabel(opCode)) {
                    throw "a label with the name " + opCode + " already exists";
                }

                this.setLabel(opCode, address);

                if (lineSplit.length >= 3) {
                    var num = lineSplit[2];
                    var radix = 10;

                    if (num.charAt(0) == "X") {
                        radix = 16;
                        num = "0" + num;
                    } else if (num.length > 2 && num.charAt(0) == "0" && num.charAt(1) == "X") {
                        radix = 16;
                    }

                    if (lineSplit[1] == ".FILL") {
                        var data = parseInt(num, radix);

                        this.setCodeLine(null, null, address, data);
                    } else if (lineSplit[1] == ".BLKW") {
                        address += parseInt(num, radix);
                    } else if (lineSplit[1] == ".STRINGZ") {
                        address += lineSplit[2].length;
                    } else {
                    }
                }
            }

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

                if (!Instructions.isInstruction(opCode)) {
                    if (opCode == ".FILL") {
                    } else if (lineSplit[1] == ".BLKW") {
                        address += parseInt(lineSplit[2]);
                    } else if (lineSplit[1] == ".STRINGZ") {
                        address += lineSplit[2].length;
                    } else {
                        throw "invalid label directive '" + lineSplit[1] + "'";
                    }

                    this.addCodeTableRow(this.code[address]);

                    return address + 1;
                }
            }
        }

        if (!Instructions.isInstruction(opCode) && !isBranch) {
            throw "invalid instruction '" + opCode + "'";
        }

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
        this.addCodeTableRow(this.code[address]);

        return address + 1;
    };

    Program.prototype.log = function (line, type) {
        if (typeof type === "undefined") { type = Program.LOG_NORMAL; }
        var tbody = this.logElement.tBodies.item(0);

        var scrollDown = (tbody.scrollHeight - tbody.scrollTop) == tbody.clientHeight;

        var row = this.logElement.insertRow(this.logElement.rows.length);

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
    };

    Program.prototype.addCodeTableFullRow = function (line) {
        var row = this.codeElement.insertRow(this.codeElement.rows.length);
        row.className = "info";

        var cell = row.insertCell(0);
        cell.innerHTML = line;
        cell.colSpan = 6;
    };

    Program.prototype.addCodeTableRow = function (codeLine) {
        var row = this.codeElement.insertRow(this.codeElement.rows.length);
        var cell0 = row.insertCell(0);
        var cell1 = row.insertCell(1);
        var cell2 = row.insertCell(2);
        var cell3 = row.insertCell(3);
        var cell4 = row.insertCell(4);
        var cell5 = row.insertCell(5);

        var address = codeLine.getAddress();
        var instruction = codeLine.getInstruction();
        var operands = codeLine.getOperands();

        if (operands !== null) {
            operands = operands.slice(0);
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
                } else if (operand.isLabelAddress()) {
                    html += this.getLabelAtAddress(operand.getLabelAddress());
                } else if (operand.isImmediate()) {
                    if (instructionName === "TRAP") {
                        switch (operand.getImmediate()) {
                            case 37:
                                html += "HALT";
                                break;

                            default:
                                html += "#" + operand.getImmediate();
                                break;
                        }
                    } else {
                        html += "#" + operand.getImmediate();
                    }
                } else {
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
    };

    Program.toHex = function (data) {
        var ret = "0x";
        if (data < 0) {
            data *= -1;
            ret = "-" + ret;
        }
        return ret + data.toString(16).toUpperCase();
    };

    Program.toHexPadded = function (data, padding) {
        var temp = data.toString(16);
        var zeros = Array(padding - temp.length + 1).join("0");
        return "0x" + zeros + temp.toUpperCase();
    };

    Program.toBinaryPadded = function (data, padding) {
        var temp = (data >>> 0).toString(2).toUpperCase();
        if (temp.length > padding) {
            return temp.substr(-padding);
        }
        var zeros = Array(padding - temp.length + 1).join("0");
        return zeros + temp;
    };
    Program.LOG_NORMAL = 0;
    Program.LOG_INFO = 1;
    Program.LOG_SUCCESS = 2;
    Program.LOG_WARNING = 3;
    Program.LOG_DANGER = 4;
    return Program;
})();
