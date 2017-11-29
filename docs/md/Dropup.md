### Dropup
<!-- start-code -->
```js
class DropupPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: treeData,
    };
  }

  render() {
    const { data } = this.state;
    return (
      <div className="example-item">
        <Picker
          dropup
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

ReactDOM.render(<DropupPicker/>)
```
<!-- end-code -->
* autoAdjustPosition 属性默认值为 true， 会自动根据当前 CheckPicker 的位置，自动调整是 dropdown 还是dropup。
* 如果配置手动配置 dropup 属性为 ture, 则 CheckPicker 只会向上展。