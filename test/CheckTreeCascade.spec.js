import React from 'react';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import CheckTree from '../src/index';
import treeData from '../docs/data/treeData';
import { treeNodeCheckedCls } from './utils';

Enzyme.configure({ adapter: new Adapter() });

const setup = () => {
  const state = {
    activeNode: {},
  };
  const mockFn = {
    onExpand: activeNode => {
      return activeNode;
    },
  };

  const props = {
    defaultExpandAll: true,
    cascade: true,
    data: treeData,
    inline: true,
    height: 400,
    defaultValue: ['Maya'],
    onExpand: mockFn.onExpand,
  };

  const wrapper = shallow(<CheckTree {...props} />);
  const staticRender = render(<CheckTree {...props} />);
  const fullRender = mount(<CheckTree {...props} />);
  return {
    mockFn,
    state,
    wrapper,
    staticRender,
    fullRender,
  };
};

describe('ChectTree test suite', () => {
  const { staticRender, fullRender } = setup();

  // test active node
  it('Node Maya and all children nodes should be active', () => {
    expect(staticRender.find(`.${treeNodeCheckedCls}`).length).toBe(12);
  });

  // test select node`
  it('test toggle click Dave node', () => {
    fullRender.find('span[data-key="0-0-1-1"]').simulate('click');
    expect(fullRender.find(`.${treeNodeCheckedCls}`).length).toBe(0);

    fullRender.find('span[data-key="0-0-1-1"]').simulate('click');
    expect(fullRender.find(`.${treeNodeCheckedCls}`).length).toBe(12);
  });
});
