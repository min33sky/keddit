import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  /**
   ** 해당 URL을 파싱하여 OG 정보를 가져와서 리턴하는 API
   */
  const url = new URL(req.url);
  const href = url.searchParams.get('url');

  if (!href) {
    return NextResponse.json(
      {
        message: 'url 파라미터가 필요합니다.',
      },
      {
        status: 400,
      },
    );
  }

  const res = await axios.get(href);

  // Parse the HTML using regular expressions
  const titleMatch = res.data.match(/<title>(.*?)<\/title>/);
  const title = titleMatch ? titleMatch[1] : '';

  const descriptionMatch = res.data.match(
    /<meta name="description" content="(.*?)"/,
  );
  const description = descriptionMatch ? descriptionMatch[1] : '';

  const imageMatch = res.data.match(
    /<meta property="og:image" content="(.*?)"/,
  );
  const imageUrl = imageMatch ? imageMatch[1] : '';

  // Return the data in the format required by the editor tool
  return new Response(
    JSON.stringify({
      success: 1,
      meta: {
        title,
        description,
        image: {
          url: imageUrl,
        },
      },
    }),
  );
}
