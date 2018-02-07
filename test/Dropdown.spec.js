import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { constants } from 'rsuite-utils/lib/Picker';
import Picker from '../src';
import treeData from '../docs/data/treeData';
import { delay } from './utils';

const { namespace } = constants;

const classPrefix = `${namespace}-checktree`;
const pickerClass = `.${classPrefix}`;
const menuClass = `.${classPrefix}-menu`;
const placeholderClass = `.${namespace}-toggle-placeholder`;
const searchInputClass = `.${namespace}-search-bar-input`;
const disabledClass = `.${classPrefix}-disabled`;
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
    staticRender,
  };
};

describe('rsutie-checktrepicker test suite', () => {
  const { wrapper, fullRender, staticRender } = setup();

  it('picker should be render, there are class rs-picker-checktree', () => {
    expect(wrapper.find(pickerClass).length).toBe(1);
  });

  it('Picker placeholder text should be Please Select', () => {
    const text = staticRender.find(`${placeholderClass} > span`).text();
    expect(text).toBe('Please Select');
  });

  it('when dropdown clicked, CheckTree Component should be render', () => {
    fullRender.find(`.${namespace}-toggle`).simulate('click');
    expect(document.querySelectorAll(menuClass).length).toBe(1);
  });


  // it('when input  test word, the tree should be filter 20 nodes  ', () => {
  //   fullRender.find(`.${namespace}-toggle`).simulate('click');
  //   expect(document.querySelectorAll(menuClass).length).toBe(1);
  //   const value = {
  //     target: {
  //       value: 'test',
  //     },
  //   };
  //   // document.querySelector('.rs-picker-search-bar-input').addEventListener('change', value);
  //   // expect(document.querySelector('.tree-node').length).toBe(14);

  //   // fullRender.find(searchInputClass).simulate('change', {
  //   //   target: {
  //   //     value: '',
  //   //   },
  //   // });
  //   // expect(document.querySelector('.tree-node').length).toBe(31);
  // });

  it('when disabled is true, Dropdown should be disabled. And exists class `.disabled`', () => {
    const props = {
      data: treeData,
      value: ['Master'],
      disabled: true,
    };
    const picker = mount(<Picker {...props} />);
    expect(
      picker.find(disabledClass).length,
    ).toBe(1);
  });
});
