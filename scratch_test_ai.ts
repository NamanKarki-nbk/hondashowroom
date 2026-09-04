import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

async function run() {
  try {
    const frontImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="; // dummy 1x1 image
    const matches = frontImage.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)!;
    const buffer = Buffer.from(matches[2], 'base64');

    const result = await generateObject({
      model: google('gemini-1.5-flash'),
      schema: z.object({ test: z.string() }),
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'test' },
            { type: 'image', image: buffer }
          ]
        }
      ],
    });
    console.log("Success:", result.object);
  } catch (err) {
    console.error(err);
  }
}
run();
