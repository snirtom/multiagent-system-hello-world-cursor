# Hello World - Architecture

## Overview

This architecture defines a staged delivery for a single-feature app where a user presses a button and sees the exact text `hello world`.

Stage 1 target platform:
- Web app only

Given the minimal scope and no backend requirement, Stage 1 uses a lightweight web implementation with standard HTML, CSS, and JavaScript. Mobile iOS and Android targets are intentionally deferred to later stages.

## Goals and Constraints

- Must satisfy PM acceptance criteria exactly (button activation shows `hello world`).
- Must work with keyboard activation on web and platform-equivalent interaction on mobile.
- Must not require backend, database, authentication, or persistence.
- Keep implementation small, readable, and easy for Dev + QA handoff.

## High-Level Design

### System context

- Pure frontend application.
- Single screen/view.
- No network calls.
- No persistent storage.

### Components

1. **App shell**
   - Bootstraps platform runtime and mounts primary screen.
2. **HelloWorldScreen**
   - Owns local UI state: whether message is visible.
   - Renders button and message area.
3. **PrimaryActionButton**
   - Accessible button-like control.
   - Triggers shared `onPress` handler for tap/click/keyboard activation.
4. **HelloWorldMessage**
   - Displays exact string `hello world` when visible.

## Data and State Model

Local state only:

```ts
type ViewState = {
  isMessageVisible: boolean;
};
```

Rules:
- Initial state: `isMessageVisible = false`
- On button activation: set `isMessageVisible = true`
- Repeated activations keep the same visible state (idempotent behavior)

## Interaction Flow

1. User opens app (web/iOS/Android).
2. Screen shows one primary button.
3. User activates button:
   - Web: click, Enter, or Space (through accessible button semantics)
   - iOS/Android: tap (and assistive tech activation)
4. App updates local state.
5. UI displays `hello world`.
6. Further presses preserve visible `hello world`.

## Interface Contracts

### UI contract

- Primary control text: `Show hello world` (or equivalent explicit action label).
- Output text must match exactly: `hello world` (lowercase, single space).

### Component contract examples

- `PrimaryActionButton`
  - Inputs: `label: string`, `onPress: () => void`
  - Behavior: invokes `onPress` on user activation.

- `HelloWorldMessage`
  - Inputs: `visible: boolean`
  - Behavior: renders `hello world` only when `visible` is true.

## Platform Strategy

### Stage 1 (Web only)
- Implement with semantic HTML (`<button>`) for built-in keyboard activation.
- Keep all behavior client-side with no network dependency.
- Keep the button and message above the fold on typical viewport sizes.

### Future stages (Mobile)
- Add iOS and Android implementations after Stage 1 web acceptance.
- Reuse behavior contract: button activation shows exact text `hello world`.

## Android Testing Environment (Mobile Stage)

This chapter defines how to build a local Android test environment for the future mobile stage while keeping Stage 1 web delivery unchanged.

### Objectives

- Ensure Android app behavior matches the web acceptance behavior contract.
- Provide repeatable local setup for developers and testers.
- Validate interaction via touch and Android accessibility services.

### Tooling prerequisites

- Node.js LTS and npm installed.
- Android Studio installed with:
  - Android SDK
  - Android SDK Platform-Tools (`adb`)
  - Android Emulator
  - At least one x86_64 Android system image (recommended API 34+).
- Java 17+ available for Android build tools.
- Expo CLI workflow (if selected in mobile stage).

### Environment configuration

- Set `ANDROID_HOME` (or `ANDROID_SDK_ROOT`) to Android SDK path.
- Add `platform-tools` to system `PATH` so `adb` is available in terminal.
- Validate setup:
  - `adb version`
  - `adb devices`

### Emulator baseline profile

Create and keep one default emulator profile for consistent QA runs:
- Device: Pixel-class phone profile (for example Pixel 6).
- Android version: API 34 or latest stable.
- Orientation: portrait default.
- Network: default emulator network enabled.

### Local run strategy

For React Native/Expo mobile stage:
- Start app dev server from project root (example):
  - `npx expo start --android`
- Launch emulator and install/run the app.
- Verify app can connect to local bundler (same machine by default for emulator).

For physical Android device testing:
- Enable Developer options and USB debugging.
- Connect device via USB (or trusted Wi-Fi debugging).
- Validate connection with `adb devices`.
- Start app with Android target command and confirm install on device.

### Android test checklist

Run this checklist on emulator first, then optionally on a physical device:

1. App launches without crash.
2. Primary button is visible on first screen.
3. Before first press, `hello world` is not visible (unless UI spec changes).
4. Tap button once -> exact visible text `hello world`.
5. Tap button repeatedly -> state remains valid and stable.
6. Enable TalkBack and activate button -> same output appears.
7. Rotate device (portrait/landscape) -> interaction still works and message remains correct.

### Debugging and failure triage

- If app not detected: verify `adb devices` and emulator state.
- If build fails: validate SDK/JDK versions and Android Studio components.
- If app cannot connect to bundler:
  - restart dev server
  - verify emulator network
  - if using physical device, verify LAN accessibility/firewall rules.
- Record failure with:
  - command run
  - device/emulator profile
  - observed error message
  - reproduction steps.

## Non-Functional Requirements

- **Accessibility:** control must be operable and labeled clearly; keyboard operation on web required.
- **Reliability:** deterministic local state transition; no external dependency failures.
- **Maintainability:** single shared code path for behavior reduces divergence across platforms.
- **Performance:** trivial; instant response expected.

## Tradeoffs and Rationale

Selected for Stage 1: **vanilla web stack (HTML/CSS/JS)**

Pros:
- Fastest path to validate PM acceptance criteria.
- Minimal tooling overhead.
- Native keyboard accessibility via semantic button behavior.

Cons:
- No shared code yet for future mobile apps.
- Mobile delivery requires a later architecture update.

Alternative considered:
- React Native + Expo cross-platform implementation from the start.
  - Deferred to keep Stage 1 focused on rapid web validation.

## Implementation Plan (Dev Handoff)

Phase 1 - Web project bootstrap
- Create static web app structure.
- Confirm app runs in a browser.

Phase 2 - Core UI behavior
- Build single screen with one accessible primary button.
- Add local `isMessageVisible` state.
- Render `hello world` conditionally.

Phase 3 - Accessibility and behavior hardening
- Verify web keyboard activation (Enter/Space).
- Confirm repeated activations keep one visible message and do not break state.

Phase 4 - QA validation (web)
- Validate against PM acceptance criteria 1-4.
- Sanity-check on desktop and mobile-sized browser viewports.

## Risks and Mitigations

- **Risk:** Ambiguity in exact button label text.
  - **Mitigation:** Use explicit label `Show hello world`; confirm with PM if naming matters.

- **Risk:** Platform-specific accessibility differences.
  - **Mitigation:** Use standard React Native `Pressable`/`Button` with accessibility label and test web keyboard + mobile assistive activation.

- **Risk:** Tooling friction for 3 targets in local setup.
  - **Mitigation:** Start with Expo managed workflow and documented run commands.

## Open Technical Questions

1. Should the message reserve layout space before first press, or appear only after press (current design: appear only after)?
2. Is minimal WCAG target required beyond keyboard operability (e.g., contrast requirements)?
3. Should QA include physical mobile devices in addition to simulators/emulators?

## Handoff Checklist to Dev

- Architecture decisions are explicit and cross-platform.
- Component boundaries and state flow are implementation-ready.
- Acceptance criteria mapping is complete.
- Android testing environment setup is documented for mobile stage.
- Risks and unresolved questions are listed for PM follow-up.
