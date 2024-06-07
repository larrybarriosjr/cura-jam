import Innertube from "youtubei.js";

const IT = await Innertube.create();

const CuraJam = {
  getInfo: (id: string) => {
    return IT.music.getInfo(id);
  },
  getArtist: (id: string) => {
    return IT.music.getArtist(id);
  },
  search: (query: string) => {
    return IT.music.search(query, { type: "artist" });
  },
  stream: (id: string) => {
    return IT.download(id, {
      type: "audio",
      client: "YTMUSIC",
      quality: "bestefficiency",
    });
  },
};

export default CuraJam;
