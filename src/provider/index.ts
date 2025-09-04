import { initializeTestFramework } from '../testFramework';

export interface GlobalConfig {
    prefixCls: string;
    testFramework: 'jest' | 'vitest';
}

const globalConfig: GlobalConfig = {
    prefixCls: 'ant',
    testFramework: 'jest', // Default to jest for backward compatibility
};

export function getProviders() {
    return globalConfig;
}

export function getProvider(key: keyof typeof globalConfig) {
    return globalConfig[key];
}

export function provider(opt: Partial<GlobalConfig>) {
    Object.assign(globalConfig, opt);

    // Initialize test framework when config changes
    if (opt.testFramework) {
        initializeTestFramework(opt.testFramework);
    }
}
