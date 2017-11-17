
import React from 'react';
import { shallow, mount, render } from 'enzyme';
import Picker from '../src';
import treeData from '../docs/data/treeData';
import { delay } from './utils';

const setup = () => {
  const props = {
    data: treeData,
  };

  const wrapper = shallow(<Picker {...props} />);
  const fullRender = mount(<Picker {...props} />);
  const staticRender = render(<Picker {...props} />);
  return {
    wrapper,
    fullRender,
    staticRender
  };
};

describe('rsutie-checktrepicker test suite', () => {
  const { wrapper, fullRender, staticRender } = setup();

  it('picker should be render, there are class rsuite-checktreepicker-dropdown', () => {
    expect(wrapper.find('.rsuite-checktreepicker-dropdown').length).toBe(1);
  });

  it('Picker placeholder text should be Please Select', () => {
    const text = staticRender.find('.placeholder-text > span').text();
    expect(text).toBe('Please Select');
  });

  it('Picker placeholder text should be 20 Selected when props.value = "["Master", "Maya"]"', async () => {
    const didMount = jest.fn().mockImplementation(values => values);
    const props = {
      data: treeData,
      value: ['Master', 'Maya'],
      didMount
    };
    const picker = mount(<Picker {...props} />);
    expect(didMount.mock.calls[0][0].length).toBe(20);
  });


  it('when dropdown clicked, CheckTree Component should be render', () => {
    fullRender.find('.rsuite-checktreepicker-toggle').simulate('click');
    expect(fullRender.find('.rsuite-checktreepicker-dropdown.expand').length).toBe(1);
  });


  it('when click document, Tree Component should be hide', () => {
    expect(fullRender.find('.rsuite-checktreepicker-dropdown.expand').length).toBe(1);
    document.querySelector('body').click();
    expect(fullRender.find('.expand').length).toBe(0);
  });

  it('when input  test word, the tree should be filter 20 nodes  ', () => {
    fullRender.find('.rsuite-checktreepicker-toggle').simulate('click');
    const value = {
      target: {
        value: 'test'
      }
    };
    fullRender.find('.search-bar-input').simulate('change', value);
    expect(fullRender.find('.tree-node').length).toBe(14);

    fullRender.find('.search-bar-input').simulate('change', {
      target: {
        value: ''
      }
    });
    expect(fullRender.find('.tree-node').length).toBe(31);
  });

  it('when disabled is true, Dropdown should be disabled. And exists class `.disabled`', () => {
    const props = {
      data: treeData,
      value: ['Master'],
      disabled: true
    };
    const picker = mount(<Picker {...props} />);
    expect(picker.find('.rsuite-checktreepicker-dropdown.disabled').length).toBe(1);
  });

  it('when dropup is true, Dropdown exists class `.dropdown.menu-dropup`', () => {
    const props = {
      data: treeData,
      value: ['Master'],
      dropup: true
    };
    const picker = mount(<Picker {...props} />);
    expect(picker.find('.dropdown.menu-dropup').length).toBe(1);
  });
});

