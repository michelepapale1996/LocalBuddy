import ChooseCity from "../screens/ChooseCity"
import renderer from 'react-test-renderer';
import React from 'react';

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
    const tree = renderer.create(<ChooseCity/>).toJSON();
    expect(tree).toMatchSnapshot();

    const searchbarComponent = findById(tree, "searchbar")
    expect(searchbarComponent.props.placeholder).toBe("Search a city...")

    const chooseCityInstance = renderer.create(<ChooseCity/>).getInstance()
    expect(chooseCityInstance.state.initialCities.length).toBe(6)
});