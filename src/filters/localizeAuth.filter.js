import ru from '../locales/ru.json'
import en from '../locales/en.json'
const locales = {
    'ru-RU': ru,
    'en-US': en
}

export default function localizeFilter(key, localeName) {
    const locale = localeName || 'ru-RU'
    return locales[locale][key] || `[Localize error]: key ${key} not found`
}