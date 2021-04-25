import { useContext, createContext, useState, useEffect, ReactNode } from 'react';

import { IEpisode } from '../utils/interfaces/Episode';

export interface IPlayerEpisode extends Pick<IEpisode, 'title'  | 'thumbnail' | 'members' | 'url' | 'duration'> {}

interface IPlayerContextData {
   episodeIndex: number;
   episodeList: IPlayerEpisode[];
   currentEpisode: IPlayerEpisode;

   isPlaying: boolean;
   isLooping: boolean;
   isShuffling: boolean;
   hasPrevious: boolean;
   hasNext: boolean;

   SetPlayState: (state: boolean) => void;
   TogglePlay: () => void;
   ToggleLoop: () => void;
   ToggleShuffle: () => void;

   PlayPrevious: () => void;
   PlayNext: () => void;
   ClearPlayState: () => void;
   PlayAnEpisode: (episode: IPlayerEpisode) => void;
   PlayAList: (episodes: IPlayerEpisode[], index: number) => void;
}

export const PlayerContext = createContext( {} as IPlayerContextData );

interface IPlayerContextProviderProps {
   children: ReactNode;
}

export function PlayerContextProvider( { children }: IPlayerContextProviderProps ) {

   const [currentEpisode, setCurrentEpisode] = useState( null as IPlayerEpisode );
   const [episodeList, setEpisodeList] = useState([] as IPlayerEpisode[]);
   const [episodeIndex, setEpisodeIndex] = useState( -1 );

   const [isPlaying, setIsPlaying] = useState(false);
   const [isLooping, setIsLooping] = useState(false);
   const [isShuffling, setIsShuffling] = useState(false);
   const hasPrevious = episodeIndex > 0;
   const hasNext = isShuffling || ( episodeIndex + 1 ) < episodeList.length;

   useEffect( () => setCurrentEpisode( episodeList[episodeIndex] || null ), [episodeIndex]);

   function SetPlayState( state: boolean ) {
      setIsPlaying(state);
   }

   function TogglePlay() {
      SetPlayState(!isPlaying);
   }

   function ToggleLoop() {
      setIsLooping(!isLooping);
   }

   function ToggleShuffle() {
      setIsShuffling(!isShuffling);
   }

   function ClearPlayState() {
      SetPlayState(false);

      setEpisodeList([]);
      setEpisodeIndex(0);
   }

   function PlayAnEpisode( episode: IPlayerEpisode ) {
      SetPlayState(true);

      setEpisodeList([episode]);
      setEpisodeIndex(0);
   }

   function PlayAList( episodes: IPlayerEpisode[], index: number ) {
      SetPlayState(true);

      setEpisodeList(episodes);
      setEpisodeIndex(index);
   }

   function PlayPrevious() {
      if ( hasPrevious) setEpisodeIndex( episodeIndex - 1 );
   }

   function PlayNext() {
      if ( isShuffling ) {
         const min = 0;
         const max = episodeList.length - 1;

         const { random, floor } = Math;
         const randomEpisode = floor( random() * episodeList.length );
         const isSame = ( x: number ) => x === episodeIndex;

         if ( isSame( randomEpisode ) ) {
            if ( isSame( min ) ) return setEpisodeIndex( max );

            if ( isSame( max ) ) return setEpisodeIndex( min );
         }

         setEpisodeIndex( randomEpisode );
         return;
      }

      if ( hasNext ) setEpisodeIndex( episodeIndex + 1 );
   }

   // ***

   return (
      <PlayerContext.Provider value={{
         currentEpisode
         , episodeList
         , episodeIndex

         , isPlaying
         , isLooping
         , isShuffling
         , hasPrevious
         , hasNext

         , SetPlayState
         , ClearPlayState
         , TogglePlay
         , ToggleLoop
         , ToggleShuffle

         , PlayPrevious
         , PlayNext
         , PlayAnEpisode
         , PlayAList
      }}>
         { children }
      </PlayerContext.Provider>
   );
}

const usePlayer = () => useContext(PlayerContext);
export default usePlayer;