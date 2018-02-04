[![Travis](https://img.shields.io/travis/rsuite/rsuite-checktreepicker.svg)](https://travis-ci.org/rsuite/rsuite-checktreepicker)
[![npm](https://img.shields.io/npm/v/rsuite-checktreepicker/version2.x.svg)](https://www.npmjs.com/package/rsuite-checktreepicker)
[![Coverage Status](https://coveralls.io/repos/github/rsuite/rsuite-checktreepicker/badge.svg?branch=master)](https://coveralls.io/github/rsuite/rsuite-checktreepicker?branch=master)

# rsuite-checktreepicker

## 快速开始
### 安装

```bash
npm install rsuite-checktreepicker --save
```

### 引入 less 文件
```
@import "~rsuite-checktreepicker/lib/less/index";
```
### 基本示例
```jsx
    <RsuiteCheckTreePicker
        defaultExpandAll
        height={320}
        data={data}
        onSelect={(activeNode, layer) => {
          console.log(activeNode, layer);
        }}
        onChange={this.handleOnChange}
      />
```
