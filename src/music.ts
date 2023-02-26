let audio: HTMLAudioElement | null = null;
export const playMusic = (blob: Blob): Promise<HTMLAudioElement | null> => {
  if (!audio) {
    audio = new Audio();
    audio.loop = true;
  }
  audio.src = URL.createObjectURL(blob);
  return new Promise(async (res, rej) => {
    await audio?.play().catch(rej);
    res(audio);
  });
};

export type Music = {
  name: string;
  authors: string | string[];
  albums?: string;
  song_15s_src?: string;
  image: {
    url: string;
  };
};

export const musics: Music[] = [
  {
    name: "Even LA",
    authors: ["Snareskin", "Twan Ray"],
    albums: "Even LA",
    image: {
      url: "/Even LA.png",
    },
    song_15s_src: "/Even-LA.wav",
  },
  {
    name: "失恋ソング沢山聴いて 泣いてばかりの私はもう。",
    authors: "りりあ。",
    albums: "Even LA",
    image: {
      url: "/riria.jpg",
    },
  },
  {
    name: "Even LA",
    authors: ["Snareskin", "Twan Ray"],
    albums: "Even LA",
    image: {
      url: "/Even LA.png",
    },
  },
  {
    name: "失恋ソング沢山聴いて 泣いてばかりの私はもう。",
    authors: "りりあ。",
    albums: "Even LA",
    image: {
      url: "/riria.jpg",
    },
  },
  {
    name: "Even LA",
    authors: ["Snareskin", "Twan Ray"],
    albums: "Even LA",
    image: {
      url: "/Even LA.png",
    },
  },
  {
    name: "失恋ソング沢山聴いて 泣いてばかりの私はもう。",
    authors: "りりあ。",
    albums: "Even LA",
    image: {
      url: "/riria.jpg",
    },
  },
  {
    name: "Even LA",
    authors: ["Snareskin", "Twan Ray"],
    albums: "Even LA",
    image: {
      url: "/Even LA.png",
    },
  },
  {
    name: "失恋ソング沢山聴いて 泣いてばかりの私はもう。",
    authors: "りりあ。",
    albums: "Even LA",
    image: {
      url: "/riria.jpg",
    },
  },
  {
    name: "Even LA",
    authors: ["Snareskin", "Twan Ray"],
    albums: "Even LA",
    image: {
      url: "/Even LA.png",
    },
  },
  {
    name: "失恋ソング沢山聴いて 泣いてばかりの私はもう。",
    authors: "りりあ。",
    albums: "Even LA",
    image: {
      url: "/riria.jpg",
    },
  },
  {
    name: "Even LA",
    authors: ["Snareskin", "Twan Ray"],
    albums: "Even LA",
    image: {
      url: "/Even LA.png",
    },
  },
  {
    name: "失恋ソング沢山聴いて 泣いてばかりの私はもう。",
    authors: "りりあ。",
    albums: "Even LA",
    image: {
      url: "/riria.jpg",
    },
  },
  {
    name: "Even LA",
    authors: ["Snareskin", "Twan Ray"],
    albums: "Even LA",
    image: {
      url: "/Even LA.png",
    },
  },
  {
    name: "失恋ソング沢山聴いて 泣いてばかりの私はもう。",
    authors: "りりあ。",
    albums: "Even LA",
    image: {
      url: "/riria.jpg",
    },
  },
  {
    name: "Even LA",
    authors: ["Snareskin", "Twan Ray"],
    albums: "Even LA",
    image: {
      url: "/Even LA.png",
    },
  },
  {
    name: "失恋ソング沢山聴いて 泣いてばかりの私はもう。",
    authors: "りりあ。",
    albums: "Even LA",
    image: {
      url: "/riria.jpg",
    },
  },
  {
    name: "Even LA",
    authors: ["Snareskin", "Twan Ray"],
    albums: "Even LA",
    image: {
      url: "/Even LA.png",
    },
  },
  {
    name: "失恋ソング沢山聴いて 泣いてばかりの私はもう。",
    authors: "りりあ。",
    albums: "Even LA",
    image: {
      url: "/riria.jpg",
    },
  },
  {
    name: "Even LA",
    authors: ["Snareskin", "Twan Ray"],
    albums: "Even LA",
    image: {
      url: "/Even LA.png",
    },
  },
  {
    name: "失恋ソング沢山聴いて 泣いてばかりの私はもう。",
    authors: "りりあ。",
    albums: "Even LA",
    image: {
      url: "/riria.jpg",
    },
  },
  {
    name: "Even LA",
    authors: ["Snareskin", "Twan Ray"],
    albums: "Even LA",
    image: {
      url: "/Even LA.png",
    },
  },
  {
    name: "失恋ソング沢山聴いて 泣いてばかりの私はもう。",
    authors: "りりあ。",
    albums: "Even LA",
    image: {
      url: "/riria.jpg",
    },
  },
  {
    name: "Even LA",
    authors: ["Snareskin", "Twan Ray"],
    albums: "Even LA",
    image: {
      url: "/Even LA.png",
    },
  },
  {
    name: "失恋ソング沢山聴いて 泣いてばかりの私はもう。",
    authors: "りりあ。",
    albums: "Even LA",
    image: {
      url: "/riria.jpg",
    },
  },
  {
    name: "Even LA",
    authors: ["Snareskin", "Twan Ray"],
    albums: "Even LA",
    image: {
      url: "/Even LA.png",
    },
  },
  {
    name: "失恋ソング沢山聴いて 泣いてばかりの私はもう。",
    authors: "りりあ。",
    albums: "Even LA",
    image: {
      url: "/riria.jpg",
    },
  },
  {
    name: "Even LA",
    authors: ["Snareskin", "Twan Ray"],
    albums: "Even LA",
    image: {
      url: "/Even LA.png",
    },
  },
  {
    name: "失恋ソング沢山聴いて 泣いてばかりの私はもう。",
    authors: "りりあ。",
    albums: "Even LA",
    image: {
      url: "/riria.jpg",
    },
  },
  {
    name: "Even LA",
    authors: ["Snareskin", "Twan Ray"],
    albums: "Even LA",
    image: {
      url: "/Even LA.png",
    },
  },
  {
    name: "失恋ソング沢山聴いて 泣いてばかりの私はもう。",
    authors: "りりあ。",
    albums: "Even LA",
    image: {
      url: "/riria.jpg",
    },
  },
  {
    name: "Even LA",
    authors: ["Snareskin", "Twan Ray"],
    albums: "Even LA",
    image: {
      url: "/Even LA.png",
    },
  },
  {
    name: "失恋ソング沢山聴いて 泣いてばかりの私はもう。",
    authors: "りりあ。",
    albums: "Even LA",
    image: {
      url: "/riria.jpg",
    },
  },
  {
    name: "Even LA",
    authors: ["Snareskin", "Twan Ray"],
    albums: "Even LA",
    image: {
      url: "/Even LA.png",
    },
  },
  {
    name: "失恋ソング沢山聴いて 泣いてばかりの私はもう。",
    authors: "りりあ。",
    albums: "Even LA",
    image: {
      url: "/riria.jpg",
    },
  },
  {
    name: "Even LA",
    authors: ["Snareskin", "Twan Ray"],
    albums: "Even LA",
    image: {
      url: "/Even LA.png",
    },
  },
  {
    name: "失恋ソング沢山聴いて 泣いてばかりの私はもう。",
    authors: "りりあ。",
    albums: "Even LA",
    image: {
      url: "/riria.jpg",
    },
  },
  {
    name: "Even LA",
    authors: ["Snareskin", "Twan Ray"],
    albums: "Even LA",
    image: {
      url: "/Even LA.png",
    },
  },
  {
    name: "失恋ソング沢山聴いて 泣いてばかりの私はもう。",
    authors: "りりあ。",
    albums: "Even LA",
    image: {
      url: "/riria.jpg",
    },
  },
  {
    name: "Even LA",
    authors: ["Snareskin", "Twan Ray"],
    albums: "Even LA",
    image: {
      url: "/Even LA.png",
    },
  },
  {
    name: "失恋ソング沢山聴いて 泣いてばかりの私はもう。",
    authors: "りりあ。",
    albums: "Even LA",
    image: {
      url: "/riria.jpg",
    },
  },
  {
    name: "Even LA",
    authors: ["Snareskin", "Twan Ray"],
    albums: "Even LA",
    image: {
      url: "/Even LA.png",
    },
  },
  {
    name: "失恋ソング沢山聴いて 泣いてばかりの私はもう。",
    authors: "りりあ。",
    albums: "Even LA",
    image: {
      url: "/riria.jpg",
    },
  },
  {
    name: "Even LA",
    authors: ["Snareskin", "Twan Ray"],
    albums: "Even LA",
    image: {
      url: "/Even LA.png",
    },
  },
  {
    name: "失恋ソング沢山聴いて 泣いてばかりの私はもう。",
    authors: "りりあ。",
    albums: "Even LA",
    image: {
      url: "/riria.jpg",
    },
  },
  {
    name: "Even LA",
    authors: ["Snareskin", "Twan Ray"],
    albums: "Even LA",
    image: {
      url: "/Even LA.png",
    },
  },
  {
    name: "失恋ソング沢山聴いて 泣いてばかりの私はもう。",
    authors: "りりあ。",
    albums: "Even LA",
    image: {
      url: "/riria.jpg",
    },
  },
  {
    name: "Even LA",
    authors: ["Snareskin", "Twan Ray"],
    albums: "Even LA",
    image: {
      url: "/Even LA.png",
    },
  },
  {
    name: "失恋ソング沢山聴いて 泣いてばかりの私はもう。",
    authors: "りりあ。",
    albums: "Even LA",
    image: {
      url: "/riria.jpg",
    },
  },
  {
    name: "Even LA",
    authors: ["Snareskin", "Twan Ray"],
    albums: "Even LA",
    image: {
      url: "/Even LA.png",
    },
  },
  {
    name: "失恋ソング沢山聴いて 泣いてばかりの私はもう。",
    authors: "りりあ。",
    albums: "Even LA",
    image: {
      url: "/riria.jpg",
    },
  },
  {
    name: "Even LA",
    authors: ["Snareskin", "Twan Ray"],
    albums: "Even LA",
    image: {
      url: "/Even LA.png",
    },
  },
  {
    name: "失恋ソング沢山聴いて 泣いてばかりの私はもう。",
    authors: "りりあ。",
    albums: "Even LA",
    image: {
      url: "/riria.jpg",
    },
  },
  {
    name: "Even LA",
    authors: ["Snareskin", "Twan Ray"],
    albums: "Even LA",
    image: {
      url: "/Even LA.png",
    },
  },
  {
    name: "失恋ソング沢山聴いて 泣いてばかりの私はもう。",
    authors: "りりあ。",
    albums: "Even LA",
    image: {
      url: "/riria.jpg",
    },
  },
  {
    name: "Even LA",
    authors: ["Snareskin", "Twan Ray"],
    albums: "Even LA",
    image: {
      url: "/Even LA.png",
    },
  },
  {
    name: "失恋ソング沢山聴いて 泣いてばかりの私はもう。",
    authors: "りりあ。",
    albums: "Even LA",
    image: {
      url: "/riria.jpg",
    },
  },
  {
    name: "Even LA",
    authors: ["Snareskin", "Twan Ray"],
    albums: "Even LA",
    image: {
      url: "/Even LA.png",
    },
  },
  {
    name: "失恋ソング沢山聴いて 泣いてばかりの私はもう。",
    authors: "りりあ。",
    albums: "Even LA",
    image: {
      url: "/riria.jpg",
    },
  },
  {
    name: "Even LA",
    authors: ["Snareskin", "Twan Ray"],
    albums: "Even LA",
    image: {
      url: "/Even LA.png",
    },
  },
  {
    name: "失恋ソング沢山聴いて 泣いてばかりの私はもう。",
    authors: "りりあ。",
    albums: "Even LA",
    image: {
      url: "/riria.jpg",
    },
  },
];
