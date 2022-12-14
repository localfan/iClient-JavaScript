import { Graph } from '../../../src/mapboxgl/overlay/GraphThemeLayer';
import { ThemeFeature } from '../../../src/mapboxgl/overlay/theme/ThemeFeature';
import '../../resources/chinaConsumptionLevel';
import mapboxgl from 'mapbox-gl';

window.mapboxgl = mapboxgl;

var url = GlobeParameter.China4326URL;
describe('mapboxgl_GraphThemeLayer', () => {
    var originalTimeout;
    var testDiv, map;
    beforeAll(() => {
        testDiv = document.createElement("div");
        testDiv.setAttribute("id", "map");
        testDiv.style.styleFloat = "left";
        testDiv.style.marginLeft = "8px";
        testDiv.style.marginTop = "50px";
        testDiv.style.width = "500px";
        testDiv.style.height = "500px";
        document.body.appendChild(testDiv);
        map = new mapboxgl.Map({
            container: 'map',
            style: {
                "version": 8,
                "sources": {
                    "raster-tiles": {
                        "type": "raster",
                        "tiles": [url + '/zxyTileImage.png?z={z}&x={x}&y={y}'],
                        "tileSize": 256
                    }
                },
                "layers": [{
                    "id": "simple-tiles",
                    "type": "raster",
                    "source": "raster-tiles",
                    "minzoom": 0,
                    "maxzoom": 22
                }]
            },
            center: [116.85, 39.79],
            zoom: 3
        });
    });
    beforeEach(() => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
    });
    afterEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
    afterAll(() => {
        window.document.body.removeChild(testDiv);
        map.remove();
    });

    it('initialize', () => {
        var graphThemeLayer = new Graph("GraphThemeLayer", "Bar",
            {
                map: map,
                themeFields: ["CON2009", "CON2010", "CON2011", "CON2012", "CON2013"],
                opacity: 0.9,
                chartsSetting: {
                    // width???height???codomain ???????????????????????????????????????????????????????????????????????????
                    width: 240,
                    height: 100,
                    codomain: [0, 40000],               // ???????????????????????????????????????????????????????????????????????????
                    barStyle: { fillOpacity: 0.7 },       // ?????????????????????????????????????????????????????????
                    barHoverStyle: { fillOpacity: 1 },    //  ?????? hover ??????
                    xShapeBlank: [10, 10, 10],          // ????????????????????????????????????
                    axisYTick: 4,                       // y ???????????????
                    axisYLabels: ["4???", "3???", "2???", "1???", "0"],          // y ???????????????
                    axisXLabels: ["09???", "10???", "11???", "12???", "13???"],   // x ???????????????
                    backgroundStyle: { fillColor: "#CCE8CF" },                // ????????????
                    backgroundRadius: [5, 5, 5, 5],      // ?????????????????????
                    //???????????? ???????????????
                    showShadow: true,
                    //????????????
                    barShadowStyle: {
                        shadowBlur: 8,
                        shadowOffsetX: 2,
                        shadowOffsetY: 2,
                        shadowColor: "rgba(100,100,100,0.8)"
                    },
                    //???????????????????????????[??????????????????,??????????????????]  ??? themeLayer.themeFields ???????????????????????????
                    barLinearGradient: [["#00FF00", "#00CD00"], ["#00CCFF", "#5E87A2"], ["#00FF66", "#669985"], ["#CCFF00", "#94A25E"], ["#FF9900", "#A2945E"]]
                }
            });
        expect(graphThemeLayer).not.toBeNull();
        expect(graphThemeLayer.chartsType).toBe("Bar");
        expect(graphThemeLayer.charts.length).toEqual(0);
        var chartsSetting = graphThemeLayer.chartsSetting;
        expect(chartsSetting.axisXLabels.length).toEqual(5);
        expect(chartsSetting.axisYLabels.length).toEqual(5);
        expect(chartsSetting.axisYTick).toEqual(4);
        expect(chartsSetting.backgroundRadius.length).toEqual(4);
        expect(chartsSetting.backgroundStyle.fillColor).toBe("#CCE8CF");
        expect(chartsSetting.barHoverStyle.fillOpacity).toEqual(1);
        expect(chartsSetting.barStyle.fillOpacity).toEqual(0.7);
        expect(chartsSetting.barLinearGradient.length).toEqual(5);
        expect(chartsSetting.barShadowStyle).not.toBeNull();
        expect(chartsSetting.codomain.length).toEqual(2);
        expect(chartsSetting.barShadowStyle).not.toBeNull();
        expect(chartsSetting.height).toEqual(100);
        expect(chartsSetting.width).toEqual(240);
        expect(chartsSetting.showShadow).toBeTruthy();
        expect(graphThemeLayer.isOverLay).toBeTruthy();
        expect(graphThemeLayer.themeFields.length).toEqual(5);
        graphThemeLayer.clear();
    });

    it('setChartsType', () => {
        var graphThemeLayer = new Graph("GraphThemeLayer", "Bar",
            {
                map: map,
                chartsSetting: {
                    width: 240,
                    height: 100,
                    codomain: [0, 40000]
                }
            });
        expect(graphThemeLayer.chartsType).toBe("Bar");
        graphThemeLayer.setChartsType("Line");
        expect(graphThemeLayer.chartsType).toBe("Line");
        graphThemeLayer.clear();
    });

    it('addFeatures, removeFeatures, getShapesByFeatureID', () => {
        var graphThemeLayer;
        var features = [];
        for (var i = 0, len = chinaConsumptionLevel.length; i < len; i++) {
            // ?????????????????????????????????????????????
            var provinceInfo = chinaConsumptionLevel[i];
            var geo = new mapboxgl.LngLat(provinceInfo[1], provinceInfo[2]);
            var attrs = {};
            attrs.NAME = provinceInfo[0];
            attrs.CON2009 = provinceInfo[3];
            attrs.CON2010 = provinceInfo[4];
            attrs.CON2011 = provinceInfo[5];
            attrs.CON2012 = provinceInfo[6];
            attrs.CON2013 = provinceInfo[7];
            var fea = new ThemeFeature(geo, attrs);
            features.push(fea);
        }
        graphThemeLayer = new Graph("GraphThemeLayer", "Bar",
            {
                map: map,
                attributions: " ",
                themeFields: ["CON2009", "CON2010", "CON2011", "CON2012", "CON2013"],
                opacity: 0.9,
                chartsSetting: {
                    width: 240,
                    height: 100,
                    codomain: [0, 40000],
                    barStyle: { fillOpacity: 0.7 },
                    barHoverStyle: { fillOpacity: 1 },
                    xShapeBlank: [10, 10, 10],
                    axisYTick: 4,
                    axisYLabels: ["4???", "3???", "2???", "1???", "0"],
                    axisXLabels: ["09???", "10???", "11???", "12???", "13???"],
                    backgroundStyle: { fillColor: "#CCE8CF" },
                    backgroundRadius: [5, 5, 5, 5],
                    showShadow: true,
                    barShadowStyle: {
                        shadowBlur: 8,
                        shadowOffsetX: 2,
                        shadowOffsetY: 2,
                        shadowColor: "rgba(100,100,100,0.8)"
                    },
                    barLinearGradient: [["#00FF00", "#00CD00"], ["#00CCFF", "#5E87A2"], ["#00FF66", "#669985"], ["#CCFF00", "#94A25E"], ["#FF9900", "#A2945E"]]
                }
            });
        expect(graphThemeLayer.features.length).toEqual(0);
        graphThemeLayer.addFeatures(features);
        var LayerFeatures = graphThemeLayer.features;
        expect(LayerFeatures.length).toBeGreaterThan(0);
        for (var j = 0; j < LayerFeatures.length; j++) {
            expect(LayerFeatures[j].CLASS_NAME).toBe("SuperMap.Feature.Vector");
            expect(LayerFeatures[j].id).toContain("SuperMap.Feature");
            expect(LayerFeatures[j].attributes).not.toBeNull();
            expect(LayerFeatures[j].geometry).not.toBeNull();
            expect(LayerFeatures[j].geometry.CLASS_NAME).toBe("SuperMap.Geometry.Point");
            expect(LayerFeatures[j].geometry.id).toContain("SuperMap.Geometry");
            expect(LayerFeatures[j].geometry.x).not.toBeNull();
            expect(LayerFeatures[j].geometry.y).not.toBeNull();
        }
        expect(LayerFeatures[0].geometry.x).toEqual(116.407283);
        expect(LayerFeatures[0].geometry.y).toEqual(39.904557);
        expect(LayerFeatures[0].data).toEqual(LayerFeatures[0].attributes);
        expect(LayerFeatures[0].attributes).toEqual(Object({
            CON2009: 22023,
            CON2010: 24982,
            CON2011: 27760,
            CON2012: 30350,
            CON2013: 33337,
            NAME: "?????????"
        }));
        var shape1 = graphThemeLayer.getShapesByFeatureID();
        var shape2 = graphThemeLayer.getShapesByFeatureID(LayerFeatures[0].id);
        expect(shape1.length).toBeGreaterThan(0);
        expect(shape2.length).toBeGreaterThan(0);
        expect(shape1.length).toBeGreaterThan(shape2.length);
        graphThemeLayer.features[0].geometry.x = 39;
        var redraw = graphThemeLayer.redraw();
        expect(redraw).toBeTruthy();
        expect(graphThemeLayer.features[0].geometry.x).toEqual(39);
        graphThemeLayer.removeFeatures();
        expect(graphThemeLayer.features.length).toBeGreaterThan(0);
        graphThemeLayer.removeAllFeatures();
        expect(graphThemeLayer.features.length).toEqual(0);
        graphThemeLayer.clear();
    });

    it('removeFeatures use callback', () => {
      var graphThemeLayer;
      var features = [];
      for (var i = 0, len = chinaConsumptionLevel.length; i < len; i++) {
          // ?????????????????????????????????????????????
          var provinceInfo = chinaConsumptionLevel[i];
          var geo = new mapboxgl.LngLat(provinceInfo[1], provinceInfo[2]);
          var attrs = {};
          attrs.NAME = provinceInfo[0];
          attrs.CON2009 = provinceInfo[3];
          attrs.CON2010 = provinceInfo[4];
          attrs.CON2011 = provinceInfo[5];
          attrs.CON2012 = provinceInfo[6];
          attrs.CON2013 = provinceInfo[7];
          var fea = new ThemeFeature(geo, attrs);
          features.push(fea);
      }
      graphThemeLayer = new Graph("GraphThemeLayer", "Bar",
          {
              map: map,
              attributions: " ",
              themeFields: ["CON2009", "CON2010", "CON2011", "CON2012", "CON2013"],
              opacity: 0.9,
              chartsSetting: {
                  width: 240,
                  height: 100,
                  codomain: [0, 40000],
                  barStyle: { fillOpacity: 0.7 },
                  barHoverStyle: { fillOpacity: 1 },
                  xShapeBlank: [10, 10, 10],
                  axisYTick: 4,
                  axisYLabels: ["4???", "3???", "2???", "1???", "0"],
                  axisXLabels: ["09???", "10???", "11???", "12???", "13???"],
                  backgroundStyle: { fillColor: "#CCE8CF" },
                  backgroundRadius: [5, 5, 5, 5],
                  showShadow: true,
                  barShadowStyle: {
                      shadowBlur: 8,
                      shadowOffsetX: 2,
                      shadowOffsetY: 2,
                      shadowColor: "rgba(100,100,100,0.8)"
                  },
                  barLinearGradient: [["#00FF00", "#00CD00"], ["#00CCFF", "#5E87A2"], ["#00FF66", "#669985"], ["#CCFF00", "#94A25E"], ["#FF9900", "#A2945E"]]
              }
          });
      graphThemeLayer.addFeatures(features);
      graphThemeLayer.removeFeatures(function(feature) {
        return feature.attributes['NAME'] === '?????????';
      });
      expect(graphThemeLayer.features.length).toBeGreaterThan(0);
      expect(graphThemeLayer.features.length).toBe(30);
      graphThemeLayer.removeAllFeatures();
      expect(graphThemeLayer.features.length).toEqual(0);
      graphThemeLayer.clear();
  });

  it('getFeatures use filter callback', () => {
    var graphThemeLayer;
    var features = [];
    for (var i = 0, len = chinaConsumptionLevel.length; i < len; i++) {
        // ?????????????????????????????????????????????
        var provinceInfo = chinaConsumptionLevel[i];
        var geo = new mapboxgl.LngLat(provinceInfo[1], provinceInfo[2]);
        var attrs = {};
        attrs.NAME = provinceInfo[0];
        attrs.CON2009 = provinceInfo[3];
        attrs.CON2010 = provinceInfo[4];
        attrs.CON2011 = provinceInfo[5];
        attrs.CON2012 = provinceInfo[6];
        attrs.CON2013 = provinceInfo[7];
        var fea = new ThemeFeature(geo, attrs);
        features.push(fea);
    }
    graphThemeLayer = new Graph("GraphThemeLayer", "Bar",
        {
            map: map,
            attributions: " ",
            themeFields: ["CON2009", "CON2010", "CON2011", "CON2012", "CON2013"],
            opacity: 0.9,
            chartsSetting: {
                width: 240,
                height: 100,
                codomain: [0, 40000],
                barStyle: { fillOpacity: 0.7 },
                barHoverStyle: { fillOpacity: 1 },
                xShapeBlank: [10, 10, 10],
                axisYTick: 4,
                axisYLabels: ["4???", "3???", "2???", "1???", "0"],
                axisXLabels: ["09???", "10???", "11???", "12???", "13???"],
                backgroundStyle: { fillColor: "#CCE8CF" },
                backgroundRadius: [5, 5, 5, 5],
                showShadow: true,
                barShadowStyle: {
                    shadowBlur: 8,
                    shadowOffsetX: 2,
                    shadowOffsetY: 2,
                    shadowColor: "rgba(100,100,100,0.8)"
                },
                barLinearGradient: [["#00FF00", "#00CD00"], ["#00CCFF", "#5E87A2"], ["#00FF66", "#669985"], ["#CCFF00", "#94A25E"], ["#FF9900", "#A2945E"]]
            }
        });
    graphThemeLayer.addFeatures(features);
    var filterFeatures = graphThemeLayer.getFeatures(function(feature) {
      return feature.attributes['NAME'] === '?????????';
    });
    expect(filterFeatures.length).toBeGreaterThan(0);
    expect(filterFeatures.length).toBe(1);
    graphThemeLayer.destroyFeatures(filterFeatures[0]);
    expect(graphThemeLayer.features.length).toEqual(30);
    graphThemeLayer.clear();
});

    // ????????????iclient8???????????????,?????????mapboxgl??????,??????????????????iclient???????????????
    it('isQuadrilateralOverLap, isPointInPoly', () => {
        var graphThemeLayer = new Graph("GraphThemeLayer", "Bar",
            {
                map: map,
                themeFields: ["CON2009", "CON2010", "CON2011", "CON2012", "CON2013"],
                chartsSetting: {
                    width: 240,
                    height: 100,
                    codomain: [0, 40000]
                }
            });
        var quadrilateral, quadrilateral2;
        quadrilateral = [{ "x": 1, "y": 1 }, { "x": 3, "y": 1 }, { "x": 6, "y": 4 }, { "x": 2, "y": 10 }, { "x": 1, "y": 1 }];
        quadrilateral2 = [{ "x": 1, "y": 1 }, { "x": 3, "y": 1 }, { "x": 6, "y": 4 }, { "x": 2, "y": 10 }, { "x": 1, "y": 1 }];
        var isQuadrilateralOverLap = graphThemeLayer.isQuadrilateralOverLap(quadrilateral, quadrilateral2);
        expect(isQuadrilateralOverLap).toBeTruthy();
        var point = { "x": 2, "y": 5 };
        var polygon = [{ "x": 1, "y": 1 }, { "x": 3, "y": 1 }, { "x": 6, "y": 4 }, { "x": 2, "y": 10 }, { "x": 1, "y": 1 }];
        var isPointInPoly = graphThemeLayer.isPointInPoly(point, polygon);
        expect(isPointInPoly).toBeTruthy();
        graphThemeLayer.clear();

    });

    it('drawCharts', () => {
        var graphThemeLayer = new Graph("GraphThemeLayer", "Bar", {
            map: map,
            isOverLay: false,
            overlayWeightField: "pop_1991",
            themeFields: ["CON2009", "CON2010", "CON2011", "CON2012", "CON2013"],
            chartsSetting: {
                width: 240,
                height: 100,
                codomain: [0, 40000],
                barStyle: { fillOpacity: 0.7 },
                barHoverStyle: { fillOpacity: 1 },
                xShapeBlank: [10, 10, 10],
                axisYTick: 4,
                axisYLabels: ["4???", "3???", "2???", "1???", "0"],
                axisXLabels: ["09???", "10???", "11???", "12???", "13???"],
                backgroundStyle: { fillColor: "#CCE8CF" },
                backgroundRadius: [5, 5, 5, 5],
                showShadow: true,
                barShadowStyle: {
                    shadowBlur: 8,
                    shadowOffsetX: 2,
                    shadowOffsetY: 2,
                    shadowColor: "rgba(100,100,100,0.8)"
                },
                barLinearGradient: [["#00FF00", "#00CD00"], ["#00CCFF", "#5E87A2"], ["#00FF66", "#669985"], ["#CCFF00", "#94A25E"], ["#FF9900", "#A2945E"]]
            }
        });
        graphThemeLayer.drawCharts();
        expect(graphThemeLayer).not.toBeNull();
        graphThemeLayer.clear();
    });

    it('clearCache', () => {
        var graphThemeLayer = new Graph("GraphThemeLayer", "Bar", {
            map: map,
            isOverLay: false,
            themeFields: ["CON2009", "CON2010", "CON2011", "CON2012", "CON2013"],
            chartsSetting: {
                width: 240,
                height: 100,
                codomain: [0, 40000]
            },
            charts: [1, 2, 3],
            cache: { 'name': 'ONETWO' }
        });
        expect(graphThemeLayer.charts.length).toEqual(3);
        expect(graphThemeLayer.cache).toEqual(Object({
            name: "ONETWO"
        }));
        graphThemeLayer.clearCache();
        expect(graphThemeLayer.charts.length).toEqual(0);
        expect(graphThemeLayer.cache).toEqual(Object({}));
        graphThemeLayer.clear();
    });

    it('setVisibility', () => {
        var graphThemeLayer = new Graph("GraphThemeLayer", "Bar", {
            map: map,
            isOverLay: false,
            themeFields: ["CON2009", "CON2010", "CON2011", "CON2012", "CON2013"],
            chartsSetting: {
                width: 240,
                height: 100,
                codomain: [0, 40000]
            },
            charts: [1, 2, 3],
            cache: { 'name': 'ONETWO' }
        });
        expect(graphThemeLayer.visibility).toBeTruthy();
        graphThemeLayer.setVisibility(false);
        expect(graphThemeLayer.visibility).toBeFalsy();
    });

    it('moveTo', () => {
        const graphThemeLayer = new Graph("GraphThemeLayer", "Bar", {
            map: map,
            isOverLay: false,
            themeFields: ["CON2009", "CON2010", "CON2011", "CON2012", "CON2013"],
            chartsSetting: {
                width: 240,
                height: 100,
                codomain: [0, 40000]
            },
            charts: [1, 2, 3],
            cache: { 'name': 'ONETWO' }
        });
        var length1 = graphThemeLayer.div.parentNode.getElementsByClassName("themeLayer").length;
        //ThemeLayer 75???????????????????????????
        // map.addLayer(graphThemeLayer);
        const graphThemeLayer2 = new Graph("GraphThemeLayer2", "Bar", {
            map: map,
            isOverLay: false,
            themeFields: ["CON2009", "CON2010", "CON2011", "CON2012", "CON2013"],
            chartsSetting: {
                width: 240,
                height: 100,
                codomain: [0, 40000]
            },
            charts: [1, 2, 3],
            cache: { 'name': 'ONETWO' }
        });
        //ThemeLayer 75???????????????????????????
        // map.addLayer(graphThemeLayer2);
        //?????????????????????layer??????????????????
        expect(graphThemeLayer.div.parentNode.getElementsByClassName("themeLayer")[length1-1].id).toEqual(graphThemeLayer.id);
        graphThemeLayer2.moveTo(graphThemeLayer.id);
        expect(graphThemeLayer.div.parentNode.getElementsByClassName("themeLayer")[length1-1].id).toEqual(graphThemeLayer2.id);
    });
});