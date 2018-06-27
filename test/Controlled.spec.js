import React from 'react';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import CheckTree from '../src/index';
import treeData from '../docs/data/treeData';
import {
  delay,
  treeNodeCls,
  placeholderClass,
  treeNodeCheckedCls,
  customToggleClass,
  nodeChildrenOpenCls
} from './utils';

Enzyme.configure({ adapter: new Adapter() });

const mockOnExpand = jest.fn().mockImplementation(activeNode => activeNode);
const mockOnSelect = jest.fn().mockImplementation(activeNode => activeNode);
const mockOnChange = jest.fn().mockImplementation(values => values);

const setup = () => {
  const props = {
    expandAll: true,
    cascade: true,
    data: treeData,
    inline: true,
    height: 400,
    value: ['Maya'],
    searchKeyword: '',
    onExpand: mockOnExpand,
    onSelect: mockOnSelect,
    onChange: mockOnChange,
  };

  const wrapper = shallow(<CheckTree {...props} />);
  const staticRender = render(<CheckTree {...props} />);
  const fullRender = mount(<CheckTree {...props} />);
  return {
    props,
    wrapper,
    staticRender,
    fullRender,
  };
};

describe('ChectTree test suite', () => {
  const { props, staticRender, fullRender } = setup();

  // test active node
  it('Node Maya and all children nodes should be active', () => {
    expect(staticRender.find(`.${treeNodeCheckedCls}`).length).toBe(12);
  });

  // test select node`
  it('test controlled tree', async () => {
    let values = [];
    fullRender.find('span[data-key="0-0-1-1"]').simulate('click');
    values = mockOnChange.mock.calls[0];
    fullRender.setState({
      value: values,
    });

    await delay(500);
    expect(fullRender.find(`.${treeNodeCheckedCls}`).length).toBe(0);

    fullRender.find('span[data-key="0-0-1-1"]').simulate('click');
    values = mockOnChange.mock.calls[1];
    fullRender.setState({
      value: values,
    });
    await delay(500);
    expect(fullRender.find(`.${treeNodeCheckedCls}`).length).toBe(12);
  });

  it('when searchKeyword changed, tree nodes should be changed', async () => {
    fullRender.setProps({
      searchKeyword: 'Kenya',
    });

    await delay(500);
    expect(fullRender.find(`.${treeNodeCls}`).length).toBe(2);

    fullRender.setProps({
      searchKeyword: '',
    });

    await delay(500);
    expect(fullRender.find(`.${treeNodeCls}`).length).toBe(31);
  });

  it('when expandAll changed, tree expand should be changed', async () => {
    fullRender.setProps({
      expandAll: false,
    });

    await delay(500);
    expect(fullRender.find(`.${nodeChildrenOpenCls}`).length).toBe(0);

    fullRender.setProps({
      expandAll: true,
    });

    await delay(500);
    expect(fullRender.find(`.${nodeChildrenOpenCls}`).length).toBe(14);
  });

  it('when value does not in data, Placeholder shoube `Please Select`', () => {
    const newProps = {
      data: treeData,
      value: ['errorValue'],
    };
    const text = render(<CheckTree {...newProps} />)
      .find(`${placeholderClass} > span`)
      .text();
    expect(text).toBe('Please Select');
  });

  it('when `toggleComponentClass` set to `button`, Toggle element type should be `bottuon`', () => {
    const newProps = {
      data: treeData,
      toggleComponentClass: 'button',
    };
    const text = render(<CheckTree {...newProps} />).find(
      `${customToggleClass}[role="button"]`,
    );
    expect(text.length).toBe(1);
  });
});
