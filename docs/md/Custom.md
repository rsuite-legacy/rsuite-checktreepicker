### 自定义 Placeholder
<!-- start-code -->
```js
class CustomPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: treeData,
      selectedValues: []
    };
  }

  handleOnChange = (values) => {
    this.setState({
      selectedValues: values
    });
  }

  render() {
    const { data, selectedValues } = this.state;
    return (
      <div className="example-item">
        <Picker
          defaultExpandAll
          height={320}
          data={data}
          value={selectedValues}
          onSelect={(activeNode, layer) => {
            console.log(activeNode, layer);
          }}
          onChange={this.handleOnChange}
          placeholder="请选择"
          renderValue={(value, checkedItems, placeholder) => {
            if (!value.length) {
              return placeholder;
            }
            return (
              <span>
                <i className="icon icon-user" /> {value.join(' , ')}
              </span>
            );
          }}
        />
      </div>
    );
  }
}

ReactDOM.render(<CustomPicker/>)

```
<!-- end-code -->
* 使用自定义 Placeholder的方法，必须要将组件设置为受控组件