import React, {
  Context,
  createContext,
  Dispatch,
  FunctionComponent,
  Reducer,
  useReducer,
} from 'react';

interface IReducerContext<State, Action> {
  provider: FunctionComponent;
  context: Context<[State, Dispatch<Action>]>;
}

export default function createReducerContext<State, Action>(
  reducer: Reducer<State, Action>,
  initialState: State,
): IReducerContext<State, Action> {
  const Context = createContext<[State, Dispatch<Action>]>([
    initialState,
    () => {
      /* do nothing */
    },
  ]);

  const Provider: FunctionComponent = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
      <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
    );
  };

  return {
    context: Context,
    provider: Provider,
  };
}
