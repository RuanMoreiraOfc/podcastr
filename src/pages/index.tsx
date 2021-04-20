import Head from 'next/head';

import Header from '../components/Header';

import { episodes } from '../../server.json';

interface IHomeProps {
   episodes: Array<typeof episodes[0]>;
}

export default function Home(HomeProps: IHomeProps) {
   return (
      <div>
         <Head>
            <title>Home | podcastr</title>
         </Head>

         <h1>Index</h1>
         { JSON.stringify( HomeProps.episodes.slice(0,2) ) }
      </div>
   );
}

export async function getStaticProps() {
   const response = await fetch( 'http://localhost:3333/episodes' )
   const data = await response.json();

   return ({
      props: { episodes: data }
      , revalidate: 60 * 60 * 8
   })
}