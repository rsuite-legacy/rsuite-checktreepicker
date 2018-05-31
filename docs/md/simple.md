### 非受控组件
<!-- start-code -->
```js
class SimplePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: treeData,
    };
  }

  render() {
    const { data, selectedValues } = this.state;
    return (
      <div className="example-item">
        <Picker
          defaultExpandAll
          height={320}
          data={data}
          onSelect={(activeNode, layer) => {
            console.log(activeNode, layer);
          }}
        />
      </div>
    );
  }
}

ReactDOM.render(<SimplePicker />)
```
<!-- end-code -->