import Head from 'next/head'
import styles from '../styles/Home.module.css'

import {ApolloClient, InMemoryCache, gql} from '@apollo/client';

export default function Home({launches}) {

    return (
        <div className={styles.container}>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    SpaceX Launches
                </h1>

                <p className={styles.description}>
                    Latest launches from SpaceX
                </p>

                <div className={styles.grid}>
                    {launches.map(launch => {
                        return (
                            <a key={launch.id} href={launch.links.video_link} className={styles.card} target='_blank'>
                                <h3>{ launch.mission_name }</h3>
                                <p><strong>Launch Date:</strong> { new Date(launch.launch_date_local).toLocaleDateString("en-US") }</p>
                            </a>
                        );
                    })}
                </div>
            </main>

            <footer className={styles.footer}>
                <p>We use GraphQL API to display the information.</p>&nbsp;
                <a
                    href="https://api.spacex.land/graphql/"
                    target="_blank"
                >
                    Explore the API
                </a>
            </footer>
        </div>
    )

}

export async function getStaticProps() {

    const client = new ApolloClient({
        uri: 'https://api.spacex.land/graphql/',
        cache: new InMemoryCache()
    });

    const {data} = await client.query({
        query: gql`
            query GetLaunches {
                launchesPast(limit: 10) {
                    id
                    mission_name
                    launch_date_local
                    launch_site {
                        site_name_long
                    }
                    links {
                        article_link
                        video_link
                        mission_patch
                    }
                    rocket {
                        rocket_name
                    }
                }
            }
        `
    });

    return {
        props: {
            launches: data.launchesPast
        }
    }

}