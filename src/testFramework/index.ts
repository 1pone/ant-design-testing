/**
 * Test framework adapter for Jest and Vitest compatibility
 */

// 动态导入测试框架，避免在单一框架项目中的导入错误
declare global {
    // eslint-disable-next-line no-var
    var vi: any;
}

export interface TestFrameworkAdapter {
    fn: () => any;
    useFakeTimers: () => void;
    useRealTimers: () => void;
    runAllTimers: () => void;
    advanceTimersByTime: (msToRun: number) => void;
    spyOn: (object: any, method: string) => any;
}

class JestAdapter implements TestFrameworkAdapter {
    fn() {
        return jest.fn();
    }

    useFakeTimers() {
        jest.useFakeTimers();
    }

    useRealTimers() {
        jest.useRealTimers();
    }

    runAllTimers() {
        jest.runAllTimers();
    }

    advanceTimersByTime(msToRun: number) {
        jest.advanceTimersByTime(msToRun);
    }

    spyOn(object: any, method: string) {
        return jest.spyOn(object, method);
    }
}

class VitestAdapter implements TestFrameworkAdapter {
    fn() {
        return vi.fn();
    }

    useFakeTimers() {
        vi.useFakeTimers();
    }

    useRealTimers() {
        vi.useRealTimers();
    }

    runAllTimers() {
        vi.runAllTimers();
    }

    advanceTimersByTime(msToRun: number) {
        vi.advanceTimersByTime(msToRun);
    }

    spyOn(object: any, method: string) {
        return vi.spyOn(object, method);
    }
}

let currentAdapter: TestFrameworkAdapter;

export function initializeTestFramework(framework: 'jest' | 'vitest'): void {
    if (framework === 'jest') {
        currentAdapter = new JestAdapter();
    } else if (framework === 'vitest') {
        currentAdapter = new VitestAdapter();
    } else {
        throw new Error(`Unsupported test framework: ${framework}`);
    }
}

export function getTestFramework(): TestFrameworkAdapter {
    if (!currentAdapter) {
        // Default to Jest for backward compatibility
        initializeTestFramework('jest');
    }
    return currentAdapter;
}

// Export convenience functions
export const testFn = () => getTestFramework().fn();
export const useFakeTimers = () => getTestFramework().useFakeTimers();
export const useRealTimers = () => getTestFramework().useRealTimers();
export const runAllTimers = () => getTestFramework().runAllTimers();
export const advanceTimersByTime = (msToRun: number) => getTestFramework().advanceTimersByTime(msToRun);
export const spyOn = (object: any, method: string) => getTestFramework().spyOn(object, method);
