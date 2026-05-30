# Image Updater

## Layer 01 — Description
description: "Download missing plant images from Supabase storage, resize to 128×128 PNG, and place them in projectfood-app/public/images/plants/."

Use after uploading new plant images to the Supabase `food-images` bucket, or after adding new active plants to the DB.

---

## Layer 02 — Instructions

1. **Fetch all active plant slugs from DB:**
   ```sql
   SELECT slug FROM plants WHERE is_active = true ORDER BY slug;
   ```

2. **Check which images are missing locally:**
   ```bash
   ls /Users/ricardo/Documents/project-food/projectfood-app/public/images/plants/
   ```
   Each image is `<slug>.png`. Identify slugs that have no corresponding local file.

3. **Download and resize each missing image:**
   ```bash
   BASE_URL="https://lkmfmdehysmbstnfdbyg.supabase.co/storage/v1/object/food-images"
   OUT_DIR="/Users/ricardo/Documents/project-food/projectfood-app/public/images/plants"

   for FILE in <slug1>.png <slug2>.png; do
     TMP=$(mktemp /tmp/plant-XXXXXX.png)
     if curl -sf -o "$TMP" "$BASE_URL/$FILE"; then
       if sips -Z 128 "$TMP" --out "$OUT_DIR/$FILE" > /dev/null 2>&1; then
         echo "  ok $(du -sh "$OUT_DIR/$FILE" | cut -f1)  $FILE"
       else
         echo "  RESIZE FAILED: $FILE"
       fi
     else
       echo "  NOT FOUND IN STORAGE: $FILE"
     fi
     rm -f "$TMP"
   done
   ```

4. **Update download-plant-images.sh** — add any newly downloaded slugs to the `FILES` array to keep the historical script in sync.

5. **Print summary:**
   ```
   IMAGE UPDATER RUN — [date]
   ==========================

   DOWNLOADED ([n]):
     - [slug].png ([size])

   NOT FOUND IN STORAGE ([n]):
     - [slug].png  ← upload to Supabase food-images bucket first

   ALREADY PRESENT ([n]): skipped
   ```
   If any images were not found in storage, remind Ricardo to upload them to the `food-images` bucket and re-run `/image-updater`.

---

## Layer 03 — Tools

| Type | Resource |
|------|----------|
| MCP  | `mcp__claude_ai_Supabase__execute_sql` — project ref `lkmfmdehysmbstnfdbyg` |
| BASH | `curl` — download images from Supabase public storage |
| BASH | `sips -Z 128` — resize to 128×128 px (macOS built-in; Linux: `convert -resize 128x128` via ImageMagick) |
| REF  | `projectfood-app/scripts/download-plant-images.sh` — historical sync script |
