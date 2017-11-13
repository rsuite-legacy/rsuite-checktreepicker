import React, { Component } from 'react';
import RsuiteCheckTreePicker from '../../src';
import treeData from '../data/treeData';

class CustomPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: treeData,
      selectedValues: ['Dave', 'Maya']
    };
  }

  handleOnChange = (values) => {
    console.log(values);
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
          value={selectedValues}
          onSelect={(activeNode, layer) => {
          }}
          onChange={this.handleOnChange}
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
