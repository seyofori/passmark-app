# Maestro Setup for Passmark App

This directory contains end-to-end test flows for the Passmark React Native app using [Maestro](https://maestro.mobile.dev/).

## Setup Steps

1. **Install Maestro CLI** (if not already installed):

   ```sh
   brew install maestro
   # or
   curl -Ls "https://get.maestro.mobile.dev" | bash
   ```

2. **Verify Installation:**

   ```sh
   maestro --version
   ```

3. **Directory Structure:**

   - Place all your test flows (YAML files) in this `maestro/` directory.
   - Example: `maestro/home-screen-flow.yaml`

4. **Running Tests:**

   - Start your app in an emulator or on a device.
   - Run a test flow:
     ```sh
     maestro test maestro/home-screen-flow.yaml
     ```

5. **Writing Flows:**

   - See the Maestro docs: https://maestro.mobile.dev/getting-started/
   - Use selectors, text, and actions to automate navigation and assertions.

6. **CI Integration (Optional):**
   - Add Maestro to your CI pipeline for automated E2E checks.

---

## Example Flow

```yaml
# maestro/home-screen-flow.yaml
appId: com.yourcompany.passmark
---
- launchApp
- assertVisible: "Passmark"
- assertVisible: "Problem of the Day"
- swipeDown: "Problem of the Day"
- assertVisible: "Submit Solution"
```

---

Add your test flows in this folder to cover all critical user journeys and states (loading, error, refresh, navigation, etc.).

