import { HomeScreen } from 'app/bundles/home/screen'
import Head from 'next/head'

export default function Page(props: any) {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <HomeScreen  {...props} />
    </>
  )
}

// export const getServerSideProps = SSR


/* Force Redirect into another page
...
export const getServerSideProps = async (context: any) => ({
  redirect: {
    permanent: false,
    destination: "/your-route"
  }
})
 */