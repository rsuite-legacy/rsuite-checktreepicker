import React from 'react';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import CheckTree from '../src/index';
import treeData from '../docs/data/treeData';
import {
  delay,
  treeNodeCheckedCls,
  customToggleClass,
  toggleClass,
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


  it('when value does not in data, Placeholder shoube `Select`', () => {
    const newProps = {
      data: treeData,
      value: ['errorValue'],
    };
    const text = render(<CheckTree {...newProps} />)
      .find(`${toggleClass} > span`)
      .text();
    expect(text).toBe('Select');
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
