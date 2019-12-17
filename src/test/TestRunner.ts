import { PositionValidator } from "../common/PositionValidator";
import { Edge, EdgeMatchingStatus } from "../common/Enums";


interface ITestResult{
    testName: string,
    testResult: boolean
}

export class TestRunner<T>{
    private testClass: T;
    private testsToRun: [string, any][];
    private testResults: ITestResult[]

    constructor(testClass: {new(): T}){
        this.testClass = new testClass();
        this.testsToRun = new Array();
        this.testResults = new Array<ITestResult>();

        for (const method in this.testClass) {
            this.testsToRun.push([method, this.testClass[method]]);         
        }

        console.log("Running " + this.testClass.constructor.name + " Tests...\n");
        this.runTests();
    }

    private runTests(): void{
        this.testsToRun.forEach((keyValuePair) => {
            const testResult = keyValuePair[1]();
            this.testResults.push({
                testName: keyValuePair[0],
                testResult: testResult
            });
            if(!testResult){
                console.log("Error: " + keyValuePair[0] + ". Test failed.\n");
            }
        });

        this.printFinalStats();
    }

    private printFinalStats(){
        console.log("Testing complete.\n");
        const numberOfPassedTests = this.testResults.filter((testResult) => {
            return testResult.testResult;
        }).length;
        
        const numberOfFailedTests = this.testResults.filter((testResult) => {
            return !testResult.testResult;
        }).length;

        console.log("Tests Passed: " + numberOfPassedTests + ", Tests Failed: " + numberOfFailedTests + ", Total Tests: " + (numberOfPassedTests + numberOfFailedTests));
    }
}