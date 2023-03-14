"use client";

import { useEffect, useRef, useState } from "react";
import { Select, Input, Button, Upload, message, Form, Divider } from "antd";
import { nanoid } from "nanoid";
import { atom, useAtom } from "jotai";
import { ArrowUpOnSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { loadAudioMetaData, Music } from "@/music";
import { StyleProvider } from "@ant-design/cssinjs";
import AudioEditor from "../../components/AudioEditor";
import WaveSurfer from "wavesurfer.js";
// import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import type { FFmpeg } from "@ffmpeg/ffmpeg";
import { generateFilename } from "@/utils";

type MusicInput = {
  nanoId: string;
  name: string;
  authors: string[];
  albums?: string;

  file?: any; //file
  cover?: any; //file

  coverPreview?: string;

  audioPreview?: string;
  audioPreviewBlob?: Blob;

  wavesurferRef?: WaveSurfer;
};

const musicInputAtom = atom<MusicInput>({
  nanoId: "",
  name: "",
  authors: [],
});

let ffmpeg: FFmpeg | null = null;
const cutAudio = async (id: string, blob: Blob, start: number, end: number) => {
  const {
    default: { createFFmpeg, fetchFile },
  } = await import("@/compiled/ffmpeg.min.js");
  if (!ffmpeg) {
    ffmpeg = createFFmpeg({
      log: true,
      // TODO
      //corePath:new URL('static/js/ffmpeg-core.js', document.location).href
    }) as FFmpeg;
    await ffmpeg.load();
  }
  ffmpeg.FS("writeFile", `${id}-in.mp3`, await fetchFile(blob));
  await ffmpeg.run(
    "-i",
    `${id}-in.mp3`,
    "-ss",
    start.toString(),
    "-to",
    end.toString(),
    `${id}-out.mp3`
  );
  const data = ffmpeg.FS("readFile", `${id}-out.mp3`);
  return new Blob([data.buffer], { type: "audio/mp3" });
};

function AddMusic() {
  const [musics, setMusics] = useState<MusicInput[]>([]);
  const [musicInput, setMusicInput] = useAtom(musicInputAtom);
  const editorRefs = useRef<any[]>([]);

  useEffect(() => {
    editorRefs.current = editorRefs.current.slice(0, musics.length);
  }, [musics.length]);

  const handleSubmit = async () => {
    if (!musics.length) return;
    const form = new FormData();
    // cut audio
    try {
      // TODO: cut audio parallel.
      // const cutAudioList = await Promise.all(
      //   musics.map(async (music, index) => {
      //     const editorRef = editorRefs.current[index];
      //     const wavesurfer = editorRef.wavesurferRef.current as WaveSurfer;
      //     const regions = Object.values(wavesurfer.regions.list ?? {});
      //     // cut audio if has region
      //     if (regions.length) {
      //       const { start, end } = regions[0];
      //       return await cutAudio(music.nanoId, music.file, start, end);
      //     }
      //     // return the audio directly.
      //     return music.file as Blob;
      //   })
      // );
      for (let index = 0; index < musics.length; index++) {
        const music = musics[index];
        if (!music.file || !music.cover) {
          message.error("必须上传封面/音乐");
          return;
        }
        const editorRef = editorRefs.current[index];
        const wavesurfer = editorRef.wavesurferRef.current as WaveSurfer;
        const regions = Object.values(wavesurfer.regions.list ?? {});
        // cut audio if has region
        if (regions.length) {
          const { start, end } = regions[0];
          music.file = await cutAudio(music.nanoId, music.file, start, end);
        }

        const filename = await generateFilename();
        form.append(
          "audio",
          new File([music.file], `${music.nanoId}:${filename}.mp3`)
        );
        form.append(
          "cover",
          new File(
            [music.cover],
            `${music.nanoId}:${await generateFilename()}.webp`
          )
        );
      }
    } catch (error) {
      console.error(error);
      message.error("裁剪失败");
      return;
    }

    try {
      // return map of nanoid to file src
      const fileMap = await fetch(
        `${process.env.NEXT_PUBLIC_API_GATE}/upload/once`,
        {
          method: "POST",
          body: form,
        }
      ).then((res) => {
        if (res.ok) return res.json();
        message.error("Upload fail...");
      });

      const musicsSchema: Partial<Music>[] = musics.map((music) => ({
        name: music.name,
        authors: music.authors,
        cover_src: fileMap.cover[music.nanoId],
        song_15s_src: fileMap.audio[music.nanoId],
        albums: music.albums ?? music.name,
      }));

      fetch(`${process.env.NEXT_PUBLIC_API_GATE}/music`, {
        method: "POST",
        headers: {
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
            className="relative flex flex-col gap-2 rounded-lg border border-primary p-4"
          >
            {/* header */}
            <div>
              <div className="font-bold">{music.name}</div>
              <div className="text-sm text-gray-500">
                {music.authors.join("/")}
              </div>
            </div>

            {/* cover & previewer */}
            <div className="flex gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="h-32 rounded-lg shadow-xl"
                src={music.coverPreview}
                alt=""
              />
              <div className="flex-1">
                {music.audioPreviewBlob && (
                  <AudioEditor
                    ref={(ref) => (editorRefs.current[idx] = ref)}
                    id={music.nanoId}
                    blob={music.audioPreviewBlob}
                  />
                )}
              </div>
            </div>

            <TrashIcon
              className="btn icon absolute top-0 right-0 m-4 w-6 cursor-pointer rounded text-red-500"
              onClick={() => {
                // ! destroy wavesurfer here
                music.wavesurferRef?.destroy();
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
            <button
              className="btn rounded bg-primary py-2 font-bold text-white"
              onClick={handleSubmit}
            >
              提交
            </button>

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
            <Upload.Dragger
              beforeUpload={handleSongUpload}
              fileList={musicInput.file ? [musicInput.file] : []}
              maxCount={1}
              accept="audio/*"
              onRemove={() => {
                setMusicInput((preInput) => ({
                  ...preInput,
                  file: undefined,
                }));
              }}
            >
              <div className="mx-auto">
                <ArrowUpOnSquareIcon className="mx-auto w-12 text-[#3875f6]" />
                <p className="mt-3 font-bold text-[#3875f6]">
                  上传15秒音乐(.mp3)
                </p>
                <p className="text-xs text-gray-500">
                  可以上传完整音乐进行后续裁剪
                </p>
                <p className="text-xs text-gray-500">
                  如果音乐文件自带封面，作者等信息会自动填写表单哦
                </p>
              </div>
            </Upload.Dragger>
          </Form.Item>

          {/* cover */}
          <Form.Item label="cover">
            <Upload.Dragger
              beforeUpload={(file) => {
                setMusicInput((preInput) => ({
                  ...preInput,
                  cover: file,
                }));
                return false;
              }}
              accept="image/*"
              fileList={musicInput.cover ? [musicInput.cover] : []}
              maxCount={1}
              onRemove={() => {
                setMusicInput((preInput) => ({
                  ...preInput,
                  cover: undefined,
                }));
              }}
            >
              <div className="mx-auto">
                <ArrowUpOnSquareIcon className="mx-auto w-12 text-[#3875f6]" />
                <p className="mt-3 font-bold text-[#3875f6]">
                  上传封面(.png/.jpeg/.webp)
                </p>
              </div>
            </Upload.Dragger>
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
            <Button
              className="ml-2"
              onClick={() => {
                setMusicInput(musicInputAtom.init);
              }}
            >
              重置
            </Button>
          </Form.Item>
        </Form>
      </div>
    </StyleProvider>
  );
}

export default AddMusic;
