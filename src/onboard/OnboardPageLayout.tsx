import React, { FunctionComponent, ReactElement } from 'react';
import { Text, Layout } from '@ui-kitten/components';
import { View } from 'react-native';
import { themeColor } from '../common/const';
import { ScrollView } from 'react-native-gesture-handler';

interface Props {
  title: string;
  middleContent: ReactElement;
  bottomContent?: ReactElement;
}

const OnboardPageLayout: FunctionComponent<Props> = ({
  title,
  middleContent,
  bottomContent,
}) => (
  <Layout
    style={{
      padding: 16,
      flex: 1,
      alignItems: 'center',
      width: '100%',
    }}
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
      <View>{middleContent}</View>
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
