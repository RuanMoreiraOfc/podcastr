// @collapse

import styles from './styles.module.scss';

import { useRef, useEffect, useContext, ComponentProps } from 'react';

import { IEpisode } from '../../utils/interfaces/Episode';
import ConvertDurationToTimeString from '../../utils/functions/ConvertDurationToTimeString';

import PlayerContext, { IPlayerEpisode } from '../../contexts/PlayerContext';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import EpisodeThumb from '../EpisodeThumb';
import ButtonWithImage from '../ButtonWithImage';
import { title } from 'node:process';

export default function Player() {
   const { currentEpisode: episode } = useContext(PlayerContext);

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
            <AudioPodcast />

            <div className={ styles.progressBar }>
               <span>00:00</span>
               <div className={ styles.slider }>
                  { episode ? (
                     <StyledSlider />
                  ) : (
                     <EmptySlider />
                  ) }
               </div>
               <span>{ episode ? ConvertDurationToTimeString(duration) : "00:00" }</span>
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

function AudioPodcast() {
   const audioRef = useRef<HTMLAudioElement>( null );

   const {
      isPlaying
      , currentEpisode: episode
      , SetPlayState: ChangeState
   } = useContext(PlayerContext);

   const { url: src } = episode || {} as IPlayerEpisode;
   const onPlay = ChangeState.bind( null, true );
   const onPause = ChangeState.bind( null, false );

   useEffect( () => {

      if ( !audioRef.current  ) return;

      const audio: Pick<HTMLAudioElement, 'play' | 'pause'> = audioRef.current;

      if ( isPlaying === true ) {
         audio.play();
         return;
      }

      audio.pause();

   }, [ isPlaying ] )

   return (
      episode && (
         <audio
            ref={ audioRef }
            autoPlay
            { ...{src, onPlay, onPause} }
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

function StyledSlider() {
   return (
      <Slider
         trackStyle={ {backgroundColor: '#04d361'} }
         railStyle={ {backgroundColor: '#FFFFFF55'} }
         handleStyle={ {borderColor: '#04d361', borderWidth: 4} }
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
   const { currentEpisode: episode } = useContext(PlayerContext);

   return (
      <ButtonWithImage
         disabled={ !episode }
         { ...props }
      />
   );
}

function Shuffle() {
   return (
      <PlayerButton
         icon="shuffle"
         alt="Emparalhar"
      />
   );
}

function Prev() {
   return (
      <PlayerButton
         icon="play-previous"
         alt="Tocar anterior"
      />
   );
}

function Play() {
   const {
      isPlaying
      , TogglePlay: onClick
   } = useContext(PlayerContext);

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
   return (
      <PlayerButton
         icon="play-next"
         alt="Tocar próximo"
      />
   );
}

function Loop() {
   return (
      <PlayerButton
         icon="repeat"
         alt="Repetir"
      />
   );
}

   // #endregion *** Sub Components