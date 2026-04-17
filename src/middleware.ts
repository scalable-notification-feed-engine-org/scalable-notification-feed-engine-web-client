import {NextRequest, NextResponse} from "next/server";
import {decodeJwt} from "jose";

export function middleware(request:NextRequest){
    const token = request.cookies.get('auth_token')?.value;
    let isTokenExpired = false;

    const { pathname } = request.nextUrl;

    if(token){
        try {
            const payload = decodeJwt(token);
            const currentTime = Math.floor(Date.now() / 1000);

            if(payload.exp && payload.exp < currentTime){
                isTokenExpired = true;
            }
        }catch(err){
            isTokenExpired = true;
        }
    }

    if(pathname.startsWith('/dashboard')){

        if(!token || isTokenExpired) {
            const response = NextResponse.redirect(new URL('/login', request.url));

            if(token && isTokenExpired)  response.cookies.delete('auth_token');

            return response;

        }

    }

    if(token && (pathname === '/login' || pathname === '/register')){
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*','/login', '/register'],
};