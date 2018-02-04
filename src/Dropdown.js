import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { toggleClass, hasClass } from 'dom-lib';
import { findDOMNode } from 'react-dom';
import { IntlProvider, FormattedMessage } from 'rsuite-intl';
import OverlayTrigger from 'rsuite-utils/lib/Overlay/OverlayTrigger';
import _ from 'lodash';
import {
  reactToString,
  getUnhandledProps,
  prefix,
} from 'rsuite-utils/lib/utils';

import {
  SearchBar,
  Toggle,
  MenuWrapper,
  constants,
} from 'rsuite-utils/lib/Picker';
import InternalNode from './InternalNode';
import TreeCheckNode from './TreeCheckNode';
import defaultLocale from './locale/index';
import { CHECK_STATE } from './constants';

const { namespace } = constants;
const propTypes = {
  height: PropTypes.number,
  data: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  /**
   * 是否级联选择
   */
  cascade: PropTypes.bool,
  // 是否只显示check-tree
  inline: PropTypes.bool,
  defaultValue: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  disabledItems: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  valueKey: PropTypes.string,
  labelKey: PropTypes.string,
  childrenKey: PropTypes.string,
  defaultExpandAll: PropTypes.bool,
  classPrefix: PropTypes.string,
  disabled: PropTypes.bool,
  open: PropTypes.bool,
  defaultOpen: PropTypes.bool,
  locale: PropTypes.object,
  placeholder: PropTypes.string,
  cleanable: PropTypes.bool,
  searchable: PropTypes.bool,
  onSearch: PropTypes.func,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  renderValue: PropTypes.func,
  renderExtraFooter: PropTypes.func, // 自定义页脚内容
  onChange: PropTypes.func,
  onExpand: PropTypes.func,
  onSelect: PropTypes.func,
  onScroll: PropTypes.func,
  renderTreeNode: PropTypes.func,
  renderTreeIcon: PropTypes.func,
  placement: PropTypes.oneOf([
    'bottomLeft',
    'bottomRight',
    'topLeft',
    'topRight',
    'leftTop',
    'rightTop',
    'leftBottom',
    'rightBottom',
  ]),
};

const defaultProps = {
  classPrefix: `${namespace}-checktree`,
  inline: false,
  cascade: true,
  value: [],
  disabled: PropTypes.false,
  disabledItems: [],
  expand: false,
  locale: defaultLocale,
  autoAdjustPosition: true,
  cleanable: true,
  searchable: true,
  valueKey: 'value',
  labelKey: 'label',
  childrenKey: 'children',
  placeholder: 'placeholder',
};

class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.nodes = {};
    this.isControlled =
      'value' in props && 'onChange' in props && props.onChange;
    const { value, defaultValue, data } = props;
    const nextValue = value || defaultValue || [];

    this.flattenNodes(data);
    this.unserializeLists({
      check: nextValue,
    });

    this.state = {
      formattedNodes: [],
      // data: [],
      selectedValues: nextValue,
      searchKeyword: '',
      data: this.getFilterData('', data),
    };
  }

  componentWillReceiveProps(nextProps) {
    const { searchKeyword } = this.state;
    const { value, data } = nextProps;
    // if (!_.isEqual(data, this.props.data)) {
    //   this.setState({
    //     filterData: this.getFilterData(searchKeyword, data),
    //   });
    // }
    if (!_.isEqual(this.props.data, data)) {
      this.flattenNodes(nextProps.data);
      this.unserializeLists({
        check: nextProps.value,
      });
      this.setState({
        data: this.getFilterData(searchKeyword, data),
      });
    }
    if (!_.isEqual(value, this.props.value)) {
      this.setState({
        selectedValues: value,
      });
    }
  }

  getNodeCheckState(node, cascade) {
    const { childrenKey } = this.props;
    if (!node[childrenKey] || !node[childrenKey].length || !cascade) {
      return node.check ? CHECK_STATE.CHECK : CHECK_STATE.UNCHECK;
    }

    if (this.isEveryChildChecked(node)) {
      return CHECK_STATE.CHECK;
    }

    if (this.isSomeChildChecked(node)) {
      return CHECK_STATE.HALFCHECK;
    }

    return CHECK_STATE.UNCHECK;
  }

  getExpandState(node) {
    const { childrenKey, defaultExpandAll } = this.props;
    if (node[childrenKey] && node[childrenKey].length) {
      if ('expand' in node) {
        return !!node.expand;
      } else if (defaultExpandAll) {
        return true;
      }
      return false;
    }
    return false;
  }

  getFilterData(searchKeyword = '', data) {
    const { labelKey } = this.props;
    const treeData = _.cloneDeep(data);
    const setVisible = (nodes = []) =>
      nodes.forEach(item => {
        item.visible = this.shouldDisplay(item[labelKey], searchKeyword);
        if (_.isArray(item.children)) {
          setVisible(item.children);
          item.children.forEach(child => {
            if (child.visible) {
              item.visible = child.visible;
            }
          });
        }
      });

    setVisible(treeData);
    return treeData;
  }

  getActiveElementOption(options, refKey) {
    for (let i = 0; i < options.length; i += 1) {
      if (options[i].refKey === refKey) {
        return options[i];
      } else if (options[i].children && options[i].children.length) {
        let active = this.getActiveElementOption(options[i].children, refKey);
        if (active) {
          return active;
        }
      }
    }
    return false;
  }

  getElementByDataKey = dataKey => {
    const ele = findDOMNode(this);
    return ele.querySelector(`[data-key="${dataKey}"]`);
  };

  setChildCheckState(parentNode) {
    Object.keys(this.nodes).forEach(refKey => {
      const node = this.nodes[refKey];
      if (
        'parentNode' in node &&
        _.isEqual(node.parentNode.value, parentNode.value)
      ) {
        this.nodes[refKey].check = true;
      }
    });
  }
  getFormattedNodes(nodes) {
    return nodes.map(node => {
      const formatted = { ...node };
      formatted.check = this.nodes[node.refKey].check;
      formatted.expand = this.nodes[node.refKey].expand;
      if (Array.isArray(node.children) && node.children.length > 0) {
        formatted.children = this.getFormattedNodes(
          formatted.children,
          formatted.check,
        );
      }

      return formatted;
    });
  }

  setCheckState(nodes) {
    const { cascade } = this.props;
    nodes.forEach(node => {
      const checkState = this.getNodeCheckState(node, cascade);
      let isChecked = false;
      if (
        checkState === CHECK_STATE.UNCHECK ||
        checkState === CHECK_STATE.HALFCHECK
      ) {
        isChecked = false;
      }
      if (checkState === CHECK_STATE.CHECK) {
        isChecked = true;
      }
      this.toggleNode('check', node, isChecked);
      if (Array.isArray(node.children) && node.children.length > 0) {
        this.setCheckState(node.children);
      }
    });
  }

  /**
   * 获取每个节点的disable状态
   * @param {*} node
   */
  getDisabledState(node) {
    const { disabledItems, valueKey } = this.props;
    return disabledItems.some(value => {
      return _.isEqual(this.nodes[node.refKey][valueKey], value);
    });
  }

  shouldDisplay(label, searchKeyword) {
    if (!_.trim(searchKeyword)) {
      return true;
    }
    const keyword = searchKeyword.toLocaleLowerCase();
    if (typeof label === 'string') {
      return label.toLocaleLowerCase().indexOf(keyword) >= 0;
    } else if (React.isValidElement(label)) {
      const nodes = reactToString(label);
      return (
        nodes
          .join('')
          .toLocaleLowerCase()
          .indexOf(keyword) >= 0
      );
    }
    return false;
  }

  isEveryChildChecked(node) {
    return node.children.every(child => {
      if (child.children) {
        return this.isEveryChildChecked(child);
      }

      return child.check;
    });
  }

  isSomeChildChecked(node) {
    return node.children.some(child => {
      if (child.children) {
        return this.isSomeChildChecked(child);
      }

      return child.check;
    });
  }

  /**
   * 拍平数组，将tree 转换为一维数组
   * @param {*} nodes tree data
   * @param {*} ref 当前层级
   */
  flattenNodes(nodes, ref = 0, parentNode) {
    const { labelKey, valueKey, childrenKey } = this.props;

    if (!Array.isArray(nodes) || nodes.length === 0) {
      return;
    }
    nodes.forEach((node, index) => {
      const refKey = `${ref}-${index}`;
      node.refKey = refKey;
      this.nodes[refKey] = {
        label: node[labelKey],
        value: node[valueKey],
        expand: this.getExpandState(node),
      };
      if (parentNode) {
        this.nodes[refKey].parentNode = parentNode;
      }
      this.flattenNodes(node[childrenKey], refKey, this.nodes[refKey]);
    });
  }

  serializeList(key) {
    const { valueKey } = this.props;
    const list = [];

    Object.keys(this.nodes).forEach(refKey => {
      if (this.nodes[refKey][key]) {
        list.push(this.nodes[refKey][valueKey]);
      }
    });
    return list;
  }

  unserializeLists(lists) {
    const { valueKey, cascade } = this.props;
    // Reset values to false
    Object.keys(this.nodes).forEach(refKey => {
      Object.keys(lists).forEach(listKey => {
        const node = this.nodes[refKey];
        if (cascade && 'parentNode' in node) {
          node[listKey] = node.parentNode[listKey];
        } else {
          node[listKey] = false;
        }
        lists[listKey].forEach(value => {
          if (_.isEqual(this.nodes[refKey][valueKey], value)) {
            this.nodes[refKey][listKey] = true;
          }
        });
      });
    });
  }

  getActiveItem() {
    const { data } = this.props;
    const activeItem = document.activeElement;
    const { key, layer } = activeItem.dataset;
    const nodeData = this.getActiveElementOption(data, key);
    nodeData.check = !this.nodes[nodeData.refKey].check;
    return {
      nodeData,
      layer,
    };
  }

  selectActiveItem = event => {
    const { nodeData, layer } = this.getActiveItem();
    this.handleSelect(nodeData, +layer, event);
  };

  focusNextItem() {
    const { items, activeIndex } = this.getItemsAndActiveIndex();
    if (items.length === 0) {
      return;
    }
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    this.getElementByDataKey(items[nextIndex].refKey).focus();
  }

  focusPreviousItem() {
    const { items, activeIndex } = this.getItemsAndActiveIndex();

    if (items.length === 0) {
      return;
    }

    const prevIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    this.getElementByDataKey(items[prevIndex].refKey).focus();
  }

  toggleChecked(node, isChecked, cascade) {
    const { childrenKey } = this.props;
    if (!node[childrenKey] || !node[childrenKey].length || !cascade) {
      this.toggleNode('check', node, isChecked);
    } else {
      this.toggleNode('check', node, isChecked);
      node.children.forEach(child => {
        this.toggleChecked(child, isChecked, cascade);
      });
    }
  }

  toggleNode(key, node, toggleValue) {
    this.nodes[node.refKey][key] = toggleValue;
  }

  toggleExpand(node, isExpand) {
    this.nodes[node.refKey].expand = isExpand;
  }

  addPrefix = name => prefix(this.props.classPrefix)(name);

  /**
   * 选择某个节点后的回调函数
   * @param {object} activeNodeData   节点的数据
   * @param {number} layer            节点的层级
   */
  handleSelect = (activeNode, layer) => {
    const { data } = this.state;
    const { onChange, onSelect, cascade } = this.props;
    this.toggleChecked(activeNode, activeNode.check, cascade);
    const formattedNodes = this.getFormattedNodes(data);

    if (cascade) {
      this.setCheckState(formattedNodes);
    }

    const selectedValues = this.serializeList('check');

    if (this.isControlled) {
      onChange && onChange(selectedValues);
      onSelect && onSelect(activeNode, layer, selectedValues);
    } else {
      this.setState(
        {
          formattedNodes,
          selectedValues,
        },
        () => {
          onChange && onChange(selectedValues);
          onSelect && onSelect(activeNode, layer, selectedValues);
        },
      );
    }
  };

  /**
   * 展开、收起节点
   */
  handleToggle = (nodeData, layer) => {
    const { onExpand } = this.props;
    toggleClass(findDOMNode(this.refs[nodeData.refKey]), 'open');
    nodeData.expand = hasClass(findDOMNode(this.refs[nodeData.refKey]), 'open');
    this.toggleExpand(nodeData, nodeData.expand);
    onExpand && onExpand(nodeData, layer);
  };

  /**
   * 展开树节点后的回调函数
   */
  handleExpand = (activeNode, layer) => {
    const { onExpand } = this.props;
    onExpand && onExpand(activeNode, layer);
  };

  /**
   * 处理键盘方向键移动
   */
  handleKeyDown = event => {
    switch (event.keyCode) {
      // down
      case 40:
        this.focusNextItem();
        event.preventDefault();
        break;
      // up
      case 38:
        this.focusPreviousItem();
        event.preventDefault();
        break;
      // enter
      case 13:
        this.selectActiveItem(event);
        event.preventDefault();
        break;
      default:
    }

    event.preventDefault();
  };

  handleSearch = value => {
    const { data } = this.props;
    this.setState({
      searchKeyword: value,
      data: this.getFilterData(value, data),
    });
  };

  /**
   * 清除已选择的项
   */
  handleClean = () => {
    const { onChange } = this.props;
    this.setState({
      selectedValues: [],
    });
    this.unserializeLists({
      check: [],
    });

    onChange && onChange([]);
  };

  renderDropdownMenu() {
    const { searchable, placement, renderExtraFooter } = this.props;
    const classes = classNames(
      this.addPrefix('menu'),
      `${namespace}-placement-${_.kebabCase(placement)}`,
    );

    return (
      <MenuWrapper className={classes}>
        {searchable ? (
          <SearchBar
            key="searchBar"
            onChange={this.handleSearch}
            value={this.state.searchKeyword}
          />
        ) : null}
        {this.renderCheckTree()}
        {renderExtraFooter && renderExtraFooter()}
      </MenuWrapper>
    );
  }

  renderNode(node, index, layer) {
    const {
      defaultExpandAll,
      valueKey,
      labelKey,
      childrenKey,
      renderTreeNode,
      renderTreeIcon,
      cascade,
    } = this.props;

    const key = `${node.refKey}`;
    const checkState = this.getNodeCheckState(node, cascade);
    const children = node[childrenKey];
    const disabled = this.getDisabledState(node);
    const hasNotEmptyChildren =
      children && Array.isArray(children) && children.length > 0;

    const props = {
      value: node[valueKey],
      label: node[labelKey],
      nodeData: node,
      onTreeToggle: this.handleToggle,
      onRenderTreeNode: renderTreeNode,
      onRenderTreeIcon: renderTreeIcon,
      onSelect: this.handleSelect,
      onKeyDown: this.handleKeyDown,
      // active: this.state.activeNode === value,
      hasChildren: !!children,
      disabled,
      children,
      index,
      layer,
      checkState,
      visible: node.visible,
      defaultExpandAll,
    };

    if (props.hasChildren) {
      layer += 1;

      // 是否展开树节点且子节点不为空
      let childrenClasses = classNames('node-children', {
        open: defaultExpandAll && hasNotEmptyChildren,
      });

      let nodes = children || [];
      return (
        <InternalNode
          className={childrenClasses}
          key={key}
          ref={key}
          multiple
          {...props}
        >
          {nodes.map((child, i) => this.renderNode(child, i, layer, node))}
        </InternalNode>
      );
    }

    return <TreeCheckNode key={key} ref={key} {...props} />;
  }

  renderCheckTree() {
    const { data } = this.state;
    const { onScroll, cascade } = this.props;
    // 树节点的层级
    let layer = 0;
    const { className, height } = this.props;
    const classes = classNames('tree-view', className, {
      checktree: true,
    });

    const formattedNodes = this.state.formattedNodes.length
      ? this.state.formattedNodes
      : this.getFormattedNodes(data);

    if (cascade) {
      this.setCheckState(formattedNodes);
    }

    const nodes = formattedNodes.map((node, index) => {
      return this.renderNode(node, index, layer);
    });
    const styles = {
      height,
    };

    return (
      <div
        ref={ref => {
          this.treeView = ref;
        }}
        className={classes}
        style={styles}
        onScroll={onScroll}
      >
        <div className="tree-nodes">{nodes}</div>
      </div>
    );
  }

  render() {
    const { data } = this.state;
    const {
      classPrefix,
      inline,
      open,
      defaultOpen,
      locale,
      disabled,
      className,
      placement,
      placeholder,
      cleanable,
      onOpen,
      onClose,
      renderValue,
      valueKey,
      ...rest
    } = this.props;

    const selectedValues = this.serializeList('check');

    const classes = classNames(
      classPrefix,
      {
        [this.addPrefix('has-value')]: !!selectedValues,
        [this.addPrefix('disabled')]: disabled,
      },
      `${namespace}-placement-${_.kebabCase(placement)}`,
      className,
    );

    let placeholderText =
      selectedValues && selectedValues.length ? (
        `${selectedValues.length} selected`
      ) : (
        <FormattedMessage id={placeholder} />
      );

    if (renderValue) {
      placeholderText = renderValue(
        selectedValues,
        data.filter(item =>
          selectedValues.some(val => _.eq(item[valueKey], val)),
        ),
        placeholderText,
      );
    }
    const unhandled = getUnhandledProps(Dropdown, rest);

    return !inline ? (
      <IntlProvider locale={locale}>
        <div
          {...unhandled}
          className={classes}
          onKeyDown={this.handleKeyDown}
          tabIndex={-1}
          role="menu"
          ref={ref => {
            this.container = ref;
          }}
        >
          <OverlayTrigger
            ref={ref => {
              this.trigger = ref;
            }}
            open={open}
            defaultOpen={defaultOpen}
            disabled={disabled}
            trigger="click"
            placement={placement}
            onEntered={onOpen}
            onExited={onClose}
            speaker={this.renderDropdownMenu()}
          >
            <Toggle
              onClean={this.handleClean}
              cleanable={cleanable && !disabled}
              hasValue={!!selectedValues && !!selectedValues.length}
            >
              {placeholderText}
            </Toggle>
          </OverlayTrigger>
        </div>
      </IntlProvider>
    ) : (
      this.renderCheckTree()
    );
  }
}

Dropdown.propTypes = propTypes;

Dropdown.defaultProps = defaultProps;

export default Dropdown;
