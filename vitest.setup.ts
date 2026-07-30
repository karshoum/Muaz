import '@testing-library/jest-dom/vitest';
import 'fake-indexeddb/auto';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// jsdom لا ينفّذ رسم canvas — نوفّر بديلاً بسيطاً تحتاجه دوال ضغط الصور
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.toBlob = function toBlob(callback: BlobCallback, type?: string) {
    callback(new Blob(['test'], { type: type ?? 'image/png' }));
  };
}
