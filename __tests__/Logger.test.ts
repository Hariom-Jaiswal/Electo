import { logger } from '@/lib/logger';

describe('Structured Logger', () => {
  let spyLog: jest.SpyInstance;
  let spyWarn: jest.SpyInstance;
  let spyError: jest.SpyInstance;

  beforeEach(() => {
    spyLog = jest.spyOn(console, 'log').mockImplementation();
    spyWarn = jest.spyOn(console, 'warn').mockImplementation();
    spyError = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('logs INFO severity as console.log', () => {
    logger.info('test message', { key: 'value' });
    expect(spyLog).toHaveBeenCalled();
    const output = JSON.parse(spyLog.mock.calls[0][0]);
    expect(output.severity).toBe('INFO');
    expect(output.message).toBe('test message');
    expect(output.key).toBe('value');
  });

  it('logs WARNING severity as console.warn', () => {
    logger.warn('warn message');
    expect(spyWarn).toHaveBeenCalled();
    const output = JSON.parse(spyWarn.mock.calls[0][0]);
    expect(output.severity).toBe('WARNING');
  });

  it('logs ERROR severity as console.error', () => {
    logger.error('error message');
    expect(spyError).toHaveBeenCalled();
    const output = JSON.parse(spyError.mock.calls[0][0]);
    expect(output.severity).toBe('ERROR');
  });

  it('logs DEBUG severity as console.log', () => {
    logger.debug('debug message');
    expect(spyLog).toHaveBeenCalled();
    const output = JSON.parse(spyLog.mock.calls[0][0]);
    expect(output.severity).toBe('DEBUG');
  });
});
