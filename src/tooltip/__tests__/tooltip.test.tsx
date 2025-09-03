import React from 'react';
import { render } from '@testing-library/react';
import { Tooltip } from 'antd';

import { testFn, useFakeTimers, useRealTimers } from '../../testFramework';
import * as tooltip from '..';

describe("test tooltip's fire functions", () => {
    beforeEach(() => {
        useFakeTimers();
    });
    afterEach(() => {
        useRealTimers();
    });

    /**
     * @link fireOpen
     */
    test('fireOpen', () => {
        const fn = testFn();
        const { getByText, getByTestId } = render(
            <Tooltip title="This's title" getPopupContainer={(node) => node.parentElement!} onOpenChange={fn}>
                <a data-testid="trigger">trigger</a>
            </Tooltip>
        );
        tooltip.fireOpen(getByTestId('trigger'));

        expect(fn).toBeCalledTimes(1);
        expect(getByText("This's title")).not.toBeNull();
    });
});
