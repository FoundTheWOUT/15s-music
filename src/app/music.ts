let audio: HTMLAudioElement | null = null;
export const playMusic = (blob: Blob) => {
  if (!audio) {
    audio = new Audio();
    audio.loop = true;
  }
  audio.src = URL.createObjectURL(blob);
  return audio.play();
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
