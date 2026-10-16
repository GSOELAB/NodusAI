import { useTranslation } from 'react-i18next';

export function ChatPage() {
	const { t } = useTranslation();

	return <h4>{t('pages.chat.title')}</h4>;
}
