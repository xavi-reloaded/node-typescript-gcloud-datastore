import Promise from "ts-promise";
import * as Datastore from "@google-cloud/datastore";
import {config} from "./config";

export interface IPersistenceDriver{
    insert(graph:any):any;
    find(query:any):any;
    remove(query:any):any;
}

export default class PersistenceGoogleDatastore implements IPersistenceDriver{

    private datastore: Datastore;

    constructor(private bucketName?:string) {
        this.bucketName = bucketName || config.bucketName;
        process.env.GOOGLE_APPLICATION_CREDENTIALS = config.keyFilename || "gcloud-opendesigner-credentials.json";
        this.datastore = new Datastore({
            projectId: config.projectId,
        });
    }

    insert(json: any): any {
        const taskKey = this.datastore.key([this.bucketName , json.id]);

        const task = {
            key: taskKey,
            data: [
                {
                    name: 'json',
                    value: json,
                    excludeFromIndexes: true
                }
            ]
        };


        return new Promise((resolve:any, reject:any) => {
            this.datastore
                .save(task)
                .then(() => {
                    console.log(`Saved ${task.key.name}: ${JSON.stringify(task.data)}`);
                    resolve(task.data[0].value);
                })
                .catch(err => {
                    console.error(err);
                    reject(new Error(err));
                });
        });

    }

    find(query: any): any {
        return new Promise((resolve:any, reject:any) => {
            const datastoreQuery = this.parseUrlQuery(query);
            this.datastore.runQuery(datastoreQuery).then(docs => {
                resolve(this.parseGoogleResponse(docs));
            }).catch(err => {
                console.error(err);
                reject(new Error(err));
            });

        });
    }

    remove(query: any): any {
        return new Promise((resolve:any, reject:any) => {
            this.datastore.delete(this.datastore.key([this.bucketName, query.id])).then( docs => {
                resolve(docs);
            });
        });
    }

    parseUrlQuery(query: any):any {
        if (query.id) return this.datastore.createQuery(this.bucketName).filter('__key__', '=', this.datastore.key([this.bucketName, query.id]));
        return this.datastore.createQuery(this.bucketName);
    }


    parseGoogleResponse(json: any): any {
        let docs:Array<any> = new Array<any>();
        json[0].forEach((d:any)=>{
            docs.push(d.json);
        });
        return docs;
    }

}