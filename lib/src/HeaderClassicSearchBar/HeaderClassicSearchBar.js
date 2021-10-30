import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { Image } from "native-base";
import styles, {
  shadowStyle,
  container,
  searchboxContainer
} from "../HeaderClassicSearchBar/HeaderClassicSearchBar.style";
import Androw from "react-native-androw";
import SearchBox from "../components/SearchBox/SearchBox";
import SearchBox2 from "../components/SearchBox/SearchBox2";
import Ripple from "react-native-material-ripple";
import { useSafeArea } from "react-native-safe-area-context";

const HeaderClassicSearchBar = props => {
  const { shadowColor, backgroundColor, iconActiveColor, iconInactiveColor, onPress, switchValue, iconBool } = props;
  const insets = useSafeArea();
  return (
    <Androw
    //style={shadowStyle(shadowColor)}
    >
      <View style={container(backgroundColor, insets)}>
        {iconBool &&
          <View style={searchboxContainer(insets)}>
            <SearchBox searchBoxWidth="80%" {...props} />
            <Ripple
              rippleColor="gray"
              style={styles.rippleContainer}
              rippleContainerBorderRadius={100}
              onPress={onPress}
              {...props}
            >
              <Image
                resizeMode="contain"
                source={require('../../../images/home-icon/scooter.png')}
                alt="Alternate Text"
                size="28px"
                style={{ tintColor: switchValue ? iconActiveColor : iconInactiveColor }}
              />
            </Ripple>
          </View>
        }
        {!iconBool && <View style={searchboxContainer(insets)}>
          <SearchBox2 searchBoxWidth="90%" {...props} />
        </View>
        }
      </View>
    </Androw>
  );
};

HeaderClassicSearchBar.propTypes = {
  shadowColor: PropTypes.string,
  backgroundColor: PropTypes.string
};

HeaderClassicSearchBar.defaultProps = {
  shadowColor: "#000",
  backgroundColor: "#fff"
};

export default HeaderClassicSearchBar;
