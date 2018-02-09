### inline 模式
设置 `inline` 属性，就能当做 `check tree` 使用。
<!-- start-code -->
```js
class InlinePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: cityData,
      selectedValues: ['Dave']
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
      <div className="">
        <Picker
          defaultExpandAll
          inline
          height={320}
          data={data}
          cascade={true}
          defaultValue={selectedValues}
          onSelect={(activeNode, layer) => {
            console.log(activeNode, layer);
          }}
        />
      </div>
    );
  }
}

ReactDOM.render(<InlinePicker />)
```
<!-- end-code -->