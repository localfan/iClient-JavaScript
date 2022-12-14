/* CopyrightÂ© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
 * This program are made available under the terms of the Apache License, Version 2.0
 * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html.*/
import {Util} from '../core/Util';
import { DataFormat } from '@supermap/iclient-common/REST';
import { Point as GeometryPoint } from '@supermap/iclient-common/commontypes/geometry/Point';
import { AreaSolarRadiationService } from '@supermap/iclient-common/iServer/AreaSolarRadiationService';
import { BufferAnalystService } from '@supermap/iclient-common/iServer/BufferAnalystService';
import { DensityAnalystService } from '@supermap/iclient-common/iServer/DensityAnalystService';
import { GenerateSpatialDataService } from '@supermap/iclient-common/iServer/GenerateSpatialDataService';
import { GeoRelationAnalystService } from '@supermap/iclient-common/iServer/GeoRelationAnalystService';
import { InterpolationAnalystService } from '@supermap/iclient-common/iServer/InterpolationAnalystService';
import { MathExpressionAnalysisService } from '@supermap/iclient-common/iServer/MathExpressionAnalysisService';
import { OverlayAnalystService } from '@supermap/iclient-common/iServer/OverlayAnalystService';
import { RouteCalculateMeasureService } from '@supermap/iclient-common/iServer/RouteCalculateMeasureService';
import { RouteLocatorService } from '@supermap/iclient-common/iServer/RouteLocatorService';
import { SurfaceAnalystService } from '@supermap/iclient-common/iServer/SurfaceAnalystService';
import { TerrainCurvatureCalculationService } from '@supermap/iclient-common/iServer/TerrainCurvatureCalculationService';
import { ThiessenAnalystService } from '@supermap/iclient-common/iServer/ThiessenAnalystService';
import { GeometryBatchAnalystService } from '@supermap/iclient-common/iServer/GeometryBatchAnalystService';

import {ServiceBase} from './ServiceBase';
import LineString from 'ol/geom/LineString';
import GeoJSON from 'ol/format/GeoJSON';

/**
 * @class SpatialAnalystService
 * @extends {ServiceBase}
 * @category  iServer SpatialAnalyst
 * @classdesc ç©şé—´ĺ?†ćž?ćśŤĺŠˇç±»ă€‚ćŹ?äľ›ďĽšĺś°ĺŚşĺ¤Şé?łčľ?ĺ°„ă€?çĽ“ĺ†˛ĺŚşĺ?†ćž?ă€?ç‚ąĺŻ†ĺş¦ĺ?†ćž?ă€?ĺŠ¨ć€?ĺ?†ć®µĺ?†ćž?ă€?ç©şé—´ĺ…łçł»ĺ?†ćž?ă€?ćŹ’ĺ€Ľĺ?†ćž?ă€?ć …ć Ľä»Łć•°čż?ç®—ă€?ĺŹ ĺŠ ĺ?†ćž?ă€?č·Żç”±ĺ®šä˝Ťă€?č·Żç”±ćµ‹é‡Źč®ˇç®—ă€?čˇ¨éť˘ĺ?†ćž?ă€?ĺś°ĺ˝˘ć›˛çŽ‡č®ˇç®—ă€?ćł°ćŁ®ĺ¤ščľąĺ˝˘ĺ?†ćž?ă€‚
 * @example
 *      new SpatialAnalystService(url).bufferAnalysis(params,function(result){
 *          //doSomething
 *      })
 * @param {string} url - ćśŤĺŠˇĺś°ĺť€ă€‚
 * @param {Object} options - ĺŹ‚ć•°ă€‚
 * @param {string} [options.proxy] - ćśŤĺŠˇä»Łç?†ĺś°ĺť€ă€‚
 * @param {boolean} [options.withCredentials=false] - čŻ·ć±‚ć?Żĺ?¦ć?şĺ¸¦ cookieă€‚
 * @param {boolean} [options.crossOrigin] - ć?Żĺ?¦ĺ…?č®¸č·¨ĺźźčŻ·ć±‚ă€‚
 * @param {Object} [options.headers] - čŻ·ć±‚ĺ¤´ă€‚
 * @usage
 */
export class SpatialAnalystService extends ServiceBase {

    constructor(url, options) {
        super(url, options);
    }

    /**
     * @function SpatialAnalystService.prototype.getAreaSolarRadiationResult
     * @description ĺś°ĺŚşĺ¤Şé?łčľ?ĺ°„ă€‚
     * @param {AreaSolarRadiationParameters} params - ĺś°ĺŚşĺ¤Şé?łčľ?ĺ°„ĺŹ‚ć•°ç±»ă€‚
     * @param {RequestCallback} callback ĺ›žč°?ĺ‡˝ć•°ă€‚
     * @param {DataFormat} [resultFormat=DataFormat.GEOJSON] - čż”ĺ›žçš„ç»“ćžśç±»ĺž‹ă€‚
     */
    getAreaSolarRadiationResult(params, callback, resultFormat) {
        var me = this;
        var areaSolarRadiationService = new AreaSolarRadiationService(me.url, {
            proxy: me.options.proxy,
            withCredentials: me.options.withCredentials,
            crossOrigin: me.options.crossOrigin,
            headers: me.options.headers,

            eventListeners: {
                scope: me,
                processCompleted: callback,
                processFailed: callback
            },
            format: me._processFormat(resultFormat)
        });
        areaSolarRadiationService.processAsync(params);
    }

    /**
     * @function SpatialAnalystService.prototype.bufferAnalysis
     * @description çĽ“ĺ†˛ĺŚşĺ?†ćž?ă€‚
     * @param {DatasetBufferAnalystParameters} params - ć•°ćŤ®é›†çĽ“ĺ†˛ĺŚşĺ?†ćž?ĺŹ‚ć•°ç±»ă€‚
     * @param {RequestCallback} callback ĺ›žč°?ĺ‡˝ć•°ă€‚
     * @param {DataFormat} [resultFormat=DataFormat.GEOJSON] - čż”ĺ›žçš„ç»“ćžśç±»ĺž‹ă€‚
     */
    bufferAnalysis(params, callback, resultFormat) {
        var me = this;
        var bufferAnalystService = new BufferAnalystService(me.url, {
            proxy: me.options.proxy,
            withCredentials: me.options.withCredentials,
            crossOrigin: me.options.crossOrigin,
            headers: me.options.headers,

            eventListeners: {
                scope: me,
                processCompleted: callback,
                processFailed: callback
            },
            format: me._processFormat(resultFormat)
        });
        bufferAnalystService.processAsync(me._processParams(params));
    }

    /**
     * @function SpatialAnalystService.prototype.densityAnalysis
     * @description ç‚ąĺŻ†ĺş¦ĺ?†ćž?ă€‚
     * @param {DensityKernelAnalystParameters} params - ć ¸ĺŻ†ĺş¦ĺ?†ćž?ĺŹ‚ć•°ç±»ă€‚
     * @param {RequestCallback} callback ĺ›žč°?ĺ‡˝ć•°ă€‚
     * @param {DataFormat} [resultFormat=DataFormat.GEOJSON] - čż”ĺ›žçš„ç»“ćžśç±»ĺž‹ă€‚
     */
    densityAnalysis(params, callback, resultFormat) {
        var me = this;
        var densityAnalystService = new DensityAnalystService(me.url, {
            proxy: me.options.proxy,
            withCredentials: me.options.withCredentials,
            crossOrigin: me.options.crossOrigin,
            headers: me.options.headers,

            eventListeners: {
                scope: me,
                processCompleted: callback,
                processFailed: callback
            },
            format: me._processFormat(resultFormat)
        });
        densityAnalystService.processAsync(me._processParams(params));
    }

    /**
     * @function SpatialAnalystService.prototype.generateSpatialData
     * @description ĺŠ¨ć€?ĺ?†ć®µĺ?†ćž?ă€‚
     * @param {GenerateSpatialDataParameters} params - ĺŠ¨ć€?ĺ?†ć®µć“Ťä˝śĺŹ‚ć•°ç±»ă€‚
     * @param {RequestCallback} callback ĺ›žč°?ĺ‡˝ć•°ă€‚
     * @param {DataFormat} [resultFormat=DataFormat.GEOJSON] - čż”ĺ›žçš„ç»“ćžśç±»ĺž‹ă€‚
     */
    generateSpatialData(params, callback, resultFormat) {
        var me = this;
        var generateSpatialDataService = new GenerateSpatialDataService(me.url, {
            proxy: me.options.proxy,
            withCredentials: me.options.withCredentials,
            crossOrigin: me.options.crossOrigin,
            headers: me.options.headers,

            eventListeners: {
                scope: me,
                processCompleted: callback,
                processFailed: callback
            },
            format: me._processFormat(resultFormat)
        });
        generateSpatialDataService.processAsync(params);
    }

    /**
     * @function SpatialAnalystService.prototype.geoRelationAnalysis
     * @description ç©şé—´ĺ…łçł»ĺ?†ćž?ă€‚
     * @param {GeoRelationAnalystParameters} params - ç©şé—´ĺ…łçł»ĺ?†ćž?ćśŤĺŠˇĺŹ‚ć•°ç±»ă€‚
     * @param {RequestCallback} callback ĺ›žč°?ĺ‡˝ć•°ă€‚
     * @param {DataFormat} [resultFormat=DataFormat.GEOJSON] - čż”ĺ›žçš„ç»“ćžśç±»ĺž‹ă€‚
     */
    geoRelationAnalysis(params, callback, resultFormat) {
        var me = this;
        var geoRelationAnalystService = new GeoRelationAnalystService(me.url, {
            proxy: me.options.proxy,
            withCredentials: me.options.withCredentials,
            crossOrigin: me.options.crossOrigin,
            headers: me.options.headers,

            eventListeners: {
                scope: me,
                processCompleted: callback,
                processFailed: callback
            },
            format: me._processFormat(resultFormat)
        });
        geoRelationAnalystService.processAsync(params);
    }

    /**
     * @function SpatialAnalystService.prototype.interpolationAnalysis
     * @description ćŹ’ĺ€Ľĺ?†ćž?ă€‚
     * @param {InterpolationRBFAnalystParameters|InterpolationDensityAnalystParameters|InterpolationIDWAnalystParameters|InterpolationKrigingAnalystParameters} params - ć ·ćťˇćŹ’ĺ€Ľĺ?†ćž?ĺŹ‚ć•°ç±»ă€‚
     * @param {RequestCallback} callback ĺ›žč°?ĺ‡˝ć•°ă€‚
     * @param {DataFormat} [resultFormat=DataFormat.GEOJSON] - čż”ĺ›žçš„ç»“ćžśç±»ĺž‹ă€‚
     */
    interpolationAnalysis(params, callback, resultFormat) {
        var me = this;
        var interpolationAnalystService = new InterpolationAnalystService(me.url, {
            proxy: me.options.proxy,
            withCredentials: me.options.withCredentials,
            crossOrigin: me.options.crossOrigin,
            headers: me.options.headers,

            eventListeners: {
                scope: me,
                processCompleted: callback,
                processFailed: callback
            },
            format: me._processFormat(resultFormat)
        });
        interpolationAnalystService.processAsync(me._processParams(params));
    }
    /**
     * @function SpatialAnalystService.prototype.mathExpressionAnalysis
     * @description ć …ć Ľä»Łć•°čż?ç®—ă€‚
     * @param {MathExpressionAnalysisParameters} params - ć …ć Ľä»Łć•°čż?ç®—ĺŹ‚ć•°ç±»ă€‚
     * @param {RequestCallback} callback ĺ›žč°?ĺ‡˝ć•°ă€‚
     * @param {DataFormat} [resultFormat=DataFormat.GEOJSON] - čż”ĺ›žçš„ç»“ćžśç±»ĺž‹ă€‚
     */
    mathExpressionAnalysis(params, callback, resultFormat) {
        var me = this;
        var mathExpressionAnalysisService = new MathExpressionAnalysisService(me.url, {
            proxy: me.options.proxy,
            withCredentials: me.options.withCredentials,
            crossOrigin: me.options.crossOrigin,
            headers: me.options.headers,

            eventListeners: {
                scope: me,
                processCompleted: callback,
                processFailed: callback
            },
            format: me._processFormat(resultFormat)
        });
        mathExpressionAnalysisService.processAsync(me._processParams(params));
    }

    /**
     * @function SpatialAnalystService.prototype.overlayAnalysis
     * @description ĺŹ ĺŠ ĺ?†ćž?ă€‚
     * @param {DatasetOverlayAnalystParameters|GeometryOverlayAnalystParameters} params - ć•°ćŤ®é›†ĺŹ ĺŠ ĺ?†ćž?ĺŹ‚ć•°ç±»ć?–ĺ‡ ä˝•ĺŻąč±ˇĺŹ ĺŠ ĺ?†ćž?ĺŹ‚ć•°ç±»ă€‚
     * @param {RequestCallback} callback ĺ›žč°?ĺ‡˝ć•°ă€‚
     * @param {DataFormat} [resultFormat=DataFormat.GEOJSON] - čż”ĺ›žçš„ç»“ćžśç±»ĺž‹ă€‚
     */
    overlayAnalysis(params, callback, resultFormat) {
        var me = this;
        var overlayAnalystService = new OverlayAnalystService(me.url, {
            proxy: me.options.proxy,
            withCredentials: me.options.withCredentials,
            crossOrigin: me.options.crossOrigin,
            headers: me.options.headers,

            eventListeners: {
                scope: me,
                processCompleted: callback,
                processFailed: callback
            },
            format: me._processFormat(resultFormat)
        });
        overlayAnalystService.processAsync(me._processParams(params));
    }

    /**
     * @function SpatialAnalystService.prototype.routeCalculateMeasure
     * @description č·Żç”±ćµ‹é‡Źč®ˇç®—ă€‚
     * @param {RouteCalculateMeasureParameters} params - ĺźşäşŽč·Żç”±ĺŻąč±ˇč®ˇç®—ćŚ‡ĺ®šç‚ą M ĺ€Ľć“Ťä˝śçš„ĺŹ‚ć•°ç±»ă€‚
     * @param {RequestCallback} callback ĺ›žč°?ĺ‡˝ć•°ă€‚
     * @param {DataFormat} [resultFormat=DataFormat.GEOJSON] - čż”ĺ›žçš„ç»“ćžśç±»ĺž‹ă€‚
     */
    routeCalculateMeasure(params, callback, resultFormat) {
        var me = this;
        var routeCalculateMeasureService = new RouteCalculateMeasureService(me.url, {
            proxy: me.options.proxy,
            withCredentials: me.options.withCredentials,
            crossOrigin: me.options.crossOrigin,
            headers: me.options.headers,

            eventListeners: {
                scope: me,
                processCompleted: callback,
                processFailed: callback
            },
            format: me._processFormat(resultFormat)
        });
        routeCalculateMeasureService.processAsync(me._processParams(params));
    }

    /**
     * @function SpatialAnalystService.prototype.routeLocate
     * @description č·Żç”±ĺ®šä˝Ťă€‚
     * @param {RouteLocatorParameters} params - č·Żç”±ĺŻąč±ˇĺ®šä˝Ťç©şé—´ĺŻąč±ˇçš„ĺŹ‚ć•°ç±»ă€‚
     * @param {RequestCallback} callback ĺ›žč°?ĺ‡˝ć•°ă€‚
     * @param {DataFormat} [resultFormat=DataFormat.GEOJSON] - čż”ĺ›žçš„ç»“ćžśç±»ĺž‹ă€‚
     */
    routeLocate(params, callback, resultFormat) {
        var me = this;
        var routeLocatorService = new RouteLocatorService(me.url, {
            proxy: me.options.proxy,
            withCredentials: me.options.withCredentials,
            crossOrigin: me.options.crossOrigin,
            headers: me.options.headers,

            eventListeners: {
                scope: me,
                processCompleted: callback,
                processFailed: callback
            },
            format: me._processFormat(resultFormat)
        });
        routeLocatorService.processAsync(me._processParams(params));
    }

    /**
     * @function SpatialAnalystService.prototype.surfaceAnalysis
     * @description čˇ¨éť˘ĺ?†ćž?ă€‚
     * @param {SurfaceAnalystParameters} params - čˇ¨éť˘ĺ?†ćž?ćŹ?ĺŹ–ć“Ťä˝śĺŹ‚ć•°ç±»ă€‚
     * @param {RequestCallback} callback ĺ›žč°?ĺ‡˝ć•°ă€‚
     * @param {DataFormat} [resultFormat=DataFormat.GEOJSON] - čż”ĺ›žçš„ç»“ćžśç±»ĺž‹ă€‚
     */
    surfaceAnalysis(params, callback, resultFormat) {
        var me = this;
        var surfaceAnalystService = new SurfaceAnalystService(me.url, {
            proxy: me.options.proxy,
            withCredentials: me.options.withCredentials,
            crossOrigin: me.options.crossOrigin,
            headers: me.options.headers,

            eventListeners: {
                scope: me,
                processCompleted: callback,
                processFailed: callback
            },
            format: me._processFormat(resultFormat)
        });
        surfaceAnalystService.processAsync(me._processParams(params));
    }

    /**
     * @function SpatialAnalystService.prototype.terrainCurvatureCalculate
     * @description ĺś°ĺ˝˘ć›˛çŽ‡č®ˇç®—ă€‚
     * @param {TerrainCurvatureCalculationParameters} params - ĺś°ĺ˝˘ć›˛çŽ‡č®ˇç®—ĺŹ‚ć•°ç±»ă€‚
     * @param {RequestCallback} callback ĺ›žč°?ĺ‡˝ć•°ă€‚
     * @param {DataFormat} [resultFormat=DataFormat.GEOJSON] - čż”ĺ›žçš„ç»“ćžśç±»ĺž‹ă€‚
     */
    terrainCurvatureCalculate(params, callback, resultFormat) {
        var me = this;
        var terrainCurvatureCalculationService = new TerrainCurvatureCalculationService(me.url, {
            proxy: me.options.proxy,
            withCredentials: me.options.withCredentials,
            crossOrigin: me.options.crossOrigin,
            headers: me.options.headers,

            eventListeners: {
                scope: me,
                processCompleted: callback,
                processFailed: callback
            },
            format: me._processFormat(resultFormat)
        });
        terrainCurvatureCalculationService.processAsync(params);
    }

    /**
     * @function SpatialAnalystService.prototype.thiessenAnalysis
     * @description ćł°ćŁ®ĺ¤ščľąĺ˝˘ĺ?†ćž?ă€‚
     * @param {DatasetThiessenAnalystParameters|GeometryThiessenAnalystParameters} params - ć•°ćŤ®é›†ćł°ćŁ®ĺ¤ščľąĺ˝˘ĺ?†ćž?ĺŹ‚ć•°ç±»ă€‚
     * @param {RequestCallback} callback ĺ›žč°?ĺ‡˝ć•°ă€‚
     * @param {DataFormat} [resultFormat=DataFormat.GEOJSON] - čż”ĺ›žçš„ç»“ćžśç±»ĺž‹ă€‚
     */
    thiessenAnalysis(params, callback, resultFormat) {
        var me = this;
        var thiessenAnalystService = new ThiessenAnalystService(me.url, {
            proxy: me.options.proxy,
            withCredentials: me.options.withCredentials,
            crossOrigin: me.options.crossOrigin,
            headers: me.options.headers,

            eventListeners: {
                scope: me,
                processCompleted: callback,
                processFailed: callback
            },
            format: me._processFormat(resultFormat)
        });
        thiessenAnalystService.processAsync(me._processParams(params));
    }

    /**
     * @function SpatialAnalystService.prototype.geometrybatchAnalysis
     * @description ć‰ąé‡Źç©şé—´ĺ?†ćž?ă€‚
     * @param {Array.<Object>} params - ć‰ąé‡Źĺ?†ćž?ĺŹ‚ć•°ĺŻąč±ˇć•°ç»„ă€‚
     * @param {Array.<Object>} params.analystName - ç©şé—´ĺ?†ćž?ć–ąćł•çš„ĺ?Ťç§°ă€‚ĺŚ…ć‹¬ďĽš</br>
     *                                              "buffer"ďĽŚ"overlay"ďĽŚ"interpolationDensity"ďĽŚ"interpolationidw"ďĽŚ"interpolationRBF"ďĽŚ"interpolationKriging"ďĽŚ"isoregion"ďĽŚ"isoline"ă€‚
     * @param {Object} params.param - ç©şé—´ĺ?†ćž?ç±»ĺž‹ĺŻąĺş”çš„čŻ·ć±‚ĺŹ‚ć•°ďĽŚĺŚ…ć‹¬ďĽš</br>
     *                                {@link GeometryBufferAnalystParameters} çĽ“ĺ†˛ĺŚşĺ?†ćž?ĺŹ‚ć•°ç±»ă€‚</br>
     *                                {@link GeometryOverlayAnalystParameters} ĺŹ ĺŠ ĺ?†ćž?ĺŹ‚ć•°ç±»ă€‚</br>
     *                                {@link InterpolationAnalystParameters} ćŹ’ĺ€Ľĺ?†ćž?ĺŹ‚ć•°ç±»ă€‚</br>
     *                                {@link SurfaceAnalystParameters} čˇ¨éť˘ĺ?†ćž?ĺŹ‚ć•°ç±»ă€‚</br>
     * @param {RequestCallback} callback - ĺ›žč°?ĺ‡˝ć•°ă€‚
     * @param {DataFormat} [resultFormat=DataFormat.GEOJSON] - čż”ĺ›žçš„ç»“ćžśç±»ĺž‹ă€‚
     */
    geometrybatchAnalysis(params, callback, resultFormat) {
        var me = this;
        var geometryBatchAnalystService = new GeometryBatchAnalystService(me.url, {

            eventListeners: {
                scope: me,
                processCompleted: callback,
                processFailed: callback
            },
            format: me._processFormat(resultFormat)
        });

        //ĺ¤„ç?†ć‰ąé‡Źĺ?†ćž?ä¸­ĺ?„ä¸Şĺ?†ç±»ç±»ĺž‹çš„ĺŹ‚ć•°ďĽš
        var analystParameters = [];
        for (var i = 0; i < params.length; i++) {
            var tempParameter = params[i];
            analystParameters.push({
                analystName: tempParameter.analystName,
                param: me._processParams(tempParameter.param)
            })
        }

        geometryBatchAnalystService.processAsync(analystParameters);
    }

    _processParams(params) {
        if (!params) {
            return {};
        }
        if (params.bounds) {
            params.bounds = Util.toSuperMapBounds(params.bounds);
        }
        if (params.inputPoints) {
            for (let i = 0; i < params.inputPoints.length; i++) {
                var inputPoint = params.inputPoints[i];
                if (Util.isArray(inputPoint)) {
                    params.inputPoints[i] = {x: inputPoint[0], y: inputPoint[1], tag: inputPoint[2]};
                } else {
                    params.inputPoints[i] = {
                        x: inputPoint.getCoordinates()[0],
                        y: inputPoint.getCoordinates()[1],
                        tag: inputPoint.tag
                    };
                }

            }
        }
        if (params.points) {
            for (let i = 0; i < params.points.length; i++) {
                let point = params.points[i];
                if (Util.isArray(point)) {
                    point.setCoordinates(point);
                }
                params.points[i] = new GeometryPoint(point.getCoordinates()[0], point.getCoordinates()[1]);
            }
        }
        if (params.point) {
            let point = params.point;
            if (Util.isArray(point)) {
                point.setCoordinates(point);
            }
            params.point = new GeometryPoint(point.getCoordinates()[0], point.getCoordinates()[1]);
        }
        if (params.extractRegion) {
            params.extractRegion = this.convertGeometry(params.extractRegion);
        }
        if (params.extractParameter && params.extractParameter.clipRegion) {
            params.extractParameter.clipRegion = this.convertGeometry(params.extractParameter.clipRegion);
        }
        if (params.clipParam && params.clipParam.clipRegion) {
            params.clipParam.clipRegion = this.convertGeometry(params.clipParam.clipRegion);
        }
        //ć”ŻćŚ?ć ĽĺĽŹďĽšVector Layers; GeoJson
        if (params.sourceGeometry) {
            var SRID = null;
            if (params.sourceGeometrySRID) {
                SRID = params.sourceGeometrySRID;
            }
            params.sourceGeometry = this.convertGeometry(params.sourceGeometry);
            if (SRID) {
                params.sourceGeometry.SRID = SRID;
            }
            delete params.sourceGeometry.sourceGeometrySRID;
        }
        if (params.operateGeometry) {
            params.operateGeometry = this.convertGeometry(params.operateGeometry);
        }
        //ć”ŻćŚ?äĽ ĺ…Ąĺ¤šä¸Şĺ‡ ä˝•č¦?ç´ čż›čˇŚĺŹ ĺŠ ĺ?†ćž?ďĽš
        if (params.sourceGeometries) {
            var sourceGeometries = [];
            for (var k = 0; k < params.sourceGeometries.length; k++) {
                sourceGeometries.push(this.convertGeometry(params.sourceGeometries[k]));
            }
            params.sourceGeometries = sourceGeometries;
        }
        //ć”ŻćŚ?äĽ ĺ…Ąĺ¤šä¸Şĺ‡ ä˝•č¦?ç´ čż›čˇŚĺŹ ĺŠ ĺ?†ćž?ďĽš
        if (params.operateGeometries) {
            var operateGeometries = [];
            for (var j = 0; j < params.operateGeometries.length; j++) {
                operateGeometries.push(this.convertGeometry(params.operateGeometries[j]));
            }
            params.operateGeometries = operateGeometries;
        }

        if (params.sourceRoute) {
            if (params.sourceRoute instanceof LineString && params.sourceRoute.getCoordinates()) {
                var target = {};
                target.type = "LINEM";
                target.parts = [params.sourceRoute.getCoordinates()[0].length];
                target.points = [];
                for (let i = 0; i < params.sourceRoute.getCoordinates()[0].length; i++) {
                    let point = params.sourceRoute.getCoordinates()[0][i];
                    target.points = target.points.concat({x: point[0], y: point[1], measure: point[2]})
                }
                params.sourceRoute = target;
            }

        }
        var me = this;
        if (params.operateRegions && Util.isArray(params.operateRegions)) {
            params.operateRegions.map(function (geometry, key) {
                params.operateRegions[key] = me.convertGeometry(geometry);
                return params.operateRegions[key];
            });
        }
        if (params.sourceRoute && params.sourceRoute.components && Util.isArray(params.sourceRoute.components)) {
            params.sourceRoute.components.map(function (geometry, key) {
                params.sourceRoute.components[key] = me.convertGeometry(geometry);
                return params.sourceRoute.components[key];
            });
        }
        return params;
    }

    _processFormat(resultFormat) {
        return (resultFormat) ? resultFormat : DataFormat.GEOJSON;
    }

    /**
     * @private
     * @function SpatialAnalystService.prototype.convertGeometry
     * @description č˝¬ćŤ˘ĺ‡ ä˝•ĺŻąč±ˇă€‚
     * @param {Object} ol3Geometry - ĺľ…č˝¬ćŤ˘çš„ĺ‡ ä˝•ĺŻąč±ˇă€‚
     */

    convertGeometry(ol3Geometry) {
        //ĺ?¤ć–­ć?Żĺ?¦äĽ ĺ…Ąçš„ć?Żgeojson ĺą¶ä˝śç›¸ĺş”ĺ¤„ç?†
        if(["FeatureCollection", "Feature", "Geometry"].indexOf(ol3Geometry.type) != -1){
            return Util.toSuperMapGeometry(ol3Geometry);
        }
        return Util.toSuperMapGeometry(JSON.parse((new GeoJSON()).writeGeometry(ol3Geometry)));
    }
}
