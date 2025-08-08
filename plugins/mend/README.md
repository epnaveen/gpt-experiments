# Backstage Frontend Plugin: Mend (mend.io)

This is a frontend-only Backstage plugin that surfaces Mend (formerly WhiteSource) SCA data for software entities. It fetches data via the Backstage proxy to `api.mend.io` and renders a page and a small card.

## Features
- Project summary (open vulnerabilities by severity)
- Vulnerabilities table for a given Mend project token
- Entity card for quick at-a-glance status

## Prerequisites
- A Backstage app running on Node 18+
- A Mend API Org token with access to your projects

## Install
1. Add the plugin as a package in your Backstage monorepo (example as a local workspace):
   - Move this folder under `plugins/mend` in your Backstage repo, or publish it and install from your registry.

2. Configure the Backstage proxy to route Mend API calls and inject the token:

```yaml
# app-config.yaml
proxy:
  '/mend':
    target: 'https://api.mend.io'
    headers:
      # Org token or API key - store securely using environment vars
      Authorization: '${MEND_TOKEN}'
    # Optionally rewrite paths
    # pathRewrite:
    #   '^/mend': ''
```

3. Add the plugin route to your app:
```tsx
// packages/app/src/App.tsx
import { MendPage } from '@internal/backstage-plugin-mend';

// Inside <FlatRoutes>
<Route path="/mend" element={<MendPage />} />
```

4. Add the card to your entity page (optional):
```tsx
// packages/app/src/components/catalog/EntityPage.tsx
import { MendCard } from '@internal/backstage-plugin-mend';

// inside your layout for appropriate entity kinds
<EntitySwitch>
  <EntitySwitch.Case if={isComponentType('service')}>
    <Grid item md={6} xs={12}>
      <MendCard />
    </Grid>
  </EntitySwitch.Case>
</EntitySwitch>
```

5. Add the Mend project token to your entity metadata:
```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: my-service
  annotations:
    mend.io/project-token: 'YOUR_MEND_PROJECT_TOKEN'
```

## Notes
- Endpoints in `MendClient` use Mend REST `v1.3` examples. Adjust paths to match your Mend plan and API availability.
- For production, secure the `Authorization` header via environment variables or a secret manager and use the Backstage proxy.

## Development
- Build the plugin:
```bash
cd plugins/mend
npm install
npm run build
```

- Link this package into your Backstage app or add as a workspace.