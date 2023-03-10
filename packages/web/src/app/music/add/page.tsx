"use client";

import { useState } from "react";
import { Select, Input, Button, Upload } from "antd";
import { nanoid } from "nanoid";
import { atom, useAtom } from "jotai";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Music } from "@/music";
import AuthenticationGuard from "../../components/AuthenticationGuard";
import { tokenAtom } from "@/state";

type MusicInput = {
  nanoId: string;
  name: string;
  authors: string[];
  albums?: string;

  file?: any; //file
  cover?: any; //file

  coverPreview?: string;
  audioPreview?: string;
};

const musicInputAtom = atom<MusicInput>({
  nanoId: "",
  name: "",
  authors: [],
});

function AddMusic() {
  const [musics, setMusics] = useState<MusicInput[]>([]);
  const [musicInput, setMusicInput] = useAtom(musicInputAtom);
  const [token] = useAtom(tokenAtom);

  const handleSubmit = async () => {
    if (!musics.length) return;
    const songs = new FormData();
    const covers = new FormData();
    for (const music of musics) {
      // if (!music.file || !music.cover) {
      //   console.log("must file/cover");
      //   return;
      // }

      songs.append("file", new File([music.file], music.nanoId));
      covers.append("file", new File([music.cover], music.nanoId));
    }

    try {
      // return map of nanoid to file src
      const [songFileMap, coverFileMap] = await Promise.all([
        // song
        fetch(`${process.env.NEXT_PUBLIC_API_GATE}/upload/song`, {
          method: "POST",
          headers: {
            authorization: `Basic ${token}`,
          },
          body: songs,
        }).then((res) => {
          if (res.ok) return res.json();
          throw new Error("reason");
        }),
        // cover
        fetch(`${process.env.NEXT_PUBLIC_API_GATE}/upload/image`, {
          method: "POST",
          headers: {
            authorization: `Basic ${token}`,
          },
          body: covers,
        }).then((res) => {
          if (res.ok) return res.json();
          throw new Error("reason");
        }),
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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {musics.map((music, idx) => (
        <div
          key={music.nanoId}
          className="relative flex flex-col gap-2 rounded-lg border p-4"
        >
          <div>name: {music.name}</div>
          <div>author:{music.authors.join("/")}</div>
          <div>
            <div>cover:</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="h-32" src={music.coverPreview} alt="" />
          </div>
          <div>
            <span>15s: </span>
            <audio controls className="inline-block">
              <source src={music.audioPreview} />
            </audio>
          </div>
          <TrashIcon
            className="absolute top-0 right-0 m-4 w-5 cursor-pointer text-red-500"
            onClick={() => {
              setMusics((musics) => {
                const nextMusics = [...musics];
                const target = nextMusics[idx];
                target.coverPreview && URL.revokeObjectURL(target.coverPreview);
                target.audioPreview && URL.revokeObjectURL(target.audioPreview);
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
          className="flex-1"
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
          <Button className="w-24">15S</Button>
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
          <Button className="w-24">封面</Button>
        </Upload>
        {musics.length < 20 && (
          <Button
            onClick={() => {
              setMusics((musics) => [
                ...musics,
                {
                  ...musicInput,
                  coverPreview: URL.createObjectURL(musicInput.cover),
                  audioPreview: URL.createObjectURL(musicInput.file),
                  nanoId: nanoid(),
                },
              ]);
              setMusicInput(musicInputAtom.init);
            }}
          >
            +
          </Button>
        )}
      </div>
      <Button
        className="mt-2 ml-auto"
        onClick={handleSubmit}
        disabled={!musics.length}
      >
        提交
      </Button>
    </div>
  );
}

function AddMusicPage() {
  return (
    <AuthenticationGuard allowGuest>
      <AddMusic />
    </AuthenticationGuard>
  );
}

export default AddMusicPage;
