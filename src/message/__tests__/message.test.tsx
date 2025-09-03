import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { Button, message as Message } from 'antd';

import * as button from '../../button';
import { testFn, useFakeTimers, useRealTimers } from '../../testFramework';
import * as message from '../index';

describe('Test Message', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        useRealTimers();
    });
    afterEach(() => {
        useRealTimers();
        act(() => {
            Message.destroy();
        });
    });

    /**
     * @link query
     */
    test('query', async () => {
        const { container } = render(<Button onClick={() => Message.info('This is message')}>Display</Button>);
        button.fireClick(container);
        await waitFor(
            async () => {
                expect(message.query(document)).not.toBeNull();
            },
            { timeout: 3000 }
        );
    });

    /**
     * @link fireClick
     */
    test('fireClick', async () => {
        const fn = testFn();
        const { container } = render(
            <Button
                onClick={() =>
                    Message.info({
                        content: 'this is message',
                        onClick: fn,
                    })
                }
            >
                Display
            </Button>
        );

        // 点击按钮触发 Message
        act(() => {
            button.fireClick(container);
        });

        // 等待 Message 渲染
        await waitFor(
            () => {
                expect(message.query(document)).not.toBeNull();
            },
            { timeout: 3000 }
        );

        // 点击 Message
        act(() => {
            message.fireClick(document);
        });

        // 验证 onClick 回调被调用
        await waitFor(
            () => {
                expect(fn).toBeCalledTimes(1);
            },
            { timeout: 3000 }
        );
    });

    /**
     * @link fireClose
     */
    test('fireClose', async () => {
        // 使用 fake timers 来控制时间
        useFakeTimers();

        const fn = testFn();
        const { container } = render(
            <Button
                onClick={() =>
                    Message.info({
                        content: 'this is message',
                        duration: 4,
                        onClose: fn,
                    })
                }
            >
                Display
            </Button>
        );

        // 点击按钮触发 Message
        act(() => {
            button.fireClick(container);
        });

        // 等待 Message 渲染
        await waitFor(
            () => {
                expect(message.query(document)).not.toBeNull();
            },
            { timeout: 3000 }
        );

        // 触发 fireClose（模拟时间推进）
        await message.fireClose(4000);

        // 验证 onClose 回调被调用
        expect(fn).toBeCalledTimes(1);

        // 恢复真实 timers
        useRealTimers();
    });
});
