import OpenAI from 'openai';

export default async function handler(req, res) {
  try {
    const level = String((req.query.level || 'beginner')).toLowerCase();

    const levelOutline =
      {
        beginner:
          'syntax, types, variables, print/input, operators, strings, lists, conditionals, loops, basic functions',
        intermediate:
          'lists/tuples/dicts/sets, list comprehensions, functions & *args/**kwargs, exceptions, modules, file I/O, OOP basics',
        advanced:
          'generators/yield, decorators, context managers, asyncio, GIL & memory model, performance tips, patterns',
      }[level] ||
      'syntax, types, variables, loops, functions';

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // JSON Schema for STRICT structured outputs
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
                type: 'array',
                minItems: 4,
                maxItems: 4,
                items: { type: 'string' },
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
- EXACTLY 4 options per question, with plausible distractors.
- "correct" is the 0-based index into options.
- Provide a brief "explanation" for the right answer.
- IDs from 1..10.
Return ONLY JSON; no prose.
`.trim();

    // Responses API + Structured Outputs (strict JSON Schema)
    const resp = await client.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
      response_format: {
        type: 'json_schema',
        json_schema: { name: 'QuestionSet', strict: true, schema },
      },
    });

    // SDK convenience: aggregate text into one string
    // (documented `output_text` helper)
    const data = JSON.parse(resp.output_text);
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ questions: [], error: 'Failed to generate questions' });
  }
}
