/* CopyrightÂ© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
 * This program are made available under the terms of the Apache License, Version 2.0
 * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html.*/
import L from 'leaflet';
import '../core/Base';
import { ServiceBase } from './ServiceBase';
import * as Util from '../core/Util';
import { CommontypesConversion } from '../core/CommontypesConversion';
import { DataFormat } from '@supermap/iclient-common/REST';
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

/**
 * @class SpatialAnalystService
 * @deprecatedclassinstance L.supermap.spatialAnalystService
 * @classdesc ç©şé—´ĺ?†ćž?ćśŤĺŠˇç±»ă€‚ćŹ?äľ›ďĽšĺś°ĺŚşĺ¤Şé?łčľ?ĺ°„ă€?çĽ“ĺ†˛ĺŚşĺ?†ćž?ă€?ç‚ąĺŻ†ĺş¦ĺ?†ćž?ă€?ĺŠ¨ć€?ĺ?†ć®µĺ?†ćž?ă€?ç©şé—´ĺ…łçł»ĺ?†ćž?ă€?ćŹ’ĺ€Ľĺ?†ćž?ă€?ć …ć Ľä»Łć•°čż?ç®—ă€?ĺŹ ĺŠ ĺ?†ćž?ă€?č·Żç”±ĺ®šä˝Ťă€?č·Żç”±ćµ‹é‡Źč®ˇç®—ă€?čˇ¨éť˘ĺ?†ćž?ă€?ĺś°ĺ˝˘ć›˛çŽ‡č®ˇç®—ă€?ćł°ćŁ®ĺ¤ščľąĺ˝˘ĺ?†ćž?ă€‚
 * @category  iServer SpatialAnalyst
 * @example
 *      new SpatialAnalystService(url)
 *      .bufferAnalysis(params,function(result){
 *          //doSomething
 *      })
 * @param {string} url - ćśŤĺŠˇĺś°ĺť€ă€‚
 * @param {Object} options - ĺŹ‚ć•°ă€‚
 * @param {string} [options.proxy] - ćśŤĺŠˇä»Łç?†ĺś°ĺť€ă€‚
 * @param {boolean} [options.withCredentials=false] - čŻ·ć±‚ć?Żĺ?¦ć?şĺ¸¦ cookieă€‚
 * @param {boolean} [options.crossOrigin] - ć?Żĺ?¦ĺ…?č®¸č·¨ĺźźčŻ·ć±‚ă€‚
 * @param {Object} [options.headers] - čŻ·ć±‚ĺ¤´ă€‚
 * @extends {ServiceBase}
 * @usage
 */
export var SpatialAnalystService = ServiceBase.extend({
    initialize: function(url, options) {
        ServiceBase.prototype.initialize.call(this, url, options);
    },
    /**
     * @function SpatialAnalystService.prototype.getAreaSolarRadiationResult
     * @description ĺś°ĺŚşĺ¤Şé?łčľ?ĺ°„ă€‚
     * @param {AreaSolarRadiationParameters} params - ĺś°ĺŚşĺ¤Şé?łčľ?ĺ°„ĺŹ‚ć•°ç±»ă€‚
     * @param {RequestCallback} callback - ĺ›žč°?ĺ‡˝ć•°ă€‚
     * @param {DataFormat} [resultFormat=DataFormat.GEOJSON] - čż”ĺ›žç»“ćžśç±»ĺž‹ă€‚
     */
    getAreaSolarRadiationResult: function(params, callback, resultFormat) {
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
    },

    /**
     * @function SpatialAnalystService.prototype.bufferAnalysis
     * @description çĽ“ĺ†˛ĺŚşĺ?†ćž?ă€‚
     * @param {DatasetBufferAnalystParameters} params - ć•°ćŤ®é›†çĽ“ĺ†˛ĺŚşĺ?†ćž?ĺŹ‚ć•°ç±»ă€‚
     * @param {RequestCallback} callback - ĺ›žč°?ĺ‡˝ć•°ă€‚
     * @param {DataFormat} [resultFormat=DataFormat.GEOJSON] - čż”ĺ›žç»“ćžśç±»ĺž‹ă€‚
     */
    bufferAnalysis: function(params, callback, resultFormat) {
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
    },

    /**
     * @function SpatialAnalystService.prototype.densityAnalysis
     * @description ç‚ąĺŻ†ĺş¦ĺ?†ćž?ă€‚
     * @param {DensityKernelAnalystParameters} params - ć ¸ĺŻ†ĺş¦ĺ?†ćž?ĺŹ‚ć•°ç±»ă€‚
     * @param {RequestCallback} callback - ĺ›žč°?ĺ‡˝ć•°ă€‚
     * @param {DataFormat} [resultFormat=DataFormat.GEOJSON] - čż”ĺ›žç»“ćžśç±»ĺž‹ă€‚
     */
    densityAnalysis: function(params, callback, resultFormat) {
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
    },

    /**
     * @function SpatialAnalystService.prototype.generateSpatialData
     * @description ĺŠ¨ć€?ĺ?†ć®µĺ?†ćž?ă€‚
     * @param {GenerateSpatialDataParameters} params - ĺŠ¨ć€?ĺ?†ć®µć“Ťä˝śĺŹ‚ć•°ç±»ă€‚
     * @param {RequestCallback} callback - ĺ›žč°?ĺ‡˝ć•°ă€‚
     * @param {DataFormat} [resultFormat=DataFormat.GEOJSON] - čż”ĺ›žç»“ćžśç±»ĺž‹ă€‚
     */
    generateSpatialData: function(params, callback, resultFormat) {
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
    },

    /**
     * @function SpatialAnalystService.prototype.geoRelationAnalysis
     * @description ç©şé—´ĺ…łçł»ĺ?†ćž?ă€‚
     * @param {GeoRelationAnalystParameters} params - ç©şé—´ĺ…łçł»ĺ?†ćž?ćśŤĺŠˇĺŹ‚ć•°ç±»ă€‚
     * @param {RequestCallback} callback - ĺ›žč°?ĺ‡˝ć•°ă€‚
     * @param {DataFormat} [resultFormat=DataFormat.GEOJSON] - čż”ĺ›žç»“ćžśç±»ĺž‹ă€‚
     */
    geoRelationAnalysis: function(params, callback, resultFormat) {
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
    },

    /**
     * @function SpatialAnalystService.prototype.interpolationAnalysis
     * @description ćŹ’ĺ€Ľĺ?†ćž?ă€‚
     * @param {InterpolationDensityAnalystParameters|InterpolationIDWAnalystParameters|InterpolationRBFAnalystParameters|InterpolationKrigingAnalystParameters} params - ć ·ćťˇćŹ’ĺ€ĽďĽ?ĺľ„ĺ?‘ĺźşĺ‡˝ć•°ćŹ’ĺ€Ľćł•ďĽ‰ĺ?†ćž?ĺŹ‚ć•°ç±»ă€‚
     * @param {RequestCallback} callback - ĺ›žč°?ĺ‡˝ć•°ă€‚
     * @param {DataFormat} [resultFormat=DataFormat.GEOJSON] - čż”ĺ›žç»“ćžśç±»ĺž‹ă€‚
     */
    interpolationAnalysis: function(params, callback, resultFormat) {
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
    },

    /**
     * @function SpatialAnalystService.prototype.mathExpressionAnalysis
     * @description ć …ć Ľä»Łć•°čż?ç®—ă€‚
     * @param {MathExpressionAnalysisParameters} params - ć …ć Ľä»Łć•°čż?ç®—ĺŹ‚ć•°ç±»ă€‚
     * @param {RequestCallback} callback - ĺ›žč°?ĺ‡˝ć•°ă€‚
     * @param {DataFormat} [resultFormat=DataFormat.GEOJSON] - čż”ĺ›žç»“ćžśç±»ĺž‹ă€‚
     */
    mathExpressionAnalysis: function(params, callback, resultFormat) {
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
    },

    /**
     * @function SpatialAnalystService.prototype.overlayAnalysis
     * @description ĺŹ ĺŠ ĺ?†ćž?ă€‚
     * @param {DatasetOverlayAnalystParameters|GeometryOverlayAnalystParameters} params - ć•°ćŤ®é›†ĺŹ ĺŠ ĺ?†ćž?ĺŹ‚ć•°ç±»ă€‚|| ĺ‡ ä˝•ĺŻąč±ˇĺŹ ĺŠ ĺ?†ćž?ĺŹ‚ć•°ç±»ă€‚
     * @param {RequestCallback} callback - ĺ›žč°?ĺ‡˝ć•°ă€‚
     * @param {DataFormat} [resultFormat=DataFormat.GEOJSON] - čż”ĺ›žç»“ćžśç±»ĺž‹ă€‚
     */
    overlayAnalysis: function(params, callback, resultFormat) {
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
    },

    /**
     * @function SpatialAnalystService.prototype.routeCalculateMeasure
     * @description č·Żç”±ćµ‹é‡Źč®ˇç®—ă€‚
     * @param {RouteCalculateMeasureParameters} params - ĺźşäşŽč·Żç”±ĺŻąč±ˇč®ˇç®—ćŚ‡ĺ®šç‚ą M ĺ€Ľć“Ťä˝śçš„ĺŹ‚ć•°ç±»ă€‚
     * @param {RequestCallback} callback - ĺ›žč°?ĺ‡˝ć•°ă€‚
     * @param {DataFormat} [resultFormat=DataFormat.GEOJSON] - čż”ĺ›žç»“ćžśç±»ĺž‹ă€‚
     */
    routeCalculateMeasure: function(params, callback, resultFormat) {
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
    },

    /**
     * @function SpatialAnalystService.prototype.routeLocate
     * @description č·Żç”±ĺ®šä˝Ťă€‚
     * @param {RouteLocatorParameters} params - č·Żç”±ĺŻąč±ˇĺ®šä˝Ťç©şé—´ĺŻąč±ˇçš„ĺŹ‚ć•°ç±»ă€‚
     * @param {RequestCallback} callback - ĺ›žč°?ĺ‡˝ć•°ă€‚
     * @param {DataFormat} [resultFormat=DataFormat.GEOJSON] - čż”ĺ›žç»“ćžśç±»ĺž‹ă€‚
     */
    routeLocate: function(params, callback, resultFormat) {
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
    },

    /**
     * @function SpatialAnalystService.prototype.surfaceAnalysis
     * @description čˇ¨éť˘ĺ?†ćž?ă€‚
     * @param {SurfaceAnalystParameters} params - čˇ¨éť˘ĺ?†ćž?ćŹ?ĺŹ–ć“Ťä˝śĺŹ‚ć•°ç±»ă€‚
     * @param {RequestCallback} callback - ĺ›žč°?ĺ‡˝ć•°ă€‚
     * @param {DataFormat} [resultFormat=DataFormat.GEOJSON] - čż”ĺ›žç»“ćžśç±»ĺž‹ă€‚
     */
    surfaceAnalysis: function(params, callback, resultFormat) {
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
    },

    /**
     * @function SpatialAnalystService.prototype.terrainCurvatureCalculate
     * @description ĺś°ĺ˝˘ć›˛çŽ‡č®ˇç®—ă€‚
     * @param {TerrainCurvatureCalculationParameters} params - ĺś°ĺ˝˘ć›˛çŽ‡č®ˇç®—ĺŹ‚ć•°ç±»ă€‚
     * @param {RequestCallback} callback - ĺ›žč°?ĺ‡˝ć•°ă€‚
     * @param {DataFormat} [resultFormat=DataFormat.GEOJSON] - čż”ĺ›žç»“ćžśç±»ĺž‹ă€‚
     */
    terrainCurvatureCalculate: function(params, callback, resultFormat) {
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
    },

    /**
     * @function SpatialAnalystService.prototype.thiessenAnalysis
     * @description ćł°ćŁ®ĺ¤ščľąĺ˝˘ĺ?†ćž?ă€‚
     * @param {DatasetThiessenAnalystParameters|GeometryThiessenAnalystParameters} params - ć•°ćŤ®é›†ćł°ćŁ®ĺ¤ščľąĺ˝˘ĺ?†ćž?ĺŹ‚ć•°ç±»ă€‚
     * @param {RequestCallback} callback - ĺ›žč°?ĺ‡˝ć•°ă€‚
     * @param {DataFormat} [resultFormat=DataFormat.GEOJSON] - čż”ĺ›žç»“ćžśç±»ĺž‹ă€‚
     */
    thiessenAnalysis: function(params, callback, resultFormat) {
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
    },

    /**
     * @function SpatialAnalystService.prototype.geometrybatchAnalysis
     * @description ć‰ąé‡Źç©şé—´ĺ?†ćž?ă€‚
     * @param {Array.<Object>} params -ć‰ąé‡Źĺ?†ćž?ĺŹ‚ć•°ĺŻąč±ˇć•°ç»„ďĽ›ĺŚ…ć‹¬ďĽš</br>
     * @param {string} params.analystName -  ç©şé—´ĺ?†ćž?ć–ąćł•çš„ĺ?Ťç§°ă€‚ĺŚ…ć‹¬ďĽš</br>
     * "buffer","overlay","interpolationDensity","interpolationidw","interpolationRBF","interpolationKriging","isoregion","isoline"
     * @param {Object} param - ç©şé—´ĺ?†ćž?ç±»ĺž‹ĺŻąĺş”çš„čŻ·ć±‚ĺŹ‚ć•°ďĽŚĺŚ…ć‹¬ďĽš</br>
     * {@link GeometryBufferAnalystParameters} çĽ“ĺ†˛ĺŚşĺ?†ćž?ĺŹ‚ć•°ç±»ă€‚</br>
     * {@link GeometryOverlayAnalystParameters} ĺŹ ĺŠ ĺ?†ćž?ĺŹ‚ć•°ç±»ă€‚</br>
     * {@link InterpolationAnalystParameters} ćŹ’ĺ€Ľĺ?†ćž?ĺŹ‚ć•°ç±»ă€‚</br>
     * {@link SurfaceAnalystParameters} čˇ¨éť˘ĺ?†ćž?ĺŹ‚ć•°ç±»ă€‚</br>
     * @param {RequestCallback} callback - ĺ›žč°?ĺ‡˝ć•°ă€‚
     * @param {DataFormat} [resultFormat=DataFormat.GEOJSON] - čż”ĺ›žç»“ćžśç±»ĺž‹ă€‚
     */
    geometrybatchAnalysis: function(params, callback, resultFormat) {
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
            });
        }

        geometryBatchAnalystService.processAsync(analystParameters);
    },

    _processParams: function(params) {
        if (!params) {
            return {};
        }
        if (params.bounds) {
            params.bounds = CommontypesConversion.toSuperMapBounds(params.bounds);
        }
        if (params.inputPoints) {
            for (let i = 0; i < params.inputPoints.length; i++) {
                let inputPoint = params.inputPoints[i];
                if (L.Util.isArray(inputPoint)) {
                    params.inputPoints[i] = { x: inputPoint[0], y: inputPoint[1], tag: inputPoint[2] };
                }
            }
        }

        if (params.points) {
            for (let i = 0; i < params.points.length; i++) {
                let point = params.points[i];
                if (L.Util.isArray(point)) {
                    params.points[i] = { x: point[0], y: point[1] };
                } else if (point instanceof L.LatLng) {
                    params.points[i] = { x: point.lng, y: point.lat };
                } else {
                    params.points[i] = { x: point.x, y: point.y };
                }
            }
        }
        if (params.point) {
            if (L.Util.isArray(params.point)) {
                params.point = { x: params.point[0], y: params.point[1] };
            } else if (params.point instanceof L.LatLng) {
                params.point = { x: params.point.lng, y: params.point.lat };
            } else {
                params.point = { x: params.point.x, y: params.point.y };
            }
        }
        if (params.extractRegion) {
            params.extractRegion = Util.toSuperMapGeometry(params.extractRegion);
        }
        if (params.extractParameter && params.extractParameter.clipRegion) {
            params.extractParameter.clipRegion = Util.toSuperMapGeometry(params.extractParameter.clipRegion);
        }
        if (params.clipParam && params.clipParam.clipRegion) {
            params.clipParam.clipRegion = Util.toSuperMapGeometry(params.clipParam.clipRegion);
        }
        //ć”ŻćŚ?ć ĽĺĽŹďĽšVector Layers; GeoJson
        if (params.sourceGeometry) {
            var SRID = null;
            if (params.sourceGeometrySRID) {
                SRID = params.sourceGeometrySRID;
            }
            params.sourceGeometry = Util.toSuperMapGeometry(params.sourceGeometry);
            if (SRID) {
                params.sourceGeometry.SRID = SRID;
            }
            delete params.sourceGeometry.sourceGeometrySRID;
        }
        if (params.operateGeometry) {
            params.operateGeometry = Util.toSuperMapGeometry(params.operateGeometry);
        }
        //ć”ŻćŚ?äĽ ĺ…Ąĺ¤šä¸Şĺ‡ ä˝•č¦?ç´ čż›čˇŚĺŹ ĺŠ ĺ?†ćž?ďĽš
        if (params.sourceGeometries) {
            var sourceGeometries = [];
            for (var k = 0; k < params.sourceGeometries.length; k++) {
                sourceGeometries.push(Util.toSuperMapGeometry(params.sourceGeometries[k]));
            }
            params.sourceGeometries = sourceGeometries;
        }
        //ć”ŻćŚ?äĽ ĺ…Ąĺ¤šä¸Şĺ‡ ä˝•č¦?ç´ čż›čˇŚĺŹ ĺŠ ĺ?†ćž?ďĽš
        if (params.operateGeometries) {
            var operateGeometries = [];
            for (var j = 0; j < params.operateGeometries.length; j++) {
                operateGeometries.push(Util.toSuperMapGeometry(params.operateGeometries[j]));
            }
            params.operateGeometries = operateGeometries;
        }
        if (params.sourceRoute) {
            if (params.sourceRoute instanceof L.Polyline) {
                var target = {};
                target.type = 'LINEM';
                target.parts = [params.sourceRoute.getLatLngs().length];
                target.points = [];
                for (let i = 0; i < params.sourceRoute.getLatLngs().length; i++) {
                    let point = params.sourceRoute.getLatLngs()[i];
                    target.points = target.points.concat({ x: point.lng, y: point.lat, measure: point.alt });
                }
                params.sourceRoute = target;
            }
        }
        if (params.operateRegions && L.Util.isArray(params.operateRegions)) {
            params.operateRegions.map(function(geometry, key) {
                params.operateRegions[key] = Util.toSuperMapGeometry(geometry);
                return params.operateRegions[key];
            });
        }
        // if (params.sourceRoute && params.sourceRoute.components && L.Util.isArray(params.sourceRoute.components)) {
        //     params.sourceRoute.components.map(function (geometry, key) {
        //         params.sourceRoute.components[key] = Util.toSuperMapGeometry(geometry);
        //     });
        // }

        return params;
    },

    _processFormat: function(resultFormat) {
        return resultFormat ? resultFormat : DataFormat.GEOJSON;
    }
});
export var spatialAnalystService = function(url, options) {
    return new SpatialAnalystService(url, options);
};

