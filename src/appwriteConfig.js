import { Client,Databases,Account } from 'appwrite';
import variables from '../variables/variables';

const client = new Client();

client
    .setEndpoint(variables.appwriteURL)
    .setProject(variables.appwriteProjectID)
export const databases=new Databases(client);
export const account=new Account(client);

export default client;