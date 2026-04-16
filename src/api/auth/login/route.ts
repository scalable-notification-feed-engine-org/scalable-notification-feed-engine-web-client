import {cookies} from "next/headers";
import {NextResponse} from "next/server";

export async function POST(request:Request){

    const body = request.json();

    const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    const data = await response.json();

    if(response.ok){
        const cookieStore = await cookies();
        cookieStore.set('auth_token', data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24
        });

        return NextResponse.json({message: 'Login Successful!'});
    }

    return NextResponse.json({ message: data.message || 'Login Failed' }, {status: 401});
}