// import { Inter } from "next/font/google";
import MusicList from "./components/MusicList";
import AutoPlaySwitch from "./components/AutoPlaySwitch";
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
    `http://127.0.0.1:3500/music/meta`,
    { cache: "no-store" }
  ).then((res) => res.json());

  return (
    <main className="mx-auto max-w-7xl">
      {/* header */}
      <header className="sticky top-2 z-50 my-2 flex justify-between rounded-xl p-2 backdrop-blur">
        <span className="bg-gradient-to-r from-[#ec008c] to-[#fc6767] bg-clip-text text-3xl font-extrabold text-transparent ">
          15S Music
        </span>
        <AutoPlaySwitch />
      </header>
      {/* music list */}
      <MusicList total={data.total}>
        {[...Array(parseInt(page) + 1)].map((_, idx) => {
          // @ts-ignore
          return <Page key={idx} page={idx} />;
        })}
      </MusicList>
    </main>
  );
}

async function Page({ page }: { page: number }) {
  const data: { musics: Music[] } = await fetch(
    `http://127.0.0.1:3500/music?page=${page}&limit=${PAGE_SIZE}`
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
