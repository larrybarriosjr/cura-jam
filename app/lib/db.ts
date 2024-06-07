import { UUIDv4 } from "@/app/utils/string";
import Dexie, { Table } from "dexie";

interface MixTape {
  id: UUIDv4;
  list: string[];
}

interface Music {
  id: UUIDv4;
  ytId: string;
  lyrics: string;
}

class CuraJamDexie extends Dexie {
  mixtape!: Table<MixTape>;
  music!: Table<Music>;

  constructor() {
    super("cura-jam-db");
    this.version(1)
      .stores({ mixtape: "id, list" })
      .stores({ music: "id, ytId, lyrics" });
  }
}

export const db = new CuraJamDexie();
