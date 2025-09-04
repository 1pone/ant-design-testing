import React from 'react';
import { render } from '@testing-library/react';
import { FloatButton } from 'antd';

import { testFn } from '../../testFramework';
import * as floatButton from '..';

describe("Test FloatButton's fire functions", () => {
    /**
     * @link fireClick
     */
    test('test fireClick', () => {
        const fn1 = testFn();
        const fn2 = testFn();
        const { container } = render(
            <>
                <FloatButton onClick={fn1} />
                <FloatButton onClick={fn2} />
            </>
        );
        floatButton.fireClick(container);
        expect(fn1).toBeCalledTimes(1);

        floatButton.query(container, 1)?.fireClick();
        expect(fn2).toBeCalledTimes(1);
    });

    /**
     * @link query
     */
    test('test query', () => {
        const { container } = render(<FloatButton />);
        expect(floatButton.query(container)).toBeTruthy();
    });
});
