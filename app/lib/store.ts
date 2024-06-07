import Crunker from "crunker";
import { StateCreator, StoreMutatorIdentifier } from "zustand";
import { immer } from "zustand/middleware/immer";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

type CuraJamStore = {
  audioContext: AudioContext;
  currentAudioBuffer: AudioBuffer | null;
  currentSource: AudioBufferSourceNode | null;
  currentMixTape: string[];
  loadingMixTape: boolean;
  startTime: number;
  forwardBySeconds: 5 | 10;
  playPauseMusic: () => void;
  playMixTape: (ids?: string[]) => void;
  forwardBy: (seconds: number) => void;
  getArtist: (id?: string) => void;
};

type Immer = [StoreMutatorIdentifier, never];
type State<T> = StateCreator<T, [...[], Immer], []>;

const createStore = <T>(state: State<T>) =>
  createWithEqualityFn<T, [Immer]>(immer(state), shallow);

export const useCuraJamStore = createStore<CuraJamStore>((set, get) => ({
  audioContext: new AudioContext(),
  currentAudioBuffer: null,
  currentSource: null,
  currentMixTape: [],
  loadingMixTape: false,
  startTime: 0,
  forwardBySeconds: 10,
  playPauseMusic: () => {
    const { audioContext } = get();

    if (audioContext.state === "running") {
      audioContext.suspend();
    } else {
      audioContext.resume();
    }
  },
  playMixTape: async (ids) => {
    const { audioContext, currentSource, currentMixTape, loadingMixTape } =
      get();

    if (!ids || loadingMixTape) {
      return;
    }

    set({ loadingMixTape: true });

    let isDifferentMixTape = false;
    for (const [i, id] of ids.entries()) {
      if (id !== currentMixTape[i]) {
        isDifferentMixTape = true;
        set({ currentMixTape: ids });
        break;
      }
    }

    if (isDifferentMixTape) {
      const crunker = new Crunker({ sampleRate: 48000 });

      const responses = await Promise.all(
        ids.map((id) => {
          const params = new URLSearchParams({ id });
          return fetch(`/api/play?${params.toString()}`, {
            cache: "force-cache",
          });
        })
      );
      const buffers = await Promise.all(
        responses.map((response) => response.arrayBuffer())
      );
      const audioBuffers = await Promise.all(
        buffers.map((buffer) => audioContext.decodeAudioData(buffer))
      );

      if (currentSource) {
        currentSource.disconnect();
      }

      set((state) => {
        const audioBuffer = crunker.concatAudio(audioBuffers);
        state.currentAudioBuffer = audioBuffer;
        crunker.close();

        const source = state.audioContext.createBufferSource();
        source.buffer = state.currentAudioBuffer;
        source.connect(state.audioContext.destination);
        source.start(state.audioContext.currentTime);

        state.startTime = state.audioContext.currentTime;
        state.currentSource = source;
      });
    }

    set({ loadingMixTape: false });
  },
  forwardBy: (seconds) => {
    set((state) => {
      if (state.currentSource) {
        const currentTime = state.audioContext.currentTime;

        state.currentSource.disconnect();

        const source = state.audioContext.createBufferSource();
        source.buffer = state.currentAudioBuffer;
        source.connect(state.audioContext.destination);
        source.start(currentTime, currentTime - state.startTime + seconds);

        state.currentSource = source;
        state.startTime -= seconds;
      }
    });
  },
  getArtist: async (id) => {
    if (id) {
      const params = new URLSearchParams({ id: "niji no sora" });
      return fetch(`/api/artist?${params.toString()}`);
    }
  },
}));
