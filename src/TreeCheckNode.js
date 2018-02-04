import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { hasClass } from 'dom-lib';
import { CHECK_STATE } from './constants';

const propTypes = {
  visible: PropTypes.bool,
  label: PropTypes.any,        // eslint-disable-line react/forbid-prop-types
  nodeData: PropTypes.object,  // eslint-disable-line react/forbid-prop-types
  active: PropTypes.bool,
  checkState: PropTypes.oneOf([CHECK_STATE.CHECK, CHECK_STATE.HALFCHECK, CHECK_STATE.UNCHECK]),
  hasChildren: PropTypes.bool,
  labelClickableExpand: PropTypes.bool,
  disabled: PropTypes.bool,
  layer: PropTypes.number,
  onTreeToggle: PropTypes.func,
  onSelect: PropTypes.func,
  onRenderTreeIcon: PropTypes.func,
  onRenderTreeNode: PropTypes.func,
  onKeyDown: PropTypes.func,
};

const defaultProps = {
  visible: true,
};

class TreeCheckNode extends Component {
  /**
      * 展开收缩节点
      */
  handleTreeToggle = (event) => {
    const { labelClickableExpand, onTreeToggle, layer, nodeData } = this.props;
    if (labelClickableExpand) {
      return;
    }
    onTreeToggle(nodeData, layer, event);
  }

  handleSelect = (event) => {
    const {
      onTreeToggle,
      onSelect,
      hasChildren,
      labelClickableExpand,
      layer,
      disabled,
      nodeData,
      checkState
      } = this.props;

    if (disabled) {
      return;
    }

    // 如果点击的是展开 icon 就 return
    if (hasClass(event.target.parentNode, 'expand-icon-wrapper')) {
      return;
    }

    // 点击title的时候，如果 title 设置为可以点击，同时又拥有子节点，则可以展开数据
    labelClickableExpand && hasChildren && onTreeToggle(nodeData, layer, event);

    let isChecked = false;
    if (checkState === CHECK_STATE.UNCHECK || checkState === CHECK_STATE.HALFCHECK) {
      isChecked = true;
    }

    if (checkState === CHECK_STATE.CHECK) {
      isChecked = false;
    }
    nodeData.check = isChecked;
    onSelect(nodeData, layer, event);
  }

  renderIcon = () => {
    const { onRenderTreeIcon, hasChildren, nodeData } = this.props;

    const expandIcon = (typeof onRenderTreeIcon === 'function') ? onRenderTreeIcon(nodeData) : <i className="expand-icon icon" />;
    return hasChildren ? (
      <div
        role="button"
        tabIndex="-1"
        className="expand-icon-wrapper"
        onClick={this.handleTreeToggle}
      >
        {expandIcon}
      </div>
    ) : null;
  }

  renderLabel = () => {
    const { nodeData, onRenderTreeNode, label } = this.props;
    let custom = (typeof onRenderTreeNode === 'function') ?
      onRenderTreeNode(nodeData) : label;
    return (<label className="checknode-label" title={label}>{custom}</label>);
  }

  render() {
    const {
      visible,
      active,
      layer,
      disabled,
      onKeyDown,
      nodeData,
      checkState,
    } = this.props;

    const classes = classNames('tree-node', {
      'text-muted': disabled,
      'half-checked': checkState === CHECK_STATE.HALFCHECK,
      checked: checkState === CHECK_STATE.CHECK,
      disabled,
      active,
    });

    const styles = {
      paddingLeft: layer * 20
    };

    return visible ? (
      <div
        tabIndex={-1}
        role="button"
        onClick={this.handleSelect}
        onKeyDown={onKeyDown}
        data-layer={layer}
        data-key={nodeData.refKey}
        style={styles}
        className={classes}
      >
        {this.renderIcon()}
        {this.renderLabel()}
      </div>
    ) : null;
  }
}

TreeCheckNode.propTypes = propTypes;
TreeCheckNode.defaultProps = defaultProps;
export default TreeCheckNode;
