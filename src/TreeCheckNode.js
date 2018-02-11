// @flow
import * as React from 'react';
import classNames from 'classnames';
import { hasClass } from 'dom-lib';
import { prefix } from 'rsuite-utils/lib/utils';
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
  disabledCheckbox: boolean,
  layer: number,
  onTreeToggle?: (nodeData: Object, layer: number, event: DefaultEvent) => void,
  onSelect?: (nodeData: Object, layer: number, event: DefaultEvent) => void,
  onRenderTreeIcon?: (nodeData: Object) => React.Node,
  onRenderTreeNode?: (nodeData: Object) => React.Node,
  onKeyDown?: (event: SyntheticKeyboardEvent<*>) => void,
};

const INITIAL_PADDING = 12;
const PADDING = 16;

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
      disabledCheckbox,
      nodeData,
      checkState,
    } = this.props;

    if (disabled || disabledCheckbox) {
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
    const {
      classPrefix,
      nodeData,
      onRenderTreeNode,
      label,
      disabled,
      disabledCheckbox,
    } = this.props;
    const addPrefix = prefix(classPrefix);
    const input = (
      <span className={addPrefix('input-wrapper')}>
        <input
          className={addPrefix('input')}
          type="checkbox"
          disabled={disabled}
          onChange={this.handleSelect}
        />
        <span className={addPrefix('inner')} />
      </span>
    );
    let custom =
      typeof onRenderTreeNode === 'function'
        ? onRenderTreeNode(nodeData)
        : label;
    return (
      <span className={addPrefix('checknode-label')} title={label}>
        {!disabledCheckbox ? input : null}
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
      disabledCheckbox,
      onKeyDown,
      nodeData,
      checkState,
    } = this.props;

    const addPrefix = prefix(`${classPrefix}-node`);
    const classes = classNames(`${classPrefix}-node`, {
      'text-muted': disabled,
      [addPrefix('indeterminate')]: checkState === CHECK_STATE.HALFCHECK,
      [addPrefix('checked')]: checkState === CHECK_STATE.CHECK,
      [addPrefix('disabled')]: disabled,
      [addPrefix('active')]: active,
      [addPrefix('disabled-checkbox')]: disabledCheckbox,
    });

    const styles = { paddingLeft: layer * PADDING + INITIAL_PADDING };

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
