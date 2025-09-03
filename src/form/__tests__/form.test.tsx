import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Button, Form, Input } from 'antd';

import * as button from '../../button';
import { IContainer } from '../../interface';
import { testFn, useFakeTimers, useRealTimers } from '../../testFramework';
import * as form from '../';

describe("Test form's functions", () => {
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
            <>
                <Form name="basic" />
                <Form name="advance" />
            </>
        );
        expect(form.query(container)?.id).toBe('basic');
        expect(form.query(container, 1)?.id).toBe('advance');
    });

    /**
     * @link queryFormItems
     */
    test('queryFormItems', async () => {
        // 暂时使用真实的 timers 来避免表单提交的时序问题
        useRealTimers();

        const fn = testFn();
        const { container } = render(
            <Form onFinish={fn}>
                <Form.Item label="Username" name="username">
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
        );

        // 获取第二个 form item（包含提交按钮的那个）
        const formItem = form.queryFormItems(container, 1)!;
        expect(formItem).not.toBeNull();

        // 在 form item 中查找 submit 按钮并点击它
        const submitButton = formItem.querySelector('button[type="submit"]')!;
        expect(submitButton).not.toBeNull();

        button.fireClick(submitButton as IContainer);

        await waitFor(
            () => {
                expect(fn).toBeCalledTimes(1);
            },
            { timeout: 3000 }
        );

        // 恢复 fake timers
        useFakeTimers();
    });

    /**
     * @link queryFormItemControls
     */
    test('queryFormItemControls', () => {
        const { container } = render(
            <Form>
                <Form.Item label="Username" name="username">
                    <Input />
                </Form.Item>
            </Form>
        );
        expect(form.queryFormItemControls(container)?.querySelector('label')).toBeNull();
    });
});
