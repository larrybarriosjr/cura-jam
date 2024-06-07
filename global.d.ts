// Remove type error on webkit AudioContext
interface Window {
  webkitAudioContext: typeof AudioContext;
}

// Make ReadableStream iterable
interface ReadableStream<R = any> {
  [Symbol.asyncIterator](): AsyncIterableIterator<R>;
}
