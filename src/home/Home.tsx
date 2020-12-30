import React, {
  Fragment,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Layout } from '@ui-kitten/components';
import { Image, View } from 'react-native';
import LoginSolid from './LoginSolid';

import { Dimensions } from 'react-native';
import { AuthContext } from '../auth/authReducer';
import { useHistory } from '../router';

const Home: FunctionComponent = () => {
  const isMobile = Dimensions.get('window').width < 800;

  const history = useHistory();
  const [authState] = useContext(AuthContext);
  const [isWaitingForAuth, setIsWaitingForAuth] = useState(true);
  useEffect(() => {
    if (authState.profile) {
      history.push('/chat');
    } else if (!authState.isLoading) {
      setIsWaitingForAuth(false);
    }
  });
  if (isWaitingForAuth) {
    return <Fragment />;
  }

  return (
    <Layout
      style={{
        flexDirection: isMobile ? 'column' : 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
      }}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={require('../../assets/splash.png')}
          style={{
            width: 564,
            height: 108,
            marginBottom: 25,
          }}
        />
        {!isMobile && (
          <View style={{ flexDirection: 'row' }}>
            <Image
              source={require('../../assets/download-on-the-app-store.png')}
              style={{ width: 150, height: 44, margin: 10 }}
            />
            <Image
              source={require('../../assets/google-play-badge.png')}
              style={{ width: 150, height: 44, margin: 10 }}
            />
          </View>
        )}
      </View>
      <LoginSolid />
    </Layout>
  );
};

export default Home;
