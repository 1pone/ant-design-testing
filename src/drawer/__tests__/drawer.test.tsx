import React from 'react';
import { render } from '@testing-library/react';
import { Drawer } from 'antd';

import { testFn } from '../../testFramework';
import * as drawer from '..';

describe("Test Drawer fire's functions", () => {
    /**
     * @link fireClose
     */
    test('fireClose', () => {
        const fn = testFn();
        const { container } = render(<Drawer getContainer={false} open onClose={fn} />);
        drawer.fireClose(container);
        expect(fn).toBeCalled();
    });

    test('fireClose by icon', () => {
        const fn = testFn();
        const { container } = render(<Drawer getContainer={false} open onClose={fn} />);
        drawer.fireClose(container, { closeByMask: true });
        expect(fn).toBeCalled();
    });
});
