import { vi } from 'vitest';

import { provider } from '../src/provider';

// Configure for Vitest
provider({
    prefixCls: 'ant',
    testFramework: 'vitest',
});

// Mock matchMedia for jsdom environment in Vitest
Object.defineProperty(global.window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn((query) => ({
        matches: query.includes('max-width'),
        addListener: vi.fn(),
        removeListener: vi.fn(),
    })),
});

// Mock getComputedStyle for JSDOM compatibility
Object.defineProperty(global.window, 'getComputedStyle', {
    writable: true,
    configurable: true,
    value: vi.fn((_element) => ({
        getPropertyValue: vi.fn(() => ''),
        width: '0px',
        height: '0px',
        display: 'block',
        // Add other commonly used CSS properties
        position: 'static',
        overflow: 'visible',
        fontSize: '14px',
        fontFamily: 'Arial',
    })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

// 模拟 IntersectionObserver，补全必要属性以通过类型检查
class MockIntersectionObserver {
    root = null;
    rootMargin = '';
    thresholds = [];
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);
    constructor() {}
}
global.IntersectionObserver = MockIntersectionObserver as any;
