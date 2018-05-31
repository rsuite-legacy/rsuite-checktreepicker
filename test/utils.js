import { constants } from 'rsuite-utils/lib/Picker';

export const delay = timeout =>
  new Promise(resolve => setTimeout(resolve, timeout));

export default delay;
const { namespace } = constants; // .rs-picker

export const classPrefix = `${namespace}-checktree`;
export const treeViewCls = `${classPrefix}-view`;
export const treeNodeCheckedCls = `${treeViewCls}-node-checked`;
export const nodeChildrenOpenCls = `${treeViewCls}-open`;
export const expandIconWrapperCls = `${treeViewCls}-node-expand-icon-wrapper`;
export const expandIconCls = `${treeViewCls}-node-expand-icon`;
export const placeholderClass = `.${namespace}-toggle-placeholder`;
export const toggleClass = `.${namespace}-toggle`;
export const customToggleClass = `.${namespace}-toggle-custom`;
