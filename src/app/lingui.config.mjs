import { formatter } from '@lingui/format-po';

export default {
  locales: ['en', 'zh-CN'],
  sourceLocale: 'en',
  catalogs: [{ path: '<rootDir>/src/locales/{locale}', include: ['src'] }],
  format: formatter(),
};
