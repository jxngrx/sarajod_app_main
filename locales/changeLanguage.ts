import i18n from './i18n';
import { useAppDispatch } from '@/store/hooks';
import { setLanguage } from '@/store/slices/settingSlice';

export const useLanguageSwitcher = () => {
    const dispatch = useAppDispatch();

    const switchToHinglish = () => {
        i18n.changeLanguage('hinglish');
        dispatch(setLanguage('hinglish'));
    };

    const switchToEnglish = () => {
        i18n.changeLanguage('en');
        dispatch(setLanguage('en'));
    };

    return { switchToHinglish, switchToEnglish };
};
