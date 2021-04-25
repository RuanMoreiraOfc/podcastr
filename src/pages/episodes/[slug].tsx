import styles from '../../styles/pages/episodes.module.scss';

import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import api, { IApiParams } from '../../services/api';

import { IEpisode, IEpisodeApi } from '../../utils/interfaces/Episode';
import CreateEpisodeFromApi from '../../utils/functions/CreateEpisodeFromApi';

import usePlayer from '../../contexts/PlayerContext';

import EpisodeThumb from '../../components/EpisodeThumb';
import ButtonWithImage from '../../components/ButtonWithImage';

interface IEpisodeProps {
   episode: IEpisode;
}

export default function Episode( { episode }: IEpisodeProps ) {
   const {
      PlayAnEpisode
   } = usePlayer();

   const {
      thumbnail
      , title
      , description
      , members
      , publishedAt: date
      , publishedAtAsTime: dateTime
      , duration
      , durationAsString
      , url
   } = episode;

   const play = () => PlayAnEpisode( {
      title
      , thumbnail
      , members
      , duration
      , url
   } )

   return (
      <div className={ styles.wrapper }>
         <Head>
            <title>{ title } | Podcastr</title>
         </Head>

         <div className={ styles.container }>
            <Link href='/'>
               <a><ButtonWithImage icon={ 'arrow-left' } alt={ 'Voltar' } className={ styles.left } /></a>
            </Link>
            <EpisodeThumb size={[700, 160]} { ...{thumbnail, title} }/>
            <ButtonWithImage
               icon={ 'play' }
               alt={ 'Tocar Episódio' }
               className={ styles.right }
               onClick={ play }
            />
         </div>

         <header>
            <h1>{ title }</h1>
            <span>{ members }</span>
            <span><time { ...{dateTime} }>{ date }</time></span>
            <span>{ durationAsString }</span>
         </header>

         <div className={ styles.description } dangerouslySetInnerHTML={ { __html: description } } />
      </div>
   )
}

export const getStaticPaths: GetStaticPaths = async ( ctx ) => {
   const { data }: { data: IEpisodeApi[] } = await api.get( '/episodes', {
      params: {
         _limit: 2
         , _sort: "published_at"
         , _order: "desc"
      } as IApiParams
   } );

   const paths = data.map( episode => ({ params: { slug: episode.id } }) );

   return ({
      paths: paths
      , fallback: 'blocking'
   })
}

export const getStaticProps: GetStaticProps = async ( ctx ) => {
   const { slug } = ctx.params;
   const { data }: { data: IEpisodeApi } = await api.get( `/episodes/${slug}`);

   const episode = CreateEpisodeFromApi( data );

   return ({
      props: { episode }
      , revalidate: 60 * 60 * 24 // 24 Hrs
   });
}