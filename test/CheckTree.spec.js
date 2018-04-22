import React from 'react';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import CheckTree from '../src/index';
import treeData from '../docs/data/treeData';
import { treeViewCls, treeNodeCheckedCls } from './utils';

Enzyme.configure({ adapter: new Adapter() });

const setup = () => {
  const state = {
    activeNode: {},
  };
  const mockFn = {
    onExpand: activeNode => {
      // state.activeNode = activeNode;
      return activeNode;
    },
  };

  const props = {
    defaultExpandAll: true,
    cascade: false,
    data: treeData,
    inline: true,
    height: 400,
    defaultValue: ['Dave', 'Maya'],
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
  const { wrapper, staticRender, fullRender } = setup();
  /**
   * test tree render
   */
  it('CheckTree should be render', () => {
    expect(wrapper.find(`.${treeViewCls}`).length).toBe(1);
  });

  // test active node
  it('Node Dave and Maya should be active when cascade is false', () => {
    expect(staticRender.find(`.${treeNodeCheckedCls}`).length).toBe(2);
  });

  // test select node`
  it('test toggle click Maya node', () => {
    fullRender.find('span[data-key="0-0-1-0"]').simulate('click');
    expect(fullRender.find(`.${treeNodeCheckedCls}`).length).toBe(1);

    fullRender.find('span[data-key="0-0-1-0"]').simulate('click');
    expect(fullRender.find(`.${treeNodeCheckedCls}`).length).toBe(2);
  });

  // test expand node
  /* it('test expand node', async () => {
    // test node 折叠
    // fullRender
    //   .find(`div[data-ref="0-0-1-1"]  > .${expandIconCls}`)
    //   .simulate('click');
    // expect(
    console.log(
      fullRender
        .ref('0-0-1-1')
        .text()
        // .hasClass(`.${nodeChildrenOpenCls}`),
    );
    // .hasClass(`.${nodeChildrenOpenCls}`),
    // ).toBe(true);

    // 测试 node 展开情况
    // fullRender
    //   .find(`div[data-ref="0-0-1-1"]  > .${expandIconCls}`)
    //   .simulate('click');

    // expect(
    //   fullRender
    //     .find(`.${treeViewCls}`)
    //     .render()
    //     .find('div[data-ref="0-0-1-1"]')
    //     .parent()
    //     .find(`.${nodeChildrenOpenCls}`).length,
    // ).toBe(1);

    // fullRender
    //   .find(
    //     `div[data-ref="0-0-1-1"] > .${expandIconCls}`,
    //   )
    //   .simulate('click');
    // expect(
    //   fullRender
    //     .find(`.${treeViewCls}`)
    //     .render()
    //     .find(`.${nodeChildrenOpenCls} > span[data-key="0-0-1-1"]`).length,
    // ).toBe(1);
  }); */

  // test keyup event
  it('key-up shoule be work', () => {
    const mockEvent = {
      keyCode: 38,
    };

    fullRender.find('span[data-key="0-0-1-1"]').simulate('click');
    expect(
      fullRender.find('span[data-key="0-0-1-1"]').getElement() ===
        document.activeElement,
    );

    fullRender.find('span[data-key="0-0-1-1"]').simulate('keydown', mockEvent);
    expect(
      fullRender.find('span[data-key="0-0-1-0"]').getElement() ===
        document.activeElement,
    );
  });

  // test keydown event
  it('key-down shoule be work', () => {
    const downEvent = {
      keyCode: 40,
    };

    const upEvent = {
      keyCode: 38,
    };
    const enterEvent = {
      keyCode: 13,
    };

    fullRender.find('span[data-key="0-0-1-1"]').simulate('click');
    expect(
      fullRender.find('span[data-key="0-0-1-1"]').getElement() ===
        document.activeElement,
    );

    fullRender.find('span[data-key="0-0-1-1"]').simulate('keydown', downEvent);
    expect(
      fullRender.find('span[data-key="0-0-1-1-0"]').getElement() ===
        document.activeElement,
    );

    fullRender.find('span[data-key="0-0-1-1"]').simulate('keydown', upEvent);
    expect(
      fullRender.find('span[data-key="0-0-1-1"]').getElement() ===
        document.activeElement,
    );
  });
});
