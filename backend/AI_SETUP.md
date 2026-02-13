# AI Backend Setup - Groq Integration

## Overview
Backend has been updated to use **Groq API** with **neurodivergent-friendly task breakdown** logic including advanced PII masking.

## Key Changes

### 1. LLM Provider: Gemini → Groq
- **Model**: `mixtral-8x7b-32768` (high performance, large context)
- **Temperature**: 0.3 (calm, predictable output)
- **API Key**: `GROQ_API_KEY` environment variable

### 2. Enhanced Schemas
New `NeuroUserProfile` class supports:
- **Neurodivergence types**: ADHD, Dyslexia, Autism
- **Energy patterns**: Break intervals, fatigue triggers
- **AI preferences**: Tone (calm/Friendly/strict), verbosity (1-5), step granularity (micro/normal/macro)

### 3. PII Masking with Presidio
- **Presidio Analyzer**: Detects names, emails, phone numbers, etc.
- **Presidio Anonymizer**: Replaces PII with `[NAME]`, `[EMAIL]`, etc.
- **Multilingual**: Handles Hindi/Devanagari characters
- **Fallback**: Simple regex masking if Presidio fails

### 4. Neurodivergent-Friendly Prompt
New prompt template includes:
- User cognitive profile
- Neurodivergence-specific adaptations
- Energy/fatigue considerations
- Tone and verbosity adjustments
- Step granularity control (micro: 8-10, normal: 6-8, macro: 4-6 steps)

## Setup Instructions

### Step 1: Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Download Spacy Model (Required for Presidio)
```bash
python -m spacy download en_core_web_lg
```

### Step 3: Set Groq API Key
Update `local.settings.json`:
```json
{
  "Values": {
    "GROQ_API_KEY": "your_actual_groq_api_key_here"
  }
}
```

### Step 4: Start Azure Functions
```bash
func start
```

## API Request Format

### Before (Simple)
```json
{
  "user_id": "123",
  "task": "Complete math assignment",
  "step_granularity": "normal"
}
```

### After (Enhanced with User Profile)
```json
{
  "user_id": "123",
  "task": "Complete math assignment",
  "neurodivergence": "Autism",
  "step_granularity": "micro",
  "break_interval_minutes": 25,
  "fatigue_triggers": ["long paragraphs", "noise"],
  "ai_tone": ["calm"],
  "response_verbosity": 3
}
```

**Note**: All profile parameters are optional and have sensible defaults.

## Example Response
```json
{
  "task_id": 1,
  "step_number": 1,
  "step_text": "Open notebook to blank page",
  "estimated_time_minutes": 1
}
```

Full breakdown structure:
```json
{
  "task_name": "Math assignment",
  "dificulty_level": 3,
  "breakdown": [
    {
      "step_number": 1,
      "step_task": "Open notebook to blank page",
      "estimated_time_minutes": 1
    },
    {
      "step_number": 2,
      "step_task": "Write name and date at top",
      "estimated_time_minutes": 1
    }
    // ... more steps
  ]
}
```

## File Structure
```
backend/
├── ai/
│   ├── llm_client.py       # Groq LLM initialization
│   ├── schemas.py          # NeuroUserProfile, NeuroTaskBreakdown
│   ├── prompt.py           # Neurodivergent-friendly prompt template
│   └── task_breaker.py     # PII masking + chain invocation
├── task/
│   └── create_task.py      # Updated to use NeuroUserProfile
└── local.settings.json     # GROQ_API_KEY configuration
```

## Dependencies Added
- `langchain-groq`: Groq LLM integration
- `presidio-analyzer`: PII detection
- `presidio-anonymizer`: PII masking
- `spacy`: NLP model for Presidio
- `langchain-experimental`: Additional LangChain utilities

## Testing PII Masking

```python
from ai.task_breaker import mask_pii_presidio

# Test input
text = "I want to complete my assignment for John Smith"

# Masked output
# "I want to complete my assignment for [NAME]"
```

## Performance Notes
- **Presidio**: Adds ~100-200ms for PII detection
- **Groq API**: Fast inference (~1-2s for task breakdown)
- **Spacy Model**: ~500MB download, loads once at startup

## Troubleshooting

### Error: "GROQ_API_KEY not set"
Solution: Add your Groq API key to `local.settings.json`

### Error: "No module named 'presidio_analyzer'"
Solution: Run `pip install presidio-analyzer presidio-anonymizer`

### Error: "Can't find model 'en_core_web_lg'"
Solution: Run `python -m spacy download en_core_web_lg`

## Get Groq API Key
1. Go to https://console.groq.com/
2. Sign up / Log in
3. Navigate to API Keys
4. Create new API key
5. Copy and paste into `local.settings.json`

---

**Status**: ✅ Ready for testing
**Next Steps**: Test with frontend integration
