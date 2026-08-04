import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('weekend_user');

    if (!userCookie || !userCookie.value) {
      return NextResponse.json({ success: false, user: null });
    }

    const user = JSON.parse(userCookie.value);
    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ success: false, user: null });
  }
}
