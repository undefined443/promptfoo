import { setupI18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { messages } from '../../../locales/zh-CN.po';
import EmptyState from './EmptyState';

describe('EmptyState localization', () => {
  it.each([
    ['en', 'Welcome to Promptfoo', 'Create Eval'],
    ['zh-CN', '欢迎使用 Promptfoo', '创建评测'],
  ])('renders %s messages', (locale, title, button) => {
    const i18n = setupI18n({ locale, messages: { en: {}, 'zh-CN': messages } });
    render(
      <I18nProvider i18n={i18n}>
        <MemoryRouter>
          <EmptyState />
        </MemoryRouter>
      </I18nProvider>,
    );
    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: button })).toBeInTheDocument();
  });
});
