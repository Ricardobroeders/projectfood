const { SourceSkips } = require('expo/fingerprint');

/**
 * What the runtime fingerprint ignores. `version` in app.config.ts must not feed it: the fingerprint
 * is the runtime version (app.config.ts `runtimeVersion: { policy: 'fingerprint' }`), so a version
 * bump would otherwise change the runtime and the installed build would refuse every over-the-air
 * update (verified 2026-09-24: 1.0.0 → 1.0.1 moved the hash). Skipping it lets the patch number be
 * bumped per update, which is how Ricardo reads which version he is on. `android.versionCode` and
 * `ios.buildNumber` are in the same skip and are store metadata, not native code.
 */
module.exports = { sourceSkips: SourceSkips.ExpoConfigVersions };
