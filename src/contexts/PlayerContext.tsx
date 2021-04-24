import { createContext, useState, ReactNode } from 'react';

import { IEpisode } from '../utils/interfaces/Episode';

export interface IPlayerEpisode extends Pick<IEpisode, 'title'  | 'thumbnail' | 'members'> {
   url: string;
   duration: number;
}

interface IPlayerContextData {
   isPlaying: boolean;

   episodeIndex: number;
   episodeList: IPlayerEpisode[];
   currentEpisode: IPlayerEpisode;

   SetPlayState: (state: boolean) => void;
   TogglePlay: () => void;

   PlayAnEpisode: (episode: IPlayerEpisode) => void;
}

const PlayerContext = createContext( {} as IPlayerContextData );
export default PlayerContext;

interface IPlayerContextProps {
   children: ReactNode;
}

export function PlayerContextProvider( { children }: IPlayerContextProps ) {

   const [isPlaying, setIsPlaying] = useState(false);

   const [currentEpisode, setCurrentEpisode] = useState( null as IPlayerEpisode );
   const [episodeList, setEpisodeList] = useState([] as IPlayerEpisode[]);
   const [episodeIndex, setEpisodeIndex] = useState(0);

   function SetPlayState( state: boolean ) {
      setIsPlaying(state);
   }

   function TogglePlay() {
      SetPlayState(!isPlaying);
   }

   function PlayAnEpisode( episode: IPlayerEpisode ) {
      SetPlayState(true);

      setCurrentEpisode(episode);
      setEpisodeList([episode]);
      setEpisodeIndex(0);
   }

   // ***

   return (
      <PlayerContext.Provider value={{
         isPlaying

         , currentEpisode
         , episodeList
         , episodeIndex

         , SetPlayState
         , TogglePlay

         , PlayAnEpisode
      }}>
         { children }
      </PlayerContext.Provider>
   );
}