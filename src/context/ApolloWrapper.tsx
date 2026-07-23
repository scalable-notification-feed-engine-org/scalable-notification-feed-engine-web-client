"use client";
import { ApolloProvider } from "@apollo/client/react";
import {createApolloClient} from "@/lib/apollo-client";
import React, {useMemo} from "react";
import {useAuth} from "@/context/AuthContext";

export const ApolloWrapper = ({ children }: { children: React.ReactNode }) => {
    const {user} = useAuth();
    const dbUserId = user?.id || "";

    const client = useMemo(() => createApolloClient(dbUserId), [dbUserId]);

    return <ApolloProvider client={client}>{children}</ApolloProvider>;
};