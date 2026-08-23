import NextAuth from "next-auth"
import { cookies } from "next/headers"
import { encode, decode } from 'next-auth/jwt'
import { NextResponse } from "next/server";
import { adminRoutes, authRoutes, userRoutes, maintainerRoutes, adminHome } from "./routes";

export default async function middleware(req)
{
    const { nextUrl } = req;
    const token = await cookies();
    const cookie = token?.get('__Secure-authjs.session-token');
    
    let user = null;
    if(cookie)
    {
        user = await decode({
            token: cookie.value,
            salt: cookie.name,
            secret: process.env.AUTH_SECRET
        })
    } 

    const userRoute = userRoutes.some((route)=> nextUrl.pathname.startsWith(route));
    const adminRoute = adminRoutes.some((route)=> nextUrl.pathname.startsWith(route));
    const authRoute = authRoutes.some((route)=> nextUrl.pathname.startsWith(route));
    const forumRoute = nextUrl.pathname.startsWith('/forum');
    const maintainerAllowed = maintainerRoutes.some((route)=> nextUrl.pathname.startsWith(route));

    if(user?.role === 'visitor' || !user )
        if(userRoute || adminRoute || forumRoute)
            return NextResponse.redirect(new URL('/login', nextUrl))

    if(user?.role === 'visitor' && authRoute )
        return NextResponse.redirect(new URL('/', nextUrl))

    if(user)
    {
        if(user.role === 'user' && authRoute)
            return NextResponse.redirect(new URL('/dashboard', nextUrl))

        if(user.role === 'user' && forumRoute)
            return NextResponse.redirect(new URL('/', nextUrl))
    
        if(user.role !== 'admin' && user.role !== 'maintainer' && nextUrl.pathname.startsWith('/admin'))
            return NextResponse.redirect(new URL('/', nextUrl))

        if(user.role === 'maintainer' && (adminRoute || forumRoute) && !maintainerAllowed)
            return NextResponse.redirect(new URL(adminHome, nextUrl))
    
        if((user.role === 'admin' || user.role === 'maintainer') && nextUrl.pathname.startsWith('/dashboard'))
            return NextResponse.redirect(new URL(adminHome, nextUrl))

        if((user.role === 'admin' || user.role === 'maintainer') && authRoute)
            return NextResponse.redirect(new URL(adminHome, nextUrl))
    }

    return null
}

export const config = 
{
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
}