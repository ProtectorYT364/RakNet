const Datagram = require("../../protocol/Datagram");

/**
 * CheckTypes
 * Example: CheckTypes([String, "myString"]); // true
 *          CheckTypes([String, 12]); // throws TypeError
 *
 * @throws {TypeError}
 * @return {boolean}
 */
global.CheckTypes = function(...args){
    if(args.length === 0) throw new TypeError("Expecting at least 1 Array. Example: [Object, myObjectVar]");

    args.forEach(arg => {
        if(!(arg instanceof Array)){
            throw new TypeError("Expecting Array, got "+(arg.constructor.name ? arg.constructor.name : arg.name));
        }

        if(typeof arg[0] === "undefined" || typeof arg[1] === "undefined"){
            throw new TypeError("Expecting Array with two items. Example: [Object, myObjectVar]");
        }

        let type = arg[0];
        let item = arg[1];

        if(
            !(item instanceof type) &&
            (item.constructor.name !== type.name && item.constructor !== type)
        ){
            throw new TypeError("Expecting "+type.name+", got "+item.constructor.name);
        }
    });
    return true;
};

class RecoveryQueue extends Map {
    addRecoveryFor(datagram){
        CheckTypes([Datagram, datagram]);

        this.set(datagram.sequenceNumber, datagram);
    }

    isRecoverable(seqNumber){
        CheckTypes([Number, seqNumber]);

        return this.has(seqNumber);
    }

    recover(sequenceNumbers){
        CheckTypes([Array, sequenceNumbers]);

        let datagrams = [];

        sequenceNumbers.forEach(seqNumber => {
            if(this.isRecoverable(seqNumber)){
                datagrams.push(this.get(seqNumber));
            }
        });

        return datagrams;
    }

    remove(seqNumber){
        this.delete(seqNumber);
    }

    isEmpty(){
        return this.size === 0;
    }
}

module.exports = RecoveryQueue;
