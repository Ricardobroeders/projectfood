#!/bin/bash
# One-off script: downloads all plant images from Supabase at 128x128 using sips for resizing.
# Run from project root: bash scripts/download-plant-images.sh

BASE_URL="https://lkmfmdehysmbstnfdbyg.supabase.co/storage/v1/object/food-images"
OUT_DIR="public/images/plants"
mkdir -p "$OUT_DIR"

FILES=(
  a-a-berry.png
  adzuki-beans.png
  almond-butter.png
  almond.png
  amaranth.png
  apricot.png
  artichoke.png
  ashwagandha.png
  asparagus.png
  aubergine.png
  avocado.png
  baby-corn.png
  bamboo-shoots.png
  banana.png
  barley.png
  basil.png
  bay-leaf.png
  beetroot.png
  belgian-endive.png
  black-beans.png
  black-eyed-pea.png
  black-pepper.png
  blackberry.png
  blueberry.png
  brazil-nut.png
  broccoli.png
  brown-rice.png
  brussels-sprouts.png
  buckwheat.png
  bulgur-wheat.png
  butter-beans.png
  butternut-squash.png
  cabbage.png
  cacao-nibs.png
  cannellini-beans.png
  cantaloupe.png
  caper.png
  cardamom.png
  carrot.png
  cashew.png
  cauliflower.png
  celeriac.png
  celery.png
  chanterelle.png
  cherry-tomato.png
  cherry.png
  chia-seed.png
  chickpeas.png
  chilli-flakes.png
  chilli.png
  chinese-broccoli.png
  chives.png
  cinnamon.png
  clementine.png
  coconut.png
  coriander.png
  corn.png
  courgette.png
  cranberry.png
  cucumber.png
  daikon.png
  date.png
  dill.png
  dragon-fruit.png
  durian.png
  edamame.png
  enoki-mushroom.png
  farro.png
  fava-beans.png
  fennel.png
  fig.png
  flaxseed.png
  freekeh.png
  galangal.png
  garlic.png
  gherkin.png
  ginger.png
  golden-kiwi.png
  gooseberry.png
  grape.png
  grapefruit.png
  green-apple.png
  green-bean.png
  green-lentils.png
  green-pepper.png
  guava.png
  hazelnut.png
  hemp-seeds.png
  honeydew-melon.png
  iceberg-lettuce.png
  kale.png
  kidney-beans.png
  kiwi.png
  kohlrabi.png
  lamb-s-lettuce.png
  leek.png
  lemon.png
  lemongrass.png
  lima-bean.png
  lime.png
  lychee.png
  macadamia.png
  mango.png
  mangosteen.png
  millet.png
  mint.png
  mung-bean-sprouts.png
  mung-beans.png
  mushroom.png
  mustard-seed.png
  napa-cabbage.png
  nigella-seeds.png
  oats.png
  okra.png
  olive.png
  onion.png
  orange.png
  oregano.png
  oyster-mushroom.png
  pak-choi.png
  papaya.png
  parsley.png
  parsnip.png
  passion-fruit.png
  pea.png
  peach.png
  peanut.png
  pear.png
  pecan.png
  pine-nut.png
  pineapple.png
  pinto-beans.png
  pistachio.png
  plum.png
  pointed-cabbage.png
  pomegranate.png
  pomelo.png
  poppy-seeds.png
  potato.png
  psyllium-husk.png
  pumpkin-seeds.png
  pumpkin.png
  quinoa.png
  radish.png
  rambutan.png
  raspberry.png
  red-apple.png
  red-lentils.png
  red-onion.png
  red-pepper.png
  rocket.png
  romaine-lettuce.png
  rose-apple.png
  rosemary.png
  runner-bean.png
  rye.png
  sage.png
  sesame-seeds.png
  shallot.png
  shiitake.png
  sorghum.png
  spelt.png
  spinach.png
  split-peas.png
  spring-onion.png
  strawberry.png
  sunflower-butter.png
  sunflower-seeds.png
  sweet-potato.png
  swiss-chard.png
  tahini.png
  tarragon.png
  teff.png
  kefir.png
  kimchi.png
  kombucha.png
  miso.png
  sauerkraut.png
  sourdough-bread.png
  tempeh.png
  yogurt.png
  thyme.png
  tofu.png
  tomato.png
  turmeric.png
  turnip.png
  walnut.png
  watercress.png
  watermelon-seeds.png
  watermelon.png
  white-asparagus.png
  wild-rice.png
  yellow-pepper.png
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

  TMP=$(mktemp /tmp/plant-XXXXXX.png)
  if curl -sf -o "$TMP" "$BASE_URL/$FILE"; then
    # Resize to 128x128 preserving aspect ratio, fit within box
    if sips -Z 128 "$TMP" --out "$DEST" > /dev/null 2>&1; then
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
