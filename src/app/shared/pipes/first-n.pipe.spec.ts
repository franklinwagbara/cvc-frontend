import { FirstNPipe } from './first-n.pipe';

describe('FirstNPipe', () => {
  it('create an instance', () => {
    const pipe = new FirstNPipe();
    expect(pipe).toBeTruthy();
  });
});
