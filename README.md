# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

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

This project integrates Metabase for analytics dashboards.

## Setup

1. **Environment Configuration**
   - Create a `.env` file in the root directory
   - Add your Metabase configuration:
     ```env
     VITE_METABASE_SITE_URL=your_metabase_site_url
     VITE_METABASE_SECRET_KEY=your_metabase_secret_key
     VITE_METABASE_DASHBOARD_ID=your_dashboard_id
     ```
   - Replace the placeholder values with your actual Metabase credentials

2. **Usage**
   - The Metabase dashboard is displayed on the Dashboard page
   - Uses JWT token generation for secure embedding
   - Supports both light and dark themes

3. **Features**
   - **Dark Theme Support**: Automatically adapts to the current theme
   - **Debug Mode**: Can be enabled for troubleshooting (disabled by default)
   - **Responsive Design**: Works on all screen sizes
   - **Error Handling**: Graceful error handling with user-friendly messages

## Security

- **Environment Variables**: All Metabase credentials are stored in environment variables
- **No Hardcoded Secrets**: No sensitive keys in source code
- **JWT Token Security**: Uses secure JWT tokens for dashboard embedding
- **Git Ignore**: `.env` file should be in `.gitignore` to prevent accidental commits

## References
- [Metabase Embedding Documentation](https://www.metabase.com/docs/latest/embedding/embedding-charts-and-dashboards.html)
- [JWT Token Generation](https://www.metabase.com/docs/latest/embedding/embedding-charts-and-dashboards.html#securing-embeds-with-jwt-tokens)

# Gleap Feedback Integration

This project integrates [Gleap](https://gleap.io/) for user feedback and bug reporting.

## Setup

1. **Install dependencies**
   ```bash
   npm install gleap
   ```

2. **Environment Configuration**
   - Create a `.env` file in the root directory
   - Add your Gleap key:
     ```env
     VITE_GLEAP_KEY=your_gleap_key_here
     ```
   - Replace `your_gleap_key_here` with your actual Gleap key
   - **Important**: Never commit your `.env` file to version control
   - Add `.env` to your `.gitignore` file if not already present

3. **Initialization**
   - Gleap is initialized once in `src/main.tsx`
   - Uses singleton pattern to ensure single initialization

## Usage

### Basic Usage
```tsx
import { useGleap } from '@/hooks/useGleap';

const MyComponent = () => {
  const { isInitialized, showFeedback } = useGleap();
  
  return (
    <button onClick={showFeedback}>
      Report Issue
    </button>
  );
};
```

### Feedback Button Component
```tsx
import FeedbackButton from '@/components/custom/FeedbackButton';

// Use the pre-built feedback button
<FeedbackButton size="sm" variant="outline">
  Feedback
</FeedbackButton>
```

## Features

- **Automatic Initialization**: Gleap is initialized when the app starts
- **User Integration**: Automatically detects user authentication state
- **Feedback Widget**: Easy-to-use feedback button in the header
- **Error Handling**: Graceful handling of initialization failures
- **TypeScript Support**: Full TypeScript support with proper types

## Components

- **`FeedbackButton`**: Pre-built button component for triggering feedback
- **`useGleap`**: Custom hook for Gleap functionality
- **`GleapService`**: Service class for Gleap management

## Security

- **Environment Variables**: Gleap key is stored in environment variables
- **No Hardcoded Secrets**: No sensitive keys in source code
- **Error Handling**: Graceful fallback if key is missing
- **Git Ignore**: `.env` file should be in `.gitignore` to prevent accidental commits

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Gleap Configuration
VITE_GLEAP_KEY=your_gleap_key_here

# Metabase Configuration
VITE_METABASE_SITE_URL=your_metabase_site_url
VITE_METABASE_SECRET_KEY=your_metabase_secret_key
VITE_METABASE_DASHBOARD_ID=your_dashboard_id

# Other environment variables...
VITE_API_BASE_URL=https://your-api-url.com
VITE_SENTRY_DSN=your_sentry_dsn_here
```

## References
- [Gleap Documentation](https://docs.gleap.io/)
- [Gleap React Integration](https://docs.gleap.io/react)
