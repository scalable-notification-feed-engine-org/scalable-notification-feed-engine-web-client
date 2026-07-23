import { ApolloClient, HttpLink, InMemoryCache, ApolloLink, Observable } from "@apollo/client";
import Cookies from "js-cookie";

const httpLink = new HttpLink({
    uri: "http://localhost:3004/graphql",
});

const errorLink = new ApolloLink((operation, forward) => {
    return new Observable((observer) => {
        const subscription = forward(operation).subscribe({
            next: (response) => {
                console.log("RESPONSE", response);
                if (response.errors) {
                    response.errors.forEach(({ message, extensions }) => {
                        console.error(`[GraphQL error]: Message: ${message}`);

                        if (extensions?.code === 'UNAUTHENTICATED') {
                            Cookies.remove('auth_token');
                            Cookies.remove('user_id');
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

export const createApolloClient = (dbUserId: string) => {
    const authLink = new ApolloLink((operation, forward) => {
        const token = Cookies.get('auth_token');
        console.log("USER ID APPLO", dbUserId);

        operation.setContext(({ headers = {} }) => ({
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : '',
                'x-user-id': dbUserId || '',
            }
        }));

        return forward(operation);
    });

    return new ApolloClient({
        link: ApolloLink.from([errorLink, authLink, httpLink]),
        cache: new InMemoryCache(),
    });
};