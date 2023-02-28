"use client";

import { useState } from "react";
import { Select, Input, Button, Upload, UploadFile } from "antd";
import { nanoid } from "nanoid";
import { atom, useAtom } from "jotai";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Music } from "@/music";
// import { Music } from "@/music";

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

  const handleSubmit = async () => {
    const songs = new FormData();
    const covers = new FormData();
    musics.forEach((music) => {
      console.log(music.file, music.cover);
      if (music.file) {
        songs.append("file", new File([music.file], music.nanoId));
      }
      if (music.cover) {
        covers.append("file", new File([music.cover], music.nanoId));
      }
    });

    const [songFileMap, coverFileMap] = await Promise.all([
      // song
      fetch("http://127.0.0.1:3500/upload", {
        method: "POST",
        body: songs,
      }).then((res) => res.json()),
      // cover
      fetch("http://127.0.0.1:3500/upload", {
        method: "POST",
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

    fetch("http://127.0.0.1:3500/music", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        musics: musicsSchema,
      }),
    }).then((res) => {
      console.log(res);
    });
  };

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
        <button
          className="w-12 border"
          onClick={() => {
            setMusics((musics) => [
              ...musics,
              { ...musicInput, nanoId: nanoid() },
            ]);
            setMusicInput(musicInputAtom.init);
          }}
        >
          +
        </button>
      </div>
      <Button onClick={handleSubmit}>提交</Button>
    </div>
  );
}

export default AddMusic;
