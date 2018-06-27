### inline 模式

设置 `inline` 属性，就能当做 `check tree` 使用。

<!-- start-code -->

```js
class InlinePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: cityData,
      selectedValues: [{ id: 2 }, { id: 38 }],
      cascade: true,
      word: '福'
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

  handleSearch = e => {
    console.log(e)
    this.setState({
      word: e.target.value
    })
  }

  render() {
    const { data, selectedValues, cascade, word } = this.state;
    return (
      <div className="">
        <input type="text" value={word} onChange={this.handleSearch}/>
        <Picker
          defaultExpandAll
          inline
          height={320}
          data={data}
          cascade={cascade}
          searchKeyword={word}
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
