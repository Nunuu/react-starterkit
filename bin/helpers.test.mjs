import { executeFunctions } from './helpers.mjs';

describe(`${executeFunctions.name}`, () => {
  it('executes functions one by one and returns true', async () => {
    const resolvedFunction = jest.fn(async () => true);

    const functions = [resolvedFunction, resolvedFunction, resolvedFunction];
    const done = await executeFunctions(functions);

    expect(resolvedFunction.mock.invocationCallOrder).toEqual([1, 2, 3]);
    expect(done).toEqual(true);
  });

  it('stops execution on functions with false return', async () => {
    const resolvedFunction = jest.fn(async () => true);
    const rejectedFunction = jest.fn(async () => false);

    const functions = [resolvedFunction, rejectedFunction, resolvedFunction];
    const done = await executeFunctions(functions);

    expect(resolvedFunction).toHaveBeenCalledTimes(1);
    expect(rejectedFunction).toHaveBeenCalledTimes(1);
    expect(done).toEqual(false);
  });
});
