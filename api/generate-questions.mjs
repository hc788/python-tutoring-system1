import { strict } from 'assert';
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
      }[level] || 'syntax, types, variables, loops, functions';

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
- EXACTLY 4 options per question, plausible distractors.
- "correct" is the 0-based index into options.
- Provide a brief "explanation" for the right answer.
- IDs from 1..10.
Return ONLY JSON; no prose.
`.trim();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('Missing OPENAI_API_KEY');
      return res.status(500).json({ questions: [], error: 'Missing OPENAI_API_KEY' });
    }

    // ✅ Responses API: use text.format for Structured Outputs (json_schema)

    const r = await fetch('https://api.openai.com/v1/responses', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    input: prompt,
    text: {
      format: {
        type: 'json_schema',
        name: 'QuestionSet',
        schema,     // your JSON schema object
        strict: true
      }
    }
  }),
});


    // const r = await fetch('https://api.openai.com/v1/responses', {
    //   method: 'POST',
    //   headers: {
    //     Authorization: `Bearer ${apiKey}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     model: 'gpt-4o-mini',
    //     input: prompt,
    //     text: {
    //       format: {
    //         type: 'json_schema',
    //          name: 'QuestionSet', 
    //          schema,
    //          strict: true,
    //         json_schema: { name: 'QuestionSet', strict: true, schema },
    //       },
    //     },
    //   }),
    // });

    const body = await r.json();
    if (!r.ok) {
      console.error('OpenAI error:', body);
      return res.status(500).json({
        questions: [],
        error: body?.error?.message || 'OpenAI call failed'
      });
    }

    // const body = await r.json();
    // if (!r.ok) {
    //   console.error('OpenAI error:', body);
    //   return res.status(500).json({ questions: [], error: 'OpenAI call failed' });
    // }

    // Extract the JSON string from Responses API
    let text = '';
    if (typeof body.output_text === 'string') {
      text = body.output_text;
    } else if (Array.isArray(body.output)) {
      const first = body.output.find(o => Array.isArray(o.content));
      const textPart = first?.content?.find(p => p.type === 'output_text' || p.type === 'text');
      text = textPart?.text || '';
    }
    if (!text) {
      console.error('No text in OpenAI response:', body);
      return res.status(500).json({ questions: [], error: 'Empty response' });
    }

    const data = JSON.parse(text);
    return res.status(200).json(data);
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ questions: [], error: 'Server error' });
  }
}

// export default async function handler(req, res) {
//   try {
//     const level = String((req.query.level || 'beginner')).toLowerCase();

//     const levelOutline =
//       {
//         beginner:
//           'syntax, types, variables, print/input, operators, strings, lists, conditionals, loops, basic functions',
//         intermediate:
//           'lists/tuples/dicts/sets, list comprehensions, functions & *args/**kwargs, exceptions, modules, file I/O, OOP basics',
//         advanced:
//           'generators/yield, decorators, context managers, asyncio, GIL & memory model, performance tips, patterns',
//       }[level] || 'syntax, types, variables, loops, functions';

//     const schema = {
//       type: 'object',
//       properties: {
//         questions: {
//           type: 'array',
//           minItems: 10,
//           maxItems: 10,
//           items: {
//             type: 'object',
//             properties: {
//               id: { type: 'integer' },
//               question: { type: 'string' },
//               options: {
//                 type: 'array',
//                 minItems: 4,
//                 maxItems: 4,
//                 items: { type: 'string' },
//               },
//               correct: { type: 'integer', minimum: 0, maximum: 3 },
//               explanation: { type: 'string' },
//             },
//             required: ['id', 'question', 'options', 'correct', 'explanation'],
//             additionalProperties: false,
//           },
//         },
//       },
//       required: ['questions'],
//       additionalProperties: false,
//     };

//     const prompt = `
// Generate 10 multiple-choice Python questions for the "${level}" level.
// Cover: ${levelOutline}.
// Rules:
// - EXACTLY 4 options per question, plausible distractors.
// - "correct" is the 0-based index into options.
// - Provide a brief "explanation" for the right answer.
// - IDs from 1..10.
// Return ONLY JSON; no prose.
// `.trim();

//     const apiKey = process.env.OPENAI_API_KEY;
//     if (!apiKey) {
//       console.error('Missing OPENAI_API_KEY');
//       return res.status(500).json({ questions: [], error: 'Missing OPENAI_API_KEY' });
//     }

//     // Use the REST Responses API (no SDK/version issues)
//     const r = await fetch('https://api.openai.com/v1/responses', {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${apiKey}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         model: 'gpt-4o-mini',
//         input: prompt,
//         response_format: {
//           type: 'json_schema',
//           json_schema: { name: 'QuestionSet', strict: true, schema },
//         },
//       }),
//     });

//     const body = await r.json();
//     if (!r.ok) {
//       console.error('OpenAI error:', body);
//       return res.status(500).json({ questions: [], error: 'OpenAI call failed' });
//     }

//     // Extract text robustly from Responses API
//     let text = '';
//     if (typeof body.output_text === 'string') {
//       text = body.output_text;
//     } else if (Array.isArray(body.output)) {
//       const first = body.output.find(o => Array.isArray(o.content));
//       const textPart = first?.content?.find(p => p.type === 'output_text' || p.type === 'text');
//       text = textPart?.text || '';
//     }
//     if (!text) {
//       console.error('No text in OpenAI response:', body);
//       return res.status(500).json({ questions: [], error: 'Empty response' });
//     }

//     const data = JSON.parse(text);
//     return res.status(200).json(data);
//   } catch (err) {
//     console.error('Server error:', err);
//     return res.status(500).json({ questions: [], error: 'Server error' });
//   }
// }
