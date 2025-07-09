import { useSelector } from 'react-redux';
import { LANGUAGES, DEFAULT_LANGUAGE } from '@/translations';

type LanguageKeys = keyof typeof LANGUAGES;
type TranslationKeys = keyof typeof LANGUAGES[LanguageKeys];

export default function useTrans() {
    const selectedLang = useSelector((state: any) => state.settings?.language) as LanguageKeys || DEFAULT_LANGUAGE;
    const strings = LANGUAGES[selectedLang] || LANGUAGES[DEFAULT_LANGUAGE];

    return (key: TranslationKeys): string => strings[key] || key;
}
