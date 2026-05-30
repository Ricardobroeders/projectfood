# Create Learn Issues

## Layer 01 — Description
description: "Create Linear issues for the Project Food /learn content section — Cluster 1: Plant Diversity & the 30-Plant Rule. Produces 1 pillar issue + 6 child cluster issues with full research context."

Use when spinning up a new content cluster for the /learn section so a future writing agent has everything it needs.

---

## Layer 02 — Instructions

### Step 1 — Find the right team

List available Linear teams and pick the one for Project Food.

---

### Step 2 — Create the parent (pillar) issue

**Title:** `[Content] Pillar: Plant Diversity & the 30-Plant Rule`

**Description:**
```
## Article metadata
- **Slug:** `plant-diversity`
- **Type:** pillar
- **Target reading time:** 8–10 min
- **Emoji:** 🌿

## Thesis
The 30-plant rule originated from the American Gut Project (McDonald et al., 2018), which found that people eating 30+ different plants per week had significantly more diverse gut microbiomes than those eating ≤10. This pillar explains *why* diversity matters (different polysaccharides feed different bacterial species), where the number comes from, and what the science actually does — and doesn't — prove.

## Key points to cover
- What the American Gut Project actually measured and found
- Why microbiome diversity correlates with health outcomes (immune function, inflammation, metabolite production)
- The difference between fibre quantity and fibre diversity
- Limitations of the 30-plant rule (observational data, self-reported diet)
- How this pillar connects to the 6 cluster articles below

## Outline
1. Introduction — the 30-plant rule in popular media vs. the actual study
2. The American Gut Project: what it was and what it found
3. Why diversity beats quantity: SCFAs, polysaccharides, and bacterial niches
4. What the science doesn't yet prove (causation vs. correlation)
5. Practical takeaway + links to cluster articles

## Citations (verify DOIs before writing)
- McDonald et al. (2018) "American Gut: an Open Platform for Citizen Science Microbiome Research" — mSystems — https://doi.org/10.1128/mSystems.00031-18
- Wastyk et al. (2021) "Gut-microbiota-targeted diets modulate human immune status" — Cell — https://doi.org/10.1016/j.cell.2021.06.019
- Zmora et al. (2019) "You Are What You Eat" — Nature Reviews Gastroenterology — https://doi.org/10.1038/s41575-018-0061-2

## FAQ (for structured data / sd_faq column)
- What is the 30-plant rule?
- Where does the 30-plant rule come from?
- Does the 30-plant rule have scientific backing?
- What counts as one of the 30 plants?

## Related cluster slugs
what-counts-as-a-plant, gut-microbiome-plant-diversity, 30-plants-science-origin, plant-diversity-mental-health, how-to-hit-30-plants, herbs-spices-count

## DB fields to populate when writing
body_md, meta_title, meta_description, sd_keywords, sd_faq, sd_citations, reading_time_min
```

**Label:** `content` (create if it doesn't exist) | **State:** `Todo`

Save the returned issue ID — needed as `parentId` for the 6 child issues.

---

### Step 3 — Create 6 child issues

Create each with `parentId` set to the pillar issue ID from Step 2.

**Child 1 — `[Content] Cluster: What Counts as a Plant?`** (slug: `what-counts-as-a-plant`, 5 min, 🥦)
Thesis: People undercount because they don't know the rules. Defines the 7 plant categories, explains why a tin of mixed beans = 1 plant, why colour variety within a category doesn't multiply the count, and gives a worked scoring example.

**Child 2 — `[Content] Cluster: How Plant Diversity Shapes Your Gut Microbiome`** (slug: `gut-microbiome-plant-diversity`, 6 min, 🦠)
Thesis: Different bacteria specialise in different polysaccharides. Eating diverse plants feeds diverse bacterial species → higher alpha-diversity. Covers fibre types (cellulose, pectin, inulin, beta-glucan), SCFAs (butyrate, propionate, acetate), and why 30g fibre from one source ≠ 30g from 10.

**Child 3 — `[Content] Cluster: Where Does the 30-Plants Rule Come From?`** (slug: `30-plants-science-origin`, 6 min, 🔬)
Thesis: One citizen-science study (American Gut Project). Explains what it found, how "30" became a round number in the press, what it cannot prove, and how later research adds to the picture.

**Child 4 — `[Content] Cluster: The Gut-Brain Axis — Can More Plants Improve Your Mood?`** (slug: `plant-diversity-mental-health`, 7 min, 🧠)
Thesis: Gut-brain communication via vagus nerve, immune system, and metabolites. Covers serotonin (90% gut-produced), tryptophan/kynurenine pathway, SMILES trial. Responsible framing: not "cure depression with plants".

**Child 5 — `[Content] Cluster: How to Actually Hit 30 Plants a Week`** (slug: `how-to-hit-30-plants`, 5 min, 📋)
Thesis: Most people are 10–15 plants away, not 30. Covers high-leverage swaps (mixed spice blends, mixed nuts, grain blends), meal-by-meal breakdown, a full Monday–Sunday walkthrough, and habit-stacking science.

**Child 6 — `[Content] Cluster: Do Herbs and Spices Count?`** (slug: `herbs-spices-count`, 5 min, 🌿)
Thesis: Yes — and they're polyphenol-dense. Covers why small quantities still reach the colon and feed bacteria, top herbs/spices for gut diversity, and why garlic/onion are special (prebiotic FOS).

For each child issue include: article metadata, thesis, key points, outline, citations (with DOIs), FAQ entries, and related slugs. Use the full detail format from the pillar as the template.

**Label:** `content` | **State:** `Todo`

---

### Step 4 — Verify

List all created issues and confirm:
- 1 parent pillar issue
- 6 child issues all linked to the pillar
- All state `Todo`, all labelled `content`

Report the issue identifiers (e.g. PF-42) for the future writing agent.

---

## Layer 03 — Tools

| Type | Resource |
|------|----------|
| MCP  | `mcp__claude_ai_Linear__list_teams` — find the Project Food team |
| MCP  | `mcp__claude_ai_Linear__save_issue` — create pillar and child issues |
| MCP  | `mcp__claude_ai_Linear__list_issues` — verify after creation |
