### inline 模式

设置 `inline` 属性，就能当做 `check tree` 使用。

<!-- start-code -->

```js
class InlinePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: cityData,
      selectedValues: [2, 38],
      cascade: true,
    };
  }

  handleOnChange = values => {
    this.setState({
      selectedValues: values,
    });
  };

  handleToggle = () => {
    this.setState(prev => {
      return {
        cascade: !prev.cascade,
      };
    });
  };

  render() {
    const { data, selectedValues, cascade } = this.state;
    return (
      <div className="">
        <button onClick={this.handleToggle}>Toggle cascade </button>
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

ReactDOM.render(<InlinePicker />);
```

<!-- end-code -->
