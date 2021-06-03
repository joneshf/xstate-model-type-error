# xstate-model-type-error

A reproduction of the type error when adding another event

## Description

Everything seems to work out fine when there's a single event.
Once a second event is added,
the compiler starts reporting errors like:

```
index.ts:47:7 - error TS2322: Type 'AssignAction<Context, { type: "REMOVE_NUMBER"; }>' is not assignable to type 'ActionObject<Context, Event>'.
  Types of property 'exec' are incompatible.
    Type 'ActionFunction<Context, { type: "REMOVE_NUMBER"; }> | undefined' is not assignable to type 'ActionFunction<Context, Event> | undefined'.
      Type 'ActionFunction<Context, { type: "REMOVE_NUMBER"; }>' is not assignable to type 'ActionFunction<Context, Event>'.
        Type 'Event' is not assignable to type '{ type: "REMOVE_NUMBER"; }'.
          Type '{ type: "ADD_NUMBER"; number: number; }' is not assignable to type '{ type: "REMOVE_NUMBER"; }'.
            Types of property 'type' are incompatible.
              Type '"ADD_NUMBER"' is not assignable to type '"REMOVE_NUMBER"'.

47 const addNumber: xstate.ActionObject<Context, Event> = model.assign({
         ~~~~~~~~~
```

The errors go away if a model is not used.
