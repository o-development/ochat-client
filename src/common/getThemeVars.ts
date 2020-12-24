import { ThemeContext } from '@ui-kitten/components/theme/theme/themeContext';
import { useContext } from 'react';

interface ThemeVars {
  themeColor: string;
  backgroundColor1: string;
  backgroundColor2: string;
  backgroundColor3: string;
  backgroundColor4: string;
  dividerColor: string;
  highlightColor: string;
  basicTextColor: string;
  hintTextColor: string;
}

export default function (): ThemeVars {
  const theme = useContext(ThemeContext);
  return {
    themeColor: theme['color-primary-400'],
    backgroundColor1: theme['background-basic-color-1'],
    backgroundColor2: theme['background-basic-color-2'],
    backgroundColor3: theme['background-basic-color-3'],
    backgroundColor4: theme['background-basic-color-4'],
    dividerColor: theme['border-basic-color-3'],
    highlightColor: theme['color-basic-transparent-300'],
    basicTextColor: theme['text-basic-color'],
    hintTextColor: theme['text-hint-color'],
  };
}
