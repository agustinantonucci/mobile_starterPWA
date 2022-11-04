/* eslint-disable no-unused-vars */
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';


const PORT = `4002`; //puerto de escucha de GraphQL
const PROTOCOL = window.location.protocol;
const HOSTNAME = window.location.hostname;
const SEARCH = window.location.search;
const URL = `${PROTOCOL}//${HOSTNAME}:${PORT}/${SEARCH}`;


const Client = new ApolloClient({
	connectToDevTools: true,
	cache: new InMemoryCache(),
	link: new HttpLink({
		uri: `https://7322-152-169-48-128.sa.ngrok.io/graphql`
		//uri: process.env.REACT_APP_APOLLO,
		//uri: URL,
		// uri: `http://beeapp.binamics.com.ar:4002`
		// fetch,
	}),
});


export default Client;