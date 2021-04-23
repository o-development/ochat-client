import React, { FunctionComponent, ReactElement } from 'react';
import { Text, Layout } from '@ui-kitten/components';
import { View, ViewStyle } from 'react-native';
import { themeColor } from '../common/const';

interface Props {
  title: string;
  middleContent: ReactElement;
  bottomContent?: ReactElement;
  style?: ViewStyle;
}

const OnboardPageLayout: FunctionComponent<Props> = ({
  title,
  middleContent,
  bottomContent,
  style,
}) => (
  <Layout
    style={[
      {
        padding: 16,
        flex: 1,
        alignItems: 'center',
        width: '100%',
      },
      style,
    ]}
  >
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        maxWidth: 500,
        width: '100%',
      }}
    >
      <Text category="h1" style={{ marginBottom: 16, color: themeColor }}>
        {title}
      </Text>
      {middleContent}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 8,
          flexWrap: 'wrap',
        }}
      >
        {bottomContent}
      </View>
    </View>
  </Layout>
);

export default OnboardPageLayout;
