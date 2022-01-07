/* Copyright© 2000 - 2021 SuperMap Software Co.Ltd. All rights reserved.
 * This program are made available under the terms of the Apache License, Version 2.0
 * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html.*/

import { Logo, logo, ChangeTileVersion, changeTileVersion } from './control';

import {
    CommontypesConversion,
    BaiduCRS,
    TianDiTu_WGS84CRS,
    TianDiTu_MercatorCRS,
    NonEarthCRS,
    nonEarthCRS,
    CRS,
    crs,
    toGeoJSON,
    toSuperMapGeometry,
    resolutionToScale,
    scaleToResolution,
    GetResolutionFromScaleDpi,
    NormalizeScale
} from './core';
import {
    BaiduTileLayer,
    baiduTileLayer,
    CloudTileLayer,
    cloudTileLayer,
    ImageMapLayer,
    imageMapLayer,
    TiandituTileLayer,
    tiandituTileLayer,
    TiledMapLayer,
    tiledMapLayer,
    WMTSLayer,
    wmtsLayer,
    WebMap,
    webMap,
    ImageTileLayer,
    imageTileLayer
} from './mapping';
import {
    DataFlowLayer,
    dataFlowLayer,
    EchartsLayer,
    echartsLayer,
    GraphicLayer,
    graphicLayer,
    GraphThemeLayer,
    graphThemeLayer,
    heatMapFeature,
    HeatMapFeature,
    heatMapLayer,
    HeatMapLayer,
    LabelThemeLayer,
    labelThemeLayer,
    MapVLayer,
    mapVLayer,
    NormalRenderer,
    RangeThemeLayer,
    rangeThemeLayer,
    RankSymbolThemeLayer,
    rankSymbolThemeLayer,
    TileVectorLayer,
    TiledVectorLayer,
    tiledVectorLayer,
    TurfLayer,
    turfLayer,
    UnicodeMarker,
    unicodeMarker,
    UniqueThemeLayer,
    uniqueThemeLayer,
    VectorTileFormat,
    ImageStyle,
    imageStyle,
    CircleStyle,
    circleStyle,
    Graphic,
    graphic,
    CloverStyle,
    cloverStyle,
    MapvRenderer,
    MapVRenderer,
    GeoFeatureThemeLayer,
    ThemeFeature,
    themeFeature,
    ThemeLayer,
    SVGRenderer,
    VectorGrid
} from './overlay';
import {
    AddressMatchService,
    addressMatchService,
    ChartService,
    chartService,
    DataFlowService,
    dataFlowService,
    DatasetService,
    datasetService,
    DatasourceService,
    datasourceService,
    FeatureService,
    featureService,
    FieldService,
    fieldService,
    GeoprocessingService,
    geoprocessingService,
    GridCellInfosService,
    gridCellInfosService,
    LayerInfoService,
    layerInfoService,
    MapService,
    mapService,
    MeasureService,
    measureService,
    NetworkAnalyst3DService,
    networkAnalyst3DService,
    NetworkAnalystService,
    networkAnalystService,
    ProcessingService,
    processingService,
    QueryService,
    queryService,
    ServiceBase,
    SpatialAnalystService,
    spatialAnalystService,
    ThemeService,
    themeService,
    TrafficTransferAnalystService,
    trafficTransferAnalystService,
    WebPrintingJobService,
    webPrintingJobService,
    ImageCollectionService,
    ImageService
} from './services';

import {
    OpenFileView,
    openFileView,
    OpenFileViewModel,
    openFileViewModel,
    SearchView,
    searchView,
    SearchViewModel,
    searchViewModel,
    DataFlowView,
    dataFlowView,
    DataFlowViewModel,
    dataFlowViewModel,
    ComponentsViewBase,
    componentsViewBase,
    ClientComputationView,
    clientComputationView,
    ClientComputationViewModel,
    ClientComputationLayer,
    clientComputationLayer,
    GeoJSONLayerWithName,
    geoJSONLayerWithName,
    GeoJsonLayerDataModel,
    DistributedAnalysisView,
    distributedAnalysisView,
    DistributedAnalysisViewModel,
    DataServiceQueryView,
    dataServiceQueryView,
    DataServiceQueryViewModel,
    dataServiceQueryViewModel
} from './components';

export {
    OpenFileView,
    openFileView,
    OpenFileViewModel,
    openFileViewModel,
    SearchView,
    searchView,
    SearchViewModel,
    searchViewModel,
    DataFlowView,
    dataFlowView,
    DataFlowViewModel,
    dataFlowViewModel,
    ComponentsViewBase,
    componentsViewBase,
    clientComputationView,
    ClientComputationView,
    ClientComputationViewModel,
    ClientComputationLayer,
    clientComputationLayer,
    GeoJSONLayerWithName,
    geoJSONLayerWithName,
    GeoJsonLayerDataModel,
    DistributedAnalysisView,
    distributedAnalysisView,
    DistributedAnalysisViewModel,
    DataServiceQueryView,
    dataServiceQueryView,
    DataServiceQueryViewModel,
    dataServiceQueryViewModel
};

export * from '@supermap/iclient-common/index.common';
export { Logo, logo, ChangeTileVersion, changeTileVersion };
export {
    CommontypesConversion,
    BaiduCRS,
    TianDiTu_WGS84CRS,
    TianDiTu_MercatorCRS,
    NonEarthCRS,
    nonEarthCRS,
    CRS,
    crs,
    toGeoJSON,
    toSuperMapGeometry,
    resolutionToScale,
    scaleToResolution,
    GetResolutionFromScaleDpi,
    NormalizeScale
};
export {
    BaiduTileLayer,
    baiduTileLayer,
    CloudTileLayer,
    cloudTileLayer,
    ImageMapLayer,
    imageMapLayer,
    TiandituTileLayer,
    tiandituTileLayer,
    TiledMapLayer,
    tiledMapLayer,
    WMTSLayer,
    wmtsLayer,
    WebMap,
    webMap,
    ImageTileLayer,
    imageTileLayer
};
export {
    DataFlowLayer,
    dataFlowLayer,
    EchartsLayer,
    echartsLayer,
    GraphicLayer,
    graphicLayer,
    GraphThemeLayer,
    graphThemeLayer,
    heatMapFeature,
    HeatMapFeature,
    heatMapLayer,
    HeatMapLayer,
    LabelThemeLayer,
    labelThemeLayer,
    MapVLayer,
    mapVLayer,
    NormalRenderer,
    RangeThemeLayer,
    rangeThemeLayer,
    RankSymbolThemeLayer,
    rankSymbolThemeLayer,
    TileVectorLayer,
    TiledVectorLayer,
    tiledVectorLayer,
    TurfLayer,
    turfLayer,
    UnicodeMarker,
    unicodeMarker,
    UniqueThemeLayer,
    uniqueThemeLayer,
    VectorTileFormat,
    ImageStyle,
    imageStyle,
    CircleStyle,
    circleStyle,
    Graphic,
    graphic,
    CloverStyle,
    cloverStyle,
    MapvRenderer,
    MapVRenderer,
    GeoFeatureThemeLayer,
    ThemeFeature,
    themeFeature,
    ThemeLayer,
    SVGRenderer,
    VectorGrid
};
export {
    AddressMatchService,
    addressMatchService,
    ChartService,
    chartService,
    DataFlowService,
    dataFlowService,
    DatasetService,
    datasetService,
    DatasourceService,
    datasourceService,
    FeatureService,
    featureService,
    FieldService,
    fieldService,
    GeoprocessingService,
    geoprocessingService,
    GridCellInfosService,
    gridCellInfosService,
    LayerInfoService,
    layerInfoService,
    MapService,
    mapService,
    MeasureService,
    measureService,
    NetworkAnalyst3DService,
    networkAnalyst3DService,
    NetworkAnalystService,
    networkAnalystService,
    ProcessingService,
    processingService,
    QueryService,
    queryService,
    ServiceBase,
    SpatialAnalystService,
    spatialAnalystService,
    ThemeService,
    themeService,
    TrafficTransferAnalystService,
    trafficTransferAnalystService,
    WebPrintingJobService,
    webPrintingJobService,
    ImageCollectionService,
    ImageService
};
