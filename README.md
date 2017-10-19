[![npm](https://img.shields.io/npm/v/rsuite-checktreepicker.svg)](https://www.npmjs.com/package/rsuite-checktreepicker)
# rsuite-checktreepicker
基于 [rsuite-check-tree](https://rsuitejs.com/rsuite-check-tree/) 封装的 Picker。
## 快速开始
安装

```bash
npm install rsuite-checktreepicker --save
```

用法

引入 less 文件
```
@import "~rsuite-checktreepicker/lib/less/index";
```

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