"use client";

import { useState } from "react";
import { Select, Input, Button, Upload } from "antd";
import { nanoid } from "nanoid";
import { atom, useAtom } from "jotai";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Music } from "@/music";
import { tokenAtom } from "@/state";
import useSWR from "swr";

type MusicInput = {
  nanoId: string;
  name: string;
  authors: string[];
  albums?: string;

  file?: any; //file
  cover?: any; //file
};

const musicInputAtom = atom<MusicInput>({
  nanoId: "",
  name: "",
  authors: [],
});

function AddMusic() {
  const [musics, setMusics] = useState<MusicInput[]>([]);
  const [musicInput, setMusicInput] = useAtom(musicInputAtom);
  const [token, setToken] = useAtom(tokenAtom);
  const [tokenInput, setTokenInput] = useState("");

  const { data, mutate } = useSWR("authentication", () =>
    fetch(`/api/authentication?token=${token}`).then((res) => res.json())
  );

  const handleSubmit = async () => {
    if (!musics.length) return;
    const songs = new FormData();
    const covers = new FormData();
    for (const music of musics) {
      if (!music.file || !music.cover) {
        console.log("must file/cover");
        return;
      }
      songs.append("file", new File([music.file], music.nanoId));
      covers.append("file", new File([music.cover], music.nanoId));
    }

    const [songFileMap, coverFileMap] = await Promise.all([
      // song
      fetch(`${process.env.NEXT_PUBLIC_API_GATE}/upload/song`, {
        method: "POST",
        headers: {
          authorization: `Basic ${token}`,
        },
        body: songs,
      }).then((res) => res.json()),
      // cover
      fetch(`${process.env.NEXT_PUBLIC_API_GATE}/upload`, {
        method: "POST",
        headers: {
          authorization: `Basic ${token}`,
        },
        body: covers,
      }).then((res) => res.json()),
    ]);

    const musicsSchema: Partial<Music>[] = musics.map((music) => ({
      name: music.name,
      authors: music.authors,
      cover_src: coverFileMap[music.nanoId],
      song_15s_src: songFileMap[music.nanoId],
      albums: music.albums ?? music.name,
    }));

    fetch(`${process.env.NEXT_PUBLIC_API_GATE}/music`, {
      method: "POST",
      headers: {
        authorization: `Basic ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        musics: musicsSchema,
      }),
    }).then((res) => {
      setMusics([]);
      console.log(res);
    });
  };

  if (!data) return <div>loading</div>;

  if (data.role !== "master") {
    return (
      <>
        <Input
          value={tokenInput}
          onChange={(e) => setTokenInput(e.currentTarget.value)}
        />
        <Button
          onClick={() => {
            setToken(tokenInput);
            mutate(tokenInput);
          }}
        >
          Token
        </Button>
      </>
    );
  }

  return (
    <div>
      {musics.map((music, idx) => (
        <div key={music.nanoId}>
          <div>name: {music.name}</div>
          <div>author:{music.authors.join("/")}</div>
          <TrashIcon
            className="w-5 text-red-500"
            onClick={() => {
              setMusics((musics) => {
                const nextMusics = [...musics];
                nextMusics.splice(idx, 1);
                return nextMusics;
              });
            }}
          />
        </div>
      ))}
      <div className="flex gap-2">
        <Input
          className="w-36"
          value={musicInput.name}
          onChange={(e) =>
            setMusicInput((preInput) => ({
              ...preInput,
              name: e.currentTarget.value,
            }))
          }
        />
        <Select
          mode="tags"
          className="w-36"
          open={false}
          value={musicInput.authors}
          onChange={(value) => {
            setMusicInput((preInput) => ({
              ...preInput,
              authors: value,
            }));
          }}
        />

        {/* song */}
        <Upload
          beforeUpload={(file) => {
            setMusicInput((preInput) => ({
              ...preInput,
              file,
            }));
          }}
          fileList={musicInput.file ? [musicInput.file] : []}
          maxCount={1}
        >
          <Button>15S</Button>
        </Upload>

        {/* cover */}
        <Upload
          beforeUpload={(file) => {
            setMusicInput((preInput) => ({
              ...preInput,
              cover: file,
            }));
            return false;
          }}
          fileList={musicInput.cover ? [musicInput.cover] : []}
          maxCount={1}
        >
          <Button>封面</Button>
        </Upload>
        {musics.length < 20 && (
          <Button
            onClick={() => {
              setMusics((musics) => [
                ...musics,
                { ...musicInput, nanoId: nanoid() },
              ]);
              setMusicInput(musicInputAtom.init);
            }}
          >
            +
          </Button>
        )}
      </div>
      <Button onClick={handleSubmit} disabled={!musics.length}>
        提交
      </Button>
    </div>
  );
}

export default AddMusic;
