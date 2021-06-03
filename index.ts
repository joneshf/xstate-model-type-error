import * as xstate from "xstate";
import * as xstateModel from "xstate/lib/model";

interface Context {
  values: number[];
}

type Event =
  // Uncomment line 24 (the `| { type: "REMOVE_NUMBER" }` line),
  // and `tsc` fails to compile with an error like:
  // index.ts:47:7 - error TS2322: Type 'AssignAction<Context, { type: "REMOVE_NUMBER"; }>' is not assignable to type 'ActionObject<Context, Event>'.
  //   Types of property 'exec' are incompatible.
  //     Type 'ActionFunction<Context, { type: "REMOVE_NUMBER"; }> | undefined' is not assignable to type 'ActionFunction<Context, Event> | undefined'.
  //       Type 'ActionFunction<Context, { type: "REMOVE_NUMBER"; }>' is not assignable to type 'ActionFunction<Context, Event>'.
  //         Type 'Event' is not assignable to type '{ type: "REMOVE_NUMBER"; }'.
  //           Type '{ type: "ADD_NUMBER"; number: number; }' is not assignable to type '{ type: "REMOVE_NUMBER"; }'.
  //             Types of property 'type' are incompatible.
  //               Type '"ADD_NUMBER"' is not assignable to type '"REMOVE_NUMBER"'.

  // 47 const addNumber: xstate.ActionObject<Context, Event> = model.assign({
  //          ~~~~~~~~~

  // Found 1 error.
  // | { type: "REMOVE_NUMBER" }
  | { type: "ADD_NUMBER"; number: number };

export type Model = xstateModel.Model<Context, Event, any>;

interface Schema {
  states: States;
}

type States = {
  normal: {};
};

const context: Context = {
  values: [],
};

export const model: Model = xstateModel.createModel(context, {
  events: {
    ADD_NUMBER: (number: Number) => ({ number }),
  },
});

const addNumber: xstate.ActionObject<Context, Event> = model.assign({
  values: (context: Context, event: Event): number[] => {
    if (event.type !== "ADD_NUMBER") {
      return context.values;
    }

    return context.values.concat([event.number]);
  },
});

const config: xstate.MachineConfig<Context, Schema, Event> = {
  id: "values",
  initial: "normal",
  context: model.initialContext,
  states: {
    normal: {
      on: {
        ADD_NUMBER: [
          {
            actions: ["addNumber"],
          },
        ],
      },
    },
  },
};

const options: Partial<xstate.MachineOptions<Context, Event>> = {
  actions: {
    addNumber,
  },
};

export const machine: xstate.StateMachine<Context, Schema, Event, any> =
  xstate.createMachine<Model>(config, options);
