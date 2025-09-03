<div align="center">ant-design-testing</div>

_Easier testing for ant-design-based UI library with Jest and Vitest support_

This library is based on `React-Testing-Library` and supports both `Jest` and `Vitest` testing frameworks

## Usage

The latest package supports antd v5.x version.
If you are using antd 4.x, please install `ant-design-testing@1.x` version.

```shell
$ npm install ant-design-testing -D
#or
$ yarn add ant-design-testing -D
#or
$ pnpm add ant-design-testing -D
```

Then, configure the library in your test setup file:

```tsx
// setupTests.ts
import { provider } from 'ant-design-testing';

// Configure prefix class (default: 'ant')
// Configure test framework (default: 'jest')
provider({ 
    prefixCls: 'ant',
    testFramework: 'jest' // or 'vitest'
});
```

### For Jest Users

No additional setup required. The library defaults to Jest compatibility.

### For Vitest Users

Configure Vitest in your setup:

```tsx
// setupTests.ts
import { provider } from 'ant-design-testing';

provider({ 
    prefixCls: 'ant',
    testFramework: 'vitest'
});
```

Or create a `vitest.config.js`:

```js
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        setupFiles: ['./tests/setupTests.ts'],
        globals: true,
    },
});
```

## Basic Usage

```tsx
// yourInput.test.tsx
import { input, testFn } from 'ant-design-testing';

describe("Test input's fire functions", () => {
    test('fireChange', () => {
        const fn = testFn(); // Framework-agnostic mock function
        const { container } = render(<Input onChange={fn} />);
        input.fireChange(container, 'test');
        expect(fn).toBeCalled();
    });
});
```

Otherwise, you can use query to find ant-design element quickly, like this

```tsx
// yourInput.test.tsx
import { input } from 'ant-design-testing';

test('query', () => {
    const { container } = render(<div>
        <Input />
        <Input id='test' />
    </div>);
    const el = input.query(container, 1)
    expect(el.id).toBe('test');
});
```

A simple example form demo, like this

```tsx
// your form Component
const MyForm = ({ onSubmit }: any) => {
    const [form] = Form.useForm();
    return (
        <Form form={form}>
            <Form.Item name="username">
                <Input />
            </Form.Item>
            <Form.Item name="password">
                <Input type="password" />
            </Form.Item>
            <Form.Item name="role">
                <Select>
                    <Select.Option value="admin">管理员</Select.Option>
                </Select>
            </Form.Item>
            <Button
                htmlType="submit"
                onClick={() => {
                    onSubmit(form.getFieldsValue());
                }}
            >
                提交
            </Button>
        </Form>
    );
};
```

```tsx
// your test file
import { select, input, button, testFn } from 'ant-design-testing';

it('test MyForm', () => {
    const fn = testFn(); // Framework-agnostic mock function
    const { container } = render(
        <MyForm onSubmit={fn}/>
    );
    const userName = input.query(container)!;
    const password = input.query(container, 1)!;
    input.fireChange(userName, 'zhangsan')
    input.fireChange(password, '123456')

    select.fireOpen(container);
    select.fireSelect(document.body, 0)

    button.fireClick(container);

    expect(fn).toBeCalledWith({username: 'zhangsan', password: '123456', role: 'admin'});
});
```

All query methods support chain calling

```tsx
// basic usage
const userName = input.query(container)!;
const password = input.query(container, 1)!;
input.fireChange(userName, 'zhangsan');
input.fireChange(password, '123456');

// chain usage
input.query(container)?.fireChange('zhangsan');
input.query(container, 1)?.fireChange('123456');
```

## Test Framework Agnostic APIs

The library provides framework-agnostic APIs that work with both Jest and Vitest:

### Mock Functions

```tsx
import { testFn } from 'ant-design-testing';

const mockFn = testFn(); // Works with both Jest and Vitest
```

### Timer Control

```tsx
import { useFakeTimers, useRealTimers, runAllTimers, advanceTimersByTime } from 'ant-design-testing';

// Setup fake timers
useFakeTimers();

// Advance timers
runAllTimers();
advanceTimersByTime(1000);

// Restore real timers
useRealTimers();
```

### Spy Functions

```tsx
import { spyOn } from 'ant-design-testing';

const spy = spyOn(console, 'log');
```

## Migration from Jest-only Code

If you have existing Jest-specific code, you can use our migration script:

```bash
npm run migrate-tests
```

This script will automatically update your test files to use framework-agnostic APIs.

## Framework Configuration

### Jest Configuration (jest.config.js)

```js
module.exports = {
    setupFilesAfterEnv: ['./tests/setupTests.ts'],
    testEnvironment: 'jsdom',
    // ... other Jest config
};
```

### Vitest Configuration (vitest.config.js)

```js
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        setupFiles: ['./tests/setupTests.ts'],
        globals: true,
    },
});
```

## Running Tests

```bash
# Run with Jest
npm run test:jest

# Run with Vitest
npm run test:vitest

# Default (Jest)
npm test
```
