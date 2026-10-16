import { useTranslation } from 'react-i18next';

export function SettingsPage() {
	const { t } = useTranslation();

	return <h4>{t('pages.settings.title')}</h4>;
}
