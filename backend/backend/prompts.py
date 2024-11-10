SYSTEM_PROMPT = """You are Aurora, a virtual research assistant dedicated to enhancing research experiences. 

AURORA'S CAPABILITIES:
- Can provide comprehensive answers to research queries
- Creates detailed summaries based on authoritative sources
- Create study guides and outlines for research topics
- Take notes and organize information for research

AURORA'S PERSONALITY:
- Professional yet approachable
- Detail-oriented and analytical
- Committed to accuracy and thoroughness
- Skilled at organizing complex information
- Takes initiative in identifying research patterns and insights

You always respond in markdown format."""

CONTEXT_PROMPT_TEMPLATE = (
    "Use the following authoritative sources to provide a comprehensive answer. "
    "If you need to make assumptions beyond the sources, state them explicitly.\n"
    "\n--------------------\n"
    "{context_str}"
    "\n--------------------\n"
)

SUMMARY_FORMAT = """Please provide:

1. OVERVIEW
- Main arguments and key findings
- Core themes across sources
- Historical/theoretical context if relevant

2. KEY POINTS
- Major findings and conclusions
- Supporting evidence
- Important methodologies used
- Notable author perspectives

3. SYNTHESIS & ANALYSIS
- Relationships between sources
- Agreements and contradictions
- Strengths and limitations
- Gaps in current understanding
- Emerging patterns or trends

4. IMPLICATIONS
- Significance of findings
- Practical applications
- Areas needing further research
- Broader impact

Please be thorough in your analysis while maintaining clarity. Highlight particularly significant findings or controversies.

Length: Comprehensive analysis (no specific limit)
Format: Clear headers, structured paragraphs and proper line breaks between sections and use bullet points where necessary."""

STUDY_GUIDE_FORMAT = """Follow this structure:

Study Guide for {SUBJECT}

Overview:
- Begin with a short introduction to {TOPIC} and its relevance within {SUBJECT}.

Key Learning Objectives:
- List 3-5 key learning objectives that will be achieved after studying this guide.

Essential Concepts:
- Break down {TOPIC} into 2-4 essential concepts. For each concept, include:
    Definition: Provide a clear, concise definition.
    Key Points: Outline important aspects of the concept in bullet points.
- Examples: Give 1-2 examples that illustrate the concept in action.

Practice Problems:
- Create a few practice problems to test understanding. Include solutions and explanations.

Common Mistakes to Avoid:
- List common errors a human might make with each concept and explain how to avoid them.

Study Tips:
- Include 2-3 specific tips for mastering the material.

Additional Resources:
- Provide suggestions for further reading or useful tools to reinforce understanding.

Review Questions:
- List a few review questions to help students assess their knowledge.

Length: Comprehensive analysis (no specific limit)
Format: Clear headers, structured paragraphs and proper line breaks between sections and use bullet points where necessary."""

QA_FORMAT = """Based on the provided sources, generate a comprehensive Q&A set following this structure:

1. BASIC CONCEPTS
- Create 5-7 fundamental questions covering core concepts
- Include clear, concise answers
- Focus on definitions, key terms, and basic principles

2. UNDERSTANDING & COMPREHENSION
- Create 5-7 questions that test deeper understanding
- Include questions that require explaining relationships between concepts
- Mix multiple-choice and open-ended questions

3. ANALYSIS & APPLICATION
- Create 3-5 scenario-based questions
- Include questions that require applying concepts to real-world situations
- Add questions that test critical thinking and analysis

4. ADVANCED TOPICS
- Create 2-3 complex questions for advanced understanding
- Include questions that integrate multiple concepts
- Add questions about controversies or debates in the field

Format Guidelines:
- Number each question
- Provide clear, detailed answers
- Include explanations where necessary
- Use a mix of question types (multiple choice, short answer, explanatory)

Length: Comprehensive coverage of the material
Format: Clear question-answer pairs with proper spacing and organization"""
