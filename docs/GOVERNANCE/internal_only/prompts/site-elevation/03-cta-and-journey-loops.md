# PHASE 3 — CTA Differentiation & Journey Loops

> **Historical task inventory — do not execute as a prompt.** The universal CTA and funnel rules in
> the original version were retired because they made unlike pages sound and behave alike.

Historical goal: identify dead ends and unclear next actions. Current pages should use natural,
predictable navigation that fits their actual purpose.

## The CTA doctrine

1. **CTA quantity follows the page's job.** A page may need no booking action, one clear action, or a
   repeated accessible action in a long layout. Do not impose a universal count.
2. **Add contextual links where they answer the next real question.** Do not force every page to end
   with the same block or manufacture curiosity labels.
3. **Reuse clear labels when the destination and action are the same.** Variation is useful when intent
   changes; uniqueness for its own sake makes navigation less predictable. Guard broken targets,
   retired routes, and missing trailing slashes—not repeated human language.

## The loop map

The following was an illustrative relationship map, not a mandatory funnel:

```
concern (/concerns/) → treatment (/services/) → comparison (/compare/) →
cost (/cost/) → results (/results/) → book (contextual CTA)
        ↘ guide (/guides/) ↗        ↘ provider card ↗       ↘ related treatment ↺
```

- Treatment pages may use a reviewed comparison when it materially clarifies adjacent options;
  otherwise a direct factual relationship can be clearer.
- Cost guides link back to the treatment and to another option only when the comparison is factual and
  relevant—not merely because it is cheaper.
- Results pages link to the documented service and related context when a consented case exists.
- Shop/product relationships remain inactive while the storefront is disabled. Do not imply a product
  supports a treatment without verified use guidance.
- Do not force IV hydration or another service into a page as a cross-sell. Add a relationship only
  when a verified client decision genuinely requires it.

## Component work

- Use a shared navigation component only when current pages demonstrate a repeated relationship that
  benefits from one. Do not create a registry solely to enforce label variation or funnel order.
- Vary section composition per page type so templates don't feel cloned — but keep the
  design system (`docs/COLOR-CONTRAST.md`, brand stylesheet) intact. Pure Astro; no React
  islands unless interactivity is truly required.

## Deliverables

- Evidence of any proven orphan, broken target, or missing decision-support link
- The smallest source change that fixes that proven gap without imposing a new sitewide doctrine
- Existing route/integrity tests updated only when their assertions reflect the intended behavior
