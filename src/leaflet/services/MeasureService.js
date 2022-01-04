/* Copyright© 2000 - 2021 SuperMap Software Co.Ltd. All rights reserved.
 * This program are made available under the terms of the Apache License, Version 2.0
 * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html.*/
import {ServiceBase} from './ServiceBase';
import '../core/Base';
import * as Util from '../core/Util';
import { MeasureMode } from '@supermap/iclient-common/REST';
import { MeasureService as CommonMeasureService } from '@supermap/iclient-common/iServer/MeasureService';
import { MeasureParameters } from '@supermap/iclient-common/iServer/MeasureParameters';

/**
 * @class MeasureService
 * @deprecatedclassinstance L.supermap.measureService
 * @classdesc 量算服务类。
 * @category  iServer Map Measure
 * @example
 * 用法：
 * new MeasureService(url).measureDistance({
 *     geometry:xxx
 * },function(result){
 *     //doSomething
 * })
 * @param {string} url - 服务地址。
 * @param {Object} options - 参数。
 * @param {string} [options.proxy] - 服务代理地址。
 * @param {boolean} [options.withCredentials=false] - 请求是否携带 cookie。
 * @param {boolean} [options.crossOrigin] - 是否允许跨域请求。
 * @param {Object} [options.headers] - 请求头。
 * @extends {ServiceBase}
 * @usage
 */
export var MeasureService = ServiceBase.extend({

    initialize: function (url, options) {
        ServiceBase.prototype.initialize.call(this, url, options);
    },

    /**
     * @function MeasureService.prototype.measureDistance
     * @description 测距。
     * @param {MeasureParameters} params - 量算参数类。
     * @param {RequestCallback} callback - 回调函数。
     */
    measureDistance: function (params, callback) {
        this.measure(MeasureMode.DISTANCE, params, callback);
        return this;
    },

    /**
     * @function MeasureService.prototype.measureArea
     * @description 测面积。
     * @param {MeasureParameters} params - 量算参数类。
     * @param {RequestCallback} callback - 回调函数。
     */
    measureArea: function (params, callback) {
        this.measure(MeasureMode.AREA, params, callback);
        return this;
    },

    /**
     * @function MeasureService.measure
     * @param {MeasureMode} [type=MeasureMode.DISTANCE] - 量算模式。
     * @param {MeasureParameters} params - 量算参数类。
     * @param {RequestCallback} callback - 回调函数。
     */
    measure: function (type, params, callback) {
        if (!(params instanceof MeasureParameters)) {
            return;
        }
        var me = this;
        if (params.geometry) {
            params.geometry = Util.toSuperMapGeometry(params.geometry);
        }
        var measureService = new CommonMeasureService(me.url, {
            proxy: me.options.proxy,
            withCredentials: me.options.withCredentials,
            crossOrigin: me.options.crossOrigin,
            headers: me.options.headers,
            measureMode: type,
            eventListeners: {
                scope: me,
                processCompleted: callback,
                processFailed: callback
            }
        });
        measureService.processAsync(params);
    }
});

export var measureService = function (url, options) {
    return new MeasureService(url, options);
};
