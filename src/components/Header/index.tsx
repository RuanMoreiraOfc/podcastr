import styles from './styles.module.scss';

import format from 'date-fns/format';
import ptBr from 'date-fns/locale/pt-BR';

export default function Header() {
   const currentDate = format( new Date(), 'yyyy-MM-dd' );
   const currentDateText = format( new Date(), 'EEEEEE, d MMMM', { locale: ptBr } );

   return (
      <header className={ styles.container }>
         <img src="/icons/logo.svg" alt="Podcastr Logo"/>

         <p>O melhor para você ouvir, sempre</p>
         <span>
            <time dateTime={ currentDate }>{ currentDateText }</time>
         </span>
      </header>
   );
}
