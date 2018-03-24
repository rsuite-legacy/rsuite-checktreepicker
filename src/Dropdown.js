// @flow

import * as React from 'react';
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
import TreeCheckNode from './TreeCheckNode';
import defaultLocale from './locale/index';
import { CHECK_STATE } from './constants';

const { namespace } = constants;

type DefaultEvent = SyntheticEvent<*>;
type PlacementEighPoints =
  | 'bottomLeft'
  | 'bottomRight'
  | 'topLeft'
  | 'topRight'
  | 'leftTop'
  | 'rightTop'
  | 'leftBottom'
  | 'rightBottom';

type Props = {
  className?: string,
  height?: number,
  data: Array<any>,
  defaultValue?: Array<any>,
  value?: Array<any>,
  disabledItemValues?: Array<any>,
  // 禁用 checkbox 数组
  disabledCheckboxValues: Array<any>,
  valueKey?: string,
  labelKey?: string,
  childrenKey?: string,
  cascade: boolean,
  defaultExpandAll?: boolean,
  inline?: boolean,
  classPrefix?: string,
  disabled?: boolean,
  open?: boolean,
  defaultOpen?: boolean,
  locale: Object,
  placeholder?: React.Node,
  cleanable?: boolean,
  searchable?: boolean,
  onSearch?: (searchKeyword: string, event: DefaultEvent) => void,
  onOpen?: () => void,
  onClose?: () => void,
  onChange?: (values: any) => void,
  onExpand?: (activeNode: any, labyer: number) => void,
  onSelect?: (activeNode: any, layer: number, values: any) => void,
  onScroll?: (event: DefaultEvent) => void,
  renderTreeNode?: (nodeData: Object) => React.Node,
  renderTreeIcon?: (nodeData: Object) => React.Node,
  renderValue?: (
    values: Array<any>,
    checkItems: Array<any>,
    placeholder: string | React.Node,
  ) => React.Node,
  renderMenu?: (
    menu: string | React.Node,
  ) => React.Node,
  renderExtraFooter?: () => React.Node,
  placement?: PlacementEighPoints,
};

type State = {
  activeNode?: ?Object,
  formattedNodes: Array<any>,
  selectedValues: Array<any>,
  searchKeyword: string,
  data: Array<any>,
};
class Dropdown extends React.Component<Props, State> {
  static defaultProps = {
    classPrefix: `${namespace}-checktree`,
    inline: false,
    cascade: true,
    value: [],
    disabled: false,
    disabledItemValues: [],
    disabledCheckboxValues: [],
    expand: false,
    locale: defaultLocale,
    cleanable: true,
    searchable: true,
    valueKey: 'value',
    labelKey: 'label',
    childrenKey: 'children',
    placement: 'bottomLeft',
  };
  constructor(props: Props) {
    super(props);
    this.nodes = {};
    this.isControlled =
      'value' in props && 'onChange' in props && props.onChange;
    const { data } = props;
    const nextValue = this.getValue();
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
      activeNode: null,
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    const { searchKeyword } = this.state;
    const { value, data } = nextProps;
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

  getValue() {
    const { value, defaultValue } = this.props;
    if (value && value.length) {
      return value;
    }
    if (defaultValue && defaultValue.length > 0) {
      return defaultValue;
    }
    return [];
  }

  getNodeCheckState(node: Object, cascade: boolean) {
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

  getExpandState(node: Object) {
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

  getFilterData(searchKeyword: string = '', data: Array<any>) {
    const { labelKey } = this.props;
    const treeData = _.cloneDeep(data);
    const setVisible = (nodes = []) =>
      nodes.forEach((item: Object) => {
        item.visible = this.shouldDisplay(item[labelKey], searchKeyword);
        if (_.isArray(item.children)) {
          setVisible(item.children);
          item.children.forEach((child: Object) => {
            if (child.visible) {
              item.visible = child.visible;
            }
          });
        }
      });

    setVisible(treeData);
    return treeData;
  }

  getActiveElementOption(options: Array<any>, refKey: string) {
    for (let i = 0; i < options.length; i += 1) {
      if (options[i].refKey === refKey) {
        return options[i];
      } else if (options[i].children && options[i].children.length) {
        let active = this.getActiveElementOption(options[i].children, refKey);
        if (!_.isEmpty(active)) {
          return active;
        }
      }
    }
    return {};
  }

  getElementByDataKey = (dataKey: string) => {
    const ele = findDOMNode(this.nodeRefs[dataKey]);
    if (ele instanceof Element) {
      return ele.querySelector('.rs-picker-checktree-view-checknode-label');
    }
    return null;
  };

  setChildCheckState(parentNode: Object) {
    Object.keys(this.nodes).forEach((refKey: string) => {
      const node = this.nodes[refKey];
      if (
        'parentNode' in node &&
        _.isEqual(node.parentNode.value, parentNode.value)
      ) {
        this.nodes[refKey].check = true;
      }
    });
  }
  getFormattedNodes(nodes: Array<any>) {
    return nodes.map((node: Object) => {
      const formatted = { ...node };
      formatted.check = this.nodes[node.refKey].check;
      formatted.expand = this.nodes[node.refKey].expand;
      formatted.disabledCheckbox = this.nodes[node.refKey].disabledCheckbox;
      if (Array.isArray(node.children) && node.children.length > 0) {
        formatted.children = this.getFormattedNodes(formatted.children);
      }
      return formatted;
    });
  }

  setCheckState(nodes: Array<any>) {
    const { cascade } = this.props;
    nodes.forEach((node: Object) => {
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
  getDisabledState(node: Object) {
    const { disabledItemValues = [], valueKey } = this.props;
    return disabledItemValues.some((value: any) =>
      _.isEqual(this.nodes[node.refKey][valueKey], value),
    );
  }

  /**
   * 获取每个节点的是否需要 disabled checkbox
   * @param {*} node
   */
  getDisabledCheckboxState(node: Object) {
    const { disabledCheckboxValues = [], valueKey } = this.props;
    return disabledCheckboxValues.some((value: any) =>
      _.isEqual(node[valueKey], value),
    );
  }

  getFocusableMenuItems = () => {
    const { data } = this.state;
    const { childrenKey } = this.props;

    let items = [];
    const loop = (treeNodes: Array<any>) => {
      treeNodes.forEach((node: Object) => {
        if (
          !this.getDisabledState(node) &&
          !this.getDisabledCheckboxState(node) &&
          node.visible
        ) {
          items.push(node);
          const nodeData = { ...node, ...this.nodes[node.refKey] };
          if (!this.getExpandState(nodeData)) {
            return;
          }
          if (node[childrenKey]) {
            loop(node[childrenKey]);
          }
        }
      });
    };

    loop(data);
    return items;
  };

  getItemsAndActiveIndex() {
    const items = this.getFocusableMenuItems();

    let activeIndex = -1;
    items.forEach((item, index) => {
      if (document.activeElement !== null) {
        if (item.refKey === document.activeElement.getAttribute('data-key')) {
          activeIndex = index;
        }
      }
    });
    return { items, activeIndex };
  }

  getActiveItem() {
    const { data } = this.props;
    const activeItem = document.activeElement;
    if (activeItem !== null) {
      const { key, layer } = activeItem.dataset;
      const nodeData: Object = this.getActiveElementOption(data, key);
      nodeData.check = !this.nodes[nodeData.refKey].check;
      return {
        nodeData,
        layer,
      };
    }
    return {};
  }

  shouldDisplay(label: any, searchKeyword: string) {
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

  isEveryChildChecked(node: Object) {
    return node.children.every((child: Object) => {
      if (child.children) {
        return this.isEveryChildChecked(child);
      }
      return child.check;
    });
  }

  isSomeChildChecked(node: Object) {
    return node.children.some((child: Object) => {
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
  flattenNodes(nodes: Array<any>, ref?: string = '0', parentNode?: Object) {
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
        disabledCheckbox: this.getDisabledCheckboxState(node),
      };
      if (parentNode) {
        this.nodes[refKey].parentNode = parentNode;
      }
      this.flattenNodes(node[childrenKey], refKey, this.nodes[refKey]);
    });
  }

  serializeList(key: string) {
    const { valueKey } = this.props;
    const list = [];

    Object.keys(this.nodes).forEach((refKey: string) => {
      if (this.nodes[refKey][key]) {
        list.push(this.nodes[refKey][valueKey]);
      }
    });
    return list;
  }

  unserializeLists(lists: Object) {
    const { valueKey, cascade } = this.props;
    // Reset values to false
    Object.keys(this.nodes).forEach((refKey: string) => {
      Object.keys(lists).forEach((listKey: string) => {
        const node = this.nodes[refKey];
        if (cascade && 'parentNode' in node) {
          node[listKey] = node.parentNode[listKey];
        } else {
          node[listKey] = false;
        }
        lists[listKey].forEach((value: any) => {
          if (_.isEqual(this.nodes[refKey][valueKey], value)) {
            this.nodes[refKey][listKey] = true;
          }
        });
      });
    });
  }

  isControlled = null;

  nodes = {};

  treeView = null;

  trigger = null;

  container = null;

  nodeRefs = {};

  selectActiveItem = () => {
    const { nodeData, layer } = this.getActiveItem();
    this.handleSelect(nodeData, +layer);
  };

  focusNextItem() {
    const { items, activeIndex } = this.getItemsAndActiveIndex();
    if (items.length === 0) {
      return;
    }
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    const node = this.getElementByDataKey(items[nextIndex].refKey);
    if (node !== null) {
      node.focus();
    }
  }

  focusPreviousItem() {
    const { items, activeIndex } = this.getItemsAndActiveIndex();
    if (items.length === 0) {
      return;
    }
    let prevIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    prevIndex = prevIndex >= 0 ? prevIndex : 0;
    const node = this.getElementByDataKey(items[prevIndex].refKey);
    if (node !== null) {
      node.focus();
    }
  }

  toggleChecked(node: Object, isChecked: boolean, cascade: boolean) {
    const { childrenKey } = this.props;
    if (!node[childrenKey] || !node[childrenKey].length || !cascade) {
      this.toggleNode('check', node, isChecked);
    } else {
      this.toggleNode('check', node, isChecked);
      node.children.forEach((child: Object) => {
        this.toggleChecked(child, isChecked, cascade);
      });
    }
  }

  toggleNode(key: string, node: Object, toggleValue: boolean) {
    // 如果该节点处于 disabledChecbox，则忽略该值
    if (!node.disabledCheckbox) {
      this.nodes[node.refKey][key] = toggleValue;
    }
  }

  toggleExpand(node: Object, isExpand: boolean) {
    this.nodes[node.refKey].expand = isExpand;
  }

  addPrefix = (name: string) => prefix(this.props.classPrefix)(name);

  /**
   * 选择某个节点后的回调函数
   * @param {object} activeNodeData   节点的数据
   * @param {number} layer            节点的层级
   */
  handleSelect = (activeNode: Object, layer: number) => {
    const { data } = this.state;
    const { onChange, onSelect, cascade } = this.props;
    this.toggleChecked(activeNode, activeNode.check, cascade);
    // const formattedNodes = this.getFormattedNodes(data);

    // if (cascade) {
    //   this.setCheckState(formattedNodes);
    // }

    const selectedValues = this.serializeList('check');

    if (this.isControlled) {
      this.setState({
        activeNode,
      });
      onChange && onChange(selectedValues);
      onSelect && onSelect(activeNode, layer, selectedValues);
    } else {
      this.setState(
        {
          activeNode,
          // formattedNodes,
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
  handleToggle = (nodeData: Object, layer: number) => {
    const { classPrefix = '', onExpand } = this.props;
    const openClass = `${classPrefix}-view-open`;
    toggleClass(findDOMNode(this.nodeRefs[nodeData.refKey]), openClass);
    nodeData.expand = hasClass(
      findDOMNode(this.nodeRefs[nodeData.refKey]),
      openClass,
    );
    this.toggleExpand(nodeData, nodeData.expand);
    onExpand && onExpand(nodeData, layer);
  };

  /**
   * 展开树节点后的回调函数
   */
  handleExpand = (activeNode: Object, layer: number) => {
    const { onExpand } = this.props;
    onExpand && onExpand(activeNode, layer);
  };

  /**
   * 处理键盘方向键移动
   */
  handleKeyDown = (event: SyntheticKeyboardEvent<*>) => {
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
        this.selectActiveItem();
        event.preventDefault();
        break;
      default:
    }
  };

  handleToggleKeyDown = (event: SyntheticKeyboardEvent<*>) => {
    if (!this.treeView) {
      return;
    }

    if (
      event.target.className === `${namespace}-toggle` ||
      event.target.className === `${namespace}-search-bar-input`
    ) {
      switch (event.keyCode) {
        // down
        case 40:
          this.focusNextItem();
          event.preventDefault();
          break;
        default:
      }
    }
  };

  handleSearch = (value: string, event: DefaultEvent) => {
    const { data, onSearch } = this.props;
    this.setState({
      searchKeyword: value,
      data: this.getFilterData(value, data),
    });

    onSearch && onSearch(value, event);
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
    const { locale, searchable, placement, renderExtraFooter, renderMenu } = this.props;
    const classes = classNames(
      this.addPrefix('menu'),
      `${namespace}-placement-${_.kebabCase(placement)}`,
    );
    const menu = this.renderCheckTree();
    return (
      <MenuWrapper className={classes}>
        {searchable ? (
          <SearchBar
            placeholder={locale.searchPlaceholder}
            key="searchBar"
            onChange={this.handleSearch}
            value={this.state.searchKeyword}
          />
        ) : null}
        {renderMenu ? renderMenu(menu) : menu}
        {renderExtraFooter && renderExtraFooter()}
      </MenuWrapper>
    );
  }

  renderNode(node: Object, index: number, layer: number, classPrefix: string) {
    const { activeNode } = this.state;
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
    const active = activeNode
      ? _.isEqual(activeNode[valueKey], node[valueKey])
      : false;
    const props = {
      value: node[valueKey],
      label: node[labelKey],
      nodeData: node,
      onTreeToggle: this.handleToggle,
      onRenderTreeNode: renderTreeNode,
      onRenderTreeIcon: renderTreeIcon,
      onSelect: this.handleSelect,
      active,
      hasChildren: !!children,
      disabled,
      disabledCheckbox: node.disabledCheckbox,
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
      const openClass = `${classPrefix}-open`;
      let childrenClass = classNames(`${classPrefix}-node-children`, {
        [openClass]:
          (defaultExpandAll || node.expand) && hasNotEmptyChildren,
      });

      let nodes = children || [];
      return (
        <div
          className={childrenClass}
          key={key}
          ref={ref => {
            this.nodeRefs[key] = ref;
          }}
        >
          <TreeCheckNode
            classPrefix={classPrefix}
            key={key}
            ref={ref => {
              this.nodeRefs[key] = ref;
            }}
            {...props}
          />
          <div className={`${classPrefix}-children`}>
            {nodes.map((child, i) =>
              this.renderNode(child, i, layer, classPrefix),
            )}
          </div>
        </div>
      );
    }

    return (
      <TreeCheckNode
        classPrefix={classPrefix}
        key={key}
        ref={ref => {
          this.nodeRefs[key] = ref;
        }}
        {...props}
      />
    );
  }

  renderCheckTree() {
    const { data } = this.state;
    const { onScroll } = this.props;
    // 树节点的层级
    let layer = 0;
    const { className, height } = this.props;
    const treeViewClass = classNames(this.addPrefix('view'), className, {});

    const formattedNodes = this.state.formattedNodes.length
      ? this.state.formattedNodes
      : this.getFormattedNodes(data);

    // if (cascade) {
    //   this.setCheckState(formattedNodes);
    // }

    const nodes = formattedNodes.map((node, index) =>
      this.renderNode(node, index, layer, treeViewClass),
    );
    const styles = {
      height,
    };
    const treeNodesClass = this.addPrefix('nodes');
    return (
      <div
        ref={ref => {
          this.treeView = ref;
        }}
        className={treeViewClass}
        style={styles}
        onScroll={onScroll}
        onKeyDown={this.handleKeyDown}
      >
        <div className={treeNodesClass}>{nodes}</div>
      </div>
    );
  }

  render() {
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

    let placeholderText = placeholder;
    if (selectedValues && selectedValues.length) {
      placeholderText = `${selectedValues.length} selected`;
    }
    if (renderValue && selectedValues && selectedValues.length) {
      const checkItems = [];
      Object.keys(this.nodes).map((refKey: string) => {
        const node = this.nodes[refKey];
        if (
          selectedValues.some((value: any) => _.isEqual(node[valueKey], value))
        ) {
          checkItems.push(node);
        }
      });
      placeholderText = renderValue(
        selectedValues,
        checkItems,
        placeholderText,
      );
    }
    const unhandled = getUnhandledProps(Dropdown, rest);

    return !inline ? (
      <IntlProvider locale={locale}>
        <div
          {...unhandled}
          onKeyDown={this.handleToggleKeyDown}
          className={classes}
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
              {placeholderText || <FormattedMessage id="placeholder" />}
            </Toggle>
          </OverlayTrigger>
        </div>
      </IntlProvider>
    ) : (
        this.renderCheckTree()
      );
  }
}

export default Dropdown;
