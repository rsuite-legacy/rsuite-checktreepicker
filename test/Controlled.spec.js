import React from 'react';
import { shallow, render, mount } from 'enzyme';
import CheckTree from '../src/index';
import treeData from '../docs/data/treeData';
import delay from './utils';

const mockOnExpand = jest.fn().mockImplementation(activeNode => activeNode);
const mockOnSelect = jest.fn().mockImplementation(activeNode => activeNode);
const mockOnChange = jest.fn().mockImplementation(values => values);

const setup = () => {
  const props = {
    defaultExpandAll: true,
    cascade: true,
    data: treeData,
    inline: true,
    height: 400,
    value: ['Maya'],
    onExpand: mockOnExpand,
    onSelect: mockOnSelect,
    onChange: mockOnChange
  };

  const wrapper = shallow(<CheckTree {...props} />);
  const staticRender = render(<CheckTree {...props} />);
  const fullRender = mount(<CheckTree {...props} />);
  return {
    wrapper,
    staticRender,
    fullRender
  };
};

describe('ChectTree test suite', () => {
  const { staticRender, fullRender } = setup();

  // test active node
  it('Node Maya and all children nodes should be active', () => {
    expect(staticRender.find('.tree-node.checked').length).toBe(12);
  });

  // test select node`
  it('test controlled tree', async () => {
    let values = [];
    fullRender.find('div[data-key="0-0-1-1"]').simulate('click');
    values = mockOnChange.mock.calls[0];
    fullRender.setState({
      value: values
    });

    await delay(500);
    expect(fullRender.find('.tree-node.checked').length).toBe(0);

    fullRender.find('div[data-key="0-0-1-1"]').simulate('click');
    values = mockOnChange.mock.calls[1];
    fullRender.setState({
      value: values
    });
    await delay(500);
    expect(fullRender.find('.tree-node.checked').length).toBe(12);
  });
});
