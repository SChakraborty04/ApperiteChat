/* eslint-disable no-empty */
import variables from "../variables/variables";
import { Client, ID, Databases, Storage} from "appwrite";

export class Service{
    client=new Client();
    databases;
    bucket;
    constructor(){
        this.client
            .setEndpoint(variables.appwriteURL)
            .setProject(variables.appwriteProjectID);
        this.databases=new Databases(this.client);
        this.bucket=new Storage(this.client);
    }
    async createMessage(payload){
        // 
        try {
            return await this.databases.createDocument(
                variables.appwriteDatabaseID,
                variables.appwriteCollectionID,
                ID.unique(),
                payload
            )
        } catch (error) {
            console.log("Apperite::config::createMessage",error);
        }
    }
    async editMessage(id,body){
        try {
            return await this.databases.updateDocument(
                variables.appwriteDatabaseID,
                variables.appwriteCollectionID,
                id,
                {body}
            )
        } catch (error) {
            console.log("Appwrite::config::updatePost",error);
        }
    }
    async deleteMessage(id){
        try {
            await this.databases.deleteDocument(
                variables.appwriteDatabaseID,
                variables.appwriteCollectionID,
                id
            )
            return true
        } catch (error) {
            console.log("Appwrite::config::deletePost",error);
            return false
        }
    }
    async getMessages(){
        try {
           return await this.databases.listDocuments(
                variables.appwriteDatabaseID,
                variables.appwriteCollectionID,
           ) 
        } catch (error) {
            console.log("Appwrite::config::listPosts",error);
        }
    }
    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                variables.appwriteBucketID,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite::config::uploadFile",error);
        }
    }
    async deleteMessages(fileId){
        try {
            await this.bucket.deleteFile(
                variables.appwriteBucketID,
                fileId
            )
            return true
        } catch (error) {
            console.log("Appwrite::config::deleteFile",error);
            return false
        }
    }
    getFilePreview(fileId){
        return this.bucket.getFilePreview(
            variables.appwriteBucketID,
            fileId
        )
    }
    
}

const service=new Service()

export default service