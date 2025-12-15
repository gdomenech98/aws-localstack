import { NotFoundScreen } from 'app/bundles/custom/pages/NotFound';
import Head from 'next/head'

export default function Page() {
    return (
        <>
            <Head>
                <title>404 - Not found</title>
            </Head>
            <NotFoundScreen />
        </>
    )
}
