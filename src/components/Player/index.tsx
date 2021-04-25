// @collapse

import styles from './styles.module.scss';

import { useRef, useState, useEffect, ComponentProps, MutableRefObject } from 'react';

import { IEpisode } from '../../utils/interfaces/Episode';
import ConvertDurationToTimeString from '../../utils/functions/ConvertDurationToTimeString';

import usePlayer, { IPlayerEpisode } from '../../contexts/PlayerContext';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import EpisodeThumb from '../EpisodeThumb';
import ButtonWithImage from '../ButtonWithImage';

export default function Player() {
   const audioRef = useRef<HTMLAudioElement>( null );

   const { currentEpisode: episode } = usePlayer();

   const [ progress, setProgress ] = useState(0);

   const { title, duration } = episode || {} as IPlayerEpisode;

   // ***

   return (
      <div className={ styles.container }>
         <header>
            <img src="/icons/playing.svg" alt="Tocando Agora"/>
            <strong>Tocando Agora { title  && `- ${title}` }</strong>
         </header>

         { episode ? (
            <OccupiedPlayer { ...episode } />
         ) : (
            <EmptyPlayer />
         ) }

         <footer className={ !episode ? styles.empty : null }>
            <AudioPodcast { ...{audioRef} } />

            <div className={ styles.progressBar }>
               <span>{ ConvertDurationToTimeString(progress) }</span>
               <div className={ styles.slider }>
                  { episode ? (
                     <StyledSlider { ...{audioRef, duration, setProgress} } />
                  ) : (
                     <EmptySlider />
                  ) }
               </div>
               <span>{ ConvertDurationToTimeString(duration ?? 0) }</span>
            </div>

            <div className={ styles.buttons }>
               <Shuffle/>
               <Prev/>
               <Play/>
               <Next/>
               <Loop/>
            </div>
         </footer>
      </div>
   );
}

// *** Sub Components

   // #region *** Audio

interface IAudioPodcastProps {
   audioRef: MutableRefObject<HTMLAudioElement>;
}

function AudioPodcast( { audioRef }: IAudioPodcastProps ) {
   const {
      currentEpisode: episode
      , isPlaying
      , isLooping: loop
      , hasNext
      , SetPlayState: ChangeState
      , PlayNext
      , ClearPlayState: ClearState
   } = usePlayer();

   const { url: src } = episode || {} as IPlayerEpisode;
   const onPlay = () => ChangeState(true);
   const onPause = () => ChangeState(false);
   const onEnded = () => hasNext ? PlayNext() : ClearState();
   const onLoadedMetadata = () => audioRef.current.currentTime = 0;

   useEffect( () => {

      if ( !audioRef.current  ) return;

      const audio: Pick<HTMLAudioElement, 'play' | 'pause'> = audioRef.current;

      if ( isPlaying === true ) {
         audio.play();
         return;
      }

      audio.pause();

   }, [ isPlaying ] );

   // ***

   return (
      episode && (
         <audio
            ref={ audioRef }
            autoPlay
            { ...{src, loop, onPlay, onPause, onEnded, onLoadedMetadata} }
         />
      )
   );
}

   // #endregion *** Audio

   // #region *** Player

function OccupiedPlayer( { members, ...rest } : Pick<IEpisode, 'title' | 'thumbnail' | 'members' > ) {
   const { title } = rest;

   return (
      <div className={ styles.occupiedPlayer }>
         <EpisodeThumb size={592} {...rest }/>
         <strong>{ title }</strong>
         <span>{ members }</span>
      </div>
   );
}

function EmptyPlayer() {
   return (
      <div className={ styles.emptyPlayer }>
         <strong>Selecione um podecast para ouvir</strong>
      </div>
   );
}

   // #endregion *** Player

   // #region *** Slider

interface IStyledSliderProps extends IAudioPodcastProps {
   duration: number;
   setProgress: ( x: number ) => void;
}

function StyledSlider( { audioRef, duration: max, setProgress }: IStyledSliderProps ) {
   const [ value, setValue ] = useState(0);
   const [ isChanging, setIsChanging ] = useState(false);

   function onTimeUpdate() {
      const newValue = audioRef.current.currentTime;

      setValue( newValue );

      if ( !isChanging ) setProgress( newValue );
   }

   useEffect( () => {
      const { current: audio } = audioRef;

      audio.addEventListener('timeupdate', onTimeUpdate);
   }, [audioRef] );

   const onChange = (x: number) => {
      if ( !audioRef.current  ) return;

      audioRef.current.currentTime = x;
      setValue(x);
      setProgress(x);
      setIsChanging(true);
   }

   // ***

   return (
      <Slider
         trackStyle={ {backgroundColor: '#04d361'} }
         railStyle={ {backgroundColor: '#FFFFFF55'} }
         handleStyle={ {borderColor: '#04d361', borderWidth: 4} }
         { ...{value, max, onChange} }
      />
   );
}

function EmptySlider() {
   return (
      <div className={ styles.emptySlider }></div>
   );
}

   // #endregion *** Slider

   // #region *** Buttons

function PlayerButton( props: ComponentProps<typeof ButtonWithImage> ) {
   const { currentEpisode: episode } = usePlayer();

   return (
      <ButtonWithImage
         disabled={ !episode }
         { ...props }
      />
   );
}

function Shuffle() {
   const {
      episodeList
      , isLooping
      , isShuffling
      , ToggleShuffle: onClick
   } = usePlayer();

   const disabled = ( isLooping || episodeList.length < 2 ) ? true : null;
   const className = ( !disabled && isShuffling ) ? styles.isActive : null ;

   // ***

   return (
      <PlayerButton
         icon="shuffle"
         alt="Emparalhar"
         { ...{onClick, disabled, className} }
      />
   );
}

function Prev() {
   const {
      hasPrevious
      , PlayPrevious: onClick
   } = usePlayer();

   return (
      <PlayerButton
         icon="play-previous"
         alt="Tocar anterior"
         disabled={ !hasPrevious || null }
         { ...{onClick} }
      />
   );
}

function Play() {
   const {
      isPlaying
      , TogglePlay: onClick
   } = usePlayer();

   return (
      <PlayerButton
         icon={ !isPlaying ? "play" : "pause" }
         alt={ !isPlaying ? "Tocar" : "Pausar" }
         className={ styles.playButton }
         { ...{onClick} }
      />
   );
}

function Next() {
   const {
      hasNext
      , PlayNext: onClick
   } = usePlayer();

   return (
      <PlayerButton
         icon="play-next"
         alt="Tocar próximo"
         disabled={!hasNext || null}
         { ...{onClick} }
      />
   );
}

function Loop() {
   const {
      isLooping
      , ToggleLoop: onClick
   } = usePlayer();

   return (
      <PlayerButton
         icon="repeat"
         alt="Repetir"
         className={ isLooping ? styles.isActive : null }
         { ...{onClick} }
      />
   );
}

   // #endregion *** Sub Components