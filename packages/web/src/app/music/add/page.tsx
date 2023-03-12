"use client";

import { useState } from "react";
import { Select, Input, Button, Upload, message, Form, Divider } from "antd";
import { nanoid } from "nanoid";
import { atom, useAtom } from "jotai";
import { TrashIcon } from "@heroicons/react/24/outline";
import { checkAudioLength, loadAudioMetaData, Music } from "@/music";
import AuthenticationGuard from "../../components/AuthenticationGuard";
import { tokenAtom } from "@/state";
import { StyleProvider } from "@ant-design/cssinjs";
import AudioEditor from "../../components/AudioEditor";

type MusicInput = {
  nanoId: string;
  name: string;
  authors: string[];
  albums?: string;

  file?: any; //file
  cover?: any; //file

  coverPreview?: string;

  audioPreview?: string;
  audioPreviewBlob?: any; //File | Blob
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

  const handleMusicAppend = async () => {
    let passed = true;
    let msg = "";
    if (
      !musicInput.name ||
      !musicInput.authors ||
      !musicInput.file ||
      !musicInput.cover
    ) {
      passed = false;
      msg = "请填写表单";
    }
    // let user edit the audio.
    // if (musicInput.file) {
    //   audioPreview = URL.createObjectURL(musicInput.file);
    //   passed = (await checkAudioLength(audioPreview)) as boolean;
    //   if (!passed) msg = "音频长度超过15秒";
    // }
    if (!passed) {
      message.error(msg);
      return;
    }
    setMusics((musics) => [
      ...musics,
      {
        ...musicInput,

        coverPreview: musicInput.coverPreview
          ? musicInput.coverPreview
          : musicInput.cover && URL.createObjectURL(musicInput.cover),
        // audioPreview: musicInput.file && URL.createObjectURL(musicInput.file),
        audioPreviewBlob: musicInput.file,
        nanoId: nanoid(),
      },
    ]);
    setMusicInput(musicInputAtom.init);
  };

  const handleSongUpload = async (file: File) => {
    try {
      const { tags } = await loadAudioMetaData(file);
      setMusicInput((preInput) => ({
        ...preInput,
        name: tags.title,
        authors: tags.artist.split("/"),
        cover: tags.picture
          ? new Blob([new Uint8Array(tags.picture.data)])
          : null,
        file,
      }));
    } catch (error) {
      // console.error(error);
      // message.warning("无法检测到歌曲元信息");
      setMusicInput((preInput) => ({
        ...preInput,
        file,
      }));
    }
  };

  return (
    <StyleProvider hashPriority="high">
      <div className="flex flex-col gap-2">
        {musics.map((music, idx) => (
          <div
            key={music.nanoId}
            className="relative flex flex-col gap-2 rounded-lg border p-4"
          >
            <div>name: {music.name}</div>
            <div>artist:{music.authors.join("/")}</div>
            <div>
              <div>cover:</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="h-32" src={music.coverPreview} alt="" />
            </div>
            <div>
              <span>15s: </span>
              <AudioEditor id={music.nanoId} blob={music.audioPreviewBlob} />
              {/* <audio controls className="inline-block">
                <source src={music.audioPreview} />
              </audio> */}
            </div>
            <TrashIcon
              className="absolute top-0 right-0 m-4 w-5 cursor-pointer text-red-500"
              onClick={() => {
                setMusics((musics) => {
                  const nextMusics = [...musics];
                  const target = nextMusics[idx];
                  target.coverPreview &&
                    URL.revokeObjectURL(target.coverPreview);
                  target.audioPreview &&
                    URL.revokeObjectURL(target.audioPreview);
                  nextMusics.splice(idx, 1);
                  return nextMusics;
                });
              }}
            />
          </div>
        ))}

        {musics.length > 0 && (
          <>
            <Button onClick={handleSubmit} type="primary">
              提交
            </Button>

            <Divider />
          </>
        )}

        {/* Form */}
        <Form name="music" labelCol={{ span: 2 }}>
          <Form.Item label="name">
            <div>
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
            </div>
          </Form.Item>

          <Form.Item label="artist">
            <Select
              mode="tags"
              open={false}
              value={musicInput.authors}
              onChange={(value) => {
                setMusicInput((preInput) => ({
                  ...preInput,
                  authors: value,
                }));
              }}
            />
          </Form.Item>

          {/* song */}
          <Form.Item label="song">
            <Upload
              beforeUpload={handleSongUpload}
              fileList={musicInput.file ? [musicInput.file] : []}
              maxCount={1}
              accept=".mp3"
              onRemove={() => {
                setMusicInput((preInput) => ({
                  ...preInput,
                  file: undefined,
                }));
              }}
            >
              <Button className="w-24">15S</Button>
            </Upload>
          </Form.Item>

          {/* cover */}
          <Form.Item label="cover">
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
              onRemove={() => {
                setMusicInput((preInput) => ({
                  ...preInput,
                  cover: undefined,
                }));
              }}
            >
              <Button className="w-24">封面</Button>
            </Upload>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 2 }}>
            <Button
              disabled={musics.length >= 20}
              type="primary"
              onClick={handleMusicAppend}
            >
              添加到队列
            </Button>
            <span className="ml-2 align-bottom text-xs text-gray-500">
              {musics.length}/20
            </span>
          </Form.Item>
        </Form>
      </div>
    </StyleProvider>
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
