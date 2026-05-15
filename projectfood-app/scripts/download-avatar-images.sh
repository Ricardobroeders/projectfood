#!/bin/bash
# One-off script: downloads all avatar images from Supabase at 256x256 using sips for resizing.
# Run from project root: bash scripts/download-avatar-images.sh

BASE_URL="https://lkmfmdehysmbstnfdbyg.supabase.co/storage/v1/object/public/avatars"
OUT_DIR="public/images/avatars"
mkdir -p "$OUT_DIR"

FILES=(
  Amara.png
  Anton.png
  Camila.png
  Diego.png
  Elena.png
  Erik.png
  Freya.png
  Hiroshi.png
  Isabella.png
  Jamal.png
  Kai.png
  Liam.png
  Marcus.png
  Ngozi.png
  Priya.png
  Rashid.png
  Sophia.png
  Tobias.png
  Yuki.png
  Zara.png
)

TOTAL=${#FILES[@]}
SUCCESS=0
FAIL=0

for FILE in "${FILES[@]}"; do
  DEST="$OUT_DIR/$FILE"
  if [ -f "$DEST" ]; then
    echo "  skip (exists): $FILE"
    ((SUCCESS++))
    continue
  fi

  TMP=$(mktemp /tmp/avatar-XXXXXX.png)
  if curl -sf -o "$TMP" "$BASE_URL/$FILE"; then
    if sips -Z 256 "$TMP" --out "$DEST" > /dev/null 2>&1; then
      SIZE=$(du -sh "$DEST" | cut -f1)
      echo "  ok $SIZE  $FILE"
      ((SUCCESS++))
    else
      echo "  RESIZE FAILED: $FILE"
      ((FAIL++))
    fi
  else
    echo "  DOWNLOAD FAILED: $FILE"
    ((FAIL++))
  fi
  rm -f "$TMP"
done

echo ""
echo "Done: $SUCCESS/$TOTAL ok, $FAIL failed"
echo "Total size: $(du -sh $OUT_DIR | cut -f1)"
