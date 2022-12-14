/* CopyrightÂ© 2000 - 2022 SuperMap Software Co.Ltd. All rights reserved.
 * This program are made available under the terms of the Apache License, Version 2.0
 * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html.*/
import mapboxgl from 'mapbox-gl';
import { Util as CommonUtil } from '@supermap/iclient-common/commontypes/Util';
import { StringExt } from '@supermap/iclient-common/commontypes/BaseTypes';
import { FetchRequest } from '@supermap/iclient-common/util/FetchRequest';
import { ArrayStatistic } from '@supermap/iclient-common/util/ArrayStatistic';
import { ColorsPickerUtil } from '@supermap/iclient-common/util/ColorsPickerUtil';
import { QueryOption } from '@supermap/iclient-common/REST';
import { GetFeaturesBySQLParameters } from '@supermap/iclient-common/iServer/GetFeaturesBySQLParameters';
import { GetFeaturesBySQLService } from '@supermap/iclient-common/iServer/GetFeaturesBySQLService';
import { QueryBySQLParameters } from '@supermap/iclient-common/iServer/QueryBySQLParameters';
import { FilterParameter } from '@supermap/iclient-common/iServer/FilterParameter';
import { Lang } from '@supermap/iclient-common/lang/Lang';
import { Util } from '../core/Util';
import { QueryService } from '../services/QueryService';
import convert from 'xml-js';
import Canvg from 'canvg';


const MB_SCALEDENOMINATOR_3857 = [
	'559082264.0287178',
	'279541132.0143589',
	'139770566.0071794',
	'69885283.00358972',
	'34942641.50179486',
	'17471320.75089743',
	'8735660.375448715',
	'4367830.1877224357',
	'2183915.093862179',
	'1091957.546931089',
	'545978.7734655447',
	'272989.7734655447',
	'272989.3867327723',
	'136494.6933663862',
	'68247.34668319309',
	'34123.67334159654',
	'17061.83667079827',
	'8530.918335399136',
	'4265.459167699568',
	'2132.729583849784'
];
const MB_SCALEDENOMINATOR_4326 = [
	'5.590822640287176E8',
	'2.795411320143588E8',
	'1.397705660071794E8',
	'6.98852830035897E7',
	'3.494264150179485E7',
	'1.7471320750897426E7',
	'8735660.375448713',
	'4367830.187724357',
	'2183915.0938621783',
	'1091957.5469310891',
	'545978.7734655446',
	'272989.3867327723',
	'136494.69336638614',
	'68247.34668319307',
	'34123.673341596535',
	'17061.836670798268',
	'8530.918335399134'
];
const DEFAULT_WELLKNOWNSCALESET = ['GoogleCRS84Quad', 'GoogleMapsCompatible'];

/**
 * @class WebMap
 * @version 9.1.2
 * @category  iPortal/Online Resources Map
 * @classdesc ĺŻąćŽĄ iPortal/Online ĺś°ĺ›ľç±»ă€‚ç›®ĺ‰Ťć”ŻćŚ?ĺś°ĺ›ľĺť?ć ‡çł»ĺŚ…ć‹¬ďĽš'EPSG:3857'ďĽŚ'EPSG:4326'ďĽŚ'EPSG:4490'ďĽŚ'EPSG:4214'ďĽŚ'EPSG:4610'ă€‚
 * <div style="padding: 20px;border: 1px solid #eee;border-left-width: 5px;border-radius: 3px;border-left-color: #ce4844;">
 *      <p style="color: #ce4844">Notice</p>
 *      <p style="font-size: 13px">čŻĄĺŠźč?˝äľťčµ– <a href='https://iclient.supermap.io/web/libs/geostats/geostats.js'>geostats</a> ĺ’Ś <a href='https://iclient.supermap.io/web/libs/jsonsql/jsonsql.js'>JsonSql</a> ćŹ’ä»¶ďĽŚčŻ·çˇ®č®¤ĺĽ•ĺ…ĄčŻĄćŹ’ä»¶ă€‚</p>
 *      <p style="font-size: 13px">&lt;script type="text/javascript" src="https://iclient.supermap.io/web/libs/geostats/geostats.js"&gt;&lt;/script&gt;</p>
 *      <p style="font-size: 13px">&lt;script type="text/javascript" src="https://iclient.supermap.io/web/libs/jsonsql/jsonsql.js"&gt;&lt;/script&gt;</p>
 * </div>
 * @param {number} id - iPortal|Online ĺś°ĺ›ľ IDă€‚
 * @param {Object} options - ĺŹ‚ć•°ă€‚
 * @param {string} [options.target='map'] - ĺś°ĺ›ľĺ®ąĺ™¨ IDă€‚
 * @param {string} [options.server="https://www.supermapol.com"] - ĺś°ĺ›ľçš„ĺś°ĺť€ă€‚
 * @param {string} [options.credentialKey] - ĺ‡­čŻ?ĺŻ†é’Ąă€‚
 * @param {string} [options.credentialValue] - ĺ‡­čŻ?ĺ€Ľă€‚
 * @param {boolean} [options.withCredentials=false] - čŻ·ć±‚ć?Żĺ?¦ć?şĺ¸¦ cookieă€‚
 * @param {boolean} [options.excludePortalProxyUrl] - ćśŤĺŠˇç«ŻäĽ é€’čż‡ćťĄçš„ URL ć?Żĺ?¦ĺ¸¦ćś‰ä»Łç?†ă€‚
 * @fires WebMap#getmapfailed
 * @fires WebMap#getwmtsfailed
 * @fires WebMap#getlayersfailed
 * @fires WebMap#getfeaturesfailed
 * @fires WebMap#addlayerssucceeded
 * @extends {mapboxgl.Evented}
 * @usage
 */
export class WebMap extends mapboxgl.Evented {
	constructor(id, options) {
		super();
		this.mapId = id;
		options = options || {};
		this.server = options.server || 'https://www.supermapol.com';
		this.credentialKey = options.credentialKey;
		this.credentialValue = options.credentialValue;
		this.withCredentials = options.withCredentials || false;
		this.target = options.target || 'map';
    this._canvgsV = [];
		this._createWebMap();
    this.on('mapinitialized', () => {
      this.map.on('remove', () => {
        this._stopCanvg();
      });
    });
	}
	/**
	 * @function WebMap.prototype.resize
	 * @description ĺś°ĺ›ľ resizeă€‚
	 */
	resize() {
		this.map.resize();
  }

	/**
	 * @function WebMap.prototype.setMapId
	 * @param {string} mapId - webMap ĺś°ĺ›ľ IDă€‚
	 * @description č®ľç˝® WebMap IDă€‚
	 */
	setMapId(mapId) {
		this.mapId = mapId;
		this._createWebMap();
  }

  /**
	 * @function WebMap.prototype.setWebMapOptions
	 * @param {Object} webMapOptions - webMap ĺŹ‚ć•°ă€‚
	 * @description č®ľç˝® webMap ĺŹ‚ć•°ă€‚
	 */
	setWebMapOptions(webMapOptions) {
		this.server = webMapOptions.server;
		this._createWebMap();
	}

  /**
	 * @function WebMap.prototype.setMapOptions
	 * @param {Object} mapOptions - map ĺŹ‚ć•°ă€‚
	 * @description č®ľç˝® map ĺŹ‚ć•°ă€‚
	 */
	setMapOptions(mapOptions) {
		let { center, zoom, maxBounds, minZoom, maxZoom, isWorldCopy, bearing, pitch } = mapOptions;
		center && center.length && this.map.setCenter(center);
		zoom && this.map.setZoom(zoom);
		maxBounds && this.map.setMaxBounds(maxBounds);
		minZoom && this.map.setMinZoom(minZoom);
		maxZoom && this.map.setMaxZoom(maxZoom);
		isWorldCopy && this.map.setRenderWorldCopies(isWorldCopy);
		bearing && this.map.setBearing(bearing);
		pitch && this.map.setPitch(pitch);
	}

	/**
	 * @private
	 * @function WebMap.prototype._createWebMap
	 * @description ç™»é™†çŞ—ĺŹŁĺ?Žć·»ĺŠ ĺś°ĺ›ľĺ›ľĺ±‚ă€‚
	 */
	_createWebMap() {
		let urlArr = this.server.split('');
		if (urlArr[urlArr.length - 1] !== '/') {
			this.server += '/';
		}
		let mapUrl = this.server + 'web/maps/' + this.mapId + '/map';
		if (this.credentialValue && this.credentialKey) {
			mapUrl += '?' + this.credentialKey + '=' + this.credentialValue;
		}
		let filter = 'getUrlResource.json?url=';
		if (this.excludePortalProxyUrl && this.server.indexOf(filter) > -1) {
			//ĺ¤§ĺ±Źéś€ć±‚,ć?–č€…ćś‰ĺŠ ä¸Šä»Łç?†çš„
			let urlArray = this.server.split(filter);
			if (urlArray.length > 1) {
				mapUrl = urlArray[0] + filter + this.server + 'web/maps/' + this.mapId + '/map.json';
			}
		}
		this._getMapInfo(mapUrl);
	}

	/**
	 * @private
	 * @function WebMap.prototype._createMap
	 * @description ĺ?›ĺ»şĺś°ĺ›ľă€‚
	 */
	_createMap(mapInfo) {
		// čŽ·ĺŹ–ĺ­—ä˝“ć ·ĺĽŹ
		let fonts = [];
		let layers = mapInfo.layers;
		// čŽ·ĺŹ– label ĺ›ľĺ±‚ĺ­—ä˝“ç±»ĺž‹
		if (layers && layers.length > 0) {
			layers.forEach(layer => {
				layer.labelStyle && fonts.push(layer.labelStyle.fontFamily);
			}, this);
		}
		fonts.push("'supermapol-icons'");
		let fontFamilys = fonts.join(',');

		// zoom center
		let oldcenter = mapInfo.center,
			zoom = mapInfo.level || 0,
            center,
            zoomBase = 0;
        // zoom = zoom === 0 ? 0 : zoom - 1;
        if (mapInfo.minScale && mapInfo.maxScale) {
            zoomBase = this._transformScaleToZoom(mapInfo.minScale, mapboxgl.CRS ? mapboxgl.CRS.get(this.baseProjection):'EPSG:3857');
        } else {
			const e =
                this._getResolution(
                    mapboxgl.CRS
                        ? mapboxgl.CRS.get(this.baseProjection).getExtent()
                        : [-20037508.3427892, -20037508.3427892, 20037508.3427892, 20037508.3427892]
                ) / this._getResolution(mapInfo.extent);
            zoomBase = +Math.log(e) / Math.LN2.toFixed(2);
        }
        zoom += zoomBase;
		center = oldcenter ? this._unproject([oldcenter.x, oldcenter.y]) : new mapboxgl.LngLat(0, 0);
		// ĺ?ťĺ§‹ĺŚ– map
		this.map = new mapboxgl.Map({
			container: this.target,
			center: center,
			zoom: zoom,
			style: {
				version: 8,
				sources: {},
				// "glyphs": 'https://iclient.supermap.io/iserver/services/map-beijing/rest/maps/beijingMap/tileFeature/sdffonts/{fontstack}/{range}.pbf',
				layers: []
			},
			crs: this.baseProjection,
			localIdeographFontFamily: fontFamilys || ''
		});
		this.fire('mapinitialized');
	}

	/**
	 * @private
	 * @function WebMap.prototype._getMapInfo
	 * @description čŽ·ĺŹ–ĺś°ĺ›ľçš„ JSON äżˇć?Żă€‚
	 * @param {string} url - čŻ·ć±‚ĺś°ĺ›ľçš„ urlă€‚
	 */
	_getMapInfo(url) {
		let mapUrl = url.indexOf('.json') === -1 ? `${url}.json` : url;
		FetchRequest.get(mapUrl, null, { withCredentials: this.withCredentials })
			.then(response => {
				return response.json();
			})
			.then(mapInfo => {
				this.baseProjection = mapInfo.projection;

				//ĺ­?ĺ‚¨ĺś°ĺ›ľçš„ĺ?Ťç§°ä»ĄĺŹŠćŹŹčż°ç­‰äżˇć?ŻďĽŚčż”ĺ›žç»™ç”¨ć?·
				this.mapParams = {
					title: mapInfo.title,
					description: mapInfo.description
				};
				const projectionMap = {
					'EPSG:4490': 'EPSG:4490',
					'EPSG:4214': 'EPSG:4214',
					'EPSG:4610': 'EPSG:4610',
					'EPSG:3857': 'EPSG:3857',
					'EPSG:4326': 'EPSG:4326'
				}; // ĺť?ć ‡çł»ĺĽ‚ĺ¸¸ĺ¤„ç?†
				if (this.baseProjection in projectionMap) {
					this._createMap(mapInfo, this.mapSetting);
					let layers = mapInfo.layers;
					this.map.on('load', () => {
						this._addBaseMap(mapInfo);

						if (!layers || layers.length === 0) {
							this._sendMapToUser(0, 0);
						} else {
							this._addLayers(layers);
						}
					});
				} else {
					throw Error(Lang.i18n('msg_crsunsupport'));
				}
			})
			.catch(error => {
				/**
				 * @event WebMap#getmapfailed
				 * @description čŽ·ĺŹ–ĺś°ĺ›ľäżˇć?Żĺ¤±č´Ąă€‚
				 * @property {Object} error - ĺ¤±č´ĄĺŽźĺ› ă€‚
				 */
				this.fire('getmapfailed', { error: error });
			});
	}

	/**
	 * @private
	 * @function WebMap.prototype._addBaseMap
	 * @description ć·»ĺŠ ĺş•ĺ›ľă€‚
	 * @param {Object} mapInfo - map äżˇć?Żă€‚
	 */
	_addBaseMap(mapInfo) {
		this._createBaseLayer(mapInfo);
	}

	/**
	 * @private
	 * @function WebMap.prototype._createBaseLayer
	 * @description ĺ?›ĺ»şĺş•ĺ›ľă€‚
	 * @param {Object} mapInfo - map äżˇć?Żă€‚
	 */
	_createBaseLayer(mapInfo) {
		let layerInfo = mapInfo.baseLayer || mapInfo;
		let layerType = layerInfo.layerType; //ĺş•ĺ›ľĺ’Śrestĺś°ĺ›ľĺ…Ľĺ®ą
		if (
			layerType.indexOf('TIANDITU_VEC') > -1 ||
			layerType.indexOf('TIANDITU_IMG') > -1 ||
			layerType.indexOf('TIANDITU_TER') > -1
		) {
			layerType = layerType.substr(0, 12);
		}
		let mapUrls = {
				CLOUD: 'http://t2.dituhui.com/FileService/image?map=quanguo&type=web&x={x}&y={y}&z={z}',
				CLOUD_BLACK: 'http://t3.dituhui.com/MapService/getGdp?x={x}&y={y}&z={z}',
				OSM: 'http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
				GOOGLE:
					'https://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i380072576!3m8!2szh-CN!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0',
				GOOGLE_CN: 'https://mt{0-3}.google.cn/vt/lyrs=m&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}',
				JAPAN_STD: 'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png',
				JAPAN_PALE: 'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',
				JAPAN_RELIEF: 'https://cyberjapandata.gsi.go.jp/xyz/relief/{z}/{x}/{y}.png',
				JAPAN_ORT: 'https://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg'
			},
			url;
		switch (layerType) {
			case 'TIANDITU_VEC':
			case 'TIANDITU_IMG':
			case 'TIANDITU_TER':
				this._createTiandituLayer(mapInfo);
				break;
			case 'BING':
				this._createBingLayer(layerInfo.name);
				break;
			case 'WMS':
				this._createWMSLayer(layerInfo);
				break;
			case 'WMTS':
				this._createWMTSLayer(layerInfo);
				break;
			case 'TILE':
			case 'SUPERMAP_REST':
				this._createDynamicTiledLayer(layerInfo);
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
				url = mapUrls[layerType];
				this._createXYZLayer(layerInfo, url);
				break;
			case 'MAPBOXSTYLE':
				this._createMapboxStyle(layerInfo);
				break;
			default:
				break;
		}
	}

	/**
	 * @private
	 * @function WebMap.prototype._createMapboxStyle
	 * @description ĺ?›ĺ»ş Mapbox ć ·ĺĽŹă€‚
	 * @param {Object} mapInfo - map äżˇć?Żă€‚
	 */
	_createMapboxStyle(mapInfo) {
		let _this = this,
			{ dataSource = {} } = mapInfo,
			{ serverId, url } = dataSource,
			styleUrl;
		styleUrl = serverId !== undefined ? `${this.server}web/datas/${serverId}/download` : url;
		FetchRequest.get(styleUrl, null, {
			withCredentials: this.withCredentials,
			withoutFormatSuffix: true,
			headers: {
				'Content-Type': 'application/json;chartset=uft-8'
			}
		}).then(response => {
			return response.json();
		}).then(style => {
			_this._matchStyleObject(style);
			_this.map.setStyle(style);
		})
	}

	/**
	 * @private
	 * @function WebMap.prototype._matchStyleObject
	 * @description ć?˘ĺ¤Ť style ä¸şć ‡ĺ‡†ć ĽĺĽŹă€‚
	 * @param {Object} style - mapbox ć ·ĺĽŹă€‚
	 */
	_matchStyleObject(style) {
		let { sprite, glyphs } = style;
		if (sprite && typeof sprite === 'object'){
			style.sprite = Object.values(sprite)[0];
		}
		if (glyphs && typeof glyphs === 'object'){
			style.glyphs = Object.values(glyphs)[0];
		}
	}

	/**
	 * @private
	 * @function WebMap.prototype._createTiandituLayer
	 * @description ĺ?›ĺ»şĺ¤©ĺś°ĺ›ľĺş•ĺ›ľă€‚
	 * @param {Object} mapInfo - map äżˇć?Żă€‚
	 */
	_createTiandituLayer(mapInfo) {
		let tiandituUrls = this._getTiandituUrl(mapInfo);
		let layerType = mapInfo.baseLayer.layerType;
		let isLabel = Boolean(mapInfo.baseLayer.labelLayerVisible);
		let labelUrl = tiandituUrls['labelUrl'];
		let tiandituUrl = tiandituUrls['tiandituUrl'];
		this._addBaselayer(tiandituUrl, 'tianditu-layers-' + layerType);
		isLabel && this._addBaselayer(labelUrl, 'tianditu-label-layers-' + layerType);
	}

	/**
	 * @private
	 * @function WebMap.prototype._createWMTSLayer
	 * @description ĺ?›ĺ»ş WMTS ĺş•ĺ›ľă€‚
	 * @param {Object} mapInfo - map äżˇć?Żă€‚
	 */
	_createWMTSLayer(layerInfo) {
		let wmtsUrl = this._getWMTSUrl(layerInfo);
		this._filterWMTSIsMatched(layerInfo, (isMatched, matchMaxZoom) => {
			isMatched && this._addBaselayer([wmtsUrl], 'wmts-layers' + layerInfo.name, 0, matchMaxZoom);
		});
	}

	/**
	 * @private
	 * @function WebMap.prototype._filterWMTSIsMatched
	 * @description čż‡ć»¤č?˝ĺ¤źč·źmapboxglĺŚąé…Ťçš„wmtsćśŤĺŠˇă€‚
	 * @param {Object} mapInfo - map äżˇć?Żă€‚
	 * @callback matchedCallback
	 */
	_filterWMTSIsMatched(mapInfo, matchedCallback) {
		let isMatched = false,
			matchMaxZoom = 22,
			url = mapInfo.url;
		let options = {
			withCredentials: false,
			withoutFormatSuffix: true
		};

		FetchRequest.get(url, null, options)
			.then(response => {
				return response.text();
			})
			.then(capabilitiesText => {
				let converts = convert ? convert : window.convert;
                let tileMatrixSet = JSON.parse(converts.xml2json(capabilitiesText, { compact: true, spaces: 4 }))
                    .Capabilities.Contents.TileMatrixSet;
                if (!Array.isArray(tileMatrixSet)) {
                    tileMatrixSet = [tileMatrixSet];
                }
				for (let i = 0; i < tileMatrixSet.length; i++) {
					if (
						tileMatrixSet[i]['ows:Identifier'] &&
						tileMatrixSet[i]['ows:Identifier']['_text'] === mapInfo.tileMatrixSet
					) {
						if (DEFAULT_WELLKNOWNSCALESET.indexOf(tileMatrixSet[i]['WellKnownScaleSet']['_text']) > -1) {
							isMatched = true;
						} else if (
							tileMatrixSet[i]['WellKnownScaleSet'] &&
							tileMatrixSet[i]['WellKnownScaleSet']['_text'] === 'Custom'
						) {
							let matchedScaleDenominator = [];
							//ĺť?ć ‡çł»ĺ?¤ć–­
							let defaultCRSScaleDenominators =
								this.map.crs === 'EPSG:3857' ? MB_SCALEDENOMINATOR_3857 : MB_SCALEDENOMINATOR_4326;

							for (let j = 0, len = defaultCRSScaleDenominators.length; j < len; j++) {
								if (!tileMatrixSet[i].TileMatrix[j]) {
									break;
								}
								if (
									defaultCRSScaleDenominators[j] !==
									tileMatrixSet[i].TileMatrix[j]['ScaleDenominator']['_text']
								) {
									break;
								}
								matchedScaleDenominator.push(defaultCRSScaleDenominators[j]);
							}
							matchMaxZoom = matchedScaleDenominator.length - 1;
							if (matchedScaleDenominator.length !== 0) {
								isMatched = true;
							} else {
								throw Error(Lang.i18n('msg_tilematrixsetunsupport'));
							}
						} else {
							throw Error(Lang.i18n('msg_tilematrixsetunsupport'));
						}
					}
				}
				matchedCallback(isMatched, matchMaxZoom);
			})
			.catch(error => {
				/**
				 * @event WebMap#getwmtsfailed
				 * @description čŽ·ĺŹ– WMTS ĺ›ľĺ±‚äżˇć?Żĺ¤±č´Ąă€‚
				 * @property {Object} error - ĺ¤±č´ĄĺŽźĺ› ă€‚
				 * @property {mapboxgl.Map} map - MapBoxGL Map ĺŻąč±ˇă€‚
				 */
				this.fire('getwmtsfailed', { error: error, map: this.map });
			});
	}

	/**
	 * @private
	 * @function WebMap.prototype._createBingLayer
	 * @description ĺ?›ĺ»ş Bing ĺ›ľĺ±‚ă€‚
	 */
	_createBingLayer(layerName) {
		let bingUrl =
			'https://dynamic.t0.tiles.ditu.live.com/comp/ch/{quadkey}?it=G,TW,L,LA&mkt=zh-cn&og=109&cstl=w4c&ur=CN&n=z';
		this.addLayer([bingUrl], 'bing-layers-' + layerName);
	}

	/**
	 * @private
	 * @function WebMap.prototype._createXYZLayer
	 * @description ĺ?›ĺ»ş XYZ ĺş•ĺ›ľă€‚
	 * @param {string} url - url ĺś°ĺť€ă€‚
	 */
	_createXYZLayer(layerInfo, url) {
		let urlArr = [];
		if (layerInfo.layerType === 'OSM') {
			let res = url.match(/\w\-\w/g)[0];
			let start = res[0];
			let end = res[2];
			let alphabet = '';
			for (let i = 97; i < 123; i++) {
				alphabet += String.fromCharCode(i);
			}
			let alphabetArr = alphabet.split('');

			let startIndex = alphabetArr.indexOf(start);
			let endIndex = alphabetArr.indexOf(end);

			let res3 = alphabetArr.slice(startIndex, endIndex + 1);

			for (let i = 0; i < res3.length; i++) {
				let replaceRes = url.replace(/{\w\-\w}/g, res3[i]);
				urlArr.push(replaceRes);
			}
		} else if (layerInfo.layerType === 'GOOGLE_CN') {
			let res = url.match(/\d\-\d/g)[0];
			let start = res[0];
			let end = res[2];

			for (let i = start; i <= end; i++) {
				let replaceRes = url.replace(/{\d\-\d}/g, i);
				urlArr.push(replaceRes);
			}
		} else {
			urlArr = [url];
		}
		this._addBaselayer(urlArr, 'XYZ-layers-' + layerInfo.name);
	}

	/**
	 * @private
	 * @function WebMap.prototype._createDynamicTiledLayer
	 * @description ĺ?›ĺ»ş iserver ĺş•ĺ›ľă€‚
	 * @param {Object} layerInfo - ĺ›ľĺ±‚äżˇć?Żă€‚
	 */
	_createDynamicTiledLayer(layerInfo) {
        let url = layerInfo.url;
        const layerId = layerInfo.layerID || layerInfo.name;
        const { minzoom, maxzoom } = layerInfo;
        this._addBaselayer([url], layerId, minzoom, maxzoom, true);
	}

	/**
	 * @private
	 * @function WebMap.prototype._createWMSLayer
	 * @description ĺ?›ĺ»ş WMS ĺ›ľĺ±‚ă€‚
	 * @param {Object} mapInfo - map äżˇć?Żă€‚
	 */
	_createWMSLayer(layerInfo) {
		let WMSUrl = this._getWMSUrl(layerInfo);
		this._addBaselayer([WMSUrl], 'WMS-layers-' + layerInfo.name);
	}

	/**
	 * @private
	 * @function WebMap.prototype._createVectorLayer
	 * @description ĺ?›ĺ»ş Vector ĺ›ľĺ±‚ă€‚
	 * @param {Object} layerInfo - map äżˇć?Żă€‚
	 * @param {Array} features - ĺ±žć€§ äżˇć?Żă€‚
	 */
	_createVectorLayer(layerInfo, features) {
		let style = layerInfo.style;
		let type = layerInfo.featureType;
		let layerID = layerInfo.layerID;
		let visible = layerInfo.visible;
		let layerStyle = {};
		layerStyle.style = this._transformStyleToMapBoxGl(style, type);
		layerStyle.layout = { visibility: visible };
		let source = {
			type: 'geojson',
			data: {
				type: 'FeatureCollection',
				features: features
			}
		};
		this._addOverlayToMap(type, source, layerID, layerStyle);
		// ĺ¦‚ćžśéť˘ćś‰čľąćˇ†
		type === 'POLYGON' &&
			style.strokeColor &&
			this._addStrokeLineForPoly(style, source, layerID + '-strokeLine', visible);
	}

	/**
	 * @function WebMap.prototype._getTiandituUrl
	 * @private
	 * @description ĺ?›ĺ»şĺ¤©ĺś°ĺ›ľurl;
	 * @param {Object} mapInfo - map äżˇć?Żă€‚
	 */
	_getTiandituUrl(mapInfo) {
		let re = /t0/gi;
		let tiandituUrls = {};
		let layerType = mapInfo.baseLayer.layerType.split('_')[1].toLowerCase();
		let isLabel = Boolean(mapInfo.baseLayer.labelLayerVisible);
		// let isLabel = true;
		let url = 'https://t0.tianditu.gov.cn/{layer}_{proj}/wmts?';
		let labelUrl = url;
		let layerLabelMap = {
			vec: 'cva',
			ter: 'cta',
			img: 'cia'
		};
		let tilematrixSet = this.baseProjection === 'EPSG:4326' ? 'c' : 'w';
		let options = {
			service: 'WMTS',
			request: 'GetTile',
			style: 'default',
			version: '1.0.0',
			layer: layerType,
			tilematrixSet: tilematrixSet,
			format: 'tiles',
			width: 256,
			height: 256
		};

		url += this._getParamString(options, url) + '&tilematrix={z}&tilerow={y}&tilecol={x}';
		let tiandituUrl = url.replace('{layer}', layerType).replace('{proj}', tilematrixSet);
		let tiandituUrlArr = [];
		for (let i = 0; i < 8; i++) {
			tiandituUrlArr.push(tiandituUrl.replace(re, `t${i}`));
		}
		tiandituUrls['tiandituUrl'] = tiandituUrlArr;

		// ĺ¦‚ćžśćś‰ label ĺ›ľĺ±‚
		if (isLabel) {
			let labelLayer = layerLabelMap[layerType];
			options.layer = labelLayer;
			labelUrl += this._getParamString(options, labelUrl) + '&tilematrix={z}&tilerow={y}&tilecol={x}';
			labelUrl = labelUrl.replace('{layer}', labelLayer).replace('{proj}', tilematrixSet);
			let labelUrlArr = [];
			for (let i = 0; i < 8; i++) {
				labelUrlArr.push(labelUrl.replace(re, `t${i}`));
			}
			tiandituUrls['labelUrl'] = labelUrlArr;
		}

		return tiandituUrls;
	}

	/**
	 * @function WebMap.prototype._getWMSUrl
	 * @private
	 * @description ĺ?›ĺ»ş WMS url;
	 * @param {Object} mapInfo - map äżˇć?Żă€‚
	 */
	_getWMSUrl(mapInfo) {
		let url = mapInfo.url;
		url = url.split('?')[0];
		let strArr = url.split('/');
		let options = {
			service: 'WMS',
			request: 'GetMap',
			layers: strArr[strArr.length - 1],
			styles: '',
			format: 'image/png',
			transparent: 'true',
			version: '1.1.1',
			width: 256,
			height: 256,
			srs: this.baseProjection
		};
		let bbox = this.baseProjection === 'EPSG:4326' ? '{bbox-epsg-4326}' : '{bbox-epsg-3857}';
		url += this._getParamString(options, url) + `&bbox=${bbox}`;
		return url;
	}

	/**
	 * @private
	 * @function WebMap.prototype._addLayers
	 * @description ć·»ĺŠ ĺŹ ĺŠ ĺ›ľĺ±‚ă€‚
	 * @param {Object} mapInfo - ĺ›ľĺ±‚äżˇć?Żă€‚
	 */
	_addLayers(layers) {
		//ĺ­?ĺ‚¨ĺś°ĺ›ľä¸Šć‰€ćś‰çš„ĺ›ľĺ±‚ĺŻąč±ˇ
		this.layers = layers;

		let features,
			layerAdded = 0,
			len = layers.length;
		layers.forEach((layer, index) => {
			if ((layer.dataSource && layer.dataSource.serverId) || layer.layerType === 'MARKER') {
				// čŽ·ĺŹ– serverID
				let serverId = layer.dataSource ? layer.dataSource.serverId : layer.serverId;
				let url = `${this.server}web/datas/${serverId}/content.json?pageSize=9999999&currentPage=1`;
				// čŽ·ĺŹ–ĺ›ľĺ±‚ć•°ćŤ®
				serverId &&
					FetchRequest.get(url, null, { withCredentials: this.withCredentials })
						.then(response => {
							return response.json();
						})
						.then(data => {
							if (data.succeed === false) {
								//čŻ·ć±‚ĺ¤±č´Ą
								layerAdded++;
								this._sendMapToUser(layerAdded, len);
								/**
								 * @event WebMap#getlayersfailed
								 * @description čŽ·ĺŹ–ĺ›ľĺ±‚äżˇć?Żĺ¤±č´Ąă€‚
								 * @property {Object} error - ĺ¤±č´ĄĺŽźĺ› ă€‚
								 * @property {mapboxgl.Map} map - MapBoxGL Map ĺŻąč±ˇă€‚
								 */
								this.fire('getlayersfailed', { error: data.error, map: this.map });
								return;
							}
							if (data.type) {
								if (data.type === 'JSON' || data.type === 'GEOJSON') {
									data.content = JSON.parse(data.content.trim());
									features = this._formatGeoJSON(data.content, layer);
								} else if (data.type === 'EXCEL' || data.type === 'CSV') {
									features = this._excelData2Feature(data.content, layer);
								}
								this._addLayer(layer, features, index);
								layerAdded++;
								this._sendMapToUser(layerAdded, len);
							}
						})
						.catch(error => {
							layerAdded++;
							this._sendMapToUser(layerAdded, len);
							this.fire('getlayersfailed', { error: error, map: this.map });
						});
			} else if (
				layer.layerType === 'SUPERMAP_REST' ||
				layer.layerType === 'TILE' ||
				layer.layerType === 'WMS' ||
				layer.layerType === 'WMTS'
			) {
				this._createBaseLayer(layer);
				layerAdded++;
				this._sendMapToUser(layerAdded, len);
			} else if (layer.dataSource && layer.dataSource.type === 'REST_DATA') {
				let dataSource = layer.dataSource;
				//ä»ŽrestDatačŽ·ĺŹ–ć•°ćŤ®
				this._getFeatureBySQL(
					dataSource.url,
					[dataSource.dataSourseName || layer.name],
					result => {
						features = this._parseGeoJsonData2Feature({
							allDatas: { features: result.result.features.features },
							fileCode: layer.projection,
							featureProjection: this.baseProjection
						});

						this._addLayer(layer, features, index);
						layerAdded++;
						this._sendMapToUser(layerAdded, len);
					},
					err => {
						layerAdded++;
						this._sendMapToUser(layerAdded, len);
						/**
						 * @event WebMap#getfeaturesfailed
						 * @description čŽ·ĺŹ–ĺ›ľĺ±‚č¦?ç´ ĺ¤±č´Ąă€‚
						 * @property {Object} error - ĺ¤±č´ĄĺŽźĺ› ă€‚
						 */
						this.fire('getfeaturesfailed', { error: err });
					}
				);
			} else if (layer.dataSource && layer.dataSource.type === 'REST_MAP' && layer.dataSource.url) {
				this._queryFeatureBySQL(
					layer.dataSource.url,
					layer.dataSource.layerName,
					'smid=1',
					null,
					null,
					result => {
						let recordsets = result && result.result.recordsets;
						let recordset = recordsets && recordsets[0];
						let attributes = recordset.fields;
						if (recordset && attributes) {
							let fileterAttrs = [];
							for (let i in attributes) {
								let value = attributes[i];
								if (value.indexOf('Sm') !== 0 || value === 'SmID') {
									fileterAttrs.push(value);
								}
							}
							this._getFeatures(
								fileterAttrs,
								layer,
								features => {
									this._addLayer(layer, features, index);
									layerAdded++;
									this._sendMapToUser(layerAdded, len);
								},
								err => {
									layerAdded++;
									this.fire('getfeaturesfailed', { error: err, map: this.map });
								}
							);
						}
					},
					err => {
						this.fire('getlayersfailed', { error: err, map: this.map });
					}
				);
			}
		}, this);
	}
	/**
	 * @private
	 * @function WebMap.prototype._getFeatures
	 * @description ĺ°†ĺŤ•ä¸Şĺ›ľĺ±‚ć·»ĺŠ ĺ?°ĺś°ĺ›ľä¸Šă€‚
	 * @param layerInfo  ćź?ä¸Şĺ›ľĺ±‚çš„ĺ›ľĺ±‚äżˇć?Ż
	 * @param {Array.<GeoJSON>} features - featureă€‚
	 */
	_getFeatures(fields, layerInfo, resolve, reject) {
		let source = layerInfo.dataSource;
		//ç¤şäľ‹ć•°ćŤ®
		let fileCode = layerInfo.projection;
		this._queryFeatureBySQL(
			source.url,
			source.layerName,
			null,
			fields,
			null,
			result => {
				let recordsets = result.result.recordsets[0];
				let features = recordsets.features.features;

				let featuresObj = this._parseGeoJsonData2Feature(
					{
						allDatas: { features },
						fileCode: fileCode,
						featureProjection: this.baseProjection
					},
					'JSON'
				);
				resolve(featuresObj);
			},
			err => {
				reject(err);
			}
		);
	}

	/**
	 * @private
	 * @function WebMap.prototype._addLayer
	 * @description ĺ°†ĺŤ•ä¸Şĺ›ľĺ±‚ć·»ĺŠ ĺ?°ĺś°ĺ›ľä¸Šă€‚
	 * @param layerInfo  ćź?ä¸Şĺ›ľĺ±‚çš„ĺ›ľĺ±‚äżˇć?Ż
	 * @param {Array.<GeoJSON>} features - featureă€‚
	 */
	_addLayer(layerInfo, features, index) {
		let layerType = layerInfo.layerType;
		layerInfo.layerID = layerType + '-' + layerInfo.name + '-' + index;
		layerInfo.visible = layerInfo.visible ? 'visible' : 'none';
		// mbgl ç›®ĺ‰Ťä¸Ťč?˝ĺ¤„ç?† geojson ĺ¤Ťćť‚éť˘ć?…ĺ†µ
		// mbgl isssue https://github.com/mapbox/mapbox-gl-js/issues/7023
		if (features[0] && features[0].geometry.type === 'Polygon') {
			features = this._handleMultyPolygon(features);
		}

		if (layerInfo.style && layerInfo.filterCondition) {
			//ĺ°† feature ć ąćŤ®čż‡ć»¤ćťˇä»¶čż›čˇŚčż‡ć»¤, ĺ?†ć®µä¸“é˘?ĺ›ľĺ’ŚĺŤ•ĺ€Ľä¸“é˘?ĺ›ľĺ› ä¸şč¦?č®ˇç®— styleGroup ć‰€ä»Ąćš‚ć—¶ä¸Ťčż‡ć»¤
			if (layerType !== 'RANGE' && layerType !== 'UNIQUE') {
				features = this._getFiterFeatures(layerInfo.filterCondition, features);
			}
		}

		if (layerType === 'VECTOR') {
			if (layerInfo.featureType === 'POINT') {
				if (layerInfo.style.type === 'SYMBOL_POINT') {
					this._createSymbolLayer(layerInfo, features);
				} else {
					this._createGraphicLayer(layerInfo, features);
				}
			} else {
				//çşżĺ’Śéť˘
				this._createVectorLayer(layerInfo, features);
			}
		} else if (layerType === 'UNIQUE') {
			this._createUniqueLayer(layerInfo, features);
		} else if (layerType === 'RANGE') {
			this._createRangeLayer(layerInfo, features);
		} else if (layerType === 'HEAT') {
			this._createHeatLayer(layerInfo, features);
		} else if (layerType === 'MARKER') {
			this._createMarkerLayer(layerInfo, features);
		}
		if (layerInfo.labelStyle && layerInfo.labelStyle.labelField) {
			// ĺ­?ĺś¨ć ‡ç­ľä¸“é˘?ĺ›ľ
			this._addLabelLayer(layerInfo, features);
		}
	}

	/**
	 * @private
	 * @function WebMap.prototype._addLabelLayer
	 * @description ć·»ĺŠ ć ‡ç­ľĺ›ľĺ±‚ă€‚
	 * @param layerInfo  ćź?ä¸Şĺ›ľĺ±‚çš„ĺ›ľĺ±‚äżˇć?Żă€‚
	 * @param {Array.<GeoJSON>} features - featureă€‚
	 */
	_addLabelLayer(layerInfo, features) {
		let labelStyle = layerInfo.labelStyle;

		this.map.addLayer({
			id: layerInfo.layerID + 'label',
			type: 'symbol',
			source: {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: features
				}
			},
			paint: {
				'text-color': labelStyle.fill
			},
			layout: {
				'text-field': `{${labelStyle.labelField}}`,
				'text-size': parseFloat(labelStyle.fontSize) || 12,
				'text-offset': labelStyle.offsetX
					? [labelStyle.offsetX / 10 || 0, labelStyle.offsetY / 10 || 0]
					: [0, -1.5],
				'text-font': ['DIN Offc Pro Italic', 'Arial Unicode MS Regular'],
				visibility: layerInfo.visible
			}
		});
	}

	/**
	 * @private
	 * @function WebMap.prototype._createSymbolLayer
	 * @description ć·»ĺŠ  symbol ĺ›ľĺ±‚ă€‚
	 * @param layerInfo  ćź?ä¸Şĺ›ľĺ±‚çš„ĺ›ľĺ±‚äżˇć?Żă€‚
	 * @param {Array.<GeoJSON>} features - featureă€‚
	 */
	_createSymbolLayer(layerInfo, features) {
		//ç”¨ćťĄčŻ·ć±‚symbol_pointĺ­—ä˝“ć–‡ä»¶
		let target = document.getElementById(`${this.target}`);
		target.classList.add('supermapol-icons-map');

		let style = layerInfo.style;
		let unicode = layerInfo.style.unicode;
		let text = String.fromCharCode(parseInt(unicode.replace(/^&#x/, ''), 16));
		let layerID = layerInfo.layerID;
		this.map.addSource(layerID + '-source', {
			type: 'geojson',
			data: {
				type: 'FeatureCollection',
				features: []
			}
		});
		this.map.addLayer({
			id: layerID,
			type: 'symbol',
			source: layerID + '-source',
			paint: {
				'text-color': style.fillColor
			},
			layout: {
				'text-field': text,
				'text-font': ['DIN Offc Pro Italic', 'Arial Unicode MS Regular'],
				visibility: layerInfo.visible
			}
		});
		this.map.getSource(layerID + '-source').setData({
			type: 'FeatureCollection',
			features: features
		});
	}

	/**
	 * @private
	 * @function WebMap.prototype._createGraphicLayer
	 * @description ĺ?›ĺ»ş Graphic ĺ›ľĺ±‚ă€‚
	 * @param {Object} layerInfo - map äżˇć?Żă€‚
	 * @param {Array} features - ĺ±žć€§ äżˇć?Żă€‚
	 */
	_createGraphicLayer(layerInfo, features) {
		let style = layerInfo.style;
		let layerStyle = {};
		let layerID = layerInfo.layerID;
		let source = {
			type: 'geojson',
			data: {
				type: 'FeatureCollection',
				features: features
			}
		};

		if (style.type === 'IMAGE_POINT') {
			let imageInfo = style.imageInfo;
			let imgDom = imageInfo.img;
			if (!imgDom || !imgDom.src) {
				//č¦?ç»„čŁ…ć??ĺ®Ść•´çš„url
				imageInfo.url = this.server + imageInfo.url;
			}
			this.map.loadImage(imageInfo.url || imgDom.src, (error, image) => {
				if (error) {
					console.log(error);
				}
				let iconSize = Number.parseFloat((style.radius / image.height).toFixed(2)) * 2;
				this.map.addImage('imageIcon', image);
				this.map.addLayer({
					id: layerID,
					type: 'symbol',
					source: source,
					layout: {
						'icon-image': 'imageIcon',
						'icon-size': iconSize,
						visibility: layerInfo.visible
					}
				});
			});
		} else if (style.type === 'SVG_POINT') {
			let svg_url = style.url;
			if (!this.svgDiv) {
				this.svgDiv = document.createElement('div');
				document.body.appendChild(this.svgDiv);
			}
			this._getCanvasFromSVG(svg_url, this.svgDiv, canvas => {
				let imgUrl = canvas.toDataURL('img/png');
				imgUrl &&
					this.map.loadImage(
						imgUrl,
						(error, image) => {
							if (error) {
								console.log(error);
							}
							let iconSize = Number.parseFloat((style.radius / canvas.width).toFixed(2));
							this.map.addImage('imageIcon', image);
							this.map.addLayer({
								id: layerID,
								type: 'symbol',
								source: source,
								layout: {
									'icon-image': 'imageIcon',
									'icon-size': iconSize,
									visibility: layerInfo.visible
								}
							});
						},
						this
					);
			});
		} else {
			layerStyle.style = this._transformStyleToMapBoxGl(style, layerInfo.featureType);
			layerStyle.layout = { visibility: layerInfo.visible };
			this._addOverlayToMap('POINT', source, layerID, layerStyle);
		}
	}

	/**
	 * @private
	 * @function WebMap.prototype._createUniqueLayer
	 * @description ĺ?›ĺ»şĺŤ•ĺ€Ľĺ›ľĺ±‚ă€‚
	 * @param layerInfo  ćź?ä¸Şĺ›ľĺ±‚çš„ĺ›ľĺ±‚äżˇć?Ż
	 * @param features   ĺ›ľĺ±‚ä¸Šçš„ feature
	 */
	_createUniqueLayer(layerInfo, features) {
		let styleGroup = this._getUniqueStyleGroup(layerInfo, features);
		features = this._getFiterFeatures(layerInfo.filterCondition, features);

		let style = layerInfo.style;
		let layerStyle = {};
		let themeField = layerInfo.themeSetting.themeField;
		let type = layerInfo.featureType;
		let expression = ['match', ['get', 'index']];
		let layerID = layerInfo.layerID;
		features.forEach(row => {
			styleGroup.forEach(item => {
				if (item.value === row.properties[themeField]) {
					expression.push(row.properties['index'], item.color);
				}
			});
		});
		expression.push('#ffffff');
		layerStyle.style = this._transformStyleToMapBoxGl(style, type, expression);
		let visible = layerInfo.visible;
		layerStyle.layout = { visibility: visible };
		let source = {
			type: 'geojson',
			data: {
				type: 'FeatureCollection',
				features: features
			}
		};
		this._addOverlayToMap(type, source, layerID, layerStyle);
		type === 'POLYGON' &&
			style.strokeColor &&
			this._addStrokeLineForPoly(style, source, layerID + '-strokeLine', visible);
	}

	/**
	 * @private
	 * @function WebMap.prototype._getUniqueStyleGroup
	 * @description čŽ·ĺŹ–ĺŤ•ĺ€Ľçš„ç›®ć ‡ĺ­—ć®µä¸Žé˘śč‰˛çš„ĺŻąĺş”ć•°ç»„ă€‚
	 * @param layerInfo  ćź?ä¸Şĺ›ľĺ±‚çš„ĺ›ľĺ±‚äżˇć?Ż
	 * @param features   ĺ›ľĺ±‚ä¸Šçš„ feature
	 */
	_getUniqueStyleGroup(parameters, features) {
		// ć‰ľĺ‡şć‰€ćś‰çš„ĺŤ•ĺ€Ľ
		let featureType = parameters.featureType,
			style = parameters.style,
			themeSetting = parameters.themeSetting;
		let fieldName = themeSetting.themeField,
			colors = themeSetting.colors;

		let names = [],
			customSettings = themeSetting.customSettings;
		for (let i in features) {
			let properties = features[i].properties;
			let name = properties[fieldName];
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

		//čŽ·ĺŹ–ä¸€ĺ®šé‡Źçš„é˘śč‰˛
		let curentColors = colors || this.defaultParameters.colors;
		curentColors = ColorsPickerUtil.getGradientColors(curentColors, names.length);

		//ç”źć??styleGroup
		let styleGroup = [];
		names.forEach((name, index) => {
			let color = curentColors[index];
			if (name in customSettings) {
				color = customSettings[name];
			}
			if (featureType === 'LINE') {
				style.strokeColor = color;
			} else {
				style.fillColor = color;
			}
			styleGroup.push({ color: color, value: name });
		}, this);

		return styleGroup;
	}

	/**
	 * @private
	 * @function WebMap.prototype._getWMTSUrl
	 * @description ć ąćŤ®äĽ ĺ…Ąçš„é…Ťç˝®äżˇć?Żć‹ĽćŽĄwmts urlă€‚
	 * @param options é…Ťç˝®ĺŻąč±ˇ
	 */
	_getWMTSUrl(options) {
		let obj = {
			service: 'WMTS',
			request: 'GetTile',
			version: '1.0.0',
			style: 'default',
			layer: options.layer,
			tilematrixSet: options.tileMatrixSet,
			format: 'image/png'
		};
		let url = options.url;

		url += this._getParamString(obj, url) + '&tilematrix={z}&tilerow={y}&tilecol={x}';

		return url;
	}

	/**
	 * @private
	 * @function WebMap.prototype._createMarkerLayer
	 * @description ć·»ĺŠ ć ‡č®°ĺ›ľĺ±‚ă€‚
	 * @param {Array.<GeoJSON>} features - featureă€‚
	 */
	_createMarkerLayer(layerInfo, features) {
		features &&
			features.forEach(feature => {
				let geomType = feature.geometry.type.toUpperCase();
				let defaultStyle = feature.dv_v5_markerStyle;
				if (geomType === 'POINT' && defaultStyle.text) {
					//čŻ´ć?Žć?Żć–‡ĺ­—çš„featureç±»ĺž‹
					geomType = 'TEXT';
				}
				let featureInfo = this.setFeatureInfo(feature);
				feature.properties['useStyle'] = defaultStyle;
				feature.properties['featureInfo'] = featureInfo;
				if (
					geomType === 'POINT' &&
					defaultStyle.src &&
					(defaultStyle.src.indexOf('http://') === -1 && defaultStyle.src.indexOf('https://') === -1)
				) {
					//čŻ´ć?Žĺś°ĺť€ä¸Ťĺ®Ść•´
					defaultStyle.src = this.server + defaultStyle.src;
				}

				let source = {
					type: 'geojson',
					data: feature
				};
				let index = feature.properties.index;
				let layerID = geomType + '-' + index;
				// image-marker
				geomType === 'POINT' &&
					defaultStyle.src &&
					defaultStyle.src.indexOf('svg') <= -1 &&
					this.map.loadImage(
						defaultStyle.src,
						(error, image) => {
							if (error) {
								console.log(error);
							}
							this.map.addImage(index + '', image);
							this.map.addLayer({
								id: layerID,
								type: 'symbol',
								source: source,
								layout: {
									'icon-image': index + '',
									'icon-size': defaultStyle.scale,
									visibility: layerInfo.visible
								}
							});
						},
						this
					);

				// svg-marker
				if (geomType === 'POINT' && defaultStyle.src && defaultStyle.src.indexOf('svg') > -1) {
					if (!this.svgDiv) {
						this.svgDiv = document.createElement('div');
						document.body.appendChild(this.svgDiv);
					}
					this._getCanvasFromSVG(defaultStyle.src, this.svgDiv, canvas => {
						let imgUrl = canvas.toDataURL('img/png');
						imgUrl &&
							this.map.loadImage(
								imgUrl,
								(error, image) => {
									if (error) {
										console.log(error);
									}
									this.map.addImage(index + '', image);
									this.map.addLayer({
										id: layerID,
										type: 'symbol',
										source: source,
										layout: {
											'icon-image': index + '',
											'icon-size': defaultStyle.scale,
											visibility: layerInfo.visible
										}
									});
								},
								this
							);
					});
				}
				// point-line-polygon-marker
				if (!defaultStyle.src) {
					let layeStyle = { layout: {} };
					if (geomType === 'LINESTRING' && defaultStyle.lineCap) {
						geomType = 'LINE';
						layeStyle.layout = { 'line-cap': defaultStyle.lineCap };
					}
					let visible = layerInfo.visible;
					layeStyle.layout.visibility = visible;
					// get style
					layeStyle.style = this._transformStyleToMapBoxGl(defaultStyle, geomType);
					this._addOverlayToMap(geomType, source, layerID, layeStyle);
					// č‹Ąéť˘ćś‰čľąćˇ†
					geomType === 'POLYGON' &&
						defaultStyle.strokeColor &&
						this._addStrokeLineForPoly(defaultStyle, source, layerID + '-strokeLine', visible);
				}
			}, this);
	}

	/**
	 * @private
	 * @function WebMap.prototype.setFeatureInfo
	 * @description č®ľç˝® feature äżˇć?Żă€‚
	 * @param {Array.<GeoJSON>} features - featureă€‚
	 */
	setFeatureInfo(feature) {
		let featureInfo;
		let info = feature.dv_v5_markerInfo;
		if (info && info.dataViz_title) {
			//ćś‰featureInfoäżˇć?Żĺ°±ä¸Ťéś€č¦?ĺ†Ťć·»ĺŠ 
			featureInfo = info;
		} else {
			// featureInfo = this.getDefaultAttribute();
			return info;
		}
		let properties = feature.properties;
		for (let key in featureInfo) {
			if (properties[key]) {
				featureInfo[key] = properties[key];
				delete properties[key];
			}
		}
		return featureInfo;
	}

	/**
	 * @private
	 * @function WebMap.prototype._createHeatLayer
	 * @description ć·»ĺŠ ç?­ĺŠ›ĺ›ľă€‚
	 * @param {Array.<GeoJSON>} features - featureă€‚
	 */
	_createHeatLayer(layerInfo, features) {
		let style = layerInfo.themeSetting;
		let layerOption = {};
		layerOption.gradient = style.colors.slice();
		layerOption.radius = parseInt(style.radius);
		//č‡Şĺ®šäą‰é˘śč‰˛
		let customSettings = style.customSettings;
		for (let i in customSettings) {
			layerOption.gradient[i] = customSettings[i];
		}
		// ćť?é‡Ťĺ­—ć®µć?˘ĺ¤Ť
		if (style.weight) {
			this._changeWeight(features, style.weight);
		}

		let color = ['interpolate', ['linear'], ['heatmap-density']];
		let length = layerOption.gradient.length;
		let step = (1 / length).toFixed(2);
		layerOption.gradient.forEach((item, index) => {
			color.push(index * step);
			if (index === 0) {
				item = Util.hexToRgba(item, 0);
			}
			color.push(item);
		});

		let paint = {
			'heatmap-color': color,
			'heatmap-radius': style.radius + 15,
			'heatmap-intensity': { base: 1, stops: [[0, 0.8], [22, 1]] }
		};
		if (features[0].weight && features.length >= 4) {
			let weight = [];
			features.forEach(item => {
				weight.push(item.weight);
			});
			let max = ArrayStatistic.getMax(weight);
			let min = ArrayStatistic.getMin(weight);
			paint['heatmap-weight'] = ['interpolate', ['linear'], ['get', 'weight'], min, 0, max, 1];
		}

		this.map.addLayer({
			id: layerInfo.layerID,
			type: 'heatmap',
			source: {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: features
				}
			},
			paint: paint
		});
	}

	/**
	 * @private
	 * @function WebMap.prototype._changeWeight
	 * @description ć”ąĺŹ?ĺ˝“ĺ‰Ťćť?é‡Ťĺ­—ć®µ
	 * @param {Array.<GeoJSON>} features - featureă€‚
	 * @param {string} weightFeild - ćť?é‡Ťĺ­—ć®µ
	 */
	_changeWeight(features, weightFeild) {
		this.fieldMaxValue = {};
		this._getMaxValue(features, weightFeild);
		let maxValue = this.fieldMaxValue[weightFeild];
		features.forEach(feature => {
			let attributes = feature.properties;
			let value = attributes[weightFeild];
			feature['weight'] = value / maxValue;
		});
	}

	/**
	 * @private
	 * @function WebMap.prototype._getMaxValue
	 * @description čŽ·ĺŹ–ĺ˝“ĺ‰Ťĺ­—ć®µĺŻąĺş”çš„ćś€ĺ¤§ĺ€ĽďĽŚç”¨äşŽč®ˇç®—ćť?é‡Ťă€‚
	 * @param {Array.<GeoJSON>} features - featureă€‚
	 * @param {string} weightFeild - ćť?é‡Ťĺ­—ć®µ
	 */
	_getMaxValue(features, weightField) {
		let values = [],
			attributes;
		let field = weightField;
		if (this.fieldMaxValue[field]) {
			return;
		}
		features.forEach(feature => {
			//ć”¶é›†ĺ˝“ĺ‰Ťćť?é‡Ťĺ­—ć®µĺŻąĺş”çš„ć‰€ćś‰ĺ€Ľ
			attributes = feature.properties;
			attributes && parseFloat(attributes[field]) && values.push(parseFloat(attributes[field]));
		});
		this.fieldMaxValue[field] = ArrayStatistic.getArrayStatistic(values, 'Maximum');
	}

	/**
	 * @private
	 * @function WebMap.prototype._createRangeLayer
	 * @description ć·»ĺŠ ĺ?†ć®µä¸“é˘?ĺ›ľă€‚
	 * @param {Array.<GeoJSON>} features - featureă€‚
	 */
	_createRangeLayer(layerInfo, features) {
		let fieldName = layerInfo.themeSetting.themeField;
		let style = layerInfo.style;
		let featureType = layerInfo.featureType;
		let styleGroups = this._getRangeStyleGroup(layerInfo, features);
		features = this._getFiterFeatures(layerInfo.filterCondition, features);

		let source = {
			type: 'geojson',
			data: {
				type: 'FeatureCollection',
				features: features
			}
		};

		// čŽ·ĺŹ– expression
		let expression = ['match', ['get', 'index']];
		features.forEach(row => {
			let tartget = parseFloat(row.properties[fieldName]);
			for (let i = 0; i < styleGroups.length; i++) {
				if (styleGroups[i].start <= tartget && tartget < styleGroups[i].end) {
					expression.push(row.properties['index'], styleGroups[i].color);
					// return;
				}
			}
			!tartget && expression.push(row.properties['index'], 'rgba(0, 0, 0, 0)');
		}, this);
		expression.push('rgba(0, 0, 0, 0)');

		// čŽ·ĺŹ–ć ·ĺĽŹ
		let layerStyle = { layout: {} };
		if (featureType === 'LINE' && style.lineCap) {
			layerStyle.layout = { 'line-cap': style.lineCap };
		}
		let visible = layerInfo.visible;
		layerStyle.layout.visibility = visible;
		layerStyle.style = this._transformStyleToMapBoxGl(style, featureType, expression);
		// ć·»ĺŠ ĺ›ľĺ±‚
		let layerID = layerInfo.layerID;
		this._addOverlayToMap(featureType, source, layerID, layerStyle);
		// ĺ¦‚ćžśéť˘ćś‰čľąćˇ†
		featureType === 'POLYGON' &&
			style.strokeColor &&
			this._addStrokeLineForPoly(style, source, layerID + '-strokeline', visible);
	}

	/**
	 * @private
	 * @function WebMap.prototype._getFiterFeatures
	 * @description é€ščż‡čż‡ć»¤ćťˇä»¶ćźĄčŻ˘ć»ˇč¶łçš„ featureă€‚
	 * @param {string} filterCondition - čż‡ć»¤ćťˇä»¶ă€‚
	 * @param {Array} allFeatures - ĺ›ľĺ±‚ä¸Šçš„ feature é›†ĺ??
	 */
	_getFiterFeatures(filterCondition, allFeatures) {
		if (!filterCondition) {
			return allFeatures;
		}
		let condition = this._replaceFilterCharacter(filterCondition);
		let sql = 'select * from json where (' + condition + ')';
		let filterFeatures = [];
		for (let i = 0; i < allFeatures.length; i++) {
			let feature = allFeatures[i];
			let filterResult = false;
			try {
				filterResult = window.jsonsql.query(sql, {
					properties: feature.properties
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
	 * @function WebMap.prototype._replaceFilterCharacter
	 * @description čŽ·ĺŹ–čż‡ć»¤ĺ­—ç¬¦ä¸˛ă€‚
	 * @param {string} filterString - čż‡ć»¤ćťˇä»¶ă€‚
	 */
	_replaceFilterCharacter(filterString) {
		filterString = filterString
			.replace(/=/g, '==')
			.replace(/AND|and/g, '&&')
			.replace(/or|OR/g, '||')
			.replace(/<==/g, '<=')
			.replace(/>==/g, '>=');
		return filterString;
	}

	/**
	 * @private
	 * @function WebMap.prototype._getRangeStyleGroup
	 * @description čŽ·ĺŹ–ĺ?†ć®µć ·ĺĽŹă€‚
	 * @param {Array.<GeoJSON>} features - featureă€‚
	 */
	_getRangeStyleGroup(layerInfo, features) {
		// ć‰ľĺ‡şĺ?†ć®µĺ€Ľ
		let featureType = layerInfo.featureType;
		let style = layerInfo.style;
		let values = [],
			attributes;

		let themeSetting = layerInfo.themeSetting;
		let customSettings = themeSetting.customSettings;
		let fieldName = themeSetting.themeField;
		let segmentCount = themeSetting.segmentCount;

		features.forEach(feature => {
			attributes = feature.properties || feature.get('Properties');
			if (attributes) {
				//čż‡ć»¤ćŽ‰éťžć•°ĺ€Ľçš„ć•°ćŤ®
				attributes[fieldName] &&
					Util.isNumber(attributes[fieldName]) &&
					values.push(parseFloat(attributes[fieldName]));
			} else if (feature.get(fieldName) && Util.isNumber(feature.get(fieldName))) {
				feature.get(fieldName) && values.push(parseFloat(feature.get(fieldName)));
			}
		}, this);

		let segements = ArrayStatistic.getArraySegments(values, themeSetting.segmentMethod, segmentCount);
		if (segements) {
			let itemNum = segmentCount;
			if (attributes && segements[0] === segements[attributes.length - 1]) {
				itemNum = 1;
				segements.length = 2;
			}

			//äżťç•™ä¸¤ä˝Ťćś‰ć•?ć•°
			for (let key in segements) {
				let value = segements[key];
				value = key == 0 ? Math.floor(value * 100) / 100 : Math.ceil(value * 100) / 100 + 0.1; // ĺŠ 0.1 č§Łĺ†łćś€ĺ¤§ĺ€Ľć˛ˇćś‰ć ·ĺĽŹé—®é˘?
				segements[key] = Number(value.toFixed(2));
			}

			//čŽ·ĺŹ–ä¸€ĺ®šé‡Źçš„é˘śč‰˛
			let curentColors = themeSetting.colors;
			// curentColors = ColorsPickerUtil.getGradientColors(curentColors, itemNum, 'RANGE');

			for (let index = 0; index < itemNum; index++) {
				if (index in customSettings) {
					if (customSettings[index]['segment']['start']) {
						segements[index] = customSettings[index]['segment']['start'];
					}
					if (customSettings[index]['segment']['end']) {
						segements[index + 1] = customSettings[index]['segment']['end'];
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
				if (featureType === 'LINE') {
					style.strokeColor = color;
				} else {
					style.fillColor = color;
				}

				let start = segements[i];
				let end = segements[i + 1];
				let styleObj = JSON.parse(JSON.stringify(style));
				styleGroups.push({ style: styleObj, color: color, start: start, end: end });
			}
			return styleGroups;
		}
	}

	/**
	 * @private
	 * @function WebMap.prototype._formatGeoJSON
	 * @description ć ĽĺĽŹ GeoJSONă€‚
	 * @param {GeoJSON} data - GeoJSON ć•°ćŤ®ă€‚
	 */
	_formatGeoJSON(data) {
		let features = data.features;
		features.forEach((row, index) => {
			row.properties['index'] = index;
			// TODO ĺľ…äĽ?ĺŚ– ĺť?ć ‡č˝¬ćŤ˘
			// if (fileCode !== 'EPSG:4326') {
			//     if(row.geometry.coordinates[0] instanceof Array){
			//         row.geometry.coordinates.forEach((coords, index) => {
			//             let lnglat = this._unproject(coords);
			//             row.geometry.coordinates[index] = [lnglat.lng, lnglat.lat];
			//         }, this)
			//         return;
			//     }
			//     let lnglat = this._unproject(row.geometry.coordinates);
			//     row.geometry.coordinates = [lnglat.lng, lnglat.lat];
			// }
		});
		return features;
	}

	/**
	 * @private
	 * @function WebMap.prototype._excelData2Featureĺ°†
	 * @description csv ĺ’Ś xls ć–‡ä»¶ĺ†…ĺ®ąč˝¬ćŤ˘ć?? geojson
	 * @param content  ć–‡ä»¶ĺ†…ĺ®ą
	 * @param layerInfo  ĺ›ľĺ±‚äżˇć?Ż
	 * @returns {Array}  featureçš„ć•°ç»„é›†ĺ??
	 */
	_excelData2Feature(dataContent) {
		let fieldCaptions = dataContent.colTitles;
		// let fileCode = layerInfo.projection;
		//ä˝Ťç˝®ĺ±žć€§ĺ¤„ç?†
		let xfieldIndex = -1,
			yfieldIndex = -1;
		for (let i = 0, len = fieldCaptions.length; i < len; i++) {
			if (this._isXField(fieldCaptions[i])) {
				xfieldIndex = i;
			}
			if (this._isYField(fieldCaptions[i])) {
				yfieldIndex = i;
			}
		}

		// feature ćž„ĺ»şĺ?Žćśźć”ŻćŚ?ĺť?ć ‡çł» 4326/3857
		let features = [];

		for (let i = 0, len = dataContent.rows.length; i < len; i++) {
			let row = dataContent.rows[i];

			let x = Number(row[xfieldIndex]),
				y = Number(row[yfieldIndex]);
			// let coordinates = [x, y];
			// TODO ĺľ…äĽ?ĺŚ– ĺť?ć ‡č˝¬ćŤ˘
			// if (fileCode !== 'EPSG:4326') {
			//     if(row.geometry.coordinates[0] instanceof Array){
			//         row.geometry.coordinates.forEach((coords, index) => {
			//             let lnglat = this._unproject(coords);
			//             row.geometry.coordinates[index] = [lnglat.lng, lnglat.lat];
			//         }, this)
			//         return;
			//     }
			//     let lnglat = this._unproject(row.geometry.coordinates);
			//     row.geometry.coordinates = [lnglat.lng, lnglat.lat];
			// }

			//ĺ±žć€§äżˇć?Ż
			let attributes = {};
			for (let index in dataContent.colTitles) {
				let key = dataContent.colTitles[index];
				attributes[key] = dataContent.rows[i][index];
			}
			attributes['index'] = i + '';
			//ç›®ĺ‰Ťcsv ĺŹŞć”ŻćŚ?ĺ¤„ç?†ç‚ąďĽŚć‰€ä»Ąĺ…?ç”źć??ç‚ąç±»ĺž‹çš„ geojson
			let feature = {
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [x, y]
				},
				properties: attributes
			};
			features.push(feature);
		}
		return features;
	}

	/**
	 * @private
	 * @function WebMap.prototype._sendMapToUser
	 * @description čż”ĺ›žćś€ç»?çš„ map ĺŻąč±ˇç»™ç”¨ć?·ďĽŚäľ›ä»–ä»¬ć“Ťä˝śä˝żç”¨ă€‚
	 * @param count
	 * @param layersLen
	 */
	_sendMapToUser(count, layersLen) {
		if (count === layersLen) {
			/**
			 * @event WebMap#addlayerssucceeded
			 * @description ć·»ĺŠ ĺ›ľĺ±‚ć??ĺŠźă€‚
			 * @property {mapboxgl.Map} map - MapBoxGL Map ĺŻąč±ˇă€‚
			 * @property {Object} mapparams - ĺś°ĺ›ľäżˇć?Żă€‚
			 * @property {string} mapparams.title - ĺś°ĺ›ľć ‡é˘?ă€‚
			 * @property {string} mapparams.description - ĺś°ĺ›ľćŹŹčż°ă€‚
			 * @property {Array.<Object>} layers - ĺś°ĺ›ľä¸Šć‰€ćś‰çš„ĺ›ľĺ±‚ĺŻąč±ˇ
			 */
			this.fire('addlayerssucceeded', { map: this.map, mapparams: this.mapParams, layers: this.layers });
		}
	}

	/**
	 * @function WebMap.prototype._unproject
	 * @private
	 * @description ĺ˘¨ĺŤˇć‰?č˝¬ç»Źçş¬ĺş¦ă€‚
	 * @param {} point - ĺľ…č˝¬ćŤ˘çš„ç‚ąă€‚
	 */
	_unproject(point) {
		var d = 180 / Math.PI,
			r = 6378137,
			ts = Math.exp(-point[1] / r),
			phi = Math.PI / 2 - 2 * Math.atan(ts);
		for (var i = 0, dphi = 0.1, con; i < 15 && Math.abs(dphi) > 1e-7; i++) {
			con = 1;
			dphi = Math.PI / 2 - 2 * Math.atan(ts * con) - phi;
			phi += dphi;
		}
		return new mapboxgl.LngLat((point[0] * d) / r, phi * d);
	}

	/**
	 * @function WebMap.prototype._getParamString
	 * @private
	 * @param {Object} obj - ĺľ…ć·»ĺŠ çš„ĺŹ‚ć•°ă€‚
	 * @param {string} existingUrl - ĺľ…ć·»ĺŠ ĺŹ‚ć•°çš„ urlă€‚
	 * @param {boolean} [uppercase] - ĺŹ‚ć•°ć?Żĺ?¦č˝¬ćŤ˘ä¸şĺ¤§ĺ†™ă€‚
	 */
	_getParamString(obj, existingUrl, uppercase) {
		var params = [];
		for (var i in obj) {
			params.push((uppercase ? i.toUpperCase() : i) + '=' + obj[i]);
		}
		return (!existingUrl || existingUrl.indexOf('?') === -1 ? '?' : '&') + params.join('&');
	}

	/**
	 * @private
	 * @description ĺ?¤ć–­ć?Żĺ?¦ĺś°ç?†Xĺť?ć ‡
	 * @param data
	 */
	_isXField(data) {
		var lowerdata = data.toLowerCase();
		return (
			lowerdata === 'x' ||
			lowerdata === 'smx' ||
			lowerdata === 'jd' ||
			lowerdata === 'ç»Źĺş¦' ||
			lowerdata === 'ä¸śç»Ź' ||
			lowerdata === 'longitude' ||
			lowerdata === 'lot' ||
			lowerdata === 'lon' ||
			lowerdata === 'lng'
		);
	}

	/**
	 * @private
	 * @description ĺ?¤ć–­ć?Żĺ?¦ĺś°ç?†Yĺť?ć ‡
	 * @param data
	 */
	_isYField(data) {
		var lowerdata = data.toLowerCase();
		return (
			lowerdata === 'y' ||
			lowerdata === 'smy' ||
			lowerdata === 'wd' ||
			lowerdata === 'çş¬ĺş¦' ||
			lowerdata === 'ĺŚ—çş¬' ||
			lowerdata === 'latitude' ||
			lowerdata === 'lat'
		);
	}

	/**
	 * @private
	 * @function WebMap.prototype._transformStyleToMapBoxGl
	 * @description ć ąćŤ®ĺ›ľĺ±‚ç±»ĺž‹ĺ°† layerInfo ä¸­çš„ style ĺ±žć€§ć ĽĺĽŹč˝¬ćŤ˘ä¸ş mapboxgl ä¸­çš„ style ć ĽĺĽŹă€‚
	 * @param {Object} style - layerInfoä¸­çš„styleĺ±žć€§
	 * @param {string} type - ĺ›ľĺ±‚ç±»ĺž‹
	 * @param {Array} [expression] - ĺ­?ĺ‚¨é˘śč‰˛ĺ€Ľĺľ—čˇ¨čľľĺĽŹ
	 */
	_transformStyleToMapBoxGl(style, type, expression) {
		let transTable = {};
		if ((style.type === 'POINT' || style.type === 'BASIC_POINT' || type === 'POINT') && type !== 'LINE') {
			transTable = {
				fillColor: 'circle-color',
				strokeWidth: 'circle-stroke-width',
				fillOpacity: 'circle-opacity',
				radius: 'circle-radius',
				strokeColor: 'circle-stroke-color',
				strokeOpacity: 'circle-stroke-opacity'
			};
		} else if (type === 'LINE') {
			transTable = {
				strokeWidth: 'line-width',
				strokeColor: 'line-color',
				strokeOpacity: 'line-opacity'
			};
		} else if (type === 'POLYGON') {
			transTable = {
				fillColor: 'fill-color',
				fillOpacity: 'fill-opacity',
				strokeColor: 'fill-outline-color'
			};
		}

		let newObj = {};
		for (let item in style) {
			if (transTable[item]) {
				newObj[transTable[item]] = style[item];
			}
		}
		if (expression) {
			if (newObj['circle-color']) {
				newObj['circle-color'] = expression;
			} else if (newObj['line-color']) {
				newObj['line-color'] = expression;
			} else {
				newObj['fill-color'] = expression;
			}
		}
		if (style.lineDash && style.lineDash !== 'solid' && type === 'LINE') {
			newObj['line-dasharray'] = this._dashStyle(style);
		}
		return newObj;
	}

	/**
	 * @private
	 * @function WebMap.prototype.._dashStyle
	 * @description ç¬¦ĺŹ·ć ·ĺĽŹă€‚
	 * @param {Object} style - ć ·ĺĽŹĺŹ‚ć•°ă€‚
	 * @param {number} widthFactor - ĺ®˝ĺş¦çł»ć•°ă€‚
	 */
	_dashStyle(style) {
		if (!style) {
			return [];
		}
		// var w = style.strokeWidth * widthFactor;
		var w = 1;
		var str = style.strokeDashstyle || style.lineDash;
		switch (str) {
			case 'solid':
				return [];
			case 'dot':
				return [1, 4 * w];
			case 'dash':
				return [4 * w, 4 * w];
			case 'dashdot':
				return [4 * w, 4 * w, 1 * w, 4 * w];
			case 'longdash':
				return [8 * w, 4 * w];
			case 'longdashdot':
				return [8 * w, 4 * w, 1, 4 * w];
			default:
				if (!str) {
					return [];
				}
				if (CommonUtil.isArray(str)) {
					return str;
				}
				str = StringExt.trim(str).replace(/\s+/g, ',');
				return str.replace(/\[|\]/gi, '').split(',');
		}
	}

	/**
	 * @private
	 * @description ĺ°†SVGč˝¬ćŤ˘ć??Canvas
	 * @param svgUrl
	 * @param divDom
	 * @param callBack
	 */
	_getCanvasFromSVG(svgUrl, divDom, callBack) {
		//ä¸€ä¸Şĺ›ľĺ±‚ĺŻąĺş”ä¸€ä¸Şcanvas
		let canvas = document.createElement('canvas');
		canvas.id = 'dataviz-canvas-' + Util.newGuid(8);
		canvas.style.display = 'none';
		divDom.appendChild(canvas);
    const canvgs = window.canvg && window.canvg.default ? window.canvg.default : Canvg;
    const ctx = canvas.getContext('2d');
    canvgs.from(ctx, svgUrl, {
      ignoreMouse: true,
      ignoreAnimation: true,
      forceRedraw: () => false
    }).then(v => {
      v.start();
      this._canvgsV.push(v);
      if (canvas.width > 300 || canvas.height > 300) {
        return;
      }
      callBack(canvas);
    });
	}

  _stopCanvg() {
    this._canvgsV.forEach(v => v.stop());
    this._canvgsV = [];
  }
	/**
	 * @private
	 * @function WebMap.prototype._addOverlayToMap
	 * @description ć·»ĺŠ ĺźşçˇ€çź˘é‡Źĺ›ľĺ±‚ĺ?° MAP
	 * @param {Object} style - mabgl style
	 * @param {string} type - ĺ›ľĺ±‚ç±»ĺž‹
	 */
	_addOverlayToMap(type, source, layerID, layerStyle) {
		let mbglTypeMap = {
			POINT: 'circle',
			LINE: 'line',
			POLYGON: 'fill'
		};
		type = mbglTypeMap[type];
		if (type === 'circle' || type === 'line' || type === 'fill') {
			this.map.addLayer({
				id: layerID,
				type: type,
				source: source,
				paint: layerStyle.style,
				layout: layerStyle.layout || {}
			});
		}
	}

	_addBaselayer(url, layerID, minzoom = 0, maxzoom = 22, isIserver) {
		this.map.addLayer({
			id: layerID,
			type: 'raster',
			source: {
				type: 'raster',
				tiles: url,
                tileSize: 256,
                rasterSource: isIserver ? 'iserver' : '',
                prjCoordSys: isIserver ? { epsgCode: this.baseProjection.split(':')[1] } : ''
			},
			minzoom: minzoom,
			maxzoom: maxzoom
		});
	}
	/**
	 * @private
	 * @function WebMap.prototype._addStrokeLineForPoly
	 * @description ć·»ĺŠ éť˘çš„čľąćˇ†ă€‚
	 * @param {Object} style - mabgl style
	 */
	_addStrokeLineForPoly(style, source, layerID, visible) {
		let lineStyle = {};
		lineStyle.style = this._transformStyleToMapBoxGl(style, 'LINE');
		lineStyle.layout = { visibility: visible };
		this._addOverlayToMap('LINE', source, layerID, lineStyle);
	}
	/**
	 * @private
	 * @function WebMap.prototype._parseGeoJsonData2Feature
	 * @description ĺ°†ä»ŽrestDataĺś°ĺť€ä¸ŠčŽ·ĺŹ–çš„jsonč˝¬ćŤ˘ć??featureďĽ?ä»Žiserverä¸­čŽ·ĺŹ–çš„jsonč˝¬ćŤ˘ć??featureďĽ‰
	 * @param {Object} metaData - jsonĺ†…ĺ®ą
	 * @returns {Array}  mabgl.featureçš„ć•°ç»„é›†ĺ??
	 */
	_parseGeoJsonData2Feature(metaData) {
		let allFeatures = metaData.allDatas.features,
			features = [];
		for (let i = 0, len = allFeatures.length; i < len; i++) {
			// TODO ĺť?ć ‡č˝¬ćŤ˘
			let feature = allFeatures[i];
			let coordinate = feature.geometry.coordinates;
			if (allFeatures[i].geometry.type === 'Point') {
				// ć ‡ćł¨ĺ›ľĺ±‚ čż?ć˛ˇćś‰ĺ±žć€§ĺ€Ľć—¶ĺ€™ä¸ŤĺŠ 
				if (allFeatures[i].properties) {
					allFeatures[i].properties.lon = coordinate[0];
					allFeatures[i].properties.lat = coordinate[1];
				}
			}
			feature.properties['index'] = i + '';
			features.push(feature);
		}
		return features;
	}

	/**
	 * @private
	 * @function WebMap.prototype._getFeatureBySQL
	 * @description é€ščż‡ sql ć–ąĺĽŹćźĄčŻ˘ć•°ćŤ®ă€‚
	 */
	_getFeatureBySQL(url, datasetNames, processCompleted, processFaild) {
		let getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
		getFeatureParam = new FilterParameter({
			name: datasetNames.join().replace(':', '@'),
			attributeFilter: 'SMID > 0'
		});
		getFeatureBySQLParams = new GetFeaturesBySQLParameters({
			queryParameter: getFeatureParam,
			datasetNames: datasetNames,
			fromIndex: 0,
			toIndex: 100000,
			returnContent: true
		});
		let options = {
			eventListeners: {
				processCompleted: getFeaturesEventArgs => {
					processCompleted && processCompleted(getFeaturesEventArgs);
				},
				processFailed: e => {
					processFaild && processFaild(e);
				}
			}
		};
		getFeatureBySQLService = new GetFeaturesBySQLService(url, options);
		getFeatureBySQLService.processAsync(getFeatureBySQLParams);
	}

	/**
	 * @private
	 * @function WebMap.prototype._queryFeatureBySQL
	 * @description é€ščż‡ sql ć–ąĺĽŹćźĄčŻ˘ć•°ćŤ®ă€‚
	 */
	_queryFeatureBySQL(
		url,
		layerName,
		attributeFilter,
		fields,
		epsgCode,
		processCompleted,
		processFaild,
		startRecord,
		recordLength,
		onlyAttribute
	) {
		var queryParam, queryBySQLParams, queryBySQLService;
		queryParam = new FilterParameter({
			name: layerName,
			attributeFilter: attributeFilter
		});
		if (fields) {
			queryParam.fields = fields;
		}
		var params = {
			queryParams: [queryParam]
		};
		if (onlyAttribute) {
			params.queryOption = QueryOption.ATTRIBUTE;
		}
		startRecord && (params.startRecord = startRecord);
		recordLength && (params.expectCount = recordLength);
		if (epsgCode) {
			params.prjCoordSys = {
				epsgCode: epsgCode
			};
		}
		queryBySQLParams = new QueryBySQLParameters(params);
		queryBySQLService = new QueryService(url);
		queryBySQLService.queryBySQL(queryBySQLParams, data => {
			data.type === 'processCompleted' ? processCompleted(data) : processFaild(data);
		});
	}

	/**
	 * @private
	 * @function WebMap.prototype._handleMultyPolygon
	 * @description ĺ¤„ç?†ĺ¤Ťćť‚éť˘ć?…ĺ†µ
	 */
	_handleMultyPolygon(features) {
		features.forEach(feature => {
			if (feature.geometry.type !== 'Polygon') {
				return;
			}
			let coords = feature.geometry.coordinates;
			if (coords.length > 1) {
				let coordinates = [];
				coords.forEach(coord => {
					coordinates.push([coord]);
				});
				feature.geometry.coordinates = coordinates;
				feature.geometry.type = 'MultiPolygon';
			}
		});
		return features;
    }

    _transformScaleToZoom(scale, crs) {
        let scale_0 = 295829515.2024169;
        if ((crs || this.map.getCRS()).epsgCode !== 'EPSG:3857') {
          scale_0 = 295295895;
        }
        const scaleDenominator = scale.split(':')[1];
        return Math.min(24, +Math.log2(scale_0 / +scaleDenominator).toFixed(2));
    }

    _getResolution(bounds, tileSize = 512.0) {
        if (bounds.leftBottom && bounds.rightTop) {
            return Math.max(bounds.rightTop.x - bounds.leftBottom.x, bounds.rightTop.y - bounds.leftBottom.y) / tileSize;
        }
        return Math.max(bounds[2] - bounds[0], bounds[3] - bounds[1]) / tileSize;
    }
}

