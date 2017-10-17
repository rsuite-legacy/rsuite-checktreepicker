import isArray from 'lodash/isArray';
import cloneDeep from 'lodash/cloneDeep';

export default function filterNodesOfTree(data, check) {
  const treeData = cloneDeep(data);
  const findNodes = (nodes = []) => (
    nodes.filter((item) => {
      if (isArray(item.children)) {
        const nextChildren = findNodes(item.children);
        if (nextChildren.length) {
          item.children = nextChildren;
          return true;
        }
      }
      return check(item);
    })
  );
  return findNodes(treeData);
}
