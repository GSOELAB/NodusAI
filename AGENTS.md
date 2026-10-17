# AGENTS.md — StudyNotes AI Pipeline

This document describes the architecture and multi-agent pipeline of the **StudyNotes** project, which consists of 5 specialized AI agents working sequentially.

---

## Pipeline Overview

When a student enters a lesson topic (or sends a revision prompt via chat), the agents execute their tasks in a live pipeline. The progress and execution status of each step are displayed in real-time (taking approximately 15–10 seconds):

1. **Researcher**
2. **Teacher**
3. **Fact-Checker**
4. **Editor**
5. **Formatter**

For targeted edits (e.g., "Explain simpler, with an example"), the system can selectively trigger specific roles (such as the Editor and Fact-Checker) instead of running the entire pipeline, maintaining structural integrity while verifying new facts.

---

## Agent Roles & Descriptions

### 1. Researcher

- **Role:** Searches for up-to-date information and sources related to the given topic.
- **Tools/Methods:** Google Search.
- **Output:** A list of verified sources with reliability indicators (e.g., verified links `✓` or questionable `⚠`).

### 2. Teacher

- **Role:** Explains and adapts the material to the student's specific learning level.
- **Adaptation Levels (via Projects):**
    - School (9th grade, biology, history, physics)
    - College / Ausbildung (FIAE, Netzwerke, Datenbanken, Programmierung)
    - University (ML course, linear algebra, neural networks, metrics)
- **Output:** Clear, accessible text explanations with practical examples tailored to the target audience.

### 3. Fact-Checker

- **Role:** Verifies facts, data, and links gathered in previous steps.
- **Workflow:** Automatically triggered during initial note creation, as well as whenever a user-submitted revision introduces new facts.
- **Output:** Labeling of sources and claims for accuracy (`✓` / `⚠`).

### 4. Editor

- **Role:** Structures information and compiles the final study notes.
- **Note Structure:**
    - Summary (Кратко)
    - Explanation (Объяснение)
    - Example (Пример)
    - Key Takeaway (Главное запомнить)
    - Sources (Источники)
- **Features:** Supports interactive chat-based edits (e.g., when a student requests a change, the agent updates the text in a live editor interface without losing manual user changes).

### 5. Formatter

- **Role:** Prepares and exports the finalized notes into the required format.
- **Target Formats:**
    - Markdown for Obsidian (with automatic plugin integration into the designated project folder)
    - PDF, DOCX exports

---

## Technical Implementation Details

- **APIs & Models:** Powered by the Gemini API (supports user-provided API keys in settings).
- **Streaming:** Real-time visualization of agent steps in a live pipeline view.
- **Learning Context (Projects):** Each project defines subjects, lessons, target education levels, and a target folder path inside the Obsidian knowledge base.
