import { getOSSClient } from "@/oss";

export async function GET(request: Request, { params }: { params: any }) {
  const src = params.src;
  const client = getOSSClient();
  try {
    const res = await client.getStream(src);
    return new Response(res.stream);
  } catch (error) {
    return new Response("not found");
  }
}
