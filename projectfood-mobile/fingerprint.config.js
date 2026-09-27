const { SourceSkips } = require('expo/fingerprint');

/**
 * What the runtime fingerprint ignores. `version` in app.config.ts must not feed it: the fingerprint
 * is the runtime version (app.config.ts `runtimeVersion: { policy: 'fingerprint' }`), so a version
 * bump would otherwise change the runtime and the installed build would refuse every over-the-air
 * update (verified 2026-09-24: 1.0.0 → 1.0.1 moved the hash). Skipping it lets the patch number be
 * bumped per update, which is how Ricardo reads which version he is on. `android.versionCode` and
 * `ios.buildNumber` are in the same skip and are store metadata, not native code.
 */

/**
 * The Google Sign-In iOS URL scheme is iOS-only, but the fingerprint hashes the whole config for
 * both platforms (it strips specific keys, never a platform section), so filling it in moved the
 * Android runtime from d8da0646 to 729c05b6 (measured 2026-09-27) while versionCode 7 was in the
 * closed testers' hands. That would have sent every Android update to a runtime nobody has, which
 * is the 2026-09-26 splash mistake again. This hook shows the hasher the placeholder the config
 * carried until then, so the hashed text is byte-identical to what versionCode 7 saw, and iOS gets
 * the same treatment for consistency. The cost: a changed scheme (a recreated OAuth client) does
 * not move the iOS runtime by itself; that day needs a new iOS build and the update channel
 * re-pointed by hand. The scheme is derived from the client id for the bundle id and is not
 * expected to change.
 */
const IOS_URL_SCHEME_IN_HASH = 'com.googleusercontent.apps.placeholder';
function fileHookTransform(source, chunk, _isEndOfFile, _encoding) {
  if (source.type !== 'contents' || source.id !== 'expoConfig' || chunk == null) return chunk;
  return String(chunk).replace(/("iosUrlScheme"\s*:\s*")com\.googleusercontent\.apps\.[^"]+"/, `$1${IOS_URL_SCHEME_IN_HASH}"`);
}

module.exports = { sourceSkips: SourceSkips.ExpoConfigVersions, fileHookTransform };
