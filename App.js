import React, {useCallback, useEffect, useRef, useState} from 'react';

import ReactNativeBlobUtil from 'react-native-blob-util';
import PSPDFKitView from 'react-native-pspdfkit';
import * as RNFS from 'react-native-fs';

import {
  useWindowDimensions,
  SafeAreaView,
  StyleSheet,
  Text,
} from 'react-native';

const DOCUMENT = 'https://pspdfkit.com/downloads/pspdfkit-ios-quickstart-guide.pdf';

const App = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [source, setSource] = useState(null);
  const ref = useRef();

  const {width, height} = useWindowDimensions();

  const onStateChanged = useCallback(state => {
    console.log('onStateChanged', state);
    setPageIndex(state.currentPageIndex);
  }, []);

  const portrait = width < height;
  const pageMode = portrait ? 'single' : 'double';

  useEffect(() => {
    const file = `${RNFS.DocumentDirectoryPath}/test.pdf`;

    RNFS.stat(file)
      .catch(() => {
        console.log('downloading file');
        return ReactNativeBlobUtil.config({ path: file })
          .fetch('GET', DOCUMENT);
      })
      .then(() => {
        console.log('file downloaded');
        setSource(file);
      });

  }, []);

  console.log('source', source);

  return (
    <SafeAreaView style={styles.container}>
      <PSPDFKitView
        document={DOCUMENT}
        configuration={{
          thumbnailBarMode: 'scrollable',
          spreadFitting: 'fit',
          pageMode,
          scrollDirection: 'horizontal',
          firstPageAlwaysSingle: true,
        }}
        ref={ref}
        fragmentTag="PDF1"
        style={styles.pdf}
        onStateChanged={onStateChanged}
      />
      <Text style={styles.text}>pageIndex: {pageIndex}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    borderColor: 'blue',
    borderWidth: 1,
    flex: 1,
  },
  pdf: {
    borderColor: 'red',
    borderWidth: 1,
    flex: 1,
  },
  text: {
    backgroundColor: '#666',
    color: 'white',
    textAlign: 'center',
    fontSize: 24,
  },
});

export default App;
