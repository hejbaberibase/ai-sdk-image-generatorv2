// app/api/generate-images/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { experimental_generateImage as generateImage } from 'ai';
import { openai } from '@ai-sdk/openai';

const DEFAULT_IMAGE_SIZE = '1024x1024';

export async function POST(req: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  const { prompt, modelId = 'dall-e-3' } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt saknas' }, { status: 400 });
  }

  try {
    const startstamp = performance.now();

    const result = await generateImage({
      model: openai.image(modelId),
      prompt,
      size: DEFAULT_IMAGE_SIZE,
    });

    console.log(
      `✅ Bild genererad [requestId=${requestId}, model=${modelId}, tid=${(
        (performance.now() - startstamp) /
        1000
      ).toFixed(1)}s]`
    );

    return NextResponse.json({
      provider: 'openai',
      image: result.image.base64,
    });
  } catch (error) {
    console.error(
      `❌ Fel vid bildgenerering [requestId=${requestId}]:`,
      error
    );
    return NextResponse.json(
      { error: 'Kunde inte generera bild. Försök igen.' },
      { status: 500 }
    );
  }
}
