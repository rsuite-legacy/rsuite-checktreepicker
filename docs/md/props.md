
属性名称                 | 类型           | 默认值   | 描述
-------------------- | ---------------- | -----   | -------------------
value                | array            |         | 当前选中的值
defaultValue         | array            |         | 默认选中的值
data                 | array            |         | tree 数据
valueKey             | string           | "value" | tree数据结构value属性名称
labelKey             | string           | "label" | tree数据结构label属性名称
childKey             | string           | "children" | tree数据结构children属性名称
disabledItems        | array            |         | 禁用节点列表
defaultExpandAll     | bool             | false   | 默认展开所有节点
cascade             | bool             | false   | 是否级联选择
expand | bool | false | 是否展开
dropup | bool | false | 向上展开
autoAdjustPosition | bool | true | 自动调节位置，但设置 `dropup` 后，该属性无效
locale | object | | 本地语言
placeholder | string | Please Select | 占位符
disabled | bool | false | 是否禁用 Picker
seasrchable | bool | true | 是否显示搜索框
onSearch | function(searchKeyword, event) || 搜索回调函数
onToggle | function() | |展开 Dropdown 的回调函数
onChange             | function(values)         |         | 数据改变的回调函数
onExpand             | function(activeNode, layer)         |         | 树节点展示时的回调
onSelect             | function(activeNode, layer, values)       |         | 选择树节点后的回调函数
renderTreeNode       | function(nodeData)         |         | 自定义渲染 tree 节点
renderTreeIcon       | function(nodeData)         |         | 自定义渲染 图标
renderPlaceholder    | function(value, checkItem, placeholder) | 自定义渲染placeholder
didMount             | function(values) |         |         | componentDidMount 周期完成时回调函数



