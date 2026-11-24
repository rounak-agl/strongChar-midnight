import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Contest = { host: Uint8Array;
                        labelCommit: Uint8Array;
                        dataset: Uint8Array;
                        closesAt: bigint;
                        revealBy: bigint;
                        scoreBy: bigint;
                        prize: bigint;
                        entries: bigint;
                        revealed: boolean;
                        best: bigint;
                        leader: Uint8Array;
                        settled: boolean
                      };

export type Witnesses<PS> = {
  localSecretKey(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  predictions(context: __compactRuntime.WitnessContext<Ledger, PS>,
              contest_0: Uint8Array): [PS, bigint[]];
  predictionSalt(context: __compactRuntime.WitnessContext<Ledger, PS>,
                 contest_0: Uint8Array): [PS, Uint8Array];
  labelSalt(context: __compactRuntime.WitnessContext<Ledger, PS>,
            contest_0: Uint8Array): [PS, Uint8Array];
  shareOf(context: __compactRuntime.WitnessContext<Ledger, PS>,
          prize_0: bigint,
          entries_0: bigint): [PS, bigint];
}

export type ImpureCircuits<PS> = {
  createContest(context: __compactRuntime.CircuitContext<PS>,
                contest_0: Uint8Array,
                labelCommit_0: Uint8Array,
                dataset_0: Uint8Array,
                closesAt_0: bigint,
                revealBy_0: bigint,
                scoreBy_0: bigint,
                prize_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  enter(context: __compactRuntime.CircuitContext<PS>, contest_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
  revealLabels(context: __compactRuntime.CircuitContext<PS>,
               contest_0: Uint8Array,
               l_0: bigint[]): Promise<__compactRuntime.CircuitResults<PS, []>>;
  proveScore(context: __compactRuntime.CircuitContext<PS>, contest_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
  claimPrize(context: __compactRuntime.CircuitContext<PS>,
             contest_0: Uint8Array,
             to_0: { bytes: Uint8Array }): Promise<__compactRuntime.CircuitResults<PS, []>>;
  reclaimPrize(context: __compactRuntime.CircuitContext<PS>,
               contest_0: Uint8Array,
               to_0: { bytes: Uint8Array }): Promise<__compactRuntime.CircuitResults<PS, []>>;
  claimForfeit(context: __compactRuntime.CircuitContext<PS>,
               contest_0: Uint8Array,
               to_0: { bytes: Uint8Array }): Promise<__compactRuntime.CircuitResults<PS, []>>;
}

export type ProvableCircuits<PS> = {
  createContest(context: __compactRuntime.CircuitContext<PS>,
                contest_0: Uint8Array,
                labelCommit_0: Uint8Array,
                dataset_0: Uint8Array,
                closesAt_0: bigint,
                revealBy_0: bigint,
                scoreBy_0: bigint,
                prize_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  enter(context: __compactRuntime.CircuitContext<PS>, contest_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
  revealLabels(context: __compactRuntime.CircuitContext<PS>,
               contest_0: Uint8Array,
               l_0: bigint[]): Promise<__compactRuntime.CircuitResults<PS, []>>;
  proveScore(context: __compactRuntime.CircuitContext<PS>, contest_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
  claimPrize(context: __compactRuntime.CircuitContext<PS>,
             contest_0: Uint8Array,
             to_0: { bytes: Uint8Array }): Promise<__compactRuntime.CircuitResults<PS, []>>;
  reclaimPrize(context: __compactRuntime.CircuitContext<PS>,
               contest_0: Uint8Array,
               to_0: { bytes: Uint8Array }): Promise<__compactRuntime.CircuitResults<PS, []>>;
  claimForfeit(context: __compactRuntime.CircuitContext<PS>,
               contest_0: Uint8Array,
               to_0: { bytes: Uint8Array }): Promise<__compactRuntime.CircuitResults<PS, []>>;
}

export type PureCircuits = {
  hostKey(sk_0: Uint8Array, contest_0: Uint8Array): Uint8Array;
  entrantKey(sk_0: Uint8Array, contest_0: Uint8Array): Uint8Array;
  commitLabels(l_0: bigint[], salt_0: Uint8Array): Uint8Array;
  commitPredictions(p_0: bigint[], salt_0: Uint8Array): Uint8Array;
  score(p_0: bigint[], l_0: bigint[]): bigint;
}

export type Circuits<PS> = {
  hostKey(context: __compactRuntime.CircuitContext<PS>,
          sk_0: Uint8Array,
          contest_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, Uint8Array>>;
  entrantKey(context: __compactRuntime.CircuitContext<PS>,
             sk_0: Uint8Array,
             contest_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, Uint8Array>>;
  commitLabels(context: __compactRuntime.CircuitContext<PS>,
               l_0: bigint[],
               salt_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, Uint8Array>>;
  commitPredictions(context: __compactRuntime.CircuitContext<PS>,
                    p_0: bigint[],
                    salt_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, Uint8Array>>;
  score(context: __compactRuntime.CircuitContext<PS>,
        p_0: bigint[],
        l_0: bigint[]): Promise<__compactRuntime.CircuitResults<PS, bigint>>;
  createContest(context: __compactRuntime.CircuitContext<PS>,
                contest_0: Uint8Array,
                labelCommit_0: Uint8Array,
                dataset_0: Uint8Array,
                closesAt_0: bigint,
                revealBy_0: bigint,
                scoreBy_0: bigint,
                prize_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  enter(context: __compactRuntime.CircuitContext<PS>, contest_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
  revealLabels(context: __compactRuntime.CircuitContext<PS>,
               contest_0: Uint8Array,
               l_0: bigint[]): Promise<__compactRuntime.CircuitResults<PS, []>>;
  proveScore(context: __compactRuntime.CircuitContext<PS>, contest_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
  claimPrize(context: __compactRuntime.CircuitContext<PS>,
             contest_0: Uint8Array,
             to_0: { bytes: Uint8Array }): Promise<__compactRuntime.CircuitResults<PS, []>>;
  reclaimPrize(context: __compactRuntime.CircuitContext<PS>,
               contest_0: Uint8Array,
               to_0: { bytes: Uint8Array }): Promise<__compactRuntime.CircuitResults<PS, []>>;
  claimForfeit(context: __compactRuntime.CircuitContext<PS>,
               contest_0: Uint8Array,
               to_0: { bytes: Uint8Array }): Promise<__compactRuntime.CircuitResults<PS, []>>;
}

export type Ledger = {
  contests: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Contest;
    [Symbol.iterator](): Iterator<[Uint8Array, Contest]>
  };
  entries: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  scores: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
  };
  labels: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint[];
    [Symbol.iterator](): Iterator<[Uint8Array, bigint[]]>
  };
  forfeitClaims: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
}

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): Promise<__compactRuntime.ConstructorResult<PS>>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
export declare const expectedVk: Record<string, string>;
export declare const circuitSignatures: __compactRuntime.CircuitSignatures;
export declare const declaredInterfaces: __compactRuntime.DeclaredInterfaces;
