import type { Preview } from "@storybook/nextjs-vite";
import { NextIntlClientProvider } from "next-intl";

import "../src/app/globals.css";
import messages from "../messages/ko.json";
import { DEFAULT_LOCALE } from "../src/i18n/config";

const STORYBOOK_NOW = new Date("2026-08-28T00:00:00.000Z");

const preview: Preview = {
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale={DEFAULT_LOCALE} messages={messages} now={STORYBOOK_NOW}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          "Foundations",
          ["Colors", "Typography", "Icons", "Layout"],
          "Layout",
          "Navigation",
          "UI",
          "Overlay",
          "Domain",
          "Feedback",
        ],
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
