/* CopyrightÂ© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
 * This program are made available under the terms of the Apache License, Version 2.0
 * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html.*/
import proj4 from "proj4";
import { FetchRequest } from '@supermap/iclient-common/util/FetchRequest';
import { ArrayStatistic } from '@supermap/iclient-common/util/ArrayStatistic';
import { ColorsPickerUtil } from '@supermap/iclient-common/util/ColorsPickerUtil';
import { SecurityManager } from '@supermap/iclient-common/security/SecurityManager';
import { Events } from '@supermap/iclient-common/commontypes/Events';
import { Util as CommonUtil} from '@supermap/iclient-common/commontypes/Util';
import {
    Util
} from '../core/Util';
import { getFeatureBySQL, queryFeatureBySQL, getFeatureProperties} from './webmap/Util'
import {
    StyleUtils
} from '../core/StyleUtils';
import {TileSuperMapRest, Tianditu, BaiduMap} from '../mapping';
import {VectorTileSuperMapRest, Graphic as GraphicSource, MapboxStyles, OverlayGraphic} from '../overlay';
import {DataFlowService} from '../services'

import provincialCenterData from './webmap/config/ProvinceCenter.json';// eslint-disable-line import/extensions
import municipalCenterData from './webmap/config/MunicipalCenter.json';// eslint-disable-line import/extensions
import SampleDataInfo from './webmap/config/SampleDataInfo.json';// eslint-disable-line import/extensions

import GeoJSON from 'ol/format/GeoJSON';
import MVT from 'ol/format/MVT';
import Observable from 'ol/Observable';
import olMap from 'ol/Map';
import View from 'ol/View';
import MouseWheelZoom from 'ol/interaction/MouseWheelZoom';
import * as olProj from 'ol/proj';
import * as olProj4 from 'ol/proj/proj4';
import Units from 'ol/proj/Units';
import * as olLayer from 'ol/layer';
import WMTSCapabilities from 'ol/format/WMTSCapabilities';
import WMSCapabilities from 'ol/format/WMSCapabilities';
import TileGrid from 'ol/tilegrid/TileGrid';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import * as olGeometry from 'ol/geom';
import Vector from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import WMTS from 'ol/source/WMTS';
import TileWMS from 'ol/source/TileWMS';
import Feature from 'ol/Feature';
import olRenderFeature from 'ol/render/Feature';
import Style from 'ol/style/Style';
import FillStyle from 'ol/style/Fill';
import StrokeStyle from 'ol/style/Stroke';
import Text from 'ol/style/Text';
import Collection from 'ol/Collection';
import {containsCoordinate, getCenter} from "ol/extent";

window.proj4 = proj4;
window.Proj4js = proj4;
//ć•°ćŤ®č˝¬ćŤ˘ĺ·Ąĺ…·
const transformTools = new GeoJSON();
// čż?ĺľ™ĺ›ľćś€ĺ¤§ć”ŻćŚ?č¦?ç´ ć•°é‡Ź
const MAX_MIGRATION_ANIMATION_COUNT = 1000;
//ä¸Ťĺ?Śĺť?ć ‡çł»ĺŤ•ä˝Ťă€‚č®ˇç®—ĺ…¬ĺĽŹä¸­çš„ĺ€Ľ
const metersPerUnit = {
    DEGREES: 2 * Math.PI * 6370997 / 360,
    DEGREE: 2 * Math.PI * 6370997 / 360,
    FEET: 0.3048,
    METERS: 1,
    METER: 1,
    M: 1,
    USFEET: 1200 / 3937
};
const dpiConfig = {
    default: 96, // ĺ¸¸ç”¨dpi
    iServerWMTS: 90.7142857142857 // iserverä˝żç”¨çš„wmtsĺ›ľĺ±‚dpi
}
/**
 * @class WebMap
 * @category  iPortal/Online Resources Map
 * @classdesc ĺŻąćŽĄ iPortal/Online ĺś°ĺ›ľç±»
 * @param {Object} options - ĺŹ‚ć•°
 * @param {string} [options.target='map'] - ĺś°ĺ›ľĺ®ąĺ™¨id
 * @param {Object | string} [options.webMap] - webMapĺŻąč±ˇďĽŚć?–č€…ć?ŻčŽ·ĺŹ–webMapçš„urlĺś°ĺť€ă€‚ĺ­?ĺś¨webMapďĽŚäĽ?ĺ…?ä˝żç”¨webMap, idçš„é€‰éˇąĺ?™äĽšč˘«ĺż˝ç•Ą
 * @param {number} [options.id] - ĺś°ĺ›ľçš„id
 * @param {string} [options.server="https://www.supermapol.com"] - ĺś°ĺ›ľçš„ĺś°ĺť€ďĽŚĺ¦‚ćžśä˝żç”¨äĽ ĺ…ĄidďĽŚserverĺ?™äĽšĺ’Śidć‹ĽćŽĄć??webMapčŻ·ć±‚ĺś°ĺť€
 * @param {function} [options.successCallback] - ć??ĺŠźĺŠ č˝˝ĺś°ĺ›ľĺ?Žč°?ç”¨çš„ĺ‡˝ć•°
 * @param {function} [options.errorCallback] - ĺŠ č˝˝ĺś°ĺ›ľĺ¤±č´Ąč°?ç”¨çš„ĺ‡˝ć•°
 * @param {string} [options.credentialKey] - ĺ‡­čŻ?ĺŻ†é’Ąă€‚äľ‹ĺ¦‚ä¸ş"key"ă€?"token"ďĽŚć?–č€…ç”¨ć?·č‡Şĺ®šäą‰çš„ĺŻ†é’Ąă€‚ç”¨ć?·ç”łčŻ·äş†ĺŻ†é’ĄďĽŚć­¤ĺŹ‚ć•°ĺż…ĺˇ«
 * @param {string} [options.credentialValue] - ĺ‡­čŻ?ĺŻ†é’ĄĺŻąĺş”çš„ĺ€ĽďĽŚcredentialKeyĺ’ŚcredentialValueĺż…éˇ»ä¸€čµ·ä˝żç”¨
 * @param {boolean} [options.withCredentials=false] - čŻ·ć±‚ć?Żĺ?¦ć?şĺ¸¦ cookie
 * @param {boolean} [options.excludePortalProxyUrl] - serveräĽ é€’čż‡ćťĄçš„urlć?Żĺ?¦ĺ¸¦ćś‰ä»Łç?†
 * @param {Object} [options.serviceProxy] - iportalĺ†…ç˝®ä»Łç?†äżˇć?Ż, ä»…çź˘é‡Źç“¦ç‰‡ĺ›ľĺ±‚ä¸Šĺ›ľć‰ŤäĽšä˝żç”¨
 * @param {string} [options.tiandituKey] - ĺ¤©ĺś°ĺ›ľçš„key
 * @param {string} [options.googleMapsAPIKey] - č°·ć­Śĺş•ĺ›ľéś€č¦?çš„key
 * @param {string} [options.proxy] - ä»Łç?†ĺś°ĺť€ďĽŚĺ˝“ĺźźĺ?Ťä¸Ťä¸€č‡´ďĽŚčŻ·ć±‚äĽšĺŠ ä¸Šä»Łç?†ă€‚é?żĺ…Ťč·¨ĺźź
 * @param {string} [options.tileFormat] - ĺś°ĺ›ľç“¦ç‰‡ĺ‡şĺ›ľć ĽĺĽŹďĽŚpng/webp
 * @param {Object} [options.mapSetting] - ĺś°ĺ›ľĺŹŻé€‰ĺŹ‚ć•°
 * @param {function} [options.mapSetting.mapClickCallback] - ĺś°ĺ›ľč˘«ç‚ąĺ‡»çš„ĺ›žč°?ĺ‡˝ć•°
 * @param {function} [options.mapSetting.overlays] - ĺś°ĺ›ľçš„overlays
 * @param {function} [options.mapSetting.controls] - ĺś°ĺ›ľçš„ćŽ§ä»¶
 * @param {function} [options.mapSetting.interactions] - ĺś°ĺ›ľćŽ§ĺ?¶çš„ĺŹ‚ć•°
 * @extends {ol.Observable}
 * @usage
 */
export class WebMap extends Observable {

    constructor(id, options) {
        super();
        if (Util.isObject(id)) {
            options = id;
            this.mapId = options.id;
        } else {
            this.mapId = id;
        }
        options = options || {};
        this.server = options.server;
        this.successCallback = options.successCallback;
        this.errorCallback = options.errorCallback;
        this.credentialKey = options.credentialKey;
        this.credentialValue = options.credentialValue;
        this.withCredentials = options.withCredentials || false;
        this.target = options.target || "map";
        this.excludePortalProxyUrl = options.excludePortalProxyUrl || false;
        this.serviceProxy = options.serviceProxy || null;
        this.tiandituKey = options.tiandituKey;
        this.googleMapsAPIKey = options.googleMapsAPIKey || '';
        this.proxy = options.proxy;
        //č®ˇć•°ĺŹ ĺŠ ĺ›ľĺ±‚ďĽŚĺ¤„ç?†čż‡çš„ć•°é‡ŹďĽ?ć??ĺŠźĺ’Śĺ¤±č´Ąé?˝äĽšč®ˇć•°ďĽ‰
        this.layerAdded = 0;
        this.layers = [];
        this.events = new Events(this, null, ["updateDataflowFeature"], true);
        this.webMap = options.webMap;
        this.tileFormat = options.tileFormat && options.tileFormat.toLowerCase();
        this.createMap(options.mapSetting);
        if (this.webMap) {
            // webmapćś‰ĺŹŻč?˝ć?Żurlĺś°ĺť€ďĽŚćś‰ĺŹŻč?˝ć?ŻwebmapĺŻąč±ˇ
            Util.isString(this.webMap) ? this.createWebmap(this.webMap) : this.getMapInfoSuccess(options.webMap);
        } else {
            if (!this.server) {
                this.server = 'https://www.supermapol.com';
            }
            this.createWebmap();
        }
    }

    /**
     * @private
     * @function WebMap.prototype._removeBaseLayer
     * @description ç§»é™¤ĺş•ĺ›ľ
     */
    _removeBaseLayer() {
        const map = this.map;
        const {layer, labelLayer} = this.baseLayer;
        // ç§»é™¤ĺ¤©ĺś°ĺ›ľć ‡ç­ľĺ›ľĺ±‚
        labelLayer && map.removeLayer(labelLayer);
        // ç§»é™¤ĺ›ľĺ±‚
        layer && map.removeLayer(layer);
        this.baseLayer = null;
    }

    /**
     * @private
     * @function WebMap.prototype._removeLayers
     * @description ç§»é™¤ĺŹ ĺŠ ĺ›ľĺ±‚
     */
    _removeLayers() {
        const map = this.map;
        this.layers.forEach(({layerType, layer, labelLayer, pathLayer, dataflowService}) => {
            if (!layer) {
                return;
            }
            if (layerType === 'MIGRATION') {
                layer.remove();
                return;
            }
            if (layerType === 'DATAFLOW_POINT_TRACK' || layerType === 'DATAFLOW_HEAT') {
                // ç§»é™¤č˝¨čżąĺ›ľĺ±‚
                pathLayer && map.removeLayer(pathLayer);
                // ĺŹ–ć¶?č®˘é?…
                dataflowService && dataflowService.unSubscribe();
            }
            // ç§»é™¤ć ‡ç­ľĺ›ľĺ±‚
            labelLayer && map.removeLayer(labelLayer);
            // ç§»é™¤ĺ›ľĺ±‚
            map.removeLayer(layer)
        });
        this.layers = [];
    }

    /**
     * @private
     * @function WebMap.prototype.clear
     * @description ć¸…ç©şĺś°ĺ›ľ
     */
    _clear() {
        // ćŻ”äľ‹ĺ°ş
        this.scales = [];
        // ĺ?†čľ¨çŽ‡
        this.resolutionArray = [];
        // ćŻ”äľ‹ĺ°ş-ĺ?†čľ¨çŽ‡ {scale: resolution}
        this.resolutions = {};
        // č®ˇć•°ĺŹ ĺŠ ĺ›ľĺ±‚ďĽŚĺ¤„ç?†čż‡çš„ć•°é‡ŹďĽ?ć??ĺŠźĺ’Śĺ¤±č´Ąé?˝äĽšč®ˇć•°ďĽ‰
        this.layerAdded = 0;

        this._removeBaseLayer();
        this._removeLayers();
    }

    /**
     * @function WebMap.prototype.refresh
     * @version 10.1.0
     * @description é‡Ťć–°ć¸˛ćź“ĺś°ĺ›ľ
     */
    refresh() {
        this._clear();
        this.createWebmap();
    }

    /**
     * @private
     * @function WebMap.prototype.createMap
     * @description ĺ?›ĺ»şĺś°ĺ›ľĺŻąč±ˇä»ĄĺŹŠćł¨ĺ†Śĺś°ĺ›ľäş‹ä»¶
     * @param {Object} mapSetting - ĺ…łäşŽĺś°ĺ›ľçš„č®ľç˝®ä»ĄĺŹŠéś€č¦?ćł¨ĺ†Śçš„äş‹ä»¶
     */
    createMap(mapSetting) {
        let overlays, controls, interactions;
        if (mapSetting) {
            interactions = mapSetting.interactions;
            overlays = mapSetting.overlays;
            controls = mapSetting.controls;
        }
        this.map = new olMap({
            interactions: interactions,
            overlays: overlays,
            controls: controls,
            target: this.target
        });
        mapSetting && this.registerMapEvent({
            mapClickCallback: mapSetting.mapClickCallback
        });
    }
    /**
     * @private
     * @function WebMap.prototype.registerMapEvent
     * @description ćł¨ĺ†Śĺś°ĺ›ľäş‹ä»¶
     * @param {Object} mapSetting - ĺ…łäşŽĺś°ĺ›ľçš„č®ľç˝®ä»ĄĺŹŠéś€č¦?ćł¨ĺ†Śçš„äş‹ä»¶
     */
    registerMapEvent(mapSetting) {
        let map = this.map;
        map.on("click", function (evt) {
            mapSetting.mapClickCallback && mapSetting.mapClickCallback(evt);
        });
    }
    /**
     * @private
     * @function WebMap.prototype.createWebmap
     * @description ĺ?›ĺ»şwebmap
     * @param {string} webMapUrl - čŻ·ć±‚webMapçš„ĺś°ĺť€
     */
    createWebmap(webMapUrl) {
        let mapUrl;
        if (webMapUrl) {
            mapUrl = webMapUrl;
        } else {
            let urlArr = this.server.split('');
            if (urlArr[urlArr.length - 1] !== '/') {
                this.server += '/';
            }
            mapUrl = this.server + 'web/maps/' + this.mapId + '/map';
            let filter = 'getUrlResource.json?url=';
            if (this.excludePortalProxyUrl && this.server.indexOf(filter) > -1) {
                //ĺ¤§ĺ±Źéś€ć±‚,ć?–č€…ćś‰ĺŠ ä¸Šä»Łç?†çš„
                let urlArray = this.server.split(filter);
                if (urlArray.length > 1) {
                    mapUrl = urlArray[0] + filter + this.server + 'web/maps/' + this.mapId + '/map.json';
                }
            }
        }
        this.getMapInfo(mapUrl);
    }

    /**
     * @private
     * @function WebMap.prototype.getMapInfo
     * @description čŽ·ĺŹ–ĺś°ĺ›ľçš„jsonäżˇć?Ż
     * @param {string} url - čŻ·ć±‚ĺś°ĺ›ľçš„url
     */
    getMapInfo(url) {
        let that = this,
            mapUrl = url;
        if (url.indexOf('.json') === -1) {
            //äĽ é€’čż‡ćťĄçš„url,ć˛ˇćś‰ĺŚ…ć‹¬.json,ĺś¨čż™é‡ŚĺŠ ä¸Šă€‚
            mapUrl = `${url}.json`
        }
        FetchRequest.get(that.getRequestUrl(mapUrl), null, {
            withCredentials: this.withCredentials
        }).then(function (response) {
            return response.json();
        }).then(function (mapInfo) {
            that.getMapInfoSuccess(mapInfo);
        }).catch(function (error) {
            that.errorCallback && that.errorCallback(error, 'getMapFaild', that.map);
        });
    }

    /**
     * @private
     * @function WebMap.prototype.getMapInfoSuccess
     * @description čŽ·ĺŹ–ĺś°ĺ›ľçš„jsonäżˇć?Ż
     * @param {Object} mapInfo - webMapĺŻąč±ˇ
     */
    async getMapInfoSuccess(mapInfo) {
        let that = this;
        if (mapInfo.succeed === false) {
            that.errorCallback && that.errorCallback(mapInfo.error, 'getMapFaild', that.map);
            return;
        }
        let handleResult = await that.handleCRS(mapInfo.projection, mapInfo.baseLayer.url);

        //ĺ­?ĺ‚¨ĺś°ĺ›ľçš„ĺ?Ťç§°ä»ĄĺŹŠćŹŹčż°ç­‰äżˇć?ŻďĽŚčż”ĺ›žç»™ç”¨ć?·
        that.mapParams = {
            title: mapInfo.title,
            description: mapInfo.description
        };

        if (handleResult.action === "BrowseMap") {
            that.createSpecLayer(mapInfo);
        } else if (handleResult.action === "OpenMap") {
            that.baseProjection = handleResult.newCrs || mapInfo.projection;
            that.webMapVersion = mapInfo.version;
            that.baseLayer = mapInfo.baseLayer;
            // that.mapParams = {
            //     title: mapInfo.title,
            //     description: mapInfo.description
            // }; //ĺ­?ĺ‚¨ĺś°ĺ›ľçš„ĺ?Ťç§°ä»ĄĺŹŠćŹŹčż°ç­‰äżˇć?ŻďĽŚčż”ĺ›žç»™ç”¨ć?·
            that.isHaveGraticule = mapInfo.grid && mapInfo.grid.graticule;

            if (mapInfo.baseLayer && mapInfo.baseLayer.layerType === 'MAPBOXSTYLE') {
                // ć·»ĺŠ çź˘é‡Źç“¦ç‰‡ćśŤĺŠˇä˝śä¸şĺş•ĺ›ľ
                that.addMVTMapLayer(mapInfo, mapInfo.baseLayer, 0).then(async () => {
                    that.createView(mapInfo);
                    if (!mapInfo.layers || mapInfo.layers.length === 0) {
                        that.sendMapToUser(0);
                    } else {
                        await that.addLayers(mapInfo);
                    }
                    that.addGraticule(mapInfo);
                }).catch(function (error) {
                    that.errorCallback && that.errorCallback(error, 'getMapFaild', that.map);
                });
            } else {
                await that.addBaseMap(mapInfo);
                if (!mapInfo.layers || mapInfo.layers.length === 0) {
                    that.sendMapToUser(0);
                } else {
                    await that.addLayers(mapInfo);
                }
                that.addGraticule(mapInfo);
            }
        } else {
            // ä¸Ťć”ŻćŚ?çš„ĺť?ć ‡çł»
            that.errorCallback && that.errorCallback({type: "Not support CS", errorMsg: `Not support CS: ${mapInfo.projection}`}, 'getMapFaild', that.map);
            return;
        }
    }

    /**
    * ĺ¤„ç?†ĺť?ć ‡çł»(ĺş•ĺ›ľ)
    * @private
    * @param {string} crs ĺż…äĽ ĺŹ‚ć•°ďĽŚĺ€Ľć?Żwebmap2ä¸­ĺ®šäą‰çš„ĺť?ć ‡çł»ďĽŚĺŹŻč?˝ć?Ż 1ă€?EGSG:xxx 2ă€?WKT string
    * @param {string} baseLayerUrl  ĺŹŻé€‰ĺŹ‚ć•°ďĽŚĺś°ĺ›ľçš„ćśŤĺŠˇĺś°ĺť€ďĽ›ç”¨äşŽEPSGďĽš-1 çš„ć—¶ĺ€™ďĽŚç”¨äşŽčŻ·ć±‚iServerćŹ?äľ›çš„wkt
    * @return {Object}
    */
    async handleCRS(crs, baseLayerUrl) {
        let that = this, handleResult = {};
        let newCrs = crs, action = "OpenMap";

        if (this.isCustomProjection(crs)) {
            // ĺŽ»iServerčŻ·ć±‚wkt  ĺ?¦ĺ?™ĺŹŞč?˝é˘„č§?ĺ‡şĺ›ľ
            await FetchRequest.get(that.getRequestUrl(`${baseLayerUrl}/prjCoordSys.wkt`), null, {
                withCredentials: that.withCredentials,
                withoutFormatSuffix: true
            }).then(function (response) {
                return response.text();
            }).then(async function (result) {
                if(result.indexOf("<!doctype html>") === -1) {
                    that.addProjctionFromWKT(result, crs);
                    handleResult = {action, newCrs};
                } else {
                    throw 'ERROR';
                }
            }).catch(function () {
                action = "BrowseMap";
                handleResult = {action, newCrs}
            });
        } else {
            if (crs.indexOf("EPSG") === 0 && crs.split(":")[1] <= 0) {
                // č‡Şĺ®šäą‰ĺť?ć ‡çł» rest map EPSG:-1(č‡Şĺ®šäą‰ĺť?ć ‡çł») ć”ŻćŚ?çĽ–čľ‘
                // ćśŞçźĄĺť?ć ‡çł»ć?…ĺ†µç‰ąć®Šĺ¤„ç?†ďĽŚĺŹŞć”ŻćŚ?é˘„č§? 1ă€?rest map EPSG:-1000(ć˛ˇĺ®šäą‰ĺť?ć ‡çł»)  2ă€?wms/wmts EPSG:0 ďĽ?č‡Şĺ®šäą‰ĺť?ć ‡çł»ďĽ‰
                action = "BrowseMap";
            } else if (crs === 'EPSG:910111' || crs === 'EPSG:910112') {
                // ć—©ćśźć•°ćŤ®ĺ­?ĺś¨çš„č‡Şĺ®šäą‰ĺť?ć ‡çł»  "EPSG:910111": "GCJ02MERCATOR"ďĽŚ "EPSG:910112": "BDMERCATOR"
                newCrs = "EPSG:3857";
            } else if (crs === 'EPSG:910101' || crs === 'EPSG:910102') {
                // ć—©ćśźć•°ćŤ®ĺ­?ĺś¨çš„č‡Şĺ®šäą‰ĺť?ć ‡çł» "EPSG:910101": "GCJ02", "EPSG:910102": "BD",
                newCrs = "EPSG:4326";
            } else if (crs.indexOf("EPSG") !== 0) {
                // wkt
                that.addProjctionFromWKT(newCrs);
                newCrs = that.getEpsgInfoFromWKT(crs);
            }
            handleResult = {action, newCrs};
        }
        return handleResult;
    }

    /**
     * @private
     * @function WebMap.prototype.getScales
     * @description ć ąćŤ®çş§ĺ?«čŽ·ĺŹ–ćŻŹä¸Şçş§ĺ?«ĺŻąĺş”çš„ĺ?†čľ¨çŽ‡
     * @param {Object} baseLayerInfo - ĺş•ĺ›ľçš„ĺ›ľĺ±‚äżˇć?Ż
     */
    getScales(baseLayerInfo) {
        let scales = [], resolutions = {}, res, scale, resolutionArray = [],
            coordUnit = baseLayerInfo.coordUnit || olProj.get(baseLayerInfo.projection).getUnits();
        if (!coordUnit) {
            coordUnit = this.baseProjection == "EPSG:3857" ? "m" : "degree";
        }
        if (baseLayerInfo.visibleScales && baseLayerInfo.visibleScales.length > 0) {
            //ĺş•é?¨č®ľç˝®čż‡ĺ›şĺ®šćŻ”äľ‹ĺ°şďĽŚĺ?™ä˝żç”¨č®ľç˝®çš„
            baseLayerInfo.visibleScales.forEach(scale => {
                let value = 1 / scale;
                res = this.getResFromScale(value, coordUnit);
                scale = `1:${value}`;
                //ĺ¤šć­¤ä¸€ä¸ľč˝¬ćŤ˘ďĽŚĺ› ä¸ştoLocalStringäĽšč‡ŞĺŠ¨äżťç•™ĺ°Źć•°ç‚ąĺ?Žä¸‰ä˝ŤďĽŚandĺ˝“ç¬¬äşŚä˝Ťĺ°Źć•°ć?Ż0ĺ°±äĽšäżťĺ­?ĺ°Źć•°ç‚ąĺ?Žä¸¤ä˝Ťă€‚ć‰€ćś‰ä¸şäş†ç»źä¸€ă€‚
                resolutions[this.formatScale(scale)] = res;
                resolutionArray.push(res);
                scales.push(scale);
            }, this)
        } else if (baseLayerInfo.layerType === 'WMTS') {
            baseLayerInfo.scales.forEach(scale => {
                res = this.getResFromScale(scale, coordUnit, 90.7);
                scale = `1:${scale}`;
                //ĺ¤šć­¤ä¸€ä¸ľč˝¬ćŤ˘ďĽŚĺ› ä¸ştoLocalStringäĽšč‡ŞĺŠ¨äżťç•™ĺ°Źć•°ç‚ąĺ?Žä¸‰ä˝ŤďĽŚandĺ˝“ç¬¬äşŚä˝Ťĺ°Źć•°ć?Ż0ĺ°±äĽšäżťĺ­?ĺ°Źć•°ç‚ąĺ?Žä¸¤ä˝Ťă€‚ć‰€ćś‰ä¸şäş†ç»źä¸€ă€‚
                resolutions[this.formatScale(scale)] = res;
                resolutionArray.push(res);
                scales.push(scale);
            }, this)
        } else {
            let {minZoom = 0, maxZoom = 22} = baseLayerInfo, view = this.map.getView();
            for (let i = minZoom; i <= maxZoom; i++) {
                res = view.getResolutionForZoom(i);
                scale = this.getScaleFromRes(res, coordUnit);
                if (scales.indexOf(scale) === -1) {
                    //ä¸Ťć·»ĺŠ é‡Ťĺ¤Ťçš„ćŻ”äľ‹ĺ°ş
                    scales.push(scale);
                    let attr = scale.replace(/,/g, "");
                    resolutions[attr] = res;
                    resolutionArray.push(res);
                }
            }
        }
        this.scales = scales;
        this.resolutions = resolutions;
        this.resolutionArray = resolutionArray;
    }
    /**
     * @private
     * @function WebMap.prototype.getResFromScale
     * @description ĺ°†ćŻ”äľ‹ĺ°şč˝¬ćŤ˘ä¸şĺ?†čľ¨çŽ‡
     * @param {number} scale - ćŻ”äľ‹ĺ°ş
     * @param {string} coordUnit - ćŻ”äľ‹ĺ°şĺŤ•ä˝Ť
     * @param {number} dpi
     */
    getResFromScale(scale, coordUnit = "DEGREE", dpi = 96) {
        let mpu = metersPerUnit[coordUnit.toUpperCase()];
        return scale * .0254 / dpi / mpu;
    }
    /**
     * @private
     * @function WebMap.prototype.getScaleFromRes
     * @description ĺ°†ĺ?†čľ¨çŽ‡č˝¬ćŤ˘ä¸şćŻ”äľ‹ĺ°ş
     * @param {number} resolution - ĺ?†čľ¨çŽ‡
     * @param {string} coordUnit - ćŻ”äľ‹ĺ°şĺŤ•ä˝Ť
     * @param {number} dpi
     */
    getScaleFromRes(resolution, coordUnit = "DEGREE", dpi = 96) {
        let scale, mpu = metersPerUnit[coordUnit.toUpperCase()];
        scale = resolution * dpi * mpu / .0254;
        return '1:' + scale;
    }
    /**
    * @private
    * @function WebMap.prototype.formatScale
    * @description ĺ°†ćś‰ĺŤ?ä˝Ťç¬¦çš„ć•°ĺ­—č˝¬ä¸şć™®é€šć•°ĺ­—ă€‚äľ‹ĺ¦‚ďĽš1,234 => 1234
    * @param {number} scale - ćŻ”äľ‹ĺ°şĺ?†ćŻŤ
    */
    formatScale(scale) {
        return scale.replace(/,/g, "");
    }
    /**
     * @private
     * @function WebMap.prototype.createSpecLayer
     * @description ĺ?›ĺ»şĺť?ć ‡çł»ä¸ş0ĺ’Ś-1000çš„ĺ›ľĺ±‚
     * @param {Object} mapInfo - ĺś°ĺ›ľäżˇć?Ż
     */
    createSpecLayer(mapInfo) {
        let me = this,
            baseLayerInfo = mapInfo.baseLayer,
            url = baseLayerInfo.url,
            baseLayerType = baseLayerInfo.layerType;
        let extent = [mapInfo.extent.leftBottom.x, mapInfo.extent.leftBottom.y, mapInfo.extent.rightTop.x, mapInfo.extent.rightTop.y];
        let proj = new olProj.Projection({
            extent,
            units: 'm',
            code: 'EPSG:0'
        });
        olProj.addProjection(proj);
        let options = {
            center: mapInfo.center,
            level: 0
        }
        //ć·»ĺŠ view
        me.baseProjection = proj;
        let viewOptions = {
            center: options.center ? [options.center.x, options.center.y] : [0, 0],
            zoom: 0,
            projection: proj
        }
        if (['4', '5'].indexOf(Util.getOlVersion()) < 0) { // ĺ…Ľĺ®ą ol 4ďĽŚ5ďĽŚ6
            viewOptions.multiWorld = true;
        }
        let view = new View(viewOptions);
        me.map.setView(view);
        if (me.mapParams) {
            me.mapParams.extent = extent;
            me.mapParams.projection = mapInfo.projection;
        }
        if (url && url.indexOf("?token=") > -1) {
            //ĺ…Ľĺ®ąiserverĺś°ĺť€ćś‰tokençš„ć?…ĺ†µ
            me.credentialKey = 'token';
            me.credentialValue = mapInfo.baseLayer.credential = url.split("?token=")[1];
            url = url.split("?token=")[0];
        }

        let source;
        if (baseLayerType === "TILE") {
            FetchRequest.get(me.getRequestUrl(`${url}.json`), null, {
                withCredentials: this.withCredentials
            }).then(function (response) {
                return response.json();
            }).then(function (result) {
                baseLayerInfo.originResult = result;
                let serverType = "IPORTAL", credential = baseLayerInfo.credential, keyfix = 'Token', keyParams = baseLayerInfo.url;
                if (baseLayerInfo.url.indexOf("www.supermapol.com") > -1 || baseLayerInfo.url.indexOf("itest.supermapol.com") > -1) {
                    keyfix = 'Key';
                    keyParams = [keyParams];
                    serverType = "ONLINE";
                }
                if (credential) {
                    SecurityManager[`register${keyfix}`](keyParams, credential);
                }
                let options = {
                    serverType,
                    url,
                    tileGrid: TileSuperMapRest.optionsFromMapJSON(url, result).tileGrid
                }
                if (url && !me.isSameDomain(url)) {
                    options.tileProxy = me.server + 'apps/viewer/getUrlResource.png?url=';
                }
                source = new TileSuperMapRest(options);
                me.addSpecToMap(source);
            }).catch(function (error) {
                me.errorCallback && me.errorCallback(error, 'getMapFaild', me.map);
            });
        } else if (baseLayerType === "WMS") {
            source = me.createWMSSource(baseLayerInfo);
            me.addSpecToMap(source);
        } else if (baseLayerType === "WMTS") {
            FetchRequest.get(me.getRequestUrl(url, true), null, {
                withCredentials: this.withCredentials
            }).then(function (response) {
                return response.text();
            }).then(function (capabilitiesText) {
                baseLayerInfo.extent = [mapInfo.extent.leftBottom.x, mapInfo.extent.leftBottom.y, mapInfo.extent.rightTop.x, mapInfo.extent.rightTop.y];
                baseLayerInfo.scales = me.getWMTSScales(baseLayerInfo.tileMatrixSet, capabilitiesText);
                baseLayerInfo.dpi = dpiConfig.iServerWMTS;
                source = me.createWMTSSource(baseLayerInfo);
                me.addSpecToMap(source);
            }).catch(function (error) {
                me.errorCallback && me.errorCallback(error, 'getMapFaild', me.map);
            })
        } else {
            me.errorCallback && me.errorCallback({type: "Not support CS", errorMsg: `Not support CS: ${baseLayerType}`}, 'getMapFaild', me.map);
        }
        view && view.fit(extent);
    }

    /**
     * @private
     * @function WebMap.prototype.addSpecToMap
     * @description ĺ°†ĺť?ć ‡çł»ä¸ş0ĺ’Ś-1000çš„ĺ›ľĺ±‚ć·»ĺŠ ĺ?°ĺś°ĺ›ľä¸Š
     * @param {Object} mapInfo - ĺś°ĺ›ľäżˇć?Ż
     */
    addSpecToMap(source) {
        let layer = new olLayer.Tile({
            source: source,
            zIndex: 0
        });
        this.map.addLayer(layer);
        this.sendMapToUser(0);
    }
    /**
     * @private
     * @function WebMap.prototype.getWMTSScales
     * @description čŽ·ĺŹ–wmtsçš„ćŻ”äľ‹ĺ°ş
     * @param {Object} identifier - ĺ›ľĺ±‚ĺ­?ĺ‚¨çš„ć ‡čŻ†äżˇć?Ż
     * @param {Object} capabilitiesText - wmtsäżˇć?Ż
     */
    getWMTSScales(identifier, capabilitiesText) {
        const format = new WMTSCapabilities();
        let capabilities = format.read(capabilitiesText);

        let content = capabilities.Contents;
        let tileMatrixSet = content.TileMatrixSet;
        let scales = [];
        for (let i = 0; i < tileMatrixSet.length; i++) {
            if (tileMatrixSet[i].Identifier === identifier) {
                for (let h = 0; h < tileMatrixSet[i].TileMatrix.length; h++) {
                    scales.push(tileMatrixSet[i].TileMatrix[h].ScaleDenominator)
                }
                break;
            }
        }
        return scales;
    }

    /**
     * @private
     * @function WebMap.prototype.addBaseMap
     * @description ć·»ĺŠ ĺş•ĺ›ľ
     * @param {string} mapInfo - čŻ·ć±‚ĺś°ĺ›ľçš„url
     */
    async addBaseMap(mapInfo) {
        let {baseLayer} = mapInfo, layerType = baseLayer.layerType;
        //ĺş•ĺ›ľďĽŚä˝żç”¨é»?č®¤çš„é…Ťç˝®ďĽŚä¸Ťç”¨ĺ­?ĺ‚¨çš„
        if (layerType !== 'TILE' && layerType !== 'WMS' && layerType !== 'WMTS') {
            this.getInternetMapInfo(baseLayer);
        } else if (layerType === 'WMTS') {
            // é€ščż‡čŻ·ć±‚ĺ®Śĺ–„äżˇć?Ż
            await this.getWmtsInfo(baseLayer);
        } else if (layerType === 'TILE') {
            await this.getTileInfo(baseLayer);
        } else if(layerType === 'WMS') {
            await this.getWmsInfo(baseLayer);
        }
        baseLayer.projection = mapInfo.projection;
        if (!baseLayer.extent) {
            baseLayer.extent = [mapInfo.extent.leftBottom.x, mapInfo.extent.leftBottom.y, mapInfo.extent.rightTop.x, mapInfo.extent.rightTop.y];
        }
        this.createView(mapInfo);
        let layer = this.createBaseLayer(baseLayer, 0, null, null, true);
        //ĺş•ĺ›ľĺ˘žĺŠ ĺ›ľĺ±‚ç±»ĺž‹ďĽŚDVĺ?†äş«éś€č¦?ç”¨ĺ®?ćťĄčŻ†ĺ?«ç‰?ćť?äżˇć?Ż
        layer.setProperties({
            layerType: layerType
        });
        this.map.addLayer(layer);

        if (this.mapParams) {
            this.mapParams.extent = baseLayer.extent;
            this.mapParams.projection = mapInfo.projection;
        }
        if (baseLayer.labelLayerVisible) {
            //ĺ­?ĺś¨ĺ¤©ĺś°ĺ›ľč·Żç˝‘
            let labelLayer = new olLayer.Tile({
                source: this.createTiandituSource(baseLayer.layerType, mapInfo.projection, true),
                zIndex: baseLayer.zIndex || 1,
                visible: baseLayer.visible
            });
            this.map.addLayer(labelLayer);
            // ćŚ‚č˝˝ĺ¸¦baseLayerä¸ŠďĽŚäľżäşŽĺ? é™¤
            baseLayer.labelLayer = labelLayer;
        }
        this.limitScale(mapInfo, baseLayer);
    }

    validScale(scale) {
      if (!scale) {
          return false;
      }
      const scaleNum = scale.split(':')[1];
      if (!scaleNum) {
          return false;
      }
      const res = 1 / +scaleNum;
      if (res === Infinity || res >= 1) {
          return false;
      }
      return true;
  }

  limitScale(mapInfo, baseLayer) {
      if (this.validScale(mapInfo.minScale) && this.validScale(mapInfo.maxScale)) {
          let visibleScales, minScale, maxScale;
          if (baseLayer.layerType === 'WMTS') {
              visibleScales = baseLayer.scales;
              minScale = +mapInfo.minScale.split(':')[1];
              maxScale = +mapInfo.maxScale.split(':')[1];
          } else {
              const scales = this.scales.map((scale) => {
                  return 1 / scale.split(':')[1];
              });
              if (Array.isArray(baseLayer.visibleScales) && baseLayer.visibleScales.length && baseLayer.visibleScales) {
                visibleScales = baseLayer.visibleScales;
              } else {
                visibleScales = scales;
              }
              minScale = 1 / +mapInfo.minScale.split(':')[1];
              maxScale = 1 / +mapInfo.maxScale.split(':')[1];
          }
          const minVisibleScale = this.findNearest(visibleScales, minScale);
          const maxVisibleScale = this.findNearest(visibleScales, maxScale);
          let minZoom = visibleScales.indexOf(minVisibleScale);
          let maxZoom = visibleScales.indexOf(maxVisibleScale);
          if (minZoom > maxZoom) {
              [minZoom, maxZoom] = [maxZoom, minZoom];
          }
          if (minZoom !== 0 || maxZoom !== visibleScales.length - 1) {
              this.map.setView(
                  new View(
                      Object.assign({}, this.map.getView().options_, {
                          maxResolution: undefined,
                          minResolution: undefined,
                          minZoom,
                          maxZoom,
                          constrainResolution: false
                      })
                  )
              );
              this.map.addInteraction(
                  new MouseWheelZoom({
                      constrainResolution: true
                  })
              );
          }
      }
  }

  parseNumber(scaleStr) {
    return Number(scaleStr.split(":")[1])
  }

  findNearest(scales, target) {
    let resultIndex = 0
    let targetScaleD = target;
    for (let i = 1, len = scales.length; i < len; i++) {
      if (
        Math.abs(scales[i] - targetScaleD) <
        Math.abs(scales[resultIndex] - targetScaleD)
      ) {
        resultIndex = i
      }
    }
    return scales[resultIndex]
  }

    /**
     * @private
     * @function WebMap.prototype.addMVTMapLayer
     * @description ć·»ĺŠ ĺś°ĺ›ľćśŤĺŠˇmapboxstyleĺ›ľĺ±‚
     * @param {Object} mapInfo - ĺś°ĺ›ľäżˇć?Ż
     * @param {Object} layerInfo - mapboxstyleĺ›ľĺ±‚äżˇć?Ż
     */
    addMVTMapLayer(mapInfo, layerInfo, zIndex) {
        layerInfo.zIndex = zIndex;
        // čŽ·ĺŹ–ĺś°ĺ›ľčŻ¦ç»†äżˇć?Ż
        return this.getMapboxStyleLayerInfo(mapInfo, layerInfo).then((msLayerInfo) => {
            // ĺ?›ĺ»şĺ›ľĺ±‚
            return this.createMVTLayer(msLayerInfo).then(layer => {
                let layerID = Util.newGuid(8);
                if (layerInfo.name) {
                    layer.setProperties({
                        name: layerInfo.name,
                        layerID: layerID,
                        layerType: 'VECTOR_TILE'
                    });
                }
                layerInfo.visibleScale && this.setVisibleScales(layer, layerInfo.visibleScale);
                //ĺ?¦ĺ?™ć˛ˇćś‰IDďĽŚĺŻąä¸Ťä¸ŠĺŹ·
                layerInfo.layer = layer;
                layerInfo.layerID = layerID;

                this.map.addLayer(layer);
            });
        }).catch(function (error){
            throw error;
        });
    }
    /**
     * @private
     * @function WebMap.prototype.createView
     * @description ĺ?›ĺ»şĺś°ĺ›ľč§†ĺ›ľ
     * @param {Object} options - ĺ…łäşŽĺś°ĺ›ľçš„äżˇć?Ż
     */
    createView(options) {
        let oldcenter = options.center,
            zoom = options.level !== undefined ? options.level : 1,
            maxZoom = options.maxZoom || 22,
            extent,
            projection = this.baseProjection;
        let center = [];
        for (let key in oldcenter) {
            center.push(oldcenter[key]);
        }
        if (center.length === 0) {
            //ĺ…Ľĺ®ąwms
            center = [0, 0];
        }
        //ä¸ŽDVä¸€č‡´ç”¨ĺş•ĺ›ľçš„é»?č®¤čŚ?ĺ›´ďĽŚä¸Ťç”¨ĺ­?ĺ‚¨çš„čŚ?ĺ›´ă€‚ĺ?¦ĺ?™äĽšĺŻĽč‡´ĺś°ĺ›ľć‹–ä¸ŤĺŠ¨
        this.baseLayerExtent = extent = options.baseLayer && options.baseLayer.extent;
        if (this.mapParams) {
            this.mapParams.extent = extent;
            this.mapParams.projection = projection;
        }
        //ĺ˝“ĺ‰Ťä¸­ĺż?ç‚ąä¸Ťĺś¨extentĺ†…,ĺ°±ç”¨extentçš„ä¸­ĺż?ç‚ą todo
        !containsCoordinate(extent, center) && (center = getCenter(extent));

        // č®ˇç®—ĺ˝“ĺ‰Ťćś€ĺ¤§ĺ?†čľ¨çŽ‡
        let baseLayer = options.baseLayer;
        let maxResolution;
        if ((baseLayer.visibleScales && baseLayer.visibleScales.length > 0) || (baseLayer.scales && baseLayer.scales.length > 0)) {
            //ĺş•ĺ›ľćś‰ĺ›şĺ®šćŻ”äľ‹ĺ°şďĽŚĺ°±ç›´ćŽĄčŽ·ĺŹ–ă€‚ä¸Ťç”¨viewč®ˇç®—
            this.getScales(baseLayer);
        } else if (options.baseLayer && extent && extent.length === 4) {
            let width = extent[2] - extent[0];
            let height = extent[3] - extent[1];
            let maxResolution1 = width / 512;
            let maxResolution2 = height / 512;
            maxResolution = Math.max(maxResolution1, maxResolution2);
        }

        // if(options.baseLayer.visibleScales && options.baseLayer.visibleScales.length > 0){
        //     maxZoom = options.baseLayer.visibleScales.length;
        // }
        this.map.setView(new View({ zoom, center, projection, maxZoom, maxResolution }));
        let viewOptions = {};

        if (baseLayer.scales && baseLayer.scales.length > 0 && baseLayer.layerType === "WMTS" ||
            this.resolutionArray && this.resolutionArray.length > 0) {
            viewOptions = { zoom, center, projection, resolutions: this.resolutionArray, maxZoom };
        } else if (baseLayer.layerType === "WMTS") {
            viewOptions = { zoom, center, projection, maxZoom };
            this.getScales(baseLayer);
        } else {
            viewOptions = { zoom, center, projection, maxResolution, maxZoom };
            this.getScales(baseLayer);
        }
        if (['4', '5'].indexOf(Util.getOlVersion()) < 0) { // ĺ…Ľĺ®ą ol 4ďĽŚ5ďĽŚ6
            viewOptions.multiWorld = true;
            viewOptions.showFullExtent = true;
            viewOptions.enableRotation = false;
            viewOptions.constrainResolution = true; //č®ľç˝®ć­¤ĺŹ‚ć•°ďĽŚć?Żĺ› ä¸şéś€č¦?ć?ľç¤şć•´ć•°çş§ĺ?«ă€‚ä¸şäş†ĺŹŻč§†ćŻ”äľ‹ĺ°şä¸­ĺŚ…ĺ?«ĺ˝“ĺ‰ŤćŻ”äľ‹ĺ°ş
        }
        this.map.setView(new View(viewOptions));

        if (options.visibleExtent) {
            const view = this.map.getView();
            const resolution = view.getResolutionForExtent(options.visibleExtent, this.map.getSize());
            view.setResolution(resolution);
            view.setCenter(getCenter(options.visibleExtent));
        }
    }
    /**
     * @private
     * @function WebMap.prototype.createBaseLayer
     * @description ĺ?›ĺ»şçź˘é‡Źĺ›ľĺ±‚ďĽŚĺŚ…ć‹¬ĺş•ĺ›ľĺŹŠĺ…¶ĺŹ ĺŠ çš„çź˘é‡Źĺ›ľĺ±‚
     * @param {Object} layerInfo - ĺ…łäşŽĺś°ĺ›ľçš„äżˇć?Ż
     * @param {number} index - ĺ˝“ĺ‰Ťĺ›ľĺ±‚ĺś¨ĺś°ĺ›ľä¸­çš„index
     * @param {boolean} isCallBack - ć?Żĺ?¦č°?ç”¨ĺ›žč°?ĺ‡˝ć•°
     * @param {scope} {Object} thisĺŻąč±ˇ
     */
    createBaseLayer(layerInfo, index, isCallBack, scope, isBaseLayer) {
        let source, that = this;

        if (scope) {
            // č§Łĺ†łĺĽ‚ć­Ąĺ›žč°?
            that = scope;
        }
        let layerType = layerInfo.layerType; //ĺş•ĺ›ľĺ’Śrestĺś°ĺ›ľĺ…Ľĺ®ą
        if (layerType.indexOf('TIANDITU_VEC') > -1 || layerType.indexOf('TIANDITU_IMG') > -1 ||
            layerType.indexOf('TIANDITU_TER') > -1) {
            layerType = layerType.substr(0, 12);
        }
        switch (layerType) {
            case "TIANDITU_VEC":
            case "TIANDITU_IMG":
            case "TIANDITU_TER":
                source = this.createTiandituSource(layerType, layerInfo.projection);
                break;
            case "BAIDU":
                source = this.createBaiduSource();
                break;
            case 'BING':
                source = this.createBingSource(layerInfo, layerInfo.projection);
                break;
            case "WMS":
                source = this.createWMSSource(layerInfo);
                break;
            case "WMTS":
                source = that.createWMTSSource(layerInfo);
                break;
            case 'TILE':
            case 'SUPERMAP_REST':
                source = that.createDynamicTiledSource(layerInfo, isBaseLayer);
                break;
            case 'CLOUD':
            case 'CLOUD_BLACK':
            case 'OSM':
            case 'JAPAN_ORT':
            case 'JAPAN_RELIEF':
            case 'JAPAN_PALE':
            case 'JAPAN_STD':
            case 'GOOGLE_CN':
            case 'GOOGLE':
                source = this.createXYZSource(layerInfo);
                break;
            default:
                break;
        }
        var layer = new olLayer.Tile({
            source: source,
            zIndex: layerInfo.zIndex || 1,
            visible: layerInfo.visible
        });
        var layerID = Util.newGuid(8);
        if (layerInfo.name) {
            layer.setProperties({
                name: layerInfo.name,
                layerID: layerID
            });
        }
        if (layerInfo.visible === undefined || layerInfo.visible === null) {
            layerInfo.visible = true;
        }
        layer.setVisible(layerInfo.visible);
        layerInfo.opacity && layer.setOpacity(layerInfo.opacity);
        //layerInfoć˛ˇćś‰ĺ­?ĺ‚¨indexĺ±žć€§
        index && layer.setZIndex(index);

        //ĺ?¦ĺ?™ć˛ˇćś‰IDďĽŚĺŻąä¸Ťä¸ŠĺŹ·
        layerInfo.layer = layer;
        layerInfo.layerID = layerID;

        let {visibleScale, autoUpdateTime} = layerInfo, minResolution, maxResolution;
        if (visibleScale) {
            maxResolution = this.resolutions[visibleScale.minScale];
            minResolution = this.resolutions[visibleScale.maxScale];
            //ćŻ”äľ‹ĺ°şĺ’Śĺ?†ĺ?«çŽ‡ć?ŻĺŹŤćŻ”çš„ĺ…łçł»
            maxResolution > 1 ? layer.setMaxResolution(Math.ceil(maxResolution)) : layer.setMaxResolution(maxResolution * 1.1);
            layer.setMinResolution(minResolution);
        }
        if (autoUpdateTime && !layerInfo.autoUpdateInterval) {
            //č‡ŞĺŠ¨ć›´ć–°
            layerInfo.autoUpdateInterval = setInterval(() => {
                that.updateTileToMap(layerInfo, index);
            }, autoUpdateTime);
        }

        if (isCallBack) {
            layer.setZIndex(0); // wmts
            that.map.addLayer(layer);
        }

        return layer;
    }

    /**
     * @private
     * @function WebMap.prototype.updateTileToMap
     * @description čŽ·ĺŹ–ĺş•ĺ›ľĺŻąĺş”çš„ĺ›ľĺ±‚äżˇć?ŻďĽŚä¸Ťć?Żç”¨čŻ·ć±‚ĺ›žćťĄçš„ĺş•ĺ›ľäżˇć?Ż
     * @param {Object} layerInfo - ĺ›ľĺ±‚äżˇć?Ż
     * @param {number} layerIndex - ĺ›ľĺ±‚index
     */
    updateTileToMap(layerInfo, layerIndex) {
        this.map.removeLayer(layerInfo.layer);
        this.map.addLayer(this.createBaseLayer(layerInfo, layerIndex));
    }

    /**
     * @private
     * @function WebMap.prototype.getInternetMapInfo
     * @description čŽ·ĺŹ–ĺş•ĺ›ľĺŻąĺş”çš„ĺ›ľĺ±‚äżˇć?ŻďĽŚä¸Ťć?Żç”¨čŻ·ć±‚ĺ›žćťĄçš„ĺş•ĺ›ľäżˇć?Ż
     * @param {Object} baseLayerInfo - ĺş•ĺ›ľäżˇć?Ż
     * @returns {Object} ĺş•ĺ›ľçš„ĺ…·ä˝“äżˇć?Ż
     */
    getInternetMapInfo(baseLayerInfo) {
        const baiduBounds = [-20037508.3427892, -20037508.3427892, 20037508.3427892, 20037508.3427892];
        const bounds_4326 = [-180, -90, 180, 90];
        const osmBounds = [-20037508.34, -20037508.34, 20037508.34, 20037508.34];
        const japanReliefBounds = [12555667.53929, 1281852.98656, 17525908.86651, 7484870.70596];
        const japanOrtBounds = [-19741117.14519, -10003921.36848, 19981677.71404, 19660983.56089];

        baseLayerInfo.units = "m";
        switch (baseLayerInfo.layerType) {
            case ('BAIDU'):
                baseLayerInfo.iServerUrl = 'https://map.baidu.com/';
                baseLayerInfo.epsgCode = 'EPSG:3857';
                baseLayerInfo.minZoom = 1;
                baseLayerInfo.maxZoom = 19;
                baseLayerInfo.level = 1;
                baseLayerInfo.extent = baiduBounds;
                // thumbnail: this.getImagePath('bmap.png') ćš‚ć—¶ä¸Ťç”¨ĺ?°çĽ©ç•Ąĺ›ľ
                break;
            case ('CLOUD'):
                baseLayerInfo.url = 'http://t2.dituhui.com/FileService/image?map=quanguo&type=web&x={x}&y={y}&z={z}';
                baseLayerInfo.epsgCode = 'EPSG:3857';
                baseLayerInfo.minZoom = 1;
                baseLayerInfo.maxZoom = 18;
                baseLayerInfo.level = 1;
                baseLayerInfo.extent = baiduBounds;
                break;
            case ('CLOUD_BLACK'):
                baseLayerInfo.url = 'http://t3.dituhui.com/MapService/getGdp?x={x}&y={y}&z={z}';
                baseLayerInfo.epsgCode = 'EPSG:3857';
                baseLayerInfo.minZoom = 1;
                baseLayerInfo.maxZoom = 18;
                baseLayerInfo.level = 1;
                baseLayerInfo.extent = baiduBounds;
                break;
            case ('tencent'):
                baseLayerInfo.epsgCode = 'EPSG:3857';
                baseLayerInfo.minZoom = 1;
                baseLayerInfo.maxZoom = 18;
                baseLayerInfo.level = 1;
                baseLayerInfo.extent = baiduBounds;
                break;
            case ('TIANDITU_VEC_3857'):
            case ('TIANDITU_IMG_3857'):
            case ('TIANDITU_TER_3857'):
                baseLayerInfo.iserverUrl = 'https://map.tianditu.gov.cn/';
                baseLayerInfo.epsgCode = 'EPSG:3857';
                baseLayerInfo.minZoom = 0;
                baseLayerInfo.maxZoom = 19;
                baseLayerInfo.level = 1;
                baseLayerInfo.extent = baiduBounds;
                if (baseLayerInfo.layerType === "TIANDITU_TER_3857") {
                    baseLayerInfo.maxZoom = 14;
                }
                break;
            case ('TIANDITU_VEC_4326'):
            case ('TIANDITU_IMG_4326'):
            case ('TIANDITU_TER_4326'):
                baseLayerInfo.iserverUrl = 'https://map.tianditu.gov.cn/';
                baseLayerInfo.epsgCode = 'EPSG:4326';
                baseLayerInfo.minZoom = 0;
                baseLayerInfo.maxZoom = 19;
                baseLayerInfo.level = 1;
                baseLayerInfo.extent = bounds_4326;
                if (baseLayerInfo.layerType === "TIANDITU_TER_4326") {
                    baseLayerInfo.maxZoom = 14;
                }
                break;
            case ('OSM'):
                baseLayerInfo.url = 'http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png';
                baseLayerInfo.epsgCode = 'EPSG:3857';
                baseLayerInfo.minZoom = 1;
                baseLayerInfo.maxZoom = 19;
                baseLayerInfo.level = 1;
                baseLayerInfo.extent = osmBounds;
                baseLayerInfo.iserverUrl = 'https://www.openstreetmap.org';
                break;
            case ('GOOGLE'):
                baseLayerInfo.url = `https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i540264686!3m12!2s${this.getLang()}!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!4e0&key=${this.googleMapsAPIKey}`;
                baseLayerInfo.epsgCode = 'EPSG:3857';
                baseLayerInfo.minZoom = 1;
                baseLayerInfo.maxZoom = 22;
                baseLayerInfo.level = 1;
                baseLayerInfo.extent = osmBounds;
                baseLayerInfo.iserverUrl = 'https://www.google.cn/maps';
                break;
            case ('JAPAN_STD'):
                baseLayerInfo.url = 'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png';
                baseLayerInfo.epsgCode = 'EPSG:3857';
                baseLayerInfo.minZoom = 1;
                baseLayerInfo.maxZoom = 19;
                baseLayerInfo.level = 0;
                baseLayerInfo.extent = osmBounds;
                break;
            case ('JAPAN_PALE'):
                baseLayerInfo.url = 'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png';
                baseLayerInfo.epsgCode = 'EPSG:3857';
                baseLayerInfo.minZoom = 2;
                baseLayerInfo.maxZoom = 19;
                baseLayerInfo.level = 2;
                baseLayerInfo.extent = osmBounds;
                break;
            case ('JAPAN_RELIEF'):
                baseLayerInfo.url = 'https://cyberjapandata.gsi.go.jp/xyz/relief/{z}/{x}/{y}.png';
                baseLayerInfo.epsgCode = 'EPSG:3857';
                baseLayerInfo.minZoom = 5;
                baseLayerInfo.maxZoom = 14;
                baseLayerInfo.level = 5;
                baseLayerInfo.extent = japanReliefBounds;
                break;
            case ('JAPAN_ORT'):
                baseLayerInfo.url = 'https://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg';
                baseLayerInfo.epsgCode = 'EPSG:3857';
                baseLayerInfo.minZoom = 2;
                baseLayerInfo.maxZoom = 12;
                baseLayerInfo.level = 2;
                baseLayerInfo.extent = japanOrtBounds;
                break;
        }
    }
    /**
     * @private
     * @function WebMap.prototype.createDynamicTiledSource
     * @description čŽ·ĺŹ–supermap iServerç±»ĺž‹çš„ĺś°ĺ›ľçš„sourceă€‚
     * @param {Object} layerInfo
     * @param {boolean} isBaseLayer ć?Żĺ?¦ć?Żĺş•ĺ›ľ
     */
    createDynamicTiledSource(layerInfo, isBaseLayer) {
        let serverType = "IPORTAL",
            credential = layerInfo.credential ? layerInfo.credential.token : undefined,
            keyfix = 'Token',
            keyParams = layerInfo.url;

        if (layerInfo.url.indexOf("www.supermapol.com") > -1 || layerInfo.url.indexOf("itest.supermapol.com") > -1) {
            keyfix = 'Key';
            keyParams = [keyParams];
            serverType = "ONLINE";
        }
        if (credential) {
            SecurityManager[`register${keyfix}`](keyParams, credential);
        }
        // extent: isBaseLayer ? layerInfo.extent : ol.proj.transformExtent(layerInfo.extent, layerInfo.projection, this.baseProjection),
        let options = {
            transparent: true,
            url: layerInfo.url,
            wrapX: false,
            serverType: serverType,
            // crossOrigin: 'anonymous', //ĺś¨IE11.0.9600ç‰?ćś¬ďĽŚäĽšĺ˝±ĺ“Ťé€ščż‡ćł¨ĺ†ŚćśŤĺŠˇć‰“ĺĽ€çš„iserverĺś°ĺ›ľďĽŚä¸Ťĺ‡şĺ›ľă€‚ĺ› ä¸şć˛ˇćś‰ć?şĺ¸¦cookieäĽšćŠĄč·¨ĺźźé—®é˘?
            // extent: this.baseLayerExtent,
            // prjCoordSys: {epsgCode: isBaseLayer ? layerInfo.projection.split(':')[1] : this.baseProjection.split(':')[1]},
            format: layerInfo.format
        };
        if(!isBaseLayer && !this.isCustomProjection(this.baseProjection )){
            options.prjCoordSys = { epsgCode : this.baseProjection.split(':')[1]};
        }
        if (layerInfo.visibleScales && layerInfo.visibleScales.length > 0) {
            let visibleResolutions = [];
            for (let i in layerInfo.visibleScales) {
                let resolution = Util.scaleToResolution(layerInfo.visibleScales[i], dpiConfig.default, layerInfo.coordUnit);
                visibleResolutions.push(resolution);
            }
            layerInfo.visibleResolutions = visibleResolutions;
            let tileGrid = new TileGrid({
                extent: layerInfo.extent,
                resolutions: visibleResolutions
            });
            options.tileGrid = tileGrid;
        } else {
            options.extent = this.baseLayerExtent;
            //bug:ISVJ-2412,ä¸Ťć·»ĺŠ ä¸‹ĺ?—ä»Łç ?ĺ‡şä¸Ťäş†ĺ›ľă€‚ĺŹ‚ç…§iserver ol3ĺ‡şĺ›ľć–ąĺĽŹ
            let tileGrid = new TileGrid({
                extent: layerInfo.extent,
                resolutions: this.getResolutionsFromBounds(layerInfo.extent)
            });
            options.tileGrid = tileGrid;
        }
        //ä¸»ćśşĺ?Ťç›¸ĺ?Ść—¶ä¸Ťć·»ĺŠ ä»Łç?†,iportal geturlResourceä¸Ťć”ŻćŚ?webpä»Łç?†
        if (layerInfo.url && !this.isSameDomain(layerInfo.url) && layerInfo.format !== 'webp') {
            options.tileProxy = this.server + 'apps/viewer/getUrlResource.png?url=';
        }
        let source = new TileSuperMapRest(options);
        SecurityManager[`register${keyfix}`](layerInfo.url);
        return source;
    }

    /**
    * @private
    * @function WebMap.prototype.getResolutionsFromBounds
    * @description čŽ·ĺŹ–ćŻ”äľ‹ĺ°şć•°ç»„
    * @param {Array.<number>} bounds čŚ?ĺ›´ć•°ç»„
    * @returns {styleResolutions} ćŻ”äľ‹ĺ°şć•°ç»„
    */
    getResolutionsFromBounds(bounds) {
        let styleResolutions = [];
        let temp = Math.abs(bounds[0] - bounds[2]) / 512;
        for (let i = 0; i < 22; i++) {
            if (i === 0) {
                styleResolutions[i] = temp;
                continue;
            }
            temp = temp / 2;
            styleResolutions[i] = temp;
        }
        return styleResolutions;
    }

    /**
     * @private
     * @function WebMap.prototype.createTiandituSource
     * @description ĺ?›ĺ»şĺ¤©ĺś°ĺ›ľçš„sourceă€‚
     * @param layerType ĺ›ľĺ±‚ç±»ĺž‹
     * @param projection ĺś°ç?†ĺť?ć ‡çł»
     * @param isLabel  ć?Żĺ?¦ćś‰č·Żç˝‘ĺ›ľĺ±‚
     * @returns {Tianditu} ĺ¤©ĺś°ĺ›ľçš„source
     */
    createTiandituSource(layerType, projection, isLabel) {
        let options = {
            layerType: layerType.split('_')[1].toLowerCase(),
            isLabel: isLabel || false,
            projection: projection,
            url: `https://t{0-7}.tianditu.gov.cn/{layer}_{proj}/wmts?tk=${this.tiandituKey}`
        };
        return new Tianditu(options);
    }
    /**
     * @private
     * @function WebMap.prototype.createBaiduSource
     * @description ĺ?›ĺ»şç™ľĺş¦ĺś°ĺ›ľçš„sourceă€‚
     * @returns {BaiduMap} baiduĺś°ĺ›ľçš„source
     */
    createBaiduSource() {
        return new BaiduMap()
    }
    /**
     * @private
     * @function WebMap.prototype.createBingSource
     * @description ĺ?›ĺ»şbingĺś°ĺ›ľçš„sourceă€‚
     * @returns {ol.source.XYZ} bingĺś°ĺ›ľçš„source
     */
    createBingSource(layerInfo, projection) {
        let url = 'https://dynamic.t0.tiles.ditu.live.com/comp/ch/{quadKey}?it=G,TW,L,LA&mkt=zh-cn&og=109&cstl=w4c&ur=CN&n=z';
        return new XYZ({
            wrapX: false,
            projection: projection,
            crossOrigin: 'anonymous',
            tileUrlFunction: function (coordinates) {
                let /*quadDigits = '', */[z, x, y] = [...coordinates];
                y = y > 0 ? y - 1 : -y - 1;
                let index = '';
                for (let i = z; i > 0; i--) {
                    let b = 0;
                    let mask = 1 << (i - 1);
                    if ((x & mask) !== 0) {
                        b++;
                    }
                    if ((y & mask) !== 0) {
                        b += 2;
                    }
                    index += b.toString()
                }
                return url.replace('{quadKey}', index);
            }
        })
    }

    /**
     * @private
     * @function WebMap.prototype.createXYZSource
     * @description ĺ?›ĺ»şĺ›ľĺ±‚çš„XYZsourceă€‚
     * @param {Object} layerInfo - ĺ›ľĺ±‚äżˇć?Ż
     * @returns {ol.source.XYZ} xyzçš„source
     */
    createXYZSource(layerInfo) {
        return new XYZ({
            url: layerInfo.url,
            wrapX: false,
            crossOrigin: 'anonymous'
        })
    }

    /**
     * @private
     * @function WebMap.prototype.createWMSSource
     * @description ĺ?›ĺ»şwmsĺś°ĺ›ľsourceă€‚
     * @param {Object} layerInfo - ĺ›ľĺ±‚äżˇć?Żă€‚
     * @returns {ol.source.TileWMS} wmsçš„source
     */
    createWMSSource(layerInfo) {
        let that = this;
        return new TileWMS({
            url: layerInfo.url,
            wrapX: false,
            params: {
                LAYERS: layerInfo.layers ? layerInfo.layers[0] : "0",
                FORMAT: 'image/png',
                VERSION: layerInfo.version || "1.3.0"
            },
            projection: layerInfo.projection || that.baseProjection,
            tileLoadFunction: function (imageTile, src) {
                imageTile.getImage().src = src
            }
        })
    }

    /**
     * @private
     * @function WebMap.prototype.getTileLayerExtent
     * @description čŽ·ĺŹ–(Supermap RestMap)çš„ĺ›ľĺ±‚ĺŹ‚ć•°ă€‚
     * @param {Object} layerInfo - ĺ›ľĺ±‚äżˇć?Żă€‚
     * @param {function} callback - čŽ·ĺľ—tileĺ›ľĺ±‚ĺŹ‚ć•°ć‰§čˇŚçš„ĺ›žč°?ĺ‡˝ć•°
     * @param {function} failedCallback - ĺ¤±č´Ąĺ›žč°?ĺ‡˝ć•°
     */
    async getTileLayerExtent(layerInfo, callback, failedCallback) {
        let that = this;
        // é»?č®¤ä˝żç”¨ĺŠ¨ć€?ćŠ•ĺ˝±ć–ąĺĽŹčŻ·ć±‚ć•°ćŤ®
        let dynamicLayerInfo = await that.getTileLayerExtentInfo(layerInfo)
        if (dynamicLayerInfo.succeed === false) {
            if (dynamicLayerInfo.error.code === 400) {
                // dynamicLayerInfo.error.code === 400 ä¸Ťć”ŻćŚ?ĺŠ¨ć€?ćŠ•ĺ˝±ďĽŚčŻ·ć±‚restmapĺŽźĺ§‹äżˇć?Ż
                let originLayerInfo = await that.getTileLayerExtentInfo(layerInfo, false);
                if (originLayerInfo.succeed === false) {
                    failedCallback();
                } else {
                    Object.assign(layerInfo, originLayerInfo);
                    callback(layerInfo);
                }
            } else {
                failedCallback();
            }
        } else {
            Object.assign(layerInfo, dynamicLayerInfo);
            callback(layerInfo);
        }
    }

    /**
     * @private
     * @function WebMap.prototype.getTileLayerExtentInfo
     * @description čŽ·ĺŹ–rest mapçš„ĺ›ľĺ±‚ĺŹ‚ć•°ă€‚
     * @param {Object} layerInfo - ĺ›ľĺ±‚äżˇć?Żă€‚
     * @param {boolean} isDynamic - ć?Żĺ?¦čŻ·ć±‚ĺŠ¨ć€?ćŠ•ĺ˝±äżˇć?Ż
     */
    getTileLayerExtentInfo(layerInfo, isDynamic = true) {
        let that = this,
            token,
            url = layerInfo.url.trim(),
            credential = layerInfo.credential,
            options = {
                withCredentials: this.withCredentials,
                withoutFormatSuffix: true
            };
        if (isDynamic) {
            let projection = {
                epsgCode: that.baseProjection.split(":")[1]
            }
            if (!that.isCustomProjection(that.baseProjection)) {
                // bug IE11 ä¸ŤäĽšč‡ŞĺŠ¨çĽ–ç ?
                url += '.json?prjCoordSys=' + encodeURI(JSON.stringify(projection));
            }
        }
        if (credential) {
            url = `${url}&token=${encodeURI(credential.token)}`;
            token = credential.token;
        }
        return FetchRequest.get(that.getRequestUrl(`${url}.json`), null, options).then(function (response) {
            return response.json();
        }).then(async (result) => {
            if (result.succeed === false) {
                return result
            }
            let format = 'png';
            if(that.tileFormat === 'webp') {
                const isSupportWebp = await that.isSupportWebp(layerInfo.url, token);
                format = isSupportWebp ? 'webp' : 'png';
            }
            return {
                units: result.coordUnit && result.coordUnit.toLowerCase(),
                coordUnit: result.coordUnit,
                visibleScales: result.visibleScales,
                extent: [result.bounds.left, result.bounds.bottom, result.bounds.right, result.bounds.top],
                projection: `EPSG:${result.prjCoordSys.epsgCode}`,
                format
            }
        }).catch((error) => {
            return {
                succeed: false,
                error: error
            }
        });
    }

    /**
     * @private
     * @function WebMap.prototype.getTileInfo
     * @description čŽ·ĺŹ–rest mapçš„ĺ›ľĺ±‚ĺŹ‚ć•°ă€‚
     * @param {Object} layerInfo - ĺ›ľĺ±‚äżˇć?Żă€‚
     * @param {function} callback - čŽ·ĺľ—wmtsĺ›ľĺ±‚ĺŹ‚ć•°ć‰§čˇŚçš„ĺ›žč°?ĺ‡˝ć•°
     */
    getTileInfo(layerInfo, callback, mapInfo) {
        let that = this;
        let options = {
            withCredentials: this.withCredentials,
            withoutFormatSuffix: true
        };
        if (layerInfo.url.indexOf("?token=") > -1) {
            that.credentialKey = 'token';
            that.credentialValue = layerInfo.credential = layerInfo.url.split("?token=")[1];
            layerInfo.url = layerInfo.url.split("?token=")[0];
        }
        return FetchRequest.get(that.getRequestUrl(`${layerInfo.url}.json`), null, options).then(function (response) {
            return response.json();
        }).then(async function (result) {
            // layerInfo.projection = mapInfo.projection;
            // layerInfo.extent = [mapInfo.extent.leftBottom.x, mapInfo.extent.leftBottom.y, mapInfo.extent.rightTop.x, mapInfo.extent.rightTop.y];
            // ćŻ”äľ‹ĺ°ş ĺŤ•ä˝Ť
            if(result && result.code && result.code !== 200) {
                throw result;
            }
            if (result.visibleScales) {
                layerInfo.visibleScales = result.visibleScales;
                layerInfo.coordUnit = result.coordUnit;
            }
            layerInfo.maxZoom = result.maxZoom;
            layerInfo.maxZoom = result.minZoom;
            let token = layerInfo.credential ? layerInfo.credential.token : undefined;
            layerInfo.format = 'png';
            // china_darkä¸şé»?č®¤ĺş•ĺ›ľďĽŚčż?ć?Żç”¨pngĺ‡şĺ›ľ
            if(that.tileFormat === 'webp' && layerInfo.url !== 'https://maptiles.supermapol.com/iserver/services/map_China/rest/maps/China_Dark') {
                const isSupprtWebp = await that.isSupportWebp(layerInfo.url, token);
                layerInfo.format = isSupprtWebp ? 'webp' : 'png';
            }
            // čŻ·ć±‚ç»“ćžśĺ®Ść?? ç»§ç»­ć·»ĺŠ ĺ›ľĺ±‚
            if (mapInfo) {
                //todo čż™ä¸Şč˛ŚäĽĽć˛ˇćś‰ç”¨ĺ?°ďĽŚä¸‹ć¬ˇäĽ?ĺŚ–
                callback && callback(mapInfo, null, true, that);
            } else {
                callback && callback(layerInfo);
            }

        }).catch(function (error) {
            that.errorCallback && that.errorCallback(error, 'getTileInfo', that.map)
        });
    }
    /**
     * @private
     * @function WebMap.prototype.getWMTSUrl
     * @description čŽ·ĺŹ–wmtsčŻ·ć±‚ć–‡ćˇŁçš„url
     * @param {string} url - ĺ›ľĺ±‚äżˇć?Żă€‚
     * @param {boolean} isKvp - ć?Żĺ?¦ä¸şkvpć¨ˇĺĽŹ
     */
    getWMTSUrl(url, isKvp) {
        let splitStr = '?';
        if (url.indexOf('?') > -1) {
            splitStr = '&'
        }
        if (isKvp) {
            url += splitStr + 'SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities';
        } else {
            url += splitStr + '/1.0.0/WMTSCapabilities.xml';
        }
        return this.getRequestUrl(url, true);
    }

    /**
     * @private
     * @function WebMap.prototype.getWmtsInfo
     * @description čŽ·ĺŹ–wmtsçš„ĺ›ľĺ±‚ĺŹ‚ć•°ă€‚
     * @param {Object} layerInfo - ĺ›ľĺ±‚äżˇć?Żă€‚
     * @param {function} callback - čŽ·ĺľ—wmtsĺ›ľĺ±‚ĺŹ‚ć•°ć‰§čˇŚçš„ĺ›žč°?ĺ‡˝ć•°
     */
    getWmtsInfo(layerInfo, callback) {
        let that = this;
        let options = {
            withCredentials: that.withCredentials,
            withoutFormatSuffix: true
        };
        const isKvp = !layerInfo.requestEncoding || layerInfo.requestEncoding === 'KVP';
        return FetchRequest.get(that.getWMTSUrl(layerInfo.url, isKvp), null, options).then(function (response) {
            return response.text();
        }).then(function (capabilitiesText) {
            const format = new WMTSCapabilities();
            let capabilities = format.read(capabilitiesText);
            if (that.isValidResponse(capabilities)) {
                let content = capabilities.Contents;
                let tileMatrixSet = content.TileMatrixSet,
                    layers = content.Layer,
                    layer, idx, layerFormat, style = 'default';

                for (let n = 0; n < layers.length; n++) {
                    if (layers[n].Identifier === layerInfo.layer) {
                        idx = n;
                        layer = layers[idx];
                        layerFormat = layer.Format[0];
                        var layerBounds = layer.WGS84BoundingBox;
                        // tileMatrixSetLink = layer.TileMatrixSetLink;
                        break;
                    }
                }
                layer && layer.Style && layer.Style.forEach(value => {
                    if (value.isDefault) {
                        style = value.Identifier;
                    }
                });
                let scales = [], matrixIds = [];
                for (let i = 0; i < tileMatrixSet.length; i++) {
                    if (tileMatrixSet[i].Identifier === layerInfo.tileMatrixSet) {
                        let wmtsLayerEpsg = `EPSG:${tileMatrixSet[i].SupportedCRS.split('::')[1]}`;
                        for (let h = 0; h < tileMatrixSet[i].TileMatrix.length; h++) {
                            scales.push(tileMatrixSet[i].TileMatrix[h].ScaleDenominator);
                            matrixIds.push(tileMatrixSet[i].TileMatrix[h].Identifier);
                        }
                        //bug wmtsĺ‡şĺ›ľéś€č¦?ĺŠ ä¸ŠoriginďĽŚĺ?¦ĺ?™äĽšĺ‡şçŽ°ĺ‡şĺ›ľä¸Ťć­Łçˇ®çš„ć?…ĺ†µă€‚ĺ?Źç§»ć?–č€…ç“¦ç‰‡ĺ‡şä¸Ťäş†
                        let origin = tileMatrixSet[i].TileMatrix[0].TopLeftCorner;
                        layerInfo.origin = ["EPSG:4326", "EPSG:4490"].indexOf(wmtsLayerEpsg) > -1 ? [origin[1], origin[0]] : origin;
                        break;
                    }
                }
                let name = layerInfo.name, extent;
                if (layerBounds) {
                    if (layerBounds[0] < -180) {
                        layerBounds[0] = -180;
                    }
                    if (layerBounds[1] < -90) {
                        layerBounds[1] = -90;
                    }
                    if (layerBounds[2] > 180) {
                        layerBounds[2] = 180;
                    }
                    if (layerBounds[3] > 90) {
                        layerBounds[3] = 90;
                    }
                    extent = olProj.transformExtent(layerBounds, 'EPSG:4326', that.baseProjection);
                } else {
                    extent = olProj.get(that.baseProjection).getExtent()
                }
                layerInfo.tileUrl = that.getTileUrl(capabilities.OperationsMetadata.GetTile.DCP.HTTP.Get, layer, layerFormat, isKvp);
                //ĺ°†éś€č¦?çš„ĺŹ‚ć•°čˇĄä¸Š
                layerInfo.extent = extent;
                layerInfo.name = name;
                layerInfo.orginEpsgCode = layerInfo.projection;
                layerInfo.overLayer = true;
                layerInfo.scales = scales;
                layerInfo.style = style;
                layerInfo.title = name;
                layerInfo.unit = "m";
                layerInfo.layerFormat = layerFormat;
                layerInfo.matrixIds = matrixIds;
                callback && callback(layerInfo);
            }
        }).catch(function (error) {
            that.errorCallback && that.errorCallback(error, 'getWmtsFaild', that.map)
        });
    }
    /**
     * @private
     * @function WebMap.prototype.getWmsInfo
     * @description čŽ·ĺŹ–wmsçš„ĺ›ľĺ±‚ĺŹ‚ć•°ă€‚
     * @param {Object} layerInfo - ĺ›ľĺ±‚äżˇć?Żă€‚
     */
    getWmsInfo(layerInfo) {
        let that = this;
        let url = layerInfo.url.trim();
        url += (url.indexOf('?') > -1 ? '&SERVICE=WMS&REQUEST=GetCapabilities' : '?SERVICE=WMS&REQUEST=GetCapabilities');
        let options = {
            withCredentials: that.withCredentials,
            withoutFormatSuffix: true
        };

        let promise = new Promise(function (resolve) {
            return FetchRequest.get(that.getRequestUrl(url, true), null, options).then(function (response) {
                return response.text();
            }).then(async function (capabilitiesText) {
                const format = new WMSCapabilities();
                let capabilities = format.read(capabilitiesText);
                if (capabilities) {
                    let layers = capabilities.Capability.Layer.Layer, proj = layerInfo.projection;
                    layerInfo.subLayers = layerInfo.layers[0];
                    layerInfo.version = capabilities.version;
                    for (let i = 0; i < layers.length; i++) {
                        // ĺ›ľĺ±‚ĺ?ŤćŻ”ĺŻą
                        if (layerInfo.layers[0] === layers[i].name) {
                            let layer = layers[i];
                            if (layer.bbox[proj]) {
                                let bbox = layer.bbox[proj].bbox;
                                // wmts 130 ĺť?ć ‡č˝´ć?Żĺ?¦ĺŹŤĺ?‘ďĽŚç›®ĺ‰Ťčż?ć— ćł•ĺ?¤ć–­
                                // ĺ?Žç»­čż?éś€ç»§ç»­ĺ®Śĺ–„WKT ĺ˘žĺŠ ĺť?ć ‡č˝´ć–ąĺ?‘ĺ€Ľ
                                // ç›®ĺ‰Ťwktäżˇć?Ż ćťĄč‡Şhttps://epsg.io/
                                // ćŹ?äľ›ĺť?ć ‡ć–ąĺ?‘ĺ€Ľçš„ç˝‘ç«™  ĺ¦‚ďĽšhttps://www.epsg-registry.org/export.htm?wkt=urn:ogc:def:crs:EPSG::4490
                                if ((layerInfo.version === "1.3.0" && layerInfo.projection === "EPSG:4326") || (layerInfo.version === "1.3.0" && layerInfo.projection === "EPSG:4490")) {
                                    layerInfo.extent = [bbox[1], bbox[0], bbox[3], bbox[2]];
                                } else {
                                    layerInfo.extent = bbox;
                                }
                                break;
                            }
                        }
                    }
                }
                resolve();
            }).catch(function (error) {
                that.errorCallback && that.errorCallback(error, 'getWMSFaild', that.map)
                resolve();
            })
        });
        return promise;
    }
    /**
     * @private
     * @function WebMap.prototype.getTileUrl
     * @description čŽ·ĺŹ–wmtsçš„ĺ›ľĺ±‚ĺŹ‚ć•°ă€‚
     * @param {Object} getTileArray - ĺ›ľĺ±‚äżˇć?Żă€‚
     * @param {string} layer - é€‰ć‹©çš„ĺ›ľĺ±‚
     * @param {string} format - é€‰ć‹©çš„ĺ‡şĺ›ľć–ąĺĽŹ
     * @param {boolean} isKvp - ć?Żĺ?¦ć?Żkvpć–ąĺĽŹ
     */
    getTileUrl(getTileArray, layer, format, isKvp) {
        let url;
        if (isKvp) {
            getTileArray.forEach(data => {
                if (data.Constraint[0].AllowedValues.Value[0].toUpperCase() === 'KVP') {
                    url = data.href;
                }
            })
        } else {
            const reuslt = layer.ResourceURL.filter(resource => {
                return resource.format === format;
            })
            url = reuslt[0].template;
        }
        return url;
    }

    /**
     * @private
     * @function WebMap.prototype.createWMTSSource
     * @description čŽ·ĺŹ–WMTSç±»ĺž‹ĺ›ľĺ±‚çš„sourceă€‚
     * @param {Object} layerInfo - ĺ›ľĺ±‚äżˇć?Żă€‚
     * @returns {ol.source.WMTS} wmtsçš„souce
     */
    createWMTSSource(layerInfo) {
        let extent = layerInfo.extent || olProj.get(layerInfo.projection).getExtent();

        // ĺŤ•ä˝Ťé€ščż‡ĺť?ć ‡çł»čŽ·ĺŹ– ďĽ?PS: ä»Ąĺ‰Ťä»Łç ?éťž4326 é?˝é»?č®¤ć?Żç±łďĽ‰
        let unit = olProj.get(this.baseProjection).getUnits();

        return new WMTS({
            url: layerInfo.tileUrl || layerInfo.url,
            layer: layerInfo.layer,
            format: layerInfo.layerFormat,
            style: layerInfo.style,
            matrixSet: layerInfo.tileMatrixSet,
            requestEncoding: layerInfo.requestEncoding || 'KVP',
            tileGrid: this.getWMTSTileGrid(extent, layerInfo.scales, unit, layerInfo.dpi, layerInfo.origin, layerInfo.matrixIds),
            tileLoadFunction: function (imageTile, src) {
                if (src.indexOf('tianditu.gov.cn') >= 0) {
                    imageTile.getImage().src = `${src}&tk=${CommonUtil.getParameters(layerInfo.url)['tk']}`;
                    return;
                }
                imageTile.getImage().src = src
            }
        })
    }

    /**
     * @private
     * @function WebMap.prototype.getWMTSTileGrid
     * @description čŽ·ĺŹ–wmtsçš„ç“¦ç‰‡ă€‚
     * @param {Object} extent - ĺ›ľĺ±‚čŚ?ĺ›´ă€‚
     * @param {number} scales - ĺ›ľĺ±‚ćŻ”äľ‹ĺ°ş
     * @param {string} unit - ĺŤ•ä˝Ť
     * @param {number} dpi - dpi
     * @param {Array} origin ç“¦ç‰‡çš„ĺŽźç‚ą
     * @returns {ol.tilegrid.WMTS} wmtsçš„ç“¦ç‰‡
     */
    getWMTSTileGrid(extent, scales, unit, dpi, origin, matrixIds) {
        let resolutionsInfo = this.getReslutionsFromScales(scales, dpi || dpiConfig.iServerWMTS, unit);
        return new WMTSTileGrid({
            origin,
            extent: extent,
            resolutions: resolutionsInfo.res,
            matrixIds: matrixIds || resolutionsInfo.matrixIds
        });
    }

    /**
     * @private
     * @function WebMap.prototype.getReslutionsFromScales
     * @description ć ąćŤ®ćŻ”äľ‹ĺ°şďĽ?ćŻ”äľ‹ĺ°şĺ?†ćŻŤďĽ‰ă€?ĺś°ĺ›ľĺŤ•ä˝Ťă€?dpiă€?čŽ·ĺŹ–ä¸€ä¸Şĺ?†čľ¨çŽ‡ć•°ç»„
     * @param {Array.<number>} scales - ćŻ”äľ‹ĺ°şďĽ?ćŻ”äľ‹ĺ°şĺ?†ćŻŤďĽ‰
     * @param {number} dpi - ĺś°ĺ›ľdpi
     * @param {string} unit - ĺŤ•ä˝Ť
     * @param {number} datumAxis
     * @returns {{res: Array, matrixIds: Array}}
     */
    getReslutionsFromScales(scales, dpi, unit, datumAxis) {
        unit = (unit && unit.toLowerCase()) || 'degrees';
        dpi = dpi || dpiConfig.iServerWMTS;
        datumAxis = datumAxis || 6378137;
        let res = [],
            matrixIds = [];
        //ç»™ä¸Şé»?č®¤çš„
        if (Util.isArray(scales)) {
            scales && scales.forEach(function (scale, idx) {
                if (scale > 1.0) {
                    matrixIds.push(idx);
                    res.push(this.getResolutionFromScale(scale, dpi, unit, datumAxis));
                }
            }, this);
        } else {
            let tileMatrixSet = scales['TileMatrix'];
            tileMatrixSet && tileMatrixSet.forEach(function (tileMatrix) {
                matrixIds.push(tileMatrix['Identifier']);
                res.push(this.getResolutionFromScale(tileMatrix['ScaleDenominator'], dpi, unit, datumAxis));
            }, this);
        }
        return {
            res: res,
            matrixIds: matrixIds
        };
    }

    /**
     * @private
     * @function WebMap.prototype.getResolutionFromScale
     * @description čŽ·ĺŹ–ä¸€ä¸ŞWMTS sourceéś€č¦?çš„tileGrid
     * @param {number} scale - ćŻ”äľ‹ĺ°şďĽ?ćŻ”äľ‹ĺ°şĺ?†ćŻŤďĽ‰
     * @param {number} dpi - ĺś°ĺ›ľdpi
     * @param {string} unit - ĺŤ•ä˝Ť
     * @param {number} datumAxis
     * @returns {{res: Array, matrixIds: Array}}
     */
    getResolutionFromScale(scale, dpi = dpiConfig.default, unit, datumAxis) {
        //radio = 10000;
        let res;
        scale = +scale;
        scale = (scale > 1.0) ? (1.0 / scale) : scale;
        if (unit === 'degrees' || unit === 'dd' || unit === 'degree') {
            res = 0.0254 * 10000 / dpi / scale / ((Math.PI * 2 * datumAxis) / 360) / 10000;
        } else {
            res = 0.0254 * 10000 / dpi / scale / 10000;
        }
        return res;

    }

    /**
     * @private
     * @function WebMap.prototype.isValidResponse
     * @description čż”ĺ›žäżˇć?Żć?Żĺ?¦ç¬¦ĺ??ĺŻąĺş”ç±»ĺž‹çš„ć ‡ĺ‡†
     * @param {Object} response - čż”ĺ›žçš„äżˇć?Ż
     * @returns {boolean}
     */
    isValidResponse(response) {
        let responseEnum = ['Contents', 'OperationsMetadata'],
            valid = true;
        for (let i = 0; i < responseEnum.length; i++) {
            if (!response[responseEnum[i]] || response.error) {
                valid = false;
                break;
            }
        }
        return valid;
    }

    /**
     * @private
     * @function WebMap.prototype.addLayers
     * @description ć·»ĺŠ ĺŹ ĺŠ ĺ›ľĺ±‚
     * @param {Object} mapInfo - ĺś°ĺ›ľäżˇć?Ż
     */
    async addLayers(mapInfo) {
        let layers = mapInfo.layers,
            that = this;
        let features = [],
            len = layers.length;
        if (len > 0) {
            //ĺ­?ĺ‚¨ĺś°ĺ›ľä¸Šć‰€ćś‰çš„ĺ›ľĺ±‚ĺŻąč±ˇ
            this.layers = layers;
            for (let index = 0; index< layers.length; index++) {
              const layer = layers[index];
              //ĺŠ ä¸Šĺş•ĺ›ľçš„index
              let layerIndex = index + 1,
                  dataSource = layer.dataSource,
                  isSampleData = dataSource && dataSource.type === "SAMPLE_DATA" && !!dataSource.name; //SAMPLE_DATAć?Żćś¬ĺś°ç¤şäľ‹ć•°ćŤ®
              if (layer.layerType === "MAPBOXSTYLE") {
                  that.addMVTMapLayer(mapInfo, layer, layerIndex).then(() => {
                      that.layerAdded++;
                      that.sendMapToUser(len);
                  }).catch(function (error) {
                      that.layerAdded++;
                      that.sendMapToUser(len);
                      that.errorCallback && that.errorCallback(error, 'getLayerFaild', that.map);
                  });
              } else if ((dataSource && dataSource.serverId) || layer.layerType === "MARKER" || layer.layerType === 'HOSTED_TILE' || isSampleData) {
                  //ć•°ćŤ®ĺ­?ĺ‚¨ĺ?°iportalä¸Šäş†
                  let dataSource = layer.dataSource,
                      serverId = dataSource ? dataSource.serverId : layer.serverId;
                  if (!serverId && !isSampleData) {
                      await that.addLayer(layer, null, layerIndex);
                      that.layerAdded++;
                      that.sendMapToUser(len);
                      return;
                  }
                  if ((layer.layerType === "MARKER") || (dataSource && (!dataSource.accessType || dataSource.accessType === 'DIRECT')) || isSampleData) {
                      //ĺŽźćťĄäşŚčż›ĺ?¶ć–‡ä»¶
                      let url = isSampleData ? `${that.server}apps/dataviz/libs/sample-datas/${dataSource.name}.json` : `${that.server}web/datas/${serverId}/content.json?pageSize=9999999&currentPage=1`;
                      url = that.getRequestUrl(url);
                      FetchRequest.get(url, null, {
                          withCredentials: this.withCredentials
                      }).then(function (response) {
                          return response.json()
                      }).then(async function (data) {
                          if (data.succeed === false) {
                              //čŻ·ć±‚ĺ¤±č´Ą
                              that.layerAdded++;
                              that.sendMapToUser(len);
                              that.errorCallback && that.errorCallback(data.error, 'getLayerFaild', that.map);
                              return;
                          }
                          if (data && data.type) {
                              if (data.type === "JSON" || data.type === "GEOJSON") {
                                  data.content = data.content.type ? data.content : JSON.parse(data.content);
                                  features = that.geojsonToFeature(data.content, layer);
                              } else if (data.type === 'EXCEL' || data.type === 'CSV') {
                                  if (layer.dataSource && layer.dataSource.administrativeInfo) {
                                      //čˇŚć”żč§„ĺ?’äżˇć?Ż
                                      data.content.rows.unshift(data.content.colTitles);
                                      let {divisionType, divisionField} = layer.dataSource.administrativeInfo;
                                      let geojson = that.excelData2FeatureByDivision(data.content, divisionType, divisionField);
                                      features = that._parseGeoJsonData2Feature({allDatas: {features: geojson.features}, fileCode: layer.projection});
                                  } else {
                                      features = await that.excelData2Feature(data.content, layer);
                                  }
                              } else if (data.type === 'SHP') {
                                  let content = JSON.parse(data.content);
                                  data.content = content.layers[0];
                                  features = that.geojsonToFeature(data.content, layer);
                              }
                              await that.addLayer(layer, features, layerIndex);
                              that.layerAdded++;
                              that.sendMapToUser(len);
                          }
                      }).catch(function (error) {
                          that.layerAdded++;
                          that.sendMapToUser(len);
                          that.errorCallback && that.errorCallback(error, 'getLayerFaild', that.map);
                      })
                  } else {
                      //ĺ…łçł»ĺž‹ć–‡ä»¶
                      let isMapService = layer.layerType === 'HOSTED_TILE',
                          serverId = dataSource ? dataSource.serverId : layer.serverId;
                      that.checkUploadToRelationship(serverId).then(function (result) {
                          if (result && result.length > 0) {
                              let datasetName = result[0].name,
                                  featureType = result[0].type.toUpperCase();
                              that.getDataService(serverId, datasetName).then(async function (data) {
                                  let dataItemServices = data.dataItemServices;
                                  if (dataItemServices.length === 0) {
                                      that.layerAdded++;
                                      that.sendMapToUser(len);
                                      that.errorCallback && that.errorCallback(null, 'getLayerFaild', that.map);
                                      return;
                                  }
                                  if (isMapService) {
                                      //éś€č¦?ĺ?¤ć–­ć?Żä˝żç”¨tilečż?ć?ŻmvtćśŤĺŠˇ
                                      let dataService = that.getService(dataItemServices, 'RESTDATA');
                                      that.isMvt(dataService.address, datasetName).then(async info => {
                                          await that.getServiceInfoFromLayer(layerIndex, len, layer, dataItemServices, datasetName, featureType, info);
                                      }).catch(async () => {
                                          //ĺ?¤ć–­ĺ¤±č´Ąĺ°±čµ°äą‹ĺ‰Ťé€»čľ‘ďĽŚ>ć•°ćŤ®é‡Źç”¨tile
                                          await that.getServiceInfoFromLayer(layerIndex, len, layer, dataItemServices, datasetName, featureType);
                                      })
                                  } else {
                                      await that.getServiceInfoFromLayer(layerIndex, len, layer, dataItemServices, datasetName, featureType);
                                  }
                              });
                          } else {
                              that.layerAdded++;
                              that.sendMapToUser(len);
                              that.errorCallback && that.errorCallback(null, 'getLayerFaild', that.map);
                          }
                      }).catch(function (error) {
                          that.layerAdded++;
                          that.sendMapToUser(len);
                          that.errorCallback && that.errorCallback(error, 'getLayerFaild', that.map);
                      })
                  }
              } else if (dataSource && dataSource.type === "USER_DATA") {
                  that.addGeojsonFromUrl(layer, len, layerIndex, false);
              } else if (layer.layerType === "TILE"){
                  that.getTileLayerExtent(layer, function (layerInfo) {
                      that.map.addLayer(that.createBaseLayer(layerInfo, layerIndex));
                      that.layerAdded++;
                      that.sendMapToUser(len);
                  }, function (e) {
                      that.layerAdded++;
                      that.sendMapToUser(len);
                      that.errorCallback && that.errorCallback(e, 'getLayerFaild', that.map);
                  })
              } else if (layer.layerType === 'SUPERMAP_REST' ||
                  layer.layerType === "WMS" ||
                  layer.layerType === "WMTS") {
                  if (layer.layerType === "WMTS") {
                      that.getWmtsInfo(layer, function (layerInfo) {
                          that.map.addLayer(that.createBaseLayer(layerInfo, layerIndex));
                          that.layerAdded++;
                          that.sendMapToUser(len);
                      })
                  } else if(layer.layerType === "WMS") {
                      that.getWmsInfo(layer).then(() => {
                          that.map.addLayer(that.createBaseLayer(layer, layerIndex));
                          that.layerAdded++;
                          that.sendMapToUser(len);
                      })
                  } else {
                      layer.projection = that.baseProjection;
                      that.map.addLayer(that.createBaseLayer(layer, layerIndex));
                      that.layerAdded++;
                      that.sendMapToUser(len);
                  }
              } else if (dataSource && dataSource.type === "REST_DATA") {
                  //ä»ŽrestDatačŽ·ĺŹ–ć•°ćŤ®
                  that.getFeaturesFromRestData(layer, layerIndex, len);
              } else if (dataSource && dataSource.type === "REST_MAP" && dataSource.url) {
                  //ç¤şäľ‹ć•°ćŤ®
                  queryFeatureBySQL(dataSource.url, dataSource.layerName, 'smid=1', null, null, function (result) {
                      var recordsets = result && result.result.recordsets;
                      var recordset = recordsets && recordsets[0];
                      var attributes = recordset.fields;
                      if (recordset && attributes) {
                          let fileterAttrs = [];
                          for (var i in attributes) {
                              var value = attributes[i];
                              if (value.indexOf('Sm') !== 0 || value === "SmID") {
                                  fileterAttrs.push(value);
                              }
                          }
                          that.getFeatures(fileterAttrs, layer, async function (features) {
                              await that.addLayer(layer, features, layerIndex);
                              that.layerAdded++;
                              that.sendMapToUser(len);
                          }, function (e) {
                              that.layerAdded++;
                              that.errorCallback && that.errorCallback(e, 'getFeatureFaild', that.map);
                          });
                      }
                  }, function (e) {
                      that.errorCallback && that.errorCallback(e, 'getFeatureFaild', that.map);
                  })
              } else if (layer.layerType === "DATAFLOW_POINT_TRACK" || layer.layerType === "DATAFLOW_HEAT") {
                  that.getDataflowInfo(layer, async function () {
                      await that.addLayer(layer, features, layerIndex);
                      that.layerAdded++;
                      that.sendMapToUser(len);
                  }, function (e) {
                      that.layerAdded++;
                      that.errorCallback && that.errorCallback(e, 'getFeatureFaild', that.map);
                  })
              }
            }
        }
    }
    /**
     * @private
     * @function WebMap.prototype.addGeojsonFromUrl
     * @description ä»ŽwebćśŤĺŠˇčľ“ĺ…Ągeojsonĺś°ĺť€çš„ĺ›ľĺ±‚
     * @param {Object} layerInfo - ĺ›ľĺ±‚äżˇć?Ż
     * @param {number} len - ć€»çš„ĺ›ľĺ±‚ć•°é‡Ź
     * @param {number} layerIndex - ĺ˝“ĺ‰Ťĺ›ľĺ±‚index
     * @param {boolean} withCredentials - ć?Żĺ?¦ć?şĺ¸¦cookie
     */
    addGeojsonFromUrl(layerInfo, len, layerIndex, withCredentials = this.withCredentials) {
        // é€ščż‡webć·»ĺŠ geojsonä¸Ťéś€č¦?ć?şĺ¸¦cookie
        let {dataSource} = layerInfo, {url} = dataSource, that = this;
        FetchRequest.get(url, null, {
            withCredentials,
            withoutFormatSuffix: true
        }).then(function (response) {
            return response.json()
        }).then(async function (data) {
            if (!data || data.succeed === false) {
                //čŻ·ć±‚ĺ¤±č´Ą
                if (len) {
                    that.errorCallback && that.errorCallback(data.error, 'autoUpdateFaild', that.map)
                } else {
                    that.layerAdded++;
                    that.sendMapToUser(len);
                    that.errorCallback && that.errorCallback(data.error, 'getLayerFaild', that.map);
                }
                return;
            }
            var features;
            if (data.type === 'CSV' || data.type === 'EXCEL') {
                if (layerInfo.dataSource && layerInfo.dataSource.administrativeInfo) {
                    //čˇŚć”żč§„ĺ?’äżˇć?Ż
                    data.content.rows.unshift(data.content.colTitles);
                    let {divisionType, divisionField} = layerInfo.dataSource.administrativeInfo;
                    let geojson = that.excelData2FeatureByDivision(data.content, divisionType, divisionField);
                    features = that._parseGeoJsonData2Feature({allDatas: {features: geojson.features}, fileCode: layerInfo.projection});
                } else {
                    features = await that.excelData2Feature(data.content, layerInfo);
                }
            } else {
                var geoJson = data.content ? JSON.parse(data.content) : data;
                features = that.geojsonToFeature(geoJson, layerInfo);
            }
            if (len) {
                //ä¸Šĺ›ľ
                await that.addLayer(layerInfo, features, layerIndex);
                that.layerAdded++;
                that.sendMapToUser(len);
            } else {
                //č‡ŞĺŠ¨ć›´ć–°
                that.map.removeLayer(layerInfo.layer);
                layerInfo.labelLayer && that.map.removeLayer(layerInfo.labelLayer);
                await that.addLayer(layerInfo, features, layerIndex);
            }
        }).catch(function (error) {
            that.layerAdded++;
            that.sendMapToUser(len);
            that.errorCallback && that.errorCallback(error, 'getLayerFaild', that.map);
        })
    }
    /**
     * @private
     * @function WebMap.prototype.getServiceInfoFromLayer
     * @description ĺ?¤ć–­ä˝żç”¨ĺ“Şç§ŤćśŤĺŠˇä¸Šĺ›ľ
     * @param {number} layerIndex - ĺ›ľĺ±‚ĺŻąĺş”çš„index
     * @param {number} len - ć??ĺŠźć·»ĺŠ çš„ĺ›ľĺ±‚ä¸Şć•°
     * @param {Object} layer - ĺ›ľĺ±‚äżˇć?Ż
     * @param {Array.<Object>} dataItemServices - ć•°ćŤ®ĺŹ‘ĺ¸?çš„ćśŤĺŠˇ
     * @param {string} datasetName - ć•°ćŤ®ćśŤĺŠˇçš„ć•°ćŤ®é›†ĺ?Ťç§°
     * @param {string} featureType - featureç±»ĺž‹
     * @param {Object} info - ć•°ćŤ®ćśŤĺŠˇçš„äżˇć?Ż
     */
    async getServiceInfoFromLayer(layerIndex, len, layer, dataItemServices, datasetName, featureType, info) {
        let that = this;
        let isMapService = info ? !info.isMvt : layer.layerType === 'HOSTED_TILE',
            isAdded = false;
        for (let i = 0; i < dataItemServices.length; i++) {
          const service = dataItemServices[i];
          if (isAdded) {
              return;
          }
          //ćś‰ćśŤĺŠˇäş†ďĽŚĺ°±ä¸Ťéś€č¦?ĺľŞçŽŻ
          if (service && isMapService && service.serviceType === 'RESTMAP') {
              isAdded = true;
              //ĺś°ĺ›ľćśŤĺŠˇ,ĺ?¤ć–­ä˝żç”¨mvtčż?ć?Żtile
              that.getTileLayerInfo(service.address).then(function (restMaps) {
                  restMaps.forEach(function (restMapInfo) {
                      let bounds = restMapInfo.bounds;
                      layer.layerType = 'TILE';
                      layer.orginEpsgCode = that.baseProjection;
                      layer.units = restMapInfo.coordUnit && restMapInfo.coordUnit.toLowerCase();
                      layer.extent = [bounds.left, bounds.bottom, bounds.right, bounds.top];
                      layer.visibleScales = restMapInfo.visibleScales;
                      layer.url = restMapInfo.url;
                      layer.sourceType = 'TILE';
                      that.map.addLayer(that.createBaseLayer(layer, layerIndex));
                      that.layerAdded++;
                      that.sendMapToUser(len);
                  })
              })
          } else if (service && !isMapService && service.serviceType === 'RESTDATA') {
              isAdded = true;
              if (info && info.isMvt) {
                  let bounds = info.bounds;
                  layer = Object.assign(layer, {
                      layerType: "VECTOR_TILE",
                      epsgCode: info.epsgCode,
                      projection: `EPSG:${info.epsgCode}`,
                      bounds: bounds,
                      extent: [bounds.left, bounds.bottom, bounds.right, bounds.top],
                      name: layer.name,
                      url: info.url,
                      visible: layer.visible,
                      featureType: featureType,
                      serverId: layer.serverId.toString()
                  });
                  that.map.addLayer(await that.addVectorTileLayer(layer, layerIndex, 'RESTDATA'));
                  that.layerAdded++;
                  that.sendMapToUser(len);

              } else {
                  //ć•°ćŤ®ćśŤĺŠˇ
                  isAdded = true;
                  //ĺ…łçł»ĺž‹ć–‡ä»¶ĺŹ‘ĺ¸?çš„ć•°ćŤ®ćśŤĺŠˇ
                  that.getDatasources(service.address).then(function (datasourceName) {
                      layer.dataSource.dataSourceName = datasourceName + ":" + datasetName;
                      layer.dataSource.url = `${service.address}/data`;
                      that.getFeaturesFromRestData(layer, layerIndex, len);
                  });
              }
          }
        }
        if (!isAdded) {
            //ĺľŞçŽŻĺ®Ść??äş†ďĽŚäąźć˛ˇćś‰ć‰ľĺ?°ĺ??é€‚çš„ćśŤĺŠˇă€‚ćś‰ĺŹŻč?˝ćśŤĺŠˇč˘«ĺ? é™¤
            that.layerAdded++;
            that.sendMapToUser(len);
            that.errorCallback && that.errorCallback(null, 'getLayerFaild', that.map);
        }
    }

    /**
     * @private
     * @function WebMap.prototype.getDataflowInfo
     * @description čŽ·ĺŹ–ć•°ćŤ®ćµ?ćśŤĺŠˇçš„ĺŹ‚ć•°
     * @param {Object} layerInfo - ĺ›ľĺ±‚äżˇć?Ż
     * @param {function} success - ć??ĺŠźĺ›žč°?ĺ‡˝ć•°
     * @param {function} faild - ĺ¤±č´Ąĺ›žč°?ĺ‡˝ć•°
     */
    getDataflowInfo(layerInfo, success, faild) {
        let that = this;
        let url = layerInfo.url, token;
        let requestUrl = that.getRequestUrl(`${url}.json`, false);
        if (layerInfo.credential && layerInfo.credential.token) {
            token = layerInfo.credential.token;
            requestUrl += `?token=${token}`;
        }
        FetchRequest.get(requestUrl, null, {
            withCredentials: this.withCredentials
        }).then(function (response) {
            return response.json()
        }).then(function (result) {
            layerInfo.featureType = "POINT";
            if (result && result.featureMetaData) {
                layerInfo.featureType = result.featureMetaData.featureType.toUpperCase();
            }
            layerInfo.wsUrl = result.urls[0].url;
            success();
        }).catch(function () {
            faild();
        });
    }

    /**
     * @private
     * @function WebMap.prototype.getFeaturesFromRestData
     * @description ä»Žć•°ćŤ®ćśŤĺŠˇä¸­čŽ·ĺŹ–feature
     * @param {Object} layer - ĺ›ľĺ±‚äżˇć?Ż
     * @param {number} layerIndex - ĺ›ľĺ±‚index
     * @param {number} layerLength - ĺ›ľĺ±‚ć•°é‡Ź
     */
    getFeaturesFromRestData(layer, layerIndex, layerLength) {
        let that = this, dataSource = layer.dataSource,
            url = layer.dataSource.url,
            dataSourceName = dataSource.dataSourceName || layer.name;
        let requestUrl = that.formatUrlWithCredential(url), serviceOptions = {};
        serviceOptions.withCredentials = this.withCredentials;
        if (!this.excludePortalProxyUrl && !CommonUtil.isInTheSameDomain(requestUrl)) {
            serviceOptions.proxy = this.getProxy();
        }
        if(['EPSG:0'].includes(layer.projection)) {
            // ä¸Ťć”ŻćŚ?ĺŠ¨ć€?ćŠ•ĺ˝±restDataćśŤĺŠˇ
            that.layerAdded++;
            that.sendMapToUser(layerLength);
            that.errorCallback && that.errorCallback({}, 'getFeatureFaild', that.map);
            return;
        }
        //ĺ› ä¸şitestä¸Šä˝żç”¨çš„httpsďĽŚiserverć?ŻhttpďĽŚć‰€ä»Ąč¦?ĺŠ ä¸Šä»Łç?†
        getFeatureBySQL(requestUrl, [dataSourceName], serviceOptions, async function (result) {
            let features = that.parseGeoJsonData2Feature({
                allDatas: {
                    features: result.result.features.features
                },
                fileCode: that.baseProjection, //ĺ› ä¸şčŽ·ĺŹ–restDataç”¨äş†ĺŠ¨ć€?ćŠ•ĺ˝±ďĽŚä¸Ťéś€č¦?ĺ†Ťčż›čˇŚĺť?ć ‡č˝¬ćŤ˘ă€‚ć‰€ä»Ąć­¤ĺ¤„filecodeĺ’Śĺş•ĺ›ľĺť?ć ‡çł»ä¸€č‡´
                featureProjection: that.baseProjection
            });
            await that.addLayer(layer, features, layerIndex);
            that.layerAdded++;
            that.sendMapToUser(layerLength);
        }, function (err) {
            that.layerAdded++;
            that.sendMapToUser(layerLength);
            that.errorCallback && that.errorCallback(err, 'getFeatureFaild', that.map)
        }, that.baseProjection.split("EPSG:")[1]);
    }

    /**
     * @private
     * @function WebMap.prototype.getFeatures
     * @description ä»Žĺś°ĺ›ľä¸­čŽ·ĺŹ–feature
     * @param {Object} fields - ĺ›ľĺ±‚äżˇć?Ż
     * @param {number} layerInfo - ĺ›ľĺ±‚index
     * @param {number} success - ć??ĺŠźĺ›žč°?
     * @param {number} faild - ĺ¤±č´Ąĺ›žč°?
     */
    getFeatures(fields, layerInfo, success, faild) {
        var that = this;
        var source = layerInfo.dataSource;
        var fileCode = layerInfo.projection;
        queryFeatureBySQL(source.url, source.layerName, null, fields, null, function (result) {
            var recordsets = result.result.recordsets[0];
            var features = recordsets.features.features;

            var featuresObj = that.parseGeoJsonData2Feature({
                allDatas: {
                    features
                },
                fileCode: fileCode,
                featureProjection: that.baseProjection
            }, 'JSON');
            success(featuresObj);
        }, function (err) {
            faild(err);
        });
    }

    /**
     * @private
     * @function WebMap.prototype.sendMapToUser
     * @description ĺ°†ć‰€ćś‰ĺŹ ĺŠ ĺ›ľĺ±‚ĺŹ ĺŠ ĺ?ŽďĽŚčż”ĺ›žćś€ç»?çš„mapĺŻąč±ˇç»™ç”¨ć?·ďĽŚäľ›ä»–ä»¬ć“Ťä˝śä˝żç”¨
     * @param {number} layersLen - ĺŹ ĺŠ ĺ›ľĺ±‚ć€»ć•°
     */
    sendMapToUser(layersLen) {
        const lens = this.isHaveGraticule ? layersLen + 1 : layersLen;
        if (this.layerAdded === lens && this.successCallback) {
            this.successCallback(this.map, this.mapParams, this.layers, this.baseLayer);
        }
    }

    /**
     * @private
     * @function WebMap.prototype.excelData2Feature
     * @description ĺ°†csvĺ’Śxlsć–‡ä»¶ĺ†…ĺ®ąč˝¬ćŤ˘ć??ol.feature
     * @param {Object} content - ć–‡ä»¶ĺ†…ĺ®ą
     * @param {Object} layerInfo - ĺ›ľĺ±‚äżˇć?Ż
     * @returns {Array}  ol.featureçš„ć•°ç»„é›†ĺ??
     */
    async excelData2Feature(content, layerInfo) {
        let rows = content.rows,
            colTitles = content.colTitles;
        // č§Łĺ†łV2ć?˘ĺ¤Ťçš„ć•°ćŤ®ä¸­ĺ?«ćś‰ç©şć Ľ
        for (let i in colTitles) {
            if (Util.isString(colTitles[i])) {
                colTitles[i] = Util.trim(colTitles[i]);
            }
        }
        let fileCode = layerInfo.projection,
            dataSource = layerInfo.dataSource,
            baseLayerEpsgCode = this.baseProjection,
            features = [],
            xField = Util.trim((layerInfo.xyField && layerInfo.xyField.xField) || (layerInfo.from && layerInfo.from.xField)),
            yField = Util.trim((layerInfo.xyField && layerInfo.xyField.yField) || (layerInfo.from && layerInfo.from.yField)),
            xIdx = colTitles.indexOf(xField),
            yIdx = colTitles.indexOf(yField);

        // todo äĽ?ĺŚ– ćš‚ć—¶čż™ć ·ĺ¤„ç?†
        if (layerInfo.layerType === 'MIGRATION') {
            try {
                if (dataSource.type === 'PORTAL_DATA') {
                    const {dataMetaInfo} = await FetchRequest.get(`${this.server}web/datas/${dataSource.serverId}.json`, null, {
                        withCredentials: this.withCredentials
                    }).then(res => res.json());
                    // eslint-disable-next-line require-atomic-updates
                    layerInfo.xyField = {
                        xField: dataMetaInfo.xField,
                        yField: dataMetaInfo.yField
                    }
                    if (!dataMetaInfo.xIndex) {
                        xIdx = colTitles.indexOf(dataMetaInfo.xField);
                        yIdx = colTitles.indexOf(dataMetaInfo.yField);
                    } else {
                        xIdx = dataMetaInfo.xIndex;
                        yIdx = dataMetaInfo.yIndex;
                    }
                } else if (dataSource.type === 'SAMPLE_DATA') {
                    // ç¤şäľ‹ć•°ćŤ®ä»Žćś¬ĺś°ć‹żxyField
                    const sampleData = SampleDataInfo.find(item => item.id === dataSource.name) || {};
                    xField = sampleData.xField;
                    yField = sampleData.yField
                    layerInfo.xyField = {
                        xField,
                        yField
                    }
                    xIdx = colTitles.findIndex(item => item === xField);
                    yIdx = colTitles.findIndex(item => item === yField);
                }
            } catch (error) {
                console.error(error);
            }
        }

        for (let i = 0, len = rows.length; i < len; i++) {
            let rowDatas = rows[i],
                attributes = {},
                geomX = rows[i][xIdx],
                geomY = rows[i][yIdx];
            // ä˝Ťç˝®ĺ­—ć®µäżˇć?Żä¸Ťĺ­?ĺś¨ čż‡ć»¤ć•°ćŤ®
            if (geomX !== '' && geomY !== '') {
                let olGeom = new olGeometry.Point([+geomX, +geomY]);
                if (fileCode !== baseLayerEpsgCode) {
                    olGeom.transform(fileCode, baseLayerEpsgCode);
                }
                for (let j = 0, leng = rowDatas.length; j < leng; j++) {
                    let field = colTitles[j];
                    if (field === undefined || field === null) {continue;}
                    field = field.trim();
                    if (Object.keys(attributes).indexOf(field) > -1) {
                        //čŻ´ć?Žĺ‰Ťéť˘ćś‰ä¸Şä¸€ć¨ˇä¸€ć ·çš„ĺ­—ć®µ
                        const newField = field + '_1';
                        attributes[newField] = rowDatas[j];
                    } else {
                        attributes[field] = rowDatas[j];
                    }

                }
                let feature = new Feature({
                    geometry: olGeom,
                    attributes
                });
                features.push(feature);
            }
        }
        return Promise.resolve(features);
    }
    /**
     * @private
     * @function WebMap.prototype.excelData2FeatureByDivision
     * @description čˇŚć”żĺŚşĺ?’ć•°ćŤ®ĺ¤„ç?†
     * @param {Object} content - ć–‡ä»¶ĺ†…ĺ®ą
     * @param {Object} layerInfo - ĺ›ľĺ±‚äżˇć?Ż
     * @returns {Object}  geojsonĺŻąč±ˇ
     */
    excelData2FeatureByDivision(content, divisionType, divisionField) {
        let me = this;
        let asyncInport;
        if (divisionType === 'Province') {
            asyncInport = window.ProvinceData;
        } else if (divisionType === 'City') {
            asyncInport = window.MunicipalData;
        } else if (divisionType === 'GB-T_2260') {
            // let geojso;
            asyncInport = window.AdministrativeArea;
        }
        if (asyncInport) {
            let geojson = me.changeExcel2Geojson(asyncInport.features, content.rows, divisionType, divisionField);
            return geojson;
        }
    }

    /**
     * @private
     * @function WebMap.prototype._parseGeoJsonData2Feature
     * @description ĺ°†geojsonçš„ć•°ćŤ®č˝¬ćŤ˘ć??ol.Feature
     * @param {Object} metaData - ć–‡ä»¶ĺ†…ĺ®ą
     * @returns {Array.<ol.Feature>} features
     */
    _parseGeoJsonData2Feature(metaData) {
        let allFeatures = metaData.allDatas.features,
            features = [];
        for (let i = 0, len = allFeatures.length; i < len; i++) {
            //ä¸Ťĺ? é™¤propertiesč˝¬ćŤ˘ĺ?ŽďĽŚĺ±žć€§ĺ…¨é?˝ĺś¨featureä¸Š
            let properties = Object.assign({}, allFeatures[i].properties);
            delete allFeatures[i].properties;
            let feature = transformTools.readFeature(allFeatures[i], {
                dataProjection: metaData.fileCode,
                featureProjection: this.baseProjection || 'ESPG:4326'
            });
            feature.setProperties({attributes: properties});
            features.push(feature);
        }
        return features;
    }
    /**
     * @private
     * @function WebMap.prototype.changeExcel2Geojson
     * @description ĺ°†excelĺ’Ścsvć•°ćŤ®č˝¬ćŤ˘ć??ć ‡ĺ‡†geojsonć•°ćŤ®
     * @param {Array} features - featureĺŻąč±ˇ
     * @param {Array} datas - ć•°ćŤ®ĺ†…ĺ®ą
     * @param {string} divisionType - čˇŚć”żĺŚşĺ?’ç±»ĺž‹
     * @param {string} divisionField - čˇŚć”żĺŚşĺ?’ĺ­—ć®µ
     * @returns {Object} geojsonĺŻąč±ˇ
     */
    changeExcel2Geojson(features, datas, divisionType, divisionField) {
        let geojson = {
            type: 'FeatureCollection',
            features: []
        };
        if (datas.length < 2) {
            return geojson; //ĺŹŞćś‰ä¸€čˇŚć•°ćŤ®ć—¶ä¸şć ‡é˘?
        }
        let titles = datas[0],
            rows = datas.slice(1),
            fieldIndex = titles.findIndex(title => title === divisionField);
        rows.forEach(row => {
            let feature;
            if (divisionType === 'GB-T_2260') {
                feature = features.find(item => item.properties.GB === row[fieldIndex])
            } else {
                feature = Util.getHighestMatchAdministration(features, row[fieldIndex]);
            }
            //todo éś€ćŹ?ç¤şĺż˝ç•Ąć— ć•?ć•°ćŤ®
            if (feature) {
                let newFeature = window.cloneDeep(feature);
                newFeature.properties = {};
                row.forEach((item, idx) => {
                    //ç©şć Ľé—®é˘?ďĽŚçś‹č§?DVĺ¤šĺ¤„ĺ¤„ç?†ç©şć Ľé—®é˘?ďĽŚTODOç»źä¸€ć•´ç?†
                    let key = titles[idx].trim();
                    newFeature.properties[key] = item;
                });
                geojson.features.push(newFeature);
            }
        });
        return geojson;
    }

    /**
     * @private
     * @function WebMap.prototype.geojsonToFeature
     * @description geojson č˝¬ćŤ˘ä¸ş feature
     * @param {Object} layerInfo - ĺ›ľĺ±‚äżˇć?Ż
     * @returns {Array}  ol.featureçš„ć•°ç»„é›†ĺ??
     */
    geojsonToFeature(geojson, layerInfo) {
        let allFeatures = geojson.features,
            features = [];
        for (let i = 0, len = allFeatures.length; i < len; i++) {
            //č˝¬ćŤ˘ĺ‰Ťĺ? é™¤properties,čż™ć ·č˝¬ćŤ˘ĺ?Žĺ±žć€§ä¸ŤäĽšé‡Ťĺ¤Ťĺ­?ĺ‚¨
            let featureAttr = allFeatures[i].properties || {};
            delete allFeatures[i].properties;
            let feature = transformTools.readFeature(allFeatures[i], {
                dataProjection: layerInfo.projection || 'EPSG:4326',
                featureProjection: this.baseProjection || 'ESPG:4326'
            });
            //geojsonć ĽĺĽŹçš„featureĺ±žć€§ć˛ˇćś‰ĺť?ć ‡çł»ĺ­—ć®µďĽŚä¸şäş†ç»źä¸€ďĽŚĺ†Ťć¬ˇĺŠ ä¸Š
            let coordinate = feature.getGeometry().getCoordinates();
            if (allFeatures[i].geometry.type === 'Point') {
                // ć ‡ćł¨ĺ›ľĺ±‚ čż?ć˛ˇćś‰ĺ±žć€§ĺ€Ľć—¶ĺ€™ä¸ŤĺŠ 
                if (allFeatures[i].properties) {
                    allFeatures[i].properties.lon = coordinate[0];
                    allFeatures[i].properties.lat = coordinate[1];
                }
            }

            // ć ‡ćł¨ĺ›ľĺ±‚ç‰ąć®Šĺ¤„ç?†
            let isMarker = false;
            let attributes;
            let useStyle;
            if (allFeatures[i].dv_v5_markerInfo) {
                //ĺ› ä¸şäĽ?ĺŚ–ä»Łç ?äą‹ĺ‰ŤďĽŚĺ±žć€§ĺ­—ć®µé?˝ĺ­?ĺ‚¨ĺś¨propertiseä¸ŠďĽŚmarkerInfoć˛ˇćś‰
                attributes = Object.assign({}, allFeatures[i].dv_v5_markerInfo, featureAttr);
                if (attributes.lon) {
                    //ć ‡ćł¨ĺ›ľĺ±‚ä¸Ťéś€č¦?
                    delete attributes.lon;
                    delete attributes.lat;
                }
            }
            if (allFeatures[i].dv_v5_markerStyle) {
                useStyle = allFeatures[i].dv_v5_markerStyle;
                isMarker = true;
            }
            let properties;
            if (isMarker) {
                properties = Object.assign({}, {
                    attributes
                }, {
                    useStyle
                });
                //featureä¸Šć·»ĺŠ ĺ›ľĺ±‚çš„idďĽŚä¸şäş†ĺŻąĺş”ĺ›ľĺ±‚
                feature.layerId = layerInfo.timeId;
            } else if (layerInfo.featureStyles) {
                //V4 ç‰?ćś¬ć ‡ćł¨ĺ›ľĺ±‚ĺ¤„ç?†
                let style = JSON.parse(layerInfo.featureStyles[i].style);
                let attr = featureAttr;
                let imgUrl;
                if (attr._smiportal_imgLinkUrl.indexOf('http://') > -1 || attr._smiportal_imgLinkUrl.indexOf('https://') > -1) {
                    imgUrl = attr._smiportal_imgLinkUrl;
                } else if (attr._smiportal_imgLinkUrl !== undefined && attr._smiportal_imgLinkUrl !== null &&
                    attr._smiportal_imgLinkUrl !== '') {
                    //ä¸ŠäĽ çš„ĺ›ľç‰‡ďĽŚĺŠ ä¸Šĺ˝“ĺ‰Ťĺś°ĺť€
                    imgUrl = `${Util.getIPortalUrl()}resources/markerIcon/${attr._smiportal_imgLinkUrl}`
                }
                attributes = {
                    dataViz_description: attr._smiportal_description,
                    dataViz_imgUrl: imgUrl,
                    dataViz_title: attr._smiportal_title,
                    dataViz_url: attr._smiportal_otherLinkUrl
                };
                style.anchor = [0.5, 1];
                style.src = style.externalGraphic;

                useStyle = style;
                properties = Object.assign({}, {
                    attributes
                }, {
                    useStyle
                });
                delete attr._smiportal_description;
                delete attr._smiportal_imgLinkUrl;
                delete attr._smiportal_title;
                delete attr._smiportal_otherLinkUrl;
            } else {
                properties = {attributes: featureAttr};
            }

            feature.setProperties(properties);
            features.push(feature);
        }
        return features;
    }

    /**
     * @private
     * @function WebMap.prototype.parseGeoJsonData2Feature
     * @description ĺ°†ä»ŽrestDataĺś°ĺť€ä¸ŠčŽ·ĺŹ–çš„jsonč˝¬ćŤ˘ć??featureďĽ?ä»Žiserverä¸­čŽ·ĺŹ–çš„jsonč˝¬ćŤ˘ć??featureďĽ‰
     * @param {Object} metaData - jsonĺ†…ĺ®ą
     * @returns {Array}  ol.featureçš„ć•°ç»„é›†ĺ??
     */
    parseGeoJsonData2Feature(metaData) {
        let allFeatures = metaData.allDatas.features,
            features = [];
        for (let i = 0, len = allFeatures.length; i < len; i++) {
            let properties = allFeatures[i].properties;
            delete allFeatures[i].properties;
            let feature = transformTools.readFeature(allFeatures[i], {
                dataProjection: metaData.fileCode || 'EPSG:4326',
                featureProjection: metaData.featureProjection || this.baseProjection || 'EPSG:4326'
            });
            //geojsonć ĽĺĽŹçš„featureĺ±žć€§ć˛ˇćś‰ĺť?ć ‡çł»ĺ­—ć®µďĽŚä¸şäş†ç»źä¸€ďĽŚĺ†Ťć¬ˇĺŠ ä¸Š
            let geometry = feature.getGeometry();
            // ĺ¦‚ćžśä¸Ťĺ­?ĺś¨geometryďĽŚäąźä¸Ťéś€č¦?ç»„čŁ…feature
            if(!geometry) {continue;}
            let coordinate = geometry.getCoordinates();
            if (allFeatures[i].geometry.type === 'Point') {
                properties.lon = coordinate[0];
                properties.lat = coordinate[1];
            }
            feature.setProperties({
                attributes: properties
            });
            features.push(feature);
        }
        return features;
    }

    /**
     * @private
     * @function WebMap.prototype.addLayer
     * @description ĺ°†ĺŹ ĺŠ ĺ›ľĺ±‚ć·»ĺŠ ĺ?°ĺś°ĺ›ľä¸Š
     * @param {Object} layerInfo - ĺ›ľĺ±‚äżˇć?Ż
     * @param {Array} features - ĺ›ľĺ±‚ä¸Šçš„featureé›†ĺ??
     * @param {number} index ĺ›ľĺ±‚çš„éˇşĺşŹ
     */
    async addLayer(layerInfo, features, index) {
        let layer, that = this;
        if (layerInfo.layerType === "VECTOR") {
            if (layerInfo.featureType === "POINT") {
                if (layerInfo.style.type === 'SYMBOL_POINT') {
                    layer = this.createSymbolLayer(layerInfo, features);
                } else {
                    layer = await this.createGraphicLayer(layerInfo, features);
                }
            } else {
                //çşżĺ’Śéť˘
                layer = await this.createVectorLayer(layerInfo, features)
            }
        } else if (layerInfo.layerType === "UNIQUE") {
            layer = await this.createUniqueLayer(layerInfo, features);
        } else if (layerInfo.layerType === "RANGE") {
            layer = await this.createRangeLayer(layerInfo, features);
        } else if (layerInfo.layerType === "HEAT") {
            layer = this.createHeatLayer(layerInfo, features);
        } else if (layerInfo.layerType === "MARKER") {
            layer = await this.createMarkerLayer(features);
        } else if (layerInfo.layerType === "DATAFLOW_POINT_TRACK") {
            layer = await this.createDataflowLayer(layerInfo, index);
        } else if (layerInfo.layerType === "DATAFLOW_HEAT") {
            layer = this.createDataflowHeatLayer(layerInfo);
        } else if (layerInfo.layerType === "RANK_SYMBOL") {
            layer = await this.createRankSymbolLayer(layerInfo, features);
        } else if (layerInfo.layerType === "MIGRATION") {
            layer = this.createMigrationLayer(layerInfo, features);
        }
        let layerID = Util.newGuid(8);
        if (layer) {
            layerInfo.name && layer.setProperties({
                name: layerInfo.name,
                layerID: layerID,
                layerType: layerInfo.layerType
            });

            //ĺ?·ć–°ä¸‹ĺ›ľĺ±‚ďĽŚĺ?¦ĺ?™featureć ·ĺĽŹĺ‡şä¸ŤćťĄ
            if (layerInfo && layerInfo.style && layerInfo.style.imageInfo) {
                let img = new Image();
                img.src = layerInfo.style.imageInfo.url;
                img.onload = function () {
                    layer.getSource().changed();
                };
            }
            if (layerInfo.layerType === 'MIGRATION') {
                layer.appendTo(this.map);
                // ĺś¨čż™é‡Ść?˘ĺ¤Ťĺ›ľĺ±‚ĺŹŻč§?ć€§çŠ¶ć€?
                layer.setVisible(layerInfo.visible);
                // č®ľç˝®éĽ ć ‡ć ·ĺĽŹä¸şé»?č®¤
                layer.setCursor();
            } else {
                layerInfo.opacity != undefined && layer.setOpacity(layerInfo.opacity);
                layer.setVisible(layerInfo.visible);
                this.map.addLayer(layer);
            }
            layer.setZIndex(index);
            const {visibleScale, autoUpdateTime} = layerInfo;
            visibleScale && this.setVisibleScales(layer, visibleScale);
            if (autoUpdateTime && !layerInfo.autoUpdateInterval) {
                //č‡ŞĺŠ¨ć›´ć–°ć•°ćŤ®
                let dataSource = layerInfo.dataSource;
                if (dataSource.accessType === "DIRECT" && !dataSource.url) {
                    // äşŚčż›ĺ?¶ć•°ćŤ®ć›´ć–°feautreć‰€éś€çš„url
                    dataSource.url = `${this.server}web/datas/${dataSource.serverId}/content.json?pageSize=9999999&currentPage=1`
                }
                layerInfo.autoUpdateInterval = setInterval(() => {
                    that.updateFeaturesToMap(layerInfo, index, true);
                }, autoUpdateTime);
            }
        }
        layerInfo.layer = layer;
        layerInfo.layerID = layerID;
        if (layerInfo.labelStyle && layerInfo.labelStyle.labelField && layerInfo.layerType !== "DATAFLOW_POINT_TRACK") {
            //ĺ­?ĺś¨ć ‡ç­ľä¸“é˘?ĺ›ľ
            //čż‡ć»¤ćťˇä»¶čż‡ć»¤feature
            features = layerInfo.filterCondition ? this.getFiterFeatures(layerInfo.filterCondition, features) : features;
            this.addLabelLayer(layerInfo, features);
        }
    }
    /**
     * @private
     * @function WebMap.prototype.updateFeaturesToMap
     * @description ć›´ć–°ĺś°ĺ›ľä¸Šçš„feature,é€‚ç”¨äşŽä¸“é˘?ĺ›ľ
     * @param {Object} layerInfo - ĺ›ľĺ±‚äżˇć?Ż
     * @param {number} index ĺ›ľĺ±‚çš„éˇşĺşŹ
     */
    updateFeaturesToMap(layerInfo, layerIndex) {
        let that = this, dataSource = layerInfo.dataSource, url = layerInfo.dataSource.url,
            dataSourceName = dataSource.dataSourceName || layerInfo.name;

        if (dataSource.type === "USER_DATA" || dataSource.accessType === "DIRECT") {
            that.addGeojsonFromUrl(layerInfo, null, layerIndex)
        } else {
            let requestUrl = that.formatUrlWithCredential(url), serviceOptions = {};
            serviceOptions.withCredentials = this.withCredentials;
            if (!this.excludePortalProxyUrl && !CommonUtil.isInTheSameDomain(requestUrl)) {
                serviceOptions.proxy = this.getProxy();
            }
            //ĺ› ä¸şitestä¸Šä˝żç”¨çš„httpsďĽŚiserverć?ŻhttpďĽŚć‰€ä»Ąč¦?ĺŠ ä¸Šä»Łç?†
            getFeatureBySQL(requestUrl, [dataSourceName], serviceOptions, async function (result) {
                let features = that.parseGeoJsonData2Feature({
                    allDatas: {
                        features: result.result.features.features
                    },
                    fileCode: layerInfo.projection,
                    featureProjection: that.baseProjection
                });
                //ĺ? é™¤äą‹ĺ‰Ťçš„ĺ›ľĺ±‚ĺ’Ść ‡ç­ľĺ›ľĺ±‚
                that.map.removeLayer(layerInfo.layer);
                layerInfo.labelLayer && that.map.removeLayer(layerInfo.labelLayer);
                await that.addLayer(layerInfo, features, layerIndex);
            }, function (err) {
                that.errorCallback && that.errorCallback(err, 'autoUpdateFaild', that.map);
            });
        }
    }

    /**
     * @private
     * @function WebMap.prototype.addVectorTileLayer
     * @description ć·»ĺŠ vectorTILEĺ›ľĺ±‚
     * @param {Object} layerInfo - ĺ›ľĺ±‚äżˇć?Ż
     * @param {number} index ĺ›ľĺ±‚çš„éˇşĺşŹ
     * @param {string} type ĺ?›ĺ»şçš„ĺ›ľĺ±‚ç±»ĺž‹ďĽŚrestDataä¸şĺ?›ĺ»şć•°ćŤ®ćśŤĺŠˇçš„mvt, restMapä¸şĺ?›ĺ»şĺś°ĺ›ľćśŤĺŠˇçš„mvt
     * @returns {ol.layer.VectorTile}  ĺ›ľĺ±‚ĺŻąč±ˇ
     */
    async addVectorTileLayer(layerInfo, index, type) {
        let layer;
        if (type === 'RESTDATA') {
            //ç”¨çš„ć?ŻrestdataćśŤĺŠˇçš„mvt
            layer = await this.createDataVectorTileLayer(layerInfo)
        }
        let layerID = Util.newGuid(8);
        if (layer) {
            layerInfo.name && layer.setProperties({
                name: layerInfo.name,
                layerID: layerID
            });
            layerInfo.opacity != undefined && layer.setOpacity(layerInfo.opacity);
            layer.setVisible(layerInfo.visible);
            layer.setZIndex(index);
        }
        layerInfo.layer = layer;
        layerInfo.layerID = layerID;
        return layer;
    }
    /**
     * @private
     * @function WebMap.prototype.createDataVectorTileLayer
     * @description ĺ?›ĺ»şvectorTILEĺ›ľĺ±‚
     * @param {Object} layerInfo - ĺ›ľĺ±‚äżˇć?Ż
     * @returns {ol.layer.VectorTile} ĺ›ľĺ±‚ĺŻąč±ˇ
     */
    async createDataVectorTileLayer(layerInfo) {
        //ĺ?›ĺ»şĺ›ľĺ±‚
        var format = new MVT({
            featureClass: Feature
        });
        //č¦?ĺŠ ä¸Ščż™ä¸€ĺŹĄďĽŚĺ?¦ĺ?™ĺť?ć ‡ďĽŚé»?č®¤é?˝ć?Ż3857
        MVT.prototype.readProjection = function () {
            return new olProj.Projection({
                code: '',
                units: Units.TILE_PIXELS
            });
        };
        let featureType = layerInfo.featureType;
        let style = await StyleUtils.toOpenLayersStyle(this.getDataVectorTileStyle(featureType), featureType);
        return new olLayer.VectorTile({
            //č®ľç˝®é?żč®©ĺŹ‚ć•°
            source: new VectorTileSuperMapRest({
                url: layerInfo.url,
                projection: layerInfo.projection,
                tileType: "ScaleXY",
                format: format
            }),
            style: style
        });
    }
    /**
     * @private
     * @function WebMap.prototype.getDataVectorTileStyle
     * @description čŽ·ĺŹ–ć•°ćŤ®ćśŤĺŠˇçš„mvtä¸Šĺ›ľçš„é»?č®¤ć ·ĺĽŹ
     * @param {string} featureType - č¦?ç´ ç±»ĺž‹
     * @returns {Object} ć ·ĺĽŹĺŹ‚ć•°
     */
    getDataVectorTileStyle(featureType) {
        let styleParameters = {
            radius: 8, //ĺś†ç‚ąĺŤŠĺľ„
            fillColor: '#EE4D5A', //ĺˇ«ĺ……č‰˛
            fillOpacity: 0.9,
            strokeColor: '#ffffff', //čľąćˇ†é˘śč‰˛
            strokeWidth: 1,
            strokeOpacity: 1,
            lineDash: 'solid',
            type: "BASIC_POINT"
        };
        if (["LINE", "LINESTRING", "MULTILINESTRING"].indexOf(featureType) > -1) {
            styleParameters.strokeColor = '#4CC8A3';
            styleParameters.strokeWidth = 2;
        } else if (["REGION", "POLYGON", "MULTIPOLYGON"].indexOf(featureType) > -1) {
            styleParameters.fillColor = '#826DBA';
        }
        return styleParameters;
    }

    /**
     * @private
     * @function WebMap.prototype.getFiterFeatures
     * @description é€ščż‡čż‡ć»¤ćťˇä»¶ćźĄčŻ˘ć»ˇč¶łçš„feature
     * @param {string} filterCondition - čż‡ć»¤ćťˇä»¶
     * @param {Array} allFeatures - ĺ›ľĺ±‚ä¸Šçš„featureé›†ĺ??
     */
    getFiterFeatures(filterCondition, allFeatures) {
        let condition = this.parseFilterCondition(filterCondition);
        let sql = "select * from json where (" + condition + ")";
        let filterFeatures = [];
        for (let i = 0; i < allFeatures.length; i++) {
            let feature = allFeatures[i];
            let filterResult = false;
            try {
                filterResult = window.jsonsql.query(sql, {
                    attributes: feature.get('attributes')
                });
            } catch (err) {
                //ĺż…éˇ»ćŠŠč¦?čż‡ć»¤ĺľ—ĺ†…ĺ®ąĺ°?čŁ…ć??ä¸€ä¸ŞĺŻąč±ˇ,ä¸»č¦?ć?Żĺ¤„ç?†jsonsql(line : 62)ä¸­ç”±äşŽwithčŻ­ĺŹĄé?ŤĺŽ†ĺŻąč±ˇé€ ć??çš„é—®é˘?
                continue;
            }
            if (filterResult && filterResult.length > 0) {
                //afterFilterFeatureIdx.push(i);
                filterFeatures.push(feature);
            }
        }
        return filterFeatures;
    }

    /**
     * @private
     * @function WebMap.prototype.parseFilterCondition
     * @description 1ă€?ć›żćŤ˘ćźĄčŻ˘čŻ­ĺŹĄ ä¸­çš„ and / AND / or / OR / = / !=
     *              2ă€?ĺŚąé…Ť Name in ('', '')ďĽŚĺ¤šćťˇä»¶éś€ç”¨()ĺŚ…čŁą
     * @param {string} filterCondition - čż‡ć»¤ćťˇä»¶
     * @return {string} ćŤ˘ć??ç»„ä»¶č?˝čŻ†ĺ?«çš„ĺ­—ç¬¦ä¸˛
     */
    parseFilterCondition(filterCondition) {
        return filterCondition
            .replace(/=/g, "==")
            .replace(/AND|and/g, "&&")
            .replace(/or|OR/g, "||")
            .replace(/<==/g, "<=")
            .replace(/>==/g, ">=")
            .replace(/\(?[^\(]+?\s*in\s*\([^\)]+?\)\)?/gi, (res) => {
                // resć ĽĺĽŹďĽš(çś?ä»˝ in ('ĺ››ĺ·ť', 'ć˛łĺŤ—'))
                const data = res.match(/([^(]+?)\s*in\s*\(([^)]+?)\)/i);
                return data.length === 3
                    ? `(${data[2]
                        .split(",")
                        .map((c) => `${data[1]} == ${c.trim()}`)
                        .join(" || ")})`
                    : res;
            });
    }

    /**
     * @private
     * @function WebMap.prototype.createGraphicLayer
     * @description ć·»ĺŠ ĺ¤§ć•°ćŤ®ĺ›ľĺ±‚ĺ?°ĺś°ĺ›ľä¸Š
     * @param {Object} layerInfo - ĺ›ľĺ±‚äżˇć?Ż
     * @param {Array} features - featureçš„é›†ĺ??
     * @return {ol.layer.image} ĺ¤§ć•°ćŤ®ĺ›ľĺ±‚
     */
    async createGraphicLayer(layerInfo, features) {
        features = layerInfo.filterCondition ? this.getFiterFeatures(layerInfo.filterCondition, features) : features;
        let graphics = await this.getGraphicsFromFeatures(features, layerInfo.style, layerInfo.featureType);
        let source = new GraphicSource({
            graphics: graphics,
            render: 'canvas',
            map: this.map,
            isHighLight: false
        });
        return new olLayer.Image({
            source: source
        });
    }

    /**
     * @private
     * @function WebMap.prototype.getGraphicsFromFeatures
     * @description ĺ°†featureč˝¬ćŤ˘ć??ĺ¤§ć•°ćŤ®ĺ›ľĺ±‚ĺŻąĺş”çš„Graphicsč¦?ç´ 
     * @param {Array} features - featureçš„é›†ĺ??
     * @param {Object} style - ĺ›ľĺ±‚ć ·ĺĽŹ
     * @param {string} featureType - featureçš„ç±»ĺž‹
     * @return {Array} ĺ¤§ć•°ćŤ®ĺ›ľĺ±‚č¦?ç´ ć•°ç»„
     */
    async getGraphicsFromFeatures(features, style, featureType) {
        let olStyle = await StyleUtils.getOpenlayersStyle(style, featureType),
            shape = olStyle.getImage();
        let graphics = [];
        //ćž„ĺ»şgraphic
        for (let i in features) {
            let graphic = new OverlayGraphic(features[i].getGeometry());
            graphic.setStyle(shape);
            graphic.setProperties({attributes: features[i].get('attributes')})
            graphics.push(graphic);
        }
        return graphics;
    }

    /**
     * @private
     * @function WebMap.prototype.createSymbolLayer
     * @description ć·»ĺŠ ç¬¦ĺŹ·ĺ›ľĺ±‚
     * @param {Object} layerInfo - ĺ›ľĺ±‚äżˇć?Ż
     * @param {Array} features - featureçš„é›†ĺ??
     * @return {ol.layer.Vector} ç¬¦ĺŹ·ĺ›ľĺ±‚
     */
    createSymbolLayer(layerInfo, features) {
        let style = StyleUtils.getSymbolStyle(layerInfo.style);
        return new olLayer.Vector({
            style: style,
            source: new Vector({
                features: layerInfo.filterCondition ? this.getFiterFeatures(layerInfo.filterCondition, features) : features,
                wrapX: false
            }),
            renderMode: 'image'
        });
    }

    /**
     * @private
     * @function WebMap.prototype.addLabelLayer
     * @description ć·»ĺŠ ć ‡ç­ľĺ›ľĺ±‚
     * @param {Object} layerInfo - ĺ›ľĺ±‚äżˇć?Ż
     * @param {Array} features -featureçš„é›†ĺ??
     * @returns {ol.layer.Vector} ĺ›ľĺ±‚ĺŻąč±ˇ
     */
    addLabelLayer(layerInfo, features) {
        let labelStyle = layerInfo.labelStyle;
        let style = this.getLabelStyle(labelStyle, layerInfo);
        let layer = layerInfo.labelLayer = new olLayer.Vector({
            declutter: true,
            styleOL: style,
            labelField: labelStyle.labelField,
            source: new Vector({
                features: features,
                wrapX: false
            })
        });
        layer.setStyle(features => {
            let labelField = labelStyle.labelField;
            let label = features.get('attributes')[labelField.trim()] + "";
            if (label === "undefined") {
                return null;
            }
            let styleOL = layer.get('styleOL');
            let text = styleOL.getText();
            if (text && text.setText) {
                text.setText(label);
            }
            return styleOL;
        });
        this.map.addLayer(layer);
        layer.setVisible(layerInfo.visible);
        layer.setZIndex(1000);
        const {visibleScale} = layerInfo;
        visibleScale && this.setVisibleScales(layer, visibleScale);
        return layer;
    }

    /**
     * @private
     * @function WebMap.prototype.setVisibleScales
     * @description ć”ąĺŹ?ĺ›ľĺ±‚ĺŹŻč§†čŚ?ĺ›´
     * @param {Object} layer - ĺ›ľĺ±‚ĺŻąč±ˇă€‚ol.Layer
     * @param {Object} visibleScale - ĺ›ľĺ±‚ć ·ĺĽŹĺŹ‚ć•°
     */
    setVisibleScales(layer, visibleScale) {
        let maxResolution = this.resolutions[visibleScale.minScale],
            minResolution = this.resolutions[visibleScale.maxScale];
        //ćŻ”äľ‹ĺ°şĺ’Śĺ?†ĺ?«çŽ‡ć?ŻĺŹŤćŻ”çš„ĺ…łçł»
        maxResolution > 1 ? layer.setMaxResolution(Math.ceil(maxResolution)) : layer.setMaxResolution(maxResolution * 1.1);
        layer.setMinResolution(minResolution);
    }

    /**
     * @private
     * @function WebMap.prototype.getLabelStyle
     * @description čŽ·ĺŹ–ć ‡ç­ľć ·ĺĽŹ
     * @param {Object} parameters - ć ‡ç­ľĺ›ľĺ±‚ć ·ĺĽŹĺŹ‚ć•°
     * @param {Object} layerInfo - ĺ›ľĺ±‚ć ·ĺĽŹĺŹ‚ć•°
     * @returns {ol.style.Style} ć ‡ç­ľć ·ĺĽŹ
     */
    getLabelStyle(parameters, layerInfo) {
        let style = layerInfo.style || layerInfo.pointStyle;
        const {radius = 0, strokeWidth = 0} = style,
            beforeOffsetY = -(radius + strokeWidth);
        const {
            fontSize = '14px',
            fontFamily,
            fill,
            backgroundFill,
            offsetX = 0,
            offsetY = beforeOffsetY,
            placement = "point",
            textBaseline = "bottom",
            textAlign = 'center',
            outlineColor = "#000000",
            outlineWidth = 0
        } = parameters;
        const option = {
            font: `${fontSize} ${fontFamily}`,
            placement,
            textBaseline,
            fill: new FillStyle({color: fill}),
            backgroundFill: new FillStyle({color: backgroundFill}),
            padding: [3, 3, 3, 3],
            offsetX: layerInfo.featureType === 'POINT' ? offsetX : 0,
            offsetY: layerInfo.featureType === 'POINT' ? offsetY : 0,
            overflow: true,
            maxAngle: 0
        };
        if (layerInfo.featureType === 'POINT') {
            //çşżéť˘ä¸Ťéś€č¦?ć­¤ĺŹ‚ć•°ďĽŚĺ?¦ĺ?™č¶…ĺ‡şçşżéť˘overflow:trueďĽŚäąźä¸ŤäĽšć?ľç¤şć ‡ç­ľ
            option.textAlign = textAlign;
        }
        if (outlineWidth > 0) {
            option.stroke = new StrokeStyle({
                color: outlineColor,
                width: outlineWidth
            });
        }

        return new Style({
            text: new Text(option)
        });
    }

    /**
     * @private
     * @function WebMap.prototype.createVectorLayer
     * @description ĺ?›ĺ»şvectorĺ›ľĺ±‚
     * @param {Object} layerInfo - ĺ›ľĺ±‚äżˇć?Ż
     * @param {Array} features -featureçš„é›†ĺ??
     * @returns {ol.layer.Vector} çź˘é‡Źĺ›ľĺ±‚
     */
   async createVectorLayer(layerInfo, features) {
        const {featureType, style} = layerInfo;
        let newStyle;
        if (featureType === 'LINE' && Util.isArray(style)) {
            const [outlineStyle, strokeStyle] = style;
            newStyle = strokeStyle.lineDash === 'solid' ? StyleUtils.getRoadPath(strokeStyle, outlineStyle)
                : StyleUtils.getPathway(strokeStyle, outlineStyle);
        } else {
            newStyle = await StyleUtils.toOpenLayersStyle(layerInfo.style, layerInfo.featureType);
        }
        return new olLayer.Vector({
            style: newStyle,
            source: new Vector({
                features: layerInfo.filterCondition ? this.getFiterFeatures(layerInfo.filterCondition, features) : features,
                wrapX: false
            })
        });
    }

    /**
     * @private
     * @function WebMap.prototype.createHeatLayer
     * @description ĺ?›ĺ»şç?­ĺŠ›ĺ›ľĺ›ľĺ±‚
     * @param {Object} layerInfo - ĺ›ľĺ±‚äżˇć?Ż
     * @param {Array} features -featureçš„é›†ĺ??
     * @returns {ol.layer.Heatmap} ç?­ĺŠ›ĺ›ľĺ›ľĺ±‚
     */
    createHeatLayer(layerInfo, features) {
        //ĺ› ä¸şç?­ĺŠ›ĺ›ľďĽŚéšŹçť€čż‡ć»¤ďĽŚéś€č¦?é‡Ťć–°č®ˇç®—ćť?é‡Ť
        features = layerInfo.filterCondition ? this.getFiterFeatures(layerInfo.filterCondition, features) : features;
        let source = new Vector({
            features: features,
            wrapX: false
        });
        let layerOptions = {
            source: source
        };
        let themeSetting = layerInfo.themeSetting;
        layerOptions.gradient = themeSetting.colors.slice();
        layerOptions.radius = parseInt(themeSetting.radius);
        //č‡Şĺ®šäą‰é˘śč‰˛
        let customSettings = themeSetting.customSettings;
        for (let i in customSettings) {
            layerOptions.gradient[i] = customSettings[i];
        }
        // ćť?é‡Ťĺ­—ć®µć?˘ĺ¤Ť
        if (themeSetting.weight) {
            this.changeWeight(features, themeSetting.weight);
        }
        return new olLayer.Heatmap(layerOptions);
    }

    /**
     * @private
     * @function WebMap.prototype.changeWeight
     * @description ć”ąĺŹ?ĺ˝“ĺ‰Ťćť?é‡Ťĺ­—ć®µ
     * @param {Array} features - featureçš„é›†ĺ??
     * @param {string} weightFeild - ćť?é‡Ťĺ­—ć®µ
     */
    changeWeight(features, weightFeild) {
        let that = this;
        this.fieldMaxValue = {};
        this.getMaxValue(features, weightFeild);
        let maxValue = this.fieldMaxValue[weightFeild];
        features.forEach(function (feature) {
            let attributes = feature.get('attributes');
            try {
                let value = attributes[weightFeild];
                feature.set('weight', value / maxValue);
            } catch (e) {
                that.errorCallback && that.errorCallback(e);
            }
        })
    }

    /**
     * @private
     * @function WebMap.prototype.getMaxValue
     * @description čŽ·ĺŹ–ĺ˝“ĺ‰Ťĺ­—ć®µĺŻąĺş”çš„ćś€ĺ¤§ĺ€ĽďĽŚç”¨äşŽč®ˇç®—ćť?é‡Ť
     * @param {Array} features - feature ć•°ç»„
     * @param {string} weightField - ćť?é‡Ťĺ­—ć®µ
     */
    getMaxValue(features, weightField) {
        let values = [], that = this, attributes;
        let field = weightField;
        if (this.fieldMaxValue[field]) {
            return;
        }
        features.forEach(function (feature) {
            //ć”¶é›†ĺ˝“ĺ‰Ťćť?é‡Ťĺ­—ć®µĺŻąĺş”çš„ć‰€ćś‰ĺ€Ľ
            attributes = feature.get('attributes');
            try {
                values.push(parseFloat(attributes[field]));
            } catch (e) {
                that.errorCallback && that.errorCallback(e);
            }
        });
        this.fieldMaxValue[field] = ArrayStatistic.getArrayStatistic(values, 'Maximum');
    }

    /**
     * @private
     * @function WebMap.prototype.createUniqueLayer
     * @description čŽ·ĺŹ–ĺ˝“ĺ‰Ťĺ­—ć®µĺŻąĺş”çš„ćś€ĺ¤§ĺ€ĽďĽŚç”¨äşŽč®ˇç®—ćť?é‡Ť
     * @param {Object} layerInfo - ĺ›ľĺ±‚äżˇć?Ż
     * @param {Array} features - ć‰€ćś‰featureç»“ĺ??
     */
    async createUniqueLayer(layerInfo, features) {
        let styleSource = await this.createUniqueSource(layerInfo, features);
        let layer = new olLayer.Vector({
            styleSource: styleSource,
            source: new Vector({
                features: layerInfo.filterCondition ? this.getFiterFeatures(layerInfo.filterCondition, features) : features,
                wrapX: false
            })
        });
        layer.setStyle(feature => {
            let styleSource = layer.get('styleSource');
            let labelField = styleSource.themeField;
            let label = feature.get('attributes')[labelField];
            let styleGroup = styleSource.styleGroups.find(item => {
                return item.value === label;
            })
            return styleGroup.olStyle;
        });

        return layer;
    }

    /**
     * @private
     * @function WebMap.prototype.createUniqueSource
     * @description ĺ?›ĺ»şĺŤ•ĺ€Ľĺ›ľĺ±‚çš„source
     * @param {Object} parameters- ĺ›ľĺ±‚äżˇć?Ż
     * @param {Array} features - feature ć•°ç»„
     * @returns {{map: *, style: *, isHoverAble: *, highlightStyle: *, themeField: *, styleGroups: Array}}
     */
    async createUniqueSource(parameters, features) {
        //ć‰ľĺ?°ĺ??é€‚çš„ä¸“é˘?ĺ­—ć®µ
        let styleGroup = await this.getUniqueStyleGroup(parameters, features);
        return {
            map: this.map, //ĺż…äĽ ĺŹ‚ć•° APIĺ±…ç„¶ä¸ŤćŹ?ç¤ş
            style: parameters.style,
            isHoverAble: parameters.isHoverAble,
            highlightStyle: parameters.highlightStyle,
            themeField: parameters.themeSetting.themeField,
            styleGroups: styleGroup
        };
    }

    /**
     * @private
     * @function WebMap.prototype.getUniqueStyleGroup
     * @description čŽ·ĺŹ–ĺŤ•ĺ€Ľä¸“é˘?ĺ›ľçš„styleGroup
     * @param {Object} parameters- ĺ›ľĺ±‚äżˇć?Ż
     * @param {Array} features - feature ć•°ç»„
     * @returns {Array} ĺŤ•ĺ€Ľć ·ĺĽŹ
     */
    async getUniqueStyleGroup(parameters, features) {
        // ć‰ľĺ‡şć‰€ćś‰çš„ĺŤ•ĺ€Ľ
        let featureType = parameters.featureType,
            style = parameters.style,
            themeSetting = parameters.themeSetting;
        let fieldName = themeSetting.themeField;

        let names = [],
            customSettings = themeSetting.customSettings;
        for (let i in features) {
            let attributes = features[i].get('attributes');
            let name = attributes[fieldName];
            let isSaved = false;
            for (let j in names) {
                if (names[j] === name) {
                    isSaved = true;
                    break;
                }
            }
            if (!isSaved) {
                names.push(name);
            }
        }


        //ç”źć??styleGroup
        let styleGroup = [];
        for(let index = 0; index < names.length; index++) {
          const name = names[index];
          //ĺ…Ľĺ®ąäą‹ĺ‰Ťč‡Şĺ®šäą‰ć?Żç”¨keyďĽŚçŽ°ĺś¨ĺ› ä¸şć•°ćŤ®ć”ŻćŚ?çĽ–čľ‘ďĽŚéś€č¦?ç”¨ĺ±žć€§ĺ€Ľă€‚
          let key = this.webMapVersion === "1.0" ? index : name;
          let custom = customSettings[key];
          if(Util.isString(custom)) {
              //ĺ…Ľĺ®ąäą‹ĺ‰Ťč‡Şĺ®šäą‰ĺŹŞĺ­?ĺ‚¨ä¸€ä¸Şcolor
              custom = this.getCustomSetting(style, custom, featureType);
              customSettings[key] = custom;
          }

          // č˝¬ĺŚ–ć?? ol ć ·ĺĽŹ
          let olStyle, type = custom.type;
          if(type === 'SYMBOL_POINT') {
              olStyle = StyleUtils.getSymbolStyle(custom);
          } else if(type === 'SVG_POINT') {
              olStyle = await StyleUtils.getSVGStyle(custom);
          } else if(type === 'IMAGE_POINT') {
              olStyle = StyleUtils.getImageStyle(custom);
          } else {
              olStyle = await StyleUtils.toOpenLayersStyle(custom, featureType);
          }
          styleGroup.push({
              olStyle: olStyle,
              style: customSettings[key],
              value: name
          });
        }
        return styleGroup;
    }

    /**
     * @description čŽ·ĺŹ–ĺŤ•ĺ€Ľä¸“é˘?ĺ›ľč‡Şĺ®šäą‰ć ·ĺĽŹĺŻąč±ˇ
     * @param {Object} style - ĺ›ľĺ±‚ä¸Šçš„ć ·ĺĽŹ
     * @param {string} color - ĺŤ•ĺ€ĽĺŻąĺş”çš„é˘śč‰˛
     * @param {string} featureType - č¦?ç´ ç±»ĺž‹
     */
    getCustomSetting(style, color, featureType) {
        let newProps = {};
        if (featureType === "LINE") {
            newProps.strokeColor = color;
        } else {
            newProps.fillColor = color;
        }
        let customSetting = Object.assign(style, newProps)
        return customSetting;
    }

    /**
     * @private
     * @function WebMap.prototype.createRangeLayer
     * @description ĺ?›ĺ»şĺ?†ć®µĺ›ľĺ±‚
     * @param {Object} layerInfo- ĺ›ľĺ±‚äżˇć?Ż
     * @param {Array} features - ć‰€ćś‰featureç»“ĺ??
     * @returns {ol.layer.Vector} ĺŤ•ĺ€Ľĺ›ľĺ±‚
     */
    async createRangeLayer(layerInfo, features) {
        //čż™é‡ŚčŽ·ĺŹ–styleGroupč¦?ç”¨ć‰€ä»Ąçš„feature
        let styleSource = await this.createRangeSource(layerInfo, features);
        let layer = new olLayer.Vector({
            styleSource: styleSource,
            source: new Vector({
                features: layerInfo.filterCondition ? this.getFiterFeatures(layerInfo.filterCondition, features) : features,
                wrapX: false
            })
        });

        layer.setStyle(feature => {
            let styleSource = layer.get('styleSource');
            if (styleSource) {
                let labelField = styleSource.themeField;
                let value = Number(feature.get('attributes')[labelField.trim()]);
                let styleGroups = styleSource.styleGroups;
                for (let i = 0; i < styleGroups.length; i++) {
                    if (i === 0) {
                        if (value >= styleGroups[i].start && value <= styleGroups[i].end) {
                            return styleGroups[i].olStyle;
                        }
                    } else {
                        if (value > styleGroups[i].start && value <= styleGroups[i].end) {
                            return styleGroups[i].olStyle;
                        }
                    }
                }
            }
        });

        return layer;
    }

    /**
     * @private
     * @function WebMap.prototype.createRangeSource
     * @description ĺ?›ĺ»şĺ?†ć®µä¸“é˘?ĺ›ľçš„ĺ›ľĺ±‚source
     * @param {Object} parameters- ĺ›ľĺ±‚äżˇć?Ż
     * @param {Array} features - ć‰€ä»Ąçš„featureé›†ĺ??
     * @returns {Object} ĺ›ľĺ±‚source
     */
    async createRangeSource(parameters, features) {
        //ć‰ľĺ?°ĺ??é€‚çš„ä¸“é˘?ĺ­—ć®µ
        let styleGroup = await this.getRangeStyleGroup(parameters, features);
        if (styleGroup) {
            return {
                style: parameters.style,
                themeField: parameters.themeSetting.themeField,
                styleGroups: styleGroup
            };
        } else {
            return false;
        }
    }

    /**
     * @private
     * @function WebMap.prototype.getRangeStyleGroup
     * @description čŽ·ĺŹ–ĺ?†ć®µä¸“é˘?ĺ›ľçš„styleGroupć ·ĺĽŹ
     * @param {Object} parameters- ĺ›ľĺ±‚äżˇć?Ż
     * @param {Array} features - ć‰€ä»Ąçš„featureé›†ĺ??
     * @returns {Array} styleGroups
     */
    async getRangeStyleGroup(parameters, features) {
        // ć‰ľĺ‡şĺ?†ć®µĺ€Ľ
        let featureType = parameters.featureType,
            themeSetting = parameters.themeSetting,
            style = parameters.style;
        let count = themeSetting.segmentCount,
            method = themeSetting.segmentMethod,
            colors = themeSetting.colors,
            customSettings = themeSetting.customSettings,
            fieldName = themeSetting.themeField;
        let values = [],
            attributes;
        let segmentCount = count;
        let segmentMethod = method;
        let that = this;
        features.forEach(function (feature) {
            attributes = feature.get("attributes");
            try {
                if (attributes) {
                    //čż‡ć»¤ćŽ‰éťžć•°ĺ€Ľçš„ć•°ćŤ®
                    let value = attributes[fieldName.trim()];
                    if (value !== undefined && value !== null && Util.isNumber(value)) {
                        values.push(parseFloat(value));
                    }
                } else if (feature.get(fieldName) && Util.isNumber(feature.get(fieldName))) {
                    if (feature.get(fieldName)) {
                        values.push(parseFloat(feature.get(fieldName)));
                    }
                }
            } catch (e) {
                that.errorCallback && that.errorCallback(e);
            }

        });

        let segements;
        try {
            segements = ArrayStatistic.getArraySegments(values, segmentMethod, segmentCount);
        } catch (e) {
            that.errorCallback && that.errorCallback(e);
        }
        if (segements) {
            let itemNum = segmentCount;
            if (attributes && segements[0] === segements[attributes.length - 1]) {
                itemNum = 1;
                segements.length = 2;
            }

            //äżťç•™ä¸¤ä˝Ťćś‰ć•?ć•°
            for (let key in segements) {
                let value = segements[key];
                if (Number(key) === 0) {
                    // ćś€ĺ°Źçš„ĺ€Ľä¸‹č?Ťĺ…Ą,č¦?ç”¨ä¸¤ä¸Şç­‰äşŽĺŹ·ă€‚ĺ?¦ĺ?™ćś‰äş›ĺ€Ľĺ?¤ć–­ä¸ŤĺŻą
                    value = Math.floor(value * 100) / 100;
                } else {
                    // ĺ…¶ä˝™ä¸Šč?Ťĺ…Ą
                    value = Math.ceil(value * 100) / 100 + 0.1; // ĺŠ 0.1 č§Łĺ†łćś€ĺ¤§ĺ€Ľć˛ˇćś‰ć ·ĺĽŹé—®é˘?
                }

                segements[key] = Number(value.toFixed(2));
            }

            //čŽ·ĺŹ–ä¸€ĺ®šé‡Źçš„é˘śč‰˛
            let curentColors = colors;
            curentColors = ColorsPickerUtil.getGradientColors(curentColors, itemNum, 'RANGE');

            for (let index = 0; index < itemNum; index++) {
                if (index in customSettings) {
                    if (customSettings[index]["segment"]["start"]) {
                        segements[index] = customSettings[index]["segment"]["start"];
                    }
                    if (customSettings[index]["segment"]["end"]) {
                        segements[index + 1] = customSettings[index]["segment"]["end"];
                    }
                }
            }
            //ç”źć??styleGroup
            let styleGroups = [];
            for (let i = 0; i < itemNum; i++) {
                let color = curentColors[i];
                if (i in customSettings) {
                    if (customSettings[i].color) {
                        color = customSettings[i].color;
                    }
                }
                if (featureType === "LINE") {
                    style.strokeColor = color;
                } else {
                    style.fillColor = color;
                }

                // č˝¬ĺŚ–ć?? ol ć ·ĺĽŹ
                let olStyle = await StyleUtils.toOpenLayersStyle(style, featureType);

                let start = segements[i];
                let end = segements[i + 1];

                styleGroups.push({
                    olStyle: olStyle,
                    color: color,
                    start: start,
                    end: end
                });
            }

            return styleGroups;
        } else {
            return false;
        }
    }

    /**
     * @private
     * @function WebMap.prototype.createMarkerLayer
     * @description ĺ?›ĺ»şć ‡ćł¨ĺ›ľĺ±‚
     * @param {Array} features - ć‰€ä»Ąçš„featureé›†ĺ??
     * @returns {ol.layer.Vector} çź˘é‡Źĺ›ľĺ±‚
     */
    async createMarkerLayer(features) {
        features && await this.setEachFeatureDefaultStyle(features);
        return new olLayer.Vector({
            source: new Vector({
                features: features,
                wrapX: false
            })
        });
    }

    /**
     * @private
     * @function WebMap.prototype.createDataflowLayer
     * @description ĺ?›ĺ»şć•°ćŤ®ćµ?ĺ›ľĺ±‚
     * @param {Object} layerInfo- ĺ›ľĺ±‚äżˇć?Ż
     * @param {number} layerIndex - ĺ›ľĺ±‚çš„zindex
     * @returns {ol.layer.Vector} ć•°ćŤ®ćµ?ĺ›ľĺ±‚
     */
    async createDataflowLayer(layerInfo, layerIndex) {
        let layerStyle = layerInfo.pointStyle, style;
        //čŽ·ĺŹ–ć ·ĺĽŹ
        style = await StyleUtils.getOpenlayersStyle(layerStyle, layerInfo.featureType);

        let source = new Vector({
            wrapX: false
        }), labelLayer, labelSource, pathLayer, pathSource;
        let layer = new olLayer.Vector({
            styleOL: style,
            source: source
        });
        if (layerInfo.labelStyle && layerInfo.visible) {
            //ćś‰ć ‡ç­ľĺ›ľĺ±‚
            labelLayer = this.addLabelLayer(layerInfo);
            //ĺ’ŚçĽ–čľ‘éˇµéť˘äżťćŚ?ä¸€č‡´
            labelLayer.setZIndex(1000);
            labelSource = labelLayer.getSource();
        }
        const {visibleScale} = layerInfo;
        if (layerInfo.lineStyle && layerInfo.visible) {
            pathLayer = await this.createVectorLayer({style: layerInfo.lineStyle, featureType: "LINE"});
            pathSource = pathLayer.getSource();
            pathLayer.setZIndex(layerIndex);
            this.map.addLayer(pathLayer);
            visibleScale && this.setVisibleScales(pathLayer, visibleScale);
            // ćŚ‚č˝˝ĺ?°layerInfoä¸ŠďĽŚäľżäşŽĺ? é™¤
            layerInfo.pathLayer = pathLayer;
        }
        let featureCache = {}, labelFeatureCache = {}, pathFeatureCache = {}, that = this;
        this.createDataflowService(layerInfo, function (featureCache, labelFeatureCache, pathFeatureCache) {
            return function (feature) {
                that.events.triggerEvent('updateDataflowFeature', {
                    feature: feature,
                    identifyField: layerInfo.identifyField,
                    layerID: layerInfo.layerID
                });
                if (layerInfo.filterCondition) {
                    //čż‡ć»¤ćťˇä»¶
                    let condition = that.parseFilterCondition(layerInfo.filterCondition);
                    let sql = "select * from json where (" + condition + ")";
                    let filterResult = window.jsonsql.query(sql, {
                        attributes: feature.get('attributes')
                    });
                    if (filterResult && filterResult.length > 0) {
                        that.addDataflowFeature(feature, layerInfo.identifyField, {
                            dataflowSource: source,
                            featureCache: featureCache,
                            labelSource: labelSource,
                            labelFeatureCache: labelFeatureCache,
                            pathSource: pathSource,
                            pathFeatureCache: pathFeatureCache,
                            maxPointCount: layerInfo.maxPointCount
                        });
                    }
                } else {
                    that.addDataflowFeature(feature, layerInfo.identifyField, {
                        dataflowSource: source,
                        featureCache: featureCache,
                        labelSource: labelSource,
                        labelFeatureCache: labelFeatureCache,
                        pathSource: pathSource,
                        pathFeatureCache: pathFeatureCache,
                        maxPointCount: layerInfo.maxPointCount
                    });
                }
            }
        }(featureCache, labelFeatureCache, pathFeatureCache));
        this.setFeatureStyle(layer, layerInfo.directionField, layerStyle.type);
        return layer;
    }

    /**
     * @private
     * @function WebMap.prototype.addDataflowFeature
     * @description ć·»ĺŠ ć•°ćŤ®ćµ?çš„feature
     * @param {Object} feature - ćśŤĺŠˇĺ™¨ć›´ć–°çš„feature
     * @param {string} identifyField - ć ‡čŻ†featureçš„ĺ­—ć®µ
     * @param {Object} options - ĺ…¶ä»–ĺŹ‚ć•°
     */
    addDataflowFeature(feature, identifyField, options) {
        options.dataflowSource && this.addFeatureFromDataflowService(options.dataflowSource, feature, identifyField, options.featureCache);
        options.labelSource && this.addFeatureFromDataflowService(options.labelSource, feature, identifyField, options.labelFeatureCache);
        options.pathSource && this.addPathFeature(options.pathSource, feature, identifyField, options.pathFeatureCache, options.maxPointCount);
    }
    /**
     * @private
     * @function WebMap.prototype.addPathFeature
     * @description ć·»ĺŠ ć•°ćŤ®ćµ?ĺ›ľĺ±‚ä¸­č˝¨čżąçşżçš„feature
     * @param {Object} source - č˝¨čżąçşżĺ›ľĺ±‚çš„source
     * @param {Object} feature - č˝¨čżąçşżfeature
     * @param {string} identifyField - ć ‡čŻ†featureçš„ĺ­—ć®µ
     * @param {Object} featureCache - ĺ­?ĺ‚¨feature
     * @param {number} maxPointCount - č˝¨čżąçşżćś€ĺ¤šç‚ąä¸Şć•°ć•°é‡Ź
     */
    addPathFeature(source, feature, identifyField, featureCache, maxPointCount) {
        let coordinates = [];
        var geoID = feature.get(identifyField);
        if (featureCache[geoID]) {
            //ĺŠ čż‡feautre
            coordinates = featureCache[geoID].getGeometry().getCoordinates();
            coordinates.push(feature.getGeometry().getCoordinates());
            if (maxPointCount && coordinates.length > maxPointCount) {
                coordinates.splice(0, coordinates.length - maxPointCount);
            }
            featureCache[geoID].getGeometry().setCoordinates(coordinates);
        } else {
            coordinates.push(feature.getGeometry().getCoordinates());
            featureCache[geoID] = new Feature({
                geometry: new olGeometry.LineString(coordinates)
            });
            source.addFeature(featureCache[geoID]);
        }
    }

    /**
     * @private
     * @function WebMap.prototype.setFeatureStyle
     * @description č®ľç˝®featureć ·ĺĽŹ
     * @param {Object} layer - ĺ›ľĺ±‚ĺŻąč±ˇ
     * @param {string} directionField - ć–ąĺ?‘ĺ­—ć®µ
     * @param {string} styleType - ć ·ĺĽŹçš„ç±»ĺž‹
     */
    setFeatureStyle(layer, directionField, styleType) {
        let layerStyle = layer.get('styleOL');
        layer.setStyle(feature => {
            //ćś‰č˝¬ĺ?‘ĺ­—ć®µ
            let value, image;
            if (directionField !== undefined && directionField !== "ćśŞč®ľç˝®" && directionField !== "None") {
                value = feature.get('attributes')[directionField];
            } else {
                value = 0;
            }
            if (value > 360 || value < 0) {
                return null;
            }
            if (styleType === "SYMBOL_POINT") {
                image = layerStyle.getText();
            } else {
                image = layerStyle.getImage();
            }
            //é»?č®¤ç”¨ć?·ä˝żç”¨çš„ć?Żč§’ĺş¦ďĽŚćŤ˘ç®—ć??ĺĽ§ĺş¦
            let rotate = (Math.PI * value) / 180;
            image && image.setRotation(rotate);
            return layerStyle;
        });
    }

    /**
     * @private
     * @function WebMap.prototype.createDataflowHeatLayer
     * @description ĺ?›ĺ»şć•°ćŤ®ćµ?ćśŤĺŠˇçš„ç?­ĺŠ›ĺ›ľĺ›ľĺ±‚
     * @param {Object} layerInfo - ĺ›ľĺ±‚ĺŹ‚ć•°
     * @returns {ol.layer.Heatmap} ç?­ĺŠ›ĺ›ľĺ›ľĺ±‚ĺŻąč±ˇ
     */
    createDataflowHeatLayer(layerInfo) {
        let source = this.createDataflowHeatSource(layerInfo);
        let layerOptions = {
            source: source
        };
        layerOptions.gradient = layerInfo.themeSetting.colors.slice();
        layerOptions.radius = parseInt(layerInfo.themeSetting.radius);

        if (layerInfo.themeSetting.customSettings) {
            let customSettings = layerInfo.themeSetting.customSettings;
            for (let i in customSettings) {
                layerOptions.gradient[i] = customSettings[i];
            }
        }
        return new olLayer.Heatmap(layerOptions);
    }

    /**
     * @private
     * @function WebMap.prototype.createDataflowHeatSource
     * @description ĺ?›ĺ»şć•°ćŤ®ćµ?ćśŤĺŠˇçš„ç?­ĺŠ›ĺ›ľçš„source
     * @param {Object} layerInfo - ĺ›ľĺ±‚ĺŹ‚ć•°
     * @returns {ol.souce.Vector} ç?­ĺŠ›ĺ›ľsourceĺŻąč±ˇ
     */
    createDataflowHeatSource(layerInfo) {
        let that = this,
            source = new Vector({
                wrapX: false
            });
        let featureCache = {};
        this.createDataflowService(layerInfo, function (featureCache) {
            return function (feature) {
                if (layerInfo.filterCondition) {
                    //čż‡ć»¤ćťˇä»¶
                    let condition = that.parseFilterCondition(layerInfo.filterCondition);
                    let sql = "select * from json where (" + condition + ")";
                    let filterResult = window.jsonsql.query(sql, {
                        attributes: feature.get('attributes')
                    });
                    if (filterResult && filterResult.length > 0) {
                        that.addDataflowFeature(feature, layerInfo.identifyField, {
                            dataflowSource: source,
                            featureCache: featureCache
                        });
                    }
                } else {
                    that.addDataflowFeature(feature, layerInfo.identifyField, {
                        dataflowSource: source,
                        featureCache: featureCache
                    });
                }
                // ćť?é‡Ťĺ­—ć®µć?˘ĺ¤Ť
                if (layerInfo.themeSetting.weight) {
                    that.changeWeight(source.getFeatures(), layerInfo.themeSetting.weight);
                }
            }
        }(featureCache));
        return source;
    }

    /**
     * @private
     * @function WebMap.prototype.addFeatureFromDataflowService
     * @description ĺ°†featureć·»ĺŠ ĺ?°ć•°ćŤ®ćµ?ĺ›ľĺ±‚
     * @param {Object} source - ĺ›ľĺ±‚ĺŻąĺş”çš„source
     * @param {Object} feature - éś€č¦?ć·»ĺŠ ĺ?°ĺ›ľĺ±‚çš„feature
     * @param {Object} identifyField - featureçš„ć ‡čŻ†ĺ­—ć®µ
     * @param {Object} featureCache - ĺ­?ĺ‚¨ĺ·˛ć·»ĺŠ ĺ?°ĺ›ľĺ±‚çš„featureĺŻąč±ˇ
     */
    addFeatureFromDataflowService(source, feature, identifyField, featureCache) {
        //ĺ?¤ć–­ć?Żĺ?¦ćś‰čż™ä¸ŞfeatureďĽŚĺ­?ĺś¨featureĺ°±ć›´ć–°ä˝Ťç˝®ă€‚
        var geoID = feature.get(identifyField);
        if (geoID !== undefined && featureCache[geoID]) {
            /*if(that.addFeatureFinish) {
                //featureĺ…¨é?˝ĺŠ ä¸Šĺ›ľĺ±‚ďĽŚĺ°±çĽ©ć”ľčŚ?ĺ›´
                MapManager.zoomToExtent(LayerUtil.getBoundsFromFeatures(source.getFeatures()));
                that.addFeatureFinish = false;
            }*/
            featureCache[geoID].setGeometry(feature.getGeometry());
            featureCache[geoID].setProperties(feature.getProperties());
            source.changed();
        } else {
            source.addFeature(feature);
            featureCache[geoID] = feature;
        }
    }
    /**
     * @private
     * @function WebMap.prototype.createDataflowService
     * @description ĺ°†featureć·»ĺŠ ĺ?°ć•°ćŤ®ćµ?ĺ›ľĺ±‚
     * @param {Object} layerInfo - ĺ›ľĺ±‚ĺŹ‚ć•°
     * @param {Object} callback - ĺ›žč°?ĺ‡˝ć•°
     */
    createDataflowService(layerInfo, callback) {
        let that = this;
        let dataflowService = new DataFlowService(layerInfo.wsUrl).initSubscribe();
        dataflowService.on('messageSucceeded', function (e) {
            let geojson = JSON.parse(e.value.data);
            let feature = transformTools.readFeature(geojson, {
                dataProjection: layerInfo.projection || "EPSG:4326",
                featureProjection: that.baseProjection || 'EPSG:4326'
            });
            feature.setProperties({attributes: geojson.properties});
            callback(feature);
        });
        layerInfo.dataflowService = dataflowService;
    }

    /**
     * @private
     * @function WebMap.prototype.setEachFeatureDefaultStyle
     * @description ä¸şć ‡ćł¨ĺ›ľĺ±‚ä¸Šçš„featureč®ľç˝®ć ·ĺĽŹ
     * @param {Array} features - ć‰€ä»Ąçš„featureé›†ĺ??
     */
    async setEachFeatureDefaultStyle(features) {
        let that = this;
        features = (Util.isArray(features) || features instanceof Collection) ? features : [features];
        for(let i = 0; i < features.length; i++) {
          const feature = features[i];
          let geomType = feature.getGeometry().getType().toUpperCase();
          // let styleType = geomType === "POINT" ? 'MARKER' : geomType;
          let defaultStyle = feature.getProperties().useStyle;
          if (defaultStyle) {
              if (geomType === 'POINT' && defaultStyle.text) {
                  //čŻ´ć?Žć?Żć–‡ĺ­—çš„featureç±»ĺž‹
                  geomType = "TEXT";
              }
              let attributes = that.setFeatureInfo(feature);
              feature.setProperties({
                  useStyle: defaultStyle,
                  attributes
              });
              //ć ‡ćł¨ĺ›ľĺ±‚çš„featureä¸Šéś€č¦?ĺ­?ä¸€ä¸ŞlayerIdďĽŚä¸şäş†äą‹ĺ?Žć ·ĺĽŹĺş”ç”¨ĺ?°ĺ›ľĺ±‚ä¸Šä˝żç”¨
              // feature.layerId = timeId;
              if (geomType === 'POINT' && defaultStyle.src &&
                  defaultStyle.src.indexOf('http://') === -1 && defaultStyle.src.indexOf('https://') === -1) {
                  //čŻ´ć?Žĺś°ĺť€ä¸Ťĺ®Ść•´
                  defaultStyle.src = that.server + defaultStyle.src;
              }
          } else {
              defaultStyle = StyleUtils.getMarkerDefaultStyle(geomType, that.server);
          }
          feature.setStyle(await StyleUtils.toOpenLayersStyle(defaultStyle, geomType))
        }
    }

    /**
     * @private
     * @function WebMap.prototype.setFeatureInfo
     * @description ä¸şfeatureč®ľç˝®ĺ±žć€§
     * @param {Array} feature - ĺŤ•ä¸Şfeature
     * @returns {Object} ĺ±žć€§
     */
    setFeatureInfo(feature) {
        let attributes = feature.get('attributes'),
            defaultAttr = {
                dataViz_title: '',
                dataViz_description: '',
                dataViz_imgUrl: '',
                dataViz_url: ''
            },
            newAttribute = Object.assign(defaultAttr, attributes);
        let properties = feature.getProperties();
        for (let key in newAttribute) {
            if (properties[key]) {
                newAttribute[key] = properties[key];
                delete properties[key];
            }
        }
        return newAttribute;
    }

    /**
     * @private
     * @function WebMap.prototype.createRankSymbolLayer
     * @description ĺ?›ĺ»şç­‰çş§ç¬¦ĺŹ·ĺ›ľĺ±‚
     * @param {Object} layerInfo - ĺ›ľĺ±‚äżˇć?Ż
     * @param {Array} features - ć·»ĺŠ ĺ?°ĺ›ľĺ±‚ä¸Šçš„features
     * @returns {ol.layer.Vector} çź˘é‡Źĺ›ľĺ±‚
     */
    async createRankSymbolLayer(layerInfo, features) {
        let styleSource = await this.createRankStyleSource(layerInfo, features, layerInfo.featureType);
        let layer = new olLayer.Vector({
            styleSource,
            source: new Vector({
                features: layerInfo.filterCondition ? this.getFiterFeatures(layerInfo.filterCondition, features) : features,
                wrapX: false
            }),
            renderMode: 'image'
        });
        layer.setStyle(feature => {
            let styleSource = layer.get('styleSource');
            let themeField = styleSource.parameters.themeSetting.themeField;
            let value = Number(feature.get('attributes')[themeField]);
            let styleGroups = styleSource.styleGroups;
            for (let i = 0, len = styleGroups.length; i < len; i++) {
                if (value >= styleGroups[i].start && value < styleGroups[i].end) {
                    return styleSource.styleGroups[i].olStyle;
                }
            }
        });
        return layer;
    }
    /**
     * @private
     * @function WebMap.prototype.createRankSymbolLayer
     * @description ĺ?›ĺ»şç­‰çş§ç¬¦ĺŹ·ĺ›ľĺ±‚çš„source
     * @param {Object} parameters - ĺ›ľĺ±‚äżˇć?Ż
     * @param {Array} features - ć·»ĺŠ ĺ?°ĺ›ľĺ±‚ä¸Šçš„features
     * @param {string} featureType - featureçš„ç±»ĺž‹
     * @returns {Object} styleGroups
     */
    async createRankStyleSource(parameters, features, featureType) {
        let themeSetting = parameters.themeSetting,
            themeField = themeSetting.themeField;
        let styleGroups = await this.getRankStyleGroup(themeField, features, parameters, featureType);
        return styleGroups ? {parameters, styleGroups} : false
    }
    /**
     * @private
     * @function WebMap.prototype.getRankStyleGroup
     * @description čŽ·ĺŹ–ç­‰çş§ç¬¦ĺŹ·çš„style
     * @param {string} themeField - ĺ?†ć®µĺ­—ć®µ
     * @param {Array} features - ć·»ĺŠ ĺ?°ĺ›ľĺ±‚ä¸Šçš„features
     * @param {Object} parameters - ĺ›ľĺ±‚ĺŹ‚ć•°
     * @param {string} featureType - featureçš„ç±»ĺž‹
     * @returns {Array} stylegroup
     */
    async getRankStyleGroup(themeField, features, parameters, featureType) {
        // ć‰ľĺ‡şć‰€ćś‰çš„ĺŤ•ĺ€Ľ
        let values = [],
            segements = [],
            style = parameters.style,
            themeSetting = parameters.themeSetting,
            segmentMethod = themeSetting.segmentMethod || this.defaultParameters.themeSetting.segmentMethod,
            segmentCount = themeSetting.segmentCount || this.defaultParameters.themeSetting.segmentCount,
            customSettings = themeSetting.customSettings,
            minR = parameters.themeSetting.minRadius,
            maxR = parameters.themeSetting.maxRadius,
            fillColor = style.fillColor,
            colors = parameters.themeSetting.colors;
        features.forEach(feature => {
            let attributes = feature.get('attributes'),
                value = attributes[themeField];
            // čż‡ć»¤ćŽ‰ç©şĺ€Ľĺ’Śéťžć•°ĺ€Ľ
            if (value == null || !Util.isNumber(value)) {
                return;
            }
            values.push(Number(value));
        });
        try {
            segements = ArrayStatistic.getArraySegments(values, segmentMethod, segmentCount);
        } catch (error) {
            console.error(error);
        }

        // ĺ¤„ç?†č‡Şĺ®šäą‰ ĺ?†ć®µ
        for (let i = 0; i < segmentCount; i++) {
            if (i in customSettings) {
                let startValue = customSettings[i]['segment']['start'],
                    endValue = customSettings[i]['segment']['end'];
                startValue != null && (segements[i] = startValue);
                endValue != null && (segements[i + 1] = endValue);
            }
        }

        //ç”źć??styleGroup
        let styleGroup = [];
        if (segements && segements.length) {
            let len = segements.length,
                incrementR = (maxR - minR) / (len - 1), // ĺŤŠĺľ„ĺ˘žé‡Ź
                start, end, radius = Number(((maxR + minR) / 2).toFixed(2));
            // čŽ·ĺŹ–é˘śč‰˛
            let rangeColors = colors ? ColorsPickerUtil.getGradientColors(colors, len, 'RANGE') : [];
            for (let j = 0; j < len - 1; j++) {
                start = Number(segements[j].toFixed(2));
                end = Number(segements[j + 1].toFixed(2));
                // čż™é‡Śç‰ąć®Šĺ¤„ç?†ä»Ąä¸‹ĺ?†ć®µĺ€Ľç›¸ĺ?Śçš„ć?…ĺ†µďĽ?ĺŤłć‰€ćś‰ĺ­—ć®µĺ€Ľç›¸ĺ?ŚďĽ‰
                radius = start === end ? radius : minR + Math.round(incrementR * j);
                // ćś€ĺ?Žä¸€ä¸Şĺ?†ć®µć—¶ĺ°†end+0.01ďĽŚé?żĺ…ŤĺŹ–ä¸Ťĺ?°ćś€ĺ¤§ĺ€Ľ
                end = j === len - 2 ? end + 0.01 : end;
                // ĺ¤„ç?†č‡Şĺ®šäą‰ ĺŤŠĺľ„
                radius = customSettings[j] && customSettings[j].radius ? customSettings[j].radius : radius;
                // č˝¬ĺŚ–ć?? ol ć ·ĺĽŹ
                style.radius = radius;
                style.fillColor = customSettings[j] && customSettings[j].color ? customSettings[j].color : rangeColors[j] || fillColor;
                let olStyle = await StyleUtils.getOpenlayersStyle(style, featureType, true);
                styleGroup.push({olStyle: olStyle, radius, start, end, fillColor: style.fillColor});
            }
            return styleGroup;
        } else {
            return false;
        }
    }

    /**
     * @private
     * @function WebMap.prototype.checkUploadToRelationship
     * @description ćŁ€ćźĄć?Żĺ?¦ä¸ŠäĽ ĺ?°ĺ…łçł»ĺž‹
     * @param {string} fileId - ć–‡ä»¶çš„id
     * @returns {Promise<T | never>} ĺ…łçł»ĺž‹ć–‡ä»¶ä¸€äş›ĺŹ‚ć•°
     */
    checkUploadToRelationship(fileId) {
        let url = this.getRequestUrl(`${this.server}web/datas/${fileId}/datasets.json`);
        return FetchRequest.get(url, null, {
            withCredentials: this.withCredentials
        }).then(function (response) {
            return response.json()
        }).then(function (result) {
            return result;
        });
    }
    /**
     * @private
     * @function WebMap.prototype.getDatasources
     * @description čŽ·ĺŹ–ĺ…łçł»ĺž‹ć–‡ä»¶ĺŹ‘ĺ¸?çš„ć•°ćŤ®ćśŤĺŠˇä¸­ć•°ćŤ®ćş?çš„ĺ?Ťç§°
     * @param {string} url - čŽ·ĺŹ–ć•°ćŤ®ćş?äżˇć?Żçš„url
     *  @returns {Promise<T | never>} ć•°ćŤ®ćş?ĺ?Ťç§°
     */
    getDatasources(url) {
        let requestUrl = this.getRequestUrl(`${url}/data/datasources.json`);
        return FetchRequest.get(requestUrl, null, {
            withCredentials: this.withCredentials
        }).then(function (response) {
            return response.json()
        }).then(function (datasource) {
            let datasourceNames = datasource.datasourceNames;
            return datasourceNames[0];
        });

    }
    /**
     * @private
     * @function WebMap.prototype.getDataService
     * @description čŽ·ĺŹ–ä¸ŠäĽ çš„ć•°ćŤ®äżˇć?Ż
     * @param {string} fileId - ć–‡ä»¶id
     * @param {string} datasetName ć•°ćŤ®ćśŤĺŠˇçš„ć•°ćŤ®é›†ĺ?Ťç§°
     *  @returns {Promise<T | never>} ć•°ćŤ®çš„äżˇć?Ż
     */
    getDataService(fileId, datasetName) {
        let url = this.getRequestUrl(`${this.server}web/datas/${fileId}.json`);
        return FetchRequest.get(url, null, {
            withCredentials: this.withCredentials
        }).then(function (response) {
            return response.json()
        }).then(function (result) {
            result.fileId = fileId;
            result.datasetName = datasetName;
            return result;
        });
    }

    /**
     * @private
     * @function WebMap.prototype.getRootUrl
     * @description čŽ·ĺŹ–čŻ·ć±‚ĺś°ĺť€
     * @param {string} url čŻ·ć±‚çš„ĺś°ĺť€
     * @param {boolean} čŻ·ć±‚ć?Żĺ?¦ĺ¸¦ä¸ŠCredential.
     * @returns {Promise<T | never>} čŻ·ć±‚ĺś°ĺť€
     */
    getRequestUrl(url, excludeCreditial) {
        url = excludeCreditial ? url : this.formatUrlWithCredential(url);
        //ĺ¦‚ćžśäĽ ĺ…Ąčż›ćťĄçš„urlĺ¸¦äş†ä»Łç?†ĺ?™ä¸Ťéś€č¦?ĺ¤„ç?†
        if (this.excludePortalProxyUrl) {
            return;
        }
        return CommonUtil.isInTheSameDomain(url) ? url : `${this.getProxy()}${encodeURIComponent(url)}`;
    }

    /**
     * @description ç»™urlĺ¸¦ä¸Šĺ‡­čŻ?ĺŻ†é’Ą
     * @param {string} url - ĺś°ĺť€
     */
    formatUrlWithCredential(url) {
        if (this.credentialValue) {
            //ćś‰tokenäą‹ç±»çš„é…Ťç˝®éˇą
            url = url.indexOf("?") === -1 ? `${url}?${this.credentialKey}=${this.credentialValue}` :
                `${url}&${this.credentialKey}=${this.credentialValue}`;
        }
        return url;
    }

    /**
     * @private
     * @function WebMap.prototype.getProxy
     * @description čŽ·ĺŹ–ä»Łç?†ĺś°ĺť€
     * @returns {Promise<T | never>} ä»Łç?†ĺś°ĺť€
     */
    getProxy(type) {
        if (!type) {
            type = 'json';
        }
        return this.proxy || this.server + `apps/viewer/getUrlResource.${type}?url=`;
    }

    /**
     * @private
     * @function WebMap.prototype.getTileLayerInfo
     * @description čŽ·ĺŹ–ĺś°ĺ›ľćśŤĺŠˇçš„äżˇć?Ż
     * @param {string} url ĺś°ĺ›ľćśŤĺŠˇçš„urlďĽ?ć˛ˇćś‰ĺś°ĺ›ľĺ?Ťĺ­—ďĽ‰
     * @returns {Promise<T | never>} ĺś°ĺ›ľćśŤĺŠˇäżˇć?Ż
     */
    getTileLayerInfo(url) {
        let that = this, epsgCode = that.baseProjection.split('EPSG:')[1];
        let requestUrl = that.getRequestUrl(`${url}/maps.json`);
        return FetchRequest.get(requestUrl, null, {
            withCredentials: this.withCredentials
        }).then(function (response) {
            return response.json()
        }).then(function (mapInfo) {
            let promises = [];
            if (mapInfo) {
                mapInfo.forEach(function (info) {
                    let mapUrl = that.getRequestUrl(`${info.path}.json?prjCoordSys=${encodeURI(JSON.stringify({epsgCode: epsgCode}))}`)
                    let promise = FetchRequest.get(mapUrl, null, {
                        withCredentials: that.withCredentials
                    }).then(function (response) {
                        return response.json()
                    }).then(function (restMapInfo) {
                        restMapInfo.url = info.path;
                        return restMapInfo
                    });
                    promises.push(promise);
                });
            }
            return Promise.all(promises).then(function (allRestMaps) {
                return allRestMaps
            })
        });
    }

    /**
     * é€ščż‡wktĺŹ‚ć•°ć‰©ĺ±•ć”ŻćŚ?ĺ¤šĺť?ć ‡çł»
     *
     * @param {string} wkt ĺ­—ç¬¦ä¸˛
     * @param {string} crsCode epsgäżˇć?ŻďĽŚĺ¦‚ďĽš "EPSG:4490"
     *
     * @returns {boolean} ĺť?ć ‡çł»ć?Żĺ?¦ć·»ĺŠ ć??ĺŠź
     */
    addProjctionFromWKT(wkt, crsCode) {
        if (typeof (wkt) !== 'string') {
            //ĺŹ‚ć•°ç±»ĺž‹é”™čŻŻ
            return false;
        } else {
            if (wkt === "EPSG:4326" || wkt === "EPSG:3857") {
                return true;
            } else {
                let epsgCode = crsCode || this.getEpsgInfoFromWKT(wkt);
                if (epsgCode) {
                    proj4.defs(epsgCode, wkt);
                    // é‡Ťć–°ćł¨ĺ†Śproj4ĺ?°ol.projďĽŚä¸Ťç„¶ä¸ŤäĽšç”źć•?
                    if (olProj4 && olProj4.register) {
                        olProj4.register(proj4);
                    } else if (window.ol.proj && window.ol.proj.setProj4) {
                        window.ol.proj.setProj4(proj4)
                    }
                    return true;
                } else {
                    // ĺŹ‚ć•°ç±»ĺž‹éťžwktć ‡ĺ‡†
                    return false;
                }
            }
        }
    }

    /**
     * é€ščż‡wktĺŹ‚ć•°čŽ·ĺŹ–ĺť?ć ‡äżˇć?Ż
     *
     * @param {string} wkt ĺ­—ç¬¦ä¸˛
     * @returns {string} epsg ĺ¦‚ďĽš"EPSG:4326"
     */
    getEpsgInfoFromWKT(wkt) {
        if (typeof (wkt) !== 'string') {
            return false;
        } else if (wkt.indexOf("EPSG") === 0) {
            return wkt;
        } else {
            let lastAuthority = wkt.lastIndexOf("AUTHORITY") + 10,
                endString = wkt.indexOf("]", lastAuthority) - 1;
            if (lastAuthority > 0 && endString > 0) {
                return `EPSG:${wkt.substring(lastAuthority, endString).split(",")[1].substr(1)}`;
            } else {
                return false;
            }
        }
    }

    /**
     * @private
     * @function WebMap.prototype.createMigrationLayer
     * @description ĺ?›ĺ»şčż?ĺľ™ĺ›ľ
     * @param {Object} layerInfo ĺ›ľĺ±‚äżˇć?Ż
     * @param {Array} features č¦?ç´ ć•°ç»„
     * @returns {ol.layer} ĺ›ľĺ±‚
     */
    createMigrationLayer(layerInfo, features) {
        // čŽ·ĺŹ–ĺ›ľĺ±‚ĺ¤–ĺŚ…DOM
        if (!window.EChartsLayer.prototype.getContainer) {
            window.EChartsLayer.prototype.getContainer = function () {
                return this.$container;
            };
        }
        // č®ľç˝®ĺ›ľĺ±‚ĺŹŻč§?ć€§
        if (!window.EChartsLayer.prototype.setVisible) {
            window.EChartsLayer.prototype.setVisible = function (visible) {
                if (visible) {
                    let options = this.get('options');
                    if (options) {
                        this.setChartOptions(options);
                        this.unset('options');
                    }
                } else {
                    let options = this.getChartOptions();
                    this.set('options', options);
                    this.clear();
                    this.setChartOptions({});
                }
            };
        }
        // č®ľç˝®ĺ›ľĺ±‚ĺ±‚çş§
        if (!window.EChartsLayer.prototype.setZIndex) {
            window.EChartsLayer.prototype.setZIndex = function (zIndex) {
                let container = this.getContainer();
                if (container) {
                    container.style.zIndex = zIndex;
                }
            };
        }
        /**
         * č®ľç˝®éĽ ć ‡ć ·ĺĽŹ
         * .cursor-default > div {
         *     cursor: default !important;
         * }
         */
        if (!window.EChartsLayer.prototype.setCursor) {
            window.EChartsLayer.prototype.setCursor = function (cursor = 'default') {
                let container = this.getContainer();
                if (container && cursor === 'default') {
                    container.classList.add('cursor-default');
                }
            }
        }
        let properties = getFeatureProperties(features);
        let lineData = this.createLinesData(layerInfo, properties);
        let pointData = this.createPointsData(lineData, layerInfo, properties);
        let options = this.createOptions(layerInfo, lineData, pointData);
        let layer = new window.EChartsLayer(options, {
            // hideOnMoving: true,
            // hideOnZooming: true
            //ä»Ąä¸‹ä¸‰ä¸ŞĺŹ‚ć•°ďĽŚĺ¦‚ćžśä¸ŤćŚ‰ç…§čż™ć ·č®ľç˝®ďĽŚäĽšé€ ć??ä¸ŤĺŹŻč§?ĺ›ľĺ±‚ć—¶ďĽŚçĽ©ć”ľčż?äĽšĺ‡şçŽ°ĺ›ľĺ±‚
            hideOnMoving: false,
            hideOnZooming: false,
            forcedPrecomposeRerender: true
        });
        layer.type = 'ECHARTS';
        return layer;
    }

    /**
     * @private
     * @function WebMap.prototype.createOptions
     * @description ĺ?›ĺ»şechartsçš„options
     * @param {Object} layerInfo ĺ›ľĺ±‚äżˇć?Ż
     * @param {Array} lineData çşżć•°ćŤ®
     * @param {Array} pointData ç‚ąć•°ćŤ®
     * @returns {Object} echartsĺŹ‚ć•°
     */
    createOptions(layerInfo, lineData, pointData) {
        let series;
        let lineSeries = this.createLineSeries(layerInfo, lineData);
        if (pointData && pointData.length) {
            let pointSeries = this.createPointSeries(layerInfo, pointData);
            series = lineSeries.concat(pointSeries);
        } else {
            series = lineSeries.slice();
        }
        let options = {
            series
        }
        return options;
    }

    /**
     * @private
     * @function WebMap.prototype.createLineSeries
     * @description ĺ?›ĺ»şçşżçł»ĺ?—
     * @param {Object} layerInfo ĺ›ľĺ±‚ĺŹ‚ć•°
     * @param {Array} lineData çşżć•°ćŤ®
     * @returns {Object} çşżçł»ĺ?—
     */
    createLineSeries(layerInfo, lineData) {
        let lineSetting = layerInfo.lineSetting;
        let animationSetting = layerInfo.animationSetting;
        let linesSeries = [
            // č˝¨čżąçşżć ·ĺĽŹ
            {
                name: 'line-series',
                type: 'lines',
                zlevel: 1,
                silent: true,
                effect: {
                    show: animationSetting.show,
                    constantSpeed: animationSetting.constantSpeed,
                    trailLength: 0,
                    symbol: animationSetting.symbol,
                    symbolSize: animationSetting.symbolSize
                },
                lineStyle: {
                    normal: {
                        color: lineSetting.color,
                        type: lineSetting.type,
                        width: lineSetting.width,
                        opacity: lineSetting.opacity,
                        curveness: lineSetting.curveness
                    }
                },
                data: lineData
            }
        ];

        if (lineData.length > MAX_MIGRATION_ANIMATION_COUNT) {
            // linesSeries[0].large = true;
            // linesSeries[0].largeThreshold = 100;
            linesSeries[0].blendMode = 'lighter';
        }

        return linesSeries;
    }

    /**
     * @private
     * @function WebMap.prototype.createPointSeries
     * @description ĺ?›ĺ»şç‚ąçł»ĺ?—
     * @param {Object} layerInfo ĺ›ľĺ±‚ĺŹ‚ć•°
     * @param {Array} pointData ç‚ąć•°ćŤ®
     * @returns {Object} ç‚ąçł»ĺ?—
     */
    createPointSeries(layerInfo, pointData) {
        let lineSetting = layerInfo.lineSetting;
        let animationSetting = layerInfo.animationSetting;
        let labelSetting = layerInfo.labelSetting;
        let pointSeries = [{
            name: 'point-series',
            coordinateSystem: 'geo',
            zlevel: 2,
            silent: true,
            label: {
                normal: {
                    show: labelSetting.show,
                    position: 'right',
                    formatter: '{b}',
                    color: labelSetting.color,
                    fontFamily: labelSetting.fontFamily
                }
            },
            itemStyle: {
                normal: {
                    color: lineSetting.color || labelSetting.color
                }
            },
            data: pointData
        }]

        if (animationSetting.show) {
            // ĺĽ€ĺ?ŻĺŠ¨ç”»
            pointSeries[0].type = 'effectScatter';
            pointSeries[0].rippleEffect = {
                brushType: 'stroke'
            }
        } else {
            // ĺ…łé—­ĺŠ¨ç”»
            pointSeries[0].type = 'scatter';
        }

        return pointSeries;
    }

    /**
     * @private
     * @function WebMap.prototype.createPointsData
     * @param {Array} lineData çşżć•°ćŤ®
     * @param {Object} layerInfo ĺ›ľĺ±‚äżˇć?Ż
     * @param {Array} properties ĺ±žć€§
     * @returns {Array} ç‚ąć•°ćŤ®
     */
    createPointsData(lineData, layerInfo, properties) {
        let data = [],
            labelSetting = layerInfo.labelSetting;
        // ć ‡ç­ľéš?č—Źĺ?™ç›´ćŽĄčż”ĺ›ž
        if (!labelSetting.show || !lineData.length) {
            return data;
        }
        let fromData = [], toData = [];
        lineData.forEach((item, idx) => {
            let coords = item.coords,
                fromCoord = coords[0],
                toCoord = coords[1],
                fromProperty = properties[idx][labelSetting.from],
                toProperty = properties[idx][labelSetting.to];
            // čµ·ĺ§‹ĺ­—ć®µĺŽ»é‡Ť
            let f = fromData.find(d => {
                return d.value[0] === fromCoord[0] && d.value[1] === fromCoord[1]
            });
            !f && fromData.push({
                name: fromProperty,
                value: fromCoord
            })
            // ç»?ç‚ąĺ­—ć®µĺŽ»é‡Ť
            let t = toData.find(d => {
                return d.value[0] === toCoord[0] && d.value[1] === toCoord[1]
            });
            !t && toData.push({
                name: toProperty,
                value: toCoord
            })
        });
        data = fromData.concat(toData);
        return data;
    }

    /**
     * @private
     * @function WebMap.prototype.createLinesData
     * @param {Object} layerInfo ĺ›ľĺ±‚äżˇć?Ż
     * @param {Array} properties ĺ±žć€§
     * @returns {Array} çşżć•°ćŤ®
     */
    createLinesData(layerInfo, properties) {
        let data = [];
        if (properties && properties.length) {
            // é‡Ťć–°čŽ·ĺŹ–ć•°ćŤ®
            let from = layerInfo.from,
                to = layerInfo.to,
                fromCoord, toCoord;
            if (from.type === 'XY_FIELD' && from['xField'] && from['yField'] && to['xField'] && to['yField']) {
                properties.forEach(property => {
                    let fromX = property[from['xField']],
                        fromY = property[from['yField']],
                        toX = property[to['xField']],
                        toY = property[to['yField']];
                    if (!fromX || !fromY || !toX || !toY) {
                        return;
                    }

                    fromCoord = [property[from['xField']], property[from['yField']]];
                    toCoord = [property[to['xField']], property[to['yField']]];
                    data.push({
                        coords: [fromCoord, toCoord]
                    })
                });
            } else if (from.type === 'PLACE_FIELD' && from['field'] && to['field']) {
                const centerDatas = provincialCenterData.concat(municipalCenterData);

                properties.forEach(property => {
                    let fromField = property[from['field']],
                        toField = property[to['field']];
                    fromCoord = centerDatas.find(item => {
                        return Util.isMatchAdministrativeName(item.name, fromField);
                    })
                    toCoord = centerDatas.find(item => {
                        return Util.isMatchAdministrativeName(item.name, toField);
                    })
                    if (!fromCoord || !toCoord) {
                        return;
                    }
                    data.push({
                        coords: [fromCoord.coord, toCoord.coord]
                    })
                });
            }
        }
        return data;
    }

    /**
     * @private
     * @function WebMap.prototype.getService
     * @description čŽ·ĺŹ–ĺ˝“ĺ‰Ťć•°ćŤ®ĺŹ‘ĺ¸?çš„ćśŤĺŠˇä¸­çš„ćź?ç§Ťç±»ĺž‹ćśŤĺŠˇ
     * @param {Array.<Object>} services ćśŤĺŠˇé›†ĺ??
     * @param {string} type ćśŤĺŠˇç±»ĺž‹ďĽŚRESTDATA, RESTMAP
     * @returns {Object} ćśŤĺŠˇ
     */
    getService(services, type) {
        let service = services.filter((info) => {
            return info && info.serviceType === type;
        });
        return service[0];
    }

    /**
     * @private
     * @function WebMap.prototype.isMvt
     * @description ĺ?¤ć–­ĺ˝“ĺ‰Ťč?˝ĺ?¦ä˝żç”¨ć•°ćŤ®ćśŤĺŠˇçš„mvtä¸Šĺ›ľć–ąĺĽŹ
     * @param {string} serviceUrl ć•°ćŤ®ćśŤĺŠˇçš„ĺś°ĺť€
     * @param {string} datasetName ć•°ćŤ®ćśŤĺŠˇçš„ć•°ćŤ®é›†ĺ?Ťç§°
     * @returns {Object} ć•°ćŤ®ćśŤĺŠˇçš„äżˇć?Ż
     */
    isMvt(serviceUrl, datasetName) {
        let that = this;
        return this.getDatasetsInfo(serviceUrl, datasetName).then((info) => {
            //ĺ?¤ć–­ć?Żĺ?¦ĺ’Śĺş•ĺ›ľĺť?ć ‡çł»ä¸€ç›´
            if (info.epsgCode == that.baseProjection.split('EPSG:')[1]) {
                return FetchRequest.get(that.getRequestUrl(`${info.url}/tilefeature.mvt`), null, {
                    withCredentials: that.withCredentials
                }).then(function (response) {
                    return response.json()
                }).then(function (result) {
                    info.isMvt = result.error && result.error.code === 400;
                    return info;
                }).catch(() => {
                    return info;
                });
            }
            return info;
        })
    }

    /**
     * @private
     * @function WebMap.prototype.getDatasetsInfo
     * @description čŽ·ĺŹ–ć•°ćŤ®é›†äżˇć?Ż
     * @param {string} serviceUrl ć•°ćŤ®ćśŤĺŠˇçš„ĺś°ĺť€
     * @param {string} datasetName ć•°ćŤ®ćśŤĺŠˇçš„ć•°ćŤ®é›†ĺ?Ťç§°
     * @returns {Object} ć•°ćŤ®ćśŤĺŠˇçš„äżˇć?Ż
     */
    getDatasetsInfo(serviceUrl, datasetName) {
        let that = this;
        return that.getDatasources(serviceUrl).then(function (datasourceName) {
            //ĺ?¤ć–­mvtćśŤĺŠˇć?Żĺ?¦ĺŹŻç”¨
            let url = `${serviceUrl}/data/datasources/${datasourceName}/datasets/${datasetName}.json`;
            return FetchRequest.get(that.getRequestUrl(url), null, {
                withCredentials: that.withCredentials
            }).then(function (response) {
                return response.json()
            }).then(function (datasetsInfo) {
                return {
                    epsgCode: datasetsInfo.datasetInfo.prjCoordSys.epsgCode,
                    bounds: datasetsInfo.datasetInfo.bounds,
                    url //čż”ĺ›žçš„ć?ŻĺŽźĺ§‹urlďĽŚć˛ˇćś‰ä»Łç?†ă€‚ĺ› ä¸şç”¨äşŽčŻ·ć±‚mvt
                };
            });
        })
    }

    /**
    * @private
    * @function WebMap.prototype.isRestMapMapboxStyle
    * @description ä»…ĺ?¤ć–­ć?Żĺ?¦ä¸şrestmap mvtĺś°ĺ›ľćśŤĺŠˇ rest-mapćśŤĺŠˇçš„Mapbox Stylečµ„ćş?ĺś°ĺť€ć?Żčż™ć ·çš„ďĽš .../iserver/services/map-Population/rest/maps/PopulationDistribution/tileFeature/vectorstyles.json?type=MapBox_GL&styleonly=true
    * @param {Object} layerInfo webmapä¸­çš„MapStylerLayer
    * @returns {boolean} ć?Żĺ?¦ä¸şrestmap mvtĺś°ĺ›ľćśŤĺŠˇ
    */
    isRestMapMapboxStyle(layerInfo) {
        const restMapMVTStr = '/tileFeature/vectorstyles.json?type=MapBox_GL&styleonly=true&tileURLTemplate=ZXY'
        let dataSource = layerInfo.dataSource;
        let layerType = layerInfo.layerType;
        if (dataSource && dataSource.type === "EXTERNAL"
            && dataSource.url.indexOf(restMapMVTStr) > -1
            && (layerType === "MAPBOXSTYLE" || layerType === "VECTOR_TILE")) {
            return true
        }
        return false
    }
    /**
     * @private
     * @function WebMap.prototype.getMapboxStyleLayerInfo
     * @description čŽ·ĺŹ–mapboxstyleĺ›ľĺ±‚äżˇć?Ż
     * @param {Object} layerInfo ĺ›ľĺ±‚äżˇć?Ż
     * @returns {Object}  ĺ›ľĺ±‚äżˇć?Ż
     */
    getMapboxStyleLayerInfo(mapInfo, layerInfo) {
        let _this = this;
        return new Promise((resolve, reject) => {
            return _this.getMapLayerExtent(layerInfo).then(layer => {
                return _this.getMapboxStyle(mapInfo, layer).then(styleLayer => {
                    Object.assign(layer, styleLayer);
                    resolve(layer)
                }).catch(error => {
                    reject(error);
                })
            }).catch(error => {
                reject(error);
            })
        })
    }
    /**
     * @private
     * @function WebMap.prototype.getMapLayerExtent
     * @description čŽ·ĺŹ–mapboxstyleĺ›ľĺ±‚äżˇć?Ż
     * @param {Object} layerInfo ĺ›ľĺ±‚äżˇć?Ż
     * @returns {Object}  ĺ›ľĺ±‚äżˇć?Ż
     */
    getMapLayerExtent(layerInfo) {
        const restMapMVTStr = '/tileFeature/vectorstyles.json?type=MapBox_GL&styleonly=true&tileURLTemplate=ZXY'
        let dataSource = layerInfo.dataSource;
        let url = dataSource.url;
        if (this.isRestMapMapboxStyle(layerInfo)) {
            url = url.replace(restMapMVTStr, '')
        }
        url = this.getRequestUrl(url + '.json')

        let credential = layerInfo.credential;
        let credentialValue,keyfix;
        //ć?şĺ¸¦ä»¤ç‰Ś(restmapç”¨çš„é¦–ĺ­—ćŻŤĺ¤§ĺ†™ďĽŚä˝†ć?Żčż™é‡Śč¦?ç”¨ĺ°Źĺ†™)
        if (credential) {
            keyfix = Object.keys(credential)[0]
            credentialValue = credential[keyfix];
            url = `${url}?${keyfix}=${credentialValue}`;
        }

        return FetchRequest.get(url, null, {
            withCredentials: this.withCredentials,
            withoutFormatSuffix: true,
            headers: {
                'Content-Type': 'application/json;chartset=uft-8'
            }
        }).then(function (response) {
            return response.json();
        }).then((result) => {
            layerInfo.visibleScales = result.visibleScales;
            layerInfo.coordUnit = result.coordUnit;
            layerInfo.scale = result.scale;
            layerInfo.epsgCode = result.prjCoordSys.epsgCode;
            layerInfo.bounds = result.bounds;
            return layerInfo;
        }).catch(error => {
            throw error;
        })
    }

    /**
     * @private
     * @function WebMap.prototype.getMapboxStyle
     * @description čŽ·ĺŹ–mapboxstyle --- iptä¸­č‡Şĺ®šäą‰ĺş•ĺ›ľčŻ·ć±‚mapboxstyleç›®ĺ‰Ťćś‰ä¸¤ç§Ťurlć ĽĺĽŹ
     * rest-mapćśŤĺŠˇçš„Mapbox Stylečµ„ćş?ĺś°ĺť€ć?Żčż™ć ·çš„ďĽš .../iserver/services/map-Population/rest/maps/PopulationDistribution/tileFeature/vectorstyles.json?type=MapBox_GL&styleonly=true
     * restjsrç‰‡ćśŤĺŠˇçš„Mapbox Stylečµ„ćş?ĺś°ĺť€ć?Żčż™ć ·çš„ďĽš.../iserver/services/map-china400/restjsr/v1/vectortile/maps/China/style.json
     * @param {Object} mapboxstyleĺ›ľĺ±‚äżˇć?Ż
     * @returns {Object} ĺ›ľĺ±‚äżˇć?Ż
     */
    getMapboxStyle(mapInfo, layerInfo) {
        let _this = this;
        let url = layerInfo.url || layerInfo.dataSource.url;
        let styleUrl = url;
        if (styleUrl.indexOf('/restjsr/') > -1) {
            styleUrl = `${styleUrl}/style.json`;
        }
        styleUrl = this.getRequestUrl(styleUrl)
        let credential = layerInfo.credential;
        //ć?şĺ¸¦ä»¤ç‰Ś(restmapç”¨çš„é¦–ĺ­—ćŻŤĺ¤§ĺ†™ďĽŚä˝†ć?Żčż™é‡Śč¦?ç”¨ĺ°Źĺ†™)
        let credentialValue, keyfix;
        if (credential) {
            keyfix = Object.keys(credential)[0]
            credentialValue = credential[keyfix];
            styleUrl = `${styleUrl}?${keyfix}=${credentialValue}`;
        }

        return FetchRequest.get(styleUrl, null, {
            withCredentials: this.withCredentials,
            withoutFormatSuffix: true,
            headers: {
                'Content-Type': 'application/json;chartset=uft-8'
            }
        }).then(function (response) {
            return response.json();
        }).then(styles => {
            _this._matchStyleObject(styles);
            let bounds = layerInfo.bounds;
            // ĺ¤„ç?†ć?şĺ¸¦ä»¤ç‰Śçš„ć?…ĺ†µ
            if (credentialValue) {
                styles.sprite = `${styles.sprite}?${keyfix}=${credentialValue}`;
                let sources = styles.sources;
                let sourcesNames = Object.keys(sources);
                sourcesNames.forEach(function (sourceName) {
                    styles.sources[sourceName].tiles.forEach(function (tiles, i) {
                        styles.sources[sourceName].tiles[i] = `${tiles}?${keyfix}=${credentialValue}`
                    })
                })
            }

            let newLayerInfo = {
                url: url,
                sourceType: 'VECTOR_TILE',
                layerType: 'VECTOR_TILE',
                styles: styles,
                extent: bounds && [bounds.left, bounds.bottom, bounds.right, bounds.top],
                bounds: layerInfo.bounds,
                projection: "EPSG:" + layerInfo.epsgCode,
                epsgCode: layerInfo.epsgCode,
                name: layerInfo.name
            }
            Object.assign(layerInfo, newLayerInfo)
            if (layerInfo.zIndex > 0) {
                // čż‡ć»¤styles  éťžĺş•ĺ›ľmapboxstyleĺ›ľĺ±‚ć‰Ťéś€ć­¤ĺ¤„ç?†
                _this.modifyMapboxstyleLayer(mapInfo, layerInfo);
            }
            return layerInfo;
        }).catch(error => {
            return error;
        })
    }

    /**
     * @private
     * @function WebMap.prototype.modifyMapboxstyleLayer
     * @description mapboxstyleĺ›ľĺ±‚ďĽš1. layer idé‡Ťĺ¤Ťé—®é˘?  2.ĺŹ ĺŠ ĺ›ľĺ±‚č?Ść™Żč‰˛é—®é˘?
     * @param {Object} mapInfo ĺś°ĺ›ľäżˇć?Ż
     * @param {Object} layerInfo ĺ˝“ĺ‰Ťč¦?ć·»ĺŠ ĺ?°ĺś°ĺ›ľçš„ĺ›ľĺ±‚
     */
    modifyMapboxstyleLayer(mapInfo, layerInfo) {
        let that = this;
        if (mapInfo.layers && mapInfo.layers.length === 0) {return;}
        let curLayers = layerInfo.styles.layers;
        if (!curLayers) {return;}
        // éťžĺş•ĺ›ľďĽŚĺ?™ç§»é™¤"background"ĺ›ľĺ±‚
        curLayers = curLayers.filter(layer => layer.type !== "background");
        layerInfo.styles.layers = curLayers;
        // ĺ¤„ç?†mapboxstyleĺ›ľĺ±‚layer idé‡Ťĺ¤Ťçš„ć?…ĺ†µ
        let addedLayersArr = mapInfo.layers.filter(layer => layer.layerType === 'VECTOR_TILE' && layer.zIndex !== layerInfo.zIndex)
            .map(addLayer => addLayer.styles && addLayer.styles.layers);
        if (!addedLayersArr || addedLayersArr && addedLayersArr.length === 0) {return;}
        addedLayersArr.forEach(layers => {
            curLayers.forEach(curLayer => {
                that.renameLayerId(layers, curLayer);
            })
        })
    }
    /**
     * @private
     * @function  WebMap.prototype.renameLayerId
     * @description  mapboxstyleĺ›ľĺ±‚ idé‡Ťĺ¤Ťçš„layerć·»ĺŠ ĺ?ŽçĽ€çĽ–ç ? (n)[ĺŹ‚č€?mapstudio]
     * @param {mapboxgl.Layer[]} layers ĺ·˛ć·»ĺŠ ĺ?°ĺś°ĺ›ľçš„ĺ›ľĺ±‚ç»„
     * @param {mapboxgl.Layer} curLayer ĺ˝“ĺ‰Ťĺ›ľĺ±‚
     */
    renameLayerId(layers, curLayer) {
        if (layers.find((l) => l.id === curLayer.id)) {

            const result = curLayer.id.match(/(.+)\((\w)\)$/);
            if (result) {
                curLayer.id = `${result[1]}(${+result[2] + 1})`;
            } else {
                curLayer.id += '(1)';
            }
            if (layers.find((l) => l.id === curLayer.id)) {
                this.renameLayerId(layers, curLayer);
            }
        }
    }
    /**
	 * @private
	 * @function mapboxgl.supermap.WebMap.prototype._matchStyleObject
	 * @description ć?˘ĺ¤Ť style ä¸şć ‡ĺ‡†ć ĽĺĽŹă€‚
	 * @param {Object} style - mapbox ć ·ĺĽŹă€‚
	 */
    _matchStyleObject(style) {
        let {sprite, glyphs} = style;
        if (sprite && typeof sprite === 'object') {
            style.sprite = Object.values(sprite)[0];
        }
        if (glyphs && typeof glyphs === 'object') {
            style.glyphs = Object.values(glyphs)[0];
        }
    }

    /**
     * @private
     * @function  WebMap.prototype.renameLayerId
     * @description ĺ?¤ć–­urlć?Żĺ?¦ć?Żiportalçš„ä»Łç?†ĺś°ĺť€
     * @param {*} serviceUrl
     */
    isIportalProxyServiceUrl(serviceUrl) {
        if (this.serviceProxy && this.serviceProxy.enable && serviceUrl) {
            let proxyStr = '';
            if (this.serviceProxy.proxyServerRootUrl) {
                proxyStr = `${this.serviceProxy.proxyServerRootUrl}/`;
            } else if (this.serviceProxy.rootUrlPostfix) {
                proxyStr = `${this.serviceProxy.port}/${this.serviceProxy.rootUrlPostfix}/`;
            } else if (!this.serviceProxy.rootUrlPostfix) {
                proxyStr = `${this.serviceProxy.port}/`;
            }
            if (this.serviceProxy.port !== 80) {
                return serviceUrl.indexOf(proxyStr) >= 0;
            } else {
                // ä»Łç?†ç«ŻĺŹŁä¸ş80ďĽŚurlä¸­ä¸Ťä¸€ĺ®šćś‰ç«ŻĺŹŁďĽŚć»ˇč¶łä¸€ç§Ťć?…ĺ†µĺŤłĺŹŻ
                return serviceUrl.indexOf(proxyStr) >= 0 || serviceUrl.indexOf(proxyStr.replace(':80', '')) >= 0;
            }
        } else {
            return false
        }
    }
    /**
     * @private
     * @function  WebMap.prototype.getStyleResolutions
     * @description ĺ?›ĺ»şĺ›ľĺ±‚ĺ?†čľ¨çŽ‡
     * @param {Object} bounds  ĺ›ľĺ±‚ä¸Šä¸‹ĺ·¦ĺŹłčŚ?ĺ›´
     * @returns {Array} styleResolutions ć ·ĺĽŹĺ?†čľ¨çŽ‡
     */
    getStyleResolutions(bounds, minZoom = 0, maxZoom = 22) {
        let styleResolutions = [];
        const TILE_SIZE = 512
        let temp = Math.abs(bounds.left - bounds.right) / TILE_SIZE;
        for (let i = minZoom; i <= maxZoom; i++) {
            if (i === 0) {
                styleResolutions[i] = temp;
                continue;
            }
            temp = temp / 2;
            styleResolutions[i] = temp;
        }
        return styleResolutions;
    }


    /**
     * @private
     * @function  WebMap.prototype.createVisibleResolution
     * @description ĺ?›ĺ»şĺ›ľĺ±‚ĺŹŻč§†ĺ?†čľ¨çŽ‡
     * @param {Array.<number>} visibleScales ĺŹŻč§†ćŻ”äľ‹ĺ°şčŚ?ĺ›´
     * @param {Array} indexbounds
     * @param {Object} bounds  ĺ›ľĺ±‚ä¸Šä¸‹ĺ·¦ĺŹłčŚ?ĺ›´
     * @param {string} coordUnit
     * @returns {Array} visibleResolution
     */
    createVisibleResolution(visibleScales, indexbounds, bounds, coordUnit) {
        let visibleResolution = [];
        // 1 č®ľç˝®äş†ĺś°ĺ›ľvisibleScalesçš„ć?…ĺ†µ
        if (visibleScales && visibleScales.length > 0) {
            visibleResolution = visibleScales.map(scale => {
                let value = 1 / scale;
                let res = this.getResFromScale(value, coordUnit);
                return res;
            })
        } else {
            // 2 ĺś°ĺ›ľçš„bounds
            let envelope = this.getEnvelope(indexbounds, bounds);
            visibleResolution = this.getStyleResolutions(envelope);
        }
        return visibleResolution
    }

    /**
     * @private
     * @function  WebMap.prototype.createVisibleResolution
     * @description ĺ›ľĺ±‚čľąç•ŚčŚ?ĺ›´
     * @param {Array} indexbounds
     * @param {Object} bounds  ĺ›ľĺ±‚ä¸Šä¸‹ĺ·¦ĺŹłčŚ?ĺ›´
     * @returns {Object} envelope
     */
    getEnvelope(indexbounds, bounds) {
        let envelope = {};
        if (indexbounds && indexbounds.length === 4) {
            envelope.left = indexbounds[0];
            envelope.bottom = indexbounds[1];
            envelope.right = indexbounds[2];
            envelope.top = indexbounds[3];
        } else {
            envelope = bounds;
        }
        return envelope
    }
    /**
     * @private
     * @function WebMap.prototype.createMVTLayer
     * @description ĺ?›ĺ»şçź˘é‡Źç“¦ç‰‡ĺ›ľĺ±‚
     * @param {Object} layerInfo - ĺ›ľĺ±‚äżˇć?Ż
     */
    createMVTLayer(layerInfo) {
        // let that = this;
        let styles = layerInfo.styles;
        const indexbounds = styles && styles.metadata && styles.metadata.indexbounds;
        const visibleResolution = this.createVisibleResolution(layerInfo.visibleScales, indexbounds, layerInfo.bounds, layerInfo.coordUnit);
        const envelope = this.getEnvelope(indexbounds, layerInfo.bounds);
        const styleResolutions = this.getStyleResolutions(envelope);
        // const origin = [envelope.left, envelope.top];
        let withCredentials = this.isIportalProxyServiceUrl(styles.sprite);
        // ĺ?›ĺ»şMapBoxStyleć ·ĺĽŹ
        let mapboxStyles = new MapboxStyles({
            style: styles,
            source: styles.name,
            resolutions: styleResolutions,
            map: this.map,
            withCredentials
        });
        return new Promise((resolve) => {
            mapboxStyles.on('styleloaded', function () {
                let minResolution = visibleResolution[visibleResolution.length - 1];
                let maxResolution = visibleResolution[0];
                let layer = new olLayer.VectorTile({
                    //č®ľç˝®é?żč®©ĺŹ‚ć•°
                    declutter: true,
                    source: new VectorTileSuperMapRest({
                        style: styles,
                        withCredentials,
                        projection: layerInfo.projection,
                        format: new MVT({
                            featureClass: olRenderFeature
                        }),
                        wrapX: false
                    }),
                    style: mapboxStyles.featureStyleFuntion,
                    visible: layerInfo.visible,
                    zIndex: layerInfo.zIndex,
                    opacity: layerInfo.opacity,
                    minResolution,
                    // The maximum resolution (exclusive) below which this layer will be visible.
                    maxResolution: maxResolution > 1 ? Math.ceil(maxResolution) : maxResolution * 1.1
                });
                resolve(layer);
            })
        })
    }

    /**
     * @private
     * @function WebMap.prototype.isSameDomain
     * @description ĺ?¤ć–­ć?Żĺ?¦ĺ?Śĺźźĺ?ŤďĽ?ĺ¦‚ćžść?Żĺźźĺ?ŤďĽŚĺŹŞĺ?¤ć–­ĺ?Žé—¨ä¸¤çş§ĺźźĺ?Ťć?Żĺ?¦ç›¸ĺ?ŚďĽŚç¬¬ä¸€çş§ĺż˝ç•ĄďĽ‰ďĽŚĺ¦‚ćžść?Żipĺś°ĺť€ĺ?™éś€č¦?ĺ®Śĺ…¨ç›¸ĺ?Śă€‚
     * @param {*} url
     */
    isSameDomain(url) {
        let documentUrlArray = url.split("://"), substring = documentUrlArray[1];
        let domainIndex = substring.indexOf("/"), domain = substring.substring(0, domainIndex);

        let documentUrl = document.location.toString();
        let docUrlArray = documentUrl.split("://"), documentSubstring = docUrlArray[1];
        let docuDomainIndex = documentSubstring.indexOf("/"), docDomain = documentSubstring.substring(0, docuDomainIndex);

        if (domain.indexOf(':') > -1 || window.location.port !== "") {
            //čŻ´ć?Žç”¨çš„ć?Żipĺś°ĺť€ďĽŚĺ?¤ć–­ĺ®Ść•´ĺźźĺ?Ťĺ?¤ć–­
            return domain === docDomain;
        } else {
            let domainArray = domain.split('.'), docDomainArray = docDomain.split('.');
            return domainArray[1] === docDomainArray[1] && domainArray[2] === docDomainArray[2];
        }
    }
    /**
     * @private
     * @function WebMap.prototype.isSupportWebp
     * @description ĺ?¤ć–­ć?Żĺ?¦ć”ŻćŚ?webP
     * @param {*} url ćśŤĺŠˇĺś°ĺť€
     * @param {*} token ćśŤĺŠˇtoken
     * @returns {boolean}
     */
    isSupportWebp(url, token) {
        // čż?éś€č¦?ĺ?¤ć–­ćµŹč§?ĺ™¨
        let isIE = this.isIE();
        if (isIE || (this.isFirefox() && this.getFirefoxVersion() < 65) ||
            (this.isChrome() && this.getChromeVersion() < 32)) {
            return false;
        }
        url = token ? `${url}/tileImage.webp?token=${token}` : `${url}/tileImage.webp`;
        let isSameDomain = CommonUtil.isInTheSameDomain(url), excledeCreditial;
        if (isSameDomain && !token) {
            // onlineä¸ŠćśŤĺŠˇĺźźĺ?Ťä¸€ç›´ďĽŚč¦?ç”¨tokenĺ€Ľ
            excledeCreditial = false;
        } else {
            excledeCreditial = true;
        }
        url = this.getRequestUrl(url, excledeCreditial);
        return FetchRequest.get(url, null, {
            withCredentials: this.withCredentials,
            withoutFormatSuffix: true
        }).then(function (response) {
            if (response.status !== 200) {
                throw response.status;
            }
            return response;
        }).then(() => {
            return true;
        }).catch(() => {
            return false;
        })
    }
    /**
    * @private
    * @function WebMap.prototype.isIE
    * @description ĺ?¤ć–­ĺ˝“ĺ‰ŤćµŹč§?ĺ™¨ć?Żĺ?¦ä¸şIE
    * @returns {boolean}
    */
    isIE() {
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
            return true;
        }
        return false;
    }

    /**
     * @private
     * @function WebMap.prototype.isFirefox
     * @description  ĺ?¤ć–­ĺ˝“ĺ‰ŤćµŹč§?ĺ™¨ć?Żĺ?¦ä¸ş firefox
     * @returns {boolean}
     */
    isFirefox() {
        let userAgent = navigator.userAgent;
        return userAgent.indexOf("Firefox") > -1;
    }

    /**
     * @private
     * @function WebMap.prototype.isChrome
     * @description  ĺ?¤ć–­ĺ˝“ĺ‰ŤćµŹč§?ĺ™¨ć?Żĺ?¦ä¸şč°·ć­Ś
     * @returns {boolean}
     */
    isChrome() {
        let userAgent = navigator.userAgent;
        return userAgent.indexOf("Chrome") > -1;
    }

    /**
     * @private
     * @function WebMap.prototype.getFirefoxVersion
     * @description čŽ·ĺŹ–ç?«ç‹?ćµŹč§?ĺ™¨çš„ç‰?ćś¬ĺŹ·
     * @returns {number}
     */
    getFirefoxVersion() {
        let userAgent = navigator.userAgent.toLowerCase(),
            version = userAgent.match(/firefox\/([\d.]+)/);
        return +version[1];
    }

    /**
     * @private
     * @function WebMap.prototype.getChromeVersion
     * @description čŽ·ĺŹ–č°·ć­ŚćµŹč§?ĺ™¨ç‰?ćś¬ĺŹ·
     * @returns {number}
     */
    getChromeVersion() {
        let userAgent = navigator.userAgent.toLowerCase(),
            version = userAgent.match(/chrome\/([\d.]+)/);
        return +version[1];
    }

    /**
     * @private
     * @function WebMap.prototype.addGraticule
     * @description ĺ?›ĺ»şç»Źçş¬ç˝‘
     * @param {Object} mapInfo - ĺś°ĺ›ľäżˇć?Ż
     */
    addGraticule(mapInfo) {
        if(this.isHaveGraticule) {
            this.createGraticuleLayer(mapInfo.grid.graticule);
            this.layerAdded++;
            const lens = mapInfo.layers ? mapInfo.layers.length : 0;
            this.sendMapToUser(lens);
        }
    }

    /**
     * @private
     * @function WebMap.prototype.createGraticuleLayer
     * @description ĺ?›ĺ»şç»Źçş¬ç˝‘ĺ›ľĺ±‚
     * @param {Object} layerInfo - ĺ›ľĺ±‚äżˇć?Ż
     * @returns {ol.layer.Vector} çź˘é‡Źĺ›ľĺ±‚
     */
    createGraticuleLayer(layerInfo) {
        const { strokeColor, strokeWidth, lineDash, extent, visible, interval, lonLabelStyle, latLabelStyle } = layerInfo;
        const epsgCode = this.baseProjection;
        // ć·»ĺŠ ç»Źçş¬ç˝‘éś€č¦?č®ľç˝®extentă€?worldExtent
        let projection = new olProj.get(epsgCode);
        projection.setExtent(extent);
        projection.setWorldExtent(olProj.transformExtent(extent, epsgCode, 'EPSG:4326'));

        let graticuleOptions = {
            layerID: 'graticule_layer',
            strokeStyle: new StrokeStyle({
                color: strokeColor,
                width: strokeWidth,
                lineDash
            }),
            extent,
            visible: visible,
            intervals: interval,
            showLabels: true,
            zIndex: 9999,
            wrapX: false,
            targetSize: 0
        };
        lonLabelStyle && (graticuleOptions.lonLabelStyle = new Text({
            font: `${lonLabelStyle.fontSize} ${lonLabelStyle.fontFamily}`,
            textBaseline: lonLabelStyle.textBaseline,
            fill: new FillStyle({
                color: lonLabelStyle.fill
            }),
            stroke: new StrokeStyle({
                color: lonLabelStyle.outlineColor,
                width: lonLabelStyle.outlineWidth
            })
        }))
        latLabelStyle && (graticuleOptions.latLabelStyle = new Text({
            font: `${latLabelStyle.fontSize} ${latLabelStyle.fontFamily}`,
            textBaseline: latLabelStyle.textBaseline,
            fill: new FillStyle({
                color: latLabelStyle.fill
            }),
            stroke: new StrokeStyle({
                color: latLabelStyle.outlineColor,
                width: latLabelStyle.outlineWidth
            })
        }))
        const layer = new olLayer.Graticule(graticuleOptions);
        this.map.addLayer(layer);
    }
    /**
     * @private
     * @function WebMap.prototype.getLang
     * @description ćŁ€ćµ‹ĺ˝“ĺ‰Ťcookieä¸­çš„čŻ­č¨€ć?–č€…ćµŹč§?ĺ™¨ć‰€ç”¨čŻ­č¨€
     * @returns {string} čŻ­č¨€ĺ?Ťç§°ďĽŚĺ¦‚zh-CN
     */
    getLang() {
        if(this.getCookie('language')) {
            const cookieLang = this.getCookie('language');
            return this.formatCookieLang(cookieLang);
        } else {
            const browerLang = navigator.language || navigator.browserLanguage;
            return browerLang;
        }
    }
    /**
     * @private
     * @function WebMap.prototype.getCookie
     * @description čŽ·ĺŹ–cookieä¸­ćź?ä¸ŞkeyĺŻąĺş”çš„ĺ€Ľ
     * @returns {string} ćź?ä¸ŞkeyĺŻąĺş”çš„ĺ€Ľ
     */
    getCookie(key) {
        key = key.toLowerCase();
        let value = null;
        let cookies = document.cookie.split(';');
        cookies.forEach(function (cookie) {
            const arr = cookie.split('=');
            if (arr[0].toLowerCase().trim() === key) {
                value = arr[1].trim();
                return;
            }
        });
        return value;
    }
    /**
     * @private
     * @function WebMap.prototype.formatCookieLang
     * @description ĺ°†ä»Žcookieä¸­čŽ·ĺŹ–çš„lang,č˝¬ćŤ˘ć??ĺ…¨ç§°ďĽŚĺ¦‚zh=>zh-CN
     * @returns {string} č˝¬ćŤ˘ĺ?Žçš„čŻ­č¨€ĺ?Ťç§°
     */
    formatCookieLang(cookieLang) {
        let lang;
        switch(cookieLang) {
            case 'zh':
                lang = 'zh-CN';
                break;
            case 'ar':
                lang = 'ar-EG';
                break;
            case 'bg':
                lang = 'bg-BG';
                break;
            case 'ca':
                lang = 'ca-ES';
                break;
            case 'cs':
                lang = 'cs-CZ';
                break;
            case 'da':
                lang = 'da-DK';
                break;
            case 'de':
                lang = 'de-DE';
                break;
            case 'el':
                lang = 'el-GR';
                break;
            case 'es':
                lang = 'es-ES';
                break;
            case 'et':
                lang = 'et-EE';
                break;
            case 'fa':
                lang = 'fa-IR';
                break;
            case 'fl':
                lang = 'fi-FI';
                break;
            case 'fr':
                lang = 'fr-FR';
                break;
            case 'he':
                lang = 'he-IL';
                break;
            case 'hu':
                lang = 'hu-HU';
                break;
            case 'id':
                lang = 'id-ID';
                break;
            case 'is':
                lang = 'is-IS';
                break;
            case 'it':
                lang = 'it-IT';
                break;
            case 'ja':
                lang = 'ja-JP';
                break;
            case 'ko':
                lang = 'ko-KR';
                break;
            case 'ku':
                lang = 'ku-IQ';
                break;
            case 'mn':
                lang = 'mn-MN';
                break;
            case 'nb':
                lang = 'nb-NO';
                break;
            case 'ne':
                lang = 'ne-NP';
                break;
            case 'nl':
                lang = 'nl-NL';
                break;
            case 'pl':
                lang = 'pl-PL';
                break;
            case 'pt':
                lang = 'pt-PT';
                break;
            case 'ru':
                lang = 'ru-RU';
                break;
            case 'sk':
                lang = 'sk-SK';
                break;
            case 'sl':
                lang = 'sl-SI';
                break;
            case 'sr':
                lang = 'sr-RS';
                break;
            case 'sv':
                lang = 'sv-SE';
                break;
            case 'th':
                lang = 'th-TH';
                break;
            case 'tr':
                lang = 'tr-TR';
                break;
            case 'uk':
                lang = 'uk-UA';
                break;
            case 'vi':
                lang = 'vi-VN';
                break;
            default:
                lang = 'en-US';
                break;
        }
        return lang;
    }
    isCustomProjection(projection) {
        if(Util.isNumber(projection)){
            return [-1000,-1].includes(+projection)
        }
        return ['EPSG:-1000','EPSG:-1'].includes(projection);
    }
}
