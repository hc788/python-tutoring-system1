export default async function handler(req, res) {
  try {
    const level = String((req.query.level || 'beginner')).toLowerCase();
    const levelOutline = ({
      beginner: 'syntax, types, variables, print/input, operators, strings, lists, conditionals, loops, basic functions',
      intermediate: 'lists/tuples/dicts/sets, list comprehensions, functions & *args/**kwargs, exceptions, modules, file I/O, OOP basics',
      advanced: 'generators/yield, decorators, context managers, asyncio, GIL & memory model, performance tips, patterns',
    }[level]) || 'syntax, types, variables, loops, functions';

    const schema = {
      type: 'object',
      properties: {
        questions: {
          type: 'array',
          minItems: 10,
          maxItems: 10,
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              question: { type: 'string' },
              options: {
                type: 'array', minItems: 4, maxItems: 4, items: { type: 'string' }
              },
              correct: { type: 'integer', minimum: 0, maximum: 3 },
              explanation: { type: 'string' },
            },
            required: ['id', 'question', 'options', 'correct', 'explanation'],
            additionalProperties: false,
          },
        },
      },
      required: ['questions'],
      additionalProperties: false,
    };

    const prompt = `
Generate 10 multiple-choice Python questions for the "${level}" level.
Cover: ${levelOutline}.
Rules:
- EXACTLY 4 options per question, plausible distractors.
- "correct" is the 0-based index into options.
- Provide a brief "explanation" for the right answer.
- IDs from 1..10.
Return ONLY JSON; no prose.
`.trim();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ questions: [], error: 'Missing OPENAI_API_KEY' });
    }

    // ✅ New Responses API: use text.format with json_schema
    const r = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        input: prompt,
        text: {
          format: {
            type: 'json_schema',
            name: 'QuestionSet',
            json_schema: {
              schema,
              strict: true
            }
          }
        }
      }),
    });

    const body = await r.json();
    if (!r.ok) {
      // Surface the exact reason to your frontend while you debug
      return res.status(500).json({
        questions: [],
        error: body?.error?.message || 'OpenAI call failed',
        details: body
      });
    }

    // Extract JSON string from Responses API
    let text = '';
    if (typeof body.output_text === 'string') {
      text = body.output_text;
    } else if (Array.isArray(body.output)) {
      const first = body.output.find(o => Array.isArray(o.content));
      const textPart = first?.content?.find(p => p.type === 'output_text' || p.type === 'text');
      text = textPart?.text || '';
    }

    if (!text) {
      return res.status(500).json({ questions: [], error: 'Empty response' });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(500).json({ questions: [], error: 'Invalid JSON from model', raw: text });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ questions: [], error: 'Server error', msg: String(err) });
  }
}
