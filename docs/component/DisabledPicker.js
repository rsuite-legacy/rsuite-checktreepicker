import React, { Component } from 'react';
import RsuiteCheckTreePicker from '../../src';
import treeData from '../data/treeData';

class Demo extends Component {
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
          disabled
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

export default Demo;
