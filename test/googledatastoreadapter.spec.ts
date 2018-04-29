import PersistenceGoogleDatastorage from '../src/app/persistencegoogledatastore';
import {expect} from 'chai';
import {Guid} from "./guid";
import {DUMMYGRAPH} from "./samplegraph.json";
import {GRESPONSE} from "./google_response.json";

describe('Persistence GoogleDatastorage', () => {
    let sut:PersistenceGoogleDatastorage;

    beforeEach(() => {
        sut = new PersistenceGoogleDatastorage('bucket-for-test');
    });


    describe('insert()', () => {
        it('should update graph ', (done) => {
            var graph = DUMMYGRAPH;
            sut.insert(graph).then((data)=>{
                console.log(data);
                done();
            });
        });

        it('should add new graph ', (done) => {
            var graph = {"id":Guid.js()};
            sut.insert(graph).then((data)=>{
                console.log(data);
                done();
            });

        });

    });

    describe('find()', () => {
        it('should get graph with Id ', (done) => {
            var query = {"id":"06ba7fde-019d-7eb3-e2b0-5fa52f90e67f"};
            sut.find(query).then((data)=>{
                console.log('RESULT [['+JSON.stringify(data)+']]');
                expect(data).to.not.be.null;
                done();
            });
        });
        it('should get all graphs', (done) => {
            var query = {};
            sut.find(query).then((data)=>{
                console.log('num graphs '+data.length);
                done();
            });
        });
    });

    describe('remove()', () => {
        it('should remove graph with Id ', (done) => {
            var graph = {"id":"06ba7fde-019d-7eb3-e2b0-5fa52f90e67f"};
            sut.remove(graph).then((data)=>{
                console.log(data);
                done();
            });
        });
    });

    describe('parseGoogleResponse()', () => {
        it('should remove graph with Id ', () => {
            var json = GRESPONSE;
            expect(sut.parseGoogleResponse(json).length).to.equal(1);
        });
    });

});
