export enum ADDRESS_ACTIONS {
  set, change, reset
}

export type SimpleAction = {type: ADDRESS_ACTIONS, value?: string};

export const addressReducer = (stored: string, action: SimpleAction) => {
  switch (action.type) {
    case ADDRESS_ACTIONS.set:
    case ADDRESS_ACTIONS.change:
      return action.value;
    case ADDRESS_ACTIONS.reset:
      return '';
    default:
      return stored;
  }
}