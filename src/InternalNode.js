import React, { Component } from 'react';
import TreeCheckNode from './TreeCheckNode';

class InternalNode extends Component {
  render() {
    const { className, children } = this.props;

    const Node = TreeCheckNode;
    return (
      <div className={className}>
        <Node {...this.props} />
        <div className="children">{children}</div>
      </div>
    );
  }
}

export default InternalNode;
