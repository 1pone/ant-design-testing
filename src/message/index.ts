import { act, fireEvent } from '@testing-library/react';

import { IContainer } from '../interface';
import { getProvider } from '../provider';
import { advanceTimersByTime } from '../testFramework';
import { failedQuerySelector, mixinElementWithTestFuncs, queryViaSelector } from '../utils';

const mixins = {
    query,
    queryContent,
    fireClick,
};

/**
 * Fires onClick function
 */
export function fireClick(container: IContainer) {
    const ele = queryContent(container);
    if (!ele) throw failedQuerySelector(`.${getProvider('prefixCls')}-message-notice-content`);
    fireEvent.click(ele);
}

/**
 * Fires onClose function by waiting duration
 * @param {number} duration ms
 */
export async function fireClose(duration = 3000) {
    for (let i = 0; i < 10; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await Promise.resolve();
    }

    // Use act to wrap timer advancement for both Jest and Vitest
    await act(async () => {
        advanceTimersByTime(duration);
        // Allow React to process the timer advancement
        await Promise.resolve();
    });
}

/**
 * Returns the container element
 */
export function query(container: IContainer, index = 0) {
    const selector = `.${getProvider('prefixCls')}-message`;
    const ele = queryViaSelector<HTMLDivElement>(container, selector, index);
    return mixinElementWithTestFuncs(ele, mixins);
}

/**
 * Returns the content element
 */
export function queryContent(container: IContainer, index = 0) {
    const selector = `.${getProvider('prefixCls')}-message-notice-content`;
    const ele = queryViaSelector<HTMLDivElement>(container, selector, index);
    return mixinElementWithTestFuncs(ele, mixins);
}
