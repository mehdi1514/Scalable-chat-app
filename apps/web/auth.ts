// import NextAuth, { AuthError } from 'next-auth';
// import Credentials from 'next-auth/providers/credentials';
// import { z } from "zod";
// import axios from 'axios';
// import { authConfig } from './auth.config';

// export const { handlers: { GET, POST }, auth } = NextAuth({
//     ...authConfig,
//     session: { strategy: 'jwt' },
//     secret: process.env.AUTH_SECRET,
//     providers: [
//         Credentials({
//             async authorize(credentials) {
//                 const parsedCredentials = z
//                     .object({ email: z.string().email(), password: z.string() })
//                     .safeParse(credentials);

//                 if (parsedCredentials.success) {
//                     const { email, password } = parsedCredentials.data;
//                     console.log(email, password);
//                     const res = await axios.post('http://localhost:8000/login', {
//                         email: email,
//                         password: password,
//                     });

                    
//                     if (res.data && res.data.token) {
//                         return res.data;
//                     }

//                     if(res.status === 401) throw new AuthError("Invalid Credentials");
//                 } 

//             },
//         }),
//     ],
// });