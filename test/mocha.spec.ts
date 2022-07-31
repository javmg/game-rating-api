import {Suite} from 'mocha';
import tournamentTestSpec from "./controller/tournamentTest.spec";

process.env.NODE_ENV = 'test';

describe('Tests', function (this: Suite) {

    describe('Tournament controller tests', tournamentTestSpec);

});
