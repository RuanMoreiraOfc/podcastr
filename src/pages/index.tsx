// @collapse

import styles from '../styles/pages/home.module.scss';

import React, { Fragment, useContext } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import api, { IApiParams } from '../services/api';

import { IEpisode, IEpisodeApi } from '../utils/interfaces/Episode';
import CreateEpisodeFromApi from '../utils/functions/CreateEpisodeFromApi';
import CreateTrueArray from '../utils/functions/CreateTrueArray';

import PlayerContext from '../contexts/PlayerContext';

import EpisodeThumb from '../components/EpisodeThumb';
import ButtonWithImage from '../components/ButtonWithImage';

interface IHomeEpisode extends Omit<IEpisode, 'description' >{}

interface IHomeProps {
   latestEpisodes: IHomeEpisode[];
   previousEpisodes: IHomeEpisode[];
}

interface IEpisodeDetailProps extends Omit<IHomeEpisode, 'thumbnail'>{
   tags: string[];
   tagProps?: object[];
}

export default function Home({ latestEpisodes, previousEpisodes }: IHomeProps) {
   return (
      <div className={ styles.container }>
         <Head>
            <title>Home | podcastr</title>
         </Head>

         <section className={ styles.latestEpisodes }>
            <h2>Últimos Lançamentos</h2>

            <ul>{ latestEpisodes.map( EpisodeLabel ) }</ul>
         </section>

         <section className={ styles.allEpisodes }>
            <h2>Todos os Episódios</h2>

            <table cellSpacing={ 0 }>
               <thead>
                  <tr>
                     <th></th>
                     <th>Podcast</th>
                     <th>Integrantes</th>
                     <th>Data</th>
                     <th>Duração</th>
                     <th></th>
                  </tr>
               </thead>
               <tbody>{ previousEpisodes.map( EpisodeCell ) }</tbody>
            </table>
         </section>
      </div>
   );
}

export const getStaticProps: GetStaticProps = async ( ctx ) => {
   const { data } : { data: IEpisodeApi[] } = await api.get( '/episodes', {
      params: {
         _limit: 12
         , _sort: "published_at"
         , _order: "desc"
      } as IApiParams
   } );

   const episodes = data.map( CreateEpisodeFromApi );

   const latestEpisodes = episodes.slice(0, 2);
   const previousEpisodes = episodes.slice(2);

   return ({
      props: { latestEpisodes, previousEpisodes }
      , revalidate: 60 * 60 * 8 // 8 hrs
   });
}

// *** Sub Components

   // #region *** Episode Body

function EpisodeLabel( episode: IHomeEpisode ) {
   const {
      id
      , thumbnail
      , title
   } = episode;

   const tags = ['', 'p', 'span', 'span'];
   const tagProps = CreateTrueArray(4, {});

   const props = Object.assign( episode, { tags, tagProps } ) as IEpisodeDetailProps;

   // ***

   return (
      <li key={ id }>
         <EpisodeThumb {...{thumbnail, title, size: 192}} />

         <div className={ styles.episodeDetails }>
            <EpisodeDetail { ...props } />
         </div>

         <EpisodeButtonPlay { ...episode } />
      </li>
   );
}

function EpisodeCell( episode: IHomeEpisode ) {
   const {
      id
      , thumbnail
      , title
   } = episode;

   const tags = CreateTrueArray(4, 'td');
   const tagProps = CreateTrueArray(4, withClassName(''));
      tagProps[2] = withClassName(styles.cellDate);

   const props = Object.assign( episode, { tags, tagProps } ) as IEpisodeDetailProps;

   function withClassName( className: string ) {
      return ({className} );
   }

   // ***

   return (
      <tr key={ id }>
         <td className={ styles.cellImage }><EpisodeThumb {...{thumbnail, title, size: 120}} /></td>

         <EpisodeDetail { ...props } />

         <td><EpisodeButtonPlay { ...episode } /></td>
      </tr>
   );
}

   // #endregion *** Episode Body

   // #region *** Episode Miscellaneous

function EpisodeDetail( { tags, tagProps, ...rest}: IEpisodeDetailProps ) {
   const {
      id
      , title
      , members
      , publishedAt: date
      , publishedAtAsTime: dateTime
      , file: source
   } = rest;

   const ChildLink = ( <Link href={ `/episodes/${id}` }><a>{ title }</a></Link> );
   const ChildMembers = ( <Fragment>{ members }</Fragment> );
   const ChildTime = ( <time { ...{dateTime} }>{ date }</time> );
   const ChildDuration = ( <Fragment>{ source.durationAsString }</Fragment> );

   function CreateCustomTag( index ) {
      const children = ( [ChildLink, ChildMembers, ChildTime, ChildDuration] );
      const props = ( {
         children: children[index]
         , ...tagProps[index]
      } );

      return ( React.createElement( tags[index] || Fragment, props ) );
   }

   // ***

   return (
      <Fragment>
         { CreateCustomTag(0) }
         { CreateCustomTag(1) }
         { CreateCustomTag(2) }
         { CreateCustomTag(3) }
      </Fragment>
   );
}

function EpisodeButtonPlay( episode: IHomeEpisode ) {
   const { PlayAnEpisode } = useContext( PlayerContext )

   const {
      title
      , thumbnail
      , members
      , file: source
   } = episode;

   return (
      <ButtonWithImage
         icon="play-green"
         alt="Tocar Episódio"
         onClick={
            () => PlayAnEpisode({
               title
               , thumbnail
               , members
               , duration: source.duration
               , url: source.url
            })
         }
      />
   );
}

   // #endregion *** Episode Miscellaneous