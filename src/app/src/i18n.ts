import { i18n } from '@lingui/core';
import { messages as zhMessages } from './locales/zh-CN.po';

const locale = /^(zh-CN|zh-SG|zh-Hans)(-|$)/i.test(navigator.languages[0] || navigator.language)
  ? 'zh-CN'
  : 'en';

i18n.load('en', {});
i18n.load('zh-CN', zhMessages);
i18n.activate(locale);
document.documentElement.lang = locale;

export { i18n };
