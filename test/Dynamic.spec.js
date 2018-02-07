
import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { shallow, mount, render } from 'enzyme';
import { constants } from 'rsuite-utils/lib/Picker';
import Picker from '../src';
import treeData from '../docs/data/treeData';
import { delay } from './utils';

const { namespace } = constants;
const newTreeData = [{
  value: 'children1',
  label: 'children1'
}];

function setTreeData(child, activeNode, layer, treeNodes) {
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
  return treeNodes;
}

const mockOnExpand = jest.fn().mockImplementation(activeNode => activeNode);
const mockOnChange = jest.fn().mockImplementation(value => value);
const mockOnSelect = jest.fn().mockImplementation(activeNode => activeNode);

const setup = () => {
  const props = {
    data: treeData,
    value: ['Dave'],
    defaultExpandAll: true,
    onExpand: mockOnExpand,
    onChange: mockOnChange,
    onSelect: mockOnSelect
  };

  const wrapper = shallow(<Picker {...props} />);
  const fullRender = mount(<Picker {...props} />);
  const staticRender = render(<Picker {...props} />);
  return {
    wrapper,
    fullRender,
    staticRender,
  };
};

describe('ChectTree test suite', () => {
  const { fullRender } = setup();
  it('newData should be load after 2s', async () => {
    fullRender.find(`.${namespace}-toggle`).simulate('click');
    document.querySelector('div[data-key="0-4"] > .expand-icon-wrapper > .expand-icon').click();
    const activeNode = mockOnExpand.mock.calls[0][0];
    const layer = mockOnExpand.mock.calls[0][1];
    const nextTreeData = cloneDeep(treeData);
    setTreeData(newTreeData, activeNode, layer, nextTreeData);

    fullRender.setProps({
      data: nextTreeData
    });

    await delay(3000);
    expect(fullRender.exists('div[data-key="0-4-0"]')).toBe(true);
  });
});
