import { getChildren } from './helpers';

describe('getChildren', () => {
  it('returns children for an element with children', () => {
    // Set up a parent element with two child divs
    const parent = document.createElement('div');
    parent.innerHTML = '<div>Child 1</div><div>Child 2</div>';
    
    const children = getChildren(parent);
    
    // Check that the function returns an array of children
    expect(children.length).toBe(2);
    expect(children[0].innerHTML).toBe('Child 1');
    expect(children[1].innerHTML).toBe('Child 2');
  });

  it('returns an empty array for an element with no children', () => {
    const parent = document.createElement('div'); // No children are added
    
    const children = getChildren(parent);
    
    // Check that the function returns an empty array
    expect(children).toHaveLength(0);
  });

  it('returns an empty array when the element is null', () => {
    const children = getChildren(null);
    
    // Check that the function returns an empty array
    expect(children).toHaveLength(0);
  });

  it('returns an empty array when the element is undefined', () => {
    const children = getChildren(undefined);
    
    // Check that the function returns an empty array
    expect(children).toHaveLength(0);
  });
});