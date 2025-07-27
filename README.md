# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

# Sentry Error Monitoring Setup

This project uses [Sentry](https://sentry.io/) for error and performance monitoring.

## Setup

1. **Install dependencies**
   ```bash
   npm install @sentry/react @sentry/tracing
   ```
2. **Configure DSN**
   - Add your Sentry DSN to your environment variables (e.g., `.env`):
     ```env
     ```
   - The DSN is also hardcoded as a fallback in `src/main.tsx` for convenience.
3. **Initialization**
   - Sentry is initialized in `src/main.tsx` using environment variables for DSN, environment, and release version.

## Verification
- To verify Sentry is working, trigger an error in the app and check the Sentry dashboard for the event.
- Example:
  ```js
  // Add this in a component to test
  throw new Error('Test Sentry error');
  ```

## References
- [Alchemy Sentry Getting Started Guide](https://alchemy-lx.sentry.io/insights/projects/erp-ai/getting-started/)
- [Sentry Docs](https://docs.sentry.io/platforms/javascript/guides/react/)

# Metabase Integration

This project includes Metabase dashboard integration for analytics and reporting.

## Configuration

The Metabase integration uses the following configuration (provided by the Metabase administrator):

```javascript
const METABASE_SITE_URL = "https://soft-limpet.metabaseapp.com";
const METABASE_SECRET_KEY = "874a79289c7d0f82b65c84da0284a44b9a52038d4b77fcac53ec9ed9ac6feb6e";
const METABASE_DASHBOARD_ID = 34;
```

## Usage

The Metabase dashboard is automatically embedded in the Dashboard page. You can also use the `MetabaseDashboard` component in other parts of your application:

```tsx
import { MetabaseDashboard } from '@/components/MetabaseDashboard';

<MetabaseDashboard 
  title="Custom Analytics"
  height={600}
  showControls={true}
  theme="auto" // Supports 'light', 'dark', or 'auto'
  onLoad={() => console.log('Dashboard loaded')}
  onError={(error) => console.error('Error:', error)}
/>
```

## Features

- **Secure Embedding**: Uses JWT tokens for secure dashboard embedding
- **Dark Theme Support**: Automatically adapts to light/dark themes
- **Customizable**: Configurable height, width, theme, and display options
- **Error Handling**: Built-in error handling and retry functionality
- **Loading States**: Shows loading indicators while dashboard loads
- **Controls**: Refresh and open in new tab functionality
- **Theme-Aware**: Automatically detects and applies system theme preferences
- **Debug Mode**: Built-in debugging to troubleshoot embedding issues

## Theme Support

The Metabase dashboard supports three theme modes:
- **`auto`** (default): Automatically follows the system/app theme
- **`light`**: Forces light theme
- **`dark`**: Forces dark theme

The dashboard will automatically switch themes when the user changes their system preference or app theme.

## Security

- Uses JWT tokens with 10-minute expiration
- Secure embedding with the provided secret key
- Only loads in non-development environments when Sentry is enabled
