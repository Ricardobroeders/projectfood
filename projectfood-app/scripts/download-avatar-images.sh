#!/bin/bash
# Downloads all avatar images from Supabase at 256x256 using sips for resizing.
# Run from project root: bash scripts/download-avatar-images.sh

BASE_URL="https://lkmfmdehysmbstnfdbyg.supabase.co/storage/v1/object/public/avatars"
OUT_DIR="public/images/avatars"
mkdir -p "$OUT_DIR/female" "$OUT_DIR/male" "$OUT_DIR/unknown"

declare -A GROUPS
GROUPS[female]="Amara Camila Elena Freya Isabella Ngozi Priya Sophia Yuki Zara"
GROUPS[male]="Anton Diego Erik Hiroshi Jamal Kai Liam Marcus Rashid Tobias"
GROUPS[unknown]="Bunny Crocodile Jester Robot Shark"

SUCCESS=0
FAIL=0
TOTAL=0

for GROUP in female male unknown; do
  for NAME in ${GROUPS[$GROUP]}; do
    ((TOTAL++))
    DEST="$OUT_DIR/$GROUP/$NAME.png"
    if [ -f "$DEST" ]; then
      echo "  skip (exists): $GROUP/$NAME.png"
      ((SUCCESS++))
      continue
    fi

    TMP=$(mktemp /tmp/avatar-XXXXXX.png)
    if curl -sf -o "$TMP" "$BASE_URL/$GROUP/$NAME.png"; then
      if sips -Z 256 "$TMP" --out "$DEST" > /dev/null 2>&1; then
        SIZE=$(du -sh "$DEST" | cut -f1)
        echo "  ok $SIZE  $GROUP/$NAME.png"
        ((SUCCESS++))
      else
        echo "  RESIZE FAILED: $GROUP/$NAME.png"
        ((FAIL++))
      fi
    else
      echo "  DOWNLOAD FAILED: $GROUP/$NAME.png"
      ((FAIL++))
    fi
    rm -f "$TMP"
  done
done

echo ""
echo "Done: $SUCCESS/$TOTAL ok, $FAIL failed"
echo "Total size: $(du -sh $OUT_DIR | cut -f1)"
