```js
import React, { Component } from 'react';
import _ from 'lodash';
import RsuiteCheckTreePicker from 'rsuite-checktreepicker';
import treeData from '../data/treeData';


const newTreeData = [{
  value: 'children1',
  label: 'children1'
}];

class Dynamic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: treeData,
      selectedValues: ['Master', 'Maya']
    };
  }

  setTreeData = (child, activeNode, layer, treeNodes) => {
    if (layer < 0) {
      return;
    }

    const loop = (nodes) => {
      nodes.forEach((node) => {
        if (node.value === activeNode.value && activeNode.expand) {
          node.children = [...node.children, ...child];
        }
        if (node.children) {
          loop(node.children);
        }
      });
    };

    loop(treeNodes);

    this.setState({
      data: treeNodes
    });
  }

  setLoading(activeNode, loading = true) {
    const { data } = this.state;
    const nextTreeData = _.cloneDeep(data);
    const loop = (nodes) => {
      nodes.forEach((node) => {
        if (node.value === activeNode.value) {
          node.loading = loading;
        }
        if (node.children) {
          loop(node.children);
        }
      });
    };

    loop(nextTreeData);
    this.setState({
      data: nextTreeData
    });
  }

  loadData = (activeNode, layer) => {
    const { data } = this.state;
    const nextTreeData = _.cloneDeep(data);
    return new Promise((resolve) => {
      setTimeout(() => {
        this.setTreeData(newTreeData, activeNode, layer, nextTreeData);
        resolve();
      }, 2000);
    });
  }

  handleOnChange = (values) => {
    this.setState({
      selectedValues: values
    });
  }

  handleOnExpand = (activeNode, layer) => {
    if (activeNode.children.length === 0) {
      activeNode.expand && this.setLoading(activeNode, true);
      this.loadData(activeNode, layer)
        .then(() => {
          this.setLoading(activeNode, false);
        });
    }
  }

  renderTreeNode = (nodeData) => {
    if (nodeData.loading) {
      return (
        <span>
          <i className="icon-spinner icon icon-spin" />
          {nodeData.label}
        </span>
      );
    }
    return nodeData.label;
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
            console.log(activeNode, layer);
          }}
          onExpand={this.handleOnExpand}
          onChange={this.handleOnChange}
          renderTreeNode={this.renderTreeNode}
        />
      </div>
    );
  }
}

export default Dynamic;

```