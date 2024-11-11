import { getServerSession } from 'next-auth';
import { SocketProvider } from '../../context/SocketProvider';
import SessionProvider from '../../context/SessionProvider';
import Nav from '../ui/Nav';

// export const experimental_ppr = true;

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession();
    console.log(session);
    return (
        <SessionProvider session={session}>
            <SocketProvider>
                <header>
                    <Nav/>
                </header>
                <main>
                    {children}
                </main>
            </SocketProvider>
        </SessionProvider>

    );
}