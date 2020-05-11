import React from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    Image,
} from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger} from "react-native-popup-menu";

const DropDownMenu = props => {
    let deleteOption = null
    let editOption = null
    if (props.owner) {
        deleteOption =  <MenuOption onSelect={props.onDel} value="Delete" customStyles={menuOptionStyle}>
                            <Text>Delete</Text>
                        </MenuOption>
        editOption =    <MenuOption value="Edit" onSelect={() => props.toggleEdit()} customStyles={menuOptionStyle}>
                            <Text>Edit Post</Text>
                        </MenuOption>
    }

    return (
        <Menu>
            <MenuTrigger>
                <View style={styles.menuTouchable}>
                    <Image style={styles.menuImage} source={require('../assets/menu.png')}/>
                </View>
            </MenuTrigger>

            <MenuOptions>
                {editOption}
                {deleteOption}
                <MenuOption value="Report" onSelect={() => props.copyText()} customStyles={menuOptionStyle}>
                    <Text>Copy Text</Text>
                </MenuOption>
                <MenuOption value="Copy" customStyles={menuOptionStyle}>
                    <Text>Report</Text>
                </MenuOption>
            </MenuOptions>
        </Menu>
    );
};

const styles = StyleSheet.create({
    menuTouchable: {
        width: 75,
        height: 20,
        alignItems: "center"
    },
    menuImage: {
        marginTop: 5,
        width: 12,
        height: 12
    },
});

const menuOptionStyle = {
    optionWrapper: {
        padding: 5
    }
}

export default DropDownMenu;