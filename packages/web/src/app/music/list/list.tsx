import { Music } from "@/utils/music";
import { STATIC_HOST } from "../../../const";
import MusicPreviewPlayer from "../../components/MuiscPreviewPlayer";

async function MusicList() {
  const data: { musics: Music[] } = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATE}/music/list`,
    {
      cache: "no-cache",
      headers: {
        authorization: `Basic ${process.env.MASTER_TOKEN}`,
      },
    }
  ).then((res) => res.json());

  return (
    <table className="w-full table-auto">
      <thead>
        <tr className="h-9 border">
          <th />
          <th className="w-8">ID</th>
          <th>Name</th>
          <th>Censored</th>
          <th>Audio</th>
        </tr>
      </thead>
      <tbody>
        {data.musics.map((music) => (
          <tr key={music.id} className="border">
            <td className="px-2">
              <input type="checkbox" className="h-4 w-4" />
            </td>
            <td className="px-4">{music.id}</td>
            <td>{music.name}</td>
            <td>{music.censored ? "✔" : "❌"}</td>
            <td className="px-2">
              <MusicPreviewPlayer
                src={`${STATIC_HOST}/${music.song_15s_src}`}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default MusicList;
