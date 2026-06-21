# 🧠 OVERVIEW — YOUR AI BRAND FACTORY

You are creating a **4-agent pipeline** (not 3 — this is more powerful):

| Agent       | Role             | Output                       |
| ----------- | ---------------- | ---------------------------- |
| **Agent 1** | Research Analyst | Deep insights + requirements |
| **Agent 2** | Brand Architect  | Document structure           |
| **Agent 3** | Prompt Engineer  | Reusable prompt template     |
| **Agent 4** | Systems Auditor  | Cross-document alignment     |

***

# 🔗 MASTER PIPELINE FLOW

You will run these prompts **in sequence per document**:

```
INPUT → Agent 1 → Agent 2 → Agent 3 → Agent 4 → FINAL TEMPLATE
```

***

# 🚀 AGENT 1 — RESEARCH ANALYST

## ✅ Prompt (Copy & Use)

```text
ROLE:
You are an elite brand strategist and business researcher specializing in high-growth companies.

GOAL:
Conduct deep research on what is required to build a best-in-class:

[INSERT DOCUMENT NAME]

CONTEXT:
This document is part of a full brand development system that includes:
- Strategy
- Messaging
- Identity
- Marketing infrastructure
- Internal alignment
- Governance

This happens BEFORE any SEO or paid marketing.

INSTRUCTIONS:

1. Define the PURPOSE of this document in business success
2. Identify ALL critical components required
3. Explain the STRATEGIC thinking behind each component
4. Show what elite brands do differently vs average brands
5. Identify common mistakes and failures
6. Define required inputs (what must be known first)
7. Define expected outputs (what a finished version should include)

SOURCE INTELLIGENCE:
Use:
- Proven frameworks (positioning, JTBD, brand strategy)
- Real-world brand examples
- Market psychology
- Competitive differentiation principles

Avoid generic content.

OUTPUT FORMAT:

### Purpose
### Key Components
### Strategic Thinking
### Elite vs Average Execution
### Common Failures
### Required Inputs
### Expected Outputs
```

***

# 🧱 AGENT 2 — BRAND ARCHITECT

## ✅ Prompt

```text
ROLE:
You are a brand systems architect.

GOAL:
Convert the research into a complete, real-world document structure for:

[INSERT DOCUMENT NAME]

INPUT:
[PASTE OUTPUT FROM AGENT 1]

INSTRUCTIONS:

1. Build a complete document outline
2. Include:
   - Sections
   - Subsections
   - Content expectations per section
3. Specify format:
   - Narrative
   - Bullet points
   - Tables
4. Ensure it is usable in a real business

RULES:
- No fluff
- Must be practical and actionable
- Must reflect strategic depth

OUTPUT FORMAT:

### Full Document Structure
- Section
  - Subsection
    - Content requirements
```

***

# 🧩 AGENT 3 — PROMPT ENGINEER (CORE OUTPUT)

🔥 This is the one that populates your folders.

## ✅ Prompt

```text
ROLE:
You are a world-class AI prompt engineer specializing in business systems.

GOAL:
Create a reusable AI prompt template that generates a complete:

[INSERT DOCUMENT NAME]

INPUT:
[PASTE OUTPUT FROM AGENT 1 + AGENT 2]

INSTRUCTIONS:

You must create a prompt that includes:

1. ROLE (expert-level framing)
2. GOAL (specific business outcome)
3. CONTEXT (brand system awareness)
4. INPUT SECTION (what user must provide)
5. STEP-BY-STEP THINKING PROCESS
6. OUTPUT FORMAT (clear structured sections)
7. QUALITY CONTROL (self-check enforcement)

CRITICAL REQUIREMENTS:
- Must force specificity
- Must prevent generic output
- Must produce real business-ready work

Include this rule inside the prompt:
"If this output could apply to any generic business, it is incorrect and must be refined further."

OUTPUT FORMAT:

### FINAL PROMPT TEMPLATE
(copy-paste ready)
```

***

# 🔍 AGENT 4 — SYSTEMS AUDITOR (THIS IS THE SECRET WEAPON)

This is what most people skip — and why their brand ends up inconsistent.

## ✅ Prompt

```text
ROLE:
You are a brand system auditor.

GOAL:
Ensure this document aligns with the entire brand system.

INPUT:
- Current document prompt template
- List of existing documents already created

INSTRUCTIONS:

1. Identify inconsistencies in:
   - Positioning
   - Messaging
   - Audience
   - Tone
2. Identify overlaps or redundancy
3. Suggest improvements for cohesion
4. Recommend additions to strengthen system alignment

OUTPUT FORMAT:

### Alignment Issues
### Improvements
### Final Refined Prompt Template
```

***

# 🗂️ HOW THIS MAPS TO YOUR FOLDERS

Using your structure: [\[fasmotorsp...epoint.com\]](https://fasmotorsports-my.sharepoint.com/personal/amber_fasmotorsports_com/Documents/Microsoft%20Copilot%20Chat%20Files/Complete%20Brand%20Document%20%26%20Asset%20Checklist.md)

### Example:

```
01_Strategy/
    Mission Statement/
        prompt.txt
    Brand Positioning/
        prompt.txt
    Personas/
        prompt.txt
```

Each folder contains:
✅ 1 final prompt template  
✅ optionally: research + structure notes

***

# ⚙️ HOW TO RUN THIS (IMPORTANT)

For each document:

### Step 1

Run Agent 1 → get research

### Step 2

Run Agent 2 → paste Agent 1 output

### Step 3

Run Agent 3 → paste both outputs

### Step 4

Run Agent 4 → refine

👉 Store final output in the folder

***

# 💡 PRO-LEVEL OPTIMIZATION

### Batch by category instead of one-by-one:

Do this:

* Run all **Strategy docs first**
* Then **Messaging**
* Then **Visual**
* Then **Marketing**

Why?
→ Later documents depend on earlier ones

***

# 🚨 CRITICAL EXECUTION RULES

Based on your system: [\[fasmotorsp...epoint.com\]](https://fasmotorsports-my.sharepoint.com/personal/amber_fasmotorsports_com/Documents/Microsoft%20Copilot%20Chat%20Files/Complete%20Brand%20Document%20%26%20Asset%20Checklist.md)

### 1. DO NOT start with visuals

Start with:

* Mission
* UVP
* Positioning
* Personas

### 2. Every document must reinforce:

* Positioning
* Differentiation
* Audience

### 3. If it sounds generic → reject it

***

# 🧩 OPTIONAL (NEXT LEVEL)

You can compress this entire pipeline into ONE super-agent later.

If you want, I can build:
✅ a **single “orchestrator prompt”** that runs all 4 agents in one go  
✅ or a **Notion / workflow system layout**

***

# ✅ Next Step

Do you want me to:

### A)

Run this system and generate a **fully completed example (end-to-end)** for:
👉 Brand Positioning (so you can see it working)

### B)

Build you a **one-click SUPER PROMPT** that replaces all 4 agents with one execution

Just reply **A or B**.


