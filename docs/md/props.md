| 属性名称               | 类型                                      | 默认值        | 描述                            |
| ---------------------- | ----------------------------------------- | ------------- | ------------------------------- |
| block                  | boolean                                   | false         | 是否显示为块级元素              |
| cascade                | bool                                      | false         | checktree 是否级联选择          |
| childrenKey               | string                                    | "children"    | tree 数据结构 children 属性名称 |
| className              | string                                    |               | Picker 的自定义 className       |
| classPrefix            | string                                    |               | className 的前缀                |
| cleanable              | bool                                      | true          | 是否可以清除                    |
| data                   | array                                     |               | tree 数据                       |
| defaultExpandAll       | bool                                      | false         | 默认展开所有节点                |
| defaultValue           | array                                     |               | 默认选中的值                    |
| disabled               | bool                                      | false         | 是否禁用 Picker                 |
| disabledCheckboxValues | array                                     |               | 禁用节点的 checkbox 列表        |
| disabledItemValues     | array                                     |               | 禁用节点列表                    |
| expandAll              | bool                                      |               | (受控)是否展开所有节点          |
| inline                 | boolean                                   | false         | 是否只使用 checktree            |
| labelKey               | string                                    | "label"       | tree 数据结构 label 属性名称    |
| locale                 | object                                    |               | 本地语言                        |
| menuClassName          | string                                    |               | Picker Menu 的自定义 className  |
| onChange               | function(values)                          |               | 数据改变的回调函数              |
| onClose                | function()                                |               | 关闭 Dropdown 的回调函数        |
| onExpand               | function(activeNode, layer)               |               | 树节点展示时的回调              |
| onOpen                 | function()                                |               | 展开 Dropdown 的回调函数        |
| onSearch               | function(searchKeyword, event)            |               | 搜索回调函数                    |
| onSelect               | function(activeNode, layer, values)       |               | 选择树节点后的回调函数          |
| placeholder            | React.Node                                | Please Select | 占位符                          |
| placement              | enum: Placement                           | `bottomLeft`  | 打开位置                        |
| renderExtraFooter      | ()=>React.Node                            |               | 自定义页脚内容                  |
| renderTreeIcon         | function(nodeData)                        |               | 自定义渲染 图标                 |
| renderTreeNode         | function(nodeData)                        |               | 自定义渲染 tree 节点            |
| renderValue            | function(menu)                            |               | 自定义渲染 Dropdown Menu        |
| renderValue            | function(values, checkItems, placeholder) |               | 自定义渲染 placeholder          |
| searchKeyword          | string                                    |               | 搜索关键词                      |
| seasrchable            | bool                                      | true          | 是否显示搜索框                  |
| style                  | object                                    |               | style 样式                      |
| toggleComponentClass   | string                                    |               | Picker toggle 的自定义组件名称  |
| value                  | array                                     |               | 当前选中的值                    |
| valueKey               | string                                    | "value"       | tree 数据结构 value 属性名称    |

<br/>
`Placement` 取值如下：
- `bottomLeft`
- `bottomRight`
- `leftBottom`
- `rightBottom`
- `topLeft`
- `topRight`
- `leftTop`
- `rightTop`
