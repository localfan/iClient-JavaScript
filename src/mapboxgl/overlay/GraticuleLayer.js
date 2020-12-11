/* Copyright© 2000 - 2020 SuperMap Software Co.Ltd. All rights reserved.
 * This program are made available under the terms of the Apache License, Version 2.0
 * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html.*/
/**
 * reference and modification
 * dereklieu/cool-grid, cloudybay/leaflet.latlng-graticule
 * (https://github.com/dereklieu/cool-grid, https://github.com/cloudybay/leaflet.latlng-graticule)
 * Apache Licene 2.0
 * thanks dereklieu, cloudybay
 */

import { getWrapNum, conversionDegree } from '@supermap/iclient-common';
import mapboxgl from 'mapbox-gl';
import proj4 from 'proj4';

/**
 * @class mapboxgl.supermap.GraticuleLayer
 * @category Visualization GraticuleLayer
 * @classdesc 经纬网。
 * @param {mapboxgl.Map} map - mapboxgl 地图对象,将在下个版本弃用，请用 map.addLayer() 方法添加图层。
 * @param {Object} options -经纬网参数。
 * @param {boolean} [options.visible=true] - 是否显示经纬网。
 * @param {boolean} [options.showLabel=true] - 是否显示标签。
 * @param {number} [options.opacity=1] - 画布透明度。
 * @param {number|Function} [options.interval = 10] - 经纬度的间隔（以度为单位），可以是数字，也可以是函数，参数是map。
 * @param {mapboxgl.LngLatBounds} [options.extent] - 经纬网渲染的边界范围（[minx, miny, maxx, maxy]），不传为整个地图范围。
 * @param {number} [options.minZoom] - 	最小视图缩放级别（不包括此级别），在该级别之上，该层将可见。。
 * @param {number} [options.maxZoom] - 该图层可见的最大视图缩放级别（含）。
 * @param {Function} [options.lngLabelFormatter = null] - 经度标签转换函数。
 * @param {Function} [options.latLabelFormatter = null] - 纬度标签转换函数。
 * @param {mapboxgl.supermap.GraticuleLayer.LabelStyle} [options.lngLabelStyle] - 经度标签样式。
 * @param {mapboxgl.supermap.GraticuleLayer.LabelStyle} [options.latLabelStyle] - 纬度标签样式。
 * @param {mapboxgl.supermap.GraticuleLayer.StrokeStyle} [options.strokeStyle] - 绘制经纬线的样式。
 */

/**
 * @typedef {Object} mapboxgl.supermap.GraticuleLayer.LabelStyle - 标签样式
 * @property {Array.<string>} [textFont = ['Calibri','sans-serif']] - 字体样式。
 * @property {string} [textSize = '12px'] - 字体大小。
 * @property {string} [textColor ='rgba(0,0,0,1)'] - 字体颜色
 * @property {string} [textHaloColor ='rgba(255,255,255,1)'] - 描边颜色
 * @property {number} [textHaloWidth = 1] - 描边宽度
 * @property {string} [textAnchor = 'bottom'] - 字体基线: "center", "left", "right", "top", "bottom", "top-left", "top-right", "bottom-left", "bottom-right"
 */

/**
 * @typedef {Object} mapboxgl.supermap.GraticuleLayer.StrokeStyle - 线样式
 * @property {string} [lineColor = 'red'] - 线颜色。
 * @property {string} [lineCap = 'round'] - 线端点风格：butt, round, square。
 * @property {string} [lineJoin = round] - 线连接样式：bevel, round, miter。
 * @property {Array.<number>|Function} [lindDasharray = [0.5,4]] - 虚线样式。可以是数组，也可以是函数，参数是map。
 * @property {number|Function} [lineWidth = 1] - 线宽：可以是数字，也可以是函数，参数是map。
 */

const defaultTextStyle = {
    textSize: '12px',
    textFont: ['12px Calibri', 'sans-serif'],
    textAnchor: 'bottom',
    textColor: 'rgba(0,0,0,1)',
    textHaloColor: 'rgba(255,255,255,1)',
    textHaloWidth: 1
};
const defaultStrokeStyle = {
    lineColor: 'red',
    lineCap: 'round', // butt, round, square
    lineJoin: 'round', // bevel, round, miter
    lindDasharray: [0.4, 5], // 数组|function
    lineDashOffset: 0,
    lineWidth: 1 // 数字|function
};
const defaultOptions = {
    showLabel: true,
    opacity: 1,
    visible: true,
    interval: 10, // function|number
    extent: null,
    minZoom: 0,
    maxZoom: 50,
    wrapX: true,
    strokeStyle: defaultStrokeStyle,
    lngLabelFormatter: null,
    latLabelFormatter: null,
    lngLabelStyle: defaultTextStyle,
    latLabelStyle: defaultTextStyle
};
export class GraticuleLayer {
    constructor(map, options) {
        this.map = map;
        this.canvasId = 'sm-graticule-canvasid';
        this.sourceId = 'sm-graticule-layer';
        this.options = options;
        this.resetEvent = this._reset.bind(this);
        this.styleDataEevent = this._setLayerTop.bind(this);
        this.resizeEvent = this._resizeCallback.bind(this);
        this.zoomendEvent = this.setVisibility.bind(this);
    }

    onAdd(map = this.map) {
        this.map = map;
        this._initialize();
        this._createCanvas();
        this._bindEvent();
        this._drawCanvas();
        this._addGraticuleLayer();
    }

    /**
     * @function mapboxgl.supermap.GraticuleLayer.prototype.removeFromMap
     * @description 移除图层。
     */
    removeFromMap() {
        this.mapContainer.removeChild(this.canvas);
        this.canvas = null;
        this._unbindEvent();
    }

    /**
     * @function mapboxgl.supermap.GraticuleLayer.prototype.setVisibility
     * @description 设置是否可见。
     */
    setVisibility(visible) {
        const zoom = this.map.getZoom();
        this.options.visible = typeof visible == 'boolean' ? visible : this.options.visible;
        this.visible =
            typeof visible == 'boolean'
                ? visible
                : this.options.visible && zoom >= this.options.minZoom && zoom <= this.options.maxZoom;
        if (this.map.getLayer(this.sourceId)) {
            this.map.setLayoutProperty(this.sourceId, 'visibility', this.visible ? 'visible' : 'none');
        }
        this._drawLabel();
    }

    _bindEvent() {
        this.map.on('move', this.resetEvent);
        this.map.on('moveend', this.resetEvent);
        this.map.on('styledata', this.styleDataEevent);
        this.map.on('resize', this.resizeEvent);
        this.map.on('zoomend', this.zoomendEvent);
    }

    _unbindEvent() {
        this.map.off('move', this.resetEvent);
        this.map.off('moveend', this.resetEvent);
        this.map.off('styledata', this.styleDataEevent);
        this.map.off('resize', this.resizeEvent);
        this.map.off('zoomend', this.zoomendEvent);
    }

    _initialize(map = this.map, options = this.options) {
        options = options || {};
        options.strokeStyle = { ...defaultStrokeStyle, ...(options.strokeStyle || {}) };
        options.lngLabelStyle = { ...defaultTextStyle, ...(options.lngLabelStyle || {}) };
        options.latLabelStyle = { ...defaultTextStyle, ...(options.latLabelStyle || {}) };
        this.options = {
            ...defaultOptions,
            ...options,
            extent: this._getDefaultExtent(options.extent, map),
            wrapX: typeof options.wrapX === 'boolean' ? options.wrapX : map.getRenderWorldCopies()
        };
        this.oldExtent = this.options.extent;
        this._calcInterval();
        this.isRotate = false;
        this.features = this._getGraticuleFeatures();
    }

    _createCanvas() {
        if (this.canvas) {
            return;
        }
        this.canvas = document.createElement('canvas');
        this.canvas.id = this.canvasId;
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = 0 + 'px';
        this.canvas.style.left = 0 + 'px';
        var global$2 = typeof window === 'undefined' ? {} : window;
        var devicePixelRatio = global$2.devicePixelRatio || 1;
        this.canvas.width = parseInt(this.map.getCanvas().style.width) * devicePixelRatio;
        this.canvas.height = parseInt(this.map.getCanvas().style.height) * devicePixelRatio;
        this.canvas.style.width = this.map.getCanvas().style.width;
        this.canvas.style.height = this.map.getCanvas().style.height;
        this.canvas.globalAlpha = this.options.opacity;
        this.mapContainer = this.map.getCanvasContainer();
        this.mapContainer.appendChild(this.canvas);
    }

    _drawCanvas() {
        if (!this.canvas) {
            this._createCanvas();
        }
        this.setVisibility();
        this._reset();
    }

    _resizeCallback() {
        this.mapContainer && this.mapContainer.removeChild(this.canvas);
        this.canvas = null;
        this._drawCanvas();
    }

    _reset() {
        this._updateRotate();
        this._updateExtent();
        this._calcInterval();
        this._drawLabel();
    }

    _setLayerTop(map = this.map) {
        if (!map) {
            return;
        }
        const layersOnMap = map.getStyle && map.getStyle().layers;
        if (
            layersOnMap &&
            layersOnMap.length &&
            layersOnMap.findIndex(item => item.id === this.sourceId) !== layersOnMap.length - 1
        ) {
            if (map.getLayer(this.sourceId)) {
                map.removeLayer(this.sourceId);
                this._addGraticuleLayer();
            }
        }
    }

    _getDefaultExtent(extent, map = this.map) {
        const crs = (map.getCRS && map.getCRS()) || {};
        let { epsgCode, extent: crsExtent } = crs;
        if (!crsExtent) {
            epsgCode = 'EPSG:3857';
            crsExtent = [-20037508.3427892, -20037508.3427892, 20037508.3427892, 20037508.3427892];
        }
        crsExtent = [
            ...this._unproject([crsExtent[0], crsExtent[1]], epsgCode),
            ...this._unproject([crsExtent[2], crsExtent[3]], epsgCode)
        ];
        if (!extent || extent.length === 0) {
            return crsExtent;
        }
        const { _sw, _ne } = mapboxgl.LngLatBounds.convert(extent);
        extent = [_sw.lng, _sw.lat, _ne.lng, _ne.lat];
        extent = [
            Math.max(crsExtent[0], extent[0]),
            Math.max(crsExtent[1], extent[1]),
            Math.min(crsExtent[2], extent[2]),
            Math.min(crsExtent[3], extent[3])
        ];
        return extent;
    }

    _unproject(point, epsgCode) {
        if (epsgCode === 'EPSG:4326') {
            return point;
        }
        const coor = proj4(epsgCode, 'EPSG:4326', point);
        const proj = proj4.defs(epsgCode);
        if (proj.axis && proj.axis.indexOf('ne') === 0) {
            coor.reverse();
        }
        return coor;
    }

    _updateRotate() {
        const canvas = this.canvas;
        const sw = this.map.unproject([0, canvas.height]);
        const ne = this.map.unproject([canvas.width, 0]);
        this.isRotate = sw.lng > ne.lng;
    }

    _updateExtent() {
        if (this.options.wrapX && !this.oldExtent) {
            const { _ne, _sw } = this.map.getBounds();
            this.options.extent = [_sw.lng, _sw.lat, _ne.lng, _ne.lat];
        }
    }

    _calcInterval(interval = this.options.interval) {
        if (typeof interval === 'function') {
            interval = interval(this.map);
            this._currLngInterval = interval;
            this._currLatInterval = interval;
        } else {
            this._currLngInterval = interval;
            this._currLatInterval = interval;
        }
    }

    _formatLat(lat) {
        if (this.options.latFormatTickLabel) {
            return this.options.latLabelFormatter(lat);
        }
        if (lat < 0) {
            return '' + conversionDegree(lat * -1) + 'S';
        } else if (lat > 0) {
            return '' + conversionDegree(lat) + 'N';
        }
        return '' + conversionDegree(lat);
    }

    _formatLng(lng) {
        if (this.options.lngLabelFormatter) {
            return this.options.lngLabelFormatter(lng);
        }
        lng = getWrapNum(lng);
        if (lng > 0 && lng <= 180) {
            return '' + conversionDegree(lng) + 'E';
        } else if (lng < 0 && lng >= -180) {
            return '' + conversionDegree(lng * -1) + 'W';
        }
        return '' + conversionDegree(lng);
    }

    _parsePxToInt(txt) {
        if (txt.length > 2) {
            if (txt.charAt(txt.length - 2) === 'p') {
                txt = txt.substr(0, txt.length - 2);
            }
        }
        try {
            return parseInt(txt, 10);
        } catch (e) {
            console.log(e);
        }
        return 0;
    }

    _drawLabel(visible = this.visible) {
        const canvas = this.canvas;
        const ctx = canvas.getContext('2d');
        if (!visible || !this.options.showLabel) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }
        if (this.map) {
            if (!this._currLngInterval || !this._currLatInterval) {
                this._calcInterval();
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const { lngLabelStyle, latLabelStyle } = this.options;
            const { lngPoints, latPonits } = this._getGridiculePoints();
            lngPoints.forEach(point => {
                this._drawLng(ctx, point[0], point[1], point[2], lngLabelStyle);
            });
            latPonits.forEach(point => {
                this._drawLat(ctx, point[0], point[1], point[2], latLabelStyle);
            });
        }
    }

    _drawLat(ctx, latTick, bb, isIntersect, latLabelStyle) {
        ctx = this._setLabelStyle(ctx, latLabelStyle);
        const ww = this.canvas.width;
        let txtHeight = 12;
        try {
            const fontSize = ctx.font.split(' ')[0];
            txtHeight = this._parsePxToInt(fontSize);
        } catch (e) {
            console.log(e);
        }
        if (!isIntersect) {
            const lngR = latTick;
            latTick = bb;
            bb = this.map.project([lngR, latTick]);
        }
        const latstr = this._formatLat(latTick);
        const txtWidth = ctx.measureText(latstr).width;
        ctx.strokeText(latstr, (isIntersect ? ww : bb.x) - txtWidth, (isIntersect ? bb : bb.y) + txtHeight / 2);
        ctx.fillText(latstr, (isIntersect ? ww : bb.x) - txtWidth, (isIntersect ? bb : bb.y) + txtHeight / 2);
    }

    _drawLng(ctx, lngTick, bb, isIntersect, lngLabelStyle) {
        ctx = this._setLabelStyle(ctx, lngLabelStyle);
        const hh = this.canvas.height;
        if (!isIntersect) {
            const latTick = bb;
            bb = this.map.project([lngTick, latTick]);
        }
        const lngstr = this._formatLng(lngTick);
        const txtWidth = ctx.measureText(lngstr).width;
        ctx.strokeText(lngstr, (isIntersect ? bb : bb.x) - txtWidth / 2, isIntersect ? hh : bb.y);
        ctx.fillText(lngstr, (isIntersect ? bb : bb.x) - txtWidth / 2, isIntersect ? hh : bb.y);
    }

    _getLatPoints(lngRange = [-180, 180], firstLng, lastLng, features = this.features) {
        if (!features) {
            return;
        }
        if (this.options.wrapX && lngRange[0] === -180 && lngRange[1] === 180) {
            return [];
        }
        let points = [];

        features.forEach(feature => {
            const lat = feature.geometry.coordinates[0][1];

            const isLatFeature = feature.geometry.coordinates[1][1];

            if (isLatFeature) {
                let lng = typeof lastLng === 'number' ? lastLng : lngRange[1];
                if (this.isRotate) {
                    lng = typeof firstLng === 'number' ? firstLng : lngRange[0];
                }
                if (this.options.wrapX) {
                    points = points.concat(this._getWrapPoints(lng, lat, [lng, lng]));
                }
                points.push([lng, lat]);
            }
        });
        return points;
    }

    _getLngPoints(latRange = [-90, 90], firstLat, lastLat, features = this.features) {
        if (!features) {
            return;
        }

        let lat = typeof firstLat === 'number' ? firstLat : latRange[0];
        if (this.isRotate) {
            lat = typeof lastLat === 'number' ? lastLat : latRange[1];
        }
        let points = [];

        features.forEach(feature => {
            let lng = feature.geometry.coordinates[0][0];
            const isLngFeature = feature.geometry.coordinates[1][0];
            if (isLngFeature) {
                points.push([lng, lat]);
                if (this.options.wrapX) {
                    points = points.concat(this._getWrapPoints(lng, lat));
                }
            }
        });

        return points;
    }

    _getWrapPoints(lng, lat, extent = this.oldExtent) {
        const points = [];
        const { _ne, _sw } = this.map.getBounds();
        const lastLng = extent.length > 2 ? extent[2] : extent[1];
        while (lng >= _sw.lng) {
            const wrapNum = getWrapNum(lng, lastLng === 180, extent[0] === -180);
            // if (wrapNum === -180 && lastLng === 180 && extent[0] !== -180) {
            //     wrapNum = 180;
            // }
            if (!extent || (wrapNum >= extent[0] && wrapNum <= lastLng)) {
                points.push([lng, lat]);
            }
            lng -= 360;
        }
        while (lng <= _ne.lng) {
            const wrapNum = getWrapNum(lng, lastLng === 180, extent[0] === -180);
            // let wrapNum = getWrapNum(lng);
            // if (wrapNum === 180 && lastLng !== 180 && extent[0] === -180) {
            //     wrapNum = -180;
            // }
            if (!extent || (wrapNum >= extent[0] && wrapNum <= lastLng)) {
                points.push([lng, lat]);
            }
            lng += 360;
        }
        return points;
    }

    _getGridiculePoints() {
        const intersectLatPoints = this._getEdgeLat();
        const intersectLngPoints = this._getEdgeLng();
        const { latRange, lngRange, firstLat, firstLng, lastLat, lastLng } = this._getRange();
        const latPonits = this._getUniquePoint(this._getLatPoints(lngRange, firstLng, lastLng), intersectLatPoints, 1);
        const lngPoints = this._getUniquePoint(this._getLngPoints(latRange, firstLat, lastLat), intersectLngPoints, 0);
        return { latPonits, lngPoints };
    }

    _getEdgeLat(_currLatInterval = this._currLatInterval, map = this.map) {
        let latPoints = [];
        let latCoordinates = [];
        let firstLat;
        const ww = this.canvas.width;
        const hh = this.canvas.height;
        const { extent } = this._getRange();
        const { _ne } = this.map.getBounds();
        if (this.options.wrapX && getWrapNum(_ne.lng) > extent[2]) {
            return [];
        }
        const countDecimals = this._countDecimals(_currLatInterval);
        for (let i = 0; i <= hh; i++) {
            const point = map.unproject([ww, i]);
            const wrapNum = getWrapNum(point.lng);
            const lngEdge = this.options.wrapX
                ? wrapNum >= extent[0] && wrapNum <= extent[2]
                : point.lng >= extent[0] && point.lng <= extent[2];
            if (lngEdge && point.lat >= extent[1] && point.lat <= extent[3]) {
                latPoints.push([point.lat, i]);
                latCoordinates.push(point.lat);
                if (firstLat === undefined && point.lat.toFixed(countDecimals) % _currLatInterval === 0) {
                    firstLat = Number(point.lat.toFixed(countDecimals));
                }
            }
        }
        const { first, last, coordinates, points } = this._getIntersectRange(
            firstLat,
            latCoordinates,
            latPoints,
            _currLatInterval
        );

        firstLat = Math.min(Math.max(first, -90), 90);
        const lastLat = Math.max(Math.min(Math.round(last), 90), -90);
        if (firstLat !== -90 || lastLat !== -90) {
            return this._getClosestCoordinate(firstLat, lastLat, coordinates, points, _currLatInterval);
        }
        return [];
    }

    _getEdgeLng(_currLngInterval = this._currLngInterval, map = this.map) {
        let lngPoints = [];
        let lngCoordinates = [];
        let firstLng;
        const ww = this.canvas.width;
        const hh = this.canvas.height;
        const extent = this.options.extent;
        const countDecimals = this._countDecimals(_currLngInterval);
        const { _sw } = this.map.getBounds();
        if (this.options.wrapX && getWrapNum(_sw.lat) > extent[3]) {
            return [];
        }
        for (let i = 0; i <= ww; i++) {
            const point = map.unproject([i, hh]);
            const wrapNum = getWrapNum(point.lng);
            const lngEdge = this.options.wrapX
                ? wrapNum >= extent[0] && wrapNum <= extent[2]
                : point.lng >= extent[0] && point.lng <= extent[2];
            if (lngEdge && point.lat >= extent[1] && point.lat <= extent[3]) {
                lngPoints.push([point.lng, i]);
                lngCoordinates.push(point.lng);
                if (firstLng === undefined && point.lng.toFixed(countDecimals) % _currLngInterval === 0) {
                    firstLng = Number(point.lng.toFixed(countDecimals));
                }
            }
        }
        const { first, last: lastLng, coordinates, points } = this._getIntersectRange(
            firstLng,
            lngCoordinates,
            lngPoints,
            _currLngInterval
        );
        firstLng = first;
        return this._getClosestCoordinate(firstLng, lastLng, coordinates, points, _currLngInterval);
    }

    _getIntersectRange(first, coordinates, points, interval) {
        let last = coordinates[coordinates.length - 1];
        if (first > last) {
            last = first;
            coordinates.reverse();
            points.reverse();
            const countDecimals = this._countDecimals(interval);
            for (let i = 0; i <= coordinates.length; i++) {
                const point = coordinates[i];
                if (point.toFixed(countDecimals) % interval === 0) {
                    first = Number(point.toFixed(countDecimals));
                    break;
                }
            }
        }
        return { first, last, coordinates, points };
    }

    _getClosestCoordinate(first, last, coordinates, points, interval) {
        let result = [];
        let graticule = first;
        while (graticule <= last) {
            const index = this._getClosestNumberIndex(graticule, coordinates);
            const point = points[index];
            result.push([Math.round(point[0]), point[1], true]);
            graticule += interval;
            coordinates = coordinates.slice(index);
            points = points.slice(index);
        }
        return result;
    }

    _getClosestNumberIndex(num, arr) {
        var index = 0;
        var diffValue = Number.MAX_VALUE;
        for (var i = 0; i < arr.length; i++) {
            var newDiffValue = Math.abs(arr[i] - num);
            if (newDiffValue <= diffValue) {
                if (newDiffValue === diffValue && arr[i] < arr[index]) {
                    continue;
                }
                index = i;
                diffValue = newDiffValue;
            }
        }
        return index;
    }

    _getUniquePoint(points, intersectPoints, index = 0) {
        if (this.options.wrapX) {
            return points.concat(intersectPoints);
        }
        if (!intersectPoints || intersectPoints.length === 0) {
            return points;
        }
        var tmp = intersectPoints;
        for (var i in points) {
            if (!tmp.find(item => item[0] === points[i][index])) {
                tmp.push(points[i]);
            }
        }
        return tmp;
    }

    _countDecimals(value) {
        if (Math.floor(value) !== value) {
            return value.toString().split('.')[1].length || 0;
        }
        return 0;
    }

    _addGraticuleLayer(features = this.features) {
        if (!this.map.getSource(this.sourceId)) {
            const source = {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features
                }
            };
            this.map.addSource(this.sourceId, source);
        }

        if (!this.map.getLayer(this.sourceId)) {
            this.map.addLayer({
                id: this.sourceId,
                type: 'line',
                source: this.sourceId,
                ...this._transformStrokeStyle()
            });
        }
    }

    _getGraticuleFeatures() {
        const _currLngInterval = this._currLngInterval || 10;
        const _currLatInterval = this._currLatInterval || 10;
        const features = [];
        let { latRange, lngRange, firstLat, firstLng, lastLat, lastLng } = this._getRange();

        if (this.options.wrapX && !this.oldExtent) {
            latRange = [-90, 90];
            lngRange = [-180, 180];
            firstLat = firstLng = lastLat = lastLng = null;
        }
        if (typeof firstLng === 'number') {
            features.unshift(this._makeLineFeature(this._makeLineCoords(firstLng, latRange, firstLat, lastLat)));
        }
        if (typeof lastLng === 'number') {
            features.unshift(this._makeLineFeature(this._makeLineCoords(lastLng, latRange, firstLat, lastLat)));
        }
        for (var lng = lngRange[0]; lng <= lngRange[1]; lng += _currLngInterval) {
            features.unshift(this._makeLineFeature(this._makeLineCoords(lng, latRange, firstLat, lastLat)));
        }

        if (typeof firstLat === 'number') {
            features.unshift(this._makeLineFeature(this._makeLineCoords(firstLat, lngRange, firstLng, lastLng, 'lat')));
        }
        if (typeof lastLat === 'number') {
            features.unshift(this._makeLineFeature(this._makeLineCoords(lastLat, lngRange, firstLng, lastLng, 'lat')));
        }

        for (var lat = latRange[0]; lat <= latRange[1]; lat += _currLatInterval) {
            features.unshift(this._makeLineFeature(this._makeLineCoords(lat, lngRange, firstLng, lastLng, 'lat')));
        }
        return features;
    }

    _getRange(extent = this.options.extent && [...this.options.extent]) {
        if (!extent || extent.length === 0) {
            extent = this._getDefaultExtent();
        }
        extent = extent.map(item => {
            return Number(item.toFixed(6));
        });
        const realExtent = {};
        if (extent[1] % this._currLatInterval !== 0) {
            realExtent.firstLat = extent[1];
            let intNumber = parseInt(extent[1] / this._currLatInterval);
            intNumber = extent[1] > 0 ? intNumber + 1 : intNumber - 1;
            extent[1] = intNumber * this._currLatInterval;
        }
        if (extent[3] % this._currLatInterval !== 0) {
            realExtent.lastLat = extent[3];
            extent[3] = parseInt(extent[3] / this._currLatInterval) * this._currLatInterval;
        }
        if (extent[0] % this._currLngInterval !== 0) {
            realExtent.firstLng = extent[0];
            let intNumbers = parseInt(extent[0] / this._currLngInterval);
            extent[0] = intNumbers * this._currLngInterval;
        }
        if (extent[2] % this._currLngInterval !== 0) {
            realExtent.lastLng = extent[2];
            extent[2] = parseInt(extent[2] / this._currLngInterval) * this._currLngInterval;
        }
        return { latRange: [extent[1], extent[3]], lngRange: [extent[0], extent[2]], extent, ...realExtent };
    }

    _makeLineCoords(fixedDegree, range = [-90, 90], first, last, type = 'lng') {
        fixedDegree = type === 'lng' ? this._lngFix(fixedDegree) : fixedDegree;
        first = typeof first === 'number' ? first : range[0];
        last = typeof last === 'number' ? last : range[1];
        const interval = Math.abs(first - last);
        const coords = [];
        for (var changedDegree = first; changedDegree <= last; changedDegree += interval) {
            if (type === 'lng') {
                coords.push([fixedDegree, changedDegree]);
            } else {
                coords.push([changedDegree, fixedDegree]);
            }
        }
        return coords;
    }

    _makeLineFeature(coordinates, type = 'LineString') {
        return {
            type: 'Feature',
            geometry: {
                type,
                coordinates
            }
        };
    }

    _lngFix(lng) {
        if (lng >= 180) {
            return 180;
        }
        if (lng <= -180) {
            return -180;
        }
        return lng;
    }

    _transformStrokeStyle(strokeStyle = this.options.strokeStyle) {
        if (!strokeStyle || typeof strokeStyle === 'string') {
            return { paint: { 'line-color': strokeStyle || 'rgba(0,0,0,0.2)' } };
        }
        const layout = {
            'line-join': strokeStyle.lineJoin || 'round',
            'line-cap': strokeStyle.lineCap || 'round'
        };
        const paint = {
            'line-color': strokeStyle.lineColor || 'rgba(0,0,0,0.2)',
            'line-width': strokeStyle.lineWidth || 1,
            'line-offset': strokeStyle.lineDashOffset || 0,
            'line-translate-anchor': 'viewport'
        };

        if (strokeStyle.lineWidth) {
            if (typeof strokeStyle.lineDash === 'function') {
                paint['line-width'] = strokeStyle.lineWidth(this.map);
            } else {
                paint['line-width'] = strokeStyle.lineWidth;
            }
        }
        if (strokeStyle.lindDasharray) {
            if (typeof strokeStyle.lineDash === 'function') {
                paint['line-dasharray'] = strokeStyle.lindDasharray(this.map);
            } else {
                paint['line-dasharray'] = strokeStyle.lindDasharray;
            }
        }
        return { layout, paint };
    }

    _setLabelStyle(ctx, labelStyle) {
        if (labelStyle.textColor) {
            ctx.fillStyle = labelStyle.textColor;
        }
        if (labelStyle.textSize) {
            ctx.font = labelStyle.textSize + ' ' + labelStyle.textFont.join(',');
        }
        if (labelStyle.textHaloColor) {
            ctx.strokeStyle = labelStyle.textHaloColor;
            ctx.lineWidth = labelStyle.textHaloWidth || 1;
        }
        if (labelStyle.textAnchor) {
            ctx.textBaseline = this._getTxetBaseline(labelStyle.textAnchor);
            ctx.textAligin = this._getTxetAlign(labelStyle.textAligin);
        }
        return ctx;
    }

    _getTxetBaseline(textAnchor) {
        if (!textAnchor) {
            return 'bottom';
        }
        const textStyle = textAnchor.split('-');
        if (textStyle.includes('bottom')) {
            return 'bottom';
        }
        if (textStyle.includes('top')) {
            return 'top';
        }
        if (textStyle.includes('center')) {
            return 'middle';
        }
    }
    _getTxetAlign(textAnchor) {
        if (!textAnchor) {
            return 'center';
        }
        const textStyle = textAnchor.split('-');
        if (textStyle.includes('left')) {
            return 'left';
        }
        if (textStyle.includes('right')) {
            return 'right';
        }
        if (textStyle.includes('center')) {
            return 'center';
        }
    }
}

mapboxgl.supermap.GraticuleLayer = GraticuleLayer;
