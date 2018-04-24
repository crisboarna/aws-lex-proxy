import LexProxy from '../LexProxy';

describe('LexProxy', () => {
  const TEST_STRING = 'TEST_STRING';
  const TEST_ERROR = 'TEST_ERROR';
  const TEST_DATA = 'TEST_DATA';
  let mockAwsSdk;
  let mockLexContainer;
  let mockPostTextImpl;
  let mockLex = { postText: '' };
  const mockEvent = { 'body-json': TEST_STRING };

  beforeEach(() => {
    mockLexContainer = jest.fn(() => mockLex);
    mockAwsSdk = { LexRuntime: mockLexContainer };
  });

  it('throws error if no AWS SDK provided', () => {
    expect(() => new LexProxy(TEST_STRING, TEST_STRING, {})).toThrow('AWS SDK with LexRuntime expected. ' +
    'Please provide AWS SDK with all configurations setup a priori.');
  });

  it('creates and stores LexRuntime instance if provided', () => {
    const proxy = new LexProxy(TEST_STRING, TEST_STRING, mockAwsSdk);
    expect(mockLexContainer.mock.calls.length).toBe(1);
  });

  it('should throw error given no template filter', () => {
    const proxy = new LexProxy(TEST_STRING, TEST_STRING, mockAwsSdk);
    expect(() => proxy.proxy({},{}, () => {})).toThrow(`Event missing body-json payload. Have you added the proper request templates ?`);
  });

  it('given err calls callback with err and failed message', () => {
    mockPostTextImpl = jest.fn((params, cb) => cb(TEST_ERROR));
    mockLex = { postText: mockPostTextImpl };
    mockLexContainer = jest.fn(() => mockLex);
    mockAwsSdk = { LexRuntime: mockLexContainer };
    const callback = jest.fn();

    const lexProxy = new LexProxy(TEST_STRING, TEST_STRING, mockAwsSdk);

    lexProxy.proxy(mockEvent, {}, callback);

    expect(callback.mock.calls.length).toBe(1);
  });

  it('calls context succeed given no error and returns data', () => {
    mockPostTextImpl = jest.fn((params, cb) => cb(null, TEST_DATA));
    mockLex = { postText: mockPostTextImpl };
    mockLexContainer = jest.fn(() => mockLex);
    mockAwsSdk = { LexRuntime: mockLexContainer };
    const callback = jest.fn();
    const context = { succeed: jest.fn() };

    const lexProxy = new LexProxy(TEST_STRING, TEST_STRING, mockAwsSdk);

    lexProxy.proxy(mockEvent, context, callback);

    expect(context.succeed.mock.calls.length).toBe(1);
    expect(context.succeed).toHaveBeenCalledWith(TEST_DATA);
  });
});
