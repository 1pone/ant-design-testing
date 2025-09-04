import React from 'react';
import { render } from '@testing-library/react';
import { Button, Popconfirm } from 'antd';

import * as button from '../../button';
import { testFn, useFakeTimers, useRealTimers } from '../../testFramework';
import * as confirm from '..';

describe("Test popconfirm fire's functions", () => {
    beforeEach(() => {
        useFakeTimers();
    });

    afterEach(() => {
        useRealTimers();
    });

    /**
     * @link query
     */
    test('query', () => {
        const { container } = render(
            <Popconfirm title="test" getPopupContainer={(node) => node.parentElement!}>
                <Button danger>Delete</Button>
            </Popconfirm>
        );
        confirm.fireOpen(button.query(container)!);
        expect(confirm.query(container)).not.toBeNull();
    });

    /**
     * @link queryButtons
     */
    test('queryButtons', () => {
        const { container } = render(
            <Popconfirm title="test" getPopupContainer={(node) => node.parentElement!}>
                <Button danger>Delete</Button>
            </Popconfirm>
        );
        confirm.fireOpen(button.query(container)!);
        expect(confirm.queryButtons(container)).not.toBeNull();
    });

    /**
     * @link queryCancelButton
     */
    test('queryCancelButton', () => {
        const fn = testFn();
        const { container } = render(
            <Popconfirm title="test" onCancel={fn} getPopupContainer={(node) => node.parentElement!}>
                <Button danger>Delete</Button>
            </Popconfirm>
        );
        confirm.fireOpen(button.query(container)!);
        confirm.fireCancel(confirm.queryCancelButton(container)!);
        expect(fn).toBeCalled();
    });

    /**
     * @link queryConfirmButton
     */
    test('queryConfirmButton', () => {
        const fn = testFn();
        const { container } = render(
            <Popconfirm title="test" onConfirm={fn} getPopupContainer={(node) => node.parentElement!}>
                <Button danger>Delete</Button>
            </Popconfirm>
        );
        confirm.fireOpen(button.query(container)!);
        confirm.fireConfirm(confirm.queryConfirmButton(container)!);
        expect(fn).toBeCalled();
    });

    /**
     * @link fireOpen
     */
    test('fireOpen', () => {
        const fn = testFn();
        const { container } = render(
            <Popconfirm title="test" onOpenChange={fn} getPopupContainer={(node) => node.parentElement!}>
                <Button danger>Delete</Button>
            </Popconfirm>
        );
        confirm.fireOpen(button.query(container)!);
        expect(fn).toBeCalledTimes(1);
    });

    /**
     * @link fireCancel
     */
    test('fireCancel', () => {
        const fn = testFn();
        const { container } = render(
            <Popconfirm title="test" onCancel={fn} getPopupContainer={(node) => node.parentElement!}>
                <Button danger>Delete</Button>
            </Popconfirm>
        );
        confirm.fireOpen(button.query(container)!);
        confirm.fireCancel(container);
        expect(fn).toBeCalled();
    });

    /**
     * @link fireConfirm
     */
    test('fireConfirm', () => {
        const fn = testFn();
        const { container } = render(
            <Popconfirm title="test" onConfirm={fn} getPopupContainer={(node) => node.parentElement!}>
                <Button danger>Delete</Button>
            </Popconfirm>
        );
        confirm.fireOpen(button.query(container)!);
        confirm.fireConfirm(container);
        expect(fn).toBeCalled();
    });
});
