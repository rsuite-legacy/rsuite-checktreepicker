```js
import React, { Component } from 'react';
import RsuiteCheckTreePicker from 'rsuite-checktreepicker';
import treeData from '../data/treeData';

class CustomPicker extends Component {
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
      <div>
        <RsuiteCheckTreePicker
          defaultExpandAll
          height={320}
          data={data}
          onSelect={(activeNode, layer) => {
            console.log(activeNode, layer);
          }}
          renderPlaceholder={(value, checkedItems, placeholder) => {
            if (!value.length) {
              return placeholder;
            }
            return (
              <span>
                <i className="icon icon-user" /> {value.join(' , ')}
              </span>
            );
          }}
        />
      </div>
    );
  }
}

export default CustomPicker;

```