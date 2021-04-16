import React, { FunctionComponent } from 'react';
import { Linking, Platform, StyleSheet, View } from 'react-native';
import Markdown, { MarkdownIt } from 'react-native-markdown-display';
import getThemeVars from '../../../common/getThemeVars';

interface MessageTextProps {
  text?: string;
  isSelf: boolean;
}

const markdownItInstance = MarkdownIt({ typographer: true, linkify: true });

const MessageText: FunctionComponent<MessageTextProps> = ({ text, isSelf }) => {
  const { themeColorDark, backgroundColor2 } = getThemeVars();
  const textColor = isSelf ? '#FFF' : '#000';
  const codeBackgroundColor = isSelf ? themeColorDark : backgroundColor2;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const styles: StyleSheet.NamedStyles<any> = {
    // The main container
    body: {},

    // Headings
    heading1: {
      marginVertical: 10,
      flexDirection: 'row',
      fontSize: 32,
    },
    heading2: {
      marginVertical: 10,
      flexDirection: 'row',
      fontSize: 24,
    },
    heading3: {
      marginVertical: 10,
      flexDirection: 'row',
      fontSize: 18,
    },
    heading4: {
      marginVertical: 10,
      flexDirection: 'row',
      fontSize: 16,
    },
    heading5: {
      marginVertical: 10,
      flexDirection: 'row',
      fontSize: 13,
    },
    heading6: {
      marginVertical: 10,
      flexDirection: 'row',
      fontSize: 11,
    },

    // Horizontal Rule
    hr: {
      marginVertical: 10,
      backgroundColor: textColor,
      height: 1,
    },

    // Emphasis
    strong: {
      fontWeight: 'bold',
    },
    em: {
      fontStyle: 'italic',
    },
    s: {
      textDecorationLine: 'line-through',
    },

    // Blockquotes
    blockquote: {
      marginVertical: 10,
      backgroundColor: 'transparent',
      borderColor: textColor,
      borderLeftWidth: 4,
      marginLeft: 0,
      marginRight: 5,
      paddingHorizontal: 5,
    },

    // Lists
    bullet_list: {
      marginVertical: 10,
    },
    ordered_list: {
      marginVertical: 10,
    },
    list_item: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    // @pseudo class, does not have a unique render rule
    bullet_list_icon: {
      color: textColor,
      marginLeft: 10,
      marginRight: 10,
    },
    // @pseudo class, does not have a unique render rule
    bullet_list_content: {
      flex: 1,
    },
    // @pseudo class, does not have a unique render rule
    ordered_list_icon: {
      color: textColor,
      marginLeft: 10,
      marginRight: 10,
    },
    // @pseudo class, does not have a unique render rule
    ordered_list_content: {
      flex: 1,
    },

    // Code
    code_inline: {
      marginVertical: 10,
      borderWidth: 0,
      borderColor: 'transparent',
      backgroundColor: codeBackgroundColor,
      padding: 2,
      borderRadius: 4,
      color: textColor,
      ...Platform.select({
        ['ios']: {
          fontFamily: 'Courier',
        },
        ['android']: {
          fontFamily: 'monospace',
        },
        ['web']: {
          fontFamily: 'monospace',
        },
      }),
    },
    code_block: {
      marginVertical: 10,
      borderWidth: 0,
      borderColor: 'transparent',
      backgroundColor: codeBackgroundColor,
      padding: 10,
      borderRadius: 4,
      color: textColor,
      ...Platform.select({
        ['ios']: {
          fontFamily: 'Courier',
        },
        ['android']: {
          fontFamily: 'monospace',
        },
        ['web']: {
          fontFamily: 'monospace',
        },
      }),
    },
    fence: {
      marginVertical: 10,
      borderWidth: 0,
      borderColor: 'transparent',
      backgroundColor: codeBackgroundColor,
      padding: 10,
      borderRadius: 4,
      color: textColor,
      ...Platform.select({
        ['ios']: {
          fontFamily: 'Courier',
        },
        ['android']: {
          fontFamily: 'monospace',
        },
        ['web']: {
          fontFamily: 'monospace',
        },
      }),
    },

    // Tables
    table: {
      marginVertical: 10,
      borderWidth: 1,
      borderColor: textColor,
      borderRadius: 3,
    },
    thead: {},
    tbody: {},
    th: {
      flex: 1,
      padding: 5,
    },
    tr: {
      borderBottomWidth: 1,
      borderColor: textColor,
      flexDirection: 'row',
    },
    td: {
      flex: 1,
      padding: 5,
    },

    // Links
    link: {
      textDecorationLine: 'underline',
    },
    blocklink: {
      flex: 1,
      borderColor: textColor,
      borderBottomWidth: 1,
    },

    // Images
    image: {
      flex: 1,
    },

    // Text Output
    text: {
      color: textColor,
    },
    textgroup: {},
    paragraph: {
      marginTop: 10,
      marginBottom: 10,
      fontSize: 15,
      flexWrap: 'wrap',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      width: '100%',
    },
    hardbreak: {
      width: '100%',
      height: 1,
    },
    softbreak: {},

    // Believe these are never used but retained for completeness
    pre: {},
    inline: {},
    span: {},
  };

  return (
    <View style={{ marginVertical: -10 }}>
      <Markdown
        markdownit={markdownItInstance}
        style={styles}
        onLinkPress={(url) => {
          Platform.OS !== 'web'
            ? Linking.openURL(url)
            : window.open(url, '_blank');
          return false;
        }}
      >
        {text}
      </Markdown>
    </View>
  );
};

export default MessageText;

/// color: props.position === 'left' ? '#000' : '#FFF'
