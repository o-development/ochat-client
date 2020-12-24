import React, { FunctionComponent } from 'react';
import {
  Image,
  ImageBackground,
  ImageStyle,
  StyleProp,
  StyleSheet,
  View,
} from 'react-native';

export interface GroupImageProps {
  images: string[];
  style?: StyleProp<ImageStyle>;
  width?: number;
}

const GroupImage: FunctionComponent<GroupImageProps> = ({
  images,
  style,
  width = 48,
}) => {
  const computedStyle: ImageStyle = StyleSheet.flatten([
    { width: width, height: width, overflow: 'hidden', flexDirection: 'row' },
    style,
  ]);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const background = require('../../../assets/default-user-image.png');

  const finalWidth: number =
    (typeof computedStyle.width === 'string'
      ? parseFloat(computedStyle.width)
      : computedStyle.width) || width;
  computedStyle.height = computedStyle.width;
  computedStyle.borderRadius = computedStyle.borderRadius || finalWidth / 2;

  const div = finalWidth / 2;
  const styles = StyleSheet.create({
    container: computedStyle,
    twoContainer: {
      width: div,
      overflow: 'hidden',
    },
    fourContainer: {
      width: div,
      height: div,
    },
  });

  const imageObjects = images.map((image) => ({
    uri: image,
  }));

  switch (images.length) {
    case 0:
      return <Image style={styles.container} source={background} />;
    case 1:
      return (
        <ImageBackground style={styles.container} source={background}>
          <Image style={{ width, height: width }} source={imageObjects[0]} />
        </ImageBackground>
      );
    case 2:
      return (
        <ImageBackground style={styles.container} source={background}>
          <View style={styles.twoContainer}>
            <Image
              style={{ marginRight: div / 2, left: 0, width, height: width }}
              source={imageObjects[0]}
            />
          </View>
          <View style={styles.twoContainer}>
            <Image
              style={{ marginLeft: div / 2, right: div, width, height: width }}
              source={imageObjects[1]}
            />
          </View>
        </ImageBackground>
      );
    case 3:
      return (
        <ImageBackground style={styles.container} source={background}>
          <View style={styles.twoContainer}>
            <Image
              style={{ marginRight: div / 2, left: 0, width, height: width }}
              source={imageObjects[0]}
            />
          </View>
          <View style={styles.twoContainer}>
            <Image style={styles.fourContainer} source={imageObjects[1]} />
            <Image style={styles.fourContainer} source={imageObjects[2]} />
          </View>
        </ImageBackground>
      );
    default:
      return (
        <ImageBackground style={styles.container} source={background}>
          <View>
            <Image style={styles.fourContainer} source={imageObjects[0]} />
            <Image style={styles.fourContainer} source={imageObjects[1]} />
          </View>
          <View>
            <Image style={styles.fourContainer} source={imageObjects[2]} />
            <Image style={styles.fourContainer} source={imageObjects[3]} />
          </View>
        </ImageBackground>
      );
  }
};

export default GroupImage;
