import { useLanguage } from '../lib/languageContext'
import { t } from '../lib/translations'

function Footer() {
    const { language } = useLanguage()

    return (
        <footer className="py-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-gray-400">
            {t('footer', 'text', language)}
          </p>
        </div>
      </footer>
    );
}

export default Footer