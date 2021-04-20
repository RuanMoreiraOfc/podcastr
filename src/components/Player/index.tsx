import styles from './styles.module.scss';

import { Fragment, MouseEventHandler } from 'react';

interface PlayerButtonProps {
   img: string;
   alt: string;
   className?: string;
   onClick?: MouseEventHandler;
}

export default function Player() {

   function PlayerButton( { img, alt, ...rest }: PlayerButtonProps ) {
      return (
         <Fragment>
            <button type="button" { ...rest }  >
               <img src={ `/icons/${ img }.svg` } alt={ alt } />
            </button>
         </Fragment>
      );
   }

   return (
      <div className={ styles.container }>
         <header>
            <img src="/icons/playing.svg" alt="Tocando Agora"/>
            <strong>Tocando Agora</strong>
         </header>

         <div className={ styles.emptyPlayer }>
            <strong>Selecione um podecast para ouvir</strong>
         </div>

         <footer className={ styles.empty }>
            <div className={ styles.progressBar }>
               <span>00:00</span>
               <div className={ styles.slider }>
                  <div className={ styles.emptySlider }></div>
               </div>
               <span>00:00</span>
            </div>

            <div className={ styles.buttons }>
               <PlayerButton img="shuffle" alt="Emparalhar" />
               <PlayerButton img="play-previous" alt="Tocar anterior" />
               <PlayerButton img="play" alt="Tocar" className={ styles.playButton }/>
               <PlayerButton img="play-next" alt="Tocar próximo" />
               <PlayerButton img="repeat" alt="Repetir" />
            </div>
         </footer>
      </div>
   );
}
