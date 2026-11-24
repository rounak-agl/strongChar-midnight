import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export enum JobState { OPEN = 0,
                       SUBMITTED = 1,
                       PASSED = 2,
                       FAILED = 3,
                       REFUNDED = 4
}

export type Node = { bond: bigint;
                     kemKey: Uint8Array;
                     earned: bigint;
                     busy: boolean
                   };

export type Job = { owner: Uint8Array;
                    spec: Uint8Array;
                    budget: bigint;
                    trainer: Uint8Array;
                    submitBy: bigint;
                    verdictBy: bigint;
                    result: Uint8Array;
                    state: JobState;
                    firstVerifier: Uint8Array;
                    firstPass: boolean;
                    votes: bigint;
                    settled: boolean
                  };

export type Witnesses<PS> = {
  localSecretKey(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  addVerifier(context: __compactRuntime.CircuitContext<PS>, key_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
  registerNode(context: __compactRuntime.CircuitContext<PS>,
               kemKey_0: Uint8Array,
               bond_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  createJob(context: __compactRuntime.CircuitContext<PS>,
            job_0: Uint8Array,
            spec_0: Uint8Array,
            budget_0: bigint,
            trainer_0: Uint8Array,
            submitBy_0: bigint,
            verdictBy_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  submitResult(context: __compactRuntime.CircuitContext<PS>,
               job_0: Uint8Array,
               result_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
  vote(context: __compactRuntime.CircuitContext<PS>,
       job_0: Uint8Array,
       result_0: Uint8Array,
       pass_0: boolean): Promise<__compactRuntime.CircuitResults<PS, []>>;
  collect(context: __compactRuntime.CircuitContext<PS>,
          job_0: Uint8Array,
          to_0: { bytes: Uint8Array }): Promise<__compactRuntime.CircuitResults<PS, []>>;
  withdrawEarnings(context: __compactRuntime.CircuitContext<PS>,
                   to_0: { bytes: Uint8Array }): Promise<__compactRuntime.CircuitResults<PS, []>>;
  leave(context: __compactRuntime.CircuitContext<PS>,
        to_0: { bytes: Uint8Array }): Promise<__compactRuntime.CircuitResults<PS, []>>;
}

export type ProvableCircuits<PS> = {
  addVerifier(context: __compactRuntime.CircuitContext<PS>, key_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
  registerNode(context: __compactRuntime.CircuitContext<PS>,
               kemKey_0: Uint8Array,
               bond_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  createJob(context: __compactRuntime.CircuitContext<PS>,
            job_0: Uint8Array,
            spec_0: Uint8Array,
            budget_0: bigint,
            trainer_0: Uint8Array,
            submitBy_0: bigint,
            verdictBy_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  submitResult(context: __compactRuntime.CircuitContext<PS>,
               job_0: Uint8Array,
               result_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
  vote(context: __compactRuntime.CircuitContext<PS>,
       job_0: Uint8Array,
       result_0: Uint8Array,
       pass_0: boolean): Promise<__compactRuntime.CircuitResults<PS, []>>;
  collect(context: __compactRuntime.CircuitContext<PS>,
          job_0: Uint8Array,
          to_0: { bytes: Uint8Array }): Promise<__compactRuntime.CircuitResults<PS, []>>;
  withdrawEarnings(context: __compactRuntime.CircuitContext<PS>,
                   to_0: { bytes: Uint8Array }): Promise<__compactRuntime.CircuitResults<PS, []>>;
  leave(context: __compactRuntime.CircuitContext<PS>,
        to_0: { bytes: Uint8Array }): Promise<__compactRuntime.CircuitResults<PS, []>>;
}

export type PureCircuits = {
  adminKey(sk_0: Uint8Array): Uint8Array;
  nodeKey(sk_0: Uint8Array): Uint8Array;
  verifierKey(sk_0: Uint8Array): Uint8Array;
  ownerKey(sk_0: Uint8Array, job_0: Uint8Array): Uint8Array;
}

export type Circuits<PS> = {
  adminKey(context: __compactRuntime.CircuitContext<PS>, sk_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, Uint8Array>>;
  nodeKey(context: __compactRuntime.CircuitContext<PS>, sk_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, Uint8Array>>;
  verifierKey(context: __compactRuntime.CircuitContext<PS>, sk_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, Uint8Array>>;
  ownerKey(context: __compactRuntime.CircuitContext<PS>,
           sk_0: Uint8Array,
           job_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, Uint8Array>>;
  addVerifier(context: __compactRuntime.CircuitContext<PS>, key_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
  registerNode(context: __compactRuntime.CircuitContext<PS>,
               kemKey_0: Uint8Array,
               bond_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  createJob(context: __compactRuntime.CircuitContext<PS>,
            job_0: Uint8Array,
            spec_0: Uint8Array,
            budget_0: bigint,
            trainer_0: Uint8Array,
            submitBy_0: bigint,
            verdictBy_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  submitResult(context: __compactRuntime.CircuitContext<PS>,
               job_0: Uint8Array,
               result_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
  vote(context: __compactRuntime.CircuitContext<PS>,
       job_0: Uint8Array,
       result_0: Uint8Array,
       pass_0: boolean): Promise<__compactRuntime.CircuitResults<PS, []>>;
  collect(context: __compactRuntime.CircuitContext<PS>,
          job_0: Uint8Array,
          to_0: { bytes: Uint8Array }): Promise<__compactRuntime.CircuitResults<PS, []>>;
  withdrawEarnings(context: __compactRuntime.CircuitContext<PS>,
                   to_0: { bytes: Uint8Array }): Promise<__compactRuntime.CircuitResults<PS, []>>;
  leave(context: __compactRuntime.CircuitContext<PS>,
        to_0: { bytes: Uint8Array }): Promise<__compactRuntime.CircuitResults<PS, []>>;
}

export type Ledger = {
  readonly admin: Uint8Array;
  verifiers: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  nodes: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Node;
    [Symbol.iterator](): Iterator<[Uint8Array, Node]>
  };
  jobs: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Job;
    [Symbol.iterator](): Iterator<[Uint8Array, Job]>
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
