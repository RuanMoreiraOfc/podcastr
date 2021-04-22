import styles from './styles.module.scss';

import Link from 'next/link';

import ConvertToPtBrDate from '../../utils/functions/ConvertToPtBrDate';

export default function Header() {
   const currentDate = ConvertToPtBrDate( new Date(), 'yyyy-MM-dd' );
   const currentDateText = ConvertToPtBrDate( new Date(), 'EEEEEE, d MMMM' );

   // ***

   return (
      <header className={ styles.container }>
         <Link href="/">
            <a><img src="/icons/logo.svg" alt="Podcastr Logo"/></a>
         </Link>

         <p>O melhor para você ouvir, sempre</p>
         <span>
            <time dateTime={ currentDate }>{ currentDateText }</time>
         </span>
      </header>
   );
}
