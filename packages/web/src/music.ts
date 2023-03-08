export type { Music } from "@15s-music/server/src/entry";

// 定义一个函数，将一个数值从一个范围映射到另一个范围
function map(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) {
  // 使用线性插值的公式，返回映射后的数值
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

const FFT_SIZE = 512;

export class MusicPlayer {
  frameId = 0;
  audio: HTMLAudioElement | undefined;
  audioContext: AudioContext | undefined;
  analyser: AnalyserNode | undefined;
  dataArray = new Uint8Array(FFT_SIZE / 2);

  // Audio context should create after user gesture
  setupCtx() {
    if (!this.audio) {
      this.audio = new Audio();
      this.audio.loop = true;
    }
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
      // analyser setup
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = FFT_SIZE;

      // source setup
      const source = this.audioContext.createMediaElementSource(this.audio);
      source.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);
    }
  }

  play(buffer: ArrayBuffer) {
    this.setupCtx();
    return new Promise(async (res, rej) => {
      if (!this.audio) {
        rej("Audio not init");
        return;
      }
      const blob = new Blob([buffer], { type: "audio/mp3" });
      if (this.audio?.src) {
        URL.revokeObjectURL(this.audio.src);
      }
      this.audio.src = URL.createObjectURL(blob);
      await this.audio?.play().catch(rej);
      this.dance();
      res(this);
    });
  }

  pause() {
    this.audio?.pause();
    cancelAnimationFrame(this.frameId);
  }

  dance() {
    if (!this.analyser) return;

    this.frameId = requestAnimationFrame(() => {
      this.dance();
    });
    // 更新频率数据
    this.analyser.getByteTimeDomainData(this.dataArray);
    // 定义一个变量来存储总振幅
    let sum = 0;

    // 遍历数组中的每个元素，并累加它们的绝对值
    for (var i = 0; i < this.analyser.frequencyBinCount; i++) {
      sum += Math.abs(this.dataArray[i] - 128);
    }

    // 返回平均振幅，即总振幅除以数组长度
    document.documentElement.style.setProperty(
      "--amplitude",
      map(sum / this.analyser.frequencyBinCount, 0, 128, 1, 1.2).toString()
    );
  }
}
