### 自定义图标
<!-- start-code -->
```js
class CustomPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: treeData,
      selectedValues: ['Dave', 'Maya']
    };
  }


  setExpand(activeNode) {
    const { data } = this.state;
    const nextTreeData = cloneDeep(data);
    const loop = (nodes) => {
      nodes.forEach((node) => {
        if (node.value === activeNode.value) {
          node.expand = activeNode.expand;
        }
        if (node.children) {
          loop(node.children);
        }
      });
    };

    loop(nextTreeData);
    this.setState({
      data: nextTreeData
    });
  }

  handleOnChange = (values) => {
    this.setState({
      selectedValues: values
    });
  }


  handleOnExpand = (activeNode, layer) => {
    if (activeNode.children.length) {
      this.setExpand(activeNode);
    }
  }

  renderTreeIcon = (nodeData) => {
    if (nodeData.expand) {
      return (
        <i className="icon-minus-square-o icon " />
      );
    }
    return (
      <i className="icon-plus-square-o icon " />
    );
  }

  render() {
    const { data, selectedValues } = this.state;
    return (
      <div className="example-item">
        <Picker
          height={320}
          data={data}
          value={selectedValues}
          disabledItemValues={['disabled']}
          onSelect={(activeNode, layer) => {
            console.log(activeNode, layer);
          }}
          onChange={this.handleOnChange}
          onExpand={this.handleOnExpand}
          onChange={this.handleOnChange}
          renderTreeIcon={this.renderTreeIcon}
        />
      </div>
    );
  }
}

ReactDOM.render(<CustomPicker/>)

```
<!-- end-code -->
* 使用自定义 Placeholder的方法，必须要将组件设置为受控组件