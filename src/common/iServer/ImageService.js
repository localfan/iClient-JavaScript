/* Copyright© 2000 - 2021 SuperMap Software Co.Ltd. All rights reserved.
 * This program are made available under the terms of the Apache License, Version 2.0
 * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html.*/

import { SuperMap } from '../SuperMap';
import { Util } from '../commontypes/Util';
import { CommonServiceBase } from './CommonServiceBase';

/**
 * @class SuperMap.ImageService
 * @classdesc 影像服务类
 * @version 10.2.0
 * @category iServer Image
 * @param {string} url - 服务地址。例如: http://{ip}:{port}/iserver/{imageservice-imageserviceName}/restjsr/
 * @param {Object} options - 参数。
 * @param {boolean} [options.crossOrigin] - 是否允许跨域请求。
 * @param {Object} [options.headers] - 请求头。
 * @extends {SuperMap.CommonServiceBase}
 */
export default class ImageService extends CommonServiceBase {
    constructor(url, options) {
        super(url, options);
        this.options = options || {};
        if (options) {
            Util.extend(this, options);
        }
        this.CLASS_NAME = 'SuperMap.ImageService';
    }

    /**
     * @function SuperMap.ImageService.prototype.destroy
     * @override
     */
    destroy() {
        super.destroy();
    }

    /**
     * @function SuperMap.ImageService.prototype.getCollections
     * @description 返回当前影像服务中的影像集合列表（Collections）。
     */
    getCollections() {
        var me = this;
        var path = Util.convertPath('/collections');
        var url = Util.urlPathAppend(me.url, path);
        this.request({
            method: 'GET',
            url,
            scope: this,
            success: me.serviceProcessCompleted,
            failure: me.serviceProcessFailed
        });
    }

    /**
     * @function SuperMap.ImageService.prototype.getCollectionByID
     * @description ID值等于`collectionId`参数值的影像集合（Collection）。 ID值用于在服务中唯一标识该影像集合。
     * @param {string} collectionId 影像集合（Collection）的ID，在一个影像服务中唯一标识影像集合。
     */
    getCollectionByID(collectionId) {
        var pathParams = {
            collectionId: collectionId
        };
        var me = this;
        var path = Util.convertPath('/collections/{collectionId}', pathParams);
        var url = Util.urlPathAppend(me.url, path);
        this.request({
            method: 'GET',
            url,
            scope: this,
            success: me.serviceProcessCompleted,
            failure: me.serviceProcessFailed
        });
    }

    /**
     * @function SuperMap.ImageSearchService.prototype.search
     * @description 返回与过滤条件匹配的 STAC Items。此方式将作为标准的、全要素查询 API。 如果实现了`GET /search`，那么就必须实现此方法。 如果此端点在服务端实现，需要将其链接添加到 `GET /` 响应中的链接对象数组中， 此端点的链接对象的 `rel`属性值为`search`；链接对象中`method`属性值为`POST` 。
     * @param {SuperMap.ImageSearchParameter} [imageSearchParameter] 查询参数
     */
    search(imageSearchParameter) {
        var postBody = { ...(imageSearchParameter || {}) };
        var me = this;
        var path = Util.convertPath('/search');
        var url = Util.urlPathAppend(me.url, path);
        this.request({
            method: 'POST',
            url,
            data: postBody,
            scope: this,
            success: me.serviceProcessCompleted,
            failure: me.serviceProcessFailed
        });
    }
}

SuperMap.ImageService = ImageService;