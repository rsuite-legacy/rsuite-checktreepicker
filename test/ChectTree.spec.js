import React from 'react';
import { shallow, render, mount } from 'enzyme';
import Picker from '../src/index';
import treeData from '../docs/data/treeData';
import { delay } from './utils';

const mockOnExpand = jest.fn().mockImplementation(activeNode => activeNode);
const mockOnSelect = jest.fn().mockImplementation(activeNode => activeNode);
const mockOnChange = jest.fn().mockImplementation(values => values);


const setup = () => {
  const props = {
    defaultExpandAll: true,
    cascade: true,
    data: treeData,
    height: 400,
    value: ['Maya'],
    onExpand: mockOnExpand,
    onSelect: mockOnSelect,
    onChange: mockOnChange
  };

  const wrapper = shallow(<Picker {...props} />);
  const staticRender = render(<Picker {...props} />);
  const fullRender = mount(<Picker {...props} />);
  return {
    wrapper,
    staticRender,
    fullRender
  };
};

describe('ChectTree test suite', () => {
  const { staticRender, fullRender } = setup();
  // test select node`
  it('test toggle click Dave node', async () => {
    fullRender.find('.rsuite-checktreepicker-toggle').simulate('click');
    expect(fullRender.find('.tree-node.checked').length).toBe(12);

    fullRender.find('div[data-key="0-0-1-1"]').simulate('click');
    fullRender.setProps({
      value: mockOnChange.mock.calls[0][0]
    });
    expect(fullRender.find('.tree-view').render().find('.tree-node.checked').length).toBe(0);
  });

  // test expand node
  it('test expand node', async () => {
    expect(fullRender.exists('.open > div[data-key="0-0-1-1"]')).toBe(true);

    fullRender.find('div[data-key="0-0-1-1"] > .expand-icon-wrapper > .expand-icon').simulate('click');
    expect(fullRender.find('.tree-view').render().find('.open > div[data-key="0-0-1-1"]').length).toBe(0);

    fullRender.find('div[data-key="0-0-1-1"] > .expand-icon-wrapper > .expand-icon').simulate('click');
    expect(fullRender.find('.tree-view').render().find('.open > div[data-key="0-0-1-1"]').length).toBe(1);
  });

});
