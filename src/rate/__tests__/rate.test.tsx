import React from 'react';
import { render } from '@testing-library/react';
import { Rate } from 'antd';

import { testFn } from '../../testFramework';
import * as rate from '..';

describe("Test rate's fire functions", () => {
    /**
     * @link fireChange
     */
    test('test fireChange', () => {
        const fn = testFn();
        const { container } = render(<Rate allowHalf onChange={fn} />);
        rate.fireChange(container, 3);
        expect(fn).toBeCalledWith(3);
        rate.fireChange(container, 3.5);
        expect(fn).lastCalledWith(3.5);
    });

    /**
     * @link fireHoverChange
     */
    test('test fireHoverChange', () => {
        const fn = testFn();
        const { container } = render(<Rate allowHalf onHoverChange={fn} />);
        rate.fireHoverChange(container, 3.5);
        expect(fn).toBeCalledWith(3.5);
        rate.fireHoverChange(container, 1);
        expect(fn).lastCalledWith(1);
    });

    /**
     * @link query
     */
    test('test query', () => {
        const { container } = render(
            <>
                <Rate className="test1" />
                <Rate className="test2" />
            </>
        );
        expect(rate.query(container).className).toContain('test1');
        expect(rate.query(container, 1).className).toContain('test2');
    });
});
