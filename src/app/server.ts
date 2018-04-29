
import * as express from "express";
import * as morgan from "morgan"; // log requests to the console (express4)
import * as path from "path"; // normalize the paths : http://stackoverflow.com/questions/9756567/do-you-need-to-use-path-join-in-node-js
import * as bodyParser from "body-parser"; // pull information from HTML POST (express4)
import * as methodOverride from "method-override"; // simulate DELETE and PUT (express4)
import * as helmet from "helmet";
import * as cors from "cors";
import * as compression from "compression";
import {Routes} from "./routes";


export class App {

    protected app: express.Application;

    constructor(NODE_ENV: string = 'development', PORT: number = 8080){

        process.env.NODE_ENV = process.env.NODE_ENV || NODE_ENV;
        process.env.PORT = process.env.PORT || PORT;

        this.app = express();
        this.app.use(helmet());
        this.app.use(cors());
        if(NODE_ENV === 'development'){
            this.app.use(express.static(path.join(process.cwd(), 'public')));
            this.app.use('/bower_components',  express.static(path.join(process.cwd(), 'bower_components')));
            this.app.use(morgan('dev'));
        }else{
            this.app.use(compression());
            this.app.use(express.static(path.join(process.cwd(), 'dist'), { maxAge: '7d' })); // set the static files location /public/img will be /img for users
        }

        this.app.use(bodyParser.urlencoded({'extended':true}));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
        this.app.use(methodOverride());

        let routes = new Routes(process.env.NODE_ENV);
        routes.paths(this.app);
        this.start();
    }

    start(){
        this.app.listen(process.env.PORT, function(){
            console.log('The server is running in port localhost: ', process.env.PORT);
        });
    }

}