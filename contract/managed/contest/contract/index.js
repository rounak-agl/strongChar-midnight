import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
__compactRuntime.checkRuntimeVersion('0.21.0');

const _descriptor_0 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_1 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

const _descriptor_2 = new __compactRuntime.CompactTypeUnsignedInteger(4294967295n, 4);

const _descriptor_3 = __compactRuntime.CompactTypeBoolean;

const _descriptor_4 = new __compactRuntime.CompactTypeUnsignedInteger(65535n, 2);

class _Contest_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_2.alignment().concat(_descriptor_3.alignment().concat(_descriptor_4.alignment().concat(_descriptor_0.alignment().concat(_descriptor_3.alignment())))))))))));
  }
  fromValue(value_0) {
    return {
      host: _descriptor_0.fromValue(value_0),
      labelCommit: _descriptor_0.fromValue(value_0),
      dataset: _descriptor_0.fromValue(value_0),
      closesAt: _descriptor_1.fromValue(value_0),
      revealBy: _descriptor_1.fromValue(value_0),
      scoreBy: _descriptor_1.fromValue(value_0),
      prize: _descriptor_1.fromValue(value_0),
      entries: _descriptor_2.fromValue(value_0),
      revealed: _descriptor_3.fromValue(value_0),
      best: _descriptor_4.fromValue(value_0),
      leader: _descriptor_0.fromValue(value_0),
      settled: _descriptor_3.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.host).concat(_descriptor_0.toValue(value_0.labelCommit).concat(_descriptor_0.toValue(value_0.dataset).concat(_descriptor_1.toValue(value_0.closesAt).concat(_descriptor_1.toValue(value_0.revealBy).concat(_descriptor_1.toValue(value_0.scoreBy).concat(_descriptor_1.toValue(value_0.prize).concat(_descriptor_2.toValue(value_0.entries).concat(_descriptor_3.toValue(value_0.revealed).concat(_descriptor_4.toValue(value_0.best).concat(_descriptor_0.toValue(value_0.leader).concat(_descriptor_3.toValue(value_0.settled))))))))))));
  }
}

const _descriptor_5 = new _Contest_0();

class _UserAddress_0 {
  alignment() {
    return _descriptor_0.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.bytes);
  }
}

const _descriptor_6 = new _UserAddress_0();

const _descriptor_7 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

const _descriptor_8 = new __compactRuntime.CompactTypeVector(64, _descriptor_7);

const _descriptor_9 = new __compactRuntime.CompactTypeVector(3, _descriptor_0);

class _Either_0 {
  alignment() {
    return _descriptor_3.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_3.fromValue(value_0),
      left: _descriptor_0.fromValue(value_0),
      right: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_3.toValue(value_0.is_left).concat(_descriptor_0.toValue(value_0.left).concat(_descriptor_0.toValue(value_0.right)));
  }
}

const _descriptor_10 = new _Either_0();

const _descriptor_11 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

class _ContractAddress_0 {
  alignment() {
    return _descriptor_0.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.bytes);
  }
}

const _descriptor_12 = new _ContractAddress_0();

class _Either_1 {
  alignment() {
    return _descriptor_3.alignment().concat(_descriptor_12.alignment().concat(_descriptor_6.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_3.fromValue(value_0),
      left: _descriptor_12.fromValue(value_0),
      right: _descriptor_6.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_3.toValue(value_0.is_left).concat(_descriptor_12.toValue(value_0.left).concat(_descriptor_6.toValue(value_0.right)));
  }
}

const _descriptor_13 = new _Either_1();

class _Maybe_0 {
  alignment() {
    return _descriptor_3.alignment().concat(_descriptor_13.alignment());
  }
  fromValue(value_0) {
    return {
      is_some: _descriptor_3.fromValue(value_0),
      value: _descriptor_13.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_3.toValue(value_0.is_some).concat(_descriptor_13.toValue(value_0.value));
  }
}

const _descriptor_14 = new _Maybe_0();

export class Contract {
  witnesses;
  constructor(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    }
    const witnesses_0 = args_0[0];
    if (typeof(witnesses_0) !== 'object') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    }
    if (typeof(witnesses_0.localSecretKey) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named localSecretKey');
    }
    if (typeof(witnesses_0.predictions) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named predictions');
    }
    if (typeof(witnesses_0.predictionSalt) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named predictionSalt');
    }
    if (typeof(witnesses_0.labelSalt) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named labelSalt');
    }
    if (typeof(witnesses_0.shareOf) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named shareOf');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      async hostKey(context, ...args_1) {
        return { result: pureCircuits.hostKey(...args_1), context };
      },
      async entrantKey(context, ...args_1) {
        return { result: pureCircuits.entrantKey(...args_1), context };
      },
      async commitLabels(context, ...args_1) {
        return { result: pureCircuits.commitLabels(...args_1), context };
      },
      async commitPredictions(context, ...args_1) {
        return { result: pureCircuits.commitPredictions(...args_1), context };
      },
      async score(context, ...args_1) {
        return { result: pureCircuits.score(...args_1), context };
      },
      createContest: async (...args_1) => {
        if (args_1.length !== 8) {
          throw new __compactRuntime.CompactError(`createContest: expected 8 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const contest_0 = args_1[1];
        const labelCommit_0 = args_1[2];
        const dataset_0 = args_1[3];
        const closesAt_0 = args_1[4];
        const revealBy_0 = args_1[5];
        const scoreBy_0 = args_1[6];
        const prize_0 = args_1[7];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('createContest',
                                     'argument 1 (as invoked from Typescript)',
                                     'contest.compact line 78 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(contest_0.buffer instanceof ArrayBuffer && contest_0.BYTES_PER_ELEMENT === 1 && contest_0.length === 32)) {
          __compactRuntime.typeError('createContest',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'contest.compact line 78 char 1',
                                     'Bytes<32>',
                                     contest_0)
        }
        if (!(labelCommit_0.buffer instanceof ArrayBuffer && labelCommit_0.BYTES_PER_ELEMENT === 1 && labelCommit_0.length === 32)) {
          __compactRuntime.typeError('createContest',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'contest.compact line 78 char 1',
                                     'Bytes<32>',
                                     labelCommit_0)
        }
        if (!(dataset_0.buffer instanceof ArrayBuffer && dataset_0.BYTES_PER_ELEMENT === 1 && dataset_0.length === 32)) {
          __compactRuntime.typeError('createContest',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'contest.compact line 78 char 1',
                                     'Bytes<32>',
                                     dataset_0)
        }
        if (!(typeof(closesAt_0) === 'bigint' && closesAt_0 >= 0n && closesAt_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('createContest',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'contest.compact line 78 char 1',
                                     'Uint<0..18446744073709551616>',
                                     closesAt_0)
        }
        if (!(typeof(revealBy_0) === 'bigint' && revealBy_0 >= 0n && revealBy_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('createContest',
                                     'argument 5 (argument 6 as invoked from Typescript)',
                                     'contest.compact line 78 char 1',
                                     'Uint<0..18446744073709551616>',
                                     revealBy_0)
        }
        if (!(typeof(scoreBy_0) === 'bigint' && scoreBy_0 >= 0n && scoreBy_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('createContest',
                                     'argument 6 (argument 7 as invoked from Typescript)',
                                     'contest.compact line 78 char 1',
                                     'Uint<0..18446744073709551616>',
                                     scoreBy_0)
        }
        if (!(typeof(prize_0) === 'bigint' && prize_0 >= 0n && prize_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('createContest',
                                     'argument 7 (argument 8 as invoked from Typescript)',
                                     'contest.compact line 78 char 1',
                                     'Uint<0..18446744073709551616>',
                                     prize_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(contest_0).concat(_descriptor_0.toValue(labelCommit_0).concat(_descriptor_0.toValue(dataset_0).concat(_descriptor_1.toValue(closesAt_0).concat(_descriptor_1.toValue(revealBy_0).concat(_descriptor_1.toValue(scoreBy_0).concat(_descriptor_1.toValue(prize_0))))))),
            alignment: _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment()))))))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._createContest_0(context,
                                                     partialProofData,
                                                     contest_0,
                                                     labelCommit_0,
                                                     dataset_0,
                                                     closesAt_0,
                                                     revealBy_0,
                                                     scoreBy_0,
                                                     prize_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      enter: async (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`enter: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const contest_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('enter',
                                     'argument 1 (as invoked from Typescript)',
                                     'contest.compact line 114 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(contest_0.buffer instanceof ArrayBuffer && contest_0.BYTES_PER_ELEMENT === 1 && contest_0.length === 32)) {
          __compactRuntime.typeError('enter',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'contest.compact line 114 char 1',
                                     'Bytes<32>',
                                     contest_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(contest_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._enter_0(context,
                                             partialProofData,
                                             contest_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      revealLabels: async (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`revealLabels: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const contest_0 = args_1[1];
        const l_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('revealLabels',
                                     'argument 1 (as invoked from Typescript)',
                                     'contest.compact line 127 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(contest_0.buffer instanceof ArrayBuffer && contest_0.BYTES_PER_ELEMENT === 1 && contest_0.length === 32)) {
          __compactRuntime.typeError('revealLabels',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'contest.compact line 127 char 1',
                                     'Bytes<32>',
                                     contest_0)
        }
        if (!(Array.isArray(l_0) && l_0.length === 64 && l_0.every((t) => typeof(t) === 'bigint' && t >= 0n && t <= 255n))) {
          __compactRuntime.typeError('revealLabels',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'contest.compact line 127 char 1',
                                     'Vector<64, Uint<0..256>>',
                                     l_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(contest_0).concat(_descriptor_8.toValue(l_0)),
            alignment: _descriptor_0.alignment().concat(_descriptor_8.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._revealLabels_0(context,
                                                    partialProofData,
                                                    contest_0,
                                                    l_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      proveScore: async (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`proveScore: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const contest_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('proveScore',
                                     'argument 1 (as invoked from Typescript)',
                                     'contest.compact line 140 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(contest_0.buffer instanceof ArrayBuffer && contest_0.BYTES_PER_ELEMENT === 1 && contest_0.length === 32)) {
          __compactRuntime.typeError('proveScore',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'contest.compact line 140 char 1',
                                     'Bytes<32>',
                                     contest_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(contest_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._proveScore_0(context,
                                                  partialProofData,
                                                  contest_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      claimPrize: async (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`claimPrize: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const contest_0 = args_1[1];
        const to_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('claimPrize',
                                     'argument 1 (as invoked from Typescript)',
                                     'contest.compact line 159 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(contest_0.buffer instanceof ArrayBuffer && contest_0.BYTES_PER_ELEMENT === 1 && contest_0.length === 32)) {
          __compactRuntime.typeError('claimPrize',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'contest.compact line 159 char 1',
                                     'Bytes<32>',
                                     contest_0)
        }
        if (!(typeof(to_0) === 'object' && to_0.bytes.buffer instanceof ArrayBuffer && to_0.bytes.BYTES_PER_ELEMENT === 1 && to_0.bytes.length === 32)) {
          __compactRuntime.typeError('claimPrize',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'contest.compact line 159 char 1',
                                     'struct UserAddress<bytes: Bytes<32>>',
                                     to_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(contest_0).concat(_descriptor_6.toValue(to_0)),
            alignment: _descriptor_0.alignment().concat(_descriptor_6.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._claimPrize_0(context,
                                                  partialProofData,
                                                  contest_0,
                                                  to_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      reclaimPrize: async (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`reclaimPrize: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const contest_0 = args_1[1];
        const to_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('reclaimPrize',
                                     'argument 1 (as invoked from Typescript)',
                                     'contest.compact line 174 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(contest_0.buffer instanceof ArrayBuffer && contest_0.BYTES_PER_ELEMENT === 1 && contest_0.length === 32)) {
          __compactRuntime.typeError('reclaimPrize',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'contest.compact line 174 char 1',
                                     'Bytes<32>',
                                     contest_0)
        }
        if (!(typeof(to_0) === 'object' && to_0.bytes.buffer instanceof ArrayBuffer && to_0.bytes.BYTES_PER_ELEMENT === 1 && to_0.bytes.length === 32)) {
          __compactRuntime.typeError('reclaimPrize',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'contest.compact line 174 char 1',
                                     'struct UserAddress<bytes: Bytes<32>>',
                                     to_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(contest_0).concat(_descriptor_6.toValue(to_0)),
            alignment: _descriptor_0.alignment().concat(_descriptor_6.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._reclaimPrize_0(context,
                                                    partialProofData,
                                                    contest_0,
                                                    to_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      claimForfeit: async (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`claimForfeit: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const contest_0 = args_1[1];
        const to_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('claimForfeit',
                                     'argument 1 (as invoked from Typescript)',
                                     'contest.compact line 188 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(contest_0.buffer instanceof ArrayBuffer && contest_0.BYTES_PER_ELEMENT === 1 && contest_0.length === 32)) {
          __compactRuntime.typeError('claimForfeit',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'contest.compact line 188 char 1',
                                     'Bytes<32>',
                                     contest_0)
        }
        if (!(typeof(to_0) === 'object' && to_0.bytes.buffer instanceof ArrayBuffer && to_0.bytes.BYTES_PER_ELEMENT === 1 && to_0.bytes.length === 32)) {
          __compactRuntime.typeError('claimForfeit',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'contest.compact line 188 char 1',
                                     'struct UserAddress<bytes: Bytes<32>>',
                                     to_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(contest_0).concat(_descriptor_6.toValue(to_0)),
            alignment: _descriptor_0.alignment().concat(_descriptor_6.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._claimForfeit_0(context,
                                                    partialProofData,
                                                    contest_0,
                                                    to_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      }
    };
    this.impureCircuits = {
      createContest: this.circuits.createContest,
      enter: this.circuits.enter,
      revealLabels: this.circuits.revealLabels,
      proveScore: this.circuits.proveScore,
      claimPrize: this.circuits.claimPrize,
      reclaimPrize: this.circuits.reclaimPrize,
      claimForfeit: this.circuits.claimForfeit
    };
    this.provableCircuits = {
      createContest: this.circuits.createContest,
      enter: this.circuits.enter,
      revealLabels: this.circuits.revealLabels,
      proveScore: this.circuits.proveScore,
      claimPrize: this.circuits.claimPrize,
      reclaimPrize: this.circuits.reclaimPrize,
      claimForfeit: this.circuits.claimForfeit
    };
  }
  async initialState(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    if (typeof(constructorContext_0) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialPrivateState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialPrivateState' in argument 1 (as invoked from Typescript)`);
    }
    if (!('initialZswapLocalState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext_0.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    state_0.setOperation('createContest', new __compactRuntime.ContractOperation());
    state_0.setOperation('enter', new __compactRuntime.ContractOperation());
    state_0.setOperation('revealLabels', new __compactRuntime.ContractOperation());
    state_0.setOperation('proveScore', new __compactRuntime.ContractOperation());
    state_0.setOperation('claimPrize', new __compactRuntime.ContractOperation());
    state_0.setOperation('reclaimPrize', new __compactRuntime.ContractOperation());
    state_0.setOperation('claimForfeit', new __compactRuntime.ContractOperation());
    const context = __compactRuntime.createCircuitContext({circuitId: 'constructor', contractAddress: __compactRuntime.dummyContractAddress(), coinPublicKeyOrZswapState: constructorContext_0.initialZswapLocalState.coinPublicKey, contractState: state_0.data, privateState: constructorContext_0.initialPrivateState});
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(0n),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(1n),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(2n),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(3n),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(4n),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    state_0.data = new __compactRuntime.ChargedState(context.callContext.currentQueryContext.state.state);
    return {
      currentContractState: state_0,
      currentPrivateState: context.callContext.currentPrivateState,
      currentZswapLocalState: context.callContext.currentZswapLocalState
    }
  }
  _left_0(value_0) {
    return { is_left: true, left: value_0, right: new Uint8Array(32) };
  }
  _right_0(value_0) {
    return { is_left: false, left: { bytes: new Uint8Array(32) }, right: value_0 };
  }
  _nativeToken_0() {
    return new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  }
  async _blockTimeLt_0(context, partialProofData, time_0) {
    return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 2 } },
                                                                      { idx: { cached: true,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_7.toValue(2n),
                                                                                                 alignment: _descriptor_7.alignment() } }] } },
                                                                      { push: { storage: false,
                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(time_0),
                                                                                                                             alignment: _descriptor_1.alignment() }).encode() } },
                                                                      'lt',
                                                                      { popeq: { cached: true,
                                                                                 result: undefined } }]).value);
  }
  async _blockTimeGte_0(context, partialProofData, time_0) {
    return !await this._blockTimeLt_0(context, partialProofData, time_0);
  }
  async _sendUnshielded_0(context,
                          partialProofData,
                          color_0,
                          amount_0,
                          recipient_0)
  {
    const tmp_0 = this._left_0(color_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_7.toValue(7n),
                                                                  alignment: _descriptor_7.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(tmp_0),
                                                                                              alignment: _descriptor_10.alignment() }).encode() } },
                                       { dup: { n: 1 } },
                                       { dup: { n: 1 } },
                                       'member',
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_11.toValue(amount_0),
                                                                                              alignment: _descriptor_11.alignment() }).encode() } },
                                       { swap: { n: 0 } },
                                       'neg',
                                       { branch: { skip: 4 } },
                                       { dup: { n: 2 } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: true,
                                                pushPath: false,
                                                path: [ { tag: 'stack' }] } },
                                       'add',
                                       { ins: { cached: true, n: 2 } },
                                       { swap: { n: 0 } }]);
    const tmp_1 = this._left_0(color_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_7.toValue(8n),
                                                                  alignment: _descriptor_7.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell(__compactRuntime.alignedConcat(
                                                                                              { value: _descriptor_10.toValue(tmp_1),
                                                                                                alignment: _descriptor_10.alignment() },
                                                                                              { value: _descriptor_13.toValue(recipient_0),
                                                                                                alignment: _descriptor_13.alignment() }
                                                                                            )).encode() } },
                                       { dup: { n: 1 } },
                                       { dup: { n: 1 } },
                                       'member',
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_11.toValue(amount_0),
                                                                                              alignment: _descriptor_11.alignment() }).encode() } },
                                       { swap: { n: 0 } },
                                       'neg',
                                       { branch: { skip: 4 } },
                                       { dup: { n: 2 } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: true,
                                                pushPath: false,
                                                path: [ { tag: 'stack' }] } },
                                       'add',
                                       { ins: { cached: true, n: 2 } },
                                       { swap: { n: 0 } }]);
    if (recipient_0.is_left
        &&
        this._equal_0(recipient_0.left.bytes,
                      _descriptor_12.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                 partialProofData,
                                                                                 [
                                                                                  { dup: { n: 2 } },
                                                                                  { idx: { cached: true,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_7.toValue(0n),
                                                                                                             alignment: _descriptor_7.alignment() } }] } },
                                                                                  { popeq: { cached: true,
                                                                                             result: undefined } }]).value).bytes))
    {
      const tmp_2 = this._left_0(color_0);
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { swap: { n: 0 } },
                                         { idx: { cached: true,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_7.toValue(6n),
                                                                    alignment: _descriptor_7.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(tmp_2),
                                                                                                alignment: _descriptor_10.alignment() }).encode() } },
                                         { dup: { n: 1 } },
                                         { dup: { n: 1 } },
                                         'member',
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_11.toValue(amount_0),
                                                                                                alignment: _descriptor_11.alignment() }).encode() } },
                                         { swap: { n: 0 } },
                                         'neg',
                                         { branch: { skip: 4 } },
                                         { dup: { n: 2 } },
                                         { dup: { n: 2 } },
                                         { idx: { cached: true,
                                                  pushPath: false,
                                                  path: [ { tag: 'stack' }] } },
                                         'add',
                                         { ins: { cached: true, n: 2 } },
                                         { swap: { n: 0 } }]);
    }
    return [];
  }
  async _receiveUnshielded_0(context, partialProofData, color_0, amount_0) {
    const tmp_0 = this._left_0(color_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_7.toValue(6n),
                                                                  alignment: _descriptor_7.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(tmp_0),
                                                                                              alignment: _descriptor_10.alignment() }).encode() } },
                                       { dup: { n: 1 } },
                                       { dup: { n: 1 } },
                                       'member',
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_11.toValue(amount_0),
                                                                                              alignment: _descriptor_11.alignment() }).encode() } },
                                       { swap: { n: 0 } },
                                       'neg',
                                       { branch: { skip: 4 } },
                                       { dup: { n: 2 } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: true,
                                                pushPath: false,
                                                path: [ { tag: 'stack' }] } },
                                       'add',
                                       { ins: { cached: true, n: 2 } },
                                       { swap: { n: 0 } }]);
    return [];
  }
  _persistentHash_0(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_9, value_0);
    return result_0;
  }
  _persistentCommit_0(value_0, rand_0) {
    const result_0 = __compactRuntime.persistentCommit(_descriptor_8,
                                                       value_0,
                                                       rand_0);
    return result_0;
  }
  _localSecretKey_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.callContext.currentQueryContext.state), context.callContext.currentPrivateState, context.callContext.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.localSecretKey(witnessContext_0);
    context.callContext.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('localSecretKey',
                                 'return value',
                                 'contest.compact line 45 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _predictions_0(context, partialProofData, contest_0) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.callContext.currentQueryContext.state), context.callContext.currentPrivateState, context.callContext.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.predictions(witnessContext_0,
                                                                      contest_0);
    context.callContext.currentPrivateState = nextPrivateState_0;
    if (!(Array.isArray(result_0) && result_0.length === 64 && result_0.every((t) => typeof(t) === 'bigint' && t >= 0n && t <= 255n))) {
      __compactRuntime.typeError('predictions',
                                 'return value',
                                 'contest.compact line 46 char 1',
                                 'Vector<64, Uint<0..256>>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_8.toValue(result_0),
      alignment: _descriptor_8.alignment()
    });
    return result_0;
  }
  _predictionSalt_0(context, partialProofData, contest_0) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.callContext.currentQueryContext.state), context.callContext.currentPrivateState, context.callContext.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.predictionSalt(witnessContext_0,
                                                                         contest_0);
    context.callContext.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('predictionSalt',
                                 'return value',
                                 'contest.compact line 47 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _labelSalt_0(context, partialProofData, contest_0) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.callContext.currentQueryContext.state), context.callContext.currentPrivateState, context.callContext.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.labelSalt(witnessContext_0,
                                                                    contest_0);
    context.callContext.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('labelSalt',
                                 'return value',
                                 'contest.compact line 48 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _shareOf_0(context, partialProofData, prize_0, entries_0) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.callContext.currentQueryContext.state), context.callContext.currentPrivateState, context.callContext.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.shareOf(witnessContext_0,
                                                                  prize_0,
                                                                  entries_0);
    context.callContext.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'bigint' && result_0 >= 0n && result_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('shareOf',
                                 'return value',
                                 'contest.compact line 50 char 1',
                                 'Uint<0..18446744073709551616>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_1.toValue(result_0),
      alignment: _descriptor_1.alignment()
    });
    return result_0;
  }
  _hostKey_0(sk_0, contest_0) {
    return this._persistentHash_0([new Uint8Array([115, 101, 97, 108, 101, 100, 45, 99, 111, 110, 116, 101, 115, 116, 58, 104, 111, 115, 116, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   contest_0,
                                   sk_0]);
  }
  _entrantKey_0(sk_0, contest_0) {
    return this._persistentHash_0([new Uint8Array([115, 101, 97, 108, 101, 100, 45, 99, 111, 110, 116, 101, 115, 116, 58, 101, 110, 116, 114, 97, 110, 116, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   contest_0,
                                   sk_0]);
  }
  _commitLabels_0(l_0, salt_0) { return this._persistentCommit_0(l_0, salt_0); }
  _commitPredictions_0(p_0, salt_0) {
    return this._persistentCommit_0(p_0, salt_0);
  }
  _score_0(p_0, l_0) {
    return this._folder_0(((acc_0, a_0, b_0) =>
                           {
                             return ((t1) => {
                                      if (t1 > 65535n) {
                                        throw new __compactRuntime.CompactError('contest.compact line 70 char 68: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 65535');
                                      }
                                      return t1;
                                    })(a_0 === b_0 ? acc_0 + 1n : acc_0);
                           }),
                          0n,
                          p_0,
                          l_0);
  }
  async _load_0(context, partialProofData, id_0) {
    __compactRuntime.assert(_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_7.toValue(0n),
                                                                                                                  alignment: _descriptor_7.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'no such contest');
    return _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 0 } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_7.toValue(0n),
                                                                                                 alignment: _descriptor_7.alignment() } }] } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_0.toValue(id_0),
                                                                                                 alignment: _descriptor_0.alignment() } }] } },
                                                                      { popeq: { cached: false,
                                                                                 result: undefined } }]).value);
  }
  async _createContest_0(context,
                         partialProofData,
                         contest_0,
                         labelCommit_0,
                         dataset_0,
                         closesAt_0,
                         revealBy_0,
                         scoreBy_0,
                         prize_0)
  {
    const id_0 = contest_0;
    __compactRuntime.assert(!_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_7.toValue(0n),
                                                                                                                   alignment: _descriptor_7.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'contest id already used');
    const c_0 = closesAt_0;
    const r_0 = revealBy_0;
    const s_0 = scoreBy_0;
    __compactRuntime.assert(c_0 < r_0 && r_0 < s_0,
                            'deadlines must be in order: close, reveal, score');
    __compactRuntime.assert(await this._blockTimeLt_0(context,
                                                      partialProofData,
                                                      c_0),
                            'closing time is in the past');
    const p_0 = prize_0;
    __compactRuntime.assert(p_0 > 0n, 'a contest needs a prize');
    await this._receiveUnshielded_0(context,
                                    partialProofData,
                                    this._nativeToken_0(),
                                    p_0);
    const tmp_0 = { host:
                      this._hostKey_0(this._localSecretKey_0(context,
                                                             partialProofData),
                                      id_0),
                    labelCommit: labelCommit_0,
                    dataset: dataset_0,
                    closesAt: c_0,
                    revealBy: r_0,
                    scoreBy: s_0,
                    prize: p_0,
                    entries: 0n,
                    revealed: false,
                    best: 0n,
                    leader: new Uint8Array(32),
                    settled: false };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_7.toValue(0n),
                                                                  alignment: _descriptor_7.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(tmp_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  async _enter_0(context, partialProofData, contest_0) {
    const id_0 = contest_0;
    const c_0 = await this._load_0(context, partialProofData, id_0);
    __compactRuntime.assert(await this._blockTimeLt_0(context,
                                                      partialProofData,
                                                      c_0.closesAt),
                            'entries are closed');
    const sk_0 = this._localSecretKey_0(context, partialProofData);
    __compactRuntime.assert(!this._equal_1(this._hostKey_0(sk_0, id_0), c_0.host),
                            'the host cannot enter with the host key');
    const k_0 = this._entrantKey_0(sk_0, id_0);
    __compactRuntime.assert(!_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_7.toValue(1n),
                                                                                                                   alignment: _descriptor_7.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(k_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'already entered');
    const tmp_0 = this._commitPredictions_0(this._predictions_0(context,
                                                                partialProofData,
                                                                id_0),
                                            this._predictionSalt_0(context,
                                                                   partialProofData,
                                                                   id_0));
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_7.toValue(1n),
                                                                  alignment: _descriptor_7.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(k_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = { host: c_0.host,
                    labelCommit: c_0.labelCommit,
                    dataset: c_0.dataset,
                    closesAt: c_0.closesAt,
                    revealBy: c_0.revealBy,
                    scoreBy: c_0.scoreBy,
                    prize: c_0.prize,
                    entries:
                      ((t1) => {
                        if (t1 > 4294967295n) {
                          throw new __compactRuntime.CompactError('contest.compact line 124 char 48: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 4294967295');
                        }
                        return t1;
                      })(c_0.entries + 1n),
                    revealed: c_0.revealed,
                    best: c_0.best,
                    leader: c_0.leader,
                    settled: c_0.settled };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_7.toValue(0n),
                                                                  alignment: _descriptor_7.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(tmp_1),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  async _revealLabels_0(context, partialProofData, contest_0, l_0) {
    const id_0 = contest_0;
    const c_0 = await this._load_0(context, partialProofData, id_0);
    __compactRuntime.assert(this._equal_2(this._hostKey_0(this._localSecretKey_0(context,
                                                                                 partialProofData),
                                                          id_0),
                                          c_0.host),
                            'only the host can open the labels');
    __compactRuntime.assert(!c_0.revealed, 'labels already opened');
    __compactRuntime.assert(await this._blockTimeGte_0(context,
                                                       partialProofData,
                                                       c_0.closesAt),
                            'entries are still open');
    __compactRuntime.assert(await this._blockTimeLt_0(context,
                                                      partialProofData,
                                                      c_0.revealBy),
                            'the reveal deadline has passed');
    __compactRuntime.assert(this._equal_3(this._commitLabels_0(l_0,
                                                               this._labelSalt_0(context,
                                                                                 partialProofData,
                                                                                 id_0)),
                                          c_0.labelCommit),
                            'these are not the committed labels');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_7.toValue(3n),
                                                                  alignment: _descriptor_7.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(l_0),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_0 = { host: c_0.host,
                    labelCommit: c_0.labelCommit,
                    dataset: c_0.dataset,
                    closesAt: c_0.closesAt,
                    revealBy: c_0.revealBy,
                    scoreBy: c_0.scoreBy,
                    prize: c_0.prize,
                    entries: c_0.entries,
                    revealed: true,
                    best: c_0.best,
                    leader: c_0.leader,
                    settled: c_0.settled };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_7.toValue(0n),
                                                                  alignment: _descriptor_7.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(tmp_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  async _proveScore_0(context, partialProofData, contest_0) {
    const id_0 = contest_0;
    const c_0 = await this._load_0(context, partialProofData, id_0);
    __compactRuntime.assert(c_0.revealed, 'labels are not open yet');
    __compactRuntime.assert(await this._blockTimeLt_0(context,
                                                      partialProofData,
                                                      c_0.scoreBy),
                            'scoring has closed');
    const k_0 = this._entrantKey_0(this._localSecretKey_0(context,
                                                          partialProofData),
                                   id_0);
    __compactRuntime.assert(_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_7.toValue(1n),
                                                                                                                  alignment: _descriptor_7.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(k_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'not entered in this contest');
    __compactRuntime.assert(!_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_7.toValue(2n),
                                                                                                                   alignment: _descriptor_7.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(k_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'score already proven');
    const p_0 = this._predictions_0(context, partialProofData, id_0);
    __compactRuntime.assert(this._equal_4(this._commitPredictions_0(p_0,
                                                                    this._predictionSalt_0(context,
                                                                                           partialProofData,
                                                                                           id_0)),
                                          _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                    partialProofData,
                                                                                                    [
                                                                                                     { dup: { n: 0 } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_7.toValue(1n),
                                                                                                                                alignment: _descriptor_7.alignment() } }] } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_0.toValue(k_0),
                                                                                                                                alignment: _descriptor_0.alignment() } }] } },
                                                                                                     { popeq: { cached: false,
                                                                                                                result: undefined } }]).value)),
                            'predictions differ from the committed entry');
    const s_0 = this._score_0(p_0,
                              _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                        partialProofData,
                                                                                        [
                                                                                         { dup: { n: 0 } },
                                                                                         { idx: { cached: false,
                                                                                                  pushPath: false,
                                                                                                  path: [
                                                                                                         { tag: 'value',
                                                                                                           value: { value: _descriptor_7.toValue(3n),
                                                                                                                    alignment: _descriptor_7.alignment() } }] } },
                                                                                         { idx: { cached: false,
                                                                                                  pushPath: false,
                                                                                                  path: [
                                                                                                         { tag: 'value',
                                                                                                           value: { value: _descriptor_0.toValue(id_0),
                                                                                                                    alignment: _descriptor_0.alignment() } }] } },
                                                                                         { popeq: { cached: false,
                                                                                                    result: undefined } }]).value));
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_7.toValue(2n),
                                                                  alignment: _descriptor_7.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(k_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(s_0),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    if (s_0 > c_0.best) {
      const tmp_0 = { host: c_0.host,
                      labelCommit: c_0.labelCommit,
                      dataset: c_0.dataset,
                      closesAt: c_0.closesAt,
                      revealBy: c_0.revealBy,
                      scoreBy: c_0.scoreBy,
                      prize: c_0.prize,
                      entries: c_0.entries,
                      revealed: c_0.revealed,
                      best: s_0,
                      leader: k_0,
                      settled: c_0.settled };
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { idx: { cached: false,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_7.toValue(0n),
                                                                    alignment: _descriptor_7.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                                alignment: _descriptor_0.alignment() }).encode() } },
                                         { push: { storage: true,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(tmp_0),
                                                                                                alignment: _descriptor_5.alignment() }).encode() } },
                                         { ins: { cached: false, n: 1 } },
                                         { ins: { cached: true, n: 1 } }]);
    }
    return [];
  }
  async _claimPrize_0(context, partialProofData, contest_0, to_0) {
    const id_0 = contest_0;
    const c_0 = await this._load_0(context, partialProofData, id_0);
    __compactRuntime.assert(c_0.revealed, 'labels were never opened');
    __compactRuntime.assert(await this._blockTimeGte_0(context,
                                                       partialProofData,
                                                       c_0.scoreBy),
                            'scoring is still open');
    __compactRuntime.assert(!c_0.settled, 'prize already paid');
    let t_0;
    __compactRuntime.assert((t_0 = c_0.best, t_0 > 0n), 'no score was proven');
    __compactRuntime.assert(this._equal_5(this._entrantKey_0(this._localSecretKey_0(context,
                                                                                    partialProofData),
                                                             id_0),
                                          c_0.leader),
                            'not the winner');
    const tmp_0 = { host: c_0.host,
                    labelCommit: c_0.labelCommit,
                    dataset: c_0.dataset,
                    closesAt: c_0.closesAt,
                    revealBy: c_0.revealBy,
                    scoreBy: c_0.scoreBy,
                    prize: c_0.prize,
                    entries: c_0.entries,
                    revealed: c_0.revealed,
                    best: c_0.best,
                    leader: c_0.leader,
                    settled: true };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_7.toValue(0n),
                                                                  alignment: _descriptor_7.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(tmp_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    await this._sendUnshielded_0(context,
                                 partialProofData,
                                 this._nativeToken_0(),
                                 c_0.prize,
                                 this._right_0(to_0));
    return [];
  }
  async _reclaimPrize_0(context, partialProofData, contest_0, to_0) {
    const id_0 = contest_0;
    const c_0 = await this._load_0(context, partialProofData, id_0);
    __compactRuntime.assert(this._equal_6(this._hostKey_0(this._localSecretKey_0(context,
                                                                                 partialProofData),
                                                          id_0),
                                          c_0.host),
                            'only the host can reclaim');
    __compactRuntime.assert(!c_0.settled, 'prize already paid');
    const unclaimed_0 = c_0.revealed
                        &&
                        await this._blockTimeGte_0(context,
                                                   partialProofData,
                                                   c_0.scoreBy)
                        &&
                        c_0.best === 0n;
    const empty_0 = c_0.entries === 0n
                    &&
                    await this._blockTimeGte_0(context,
                                               partialProofData,
                                               c_0.closesAt);
    __compactRuntime.assert(unclaimed_0 || empty_0, 'the prize can still be won');
    const tmp_0 = { host: c_0.host,
                    labelCommit: c_0.labelCommit,
                    dataset: c_0.dataset,
                    closesAt: c_0.closesAt,
                    revealBy: c_0.revealBy,
                    scoreBy: c_0.scoreBy,
                    prize: c_0.prize,
                    entries: c_0.entries,
                    revealed: c_0.revealed,
                    best: c_0.best,
                    leader: c_0.leader,
                    settled: true };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_7.toValue(0n),
                                                                  alignment: _descriptor_7.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(id_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(tmp_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    await this._sendUnshielded_0(context,
                                 partialProofData,
                                 this._nativeToken_0(),
                                 c_0.prize,
                                 this._right_0(to_0));
    return [];
  }
  async _claimForfeit_0(context, partialProofData, contest_0, to_0) {
    const id_0 = contest_0;
    const c_0 = await this._load_0(context, partialProofData, id_0);
    __compactRuntime.assert(!c_0.revealed,
                            'labels were opened; the contest is scored normally');
    __compactRuntime.assert(await this._blockTimeGte_0(context,
                                                       partialProofData,
                                                       c_0.revealBy),
                            'the host can still open the labels');
    const k_0 = this._entrantKey_0(this._localSecretKey_0(context,
                                                          partialProofData),
                                   id_0);
    __compactRuntime.assert(_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_7.toValue(1n),
                                                                                                                  alignment: _descriptor_7.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(k_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'not entered in this contest');
    __compactRuntime.assert(!_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_7.toValue(4n),
                                                                                                                   alignment: _descriptor_7.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(k_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'share already taken');
    const q_0 = this._shareOf_0(context,
                                partialProofData,
                                c_0.prize,
                                c_0.entries);
    let t_0, t_1;
    __compactRuntime.assert((t_1 = q_0 * c_0.entries, t_1 <= c_0.prize)
                            &&
                            (t_0 = c_0.prize, t_0 < (q_0 + 1n) * c_0.entries),
                            'wrong share');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_7.toValue(4n),
                                                                  alignment: _descriptor_7.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(k_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    await this._sendUnshielded_0(context,
                                 partialProofData,
                                 this._nativeToken_0(),
                                 q_0,
                                 this._right_0(to_0));
    return [];
  }
  _equal_0(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _folder_0(f, x, a0, a1) {
    for (let i = 0; i < 64; i++) { x = f(x, a0[i], a1[i]); }
    return x;
  }
  _equal_1(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_2(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_3(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_4(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_5(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_6(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
}
export function ledger(stateOrChargedState) {
  const state = stateOrChargedState instanceof __compactRuntime.StateValue ? stateOrChargedState : stateOrChargedState.state;
  const chargedState = stateOrChargedState instanceof __compactRuntime.StateValue ? new __compactRuntime.ChargedState(stateOrChargedState) : stateOrChargedState;
  const context = {
    callContext: { currentQueryContext: new __compactRuntime.QueryContext(chargedState, __compactRuntime.dummyContractAddress()), currentGasCost: __compactRuntime.emptyRunningCost() },
    costModel: __compactRuntime.CostModel.initialCostModel()
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
    contests: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_7.toValue(0n),
                                                                                                     alignment: _descriptor_7.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_7.toValue(0n),
                                                                                                     alignment: _descriptor_7.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'contest.compact line 35 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_7.toValue(0n),
                                                                                                     alignment: _descriptor_7.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'contest.compact line 35 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_7.toValue(0n),
                                                                                                     alignment: _descriptor_7.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[0];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_5.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    entries: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_7.toValue(1n),
                                                                                                     alignment: _descriptor_7.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_7.toValue(1n),
                                                                                                     alignment: _descriptor_7.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'contest.compact line 37 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_7.toValue(1n),
                                                                                                     alignment: _descriptor_7.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'contest.compact line 37 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_7.toValue(1n),
                                                                                                     alignment: _descriptor_7.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_0.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    scores: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_7.toValue(2n),
                                                                                                     alignment: _descriptor_7.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_7.toValue(2n),
                                                                                                     alignment: _descriptor_7.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'contest.compact line 39 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_7.toValue(2n),
                                                                                                     alignment: _descriptor_7.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'contest.compact line 39 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_7.toValue(2n),
                                                                                                     alignment: _descriptor_7.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[2];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_4.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    labels: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_7.toValue(3n),
                                                                                                     alignment: _descriptor_7.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_7.toValue(3n),
                                                                                                     alignment: _descriptor_7.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'contest.compact line 41 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_7.toValue(3n),
                                                                                                     alignment: _descriptor_7.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'contest.compact line 41 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_8.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_7.toValue(3n),
                                                                                                     alignment: _descriptor_7.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[3];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_8.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    forfeitClaims: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_7.toValue(4n),
                                                                                                     alignment: _descriptor_7.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_7.toValue(4n),
                                                                                                     alignment: _descriptor_7.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const elem_0 = args_0[0];
        if (!(elem_0.buffer instanceof ArrayBuffer && elem_0.BYTES_PER_ELEMENT === 1 && elem_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'contest.compact line 43 char 1',
                                     'Bytes<32>',
                                     elem_0)
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_7.toValue(4n),
                                                                                                     alignment: _descriptor_7.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(elem_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[4];
        return self_0.asMap().keys().map((elem) => _descriptor_0.fromValue(elem.value))[Symbol.iterator]();
      }
    }
  };
}
const _emptyContext = {
  callContext: { currentQueryContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress()), currentGasCost: __compactRuntime.emptyRunningCost() }
};
const _dummyContract = new Contract({
  localSecretKey: (...args) => undefined,
  predictions: (...args) => undefined,
  predictionSalt: (...args) => undefined,
  labelSalt: (...args) => undefined,
  shareOf: (...args) => undefined
});
export const pureCircuits = {
  hostKey: (...args_0) => {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`hostKey: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const sk_0 = args_0[0];
    const contest_0 = args_0[1];
    if (!(sk_0.buffer instanceof ArrayBuffer && sk_0.BYTES_PER_ELEMENT === 1 && sk_0.length === 32)) {
      __compactRuntime.typeError('hostKey',
                                 'argument 1',
                                 'contest.compact line 53 char 1',
                                 'Bytes<32>',
                                 sk_0)
    }
    if (!(contest_0.buffer instanceof ArrayBuffer && contest_0.BYTES_PER_ELEMENT === 1 && contest_0.length === 32)) {
      __compactRuntime.typeError('hostKey',
                                 'argument 2',
                                 'contest.compact line 53 char 1',
                                 'Bytes<32>',
                                 contest_0)
    }
    return _dummyContract._hostKey_0(sk_0, contest_0);
  },
  entrantKey: (...args_0) => {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`entrantKey: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const sk_0 = args_0[0];
    const contest_0 = args_0[1];
    if (!(sk_0.buffer instanceof ArrayBuffer && sk_0.BYTES_PER_ELEMENT === 1 && sk_0.length === 32)) {
      __compactRuntime.typeError('entrantKey',
                                 'argument 1',
                                 'contest.compact line 57 char 1',
                                 'Bytes<32>',
                                 sk_0)
    }
    if (!(contest_0.buffer instanceof ArrayBuffer && contest_0.BYTES_PER_ELEMENT === 1 && contest_0.length === 32)) {
      __compactRuntime.typeError('entrantKey',
                                 'argument 2',
                                 'contest.compact line 57 char 1',
                                 'Bytes<32>',
                                 contest_0)
    }
    return _dummyContract._entrantKey_0(sk_0, contest_0);
  },
  commitLabels: (...args_0) => {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`commitLabels: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const l_0 = args_0[0];
    const salt_0 = args_0[1];
    if (!(Array.isArray(l_0) && l_0.length === 64 && l_0.every((t) => typeof(t) === 'bigint' && t >= 0n && t <= 255n))) {
      __compactRuntime.typeError('commitLabels',
                                 'argument 1',
                                 'contest.compact line 61 char 1',
                                 'Vector<64, Uint<0..256>>',
                                 l_0)
    }
    if (!(salt_0.buffer instanceof ArrayBuffer && salt_0.BYTES_PER_ELEMENT === 1 && salt_0.length === 32)) {
      __compactRuntime.typeError('commitLabels',
                                 'argument 2',
                                 'contest.compact line 61 char 1',
                                 'Bytes<32>',
                                 salt_0)
    }
    return _dummyContract._commitLabels_0(l_0, salt_0);
  },
  commitPredictions: (...args_0) => {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`commitPredictions: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const p_0 = args_0[0];
    const salt_0 = args_0[1];
    if (!(Array.isArray(p_0) && p_0.length === 64 && p_0.every((t) => typeof(t) === 'bigint' && t >= 0n && t <= 255n))) {
      __compactRuntime.typeError('commitPredictions',
                                 'argument 1',
                                 'contest.compact line 65 char 1',
                                 'Vector<64, Uint<0..256>>',
                                 p_0)
    }
    if (!(salt_0.buffer instanceof ArrayBuffer && salt_0.BYTES_PER_ELEMENT === 1 && salt_0.length === 32)) {
      __compactRuntime.typeError('commitPredictions',
                                 'argument 2',
                                 'contest.compact line 65 char 1',
                                 'Bytes<32>',
                                 salt_0)
    }
    return _dummyContract._commitPredictions_0(p_0, salt_0);
  },
  score: (...args_0) => {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`score: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const p_0 = args_0[0];
    const l_0 = args_0[1];
    if (!(Array.isArray(p_0) && p_0.length === 64 && p_0.every((t) => typeof(t) === 'bigint' && t >= 0n && t <= 255n))) {
      __compactRuntime.typeError('score',
                                 'argument 1',
                                 'contest.compact line 69 char 1',
                                 'Vector<64, Uint<0..256>>',
                                 p_0)
    }
    if (!(Array.isArray(l_0) && l_0.length === 64 && l_0.every((t) => typeof(t) === 'bigint' && t >= 0n && t <= 255n))) {
      __compactRuntime.typeError('score',
                                 'argument 2',
                                 'contest.compact line 69 char 1',
                                 'Vector<64, Uint<0..256>>',
                                 l_0)
    }
    return _dummyContract._score_0(p_0, l_0);
  }
};
export const expectedVk = {
  'claimForfeit': 'db59775ad6afd3a1f7cefc929274db2828aad1f9e5b02355794c48e475ba622a',
  'claimPrize': '931a0a444137ac835100b1ff7bb641daf39b3de30e0579005f660035e9dcc21c',
  'createContest': '64502a27e53bf27a9e80bcf9e8df523b43a08427a2fb85f53b89c863551808c4',
  'enter': '6d0cbc9809b81aec194b35cd0443703af31a82fefa56840f8c4cabd850b15105',
  'proveScore': 'a6261aa5058d6d432cf36adab7da4295f9141f78e0700f2f65c749f4d4a53ed8',
  'reclaimPrize': '058a4ebaea7aad8155b6ce2afa36fc1693c980c0fe7621676d3c25dbc90f2d05',
  'revealLabels': 'b4c11072e61e86412b856a3b9572c16c408b14a8c31278f4f986110c069e7895',
};

export const circuitSignatures = {
  'hostKey': {pure: true, provable: false, argumentTypes: [{tag: 'Bytes', length: 32}, {tag: 'Bytes', length: 32}], resultType: {tag: 'Bytes', length: 32}},
  'entrantKey': {pure: true, provable: false, argumentTypes: [{tag: 'Bytes', length: 32}, {tag: 'Bytes', length: 32}], resultType: {tag: 'Bytes', length: 32}},
  'commitLabels': {pure: true, provable: false, argumentTypes: [{tag: 'Vector', length: 64, type: {tag: 'Uint', maxval: '255'}}, {tag: 'Bytes', length: 32}], resultType: {tag: 'Bytes', length: 32}},
  'commitPredictions': {pure: true, provable: false, argumentTypes: [{tag: 'Vector', length: 64, type: {tag: 'Uint', maxval: '255'}}, {tag: 'Bytes', length: 32}], resultType: {tag: 'Bytes', length: 32}},
  'score': {pure: true, provable: false, argumentTypes: [{tag: 'Vector', length: 64, type: {tag: 'Uint', maxval: '255'}}, {tag: 'Vector', length: 64, type: {tag: 'Uint', maxval: '255'}}], resultType: {tag: 'Uint', maxval: '65535'}},
  'createContest': {pure: false, provable: true, argumentTypes: [{tag: 'Bytes', length: 32}, {tag: 'Bytes', length: 32}, {tag: 'Bytes', length: 32}, {tag: 'Uint', maxval: '18446744073709551615'}, {tag: 'Uint', maxval: '18446744073709551615'}, {tag: 'Uint', maxval: '18446744073709551615'}, {tag: 'Uint', maxval: '18446744073709551615'}], resultType: {tag: 'Tuple', types: []}},
  'enter': {pure: false, provable: true, argumentTypes: [{tag: 'Bytes', length: 32}], resultType: {tag: 'Tuple', types: []}},
  'revealLabels': {pure: false, provable: true, argumentTypes: [{tag: 'Bytes', length: 32}, {tag: 'Vector', length: 64, type: {tag: 'Uint', maxval: '255'}}], resultType: {tag: 'Tuple', types: []}},
  'proveScore': {pure: false, provable: true, argumentTypes: [{tag: 'Bytes', length: 32}], resultType: {tag: 'Tuple', types: []}},
  'claimPrize': {pure: false, provable: true, argumentTypes: [{tag: 'Bytes', length: 32}, {tag: 'Struct', name: 'UserAddress', elements: [{name: 'bytes', type: {tag: 'Bytes', length: 32}}]}], resultType: {tag: 'Tuple', types: []}},
  'reclaimPrize': {pure: false, provable: true, argumentTypes: [{tag: 'Bytes', length: 32}, {tag: 'Struct', name: 'UserAddress', elements: [{name: 'bytes', type: {tag: 'Bytes', length: 32}}]}], resultType: {tag: 'Tuple', types: []}},
  'claimForfeit': {pure: false, provable: true, argumentTypes: [{tag: 'Bytes', length: 32}, {tag: 'Struct', name: 'UserAddress', elements: [{name: 'bytes', type: {tag: 'Bytes', length: 32}}]}], resultType: {tag: 'Tuple', types: []}},
};

export const declaredInterfaces = {};

//# sourceMappingURL=index.js.map
