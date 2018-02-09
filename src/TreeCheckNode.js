// @flow
import * as React from 'react';
import classNames from 'classnames';
import { hasClass } from 'dom-lib';
import { CHECK_STATE } from './constants';

type CheckState =
  | CHECK_STATE.UNCHECK
  | CHECK_STATE.HALFCHECK
  | CHECK_STATE.CHECK;
type DefaultEvent = SyntheticEvent<*>;

type Props = {
  classPrefix: string,
  visible?: boolean,
  label?: any,
  nodeData: Object,
  active?: boolean,
  checkState?: CheckState,
  hasChildren?: boolean,
  labelClickableExpand?: boolean,
  disabled?: boolean,
  layer: number,
  onTreeToggle?: (nodeData: Object, layer: number, event: DefaultEvent) => void,
  onSelect?: (nodeData: Object, layer: number, event: DefaultEvent) => void,
  onRenderTreeIcon?: (nodeData: Object) => React.Node,
  onRenderTreeNode?: (nodeData: Object) => React.Node,
  onKeyDown?: (event: SyntheticKeyboardEvent<*>) => void,
};

class TreeCheckNode extends React.Component<Props> {
  static defaultProps = {
    visible: true,
  };
  /**
   * 展开收缩节点
   */
  handleTreeToggle = (event: DefaultEvent) => {
    const { labelClickableExpand, onTreeToggle, layer, nodeData } = this.props;
    if (labelClickableExpand) {
      return;
    }
    onTreeToggle && onTreeToggle(nodeData, layer, event);
  };

  handleSelect = (event: DefaultEvent) => {
    const {
      classPrefix,
      onTreeToggle,
      onSelect,
      hasChildren,
      labelClickableExpand,
      layer,
      disabled,
      nodeData,
      checkState,
    } = this.props;

    if (disabled) {
      return;
    }

    // 如果点击的是展开 icon 就 return
    if (event.target instanceof HTMLElement) {
      if (
        hasClass(
          event.target.parentNode,
          `${classPrefix}-node-expand-icon-wrapper`,
        )
      ) {
        return;
      }
    }

    // 点击title的时候，如果 title 设置为可以点击，同时又拥有子节点，则可以展开数据
    if (labelClickableExpand && hasChildren) {
      onTreeToggle && onTreeToggle(nodeData, layer, event);
    }

    let isChecked = false;
    if (
      checkState === CHECK_STATE.UNCHECK ||
      checkState === CHECK_STATE.HALFCHECK
    ) {
      isChecked = true;
    }

    if (checkState === CHECK_STATE.CHECK) {
      isChecked = false;
    }
    nodeData.check = isChecked;
    onSelect && onSelect(nodeData, layer, event);
  };

  renderIcon = () => {
    const { onRenderTreeIcon, hasChildren, nodeData, classPrefix } = this.props;
    let expandIcon = <i className={`${classPrefix}-node-expand-icon icon`} />;
    if (typeof onRenderTreeIcon === 'function') {
      expandIcon = onRenderTreeIcon(nodeData);
    }
    return hasChildren ? (
      <div
        role="button"
        tabIndex="-1"
        className={`${classPrefix}-node-expand-icon-wrapper`}
        onClick={this.handleTreeToggle}
      >
        {expandIcon}
      </div>
    ) : null;
  };

  renderLabel = () => {
    const { classPrefix, nodeData, onRenderTreeNode, label } = this.props;
    let custom =
      typeof onRenderTreeNode === 'function'
        ? onRenderTreeNode(nodeData)
        : label;
    return (
      <span className={`${classPrefix}-checknode-label`} title={label}>
        {custom}
      </span>
    );
  };

  render() {
    const {
      classPrefix,
      visible,
      active,
      layer,
      disabled,
      onKeyDown,
      nodeData,
      checkState,
    } = this.props;

    const disabledClass = `${classPrefix}-node-disabled`;
    const activeClass = `${classPrefix}-node-active`;
    const checkClass = `${classPrefix}-node-checked`;
    const halfCheckClass = `${classPrefix}-node-half-checked`;
    const classes = classNames(`${classPrefix}-node`, {
      'text-muted': disabled,
      [halfCheckClass]: checkState === CHECK_STATE.HALFCHECK,
      [checkClass]: checkState === CHECK_STATE.CHECK,
      [disabledClass]: disabled,
      [activeClass]: active,
    });

    const styles = {
      paddingLeft: layer * 20,
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

export default TreeCheckNode;
