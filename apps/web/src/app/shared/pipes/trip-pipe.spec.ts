import { TripStatusPipe } from './trip-pipe';

describe('TripStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new TripStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
