import {ApolloClient,HttpLink, InMemoryCache} from "@apollo/client";
import Cookies from "js-cookie";
import { ApolloLink, Observable } from "@apollo/client";

const httpLink = new HttpLink({
    uri: "http://localhost:3004/graphql",
});

const errorLink = new ApolloLink((operation, forward) => {
    return new Observable((observer) => {
           const subscription = forward(operation).subscribe({

            next: (response) => {
                if (response.errors) {
                    response.errors.forEach(({ message, extensions }) => {
                        console.error(`[GraphQL error]: Message: ${message}`);

                        if (extensions?.code === 'UNAUTHENTICATED') {
                            Cookies.remove('auth_token');
                            window.location.href = '/login';
                        }
                    });
                }
                observer.next(response);
            },
            error: (networkError) => {
                console.error(`[Network error]: ${networkError}`);
                observer.error(networkError);
            },
            complete: () => observer.complete(),
        });

        return () => subscription.unsubscribe();
    });
});

const authLink = new ApolloLink((operation, forward) =>{

    const token = Cookies.get('auth_token');


    operation.setContext(({headers = {} }) => ({
        headers: {
            ...headers,
            authorization: `Bearer ${token}`,
        }
    }));
    return forward(operation);
});


export const client = new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
})