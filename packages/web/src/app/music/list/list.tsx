import { Music } from "@/music";

async function MusicList() {
  const data: { musics: Music[] } = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATE}/music/list`,
    { cache: "no-cache" }
  ).then((res) => res.json());

  return (
    <table className="table-auto">
      <thead>
        <tr className="border">
          <th>ID</th>
          <th>Name</th>
          <th>censored</th>
        </tr>
      </thead>
      <tbody>
        {data.musics.map((music) => (
          <tr key={music.id} className="border">
            <td>{music.id}</td>
            <td>{music.name}</td>
            <td>
              <input
                className="checked:bg-red-500"
                type="checkbox"
                defaultChecked={music.censored}
                readOnly
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default MusicList;
