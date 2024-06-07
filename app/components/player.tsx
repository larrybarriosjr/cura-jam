"use client";

import { db } from "@/app/lib/db";
import { useCuraJamStore } from "@/app/lib/store";
import { trimWhiteSpaceOnly, uuid } from "@/app/utils/string";
import { useLiveQuery } from "dexie-react-hooks";
import DOMPurify from "dompurify";

// window.AudioContext ||= window.webkitAudioContext;

const mixTape = [
  "p3HUjxoJjnQ", // laser sfx
  "utqcdq6AqZg", // Cinderella by Cider Girl
  "AgCfuE_IfrI", // シンパシー by kitri
];

const Player = () => {
  const {
    loadingMixTape,
    forwardBySeconds,
    playPauseMusic,
    playMixTape,
    forwardBy,
    getArtist,
  } = useCuraJamStore((state) => state);

  const mixtape = useLiveQuery(() => db.mixtape.toArray());
  const musics = useLiveQuery(() => db.music.toArray());

  const addIds = async () => {
    const id = uuid();
    const res = await db.mixtape.add({ id, list: mixTape });
    console.log(res);
  };

  const forward = () => {
    forwardBy(forwardBySeconds);
  };

  const deleteIds = async () => {
    await db.mixtape.clear();
    console.log("Deleted");
  };

  const addLyrics = async () => {
    const id = uuid();
    const lyrics =
      "Lorems, ipsum dolor sit amet consectetur adipisicing        &gt; elit.\nSaepe illum vero, facilis rem temporibus hic, nihil placeat\nnobis sunt nemo veritatis debitis odit nesciunt minus ab, laboriosam porro soluta iste.sayo na ra";
    await db.music.add({
      id,
      ytId: "utqcdq6AqZg",
      lyrics: trimWhiteSpaceOnly(lyrics),
    });
  };

  return (
    <span>
      <button
        style={{ display: "block", margin: "12px" }}
        onClick={playPauseMusic}
      >
        Play/Pause me!
      </button>
      <button style={{ display: "block", margin: "12px" }} onClick={addIds}>
        Add me!
      </button>
      <button style={{ display: "block", margin: "12px" }} onClick={forward}>
        Forward me!
      </button>
      <button style={{ display: "block", margin: "12px" }} onClick={deleteIds}>
        Delete me!
      </button>
      <button
        style={{ display: "block", margin: "12px" }}
        onClick={() => getArtist("post")}
      >
        Artist me!
      </button>
      {mixtape?.map((music) => (
        <div key={music.id}>
          <button
            disabled={loadingMixTape}
            onClick={() => playMixTape(music.list)}
          >
            {music.id}
            {loadingMixTape && "..."}
          </button>
        </div>
      ))}
      <button onClick={addLyrics}>Add lyrics</button>
      {musics?.map((music) => (
        <p
          key={music.id}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(music.lyrics) }}
          style={{ whiteSpace: "pre-line" }}
        />
      ))}
    </span>
  );
};

export default Player;
