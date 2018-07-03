### 禁用 checkbox
<!-- start-code -->
```js

class DisabledPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: treeData,
      selectedValues: ['Dave', 'Maya']
    };
  }

  render() {
    const { data, selectedValues } = this.state;
    return (
      <div className="example-item">
        <Picker
          disabledCheckboxValues={['Marty']}
          disabledItemValues={['disabled']}
          value={selectedValues}
          defaultExpandAll
          height={320}
          data={data}
          onSelect={(activeNode, layer) => {
            console.log(activeNode, layer);
          }}
          onChange={(values)=>{
            this.setState({
              selectedValues: values
            })
          }}
        />
      </div>
    );
  }
}

ReactDOM.render(<DisabledPicker/>);

```
<!-- end-code -->