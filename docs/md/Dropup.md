```js
import React, { Component } from 'react';
import RsuiteCheckTreePicker from 'rsuite-checktreepicker';
import treeData from '../data/treeData';

class DropupPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: treeData,
    };
  }

  render() {
    const { data } = this.state;
    return (
      <div>
        <RsuiteCheckTreePicker
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

export default DropupPicker;

```