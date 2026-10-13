#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
SDK="${ANDROID_SDK_ROOT:?Set ANDROID_SDK_ROOT}"
TOOLS="${ANDROID_BUILD_TOOLS:-$SDK/build-tools/35.0.0}"
PLATFORM="${ANDROID_PLATFORM_JAR:-$SDK/platforms/android-35/android.jar}"
mkdir -p build/classes build/dex build/generated
"$TOOLS/aapt2" compile --dir res -o build/resources.zip
"$TOOLS/aapt2" link -I "$PLATFORM" --manifest AndroidManifest.xml --java build/generated -o build/base.apk build/resources.zip
javac -encoding UTF-8 -source 8 -target 8 -bootclasspath "$TOOLS/core-lambda-stubs.jar:$PLATFORM" -d build/classes src/kr/co/ipharmkorea/dongwonhub/*.java
jar cf build/classes.jar -C build/classes .
"$TOOLS/d8" --lib "$PLATFORM" --min-api 26 --output build/dex build/classes.jar
cp build/base.apk build/unsigned.apk
(cd build/dex && zip -q ../unsigned.apk classes.dex)
"$TOOLS/zipalign" -f -p 4 build/unsigned.apk build/DongwonHUB-Android-unsigned.apk
if [[ "${SKIP_SIGN:-0}" != "1" ]]; then
 "${TOOLS}/apksigner" sign --ks "${HUB_ANDROID_KEYSTORE:-../../.release-secrets/android-release.p12}" --ks-key-alias dongwonhub --ks-pass "file:${HUB_ANDROID_STOREPASS_FILE:-../../.release-secrets/android-password.txt}" --v4-signing-enabled false --out build/DongwonHUB-Android-1.0.0.apk build/DongwonHUB-Android-unsigned.apk
 "${TOOLS}/apksigner" verify --verbose build/DongwonHUB-Android-1.0.0.apk
fi
