// import { Inter } from "next/font/google";
import MusicList from "./components/MusicList";
import Music15sPlayer from "./components/Music15sPlayer";
import { Music } from "@/music";
import { PAGE_SIZE } from "@/const";

// const inter = Inter({ subsets: ["latin"] });

export default async function Home({
  searchParams,
}: {
  searchParams: { page: string | undefined };
}) {
  const { page = "0" } = searchParams;
  const data: { total: number } = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATE}/music/meta`,
    { cache: "no-store" }
  ).then((res) => res.json());

  return (
    <MusicList total={data.total}>
      {[...Array(parseInt(page) + 1)].map((_, idx) => {
        // @ts-ignore
        return <Page key={idx} page={idx} />;
      })}
    </MusicList>
  );
}

async function Page({ page }: { page: number }) {
  const data: { musics: Music[] } = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATE}/music?page=${page}&limit=${PAGE_SIZE}`
  ).then((res) => res.json());

  return data.musics.map((music, idx) => {
    return (
      <div key={idx} className="flex flex-col gap-2">
        <Music15sPlayer music={music} />

        <div>
          <div className="truncate font-bold" title={music.name}>
            {music.name}
          </div>
          <div className="truncate text-xs text-gray-500">
            {music.authors.join("/")}
          </div>
        </div>
      </div>
    );
  });
}
