/* Copyright© 2000 - 2021 SuperMap Software Co.Ltd. All rights reserved.
 * This program are made available under the terms of the Apache License, Version 2.0
 * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html.*/
import {
  SuperMap,
  DataFormat,
  ServerType,
  GeometryType,
  QueryOption,
  JoinType,
  EngineType,
  MeasureMode,
  SpatialRelationType,
  DataReturnMode,
  Unit,
  BufferRadiusUnit,
  SpatialQueryMode,
  ThemeGraphTextFormat,
  ThemeGraphType,
  GraphAxesTextDisplayMode,
  GraduatedMode,
  RangeMode,
  ThemeType,
  ColorGradientType,
  TextAlignment,
  FillGradientMode,
  SideType,
  AlongLineDirection,
  LabelBackShape,
  LabelOverLengthMode,
  DirectionType,
  OverlayOperationType,
  SupplyCenterType,
  TurnType,
  BufferEndType,
  SmoothMethod,
  SurfaceAnalystMethod,
  ColorSpaceType,
  ChartType,
  EditType,
  TransferTactic,
  TransferPreference,
  GridType,
  ClientType,
  LayerType,
  UGCLayerType,
  StatisticMode,
  PixelFormat,
  SearchMode,
  SummaryType,
  InterpolationAlgorithmType,
  VariogramMode,
  Exponent,
  ClipAnalystMode,
  AnalystAreaUnit,
  AnalystSizeUnit,
  StatisticAnalystMode,
  TopologyValidatorRule,
  OutputType,
  MetricsAggType,
  BucketAggType,
  GetFeatureMode,
  //control
  TimeFlowControl,
  //iManager
  IManager,
  IManagerServiceBase,
  IManagerCreateNodeParam,
  //iPortal
  IPortal,
  IPortalQueryParam,
  IPortalResource,
  IPortalQueryResult,
  IPortalShareParam,
  IPortalShareEntity,
  IPortalServiceBase,
  IPortalUser,
  IPortalAddResourceParam,
  IPortalRegisterServiceParam,
  IPortalAddDataParam,
  IPortalDataMetaInfoParam,
  IPortalDataStoreInfoParam,
  IPortalDataConnectionInfoParam,
  //Online
  Online,
  OnlineData,
  OnlineQueryDatasParameter,
  ServiceStatus,
  DataItemType,
  DataItemOrderBy,
  FilterField,
  OnlineServiceBase,
  //security
  KeyServiceParameter,
  SecurityManager,
  ServerInfo,
  TokenServiceParameter,
  //thirdparty
  ElasticSearch,
  //util
  FetchRequest,
  ColorsPickerUtil,
  ArrayStatistic,
  //iServer
  AreaSolarRadiationParameters,
  AggregationParameter,
  BucketAggParameter,
  MetricsAggParameter,
  BufferAnalystParameters,
  BufferDistance,
  BuffersAnalystJobsParameter,
  BufferSetting,
  BurstPipelineAnalystParameters,
  ChartQueryFilterParameter,
  ChartQueryParameters,
  ClipParameter,
  ColorDictionary,
  ComputeWeightMatrixParameters,
  DataReturnOption,
  DatasetBufferAnalystParameters,
  DatasetInfo,
  DatasetOverlayAnalystParameters,
  DatasetSurfaceAnalystParameters,
  DatasetThiessenAnalystParameters,
  DatasourceConnectionInfo,
  DensityKernelAnalystParameters,
  EditFeaturesParameters,
  FacilityAnalyst3DParameters,
  FacilityAnalystSinks3DParameters,
  FacilityAnalystSources3DParameters,
  FacilityAnalystStreamParameters,
  FacilityAnalystTracedown3DParameters,
  FacilityAnalystTraceup3DParameters,
  FacilityAnalystUpstream3DParameters,
  FieldParameters,
  FieldStatisticsParameters,
  FilterParameter,
  FindClosestFacilitiesParameters,
  FindLocationParameters,
  FindMTSPPathsParameters,
  FindPathParameters,
  FindServiceAreasParameters,
  FindTSPPathsParameters,
  GenerateSpatialDataParameters,
  GeoCodingParameter,
  GeoDecodingParameter,
  GeoHashGridAggParameter,
  GeometryBufferAnalystParameters,
  GeometryOverlayAnalystParameters,
  GeometrySurfaceAnalystParameters,
  GeometryThiessenAnalystParameters,
  GeoRelationAnalystParameters,
  GetFeaturesByBoundsParameters,
  GetFeaturesByBufferParameters,
  GetFeaturesByGeometryParameters,
  GetFeaturesByIDsParameters,
  GetFeaturesBySQLParameters,
  GetGridCellInfosParameters,
  Grid,
  Image,
  InterpolationAnalystParameters,
  InterpolationIDWAnalystParameters,
  InterpolationKrigingAnalystParameters,
  InterpolationRBFAnalystParameters,
  JoinItem,
  KernelDensityJobParameter,
  LabelImageCell,
  LabelMatrixCell,
  LabelMixedTextStyle,
  LabelSymbolCell,
  LabelThemeCell,
  LayerStatus,
  LinkItem,
  MathExpressionAnalysisParameters,
  MeasureParameters,
  OutputSetting,
  MappingParameters,
  OverlapDisplayedOptions,
  OverlayAnalystParameters,
  OverlayGeoJobParameter,
  PointWithMeasure,
  QueryByBoundsParameters,
  QueryByDistanceParameters,
  QueryByGeometryParameters,
  QueryBySQLParameters,
  QueryParameters,
  Route,
  RouteCalculateMeasureParameters,
  RouteLocatorParameters,
  ServerColor,
  ServerFeature,
  ServerGeometry,
  ServerStyle,
  ServerTextStyle,
  ServerTheme,
  SetLayerInfoParameters,
  SetLayersInfoParameters,
  SetLayerStatusParameters,
  SingleObjectQueryJobsParameter,
  StopQueryParameters,
  SummaryAttributesJobsParameter,
  SummaryMeshJobParameter,
  SummaryRegionJobParameter,
  SupplyCenter,
  SurfaceAnalystParameters,
  SurfaceAnalystParametersSetting,
  TerrainCurvatureCalculationParameters,
  Theme,
  ThemeDotDensity,
  ThemeFlow,
  ThemeGraduatedSymbol,
  ThemeGraduatedSymbolStyle,
  ThemeGraph,
  ThemeGraphAxes,
  ThemeGraphItem,
  ThemeGraphSize,
  ThemeGraphText,
  ThemeGridRange,
  ThemeGridRangeItem,
  ThemeGridUnique,
  ThemeGridUniqueItem,
  ThemeLabel,
  ThemeLabelAlongLine,
  ThemeLabelBackground,
  ThemeLabelItem,
  ThemeLabelText,
  ThemeLabelUniqueItem,
  ThemeMemoryData,
  ThemeOffset,
  ThemeParameters,
  ThemeRange,
  ThemeRangeItem,
  ThemeUnique,
  ThemeUniqueItem,
  ThiessenAnalystParameters,
  TopologyValidatorJobsParameter,
  TransferLine,
  TransferPathParameters,
  TransferSolutionParameters,
  TransportationAnalystParameter,
  TransportationAnalystResultSetting,
  UGCLayer,
  UGCMapLayer,
  UGCSubLayer,
  UpdateEdgeWeightParameters,
  UpdateTurnNodeWeightParameters,
  Vector,
  VectorClipJobsParameter,
  WebPrintingJobCustomItems,
  WebPrintingJobImage,
  WebPrintingJobLayers,
  WebPrintingJobLegendOptions,
  WebPrintingJobLittleMapOptions,
  WebPrintingJobNorthArrowOptions,
  WebPrintingJobScaleBarOptions,
  WebPrintingJobContent,
  WebPrintingJobLayoutOptions,
  WebPrintingJobExportOptions,
  WebPrintingJobParameters,
  WebPrintingService,
  FieldsFilter,
  ImageGFAspect,
  ImageGFHillShade,
  ImageGFOrtho,
  ImageGFSlope,
  ImageSearchParameter,
  ImageRenderingRule,
  Sortby,
  ImageStretchOption,
  //components
  FileTypes,
  FileConfig,
  FileModel,
  MessageBox,
  CommonContainer,
  DropDownBox,
  Select,
  AttributesPopContainer,
  PopContainer,
  IndexTabsPageContainer,
  CityTabsPage,
  NavTabsPage,
  PaginationContainer,
  ComponentsUtil,
  FileReaderUtil,
  ChartView,
  ChartViewModel
} from '@supermap/iclient-common/namespace';

import { Logo, logo, ChangeTileVersion, changeTileVersion } from './control';

import {
  CommontypesConversion,
  BaiduCRS,
  TianDiTu_WGS84CRS,
  TianDiTu_MercatorCRS,
  NonProjection,
  nonProjection,
  NonEarthCRS,
  nonEarthCRS,
  CRS,
  crs,
  toGeoJSON,
  toSuperMapGeometry,
  getMeterPerMapUnit,
  resolutionToScale,
  scaleToResolution,
  GetResolutionFromScaleDpi,
  NormalizeScale,
  transform
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
  LeafletMapCoordSys,
  GraphicLayer,
  graphicLayer,
  GraphThemeLayer,
  graphThemeLayer,
  heatMapFeature,
  heatMapLayer,
  LabelThemeLayer,
  labelThemeLayer,
  MapVLayer,
  mapVLayer,
  RangeThemeLayer,
  rangeThemeLayer,
  RankSymbolThemeLayer,
  rankSymbolThemeLayer,
  TileVectorLayer,
  tiledVectorLayer,
  TurfLayer,
  turfLayer,
  UnicodeMarker,
  unicodeMarker,
  UniqueThemeLayer,
  uniqueThemeLayer,
  VectorTileFormat,
  CartoCSSToLeaflet,
  DefaultStyle,
  CartoStyleMap,
  ServerStyleMap,
  CompOpMap,
  ImageStyle,
  imageStyle,
  CircleStyle,
  circleStyle,
  Graphic,
  graphic,
  CloverStyle,
  cloverStyle,
  MapVRenderer,
  GeoFeatureThemeLayer,
  ThemeFeature,
  themeFeature,
  ThemeLayer,
  CanvasRenderer,
  LineSymbolizer,
  PointSymbolizer,
  RegionSymbolizer,
  SVGRenderer,
  Symbolizer,
  PolyBase,
  TextSymbolizer,
  VectorFeatureType,
  VectorGrid,
  VectorTile,
  VectorTileJSON,
  VectorTilePBF
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
  geoprocessingService,
  GridCellInfosService,
  gridCellInfosService,
  imageCollectionService,
  imageService,
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
  DataFlowView,
  dataFlowView,
  dataFlowViewModel,
  ClientComputationView,
  clientComputationView,
  ClientComputationViewModel,
  clientComputationViewModel,
  ClientComputationLayer,
  clientComputationLayer,
  GeoJSONLayerWithName,
  geoJSONLayerWithName,
  GeoJsonLayersDataModel,
  GeoJsonLayerDataModel,
  DistributedAnalysisModel,
  DistributedAnalysisView,
  distributedAnalysisView,
  DistributedAnalysisViewModel,
  distributedAnalysisViewModel,
  DataServiceQueryView,
  dataServiceQueryView,
  DataServiceQueryViewModel,
  dataServiceQueryViewModel,
  searchViewModel,
  componentsViewBase
} from './components';

import L from "leaflet";

L.supermap = L.supermap || {};
L.supermap.components = L.supermap.components || {};
L.supermap.control = L.supermap.control || {};

// ./core
// L.Util.supermap_callbacks = coreUtil.supermap_callbacks;
L.Util.toGeoJSON = toGeoJSON;
L.Util.toSuperMapGeometry = toSuperMapGeometry;
L.Util.resolutionToScale = resolutionToScale;
L.Util.scaleToResolution = scaleToResolution;
L.Util.getMeterPerMapUnit = getMeterPerMapUnit;
L.Util.GetResolutionFromScaleDpi = GetResolutionFromScaleDpi;
L.Util.NormalizeScale = NormalizeScale;
L.Util.transform = transform;
// L.Proj4Leaflet
L.Proj = L.Proj || {};
L.Proj.CRS = crs;
// core/NonEarthCRS
L.Projection = {};
L.Projection.NonProjection = nonProjection;
L.CRS.NonEarthCRS = nonEarthCRS;
// core/ExtendsCRS
L.CRS.BaiduCRS = BaiduCRS;
L.CRS.TianDiTu_WGS84CRS = TianDiTu_WGS84CRS;
L.CRS.TianDiTu_MercatorCRS = TianDiTu_MercatorCRS;
L.CRS.TianDiTu_Mercator = TianDiTu_MercatorCRS;
L.CRS.TianDiTu_WGS84 = TianDiTu_WGS84CRS;
L.CRS.Baidu = BaiduCRS;
L.supermap.CommontypesConversion = CommontypesConversion;
// components
L.supermap.components.clientComputationLayer = clientComputationLayer;
L.supermap.components.clientComputation = clientComputationView;
L.supermap.components.clientComputationViewModel = clientComputationViewModel;
L.supermap.components.GeoJsonLayersDataModel = GeoJsonLayersDataModel;
L.supermap.components.geoJSONLayerWithName = geoJSONLayerWithName;
L.supermap.components.dataFlow = dataFlowView;
L.supermap.components.dataFlowViewModel = dataFlowViewModel;
L.supermap.components.dataServiceQuery = dataServiceQueryView;
L.supermap.components.dataServiceQueryViewModel = dataServiceQueryViewModel;
L.supermap.components.DistributedAnalysisModel = DistributedAnalysisModel;
L.supermap.components.distributedAnalysis = distributedAnalysisView;
L.supermap.components.distributedAnalysisViewModel = distributedAnalysisViewModel;
L.supermap.components.openFile = openFileView;
L.supermap.components.openFileViewModel = openFileViewModel;
L.supermap.components.util = ComponentsUtil;
L.supermap.components.search = searchView;
L.supermap.components.searchViewModel = searchViewModel;
L.supermap.components.componentsViewBase = componentsViewBase;
// control
L.supermap.control.changeTileVersion = changeTileVersion;
L.supermap.control.logo = logo;
// mapping
L.supermap.baiduTileLayer = baiduTileLayer;
L.supermap.cloudTileLayer = cloudTileLayer;
L.supermap.imageMapLayer = imageMapLayer;
L.supermap.imageTileLayer = imageTileLayer;
L.supermap.tiandituTileLayer = tiandituTileLayer;
L.supermap.tiledMapLayer = tiledMapLayer;
L.supermap.wmtsLayer = wmtsLayer;
L.supermap.webmap = webMap;
// overlay
L.supermap.CartoCSSToLeaflet = CartoCSSToLeaflet;
L.supermap.DefaultStyle = DefaultStyle
L.supermap.CartoStyleMap = CartoStyleMap;
L.supermap.ServerStyleMap = ServerStyleMap;
L.supermap.CompOpMap = CompOpMap;
L.supermap.circleStyle = circleStyle;
L.supermap.cloverStyle = cloverStyle;
L.supermap.graphic = graphic;
L.supermap.imageStyle = imageStyle;
L.supermap.themeFeature = themeFeature;
L.supermap.dataFlowLayer = dataFlowLayer;
L.supermap.echartsLayer = echartsLayer;
L.supermap.graphicLayer = graphicLayer;
L.supermap.graphThemeLayer = graphThemeLayer;
L.supermap.heatMapFeature = heatMapFeature;
L.supermap.heatMapLayer = heatMapLayer;
L.supermap.labelThemeLayer = labelThemeLayer;
L.supermap.mapVLayer = mapVLayer;
L.supermap.rangeThemeLayer = rangeThemeLayer;
L.supermap.rankSymbolThemeLayer = rankSymbolThemeLayer;
L.supermap.tiledVectorLayer = tiledVectorLayer;
L.supermap.turfLayer = turfLayer;
L.supermap.unicodeMarker = unicodeMarker;
L.supermap.uniqueThemeLayer = uniqueThemeLayer;
L.supermap.VectorTileFormat = VectorTileFormat;
L.supermap.addressMatchService = addressMatchService;
L.supermap.chartService = chartService;
L.supermap.dataFlowService = dataFlowService;
L.supermap.datasetService = datasetService;
L.supermap.datasourceService = datasourceService;
L.supermap.featureService = featureService;
L.supermap.fieldService = fieldService;
L.supermap.geoprocessingService = geoprocessingService;
L.supermap.gridCellInfosService = gridCellInfosService;
L.supermap.imageCollectionService = imageCollectionService;
L.supermap.imageService = imageService;
L.supermap.layerInfoService = layerInfoService;
L.supermap.mapService = mapService;
L.supermap.measureService = measureService;
L.supermap.networkAnalyst3DService = networkAnalyst3DService;
L.supermap.networkAnalystService = networkAnalystService;
L.supermap.processingService = processingService;
L.supermap.queryService = queryService;
L.supermap.ServiceBase = ServiceBase;
L.supermap.spatialAnalystService = spatialAnalystService;
L.supermap.themeService = themeService;
L.supermap.trafficTransferAnalystService = trafficTransferAnalystService;
L.supermap.webPrintingJobService = webPrintingJobService;

export {
  OpenFileView,
  openFileView,
  OpenFileViewModel,
  openFileViewModel,
  SearchView,
  searchView,
  DataFlowView,
  dataFlowView,
  clientComputationView,
  ClientComputationView,
  ClientComputationViewModel,
  ClientComputationLayer,
  clientComputationLayer,
  GeoJSONLayerWithName,
  geoJSONLayerWithName,
  GeoJsonLayersDataModel,
  GeoJsonLayerDataModel,
  DistributedAnalysisView,
  distributedAnalysisView,
  DistributedAnalysisViewModel,
  DataServiceQueryView,
  dataServiceQueryView,
  DataServiceQueryViewModel,
  dataServiceQueryViewModel
};

export {
  SuperMap,
  DataFormat,
  ServerType,
  GeometryType,
  QueryOption,
  JoinType,
  EngineType,
  MeasureMode,
  SpatialRelationType,
  DataReturnMode,
  Unit,
  BufferRadiusUnit,
  SpatialQueryMode,
  ThemeGraphTextFormat,
  ThemeGraphType,
  GraphAxesTextDisplayMode,
  GraduatedMode,
  RangeMode,
  ThemeType,
  ColorGradientType,
  TextAlignment,
  FillGradientMode,
  SideType,
  AlongLineDirection,
  LabelBackShape,
  LabelOverLengthMode,
  DirectionType,
  OverlayOperationType,
  SupplyCenterType,
  TurnType,
  BufferEndType,
  SmoothMethod,
  SurfaceAnalystMethod,
  ColorSpaceType,
  ChartType,
  EditType,
  TransferTactic,
  TransferPreference,
  GridType,
  ClientType,
  LayerType,
  UGCLayerType,
  StatisticMode,
  PixelFormat,
  SearchMode,
  SummaryType,
  InterpolationAlgorithmType,
  VariogramMode,
  Exponent,
  ClipAnalystMode,
  AnalystAreaUnit,
  AnalystSizeUnit,
  StatisticAnalystMode,
  TopologyValidatorRule,
  OutputType,
  MetricsAggType,
  BucketAggType,
  GetFeatureMode,
  //control
  TimeFlowControl,
  //iManager
  IManager,
  IManagerServiceBase,
  IManagerCreateNodeParam,
  //iPortal
  IPortal,
  IPortalQueryParam,
  IPortalResource,
  IPortalQueryResult,
  IPortalShareParam,
  IPortalShareEntity,
  IPortalServiceBase,
  IPortalUser,
  IPortalAddResourceParam,
  IPortalRegisterServiceParam,
  IPortalAddDataParam,
  IPortalDataMetaInfoParam,
  IPortalDataStoreInfoParam,
  IPortalDataConnectionInfoParam,
  //Online
  Online,
  OnlineData,
  OnlineQueryDatasParameter,
  ServiceStatus,
  DataItemType,
  DataItemOrderBy,
  FilterField,
  OnlineServiceBase,
  //security
  KeyServiceParameter,
  SecurityManager,
  ServerInfo,
  TokenServiceParameter,
  //thirdparty
  ElasticSearch,
  //util
  FetchRequest,
  ColorsPickerUtil,
  ArrayStatistic,
  //iServer
  AreaSolarRadiationParameters,
  AggregationParameter,
  BucketAggParameter,
  MetricsAggParameter,
  BufferAnalystParameters,
  BufferDistance,
  BuffersAnalystJobsParameter,
  BufferSetting,
  BurstPipelineAnalystParameters,
  ChartQueryFilterParameter,
  ChartQueryParameters,
  ClipParameter,
  ColorDictionary,
  ComputeWeightMatrixParameters,
  DataReturnOption,
  DatasetBufferAnalystParameters,
  DatasetInfo,
  DatasetOverlayAnalystParameters,
  DatasetSurfaceAnalystParameters,
  DatasetThiessenAnalystParameters,
  DatasourceConnectionInfo,
  DensityKernelAnalystParameters,
  EditFeaturesParameters,
  FacilityAnalyst3DParameters,
  FacilityAnalystSinks3DParameters,
  FacilityAnalystSources3DParameters,
  FacilityAnalystStreamParameters,
  FacilityAnalystTracedown3DParameters,
  FacilityAnalystTraceup3DParameters,
  FacilityAnalystUpstream3DParameters,
  FieldParameters,
  FieldStatisticsParameters,
  FilterParameter,
  FindClosestFacilitiesParameters,
  FindLocationParameters,
  FindMTSPPathsParameters,
  FindPathParameters,
  FindServiceAreasParameters,
  FindTSPPathsParameters,
  GenerateSpatialDataParameters,
  GeoCodingParameter,
  GeoDecodingParameter,
  GeoHashGridAggParameter,
  GeometryBufferAnalystParameters,
  GeometryOverlayAnalystParameters,
  GeometrySurfaceAnalystParameters,
  GeometryThiessenAnalystParameters,
  GeoRelationAnalystParameters,
  GetFeaturesByBoundsParameters,
  GetFeaturesByBufferParameters,
  GetFeaturesByGeometryParameters,
  GetFeaturesByIDsParameters,
  GetFeaturesBySQLParameters,
  GetGridCellInfosParameters,
  Grid,
  Image,
  InterpolationAnalystParameters,
  InterpolationIDWAnalystParameters,
  InterpolationKrigingAnalystParameters,
  InterpolationRBFAnalystParameters,
  JoinItem,
  KernelDensityJobParameter,
  LabelImageCell,
  LabelMatrixCell,
  LabelMixedTextStyle,
  LabelSymbolCell,
  LabelThemeCell,
  LayerStatus,
  LinkItem,
  MathExpressionAnalysisParameters,
  MeasureParameters,
  OutputSetting,
  MappingParameters,
  OverlapDisplayedOptions,
  OverlayAnalystParameters,
  OverlayGeoJobParameter,
  PointWithMeasure,
  QueryByBoundsParameters,
  QueryByDistanceParameters,
  QueryByGeometryParameters,
  QueryBySQLParameters,
  QueryParameters,
  Route,
  RouteCalculateMeasureParameters,
  RouteLocatorParameters,
  ServerColor,
  ServerFeature,
  ServerGeometry,
  ServerStyle,
  ServerTextStyle,
  ServerTheme,
  SetLayerInfoParameters,
  SetLayersInfoParameters,
  SetLayerStatusParameters,
  SingleObjectQueryJobsParameter,
  StopQueryParameters,
  SummaryAttributesJobsParameter,
  SummaryMeshJobParameter,
  SummaryRegionJobParameter,
  SupplyCenter,
  SurfaceAnalystParameters,
  SurfaceAnalystParametersSetting,
  TerrainCurvatureCalculationParameters,
  Theme,
  ThemeDotDensity,
  ThemeFlow,
  ThemeGraduatedSymbol,
  ThemeGraduatedSymbolStyle,
  ThemeGraph,
  ThemeGraphAxes,
  ThemeGraphItem,
  ThemeGraphSize,
  ThemeGraphText,
  ThemeGridRange,
  ThemeGridRangeItem,
  ThemeGridUnique,
  ThemeGridUniqueItem,
  ThemeLabel,
  ThemeLabelAlongLine,
  ThemeLabelBackground,
  ThemeLabelItem,
  ThemeLabelText,
  ThemeLabelUniqueItem,
  ThemeMemoryData,
  ThemeOffset,
  ThemeParameters,
  ThemeRange,
  ThemeRangeItem,
  ThemeUnique,
  ThemeUniqueItem,
  ThiessenAnalystParameters,
  TopologyValidatorJobsParameter,
  TransferLine,
  TransferPathParameters,
  TransferSolutionParameters,
  TransportationAnalystParameter,
  TransportationAnalystResultSetting,
  UGCLayer,
  UGCMapLayer,
  UGCSubLayer,
  UpdateEdgeWeightParameters,
  UpdateTurnNodeWeightParameters,
  Vector,
  VectorClipJobsParameter,
  WebPrintingJobCustomItems,
  WebPrintingJobImage,
  WebPrintingJobLayers,
  WebPrintingJobLegendOptions,
  WebPrintingJobLittleMapOptions,
  WebPrintingJobNorthArrowOptions,
  WebPrintingJobScaleBarOptions,
  WebPrintingJobContent,
  WebPrintingJobLayoutOptions,
  WebPrintingJobExportOptions,
  WebPrintingJobParameters,
  WebPrintingService,
  FieldsFilter,
  ImageGFAspect,
  ImageGFHillShade,
  ImageGFOrtho,
  ImageGFSlope,
  ImageSearchParameter,
  ImageRenderingRule,
  Sortby,
  ImageStretchOption,
  //components
  FileTypes,
  FileConfig,
  FileModel,
  MessageBox,
  CommonContainer,
  DropDownBox,
  Select,
  AttributesPopContainer,
  PopContainer,
  IndexTabsPageContainer,
  CityTabsPage,
  NavTabsPage,
  PaginationContainer,
  ComponentsUtil,
  FileReaderUtil,
  ChartView,
  ChartViewModel
};
export { Logo, logo, ChangeTileVersion, changeTileVersion };
export {
  CommontypesConversion,
  BaiduCRS,
  TianDiTu_WGS84CRS,
  TianDiTu_MercatorCRS,
  NonProjection,
  nonProjection,
  NonEarthCRS,
  nonEarthCRS,
  CRS,
  crs,
  toGeoJSON,
  toSuperMapGeometry,
  getMeterPerMapUnit,
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
  LeafletMapCoordSys,
  GraphicLayer,
  graphicLayer,
  GraphThemeLayer,
  graphThemeLayer,
  LabelThemeLayer,
  labelThemeLayer,
  MapVLayer,
  mapVLayer,
  RangeThemeLayer,
  rangeThemeLayer,
  RankSymbolThemeLayer,
  rankSymbolThemeLayer,
  TileVectorLayer,
  tiledVectorLayer,
  TurfLayer,
  turfLayer,
  UnicodeMarker,
  unicodeMarker,
  UniqueThemeLayer,
  uniqueThemeLayer,
  VectorTileFormat,
  CartoCSSToLeaflet,
  DefaultStyle,
  CartoStyleMap,
  ServerStyleMap,
  CompOpMap,
  ImageStyle,
  imageStyle,
  CircleStyle,
  circleStyle,
  Graphic,
  graphic,
  CloverStyle,
  cloverStyle,
  MapVRenderer,
  GeoFeatureThemeLayer,
  ThemeFeature,
  themeFeature,
  ThemeLayer,
  CanvasRenderer,
  LineSymbolizer,
  PointSymbolizer,
  RegionSymbolizer,
  SVGRenderer,
  Symbolizer,
  PolyBase,
  TextSymbolizer,
  VectorFeatureType,
  VectorGrid,
  VectorTile,
  VectorTileJSON,
  VectorTilePBF
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
