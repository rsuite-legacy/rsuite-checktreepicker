```js
import React, { Component } from 'react';
import RsuiteCheckTreePicker from 'rsuite-checktreepicker';
import treeData from '../data/treeData';

class SimplePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: treeData,
      selectedValues: ['Master', 'Maya']
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
      <div>
        <RsuiteCheckTreePicker
          defaultExpandAll
          height={320}
          data={data}
          onSelect={(activeNode, layer) => {
            console.log(activeNode, layer);
          }}
        />
        <br />
        <RsuiteCheckTreePicker
          defaultExpandAll
          height={320}
          data={data}
          value={selectedValues}
          onSelect={(activeNode, layer) => {
            console.log(activeNode, layer);
          }}
          onChange={this.handleOnChange}
        />
      </div>
    );
  }
}


export default SimplePicker;

```