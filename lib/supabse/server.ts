import {createServerClient} from "@supabase/ssr";
import { cookies } from "next/headers";
// importing createServerClient which is used to create a Supabase 
// client instance for server environments.

// this is different from the createBrowserClient function used in the client.ts file,
//  as it is specifically designed for server-side rendering (SSR) scenarios.

//we also import the cookies function from next/headers, which allows us to access
// cookies in a Next.js server-side context. This is important for managing 
// authentication tokens and session data when interacting with Supabase.
//we don't do it in the client.ts file because cookies are typically 
// managed on the server side for security reasons.


export async function createClient() {
    // async means that this function will return a promise
    // this allows other parts of the function to execute while waiting 
    // for the async operation to complete 

    //the promise is a temporary object which gets replaced 
    //with the final value once the async operation is complete


    const cookieStore = await cookies();
    // we set a const called cookieStore which 
    // is assigned to the result of calling the cookies function from next/headers.

    return createServerClient(
        // we're returning the result of calling createServerClient,
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        // we 're passing in the necessary parameters to configure the client,
        {
            // the third parameter is an object that contains additional 
            // configuration options for the Supabase client, in this case, 
            // we're providing a custom implementation for handling cookies.
            cookies: {
                // cookies: sets up a custom implementation for handling 
                // cookies in the Supabase client.
                getAll() {
                    // if the getAll method is called, 
                    // it will return all cookies from the cookieStore.
                    return cookieStore.getAll();
                },
                // if the setAll method is called, 
                // it will take an array of cookies to set,
                // and for each cookie, it will call the set method on the cookieStore
                setAll(cookiesToSet) {
                    try {
                    cookiesToSet.forEach(({ name, value, options }) => 
                        cookieStore.set(name, value, options)
                        );
                    } catch {
                    }
                },
            },
        }
    );
};
