/* Copyright© 2000 - 2021 SuperMap Software Co.Ltd. All rights reserved.
 * This program are made available under the terms of the Apache License, Version 2.0
 * which accompanies this distribution and is available at http://www.apache.org/licenses/LICENSE-2.0.html.*/
import { Logo } from './control';
import { Util } from './core';
import {
  GraphThemeLayer,
  LabelThemeLayer,
  MapvLayer,
  RangeTheme3DLayer,
  RangeThemeLayer,
  RankSymbolThemeLayer,
  UniqueTheme3DLayer,
  UniqueThemeLayer,
  GraphicLayer,
  ThreeLayer,
  HeatMapLayer,
  DeckglLayer,
  GraticuleLayer,
  Graphic,
  MapvDataSet,
  getDefaultVectorTileStyle,
  setBackground,
  setPaintProperty,
  GeoFeatureThemeLayer,
  Theme3DLayer,
  ThemeFeature,
  ThemeLayer,
  Transform
} from './overlay';
import {
  AddressMatchService,
  ChartService,
  DataFlowService,
  DatasetService,
  DatasourceService,
  FeatureService,
  FieldService,
  GridCellInfosService,
  GeoprocessingService,
  LayerInfoService,
  MapService,
  MeasureService,
  NetworkAnalystService,
  NetworkAnalyst3DService,
  ProcessingService,
  QueryService,
  ServiceBase,
  SpatialAnalystService,
  ThemeService,
  TrafficTransferAnalystService,
  WebPrintingJobService,
  ImageService,
  ImageCollectionService
} from './services';

import {
  //REST
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
  RasterFunctionType,
  ResourceType,
  OrderBy,
  OrderType,
  SearchType,
  AggregationTypes,
  PermissionType,
  EntityType,
  WebExportFormatType,
  WebScaleOrientationType,
  WebScaleType,
  WebScaleUnit,
  DataItemType,
  // commontypes
  GeometryCollection,
  GeometryCurve,
  GeometryGeoText,
  GeometryLinearRing,
  GeometryLineString,
  GeometryMultiLineString,
  GeometryMultiPoint,
  GeometryMultiPolygon,
  GeometryPoint,
  GeometryPolygon,
  GeometryRectangle,
  Bounds,
  Credential,
  Event,
  Events,
  Feature,
  Geometry,
  LonLat,
  Pixel,
  Size,
  CommonUtil,
  Browser,
  FeatureVector,
  // format
  Format,
  GeoJSONFormat,
  JSONFormat,
  // control,
  TimeControlBase,
  TimeFlowControl,
  // iManager
  IManager,
  IManagerCreateNodeParam,
  IManagerServiceBase,
  // iPortal
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
  // iServer
  AggregationParameter,
  BucketAggParameter,
  MetricsAggParameter,
  AreaSolarRadiationParameters,
  BufferAnalystParameters,
  BufferDistance,
  BufferSetting,
  BuffersAnalystJobsParameter,
  BurstPipelineAnalystParameters,
  ChartQueryFilterParameter,
  ChartQueryParameters,
  ClipParameter,
  ColorDictionary,
  CommonServiceBase,
  ComputeWeightMatrixParameters,
  DataReturnOption,
  DatasetBufferAnalystParameters,
  DatasetInfo,
  DatasetOverlayAnalystParameters,
  DatasetSurfaceAnalystParameters,
  DatasetThiessenAnalystParameters,
  DatasourceConnectionInfo,
  DensityAnalystService,
  DensityKernelAnalystParameters,
  EditFeaturesParameters,
  EditFeaturesService,
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
  FindPathService,
  FindServiceAreasParameters,
  FindTSPPathsParameters,
  GenerateSpatialDataParameters,
  GeoCodingParameter,
  GeoDecodingParameter,
  GeoHashGridAggParameter,
  InterpolationDensityAnalystParameters,
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
  GetFeaturesParametersBase,
  GetFeaturesServiceBase,
  GetGridCellInfosParameters,
  Grid,
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
  NetworkAnalystServiceBase,
  OutputSetting,
  MappingParameters,
  OverlapDisplayedOptions,
  OverlayAnalystParameters,
  OverlayGeoJobParameter,
  PointWithMeasure,
  ProcessingServiceBase,
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
  SetDatasourceParameters,
  SetLayerInfoParameters,
  SetLayersInfoParameters,
  SetLayerStatusParameters,
  SingleObjectQueryJobsParameter,
  SpatialAnalystBase,
  StopQueryParameters,
  SummaryAttributesJobsParameter,
  SummaryAttributesJobsService,
  SummaryMeshJobParameter,
  SummaryRegionJobParameter,
  SupplyCenter,
  SurfaceAnalystParameters,
  SurfaceAnalystParametersSetting,
  TerrainCurvatureCalculationParameters,
  CommonTheme,
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
  TransportationAnalystParameter,
  TransportationAnalystResultSetting,
  TransferSolutionParameters,
  UGCLayer,
  UGCMapLayer,
  UGCSubLayer,
  UpdateEdgeWeightParameters,
  UpdateTurnNodeWeightParameters,
  UpdateDatasetParameters,
  CreateDatasetParameters,
  Vector,
  VectorClipJobsParameter,
  RasterFunctionParameter, 
  NDVIParameter,
  HillshadeParameter,
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
  FieldsFilter,
  ImageGFAspect,
  ImageGFHillShade,
  ImageGFOrtho,
  ImageGFSlope,
  ImageSearchParameter,
  ImageRenderingRule,
  Sortby,
  ImageStretchOption,
  // online
  Online,
  OnlineData,
  OnlineQueryDatasParameter,
  ServiceStatus,
  DataItemOrderBy,
  FilterField,
  OnlineServiceBase,
  // security
  KeyServiceParameter,
  SecurityManager,
  ServerInfo,
  TokenServiceParameter,
  // thirdparty
  ElasticSearch,
  // util
  isCORS,
  FetchRequest,
  ColorsPickerUtil,
  ArrayStatistic,
  // style
  CartoCSS,
  ThemeStyle,
  // overlay
  FeatureThemeGraph,
  FeatureThemeRankSymbol,
  FeatureThemeVector,
  FeatureShapeFactory,
  ShapeParameters,
  ShapeParametersImage,
  ShapeParametersLabel,
  ShapeParametersLine,
  ShapeParametersPolygon,
  ShapeParametersRectangle,
  ShapeParametersSector,
  FeatureTheme,
  LevelRenderer,
  // components
  MessageBox,
  CommonContainer,
  DropDownBox,
  Select,
  TemplateBase,
  AttributesPopContainer,
  PopContainer,
  IndexTabsPageContainer,
  CityTabsPage,
  NavTabsPage,
  PaginationContainer,
  FileReaderUtil,
  ChartView,
  ChartViewModel,
  // lang
  Lang
} from '@supermap/iclient-common/index';

import { INCHES_PER_UNIT, METERS_PER_INCH, DOTS_PER_INCH, IS_GECKO } from '@supermap/iclient-common/commontypes/Util';
import { WKTFormat } from '@supermap/iclient-common/format';
import { UGCImage } from '@supermap/iclient-common/iServer/Image';
import { setCORS, setRequestTimeout, getRequestTimeout } from '@supermap/iclient-common/util/FetchRequest';
import {
  FeatureThemeBar,
  FeatureThemeBar3D,
  FeatureThemeCircle,
  FeatureThemeLine,
  FeatureThemePie,
  FeatureThemePoint,
  FeatureThemeRing,
  ShapeParametersCircle,
  ShapeParametersPoint
} from '@supermap/iclient-common/overlay';
import { WebMap } from './mapping';
import mapboxgl from 'mapbox-gl';

mapboxgl.supermap = mapboxgl.supermap || {};
mapboxgl.supermap.map = mapboxgl.supermap.map || {};

mapboxgl.supermap.LogoControl = Logo;
mapboxgl.supermap.Util = Util;
mapboxgl.supermap.WebMap = WebMap;
mapboxgl.supermap.Graphic = Graphic;
mapboxgl.supermap.map.getDefaultVectorTileStyle = getDefaultVectorTileStyle;
mapboxgl.supermap.map.setBackground = setBackground;
mapboxgl.supermap.map.setPaintProperty = setPaintProperty;
mapboxgl.supermap.MapvDataSet = MapvDataSet;
mapboxgl.supermap.GeoFeatureThemeLayer = GeoFeatureThemeLayer;
mapboxgl.supermap.Theme3DLayer = Theme3DLayer;
mapboxgl.supermap.ThemeFeature = ThemeFeature;
mapboxgl.supermap.ThemeLayer = ThemeLayer;
mapboxgl.supermap.Transform = Transform;
mapboxgl.supermap.DeckglLayer = DeckglLayer;
mapboxgl.supermap.GraphicLayer = GraphicLayer;
mapboxgl.supermap.GraphThemeLayer = GraphThemeLayer;
mapboxgl.supermap.GraticuleLayer = GraticuleLayer;
mapboxgl.supermap.HeatMapLayer = HeatMapLayer;
mapboxgl.supermap.LabelThemeLayer = LabelThemeLayer;
mapboxgl.supermap.MapvLayer = MapvLayer;
mapboxgl.supermap.RangeTheme3DLayer = RangeTheme3DLayer;
mapboxgl.supermap.RangeThemeLayer = RangeThemeLayer;
mapboxgl.supermap.RankSymbolThemeLayer = RankSymbolThemeLayer;
mapboxgl.supermap.ThreeLayer = ThreeLayer;
mapboxgl.supermap.UniqueTheme3DLayer = UniqueTheme3DLayer;
mapboxgl.supermap.UniqueThemeLayer = UniqueThemeLayer;
mapboxgl.supermap.AddressMatchService = AddressMatchService;
mapboxgl.supermap.ChartService = ChartService;
mapboxgl.supermap.DataFlowService = DataFlowService;
mapboxgl.supermap.DatasetService = DatasetService;
mapboxgl.supermap.DatasourceService = DatasourceService;
mapboxgl.supermap.FeatureService = FeatureService;
mapboxgl.supermap.FieldService = FieldService;
mapboxgl.supermap.GeoprocessingService = GeoprocessingService;
mapboxgl.supermap.GridCellInfosService = GridCellInfosService;
mapboxgl.supermap.ImageCollectionService = ImageCollectionService;
mapboxgl.supermap.ImageService = ImageService;
mapboxgl.supermap.LayerInfoService = LayerInfoService;
mapboxgl.supermap.MapService = MapService;
mapboxgl.supermap.MeasureService = MeasureService;
mapboxgl.supermap.NetworkAnalyst3DService = NetworkAnalyst3DService;
mapboxgl.supermap.NetworkAnalystService = NetworkAnalystService;
mapboxgl.supermap.ProcessingService = ProcessingService;
mapboxgl.supermap.QueryService = QueryService;
mapboxgl.supermap.ServiceBase = ServiceBase;
mapboxgl.supermap.SpatialAnalystService = SpatialAnalystService;
mapboxgl.supermap.ThemeService = ThemeService;
mapboxgl.supermap.TrafficTransferAnalystService = TrafficTransferAnalystService;
mapboxgl.supermap.WebPrintingJobService = WebPrintingJobService;

// 挂载common中SuperMap上所有的内容
// Lang
mapboxgl.supermap.Lang = Lang;
mapboxgl.supermap.i18n = mapboxgl.supermap.Lang.i18n;
// CommonUtil
mapboxgl.supermap.CommonUtil = CommonUtil || {};
mapboxgl.supermap.Browser = Browser;
mapboxgl.supermap.INCHES_PER_UNIT = INCHES_PER_UNIT;
mapboxgl.supermap.METERS_PER_INCH = METERS_PER_INCH;
mapboxgl.supermap.DOTS_PER_INCH = DOTS_PER_INCH;
mapboxgl.supermap.IS_GECKO = IS_GECKO;

// FetchRequest
mapboxgl.supermap.setCORS = setCORS;
mapboxgl.supermap.isCORS = isCORS;
mapboxgl.supermap.setRequestTimeout = setRequestTimeout;
mapboxgl.supermap.getRequestTimeout = getRequestTimeout;
mapboxgl.supermap.FetchRequest = FetchRequest;

// commontypes
mapboxgl.supermap.Event = Event;
mapboxgl.supermap.Bounds = Bounds;
mapboxgl.supermap.Credential = Credential;
mapboxgl.supermap.Events = Events;
mapboxgl.supermap.Feature = Feature;
mapboxgl.supermap.Geometry = Geometry;
mapboxgl.supermap.LonLat = LonLat;
mapboxgl.supermap.Pixel = Pixel;
mapboxgl.supermap.Size = Size;
mapboxgl.supermap.Feature.Vector = FeatureVector;
mapboxgl.supermap.Geometry.Collection = GeometryCollection;
mapboxgl.supermap.Geometry.Curve = GeometryCurve;
mapboxgl.supermap.Geometry.GeoText = GeometryGeoText;
mapboxgl.supermap.Geometry.LinearRing = GeometryLinearRing;
mapboxgl.supermap.Geometry.LineString = GeometryLineString;
mapboxgl.supermap.Geometry.MultiLineString = GeometryMultiLineString;
mapboxgl.supermap.Geometry.MultiPoint = GeometryMultiPoint;
mapboxgl.supermap.Geometry.MultiPolygon = GeometryMultiPolygon;
mapboxgl.supermap.Geometry.Point = GeometryPoint;
mapboxgl.supermap.Geometry.Polygon = GeometryPolygon;
mapboxgl.supermap.Geometry.Rectangle = GeometryRectangle;
// Components
mapboxgl.supermap.Components = mapboxgl.supermap.Components || {};
mapboxgl.supermap.Components.Chart = ChartView;
mapboxgl.supermap.Components.ChartViewModel = ChartViewModel;
mapboxgl.supermap.Components.MessageBox = MessageBox;
mapboxgl.supermap.Components.AttributesPopContainer = AttributesPopContainer;
mapboxgl.supermap.Components.CityTabsPage = CityTabsPage;
mapboxgl.supermap.Components.CommonContainer = CommonContainer;
mapboxgl.supermap.Components.DropDownBox = DropDownBox;
mapboxgl.supermap.Components.IndexTabsPageContainer = IndexTabsPageContainer;
mapboxgl.supermap.Components.NavTabsPage = NavTabsPage;
mapboxgl.supermap.Components.PaginationContainer = PaginationContainer;
mapboxgl.supermap.Components.PopContainer = PopContainer;
mapboxgl.supermap.Components.Select = Select;
mapboxgl.supermap.Components.TemplateBase = TemplateBase;
mapboxgl.supermap.Components.FileReaderUtil = FileReaderUtil;
// control
mapboxgl.supermap.TimeControlBase = TimeControlBase;
mapboxgl.supermap.TimeFlowControl = TimeFlowControl;
// Format
mapboxgl.supermap.Format = mapboxgl.supermap.Format || Format;
mapboxgl.supermap.Format.GeoJSON = GeoJSONFormat;
mapboxgl.supermap.Format.JSON = JSONFormat;
mapboxgl.supermap.Format.WKT = WKTFormat;
// iManager
mapboxgl.supermap.iManager = IManager;
mapboxgl.supermap.iManagerCreateNodeParam = IManagerCreateNodeParam;
mapboxgl.supermap.iManagerServiceBase = IManagerServiceBase;
// iPortal
mapboxgl.supermap.iPortal = IPortal;
mapboxgl.supermap.iPortalAddDataParam = IPortalAddDataParam;
mapboxgl.supermap.iPortalAddResourceParam = IPortalAddResourceParam;
mapboxgl.supermap.iPortalDataConnectionInfoParam = IPortalDataConnectionInfoParam;
mapboxgl.supermap.iPortalDataMetaInfoParam = IPortalDataMetaInfoParam;
mapboxgl.supermap.iPortalDataStoreInfoParam = IPortalDataStoreInfoParam;
mapboxgl.supermap.iPortalQueryParam = IPortalQueryParam;
mapboxgl.supermap.iPortalQueryResult = IPortalQueryResult;
mapboxgl.supermap.iPortalRegisterServiceParam = IPortalRegisterServiceParam;
mapboxgl.supermap.iPortalResource = IPortalResource;
mapboxgl.supermap.iPortalServiceBase = IPortalServiceBase;
mapboxgl.supermap.iPortalShareEntity = IPortalShareEntity;
mapboxgl.supermap.iPortalShareParam = IPortalShareParam;
mapboxgl.supermap.iPortalUser = IPortalUser;
// iServer
mapboxgl.supermap.AggregationParameter = AggregationParameter;
mapboxgl.supermap.AreaSolarRadiationParameters = AreaSolarRadiationParameters;
mapboxgl.supermap.BucketAggParameter = BucketAggParameter;
mapboxgl.supermap.BufferAnalystParameters = BufferAnalystParameters;
mapboxgl.supermap.BufferDistance = BufferDistance;
mapboxgl.supermap.BuffersAnalystJobsParameter = BuffersAnalystJobsParameter;
mapboxgl.supermap.BufferSetting = BufferSetting;
mapboxgl.supermap.BurstPipelineAnalystParameters = BurstPipelineAnalystParameters;
mapboxgl.supermap.ChartQueryFilterParameter = ChartQueryFilterParameter;
mapboxgl.supermap.ChartQueryParameters = ChartQueryParameters;
mapboxgl.supermap.ClipParameter = ClipParameter;
mapboxgl.supermap.ColorDictionary = ColorDictionary;
mapboxgl.supermap.CommonServiceBase = CommonServiceBase;
mapboxgl.supermap.ComputeWeightMatrixParameters = ComputeWeightMatrixParameters;
mapboxgl.supermap.CreateDatasetParameters = CreateDatasetParameters;
mapboxgl.supermap.DataReturnOption = DataReturnOption;
mapboxgl.supermap.DatasetBufferAnalystParameters = DatasetBufferAnalystParameters;
mapboxgl.supermap.DatasetInfo = DatasetInfo;
mapboxgl.supermap.DatasetOverlayAnalystParameters = DatasetOverlayAnalystParameters;
mapboxgl.supermap.DatasetSurfaceAnalystParameters = DatasetSurfaceAnalystParameters;
mapboxgl.supermap.DatasetThiessenAnalystParameters = DatasetThiessenAnalystParameters;
mapboxgl.supermap.DatasourceConnectionInfo = DatasourceConnectionInfo;
mapboxgl.supermap.DensityAnalystService = DensityAnalystService;
mapboxgl.supermap.DensityKernelAnalystParameters = DensityKernelAnalystParameters;
mapboxgl.supermap.EditFeaturesParameters = EditFeaturesParameters;
mapboxgl.supermap.EditFeaturesService = EditFeaturesService;
mapboxgl.supermap.FacilityAnalyst3DParameters = FacilityAnalyst3DParameters;
mapboxgl.supermap.FacilityAnalystSinks3DParameters = FacilityAnalystSinks3DParameters;
mapboxgl.supermap.FacilityAnalystSources3DParameters = FacilityAnalystSources3DParameters;
mapboxgl.supermap.FacilityAnalystStreamParameters = FacilityAnalystStreamParameters;
mapboxgl.supermap.FacilityAnalystTracedown3DParameters = FacilityAnalystTracedown3DParameters;
mapboxgl.supermap.FacilityAnalystTraceup3DParameters = FacilityAnalystTraceup3DParameters;
mapboxgl.supermap.FacilityAnalystUpstream3DParameters = FacilityAnalystUpstream3DParameters;
mapboxgl.supermap.FieldParameters = FieldParameters;
mapboxgl.supermap.FieldsFilter = FieldsFilter;
mapboxgl.supermap.FieldStatisticsParameters = FieldStatisticsParameters;
mapboxgl.supermap.FilterParameter = FilterParameter;
mapboxgl.supermap.FindClosestFacilitiesParameters = FindClosestFacilitiesParameters;
mapboxgl.supermap.FindLocationParameters = FindLocationParameters;
mapboxgl.supermap.FindMTSPPathsParameters = FindMTSPPathsParameters;
mapboxgl.supermap.FindPathParameters = FindPathParameters;
mapboxgl.supermap.FindPathService = FindPathService;
mapboxgl.supermap.FindServiceAreasParameters = FindServiceAreasParameters;
mapboxgl.supermap.FindTSPPathsParameters = FindTSPPathsParameters;
mapboxgl.supermap.GenerateSpatialDataParameters = GenerateSpatialDataParameters;
mapboxgl.supermap.GeoCodingParameter = GeoCodingParameter;
mapboxgl.supermap.GeoDecodingParameter = GeoDecodingParameter;
mapboxgl.supermap.GeoHashGridAggParameter = GeoHashGridAggParameter;
mapboxgl.supermap.GeometryBufferAnalystParameters = GeometryBufferAnalystParameters;
mapboxgl.supermap.GeometryOverlayAnalystParameters = GeometryOverlayAnalystParameters;
mapboxgl.supermap.GeometrySurfaceAnalystParameters = GeometrySurfaceAnalystParameters;
mapboxgl.supermap.GeometryThiessenAnalystParameters = GeometryThiessenAnalystParameters;
mapboxgl.supermap.GeoRelationAnalystParameters = GeoRelationAnalystParameters;
mapboxgl.supermap.GetFeaturesByBoundsParameters = GetFeaturesByBoundsParameters;
mapboxgl.supermap.GetFeaturesByBufferParameters = GetFeaturesByBufferParameters;
mapboxgl.supermap.GetFeaturesByGeometryParameters = GetFeaturesByGeometryParameters;
mapboxgl.supermap.GetFeaturesByIDsParameters = GetFeaturesByIDsParameters;
mapboxgl.supermap.GetFeaturesBySQLParameters = GetFeaturesBySQLParameters;
mapboxgl.supermap.GetFeaturesParametersBase = GetFeaturesParametersBase;
mapboxgl.supermap.GetFeaturesServiceBase = GetFeaturesServiceBase;
mapboxgl.supermap.GetGridCellInfosParameters = GetGridCellInfosParameters;
mapboxgl.supermap.Grid = Grid;
mapboxgl.supermap.HillshadeParameter = HillshadeParameter;
mapboxgl.supermap.Image = UGCImage;// 别名
mapboxgl.supermap.ImageGFAspect = ImageGFAspect;
mapboxgl.supermap.ImageGFHillShade = ImageGFHillShade;
mapboxgl.supermap.ImageGFOrtho = ImageGFOrtho;
mapboxgl.supermap.ImageGFSlope = ImageGFSlope;
mapboxgl.supermap.ImageRenderingRule = ImageRenderingRule;
mapboxgl.supermap.ImageSearchParameter = ImageSearchParameter;
mapboxgl.supermap.ImageStretchOption = ImageStretchOption;
mapboxgl.supermap.InterpolationAnalystParameters = InterpolationAnalystParameters;
mapboxgl.supermap.InterpolationDensityAnalystParameters = InterpolationDensityAnalystParameters;
mapboxgl.supermap.InterpolationIDWAnalystParameters = InterpolationIDWAnalystParameters;
mapboxgl.supermap.InterpolationKrigingAnalystParameters = InterpolationKrigingAnalystParameters;
mapboxgl.supermap.InterpolationRBFAnalystParameters = InterpolationRBFAnalystParameters;
mapboxgl.supermap.JoinItem = JoinItem;
mapboxgl.supermap.KernelDensityJobParameter = KernelDensityJobParameter;
mapboxgl.supermap.LabelImageCell = LabelImageCell;
mapboxgl.supermap.LabelMatrixCell = LabelMatrixCell;
mapboxgl.supermap.LabelMixedTextStyle = LabelMixedTextStyle;
mapboxgl.supermap.LabelSymbolCell = LabelSymbolCell;
mapboxgl.supermap.LabelThemeCell = LabelThemeCell;
mapboxgl.supermap.LayerStatus = LayerStatus;
mapboxgl.supermap.LinkItem = LinkItem;
mapboxgl.supermap.MappingParameters = MappingParameters;
mapboxgl.supermap.MathExpressionAnalysisParameters = MathExpressionAnalysisParameters;
mapboxgl.supermap.MeasureParameters = MeasureParameters;
mapboxgl.supermap.MetricsAggParameter = MetricsAggParameter;
mapboxgl.supermap.NDVIParameter = NDVIParameter;
mapboxgl.supermap.NetworkAnalystServiceBase = NetworkAnalystServiceBase;
mapboxgl.supermap.OutputSetting = OutputSetting;
mapboxgl.supermap.OverlapDisplayedOptions = OverlapDisplayedOptions;
mapboxgl.supermap.OverlayAnalystParameters = OverlayAnalystParameters;
mapboxgl.supermap.OverlayGeoJobParameter = OverlayGeoJobParameter;
mapboxgl.supermap.PointWithMeasure = PointWithMeasure;
mapboxgl.supermap.ProcessingServiceBase = ProcessingServiceBase;
mapboxgl.supermap.QueryByBoundsParameters = QueryByBoundsParameters;
mapboxgl.supermap.QueryByDistanceParameters = QueryByDistanceParameters;
mapboxgl.supermap.QueryByGeometryParameters = QueryByGeometryParameters;
mapboxgl.supermap.QueryBySQLParameters = QueryBySQLParameters;
mapboxgl.supermap.QueryParameters = QueryParameters;
mapboxgl.supermap.RasterFunctionParameter = RasterFunctionParameter;
mapboxgl.supermap.Route = Route;
mapboxgl.supermap.RouteCalculateMeasureParameters = RouteCalculateMeasureParameters;
mapboxgl.supermap.RouteLocatorParameters = RouteLocatorParameters;
mapboxgl.supermap.ServerColor = ServerColor;
mapboxgl.supermap.ServerFeature = ServerFeature;
mapboxgl.supermap.ServerGeometry = ServerGeometry;
mapboxgl.supermap.ServerStyle = ServerStyle;
mapboxgl.supermap.ServerTextStyle = ServerTextStyle;
mapboxgl.supermap.ServerTheme = ServerTheme;
mapboxgl.supermap.SetDatasourceParameters = SetDatasourceParameters;
mapboxgl.supermap.SetLayerInfoParameters = SetLayerInfoParameters;
mapboxgl.supermap.SetLayersInfoParameters = SetLayersInfoParameters;
mapboxgl.supermap.SetLayerStatusParameters = SetLayerStatusParameters;
mapboxgl.supermap.SingleObjectQueryJobsParameter = SingleObjectQueryJobsParameter;
mapboxgl.supermap.Sortby = Sortby;
mapboxgl.supermap.SpatialAnalystBase = SpatialAnalystBase;
mapboxgl.supermap.StopQueryParameters = StopQueryParameters;
mapboxgl.supermap.SummaryAttributesJobsParameter = SummaryAttributesJobsParameter;
mapboxgl.supermap.SummaryAttributesJobsService = SummaryAttributesJobsService;
mapboxgl.supermap.SummaryMeshJobParameter = SummaryMeshJobParameter;
mapboxgl.supermap.SummaryRegionJobParameter = SummaryRegionJobParameter;
mapboxgl.supermap.SupplyCenter = SupplyCenter;
mapboxgl.supermap.SurfaceAnalystParameters = SurfaceAnalystParameters;
mapboxgl.supermap.SurfaceAnalystParametersSetting = SurfaceAnalystParametersSetting;
mapboxgl.supermap.TerrainCurvatureCalculationParameters = TerrainCurvatureCalculationParameters;
mapboxgl.supermap.Theme = CommonTheme;
mapboxgl.supermap.ThemeDotDensity = ThemeDotDensity;
mapboxgl.supermap.ThemeFlow = ThemeFlow;
mapboxgl.supermap.ThemeGraduatedSymbol = ThemeGraduatedSymbol;
mapboxgl.supermap.ThemeGraduatedSymbolStyle = ThemeGraduatedSymbolStyle;
mapboxgl.supermap.ThemeGraph = ThemeGraph;
mapboxgl.supermap.ThemeGraphAxes = ThemeGraphAxes;
mapboxgl.supermap.ThemeGraphItem = ThemeGraphItem;
mapboxgl.supermap.ThemeGraphSize = ThemeGraphSize;
mapboxgl.supermap.ThemeGraphText = ThemeGraphText;
mapboxgl.supermap.ThemeGridRange = ThemeGridRange;
mapboxgl.supermap.ThemeGridRangeItem = ThemeGridRangeItem;
mapboxgl.supermap.ThemeGridUnique = ThemeGridUnique;
mapboxgl.supermap.ThemeGridUniqueItem = ThemeGridUniqueItem;
mapboxgl.supermap.ThemeLabel = ThemeLabel;
mapboxgl.supermap.ThemeLabelAlongLine = ThemeLabelAlongLine;
mapboxgl.supermap.ThemeLabelBackground = ThemeLabelBackground;
mapboxgl.supermap.ThemeLabelItem = ThemeLabelItem;
mapboxgl.supermap.ThemeLabelText = ThemeLabelText;
mapboxgl.supermap.ThemeLabelUniqueItem = ThemeLabelUniqueItem;
mapboxgl.supermap.ThemeMemoryData = ThemeMemoryData;
mapboxgl.supermap.ThemeOffset = ThemeOffset;
mapboxgl.supermap.ThemeParameters = ThemeParameters;
mapboxgl.supermap.ThemeRange = ThemeRange;
mapboxgl.supermap.ThemeRangeItem = ThemeRangeItem;
mapboxgl.supermap.ThemeUnique = ThemeUnique;
mapboxgl.supermap.ThemeUniqueItem = ThemeUniqueItem;
mapboxgl.supermap.ThiessenAnalystParameters = ThiessenAnalystParameters;
mapboxgl.supermap.TopologyValidatorJobsParameter = TopologyValidatorJobsParameter;
mapboxgl.supermap.TransferLine = TransferLine;
mapboxgl.supermap.TransferPathParameters = TransferPathParameters;
mapboxgl.supermap.TransferSolutionParameters = TransferSolutionParameters;
mapboxgl.supermap.TransportationAnalystParameter = TransportationAnalystParameter;
mapboxgl.supermap.TransportationAnalystResultSetting = TransportationAnalystResultSetting;
mapboxgl.supermap.UGCLayer = UGCLayer;
mapboxgl.supermap.UGCMapLayer = UGCMapLayer;
mapboxgl.supermap.UGCSubLayer = UGCSubLayer;
mapboxgl.supermap.UpdateDatasetParameters = UpdateDatasetParameters;
mapboxgl.supermap.UpdateEdgeWeightParameters = UpdateEdgeWeightParameters;
mapboxgl.supermap.UpdateTurnNodeWeightParameters = UpdateTurnNodeWeightParameters;
mapboxgl.supermap.Vector = Vector;
mapboxgl.supermap.VectorClipJobsParameter = VectorClipJobsParameter;
mapboxgl.supermap.WebPrintingJobContent = WebPrintingJobContent;
mapboxgl.supermap.WebPrintingJobCustomItems = WebPrintingJobCustomItems;
mapboxgl.supermap.WebPrintingJobExportOptions = WebPrintingJobExportOptions;
mapboxgl.supermap.WebPrintingJobImage = WebPrintingJobImage;
mapboxgl.supermap.WebPrintingJobLayers = WebPrintingJobLayers;
mapboxgl.supermap.WebPrintingJobLayoutOptions = WebPrintingJobLayoutOptions;
mapboxgl.supermap.WebPrintingJobLegendOptions = WebPrintingJobLegendOptions;
mapboxgl.supermap.WebPrintingJobLittleMapOptions = WebPrintingJobLittleMapOptions;
mapboxgl.supermap.WebPrintingJobNorthArrowOptions = WebPrintingJobNorthArrowOptions;
mapboxgl.supermap.WebPrintingJobParameters = WebPrintingJobParameters;
mapboxgl.supermap.WebPrintingJobScaleBarOptions = WebPrintingJobScaleBarOptions;
//Online
mapboxgl.supermap.Online = Online;
mapboxgl.supermap.OnlineData = OnlineData;
mapboxgl.supermap.OnlineQueryDatasParameter = OnlineQueryDatasParameter;
mapboxgl.supermap.ServiceStatus = ServiceStatus;
// 包含online中的DataItemType数据类型
mapboxgl.supermap.DataItemType = DataItemType;
mapboxgl.supermap.DataItemOrderBy = DataItemOrderBy;
mapboxgl.supermap.FilterField = FilterField;
mapboxgl.supermap.OnlineServiceBase = OnlineServiceBase;
// overlay
mapboxgl.supermap.Feature = mapboxgl.supermap.Feature || {};
mapboxgl.supermap.Feature.Theme = FeatureTheme;
mapboxgl.supermap.Feature.Theme.Bar = FeatureThemeBar;
mapboxgl.supermap.Feature.Theme.Bar3D = FeatureThemeBar3D;
mapboxgl.supermap.Feature.Theme.Circle = FeatureThemeCircle;
mapboxgl.supermap.Feature.Theme.Graph = FeatureThemeGraph;
mapboxgl.supermap.Feature.Theme.Line = FeatureThemeLine;
mapboxgl.supermap.Feature.Theme.Pie = FeatureThemePie;
mapboxgl.supermap.Feature.Theme.Point = FeatureThemePoint;
mapboxgl.supermap.Feature.Theme.RankSymbol = FeatureThemeRankSymbol;
mapboxgl.supermap.Feature.Theme.Ring = FeatureThemeRing;
mapboxgl.supermap.Feature.Theme.ThemeVector = FeatureThemeVector;
mapboxgl.supermap.Feature.ShapeParameters = ShapeParameters;
mapboxgl.supermap.Feature.ShapeParameters.Circle = ShapeParametersCircle;
mapboxgl.supermap.Feature.ShapeParameters.Image = ShapeParametersImage;
mapboxgl.supermap.Feature.ShapeParameters.Label = ShapeParametersLabel;
mapboxgl.supermap.Feature.ShapeParameters.Line = ShapeParametersLine;
mapboxgl.supermap.Feature.ShapeParameters.Point = ShapeParametersPoint;
mapboxgl.supermap.Feature.ShapeParameters.Polygon = ShapeParametersPolygon;
mapboxgl.supermap.Feature.ShapeParameters.Rectangle = ShapeParametersRectangle;
mapboxgl.supermap.Feature.ShapeParameters.Sector = ShapeParametersSector;
mapboxgl.supermap.Feature.ShapeFactory = FeatureShapeFactory;
// LevelRenderer
mapboxgl.supermap.LevelRenderer = LevelRenderer;

// security
mapboxgl.supermap.KeyServiceParameter = KeyServiceParameter;
mapboxgl.supermap.SecurityManager = SecurityManager;
mapboxgl.supermap.ServerInfo = ServerInfo;
mapboxgl.supermap.TokenServiceParameter = TokenServiceParameter;
// style
mapboxgl.supermap.ThemeStyle = ThemeStyle;
mapboxgl.supermap.CartoCSS = CartoCSS;
// thirdparty
mapboxgl.supermap.ElasticSearch = ElasticSearch;
// util
mapboxgl.supermap.ArrayStatistic = ArrayStatistic;
mapboxgl.supermap.ColorsPickerUtil = ColorsPickerUtil;

// REST
mapboxgl.supermap.DataFormat = DataFormat;
mapboxgl.supermap.ServerType = ServerType;
mapboxgl.supermap.GeometryType = GeometryType;
mapboxgl.supermap.QueryOption = QueryOption;
mapboxgl.supermap.JoinType = JoinType;
mapboxgl.supermap.SpatialQueryMode = SpatialQueryMode;
mapboxgl.supermap.SpatialRelationType = SpatialRelationType;
mapboxgl.supermap.MeasureMode = MeasureMode;
mapboxgl.supermap.Unit = Unit;
mapboxgl.supermap.BufferRadiusUnit = BufferRadiusUnit;
mapboxgl.supermap.EngineType = EngineType;
mapboxgl.supermap.ThemeGraphTextFormat = ThemeGraphTextFormat;
mapboxgl.supermap.ThemeGraphType = ThemeGraphType;
mapboxgl.supermap.GraphAxesTextDisplayMode = GraphAxesTextDisplayMode;
mapboxgl.supermap.GraduatedMode = GraduatedMode;
mapboxgl.supermap.RangeMode = RangeMode;
mapboxgl.supermap.ThemeType = ThemeType;
mapboxgl.supermap.ColorGradientType = ColorGradientType;
mapboxgl.supermap.TextAlignment = TextAlignment;
mapboxgl.supermap.FillGradientMode = FillGradientMode;
mapboxgl.supermap.AlongLineDirection = AlongLineDirection;
mapboxgl.supermap.LabelBackShape = LabelBackShape;
mapboxgl.supermap.LabelOverLengthMode = LabelOverLengthMode;
mapboxgl.supermap.DirectionType = DirectionType;
mapboxgl.supermap.OverlayOperationType = OverlayOperationType;
mapboxgl.supermap.OutputType = OutputType;
mapboxgl.supermap.SideType = SideType;
mapboxgl.supermap.SupplyCenterType = SupplyCenterType;
mapboxgl.supermap.TurnType = TurnType;
mapboxgl.supermap.BufferEndType = BufferEndType;
mapboxgl.supermap.SmoothMethod = SmoothMethod;
mapboxgl.supermap.SurfaceAnalystMethod = SurfaceAnalystMethod;
mapboxgl.supermap.DataReturnMode = DataReturnMode;
mapboxgl.supermap.EditType = EditType;
mapboxgl.supermap.TransferTactic = TransferTactic;
mapboxgl.supermap.TransferPreference = TransferPreference;
mapboxgl.supermap.GridType = GridType;
mapboxgl.supermap.ColorSpaceType = ColorSpaceType;
mapboxgl.supermap.LayerType = LayerType;
mapboxgl.supermap.UGCLayerType = UGCLayerType;
mapboxgl.supermap.StatisticMode = StatisticMode;
mapboxgl.supermap.PixelFormat = PixelFormat;
mapboxgl.supermap.SearchMode = SearchMode;
mapboxgl.supermap.InterpolationAlgorithmType = InterpolationAlgorithmType;
mapboxgl.supermap.VariogramMode = VariogramMode;
mapboxgl.supermap.Exponent = Exponent;
mapboxgl.supermap.ClientType = ClientType;
mapboxgl.supermap.ChartType = ChartType;
mapboxgl.supermap.ClipAnalystMode = ClipAnalystMode;
mapboxgl.supermap.AnalystAreaUnit = AnalystAreaUnit;
mapboxgl.supermap.AnalystSizeUnit = AnalystSizeUnit;
mapboxgl.supermap.StatisticAnalystMode = StatisticAnalystMode;
mapboxgl.supermap.SummaryType = SummaryType;
mapboxgl.supermap.TopologyValidatorRule = TopologyValidatorRule;
mapboxgl.supermap.BucketAggType = BucketAggType;
mapboxgl.supermap.MetricsAggType = MetricsAggType;
mapboxgl.supermap.GetFeatureMode = GetFeatureMode;
mapboxgl.supermap.RasterFunctionType = RasterFunctionType;
mapboxgl.supermap.ResourceType = ResourceType;
mapboxgl.supermap.OrderBy = OrderBy;
mapboxgl.supermap.OrderType = OrderType;
mapboxgl.supermap.SearchType = SearchType;
mapboxgl.supermap.AggregationTypes = AggregationTypes;
mapboxgl.supermap.PermissionType = PermissionType;
mapboxgl.supermap.EntityType = EntityType;
mapboxgl.supermap.WebExportFormatType = WebExportFormatType;
mapboxgl.supermap.WebScaleOrientationType = WebScaleOrientationType;
mapboxgl.supermap.WebScaleType = WebScaleType;
mapboxgl.supermap.WebScaleUnit = WebScaleUnit;

export * from './index';
