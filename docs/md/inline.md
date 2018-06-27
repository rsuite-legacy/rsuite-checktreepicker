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
      word: '福',
      expandAll: true,
    };
  }

  handleOnChange = values => {
    this.setState({
      selectedValues: values,
    });
  };

  handleToggleExpand = () => {
    this.setState(prev => {
      return {
        expandAll: !prev.expandAll,
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
    const { data, selectedValues, cascade, word, expandAll } = this.state;
    return (
      <div className="">
        <button onClick={this.handleToggleExpand}>toggle expandAll</button>
        <br/>
        <input type="text" value={word} onChange={this.handleSearch}/>
        <Picker
          inline
          height={320}
          data={data}
          cascade={cascade}
          expandAll={expandAll}
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
