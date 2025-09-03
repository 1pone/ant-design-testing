import { act, fireEvent } from '@testing-library/react';

import { runAllTimers } from '../testFramework';
import { failedTriggerElement } from '../utils';

/**
 * Show up tooltip
 */
export function fireOpen(ele?: HTMLElement) {
    if (!ele) throw failedTriggerElement();
    fireEvent.mouseEnter(ele);
    act(() => {
        runAllTimers();
    });
}
