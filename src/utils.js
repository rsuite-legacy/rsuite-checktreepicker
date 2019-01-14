import { findNodeOfTree } from 'rsuite-utils/lib/utils';

export function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

export function onMenuKeyDown(event, events) {
  const { down, up, enter, del, esc } = events;

  switch (event.keyCode) {
    // down
    case 40:
      down && down(event);
      event.preventDefault();
      break;
    // up
    case 38:
      up && up(event);
      event.preventDefault();
      break;
    // enter
    case 13:
      enter && enter(event);
      event.preventDefault();
      break;
    // delete
    case 8:
      del && del(event);
      break;
    // esc | tab
    case 27:
    case 9:
      esc && esc(event);
      event.preventDefault();
      break;
    default:
  }
}

export function createConcatChildrenFunction(node: any, nodeValue?: any) {
  return (data: any[], children: any[]): any[] => {
    if (nodeValue) {
      node = findNodeOfTree(data, item => nodeValue === item.value);
    }
    node.children = children;
    return data.concat([]);
  };
}
