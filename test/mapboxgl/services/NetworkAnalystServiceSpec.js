import { NetworkAnalystService } from '../../../src/mapboxgl/services/NetworkAnalystService';
import { BurstPipelineAnalystParameters } from '../../../src/common/iServer/BurstPipelineAnalystParameters';
import { ComputeWeightMatrixParameters } from '../../../src/common/iServer/ComputeWeightMatrixParameters';
import { FindClosestFacilitiesParameters } from '../../../src/common/iServer/FindClosestFacilitiesParameters';
import { TransportationAnalystResultSetting } from '../../../src/common/iServer/TransportationAnalystResultSetting';
import { TransportationAnalystParameter } from '../../../src/common/iServer/TransportationAnalystParameter';
import { FindLocationParameters } from '../../../src/common/iServer/FindLocationParameters';
import { FindPathParameters } from '../../../src/common/iServer/FindPathParameters';
import { FindTSPPathsParameters } from '../../../src/common/iServer/FindTSPPathsParameters';
import { FindMTSPPathsParameters } from '../../../src/common/iServer/FindMTSPPathsParameters';
import { FindServiceAreasParameters } from '../../../src/common/iServer/FindServiceAreasParameters';
import { UpdateEdgeWeightParameters } from '../../../src/common/iServer/UpdateEdgeWeightParameters';
import { UpdateTurnNodeWeightParameters } from '../../../src/common/iServer/UpdateTurnNodeWeightParameters';
import { FacilityAnalystStreamParameters } from '../../../src/common/iServer/FacilityAnalystStreamParameters';
import { SupplyCenter } from '../../../src/common/iServer/SupplyCenter'
import { SupplyCenterType } from '../../../src/common/REST';
import mapboxgl from 'mapbox-gl';
import { FetchRequest } from '../../../src/common/util/FetchRequest';

var url = GlobeParameter.networkAnalystURL;
var options = {

};

describe('mapboxgl_NetworkAnalystService', () => {
    var serviceResult;
    var originalTimeout;
    beforeEach(() => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
        serviceResult = null;
    });
    afterEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    //??????????????????
    it('burstPipelineAnalyst', (done) => {
        var burstPipelineAnalystParameters = new BurstPipelineAnalystParameters({
            sourceNodeIDs: [84, 85],
            nodeID: 85,
            isUncertainDirectionValid: false
        });
        var service = new NetworkAnalystService(url, options);
        spyOn(FetchRequest, 'commit').and.callFake((method, testUrl) => {
            expect(method).toBe("GET");
            expect(testUrl).toBe(url + "/burstAnalyse");
            return Promise.resolve(new Response(JSON.stringify(burstPipelineAnalyst)));
        });
        service.burstPipelineAnalyst(burstPipelineAnalystParameters, (result) => {
            serviceResult = result;
            try {
                expect(service).not.toBeNull();
                expect(serviceResult).not.toBeNull();
                expect(serviceResult.type).toEqual("processCompleted");
                var result = serviceResult.result;
                expect(result.succeed).toBe(true);
                expect(result.criticalNodes).not.toBeNull();
                expect(result.edges.length).toEqual(2);
                done();
            } catch (exception) {
                console.log("'burstPipelineAnalyst'????????????" + exception.name + ":" + exception.message);
                expect(false).toBeTruthy();
                done();
            }
    });
    });

    //????????????????????????
    it('computeWeightMatrix', (done) => {
        var computeWeightMatrixParameters = new ComputeWeightMatrixParameters({
            //?????????????????? ID ??????????????????????????????????????? false??????????????????????????????
            isAnalyzeById: true,
            nodes: [84, 85],
        });
        var service = new NetworkAnalystService(url, options);
        spyOn(FetchRequest, 'commit').and.callFake((method, testUrl) => {
            expect(method).toBe("GET");
            expect(testUrl).toBe(url + "/weightmatrix");
            return Promise.resolve(new Response(`[[0,42],[42,0]]`));
        });
        service.computeWeightMatrix(computeWeightMatrixParameters, (result) => {
            serviceResult = result;
            try {
                expect(service).not.toBeNull();
                expect(serviceResult).not.toBeNull();
                expect(serviceResult.type).toEqual("processCompleted");
                var result = serviceResult.result;
                expect(result.succeed).toBe(true);
                expect(result.length).toEqual(2);
                expect(result[0].length).toEqual(2);
                expect(result[1].length).toEqual(2);
                done();
            } catch (e) {
                console.log("'computeWeightMatrix'????????????" + e.name + ":" + e.message);
                expect(false).toBeTruthy();
                done();
            }
    });
    });

    //????????????????????????
    it('findLocation', (done) => {
        var findLocationParameters = new FindLocationParameters({
            //????????????????????????????????????????????????????????????????????????
            expectedSupplyCenterCount: 1,
            //???????????????????????????????????????????????? false
            isFromCenter: false,
            //	?????????????????????????????????????????????????????????????????????????????????????????????ID???????????????????????????????????????
            supplyCenters: [{
                "nodeID": 11,
                "maxWeight": 100,
                "resourceValue": 500,
                "type": "FIXEDCENTER"
            }, {
                "nodeID": 12,
                "maxWeight": 100,
                "resourceValue": 500,
                "type": "OPTIONALCENTER"
            }],
            //??????????????????????????????
            turnWeightField: "TurnCost",
            //????????????????????????????????????????????????????????????????????????????????????????????????
            weightName: "length"
        });
        var service = new NetworkAnalystService(url, options);
        spyOn(FetchRequest, 'commit').and.callFake((method, testUrl) => {
            expect(method).toBe("GET");
            expect(testUrl).toBe(url + "/location");
            return Promise.resolve(new Response(JSON.stringify(findLocationResultJson)));
        });
        service.findLocation(findLocationParameters, (result) => {
            serviceResult = result;
            try {
                expect(service).not.toBeNull();
                expect(serviceResult).not.toBeNull();
                expect(serviceResult.type).toEqual("processCompleted");
                expect(serviceResult.result.succeed).toEqual(true);
                expect(serviceResult.result.demandResults.type).toEqual("FeatureCollection");
                expect(serviceResult.result.supplyResults.type).toEqual("FeatureCollection");
                var demanFeatures = serviceResult.result.demandResults.features;
                expect(demanFeatures.length).toBeGreaterThan(0);
                for (var i = 0; i < demanFeatures.length; i++) {
                    expect(demanFeatures[i].id).not.toBeNull();
                    expect(demanFeatures[i].type).toEqual("Feature");
                    expect(demanFeatures[i].geometry.type).toEqual("Point");
                    expect(demanFeatures[i].geometry.coordinates.length).toEqual(2);
                    expect(demanFeatures[i].properties).not.toBeNull();
                }
                expect(serviceResult.result.supplyResults.features[0].id).not.toBeNull();
                expect(serviceResult.result.supplyResults.features[0].type).toEqual("Feature");
                expect(serviceResult.result.supplyResults.features[0].geometry.type).toEqual("Point");
                expect(serviceResult.result.supplyResults.features[0].geometry.coordinates.length).toEqual(2);
                expect(serviceResult.result.supplyResults.features[0].properties).not.toBeNull();
                done();
            } catch (e) {
                console.log("'findLocation'????????????" + e.name + ":" + e.message);
                expect(false).toBeTruthy();
                done();
            }
    });
    });

    //????????????????????????
    it('findPath', (done) => {
        var resultSetting = new TransportationAnalystResultSetting({
            returnEdgeFeatures: true,
            returnEdgeGeometry: true,
            returnEdgeIDs: true,
            returnNodeFeatures: true,
            returnNodeGeometry: true,
            returnNodeIDs: true,
            returnPathGuides: true,
            returnRoutes: true
        });
        var analystParameter = new TransportationAnalystParameter({
            resultSetting: resultSetting,
            weightFieldName: "length"
        });
        var findPathParameters = new FindPathParameters({
            isAnalyzeById: false,
            nodes: [new mapboxgl.Point(4000, -3000), new mapboxgl.Point(5500, -2500), new mapboxgl.Point(6900, -4000)],
            hasLeastEdgeCount: false,
            parameter: analystParameter
        });
        var service = new NetworkAnalystService(url, options);
        spyOn(FetchRequest, 'commit').and.callFake((method, testUrl) => {
            expect(method).toBe("GET");
            expect(testUrl).toBe(url + "/path");
            return Promise.resolve(new Response(JSON.stringify(findPathResultJson)))
        });
        service.findPath(findPathParameters, (result) => {
            serviceResult = result;
            try {
                expect(service).not.toBeNull();
                expect(serviceResult).not.toBeNull();
                expect(serviceResult.type).toEqual("processCompleted");
                expect(serviceResult.result.succeed).toBe(true);
                expect(serviceResult.result.pathList[0].edgeFeatures.type).toEqual("FeatureCollection");
                var edge_Features = serviceResult.result.pathList[0].edgeFeatures.features;
                expect(edge_Features.length).toBeGreaterThan(0);
                for (var i = 0; i < edge_Features.length; i++) {
                    expect(edge_Features[i].id).not.toBeNull();
                    expect(edge_Features[i].type).toEqual("Feature");
                    expect(edge_Features[i].geometry.type).toEqual("LineString");
                    expect(edge_Features[i].geometry.coordinates.length).toBeGreaterThan(1);
                    if (edge_Features[i].geometry.coordinates.length > 2) {
                        for (var j = 0; j < edge_Features[i].geometry.coordinates.length; j++) {
                            expect(edge_Features[i].geometry.coordinates[j].length).toEqual(2);
                        }
                    }
                    expect(edge_Features[i].properties).not.toBeNull();
                }
                expect(serviceResult.result.pathList[0].edgeIDs.length).toEqual(edge_Features.length);
                expect(serviceResult.result.pathList[0].nodeFeatures.type).toEqual("FeatureCollection");
                var node_Features = serviceResult.result.pathList[0].nodeFeatures.features;
                expect(node_Features.length).toBeGreaterThan(0);
                for (var i = 0; i < edge_Features.length; i++) {
                    expect(node_Features[i].id).not.toBeNull();
                    expect(node_Features[i].type).toEqual("Feature");
                    expect(node_Features[i].geometry.type).toEqual("Point");
                    expect(node_Features[i].geometry.coordinates.length).toEqual(2);
                    expect(node_Features[i].properties).not.toBeNull();
                }
                expect(serviceResult.result.pathList[0].nodeIDs.length).toEqual(node_Features.length);
                var features = serviceResult.result.pathList["0"].pathGuideItems.features;
                expect(features.length).toBeGreaterThan(0);
                for (var i = 0; i < features.length; i++) {
                    expect(features[i].id).not.toBeNull();
                    expect(features[i].type).toEqual("Feature");
                    expect(features[i].geometry.type).not.toBeNull();
                    expect(features[i].geometry.coordinates.length).toBeGreaterThan(1);
                    if (features[i].geometry.coordinates.length > 2) {
                        for (var j = 0; j < features[i].geometry.coordinates.length; j++) {
                            expect(features[i].geometry.coordinates[j].length).toEqual(2);
                        }
                    }
                    expect(features[i].properties).not.toBeNull();
                }
                expect(serviceResult.result.pathList[0].stopWeights).not.toBeNull();
                done();
            } catch (e) {
                console.log("'findPath'????????????" + e.name + ":" + e.message);
                expect(false).toBeTruthy();
                done();
            }
    });
    });

    //?????????????????????
    it('findTSPPaths', (done) => {
        //????????????????????????????????????
        var resultSetting = new TransportationAnalystResultSetting({
            returnEdgeFeatures: true,
            returnEdgeGeometry: true,
            returnEdgeIDs: true,
            returnNodeFeatures: true,
            returnNodeGeometry: true,
            returnNodeIDs: true,
            returnPathGuides: true,
            returnRoutes: true
        });
        var analystParameter = new TransportationAnalystParameter({
            resultSetting: resultSetting,
            weightFieldName: "length"
        });
        var findTSPPathsParameters = new FindTSPPathsParameters({
            //?????????????????????
            endNodeAssigned: false,
            isAnalyzeById: false,
            //?????????????????????????????????????????????
            nodes: [new mapboxgl.Point(3000, -1000), new mapboxgl.Point(3760, -4850), new mapboxgl.Point(8000, -2700)],
            parameter: analystParameter
        });
        var service = new NetworkAnalystService(url, options);
        spyOn(FetchRequest, 'commit').and.callFake((method, testUrl) => {
            expect(method).toBe("GET");
            expect(testUrl).toBe(url + "/tsppath");
            return Promise.resolve(new Response(JSON.stringify(findTSPPathsResultJson)))
        });
        service.findTSPPaths(findTSPPathsParameters, (result) => {
            serviceResult = result;
            try {
                expect(service).not.toBeNull();
                expect(serviceResult).not.toBeNull();
                expect(serviceResult.type).toEqual("processCompleted");
                expect(serviceResult.result.succeed).toBe(true);
                var tspPathList = serviceResult.result.tspPathList[0];
                expect(tspPathList.edgeFeatures.type).toEqual("FeatureCollection");
                var edge_Features = tspPathList.edgeFeatures.features;
                for (var i = 0; i < edge_Features.length; i++) {
                    expect(edge_Features[i].id).not.toBeNull();
                    expect(edge_Features[i].type).toEqual("Feature");
                    expect(edge_Features[i].geometry.type).toEqual("LineString");
                    expect(edge_Features[i].geometry.coordinates).not.toBeNull();
                    expect(edge_Features[i].properties).not.toBeNull();
                }
                expect(tspPathList.edgeIDs.length).toEqual(edge_Features.length);
                var node_Features = tspPathList.nodeFeatures;
                expect(tspPathList.nodeFeatures.type).toEqual("FeatureCollection");
                for (var i = 0; i < node_Features.length; i++) {
                    expect(node_Features[i].id).not.toBeNull();
                    expect(node_Features[i].type).toEqual("Feature");
                    expect(node_Features[i].geometry.type).toEqual("Point");
                    expect(node_Features[i].geometry.coordinates).not.toBeNull();
                    expect(node_Features[i].properties).not.toBeNull();
                }
                expect(tspPathList.nodeIDs.length).toBeGreaterThan(1);
                expect(tspPathList.pathGuideItems.type).toEqual("FeatureCollection");
                expect(tspPathList.pathGuideItems.features).not.toBeNull();
                expect(tspPathList.route.type).toEqual("Feature");
                expect(tspPathList.route.geometry.type).toEqual("MultiLineString");
                expect(tspPathList.route.geometry.coordinates).not.toBeNull();
                expect(tspPathList.stopIndexes.length).toEqual(3);
                expect(tspPathList.stopWeights).not.toBeNull();
                done();
            } catch (e) {
                console.log("'findTSPPaths'????????????" + e.name + ":" + e.message);
                expect(false).toBeTruthy();
                done();
            }
    });
    });

    // ????????????????????????
    it('findMTSPPaths', (done) => {
        var findMTSPPathsParameter = new FindMTSPPathsParameters({
            centers: [new mapboxgl.Point(6000, -5500), new mapboxgl.Point(5500, -2500), new mapboxgl.Point(2500, -3500)],
            isAnalyzeById: false,
            nodes: [new mapboxgl.Point(5000, -5000), new mapboxgl.Point(6500, -3200)],
            hasLeastTotalCost: true,
        });
        var service = new NetworkAnalystService(url, options);
        spyOn(FetchRequest, 'commit').and.callFake((method, testUrl) => {
            expect(method).toBe("GET");
            expect(testUrl).toBe(url + "/mtsppath");
            return Promise.resolve(new Response(JSON.stringify(findMTSPPathsResultJson)));
        });
        service.findMTSPPaths(findMTSPPathsParameter, (result) => {
            serviceResult = result;
            try {
                expect(service).not.toBeNull();
                expect(serviceResult).not.toBeNull();
                expect(serviceResult.type).toEqual("processCompleted");
                expect(serviceResult.result.succeed).toBe(true);
                expect(serviceResult.result.pathList.length).toEqual(2);
                var path = serviceResult.result.pathList["0"];
                expect(path.center).not.toBeNull();
                expect(serviceResult.result.pathList[0].stopWeights).not.toBeNull();
                expect(serviceResult.result.pathList[0].weight).not.toBeNull();
                done();
            } catch (e) {
                console.log("'findMTSPPaths'????????????" + e.name + ":" + e.message);
                expect(false).toBeTruthy();
                done();
            }
    });
    });

    //?????????????????????
    it('findServiceAreas', (done) => {
        var point = new mapboxgl.Point(5605, -3375);
        var resultSetting = new TransportationAnalystResultSetting({
            returnEdgeFeatures: true,
            returnEdgeGeometry: true,
            returnEdgeIDs: true,
        });
        var analystParameter = new TransportationAnalystParameter({
            resultSetting: resultSetting,
            weightFieldName: "length"
        });
        var parameter = new FindServiceAreasParameters({
            centers: [point],
            isAnalyzeById: false,
            parameter: analystParameter
        });
        parameter.weights = [400 + Math.random() * 100];
        var service = new NetworkAnalystService(url, options);
        spyOn(FetchRequest, 'commit').and.callFake((method, testUrl) => {
            expect(method).toBe("GET");
            expect(testUrl).toBe(url + "/servicearea");
            return Promise.resolve(new Response(JSON.stringify(findServiceAreasResultJson)));
        });
        service.findServiceAreas(parameter, (result) => {
            serviceResult = result;
            try {
                expect(service).not.toBeNull();
                expect(serviceResult).not.toBeNull();
                expect(serviceResult.type).toEqual("processCompleted");
                expect(serviceResult.result.succeed).toBe(true);
                var serviceAreaList = serviceResult.result.serviceAreaList[0];
                expect(serviceAreaList.edgeFeatures.type).toEqual("FeatureCollection");
                var features = serviceAreaList.edgeFeatures.features;
                expect(features.length).toBeGreaterThan(0);
                for (var i = 0; i < features.length; i++) {
                    expect(features[i].id).not.toBeNull();
                    expect(features[i].type).toEqual("Feature");
                    expect(features[i].geometry.type).toEqual("LineString");
                    if (features[i].geometry.coordinates.length > 2) {
                        for (var j = 0; j < features[i].geometry.coordinates.length; j++) {
                            expect(features[i].geometry.coordinates[j].length).toEqual(2);
                        }
                    }
                }
                expect(serviceAreaList.edgeIDs.length).toEqual(features.length);
                expect(serviceAreaList.serviceRegion).not.toBeNull();
                done();
            } catch (e) {
                console.log("'findServiceAreas'????????????" + e.name + ":" + e.message);
                expect(false).toBeTruthy();
                done();
            }
    });
    });

    //??????????????????????????????
    it('updateEdgeWeight', (done) => {
        var updateEdgeWeightParameters = new UpdateEdgeWeightParameters({
            edgeId: "20",
            edgeWeight: "30",
            fromNodeId: "26",
            toNodeId: "109",
            weightField: "time"
        });
        var service = new NetworkAnalystService(url, options);
        spyOn(FetchRequest, 'commit').and.callFake((method, testUrl) => {
            expect(method).toBe("PUT");
            expect(testUrl).toBe(url + "/edgeweight/20/fromnode/26/tonode/109/weightfield/time");
            return Promise.resolve(new Response(`{"succeed":true}`));
        });
        service.updateEdgeWeight(updateEdgeWeightParameters, (result) => {
            serviceResult = result;
            try {
                expect(service).not.toBeNull();
                expect(serviceResult).not.toBeNull();
                expect(serviceResult.type).toEqual("processCompleted");
                expect(serviceResult.result.succeed).toBe(true);
                done();
            } catch (e) {
                console.log("'updateEdgeWeight'????????????" + e.name + ":" + e.message);
                expect(false).toBeTruthy();
                done();
            }
    });
    });

    //??????????????????????????????
    it('updateTurnNodeWeight', (done) => {
        var parameters = new UpdateTurnNodeWeightParameters({
            //???????????????id
            nodeId: "106",
            //????????????
            turnNodeWeight: "10",
            //????????????id
            fromEdgeId: "6508",
            //????????????id
            toEdgeId: "6504",
            //???????????????????????????
            weightField: "TurnCost"
        });
        var service = new NetworkAnalystService(url, options);
        spyOn(FetchRequest, 'commit').and.callFake((method, testUrl) => {
            expect(method).toBe("PUT");
            expect(testUrl).toBe(url + "/turnnodeweight/106/fromedge/6508/toedge/6504/weightfield/TurnCost");
            return Promise.resolve(new Response(`{"succeed":true}`));
        });
        service.updateTurnNodeWeight(parameters, (result) => {
            serviceResult = result;
            try {
                expect(service).not.toBeNull();
                expect(serviceResult).not.toBeNull();
                expect(serviceResult.type).toEqual("processCompleted");
                expect(serviceResult.result.succeed).toBe(true);
                done();
            } catch (e) {
                console.log("'updateTurnNodeWeight'????????????" + e.name + ":" + e.message);
                expect(false).toBeTruthy();
                done();
            }
    });
    });

    //????????????????????????
    it('findClosestFacilities', (done) => {
        //????????????????????????????????????
        var resultSetting = new TransportationAnalystResultSetting({
            returnEdgeFeatures: true,
            returnEdgeGeometry: true,
            returnEdgeIDs: true,
            returnNodeFeatures: true,
            returnNodeGeometry: true,
            returnNodeIDs: true,
            returnPathGuides: true,
            returnRoutes: true
        });
        var analystParameter = new TransportationAnalystParameter({
            resultSetting: resultSetting,
            turnWeightField: "TurnCost",
            weightFieldName: "length"  //length,time
        });
        var findClosetFacilitiesParameter = new FindClosestFacilitiesParameters({
            //?????????,????????????
            event: new mapboxgl.Point(5000, -3700),
            //??????????????????????????????????????????1
            expectFacilityCount: 1,
            //???????????????,??????
            facilities: [new mapboxgl.Point(2500, -3500), new mapboxgl.Point(5500, -2500), new mapboxgl.Point(7000, -4000)],
            isAnalyzeById: false,
            parameter: analystParameter
        });
        var service = new NetworkAnalystService(url, options);
        spyOn(FetchRequest, 'commit').and.callFake((method, testUrl) => {
            expect(method).toBe("GET");
            expect(testUrl).toBe(url + "/closestfacility");
            return Promise.resolve(new Response(JSON.stringify(findClosetFacilitiesResultJson_False)));
        });
        service.findClosestFacilities(findClosetFacilitiesParameter, (result) => {
            serviceResult = result;
            try {
                expect(service).not.toBeNull();
                expect(serviceResult).not.toBeNull();
                expect(serviceResult.type).toEqual("processCompleted");
                expect(serviceResult.result.succeed).toBe(true);
                var facilityPath = serviceResult.result.facilityPathList[0];
                expect(facilityPath.edgeFeatures.type).toEqual("FeatureCollection");
                var features = facilityPath.edgeFeatures.features;
                expect(features.length).toEqual(facilityPath.edgeIDs.length);
                for (var i = 0; i < features.length; i++) {
                    expect(features[i].id).not.toBeNull();
                    expect(features[i].type).toEqual("Feature");
                    expect(features[i].geometry.type).toEqual("LineString");
                    expect(features[i].geometry.coordinates.length).toBeGreaterThan(0);
                    for (var j = 0; j < features[i].geometry.coordinates.length; j++) {
                        expect(features[i].geometry.coordinates[j].length).toEqual(2);
                    }
                    expect(features[i].properties).not.toBeNull();
                }
                expect(facilityPath.edgeIDs.length).toBeGreaterThan(0);
                expect(facilityPath.facility.x).not.toBeNull();
                expect(facilityPath.facility.y).not.toBeNull();
                expect(facilityPath.facilityIndex).toEqual(1);
                expect(facilityPath.nodeFeatures.type).toEqual("FeatureCollection");
                var node_features = facilityPath.nodeFeatures.features;
                expect(node_features.length).toBeGreaterThan(0);
                for (var i = 0; i < node_features.length; i++) {
                    expect(node_features[i].id).not.toBeNull();
                    expect(node_features[i].type).toEqual("Feature");
                    expect(node_features[i].geometry.type).toEqual("Point");
                    expect(node_features[i].geometry.coordinates.length).toEqual(2);
                    expect(node_features[i].properties).not.toBeNull();
                }
                expect(facilityPath.nodeIDs.length).toEqual(node_features.length);
                expect(facilityPath.pathGuideItems.type).toEqual("FeatureCollection");
                for (var i = 0; i < facilityPath.pathGuideItems.features.length; i++) {
                    expect(facilityPath.pathGuideItems.features[i].type).toEqual("Feature");
                    expect(facilityPath.pathGuideItems.features[i].geometry.type).not.toBeNull();
                    expect(facilityPath.pathGuideItems.features[i].geometry.coordinates.length).toBeGreaterThan(0);
                    if (facilityPath.pathGuideItems.features[i].geometry.coordinates.length > 2) {
                        for (var j = 0; j < facilityPath.pathGuideItems.features[i].geometry.coordinates.length; j++) {
                            expect(facilityPath.pathGuideItems.features[i].geometry.coordinates[j].length).toEqual(2);
                        }
                    }
                    expect(facilityPath.pathGuideItems.features[i].properties).not.toBeNull();
                }
                expect(facilityPath.route.type).toEqual("Feature");
                expect(facilityPath.route.geometry.type).toEqual("MultiLineString");
                expect(facilityPath.route.geometry.coordinates[0].length).toBeGreaterThan(0);
                for (var i = 0; i < facilityPath.route.geometry.coordinates[0].length; i++) {
                    expect(facilityPath.route.geometry.coordinates[0][i].length).toEqual(3);
                }
                expect(facilityPath.stopWeights).not.toBeNull();
                expect(facilityPath.weight).not.toBeNull();
                done();
            } catch (e) {
                console.log("'findClosestFacilities'????????????" + e.name + ":" + e.message);
                expect(false).toBeTruthy();
                done();
            }
    });
    });
    // ??????/?????? ??????????????????????????????
    it('streamFacilityAnalyst', (done) => {
        var facilityAnalystStreamParameters = new FacilityAnalystStreamParameters({
            edgeID: 84,
            //nodeID:85,
            isUncertainDirectionValid: true,
            sourceNodeIDs: [],
            // ???????????????????????? 0 (????????????????????????) ????????? 1??????????????????????????????
            queryType: 1
        });
        var service = new NetworkAnalystService(url, options);
        spyOn(FetchRequest, 'commit').and.callFake((method, testUrl) => {
            expect(method).toBe("GET");
            expect(testUrl).toBe(url + "/downstreamcirticalfaclilities");
            return Promise.resolve(new Response(JSON.stringify(streamFacilityAnalystResultJson)));
        });
        service.streamFacilityAnalyst(facilityAnalystStreamParameters, (result) => {
            serviceResult = result;
            try {
                expect(service).not.toBeNull();
                expect(serviceResult).not.toBeNull();
                expect(serviceResult.result).not.toBeNull();
                expect(serviceResult.type).toEqual("processCompleted");
                done();
            } catch (e) {
                console.log("'streamFacilityAnalyst_test'????????????" + e.name + ":" + e.message);
                expect(false).toBeTruthy();
                done();
            }
    });
    });
});


