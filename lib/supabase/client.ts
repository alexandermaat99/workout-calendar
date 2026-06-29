import { createBrowserClient } from "@supabase/ssr";
// importing createBrowserClient which is used to create a Supabase 
// client instance for browser environments. 
// This function takes the Supabase URL and the publishable key as parameters, 
// which are typically stored in environment variables for security reasons. 
// The function returns a new Supabase client that can be used to interact 
// with the Supabase backend services, such as authentication, 
// database operations, and real-time subscriptions.

export function createClient() {
// the function we're making is called createClient, which will be responsible 
// for creating and returning a new Supabase client instance.

    return createBrowserClient(
    // we're returning the result of calling createBrowserClient, 
    // passing in the necessary parameters to configure the client.

    //process.env is a Node.js feature that allows access to environment variables.
    //then we're grabbing the public SupabaseURL and the public Supabase publishable key 
    // from the environment variables.

        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABSE_PUBLISHABLE_KEY!
        // the ! after the environment variable names is a 
        // TypeScript non-null assertion operator.
        // non-null meaning that we're telling TypeScript that 
        // we are sure these environment variables will be defined and 
        // not null or undefined at runtime.

        // createBrowserClient expects a string type, without the !
        // the variable coule be string | underfined
        // this would throw a warning because it's possible to 
        //pass an undefined value to createBrowserClient, 
        // we're avoiding a warning with the !, nothing more
    );
}