import Settings from "../screens/Settings"
import renderer from 'react-test-renderer';
import React from 'react';

jest.mock('./../ip', () => ({
    __esModule: true, // this property makes it work
    default: 'https://localbuddy-backend.herokuapp.com'
}));

import IP_ADDRESS from './../ip';


let findById = function(tree, testID) {
    if(tree.props && tree.props.testID === testID) {
        return tree
    }
    if(tree.children && tree.children.length > 0)
    {
        let childs = tree.children
        for(let i = 0; i < childs.length; i++)
        {
            let item = findById(childs[i], testID)
            if(typeof(item) !== 'undefined') {
                return item
            }
        }
    }
}


test('renders correctly at the beginning', () => {
    const tree = renderer.create(<Settings/>).toJSON();
    expect(tree).toMatchSnapshot();
});