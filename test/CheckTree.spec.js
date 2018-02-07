import React from 'react';
import { shallow, render, mount } from 'enzyme';
import CheckTree from '../src/index';
import treeData from '../docs/data/treeData';

// const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));

const setup = () => {
  const state = {
    activeNode: {}
  };
  const mockFn = {
    onExpand: (activeNode) => {
      // state.activeNode = activeNode;
      return activeNode;
    }
  };

  const props = {
    defaultExpandAll: true,
    cascade: false,
    data: treeData,
    inline: true,
    height: 400,
    defaultValue: ['Dave', 'Maya'],
    onExpand: mockFn.onExpand
  };

  const wrapper = shallow(<CheckTree {...props} />);
  const staticRender = render(<CheckTree {...props} />);
  const fullRender = mount(<CheckTree {...props} />);
  return {
    mockFn,
    state,
    wrapper,
    staticRender,
    fullRender
  };
};

describe('ChectTree test suite', () => {
  const { wrapper, staticRender, fullRender } = setup();
  /**
   * test tree render
   */
  it('CheckTree should be render', () => {
    expect(wrapper.find('.rs-picker-checktree-view').length).toBe(1);
  });

  // test active node
  it('Node Dave and Maya should be active when cascade is false', () => {
    expect(staticRender.find('.tree-node.checked').length).toBe(2);
  });

  // test select node`
  it('test toggle click Dave node', () => {
    fullRender.find('div[data-key="0-0-1-0"]').simulate('click');
    expect(fullRender.find('.tree-node.checked').length).toBe(1);

    fullRender.find('div[data-key="0-0-1-0"]').simulate('click');
    expect(fullRender.find('.tree-node.checked').length).toBe(2);
  });

  // test expand node
  it('test expand node', async () => {
    expect(fullRender.exists('.open > div[data-key="0-0-1-1"]')).toBe(true);

    fullRender.find('div[data-key="0-0-1-1"] > .expand-icon-wrapper > .expand-icon').simulate('click');
    expect(fullRender.find('.rs-picker-checktree-view').render().find('.open > div[data-key="0-0-1-1"]').length).toBe(0);

    fullRender.find('div[data-key="0-0-1-1"] > .expand-icon-wrapper > .expand-icon').simulate('click');
    expect(fullRender.find('.rs-picker-checktree-view').render().find('.open > div[data-key="0-0-1-1"]').length).toBe(1);
  });

  // test keyup event
  it('key-up shoule be work', () => {
    const mockEvent = {
      keyCode: 38
    };

    fullRender.find('div[data-key="0-0-1-1"]').simulate('click');
    expect(fullRender.find('div[data-key="0-0-1-1"]').node === document.activeElement);

    fullRender.find('div[data-key="0-0-1-1"]').simulate('keydown', mockEvent);
    expect(fullRender.find('div[data-key="0-0-1-0"]').node === document.activeElement);
  });

  // test keydown event
  it('key-down shoule be work', () => {
    const downEvent = {
      keyCode: 40
    };

    const upEvent = {
      keyCode: 38
    };
    const enterEvent = {
      keyCode: 13
    };

    fullRender.find('div[data-key="0-0-1-1"]').simulate('click');
    expect(fullRender.find('div[data-key="0-0-1-1"]').node === document.activeElement);

    fullRender.find('div[data-key="0-0-1-1"]').simulate('keydown', downEvent);
    expect(fullRender.find('div[data-key="0-0-1-1-0"]').node === document.activeElement);

    fullRender.find('div[data-key="0-0-1-1"]').simulate('keydown', upEvent);
    expect(fullRender.find('div[data-key="0-0-1-1"]').node === document.activeElement);

  });

});
