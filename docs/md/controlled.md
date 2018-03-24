### 受控组件
<!-- start-code -->
```js
class SimplePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selectedValues: ['Master', 'Maya']
    };
  }

  handleOnChange = (values) => {
    this.setState({
      selectedValues: values
    });
  }


  handleOpen = () => {
    setTimeout(() => this.setState({ data: treeData }), 1500)
  }

  handleRenderMenu = (menu) => {
    const { data } = this.state;
    if(data.length === 0){
      return <span style={{display: 'block',textAlign: 'center'}}>loading...</span>
    }
    return menu;
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
          onOpen={this.handleOpen}
          onSelect={(activeNode, layer) => {
            console.log(activeNode, layer);
          }}
          onChange={this.handleOnChange}
          renderMenu={this.handleRenderMenu}
        />
      </div>
    );
  }
}

ReactDOM.render(<SimplePicker />)
```
<!-- end-code -->